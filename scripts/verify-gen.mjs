// 절차 생성기 검증: 여러 시드로 18홀을 만들어 클리어 가능성(그리드 BFS) 확인 + 일부 시드는 실제 물리 자동 플레이
// 사용: node scripts/verify-gen.mjs [시드 수=240] [자동플레이 시드 수=8]
import { generateHole, TILE } from '../src/gen.js';
import { T, RUN, PHYS } from '../src/config.js';
import { makeState, newBall, stepWorld, relicMods, settleToFloor } from '../src/physics.js';
import { planShot, humanize } from '../src/ai.js';
import { hashStr, dateSeedStr, mulberry32 } from '../src/rng.js';
import { Worker, isMainThread, parentPort, workerData } from 'node:worker_threads';
import os from 'node:os';
import { WORLDS } from '../src/worlds.js';

if (!isMainThread) {
  parentPort.postMessage(workerData.map((t) => playHole(...t)));
  await new Promise(() => {}); // 메인이 terminate 함
}
const NSEEDS = +(process.argv[2] || 240);
const NPLAY = +(process.argv[3] || 8);
const errors = [];
const fail = (seed, idx, msg) => errors.push(`seed ${seed} hole ${idx + 1}: ${msg}`);

// 생성기와 독립적으로 작성한 BFS
function reachable(h, from, to) {
  const g = h.grid;
  const W = g.cols;
  const block = new Set();
  for (const b of h.bumpers) block.add(Math.floor(b.y / T) * W + Math.floor(b.x / T));
  for (const m of h.mills) block.add(Math.floor(m.y / T) * W + Math.floor(m.x / T));
  const pass = (x, y) => x >= 0 && y >= 0 && x < W && y < g.rows && g.t[y * W + x] !== TILE.VOID && g.t[y * W + x] !== TILE.WATER && !block.has(y * W + x);
  const sx = Math.floor(from.x / T),
    sy = Math.floor(from.y / T);
  const ex = Math.floor(to.x / T),
    ey = Math.floor(to.y / T);
  if (!pass(sx, sy) || !pass(ex, ey)) return -1;
  const seen = new Map([[sy * W + sx, 0]]);
  const q = [[sx, sy]];
  while (q.length) {
    const [x, y] = q.shift();
    const d = seen.get(y * W + x);
    if (x === ex && y === ey) return d;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx,
        ny = y + dy;
      if (pass(nx, ny) && !seen.has(ny * W + nx)) {
        seen.set(ny * W + nx, d + 1);
        q.push([nx, ny]);
      }
    }
  }
  return -1;
}

const stats = { worldTiles: {}, holes: 0, fallback: 0, attempts: 0, parSum: 0, elemByHole: Array(18).fill(0), rowsMin: 99, rowsMax: 0, parHist: {} };
const t0 = Date.now();
const seeds = [];
for (let i = 0; i < NSEEDS; i++) seeds.push(hashStr('verify-' + i));
seeds.push(hashStr(dateSeedStr())); // 오늘의 데일리 코스도 포함

for (const W of WORLDS)
for (const seed of seeds) {
  for (let idx = 0; idx < RUN.holes; idx++) {
    const h = generateHole(seed, idx, W.id);
    if (h.world !== W.id) fail(seed, idx, 'world mismatch');
    stats.holes++;
    stats.attempts += h.attempt || 0;
    if (h.fallback) {
      stats.fallback++;
      fail(seed, idx, 'fallback layout used');
    }
    const g = h.grid;
    stats.rowsMin = Math.min(stats.rowsMin, g.rows);
    stats.rowsMax = Math.max(stats.rowsMax, g.rows);
    if (g.rows < 10 || g.rows > 30) fail(seed, idx, 'rows ' + g.rows);
    // 테두리는 모두 벽
    for (let x = 0; x < g.cols; x++) if (g.t[x] || g.t[(g.rows - 1) * g.cols + x]) fail(seed, idx, 'open border row');
    for (let y = 0; y < g.rows; y++) if (g.t[y * g.cols] || g.t[y * g.cols + g.cols - 1]) fail(seed, idx, 'open border col');
    const reals = h.cups.filter((c) => c.real);
    if (reals.length !== 1) fail(seed, idx, 'real cups ' + reals.length);
    for (const c of h.cups) if (reachable(h, h.tee, c) < 0) fail(seed, idx, 'cup unreachable');
    if (h.cupMove) {
      for (const x of [h.cupMove.x0, h.cupMove.x1, (h.cupMove.x0 + h.cupMove.x1) / 2]) if (reachable(h, h.tee, { x, y: h.cupMove.y }) < 0) fail(seed, idx, 'moving cup track unreachable');
    }
    for (const tp of h.teles) if (reachable(h, h.tee, tp.a) < 0 || reachable(h, tp.b, reals[0]) < 0) fail(seed, idx, 'teleporter unreachable');
    const near = (o, r) => Math.hypot(o.x - h.tee.x, o.y - h.tee.y) < r;
    for (const b of h.bumpers) if (near(b, 40)) fail(seed, idx, 'bumper on tee');
    for (const m of h.mills) if (near(m, m.len + 10)) fail(seed, idx, 'mill on tee');
    for (const s of h.segs) if (![s.x1, s.y1, s.x2, s.y2].every(Number.isFinite)) fail(seed, idx, 'bad seg');
    for (const mv of h.movers) if (!(mv.x1 > mv.x0)) fail(seed, idx, 'bad mover');
    if (h.par < 2 || h.par > 6) fail(seed, idx, 'par ' + h.par);
    if (idx === 5 && !h.cupMove) fail(seed, idx, 'boss moving cup missing');
    if (idx === 11 && h.cups.length !== 3) fail(seed, idx, 'boss three cups missing');
    if (idx === 17 && !(h.mills.some((m) => m.giant) && h.timeLimit > 0)) fail(seed, idx, 'boss giant mill missing');
    stats.parSum += h.par;
    const wt = (stats.worldTiles[W.id] ||= { sand: 0, ice: 0, water: 0, tele: 0, bumper: 0 });
    for (const v of g.t) {
      if (v === TILE.SAND) wt.sand++;
      if (v === TILE.ICE) wt.ice++;
      if (v === TILE.WATER) wt.water++;
    }
    wt.tele += h.teles.length;
    wt.bumper += h.bumpers.length;
    stats.parHist[h.par] = (stats.parHist[h.par] || 0) + 1;
    stats.elemByHole[idx] += h.bumpers.length + h.crates.length + h.mills.length + h.movers.length + h.teles.length + (h.wind ? 1 : 0) + [...g.t].filter((v) => v >= 2).length / 4;
  }
}
// 결정성: 같은 시드 = 같은 코스
{
  const a = generateHole(12345, 7),
    b = generateHole(12345, 7);
  if (a.grid.t.join() !== b.grid.t.join() || JSON.stringify(a.bumpers) !== JSON.stringify(b.bumpers)) errors.push('determinism failed');
}
const genMs = Date.now() - t0;

// 실제 물리 자동 플레이 (사람 근사 AI: 조준 오차 포함, 워커 병렬)
function playHole(seed, idx, wid, rngSeed) {
  const rng = mulberry32(rngSeed);
  const M = relicMods(new Set());
  const h = generateHole(seed, idx, wid);
  const st = makeState(h);
  const b = newBall(h.tee.x, h.tee.y);
  st.balls = [b];
  let strokes = 0;
  let done = false;
  while (strokes < 12 && !done) {
    const shot = humanize(planShot(h, st, b.x, b.y, M, PHYS.maxShotSpeed, { angles: 20, powers: [0.2, 0.35, 0.5, 0.7, 0.9] }), rng);
    const px = b.x,
      py = b.y;
    b.vx = Math.cos(shot.a) * shot.p * PHYS.maxShotSpeed;
    b.vy = Math.sin(shot.a) * shot.p * PHYS.maxShotSpeed;
    Object.assign(b, { moving: true, stopT: 0, rollT: 0, ghostUsed: false, skimUsed: false, lip: -1, waterHit: false });
    strokes++;
    const ev = [];
    let guard = 0;
    while (b.moving && guard++ < 120 * 20) {
      stepWorld(h, st, 1 / 120, M, ev);
      for (const e of ev) {
        if (e.type === 'cup') {
          if (h.cups[e.cup].real) done = true;
          else {
            st.cupGone[e.cup] = true;
            strokes++;
            b.sunk = false;
            b.x = px;
            b.y = py;
          }
        }
      }
      ev.length = 0;
    }
    if (b.waterHit) {
      strokes++;
      b.x = px;
      b.y = py;
      b.waterHit = false;
    }
    if (!done && h.grid.t[Math.floor(b.y / T) * h.grid.cols + Math.floor(b.x / T)] === TILE.VOID) settleToFloor(h, b);
    st.t += 1.3;
  }
  return { seed, idx, wid, par: h.par, strokes, done };
}

const play = { holes: 0, cleared: 0, over: 0, strokes: 0, worst: [], front: [0, 0], back: [0, 0] };
const t1 = Date.now();
if (NPLAY) {
  const tasks = [];
  for (const W of WORLDS) for (let si = 0; si < NPLAY; si++) for (let idx = 0; idx < RUN.holes; idx++) tasks.push([seeds[si + 1], idx, W.id, hashStr(`h${si}-${idx}-${W.id}`)]);
  const nW = Math.max(1, Math.min(4, os.cpus().length));
  const results = await Promise.all(
    Array.from({ length: nW }, (_, k) =>
      new Promise((res, rej) => {
        const w = new Worker(new URL(import.meta.url), { workerData: tasks.filter((_, i) => i % nW === k) });
        w.on('message', (m) => {
          res(m);
          w.terminate();
        });
        w.on('error', rej);
      })
    )
  );
  for (const r of results.flat()) {
    play.holes++;
    if (!r.done) {
      play.worst.push(`seed ${r.seed} ${r.wid} hole ${r.idx + 1} NOT CLEARED`);
      continue;
    }
    play.cleared++;
    play.strokes += r.strokes;
    play.over += r.strokes - r.par;
    const nine = r.idx < 9 ? play.front : play.back;
    nine[0] += r.strokes - r.par;
    nine[1]++;
  }
}
const playMs = Date.now() - t1;

console.log(`생성 검증: 시드 ${seeds.length}개 x 월드 ${WORLDS.length}개 x 18홀 = ${stats.holes}홀, ${genMs}ms`);
console.log(`  재시도 평균 ${(stats.attempts / stats.holes).toFixed(2)}, 폴백 ${stats.fallback}, 행 수 ${stats.rowsMin}-${stats.rowsMax}, 평균 파 ${(stats.parSum / stats.holes).toFixed(2)}`, stats.parHist);
console.log('  홀별 평균 요소량:', stats.elemByHole.map((v) => (v / seeds.length / WORLDS.length).toFixed(1)).join(' '));
for (const [w, o] of Object.entries(stats.worldTiles)) console.log(`  ${w}: 홀당 모래 ${(o.sand / seeds.length / 18).toFixed(1)}, 얼음 ${(o.ice / seeds.length / 18).toFixed(1)}, 물 ${(o.water / seeds.length / 18).toFixed(1)}, 워프 ${(o.tele / seeds.length / 18).toFixed(2)}, 범퍼 ${(o.bumper / seeds.length / 18).toFixed(2)}`);
// 월드별 요소 구성이 실제로 달라야 함
{
  const wt = stats.worldTiles;
  if (!(wt.desert.sand > wt.meadow.sand * 1.5)) errors.push('desert should have more sand');
  if (!(wt.snow.ice > wt.meadow.ice * 1.5)) errors.push('snow should have more ice');
  if (!(wt.space.tele > wt.meadow.tele * 1.5)) errors.push('space should have more teleporters');
}
if (NPLAY) {
  const avg = play.over / Math.max(1, play.cleared);
  console.log(`사람 근사 AI 자동 플레이: ${play.cleared}/${play.holes}홀 클리어, 평균 타수 ${(play.strokes / play.cleared).toFixed(2)}, 파 대비 평균 ${avg >= 0 ? '+' : ''}${avg.toFixed(2)} (전반 ${(play.front[0] / play.front[1]).toFixed(2)}, 후반 ${(play.back[0] / play.back[1]).toFixed(2)}), ${playMs}ms`);
  if (play.worst.length) console.log('  미클리어:', play.worst.slice(0, 8).join(' | '));
  if (Math.abs(avg) > 0.5) errors.push(`par calibration off: AI average vs par ${avg.toFixed(2)} (allowed +-0.5)`);
}
const clearRate = NPLAY ? play.cleared / play.holes : 1;
if (clearRate < 0.97) errors.push(`autoplay clear rate too low: ${(clearRate * 100).toFixed(1)}%`);
if (errors.length) {
  console.error(`실패 ${errors.length}건`);
  console.error(errors.slice(0, 30).join('\n'));
  process.exit(1);
}
console.log('PASS');
