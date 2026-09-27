// 스모크 테스트: npm run build 후 실행. vite preview 를 띄우고 Playwright 로 실제 터치 입력을 보내 전체 흐름 확인
// 사용: node scripts/smoke.mjs   (환경변수 PORT 로 포트 변경 가능)
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync, existsSync } from 'node:fs';

const PORT = +(process.env.PORT || 47390);
const BASE = `http://localhost:${PORT}/`;
const SHOTS = new URL('../shots/', import.meta.url).pathname;
mkdirSync(SHOTS, { recursive: true });
const exe = ['/opt/pw-browsers/chromium', process.env.CHROMIUM].find((p) => p && existsSync(p));

const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--port', String(PORT), '--strictPort'], { cwd: new URL('..', import.meta.url).pathname, stdio: 'pipe' });
let serverOut = '';
server.stdout.on('data', (d) => (serverOut += d));
server.stderr.on('data', (d) => (serverOut += d));
for (let i = 0; i < 60 && !serverOut.includes('Local'); i++) await new Promise((r) => setTimeout(r, 200));

const errors = [];
const log = (...a) => console.log('  -', ...a);
let failed = false;
function check(cond, msg) {
  if (!cond) {
    failed = true;
    console.error('  FAIL:', msg);
  } else log('ok:', msg);
}

const browser = await chromium.launch(exe ? { executablePath: exe } : {});

async function newPage(w = 390, h = 844, init) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  if (init) await ctx.addInitScript(init);
  const page = await ctx.newPage();
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`[${w}x${h}] ${m.text()}`);
  });
  page.on('pageerror', (e) => errors.push(`[${w}x${h}] ${e}`));
  const cdp = await ctx.newCDPSession(page);
  return { ctx, page, cdp };
}

async function touchDrag(cdp, x0, y0, x1, y1, steps = 14, midShot) {
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: x0, y: y0 }] });
  for (let i = 1; i <= steps; i++) {
    const u = i / steps;
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x0 + (x1 - x0) * u, y: y0 + (y1 - y0) * u }] });
    await new Promise((r) => setTimeout(r, 16));
  }
  if (midShot) await midShot();
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
}

const info = (page) => page.evaluate(() => window.__game.info());
async function waitState(page, states, timeout = 15000) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeout) {
    const s = await info(page);
    if (states.includes(s.state)) return s;
    await page.waitForTimeout(100);
  }
  return info(page);
}
async function skipIntro(page) {
  await dismissCoach(page);
  const s = await info(page);
  if (s.state === 'intro') await page.tap('#cv', { position: { x: 20, y: 400 } });
  return waitState(page, ['ready']);
}
async function autoDragShot(page, cdp, midShot) {
  const d = await page.evaluate(() => window.__game.autoAimDrag());
  const box = await page.locator('#cv').boundingBox();
  await touchDrag(cdp, box.x + d.x0, box.y + d.y0, box.x + d.x1, box.y + d.y1, 14, midShot);
  return d;
}
async function dismissCoach(page) {
  for (let k = 0; k < 4; k++) {
    const el = page.locator('.coach').first();
    if (!(await el.count()) || !(await el.isVisible())) break;
    await el.tap();
    await page.waitForTimeout(120);
  }
}
async function pickReward(page) {
  await dismissCoach(page);
  await page.locator(".relic-opt").first().tap();
  await page.waitForTimeout(700);
  await dismissCoach(page);
}
const metaOf = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('roguePutt.meta')));

try {
  // ===== 1. 타이틀 -> 실제 드래그 샷 -> 홀 클리어 -> 유물 선택 -> 다음 홀 -> 런 종료 =====
  console.log('[1] 기본 흐름 (hearts=1)');
  {
    const { page, cdp, ctx } = await newPage();
    await page.goto(BASE + '?debug&seed=20260926&hearts=1');
    await page.waitForSelector('#tStart');
    await page.waitForTimeout(800);
    await page.screenshot({ path: SHOTS + '01_title.png' });
    check(await page.isVisible('.logo'), '타이틀 화면 표시');
    await page.tap('#tStart');
    let s = await waitState(page, ['intro']);
    await page.waitForTimeout(500);
    await page.screenshot({ path: SHOTS + '02_hole_intro.png' });
    s = await skipIntro(page);
    check(s.state === 'ready' && s.hole === 1, '1번 홀 준비');
    await page.screenshot({ path: SHOTS + '03_hole1.png' });
    const before = s.ball;
    await autoDragShot(page, cdp, () => page.screenshot({ path: SHOTS + '04_aiming.png' }));
    await page.waitForTimeout(250);
    s = await info(page);
    check(s.strokes === 1, '드래그 샷으로 타수 1');
    await page.screenshot({ path: SHOTS + '05_rolling.png' });
    s = await waitState(page, ['ready', 'celebrate', 'reward', 'decide', 'result'], 20000);
    const moved = Math.hypot(s.ball.x - before.x, s.ball.y - before.y);
    check(s.state !== 'ready' || moved > 20, `공이 실제로 이동 (${moved.toFixed(0)})`);
    if (s.state === 'ready') await page.tap('[data-a="sink"]');
    s = await waitState(page, ['celebrate']);
    await page.waitForTimeout(350);
    await page.screenshot({ path: SHOTS + '06_cup_in.png' });
    s = await waitState(page, ['reward'], 8000);
    check(s.state === 'reward', '홀 클리어 후 보상 화면');
    await page.waitForTimeout(500);
    await page.screenshot({ path: SHOTS + '07_reward.png' });
    await pickReward(page);
    s = await waitState(page, ['intro', 'ready']);
    check(s.relics.length === 1 && s.hole === 2, `유물 1개 획득 후 2번 홀 (${s.relics})`);
    s = await skipIntro(page);
    await autoDragShot(page, cdp);
    s = await waitState(page, ['ready', 'reward', 'celebrate'], 20000);
    if (s.state !== 'ready') {
      // 한 번에 들어간 경우: 다음 홀에서 하트 제거
      s = await waitState(page, ['reward'], 8000);
      await pickReward(page);
      await skipIntro(page);
    }
    // 하트가 0이 될 때까지 (여분의 심장 유물이면 여러 번)
    for (let k = 0; k < 10; k++) {
      s = await info(page);
      if (s.state !== 'ready') break;
      await page.tap('[data-a="heart"]');
      await page.waitForTimeout(250);
    }
    if (await page.isVisible('#mNo')) await page.tap('#mNo');
    s = await waitState(page, ['result'], 6000);
    check(s.state === 'result', '하트 0 -> 결과 화면');
    await page.waitForTimeout(400);
    await page.screenshot({ path: SHOTS + '08_result_gameover.png' });
    const m = await metaOf(page);
    check(m && m.gems > 0 && m.stats.holes >= 1 && m.run === null, `런 종료 정산: 보석 ${m && m.gems}, 홀 ${m && m.stats.holes}`);
    check(m.discovered.length >= 1, '도감에 유물 등록');
    await ctx.close();
  }

  // ===== 2. 18홀 완주 (보스/상점 포함) -> 별, 월드 해금, 보석 -> 해금 -> 새로고침 후 유지 =====
  console.log('[2] 18홀 완주 + 메타 진행 + 새로고침 유지');
  {
    const { page, ctx } = await newPage();
    await page.goto(BASE + '?debug&seed=777');
    await page.waitForSelector('#tStart');
    const gems0 = (await metaOf(page)).gems;
    await page.tap('#tStart');
    let shopSeen = 0,
      bossSeen = [];
    for (let hole = 1; hole <= 18; hole++) {
      let s = await skipIntro(page);
      if (s.hole !== hole) {
        check(false, `홀 번호 ${s.hole} != ${hole}`);
        break;
      }
      if (s.boss) {
        bossSeen.push(s.boss);
        if (bossSeen.length <= 3) await page.screenshot({ path: SHOTS + `10_boss_${s.boss}.png` });
      }
      if (hole === 10) await page.screenshot({ path: SHOTS + '11_back_nine.png' });
      if (hole === 14 && (await page.isVisible('#hudRelics .more'))) {
        await page.tap('#hudRelics .more');
        await page.waitForTimeout(400);
        await page.screenshot({ path: SHOTS + '11b_relic_sheet.png' });
        await page.tap('#sheetClose');
      }
      await page.tap('[data-a="sink"]');
      s = await waitState(page, ['reward', 'result'], 10000);
      if (s.state === 'result') break;
      if (hole === 4) await page.screenshot({ path: SHOTS + '12_reward_mid.png' });
      await pickReward(page);
      if (await page.isVisible('#next')) {
        shopSeen++;
        if (shopSeen === 1) await page.screenshot({ path: SHOTS + '13_shop.png' });
        await dismissCoach(page);
        const buy = page.locator('.relic-opt:not([disabled])').first();
        if (await buy.count()) await buy.tap();
        await page.waitForTimeout(300);
        await page.tap('#next');
      }
    }
    const s = await waitState(page, ['result'], 10000);
    check(s.state === 'result', '18홀 완주 결과 화면');
    check(shopSeen === 3, `상점 3회 등장 (${shopSeen})`);
    check(bossSeen.join() === 'movingCup,threeCups,giantMill', `보스 홀 3종 (${bossSeen})`);
    await page.waitForTimeout(500);
    await page.screenshot({ path: SHOTS + '14_result_complete.png' });
    let m = await metaOf(page);
    check(m.worlds.meadow.stars.every(Boolean), '초원 별 3개 획득');
    check(m.worlds.desert.unlocked, '사막 월드 해금');
    check(m.gems > gems0 && m.gems - gems0 <= 40, `보석 획득 ${gems0} -> ${m.gems} (18홀 전부 홀인원이어도 과다하지 않음)`);
    await page.evaluate(() => window.__meta.addGems(100)); // 구매 테스트용
    check(Object.keys(m.ach).length >= 5, `업적 달성 ${Object.keys(m.ach).length}개`);
    await page.tap('#title');
    await page.waitForSelector('#tStart');
    await page.waitForTimeout(500);
    await page.screenshot({ path: SHOTS + '15_title_after.png' });
    // 컬렉션에서 유물 해금 + 공 스킨 구매
    await page.tap('#tCollect');
    await page.waitForSelector('[data-buy="ghost"]');
    await page.screenshot({ path: SHOTS + '16_collection.png' });
    await page.tap('[data-buy="ghost"]');
    await page.waitForTimeout(200);
    await page.tap('[data-tab="ball"]');
    await page.tap('[data-cos="gold"]');
    await page.waitForTimeout(200);
    await page.screenshot({ path: SHOTS + '17_collection_ball.png' });
    await page.tap('#back');
    // 미션 화면: 출석 보상
    await page.tap('#tMissions');
    await page.waitForSelector('#streak');
    await page.screenshot({ path: SHOTS + '18_missions.png' });
    if (await page.isEnabled('#streak')) await page.tap('#streak');
    await page.tap('#back');
    await page.tap('#tCodex');
    await page.waitForSelector('.codex');
    await page.screenshot({ path: SHOTS + '19_codex.png' });
    await page.tap('#back');
    await page.tap('#tRecords');
    await page.waitForSelector('.stat-list');
    await page.screenshot({ path: SHOTS + '20_records.png' });
    await page.tap('[data-tab="ach"]');
    await page.screenshot({ path: SHOTS + '21_achievements.png' });
    await page.tap('#back');
    m = await metaOf(page);
    const gemsBeforeReload = m.gems;
    // 새로고침 후 유지
    await page.reload();
    await page.waitForSelector('#tStart');
    m = await metaOf(page);
    check(m.unlockedRelics.includes('ghost'), '해금한 유물이 새로고침 후 유지');
    check(m.cosmetics.eq.ball === 'gold', '구매한 공 스킨 장착 유지');
    check(m.gems === gemsBeforeReload, `보석 유지 (${m.gems})`);
    check(m.daily.streakClaimed === m.daily.lastLogin, '출석 보상 수령 기록 유지');
    check(m.v === 3, '저장 버전 필드');
    const titleText = await page.textContent('.topbar');
    check(titleText.includes(String(m.gems)), '타이틀에 보석 표시');
    await page.tap('#wNext');
    await page.waitForTimeout(600);
    await page.screenshot({ path: SHOTS + '22_title_desert.png' });
    check((await page.textContent('#tStart')).includes('사막'), '해금된 사막 월드 선택 가능');
    // 사막 월드 플레이 화면
    await page.tap('#tStart');
    await skipIntro(page);
    await page.waitForTimeout(300);
    await page.screenshot({ path: SHOTS + '23_desert_hole.png' });
    const si = await info(page);
    check(si.world === 'desert', '사막 월드 런');
    // ===== 3. 이어하기 =====
    console.log('[3] 이어하기');
    await page.tap('[data-a="sink"]');
    await waitState(page, ['reward']);
    await pickReward(page);
    await waitState(page, ['intro', 'ready']);
    const relicsBefore = (await info(page)).relics;
    await page.reload();
    await page.waitForSelector('#tCont');
    await page.screenshot({ path: SHOTS + '24_title_continue.png' });
    await page.tap('#tCont');
    const sc = await skipIntro(page);
    check(sc.hole === 2 && sc.world === 'desert' && sc.relics.join() === relicsBefore.join(), `이어하기: ${sc.world} ${sc.hole}번 홀, 유물 유지`);
    // 일시정지 + 가시성 자동 일시정지
    await page.tap('#btnPause');
    await page.waitForSelector('#pResume');
    await page.screenshot({ path: SHOTS + '25_pause.png' });
    await page.tap('#pResume');
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { value: true, configurable: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    check(await page.evaluate(() => window.__game.paused), 'visibilitychange 자동 일시정지');
    await ctx.close();
  }

  // ===== 4. 저장 마이그레이션 (구버전 데이터) =====
  console.log('[4] 저장 마이그레이션');
  {
    const init = () => {
      if (!sessionStorage.getItem('seeded')) {
        sessionStorage.setItem('seeded', '1');
        localStorage.setItem('roguePutt.meta', JSON.stringify({ v: 2, gems: '17', skin: 'gold', unlockedRelics: ['ghost', 'bogus'], worlds: { meadow: { stars: [true] } }, stats: { holes: 12 }, run: { broken: true } }));
      }
    };
    const { page, ctx } = await newPage(390, 844, init);
    await page.goto(BASE + '?debug');
    await page.waitForSelector('#tStart');
    const m = await metaOf(page);
    check(m.v === 3 && Number.isInteger(m.gems) && m.gems < 17 && m.unlockedRelics.includes('ghost') && !m.unlockedRelics.includes('bogus'), '타입 틀린 값 보정 + 알 수 없는 유물 제거');
    check(m.cosmetics.owned.ball.includes('gold') && m.cosmetics.eq.ball === 'gold', 'v2 skin -> v3 cosmetics 이전');
    check(m.worlds.meadow.stars.length === 3 && m.run === null && m.stats.holes === 12, '별 배열 보정, 깨진 이어하기 제거, 통계 유지');
    await ctx.close();
    // v1 records 키
    const { page: p2, ctx: c2 } = await newPage(390, 844, () => {
      if (!sessionStorage.getItem('s')) {
        sessionStorage.setItem('s', '1');
        localStorage.clear();
        localStorage.setItem('roguePutt.records', JSON.stringify({ bestToPar: -2, bestHoles: 18, runs: 4 }));
      }
    });
    await p2.goto(BASE + '?debug');
    await p2.waitForSelector('#tStart');
    const m2 = await metaOf(p2);
    check(m2.stats.bestToPar === -2 && m2.stats.bestHoles === 18 && m2.stats.runs === 4, 'v1 기록 이전');
    // 손상된 JSON
    await p2.evaluate(() => localStorage.setItem('roguePutt.meta', '{broken'));
    await p2.reload();
    await p2.waitForSelector('#tStart');
    check((await metaOf(p2)).v === 3, '손상된 저장 데이터에서 복구');
    await c2.close();
  }

  // ===== 6. 소프트락 재현 (컵인 직후 일시정지) + 세이브 스컴 차단 =====
  console.log('[6] 소프트락/세이브 스컴');
  {
    const { page, cdp, ctx } = await newPage();
    await page.goto(BASE + '?debug&seed=4242');
    await page.waitForSelector('#tStart');
    await page.tap('#tStart');
    await skipIntro(page);
    await page.tap('[data-a="sink"]');
    await waitState(page, ['celebrate']);
    await page.tap('#btnPause');
    await page.waitForTimeout(3500);
    let s = await info(page);
    check(s.state === 'celebrate' && (await page.evaluate(() => window.__game.paused)) && (await page.isVisible('#pResume')), '컵인 직후 일시정지: 보상 화면으로 넘어가지 않고 대기');
    await page.screenshot({ path: SHOTS + '40_pause_celebrate.png' });
    await page.tap('#pResume');
    s = await waitState(page, ['reward'], 6000);
    check(s.state === 'reward', '재개 후 보상 화면');
    await pickReward(page);
    s = await waitState(page, ['ready'], 6000);
    await dismissCoach(page);
    s = await waitState(page, ['ready'], 6000);
    check(s.state === 'ready' && !(await page.evaluate(() => window.__game.paused)), '다음 홀 인트로에서 멈추지 않고 플레이 가능');
    // 세이브 스컴: 약하게 2번 친 뒤 새로고침해도 타수/공 위치 유지
    const box = await page.locator('#cv').boundingBox();
    const weak = async (k) => {
      const cx = box.x + box.width / 2,
        cy = box.y + box.height * 0.55;
      await touchDrag(cdp, cx, cy, cx + (k % 2 ? 12 : -12), cy + 26, 6);
      await page.waitForTimeout(150);
      await waitState(page, ['ready', 'celebrate', 'reward', 'dying', 'result'], 15000);
      await dismissCoach(page);
    };
    await weak(0);
    await weak(1);
    s = await info(page);
    const before = { hearts: s.hearts, strokes: s.strokes, x: Math.round(s.ball.x), y: Math.round(s.ball.y) };
    check(s.strokes >= 2, `약한 샷 2번 (${s.strokes}타)`);
    await page.reload();
    await page.waitForSelector('#tCont');
    await page.tap('#tCont');
    s = await skipIntro(page);
    const after = { hearts: s.hearts, strokes: s.strokes, x: Math.round(s.ball.x), y: Math.round(s.ball.y) };
    check(JSON.stringify(before) === JSON.stringify(after), `이어하기 후 하트/타수/공 위치 유지 ${JSON.stringify(before)} = ${JSON.stringify(after)}`);
    // 파+3 자동 기권 -> 홀 종료 시 하트 차감 (최대 2)
    const h0 = s.hearts;
    await page.screenshot({ path: SHOTS + '41_par_preview.png' });
    for (let k = 0; k < 10; k++) {
      s = await info(page);
      if (s.state !== 'ready') break;
      await weak(k);
    }
    s = await waitState(page, ['celebrate', 'reward'], 8000);
    await page.waitForTimeout(300);
    await page.screenshot({ path: SHOTS + '42_forfeit.png' });
    s = await info(page);
    check(s.hearts === h0 - 2, `파+3 자동 기권: 하트 ${h0} -> ${s.hearts} (최대 -2)`);
    await ctx.close();
  }

  // ===== 7. 하트 0 직후 새로고침 (사망 창 저장 버그) + 데일리 보상 제한 =====
  console.log('[7] 사망 저장/데일리');
  {
    const { page, cdp, ctx } = await newPage();
    await page.goto(BASE + '?debug&seed=99&hearts=1');
    await page.waitForSelector('#tStart');
    const runs0 = (await metaOf(page)).stats.runs;
    await page.tap('#tStart');
    await skipIntro(page);
    const box = await page.locator('#cv').boundingBox();
    for (let k = 0; k < 10; k++) {
      const s = await info(page);
      if (s.state !== 'ready') break;
      const cx = box.x + box.width / 2,
        cy = box.y + box.height * 0.55;
      await touchDrag(cdp, cx, cy, cx + (k % 2 ? 12 : -12), cy + 26, 6);
      await page.waitForTimeout(150);
      await waitState(page, ['ready', 'dying', 'result'], 15000);
      await dismissCoach(page);
    }
    let s = await waitState(page, ['dying', 'result'], 6000);
    check(s.hearts === 0, '하트 1로 시작, 기권으로 하트 0');
    await page.reload(); // 0.9초 안 새로고침
    await page.waitForSelector('#tStart');
    await page.waitForTimeout(300);
    let m = await metaOf(page);
    check(!(await page.isVisible('#tCont')) && m.run === null && m.stats.runs === runs0 + 1, '하트 0 저장본은 이어하기 불가, 런은 정산됨');
    // 데일리: 1번 홀에서 죽으면 데일리 미션/보너스 없음, 두 번째 런은 보석 0
    await page.tap('#tDaily');
    await skipIntro(page);
    await page.tap('[data-a="heart"]');
    s = await waitState(page, ['result'], 6000);
    m = await metaOf(page);
    check((m.stats.dailies || 0) === 0, '데일리 1홀 사망으로는 데일리 완료 미션 불인정');
    await page.tap('#title');
    await page.waitForSelector('#tDaily');
    await page.tap('#tDaily');
    await skipIntro(page);
    await page.tap('[data-a="sink"]');
    await waitState(page, ['reward'], 8000);
    await pickReward(page);
    await skipIntro(page);
    await page.tap('[data-a="heart"]');
    s = await waitState(page, ['result'], 6000);
    await page.waitForTimeout(500);
    check(await page.isVisible('text=이미 받음'), '같은 날 두 번째 데일리 런은 보석 없음');
    await page.screenshot({ path: SHOTS + '43_daily_second.png' });
    await ctx.close();
    // 보스 18 타이머: 첫 샷 전/코치마크 중엔 안 흐름
    const { page: p3, ctx: c3 } = await newPage();
    await p3.goto(BASE + '?debug&seed=5&hole=18');
    await p3.waitForSelector('#tStart');
    await p3.tap('#tStart');
    await p3.waitForTimeout(2500);
    await p3.screenshot({ path: SHOTS + '44_boss18_coach.png' });
    await p3.waitForTimeout(2500);
    const tl = await p3.evaluate(() => window.__game.timeLeft);
    check(tl >= 59.9, `보스 타이머: 첫 샷 전에는 멈춤 (${tl.toFixed(1)})`);
    await c3.close();
  }

  // ===== 8. 사운드 믹스 계측 (OfflineAudioContext) =====
  console.log('[8] 사운드 믹스');
  {
    const { page, ctx } = await newPage();
    await page.goto(BASE + '?debug');
    await page.waitForSelector('#tStart');
    const res = await page.evaluate(async () => {
      const A = window.__audio;
      const main = [['shot', [0.8]], ['wall', [600, 'wood']], ['wall', [500, 'ice']], ['wall', [500, 'neon']], ['cup', []], ['splash', []], ['coin', []], ['bumper', []], ['crate', []], ['relic', []], ['tele', []], ['heart', []], ['sting', []], ['fanfare', [2]]];
      const quiet = [['click', []], ['aimTick', [0.5]], ['tick', []], ['lip', []], ['ghost', []]];
      const out = { main: [], quiet: [], bgm: [], mix: null };
      for (const [n, a] of main) out.main.push(await A.measure(n, a, 1.5));
      for (const [n, a] of quiet) out.quiet.push(await A.measure(n, a, 1.0));
      for (const w of ['meadow', 'desert', 'snow', 'space']) out.bgm.push(await A.measure('bgm', [w], 3.2));
      out.bgm.push(await A.measure('bgm', ['meadow', true], 3.2));
      out.mix = await A.measure('mix', [], 3.2);
      out.cheer = await A.measure('cheer', [2], 2.5);
      return out;
    });
    const fmt = (r) => `${r.name} ${r.rmsDb}dB/${r.peakDb}`;
    const badMain = res.main.filter((r) => r.rmsDb < -26 || r.rmsDb > -18 || r.peakDb > -1);
    check(!badMain.length, `주요 효과음 RMS -26~-18dB (${res.main.map(fmt).join(', ')})`);
    const badQ = res.quiet.filter((r) => r.rmsDb < -35);
    check(!badQ.length, `작은 효과음도 RMS -35dB 이상 (${res.quiet.map(fmt).join(', ')})`);
    const badLow = res.bgm.filter((r) => r.lowRatio > 0.6);
    check(!badLow.length, `BGM 150Hz 이하 에너지 60% 이하 (${res.bgm.map((r) => r.lowRatio).join(', ')})`);
    check(res.mix.peakDb <= -0.5 && res.mix.peakDb >= -6, `겹친 믹스 마스터 피크 약 -3dBFS (${res.mix.peakDb})`);
    const shot = res.main[0];
    check(shot.lowRatio <= 0.4 && shot.hiRatio >= 0.3 && shot.rmsDb >= -27, `샷: 150Hz 이하 ${shot.lowRatio} (<=0.4), 2kHz 이상 ${shot.hiRatio} (>=0.3), RMS ${shot.rmsDb}`);
    check(res.bgm.every((r) => r.midRatio >= 0.08), `BGM 모티프 500Hz~2kHz 비중 (${res.bgm.map((r) => r.midRatio).join(', ')})`);
    check(res.bgm.every((r) => r.stereo >= 0.1) && res.cheer.stereo >= 0.1, `스테레오 L-R 비율 0.1 이상 (BGM ${res.bgm.map((r) => r.stereo).join(', ')}, 환호 ${res.cheer.stereo})`);
    await ctx.close();
  }

  // ===== 5. 여러 화면 크기 =====
  console.log('[5] 화면 크기');
  for (const [w, h] of [
    [360, 640],
    [430, 932],
    [1280, 800],
  ]) {
    const { page, ctx } = await newPage(w, h);
    await page.goto(BASE + '?debug&seed=5&hole=8');
    await page.waitForSelector('#tStart');
    await page.waitForTimeout(400);
    await page.screenshot({ path: SHOTS + `30_title_${w}x${h}.png` });
    const btn = await page.locator('#tDaily').boundingBox();
    check(btn && btn.y + btn.height <= h, `${w}x${h} 타이틀 버튼이 화면 안`);
    await page.tap('#tStart');
    await skipIntro(page);
    await page.waitForTimeout(300);
    await page.screenshot({ path: SHOTS + `31_hole_${w}x${h}.png` });
    await ctx.close();
  }
} catch (e) {
  failed = true;
  console.error('예외:', e);
} finally {
  await browser.close();
  server.kill();
}

if (errors.length) {
  failed = true;
  console.error('콘솔 에러:', errors);
} else console.log('콘솔 에러 0개');
console.log(failed ? 'SMOKE FAIL' : 'SMOKE PASS');
process.exit(failed ? 1 : 0);
