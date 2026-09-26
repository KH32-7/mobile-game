// 밸런스 봇: 게임 안에서 조이스틱 입력(__input)을 흉내 내는 탐욕 봇으로 해금 속도를 측정
// 사용법: npm run build && node scripts/balance-bot.mjs  (STAGE=0..4, MIN=게임 시간 분, PORT)
// 봇은 사람처럼 발판을 밟아서만 행동함(재료 적재, 조리대 투입, 벨트 투입, 돈 수거, 해금, 업그레이드 구매).
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';

const PORT = Number(process.env.PORT || 4828);
const BASE = `http://localhost:${PORT}/`;
const STAGE = Number(process.env.STAGE || 0);
const MIN = Number(process.env.MIN || 15);
const exe = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '/opt/pw-browsers/chromium/chrome-linux/chrome'].find((p) => existsSync(p));

let server = null;
async function ensureServer() {
  try {
    if ((await fetch(BASE)).ok) return;
  } catch {
    /* 없음 */
  }
  server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' });
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 200));
    try {
      if ((await fetch(BASE)).ok) return;
    } catch {
      /* 대기 */
    }
  }
  throw new Error('preview 서버 시작 실패');
}

await ensureServer();
const b = await chromium.launch({ executablePath: exe, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
try {
  const page = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 })).newPage();
  page.on('pageerror', (e) => console.log('[pageerror]', e.message));
  await page.goto(BASE + '?debug');
  await page.waitForTimeout(800);
  await page.locator('#t-start').click();
  await page.waitForTimeout(300);
  await page.evaluate((stage) => {
    const app = __game;
    if (stage > 0) {
      app.p.stage = stage;
      app.p.run = { money: 0, earned: 0, done: [], paid: {}, upg: {}, st: {}, cr: {}, sinkQ: 0, belts: {}, stack: [], seats: {}, hist: [0.6, 0.6, 0.6, 0.6, 0.6, 0.6], combo: 0, rushT: 0, time: 0, cust: 0, plates: 0, bestCombo: 0, staff: [] };
      app.game.loadStage();
    }
    app.p.tut = 6;
    app.p.settings.shadows = false;
    const inp = __input;
    const log = (window.__botlog = []);
    let tgt = null;
    let stay = 0;
    let path = [];
    let think = 0;
    let lastDone = 0;
    let upgT = 0;
    const g = () => app.game;
    const UP = ['cap', 'cook', 'speed', 'plates', 'belt', 'sspeed', 'scap'];
    function go(x, z, why, until) {
      const G = g();
      tgt = { x, z, why, until };
      path = G.nav.path(G.chef.x, G.chef.z, x, z);
      stay = 0;
    }
    function choose() {
      const G = g();
      const c = G.chef;
      const room = G.chefCap() - c.stack.length - c.incoming;
      const pad = G.pads[0];
      if (pad && G.run.money + pad.paid >= pad.u.cost) return go(pad.x, pad.z, 'pad', () => G.done.size > lastDone);
      if (G.upgradeBuilt && G.time - upgT > 30) {
        upgT = G.time;
        const L = G.lay.upgrade;
        const want = UP.find((id) => {
          const u = window.__UPG.find((x) => x.id === id);
          const lvl = G.run.upg[id] || 0;
          return lvl < u.max && (!u.needStaff || G.staff.length) && G.run.money >= app.upgCost(u) * 1.4 && (!pad || G.run.money - app.upgCost(u) > (pad.u.cost - pad.paid) * 0.3);
        });
        if (want) return go(L.x, L.z, 'upgrade:' + want, () => false);
      }
      const dishes = c.stack.filter((i) => i.k === 'dish');
      if (dishes.length) {
        const bb = G.belts.filter((x) => x.built && x.free() > 0).sort((a, b2) => b2.free() - a.free())[0];
        if (bb) return go(bb.feed.x, bb.feed.z, 'feed', () => !c.stack.some((i) => i.k === 'dish') || bb.free() === 0);
      }
      if (c.stack.some((i) => i.k === 'dirty') && G.sink.built && room <= 0) return go(G.sink.pad.x, G.sink.pad.z, 'sink', () => !c.stack.some((i) => i.k === 'dirty'));
      const near = (a, b2) => Math.hypot(a.zone.x - c.x, a.zone.z - c.z) - Math.hypot(b2.zone.x - c.x, b2.zone.z - c.z);
      const ms = G.seats.filter((s) => s.money > 0).sort(near)[0];
      if (ms) return go(ms.zone.x, ms.zone.z, 'money', () => ms.money <= 0 && (ms.dirty === 0 || G.chefCap() - c.stack.length <= 0 || (ms.cust && ms.cust.state !== 'leave')));
      if (G.sink.built && room > 0) {
        const ds = G.seats.filter((s) => s.dirty > 0 && !s.cust).sort(near)[0];
        if (ds) return go(ds.zone.x, ds.zone.z, 'dirty', () => ds.dirty === 0 || G.chefCap() - c.stack.length <= 0);
      }
      if (c.stack.some((i) => i.k === 'dirty') && G.sink.built) return go(G.sink.pad.x, G.sink.pad.z, 'sink', () => !c.stack.some((i) => i.k === 'dirty'));
      const dem = G.demand();
      const ing = c.stack.filter((i) => i.k === 'ing');
      if (ing.length) {
        const st = Object.values(G.stations).find((s) => s.built && s.ing === ing[ing.length - 1].id);
        return go(st.padIn.x, st.padIn.z, 'in', () => !c.stack.some((i) => i.k === 'ing' && i.id === st.ing) || st.inp >= 10);
      }
      const outs = Object.values(G.stations)
        .filter((s) => s.built && s.out > 0 && (dem[s.menu] || 0) > 0)
        .sort((a, b2) => (dem[b2.menu] || 0) - (dem[a.menu] || 0));
      if (outs.length && room > 0) return go(outs[0].padOut.x, outs[0].padOut.z, 'out', () => outs[0].out === 0 || G.chefCap() - c.stack.length <= 0);
      const db = G.belts.find((x) => x.built && G.driedCount(x) > 0);
      if (db && room > 0) return go(db.trash.x, db.trash.z, 'trash', () => G.driedCount(db) === 0);
      const need = Object.values(G.stations)
        .filter((s) => s.built && s.inp + s.out < 4 && s.crateN > 0)
        .sort((a, b2) => (dem[b2.menu] || 0) - (dem[a.menu] || 0) || a.inp - b2.inp)[0];
      if (need && room > 0) return go(need.crate.pad.x, need.crate.pad.z, 'crate', () => G.chefCap() - c.stack.length <= 0 || need.crateN === 0);
      tgt = null;
    }
    app.bot = (dt) => {
      const G = g();
      if (G.done.size > lastDone) {
        const id = G.stage.unlocks.filter((u) => G.done.has(u.id)).map((u) => u.id).slice(-1)[0];
        log.push(`${(G.run.time / 60).toFixed(1)}분  해금 ${G.done.size}/${G.stage.unlocks.length} (${id})  별 ${G.stars().toFixed(1)}`);
        lastDone = G.done.size;
        tgt = null;
      }
      // 업그레이드 패널이 열리면 원하는 항목 구매 후 닫기 (실제 UI 버튼 경로)
      if (app.ui.panel) {
        if (app.ui.panel.cls === 'upgrade' && tgt && tgt.why.startsWith('upgrade:')) {
          const id = tgt.why.split(':')[1];
          if (app.buyUpgrade(id)) log.push(`   업그레이드 ${id} Lv${G.run.upg[id]}`);
          tgt = null;
        }
        app.ui.close();
      }
      think -= dt;
      if (!tgt || (stay > 0 && (tgt.until() || stay > 4))) {
        if (think <= 0) {
          think = 0.15;
          choose();
        }
      }
      if (!tgt) {
        inp.active = false;
        inp.mag = 0;
        return;
      }
      const c = G.chef;
      const p = path[0] || tgt;
      const dx = p.x - c.x;
      const dz = p.z - c.z;
      const d = Math.hypot(dx, dz);
      if (path.length && d < 0.25) path.shift();
      if (!path.length && d < 0.18) {
        inp.active = false;
        inp.mag = 0;
        stay += dt;
        return;
      }
      inp.active = true;
      inp.dx = dx / d;
      inp.dy = dz / d;
      inp.mag = d < 0.5 ? 0.5 : 1;
    };
    app.speed = 5;
  }, STAGE);
  let lastT = 0;
  const t0 = Date.now();
  while (lastT < MIN && Date.now() - t0 < 40 * 60 * 1000) {
    await page.waitForTimeout(8000);
    const s = await page.evaluate(() => {
      const G = __game.game;
      return { l: __botlog.splice(0), t: G.run.time / 60, m: G.run.money | 0, e: G.run.earned | 0, done: G.done.size, cust: G.run.cust, stars: G.stars().toFixed(1) };
    });
    s.l.forEach((x) => console.log(x));
    lastT = s.t;
    console.log(`  [${s.t.toFixed(1)}분] 돈 ${s.m}  누적 ${s.e}  분당 ${(s.e / Math.max(0.1, s.t)).toFixed(0)}  손님 ${s.cust}  별 ${s.stars}`);
  }
} finally {
  await b.close();
  if (server) server.kill();
}
