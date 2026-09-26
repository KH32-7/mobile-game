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
      const e = new THREE.SphereGeometry(0.075, 7, 5); e.scale(1, 1.15, 0.6); e.translate(s * 0.08, 0.56, -0.165); parts.push(e); cols.push(white);
      const p = new THREE.SphereGeometry(0.042, 6, 4); p.scale(1, 1.15, 0.6); p.translate(s * 0.08, 0.55, -0.205); parts.push(p); cols.push(black);
      const c = new THREE.SphereGeometry(0.04, 5, 3); c.scale(1.3, 0.7, 0.4); c.translate(s * 0.13, 0.44, -0.17); parts.push(c); cols.push(pink);
    }
    // 등쪽 하이라이트 (뒤에서 봐도 귀엽게)
    const hl = new THREE.SphereGeometry(0.06, 6, 4); hl.scale(1, 1.4, 0.5); hl.translate(0.07, 0.62, 0.17); parts.push(hl); cols.push(new THREE.Color(1, 1, 1));
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

    scene.add(this.shadow, this.body, this.eyes);

    this.m = new THREE.Matrix4();
    this.q = new THREE.Quaternion();
    this.p = new THREE.Vector3();
    this.s = new THREE.Vector3();
    this.e = new THREE.Euler();
    this.col = new THREE.Color();
    this.n = 0;
    this.ns = 0;
  }

  begin() { this.n = 0; this.ns = 0; }

  // yaw: 0 이면 -z(진행 방향)를 바라봄
  push(x, y, z, yaw, sx, sy, sz, color, roll = 0, pitch = 0, shadow = true) {
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
  }
}
