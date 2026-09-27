// 장애물, 게이트, 코인, 파워업, 적 무리, 요새 (풀링/인스턴싱)
import * as THREE from 'three';
import { CFG, COLORS } from './config.js';
import { gateLabel } from './chunks.js';
import { mergeSimple } from './world.js';

function stripeTex(c1, c2, n = 6) {
  const c = document.createElement('canvas');
  c.width = 128; c.height = 32;
  const g = c.getContext('2d');
  g.fillStyle = c1; g.fillRect(0, 0, 128, 32);
  g.fillStyle = c2;
  for (let i = -2; i < n + 2; i++) {
    const x = i * (128 / n);
    g.beginPath(); g.moveTo(x, 32); g.lineTo(x + 10, 32); g.lineTo(x + 10 + 16, 0); g.lineTo(x + 16, 0); g.closePath(); g.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

const OBS_DIM = {
  barrier: { halfW: 1.0, halfL: 0.22, y0: 0, y1: 0.72 },
  bar: { halfW: 1.0, halfL: 0.22, y0: 0.52, y1: 2.4 },
  train: { halfW: 1.0, halfL: 5, y0: 0, y1: 2.45 },
  cone: { halfW: 0.26, halfL: 0.26, y0: 0, y1: 0.62 },
};

const PU_COLORS = { magnet: 0xff4a6a, shield: 0x3ae0ff, boots: 0x5aff6a, recruit: 0xffc83a };
export const PU_NAMES = { magnet: '자석', shield: '방패', boots: '슈퍼점프', recruit: '확성기' };

function trainTex(color) {
  const c = document.createElement('canvas');
  c.width = 256; c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = color; g.fillRect(0, 0, 256, 128);
  // 하단 띠와 상단 광택
  g.fillStyle = 'rgba(255,255,255,0.22)'; g.fillRect(0, 8, 256, 6);
  g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(0, 96, 256, 32);
  g.fillStyle = '#ffffff'; g.fillRect(0, 88, 256, 6);
  // 창문
  for (let i = 0; i < 4; i++) {
    const x = 12 + i * 62;
    g.fillStyle = '#1d2a44'; g.fillRect(x, 26, 44, 40);
    g.fillStyle = '#9fe0ff'; g.fillRect(x + 3, 29, 38, 34);
    g.fillStyle = 'rgba(255,255,255,0.55)'; g.beginPath(); g.moveTo(x + 6, 60); g.lineTo(x + 20, 32); g.lineTo(x + 28, 32); g.lineTo(x + 14, 60); g.fill();
  }
  // 문 테두리
  g.strokeStyle = 'rgba(0,0,0,0.35)'; g.lineWidth = 3; g.strokeRect(118, 22, 20, 70);
  // 낙서 느낌 포인트
  g.fillStyle = 'rgba(255,230,80,0.85)'; g.beginPath(); g.arc(200, 108, 8, 0, Math.PI * 2); g.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.RepeatWrapping;
  t.repeat.set(3, 1);
  return t;
}

export class Entities {
  constructor(scene) {
    this.scene = scene;
    this.obstacles = [];
    this.gateRows = [];
    this.coins = [];
    this.powerups = [];
    this.enemies = [];
    this.fortress = null;
    this.pools = { barrier: [], bar: [], train: [], gate: [], power: [] };

    this.barrierTex = stripeTex('#ff3b4f', '#ffffff');
    this.barTex = stripeTex('#ffcc2a', '#222233', 5);
    this.mats = {
      barrier: new THREE.MeshLambertMaterial({ map: this.barrierTex }),
      bar: new THREE.MeshLambertMaterial({ map: this.barTex }),
      pole: new THREE.MeshLambertMaterial({ color: 0xdfe6ef }),
      trainBody: ['#2f7df0', '#f05a3a', '#2fbf8a', '#f0b52f', '#8a5af0'].map((c) => new THREE.MeshLambertMaterial({ map: trainTex(c) })),
      trainDark: new THREE.MeshLambertMaterial({ color: 0x1d2433 }),
      trainRoof: new THREE.MeshLambertMaterial({ color: 0xd8dee8 }),
      window: new THREE.MeshBasicMaterial({ color: 0xbfeaff }),
      light: new THREE.MeshBasicMaterial({ color: 0xfff6a0 }),
    };
    this.geo = {
      box: new THREE.BoxGeometry(1, 1, 1),
      post: new THREE.CylinderGeometry(0.08, 0.08, 1, 6),
    };

    // 콘 (인스턴싱)
    const cone = new THREE.ConeGeometry(0.26, 0.62, 8); cone.translate(0, 0.31, 0);
    const band = new THREE.CylinderGeometry(0.15, 0.19, 0.12, 8); band.translate(0, 0.32, 0);
    const base = new THREE.BoxGeometry(0.5, 0.06, 0.5); base.translate(0, 0.03, 0);
    const cg = mergeSimple([cone, band, base], [new THREE.Color(1, 0.45, 0.1), new THREE.Color(1, 1, 1), new THREE.Color(1, 0.4, 0.08)]);
    this.coneMesh = new THREE.InstancedMesh(cg, new THREE.MeshLambertMaterial({ vertexColors: true }), 160);
    this.coneMesh.count = 0;
    this.coneMesh.frustumCulled = false;
    scene.add(this.coneMesh);

    // 코인 (인스턴싱)
    const coinG = new THREE.CylinderGeometry(0.3, 0.3, 0.08, 14);
    coinG.rotateX(Math.PI / 2);
    this.coinMesh = new THREE.InstancedMesh(coinG, new THREE.MeshLambertMaterial({ color: COLORS.coin, emissive: 0x6a4a00 }), 260);
    this.coinMesh.count = 0;
    this.coinMesh.frustumCulled = false;
    scene.add(this.coinMesh);

    // 방패 돔
    this.shieldDome = new THREE.Mesh(new THREE.SphereGeometry(1, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: 0x5ae8ff, transparent: true, opacity: 0.22, depthWrite: false }));
    this.shieldDome.visible = false;
    scene.add(this.shieldDome);

    this.m = new THREE.Matrix4();
    this.q = new THREE.Quaternion();
    this.v = new THREE.Vector3();
    this.s = new THREE.Vector3();
    this.e = new THREE.Euler();
  }

  // ---------- 장애물 ----------
  makeObstacleMesh(kind) {
    const g = new THREE.Group();
    const M = this.mats, G = this.geo;
    if (kind === 'barrier') {
      const board = new THREE.Mesh(G.box, M.barrier); board.scale.set(2.0, 0.42, 0.14); board.position.y = 0.5; g.add(board);
      for (const s of [-0.8, 0.8]) { const l = new THREE.Mesh(G.post, M.pole); l.scale.set(1, 0.5, 1); l.position.set(s, 0.25, 0); g.add(l); }
    } else if (kind === 'bar') {
      const board = new THREE.Mesh(G.box, M.bar); board.scale.set(2.1, 0.62, 0.14); board.position.y = 0.95; g.add(board);
      const top = new THREE.Mesh(G.box, M.bar); top.scale.set(2.1, 0.16, 0.14); top.position.y = 2.3; g.add(top);
      for (const s of [-1.02, 1.02]) { const l = new THREE.Mesh(G.post, M.pole); l.scale.set(1.3, 2.4, 1.3); l.position.set(s, 1.2, 0); g.add(l); }
    } else if (kind === 'train') {
      const body = new THREE.Mesh(G.box, M.trainBody[0]); body.position.y = 1.3; g.add(body); g.userData.body = body;
      const roof = new THREE.Mesh(G.box, M.trainRoof); roof.position.y = 2.5; g.add(roof); g.userData.roof = roof;
      const win = new THREE.Mesh(G.box, M.trainRoof); win.position.y = 2.36; g.add(win); g.userData.win = win;
      const skirt = new THREE.Mesh(G.box, M.trainDark); skirt.position.y = 0.2; g.add(skirt); g.userData.skirt = skirt;
      const face = new THREE.Mesh(G.box, M.trainDark); face.scale.set(1.5, 0.8, 0.05); face.position.y = 1.7; g.add(face); g.userData.face = face;
      for (const s of [-0.6, 0.6]) { const l = new THREE.Mesh(G.box, M.light); l.scale.set(0.3, 0.2, 0.05); l.position.set(s, 0.75, 0); g.add(l); (g.userData.lights ||= []).push(l); }
    }
    this.scene.add(g);
    return g;
  }

  addObstacle(it, baseD) {
    const dim = OBS_DIM[it.kind];
    const o = { kind: it.kind, x: it.x, d: baseD + it.d, halfW: dim.halfW, halfL: it.len ? it.len / 2 : dim.halfL, y0: dim.y0, y1: dim.y1, dead: false, mesh: null, t: 0, vd: it.vd || 0, tut: it.tut || null, kills: 0, cap: 0, spent: false };
    if (it.kind !== 'cone') {
      const pool = this.pools[it.kind];
      o.mesh = pool.pop() || this.makeObstacleMesh(it.kind);
      o.mesh.visible = true;
      o.mesh.position.set(o.x, 0, -o.d);
      o.mesh.rotation.set(0, 0, 0);
      o.mesh.scale.set(1, 1, 1);
      if (it.kind === 'train') {
        const L = o.halfL * 2, u = o.mesh.userData;
        u.body.scale.set(2.0, 2.2, L); u.body.material = this.mats.trainBody[Math.floor(Math.random() * 5)];
        u.roof.scale.set(1.7, 0.2, L - 0.4);
        u.win.scale.set(0.5, 0.14, L * 0.6);
        u.skirt.scale.set(1.8, 0.4, L - 0.2);
        u.face.position.z = L / 2 + 0.01;
        u.lights.forEach((l) => { l.position.z = L / 2 + 0.01; });
      }
    }
    this.obstacles.push(o);
  }

  releaseObstacle(o) {
    if (o.mesh) { o.mesh.visible = false; this.pools[o.kind].push(o.mesh); o.mesh = null; }
  }

  // ---------- 게이트 ----------
  makeGateMesh() {
    const g = new THREE.Group();
    const panelMat = new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false, side: THREE.DoubleSide });
    const panel = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), panelMat);
    panel.position.y = 1.25;
    g.add(panel);
    const postMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const posts = [];
    for (let i = 0; i < 2; i++) { const p = new THREE.Mesh(this.geo.box, postMat); p.scale.set(0.16, 2.5, 0.16); p.position.y = 1.25; g.add(p); posts.push(p); }
    const top = new THREE.Mesh(this.geo.box, postMat); top.scale.set(1, 0.18, 0.18); top.position.y = 2.5; g.add(top);
    g.userData = { panel, posts, top, postMat, canvas: document.createElement('canvas') };
    this.scene.add(g);
    return g;
  }

  drawGate(mesh, gate) {
    const u = mesh.userData;
    const c = u.canvas;
    if (c.width !== 512) { c.width = 512; c.height = 256; }
    const g = c.getContext('2d');
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, 512, 256);
    g.fillStyle = gate.good ? 'rgba(42,140,255,0.66)' : 'rgba(255,59,79,0.66)';
    g.fillRect(0, 0, 512, 256);
    g.fillStyle = 'rgba(255,255,255,0.2)';
    g.fillRect(0, 0, 512, 34);
    // 패널 가로세로 비율 보정 (텍스트가 늘어나지 않게)
    const kx = (2.1 / 256) / (gate.w / 512);
    const label = gateLabel(gate);
    let fs = 150;
    const font = (f) => `900 ${f}px system-ui, -apple-system, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif`;
    g.font = font(fs);
    const maxW = (512 - 40) / kx;
    while (g.measureText(label).width > maxW && fs > 40) { fs -= 8; g.font = font(fs); }
    g.setTransform(kx, 0, 0, 1, 256, 0);
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.lineWidth = 14; g.strokeStyle = 'rgba(0,0,0,0.35)';
    g.strokeText(label, 0, 140);
    g.fillStyle = '#fff'; g.fillText(label, 0, 140);
    g.setTransform(1, 0, 0, 1, 0, 0);
    if (!u.tex) {
      u.tex = new THREE.CanvasTexture(c);
      u.tex.colorSpace = THREE.SRGBColorSpace;
      u.panel.material.map = u.tex;
      u.panel.material.needsUpdate = true;
    }
    u.tex.needsUpdate = true;
    u.panel.material.opacity = 1;
    u.panel.scale.set(gate.w, 2.1, 1);
    u.posts[0].position.x = -gate.w / 2; u.posts[1].position.x = gate.w / 2;
    u.top.scale.x = gate.w + 0.16;
    u.postMat.color.set(gate.good ? 0x9fd0ff : 0xffb0b8);
  }

  addGateRow(it, baseD) {
    const row = { d: baseD + it.d, gates: [], used: false, t: 0 };
    for (const gt of it.gates) {
      const mesh = this.pools.gate.pop() || this.makeGateMesh();
      mesh.visible = true;
      mesh.position.set(gt.x, 0, -row.d);
      mesh.scale.set(1, 1, 1);
      mesh.rotation.set(0, 0, 0);
      this.drawGate(mesh, gt);
      row.gates.push({ ...gt, mesh, chosen: false });
    }
    row.tut = it.tut || null;
    this.gateRows.push(row);
  }

  releaseGateRow(row) {
    for (const g of row.gates) { g.mesh.visible = false; this.pools.gate.push(g.mesh); }
    row.gates.length = 0;
  }

  // ---------- 코인/파워업 ----------
  addCoin(it, baseD) { if (this.coins.length < 250) this.coins.push({ x: it.x, d: baseD + it.d, y: it.y, pull: 0, alive: true }); }

  makePowerMesh(kind) {
    const g = new THREE.Group();
    const col = PU_COLORS[kind];
    const mat = new THREE.MeshLambertMaterial({ color: col, emissive: col, emissiveIntensity: 0.25 });
    const white = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const icon = new THREE.Group();
    if (kind === 'magnet') {
      const t = new THREE.Mesh(new THREE.TorusGeometry(0.32, 0.12, 6, 12, Math.PI), mat); t.rotation.z = Math.PI; icon.add(t);
      for (const s of [-0.32, 0.32]) { const tip = new THREE.Mesh(this.geo.box, white); tip.scale.set(0.24, 0.22, 0.24); tip.position.set(s, 0.08, 0); icon.add(tip); }
    } else if (kind === 'shield') {
      const s = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.14, 6), mat); s.rotation.x = Math.PI / 2; icon.add(s);
      const s2 = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.18, 6), white); s2.rotation.x = Math.PI / 2; icon.add(s2);
    } else if (kind === 'boots') {
      const a = new THREE.Mesh(this.geo.box, mat); a.scale.set(0.3, 0.5, 0.3); a.position.set(0, 0.1, 0); icon.add(a);
      const b = new THREE.Mesh(this.geo.box, mat); b.scale.set(0.3, 0.2, 0.55); b.position.set(0, -0.2, -0.12); icon.add(b);
      const w = new THREE.Mesh(this.geo.box, white); w.scale.set(0.5, 0.12, 0.12); w.position.set(0, 0.2, 0.18); icon.add(w);
    } else {
      const c = new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.6, 10, 1, true), mat); c.rotation.z = -Math.PI / 2; c.position.x = 0.1; icon.add(c);
      const h = new THREE.Mesh(this.geo.box, white); h.scale.set(0.2, 0.3, 0.14); h.position.set(-0.28, -0.1, 0); icon.add(h);
    }
    g.add(icon);
    const bubble = new THREE.Mesh(new THREE.SphereGeometry(0.62, 14, 10), new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.2, depthWrite: false }));
    g.add(bubble);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.66, 0.04, 4, 20), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    g.add(ring);
    g.userData = { icon, ring, kind };
    this.scene.add(g);
    return g;
  }

  addPower(it, baseD, kind) {
    const pool = this.pools.power;
    let mesh = null;
    const idx = pool.findIndex((m) => m.userData.kind === kind);
    if (idx >= 0) mesh = pool.splice(idx, 1)[0]; else mesh = this.makePowerMesh(kind);
    mesh.visible = true;
    mesh.position.set(it.x, 1.1, -(baseD + it.d));
    this.powerups.push({ kind, x: it.x, d: baseD + it.d, mesh, alive: true, t: Math.random() * 6 });
  }

  releasePower(p) { if (p.mesh) { p.mesh.visible = false; this.pools.power.push(p.mesh); p.mesh = null; } }

  // ---------- 적 무리 ----------
  addEnemy(it, baseD) {
    const e = { tut: it.tut || null, d: baseD + it.d, x: it.x, count: it.count, startCount: it.count, wide: !!it.wide, state: 'idle', members: [], adv: 0, dead: false };
    this.layoutEnemy(e);
    this.enemies.push(e);
  }

  layoutEnemy(e) {
    const n = Math.min(e.count, CFG.enemyRender);
    const R = 0.3 * Math.sqrt(n);
    const hw = Math.min(R, 1.0); // 적 무리는 항상 한 레인만 막음
    const rz = Math.min(R * R / Math.max(hw, 0.3), R * 2.2);
    e.hw = Math.max(hw, 0.35); e.rz = Math.max(rz, 0.35);
    e.members = [];
    for (let i = 0; i < n; i++) {
      const rr = n === 1 ? 0 : Math.sqrt((i + 0.5) / n);
      const th = i * 2.39996;
      e.members.push({ ox: Math.cos(th) * rr * e.hw, oz: Math.sin(th) * rr * e.rz, ph: Math.random() * 6, alive: true, dx: 0, dz: 0 });
    }
  }

  // ---------- 요새 ----------
  buildFortress() {
    const g = new THREE.Group();
    const stone = new THREE.MeshLambertMaterial({ color: 0x8a8fa8 });
    const stoneD = new THREE.MeshLambertMaterial({ color: 0x6a6f88 });
    const red = new THREE.MeshLambertMaterial({ color: 0xff4a5a });
    const wood = new THREE.MeshLambertMaterial({ color: 0x8a5a32 });
    const B = this.geo.box;
    const parts = [];
    const add = (mat, sx, sy, sz, x, y, z, kind = 'wall') => { const m = new THREE.Mesh(B, mat); m.scale.set(sx, sy, sz); m.position.set(x, y, z); g.add(m); parts.push({ m, kind }); return m; };
    for (const s of [-1, 1]) {
      add(stone, 7, 4.2, 1.6, s * (1.75 + 3.5), 2.1, 0);
      for (let i = 0; i < 4; i++) add(stoneD, 0.8, 0.7, 1.7, s * (2.3 + i * 1.7), 4.55, 0);
      const tw = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.15, 6, 8), stone); tw.position.set(s * 2.25, 3, 0.2); g.add(tw); parts.push({ m: tw, kind: 'wall' });
      const roof = new THREE.Mesh(new THREE.ConeGeometry(1.35, 1.8, 8), red); roof.position.set(s * 2.25, 6.9, 0.2); g.add(roof); parts.push({ m: roof, kind: 'wall' });
      const flag = add(red, 0.05, 0.5, 0.7, s * 2.25, 8.1, 0.4);
      flag.userData.flag = true;
    }
    const top = add(stone, 3.2, 1.2, 1.6, 0, 4.0, 0);
    const door = add(wood, 3.0, 3.4, 0.5, 0, 1.7, 0.6, 'door');
    for (let i = -1; i <= 1; i++) add(new THREE.MeshLambertMaterial({ color: 0x3a3a48 }), 0.12, 3.4, 0.55, i * 0.9, 1.7, 0.62, 'door');
    // HP 표지판
    const c = document.createElement('canvas'); c.width = 256; c.height = 96;
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 1.2), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
    sign.position.set(0, 5.6, 1.0);
    g.add(sign);
    this.scene.add(g);
    g.visible = false;
    this.fortress = { g, parts, door, top, sign, canvas: c, tex, d: 0, hp: 0, maxHp: 0, active: false, broken: false, shake: 0 };
  }

  placeFortress(d, hp) {
    if (!this.fortress) this.buildFortress();
    const f = this.fortress;
    f.d = d; f.hp = hp; f.maxHp = hp; f.active = true; f.broken = false; f.shake = 0;
    f.g.visible = true;
    f.g.position.set(0, 0, -d);
    f.parts.forEach((p) => { p.m.visible = true; });
    f.sign.visible = true;
    this.drawFortressHp();
  }

  drawFortressHp() {
    const f = this.fortress;
    const g = f.canvas.getContext('2d');
    g.clearRect(0, 0, 256, 96);
    g.fillStyle = 'rgba(30,20,40,0.78)';
    roundRect(g, 4, 4, 248, 88, 22); g.fill();
    // 방패 아이콘
    g.fillStyle = '#ff5a6a';
    g.beginPath(); g.moveTo(40, 18); g.lineTo(66, 26); g.lineTo(64, 56); g.lineTo(40, 78); g.lineTo(16, 56); g.lineTo(14, 26); g.closePath(); g.fill();
    g.fillStyle = '#fff';
    g.font = '900 58px system-ui, -apple-system, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(String(Math.max(0, Math.ceil(f.hp))), 160, 52);
    f.tex.needsUpdate = true;
  }

  // ---------- 보너스 계단 ----------
  buildStairs() {
    const g = new THREE.Group();
    const cols = [0x4ad0ff, 0x4affb0, 0xb0ff4a, 0xffd84a, 0xff9a3a, 0xff4a8a];
    const W = 6.6;
    this.stairSteps = CFG.stairMults.map((m, i) => {
      const h = (i + 1) * CFG.stairStepH;
      // 앞면 세로 벽(보이는 부분은 맨 위 한 칸 높이)에 배수 글자를 그림
      const c = document.createElement('canvas');
      c.width = 512; c.height = Math.max(16, Math.round(512 * h / W));
      const x = c.getContext('2d');
      const hex = '#' + cols[i].toString(16).padStart(6, '0');
      x.fillStyle = hex; x.fillRect(0, 0, c.width, c.height);
      const riser = 512 * CFG.stairStepH / W;
      x.fillStyle = 'rgba(0,0,0,0.22)'; x.fillRect(0, riser - 4, 512, 4);
      x.font = `900 ${Math.round(riser * 0.9)}px system-ui, -apple-system, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif`;
      x.textAlign = 'center'; x.textBaseline = 'middle';
      x.lineWidth = 5; x.strokeStyle = 'rgba(0,0,0,0.35)'; x.fillStyle = '#fff';
      for (const px of [96, 256, 416]) { x.strokeText('x' + m, px, riser * 0.52); x.fillText('x' + m, px, riser * 0.52); }
      const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
      const front = new THREE.MeshBasicMaterial({ map: tex, color: 0xffffff });
      const side = new THREE.MeshLambertMaterial({ color: cols[i], emissive: 0x000000 });
      const mats = [side, side, side, side, front, side];
      const mesh = new THREE.Mesh(this.geo.box, mats);
      mesh.scale.set(W, h, CFG.stairStepLen);
      mesh.position.set(0, h / 2, -(i + 0.5) * CFG.stairStepLen);
      g.add(mesh);
      return { mesh, h, mats, side, front };
    });
    g.visible = false;
    this.scene.add(g);
    this.stairs = { g, d: 0, sink: 1, active: false, reached: -1, glow: -1 };
  }

  // 도달한 층 금색 발광
  glowStep(i) {
    if (!this.stairs) return;
    this.stairs.glow = i;
    this.stairSteps.forEach((st, k) => { st.side.emissive.setHex(k === i ? 0xffb020 : 0x000000); st.side.emissiveIntensity = 0.8; st.front.color.setHex(k === i ? 0xfff0a0 : 0xffffff); });
  }

  placeStairs(d) {
    if (!this.stairs) this.buildStairs();
    const st = this.stairs;
    st.d = d; st.sink = 1; st.active = true; st.reached = -1;
    st.g.visible = true;
    st.g.position.set(0, 0, -d);
    st.g.scale.set(1, 1, 1);
    this.glowStep(-1);
  }

  // 계단 위 높이 (d 는 월드 진행 거리)
  stairHeight(d) {
    const st = this.stairs;
    if (!st || !st.active) return 0;
    const i = Math.floor((d - st.d) / CFG.stairStepLen);
    if (i < 0 || i >= CFG.stairMults.length) return 0;
    return (i + 1) * CFG.stairStepH * st.sink;
  }

  hideStairs() { if (this.stairs) { this.stairs.active = false; this.stairs.g.visible = false; } }

  hideFortress() { if (this.fortress) { this.fortress.g.visible = false; this.fortress.active = false; } }

  // ---------- 매 프레임 ----------
  update(dt, time, dist) {
    // 정리
    const cut = dist - CFG.despawnBehind;
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const o = this.obstacles[i];
      if (o.d + o.halfL < cut || (o.dead && o.t > 1)) { this.releaseObstacle(o); this.obstacles.splice(i, 1); }
    }
    for (let i = this.gateRows.length - 1; i >= 0; i--) {
      const r = this.gateRows[i];
      if (r.d < cut) { this.releaseGateRow(r); this.gateRows.splice(i, 1); }
    }
    for (let i = this.coins.length - 1; i >= 0; i--) if (!this.coins[i].alive || this.coins[i].d < cut) this.coins.splice(i, 1);
    for (let i = this.powerups.length - 1; i >= 0; i--) {
      const p = this.powerups[i];
      if (!p.alive || p.d < cut) { this.releasePower(p); this.powerups.splice(i, 1); }
    }
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      if (e.d + 6 < cut || (e.dead && e.members.length === 0)) this.enemies.splice(i, 1);
    }

    // 장애물 애니메이션 (부서진 것은 날아감, 마주 오는 기차는 가까워지면 출발)
    let nc = 0;
    for (const o of this.obstacles) {
      if (o.vd && !o.dead && o.d - o.halfL - dist < 45) { o.d += o.vd * dt; if (o.mesh) o.mesh.position.z = -o.d; }
      if (o.dead) {
        o.t += dt;
        if (o.mesh) { o.mesh.position.y += dt * 6; o.mesh.rotation.x -= dt * 8; o.mesh.scale.setScalar(Math.max(0.01, 1 - o.t)); }
        if (o.kind === 'cone') continue;
      }
      if (o.kind === 'cone' && !o.dead && nc < 160) {
        this.m.makeTranslation(o.x, 0, -o.d);
        this.coneMesh.setMatrixAt(nc++, this.m);
      }
    }
    this.coneMesh.count = nc;
    this.coneMesh.instanceMatrix.needsUpdate = true;

    // 게이트 연출
    for (const r of this.gateRows) {
      if (!r.used) continue;
      r.t += dt;
      for (const g of r.gates) {
        if (g.chosen) {
          const s = 1 + Math.sin(Math.min(1, r.t * 3) * Math.PI) * 0.25;
          g.mesh.scale.set(s, s, s);
          g.mesh.userData.panel.material.opacity = Math.max(0, 1 - r.t * 1.5);
        } else {
          g.mesh.position.y = -r.t * r.t * 6;
          g.mesh.userData.panel.material.opacity = Math.max(0, 1 - r.t * 2);
        }
      }
    }

    // 코인
    let n = 0;
    const spin = time * 4;
    this.e.set(0, spin, 0);
    this.q.setFromEuler(this.e);
    this.s.set(1, 1, 1);
    for (const c of this.coins) {
      if (!c.alive || n >= 260) continue;
      this.v.set(c.x, c.y + Math.sin(time * 3 + c.d) * 0.08, -c.d);
      this.m.compose(this.v, this.q, this.s);
      this.coinMesh.setMatrixAt(n++, this.m);
    }
    this.coinMesh.count = n;
    this.coinMesh.instanceMatrix.needsUpdate = true;

    for (const p of this.powerups) {
      p.t += dt;
      if (!p.mesh) continue;
      p.mesh.position.set(p.x, 1.1 + Math.sin(p.t * 3) * 0.15, -p.d);
      p.mesh.userData.icon.rotation.y = p.t * 2;
      p.mesh.userData.ring.rotation.set(Math.PI / 2 + Math.sin(p.t) * 0.3, 0, p.t);
    }

    if (this.stairs && this.stairs.glow >= 0) this.stairSteps[this.stairs.glow].side.emissiveIntensity = 0.55 + Math.sin(time * 10) * 0.35;
    const f = this.fortress;
    if (f && f.active && !f.broken) {
      if (f.shake > 0) f.shake = Math.max(0, f.shake - dt * 4);
      f.door.position.x = (Math.random() - 0.5) * f.shake * 0.3;
      f.g.children.forEach((c) => { if (c.userData.flag) c.rotation.y = Math.sin(time * 5 + c.position.x) * 0.5; });
    }
  }

  clearAll() {
    this.hideStairs();
    this.obstacles.forEach((o) => this.releaseObstacle(o)); this.obstacles.length = 0;
    this.gateRows.forEach((r) => this.releaseGateRow(r)); this.gateRows.length = 0;
    this.coins.length = 0;
    this.powerups.forEach((p) => this.releasePower(p)); this.powerups.length = 0;
    this.enemies.length = 0;
    this.hideFortress();
    this.coneMesh.count = 0; this.coinMesh.count = 0;
    this.shieldDome.visible = false;
  }
}

export function roundRect(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}
