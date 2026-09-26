import * as THREE from 'three';
import { CFG } from './config.js';
import { PROP_TYPES } from './models.js';
import { patchHoleClip, holeU } from './holeclip.js';
import { makeRng } from './rng.js';

const GH = CFG.map.groundHalf;
const CELL = 8;
const GRID_N = Math.ceil((GH * 2) / CELL);

const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _q2 = new THREE.Quaternion();
const _v = new THREE.Vector3();
const _s = new THREE.Vector3();
const _axis = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);
const HIDE = new THREE.Matrix4().makeScale(0, 0, 0);

export function blobTexture() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, 'rgba(40,20,70,0.55)');
  gr.addColorStop(0.55, 'rgba(40,20,70,0.3)');
  gr.addColorStop(1, 'rgba(40,20,70,0)');
  g.fillStyle = gr;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// 블롭 섀도 (인스턴스 평면)
export class BlobShadows {
  constructor(scene, cap, tex) {
    const geo = new THREE.PlaneGeometry(1, 1);
    geo.rotateX(-Math.PI / 2);
    const mat = patchHoleClip(new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
    this.mesh = new THREE.InstancedMesh(geo, mat, cap);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 1;
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    for (let i = 0; i < cap; i++) this.mesh.setMatrixAt(i, HIDE);
    scene.add(this.mesh);
    this.cap = cap;
  }
  set(i, x, z, r, y = 0.03) {
    _m.makeScale(r * 2.4, 1, r * 2.4);
    _m.setPosition(x, y, z);
    this.mesh.setMatrixAt(i, _m);
  }
  hide(i) {
    this.mesh.setMatrixAt(i, HIDE);
  }
  flush() {
    this.mesh.instanceMatrix.needsUpdate = true;
  }
}

export class World {
  constructor(scene, seed) {
    this.scene = scene;
    this.rng = makeRng(seed);
    this.shadowTex = blobTexture();
    this.fallers = [];
    this.wobbling = new Set();
    this.sliding = [];
    this.respawnTimer = 0;
    this.buildGround();
    this.buildWell();
    this.layoutProps();
    this.buildProps();
  }

  // ---------- 바닥 ----------
  buildGround() {
    const S = 2048;
    const c = document.createElement('canvas');
    c.width = c.height = S;
    const g = c.getContext('2d');
    const k = S / (GH * 2);
    const X = (x) => (x + GH) * k;
    const { half, pitch, roadW, blockHalf } = CFG.map;
    this.blockKinds = [];
    // 도로 전체
    g.fillStyle = '#c3e8b0';
    g.fillRect(0, 0, S, S);
    g.fillStyle = '#9d98b8';
    g.fillRect(X(-half - roadW / 2), X(-half - roadW / 2), (half * 2 + roadW) * k, (half * 2 + roadW) * k);
    // 차선
    g.strokeStyle = '#f6f2ff';
    g.lineWidth = 0.25 * k;
    g.setLineDash([2 * k, 2 * k]);
    for (let i = 0; i <= 6; i++) {
      const p = -half + i * pitch;
      g.beginPath();
      g.moveTo(X(p), X(-half - 4));
      g.lineTo(X(p), X(half + 4));
      g.stroke();
      g.beginPath();
      g.moveTo(X(-half - 4), X(p));
      g.lineTo(X(half + 4), X(p));
      g.stroke();
    }
    g.setLineDash([]);
    // 블록
    const rng = this.rng;
    for (let bx = 0; bx < 6; bx++) {
      for (let bz = 0; bz < 6; bz++) {
        const cx = -half + pitch / 2 + bx * pitch;
        const cz = -half + pitch / 2 + bz * pitch;
        const ring = Math.max(Math.abs(cx), Math.abs(cz));
        let kind;
        const r = rng();
        if (ring < 20) kind = r < 0.5 ? 'park' : 'residential';
        else if (ring < 60) kind = r < 0.35 ? 'residential' : r < 0.65 ? 'commercial' : r < 0.82 ? 'parking' : 'park';
        else kind = r < 0.45 ? 'downtown' : r < 0.7 ? 'commercial' : r < 0.85 ? 'parking' : 'residential';
        this.blockKinds.push({ cx, cz, kind });
        // 인도
        g.fillStyle = '#f1e8da';
        g.fillRect(X(cx - blockHalf), X(cz - blockHalf), blockHalf * 2 * k, blockHalf * 2 * k);
        g.strokeStyle = '#ddd1c0';
        g.lineWidth = 0.15 * k;
        g.strokeRect(X(cx - blockHalf + 0.1), X(cz - blockHalf + 0.1), (blockHalf * 2 - 0.2) * k, (blockHalf * 2 - 0.2) * k);
        const ih = blockHalf - 2.6;
        const inner = { park: '#b3e3a0', residential: '#cbeeb4', commercial: '#ece0f2', downtown: '#e3def0', parking: '#c9c6da' }[kind];
        g.fillStyle = inner;
        g.fillRect(X(cx - ih), X(cz - ih), ih * 2 * k, ih * 2 * k);
        if (kind === 'park') {
          g.fillStyle = '#efe4cf';
          g.fillRect(X(cx - 0.9), X(cz - ih), 1.8 * k, ih * 2 * k);
          g.fillRect(X(cx - ih), X(cz - 0.9), ih * 2 * k, 1.8 * k);
          g.beginPath();
          g.arc(X(cx), X(cz), 3.4 * k, 0, Math.PI * 2);
          g.fill();
        } else if (kind === 'parking') {
          g.strokeStyle = '#f7f5ff';
          g.lineWidth = 0.15 * k;
          for (let i = -3; i <= 3; i++) {
            for (const row of [-5.2, 0, 5.2]) {
              g.beginPath();
              g.moveTo(X(cx + i * 2.8 - 1.4), X(cz + row - 1.5));
              g.lineTo(X(cx + i * 2.8 - 1.4), X(cz + row + 1.5));
              g.stroke();
            }
          }
        } else if (kind === 'commercial' || kind === 'downtown') {
          g.strokeStyle = 'rgba(255,255,255,0.5)';
          g.lineWidth = 0.08 * k;
          for (let i = -ih; i <= ih; i += 2) {
            g.beginPath();
            g.moveTo(X(cx + i), X(cz - ih));
            g.lineTo(X(cx + i), X(cz + ih));
            g.stroke();
            g.beginPath();
            g.moveTo(X(cx - ih), X(cz + i));
            g.lineTo(X(cx + ih), X(cz + i));
            g.stroke();
          }
        }
      }
    }
    // 횡단보도
    g.fillStyle = '#fbf9ff';
    for (let i = 0; i <= 6; i++) {
      for (let j = 0; j <= 6; j++) {
        const px = -half + i * pitch;
        const pz = -half + j * pitch;
        for (let s = -3; s <= 3; s++) {
          const o = s * 1.0;
          if (j < 6) g.fillRect(X(px + o - 0.3), X(pz + 4.4), 0.6 * k, 2 * k);
          if (j > 0) g.fillRect(X(px + o - 0.3), X(pz - 6.4), 0.6 * k, 2 * k);
          if (i < 6) g.fillRect(X(px + 4.4), X(pz + o - 0.3), 2 * k, 0.6 * k);
          if (i > 0) g.fillRect(X(px - 6.4), X(pz + o - 0.3), 2 * k, 0.6 * k);
        }
      }
    }
    // 맵 경계: 부드러운 울타리 느낌 띠
    g.strokeStyle = '#ffd6e8';
    g.lineWidth = 1.2 * k;
    g.strokeRect(X(-half - 6), X(-half - 6), (half * 2 + 12) * k, (half * 2 + 12) * k);

    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    const geo = new THREE.PlaneGeometry(GH * 2, GH * 2, 1, 1);
    geo.rotateX(-Math.PI / 2);
    const mat = patchHoleClip(new THREE.MeshLambertMaterial({ map: tex }), true);
    this.ground = new THREE.Mesh(geo, mat);
    this.scene.add(this.ground);

    // 바깥 잔디
    const og = new THREE.RingGeometry(GH * 1.414, 700, 24, 1);
    og.rotateX(-Math.PI / 2);
    const outer = new THREE.Mesh(og, patchHoleClip(new THREE.MeshLambertMaterial({ color: '#c3e8b0' })));
    const og2 = new THREE.PlaneGeometry(GH * 2.83, GH * 2.83);
    og2.rotateX(-Math.PI / 2);
    const outer2 = new THREE.Mesh(og2, patchHoleClip(new THREE.MeshLambertMaterial({ color: '#c3e8b0' })));
    outer2.position.y = -0.05;
    this.scene.add(outer, outer2);

    // 맵 가장자리 울타리 기둥 (시각적 경계)
    const posts = [];
    for (let t = -half - 6; t <= half + 6; t += 4) {
      posts.push([t, -half - 6], [t, half + 6], [-half - 6, t], [half + 6, t]);
    }
    const pg = new THREE.CylinderGeometry(0.35, 0.4, 1.4, 6);
    pg.translate(0, 0.7, 0);
    const pm = new THREE.InstancedMesh(pg, new THREE.MeshLambertMaterial({ color: '#ffc2dc', flatShading: true }), posts.length);
    posts.forEach(([x, z], i) => {
      _m.makeTranslation(x, 0, z);
      pm.setMatrixAt(i, _m);
    });
    this.scene.add(pm);
  }

  // ---------- 우물 ----------
  buildWell() {
    const SEG = 48;
    this.wellPad = 1 / Math.cos(Math.PI / SEG) + 0.01;
    const geo = new THREE.CylinderGeometry(1, 1, 1, SEG, 8, true);
    geo.translate(0, -0.5, 0);
    const mat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      uniforms: { uTime: holeU.uTime, uHurt: holeU.uHoleHurt },
      vertexShader: `
        varying float vY; varying float vAng;
        void main(){
          vY = -position.y;
          vAng = atan(position.z, position.x);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: `
        uniform float uTime; uniform float uHurt;
        varying float vY; varying float vAng;
        void main(){
          float d = vY;
          vec3 top = mix(vec3(0.36, 0.16, 0.58), vec3(0.55, 0.12, 0.2), uHurt);
          vec3 c = mix(top, vec3(0.0), smoothstep(0.0, 0.5, d));
          float sw = sin(vAng * 5.0 + d * 18.0 - uTime * 3.0) * 0.5 + 0.5;
          c += vec3(0.35, 0.15, 0.6) * sw * (1.0 - smoothstep(0.0, 0.35, d)) * 0.45;
          c += vec3(0.75, 0.5, 1.0) * exp(-d * 40.0) * 0.7;
          gl_FragColor = vec4(c, 1.0);
        }`,
    });
    this.well = new THREE.Mesh(geo, mat);
    this.well.frustumCulled = false;
    const bottom = new THREE.Mesh(new THREE.CircleGeometry(1.05, 24).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x000000 }));
    bottom.position.y = -1;
    this.well.add(bottom);
    this.scene.add(this.well);
  }

  setHole(x, z, r) {
    const depth = 3 + r * 2.4;
    this.wellDepth = depth;
    this.well.position.set(x, 0, z);
    this.well.scale.set(r * this.wellPad, depth, r * this.wellPad);
    holeU.uHolePos.value.set(x, z);
    holeU.uHoleR.value = r;
  }

  // ---------- 소품 배치 ----------
  layoutProps() {
    const rng = this.rng;
    const L = [];
    const add = (t, x, z, rot = rng() * Math.PI * 2, s = 1) => L.push({ t, x, z, rot, s });
    const { half, pitch, blockHalf } = CFG.map;
    const side = ['tree', 'tree', 'sakura', 'hydrant', 'trash', 'bench', 'cone', 'bush', 'trash'];
    for (const b of this.blockKinds) {
      const { cx, cz, kind } = b;
      // 인도 소품
      const e = blockHalf - 1.2;
      for (let edge = 0; edge < 4; edge++) {
        for (let u = -e + 1; u <= e - 1; u += 3.4) {
          const jitter = rng.range(-0.4, 0.4);
          let x, z, rot;
          if (edge === 0) (x = cx + u + jitter), (z = cz - e), (rot = 0);
          else if (edge === 1) (x = cx + u + jitter), (z = cz + e), (rot = Math.PI);
          else if (edge === 2) (x = cx - e), (z = cz + u + jitter), (rot = Math.PI / 2);
          else (x = cx + e), (z = cz + u + jitter), (rot = -Math.PI / 2);
          const idx = Math.round((u + e) / 3.4);
          if (idx % 3 === 0) add('lamp', x, z, rot + Math.PI / 2);
          else {
            const t = rng.pick(side);
            if (t === 'bench') add('bench', x, z, rot);
            else add(t, x, z, undefined, rng.range(0.9, 1.1));
          }
        }
      }
      const ih = blockHalf - 3.2;
      if (kind === 'park') {
        if (rng() < 0.7) add('fountain', cx, cz, 0);
        for (let i = 0; i < 10; i++) {
          const x = cx + rng.range(-ih, ih);
          const z = cz + rng.range(-ih, ih);
          if (Math.abs(x - cx) < 3.8 && Math.abs(z - cz) < 3.8) continue;
          if (Math.abs(x - cx) < 1.4 || Math.abs(z - cz) < 1.4) continue;
          add(rng() < 0.6 ? (rng() < 0.5 ? 'tree' : 'sakura') : 'bush', x, z, undefined, rng.range(0.85, 1.2));
        }
        add('bench', cx + 2.2, cz - 5, Math.PI / 2);
        add('bench', cx - 2.2, cz + 5, -Math.PI / 2);
        add('trash', cx + 1.7, cz + 6);
        add('kiosk', cx + 5.5, cz + 5.5, Math.PI);
      } else if (kind === 'residential') {
        for (const [ox, oz] of [
          [-4.5, -4.5],
          [4.5, -4.5],
          [-4.5, 4.5],
          [4.5, 4.5],
        ]) {
          if (rng() < 0.85) add('house', cx + ox, cz + oz, oz < 0 ? Math.PI : 0, rng.range(0.9, 1.05));
          else add('tree', cx + ox, cz + oz, undefined, 1.3);
        }
        for (let i = 0; i < 5; i++) add('bush', cx + rng.range(-1, 1), cz + rng.range(-ih, ih));
        add('car', cx + rng.range(-1, 1), cz, Math.PI / 2);
      } else if (kind === 'commercial') {
        add('shop', cx - 4.3, cz, Math.PI / 2 + (rng() < 0.5 ? Math.PI : 0), rng.range(0.9, 1));
        if (rng() < 0.6) add('shop', cx + 4.3, cz, -Math.PI / 2);
        else {
          add('kiosk', cx + 4.5, cz - 4, -Math.PI / 2);
          add('kiosk', cx + 4.5, cz + 4, -Math.PI / 2);
          add('bench', cx + 5, cz, -Math.PI / 2);
        }
        for (let i = 0; i < 4; i++) add('cone', cx + rng.range(-1.5, 1.5), cz + rng.range(-ih, ih));
        add('trash', cx, cz + ih);
      } else if (kind === 'downtown') {
        const ring = Math.max(Math.abs(cx), Math.abs(cz));
        add(ring > 70 && rng() < 0.6 ? 'tower' : 'building', cx, cz, rng.int(0, 3) * (Math.PI / 2));
        for (const [ox, oz] of [
          [-7, -7],
          [7, -7],
          [-7, 7],
          [7, 7],
        ])
          add(rng() < 0.5 ? 'kiosk' : 'bush', cx + ox, cz + oz, undefined, 0.9);
      } else if (kind === 'parking') {
        for (let i = -3; i <= 3; i++) {
          for (const row of [-5.2, 0, 5.2]) {
            if (rng() < 0.75) add('car', cx + i * 2.8, cz + row, Math.PI / 2 + (rng() < 0.5 ? Math.PI : 0) + rng.range(-0.05, 0.05));
          }
        }
        if (rng() < 0.6) add('bus', cx, cz - 8.4, 0);
      }
    }
    // 도로 위 차량
    for (let i = 0; i <= 6; i++) {
      const p = -half + i * pitch;
      for (let t = -half; t < half; t += 5) {
        const tt = t + 2.5;
        const near = Math.abs(((tt + half) % pitch) - 0) < 7 || Math.abs(((tt + half) % pitch) - pitch) < 7;
        if (near) continue;
        if (rng() < 0.4) {
          const lane = rng() < 0.5 ? -2 : 2;
          const bus = rng() < 0.12;
          add(bus ? 'bus' : 'car', p + lane, tt, Math.PI / 2 + (lane > 0 ? 0 : Math.PI));
        }
        if (rng() < 0.4) {
          const lane = rng() < 0.5 ? -2 : 2;
          const bus = rng() < 0.12;
          add(bus ? 'bus' : 'car', tt, p + lane, lane > 0 ? Math.PI : 0);
        }
      }
    }
    // 시작 지점 주변: 즉시 삼킬 수 있는 작은 것들
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2;
      const r = 3.2 + (i % 2) * 1.2;
      add('cone', Math.cos(a) * r, Math.sin(a) * r);
    }
    for (let i = 0; i < 8; i++) add(rng() < 0.5 ? 'trash' : 'hydrant', rng.range(-7, 7), rng.range(-7, 7));
    // 시작 지점 반경 2.2 안은 비움
    this.layout = L.filter((p) => Math.hypot(p.x, p.z) > 2.2 || p.t === 'cone');
    this.layout = this.layout.filter((p) => Math.hypot(p.x, p.z) > 2.2);
  }

  buildProps() {
    const types = Object.keys(PROP_TYPES);
    this.typeIndex = {};
    this.meshes = [];
    const counts = {};
    for (const p of this.layout) counts[p.t] = (counts[p.t] || 0) + 1;
    const N = this.layout.length;
    this.N = N;
    this.pType = new Uint8Array(N);
    this.pSlot = new Uint16Array(N);
    this.pX = new Float32Array(N);
    this.pZ = new Float32Array(N);
    this.pRot = new Float32Array(N);
    this.pS = new Float32Array(N);
    this.pSize = new Float32Array(N);
    this.pState = new Uint8Array(N); // 0 정지, 1 끌려옴, 2 추락, 3 사라짐
    this.pGone = new Float32Array(N);
    this.pWob = new Float32Array(N);
    const mat = new THREE.MeshLambertMaterial({ vertexColors: true });
    const rng = this.rng;
    const slotCounter = {};
    types.forEach((t, ti) => {
      this.typeIndex[t] = ti;
      const def = PROP_TYPES[t];
      const cnt = counts[t] || 0;
      const mesh = new THREE.InstancedMesh(def.geo(), mat, Math.max(1, cnt));
      mesh.count = cnt;
      mesh.frustumCulled = false;
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      if (def.tint) {
        for (let i = 0; i < cnt; i++) mesh.setColorAt(i, new THREE.Color(rng.pick(def.tint)));
      }
      this.meshes.push(mesh);
      this.scene.add(mesh);
      slotCounter[t] = 0;
    });
    this.shadows = new BlobShadows(this.scene, N, this.shadowTex);
    this.grid = Array.from({ length: GRID_N * GRID_N }, () => []);
    this.layout.forEach((p, i) => {
      const ti = this.typeIndex[p.t];
      this.pType[i] = ti;
      this.pSlot[i] = slotCounter[p.t]++;
      this.pX[i] = p.x;
      this.pZ[i] = p.z;
      this.pRot[i] = p.rot;
      this.pS[i] = p.s;
      this.pSize[i] = PROP_TYPES[p.t].size * p.s;
      const gx = Math.min(GRID_N - 1, Math.max(0, Math.floor((p.x + GH) / CELL)));
      const gz = Math.min(GRID_N - 1, Math.max(0, Math.floor((p.z + GH) / CELL)));
      this.grid[gz * GRID_N + gx].push(i);
    });
    this.maxPropSize = 6.5;
    this.typeNames = types;
    this.reset();
  }

  reset() {
    for (let i = 0; i < this.N; i++) {
      this.pState[i] = 0;
      this.pWob[i] = 0;
      this.pX[i] = this.layout[i].x;
      this.pZ[i] = this.layout[i].z;
      this.writeStatic(i);
    }
    this.fallers = [];
    this.wobbling.clear();
    this.sliding = [];
    this.flushAll();
  }

  writeStatic(i, tilt = 0, tx = 0, tz = 0) {
    const mesh = this.meshes[this.pType[i]];
    const s = this.pS[i];
    _q.setFromAxisAngle(_up, this.pRot[i]);
    if (tilt) {
      _axis.set(tz, 0, -tx).normalize();
      _q2.setFromAxisAngle(_axis, tilt);
      _q.premultiply(_q2);
    }
    _m.compose(_v.set(this.pX[i], 0, this.pZ[i]), _q, _s.set(s, s, s));
    mesh.setMatrixAt(this.pSlot[i], _m);
    this.shadows.set(i, this.pX[i], this.pZ[i], this.pSize[i]);
  }

  flushAll() {
    for (const m of this.meshes) m.instanceMatrix.needsUpdate = true;
    this.shadows.flush();
  }

  // 그리드 질의
  query(x, z, rad, out) {
    out.length = 0;
    const x0 = Math.max(0, Math.floor((x - rad + GH) / CELL));
    const x1 = Math.min(GRID_N - 1, Math.floor((x + rad + GH) / CELL));
    const z0 = Math.max(0, Math.floor((z - rad + GH) / CELL));
    const z1 = Math.min(GRID_N - 1, Math.floor((z + rad + GH) / CELL));
    for (let gz = z0; gz <= z1; gz++) for (let gx = x0; gx <= x1; gx++) {
      const cell = this.grid[gz * GRID_N + gx];
      for (let k = 0; k < cell.length; k++) out.push(cell[k]);
    }
    return out;
  }

  startFall(i, hole) {
    this.pState[i] = 2;
    this.wobbling.delete(i);
    this.shadows.hide(i);
    const mesh = this.meshes[this.pType[i]];
    this.fallers.push(
      makeFaller(mesh, this.pSlot[i], this.pX[i] - hole.x, this.pZ[i] - hole.z, this.pRot[i], this.pS[i], this.pSize[i], hole.r, () => {
        this.pState[i] = 3;
        this.pGone[i] = 0;
      })
    );
  }

  // 반환: 이번 프레임 삼킨 소품 목록 [{size, x, z, type}]
  update(dt, hole, horizonMul, pullSet) {
    const eaten = [];
    const r = hole.r;
    const fitR = r * CFG.hole.fit;
    const reach = r * horizonMul + 0.4;
    const q = this.query(hole.x, hole.z, Math.max(reach, r) + this.maxPropSize, (this._q ||= []));
    const newWob = (this._nw ||= new Set());
    newWob.clear();
    let dirtyTypes = 0;
    for (let k = 0; k < q.length; k++) {
      const i = q[k];
      if (this.pState[i] !== 0) continue;
      const dx = this.pX[i] - hole.x;
      const dz = this.pZ[i] - hole.z;
      const d = Math.hypot(dx, dz);
      const sz = this.pSize[i];
      if (sz < fitR) {
        if (d < r * 0.98 - sz * 0.25) {
          this.startFall(i, hole);
          eaten.push({ size: sz, x: this.pX[i], z: this.pZ[i], type: this.typeNames[this.pType[i]] });
        } else if (d < reach && horizonMul > 1) {
          this.pState[i] = 1;
          this.sliding.push(i);
        } else if (d < r + sz * 0.8) {
          newWob.add(i);
          const tilt = 0.25 * (1 - (d - r) / (sz * 0.8 + 0.01));
          this.writeStatic(i, Math.max(0, tilt), -dx, -dz);
          dirtyTypes |= 1 << this.pType[i];
        }
      } else if (d < r + sz * 0.7) {
        // 너무 큰 물체: 가장자리에서 흔들림
        newWob.add(i);
        const over = 1 - Math.max(0, d - r) / (sz * 0.7);
        const tilt = Math.min(0.22, 0.12 * over * (r / sz) * 2) * (0.8 + 0.2 * Math.sin(performance.now() * 0.02 + i));
        this.writeStatic(i, tilt, -dx, -dz);
        dirtyTypes |= 1 << this.pType[i];
      }
    }
    // 흔들림 복귀
    for (const i of this.wobbling) {
      if (!newWob.has(i) && this.pState[i] === 0) {
        this.writeStatic(i);
        dirtyTypes |= 1 << this.pType[i];
      }
    }
    const tmp = this.wobbling;
    this.wobbling = newWob;
    this._nw = tmp;

    // 펄스 등으로 끌려오는 물체 추가
    if (pullSet) {
      for (const i of pullSet) {
        if (this.pState[i] === 0 && this.pSize[i] < fitR) {
          this.pState[i] = 1;
          this.sliding.push(i);
        }
      }
    }
    // 끌려오는 물체
    for (let n = this.sliding.length - 1; n >= 0; n--) {
      const i = this.sliding[n];
      if (this.pState[i] !== 1) {
        this.sliding.splice(n, 1);
        continue;
      }
      const dx = hole.x - this.pX[i];
      const dz = hole.z - this.pZ[i];
      const d = Math.hypot(dx, dz) || 1;
      const sp = (6 + r * 3) * dt;
      this.pX[i] += (dx / d) * Math.min(sp, d);
      this.pZ[i] += (dz / d) * Math.min(sp, d);
      const sz = this.pSize[i];
      if (d < r * 0.98 - sz * 0.25 || d < 0.3) {
        this.sliding.splice(n, 1);
        this.startFall(i, hole);
        eaten.push({ size: sz, x: this.pX[i], z: this.pZ[i], type: this.typeNames[this.pType[i]] });
      } else if (d > r * horizonMul * 2.5 + 8) {
        this.pState[i] = 0;
        this.sliding.splice(n, 1);
        this.writeStatic(i);
      } else {
        this.writeStatic(i, 0.25, dx, dz);
      }
      dirtyTypes |= 1 << this.pType[i];
    }

    // 추락 애니메이션
    for (let n = this.fallers.length - 1; n >= 0; n--) {
      const f = this.fallers[n];
      if (stepFaller(f, dt, hole, this.wellDepth)) {
        this.fallers.splice(n, 1);
      }
      f.mesh.instanceMatrix.needsUpdate = true;
    }

    // 리스폰: 화면 밖의 사라진 물체 복구
    this.respawnTimer += dt;
    if (this.respawnTimer > 0.5) {
      const dtR = this.respawnTimer;
      this.respawnTimer = 0;
      const far = 30 + r * 6;
      let budget = 12;
      for (let i = 0; i < this.N && budget > 0; i++) {
        if (this.pState[i] !== 3) continue;
        this.pGone[i] += dtR;
        if (this.pGone[i] < 22) continue;
        const L = this.layout[i];
        if (Math.hypot(L.x - hole.x, L.z - hole.z) < far) continue;
        // 홀보다 훨씬 작은 물체는 가끔만 복구 (도시가 점점 비어 보이도록)
        this.pX[i] = L.x;
        this.pZ[i] = L.z;
        this.pState[i] = 0;
        this.writeStatic(i);
        dirtyTypes |= 1 << this.pType[i];
        budget--;
      }
    }

    for (let t = 0; t < this.meshes.length; t++) if (dirtyTypes & (1 << t)) this.meshes[t].instanceMatrix.needsUpdate = true;
    this.shadows.flush();
    return eaten;
  }
}

// ---------- 추락 (소품/적 공용) ----------
export function makeFaller(mesh, slot, ox, oz, rot, scale, size, holeR, onDone, flashAttr) {
  const d = Math.hypot(ox, oz) || 0.001;
  return {
    mesh,
    slot,
    ox,
    oz,
    dx: -ox / d,
    dz: -oz / d,
    rot,
    scale,
    size,
    y: 0,
    vy: 0,
    tilt: 0,
    t: 0,
    onDone,
    flashAttr,
    spin: (Math.random() - 0.5) * 3,
  };
}

// true 를 반환하면 종료
export function stepFaller(f, dt, hole, depth) {
  f.t += dt;
  const pull = Math.exp(-3.2 * dt);
  // 물체 가장자리가 우물 벽을 넘지 않도록 중심으로 당김
  const maxOff = Math.max(0, hole.r - f.size * 0.9);
  f.ox *= pull;
  f.oz *= pull;
  const od = Math.hypot(f.ox, f.oz);
  if (od > maxOff && f.y < -0.3) {
    const k = maxOff / od;
    f.ox *= k;
    f.oz *= k;
  }
  const g = 16 + hole.r * 5;
  f.vy -= g * dt;
  f.y += f.vy * dt * (f.t < 0.12 ? 0.25 : 1);
  f.tilt = Math.min(1.35, f.tilt + dt * (3 + 2 / (f.size + 0.5)));
  f.rot += f.spin * dt;
  _q.setFromAxisAngle(_up, f.rot);
  _axis.set(f.dz, 0, -f.dx);
  if (_axis.lengthSq() < 1e-6) _axis.set(1, 0, 0);
  _axis.normalize();
  _q2.setFromAxisAngle(_axis, f.tilt);
  _q.premultiply(_q2);
  const sc = f.scale * (f.y < -depth * 0.6 ? Math.max(0.01, 1 + (f.y + depth * 0.6) / (depth * 0.4)) : 1);
  _m.compose(_v.set(hole.x + f.ox, f.y, hole.z + f.oz), _q, _s.set(sc, sc, sc));
  f.mesh.setMatrixAt(f.slot, _m);
  if (f.y < -depth || f.t > 3) {
    f.mesh.setMatrixAt(f.slot, HIDE);
    f.onDone && f.onDone();
    return true;
  }
  return false;
}
