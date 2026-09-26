// 스타디움형 컨베이어 벨트: 경로 수학, 슬롯, 메시
import { THREE, canvasTex, Build, GEO, matVC } from './gfx.js';
import { CFG } from './config.js';
import { COUNTER_IN, COUNTER_OUT } from './layout.js';

export class Belt {
  constructor(def, len) {
    this.id = def.id;
    this.cx = def.cx;
    this.topZ = def.topZ;
    this.r = def.r;
    this.offset = 0;
    this.slots = [];
    this.built = false;
    this.group = null;
    this.setLen(len);
  }
  setLen(len) {
    const old = this.slots.filter((s) => s.item).map((s) => s.item);
    this.len = len;
    this.L = 2 * len + 2 * Math.PI * this.r;
    const n = Math.max(6, Math.floor(this.L / CFG.belt.spacing));
    this.sp = this.L / n;
    this.slots = [];
    for (let i = 0; i < n; i++) this.slots.push({ i, item: null, res: false, prevS: 0 });
    old.forEach((it, i) => {
      if (i < n) this.slots[Math.floor((i * n) / Math.max(1, old.length)) % n].item = it;
    });
    this.feedS = 2 * len + 1.5 * Math.PI * this.r;
    for (const s of this.slots) s.prevS = this.slotS(s);
  }
  // s 위치의 점과 진행 방향 각도
  point(s, out = { x: 0, z: 0, a: 0 }) {
    const { len, r, cx, topZ } = this;
    s = ((s % this.L) + this.L) % this.L;
    const arc = Math.PI * r;
    if (s < len) {
      out.x = cx + r;
      out.z = topZ + s;
      out.a = 0; // +z 방향
    } else if (s < len + arc) {
      const a = (s - len) / r;
      out.x = cx + r * Math.cos(a);
      out.z = topZ + len + r * Math.sin(a);
      out.a = a;
    } else if (s < 2 * len + arc) {
      out.x = cx - r;
      out.z = topZ + len - (s - len - arc);
      out.a = Math.PI;
    } else {
      const a = Math.PI + (s - 2 * len - arc) / r;
      out.x = cx + r * Math.cos(a);
      out.z = topZ + r * Math.sin(a);
      out.a = a;
    }
    return out;
  }
  slotS(slot) {
    return (this.offset + slot.i * this.sp) % this.L;
  }
  nearestS(x, z) {
    let best = 0;
    let bd = 1e9;
    const p = {};
    for (let s = 0; s < this.L; s += 0.05) {
      this.point(s, p);
      const d = (p.x - x) ** 2 + (p.z - z) ** 2;
      if (d < bd) {
        bd = d;
        best = s;
      }
    }
    return best;
  }
  dist(a, b) {
    let d = Math.abs(a - b) % this.L;
    return Math.min(d, this.L - d);
  }
  // 벨트 위를 지나는 슬롯 중 s 근처(창) 슬롯
  slotNear(s, win) {
    for (const sl of this.slots) {
      if (this.dist(this.slotS(sl), s) < win) return sl;
    }
    return null;
  }
  count() {
    let n = 0;
    for (const s of this.slots) if (s.item || s.res) n++;
    return n;
  }
  free() {
    return this.slots.length - this.count();
  }
  // 캡슐 충돌: 중심선 세그먼트
  seg() {
    return { x: this.cx, z0: this.topZ, z1: this.topZ + this.len };
  }
  update(dt, speed, onLap) {
    this.offset = (this.offset + speed * dt) % this.L;
    for (const sl of this.slots) {
      const s = this.slotS(sl);
      if (sl.item) {
        // 투입구 지점 통과 시 바퀴 수 증가
        const p = sl.prevS;
        const f = this.feedS;
        const crossed = p <= s ? p < f && s >= f : p < f || s >= f;
        if (crossed) onLap(sl);
      }
      sl.prevS = s;
    }
  }
}

// ---------- 메시 ----------
let beltTex = null;
function getBeltTex() {
  if (beltTex) return beltTex;
  beltTex = canvasTex(
    128,
    64,
    (ctx, w, h) => {
      ctx.fillStyle = '#5b6072';
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 4; i++) {
        const x = i * 32;
        const g = ctx.createLinearGradient(x, 0, x + 32, 0);
        g.addColorStop(0, '#8d93a8');
        g.addColorStop(0.5, '#a9aec0');
        g.addColorStop(1, '#7c8296');
        ctx.fillStyle = g;
        ctx.fillRect(x + 2, 4, 28, h - 8);
        ctx.fillStyle = 'rgba(255,255,255,0.25)';
        ctx.fillRect(x + 3, 6, 26, 3);
      }
    },
    true
  );
  return beltTex;
}

function stadiumShape(cx, topZ, len, rad) {
  // shape 은 XY 평면에 그리고 나중에 회전 (y = -z)
  const s = new THREE.Shape();
  const segs = 20;
  const pts = [];
  for (let i = 0; i <= segs; i++) {
    const a = -Math.PI / 2 + (i / segs) * Math.PI; // 오른쪽 반원 (위->아래)
    pts.push([cx + Math.cos(a) * rad, topZ + len + Math.sin(a) * rad]);
  }
  pts.length = 0;
  // 오른쪽 직선 + 아래 반원 + 왼쪽 직선 + 위 반원
  for (let i = 0; i <= segs; i++) {
    const a = (i / segs) * Math.PI;
    pts.push([cx + rad * Math.cos(a), topZ + len + rad * Math.sin(a)]);
  }
  for (let i = 0; i <= segs; i++) {
    const a = Math.PI + (i / segs) * Math.PI;
    pts.push([cx + rad * Math.cos(a), topZ + rad * Math.sin(a)]);
  }
  pts.forEach(([x, z], i) => (i === 0 ? s.moveTo(x, -z) : s.lineTo(x, -z)));
  s.closePath();
  return s;
}

function ringGeo(cx, topZ, len, rIn, rOut, h) {
  const outer = stadiumShape(cx, topZ, len, rOut);
  if (rIn > 0) {
    const hole = stadiumShape(cx, topZ, len, rIn);
    outer.holes.push(new THREE.Path(hole.getPoints().reverse()));
  }
  const g = new THREE.ExtrudeGeometry(outer, { depth: h, bevelEnabled: false, curveSegments: 4 });
  g.rotateX(-Math.PI / 2);
  return g;
}

// 벨트 + 카운터 메시 그룹 생성
export function buildBeltMesh(belt, theme) {
  const grp = new THREE.Group();
  const { cx, topZ, len, r } = belt;
  const H = 0.78;
  const b = new Build();
  // 카운터 몸체
  b.addGeo(tint(ringGeo(cx, topZ, len, r - COUNTER_IN, r + COUNTER_OUT, H - 0.06), theme.counter));
  // 카운터 상판
  b.addGeo(tint(ringGeo(cx, topZ, len, r - COUNTER_IN - 0.05, r + COUNTER_OUT + 0.06, 0.07), theme.counterTop, H - 0.07));
  // 벨트 양쪽 레일
  b.addGeo(tint(ringGeo(cx, topZ, len, r + 0.3, r + 0.36, 0.06), '#c9ccd6', H));
  b.addGeo(tint(ringGeo(cx, topZ, len, r - 0.36, r - 0.3, 0.06), '#c9ccd6', H));
  // 안쪽 섬 장식 (화분 + 등)
  const inner = b.mesh(matVC, true);
  inner.receiveShadow = true;
  grp.add(inner);

  // 움직이는 벨트 표면 (리본)
  const pos = [];
  const uv = [];
  const idx = [];
  const p = {};
  const N = Math.ceil(belt.L / 0.1);
  for (let i = 0; i <= N; i++) {
    const s = (i / N) * belt.L;
    belt.point(s, p);
    // 진행 방향의 법선 (바깥 방향)
    const nx = dirNormal(belt, s);
    const w = 0.3;
    pos.push(p.x + nx.x * w, H + 0.015, p.z + nx.z * w, p.x - nx.x * w, H + 0.015, p.z - nx.z * w);
    uv.push(s / 0.5, 0, s / 0.5, 1);
    if (i < N) {
      const a = i * 2;
      idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  // 법선이 아래를 향하면 뒤집기
  if (g.attributes.normal.getY(0) < 0) {
    for (let i = 0; i < idx.length; i += 3) {
      const t = idx[i];
      idx[i] = idx[i + 2];
      idx[i + 2] = t;
    }
    g.setIndex(idx);
    g.computeVertexNormals();
  }
  const tex = getBeltTex();
  const mat = new THREE.MeshLambertMaterial({ map: tex });
  const ribbon = new THREE.Mesh(g, mat);
  ribbon.receiveShadow = true;
  grp.add(ribbon);
  grp.userData.ribbon = ribbon;
  return grp;
}

function dirNormal(belt, s) {
  const a = {};
  const b2 = {};
  belt.point(s - 0.02, a);
  belt.point(s + 0.02, b2);
  const dx = b2.x - a.x;
  const dz = b2.z - a.z;
  const l = Math.hypot(dx, dz) || 1;
  // 시계 방향 진행 기준 바깥쪽 = (dz, -dx)? 방향 무관하게 폭만 쓰므로 부호 상관 없음
  return { x: -dz / l, z: dx / l };
}

function tint(geo, color, y = 0) {
  const g = geo.index ? geo.toNonIndexed() : geo;
  for (const k of Object.keys(g.attributes)) if (k !== 'position' && k !== 'normal') g.deleteAttribute(k);
  g.translate(0, y, 0);
  const n = g.attributes.position.count;
  const c = new THREE.Color(color);
  const arr = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    arr[i * 3] = c.r;
    arr[i * 3 + 1] = c.g;
    arr[i * 3 + 2] = c.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(arr, 3));
  return g;
}

export function animateBeltTex(dt, speed) {
  const t = getBeltTex();
  t.offset.x -= (speed * dt) / 0.5;
}
export const BELT_H = 0.78;
export { GEO };
