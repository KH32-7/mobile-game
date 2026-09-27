// 스모크 테스트: npm run build 후 실행. vite preview 를 띄우고 390x844 터치 모드에서
// 첫 실행 튜토리얼(실제 스와이프) → 게이트/전투 → 부활 → 게임 오버, 요새/보너스 계단, 메타 진행 유지, 마이그레이션까지 확인
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

async function newPage(query = '', w = W, h = H) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
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
  await page.locator(sel).first().evaluate((el) => el.scrollIntoView({ block: 'center' }));
  const b = await page.locator(sel).first().boundingBox();
  if (!b) throw new Error('no element ' + sel);
  await tap(cdp, b.x + b.width / 2, b.y + b.height / 2);
}

const G = (page, fn) => page.evaluate(fn);
const SAVE = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('swarm-surfers-v1')));

try {
  // ---------- 1. 첫 실행: 메뉴 없이 튜토리얼 달리기 ----------
  {
    const { ctx, page, cdp } = await newPage('?seed=7&debug');
    await sleep(800);
    const s0 = await G(page, () => ({ st: window.__game.state, tut: window.__game.tutorial, n: window.__game.swarm.count }));
    check('첫 실행은 바로 튜토리얼 달리기', s0.st === 'play' && s0.tut && s0.n === 15, JSON.stringify(s0));
    check('첫 실행 타이틀 숨김', !(await page.locator('#title').isVisible()));
    await page.screenshot({ timeout: 90000, path: 'shots/01-first-run.png' });

    const done = { lr: false, up: false, down: false };
    let battle = false, gateSeen = false;
    for (let i = 0; i < 400; i++) {
      await sleep(150);
      const s = await G(page, () => { const g = window.__game; return { wait: g.tutWait && g.tutWait.step, lane: g.lane, mode: g.mode, tut: g.tutorial, gates: g.dbg.gates.length }; });
      if (s.wait && !done[s.wait]) {
        await page.screenshot({ timeout: 90000, path: `shots/02-tut-${s.wait}.png` });
        const lane0 = s.lane;
        await swipe(cdp, s.wait === 'lr' ? 'left' : s.wait);
        await sleep(250);
        if (s.wait === 'lr') {
          const a = await G(page, () => ({ lane: window.__game.lane, wait: window.__game.tutWait }));
          check('튜토리얼 스와이프 → 레인 이동 (슬로우 해제)', a.lane === lane0 - 1 && !a.wait, `${lane0}->${a.lane}`);
        }
        if (s.wait === 'up') { await sleep(300); const y = await G(page, () => window.__game.dbg.maxY); check('튜토리얼 스와이프 위 → 파도 점프', y > 0.4, `최고 y=${y.toFixed(2)}`); }
        if (s.wait === 'down') { await sleep(200); const hw = await G(page, () => window.__game.dbg.minHW); check('튜토리얼 스와이프 아래 → 슬라이드 (무리 폭 축소)', hw <= 0.8, `폭=${hw}`); }
        done[s.wait] = true;
      }
      if (s.gates > 0 && !gateSeen) {
        gateSeen = true;
        const g0 = await G(page, () => window.__game.dbg.gates[0]);
        check('튜토리얼 게이트로 인원 증가', g0.after > g0.before, JSON.stringify(g0));
        await page.screenshot({ timeout: 90000, path: 'shots/03-after-gate.png' });
      }
      if (s.mode === 'battle') {
        if (!battle) { battle = true; await page.screenshot({ timeout: 90000, path: 'shots/04-battle-tap.png' }); }
        await tap(cdp, W / 2, H * 0.55);
      }
      if (!s.tut) break;
    }
    check('튜토리얼 적 무리 전투', battle);
    check('튜토리얼 완료 저장', (await SAVE(page)).tutorialDone === true);
    await sleep(600);
    await page.screenshot({ timeout: 90000, path: 'shots/05-tut-done.png' });

    // 일시정지 → 3,2,1 카운트다운 → 재개
    await clickSel(page, cdp, '#pauseBtn');
    await sleep(300);
    check('일시정지', (await G(page, () => window.__game.state)) === 'pause');
    await page.screenshot({ timeout: 90000, path: 'shots/06-pause.png' });
    await clickSel(page, cdp, '#pResume');
    await sleep(200);
    check('재개 카운트다운', (await G(page, () => window.__game.state)) === 'countdown');
    await page.screenshot({ timeout: 90000, path: 'shots/07-countdown.png' });
    for (let i = 0; i < 150 && (await G(page, () => window.__game.state)) === 'countdown'; i++) await sleep(200);
    check('카운트다운 후 플레이', (await G(page, () => window.__game.state)) === 'play');

    // 입력 없이 달리면 결국 전멸 → 보석이 있으면 부활 제안 (대기 시간 단축을 위해 시뮬레이션 배속)
    await G(page, () => { window.__game.opts.fast = 3; });
    let st = 'play', revived = false;
    for (let i = 0; i < 1500 && st !== 'over'; i++) {
      await sleep(200);
      st = await G(page, () => window.__game.state);
      if (i === 15) await page.screenshot({ timeout: 90000, path: 'shots/08-running.png' });
      if (st === 'revive' && !revived) {
        await G(page, () => { window.__game.reviveT = 30; }); // 느린 헤드리스에서 대기 시간 초과 방지
        await page.screenshot({ timeout: 90000, path: 'shots/09-revive.png' });
        const box = await page.locator('#rvYes').boundingBox();
        check('부활 버튼 한 줄', box && box.height < 80, `h=${box && box.height}`);
        await clickSel(page, cdp, '#rvYes');
        await sleep(300);
        const r = await G(page, () => ({ st: window.__game.state, c: window.__game.swarm.count }));
        check('부활 후 10명으로 재개', r.st === 'play' && r.c === 10, JSON.stringify(r));
        revived = true;
      } else if (st === 'revive') await clickSel(page, cdp, '#rvNo');
    }
    check('게임 오버 도달', st === 'over');
    await G(page, () => { window.__game.opts.fast = 1; });
    await sleep(500);
    await page.screenshot({ timeout: 90000, path: 'shots/10-gameover.png' });
    // 결과창에서 연 상점은 결과창 위에 떠야 함
    await clickSel(page, cdp, '#oShop');
    await sleep(300);
    const top = await page.evaluate(() => { const r = document.querySelector('#shopP .panel').getBoundingClientRect(); const el = document.elementFromPoint(r.left + r.width / 2, r.top + 60); return !!el.closest('#shopP'); });
    check('결과창 위에 상점 표시', top);
    await page.screenshot({ timeout: 90000, path: 'shots/11-over-shop.png' });
    await clickSel(page, cdp, '#shopP [data-close]');
    await clickSel(page, cdp, '#oTitle');
    await sleep(600);
    await page.waitForFunction(() => window.__game.chars.body.count >= 10, null, { timeout: 20000 }).catch(() => {});
    check('첫 판 후 타이틀에 기능 단계적 노출', await page.locator('#tShop').isVisible() && !(await page.locator('#tWeekly').isVisible()));
    const titleChars = await G(page, () => window.__game.chars.body.count);
    check('타이틀에 무리 표시', titleChars >= 10, `${titleChars}`);
    await page.screenshot({ timeout: 90000, path: 'shots/12-title-after-first.png' });
    await ctx.close();
  }

  // ---------- 2. 요새 → 보너스 계단 → 인원 유지 → 재화 → 해금/업그레이드 → 새로고침 후 유지 ----------
  {
    const { ctx, page, cdp } = await newPage('?notut&seed=3&debug&god&start=820&count=120&fast=2&chunks=enemySmall,gate3');
    await page.evaluate(() => { localStorage.setItem('swarm-surfers-v1', JSON.stringify({ v: 2, tutorialDone: true })); });
    await page.reload();
    await page.waitForFunction(() => window.__game);
    await clickSel(page, cdp, '#tStart');
    let shotBattle = false, shotSiege = false, shotStairs = false, broke = false;
    for (let i = 0; i < 600; i++) {
      await sleep(120);
      const s = await G(page, () => ({ m: window.__game.mode, f: window.__game.forts, rw: !!document.querySelector('.reward') }));
      if (s.m === 'battle' && !shotBattle) { shotBattle = true; await page.screenshot({ timeout: 90000, path: 'shots/13-battle.png' }); }
      // 적 무리는 한 레인만 막으므로 전투를 보려면 그 레인으로 이동
      if (!shotBattle && s.m === 'run' && !(await G(page, () => window.__game.dbg.battles))) {
        const want = await G(page, () => { const g = window.__game; const e = g.ents.enemies.find((q) => !q.dead && q.d - g.dist > 3 && q.d - g.dist < 90); return e ? Math.round(e.x / 2.2) + 1 : null; });
        const lane = await G(page, () => window.__game.lane);
        if (want != null && want !== lane) await swipe(cdp, want < lane ? 'left' : 'right');
      }
      if (s.m === 'siege' && !shotSiege) { shotSiege = true; await sleep(400); await page.screenshot({ timeout: 90000, path: 'shots/14-siege.png' }); }
      if (s.m === 'siege') await tap(cdp, W / 2, H * 0.55);
      if (s.f > 0) broke = true;
      if (s.rw && !shotStairs) { shotStairs = true; await page.screenshot({ timeout: 90000, path: 'shots/15-stairs-reward.png' }); }
      if (broke && s.m === 'run') break;
    }
    check('적 무리 전투 발생', shotBattle || (await G(page, () => window.__game.dbg.battles || 0)) > 0);
    check('요새 격파', broke);
    check('보너스 계단 보상 카드', shotStairs);
    const after = await G(page, () => ({ c: window.__game.swarm.count, cs: window.__game.crowdScore, sec: window.__game.section }));
    check('요새 후 인원 유지 (초기화 없음)', after.c > 20, JSON.stringify(after));
    check('무리 점수 가산', after.cs > 0, `무리 점수 ${after.cs}`);
    check('다음 구간', after.sec === 1);
    await sleep(1500);
    await page.screenshot({ timeout: 90000, path: 'shots/16-next-section.png' });
    check('테마 요새 격파 기록 저장', ((await SAVE(page)).themes.forts || {})['0'] === 1);

    await G(page, () => { window.__game.opts.god = false; window.__game.opts.fast = 3; });
    let st = 'play';
    for (let i = 0; i < 2000 && st !== 'over'; i++) {
      await sleep(200);
      st = await G(page, () => window.__game.state);
      if (st === 'revive') await clickSel(page, cdp, '#rvNo');
    }
    check('두 번째 판 결과 화면', st === 'over');
    await G(page, () => { window.__game.opts.fast = 1; });
    await sleep(400);
    await page.screenshot({ timeout: 90000, path: 'shots/17-result-split.png' });
    await clickSel(page, cdp, '#oTitle');
    await sleep(500);
    const b0 = await SAVE(page);
    if (await page.locator('#tStreak').isVisible()) {
      await clickSel(page, cdp, '#tStreak');
      await sleep(300);
      const b1 = await SAVE(page);
      check('출석 보상 수령', b1.coins === b0.coins + 80 && b1.streak.count === 1, `${b0.coins}->${b1.coins}`);
    } else check('출석 보상 버튼 표시', false);
    await page.screenshot({ timeout: 90000, path: 'shots/18-title-meta.png' });
    // 가격이 올라서(업그레이드 400, 스킨 10 보석) 부족분만 보충한 뒤 구매 흐름 확인
    const sv2 = await SAVE(page);
    const gotGems = sv2.stats.gemsEarned;
    check('플레이로 보석 획득', gotGems >= 1, `얻은 보석 ${gotGems}`);
    await page.evaluate(() => { const s = JSON.parse(localStorage.getItem('swarm-surfers-v1')); s.coins = Math.max(s.coins, 450); s.gems = Math.max(s.gems, 10); localStorage.setItem('swarm-surfers-v1', JSON.stringify(s)); });
    await page.reload();
    await page.waitForFunction(() => window.__game);
    await sleep(600);
    await clickSel(page, cdp, '#tShop');
    await sleep(300);
    await clickSel(page, cdp, '[data-upg="start"]');
    await sleep(300);
    await clickSel(page, cdp, '#shopP [data-close]');
    await clickSel(page, cdp, '#tSkins');
    await sleep(800);
    await clickSel(page, cdp, '[data-skin="mint"] [data-a="buy"]');
    await sleep(200);
    const mid = await SAVE(page);
    check('스킨 구매 확인 단계', !mid.skins.owned.includes('mint'));
    await clickSel(page, cdp, '[data-skin="mint"] [data-a="buy"]');
    await sleep(400);
    await page.screenshot({ timeout: 90000, path: 'shots/19-skins.png' });
    await clickSel(page, cdp, '#skinP [data-close]');
    await clickSel(page, cdp, '#tMis');
    await sleep(300);
    await page.screenshot({ timeout: 90000, path: 'shots/20-missions.png' });
    await clickSel(page, cdp, '#misP [data-close]');
    const m2 = await SAVE(page);
    await page.reload();
    await page.waitForFunction(() => window.__game);
    await sleep(800);
    const a2 = await SAVE(page);
    check('업그레이드 구매 후 유지', a2.upgrades.start === 1, `start Lv.${a2.upgrades.start}`);
    check('스킨 해금/선택 후 유지', a2.skins.owned.includes('mint') && a2.skins.sel === 'mint', `gems ${m2.gems}`);
    check('재화/통계 유지', a2.coins === m2.coins && a2.gems === m2.gems && a2.stats.forts >= 1, `coins ${a2.coins} gems ${a2.gems}`);
    check('업적 달성 기록', Object.keys(a2.ach).length >= 2, Object.keys(a2.ach).join(','));
    check('미션 보상 정수', [...a2.mset.list, ...a2.daily.list].every((m) => Number.isInteger(m.reward)));
    check('저장 버전', a2.v === 2);
    await page.screenshot({ timeout: 90000, path: 'shots/21-title-after-reload.png' });
    await ctx.close();
  }

  // ---------- 2b. 이전 버전 저장 데이터 마이그레이션 ----------
  {
    const ctx = await browser.newContext({ viewport: { width: W, height: H }, hasTouch: true, isMobile: true });
    await ctx.addInitScript(() => {
      if (!sessionStorage.getItem('seeded')) {
        sessionStorage.setItem('seeded', '1');
        localStorage.setItem('swarm-surfers-v1', JSON.stringify({ coins: 500, bestDist: 1234, bestCount: 88, upgrades: { start: 2, luck: 99 }, missions: { date: 'x', list: [] }, runs: 7, skins: 'broken', muted: true, tutorialDone: true }));
      }
    });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto(BASE);
    await page.waitForFunction(() => window.__game);
    const d = await page.evaluate(() => JSON.parse(localStorage.getItem('swarm-surfers-v1')));
    check('v1 저장 마이그레이션', d.v === 2 && d.coins === 500 && d.bestScore === 1234 && d.upgrades.start === 2 && d.upgrades.luck === 8 && d.stats.runs === 7 && d.skins.sel === 'basic' && d.muteMusic === true && d.muteSfx === true, JSON.stringify({ v: d.v, c: d.coins, l: d.upgrades.luck }));
    await ctx.close();
  }

  // ---------- 3. 다른 뷰포트 ----------
  for (const [w, h] of [[360, 640], [430, 932]]) {
    const { ctx, page } = await newPage('?notut&seed=11&count=60', w, h);
    await sleep(800);
    await page.screenshot({ timeout: 90000, path: `shots/30-title-${w}x${h}.png` });
    await page.evaluate(() => window.__game.startRun());
    await sleep(2500);
    await page.screenshot({ timeout: 90000, path: `shots/31-play-${w}x${h}.png` });
    await page.evaluate(() => { window.__game.state = 'revive'; window.__game.reviveT = 99; window.__game.ui.showRevive(4, 7, 3); });
    await sleep(200);
    const box = await page.locator('#rvYes').boundingBox();
    check(`부활 버튼 한 줄 ${w}x${h}`, box.height < 80, `h=${box.height}`);
    await page.screenshot({ timeout: 90000, path: `shots/32-revive-${w}x${h}.png` });
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
