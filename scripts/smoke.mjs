// 스모크 테스트: vite preview 를 띄우고 모바일 뷰포트에서 타이틀 -> 플레이 -> 레벨업 -> 보스 -> 결과까지 진행
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync, existsSync } from 'node:fs';
import net from 'node:net';

// 다른 프로세스와 겹치지 않는 빈 포트
const PORT = await new Promise((res) => {
  const s = net.createServer();
  s.listen(0, () => {
    const p = s.address().port;
    s.close(() => res(p));
  });
});
const URL = `http://localhost:${PORT}/`;
const SHOTS = 'shots';
mkdirSync(SHOTS, { recursive: true });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
server.stdout.on('data', () => {});
server.stderr.on('data', (d) => process.stderr.write(d));

async function waitServer() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(URL);
      if (r.ok) return;
    } catch (e) {
      /* 대기 */
    }
    await sleep(250);
  }
  throw new Error('preview 서버 시작 실패');
}

const errors = [];
let browser;
let failed = false;
const check = (cond, msg) => {
  console.log(`${cond ? 'OK  ' : 'FAIL'} ${msg}`);
  if (!cond) failed = true;
};

try {
  if (!existsSync('dist/index.html')) throw new Error('dist 없음: npm run build 먼저 실행');
  await waitServer();
  const exe = existsSync('/opt/pw-browsers/chromium') && !process.env.PLAYWRIGHT_BROWSERS_PATH ? '/opt/pw-browsers/chromium' : undefined;
  browser = await chromium.launch({
    executablePath: exe,
    args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'],
  });
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(String(e)));
  const cdp = await ctx.newCDPSession(page);

  const touch = (type, x, y) =>
    cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y, id: 1 }] });
  const G = (fn, arg) => page.evaluate(fn, arg);
  const state = () => G(() => window.__game.state);

  // 드래그: 시작점에서 각도 목록을 따라 조이스틱을 움직임
  async function drag(cx, cy, angles, holdMs = 700) {
    await touch('touchStart', cx, cy);
    await sleep(60);
    for (const a of angles) {
      const x = cx + Math.cos(a) * 50;
      const y = cy + Math.sin(a) * 50;
      await touch('touchMove', x, y);
      await sleep(holdMs);
      if ((await state()) !== 'play') break;
    }
    await touch('touchEnd', 0, 0);
  }

  async function clearLevelups() {
    for (let i = 0; i < 12 && (await state()) === 'levelup'; i++) {
      await sleep(420);
      await page.tap('#levelup .card >> nth=0');
      await sleep(150);
    }
  }

  // 플레이 중 레벨업 창이 끼어들 수 있으므로 재시도하며 탭
  async function safeTap(sel) {
    for (let i = 0; i < 8; i++) {
      await clearLevelups();
      try {
        await page.tap(sel, { timeout: 4000, force: i > 0 });
        return;
      } catch (e) {
        if (i === 7) console.log(String(e).split('\n').filter((l) => /intercepts|not visible|Timeout/.test(l)).slice(0, 3).join('\n'));
      }
    }
    throw new Error('탭 실패: ' + sel);
  }

  await page.goto(URL + '?debug', { waitUntil: 'load' });
  await page.waitForFunction(() => window.__game && window.__game.frames > 5, null, { timeout: 30000 });
  await sleep(800);
  // 첫 실행: 출석 모달 없이 바로 튜토리얼 런
  check((await state()) === 'play' && !(await page.isVisible('#modal')), '첫 실행 바로 튜토리얼 런 (출석 모달 없음)');
  check(await page.isVisible('#tutorial'), '튜토리얼 손가락/목표 표시');
  await page.screenshot({ path: `${SHOTS}/02-tutorial.png` });

  // 조이스틱 드래그로 이동
  const p0 = await G(() => ({ x: window.__game.hole.x, z: window.__game.hole.z }));
  await drag(195, 600, [0, 0, 0, Math.PI / 2, Math.PI / 2, Math.PI, Math.PI, Math.PI, -Math.PI / 2, -Math.PI / 2, 0.8, 2.2], 800);
  const p1 = await G(() => ({ x: window.__game.hole.x, z: window.__game.hole.z, sw: window.__game.stats.swallowed, st: window.__game.state }));
  const trav = await G(() => window.__game.traveled);
  check(trav > 3, `드래그로 홀 이동 (이동 거리 ${trav.toFixed(1)})`);
  // 튜토리얼 목표: 가장 가까운 작은 물체 쪽으로 조이스틱을 계속 밀어 3개 먹기
  let tutShot = false;
  for (let i = 0; i < 40 && !(await G(() => window.__game.save.tutorialDone)); i++) {
    if (!tutShot && (await G(() => window.__game.tutStep)) >= 2) {
      tutShot = true;
      await page.screenshot({ path: `${SHOTS}/02b-tutorial-step2.png` });
    }
    await clearLevelups();
    const a = await G(() => {
      const g = window.__game;
      const h = g.hole;
      const w = g.world;
      const tt = g.tutTarget;
      if (tt && !tt.dead && g.tutStep === 2) return Math.atan2(tt.z - h.z, tt.x - h.x);
      if (tt && !tt.dead && g.tutStep === 3) return Math.atan2(h.z - tt.z, h.x - tt.x);
      let best = null;
      let bd = 1e9;
      for (const k of w.query(h.x, h.z, 12, [])) {
        if (w.pState[k] !== 0 || w.pSize[k] >= h.r * 0.9) continue;
        const d = Math.hypot(w.pX[k] - h.x, w.pZ[k] - h.z);
        if (d < bd) (bd = d), (best = k);
      }
      return best === null ? 0 : Math.atan2(w.pZ[best] - h.z, w.pX[best] - h.x);
    });
    await drag(195, 600, [a], 900);
  }
  await clearLevelups();
  const swN = await G(() => window.__game.stats.swallowed);
  check(swN > 0, `오브젝트 삼키기 (${swN}개)`);
  check(await G(() => window.__game.save.tutorialDone), '튜토리얼 3단계 (작은 것 3개, 보라 링 로봇, 빨간 링 5초 회피) 완료');
  await page.screenshot({ path: `${SHOTS}/03-play.png` });

  // 레벨업 카드 (자연 레벨업이 없으면 XP 주입)
  if ((await state()) !== 'levelup') await G(() => window.__game.debugXp(window.__game.xpNeed + 1));
  await page.waitForFunction(() => window.__game.state === 'levelup', null, { timeout: 5000 });
  await sleep(500);
  await page.screenshot({ path: `${SHOTS}/04-levelup.png` });
  const nCards = await page.locator('#levelup .card').count();
  check(nCards === 3, `레벨업 카드 3장 (${nCards})`);
  await page.tap('#levelup .card >> nth=0');
  await sleep(300);
  // 연속 레벨업 처리
  for (let i = 0; i < 6 && (await state()) === 'levelup'; i++) {
    await sleep(400);
    await page.tap('#levelup .card >> nth=0');
    await sleep(200);
  }
  const owned = await G(() => window.__game.skills.order.length);
  check(owned >= 1, `스킬 획득 (${owned}종)`);

  // 스킬 여러 개 + 중반 시점으로 점프해 전투 화면 확인
  await G(() => {
    const g = window.__game;
    const sk = g.skills;
    for (const id of ['orbit', 'bolt', 'pulse', 'cannon', 'saw']) {
      while (sk.level(id) < 3) sk.apply({ kind: 'skill', id });
    }
    g.ui.renderSkillbar(sk);
    g.time = 140;
    g.debugGrow(2.4);
    g.god = true;
    g.noLevelUp = true;
  });
  await drag(195, 600, [0.3, 0.3, 1.9, 1.9, 3.5, 3.5, 5, 5], 700);
  await sleep(1500);
  const mid = await G(() => ({ n: window.__game.enemies.list.length, k: window.__game.stats.kills, s: window.__game.state }));
  if (mid.s === 'levelup') await page.tap('#levelup .card >> nth=0');
  check(mid.n > 0, `적 스폰 (${mid.n}마리, 처치 ${mid.k})`);
  await page.screenshot({ path: `${SHOTS}/05-combat.png` });

  // 일시정지 메뉴
  await clearLevelups();
  await safeTap('#btnPause');
  await sleep(300);
  check((await state()) === 'paused', '일시정지');
  await page.screenshot({ path: `${SHOTS}/06-pause.png` });
  await page.tap('#btnResume');
  await sleep(200);

  // 보스 소환
  await G(() => {
    const g = window.__game;
    g.enemies.list.slice().forEach((e) => e.type !== 'mini' && g.enemies.kill(e));
    g.debugGrow(5.5);
    g.debugBoss();
    g.noLevelUp = true;
  });
  for (let i = 0; i < 20 && !(await G(() => !!window.__game.enemies.boss)); i++) {
    if ((await state()) === 'levelup') await page.tap('#levelup .card >> nth=0');
    await sleep(250);
  }
  check(await G(() => !!window.__game.enemies.boss), '보스 소환');
  await G(() => {
    const g = window.__game;
    const b = g.enemies.boss;
    // 보스를 화면 안으로 데려옴
    b.x = g.hole.x + 2;
    b.z = g.hole.z - 17;
  });
  await sleep(1800);
  await clearLevelups();
  await sleep(600);
  await page.screenshot({ path: `${SHOTS}/07-boss.png` });

  // 보스를 깎아서 줄인 뒤 삼키기
  await clearLevelups();
  await G(() => window.__game.debugHitBoss(0.97));
  await page.waitForFunction(() => { const g = window.__game; const b = g.enemies.boss; return !b || b.size < g.hole.r * 0.9; }, null, { timeout: 15000 }).catch(() => {});
  await clearLevelups();
  const bs = await G(() => ({ s: window.__game.enemies.boss && window.__game.enemies.boss.size, r: window.__game.hole.r }));
  check(bs.s && bs.s < bs.r, `보스 축소 (크기 ${bs.s && bs.s.toFixed(2)} < 홀 ${bs.r.toFixed(2)})`);
  await page.screenshot({ path: `${SHOTS}/08-boss-shrunk.png` });
  // 보스 쪽으로 조이스틱 이동
  for (let i = 0; i < 16; i++) {
    await clearLevelups();
    const st = await state();
    if (st !== 'play') break;
    const d = await G(() => {
      const g = window.__game;
      const b = g.enemies.boss;
      return b ? Math.atan2(b.z - g.hole.z, b.x - g.hole.x) : null;
    });
    if (d === null) break;
    await drag(195, 600, [d], 500);
  }
  await page.waitForFunction(() => window.__game.state === 'result', null, { timeout: 15000 }).catch(() => {});
  await sleep(2500);
  const cleared = await G(() => window.__game.cleared);
  check(cleared, '보스 삼키고 클리어');
  check(await page.isVisible('#result'), '결과 화면 (클리어)');
  await page.screenshot({ path: `${SHOTS}/09-result-clear.png` });

  await G(() => (window.__game.noLevelUp = false));
  // 다시 하기 -> 사망 -> 결과
  await page.tap('#btnAgain');
  await sleep(500);
  check((await state()) === 'play', '다시 하기');
  await drag(195, 600, [1, 1], 500);
  await clearLevelups();
  await G(() => window.__game.debugKill());
  await page.waitForFunction(() => window.__game.state === 'result', null, { timeout: 20000 });
  await sleep(2500);
  check(await page.isVisible('#result'), '결과 화면 (사망)');
  await page.screenshot({ path: `${SHOTS}/10-result-dead.png` });

  // 타이틀로 (첫 판 이후 출석 모달)
  await page.tap('#btnResTitle');
  await sleep(700);
  check(await page.isVisible('#modal'), '첫 판 결과 뒤 출석 체크 모달');
  await page.screenshot({ path: `${SHOTS}/00-streak.png` });
  const cb = await G(() => window.__game.save.coins);
  await page.tap('#modal [data-act=claimStreak]');
  await sleep(300);
  const c0 = await G(() => window.__game.save.coins);
  check(c0 > cb, `출석 보상 코인 (${cb} -> ${c0})`);
  check(await page.isVisible('#title'), '타이틀 화면 표시');
  await page.screenshot({ path: `${SHOTS}/01-title.png` });
  await page.tap('.nav-b[data-sheet=missions]');
  await sleep(1200);
  const nMis = await page.locator('#sheet .row').count();
  check(nMis >= 3, `일일 미션 표시 (${nMis}행)`);
  await page.screenshot({ path: `${SHOTS}/01b-missions.png` });
  await page.tap('#sheetClose');
  await sleep(200);
  const coins = await G(() => window.__game.save.coins);
  check(coins > 0, `코인 저장 (${coins})`);
  await page.screenshot({ path: `${SHOTS}/11-title-after.png` });

  // 메타 진행: 새 맵 해금 확인, 강화 구매, 새로고침 후 유지
  const beach = await G(() => window.__game.save.maps.beach.unlocked);
  check(beach, '시티 클리어 후 해변 맵 해금');
  const ach = await G(() => Object.keys(window.__game.save.ach).length);
  check(ach >= 2, `업적 달성 (${ach}개)`);
  await page.tap('.nav-b[data-sheet=upg]');
  await sleep(400);
  await page.screenshot({ path: `${SHOTS}/11b-upgrades.png` });
  const before = await G(() => ({ c: window.__game.save.coins, l: window.__game.save.upg.size }));
  await page.tap('#sheet [data-act=upg][data-id=size]');
  await sleep(300);
  const after = await G(() => ({ c: window.__game.save.coins, l: window.__game.save.upg.size }));
  check(after.l === before.l + 1 && after.c < before.c, `강화 구매 (시작 크기 Lv ${after.l}, 코인 ${before.c} -> ${after.c})`);
  await page.tap('#sheetClose');
  await page.tap('.nav-b[data-sheet=ach]');
  await sleep(300);
  await page.screenshot({ path: `${SHOTS}/11c-achievements.png` });
  await page.tap('#sheetClose');
  await page.tap('.nav-b[data-sheet=stats]');
  await sleep(300);
  await page.screenshot({ path: `${SHOTS}/11d-stats.png` });
  await page.tap('#sheetClose');
  await page.tap('.nav-b[data-sheet=skins]');
  await sleep(300);
  await page.screenshot({ path: `${SHOTS}/11e-skins.png` });
  await page.tap('#sheetClose');
  await page.reload({ waitUntil: 'load' });
  await page.waitForFunction(() => window.__game && window.__game.frames > 3, null, { timeout: 30000 });
  await sleep(500);
  const reloaded = await G(() => ({ c: window.__game.save.coins, l: window.__game.save.upg.size, b: window.__game.save.maps.beach.unlocked, v: window.__game.save.ver, st: window.__game.save.stats.runs }));
  check(reloaded.l === after.l && reloaded.c === after.c && reloaded.b && reloaded.v === 2 && reloaded.st >= 2, `새로고침 후 유지 (코인 ${reloaded.c}, 강화 Lv ${reloaded.l}, 판수 ${reloaded.st})`);
  check(!(await page.isVisible('#modal')), '같은 날 재접속 시 출석 모달 없음');

  // 해변 맵 선택 후 플레이
  await page.tap('#mapNext');
  await sleep(1500);
  const sel = await G(() => window.__game.save.sel.map);
  check(sel === 'beach', `맵 선택 (${sel})`);
  await page.screenshot({ path: `${SHOTS}/11f-title-beach.png` });
  await page.tap('#btnStart');
  await sleep(500);
  await drag(195, 600, [0.5, 0.5, 2, 2], 600);
  await clearLevelups();
  check((await G(() => window.__game.world.themeId)) === 'beach', '해변 맵 플레이');
  await page.screenshot({ path: `${SHOTS}/11g-beach.png` });
  await clearLevelups();
  await G(() => window.__game.debugKill());
  await page.waitForFunction(() => window.__game.state === 'result', null, { timeout: 20000 });
  await page.tap('#btnResTitle');
  await sleep(400);

  // 공장 맵 (디버그로 해금) + 데일리 챌린지
  await G(() => {
    const g = window.__game;
    g.save.maps.factory.unlocked = true;
    g.save.sel.map = 'factory';
    g.setWorld('factory');
    g.metaUI.renderTitle();
  });
  await page.tap('#btnStart');
  await sleep(500);
  await drag(195, 600, [3.5, 3.5], 600);
  await clearLevelups();
  await page.screenshot({ path: `${SHOTS}/11h-factory.png` });
  await safeTap('#btnPause');
  await sleep(200);
  await safeTap('#btnToTitle');
  await sleep(400);
  await page.tap('#btnDaily');
  await sleep(300);
  await page.tap('#sheet [data-act=daily]');
  await sleep(600);
  const dly = await G(() => window.__game.run && window.__game.run.daily);
  check(dly && (await state()) === 'play', '데일리 챌린지 시작');
  await page.screenshot({ path: `${SHOTS}/11i-daily.png` });
  await clearLevelups();
  await G(() => {
    window.__game.time = 181;
    window.__game.debugKill();
  });
  await page.waitForFunction(() => window.__game.state === 'result', null, { timeout: 20000 });
  await sleep(400);
  check(await G(() => window.__game.save.daily.challenge.done), '데일리 챌린지 완료 기록');
  await page.screenshot({ path: `${SHOTS}/11j-daily-result.png` });
  await page.tap('#btnResTitle');
  await sleep(300);

  // 구버전 저장 데이터 마이그레이션
  await G(() => {
    localStorage.removeItem('void-maw-save');
    localStorage.setItem('void-maw-save-v1', JSON.stringify({ coins: 77, upg: { size: 2, hp: 1 }, best: { time: 200, size: 9, kills: 50, cleared: true }, muted: false }));
  });
  await page.reload({ waitUntil: 'load' });
  await page.waitForFunction(() => window.__game && window.__game.frames > 3, null, { timeout: 30000 });
  const mig = await G(() => ({ v: window.__game.save.ver, c: window.__game.save.coins, s: window.__game.save.upg.size, b: window.__game.save.maps.beach.unlocked }));
  check(mig.v === 2 && mig.c >= 77 && mig.s === 2 && mig.b, `v1 -> v2 마이그레이션 (코인 ${mig.c}, 해변 ${mig.b})`);
  if (await page.isVisible('#modal')) await page.tap('#modal [data-act=claimStreak]');
  // 깨진 저장 데이터: 백업(void-maw-save-bak)에서 복구 + 알림
  await G(() => localStorage.setItem('void-maw-save', '{broken json'));
  await page.reload({ waitUntil: 'load' });
  await page.waitForFunction(() => window.__game && window.__game.frames > 3, null, { timeout: 30000 });
  await sleep(900);
  const rest = await G(() => ({ v: window.__game.save.ver, coins: window.__game.save.coins, toast: document.querySelector('#toast').textContent }));
  check(rest.v === 2 && rest.coins >= 77 && /복구/.test(rest.toast), `손상된 저장 데이터 백업 복구 + 알림 (코인 ${rest.coins}, "${rest.toast}")`);
  await G(() => {
    localStorage.setItem('void-maw-save', '{broken');
    localStorage.setItem('void-maw-save-bak', 'also broken');
  });
  await page.reload({ waitUntil: 'load' });
  await page.waitForFunction(() => window.__game && window.__game.frames > 3, null, { timeout: 30000 });
  await sleep(900);
  const fail = await G(() => ({ v: window.__game.save.ver, toast: document.querySelector('#toast').textContent, st: window.__game.state }));
  check(fail.v === 2 && /복구하지 못함/.test(fail.toast), `백업도 손상 시 초기화 + "${fail.toast}"`);
  if (fail.st === 'play') {
    await safeTap('#btnPause');
    await sleep(300);
    await safeTap('#btnToTitle');
    await sleep(500);
  }
  if (await page.isVisible('#modal')) await page.tap('#modal [data-act=claimStreak]');

  // 작은 화면 레이아웃
  await page.setViewportSize({ width: 360, height: 640 });
  await sleep(500);
  await page.screenshot({ path: `${SHOTS}/12-title-360.png` });
  await page.tap('#btnStart');
  await sleep(400);
  await G(() => window.__game.debugXp(window.__game.xpNeed + 1));
  await sleep(700);
  await page.screenshot({ path: `${SHOTS}/13-levelup-360.png` });
  await G(() => window.__game.debugKill());
  await page.waitForFunction(() => window.__game.state === 'result', null, { timeout: 20000 });
  await sleep(2500);
  await page.screenshot({ path: `${SHOTS}/14-result-360.png` });
  const fit = await G(() => {
    const b = document.querySelector('#btnResTitle').getBoundingClientRect();
    return b.bottom <= window.innerHeight && b.top >= 0;
  });
  check(fit, '360x640 결과 화면 버튼이 화면 안에 보임');

  // 사운드 믹스 계측 (OfflineAudioContext 렌더)
  const snd = await G(() => window.__audio.measure());
  for (const [k, v] of Object.entries(snd.sfx)) console.log(`     sfx ${k.padEnd(10)} peak ${v.peakDb}dB  rms ${v.rmsDb}dB  <150Hz ${(v.low * 100).toFixed(0)}%`);
  for (const k of ['bgm_normal', 'bgm_boss', 'mix']) console.log(`     ${k.padEnd(14)} peak ${snd[k].peakDb}dB  rms ${snd[k].rmsDb}dB  <150Hz ${(snd[k].low * 100).toFixed(0)}%`);
  check(snd.mix.peakDb <= -1.5 && snd.mix.peakDb >= -6, `마스터 피크 약 -3dBFS (${snd.mix.peakDb})`);
  const main = ['pop_mid', 'hurt', 'boom', 'levelUp', 'sizeUp', 'pulse', 'kill', 'eat_bot'];
  check(main.every((k) => snd.sfx[k].rmsDb >= -26 && snd.sfx[k].rmsDb <= -16), `주요 효과음 RMS -24~-20dB 근처 (${main.map((k) => snd.sfx[k].rmsDb).join(', ')})`);
  check(Object.values(snd.sfx).every((v) => v.rmsDb >= -35), '모든 효과음 RMS -35dB 이상');
  check(snd.bgm_normal.low <= 0.35 && snd.bgm_boss.low <= 0.35, `BGM 150Hz 이하 비중 35% 이하 (${snd.bgm_normal.low}, ${snd.bgm_boss.low})`);
  check(snd.sfx.pop_big.low <= 0.6, `삼키기 "쿵" 에 중역 배음 (150Hz 이하 ${snd.sfx.pop_big.low})`);

  const fps = await G(async () => {
    const f0 = window.__game.frames;
    await new Promise((r) => setTimeout(r, 1000));
    return window.__game.frames - f0;
  });
  console.log(`headless fps ~ ${fps}`);
  check(errors.length === 0, `콘솔 에러 0개 (${errors.length})`);
  if (errors.length) console.log(errors.slice(0, 10).join('\n'));
} catch (e) {
  console.error('FAIL', e);
  console.log(errors.slice(0, 10).join('\n'));
  failed = true;
} finally {
  if (browser) await browser.close();
  server.kill();
}
process.exit(failed ? 1 : 0);
