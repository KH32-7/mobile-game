// 스모크 테스트: vite preview 를 띄우고 모바일 뷰포트에서 실제 터치 입력으로 플레이
// 타이틀 -> 플레이 -> 라운드 클리어 -> 상점 -> 조커 구매 -> 다음 라운드 -> ... -> 게임 오버
import { spawn } from 'node:child_process';
import { mkdirSync, existsSync } from 'node:fs';
import { chromium } from 'playwright';

const PORT = 4173;
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
  try {
    return await chromium.launch();
  } catch (e) {
    const exe = ['/opt/pw-browsers/chromium', '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find((p) => existsSync(p) && !p.endsWith('chromium'));
    return chromium.launch({ executablePath: exe });
  }
}

const errors = [];
let failed = false;
function check(cond, msg) {
  if (!cond) { failed = true; console.error('  실패:', msg); } else console.log('  확인:', msg);
}

async function newPage(browser, vw, vh, query) {
  const context = await browser.newContext({ viewport: { width: vw, height: vh }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`[${vw}x${vh}] ${m.text()}`); });
  page.on('pageerror', (e) => errors.push(`[${vw}x${vh}] ${e.message}`));
  await page.goto(BASE + query);
  await page.waitForTimeout(400);
  const cdp = await context.newCDPSession(page);
  return { page, context, cdp };
}

const state = (page) => page.evaluate(() => window.__bj.state());

async function startGame(page) {
  await page.locator('#btn-start').tap();
  await page.waitForTimeout(150);
  await page.locator('#btn-go').tap();
}

async function touchDrag(page, cdp, from, to, steps = 10) {
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: from.x, y: from.y, id: 1 }] });
  await page.waitForTimeout(30);
  for (let k = 1; k <= steps; k++) {
    const t = k / steps;
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t, id: 1 }] });
    await page.waitForTimeout(16);
  }
  await page.waitForTimeout(40);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
}

async function waitIdle(page, ms = 6000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    const s = await state(page);
    if (!s.locked || s.ui) return s;
    await page.waitForTimeout(60);
  }
  return state(page);
}

// 한 수 두기 (실제 터치 드래그). 반환: 상태
async function playMove(page, cdp) {
  const mv = await page.evaluate(() => window.__bj.findMove());
  if (!mv) return null;
  const from = await page.evaluate((i) => window.__bj.slotCenter(i), mv.i);
  const to = await page.evaluate(([i, r, c]) => window.__bj.dropPoint(i, r, c), [mv.i, mv.r, mv.c]);
  const before = await state(page);
  await touchDrag(page, cdp, from, to);
  await page.waitForTimeout(50);
  const after = await state(page);
  const placed = after.tray.filter(Boolean).length !== before.tray.filter(Boolean).length || after.score !== before.score || after.phase !== before.phase || after.locked;
  if (!placed) throw new Error('드래그로 조각이 놓이지 않음 ' + JSON.stringify(mv));
  return waitIdle(page);
}

async function playUntil(page, cdp, pred, maxMoves = 80, shotAt = null) {
  for (let n = 0; n < maxMoves; n++) {
    const s = await state(page);
    if (pred(s)) return s;
    if (s.ui) { await page.waitForTimeout(100); continue; }
    if (s.locked) { await waitIdle(page); continue; }
    if (s.phase !== 'play') { await page.waitForTimeout(100); continue; }
    await playMove(page, cdp);
    if (shotAt && n === shotAt.n) await page.screenshot({ path: shotAt.path });
  }
  const s = await state(page);
  return pred(s) ? s : null;
}

async function waitUi(page, id, ms = 5000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    const s = await state(page);
    if (s.ui === id) return true;
    await page.waitForTimeout(80);
  }
  return false;
}

async function main() {
  const server = await startPreview();
  const browser = await launch();
  try {
    // ---------- 390x844 풀 플로우 ----------
    console.log('[390x844] 타이틀 -> 3라운드 + 상점 흐름');
    {
      const { page, cdp } = await newPage(browser, 390, 844, '?debug&seed=smoke1');
      await page.evaluate(() => { try { localStorage.clear(); } catch {} });
      await page.reload(); await page.waitForTimeout(500);
      await page.screenshot({ path: 'shots/01-title.png' });
      check(await page.locator('#btn-start').isVisible(), '타이틀 시작 버튼 표시');
      await startGame(page);
      await page.waitForTimeout(700);
      let s = await state(page);
      check(s.phase === 'play' && !s.ui, '게임 시작');
      await page.screenshot({ path: 'shots/02-play-tutorial.png' });

      // 드래그 중 스크린샷
      {
        const mv = await page.evaluate(() => window.__bj.findMove());
        const from = await page.evaluate((i) => window.__bj.slotCenter(i), mv.i);
        const to = await page.evaluate(([i, r, c]) => window.__bj.dropPoint(i, r, c), [mv.i, mv.r, mv.c]);
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: from.x, y: from.y, id: 1 }] });
        for (let k = 1; k <= 8; k++) {
          await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: from.x + (to.x - from.x) * k / 8, y: from.y + (to.y - from.y) * k / 8, id: 1 }] });
          await page.waitForTimeout(16);
        }
        await page.waitForTimeout(150);
        await page.screenshot({ path: 'shots/03-dragging.png' });
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        await waitIdle(page);
      }

      for (let round = 1; round <= 3; round++) {
        s = await playUntil(page, cdp, (st) => st.ui === 'shop' || st.phase === 'over', 80, round === 1 ? { n: 2, path: 'shots/04-play.png' } : null);
        check(s && s.ui === 'shop', `라운드 ${round} 클리어 후 상점 진입`);
        if (!s || s.ui !== 'shop') break;
        await page.screenshot({ path: `shots/05-shop-r${round}.png` });
        const before = (await state(page)).jokers.length;
        const buy = page.locator('.btn.buy.gold').first();
        if (await buy.count()) {
          await buy.tap();
          await page.waitForTimeout(200);
          const after = await state(page);
          check(after.jokers.length === before + 1, `조커 구매 (${after.jokers.join(',')})`);
          await page.screenshot({ path: `shots/06-shop-bought-r${round}.png` });
        } else check(false, '구매 가능한 조커 없음');
        await page.locator('#btn-next').tap();
        await page.waitForTimeout(300);
        s = await state(page);
        check(s.phase === 'play' && !s.ui && s.jokers.length >= 1, `다음 라운드 진행 (앤티 ${s.ante}, 블라인드 ${s.blind})`);
        if (s.blind === 2) { await page.waitForTimeout(500); await page.screenshot({ path: 'shots/07-boss-banner.png' }); }
      }
      // 조커가 있는 상태에서 줄 제거 연출 캡처
      for (let n = 0; n < 30; n++) {
        const st = await state(page);
        if (st.phase !== 'play' || st.ui) break;
        const mv = await page.evaluate(() => window.__bj.findMove());
        if (!mv) break;
        const clears = await page.evaluate(([i, r, c]) => window.__bj.game.previewLines(window.__bj.game.tray[i], r, c).lines, [mv.i, mv.r, mv.c]);
        const from = await page.evaluate((i) => window.__bj.slotCenter(i), mv.i);
        const to = await page.evaluate(([i, r, c]) => window.__bj.dropPoint(i, r, c), [mv.i, mv.r, mv.c]);
        await touchDrag(page, cdp, from, to);
        if (clears) {
          await page.waitForTimeout(700);
          await page.screenshot({ path: 'shots/08-scoring.png' });
          break;
        }
        await waitIdle(page);
      }
      await waitIdle(page);
      // 일시정지
      const st = await state(page);
      if (st.phase === 'play' && !st.ui) {
        const L = await page.evaluate(() => { const l = window.__bj.layout(); return l.pause; });
        await page.touchscreen.tap(L.x + L.w / 2, L.y + L.h / 2);
        await page.waitForTimeout(200);
        check((await state(page)).ui === 'pause', '일시정지 메뉴 열림');
        await page.screenshot({ path: 'shots/09-pause.png' });
        await page.locator('#btn-resume').tap();
        await page.waitForTimeout(150);
        check(!(await state(page)).ui, '재개');
      }
    }

    // ---------- 게임 오버 흐름 ----------
    console.log('[390x844] 게임 오버 흐름 (debug=hard)');
    {
      const { page, cdp } = await newPage(browser, 390, 844, '?debug=hard&seed=over1');
      await startGame(page);
      await page.waitForTimeout(500);
      const s = await playUntil(page, cdp, (st) => st.ui === 'over', 60);
      if (!s) await waitUi(page, 'over');
      check((await state(page)).ui === 'over', '게임 오버 화면 도달');
      await page.screenshot({ path: 'shots/10-gameover.png' });
      await page.locator('#btn-retry').tap();
      await page.waitForTimeout(400);
      const s2 = await state(page);
      check(s2.phase === 'play' && !s2.ui, '다시하기');
    }

    // ---------- 메타 진행 ----------
    console.log('[390x844] 메타 진행: 이어하기, 토큰, 해금, 새로고침 유지, 데일리, 마이그레이션');
    {
      const { page, cdp } = await newPage(browser, 390, 844, '?debug&seed=meta1');
      await page.evaluate(() => { try { localStorage.clear(); } catch {} });
      await page.reload(); await page.waitForTimeout(600);
      let s = await state(page);
      check(s.tokens > 0, `첫 출석 보상 토큰 (${s.tokens})`);
      await page.screenshot({ path: 'shots/20-title-meta.png' });
      // 컬렉션: 잠긴 조커 확인
      await page.locator('#btn-collection').tap();
      await page.waitForTimeout(200);
      await page.screenshot({ path: 'shots/21-collection-before.png' });
      const lockedId = 'lapidary';
      check(!(await page.evaluate((id) => window.__bj.meta.isJokerUnlocked(id), lockedId)), '세공사 조커는 처음에 잠김');
      await page.locator('#btn-back >> visible=true').tap();
      // 새 게임 -> 1라운드 클리어 -> 상점 구매 -> 다음 라운드 -> 타이틀로 나가기
      await startGame(page);
      await page.waitForTimeout(600);
      s = await playUntil(page, cdp, (st) => st.ui === 'shop', 80);
      check(s && s.ui === 'shop', '메타 런: 상점 진입');
      await page.locator('.btn.buy.gold').first().tap();
      await page.waitForTimeout(150);
      await page.locator('#btn-next').tap();
      await page.waitForTimeout(400);
      await playMove(page, cdp);
      const mid = await state(page);
      check(mid.phase === 'play' && !mid.ui, '2라운드 진행 중');
      const L = await page.evaluate(() => window.__bj.layout().pause);
      await page.touchscreen.tap(L.x + L.w / 2, L.y + L.h / 2);
      await page.waitForTimeout(200);
      await page.locator('#btn-pause-title').tap();
      await page.waitForTimeout(200);
      check((await state(page)).hasRun, '런 도중 저장됨');
      // 새로고침 후 이어하기
      await page.reload(); await page.waitForTimeout(600);
      check(await page.locator('#btn-continue').isVisible(), '새로고침 후 이어하기 버튼');
      await page.screenshot({ path: 'shots/22-title-continue.png' });
      await page.locator('#btn-continue').tap();
      await page.waitForTimeout(500);
      s = await state(page);
      check(s.phase === 'play' && s.ante === mid.ante && s.blind === mid.blind && s.jokers.join() === mid.jokers.join() && s.score === 0, `이어하기: 라운드 시작 시점 복원 (앤티 ${s.ante}, 블라인드 ${s.blind}, 조커 ${s.jokers})`);
      // 포기 -> 토큰 정산
      const tokBefore = s.tokens;
      await page.touchscreen.tap(L.x + L.w / 2, L.y + L.h / 2);
      await page.waitForTimeout(200);
      await page.locator('text=포기하고 새 게임').tap();
      await page.waitForTimeout(300);
      s = await state(page);
      check(s.tokens > tokBefore && !s.hasRun, `런 종료 시 토큰 획득 (${tokBefore} -> ${s.tokens})`);
      await page.locator('#btn-back >> visible=true').tap();
      await page.waitForTimeout(200);
      // 해금
      await page.locator('#btn-collection').tap();
      await page.waitForTimeout(200);
      await page.locator(`.dex-cell[data-joker="${lockedId}"]`).tap();
      await page.waitForTimeout(150);
      await page.screenshot({ path: 'shots/23-collection-select.png' });
      await page.locator('#btn-unlock').tap();
      await page.waitForTimeout(200);
      check(await page.evaluate((id) => window.__bj.meta.isJokerUnlocked(id), lockedId), '토큰으로 세공사 해금');
      await page.screenshot({ path: 'shots/24-collection-after.png' });
      await page.locator('#tab-decks').tap();
      await page.waitForTimeout(150);
      await page.screenshot({ path: 'shots/25-collection-decks.png' });
      await page.locator('#tab-skins').tap();
      await page.waitForTimeout(150);
      await page.screenshot({ path: 'shots/26-collection-skins.png' });
      // 새로고침 후 유지
      await page.reload(); await page.waitForTimeout(600);
      check(await page.evaluate((id) => window.__bj.meta.isJokerUnlocked(id), lockedId), '새로고침 후 해금 유지');
      // 새 런에서 새 조커가 풀에 등장
      await startGame(page);
      await page.waitForTimeout(400);
      check(await page.evaluate((id) => window.__bj.game.poolIds().includes(id), lockedId), '해금한 조커가 상점 풀에 등장');
      // 상점에서 실제로 만날 때까지 리롤 (디버그 코인)
      s = await playUntil(page, cdp, (st) => st.ui === 'shop', 80);
      let seen = false;
      for (let k = 0; k < 30 && !seen; k++) {
        seen = await page.evaluate((id) => window.__bj.game.shop.some((o) => o.id === id), lockedId);
        if (!seen) { await page.evaluate(() => { window.__bj.game.coins += 10; }); await page.locator('#btn-reroll').tap(); await page.waitForTimeout(120); }
      }
      if (seen) await page.screenshot({ path: 'shots/27-shop-new-joker.png' });
      check(seen && (await page.evaluate((id) => window.__bj.meta.d.discovered.includes(id), lockedId)), '상점에서 새 조커 등장 + 도감 발견 등록');
      // 미션 / 프로필
      await page.evaluate(() => window.__bj.toTitleForTest());
      await page.waitForTimeout(200);
      await page.locator('#btn-missions').tap();
      await page.waitForTimeout(150);
      await page.screenshot({ path: 'shots/28-missions.png' });
      await page.locator('#btn-back >> visible=true').tap();
      await page.locator('#btn-profile').tap();
      await page.waitForTimeout(150);
      await page.screenshot({ path: 'shots/29-profile.png' });
      await page.locator('#btn-back >> visible=true').tap();
      // 데일리 런 1회
      await page.locator('#btn-daily').tap();
      await page.waitForTimeout(400);
      s = await state(page);
      check(s.phase === 'play' && (await page.evaluate(() => window.__bj.game.opts.daily)), '데일리 런 시작');
      await page.evaluate(() => window.__bj.toTitleForTest());
      await page.waitForTimeout(200);
      await page.locator('#btn-daily').tap();
      await page.waitForTimeout(200);
      check((await state(page)).ui === 'title', '데일리 런은 하루 1회');
      // 마이그레이션: v1 기록 + 손상된 데이터
      await page.evaluate(() => { localStorage.removeItem('blockJoker.meta'); localStorage.setItem('blockJoker.v1', JSON.stringify({ bestAnte: 4, bestHit: 1234, wins: 1, tutorialDone: true })); });
      await page.reload(); await page.waitForTimeout(500);
      const mig = await page.evaluate(() => ({ v: window.__bj.meta.d.version, a: window.__bj.meta.d.stats.bestAnte, h: window.__bj.meta.d.stats.bestHit }));
      check(mig.v === 2 && mig.a === 4 && mig.h === 1234, 'v1 저장 데이터 마이그레이션');
      await page.evaluate(() => localStorage.setItem('blockJoker.meta', '{"version":2,"tokens":"x","stats":null,"unlocked":{"jokers":["nope","sweep"]},"run":{"v":9}}'));
      await page.reload(); await page.waitForTimeout(500);
      const bad = await page.evaluate(() => ({ t: window.__bj.meta.d.tokens, j: window.__bj.meta.d.unlocked.jokers, r: window.__bj.meta.d.run }));
      check(typeof bad.t === 'number' && bad.j.includes('sweep') && !bad.j.includes('nope') && !bad.r, '손상된 저장 데이터 안전 처리');
      await page.evaluate(() => localStorage.setItem('blockJoker.meta', '{not json'));
      await page.reload(); await page.waitForTimeout(500);
      check(await page.locator('#btn-start').isVisible(), '깨진 JSON 에서도 타이틀 정상');
    }

    // ---------- 다른 해상도 ----------
    for (const [w, h] of [[360, 640], [430, 932], [1280, 800]]) {
      console.log(`[${w}x${h}] 레이아웃`);
      const { page, cdp } = await newPage(browser, w, h, '?debug&seed=size');
      await page.screenshot({ path: `shots/size-${w}x${h}-title.png` });
      await startGame(page);
      await page.waitForTimeout(1600);
      await playMove(page, cdp);
      await page.screenshot({ path: `shots/size-${w}x${h}-play.png` });
      const s = await playUntil(page, cdp, (st) => st.ui === 'shop', 60);
      check(s && s.ui === 'shop', `[${w}x${h}] 상점 진입`);
      await page.locator('.btn.buy.gold').first().tap().catch(() => {});
      await page.waitForTimeout(200);
      await page.screenshot({ path: `shots/size-${w}x${h}-shop.png` });
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
