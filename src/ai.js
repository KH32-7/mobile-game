// 자동 조준 (디버그 치트 + 생성기 검증용). 실제 물리로 후보 샷을 시뮬레이션해 가장 좋은 샷 선택
import { T } from './config.js';
import { stepBall, cloneState, newBall, cupPos } from './physics.js';
import { distField, lineClear, TILE } from './gen.js';

export function simulateShot(h, st, bx, by, vx, vy, M, maxT = 12) {
  const s = cloneState(st);
  const b = newBall(bx, by);
  b.vx = vx;
  b.vy = vy;
  b.moving = true;
  s.balls = [b];
  const ev = [];
  const dt = 1 / 120;
  let t = 0;
  let fake = false;
  while (b.moving && t < maxT) {
    stepBall(h, s, b, dt, M, ev);
    s.t += dt;
    t += dt;
    for (const e of ev) if (e.type === 'cup' && !h.cups[e.cup].real) fake = true;
    ev.length = 0;
  }
  return { b, s, fake };
}

function scoreResult(h, df, res) {
  const { b, fake } = res;
  if (b.sunk && !fake) return -1000;
  if (fake || b.waterHit) return 5000;
  const tx = Math.floor(b.x / T),
    ty = Math.floor(b.y / T);
  const d = df[ty * h.grid.cols + tx];
  if (d < 0) return 3000;
  let s = d * T;
  // 컵이 보이면 실제 거리로 보정
  const real = h.cups.findIndex((c) => c.real);
  const c = cupPos(h, res.s, real);
  if (d <= 3) s = Math.hypot(c.x - b.x, c.y - b.y);
  const surf = h.grid.t[ty * h.grid.cols + tx];
  if (surf === TILE.SAND) s += 10;
  return s;
}

export function planShot(h, st, bx, by, M, maxSpeed, opts = {}) {
  const df = st._df || (st._df = distField(h));
  const cands = [];
  const nA = opts.angles || 32;
  const powers = opts.powers || [0.18, 0.3, 0.45, 0.62, 0.8, 1.0];
  for (let i = 0; i < nA; i++) for (const p of powers) cands.push([(i / nA) * Math.PI * 2, p]);
  // 컵이 보이면 컵 방향 정밀 후보
  const real = h.cups.findIndex((c) => c.real);
  const c = cupPos(h, st, real);
  if (lineClear(h, bx, by, c.x, c.y, 5)) {
    const a = Math.atan2(c.y - by, c.x - bx);
    for (let p = 0.06; p <= 1.0; p += 0.04) cands.push([a, p]);
  }
  let best = null;
  const evalC = (a, p) => {
    const sp = p * maxSpeed;
    const res = simulateShot(h, st, bx, by, Math.cos(a) * sp, Math.sin(a) * sp, M);
    const sc = scoreResult(h, df, res) + p * 2;
    if (!best || sc < best.sc) best = { a, p, sc, sunk: res.b.sunk && !res.fake };
  };
  for (const [a, p] of cands) {
    evalC(a, p);
    if (best && best.sc < -900) break;
  }
  // 최선 주변 미세 조정
  if (best && best.sc > -900) {
    const a0 = best.a,
      p0 = best.p;
    for (const da of [-0.06, -0.03, 0, 0.03, 0.06])
      for (const dp of [-0.06, 0, 0.06]) {
        if (!da && !dp) continue;
        const p = Math.max(0.04, Math.min(1, p0 + dp));
        evalC(a0 + da, p);
        if (best.sc < -900) break;
      }
  }
  return best;
}


// 사람 근사: 조준 오차가 샷 세기에 비례 (짧은 퍼트는 정확, 긴 샷은 부정확)
export function humanize(shot, rng, aBase = 0.015, aK = 0.042, pBase = 0.03, pK = 0.09) {
  const g = () => {
    let u = 0;
    for (let i = 0; i < 6; i++) u += rng();
    return (u - 3) / Math.sqrt(0.5);
  };
  const p0 = shot.p;
  return { a: shot.a + g() * (aBase + aK * p0), p: Math.max(0.03, Math.min(1, p0 * (1 + g() * (pBase + pK * p0)))) };
}
