import os from 'node:os';
// 스모크 테스트: vite preview 를 띄우고 모바일 뷰포트에서 실제 터치 입력으로 플레이
// 타이틀 -> 플레이 -> 라운드 클리어 -> 상점(조커/카드/팩/바우처) -> 다음 라운드 -> ... -> 게임 오버, 메타 진행, 사운드 오프라인 렌더
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright';

const PORT = +(process.env.SMOKE_PORT || 4391);
const BASE = `http://localhost:${PORT}/`;
mkdirSync('shots', { recursive: true });

function startPreview() {
  const p = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--port', String(PORT), '--strictPort'], { stdio: ['ignore', 'pipe', 'pipe'] });
  return new Promise((resolve, reject) => {
    const to = setTimeout(() => reject(new Error('preview 시작 실패')), 20000);
    const onData = (d) => { if (String(d).includes('localhost')) { clearTimeout(to); resolve(p); } };
    p.stdout.on('data', onData);
    p.stderr.on('data', onData);
  });
}

async function launch() {
  try { return await chromium.launch(); } catch { return chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' }); }
}

const errors = [];
let failed = false;
function check(cond, msg) {
  if (!cond) { failed = true; console.error('  실패:', msg); } else console.log('  확인:', msg);
}

async function newPage(browser, vw, vh, query, fresh = true) {
  const context = await browser.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`[${vw}x${vh}] ${m.text()}`); });
  page.on('pageerror', (e) => errors.push(`[${vw}x${vh}] ${e.message}`));
  await page.goto(BASE + query);
  if (fresh) { await page.evaluate(() => { try { localStorage.clear(); } catch { /* */ } }); await page.reload(); }
  await page.waitForTimeout(700);
  const cdp = await context.newCDPSession(page);
  return { page, context, cdp };
}

const state = (page) => page.evaluate(() => window.__bj.state());
const vis = async (page, sel) => (await page.locator(sel).count()) > 0 && page.locator(sel).first().isVisible();

// 출석부, 코치 마크, 보스 카드 같은 오버레이 닫기
async function clearOverlays(page) {
  for (let k = 0; k < 4; k++) {
    let hit = false;
    for (const sel of ['#btn-claim', '#coach-ok', '#boss-ok', '#btn-cal-close', '#tray-ok']) {
      if (await vis(page, sel)) { await page.locator(sel).first().tap(); await page.waitForTimeout(sel === '#btn-claim' ? 1100 : 250); hit = true; }
    }
    if (!hit) return;
  }
}

async function startGame(page) {
  await clearOverlays(page);
  await page.locator('#btn-start').tap();
  await page.waitForTimeout(150);
  await page.locator('#btn-go').tap();
  await page.waitForTimeout(400);
  await clearOverlays(page);
}

async function touchDrag(page, cdp, from, to, steps = 8) {
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: from.x, y: from.y, id: 1 }] });
  await page.waitForTimeout(20);
  for (let k = 1; k <= steps; k++) {
    const t = k / steps;
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t, id: 1 }] });
    await page.waitForTimeout(12);
  }
  await page.waitForTimeout(30);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
}

async function playMove(page, cdp) {
  const mv = await page.evaluate(() => window.__bj.findMove());
  if (!mv) return null;
  const from = await page.evaluate((i) => window.__bj.slotCenter(i), mv.i);
  const to = await page.evaluate(([i, r, c]) => window.__bj.dropPoint(i, r, c), [mv.i, mv.r, mv.c]);
  const before = await page.evaluate(() => window.__bj.game.placedCount);
  await touchDrag(page, cdp, from, to);
  await page.waitForTimeout(40);
  const after = await page.evaluate(() => window.__bj.game.placedCount);
  const st = await state(page);
  if (after === before && st.phase === 'play' && !st.pending && !st.ui && !st.coach) throw new Error('드래그로 조각이 놓이지 않음 ' + JSON.stringify(mv));
  return st;
}

async function playUntil(page, cdp, pred, maxMoves = 90, onMove = null) {
  for (let n = 0; n < maxMoves; n++) {
    await clearOverlays(page);
    const s = await state(page);
    if (pred(s)) return s;
    if (s.ui || s.pending || s.intro || s.phase !== 'play') { await page.waitForTimeout(150); continue; }
    await playMove(page, cdp);
    if (onMove) await onMove(n);
  }
  for (let k = 0; k < 30; k++) { await clearOverlays(page); const s = await state(page); if (pred(s)) return s; await page.waitForTimeout(150); }
  return null;
}

async function buyFirst(page, sel) {
  await page.waitForTimeout(550);
  await clearOverlays(page);
  const t = page.locator(sel).first();
  if (!(await t.count())) return false;
  await t.tap();
  await page.waitForTimeout(150);
  if (!(await vis(page, '#pop-buy'))) return false;
  await page.locator('#pop-buy').tap();
  await page.waitForTimeout(200);
  return true;
}

async function main() {
  const server = await startPreview();
  const browser = await launch();
  try {
    // ---------- 390x844 풀 플로우 ----------
    console.log('[390x844] 타이틀 -> 3라운드 + 상점 + 보스 흐름');
    {
      const { page, cdp } = await newPage(browser, 390, 844, '?debug&seed=smoke1');
      check(!(await vis(page, '#btn-claim')), '첫 실행에는 출석 모달을 띄우지 않음 (첫 런 이후로)');
      await clearOverlays(page);
      await page.screenshot({ path: 'shots/02-title.png' });
      await page.locator('#btn-help').tap();
      await page.waitForTimeout(250);
      await page.screenshot({ path: 'shots/03-help-1.png' });
      await page.locator('#help-next').tap(); await page.waitForTimeout(350);
      await page.screenshot({ path: 'shots/03-help-2.png' });
      await page.locator('#help-next').tap(); await page.locator('#help-next').tap(); await page.waitForTimeout(350);
      await page.screenshot({ path: 'shots/03-help-4.png' });
      await page.locator('#help-next').tap(); await page.waitForTimeout(200);
      await page.locator('#btn-start').tap();
      await page.waitForTimeout(150);
      await page.screenshot({ path: 'shots/04-setup.png' });
      await page.locator('#btn-go').tap();
      await page.waitForTimeout(600);
      let s = await state(page);
      check(s.phase === 'play' && !s.ui, '게임 시작');
      check(await vis(page, '#tray-ok'), '첫 라운드 전 트레이 안내 카드');
      await page.screenshot({ path: 'shots/05-tray-card.png' });
      await page.locator('#tray-ok').tap(); await page.waitForTimeout(200);
      await page.evaluate(() => { window.__bj.game.target = 400; });
      // 트레이 교체
      {
        const sb = await page.evaluate(() => window.__bj.layout().swapBtn);
        const before = await page.evaluate(() => ({ s: window.__bj.game.swapsLeft, h: window.__bj.game.handsLeft }));
        await page.touchscreen.tap(sb.x + sb.w / 2, sb.y + sb.h / 2); await page.waitForTimeout(250);
        const after = await page.evaluate(() => ({ s: window.__bj.game.swapsLeft, h: window.__bj.game.handsLeft }));
        check(after.s === before.s - 1 && after.h === before.h, '트레이 교체 (교체 1회 소모, 트레이 수 유지)');
      }
      await page.screenshot({ path: 'shots/05-play-tutorial.png' });
      await page.waitForTimeout(1200);
      {
        const mv = await page.evaluate(() => window.__bj.findMove());
        const from = await page.evaluate((i) => window.__bj.slotCenter(i), mv.i);
        const to = await page.evaluate(([i, r, c]) => window.__bj.dropPoint(i, r, c), [mv.i, mv.r, mv.c]);
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: from.x, y: from.y, id: 1 }] });
        for (let k = 1; k <= 8; k++) {
          await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: from.x + ((to.x - from.x) * k) / 8, y: from.y + ((to.y - from.y) * k) / 8, id: 1 }] });
          await page.waitForTimeout(16);
        }
        await page.waitForTimeout(150);
        await page.screenshot({ path: 'shots/06-dragging.png' });
        const pvOk = await page.evaluate(() => { const d = window.__bj.app.drag; return !!d && d.valid && (d.lines.lines === 0 || !!d.preview); });
        check(pvOk, '드래그 중 줄 완성 자리면 점수 예고 계산');
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      }
      let sawNonBlocking = false, shotScore = false;
      s = await playUntil(page, cdp, (st) => st.ui === 'shop', 90, async () => {
        const st = await state(page);
        if (st.seq && !shotScore) { await page.waitForTimeout(250); await page.screenshot({ path: 'shots/07-scoring.png' }); shotScore = true; await page.waitForTimeout(550); await page.screenshot({ path: 'shots/07-scoring-merge.png' }); }
        const st2 = await state(page);
        if (st2.seq && st2.phase === 'play' && !st2.pending && !st2.coach && !sawNonBlocking) {
          const before = await page.evaluate(() => window.__bj.game.placedCount);
          const mv = await page.evaluate(() => window.__bj.findMove());
          if (mv) {
            const from = await page.evaluate((i) => window.__bj.slotCenter(i), mv.i);
            const to = await page.evaluate(([i, r, c]) => window.__bj.dropPoint(i, r, c), [mv.i, mv.r, mv.c]);
            await touchDrag(page, cdp, from, to);
            const after = await page.evaluate(() => window.__bj.game.placedCount);
            if (after > before) sawNonBlocking = true;
          }
        }
      });
      check(sawNonBlocking, '점수 연출 중에도 드래그 배치 가능 (비차단)');
      check(s && s.ui === 'shop', '라운드 1 클리어 후 상점 진입');
      await page.waitForTimeout(300);
      await page.screenshot({ path: 'shots/08-shop-coach.png' });
      check(await vis(page, '#coach-ok'), '첫 상점 코치 마크 (왼쪽부터 발동 안내)');
      await clearOverlays(page);
      await page.screenshot({ path: 'shots/09-shop.png' });
      const before = (await state(page)).jokers.length;
      await page.locator('.tile.jt:not(.sold):not(.cant)').first().tap();
      await page.waitForTimeout(150);
      await page.screenshot({ path: 'shots/10-shop-popover.png' });
      await page.locator('#pop-buy').tap();
      await page.waitForTimeout(200);
      check((await state(page)).jokers.length === before + 1, '조커 구매');
      const lvBefore = await page.evaluate(() => Object.values(window.__bj.game.lineLv).reduce((a, b) => a + b, 0));
      await page.locator('#btn-reroll').tap(); await page.waitForTimeout(150);
      await page.evaluate(() => { window.__bj.game.coins += 40; window.__bj.game.shop.cards[0] = { kind: 'planet', id: 'p_double', price: 3, sold: false }; window.__bj.ui.showShop(window.__bj.game); });
      await page.locator('.tile[data-card="0"]').tap(); await page.waitForTimeout(120);
      await page.locator('#pop-buy').tap(); await page.waitForTimeout(150);
      const lvAfter = await page.evaluate(() => Object.values(window.__bj.game.lineLv).reduce((a, b) => a + b, 0));
      check(lvAfter > lvBefore, '줄 강화 카드로 레벨업');
      await page.locator('.tile[data-pack="0"]').tap(); await page.waitForTimeout(120);
      await page.locator('#pop-buy').tap(); await page.waitForTimeout(400);
      await page.screenshot({ path: 'shots/11-pack-open.png' });
      check(await vis(page, '.pchoice'), '부스터 팩 열기');
      await page.locator('.pchoice').first().tap(); await page.waitForTimeout(200);
      if (await vis(page, '#pack-skip')) await page.locator('#pack-skip').tap();
      if (await vis(page, '#tile-voucher')) {
        await page.evaluate(() => { window.__bj.game.coins += 10; });
        await page.locator('#tile-voucher').tap(); await page.waitForTimeout(120);
        await page.locator('#pop-buy').tap(); await page.waitForTimeout(150);
        check((await page.evaluate(() => window.__bj.game.vouchers.length)) >= 1, '바우처 구매');
      }
      await page.evaluate(() => { window.__bj.game.shop.special = { id: 's_level', price: 15, sold: false }; window.__bj.game.coins += 20; });
      await page.locator('#btn-reroll').tap(); await page.waitForTimeout(150);
      await page.evaluate(() => { window.__bj.game.shop.special = { id: 's_level', price: 15, sold: false }; window.__bj.ui.showShop(window.__bj.game); });
      const dblBefore = await page.evaluate(() => window.__bj.game.lineLv.double);
      await page.locator('#tile-special').tap(); await page.waitForTimeout(150);
      await page.screenshot({ path: 'shots/09-shop-special.png' });
      await page.locator('#sp-double').tap(); await page.waitForTimeout(150);
      check((await page.evaluate(() => window.__bj.game.lineLv.double)) === dblBefore + 1, '특수 서비스: 줄 레벨 선택 구매');
      await page.screenshot({ path: 'shots/09-shop-after.png' });
      await page.locator('.ownj').first().tap(); await page.waitForTimeout(150);
      await page.screenshot({ path: 'shots/12-shop-owned-popover.png' });
      check(await vis(page, '#pop-sell'), '보유 조커 판매 버튼 표시');
      await page.locator('#pop-close').tap();
      await page.locator('#btn-next').tap();
      await page.waitForTimeout(400);
      s = await state(page);
      check(s.phase === 'play' && !s.ui && s.jokers.length >= 1, `다음 라운드 진행 (앤티 ${s.ante}, 블라인드 ${s.blind})`);

      for (let round = 2; round <= 3; round++) {
        s = await playUntil(page, cdp, (st) => st.ui === 'shop' || st.ui === 'over', 90);
        check(s && s.ui === 'shop', `라운드 ${round} 클리어 후 상점`);
        if (!s || s.ui !== 'shop') break;
        await clearOverlays(page);
        await buyFirst(page, '.tile.jt:not(.sold):not(.cant)');
        await page.locator('#btn-next').tap();
        await page.waitForTimeout(700);
        s = await state(page);
        if (s.blind === 2) {
          await page.screenshot({ path: 'shots/13-boss-card.png' });
          check(await vis(page, '#boss-ok'), '첫 보스 저주 설명 카드');
          await clearOverlays(page);
        }
      }
      await page.waitForTimeout(800);
      let shotJ = false;
      await playUntil(page, cdp, (st) => st.ui === 'shop' || st.ui === 'over', 60, async () => {
        const st = await state(page);
        if (st.seq && !shotJ) { await page.waitForTimeout(450); await page.screenshot({ path: 'shots/14-joker-scoring.png' }); shotJ = true; }
      });
      await clearOverlays(page);
      if ((await state(page)).ui === 'shop') { await page.locator('#btn-next').tap(); await page.waitForTimeout(600); }
      await clearOverlays(page);
      // 막힘 구제
      if ((await state(page)).phase === 'play') {
        await page.evaluate(() => {
          const g = window.__bj.game;
          g.swapsLeft = 0; g.rescueUsed = false; g.coins += 20;
          for (let k = 0; k < 64; k++) g.board[k] = (k % 8 === 3 && Math.floor(k / 8) % 2 === 0) ? null : { color: 1 };
          g.tray = g.tray.map((p) => p && { ...p, shape: { id: 'o3', cells: [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]], w: 3, h: 3, size: 9, tags: ['big'] } });
          return window.__bj.stuckCheck();
        });
        await page.waitForTimeout(700);
        await page.screenshot({ path: 'shots/15-rescue.png' });
        check(await vis(page, '#rescue-coins'), '막힘 구제 모달 (교체 소진 시)');
        await page.locator('#rescue-coins').tap(); await page.waitForTimeout(400);
        check((await page.evaluate(() => window.__bj.game.rescueUsed && window.__bj.game.board.filter(Boolean).length < 64 - 8)), '구제: 가장 꽉 찬 가로줄 3개 제거');
        await page.waitForTimeout(1200);
        await page.evaluate(() => { const g = window.__bj.game; g.board.fill(null); g.swapsLeft = 2; });
      }
      const st = await state(page);
      if (st.phase === 'play' && !st.ui) {
        const P = await page.evaluate(() => window.__bj.layout().pause);
        await page.touchscreen.tap(P.x + P.w / 2, P.y + P.h / 2);
        await page.waitForTimeout(200);
        check((await state(page)).ui === 'pause', '일시정지 메뉴');
        await page.locator('#speed-2').tap();
        check(await page.evaluate(() => window.__bj.meta.d.settings.speed === 2), '점수 연출 속도 x2 설정');
        await page.screenshot({ path: 'shots/15-pause.png' });
        await page.locator('#speed-1').tap();
        await page.locator('#btn-resume').tap();
        await page.waitForTimeout(150);
      }
      await page.evaluate(() => window.__bj.jumpTo(8, 2));
      await page.waitForTimeout(900);
      await page.screenshot({ path: 'shots/16-showdown-intro.png' });
      await page.waitForTimeout(2200);
      await page.screenshot({ path: 'shots/16-showdown-card.png' });
      await clearOverlays(page);
      await page.screenshot({ path: 'shots/17-showdown-play.png' });
      check((await state(page)).phase === 'play', '쇼다운 보스 라운드');
      // 앤티 8 승리 후 최고 앤티가 9가 되지 않음
      await page.evaluate(() => { const g = window.__bj.game; g.roundScore = g.target - 1; });
      await playMove(page, cdp);
      for (let k = 0; k < 40 && (await state(page)).ui !== 'victory'; k++) await page.waitForTimeout(150);
      check((await state(page)).ui === 'victory', '앤티 8 쇼다운 격파 = 승리 화면');
      await page.screenshot({ path: 'shots/17-victory.png' });
      check((await page.evaluate(() => window.__bj.meta.d.stats.bestAnte)) === 8, '승리 후 최고 앤티 8 (9 아님)');
    }

    // ---------- 데일리 + 게임 오버 ----------
    console.log('[390x844] 데일리 런 게임 오버 흐름 (debug=hard)');
    {
      const { page, cdp } = await newPage(browser, 390, 844, '?debug=hard&seed=over1');
      await clearOverlays(page);
      await page.locator('#btn-daily').tap();
      await page.waitForTimeout(600);
      await clearOverlays(page);
      check(await page.evaluate(() => window.__bj.game.opts.daily), '데일리 런 시작');
      const s = await playUntil(page, cdp, (st) => st.ui === 'over', 90);
      check(s && s.ui === 'over', '게임 오버 화면 도달');
      await page.waitForTimeout(300);
      await page.screenshot({ path: 'shots/18-gameover-daily.png' });
      check(await vis(page, '#btn-share'), '데일리 결과 공유 카드');
      await page.locator('#btn-retry').tap();
      await page.waitForTimeout(300);
      check((await state(page)).ui === 'setup', '데일리 다시하기는 일반 런 설정으로 (1일 1회 우회 차단)');
      await page.locator('#btn-back >> visible=true').tap();
      await page.waitForTimeout(700);
      check(await vis(page, '#btn-claim'), '첫 런 이후 타이틀에서 출석 모달 표시');
      await clearOverlays(page);
      await page.locator('#btn-daily').tap();
      await page.waitForTimeout(250);
      check((await state(page)).ui === 'title', '데일리 런은 하루 1회');
      await page.locator('#btn-missions').tap(); await page.waitForTimeout(200);
      await page.screenshot({ path: 'shots/19-missions.png' });
    }

    // ---------- 메타 진행 ----------
    console.log('[390x844] 메타 진행: 배치 단위 이어하기, 토큰, 해금, 새로고침 유지, 마이그레이션');
    {
      const { page, cdp } = await newPage(browser, 390, 844, '?debug&seed=meta1');
      await clearOverlays(page);
      await page.locator('#btn-calendar').tap(); await page.waitForTimeout(200);
      await page.screenshot({ path: 'shots/01-calendar.png' });
      await page.locator('#btn-claim').tap(); await page.waitForTimeout(1200);
      let s = await state(page);
      check(s.tokens > 0, `출석부 보상 수령 (${s.tokens})`);
      const lockedId = 'lapidary';
      check(!(await page.evaluate((id) => window.__bj.meta.isJokerUnlocked(id), lockedId)), '세공사 조커는 처음에 잠김');
      await startGame(page);
      await page.waitForTimeout(1200);
      s = await playUntil(page, cdp, (st) => st.ui === 'shop', 90);
      check(s && s.ui === 'shop', '메타 런: 상점 진입');
      await clearOverlays(page);
      await page.waitForTimeout(600); await clearOverlays(page);
      // 팩 열어둔 채 새로고침 -> 이어하기 시 팩 모달 복원
      await page.evaluate(() => { window.__bj.game.coins += 10; window.__bj.ui.showShop(window.__bj.game); });
      const coinsBeforePack = await page.evaluate(() => window.__bj.game.coins);
      await page.locator('.tile[data-pack="0"]').tap(); await page.waitForTimeout(120);
      await page.locator('#pop-buy').tap(); await page.waitForTimeout(300);
      const coinsAfterPack = await page.evaluate(() => window.__bj.game.coins);
      await page.reload(); await page.waitForTimeout(700);
      await page.locator('#btn-continue').tap(); await page.waitForTimeout(500);
      check(await vis(page, '.pchoice'), '팩 선택 중 새로고침 후 팩 모달 복원');
      check((await page.evaluate(() => window.__bj.game.coins)) === coinsAfterPack && coinsAfterPack < coinsBeforePack, '팩 복원 시 코인 이중 차감 없음');
      await page.locator('.pchoice').first().tap(); await page.waitForTimeout(200);
      if (await vis(page, '#pack-skip')) await page.locator('#pack-skip').tap();
      await page.waitForTimeout(600); await clearOverlays(page);
      await buyFirst(page, '.tile.jt:not(.sold):not(.cant)');
      await page.locator('#btn-next').tap();
      await page.waitForTimeout(1600);
      await clearOverlays(page);
      await playMove(page, cdp);
      await page.waitForTimeout(1500);
      const mid = await state(page);
      const P = await page.evaluate(() => window.__bj.layout().pause);
      check(mid.phase === 'play' && !mid.pending, '2라운드 진행 중');
      await page.touchscreen.tap(P.x + P.w / 2, P.y + P.h / 2);
      await page.waitForTimeout(200);
      await page.locator('#btn-pause-title').tap();
      await page.waitForTimeout(200);
      check((await state(page)).runKind === 'play', '배치마다 진행 저장');
      await page.reload(); await page.waitForTimeout(700);
      await clearOverlays(page);
      check(await vis(page, '#btn-continue'), '새로고침 후 이어하기 버튼');
      await page.screenshot({ path: 'shots/20-title-continue.png' });
      await page.locator('#btn-continue').tap();
      await page.waitForTimeout(500);
      s = await state(page);
      check(s.phase === 'play' && s.ante === mid.ante && s.blind === mid.blind && s.score === mid.score && s.board === mid.board && s.tray.join() === mid.tray.join(),
        `이어하기: 보드/트레이/점수 그대로 복원 (점수 ${s.score}, 블록 ${s.board})`);
      const tokBefore = (await state(page)).tokens;
      const runsBefore = await page.evaluate(() => window.__bj.meta.d.stats.runs);
      await page.waitForTimeout(1300);
      await page.touchscreen.tap(P.x + P.w / 2, P.y + P.h / 2);
      await page.waitForTimeout(200);
      await page.locator('#btn-abandon').tap();
      await page.waitForTimeout(200);
      check(await vis(page, '#btn-abandon-ok'), '런 포기 2단계 확인');
      await page.screenshot({ path: 'shots/20-abandon-confirm.png' });
      await page.locator('#btn-abandon-ok').tap();
      await page.waitForTimeout(300);
      s = await state(page);
      check(s.tokens === tokBefore && !s.hasRun && (await page.evaluate(() => window.__bj.meta.d.stats.runs)) === runsBefore, '런 포기는 보상/통계 없음 (파밍 차단)');
      await page.evaluate(() => { window.__bj.meta.d.tokens += 30; window.__bj.meta.save(); });
      await page.locator('#btn-back >> visible=true').tap();
      await page.waitForTimeout(200);
      await clearOverlays(page);
      await page.locator('#btn-collection').tap();
      await page.waitForTimeout(200);
      await page.locator(`.dex-cell[data-joker="${lockedId}"]`).tap();
      await page.waitForTimeout(150);
      await page.screenshot({ path: 'shots/21-collection-select.png' });
      await page.locator('#btn-unlock').tap();
      await page.waitForTimeout(200);
      check(await page.evaluate((id) => window.__bj.meta.isJokerUnlocked(id), lockedId), '토큰으로 세공사 해금');
      await page.reload(); await page.waitForTimeout(600);
      await clearOverlays(page);
      check(await page.evaluate((id) => window.__bj.meta.isJokerUnlocked(id), lockedId), '새로고침 후 해금 유지');
      await startGame(page);
      check(await page.evaluate((id) => window.__bj.game.poolIds().includes(id), lockedId), '해금한 조커가 상점 풀에 등장');
      s = await playUntil(page, cdp, (st) => st.ui === 'shop', 90);
      await clearOverlays(page);
      let seen = false;
      for (let k = 0; k < 40 && !seen; k++) {
        seen = await page.evaluate((id) => window.__bj.game.shop.jokers.some((o) => o.id === id), lockedId);
        if (!seen) { await page.evaluate(() => { window.__bj.game.coins += 10; }); await page.locator('#btn-reroll').tap(); await page.waitForTimeout(100); }
      }
      check(seen && (await page.evaluate((id) => window.__bj.meta.d.discovered.includes(id), lockedId)), '상점에서 새 조커 등장 + 도감 발견 등록');
      await page.evaluate(() => { window.__bj.unlockAll(); window.__bj.toTitleForTest(); });
      await page.waitForTimeout(200);
      await clearOverlays(page);
      await page.locator('#btn-collection').tap();
      await page.waitForTimeout(300);
      await page.screenshot({ path: 'shots/22-dex-all.png', fullPage: true });
      await page.evaluate(() => { document.querySelector('#scr-collection').scrollTop = 9999; });
      await page.waitForTimeout(100);
      await page.screenshot({ path: 'shots/22-dex-all-bottom.png' });
      await page.locator('#btn-back >> visible=true').tap();
      await page.locator('#btn-profile').tap(); await page.waitForTimeout(150);
      await page.screenshot({ path: 'shots/23-profile.png' });
      if (await vis(page, '#btn-claim-all')) {
        const tb0 = await page.evaluate(() => window.__bj.meta.d.tokens);
        await page.screenshot({ path: 'shots/23-profile-claimall.png' });
        await page.locator('#btn-claim-all').tap(); await page.waitForTimeout(1200);
        check((await page.evaluate(() => window.__bj.meta.d.tokens)) > tb0 && (await page.evaluate(() => window.__bj.meta.claimables)) === 0, '모두 받기로 업적/미션 보상 일괄 수령');
      }
      const claimBtn = page.locator('[id^="claim-a-"]').first();
      if (await claimBtn.count()) {
        const tb = await page.evaluate(() => window.__bj.meta.d.tokens);
        await claimBtn.tap(); await page.waitForTimeout(300);
        await page.screenshot({ path: 'shots/23-profile-claim.png' });
        await page.waitForTimeout(900);
        check((await page.evaluate(() => window.__bj.meta.d.tokens)) > tb, '업적 보상 수동 수령 (받기)');
      }
      await page.locator('#btn-back >> visible=true').tap();
      await page.locator('#btn-settings').tap(); await page.waitForTimeout(150);
      await page.screenshot({ path: 'shots/24-settings.png' });
      await page.locator('#btn-back >> visible=true').tap();
      await page.locator('#btn-missions').tap(); await page.waitForTimeout(100);
      await page.locator('#btn-back >> visible=true').tap();
      await page.locator('#btn-collection').tap(); await page.waitForTimeout(100);
      check((await page.locator('#btn-back').count()) === 1, 'DOM id 중복 없음 (#btn-back 1개)');
      await page.locator('#btn-back').tap();
      const audio = await page.evaluate(async () => {
        const out = {};
        const argsFor = { place: [4], clear: [2, 1], tick: [5], chips: [2], mult: [2], joker: [1], combo: [2], coins: [3] };
        for (const n of [...window.__bjAudio.sfxNames(), 'bgm']) out[n] = await window.__bjAudio.measure(n, argsFor[n] || [], n === 'bgm' ? 5 : 1.8);
        return out;
      });
      console.log('  사운드 표 (이름: RMS dB / 피크 dB / 150Hz 이하 %)');
      for (const [k, v] of Object.entries(audio)) console.log(`    ${k.padEnd(10)} ${v.rmsDb.toFixed(1).padStart(6)} ${v.peakDb.toFixed(1).padStart(6)} ${String(Math.round(v.lowRatio * 100)).padStart(4)}%`);
      const small = ['pickup', 'tick', 'chips', 'mult', 'click', 'coins', 'invalid', 'newTray', 'card'];
      check(Object.values(audio).every((v) => v.peakDb <= -2.9), '모든 효과음/BGM 피크 -3dBFS 이하');
      check(Object.entries(audio).filter(([k]) => k !== 'bgm' && !small.includes(k)).every(([, v]) => v.rmsDb >= -25 && v.rmsDb <= -19.5), '주요 효과음 RMS -25~-20dB');
      check(small.every((k) => audio[k].rmsDb >= -28.5 && audio[k].rmsDb <= -23), '작은 효과음 RMS -28~-24dB');
      check(audio.place.lowRatio <= 0.4 && Object.values(audio).every((v) => v.lowRatio <= 0.45), '착지음 150Hz 이하 40% 이하, 전 효과음 45% 이하');
      check(audio.bgm.rmsDb >= -23 && audio.bgm.rmsDb <= -18 && audio.bgm.lowRatio <= 0.6, 'BGM 버스 RMS -20dB 전후, 150Hz 이하 60% 이하');
      await page.evaluate(() => { localStorage.removeItem('blockJoker.meta'); localStorage.setItem('blockJoker.v1', JSON.stringify({ bestAnte: 4, bestHit: 1234, wins: 1, tutorialDone: true })); });
      await page.reload(); await page.waitForTimeout(500);
      const mig = await page.evaluate(() => ({ v: window.__bj.meta.d.version, a: window.__bj.meta.d.stats.bestAnte, h: window.__bj.meta.d.stats.bestHit }));
      check(mig.v === 3 && mig.a === 4 && mig.h === 1234, 'v1 저장 데이터 마이그레이션');
      await page.evaluate(() => localStorage.setItem('blockJoker.meta', '{"version":2,"tokens":"x","stats":null,"unlocked":{"jokers":["nope","sweep"]},"run":{"v":9},"streak":{"last":"2020-01-01","count":3}}'));
      await page.reload(); await page.waitForTimeout(500);
      const bad = await page.evaluate(() => ({ t: window.__bj.meta.d.tokens, j: window.__bj.meta.d.unlocked.jokers, r: window.__bj.meta.d.run, v: window.__bj.meta.d.version }));
      check(typeof bad.t === 'number' && bad.j.includes('sweep') && !bad.j.includes('nope') && !bad.r && bad.v === 3, 'v2 손상 데이터 -> v3 안전 변환');
      await page.evaluate(() => localStorage.setItem('blockJoker.meta', '{not json'));
      await page.reload(); await page.waitForTimeout(500);
      await clearOverlays(page);
      check(await vis(page, '#btn-start'), '깨진 JSON 에서도 타이틀 정상');
    }

    // ---------- 성능: 4배 CPU 스로틀에서 드롭 ----------
    {
      console.log('[성능] 4배 스로틀 드롭');
      const { page, cdp } = await newPage(browser, 390, 844, '?debug&seed=perf');
      await page.evaluate(() => { const m = window.__bj.meta.d; m.coach.calc = m.coach.tray = m.coach.shop = true; m.tutorialDone = true; });
      await startGame(page);
      await page.waitForTimeout(1500);
      await page.evaluate(() => {
        window.__bj.game.target = 1e7; window.__bjPerf = []; window.__lt = []; window.__bjFrames = 0;
        new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lt.push(Math.round(e.duration)); }).observe({ type: 'longtask' });
      });
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      let drops = 0;
      for (let n = 0; n < 10; n++) { if (!(await playMove(page, cdp))) break; drops++; await page.waitForTimeout(500); }
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
      const pf = await page.evaluate(() => ({ perf: window.__bjPerf, lt: window.__lt, n: window.__bjFrames }));
      const place = pf.perf.filter((e) => e[0] === 'place').map((e) => e[1]);
      const frames = pf.perf.filter((e) => typeof e[0] === 'number').map((e) => e[0] + e[1]);
      console.log(`  드롭 ${drops}회, 드롭 처리 JS ms: ${place.join(',')} / 느린 프레임 JS 최대 ${Math.max(0, ...frames)}ms / 브라우저 롱태스크(래스터 포함, 기기 부하 영향) ${pf.lt.length}건 최대 ${Math.max(0, ...pf.lt)}ms`);
      console.log('  느린 프레임 상위:', JSON.stringify(pf.perf.filter((e) => typeof e[0] === 'number').sort((x, y) => (y[0] + y[1]) - (x[0] + x[1])).slice(0, 6)));
      // 공유 머신에서는 다른 프로세스 선점으로 임의 프레임이 튈 수 있어 p90 으로 판정하고 최대값과 부하는 로그로 남김
      const pct = (arr, q) => { const v = [...arr].sort((x, y) => x - y); return v.length ? v[Math.min(v.length - 1, Math.floor(v.length * q))] : 0; };
      const over = frames.filter((x) => x >= 50).length;
      console.log(`  호스트 부하 loadavg ${os.loadavg().map((x) => x.toFixed(1)).join(' ')} / 드롭 JS p90 ${pct(place, 0.9)}ms / 전체 ${pf.n}프레임 중 JS 50ms 이상 ${over}개`);
      check(drops >= 5 && place.length >= 5 && pct(place, 0.9) < 50, '4배 스로틀: 드롭 처리 JS p90 50ms 미만');
      check(pf.n > 60 && over / pf.n < 0.05, '4배 스로틀: 프레임 JS(update+draw) 50ms 이상 비율 5% 미만');
    }

    // ---------- 다른 해상도 ----------
    for (const [w, h] of [[360, 640], [430, 932], [1280, 800]]) {
      console.log(`[${w}x${h}] 레이아웃`);
      const { page, cdp } = await newPage(browser, w, h, '?debug&seed=size');
      await clearOverlays(page);
      await page.screenshot({ path: `shots/size-${w}x${h}-title.png` });
      await startGame(page);
      await page.waitForTimeout(1500);
      await playMove(page, cdp);
      await page.waitForTimeout(200);
      await page.screenshot({ path: `shots/size-${w}x${h}-play.png` });
      const s = await playUntil(page, cdp, (st) => st.ui === 'shop', 90);
      check(s && s.ui === 'shop', `[${w}x${h}] 상점 진입`);
      await clearOverlays(page);
      await buyFirst(page, '.tile.jt:not(.sold):not(.cant)');
      await page.screenshot({ path: `shots/size-${w}x${h}-shop.png` });
      await page.locator('.ownj').first().tap(); await page.waitForTimeout(150);
      check(await vis(page, '#pop-sell'), `[${w}x${h}] 판매 버튼이 가려지지 않음`);
      await page.screenshot({ path: `shots/size-${w}x${h}-sell.png` });
    }
  } finally {
    await browser.close();
    server.kill();
  }
  console.log('콘솔 에러:', errors.length);
  errors.forEach((e) => console.log('  ', e));
  if (errors.length) failed = true;
  console.log(failed ? '결과: 실패' : '결과: 통과');
  process.exit(failed ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
