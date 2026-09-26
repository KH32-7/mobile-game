// 파티클(인스턴싱), 떠오르는 숫자 팝업
import * as THREE from 'three';

const MAXP = 900;

export class Particles {
  constructor(scene) {
    const g = new THREE.BoxGeometry(1, 1, 1);
    this.mesh = new THREE.InstancedMesh(g, new THREE.MeshLambertMaterial({ color: 0xffffff }), MAXP);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.setColorAt(0, new THREE.Color());
    this.mesh.frustumCulled = false;
    this.mesh.count = 0;
    scene.add(this.mesh);
    this.list = [];
    this.m = new THREE.Matrix4();
    this.q = new THREE.Quaternion();
    this.e = new THREE.Euler();
    this.v = new THREE.Vector3();
    this.s = new THREE.Vector3();
    this.c = new THREE.Color();
  }

  spawn(x, y, z, opts = {}) {
    if (this.list.length >= MAXP) this.list.shift();
    const sp = opts.speed ?? 4;
    const a = Math.random() * Math.PI * 2;
    const up = opts.up ?? 3;
    this.list.push({
      x, y, z,
      vx: Math.cos(a) * sp * Math.random() + (opts.vx || 0),
      vy: up + Math.random() * up + (opts.vy || 0),
      vz: Math.sin(a) * sp * Math.random() + (opts.vz || 0),
      life: opts.life ?? 0.6 + Math.random() * 0.4,
      max: 0,
      size: (opts.size ?? 0.14) * (0.6 + Math.random() * 0.8),
      color: opts.color ?? 0xffffff,
      g: opts.gravity ?? 14,
      rx: Math.random() * 6, ry: Math.random() * 6,
      spin: (Math.random() - 0.5) * (opts.spin ?? 14),
      ground: opts.ground ?? true,
      sx: opts.sx ?? 1, sy: opts.sy ?? 1, sz: opts.sz ?? 1,
    });
    const p = this.list[this.list.length - 1];
    p.max = p.life;
  }

  burst(x, y, z, n, opts) { for (let i = 0; i < n; i++) this.spawn(x, y, z, opts); }

  update(dt) {
    let n = 0;
    const L = this.list;
    for (let i = L.length - 1; i >= 0; i--) {
      const p = L[i];
      p.life -= dt;
      if (p.life <= 0) { L[i] = L[L.length - 1]; L.pop(); continue; }
      p.vy -= p.g * dt;
      p.x += p.vx * dt; p.y += p.vy * dt; p.z += p.vz * dt;
      if (p.ground && p.y < p.size * 0.5) { p.y = p.size * 0.5; p.vy *= -0.35; p.vx *= 0.7; p.vz *= 0.7; p.spin *= 0.6; }
      p.rx += p.spin * dt; p.ry += p.spin * 0.7 * dt;
    }
    for (let i = 0; i < L.length && n < MAXP; i++) {
      const p = L[i];
      const k = Math.min(1, p.life / (p.max * 0.35));
      const s = p.size * k;
      this.e.set(p.rx, p.ry, 0);
      this.q.setFromEuler(this.e);
      this.v.set(p.x, p.y, p.z);
      this.s.set(s * p.sx, s * p.sy, s * p.sz);
      this.m.compose(this.v, this.q, this.s);
      this.mesh.setMatrixAt(n, this.m);
      this.c.setHex(p.color);
      this.mesh.setColorAt(n, this.c);
      n++;
    }
    this.mesh.count = n;
    this.mesh.instanceMatrix.needsUpdate = true;
    this.mesh.instanceColor.needsUpdate = true;
  }

  clear() { this.list.length = 0; this.mesh.count = 0; }
}

export class Popups {
  constructor(layer, camera) {
    this.layer = layer;
    this.camera = camera;
    this.v = new THREE.Vector3();
  }

  show(x, y, z, text, cls = '') {
    this.v.set(x, y, z).project(this.camera);
    if (this.v.z > 1) return;
    const r = this.layer.getBoundingClientRect();
    const px = (this.v.x * 0.5 + 0.5) * r.width;
    const py = (-this.v.y * 0.5 + 0.5) * r.height;
    this.showScreen(px, py, text, cls);
  }

  showScreen(px, py, text, cls = '') {
    const el = document.createElement('div');
    el.className = 'popup ' + cls;
    el.textContent = text;
    el.style.left = Math.max(40, Math.min(this.layer.clientWidth - 40, px)) + 'px';
    el.style.top = py + 'px';
    this.layer.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  }
}
