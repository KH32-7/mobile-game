import * as THREE from 'three';

const _c = new THREE.Color();
const _v = new THREE.Vector3();

// 파티클 (Points 풀), 충격파 링, 번개, 데미지 숫자
export class FX {
  constructor(scene, camera, layer) {
    this.scene = scene;
    this.camera = camera;
    this.layer = layer;
    const N = 900;
    this.N = N;
    this.pos = new Float32Array(N * 3);
    this.vel = new Float32Array(N * 3);
    this.col = new Float32Array(N * 4);
    this.size = new Float32Array(N);
    this.life = new Float32Array(N);
    this.maxLife = new Float32Array(N);
    this.baseSize = new Float32Array(N);
    this.grav = new Float32Array(N);
    this.cursor = 0;
    const geo = new THREE.BufferGeometry();
    this.posAttr = new THREE.BufferAttribute(this.pos, 3).setUsage(THREE.DynamicDrawUsage);
    this.colAttr = new THREE.BufferAttribute(this.col, 4).setUsage(THREE.DynamicDrawUsage);
    this.sizeAttr = new THREE.BufferAttribute(this.size, 1).setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('position', this.posAttr);
    geo.setAttribute('aCol', this.colAttr);
    geo.setAttribute('aSize', this.sizeAttr);
    this.uScale = { value: 400 };
    const mat = new THREE.ShaderMaterial({
      uniforms: { uScale: this.uScale },
      transparent: true,
      depthWrite: false,
      vertexShader: `
        attribute vec4 aCol; attribute float aSize; uniform float uScale; varying vec4 vCol;
        void main(){
          vCol = aCol;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * uScale / max(0.1, -mv.z);
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: `
        varying vec4 vCol;
        void main(){
          vec2 p = gl_PointCoord - 0.5;
          float d = length(p);
          if (d > 0.5) discard;
          gl_FragColor = vec4(vCol.rgb, vCol.a * (1.0 - smoothstep(0.25, 0.5, d)));
        }`,
    });
    this.points = new THREE.Points(geo, mat);
    this.points.frustumCulled = false;
    this.points.renderOrder = 5;
    scene.add(this.points);

    // 링 풀
    this.rings = [];
    const rg = new THREE.RingGeometry(0.85, 1, 48);
    rg.rotateX(-Math.PI / 2);
    for (let i = 0; i < 12; i++) {
      const m = new THREE.Mesh(rg, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
      m.visible = false;
      m.renderOrder = 4;
      scene.add(m);
      this.rings.push({ mesh: m, t: 0, T: 1, r: 1 });
    }

    // 번개
    this.boltMax = 400;
    const bg = new THREE.BufferGeometry();
    this.boltPos = new Float32Array(this.boltMax * 3);
    this.boltAttr = new THREE.BufferAttribute(this.boltPos, 3).setUsage(THREE.DynamicDrawUsage);
    bg.setAttribute('position', this.boltAttr);
    this.bolt = new THREE.LineSegments(bg, new THREE.LineBasicMaterial({ color: 0xc8f4ff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    this.bolt.frustumCulled = false;
    this.bolt.renderOrder = 6;
    scene.add(this.bolt);
    this.bolts = [];

    // 데미지 숫자 DOM 풀
    this.nums = [];
    for (let i = 0; i < 36; i++) {
      const el = document.createElement('div');
      el.className = 'dmgnum';
      layer.appendChild(el);
      this.nums.push({ el, t: 1, T: 0.7, x: 0, y: 0, z: 0, on: false });
    }
    this.numCursor = 0;
  }

  resize(heightPx, fov) {
    this.uScale.value = heightPx / (2 * Math.tan((fov * Math.PI) / 360));
  }

  emit(x, y, z, vx, vy, vz, color, size, life, grav = 18) {
    const i = this.cursor;
    this.cursor = (this.cursor + 1) % this.N;
    this.pos[i * 3] = x;
    this.pos[i * 3 + 1] = y;
    this.pos[i * 3 + 2] = z;
    this.vel[i * 3] = vx;
    this.vel[i * 3 + 1] = vy;
    this.vel[i * 3 + 2] = vz;
    _c.set(color);
    this.col[i * 4] = _c.r;
    this.col[i * 4 + 1] = _c.g;
    this.col[i * 4 + 2] = _c.b;
    this.col[i * 4 + 3] = 1;
    this.baseSize[i] = size;
    this.life[i] = life;
    this.maxLife[i] = life;
    this.grav[i] = grav;
  }

  burst(x, y, z, n, scale = 1, colors = ['#ffffff']) {
    n = Math.min(60, Math.round(n));
    for (let k = 0; k < n; k++) {
      const a = Math.random() * Math.PI * 2;
      const sp = (3 + Math.random() * 6) * (0.6 + scale * 0.4);
      this.emit(x, y, z, Math.cos(a) * sp, 3 + Math.random() * 7 * (0.6 + scale * 0.3), Math.sin(a) * sp, colors[k % colors.length], (0.25 + Math.random() * 0.35) * (0.7 + scale * 0.3), 0.5 + Math.random() * 0.4);
    }
  }

  // 홀로 빨려드는 보라 입자
  suck(hx, hz, r, n = 2) {
    for (let k = 0; k < n; k++) {
      const a = Math.random() * Math.PI * 2;
      const d = r * (1.2 + Math.random() * 0.8);
      const x = hx + Math.cos(a) * d;
      const z = hz + Math.sin(a) * d;
      const sp = d * 2.2;
      this.emit(x, 0.15, z, -Math.cos(a) * sp + Math.sin(a) * sp * 0.6, -0.5, -Math.sin(a) * sp - Math.cos(a) * sp * 0.6, Math.random() < 0.5 ? '#b894ff' : '#7a5cff', 0.12 + r * 0.05, 0.4, 0);
    }
  }

  puff(x, z, s) {
    this.emit(x + (Math.random() - 0.5) * s, 0.3, z + (Math.random() - 0.5) * s, 0, 1.5, 0, '#f4f0ff', 0.4 * s, 0.4, 0);
  }

  ring(x, z, r, color = '#ffffff', T = 0.45, y = 0.08) {
    let best = this.rings[0];
    for (const rr of this.rings) if (!rr.mesh.visible) { best = rr; break; }
    best.mesh.visible = true;
    best.mesh.material.color.set(color);
    best.mesh.position.set(x, y, z);
    best.t = 0;
    best.T = T;
    best.r = r;
  }

  lightning(pts) {
    // pts: [[x,y,z], ...] 연결된 번개 경로
    this.bolts.push({ pts, t: 0, T: 0.22 });
  }

  dmgNumber(x, y, z, amount, big = false) {
    const n = this.nums[this.numCursor];
    this.numCursor = (this.numCursor + 1) % this.nums.length;
    n.on = true;
    n.t = 0;
    n.T = 0.75;
    n.x = x + (Math.random() - 0.5) * 0.6;
    n.y = y;
    n.z = z;
    n.el.textContent = Math.round(amount);
    n.el.className = 'dmgnum' + (big ? ' big' : '');
    n.el.style.display = 'block';
  }

  clear() {
    this.life.fill(0);
    for (const r of this.rings) r.mesh.visible = false;
    this.bolts.length = 0;
    for (const n of this.nums) {
      n.on = false;
      n.el.style.display = 'none';
    }
  }

  update(dt, w, h) {
    const N = this.N;
    for (let i = 0; i < N; i++) {
      if (this.life[i] <= 0) {
        this.size[i] = 0;
        continue;
      }
      this.life[i] -= dt;
      const k = Math.max(0, this.life[i] / this.maxLife[i]);
      this.vel[i * 3 + 1] -= this.grav[i] * dt;
      this.pos[i * 3] += this.vel[i * 3] * dt;
      this.pos[i * 3 + 1] += this.vel[i * 3 + 1] * dt;
      this.pos[i * 3 + 2] += this.vel[i * 3 + 2] * dt;
      if (this.pos[i * 3 + 1] < 0.05 && this.grav[i] > 0) {
        this.pos[i * 3 + 1] = 0.05;
        this.vel[i * 3 + 1] *= -0.4;
        this.vel[i * 3] *= 0.7;
        this.vel[i * 3 + 2] *= 0.7;
      }
      this.col[i * 4 + 3] = Math.min(1, k * 2);
      this.size[i] = this.baseSize[i] * (0.4 + 0.6 * k);
    }
    this.posAttr.needsUpdate = true;
    this.colAttr.needsUpdate = true;
    this.sizeAttr.needsUpdate = true;

    for (const r of this.rings) {
      if (!r.mesh.visible) continue;
      r.t += dt;
      const k = r.t / r.T;
      if (k >= 1) {
        r.mesh.visible = false;
        continue;
      }
      const s = r.r * (0.2 + 0.8 * (1 - (1 - k) * (1 - k)));
      r.mesh.scale.set(s, 1, s);
      r.mesh.material.opacity = 1 - k;
    }

    // 번개 재구성
    let v = 0;
    const P = this.boltPos;
    for (let b = this.bolts.length - 1; b >= 0; b--) {
      const bo = this.bolts[b];
      bo.t += dt;
      if (bo.t > bo.T) this.bolts.splice(b, 1);
    }
    for (const bo of this.bolts) {
      for (let s = 0; s < bo.pts.length - 1; s++) {
        const a = bo.pts[s];
        const c = bo.pts[s + 1];
        const segs = 5;
        let px = a[0], py = a[1], pz = a[2];
        for (let j = 1; j <= segs; j++) {
          const t = j / segs;
          const jit = j === segs ? 0 : 0.7;
          const nx = a[0] + (c[0] - a[0]) * t + (Math.random() - 0.5) * jit;
          const ny = a[1] + (c[1] - a[1]) * t + (Math.random() - 0.5) * jit;
          const nz = a[2] + (c[2] - a[2]) * t + (Math.random() - 0.5) * jit;
          if (v + 2 > this.boltMax) break;
          P[v * 3] = px; P[v * 3 + 1] = py; P[v * 3 + 2] = pz; v++;
          P[v * 3] = nx; P[v * 3 + 1] = ny; P[v * 3 + 2] = nz; v++;
          px = nx; py = ny; pz = nz;
        }
      }
    }
    this.bolt.geometry.setDrawRange(0, v);
    this.boltAttr.needsUpdate = true;

    // 데미지 숫자
    for (const n of this.nums) {
      if (!n.on) continue;
      n.t += dt;
      if (n.t >= n.T) {
        n.on = false;
        n.el.style.display = 'none';
        continue;
      }
      _v.set(n.x, n.y + n.t * 2.5, n.z).project(this.camera);
      const sx = (_v.x * 0.5 + 0.5) * w;
      const sy = (-_v.y * 0.5 + 0.5) * h;
      const k = n.t / n.T;
      const sc = k < 0.15 ? 0.6 + k * 4 : 1.2 - k * 0.3;
      n.el.style.transform = `translate(${sx.toFixed(1)}px, ${sy.toFixed(1)}px) translate(-50%, -50%) scale(${sc.toFixed(2)})`;
      n.el.style.opacity = k > 0.6 ? (1 - (k - 0.6) / 0.4).toFixed(2) : '1';
    }
  }
}
