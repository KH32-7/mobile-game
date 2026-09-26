// 스모크 테스트: vite preview 를 띄우고 모바일 뷰포트에서 실제 터치 입력으로 플레이
// 타이틀 -> 플레이 -> 라운드 클리어 -> 상점 -> 조커 구매 -> 다음 라운드 -> ... -> 게임 오버
import { spawn } from 'node:child_process';
import { mkdirSync, existsSync } from 'node:fs';
import { chromium } from 'playwright';

const PORT = 4173;
const BASE = `http://localhost:${PORT}/`;
mkdirSync('shots', { recursive: true });

function startPreview() {
  const p = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: ['ignore', 'pipe', 'pipe'] });
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
      await page.locator('#btn-start').tap();
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
      await page.locator('#btn-start').tap();
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

    // ---------- 다른 해상도 ----------
    for (const [w, h] of [[360, 640], [430, 932], [1280, 800]]) {
      console.log(`[${w}x${h}] 레이아웃`);
      const { page, cdp } = await newPage(browser, w, h, '?debug&seed=size');
      await page.screenshot({ path: `shots/size-${w}x${h}-title.png` });
      await page.locator('#btn-start').tap();
      await page.waitForTimeout(1800);
      for (let n = 0; n < 3; n++) await playMove(page, cdp);
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
