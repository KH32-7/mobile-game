// 충돌(원 vs 박스/스타디움) + 가시성 그래프 길찾기
export class Nav {
  constructor(bounds) {
    this.bounds = bounds;
    this.obs = [];
    this.nodes = [];
    this.edges = null;
  }
  setObstacles(obs) {
    this.obs = obs;
    this.buildGraph();
  }
  // 원 밀어내기
  collide(p, r) {
    for (let iter = 0; iter < 2; iter++) {
      for (const o of this.obs) {
        if (o.t === 'box') {
          const cx = Math.max(o.x - o.hw, Math.min(p.x, o.x + o.hw));
          const cz = Math.max(o.z - o.hd, Math.min(p.z, o.z + o.hd));
          const dx = p.x - cx;
          const dz = p.z - cz;
          const d2 = dx * dx + dz * dz;
          if (d2 < r * r) {
            if (d2 > 1e-8) {
              const d = Math.sqrt(d2);
              p.x = cx + (dx / d) * r;
              p.z = cz + (dz / d) * r;
            } else {
              // 박스 내부: 가장 가까운 면으로
              const ex = [o.x - o.hw - r - p.x, o.x + o.hw + r - p.x];
              const ez = [o.z - o.hd - r - p.z, o.z + o.hd + r - p.z];
              const cands = [ex[0], ex[1], ez[0], ez[1]];
              let bi = 0;
              for (let i = 1; i < 4; i++) if (Math.abs(cands[i]) < Math.abs(cands[bi])) bi = i;
              if (bi < 2) p.x += cands[bi];
              else p.z += cands[bi];
            }
          }
        } else {
          // 스타디움: 세그먼트 (x, z0)-(x, z1) 에서 거리 rad
          const cz = Math.max(o.z0, Math.min(p.z, o.z1));
          const dx = p.x - o.x;
          const dz = p.z - cz;
          const d = Math.hypot(dx, dz);
          const R = o.rad + r;
          if (d < R) {
            if (d > 1e-6) {
              p.x = o.x + (dx / d) * R;
              p.z = cz + (dz / d) * R;
            } else p.x = o.x + R;
          }
        }
      }
    }
    const b = this.bounds;
    p.x = Math.max(b.x0 + r, Math.min(b.x1 - r, p.x));
    p.z = Math.max(b.z0 + r, Math.min(b.z1 - r, p.z));
  }
  inside(x, z, pad) {
    const b = this.bounds;
    if (x < b.x0 + 0.2 || x > b.x1 - 0.2 || z < b.z0 + 0.2 || z > b.z1 - 0.2) return true;
    for (const o of this.obs) {
      if (o.t === 'box') {
        if (Math.abs(x - o.x) < o.hw + pad && Math.abs(z - o.z) < o.hd + pad) return true;
      } else {
        const cz = Math.max(o.z0, Math.min(z, o.z1));
        if (Math.hypot(x - o.x, z - cz) < o.rad + pad) return true;
      }
    }
    return false;
  }
  segClear(ax, az, bx, bz, pad) {
    for (const o of this.obs) {
      if (o.t === 'box') {
        if (segBox(ax, az, bx, bz, o.x - o.hw - pad, o.z - o.hd - pad, o.x + o.hw + pad, o.z + o.hd + pad)) return false;
      } else {
        if (segSegDist(ax, az, bx, bz, o.x, o.z0, o.x, o.z1) < o.rad + pad) return false;
      }
    }
    return true;
  }
  buildGraph() {
    const P = 0.55;
    const nodes = [];
    for (const o of this.obs) {
      if (o.t === 'box') {
        for (const sx of [-1, 1]) for (const sz of [-1, 1]) nodes.push({ x: o.x + sx * (o.hw + P), z: o.z + sz * (o.hd + P) });
      } else {
        const R = o.rad + P + 0.1;
        for (let i = 0; i < 12; i++) {
          const a = (i / 12) * Math.PI * 2;
          const zc = Math.sin(a) > 0 ? o.z1 : o.z0;
          nodes.push({ x: o.x + Math.cos(a) * R, z: zc + Math.sin(a) * R });
        }
        nodes.push({ x: o.x + R, z: (o.z0 + o.z1) / 2 }, { x: o.x - R, z: (o.z0 + o.z1) / 2 });
      }
    }
    this.nodes = nodes.filter((n) => !this.inside(n.x, n.z, 0.32));
    const n = this.nodes.length;
    this.edges = Array.from({ length: n }, () => []);
    for (let i = 0; i < n; i++)
      for (let j = i + 1; j < n; j++) {
        const a = this.nodes[i];
        const b = this.nodes[j];
        if (this.segClear(a.x, a.z, b.x, b.z, 0.28)) {
          const d = Math.hypot(a.x - b.x, a.z - b.z);
          this.edges[i].push([j, d]);
          this.edges[j].push([i, d]);
        }
      }
  }
  path(ax, az, bx, bz) {
    if (this.segClear(ax, az, bx, bz, 0.28)) return [{ x: bx, z: bz }];
    const n = this.nodes.length;
    const S = n;
    const T = n + 1;
    const dist = new Float64Array(n + 2).fill(Infinity);
    const prev = new Int32Array(n + 2).fill(-1);
    const done = new Uint8Array(n + 2);
    const nb = (i) => {
      if (i === S) {
        const out = [];
        for (let j = 0; j < n; j++) {
          const q = this.nodes[j];
          if (this.segClear(ax, az, q.x, q.z, 0.28)) out.push([j, Math.hypot(ax - q.x, az - q.z)]);
        }
        return out;
      }
      const p = this.nodes[i];
      const out = this.edges[i].slice();
      if (this.segClear(p.x, p.z, bx, bz, 0.28)) out.push([T, Math.hypot(p.x - bx, p.z - bz)]);
      return out;
    };
    dist[S] = 0;
    for (let it = 0; it < n + 2; it++) {
      let u = -1;
      let best = Infinity;
      for (let i = 0; i < n + 2; i++) if (!done[i] && dist[i] < best) {
        best = dist[i];
        u = i;
      }
      if (u < 0 || u === T) break;
      done[u] = 1;
      for (const [v, w] of nb(u)) {
        if (dist[u] + w < dist[v]) {
          dist[v] = dist[u] + w;
          prev[v] = u;
        }
      }
    }
    if (!isFinite(dist[T])) return [{ x: bx, z: bz }];
    const out = [];
    let c = T;
    while (c !== S && c >= 0) {
      if (c === T) out.push({ x: bx, z: bz });
      else out.push({ x: this.nodes[c].x, z: this.nodes[c].z });
      c = prev[c];
    }
    return out.reverse();
  }
}

function segBox(ax, az, bx, bz, x0, z0, x1, z1) {
  let t0 = 0;
  let t1 = 1;
  const dx = bx - ax;
  const dz = bz - az;
  const clip = (p, q) => {
    if (Math.abs(p) < 1e-9) return q >= 0;
    const r = q / p;
    if (p < 0) {
      if (r > t1) return false;
      if (r > t0) t0 = r;
    } else {
      if (r < t0) return false;
      if (r < t1) t1 = r;
    }
    return true;
  };
  return clip(-dx, ax - x0) && clip(dx, x1 - ax) && clip(-dz, az - z0) && clip(dz, z1 - az) && t0 <= t1;
}

function segSegDist(ax, az, bx, bz, cx, cz, dx, dz) {
  const ux = bx - ax;
  const uz = bz - az;
  const vx = dx - cx;
  const vz = dz - cz;
  const wx = ax - cx;
  const wz = az - cz;
  const a = ux * ux + uz * uz;
  const b = ux * vx + uz * vz;
  const c = vx * vx + vz * vz;
  const d = ux * wx + uz * wz;
  const e = vx * wx + vz * wz;
  const D = a * c - b * b;
  let sN;
  let sD = D;
  let tN;
  let tD = D;
  if (D < 1e-9) {
    sN = 0;
    sD = 1;
    tN = e;
    tD = c;
  } else {
    sN = b * e - c * d;
    tN = a * e - b * d;
    if (sN < 0) {
      sN = 0;
      tN = e;
      tD = c;
    } else if (sN > sD) {
      sN = sD;
      tN = e + b;
      tD = c;
    }
  }
  if (tN < 0) {
    tN = 0;
    if (-d < 0) sN = 0;
    else if (-d > a) sN = sD;
    else {
      sN = -d;
      sD = a;
    }
  } else if (tN > tD) {
    tN = tD;
    if (-d + b < 0) sN = 0;
    else if (-d + b > a) sN = sD;
    else {
      sN = -d + b;
      sD = a;
    }
  }
  const sc = Math.abs(sN) < 1e-9 ? 0 : sN / sD;
  const tc = Math.abs(tN) < 1e-9 ? 0 : tN / tD;
  const px = wx + sc * ux - tc * vx;
  const pz = wz + sc * uz - tc * vz;
  return Math.hypot(px, pz);
}
