// 젤리 캐릭터 인스턴싱 렌더러 (아군, 적, 날아가는 캐릭터 공용)
import * as THREE from 'three';
import { mergeSimple } from './world.js';

const MAX = 720;

export class CharRenderer {
  constructor(scene) {
    const body = new THREE.CapsuleGeometry(0.2, 0.38, 3, 8);
    body.translate(0, 0.39, 0);
    this.body = new THREE.InstancedMesh(body, new THREE.MeshLambertMaterial({ color: 0xffffff }), MAX);
    this.body.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.body.setColorAt(0, new THREE.Color());
    this.body.instanceColor.setUsage(THREE.DynamicDrawUsage);
    this.body.frustumCulled = false;

    const parts = [], cols = [];
    const white = new THREE.Color(1, 1, 1), black = new THREE.Color(0.05, 0.05, 0.1), pink = new THREE.Color(1, 0.55, 0.65);
    for (const s of [-1, 1]) {
      const e = new THREE.SphereGeometry(0.075, 6, 4); e.scale(1, 1.15, 0.6); e.translate(s * 0.08, 0.56, -0.165); parts.push(e); cols.push(white);
      const p = new THREE.SphereGeometry(0.042, 5, 3); p.scale(1, 1.15, 0.6); p.translate(s * 0.08, 0.55, -0.205); parts.push(p); cols.push(black);
      const c = new THREE.SphereGeometry(0.04, 4, 2); c.scale(1.3, 0.7, 0.4); c.translate(s * 0.13, 0.44, -0.17); parts.push(c); cols.push(pink);
    }
    // 등쪽 무늬: 하이라이트 + 물방울 점 3개 (뒤에서 봐도 귀엽게)
    const hl = new THREE.SphereGeometry(0.06, 5, 3); hl.scale(1, 1.4, 0.5); hl.translate(0.08, 0.63, 0.17); parts.push(hl); cols.push(new THREE.Color(1, 1, 1));
    for (const [dx, dy, r] of [[-0.06, 0.5, 0.045], [0.02, 0.38, 0.035], [-0.07, 0.3, 0.03]]) {
      const sp = new THREE.SphereGeometry(r, 5, 3); sp.scale(1, 1, 0.45); sp.translate(dx, dy, 0.19); parts.push(sp); cols.push(new THREE.Color(1, 0.95, 0.7));
    }
    // 머리 위 더듬이 (모자 포인트)
    const st = new THREE.CylinderGeometry(0.012, 0.012, 0.14, 4); st.translate(0, 0.83, 0.02); parts.push(st); cols.push(new THREE.Color(0.2, 0.2, 0.3));
    const ball = new THREE.SphereGeometry(0.045, 5, 3); ball.translate(0, 0.91, 0.02); parts.push(ball); cols.push(new THREE.Color(1, 0.85, 0.3));
    const eyes = mergeSimple(parts.map((g) => g.toNonIndexed ? g : g), cols);
    this.eyes = new THREE.InstancedMesh(eyes, new THREE.MeshBasicMaterial({ vertexColors: true }), MAX);
    this.eyes.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.eyes.frustumCulled = false;

    const sh = new THREE.CircleGeometry(0.24, 10);
    sh.rotateX(-Math.PI / 2);
    this.shadow = new THREE.InstancedMesh(sh, new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.22, depthWrite: false }), MAX);
    this.shadow.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.shadow.frustumCulled = false;
    this.shadow.renderOrder = -1;

    // 팔다리 (캐릭터당 4개, 관절이 위쪽에 오도록)
    const limb = new THREE.CapsuleGeometry(0.055, 0.12, 1, 4);
    limb.translate(0, -0.1, 0);
    this.limbs = new THREE.InstancedMesh(limb, new THREE.MeshLambertMaterial({ color: 0xffffff }), MAX * 4);
    this.limbs.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.limbs.setColorAt(0, new THREE.Color());
    this.limbs.frustumCulled = false;
    this.nl = 0;
    this.lm = new THREE.Matrix4();
    this.lo = new THREE.Matrix4();
    this.le = new THREE.Euler();
    this.lq = new THREE.Quaternion();
    this.lp = new THREE.Vector3();
    this.one = new THREE.Vector3(1, 1, 1);
    this.lc = new THREE.Color();
    // [x, y, 좌우 벌림, 위상 부호, 팔 여부]
    this.joints = [[-0.1, 0.14, 0.05, 1, 0], [0.1, 0.14, -0.05, -1, 0], [-0.2, 0.46, 0.55, -1, 1], [0.2, 0.46, -0.55, 1, 1]];

    scene.add(this.shadow, this.body, this.eyes, this.limbs);

    this.m = new THREE.Matrix4();
    this.q = new THREE.Quaternion();
    this.p = new THREE.Vector3();
    this.s = new THREE.Vector3();
    this.e = new THREE.Euler();
    this.col = new THREE.Color();
    this.n = 0;
    this.ns = 0;
  }

  begin() { this.n = 0; this.ns = 0; this.nl = 0; }

  // yaw: 0 이면 -z(진행 방향)를 바라봄
  push(x, y, z, yaw, sx, sy, sz, color, roll = 0, pitch = 0, shadow = true, limbPh = null, limbAmp = 0.9) {
    if (this.n >= MAX) return;
    const i = this.n++;
    this.p.set(x, y, z);
    this.e.set(pitch, yaw, roll);
    this.q.setFromEuler(this.e);
    this.s.set(sx, sy, sz);
    this.m.compose(this.p, this.q, this.s);
    this.body.setMatrixAt(i, this.m);
    this.eyes.setMatrixAt(i, this.m);
    this.col.setHex(color);
    this.body.setColorAt(i, this.col);
    if (limbPh !== null && this.nl < MAX * 4 - 4) {
      const body = this.m;
      this.lc.copy(this.col).multiplyScalar(0.78);
      for (const [jx, jy, splay, sgn, arm] of this.joints) {
        const sw = Math.sin(limbPh) * limbAmp * sgn * (arm ? 0.9 : 0.8);
        this.le.set(sw, 0, splay);
        this.lq.setFromEuler(this.le);
        this.lp.set(jx, jy, 0);
        this.lo.compose(this.lp, this.lq, this.one);
        this.lm.multiplyMatrices(body, this.lo);
        this.limbs.setMatrixAt(this.nl, this.lm);
        this.limbs.setColorAt(this.nl, this.lc);
        this.nl++;
      }
    }
    if (shadow && this.ns < MAX) {
      const k = Math.max(0.3, 1 - y * 0.35);
      this.m.makeScale(sx * k, 1, sz * k);
      this.m.setPosition(x, 0.02, z);
      this.shadow.setMatrixAt(this.ns++, this.m);
    }
  }

  end() {
    this.body.count = this.n;
    this.eyes.count = this.n;
    this.shadow.count = this.ns;
    this.body.instanceMatrix.needsUpdate = true;
    this.eyes.instanceMatrix.needsUpdate = true;
    this.body.instanceColor.needsUpdate = true;
    this.shadow.instanceMatrix.needsUpdate = true;
    this.limbs.count = this.nl;
    this.limbs.instanceMatrix.needsUpdate = true;
    if (this.limbs.instanceColor) this.limbs.instanceColor.needsUpdate = true;
  }
}

// 리더 머리 장식 (스킨별)
export class Hat {
  constructor(scene) {
    this.g = new THREE.Group();
    scene.add(this.g);
    this.type = null;
  }

  set(type, color) {
    if (type === this.type) return;
    this.type = type;
    this.g.clear();
    const L = (c) => new THREE.MeshLambertMaterial({ color: c });
    const add = (geo, mat, x, y, z, rx = 0, rz = 0) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.rotation.set(rx, 0, rz); this.g.add(m); return m; };
    if (type === 'crown') {
      const gold = L(0xffd23a);
      add(new THREE.CylinderGeometry(0.17, 0.17, 0.1, 10, 1, true), gold, 0, 0.8, 0);
      for (let i = 0; i < 5; i++) { const a = (i / 5) * Math.PI * 2; add(new THREE.ConeGeometry(0.05, 0.12, 4), gold, Math.cos(a) * 0.15, 0.9, Math.sin(a) * 0.15); }
      add(new THREE.SphereGeometry(0.035, 6, 4), L(0xff3b6a), 0, 0.8, -0.17);
    } else if (type === 'ears') {
      for (const s of [-1, 1]) { add(new THREE.SphereGeometry(0.08, 8, 6), L(color), s * 0.13, 0.76, 0); add(new THREE.SphereGeometry(0.045, 6, 4), L(0xffb0a0), s * 0.13, 0.76, -0.05); }
    } else if (type === 'bunny') {
      for (const s of [-1, 1]) { const e = add(new THREE.CapsuleGeometry(0.045, 0.22, 2, 6), L(0xffffff), s * 0.08, 0.92, 0.02, 0, s * -0.2); e.scale.z = 0.6; }
    } else if (type === 'helmet') {
      add(new THREE.SphereGeometry(0.215, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2.2), L(0x9aa6c0), 0, 0.57, 0);
      add(new THREE.BoxGeometry(0.03, 0.14, 0.12), L(0xff4a5a), 0, 0.82, 0.02);
    } else if (type === 'horn') {
      for (const s of [-1, 1]) add(new THREE.ConeGeometry(0.045, 0.16, 6), L(0x8a1a2a), s * 0.1, 0.8, 0, 0, s * -0.4);
    } else if (type === 'leaf') {
      add(new THREE.CylinderGeometry(0.012, 0.012, 0.1, 4), L(0x3a8a3a), 0, 0.8, 0);
      for (const s of [-1, 1]) { const l = add(new THREE.SphereGeometry(0.07, 6, 4), L(0x5ad05a), s * 0.06, 0.86, 0, 0, s * -0.6); l.scale.set(1, 0.4, 0.6); }
    } else if (type === 'band') {
      add(new THREE.CylinderGeometry(0.205, 0.205, 0.07, 12, 1, true), L(0xff3b4f), 0, 0.6, 0);
      for (const s of [-1, 1]) add(new THREE.BoxGeometry(0.03, 0.05, 0.16), L(0xff3b4f), s * 0.03, 0.6, 0.26, 0.4 * s, 0);
    }
  }

  place(x, y, z, sx, sy, sz, roll, pitch, visible, yaw = 0) {
    this.g.visible = visible && this.g.children.length > 0;
    if (!this.g.visible) return;
    this.g.position.set(x, y, z);
    this.g.scale.set(sx, sy, sz);
    this.g.rotation.set(pitch, yaw, roll);
  }
}
