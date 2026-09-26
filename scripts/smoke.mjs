// 스모크 테스트: npm run build 후 실행. vite preview 를 띄우고 모바일 뷰포트에서
// 타이틀 → 플레이(스와이프 입력) → 게이트 인원 변화 → 게임오버 까지 확인하고 shots/ 에 스크린샷 저장
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';

const PORT = 4179;
const BASE = `http://localhost:${PORT}/`;
const W = +(process.env.W || 390), H = +(process.env.H || 844);
mkdirSync('shots', { recursive: true });

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
let ready = false;
server.stdout.on('data', (d) => { if (String(d).includes('localhost')) ready = true; });
for (let i = 0; i < 100 && !ready; i++) await sleep(100);

const executablePath = process.env.CHROMIUM || '/opt/pw-browsers/chromium';
const browser = await chromium.launch({ executablePath, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required'] });
const errors = [];
const results = [];
const check = (name, ok, info = '') => { results.push({ name, ok, info }); console.log(`${ok ? 'PASS' : 'FAIL'} ${name} ${info}`); };

async function newPage(query = '') {
  const ctx = await browser.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(BASE + query);
  await page.waitForFunction(() => window.__game);
  const cdp = await ctx.newCDPSession(page);
  return { ctx, page, cdp };
}

async function tap(cdp, x, y) {
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
  await sleep(40);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
}

async function swipe(cdp, dir) {
  const cx = W / 2, cy = H * 0.6;
  const d = { left: [-110, 0], right: [110, 0], up: [0, -130], down: [0, 130] }[dir];
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: cx, y: cy }] });
  for (let i = 1; i <= 4; i++) {
    await sleep(12);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: cx + (d[0] * i) / 4, y: cy + (d[1] * i) / 4 }] });
  }
  await sleep(12);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
}

async function clickSel(page, cdp, sel) {
  await page.locator(sel).evaluate((el) => el.scrollIntoView({ block: 'center' }));
  const b = await page.locator(sel).boundingBox();
  if (!b) throw new Error('no element ' + sel);
  await tap(cdp, b.x + b.width / 2, b.y + b.height / 2);
}

const G = (page, fn) => page.evaluate(fn);

try {
  // ---------- 1. 기본 플레이 (튜토리얼 + 스와이프 입력) ----------
  {
    const { ctx, page, cdp } = await newPage('?seed=7&debug&god');
    await sleep(1500);
    await page.screenshot({ path: 'shots/01-title.png' });
    check('타이틀 표시', await page.locator('#title').isVisible());

    // 업그레이드/미션 패널
    await clickSel(page, cdp, '#tShop');
    await sleep(300);
    await page.screenshot({ path: 'shots/02-shop.png' });
    await clickSel(page, cdp, '#shopP [data-close]');
    await clickSel(page, cdp, '#tMis');
    await sleep(300);
    await page.screenshot({ path: 'shots/03-missions.png' });
    await clickSel(page, cdp, '#misP [data-close]');

    await clickSel(page, cdp, '#tStart');
    await sleep(600);
    check('플레이 시작', (await G(page, () => window.__game.state)) === 'play');
    await page.screenshot({ path: 'shots/04-play-tutorial.png' });
    // 일시정지 메뉴
    await clickSel(page, cdp, '#pauseBtn');
    await sleep(300);
    check('일시정지', (await G(page, () => window.__game.state)) === 'pause');
    await page.screenshot({ path: 'shots/08-pause.png' });
    await clickSel(page, cdp, '#pResume');
    await sleep(200);
    check('재개', (await G(page, () => window.__game.state)) === 'play');


    const lane0 = await G(page, () => window.__game.lane);
    await swipe(cdp, 'left');
    await sleep(500);
    const lane1 = await G(page, () => window.__game.lane);
    check('스와이프 왼쪽 → 레인 이동', lane1 === lane0 - 1, `${lane0}->${lane1}`);
    const lx = await G(page, () => window.__game.swarm.leader.x);
    check('리더 x 이동', lx < -1, lx.toFixed(2));
    await swipe(cdp, 'right');
    await sleep(300);
    check('스와이프 오른쪽 → 레인 복귀', (await G(page, () => window.__game.lane)) === lane0);

    await swipe(cdp, 'up');
    await page.screenshot({ path: 'shots/05-jump-wave.png' });
    const jy = await G(page, () => window.__game.dbg.maxY);
    check('스와이프 위 → 점프', jy > 0.5, `최고 y=${jy.toFixed(2)}`);
    await sleep(700);
    await swipe(cdp, 'down');
    await page.screenshot({ path: 'shots/06-slide.png' });
    const hw = await G(page, () => window.__game.dbg.minHW);
    check('스와이프 아래 → 슬라이드 (무리 폭 축소)', hw <= 0.8, `폭=${hw}`);
    check('튜토리얼 완료 저장', await G(page, () => JSON.parse(localStorage.getItem('swarm-surfers-v1')).tutorialDone === true));

    // 게이트 통과로 인원 변화 기다리기
    let gates = [];
    for (let i = 0; i < 80 && !gates.length; i++) {
      await sleep(250);
      gates = await G(page, () => window.__game.dbg.gates);
    }
    check('게이트 통과로 인원 변화', gates.length > 0 && gates[0].before !== gates[0].after, JSON.stringify(gates[0]));
    await page.screenshot({ path: 'shots/07-after-gate.png' });

    // 무적 해제 후 입력 없이 계속 달리면 결국 게임 오버
    await G(page, () => { window.__game.opts.god = false; });
    let st = 'play';
    for (let i = 0; i < 400 && st !== 'over'; i++) {
      await sleep(250);
      st = await G(page, () => window.__game.state);
      if (i === 20) await page.screenshot({ path: 'shots/09-running.png' });
    }
    check('게임 오버 도달', st === 'over');
    await sleep(500);
    await page.screenshot({ path: 'shots/10-gameover.png' });
    await clickSel(page, cdp, '#oRetry');
    await sleep(500);
    check('다시 하기', (await G(page, () => window.__game.state)) === 'play');
    await ctx.close();
  }

  // ---------- 2. 적 무리 / 요새 → 재화 획득 → 부활 → 해금/업그레이드 → 새로고침 후 유지 ----------
  {
    const { ctx, page, cdp } = await newPage('?seed=3&debug&god&start=820&count=120&fast=2&chunks=enemySmall,gate3');
    await clickSel(page, cdp, '#tStart');
    let shotBattle = false, shotSiege = false, broke = false;
    for (let i = 0; i < 400 && !broke; i++) {
      await sleep(150);
      const s = await G(page, () => ({ m: window.__game.mode, f: window.__game.forts, d: window.__game.dist }));
      if (s.m === 'battle' && !shotBattle) { shotBattle = true; await page.screenshot({ path: 'shots/11-battle.png' }); }
      if (s.m === 'siege' && !shotSiege) { await sleep(600); shotSiege = true; await page.screenshot({ path: 'shots/12-siege.png' }); }
      if (s.f > 0) broke = true;
    }
    check('적 무리 전투 발생', shotBattle);
    check('요새 격파', broke);
    await sleep(250);
    await page.screenshot({ path: 'shots/13-fortress-break.png' });
    const gems = await G(page, () => JSON.parse(localStorage.getItem('swarm-surfers-v1')).gems);
    check('요새 격파로 보석 획득', gems >= 1, `보석 ${gems}`);
    await sleep(2500);
    check('다음 구간 테마', (await G(page, () => window.__game.section)) === 1);
    check('새 테마 해금 저장', await G(page, () => JSON.parse(localStorage.getItem('swarm-surfers-v1')).themes.unlocked.includes(1)));
    await page.screenshot({ path: 'shots/14-desert.png' });

    // 무적 해제 후 전멸 → 부활 제안
    await G(page, () => { window.__game.opts.god = false; });
    let st = 'play';
    for (let i = 0; i < 400 && st === 'play'; i++) { await sleep(200); st = await G(page, () => window.__game.state); }
    check('보석이 있으면 부활 제안', st === 'revive', st);
    await page.screenshot({ path: 'shots/15-revive.png' });
    if (st === 'revive') {
      await clickSel(page, cdp, '#rvYes');
      await sleep(300);
      const r = await G(page, () => ({ st: window.__game.state, c: window.__game.swarm.count }));
      check('부활 후 10명으로 재개', r.st === 'play' && r.c === 10, JSON.stringify(r));
      for (let i = 0; i < 400 && st !== 'over'; i++) { await sleep(200); st = await G(page, () => window.__game.state); }
      check('두 번째 전멸은 결과 화면', st === 'over');
    }
    await sleep(400);
    await page.screenshot({ path: 'shots/16-result-meta.png' });
    await clickSel(page, cdp, '#oTitle');
    await sleep(500);
    // 출석 보상
    const before = await G(page, () => JSON.parse(localStorage.getItem('swarm-surfers-v1')));
    await clickSel(page, cdp, '#tStreak');
    await sleep(300);
    const afterStreak = await G(page, () => JSON.parse(localStorage.getItem('swarm-surfers-v1')));
    check('출석 보상 수령', afterStreak.coins === before.coins + 100 && afterStreak.streak.count === 1, `${before.coins}->${afterStreak.coins}`);
    await page.screenshot({ path: 'shots/17-title-meta.png' });
    // 업그레이드 구매
    await clickSel(page, cdp, '#tShop');
    await sleep(300);
    await clickSel(page, cdp, '[data-upg="start"]');
    await sleep(300);
    await page.screenshot({ path: 'shots/18-shop-bought.png' });
    await clickSel(page, cdp, '#shopP [data-close]');
    // 스킨 해금
    await clickSel(page, cdp, '#tSkins');
    await sleep(300);
    await clickSel(page, cdp, '[data-skin="mint"] button');
    await sleep(300);
    await page.screenshot({ path: 'shots/19-skins.png' });
    await clickSel(page, cdp, '#skinP [data-close]');
    await clickSel(page, cdp, '#tAch');
    await sleep(300);
    await page.screenshot({ path: 'shots/19b-achievements.png' });
    await clickSel(page, cdp, '#achP [data-tab="s"]');
    await sleep(300);
    await page.screenshot({ path: 'shots/19c-stats.png' });
    await clickSel(page, cdp, '#achP [data-close]');
    await clickSel(page, cdp, '#tMis');
    await sleep(300);
    await page.screenshot({ path: 'shots/19d-missions.png' });
    await clickSel(page, cdp, '#misP [data-close]');
    const mid = await G(page, () => JSON.parse(localStorage.getItem('swarm-surfers-v1')));
    // 새로고침 후 유지
    await page.reload();
    await page.waitForFunction(() => window.__game);
    await sleep(800);
    const after = await G(page, () => JSON.parse(localStorage.getItem('swarm-surfers-v1')));
    check('업그레이드 구매 후 유지', after.upgrades.start === 1, `start Lv.${after.upgrades.start}`);
    check('스킨 해금/선택 후 유지', after.skins.owned.includes('mint') && after.skins.sel === 'mint');
    check('재화/통계 유지', after.coins === mid.coins && after.gems === mid.gems && after.stats.revives === 1 && after.stats.forts === 1, `coins ${after.coins} gems ${after.gems}`);
    check('업적 달성 기록', Object.keys(after.ach).length >= 2, Object.keys(after.ach).join(','));
    check('저장 버전', after.v === 2);
    await page.screenshot({ path: 'shots/20-title-after-reload.png' });
    // 주간 챌린지 시작
    await clickSel(page, cdp, '#tWeekly');
    await sleep(500);
    check('주간 챌린지 시작', await G(page, () => window.__game.state === 'play' && !!window.__game.weekly));
    await ctx.close();
  }

  // ---------- 2b. 이전 버전 저장 데이터 마이그레이션 ----------
  {
    const ctx = await browser.newContext({ viewport: { width: W, height: H }, hasTouch: true, isMobile: true });
    await ctx.addInitScript(() => {
      if (!sessionStorage.getItem('seeded')) {
        sessionStorage.setItem('seeded', '1');
        localStorage.setItem('swarm-surfers-v1', JSON.stringify({ coins: 500, bestDist: 1234, bestCount: 88, upgrades: { start: 2, luck: 99 }, missions: { date: 'x', list: [] }, runs: 7, skins: 'broken' }));
      }
    });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(BASE);
    await page.waitForFunction(() => window.__game);
    const d = await page.evaluate(() => JSON.parse(localStorage.getItem('swarm-surfers-v1')));
    check('v1 저장 마이그레이션', d.v === 2 && d.coins === 500 && d.bestScore === 1234 && d.upgrades.start === 2 && d.upgrades.luck === 8 && d.stats.runs === 7 && d.skins.sel === 'basic', JSON.stringify({ v: d.v, c: d.coins, l: d.upgrades.luck }));
    await ctx.close();
  }

  // ---------- 3. 다른 뷰포트 ----------
  for (const [w, h] of [[360, 640], [430, 932]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(BASE + '?seed=5&count=60');
    await page.waitForFunction(() => window.__game);
    await sleep(800);
    await page.screenshot({ path: `shots/30-title-${w}x${h}.png` });
    await page.evaluate(() => window.__game.startRun());
    await sleep(2500);
    await page.screenshot({ path: `shots/31-play-${w}x${h}.png` });
    await ctx.close();
  }
} catch (e) {
  check('예외 없음', false, String(e));
} finally {
  check('콘솔 에러 0개', errors.length === 0, errors.slice(0, 5).join(' | '));
  await browser.close();
  server.kill();
}
const fail = results.filter((r) => !r.ok);
console.log(`\n${results.length - fail.length}/${results.length} 통과`);
process.exit(fail.length ? 1 : 0);
