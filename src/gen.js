// 시드 기반 절차적 홀 생성기 (DOM 없음, node 에서도 동작)
import { T, COLS, RUN } from './config.js';
import { mulberry32, mix } from './rng.js';
import { WORLD_MAP } from './worlds.js';

export const TILE = { VOID: 0, GRASS: 1, SAND: 2, WATER: 3, ICE: 4, SN: 5, SE: 6, SS: 7, SW: 8 };
export const SLOPE_DIR = { 5: [0, -1], 6: [1, 0], 7: [0, 1], 8: [-1, 0] };
const { VOID, GRASS, SAND, WATER, ICE } = TILE;

export const BOSS = {
  5: { id: 'movingCup', name: '움직이는 컵', desc: '컵이 좌우로 천천히 움직임' },
  11: { id: 'threeCups', name: '세 개의 컵', desc: '진짜 컵은 하나뿐. 가짜 컵에 넣으면 벌타 +1' },
  17: { id: 'giantMill', name: '거대 풍차', desc: `거대한 풍차 + 제한 시간 ${RUN.timeLimit}초` },
};

const XMIN = 1,
  XMAX = COLS - 2; // 1..10

export const isFloor = (v) => v !== VOID;
export const isPass = (v) => v !== VOID && v !== WATER;

function makeGrid(rows) {
  return { cols: COLS, rows, t: new Uint8Array(COLS * rows) };
}
const gi = (g, x, y) => y * g.cols + x;
export function tileAt(g, x, y) {
  if (x < 0 || y < 0 || x >= g.cols || y >= g.rows) return VOID;
  return g.t[y * g.cols + x];
}
function setT(g, x, y, v) {
  if (x < XMIN || x > XMAX || y < 1 || y > g.rows - 2) return;
  g.t[gi(g, x, y)] = v;
}
function rect(g, x0, y0, w, h, v = GRASS) {
  for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) setT(g, x, y, v);
}
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

// ---------- 방 조각 템플릿 ----------
function roomX0(rng, cx, w) {
  const lo = Math.max(XMIN, cx - w + 2);
  const hi = Math.min(XMAX - w + 1, cx - 1);
  return lo <= hi ? rng.int(lo, hi) : clamp(cx - (w >> 1), XMIN, XMAX - w + 1);
}

const CHUNKS = {
  straight(g, rng, cx, y0, h) {
    const w = rng.int(3, 5);
    const x0 = clamp(cx - (w >> 1) + rng.int(-1, 1), XMIN, XMAX - w + 1);
    rect(g, x0, y0, w, h);
    return { exit: clamp(cx + rng.int(-1, 1), x0, x0 + w - 1), x0, w };
  },
  dogleg(g, rng, cx, y0, h) {
    const w = rng.int(3, 4);
    let cx2;
    do cx2 = rng.int(XMIN + 1, XMAX - 1);
    while (Math.abs(cx2 - cx) < 3);
    const mid = y0 + (h >> 1) - 1;
    const xa = clamp(cx - (w >> 1), XMIN, XMAX - w + 1);
    const xb = clamp(cx2 - (w >> 1), XMIN, XMAX - w + 1);
    rect(g, xa, mid, w, y0 + h - mid);
    rect(g, xb, y0, w, mid - y0 + 2);
    const lx = Math.min(xa, xb),
      rx = Math.max(xa, xb) + w - 1;
    rect(g, lx, mid, rx - lx + 1, 2);
    return { exit: cx2, x0: lx, w: rx - lx + 1 };
  },
  wide(g, rng, cx, y0, h) {
    const w = rng.int(7, 10);
    const x0 = roomX0(rng, cx, w);
    rect(g, x0, y0, w, h);
    return { exit: rng.int(x0 + 1, x0 + w - 2), x0, w };
  },
  fork(g, rng, cx, y0, h) {
    const w = rng.int(8, 10);
    const x0 = roomX0(rng, cx, w);
    rect(g, x0, y0, w, h);
    const iw = rng.int(2, 3);
    const ix = x0 + ((w - iw) >> 1) + rng.int(-1, 1);
    rect(g, ix, y0 + 1, iw, h - 2, VOID);
    return { exit: rng.int(x0 + 1, x0 + w - 2), x0, w };
  },
  pillars(g, rng, cx, y0, h) {
    const w = rng.int(8, 10);
    const x0 = roomX0(rng, cx, w);
    rect(g, x0, y0, w, h);
    let row = 0;
    for (let y = y0 + 1; y < y0 + h - 1; y += 2, row++)
      for (let x = x0 + 1 + (row % 2) * 2; x < x0 + w - 1; x += 3) if (rng.chance(0.7)) setT(g, x, y, VOID);
    return { exit: rng.int(x0 + 1, x0 + w - 2), x0, w };
  },
  zigzag(g, rng, cx, y0, h) {
    const w = rng.int(8, 10);
    const x0 = roomX0(rng, cx, w);
    rect(g, x0, y0, w, h);
    const left = rng.chance(0.5);
    const ya = y0 + h - 3,
      yb = y0 + 1;
    const gap = 3;
    if (left) {
      rect(g, x0, ya, w - gap, 1, VOID);
      rect(g, x0 + gap, yb, w - gap, 1, VOID);
    } else {
      rect(g, x0 + gap, ya, w - gap, 1, VOID);
      rect(g, x0, yb, w - gap, 1, VOID);
    }
    // 입구 행과 출구 행은 뚫려 있음
    return { exit: rng.int(x0 + 1, x0 + w - 2), x0, w };
  },
  funnel(g, rng, cx, y0, h) {
    const wBot = rng.int(8, 10),
      wTop = rng.int(3, 4);
    const inv = rng.chance(0.5);
    const c = clamp(cx, XMIN + 2, XMAX - 2);
    let lx = 99,
      rx = -1;
    for (let i = 0; i < h; i++) {
      const tt = h === 1 ? 0 : i / (h - 1);
      const w = Math.round(inv ? wBot + (wTop - wBot) * (1 - tt) : wTop + (wBot - wTop) * (1 - tt));
      const x0 = clamp(c - (w >> 1), XMIN, XMAX - w + 1);
      rect(g, x0, y0 + i, w, 1);
      lx = Math.min(lx, x0);
      rx = Math.max(rx, x0 + w - 1);
    }
    return { exit: c, x0: lx, w: rx - lx + 1 };
  },
  bowl(g, rng, cx, y0, h) {
    const w = rng.int(8, 10);
    const x0 = roomX0(rng, cx, w);
    const ccx = x0 + w / 2,
      ccy = y0 + h / 2;
    for (let y = y0; y < y0 + h; y++)
      for (let x = x0; x < x0 + w; x++) {
        const dx = (x + 0.5 - ccx) / (w / 2),
          dy = (y + 0.5 - ccy) / (h / 2);
        if (dx * dx + dy * dy <= 1.15) setT(g, x, y, GRASS);
      }
    rect(g, cx - 1, y0 + h - 1, 3, 1);
    const ex = clamp(Math.round(ccx) + rng.int(-1, 1), x0 + 1, x0 + w - 2);
    rect(g, ex - 1, y0, 3, 1);
    return { exit: ex, x0, w };
  },
};
const CHUNK_MIN_H = { straight: 3, dogleg: 4, wide: 3, fork: 5, pillars: 4, zigzag: 6, funnel: 4, bowl: 5 };

// ---------- BFS ----------
export function bfs(h, sx, sy, blocked) {
  const g = h.grid;
  const dist = new Int16Array(g.cols * g.rows).fill(-1);
  const q = new Int32Array(g.cols * g.rows);
  let qh = 0,
    qt = 0;
  if (!isPass(tileAt(g, sx, sy))) return dist;
  dist[gi(g, sx, sy)] = 0;
  q[qt++] = gi(g, sx, sy);
  while (qh < qt) {
    const i = q[qh++];
    const x = i % g.cols,
      y = (i / g.cols) | 0;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const nx = x + dx,
        ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= g.cols || ny >= g.rows) continue;
      const ni = gi(g, nx, ny);
      if (dist[ni] >= 0 || !isPass(g.t[ni]) || (blocked && blocked[ni])) continue;
      dist[ni] = dist[i] + 1;
      q[qt++] = ni;
    }
  }
  return dist;
}

export function blockedMap(h) {
  const g = h.grid;
  const b = new Uint8Array(g.cols * g.rows);
  const mark = (x, y) => {
    const tx = Math.floor(x / T),
      ty = Math.floor(y / T);
    if (tx >= 0 && ty >= 0 && tx < g.cols && ty < g.rows) b[gi(g, tx, ty)] = 1;
  };
  for (const bp of h.bumpers) mark(bp.x, bp.y);
  for (const m of h.mills) {
    if (m.hubR > 10) {
      // 큰 허브는 걸친 칸 모두 막음
      for (const ox of [-1, 1]) for (const oy of [-1, 1]) mark(m.x + ox * (m.hubR - 1), m.y + oy * (m.hubR - 1));
    } else mark(m.x, m.y);
  }
  return b;
}

const tcx = (x) => (x + 0.5) * T;

// 컵에서의 거리장 (자동 조준/분열샷 판정)
export function distField(h) {
  const cup = h.cups.find((c) => c.real) || h.cups[0];
  return bfs(h, Math.floor(cup.x / T), Math.floor(cup.y / T), blockedMap(h));
}

// ---------- 벽 선분 ----------
export function computeSegments(h) {
  const g = h.grid;
  // 빈칸(벽) 연결 요소: 테두리에 닿는지
  const comp = new Int32Array(g.cols * g.rows).fill(-1);
  const border = [];
  let nc = 0;
  for (let i = 0; i < g.t.length; i++) {
    if (g.t[i] !== VOID || comp[i] >= 0) continue;
    const st = [i];
    comp[i] = nc;
    let touches = false;
    while (st.length) {
      const j = st.pop();
      const x = j % g.cols,
        y = (j / g.cols) | 0;
      if (x === 0 || y === 0 || x === g.cols - 1 || y === g.rows - 1) touches = true;
      for (const [dx, dy] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const nx = x + dx,
          ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= g.cols || ny >= g.rows) continue;
        const k = gi(g, nx, ny);
        if (g.t[k] === VOID && comp[k] < 0) {
          comp[k] = nc;
          st.push(k);
        }
      }
    }
    border.push(touches);
    nc++;
  }
  const segs = [];
  const compOf = (x, y) => (x < 0 || y < 0 || x >= g.cols || y >= g.rows ? -1 : comp[gi(g, x, y)]);
  const push = (x1, y1, x2, y2, nx, ny, c) => {
    const interior = c >= 0 && !border[c];
    segs.push({ x1, y1, x2, y2, nx, ny, comp: c, interior });
  };
  // 가로 경계
  for (let y = 0; y <= g.rows; y++) {
    let run = null;
    const flush = () => {
      if (run) push(run.x0 * T, y * T, run.x1 * T, y * T, 0, run.ny, run.c);
      run = null;
    };
    for (let x = 0; x < g.cols; x++) {
      const a = isFloor(tileAt(g, x, y - 1)),
        b = isFloor(tileAt(g, x, y));
      let ny = 0,
        c = -2;
      if (a && !b) {
        ny = -1;
        c = compOf(x, y);
      } else if (!a && b) {
        ny = 1;
        c = compOf(x, y - 1);
      }
      if (!ny) {
        flush();
        continue;
      }
      if (run && run.ny === ny && run.c === c && run.x1 === x) run.x1 = x + 1;
      else {
        flush();
        run = { x0: x, x1: x + 1, ny, c };
      }
    }
    flush();
  }
  // 세로 경계
  for (let x = 0; x <= g.cols; x++) {
    let run = null;
    const flush = () => {
      if (run) push(x * T, run.y0 * T, x * T, run.y1 * T, run.nx, 0, run.c);
      run = null;
    };
    for (let y = 0; y < g.rows; y++) {
      const a = isFloor(tileAt(g, x - 1, y)),
        b = isFloor(tileAt(g, x, y));
      let nx = 0,
        c = -2;
      if (a && !b) {
        nx = -1;
        c = compOf(x, y);
      } else if (!a && b) {
        nx = 1;
        c = compOf(x - 1, y);
      }
      if (!nx) {
        flush();
        continue;
      }
      if (run && run.nx === nx && run.c === c && run.y1 === y) run.y1 = y + 1;
      else {
        flush();
        run = { y0: y, y1: y + 1, nx, c };
      }
    }
    flush();
  }
  h.comp = comp;
  h.compBorder = border;
  return segs;
}

// ---------- 파 계산: BFS 경로를 직선 구간(시야)으로 단순화 ----------
export function lineClear(h, x0, y0, x1, y1, margin = 7) {
  const g = h.grid;
  const dx = x1 - x0,
    dy = y1 - y0;
  const len = Math.hypot(dx, dy);
  const n = Math.max(2, Math.ceil(len / 4));
  for (let i = 0; i <= n; i++) {
    const px = x0 + (dx * i) / n,
      py = y0 + (dy * i) / n;
    for (const [ox, oy] of [
      [0, 0],
      [margin, 0],
      [-margin, 0],
      [0, margin],
      [0, -margin],
    ]) {
      const v = tileAt(g, Math.floor((px + ox) / T), Math.floor((py + oy) / T));
      if (!isPass(v)) return false;
    }
  }
  return true;
}

// 짧은 직선 홀은 경로 위에 장애물 1개 강제 (홀인원 남발 방지)
function forceObstacle(h, rng, meta) {
  const g = h.grid;
  const dist = distField(h);
  const tx = Math.floor(h.tee.x / T),
    ty = Math.floor(h.tee.y / T);
  const path = pathFromDist(h, dist, tx, ty);
  if (!path || path.length < 4) return;
  const a = path[0],
    b = path[path.length - 1];
  const straight = lineClear(h, tcx(a[0]), tcx(a[1]), tcx(b[0]), tcx(b[1]));
  const len = Math.hypot(b[0] - a[0], b[1] - a[1]) * T;
  if (!straight) return;
  void len;
  const mid = path.slice(Math.floor(path.length * 0.35), Math.ceil(path.length * 0.7));
  rng.shuffle(mid);
  // 1순위: 시야를 막는 작은 기둥(벽 섬) - 뱅크 샷이 필요해짐
  for (const [x, y] of mid) {
    if (meta.noGoRows && y >= meta.noGoRows[0] && y <= meta.noGoRows[1]) continue;
    const i = y * g.cols + x;
    const old = g.t[i];
    g.t[i] = VOID;
    if (validateHole(h).ok && !lineClear(h, tcx(a[0]), tcx(a[1]), tcx(b[0]), tcx(b[1]), 7)) {
      h.forced = 'pillar';
      return;
    }
    g.t[i] = old;
  }
  for (const [x, y] of mid) {
    if (meta.noGoRows && y >= meta.noGoRows[0] && y <= meta.noGoRows[1]) continue;
    const snapB = h.bumpers.length;
    h.bumpers.push({ x: tcx(x) + rng.range(-5, 5), y: tcx(y), r: 10 });
    if (validateHole(h).ok) {
      h.forced = 'bumper';
      return;
    }
    h.bumpers.length = snapB;
  }
  // 범퍼가 안 되면 모래
  for (const [x, y] of mid) {
    if (g.t[y * g.cols + x] !== GRASS) continue;
    g.t[y * g.cols + x] = SAND;
    if (x + 1 < g.cols && g.t[y * g.cols + x + 1] === GRASS) g.t[y * g.cols + x + 1] = SAND;
    h.forced = 'sand';
    return;
  }
}

function pathFromDist(h, dist, sx, sy) {
  const g = h.grid;
  const path = [[sx, sy]];
  let x = sx,
    y = sy;
  let d = dist[gi(g, x, y)];
  if (d < 0) return null;
  while (d > 0) {
    let moved = false;
    for (const [dx, dy] of [
      [0, -1],
      [1, 0],
      [-1, 0],
      [0, 1],
    ]) {
      const nx = x + dx,
        ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= g.cols || ny >= g.rows) continue;
      if (dist[gi(g, nx, ny)] === d - 1) {
        x = nx;
        y = ny;
        d--;
        path.push([x, y]);
        moved = true;
        break;
      }
    }
    if (!moved) return null;
  }
  return path;
}

export function computePar(h) {
  const dist = distField(h);
  const tx = Math.floor(h.tee.x / T),
    ty = Math.floor(h.tee.y / T);
  const path = pathFromDist(h, dist, tx, ty);
  if (!path) return { par: 3, legs: 0, pathLen: -1 };
  let legs = 0,
    i = 0;
  let totalLen = 0;
  const MAXLEG = 19 * T;
  while (i < path.length - 1) {
    let best = i + 1;
    for (let j = path.length - 1; j > i + 1; j--) {
      const L = Math.hypot(path[j][0] - path[i][0], path[j][1] - path[i][1]) * T;
      if (L > MAXLEG) continue;
      if (lineClear(h, tcx(path[i][0]), tcx(path[i][1]), tcx(path[j][0]), tcx(path[j][1]))) {
        best = j;
        break;
      }
    }
    totalLen += Math.hypot(path[best][0] - path[i][0], path[best][1] - path[i][1]);
    legs++;
    i = best;
  }
  // 위험 요소 특징값 (파 계산 + 보정용)
  let sand = 0,
    water = 0,
    ice = 0,
    slope = 0;
  for (const v of h.grid.t) {
    if (v === SAND) sand++;
    if (v === WATER) water++;
    if (v === ICE) ice++;
    if (v >= TILE.SN) slope++;
  }
  const feat = { legs, pathLen: path.length - 1, totalLen, mills: h.mills.length, movers: h.movers.length, water, sand, ice, slope, bumpers: h.bumpers.length, crates: h.crates.length, wind: h.wind ? 1 : 0, teles: h.teles.length, boss: h.boss || '' };
  h.parFeat = feat;
  const est = parEstimate(feat);
  // 사람 근사 AI 분포(파 이하 55~70%, +2 이상 10% 이하)에 맞춘 보정: 물/가짜 컵/긴 경로는 변동이 커서 여유를 더 줌
  // 움직이는 장애물(풍차/움직이는 벽)은 타이밍 운이 커서 +1
  const risk = (water > 0 ? 2 : 0) + (h.cups.length > 1 ? 2 : 0) + (legs >= 3 ? 0.5 : 0) + (h.mills.length + h.movers.length > 0 ? 1 : 0);
  // 후반 9홀은 파가 빡빡해져 난이도 곡선이 올라감
  const base = est - 1.2 + risk - (h.idx >= 9 ? 0.3 : 0);
  let par = clamp(Math.round(base), 2, 6);
  if (h.boss) par = clamp(Math.round(base) + (h.boss === 'movingCup' || h.boss === 'giantMill' ? 1 : 0), 3, 7);
  return { par, legs, pathLen: path.length - 1, est };
}

// 사람 근사 AI 자동 플레이로 보정한 기대 타수 (scripts/verify-gen.mjs 가 파 대비 평균을 검사)
export function parEstimate(f) {
  return PAR_W.c + PAR_W.legs * f.legs + PAR_W.len * f.pathLen + PAR_W.mills * f.mills + PAR_W.movers * f.movers + PAR_W.water * Math.min(8, f.water) + PAR_W.sand * Math.min(12, f.sand) + PAR_W.wind * f.wind + PAR_W.bumpers * f.bumpers + PAR_W.slope * Math.min(12, f.slope) + PAR_W.ice * Math.min(20, f.ice);
}
export const PAR_W = { c: 1.572, legs: 0.437, len: 0.01, mills: 0.443, movers: 0.02, water: 0.124, sand: 0.039, wind: 0.21, bumpers: 0.317, slope: -0.032, ice: 0.002 };

// ---------- 검증 ----------
export function validateHole(h) {
  const g = h.grid;
  const tx = Math.floor(h.tee.x / T),
    ty = Math.floor(h.tee.y / T);
  if (!isPass(tileAt(g, tx, ty))) return { ok: false, reason: 'tee-not-floor' };
  if (!h.cups.length) return { ok: false, reason: 'no-cup' };
  const blocked = blockedMap(h);
  if (blocked[gi(g, tx, ty)]) return { ok: false, reason: 'tee-blocked' };
  const dist = bfs(h, tx, ty, blocked);
  for (const c of h.cups) {
    const cx = Math.floor(c.x / T),
      cy = Math.floor(c.y / T);
    if (!isPass(tileAt(g, cx, cy))) return { ok: false, reason: 'cup-not-floor' };
    if (dist[gi(g, cx, cy)] < 0) return { ok: false, reason: 'cup-unreachable' };
  }
  if (h.cupMove) {
    const cy = Math.floor(h.cupMove.y / T);
    for (let x = Math.floor(h.cupMove.x0 / T); x <= Math.floor(h.cupMove.x1 / T); x++)
      if (!isPass(tileAt(g, x, cy)) || blocked[gi(g, x, cy)]) return { ok: false, reason: 'cup-track' };
  }
  for (const tp of h.teles)
    for (const p of [tp.a, tp.b]) {
      const px = Math.floor(p.x / T),
        py = Math.floor(p.y / T);
      if (!isPass(tileAt(g, px, py)) || dist[gi(g, px, py)] < 0) return { ok: false, reason: 'tele' };
    }
  if (g.rows > 30 || g.rows < 10) return { ok: false, reason: 'size' };
  return { ok: true, dist };
}

// ---------- 요소 배치 ----------
function chebNear(ax, ay, bx, by, r) {
  return Math.max(Math.abs(ax - bx), Math.abs(ay - by)) <= r;
}

function placeElements(h, rng, idx, meta, world) {
  const wt = world.weights || {};
  const g = h.grid;
  const tx = Math.floor(h.tee.x / T),
    ty = Math.floor(h.tee.y / T);
  const cupsT = h.cups.map((c) => [Math.floor(c.x / T), Math.floor(c.y / T)]);
  const nearKey = (x, y, r) => chebNear(x, y, tx, ty, r) || cupsT.some(([cx, cy]) => chebNear(x, y, cx, cy, r));
  const used = new Uint8Array(g.cols * g.rows);
  const floorTiles = () => {
    const out = [];
    for (let y = 0; y < g.rows; y++) for (let x = 0; x < g.cols; x++) if (isPass(g.t[gi(g, x, y)])) out.push([x, y]);
    return out;
  };
  const noGo = (x, y) => meta.noGoRows && y >= meta.noGoRows[0] && y <= meta.noGoRows[1];
  const allFloorAround = (x, y, r, pred = isPass) => {
    for (let yy = y - r; yy <= y + r; yy++) for (let xx = x - r; xx <= x + r; xx++) if (!pred(tileAt(g, xx, yy))) return false;
    return true;
  };

  const place = {
    sand() {
      const c = rng.pick(floorTiles().filter(([x, y]) => !nearKey(x, y, 0) && g.t[gi(g, x, y)] === GRASS && !noGo(x, y)));
      if (!c) return false;
      let [x, y] = c;
      const n = rng.int(2, 6);
      for (let i = 0; i < n; i++) {
        if (tileAt(g, x, y) === GRASS && !nearKey(x, y, 0)) g.t[gi(g, x, y)] = SAND;
        const [dx, dy] = rng.pick([
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]);
        if (isPass(tileAt(g, x + dx, y + dy))) {
          x += dx;
          y += dy;
        }
      }
      return true;
    },
    water() {
      const c = rng.pick(floorTiles().filter(([x, y]) => !nearKey(x, y, 2) && !used[gi(g, x, y)] && !noGo(x, y)));
      if (!c) return false;
      let [x, y] = c;
      const n = rng.int(2, 5);
      for (let i = 0; i < n; i++) {
        if (isPass(tileAt(g, x, y)) && !nearKey(x, y, 2) && !used[gi(g, x, y)]) g.t[gi(g, x, y)] = WATER;
        const [dx, dy] = rng.pick([
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]);
        if (isFloor(tileAt(g, x + dx, y + dy))) {
          x += dx;
          y += dy;
        }
      }
      return true;
    },
    ice() {
      const c = rng.pick(floorTiles().filter(([x, y]) => !nearKey(x, y, 1) && !noGo(x, y)));
      if (!c) return false;
      const [, y] = c;
      const hh = rng.int(2, 3);
      for (let yy = y; yy < y + hh; yy++)
        for (let x = 0; x < g.cols; x++) if (tileAt(g, x, yy) === GRASS && !nearKey(x, yy, 0) && !noGo(x, yy)) g.t[gi(g, x, yy)] = ICE;
      return true;
    },
    slope() {
      const c = rng.pick(floorTiles().filter(([x, y]) => !nearKey(x, y, 1) && !noGo(x, y)));
      if (!c) return false;
      const [x, y] = c;
      const w = rng.int(2, 3),
        hh = rng.int(2, 3);
      const dir = rng.pick([TILE.SN, TILE.SE, TILE.SS, TILE.SW]);
      for (let yy = y; yy < y + hh; yy++)
        for (let xx = x; xx < x + w; xx++) if (tileAt(g, xx, yy) === GRASS && !nearKey(xx, yy, 1) && !noGo(xx, yy)) g.t[gi(g, xx, yy)] = dir;
      return true;
    },
    bumper() {
      const c = rng.pick(
        floorTiles().filter(([x, y]) => !nearKey(x, y, 2) && !used[gi(g, x, y)] && allFloorAround(x, y, 1) && !noGo(x, y))
      );
      if (!c) return false;
      const [x, y] = c;
      used[gi(g, x, y)] = 1;
      h.bumpers.push({ x: tcx(x) + rng.range(-4, 4), y: tcx(y) + rng.range(-4, 4), r: 10 });
      return true;
    },
    crate() {
      const cands = floorTiles().filter(([x, y]) => !nearKey(x, y, 1) && !used[gi(g, x, y)] && !noGo(x, y));
      if (!cands.length) return false;
      const n = rng.int(1, 3);
      let [x, y] = rng.pick(cands);
      for (let i = 0; i < n; i++) {
        if (isPass(tileAt(g, x, y)) && !used[gi(g, x, y)] && !nearKey(x, y, 1)) {
          used[gi(g, x, y)] = 1;
          h.crates.push({ x: tcx(x), y: tcx(y), s: 26, alive: true });
        }
        x += rng.chance(0.5) ? 1 : -1;
      }
      return true;
    },
    mover() {
      const rows = [];
      for (let y = 1; y < g.rows - 1; y++) {
        if (Math.abs(y - ty) <= 1 || cupsT.some(([, cy]) => Math.abs(y - cy) <= 1) || noGo(0, y)) continue;
        let x = 0;
        while (x < g.cols) {
          if (!isPass(tileAt(g, x, y))) {
            x++;
            continue;
          }
          const xa = x;
          while (isPass(tileAt(g, x, y))) x++;
          if (x - xa >= 4) rows.push([xa, x - 1, y]);
        }
      }
      const r = rng.pick(rows);
      if (!r) return false;
      const [xa, xb, y] = r;
      for (let x = xa; x <= xb; x++) if (used[gi(g, x, y)]) return false;
      for (let x = xa; x <= xb; x++) used[gi(g, x, y)] = 1;
      const len = T * 1.4;
      h.movers.push({
        x0: xa * T + len / 2 + 3,
        x1: (xb + 1) * T - len / 2 - 3,
        y: tcx(y),
        len,
        period: rng.range(2.6, 4.2),
        phase: rng.range(0, Math.PI * 2),
      });
      return true;
    },
    mill() {
      const c = rng.pick(
        floorTiles().filter(
          ([x, y]) => !nearKey(x, y, 2) && allFloorAround(x, y, 1, isFloor) && !noGo(x, y) && ![-1, 0, 1].some((o) => used[gi(g, x + o, y)] || used[gi(g, x, y + o)])
        )
      );
      if (!c) return false;
      const [x, y] = c;
      for (let yy = y - 1; yy <= y + 1; yy++) for (let xx = x - 1; xx <= x + 1; xx++) used[gi(g, xx, yy)] = 1;
      h.mills.push({ x: tcx(x), y: tcx(y), len: T * 1.32, arms: rng.int(2, 4), speed: rng.range(1.1, 2.1) * (rng.chance(0.5) ? 1 : -1), hubR: 7, bladeW: 5, phase: rng.range(0, 6) });
      return true;
    },
    tele() {
      const blocked = blockedMap(h);
      const dTee = bfs(h, tx, ty, blocked);
      const dCup = distField(h);
      const total = dTee[gi(g, cupsT[0][0], cupsT[0][1])];
      if (total < 11) return false;
      const fl = floorTiles().filter(([x, y]) => !used[gi(g, x, y)] && !blocked[gi(g, x, y)] && g.t[gi(g, x, y)] !== WATER);
      const A = rng.pick(fl.filter(([x, y]) => dTee[gi(g, x, y)] >= 2 && dTee[gi(g, x, y)] <= 5 && !nearKey(x, y, 1)));
      const B = rng.pick(fl.filter(([x, y]) => dCup[gi(g, x, y)] >= 3 && dCup[gi(g, x, y)] <= 6 && !nearKey(x, y, 1)));
      if (!A || !B) return false;
      used[gi(g, A[0], A[1])] = used[gi(g, B[0], B[1])] = 1;
      h.teles.push({ a: { x: tcx(A[0]), y: tcx(A[1]) }, b: { x: tcx(B[0]), y: tcx(B[1]) } });
      return true;
    },
  };

  const eff = Math.min(17, idx + (world.diff || 0));
  const pool = [
    ['sand', 0, 3],
    ['bumper', 1, 2],
    ['water', 2, 2],
    ['slope', 2, 2],
    ['crate', 3, 1.5],
    ['ice', 3, 1.2],
    ['mover', 4, 1.5],
    ['mill', 5, 1.6],
    ['tele', world.teleFrom ?? 6, 0.9],
  ]
    .map(([k, from, w]) => [k, wt[k] > 2 ? Math.min(from, 1) : from, w * (wt[k] ?? 1)])
    .filter((p) => p[1] <= eff && p[2] > 0);
  const n = Math.min(7, 1 + Math.floor(eff * 0.28) + rng.int(0, 1) + (idx >= 9 ? 1 : 0));
  const counts = {};
  for (let k = 0; k < n; k++) {
    let tw = 0;
    for (const p of pool) tw += p[2];
    let r = rng() * tw;
    let pick = pool[0][0];
    for (const p of pool) {
      r -= p[2];
      if (r <= 0) {
        pick = p[0];
        break;
      }
    }
    if ((counts[pick] || 0) >= (pick === 'tele' ? 1 : pick === 'mill' ? 2 : 3)) continue;
    // 스냅샷 후 배치, 경로가 막히면 되돌림
    const snap = { t: g.t.slice(), u: used.slice(), b: h.bumpers.length, c: h.crates.length, m: h.mills.length, mv: h.movers.length, tp: h.teles.length };
    const ok = place[pick]();
    if (ok && validateHole(h).ok) counts[pick] = (counts[pick] || 0) + 1;
    else {
      g.t.set(snap.t);
      used.set(snap.u);
      h.bumpers.length = snap.b;
      h.crates.length = snap.c;
      h.mills.length = snap.m;
      h.movers.length = snap.mv;
      h.teles.length = snap.tp;
    }
  }
  // 코스 위 코인
  const nCoins = rng.int(1, 2);
  const fl = floorTiles().filter(([x, y]) => !used[gi(g, x, y)] && !nearKey(x, y, 1) && g.t[gi(g, x, y)] !== WATER);
  for (let i = 0; i < nCoins && fl.length; i++) {
    const [x, y] = fl.splice(Math.floor(rng() * fl.length), 1)[0];
    h.coins.push({ x: tcx(x), y: tcx(y), taken: false });
  }
  if (idx >= (world.windFrom ?? 7) && rng.chance(world.windChance ?? 0.35)) {
    const a = rng.range(0, Math.PI * 2);
    const m = rng.range(22, 42);
    h.wind = { x: Math.cos(a) * m, y: Math.sin(a) * m };
  }
}

// ---------- 메인 생성 ----------
function tryGenerate(rng, idx, world) {
  const boss = BOSS[idx] ? BOSS[idx].id : null;
  const midTypes = ['straight', 'dogleg', 'wide', 'fork', 'pillars', 'zigzag', 'funnel', 'bowl'];
  const unlocked = midTypes.slice(0, Math.min(midTypes.length, 3 + Math.floor((idx + (world.diff || 0)) / 2)));
  const plan = [{ type: 'start', h: 3 }];
  let nMid = 1 + (idx >= 3 ? 1 : 0) + (idx >= 10 && rng.chance(0.5) ? 1 : 0) + (rng.chance(0.25) ? 1 : 0);
  if (boss) nMid = Math.min(nMid, 2);
  for (let i = 0; i < nMid; i++) {
    const type = rng.pick(unlocked);
    plan.push({ type, h: Math.max(CHUNK_MIN_H[type], rng.int(3, 6)) });
  }
  if (boss === 'giantMill') plan.splice(1 + rng.int(0, plan.length - 1), 0, { type: 'millroom', h: 7 });
  plan.push({ type: 'green', h: boss === 'threeCups' ? 5 : 4 });
  let rows = plan.reduce((s, p) => s + p.h, 0) + 2;
  while (rows > 27 && plan.length > 3) {
    const k = plan.findIndex((p, i) => i > 0 && i < plan.length - 1 && p.type !== 'millroom');
    rows -= plan[k].h;
    plan.splice(k, 1);
  }
  const g = makeGrid(rows);
  const h = {
    idx,
    cols: COLS,
    rows,
    grid: g,
    tee: null,
    cups: [],
    cupMove: null,
    boss,
    bumpers: [],
    crates: [],
    mills: [],
    movers: [],
    teles: [],
    coins: [],
    wind: null,
    timeLimit: boss === 'giantMill' ? RUN.timeLimit : 0,
    chunks: [],
  };
  let y = rows - 2;
  let cx = rng.int(3, 8);
  const meta = {};
  for (let i = 0; i < plan.length; i++) {
    const p = plan[i];
    const y0 = y - p.h + 1;
    let res;
    if (p.type === 'start') {
      const w = rng.int(3, 5);
      const x0 = clamp(cx - (w >> 1), XMIN, XMAX - w + 1);
      rect(g, x0, y0, w, p.h);
      h.tee = { x: tcx(cx), y: tcx(y0 + 1) };
      res = { exit: cx, x0, w };
    } else if (p.type === 'green') {
      const wide = boss === 'movingCup' || boss === 'threeCups';
      const w = wide ? rng.int(8, 10) : rng.int(4, 7);
      const x0 = roomX0(rng, cx, w);
      rect(g, x0, y0, w, p.h);
      res = { exit: cx, x0, w };
      if (boss === 'movingCup') {
        const cy = y0 + 1;
        h.cupMove = { x0: tcx(x0 + 1), x1: tcx(x0 + w - 2), y: tcx(cy), period: 7.5 };
        h.cups.push({ x: tcx(x0 + (w >> 1)), y: tcx(cy), real: true });
        meta.noGoRows = [y0, y0 + p.h - 1];
      } else if (boss === 'threeCups') {
        const xs = [x0 + 1, x0 + (w >> 1), x0 + w - 2];
        const real = rng.int(0, 2);
        xs.forEach((x, k) => h.cups.push({ x: tcx(x), y: tcx(y0 + 1 + (k === 1 ? 0 : rng.int(0, 1))), real: k === real }));
        meta.noGoRows = [y0, y0 + p.h - 1];
      } else {
        // 8방향 이웃이 모두 바닥인 칸 중 입구에서 먼 곳
        const cands = [];
        for (let yy = y0; yy < y0 + p.h; yy++)
          for (let xx = x0; xx < x0 + w; xx++) {
            let ok = true;
            for (let oy = -1; oy <= 1 && ok; oy++) for (let ox = -1; ox <= 1; ox++) if (!isFloor(tileAt(g, xx + ox, yy + oy))) ok = false;
            if (ok) cands.push([xx, yy]);
          }
        // 컵 배치로 난이도: 가능하면 입구(아래)에서 먼 구석 쪽
        cands.sort((a, b) => a[1] - b[1] + (Math.abs(b[0] - cx) - Math.abs(a[0] - cx)) * 0.5);
        const pickFrom = cands.slice(0, Math.max(1, Math.ceil(cands.length / 2)));
        const [cxx, cyy] = cands.length ? rng.pick(pickFrom) : [x0 + (w >> 1), y0 + 1];
        h.cups.push({ x: tcx(cxx), y: tcx(cyy), real: true });
      }
    } else if (p.type === 'millroom') {
      rect(g, XMIN, y0, 10, p.h);
      h.mills.push({ x: 6 * T, y: (y0 + 3.5) * T, len: T * 2.7, arms: 4, speed: 0.9, hubR: 15, bladeW: 8, phase: 0, giant: true });
      res = { exit: rng.int(2, 9), x0: XMIN, w: 10 };
    } else {
      res = CHUNKS[p.type](g, rng, cx, y0, p.h);
    }
    h.chunks.push({ type: p.type, y0, h: p.h, x0: res.x0, w: res.w });
    // 이전 조각과 연결
    if (i > 0) rect(g, clamp(cx - 1, XMIN, XMAX - 2), y0 + p.h - 1, 3, 2);
    cx = clamp(res.exit, XMIN + 1, XMAX - 1);
    y = y0 - 1;
  }
  // 거대 풍차 방 좌우 끝이 막히지 않게
  if (!validateHole(h).ok) return null;
  placeElements(h, rng, idx, meta, world);
  if (!validateHole(h).ok) return null;
  forceObstacle(h, rng, meta);
  h.segs = computeSegments(h);
  let pr = computePar(h);
  // 짧은 홀(구간 2 이하)은 컵 앞 길목에 범퍼 수비수: 원 샷 홀인원 방지
  if (pr.legs <= 2 && !h.boss) {
    const dist = distField(h);
    const tx = Math.floor(h.tee.x / T),
      ty = Math.floor(h.tee.y / T);
    const path = pathFromDist(h, dist, tx, ty);
    if (path && path.length > 5) {
      for (const back of [2, 3]) {
        const [bx, by] = path[path.length - 1 - back];
        const nb = h.bumpers.length;
        h.bumpers.push({ x: tcx(bx) + rng.range(-6, 6), y: tcx(by) + rng.range(-6, 6), r: 10 });
        if (validateHole(h).ok) {
          h.forced = (h.forced ? h.forced + '+' : '') + 'guard';
          break;
        }
        h.bumpers.length = nb;
      }
      pr = computePar(h);
    }
  }
  // 짧은 파2/파3 홀도 기둥이나 경사가 최소 1개
  if (pr.par <= 3 && h.forced !== 'pillar' && !h.grid.t.some((v) => v >= TILE.SN)) {
    if (addApproachSlope(h, rng, meta)) {
      h.segs = computeSegments(h);
      pr = computePar(h);
    }
  }
  h.par = pr.par;
  h.pathLen = pr.pathLen;
  return h;
}

// 컵으로 가는 길목에 경사 패치 (짧은 홀의 단순 직진 방지)
function addApproachSlope(h, rng, meta) {
  const g = h.grid;
  const dist = distField(h);
  const tx = Math.floor(h.tee.x / T),
    ty = Math.floor(h.tee.y / T);
  const path = pathFromDist(h, dist, tx, ty);
  if (!path || path.length < 4) return false;
  const cands = path.slice(Math.floor(path.length * 0.3), path.length - 2);
  rng.shuffle(cands);
  for (const [x, y] of cands) {
    if (meta.noGoRows && y >= meta.noGoRows[0] && y <= meta.noGoRows[1]) continue;
    const i = path.findIndex((p) => p[0] === x && p[1] === y);
    const nx = path[Math.min(path.length - 1, i + 1)];
    const ddx = nx[0] - x,
      ddy = nx[1] - y;
    // 진행 방향에 수직으로 미는 경사
    const dir = ddx ? (rng.chance(0.5) ? TILE.SN : TILE.SS) : rng.chance(0.5) ? TILE.SE : TILE.SW;
    let n = 0;
    for (let oy = 0; oy < 2; oy++)
      for (let ox = 0; ox < 2; ox++) {
        const xx = x + ox,
          yy = y + oy;
        if (xx < 0 || yy < 0 || xx >= g.cols || yy >= g.rows) continue;
        if (g.t[yy * g.cols + xx] !== GRASS) continue;
        const cup = h.cups[0];
        if (Math.hypot((xx + 0.5) * T - cup.x, (yy + 0.5) * T - cup.y) < T * 1.5 || Math.hypot((xx + 0.5) * T - h.tee.x, (yy + 0.5) * T - h.tee.y) < T * 1.5) continue;
        g.t[yy * g.cols + xx] = dir;
        n++;
      }
    if (n) {
      h.forced = (h.forced ? h.forced + '+' : '') + 'slope';
      return true;
    }
  }
  return false;
}

function fallbackHole(idx) {
  const rows = 16;
  const g = makeGrid(rows);
  rect(g, 3, 1, 6, rows - 2);
  const h = { idx, cols: COLS, rows, grid: g, tee: { x: tcx(5), y: tcx(rows - 3) }, cups: [{ x: tcx(6), y: tcx(3), real: true }], cupMove: null, boss: null, bumpers: [], crates: [], mills: [], movers: [], teles: [], coins: [], wind: null, timeLimit: 0, chunks: [], fallback: true };
  h.segs = computeSegments(h);
  h.par = 3;
  h.pathLen = rows - 5;
  return h;
}

export function generateHole(runSeed, idx, worldId = 'meadow') {
  const world = WORLD_MAP[worldId] || WORLD_MAP.meadow;
  const wi = Object.keys(WORLD_MAP).indexOf(world.id);
  for (let attempt = 0; attempt < 60; attempt++) {
    const rng = mulberry32(mix(runSeed, idx, attempt, 7919 + wi * 131));
    const h = tryGenerate(rng, idx, world);
    if (h) {
      h.attempt = attempt;
      h.seed = runSeed;
      h.world = world.id;
      return h;
    }
  }
  const h = fallbackHole(idx);
  h.seed = runSeed;
  h.world = world.id;
  return h;
}
