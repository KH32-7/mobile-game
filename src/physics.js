// 자체 2D 물리 (DOM 없음). 원형 공 vs 선분/원/사각형, 서브스텝으로 터널링 방지
import { T, PHYS, SURF } from './config.js';
import { TILE, SLOPE_DIR, tileAt, isPass } from './gen.js';

const TAU = Math.PI * 2;

export function makeState(h) {
  return {
    t: 0,
    crateAlive: h.crates.map(() => true),
    coinTaken: h.coins.map(() => false),
    cupGone: h.cups.map(() => false),
    balls: [],
  };
}

export function cloneState(st) {
  return {
    t: st.t,
    crateAlive: st.crateAlive.slice(),
    coinTaken: st.coinTaken.slice(),
    cupGone: st.cupGone.slice(),
    balls: st.balls.map((b) => ({ ...b, trail: null })),
  };
}

export function newBall(x, y) {
  return { x, y, vx: 0, vy: 0, moving: false, sunk: false, dead: false, stopT: 0, rollT: 0, ghostUsed: false, ghostComp: -1, skimUsed: false, skimming: false, teleLock: -1, lip: -1, waterHit: false, sinkCup: -1, steerUsed: false, trail: [] };
}

// R: 유물 id 집합, lv: {id: 레벨}, ctx: { hearts }
export function relicMods(R, lv = {}, ctx = {}) {
  const has = (id) => R && R.has(id);
  const L = (id) => (has(id) ? lv[id] || 1 : 0);
  const syn = ctx.syn || {};
  const terr = [1, 0.85, 0.6][syn.지형 || 0];
  return {
    sticky: has('sticky'),
    ghost: has('ghost'),
    pull: L('magnet') === 2 ? 3 : L('magnet') ? 2 : 1,
    bumperMul: (L('bounceking') === 2 ? 2 : L('bounceking') ? 1.5 : 1) * (has('bouncy') ? 1.25 : 1) * [1, 1.15, 1.35][syn.범퍼 || 0],
    sandproof: has('sandproof'),
    waterski: has('waterski'),
    windbreak: has('windbreak'),
    heavy: has('heavy'),
    coinR: L('coinmag') === 2 ? 4 : L('coinmag') ? 3 : 1,
    cushion: has('cushion'),
    bouncy: has('bouncy'),
    cupMul: (L('bigcup') === 2 ? 1.6 : L('bigcup') ? 1.35 : 1) * (has('comeback') && ctx.hearts != null && ctx.hearts <= 2 ? 1.5 : 1) * [1, 1.1, 1.25][syn.컵 || 0] * (ctx.mercy ? 1.3 : 1),
    captureMul: (has('bigcup') ? 1.3 : 1) * (L('radar') === 2 ? 1.7 : L('radar') ? 1.4 : 1),
    fricMul: L('feather') === 2 ? 0.65 : L('feather') ? 0.75 : 1,
    sandMul: (has('bouncy') ? 1.5 : 1) * terr,
    slopeMul: (has('sloperider') ? 1.6 : 1) * terr,
    windMul: terr,
    teleBoost: has('warpmaster') ? 1.4 : 1,
    wallBoost: [1, 1.08, 1.2][syn.벽 || 0],
    crateEasy: (syn.상자 || 0) >= 2,
  };
}

export function cupPos(h, st, i) {
  const c = h.cups[i];
  if (h.cupMove) {
    const m = h.cupMove;
    const w = TAU / m.period;
    const u = 0.5 - 0.5 * Math.cos(w * st.t);
    return { x: m.x0 + (m.x1 - m.x0) * u, y: m.y, vx: (m.x1 - m.x0) * 0.5 * Math.sin(w * st.t) * w, vy: 0 };
  }
  return { x: c.x, y: c.y, vx: 0, vy: 0 };
}

export function millAngle(m, t) {
  return m.phase + m.speed * t;
}

export function moverPos(mv, t) {
  const w = TAU / mv.period;
  const mid = (mv.x0 + mv.x1) / 2,
    amp = (mv.x1 - mv.x0) / 2;
  return { x: mid + amp * Math.sin(w * t + mv.phase), y: mv.y, vx: amp * w * Math.cos(w * t + mv.phase), vy: 0 };
}

function closestOnSeg(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1,
    dy = y2 - y1;
  const l2 = dx * dx + dy * dy;
  let u = l2 > 0 ? ((px - x1) * dx + (py - y1) * dy) / l2 : 0;
  u = u < 0 ? 0 : u > 1 ? 1 : u;
  return [x1 + dx * u, y1 + dy * u];
}

// 충돌 해소: 법선 n, 접촉면 속도(vx,vy)
function resolve(b, nx, ny, pen, e, svx = 0, svy = 0, tang = PHYS.wallTangent) {
  b.x += nx * pen;
  b.y += ny * pen;
  const rvx = b.vx - svx,
    rvy = b.vy - svy;
  const vn = rvx * nx + rvy * ny;
  if (vn >= 0) return 0;
  const tx = rvx - vn * nx,
    ty = rvy - vn * ny;
  b.vx = svx + tx * tang - vn * e * nx;
  b.vy = svy + ty * tang - vn * e * ny;
  return -vn;
}

function surfaceAt(h, x, y) {
  return tileAt(h.grid, Math.floor(x / T), Math.floor(y / T));
}

// 공 하나를 dt 만큼 진행 (서브스텝 포함)
export function stepBall(h, st, b, dt, M, ev) {
  if (!b.moving || b.sunk || b.dead) return;
  const r = PHYS.ballR;
  const sp0 = Math.hypot(b.vx, b.vy);
  const n = Math.min(40, Math.max(1, Math.ceil((sp0 * dt) / PHYS.maxSubMove)));
  const sdt = dt / n;
  for (let s = 0; s < n; s++) {
    const t = st.t + sdt * s;
    let surf = surfaceAt(h, b.x, b.y);
    if (surf === TILE.SAND && M.sandproof) surf = TILE.GRASS;
    // 가속: 경사, 바람
    if (surf >= TILE.SN) {
      const [dx, dy] = SLOPE_DIR[surf];
      const a = PHYS.slopeAccel * (M.windbreak ? 0.5 : 1) * (M.heavy ? 0.6 : 1) * (M.slopeMul || 1);
      b.vx += dx * a * sdt;
      b.vy += dy * a * sdt;
    }
    if (h.wind && !M.windbreak) {
      const k = (M.heavy ? 0.5 : 1) * (M.windMul || 1);
      b.vx += h.wind.x * k * sdt;
      b.vy += h.wind.y * k * sdt;
    }
    // 마찰
    const f = SURF[surf >= TILE.SN ? 5 : surf] || SURF[1];
    let sp = Math.hypot(b.vx, b.vy);
    if (sp > 0) {
      const fm = (M.fricMul || 1) * (surf === TILE.SAND ? M.sandMul || 1 : 1);
      const ns = Math.max(0, sp - (f.a + f.k * sp) * fm * sdt);
      b.vx *= ns / sp;
      b.vy *= ns / sp;
      sp = ns;
    }
    // 컵 흡입
    for (let i = 0; i < h.cups.length; i++) {
      if (st.cupGone[i]) continue;
      const c = cupPos(h, { t }, i);
      const dx = c.x - b.x,
        dy = c.y - b.y;
      const d = Math.hypot(dx, dy);
      const pr = PHYS.cupR * M.cupMul * PHYS.cupPullR * M.pull;
      if (d < pr && d > 0.01 && sp < 280) {
        const a = PHYS.cupPull * (1 - d / pr) * (M.pull > 1 ? 1.3 : 1);
        b.vx += (dx / d) * a * sdt;
        b.vy += (dy / d) * a * sdt;
      }
    }
    const px = b.x,
      py = b.y;
    b.x += b.vx * sdt;
    b.y += b.vy * sdt;

    // 벽 선분
    const eWall = M.sticky ? 0.36 : M.bouncy ? 0.93 : M.cushion ? 0.9 : PHYS.wallE;
    for (const sg of h.segs) {
      if (b.ghostComp >= 0 && sg.comp === b.ghostComp) continue;
      const [cx, cy] = closestOnSeg(b.x, b.y, sg.x1, sg.y1, sg.x2, sg.y2);
      let dx = b.x - cx,
        dy = b.y - cy;
      const d2 = dx * dx + dy * dy;
      if (d2 >= r * r) continue;
      // 한 번 통과 (유령 공)
      if (M.ghost && sg.interior && !b.ghostUsed) {
        b.ghostUsed = true;
        b.ghostComp = sg.comp;
        ev.push({ type: 'ghost', x: b.x, y: b.y });
        continue;
      }
      let d = Math.sqrt(d2);
      if (d < 1e-4) {
        dx = sg.nx;
        dy = sg.ny;
        d = 1;
      } else {
        dx /= d;
        dy /= d;
      }
      const imp = resolve(b, dx, dy, r - d, eWall);
      if (imp > 80 && M.wallBoost > 1) {
        const k = Math.min(M.wallBoost, (PHYS.maxShotSpeed * 1.1) / Math.max(1, Math.hypot(b.vx, b.vy)));
        if (k > 1) {
          b.vx *= k;
          b.vy *= k;
        }
      }
      if (imp > 25) ev.push({ type: 'wall', x: cx, y: cy, speed: imp, nx: dx, ny: dy });
    }
    // 유령 모드 종료 체크
    if (b.ghostComp >= 0) {
      const tx = Math.floor(b.x / T),
        ty = Math.floor(b.y / T);
      const inComp = h.comp && tileAt(h.grid, tx, ty) === TILE.VOID && h.comp[ty * h.grid.cols + tx] === b.ghostComp;
      let near = false;
      if (!inComp)
        for (const sg of h.segs) {
          if (sg.comp !== b.ghostComp) continue;
          const [cx, cy] = closestOnSeg(b.x, b.y, sg.x1, sg.y1, sg.x2, sg.y2);
          if ((b.x - cx) ** 2 + (b.y - cy) ** 2 < (r + 1) ** 2) {
            near = true;
            break;
          }
        }
      if (!inComp && !near) b.ghostComp = -1;
    }
    // 상자
    for (let i = 0; i < h.crates.length; i++) {
      if (!st.crateAlive[i]) continue;
      const c = h.crates[i];
      const hs = c.s / 2;
      const cx = Math.max(c.x - hs, Math.min(c.x + hs, b.x));
      const cy = Math.max(c.y - hs, Math.min(c.y + hs, b.y));
      let dx = b.x - cx,
        dy = b.y - cy;
      const d2 = dx * dx + dy * dy;
      if (d2 >= r * r) continue;
      let d = Math.sqrt(d2);
      if (d < 1e-4) {
        dx = b.x - c.x;
        dy = b.y - c.y;
        d = Math.hypot(dx, dy) || 1;
        dx /= d;
        dy /= d;
        d = 0;
      } else {
        dx /= d;
        dy /= d;
      }
      const vn = -(b.vx * dx + b.vy * dy);
      if (vn > PHYS.crateBreakSpeed * (M.heavy || M.crateEasy ? 0.4 : 1)) {
        st.crateAlive[i] = false;
        const k = M.heavy ? 0.92 : 0.68;
        b.vx *= k;
        b.vy *= k;
        ev.push({ type: 'crate', x: c.x, y: c.y, i });
      } else {
        const imp = resolve(b, dx, dy, r - d, PHYS.crateE);
        if (imp > 25) ev.push({ type: 'wall', x: cx, y: cy, speed: imp * 0.7, nx: dx, ny: dy, wood: true });
      }
    }
    // 범퍼
    for (const bp of h.bumpers) {
      const dx = b.x - bp.x,
        dy = b.y - bp.y;
      const d = Math.hypot(dx, dy);
      const rr = r + bp.r;
      if (d >= rr || d < 1e-4) continue;
      const nx = dx / d,
        ny = dy / d;
      const vn = b.vx * nx + b.vy * ny;
      b.x += nx * (rr - d);
      b.y += ny * (rr - d);
      if (vn < 0) {
        const e = PHYS.bumperE * M.bumperMul;
        b.vx -= (1 + e) * vn * nx;
        b.vy -= (1 + e) * vn * ny;
        const kick = PHYS.bumperKick * (M.bumperMul > 1 ? 1.3 : 1);
        b.vx += nx * kick;
        b.vy += ny * kick;
        const s2 = Math.hypot(b.vx, b.vy);
        const cap = PHYS.maxShotSpeed * 1.15;
        if (s2 > cap) {
          b.vx *= cap / s2;
          b.vy *= cap / s2;
        }
        ev.push({ type: 'bumper', x: bp.x, y: bp.y, bp, speed: -vn });
      }
    }
    // 풍차
    for (const m of h.mills) {
      // 허브
      {
        const dx = b.x - m.x,
          dy = b.y - m.y;
        const d = Math.hypot(dx, dy);
        const rr = r + m.hubR;
        if (d < rr && d > 1e-4) {
          const imp = resolve(b, dx / d, dy / d, rr - d, PHYS.millE);
          if (imp > 25) ev.push({ type: 'wall', x: m.x + (dx / d) * m.hubR, y: m.y + (dy / d) * m.hubR, speed: imp, nx: dx / d, ny: dy / d, wood: true });
        }
      }
      const a0 = millAngle(m, t);
      for (let k = 0; k < m.arms; k++) {
        const a = a0 + (k * TAU) / m.arms;
        const ex = m.x + Math.cos(a) * m.len,
          ey = m.y + Math.sin(a) * m.len;
        const [cx, cy] = closestOnSeg(b.x, b.y, m.x, m.y, ex, ey);
        let dx = b.x - cx,
          dy = b.y - cy;
        const d = Math.hypot(dx, dy);
        const rr = r + m.bladeW / 2;
        if (d >= rr || d < 1e-4) continue;
        dx /= d;
        dy /= d;
        const svx = -m.speed * (cy - m.y),
          svy = m.speed * (cx - m.x);
        const imp = resolve(b, dx, dy, rr - d, PHYS.millE, svx, svy);
        if (imp > 25) ev.push({ type: 'wall', x: cx, y: cy, speed: imp, nx: dx, ny: dy, wood: true });
      }
    }
    // 움직이는 벽
    for (const mv of h.movers) {
      const p = moverPos(mv, t);
      const hl = mv.len / 2;
      const [cx, cy] = closestOnSeg(b.x, b.y, p.x - hl, p.y, p.x + hl, p.y);
      let dx = b.x - cx,
        dy = b.y - cy;
      const d = Math.hypot(dx, dy);
      const rr = r + 5;
      if (d >= rr) continue;
      if (d < 1e-4) {
        dx = 0;
        dy = b.vy > 0 ? -1 : 1;
      } else {
        dx /= d;
        dy /= d;
      }
      const imp = resolve(b, dx, dy, rr - d, PHYS.wallE, p.vx, 0);
      if (imp > 25) ev.push({ type: 'wall', x: cx, y: cy, speed: imp, nx: dx, ny: dy });
    }
    // 벽 안으로 파고듦 방지
    const tv = surfaceAt(h, b.x, b.y);
    if (tv === TILE.VOID) {
      const tx = Math.floor(b.x / T),
        ty = Math.floor(b.y / T);
      const inGhost = b.ghostComp >= 0 && h.comp && h.comp[ty * h.grid.cols + tx] === b.ghostComp;
      if (!inGhost) {
        b.x = px;
        b.y = py;
        b.vx *= -0.4;
        b.vy *= -0.4;
      }
    }
    // 컵
    let spn = Math.hypot(b.vx, b.vy);
    for (let i = 0; i < h.cups.length; i++) {
      if (st.cupGone[i]) continue;
      const c = cupPos(h, { t }, i);
      const dx = c.x - b.x,
        dy = c.y - b.y;
      const d = Math.hypot(dx, dy);
      const cr = PHYS.cupR * M.cupMul;
      if (d < cr) {
        const rel = Math.hypot(b.vx - c.vx, b.vy - c.vy);
        if (rel < PHYS.captureSpeed * M.captureMul * (M.teeShot ? 0.75 : 1)) {
          b.sunk = true;
          b.moving = false;
          b.sinkCup = i;
          b.sinkX = c.x;
          b.sinkY = c.y;
          ev.push({ type: 'cup', x: c.x, y: c.y, cup: i, speed: rel, ball: b });
          return;
        } else if (b.lip !== i) {
          b.lip = i;
          // 립아웃: 가장자리를 스친 쪽으로 꺾이고 감속
          const cross = (b.vx * dy - b.vy * dx) / (spn * d || 1);
          const ang = (cross >= 0 ? -1 : 1) * (0.25 + 0.5 * (d / cr));
          const cs = Math.cos(ang),
            sn = Math.sin(ang);
          const vx = b.vx * cs - b.vy * sn,
            vy = b.vx * sn + b.vy * cs;
          b.vx = vx * PHYS.lipSlow;
          b.vy = vy * PHYS.lipSlow;
          ev.push({ type: 'lip', x: c.x, y: c.y });
        }
      } else if (b.lip === i && d > cr + r) b.lip = -1;
    }
    // 마지막 안전 지점 (물 드롭 위치)
    if (tv !== TILE.WATER && tv !== TILE.VOID && b.ghostComp < 0) {
      b.safeX = b.x;
      b.safeY = b.y;
    }
    // 물
    if (tv === TILE.WATER) {
      spn = Math.hypot(b.vx, b.vy);
      if (!b.skimming && M.waterski && !b.skimUsed && spn > 110) {
        b.skimming = true;
        b.skimUsed = true;
        ev.push({ type: 'skim', x: b.x, y: b.y });
      }
      if (!b.skimming) {
        b.waterHit = true;
        b.moving = false;
        ev.push({ type: 'water', x: b.x, y: b.y, ball: b });
        return;
      }
    } else if (b.skimming) b.skimming = false;
    // 텔레포터
    for (let i = 0; i < h.teles.length; i++) {
      const tp = h.teles[i];
      for (const [from, to, key] of [
        [tp.a, tp.b, i * 2],
        [tp.b, tp.a, i * 2 + 1],
      ]) {
        const d = Math.hypot(b.x - from.x, b.y - from.y);
        if (b.teleLock === key) {
          if (d > PHYS.teleR + 8) b.teleLock = -1;
          continue;
        }
        if (d < PHYS.teleR && b.teleLock < 0) {
          ev.push({ type: 'tele', x: from.x, y: from.y, tx: to.x, ty: to.y });
          b.x = to.x + (b.x - from.x) * 0.2;
          b.y = to.y + (b.y - from.y) * 0.2;
          if (M.teleBoost > 1) {
            b.vx *= M.teleBoost;
            b.vy *= M.teleBoost;
          }
          b.teleLock = key ^ 1;
          break;
        }
      }
    }
    // 코인
    for (let i = 0; i < h.coins.length; i++) {
      if (st.coinTaken[i]) continue;
      const c = h.coins[i];
      if (Math.hypot(b.x - c.x, b.y - c.y) < PHYS.coinR * M.coinR) {
        st.coinTaken[i] = true;
        ev.push({ type: 'coin', x: c.x, y: c.y, i });
      }
    }
  }
  // 정지 판정
  const sp = Math.hypot(b.vx, b.vy);
  b.rollT += dt;
  if (sp < PHYS.stopSpeed) b.stopT += dt;
  else b.stopT = 0;
  if (b.stopT > PHYS.stopTime || b.rollT > PHYS.maxRollTime) {
    b.vx = b.vy = 0;
    b.moving = false;
    const tv = surfaceAt(h, b.x, b.y);
    if (tv === TILE.WATER) {
      b.waterHit = true;
      ev.push({ type: 'water', x: b.x, y: b.y, ball: b });
    } else if (!isPass(tv)) settleToFloor(h, b);
  }
}

export function settleToFloor(h, b) {
  const g = h.grid;
  let best = null,
    bd = 1e9;
  for (let y = 0; y < g.rows; y++)
    for (let x = 0; x < g.cols; x++) {
      if (!isPass(g.t[y * g.cols + x])) continue;
      const d = ((x + 0.5) * T - b.x) ** 2 + ((y + 0.5) * T - b.y) ** 2;
      if (d < bd) {
        bd = d;
        best = [x, y];
      }
    }
  if (best) {
    b.x = (best[0] + 0.5) * T;
    b.y = (best[1] + 0.5) * T;
  }
  b.ghostComp = -1;
}

export function stepWorld(h, st, dt, M, ev) {
  for (const b of st.balls) stepBall(h, st, b, dt, M, ev);
  st.t += dt;
}

// 조준선 미리보기: 정적 충돌체에 대해 원 캐스트, 반사 지점 목록 반환
export function previewPath(h, st, x, y, dx, dy, length, bounces) {
  const r = PHYS.ballR;
  const pts = [[x, y]];
  let px = x,
    py = y;
  let left = length;
  let nb = 0;
  const step = 3;
  let guard = 0;
  while (left > 0 && guard++ < 2000) {
    px += dx * step;
    py += dy * step;
    left -= step;
    let hitN = null;
    for (const sg of h.segs) {
      const [cx, cy] = closestOnSeg(px, py, sg.x1, sg.y1, sg.x2, sg.y2);
      const ddx = px - cx,
        ddy = py - cy;
      const d = Math.hypot(ddx, ddy);
      if (d < r) {
        hitN = d > 1e-3 ? [ddx / d, ddy / d] : [sg.nx, sg.ny];
        break;
      }
    }
    if (!hitN)
      for (const bp of h.bumpers) {
        const ddx = px - bp.x,
          ddy = py - bp.y;
        const d = Math.hypot(ddx, ddy);
        if (d < r + bp.r) {
          hitN = [ddx / d, ddy / d];
          break;
        }
      }
    if (!hitN)
      for (let i = 0; i < h.crates.length; i++) {
        if (!st.crateAlive[i]) continue;
        const c = h.crates[i];
        const hs = c.s / 2;
        const cx = Math.max(c.x - hs, Math.min(c.x + hs, px));
        const cy = Math.max(c.y - hs, Math.min(c.y + hs, py));
        const ddx = px - cx,
          ddy = py - cy;
        const d = Math.hypot(ddx, ddy);
        if (d < r) {
          hitN = d > 1e-3 ? [ddx / d, ddy / d] : [0, -1];
          break;
        }
      }
    if (!hitN)
      for (const m of h.mills) {
        const ddx = px - m.x,
          ddy = py - m.y;
        const d = Math.hypot(ddx, ddy);
        if (d < r + m.hubR) {
          hitN = [ddx / d, ddy / d];
          break;
        }
      }
    if (hitN) {
      px -= dx * step;
      py -= dy * step;
      pts.push([px, py]);
      const vn = dx * hitN[0] + dy * hitN[1];
      if (vn < 0) {
        dx -= 2 * vn * hitN[0];
        dy -= 2 * vn * hitN[1];
      }
      nb++;
      if (nb > bounces) return { pts, end: true };
    }
  }
  pts.push([px, py]);
  return { pts, end: false };
}
