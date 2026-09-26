// 미리 설계한 패턴 청크 + 난이도 곡선 기반 조합
import { CFG } from './config.js';

const LX = (l) => (l - 1) * CFG.laneW;

export function makeRng(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s |= 0; s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ri = (rng, a, b) => a + Math.floor(rng() * (b - a + 1));
const pick = (rng, arr) => arr[Math.floor(rng() * arr.length)];
const shuffle = (rng, a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

// ---------- 게이트 값 ----------
function gateValue(rng, D, good, count = 99) {
  const r = rng();
  if (good) {
    // 인원이 많을수록 곱하기 비중을 줄여 폭주 방지
    const pAdd = 0.5 + Math.min(0.35, count / 800);
    if (r < pAdd) return { op: '+', v: ri(rng, 6, 14) + Math.round(D * 5) + Math.round(Math.min(count, 400) * 0.08) };
    if (r < 0.92 || count > 150) return { op: 'x', v: 2 };
    return { op: 'x', v: 3 };
  }
  // 빼기 게이트 상한은 통과 직전에 현재 인원 기준으로 다시 조정됨 (game.js)
  // 0~300m 에는 나누기 게이트 없음
  if (r < 0.62 || D < 0.3) return { op: '-', v: Math.max(2, Math.min(ri(rng, 5, 12) + Math.round(D * 6), Math.floor(count * 0.6))) };
  return { op: '÷', v: D > 2.5 && rng() < 0.4 ? 3 : 2 };
}

function gateRow(rng, D, ctx, n) {
  const goods = [true];
  for (let i = 1; i < n; i++) goods.push(ctx.allGood || rng() < 0.3 + ctx.luck - Math.min(0.12, D * 0.03));
  if (ctx.allGood) ctx.usedGood = true;
  shuffle(rng, goods);
  if (n === 3) return goods.map((g, i) => ({ x: LX(i), w: CFG.laneW - 0.12, ...gateValue(rng, D, g, ctx.count), good: g }));
  return goods.map((g, i) => ({ x: (i === 0 ? -1 : 1) * CFG.trackHalfW / 2, w: CFG.trackHalfW - 0.1, ...gateValue(rng, D, g, ctx.count), good: g }));
}

function coinLine(items, lane, d0, n, gap = 2.2, y = 0.6) {
  for (let i = 0; i < n; i++) items.push({ t: 'coin', x: LX(lane), d: d0 + i * gap, y });
}
function coinArc(items, lane, dc, n, h = 1.4, gap = 1.6) {
  for (let i = 0; i < n; i++) {
    const u = (i / (n - 1)) * 2 - 1;
    items.push({ t: 'coin', x: LX(lane), d: dc + u * gap * (n - 1) / 2, y: 0.6 + h * (1 - u * u) });
  }
}
const obs = (kind, lane, d, extra = {}) => ({ t: 'obs', kind, x: LX(lane), d, ...extra });

function enemyCount(rng, D, ctx, frac) {
  const base = 6 + D * 11;
  const adapt = ctx.count * frac;
  return Math.max(3, Math.round(Math.max(base, adapt) * (0.75 + rng() * 0.5)));
}

// ---------- 청크 정의 (18개) ----------
export const CHUNKS = [
  { id: 'gate3', cat: 'gate', min: 0, w: 5, gen(rng, D, ctx) {
    const it = [];
    coinLine(it, ri(rng, 0, 2), 2, 5);
    it.push({ t: 'gates', d: 18, gates: gateRow(rng, D, ctx, 3) });
    return { len: 32, items: it };
  } },
  { id: 'gate2', cat: 'gate', min: 0, w: 4, gen(rng, D, ctx) {
    const it = [];
    coinLine(it, 1, 2, 5);
    it.push({ t: 'gates', d: 16, gates: gateRow(rng, D, ctx, 2) });
    return { len: 30, items: it };
  } },
  { id: 'doubleGate', cat: 'gate', min: 0.8, w: 3, gen(rng, D, ctx) {
    const it = [];
    it.push({ t: 'gates', d: 10, gates: gateRow(rng, D, ctx, 3) });
    it.push({ t: 'gates', d: 30, gates: gateRow(rng, D + 0.3, ctx, 2) });
    coinLine(it, ri(rng, 0, 2), 14, 6);
    return { len: 44, items: it };
  } },
  { id: 'gateEnemy', cat: 'gate', min: 0.6, w: 3, gen(rng, D, ctx) {
    const it = [];
    it.push({ t: 'gates', d: 8, gates: gateRow(rng, D, ctx, 3) });
    it.push({ t: 'enemy', d: 34, x: LX(ri(rng, 0, 2)), count: enemyCount(rng, D, ctx, 0.25) });
    return { len: 46, items: it };
  } },
  { id: 'powerup', cat: 'bonus', min: 0, w: 2, gen(rng, D, ctx) {
    const it = [];
    const l = ri(rng, 0, 2);
    coinLine(it, l, 2, 4);
    it.push({ t: 'power', x: LX(l), d: 14 });
    coinLine(it, (l + 1) % 3, 12, 6);
    return { len: 30, items: it };
  } },
  { id: 'coinsRest', cat: 'bonus', min: 0, w: 2, gen(rng) {
    const it = [];
    let l = ri(rng, 0, 2);
    for (let i = 0; i < 3; i++) { coinLine(it, l, 2 + i * 9, 4); l = Math.max(0, Math.min(2, l + (rng() < 0.5 ? -1 : 1))); }
    return { len: 32, items: it };
  } },
  { id: 'barrierJump', cat: 'obs', min: 0.3, w: 4, gen(rng) {
    const it = [obs('barrier', 0, 16), obs('barrier', 1, 16), obs('barrier', 2, 16)];
    coinArc(it, ri(rng, 0, 2), 16, 5);
    return { len: 34, items: it };
  } },
  { id: 'slideBar', cat: 'obs', min: 0.3, w: 4, gen(rng) {
    const it = [obs('bar', 0, 16), obs('bar', 1, 16), obs('bar', 2, 16)];
    coinLine(it, ri(rng, 0, 2), 10, 5, 2.2, 0.35);
    return { len: 32, items: it };
  } },
  { id: 'trainGap', cat: 'obs', min: 0, w: 5, gen(rng, D) {
    const open = ri(rng, 0, 2);
    const it = [];
    const len = 10 + Math.min(14, D * 4);
    // 중반부터 일부 기차는 마주 달려옴
    const vd = D > 0.5 && rng() < 0.35 ? -7 : 0;
    for (let l = 0; l < 3; l++) if (l !== open) it.push(obs('train', l, 14 + len / 2 + (vd ? 18 : 0), { len, vd: vd && l === (open + 1) % 3 ? vd : 0 }));
    coinLine(it, open, 8, Math.round(len / 2.2) + 3);
    return { len: 26 + len, items: it };
  } },
  { id: 'coneRow', cat: 'obs', min: 0.3, w: 3, gen(rng) {
    const gap = ri(rng, 0, 2);
    const it = [];
    for (let l = 0; l < 3; l++) if (l !== gap) for (const dx of [-0.6, 0, 0.6]) it.push({ t: 'obs', kind: 'cone', x: LX(l) + dx, d: 14 });
    coinLine(it, gap, 8, 5);
    return { len: 28, items: it };
  } },
  { id: 'laneHop', cat: 'obs', min: 0, w: 3, gen(rng, D, ctx) {
    const it = [];
    // 초반에는 플레이어가 서 있는 레인을 막아서 피하는 법을 익히게 함
    const a = D < 0.3 && ctx.lane != null ? ctx.lane : ri(rng, 0, 2);
    it.push(obs('train', a, 16, { len: 10 }));
    coinLine(it, (a + 1) % 3, 8, 6);
    return { len: 30, items: it };
  } },
  // 슬라이드로 뭉쳐야만 지나가는 좁은 틈 → 뒤에 보너스 게이트
  { id: 'squeeze', cat: 'obs', min: 0.5, w: 2, gen(rng, D, ctx) {
    const it = [obs('train', 0, 22, { len: 22 }), obs('train', 2, 22, { len: 22 })];
    for (let d = 14; d <= 30; d += 2.2) { it.push({ t: 'obs', kind: 'cone', x: -1.02, d }); it.push({ t: 'obs', kind: 'cone', x: 1.02, d }); }
    coinLine(it, 1, 12, 8);
    it.push({ t: 'gates', d: 40, bonus: true, gates: [{ x: LX(0), w: CFG.laneW - 0.12, op: '+', v: 10 + Math.round(D * 6), good: true }, { x: LX(1), w: CFG.laneW - 0.12, op: 'x', v: 2, good: true }, { x: LX(2), w: CFG.laneW - 0.12, op: '+', v: 10 + Math.round(D * 6), good: true }] });
    return { len: 50, items: it };
  } },
  // 경로 분기: 콘밭을 뚫는 레인에만 큰 보상 게이트, 나머지는 안전하지만 작은 보상
  { id: 'riskRoute', cat: 'gate', min: 0.7, w: 2, gen(rng, D, ctx) {
    const risk = ri(rng, 0, 2);
    const it = [];
    for (let d = 8; d <= 24; d += 2.4) it.push({ t: 'obs', kind: 'cone', x: LX(risk) + (rng() - 0.5) * 1.4, d });
    it.push({ t: 'power', x: LX(risk), d: 16 });
    const gates = [0, 1, 2].map((l) => (l === risk ? { x: LX(l), w: CFG.laneW - 0.12, op: 'x', v: ctx.count > 150 ? 2 : 3, good: true } : { x: LX(l), w: CFG.laneW - 0.12, op: '+', v: 4 + Math.round(D * 3), good: true }));
    it.push({ t: 'gates', d: 32, gates });
    return { len: 44, items: it };
  } },
  { id: 'narrowPass', cat: 'obs', min: 0.5, w: 3, gen(rng) {
    const open = ri(rng, 0, 2);
    const it = [];
    for (let l = 0; l < 3; l++) if (l !== open) { it.push(obs('barrier', l, 12)); it.push(obs('barrier', l, 20)); }
    coinLine(it, open, 8, 7);
    return { len: 32, items: it };
  } },
  { id: 'enemySmall', cat: 'enemy', min: 0.3, w: 4, gen(rng, D, ctx) {
    const it = [{ t: 'enemy', d: 20, x: LX(ri(rng, 0, 2)), count: enemyCount(rng, D, ctx, 0.3) }];
    return { len: 34, items: it };
  } },
  { id: 'enemyWall', cat: 'enemy', min: 1.0, w: 3, gen(rng, D, ctx) {
    const it = [];
    // 두 레인을 막고 한 레인만 비움
    it.push({ t: 'gates', d: 6, gates: gateRow(rng, D, ctx, 3) });
    const free = ri(rng, 0, 2);
    for (let l = 0; l < 3; l++) if (l !== free) it.push({ t: 'enemy', d: 34, x: LX(l), count: enemyCount(rng, D, ctx, 0.45) });
    coinLine(it, free, 26, 6);
    return { len: 46, items: it };
  } },
  { id: 'enemyTwin', cat: 'enemy', min: 1.2, w: 2, gen(rng, D, ctx) {
    const it = [];
    it.push({ t: 'enemy', d: 20, x: LX(0), count: enemyCount(rng, D, ctx, 0.2) });
    it.push({ t: 'enemy', d: 20, x: LX(2), count: enemyCount(rng, D, ctx, 0.2) });
    coinLine(it, 1, 12, 6);
    return { len: 34, items: it };
  } },
  { id: 'trainSlalom', cat: 'obs', min: 0.6, w: 3, gen(rng, D) {
    const it = [];
    const order = shuffle(rng, [0, 1, 2]);
    order.forEach((l, i) => it.push(obs('train', l, 12 + i * 16, { len: 10 })));
    return { len: 12 + 3 * 16 + 4, items: it };
  } },
  { id: 'jumpSlide', cat: 'obs', min: 1.2, w: 3, gen() {
    const it = [];
    for (let l = 0; l < 3; l++) { it.push(obs('barrier', l, 12)); it.push(obs('bar', l, 28)); }
    return { len: 40, items: it };
  } },
  { id: 'coneField', cat: 'obs', min: 0.4, w: 3, gen(rng) {
    const it = [];
    for (let i = 0; i < 12; i++) it.push({ t: 'obs', kind: 'cone', x: (rng() * 2 - 1) * 3.1, d: 8 + i * 2.2 });
    coinLine(it, ri(rng, 0, 2), 6, 6);
    return { len: 40, items: it };
  } },
  { id: 'trainTunnel', cat: 'obs', min: 1.6, w: 2, gen(rng) {
    const it = [obs('train', 0, 24, { len: 26 }), obs('train', 2, 24, { len: 26 })];
    it.push(obs(rng() < 0.5 ? 'barrier' : 'bar', 1, 24));
    coinLine(it, 1, 12, 4);
    return { len: 44, items: it };
  } },
  { id: 'mixLanes', cat: 'obs', min: 0.8, w: 3, gen(rng) {
    const kinds = shuffle(rng, ['barrier', 'bar', 'train']);
    const it = kinds.map((k, l) => (k === 'train' ? obs('train', l, 18, { len: 12 }) : obs(k, l, 18)));
    return { len: 34, items: it };
  } },
];

export function pickChunk(rng, D, slot, force) {
  if (force && force.length) { const c = CHUNKS.find((x) => x.id === force[slot % force.length]); if (c) return c; }
  let cats;
  if (slot % 2 === 0) cats = rng() < 0.82 ? ['gate'] : ['bonus'];
  else cats = rng() < Math.min(0.45, 0.12 + D * 0.12) ? ['enemy'] : ['obs'];
  let pool = CHUNKS.filter((c) => cats.includes(c.cat) && c.min <= D);
  if (!pool.length) pool = CHUNKS.filter((c) => c.cat === 'obs' && c.min <= D);
  const total = pool.reduce((a, c) => a + c.w, 0);
  let r = rng() * total;
  for (const c of pool) { r -= c.w; if (r <= 0) return c; }
  return pool[pool.length - 1];
}

// ---------- 튜토리얼 전용 청크 ----------
export const TUT_CHUNKS = [
  () => ({ len: 50, items: [obs('train', 1, 36, { len: 14, tut: 'lr' }), ...[0, 2].flatMap((l) => Array.from({ length: 5 }, (_, i) => ({ t: 'coin', x: LX(l), d: 26 + i * 2.2, y: 0.6 })))] }),
  () => ({ len: 40, items: [obs('barrier', 0, 26), obs('barrier', 1, 26, { tut: 'up' }), obs('barrier', 2, 26)] }),
  () => ({ len: 40, items: [obs('bar', 0, 26), obs('bar', 1, 26, { tut: 'down' }), obs('bar', 2, 26)] }),
  () => ({ len: 44, items: [{ t: 'gates', d: 26, tut: 'gate', gates: [{ x: LX(0), w: CFG.laneW - 0.12, op: '+', v: 5, good: true }, { x: LX(1), w: CFG.laneW - 0.12, op: 'x', v: 2, good: true }, { x: LX(2), w: CFG.laneW - 0.12, op: '+', v: 8, good: true }] }] }),
  () => ({ len: 50, items: [{ t: 'enemy', d: 30, x: 0, count: 8, tut: 'enemy', wide: true }] }),
];

export function applyGate(count, g) {
  switch (g.op) {
    case '+': return count + g.v;
    case '-': return count - g.v;
    case 'x': return count * g.v;
    case '÷': return Math.floor(count / g.v);
  }
  return count;
}

export const gateLabel = (g) => `${g.op}${g.v}`;
