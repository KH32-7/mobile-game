// 스모크 테스트: npm run build 후 실행. vite preview 를 띄우고 Playwright 로 실제 터치 입력을 보내 전체 흐름 확인
// 사용: node scripts/smoke.mjs   (환경변수 PORT 로 포트 변경 가능)
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync, existsSync } from 'node:fs';

const PORT = +(process.env.PORT || 4391);
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
    await page.locator('.relic-opt').first().tap();
    s = await waitState(page, ['intro', 'ready']);
    check(s.relics.length === 1 && s.hole === 2, `유물 1개 획득 후 2번 홀 (${s.relics})`);
    s = await skipIntro(page);
    await autoDragShot(page, cdp);
    s = await waitState(page, ['ready', 'reward', 'celebrate'], 20000);
    if (s.state !== 'ready') {
      // 한 번에 들어간 경우: 다음 홀에서 하트 제거
      s = await waitState(page, ['reward'], 8000);
      await page.locator('.relic-opt').first().tap();
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
      await page.tap('[data-a="sink"]');
      s = await waitState(page, ['reward', 'result'], 10000);
      if (s.state === 'result') break;
      if (hole === 4) await page.screenshot({ path: SHOTS + '12_reward_mid.png' });
      await page.locator('.relic-opt').first().tap();
      await page.waitForTimeout(150);
      if (await page.isVisible('#next')) {
        shopSeen++;
        if (shopSeen === 1) await page.screenshot({ path: SHOTS + '13_shop.png' });
        const buy = page.locator('.relic-opt:not([disabled])').first();
        if (await buy.count()) await buy.tap();
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
    check(m.gems > gems0 + 50, `보석 획득 ${gems0} -> ${m.gems}`);
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
    await page.locator('.relic-opt').first().tap();
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
