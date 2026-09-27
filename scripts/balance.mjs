// 밸런스 검증 봇 (합격 기준용)
// requestAnimationFrame 을 1/60초 고정 스텝 가상 시간으로 돌리고, 실제 Input 핸들러에 포인터 이벤트를 보내 조작함.
// 사람처럼: REACT 프레임마다 한 번만 판단(기본 12 = 0.2초), 조이스틱 크기 MAG(기본 0.85), 카드는 무작위.
//   node scripts/balance.mjs [runs=3] [style=casual|skilled|wander] [--upg=N]  (환경변수 REACT, MAG, MAP)
// 판이 끝날 때마다 번 코인으로 가장 싼 강화를 사서 다음 판 진행. --upg=N 이면 첫 판 전에 강화 N레벨을 미리 삼.
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import net from 'node:net';

const args = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const flags = Object.fromEntries(process.argv.slice(2).filter((a) => a.startsWith('--')).map((a) => a.slice(2).split('=')));
const RUNS = parseInt(args[0] || '3', 10);
const STYLE = args[1] || 'casual';
const REACT = +(process.env.REACT || 12);
const MAG = +(process.env.MAG || 0.85);
const PRE_UPG = +(flags.upg || 0);
const MAP = process.env.MAP || null;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const PORT = await new Promise((res) => {
  const s = net.createServer();
  s.listen(0, () => {
    const p = s.address().port;
    s.close(() => res(p));
  });
});
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' });
for (let i = 0; i < 80; i++) {
  try {
    if ((await fetch(`http://localhost:${PORT}/`)).ok) break;
  } catch (e) {
    /* 대기 */
  }
  await sleep(250);
}

const VIRTUAL_TIME = `(() => {
  let vt = 1000; let q = [];
  performance.now = () => vt;
  window.requestAnimationFrame = (cb) => { q.push(cb); return q.length; };
  window.__vtStep = (n) => { for (let i = 0; i < n; i++) { const l = q; q = []; vt += 1000 / 60; for (const cb of l) { try { cb(vt); } catch (e) { console.error(e); } } } };
})();`;

const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-background-timer-throttling', '--disable-renderer-backgrounding'] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await ctx.addInitScript(VIRTUAL_TIME);
await ctx.addInitScript(() => {
  try {
    if (!localStorage.getItem('void-maw-save')) localStorage.setItem('void-maw-save', JSON.stringify({ ver: 2, tutorialDone: true }));
  } catch (e) {
    /* 무시 */
  }
});
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
await page.goto(`http://localhost:${PORT}/?debug&norender&title`);
await page.waitForFunction(() => window.__game && window.__vtStep, null, { timeout: 90000 });
await page.evaluate(() => window.__vtStep(5));
if (PRE_UPG) {
  await page.evaluate((n) => {
    const g = window.__game;
    g.save.coins += 100000;
    for (let k = 0; k < n; k++) {
      const u = window.__meta.nextUpgrade();
      if (u) window.__meta.buyUpgrade(u.id);
    }
    g.save.coins = 0;
  }, PRE_UPG);
}

await page.evaluate(
  ([STYLE, REACT, MAG]) => {
    const app = document.querySelector('#app');
    const JX = 195;
    const JY = 640;
    const R = 56;
    let down = false;
    const pe = (type, x, y) => (type === 'pointerdown' ? app : window).dispatchEvent(new PointerEvent(type, { pointerId: 7, pointerType: 'touch', clientX: x, clientY: y, bubbles: true, isPrimary: true }));
    const P = (window.__pl = {});
    const decide = () => {
      const g = window.__game;
      const h = g.hole;
      const w = g.world;
      const fit = h.r * 0.94;
      if (STYLE === 'wander') {
        P.wt = (P.wt || 0) - 1;
        if (P.wt <= 0) {
          P.wt = 8 + Math.random() * 10;
          P.wa = Math.random() * 6.28;
        }
        let x = Math.cos(P.wa);
        let z = Math.sin(P.wa);
        if (Math.abs(h.x) > 80) x = -Math.sign(h.x);
        if (Math.abs(h.z) > 80) z = -Math.sign(h.z);
        return [x, z];
      }
      let best = null;
      let bs = -1e9;
      const q = w.query(h.x, h.z, STYLE === 'casual' ? 14 : 24, []);
      for (const i of q) {
        if (w.pState[i] !== 0 || w.pSize[i] >= fit) continue;
        const d = Math.hypot(w.pX[i] - h.x, w.pZ[i] - h.z);
        const sc = STYLE === 'casual' ? -d : w.pSize[i] * 2 - d * 0.25;
        if (sc > bs) {
          bs = sc;
          best = [w.pX[i], w.pZ[i], d];
        }
      }
      for (const e of g.enemies.list) {
        if (e.size >= fit) continue;
        const d = Math.hypot(e.x - h.x, e.z - h.z);
        const sc = STYLE === 'casual' ? -d + 1 : e.size * 2.5 - d * 0.25;
        if (sc > bs) {
          bs = sc;
          best = [e.x, e.z, d];
        }
      }
      let x = 0;
      let z = 0;
      if (best) {
        x = (best[0] - h.x) / (best[2] || 1);
        z = (best[1] - h.z) / (best[2] || 1);
      } else {
        x = -h.x;
        z = -h.z;
        const d = Math.hypot(x, z) || 1;
        x /= d;
        z /= d;
      }
      const av = STYLE === 'casual' ? 1.0 : 2.5;
      for (const e of g.enemies.list) {
        if (e.size < fit) continue;
        const dx = h.x - e.x;
        const dz = h.z - e.z;
        const d = Math.hypot(dx, dz) || 1;
        const RR = h.r + e.size + av;
        if (d < RR) {
          const k = STYLE === 'casual' ? 4 : 7.5;
          x += ((dx / d) * k * (RR - d)) / RR;
          z += ((dz / d) * k * (RR - d)) / RR;
        }
      }
      if (STYLE !== 'casual')
        for (const m of g.enemies.marks) {
          const dx = h.x - m.x;
          const dz = h.z - m.z;
          const d = Math.hypot(dx, dz);
          if (d < m.r + h.r + 1) {
            x += (dx / (d || 1)) * 2;
            z += (dz / (d || 1)) * 2;
          }
        }
      const d = Math.hypot(x, z) || 1;
      return [x / d, z / d];
    };
    let frame = 0;
    P.reset = () => {
      Object.assign(P, { cards: 0, minHp: 1e9, maxAlive: 0, on: [], marks: {}, busy: false, done: false, boss: null, miniDead: null, miniEat: null, choices: [] });
      frame = 0;
      down = false;
    };
    P.reset();
    P.tick = () => {
      const g = window.__game;
      if (P.busy || P.done) return;
      if (g.state === 'levelup') {
        if (down) {
          pe('pointerup', JX, JY);
          down = false;
        }
        P.busy = true;
        setTimeout(() => {
          const cards = [...document.querySelectorAll('#levelup .card')];
          const pick = STYLE === 'skilled' ? cards.find((c) => c.classList.contains('evo')) || cards[0] : cards[Math.floor(Math.random() * cards.length)];
          P.choices.push(pick.querySelector('.card-name').innerText.split('\n')[0].slice(0, 10));
          P.cards++;
          pick.click();
          P.busy = false;
        }, 380);
        return;
      }
      if (g.state !== 'play') {
        if (g.state === 'result' || g.state === 'title') P.done = true;
        return;
      }
      frame++;
      if (frame % REACT === 0) {
        const [x, z] = decide();
        if (!down) {
          pe('pointerdown', JX, JY);
          down = true;
        }
        pe('pointermove', JX + x * R * MAG, JY + z * R * MAG);
      }
      if (frame % 60 === 0) {
        const h = g.hole;
        let on = 0;
        for (const e of g.enemies.list) {
          const dx = e.x - h.x;
          const dz = e.z - h.z;
          if (Math.abs(dx) < g.viewHalfW && dz > -g.viewFar && dz < g.viewNear) on++;
        }
        P.minHp = Math.min(P.minHp, Math.round(h.hp));
        P.maxAlive = Math.max(P.maxAlive, g.enemies.list.length);
        P.on.push(g.enemies.list.length ? on / g.enemies.list.length : 1);
        const t = g.time;
        for (const m of [60, 90, 120, 150, 180, 240, 300]) if (t >= m && !P.marks[m]) P.marks[m] = { r: +h.r.toFixed(1), lv: g.level, hp: Math.round(h.hp), dmg: JSON.stringify(g.dmgLog || {}) };
        const b = g.enemies.boss;
        if (b) P.boss = { t: Math.round(t), hpPct: Math.round((b.hp / b.maxHp) * 100), size: +b.size.toFixed(1), r: +h.r.toFixed(1), dist: Math.round(Math.hypot(b.x - h.x, b.z - h.z)) };
        const mn = g.enemies.mini;
        if (mn && P.miniEat === null && mn.size < h.r * 0.94) P.miniEat = Math.round(t);
        if (g.miniSpawned && !mn && !P.miniDead) P.miniDead = Math.round(t);
      }
    };
  },
  [STYLE, REACT, MAG]
);

const runChunk = (n) =>
  page.evaluate((n) => {
    const P = window.__pl;
    for (let i = 0; i < n; i++) {
      if (P.busy || P.done) break;
      P.tick();
      window.__vtStep(1);
    }
    return { busy: P.busy, done: P.done, t: window.__game.time };
  }, n);

const rows = [];
for (let run = 1; run <= RUNS; run++) {
  await page.evaluate((m) => {
    const g = window.__game;
    if (m) {
      g.save.maps[m].unlocked = true;
      g.save.sel.map = m;
    }
    g.metaUI.closeModal();
    g.startRun({ daily: false });
    g.dmgLog = {};
    window.__pl.reset();
  }, MAP);
  const upg = await page.evaluate(() => Object.values(window.__game.save.upg).reduce((a, b) => a + b, 0));
  for (;;) {
    const r = await runChunk(240);
    if (r.busy) {
      await sleep(420);
      continue;
    }
    if (r.done || r.t > 420) break;
  }
  await page.evaluate(() => window.__vtStep(200));
  await sleep(300);
  const f = await page.evaluate(() => {
    const g = window.__game;
    const P = window.__pl;
    return {
      t: Math.round(g.time),
      cleared: g.cleared,
      lv: g.level,
      maxR: +g.stats.maxR.toFixed(1),
      kills: g.stats.kills,
      cards: P.cards,
      minHp: P.minHp,
      maxAlive: P.maxAlive,
      onscreen: Math.round((P.on.reduce((a, b) => a + b, 0) / Math.max(1, P.on.length)) * 100),
      miniDead: P.miniDead,
      miniEat: P.miniEat,
      boss: P.boss,
      marks: P.marks,
      evo: Object.keys(g.skills.evo),
      dmg: g.dmgLog,
      choices: P.choices.join('/'),
    };
  });
  const row = { style: STYLE, react: REACT, mag: MAG, run, upg, ...f };
  console.log(JSON.stringify(row));
  rows.push(row);
  await page.evaluate(() => {
    const g = window.__game;
    if (g.state !== 'result') g.debugKill();
  });
  await page.evaluate(() => window.__vtStep(200));
  await page.evaluate(() => {
    const g = window.__game;
    g.showTitle(true);
    for (let k = 0; k < 10; k++) {
      const n = window.__meta.nextUpgrade();
      if (!n || g.save.coins < n.cost) break;
      window.__meta.buyUpgrade(n.id);
    }
  });
}
await browser.close();
server.kill();
console.log('\n요약 (' + STYLE + ', 반응 ' + REACT + '프레임, 조이스틱 ' + MAG + ')');
for (const r of rows) {
  const m = r.marks;
  console.log(
    `#${r.run} 강화${r.upg}: ${r.cleared ? 'CLEAR' : 'DEAD'} ${r.t}s Lv${r.lv} 카드${r.cards} r${r.maxR} 처치${r.kills} 최저HP${r.minHp} 적최대${r.maxAlive} 화면내${r.onscreen}% 미니 ${r.miniDead ? '처치' + r.miniDead : '-'}${r.miniEat ? ' (삼킴가능 ' + r.miniEat + ')' : ''} 진화 ${r.evo.join(',') || '-'} | 60s r${m[60]?.r} hp${m[60]?.hp} / 120s r${m[120]?.r} hp${m[120]?.hp} / 180s r${m[180]?.r} Lv${m[180]?.lv} / 300s r${m[300]?.r} Lv${m[300]?.lv}${r.boss ? ` | 보스 ${r.boss.hpPct}% size${r.boss.size} r${r.boss.r} 거리${r.boss.dist}` : ''}`
  );
  console.log('   피해원: ' + JSON.stringify(r.dmg));
}
if (errors.length) console.log('errors', errors.slice(0, 5));
