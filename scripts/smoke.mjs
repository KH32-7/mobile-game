// 스모크 테스트: vite preview 결과를 모바일 뷰포트로 열어 실제 터치 입력으로 전체 루프 검증
// 사용법: npm run build && node scripts/smoke.mjs  (PORT 환경변수로 포트 변경)
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync, existsSync } from 'node:fs';

const PORT = Number(process.env.PORT || 4821);
const BASE = `http://localhost:${PORT}/`;
const SHOTS = 'shots';
mkdirSync(SHOTS, { recursive: true });
const exe = process.env.CHROME || ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '/opt/pw-browsers/chromium/chrome-linux/chrome'].find((p) => existsSync(p));

let server = null;
async function ensureServer() {
  try {
    const r = await fetch(BASE);
    if (r.ok && (await r.text()).includes('스시 루프')) return;
  } catch {
    /* 서버 없음 */
  }
  server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' });
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 200));
    try {
      const r = await fetch(BASE);
      if (r.ok) return;
    } catch {
      /* 대기 */
    }
  }
  throw new Error('preview 서버 시작 실패');
}

const errors = [];
const log = (...a) => console.log('[smoke]', ...a);
function assert(cond, msg) {
  if (!cond) throw new Error('검증 실패: ' + msg);
  log('OK', msg);
}

async function newPage(browser, w = 390, h = 844, init = null) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  if (init) await ctx.addInitScript(init);
  const page = await ctx.newPage();
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`[${w}x${h}] ${m.text()}`);
  });
  page.on('pageerror', (e) => errors.push(`[${w}x${h}] ${e}`));
  const cdp = await ctx.newCDPSession(page);
  const touch = (type, x, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y, id: 1 }] });
  page.touch = touch;
  // 조이스틱으로 목표 월드 좌표까지 걷기 (화면 오른쪽 = +x, 아래 = +z)
  // 게임의 길찾기 경로(웨이포인트)를 따라 조이스틱을 기울임
  page.walkTo = async (tx, tz, tol = 0.3, timeout = 60000) => {
    const ox = w / 2;
    const oy = h * 0.7;
    const pts = await page.evaluate(([x, z]) => {
      const c = __game.game.chef;
      return __game.game.nav.path(c.x, c.z, x, z);
    }, [tx, tz]);
    await touch('touchStart', ox, oy);
    const t0 = Date.now();
    let ok = false;
    let i = 0;
    while (Date.now() - t0 < timeout && i < pts.length) {
      const last = i === pts.length - 1;
      const p = last ? { x: tx, z: tz } : pts[i];
      const c = await page.evaluate(() => ({ x: __game.game.chef.x, z: __game.game.chef.z, panel: !!__game.ui.panel }));
      if (c.panel) {
        // 지나가다 업그레이드 패널이 열리면 닫고 계속
        await touch('touchEnd', 0, 0);
        if (!(await page.locator('.modal.upgrade .x').count())) break; // 결과 화면 등은 그대로 둠
        const bx = await page.locator('.modal .x').first().boundingBox();
        if (bx) await page.tapAt(bx.x + bx.width / 2, bx.y + bx.height / 2);
        await page.waitForTimeout(300);
        await touch('touchStart', ox, oy);
        continue;
      }
      const dx = p.x - c.x;
      const dz = p.z - c.z;
      const d = Math.hypot(dx, dz);
      if (d < (last ? tol : 0.4)) {
        i++;
        if (last) ok = true;
        continue;
      }
      if (d < 1.8) {
        // 목표 근처: 짧게 기울였다가 멈추기 (저프레임 환경에서 지나치지 않도록)
        await touch('touchMove', ox + (dx / d) * 14, oy + (dz / d) * 14);
        await page.waitForTimeout(50);
        await touch('touchMove', ox, oy);
        await page.waitForTimeout(40);
      } else {
        await touch('touchMove', ox + (dx / d) * 55, oy + (dz / d) * 55);
        await page.waitForTimeout(30);
      }
    }
    await touch('touchEnd', 0, 0);
    const c = await page.evaluate(() => ({ x: +__game.game.chef.x.toFixed(2), z: +__game.game.chef.z.toFixed(2), zone: __game.game.chef.zone?.type, fps: +(1000 / (__perf.frame || 1)).toFixed(1) }));
    if (!ok || process.env.VERBOSE) log('walkTo', ok ? '도착' : '실패', JSON.stringify({ tx, tz, ...c, pts: pts.length, ms: Date.now() - t0 }));
    return ok;
  };
  page.g = (fn) => page.evaluate(fn);
  page.waitFor = async (fn, timeout = 20000, label = '') => {
    const t0 = Date.now();
    while (Date.now() - t0 < timeout) {
      if (await page.evaluate(fn)) return true;
      await page.waitForTimeout(120);
    }
    log('시간 초과:', label);
    return false;
  };
  page.tapAt = async (x, y) => {
    await touch('touchStart', x, y);
    await page.waitForTimeout(30);
    await touch('touchEnd', 0, 0);
  };
  page.tapSel = async (sel) => {
    const b = await page.locator(sel).first().boundingBox();
    if (!b) throw new Error('요소 없음: ' + sel);
    await page.tapAt(b.x + b.width / 2, b.y + b.height / 2);
    await page.waitForTimeout(250);
  };
  return page;
}

const shot = (page, name) => page.screenshot({ path: `${SHOTS}/${name}.png` });

async function main() {
  await ensureServer();
  const browser = await chromium.launch({ executablePath: exe, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  try {
    // ---------- 1. 첫 실행 + 코어 루프 ----------
    if (!process.env.SKIP1) {
    const page = await newPage(browser);
    await page.goto(BASE);
    await page.waitForTimeout(1200);
    await shot(page, '01-title');
    assert(await page.locator('#t-start').isVisible(), '타이틀 화면과 시작 버튼 표시');
    await page.tapSel('#t-start');
    await page.waitForTimeout(600);
    await shot(page, '02-start-tutorial');
    assert(await page.g(() => !__game.paused), '게임 시작 (일시정지 해제)');

    const lay = await page.g(() => {
      const g = __game.game;
      const st = Object.values(g.stations).find((s) => s.built);
      return { crate: st.crate.pad, pin: st.padIn, pout: st.padOut, feed: g.belts[0].feed, menu: st.menu };
    });
    // 생선 적재
    await page.walkTo(lay.crate.x, lay.crate.z);
    await page.waitFor(() => __game.game.chef.stack.length >= 4, 6000, '적재');
    await shot(page, '03-stack');
    assert((await page.g(() => __game.game.chef.stack.filter((i) => i.k === 'ing').length)) >= 3, '부두에서 생선을 등에 쌓음');
    // 조리대 투입
    await page.walkTo(lay.pin.x, lay.pin.z);
    await page.waitFor(() => __game.game.chef.stack.length === 0, 6000, '투입');
    assert(await page.g(() => Object.values(__game.game.stations).some((s) => s.inp + s.out > 0)), '조리대에 재료 투입');
    await page.waitFor(() => Object.values(__game.game.stations).some((s) => s.out >= 2), 60000, '조리');
    await shot(page, '04-cooking');
    assert(await page.g(() => Object.values(__game.game.stations).some((s) => s.out >= 1)), '초밥 접시 자동 생산');
    // 완성 접시 들기
    await page.walkTo(lay.pout.x, lay.pout.z);
    await page.waitFor(() => __game.game.chef.stack.some((i) => i.k === 'dish'), 5000, '접시 들기');
    await page.waitForTimeout(600);
    assert(await page.g(() => __game.game.chef.stack.some((i) => i.k === 'dish')), '완성 접시를 들어 올림');
    // 벨트 투입
    await page.walkTo(lay.feed.x, lay.feed.z);
    await page.waitFor(() => !__game.game.chef.stack.some((i) => i.k === 'dish'), 8000, '벨트 투입');
    await shot(page, '05-belt');
    assert(await page.g(() => __game.game.belts[0].slots.some((s) => s.item)), '접시가 벨트에 올라감');
    // 손님 식사 -> 돈
    const ate = await page.waitFor(() => __game.game.seats.some((s) => s.money > 0), 120000, '손님 식사');
    await shot(page, '06-customer-ate');
    assert(ate, '손님이 원하는 접시를 집어 먹고 돈을 두고 감');
    const seat = await page.g(() => {
      const s = __game.game.seats.find((x) => x.money > 0);
      return { x: s.zone.x, z: s.zone.z };
    });
    const m0 = await page.g(() => __game.game.run.money);
    await page.walkTo(seat.x, seat.z);
    await page.waitFor(() => __game.game.run.money > 0, 4000, '돈 수거');
    await page.waitForTimeout(250);
    await shot(page, '07-money');
    assert((await page.g(() => __game.game.run.money)) > m0, '돈 더미를 밟아 수거');
    // 해금 발판: 돈이 모자라면 실제 입력으로 루프를 더 돌림
    const tStart = Date.now();
    while (Date.now() - tStart < 240000) {
      const st = await page.g(() => {
        const g = __game.game;
        const pad = g.pads[0];
        const s = Object.values(g.stations).find((x) => x.built);
        const seat = g.seats.find((x) => x.money > 0);
        return {
          enough: g.run.money + pad.paid >= pad.u.cost,
          dish: g.chef.stack.some((i) => i.k === 'dish'),
          ing: g.chef.stack.some((i) => i.k === 'ing'),
          out: s.out,
          inp: s.inp,
          seat: seat ? seat.zone : null,
          free: g.belts[0].free(),
        };
      });
      if (st.enough) break;
      if (st.seat) await page.walkTo(st.seat.x, st.seat.z);
      else if (st.dish && st.free > 0) {
        await page.walkTo(lay.feed.x, lay.feed.z);
        await page.waitFor(() => !__game.game.chef.stack.some((i) => i.k === 'dish'), 6000, '투입');
      } else if (st.ing) {
        await page.walkTo(lay.pin.x, lay.pin.z);
        await page.waitFor(() => !__game.game.chef.stack.some((i) => i.k === 'ing'), 4000, '투입');
      } else if (st.out > 0) {
        await page.walkTo(lay.pout.x, lay.pout.z);
        await page.waitFor(() => __game.game.chef.stack.some((i) => i.k === 'dish'), 3000, '들기');
        await page.waitForTimeout(800);
      } else if (st.inp < 2) {
        await page.walkTo(lay.crate.x, lay.crate.z);
        await page.waitFor(() => __game.game.chef.stack.length >= 3, 4000, '적재');
      } else await page.waitForTimeout(800);
    }
    const pad = await page.g(() => ({ x: __game.game.pads[0].x, z: __game.game.pads[0].z, id: __game.game.pads[0].u.id }));
    await page.walkTo(pad.x, pad.z, 0.3);
    await page.waitFor(() => __game.game.done.size >= 1, 8000, '해금');
    await page.waitForTimeout(350);
    await shot(page, '08-unlock');
    assert(await page.g(() => __game.game.done.size >= 1), `해금 발판으로 새 시설 해금 (${pad.id})`);

    // 메뉴 패널들
    for (const [sel, name] of [['#b-mission', '09-missions'], ['#b-attend', '10-attend'], ['#b-dex', '11-dex'], ['#b-cos', '12-costume'], ['#b-ach', '13-ach'], ['#b-pause', '14-pause']]) {
      await page.tapSel(sel);
      await page.waitForTimeout(300);
      await shot(page, name);
      assert(await page.locator('.modal.show').isVisible(), `${name} 패널 열림`);
      await page.tapSel('.modal .x');
      await page.waitForTimeout(250);
    }

    // 새로고침 후 상태 유지
    await page.g(() => __game.save());
    const before = await page.g(() => ({ money: Math.floor(__game.game.run.money), done: __game.game.done.size, plates: __game.p.stats.plates, tut: __game.p.tut }));
    await page.reload();
    await page.waitForTimeout(1200);
    const after = await page.g(() => ({ money: Math.floor(__game.game.run.money), done: __game.game.done.size, plates: __game.p.stats.plates, tut: __game.p.tut }));
    assert(after.done === before.done && after.money === before.money && after.plates === before.plates, `새로고침 후 상태 유지 ${JSON.stringify(after)}`);
    await page.context().close();
    }

    // ---------- 2. 디버그: 오프라인 수익 + 식당 이전 ----------
    const p2 = await newPage(browser);
    await p2.goto(BASE + '?debug');
    await p2.waitForTimeout(1000);
    await p2.tapSel('#t-start');
    await p2.waitForTimeout(500);
    // 돈 추가 후 해금 발판 3개는 실제로 밟고, 나머지는 디버그 해금 버튼
    for (let i = 0; i < 3; i++) {
      const info = await p2.g(() => {
        const g = __game.game;
        const pad = g.pads[0];
        return { x: pad.x, z: pad.z, n: g.done.size };
      });
      await p2.tapSel('.debug [data-a="money"]');
      await p2.walkTo(info.x, info.z, 0.3);
      await p2.waitFor(`__game.game.done.size > ${info.n}`, 20000, '디버그 해금');
    }
    assert(await p2.g(() => __game.game.done.size >= 3), '디버그 돈으로 해금 발판 3개 밟아서 해금');
    await p2.tapSel('.debug [data-a="unlock"]');
    await p2.waitForTimeout(1500);
    await shot(p2, '15-stage1-full');
    assert(await p2.g(() => __game.game.pads[0]?.u.t === 'next'), '1호점 모든 시설 해금 (실제 발판 밟기)');
    assert(await p2.g(() => __game.game.staff.length >= 2), '직원 고용됨');
    await p2.waitForTimeout(3000);
    await shot(p2, '16-staff-working');
    // 오프라인 수익: Date 조작 (3시간 뒤)
    await p2.g(() => __game.save());
    await p2.evaluate(() => {
      const off = 3 * 3600 * 1000;
      const real = Date.now.bind(Date);
      Date.now = () => real() + off;
    });
    await p2.g(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });
    // visibilitychange 로는 hidden 이 아니므로 직접 체크 호출
    await p2.g(() => __game.checkOffline(Date.now() - 3 * 3600 * 1000));
    await p2.waitForTimeout(400);
    await shot(p2, '17-offline');
    assert(await p2.locator('.modal.offline').isVisible(), '오프라인 수익 팝업');
    const mOff = await p2.g(() => __game.game.run.money);
    await p2.tapSel('#o-2x');
    await p2.waitForTimeout(300);
    assert((await p2.g(() => __game.game.run.money)) > mOff, '오프라인 수익 2배 수령');
    // 다음 식당 이전
    await p2.tapSel('.debug [data-a="money"]');
    const np = await p2.g(() => ({ x: __game.game.pads[0].x, z: __game.game.pads[0].z }));
    await p2.walkTo(np.x, np.z, 0.3);
    await p2.waitFor(() => !!document.querySelector('.modal.result'), 8000, '결과 화면');
    await p2.waitForTimeout(500);
    await shot(p2, '18-result');
    assert(await p2.locator('.modal.result').isVisible(), '식당 이전 결과 화면');
    await p2.tapSel('#r-next');
    await p2.waitForTimeout(1200);
    await shot(p2, '19-stage2');
    assert(await p2.g(() => __game.p.stage === 1 && __game.p.records.length === 1), '2호점(쇼핑몰)으로 이전 + 이전 식당 기록 저장');
    await p2.reload();
    await p2.waitForTimeout(1000);
    assert(await p2.g(() => __game.p.stage === 1), '새로고침 후 2호점 유지');
    await p2.context().close();

    // ---------- 3. 다른 해상도 레이아웃 ----------
    for (const [w, h] of [
      [360, 640],
      [430, 932],
    ]) {
      const p3 = await newPage(browser, w, h);
      await p3.goto(BASE);
      await p3.waitForTimeout(900);
      await shot(p3, `20-title-${w}x${h}`);
      await p3.tapSel('#t-start');
      await p3.waitForTimeout(800);
      await shot(p3, `21-game-${w}x${h}`);
      await p3.context().close();
    }

    // ---------- 4. 손상 저장 데이터 ----------
    const p4 = await newPage(browser, 390, 844, () => {
      try {
        if (!sessionStorage.getItem('x')) {
          localStorage.setItem('sushi-loop-save', '{broken json');
          sessionStorage.setItem('x', '1');
        }
      } catch {}
    });
    await p4.goto(BASE);
    await p4.waitForTimeout(1000);
    assert(await p4.g(() => __game.p.stage === 0), '손상된 저장 데이터를 안전하게 초기화');
    await p4.context().close();

    assert(errors.length === 0, '콘솔 에러 0개' + (errors.length ? '\n' + errors.join('\n') : ''));
    log('모든 검증 통과');
  } finally {
    await browser.close();
    if (server) server.kill();
  }
}

main().catch((e) => {
  console.error(e);
  if (errors.length) console.error(errors.join('\n'));
  if (server) server.kill();
  process.exit(1);
});
