// 밸런스 검증 봇: requestAnimationFrame 을 1/60초 고정 스텝(가상 시간)으로 돌리며 자동 플레이
//   node scripts/balance.mjs [runs=3] [bot=evade|wander|both]
// 강화 0 에서 시작해 판이 끝날 때마다 번 코인으로 가장 싼 강화를 산 뒤 다음 판 진행
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import net from 'node:net';

const RUNS = parseInt(process.argv[2] || '3', 10);
const BOTS = (process.argv[3] || 'both') === 'both' ? ['evade', 'wander'] : [process.argv[3]];
const PORT = await new Promise((res) => {
  const s = net.createServer();
  s.listen(0, () => {
    const p = s.address().port;
    s.close(() => res(p));
  });
});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' });
for (let i = 0; i < 60; i++) {
  try {
    if ((await fetch(`http://localhost:${PORT}/`)).ok) break;
  } catch (e) {
    /* 대기 */
  }
  await sleep(250);
}

// 고정 스텝 가상 시간
const VIRTUAL_TIME = `(() => {
  let vt = 1000; let q = [];
  performance.now = () => vt;
  window.requestAnimationFrame = (cb) => { q.push(cb); return q.length; };
  const ch = new MessageChannel();
  let n = 0;
  ch.port1.onmessage = () => {
    const l = q; q = []; vt += 1000 / 60;
    for (const cb of l) { try { cb(vt); } catch (e) { console.error(e); } }
    if (++n % 40 === 0) setTimeout(() => ch.port2.postMessage(0), 0); else ch.port2.postMessage(0);
  };
  ch.port2.postMessage(0);
})();`;

const BOT = (kind) => `(() => {
  const g = window.__game;
  g.botStats = { cards: 0, marks: {}, onscreen: [], maxAlive: 0, miniHp: null, miniDead: null, bossClear: null, evo: 0 };
  let wanderA = Math.random() * 6.28, wanderT = 0;
  g.openLevelUp = function () {
    while (this.pendingLevels > 0) {
      const ch = this.skills.choices(3);
      const evo = ch.find((c) => c.kind === 'evo');
      const c = evo || ch[Math.floor(Math.random() * ch.length)];
      this.skills.apply(c);
      if (c.kind === 'evo') this.botStats.evo++;
      this.pendingLevels--;
      this.botStats.cards++;
    }
  };
  g.input.vec = () => {
    const h = g.hole, w = g.world, fit = h.r * 0.94;
    let x = 0, z = 0;
    if ('${kind}' === 'wander') {
      wanderT -= 1 / 60;
      if (wanderT <= 0) { wanderT = 1.5 + Math.random() * 2; wanderA = Math.random() * 6.28; }
      x = Math.cos(wanderA); z = Math.sin(wanderA);
      if (Math.abs(h.x) > 80) x = -Math.sign(h.x);
      if (Math.abs(h.z) > 80) z = -Math.sign(h.z);
      const d = Math.hypot(x, z) || 1; return [x / d, z / d];
    }
    let best = null, bs = -1e9;
    const q = w.query(h.x, h.z, 26, []);
    for (const i of q) {
      if (w.pState[i] !== 0 || w.pSize[i] >= fit) continue;
      const d = Math.hypot(w.pX[i] - h.x, w.pZ[i] - h.z);
      const sc = w.pSize[i] * 2 - d * 0.25;
      if (sc > bs) { bs = sc; best = [w.pX[i], w.pZ[i], d]; }
    }
    for (const e of g.enemies.list) {
      if (e.size >= fit) continue;
      const d = Math.hypot(e.x - h.x, e.z - h.z);
      const sc = e.size * 2.5 - d * 0.25;
      if (sc > bs) { bs = sc; best = [e.x, e.z, d]; }
    }
    if (best) { x = (best[0] - h.x) / (best[2] || 1); z = (best[1] - h.z) / (best[2] || 1); }
    else { x = -h.x; z = -h.z; const d = Math.hypot(x, z) || 1; x /= d; z /= d; }
    for (const e of g.enemies.list) {
      if (e.size < fit) continue;
      const dx = h.x - e.x, dz = h.z - e.z, d = Math.hypot(dx, dz);
      const R = h.r + e.size + 2.5;
      if (d < R) { x += (dx / d) * 2.5 * (R - d) / R * 3; z += (dz / d) * 2.5 * (R - d) / R * 3; }
    }
    for (const m of g.enemies.marks) {
      const dx = h.x - m.x, dz = h.z - m.z, d = Math.hypot(dx, dz);
      if (d < m.r + h.r + 1) { x += (dx / (d || 1)) * 2; z += (dz / (d || 1)) * 2; }
    }
    const d = Math.hypot(x, z) || 1; return [x / d, z / d];
  };
  // 계측
  const origUpdate = g.update.bind(g);
  g.update = function (dt) {
    origUpdate(dt);
    const t = this.time, bsx = this.botStats;
    const el = this.enemies.list;
    bsx.maxAlive = Math.max(bsx.maxAlive, el.length);
    if (Math.floor(t * 60) % 60 === 0) {
      let on = 0;
      for (const e of el) {
        const dx = e.x - this.hole.x, dz = e.z - this.hole.z;
        if (Math.abs(dx) < this.viewHalfW && dz > -this.viewFar && dz < this.viewNear) on++;
      }
      bsx.onscreen.push(el.length ? on / el.length : 1);
    }
    for (const m of [60, 150, 180, 240, 300]) {
      if (t >= m && !bsx.marks[m]) bsx.marks[m] = { r: +this.hole.r.toFixed(2), lv: this.level, cards: bsx.cards, kills: this.stats.kills, alive: el.length, hp: Math.round(this.hole.hp) };
    }
    const mini = this.enemies.mini;
    if (mini) bsx.miniHp = Math.round(mini.hp) + '/' + Math.round(mini.maxHp);
    else if (this.miniSpawned && bsx.miniDead === null) bsx.miniDead = Math.round(t);
  };
})();`;

const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--disable-background-timer-throttling', '--disable-renderer-backgrounding'] });
const results = [];
for (const kind of BOTS) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await ctx.addInitScript(VIRTUAL_TIME);
  await ctx.addInitScript(() => {
    try {
      if (!localStorage.getItem('void-maw-save')) localStorage.setItem('void-maw-save', JSON.stringify({ ver: 2, tutorialDone: true }));
    } catch (e) {
      /* 무시 */
    }
  });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => console.log('pageerror', e.message));
  await page.goto(`http://localhost:${PORT}/?debug&norender`);
  await page.waitForFunction(() => window.__game && window.__game.frames > 5, null, { timeout: 60000 });
  for (let run = 1; run <= RUNS; run++) {
    const upg = await page.evaluate(() => JSON.stringify(window.__game.save.upg));
    await page.evaluate(() => {
      const g = window.__game;
      g.metaUI.closeModal();
      g.startRun({ daily: false });
    });
    await page.evaluate(BOT(kind));
    const t0 = Date.now();
    let r;
    for (;;) {
      await sleep(1500);
      r = await page.evaluate(() => {
        const g = window.__game;
        return { state: g.state, t: g.time, cleared: g.cleared, lv: g.level, r: g.hole.r, bs: g.botStats, kills: g.stats.kills, sw: g.stats.swallowed, boss: g.enemies.boss ? Math.round(g.enemies.boss.hp) + '/' + Math.round(g.enemies.boss.maxHp) + ' size ' + g.enemies.boss.size.toFixed(1) : null };
      });
      if (r.state === 'result' || r.t > 400 || Date.now() - t0 > 600000) break;
    }
    const on = r.bs.onscreen;
    const onAvg = on.length ? on.reduce((a, b) => a + b, 0) / on.length : 0;
    const coins = await page.evaluate(() => window.__game.save.coins);
    const row = {
      bot: kind,
      run,
      upg,
      end: r.state === 'result' ? (r.cleared ? 'CLEAR' : 'DEAD') : 'TIMEOUT',
      time: Math.round(r.t),
      lv: r.lv,
      cards: r.bs.cards,
      evo: r.bs.evo,
      r: +r.r.toFixed(2),
      kills: r.kills,
      swallowed: r.sw,
      maxAlive: r.bs.maxAlive,
      onscreen: +(onAvg * 100).toFixed(0),
      mini: r.bs.miniDead !== null ? 'dead@' + r.bs.miniDead : r.bs.miniHp,
      boss: r.boss,
      marks: r.bs.marks,
      coins,
    };
    console.log(JSON.stringify(row));
    results.push(row);
    // 결과 화면 -> 타이틀, 가장 싼 강화 구매
    await page.evaluate(() => {
      const g = window.__game;
      if (g.state !== 'result') g.debugKill();
    });
    await page.waitForFunction(() => window.__game.state === 'result', null, { timeout: 60000 }).catch(() => {});
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
  await ctx.close();
}
await browser.close();
server.kill();
console.log('\n요약');
for (const r of results) console.log(`${r.bot} #${r.run}: ${r.end} ${r.time}s Lv${r.lv} 카드${r.cards} 진화${r.evo} r${r.r} 처치${r.kills} 화면내${r.onscreen}% 최대적${r.maxAlive} 미니 ${r.mini} | 60s r${r.marks[60]?.r} Lv${r.marks[60]?.lv} / 180s r${r.marks[180]?.r} Lv${r.marks[180]?.lv} / 300s r${r.marks[300]?.r} Lv${r.marks[300]?.lv}`);
