// 로우폴리 모델: 아이템, 캐릭터, 시설
import { THREE, Build, GEO, matVC, matGlow, col } from './gfx.js';
import { MENUS, INGS } from './config.js';

// ---------- 아이템 지오메트리 (원점 = 바닥 중앙) ----------
export const ITEM_H = { ing: 0.2, dish: 0.2, dirty: 0.075, clean: 0.075, cash: 0.08 };

export function plateGeo() {
  const b = new Build();
  b.add(GEO.cyl(0.29, 0.2, 0.05, 18), '#ffffff', 0, 0.025, 0);
  b.add(GEO.cyl(0.2, 0.2, 0.012, 18), '#e6e6e6', 0, 0.053, 0);
  b.add(GEO.torus(0.26, 0.018, 5, 22), '#ffffff', 0, 0.05, 0, Math.PI / 2);
  return b.geometry();
}

function nigiriPair(b, fish, stripe, y = 0.055) {
  for (const x of [-0.09, 0.09]) {
    b.add(GEO.sph(0.1, 10, 7), '#fbf8f0', x, y + 0.045, 0, 0, 0, 0, 0.72, 0.6, 1.25);
    b.add(GEO.rbox(0.15, 0.04, 0.3, 0.05), fish, x, y + 0.1, 0, 0.1, 0, 0);
    if (stripe) {
      for (const z of [-0.07, 0, 0.07]) b.add(GEO.box(0.152, 0.012, 0.018), stripe, x, y + 0.123, z + 0.01, 0.1, 0, 0.4);
    }
  }
}

export function toppingGeo(menu) {
  const b = new Build();
  const y = 0.055;
  switch (menu) {
    case 'salmon':
      nigiriPair(b, '#ff8a4c', '#ffe1cc');
      break;
    case 'tuna':
      nigiriPair(b, '#d4263f', null);
      break;
    case 'unagi':
      nigiriPair(b, '#8a5530', '#4a2a14');
      for (const x of [-0.09, 0.09]) b.add(GEO.box(0.16, 0.02, 0.05), '#1d2b22', x, y + 0.1, 0);
      break;
    case 'tamago':
      for (const x of [-0.09, 0.09]) {
        b.add(GEO.sph(0.1, 10, 7), '#fbf8f0', x, y + 0.04, 0, 0, 0, 0, 0.7, 0.55, 1.2);
        b.add(GEO.rbox(0.15, 0.08, 0.28, 0.03), '#ffd23f', x, y + 0.11, 0);
        b.add(GEO.box(0.16, 0.1, 0.06), '#1d2b22', x, y + 0.1, 0);
      }
      break;
    case 'ebi':
      for (const x of [-0.08, 0.08]) {
        b.add(GEO.cap(0.06, 0.2, 6), '#e9a53c', x, y + 0.08, 0, Math.PI / 2, 0, 0);
        b.add(GEO.cone(0.05, 0.09, 6), '#ff4a3a', x, y + 0.1, -0.2, -Math.PI / 2, 0, 0);
      }
      b.add(GEO.box(0.12, 0.04, 0.08), '#6fcf5a', 0, y + 0.03, 0.14);
      break;
    case 'udon':
      b.add(GEO.cyl(0.24, 0.15, 0.17, 16), '#b8392e', 0, y + 0.085, 0);
      b.add(GEO.cyl(0.21, 0.21, 0.02, 16), '#f6e7bf', 0, y + 0.16, 0);
      b.add(GEO.cyl(0.05, 0.05, 0.025, 10), '#ffffff', 0.07, y + 0.175, 0.03);
      b.add(GEO.cyl(0.025, 0.025, 0.028, 8), '#ff7ab8', 0.07, y + 0.176, 0.03);
      b.add(GEO.box(0.04, 0.02, 0.04), '#5fbf4a', -0.07, y + 0.175, -0.02);
      b.add(GEO.box(0.04, 0.02, 0.04), '#5fbf4a', -0.03, y + 0.175, 0.07);
      b.add(GEO.cyl(0.012, 0.012, 0.4, 5), '#8a5a2a', -0.02, y + 0.26, -0.05, 0.9, 0, 0.3);
      break;
    case 'uni':
    case 'ikura':
      for (const x of [-0.09, 0.09]) {
        b.add(GEO.cyl(0.085, 0.085, 0.12, 10), '#1d2b22', x, y + 0.06, 0);
        b.add(GEO.cyl(0.075, 0.075, 0.02, 10), menu === 'uni' ? '#ffb52e' : '#ff6a1f', x, y + 0.125, 0);
        if (menu === 'uni') b.add(GEO.sph(0.05, 8, 6), '#ffc84a', x, y + 0.14, 0, 0, 0, 0, 1.2, 0.5, 0.8);
        else for (let i = 0; i < 4; i++) b.add(GEO.sph(0.025, 6, 5), '#ff4a10', x + Math.cos(i * 1.6) * 0.035, y + 0.14, Math.sin(i * 1.6) * 0.035);
      }
      break;
    case 'dessert':
      b.add(GEO.cyl(0.01, 0.01, 0.46, 5), '#c99a5a', 0, y + 0.07, 0, Math.PI / 2, 0.5, 0);
      [['#8fd16a', -0.13], ['#ffffff', 0], ['#ff9cc4', 0.13]].forEach(([c, t]) => {
        b.add(GEO.sph(0.075, 10, 8), c, Math.sin(0.5) * t, y + 0.075, Math.cos(0.5) * t);
      });
      break;
    case 'star': {
      const s = new THREE.Shape();
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 5;
        const r = i % 2 ? 0.09 : 0.2;
        if (i === 0) s.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        else s.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      const g = new THREE.ExtrudeGeometry(s, { depth: 0.1, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 1 });
      g.rotateX(-Math.PI / 2);
      b.add(g, '#b58cff', 0, y + 0.02, 0);
      b.add(GEO.sph(0.04, 6, 5), '#ffffff', -0.04, y + 0.15, -0.03);
      break;
    }
  }
  return b.geometry();
}

export function ingGeo(id) {
  const b = new Build();
  const c = INGS[id].color;
  switch (id) {
    case 'salmon':
      b.add(GEO.rbox(0.46, 0.14, 0.28, 0.06), c, 0, 0.07, 0);
      for (const x of [-0.12, 0, 0.12]) b.add(GEO.box(0.03, 0.142, 0.26), '#ffe1cc', x, 0.07, 0, 0, 0.4, 0);
      break;
    case 'tuna':
      b.add(GEO.rbox(0.44, 0.17, 0.3, 0.05), c, 0, 0.085, 0);
      b.add(GEO.box(0.3, 0.172, 0.04), '#e85a6a', 0, 0.085, 0.05, 0, 0.3, 0);
      break;
    case 'eel':
      b.add(GEO.rbox(0.52, 0.1, 0.2, 0.08), c, 0, 0.05, 0);
      b.add(GEO.box(0.5, 0.02, 0.06), '#4a2a14', 0, 0.1, 0);
      break;
    case 'egg':
      b.add(GEO.rbox(0.44, 0.08, 0.3, 0.04), '#d9c39a', 0, 0.04, 0);
      for (let i = 0; i < 4; i++) b.add(GEO.sph(0.07, 8, 6), '#fff6df', -0.15 + i * 0.1, 0.12, 0, 0, 0, 0, 0.9, 1.2, 0.9);
      break;
    case 'shrimp':
      b.add(GEO.torus(0.12, 0.06, 6, 10, Math.PI * 1.4), c, 0, 0.07, 0, Math.PI / 2, 0, 0);
      b.add(GEO.cone(0.06, 0.1, 6), '#ff4a3a', 0.12, 0.07, -0.08);
      break;
    case 'noodle':
      b.add(GEO.cyl(0.12, 0.12, 0.44, 10), c, 0, 0.12, 0, 0, 0, Math.PI / 2);
      b.add(GEO.cyl(0.125, 0.125, 0.08, 10), '#c0392b', 0, 0.12, 0, 0, 0, Math.PI / 2);
      break;
    case 'uni':
      b.add(new THREE.IcosahedronGeometry(0.14, 0), '#3a2a4a', 0, 0.13, 0);
      b.add(new THREE.IcosahedronGeometry(0.17, 0), '#4a3a5a', 0, 0.13, 0, 0.5, 0.5, 0, 0.7, 1.1, 0.7);
      b.add(GEO.cyl(0.07, 0.07, 0.02, 8), c, 0, 0.26, 0);
      break;
    case 'berry':
      b.add(GEO.rbox(0.42, 0.08, 0.3, 0.04), '#e9d9b0', 0, 0.04, 0);
      for (const x of [-0.1, 0.1]) {
        b.add(GEO.cone(0.08, 0.14, 8), c, x, 0.15, 0, Math.PI, 0, 0);
        b.add(GEO.cyl(0.06, 0.06, 0.02, 6), '#4fbf4a', x, 0.22, 0);
      }
      break;
    case 'roe':
      b.add(GEO.cyl(0.12, 0.12, 0.2, 12), '#f3e4dc', 0, 0.1, 0);
      b.add(GEO.cyl(0.11, 0.11, 0.14, 12), c, 0, 0.1, 0);
      b.add(GEO.cyl(0.13, 0.13, 0.04, 12), '#e8483b', 0, 0.21, 0);
      break;
    case 'star':
      b.add(new THREE.OctahedronGeometry(0.15, 0), c, 0, 0.15, 0);
      b.add(new THREE.OctahedronGeometry(0.08, 0), '#ffffff', 0, 0.15, 0, 0.6, 0.6, 0);
      break;
  }
  return b.geometry();
}

export function cashGeo() {
  const b = new Build();
  b.add(GEO.rbox(0.4, 0.07, 0.22, 0.02), '#46b86a', 0, 0.035, 0);
  b.add(GEO.box(0.1, 0.072, 0.225), '#8fe0a8', 0, 0.035, 0);
  b.add(GEO.cyl(0.035, 0.035, 0.074, 8), '#2f8a4c', 0, 0.035, 0);
  return b.geometry();
}
export function coinGeo() {
  const b = new Build();
  b.add(GEO.cyl(0.13, 0.13, 0.04, 14), '#ffc83d', 0, 0, 0, Math.PI / 2, 0, 0);
  b.add(GEO.cyl(0.08, 0.08, 0.045, 10), '#ffe07a', 0, 0, 0, Math.PI / 2, 0, 0);
  return b.geometry();
}

// ---------- 손님 파트 (인스턴싱) ----------
export function customerParts() {
  const body = new Build().add(GEO.cap(0.2, 0.22, 10), '#ffffff', 0, 0.36, 0).geometry();
  const head = new Build().add(GEO.sph(0.2, 14, 10), '#ffd9b8', 0, 0, 0).geometry();
  const hair = new Build()
    .add(new THREE.SphereGeometry(0.215, 14, 8, 0, Math.PI * 2, 0, Math.PI * 0.55), '#ffffff', 0, 0.01, -0.01)
    .geometry();
  const face = new Build()
    .add(GEO.sph(0.028, 6, 5), '#222222', -0.075, 0.02, 0.18)
    .add(GEO.sph(0.028, 6, 5), '#222222', 0.075, 0.02, 0.18)
    .add(GEO.sph(0.035, 6, 5), '#ff9a9a', -0.12, -0.05, 0.15, 0, 0, 0, 1, 0.6, 0.5)
    .add(GEO.sph(0.035, 6, 5), '#ff9a9a', 0.12, -0.05, 0.15, 0, 0, 0, 1, 0.6, 0.5)
    .geometry();
  const crown = new Build()
    .add(GEO.cyl(0.13, 0.12, 0.08, 10), '#ffc83d', 0, 0, 0)
    .add(GEO.cone(0.035, 0.08, 5), '#ffc83d', 0.1, 0.07, 0)
    .add(GEO.cone(0.035, 0.08, 5), '#ffc83d', -0.1, 0.07, 0)
    .add(GEO.cone(0.035, 0.08, 5), '#ffc83d', 0, 0.07, 0.1)
    .add(GEO.cone(0.035, 0.08, 5), '#ffc83d', 0, 0.07, -0.1)
    .add(GEO.sph(0.03, 6, 5), '#e2394f', 0, 0.03, 0.125)
    .geometry();
  const legs = new Build()
    .add(GEO.cap(0.07, 0.12, 6), '#ffffff', -0.09, 0.1, 0)
    .add(GEO.cap(0.07, 0.12, 6), '#ffffff', 0.09, 0.1, 0)
    .geometry();
  return { body, head, hair, face, crown, legs };
}

// ---------- 셰프/직원 ----------
export function makeChar(opts = {}) {
  const g = new THREE.Group();
  const skin = '#ffd9b8';
  const bodyC = opts.body || '#ffffff';
  const root = new THREE.Group();
  g.add(root);
  const mk = (build, shadow = true) => {
    const m = build.mesh(matVC, shadow);
    return m;
  };
  // 다리
  const legL = mk(new Build().add(GEO.cap(0.075, 0.14, 6), opts.pants || '#3a3f55', 0, -0.1, 0));
  const legR = mk(new Build().add(GEO.cap(0.075, 0.14, 6), opts.pants || '#3a3f55', 0, -0.1, 0));
  legL.position.set(-0.1, 0.24, 0);
  legR.position.set(0.1, 0.24, 0);
  root.add(legL, legR);
  // 몸통
  const body = mk(new Build().add(GEO.cap(0.24, 0.26, 12), bodyC, 0, 0, 0).add(GEO.sph(0.035, 6, 5), '#d0d4e0', 0, 0.12, 0.235).add(GEO.sph(0.035, 6, 5), '#d0d4e0', 0, 0.0, 0.24));
  body.position.set(0, 0.56, 0);
  root.add(body);
  // 앞치마
  const apronMat = new THREE.MeshLambertMaterial({ color: opts.apron || '#ffffff' });
  const apronGeo = new THREE.CylinderGeometry(0.248, 0.26, 0.3, 14, 1, true, -Math.PI * 0.42, Math.PI * 0.84);
  const apron = new THREE.Mesh(apronGeo, apronMat);
  apron.position.set(0, 0.48, 0.005);
  apron.castShadow = true;
  root.add(apron);
  // 머리
  const head = new THREE.Group();
  head.position.set(0, 0.98, 0);
  root.add(head);
  const face = mk(
    new Build()
      .add(GEO.sph(0.25, 16, 12), skin, 0, 0, 0)
      .add(GEO.sph(0.034, 6, 5), '#222222', -0.085, 0.02, 0.225)
      .add(GEO.sph(0.034, 6, 5), '#222222', 0.085, 0.02, 0.225)
      .add(GEO.sph(0.045, 6, 5), '#ff9a9a', -0.14, -0.06, 0.19, 0, 0, 0, 1, 0.6, 0.5)
      .add(GEO.sph(0.045, 6, 5), '#ff9a9a', 0.14, -0.06, 0.19, 0, 0, 0, 1, 0.6, 0.5)
      .add(GEO.box(0.06, 0.018, 0.02), '#7a3a2a', 0, -0.07, 0.24)
      .add(new THREE.SphereGeometry(0.262, 14, 8, 0, Math.PI * 2, 0, Math.PI * 0.42), opts.hair || '#3a2a22', 0, 0.02, -0.02)
  );
  head.add(face);
  // 모자들
  const hats = {};
  hats.chef = mk(
    new Build()
      .add(GEO.cyl(0.2, 0.2, 0.16, 14), '#ffffff', 0, 0.26, 0)
      .add(GEO.sph(0.16, 10, 8), '#ffffff', -0.08, 0.38, 0)
      .add(GEO.sph(0.16, 10, 8), '#ffffff', 0.08, 0.38, 0)
      .add(GEO.sph(0.16, 10, 8), '#ffffff', 0, 0.4, 0.06)
  );
  hats.band = mk(new Build().add(GEO.torus(0.245, 0.04, 6, 18), '#ffffff', 0, 0.1, 0, Math.PI / 2 - 0.1).add(GEO.sph(0.05, 6, 5), '#e2394f', 0, 0.12, 0.25).add(GEO.box(0.05, 0.14, 0.02), '#ffffff', 0.05, 0.06, -0.26, 0.3, 0, 0.3));
  hats.cat = mk(new Build().add(GEO.cone(0.09, 0.16, 4), '#ff9a3c', -0.14, 0.24, 0, 0, 0.8, -0.3).add(GEO.cone(0.09, 0.16, 4), '#ff9a3c', 0.14, 0.24, 0, 0, 0.8, 0.3).add(GEO.cone(0.05, 0.08, 4), '#ffc2d8', -0.14, 0.23, 0.03, 0, 0.8, -0.3).add(GEO.cone(0.05, 0.08, 4), '#ffc2d8', 0.14, 0.23, 0.03, 0, 0.8, 0.3));
  hats.pirate = mk(new Build().add(GEO.cyl(0.3, 0.32, 0.05, 16), '#2a2a2e', 0, 0.16, 0).add(GEO.cyl(0.2, 0.24, 0.18, 14), '#2a2a2e', 0, 0.26, 0).add(GEO.box(0.08, 0.08, 0.02), '#ffffff', 0, 0.28, 0.225).add(GEO.torus(0.22, 0.02, 5, 16), '#ffc83d', 0, 0.2, 0, Math.PI / 2));
  hats.crown = mk(new Build().add(GEO.cyl(0.19, 0.17, 0.12, 12), '#ffc83d', 0, 0.26, 0).add(GEO.cone(0.05, 0.12, 5), '#ffc83d', 0.14, 0.37, 0).add(GEO.cone(0.05, 0.12, 5), '#ffc83d', -0.14, 0.37, 0).add(GEO.cone(0.05, 0.12, 5), '#ffc83d', 0, 0.37, 0.14).add(GEO.cone(0.05, 0.12, 5), '#ffc83d', 0, 0.37, -0.14).add(GEO.sph(0.04, 6, 5), '#e2394f', 0, 0.27, 0.18));
  const helm = new THREE.Mesh(new THREE.SphereGeometry(0.34, 16, 12), new THREE.MeshLambertMaterial({ color: 0xbfe8ff, transparent: true, opacity: 0.35, depthWrite: false }));
  helm.position.y = 0.02;
  hats.helmet = new THREE.Group();
  hats.helmet.add(helm, mk(new Build().add(GEO.torus(0.3, 0.04, 6, 18), '#e8ecf5', 0, -0.2, 0, Math.PI / 2).add(GEO.cyl(0.015, 0.015, 0.2, 5), '#aab', 0.2, 0.3, 0).add(GEO.sph(0.035, 6, 5), '#ff3fa4', 0.2, 0.41, 0)));
  hats.cap = mk(new Build().add(new THREE.SphereGeometry(0.265, 14, 8, 0, Math.PI * 2, 0, Math.PI * 0.45), opts.cap || '#e8483b', 0, 0.04, 0).add(GEO.cyl(0.16, 0.16, 0.025, 12, 1), opts.cap || '#e8483b', 0, 0.1, 0.2, 0.2, 0, 0, 1, 1, 0.8));
  for (const [k, h] of Object.entries(hats)) {
    h.visible = false;
    head.add(h);
  }
  // 팔
  const armGeo = new Build().add(GEO.cap(0.065, 0.24, 6), bodyC, 0, -0.14, 0).add(GEO.sph(0.07, 8, 6), skin, 0, -0.32, 0);
  const armL = new THREE.Group();
  const armR = new THREE.Group();
  const aL = mk(armGeo);
  const aR = aL.clone();
  armL.add(aL);
  armR.add(aR);
  armL.position.set(-0.27, 0.72, 0);
  armR.position.set(0.27, 0.72, 0);
  root.add(armL, armR);
  g.userData = { root, body, head, legL, legR, armL, armR, apron, apronMat, hats };
  setHat(g, opts.hat || 'chef');
  return g;
}

export function setHat(char, id) {
  const { hats } = char.userData;
  for (const [k, h] of Object.entries(hats)) h.visible = k === id;
}

// 걷기/들기 애니메이션
export function animChar(char, t, moving, carrying, speedK = 1) {
  const u = char.userData;
  const w = moving ? t * 11 * speedK : 0;
  const sw = moving ? Math.sin(w) : 0;
  u.root.position.y = moving ? Math.abs(Math.sin(w)) * 0.07 : Math.sin(t * 2.4) * 0.012;
  u.root.rotation.z = moving ? Math.sin(w) * 0.05 : 0;
  u.body.scale.set(1, moving ? 1 - Math.abs(Math.cos(w)) * 0.04 : 1 + Math.sin(t * 2.4) * 0.015, 1);
  u.legL.rotation.x = sw * 0.7;
  u.legR.rotation.x = -sw * 0.7;
  if (carrying) {
    u.armL.rotation.set(-1.35, 0, 0.1);
    u.armR.rotation.set(-1.35, 0, -0.1);
  } else {
    u.armL.rotation.set(-sw * 0.6, 0, 0.15);
    u.armR.rotation.set(sw * 0.6, 0, -0.15);
  }
  u.head.rotation.x = moving ? 0.06 : 0;
}

// ---------- 시설 모델 ----------
export function stationModel(menu, theme) {
  const b = new Build();
  const w = 1.8;
  const pc = MENUS[menu].plate;
  b.add(GEO.rbox(w, 0.86, 1.1, 0.12), '#d8dde6', 0, 0.43, 0);
  b.add(GEO.rbox(w + 0.08, 0.08, 1.18, 0.14), '#f4f6fa', 0, 0.9, 0);
  b.add(GEO.box(w - 0.1, 0.3, 0.02), pc, 0, 0.5, 0.56);
  b.add(GEO.box(w - 0.3, 0.05, 0.03), '#ffffff', 0, 0.62, 0.57);
  // 도마 (재료 쪽)
  b.add(GEO.rbox(0.72, 0.06, 0.7, 0.05), '#e8c48a', -0.46, 0.97, 0);
  // 완성 트레이
  b.add(GEO.rbox(0.72, 0.04, 0.7, 0.05), '#4a4f5f', 0.46, 0.96, 0);
  // 뒤쪽 선반 + 간판
  b.add(GEO.box(w, 0.9, 0.12), theme.wall, 0, 1.35, -0.5);
  b.add(GEO.rbox(0.9, 0.36, 0.08, 0.06), '#ffffff', 0, 1.5, -0.42);
  b.add(GEO.cyl(0.16, 0.16, 0.02, 14), pc, 0, 1.5, -0.37, Math.PI / 2);
  // 칼
  b.add(GEO.box(0.3, 0.02, 0.06), '#c9ccd6', -0.46, 1.01, 0.2, 0, 0.5, 0);
  b.add(GEO.box(0.12, 0.03, 0.04), '#5a3a2a', -0.63, 1.01, 0.32, 0, 0.5, 0);
  return b.mesh();
}

export function crateModel(ing, theme) {
  const b = new Build();
  b.add(GEO.box(1.2, 0.5, 0.95), '#b07a45', 0, 0.25, 0);
  for (const y of [0.12, 0.38]) b.add(GEO.box(1.22, 0.07, 0.97), '#8a5a2e', 0, y, 0);
  b.add(GEO.box(1.0, 0.04, 0.75), '#dff3ff', 0, 0.5, 0); // 얼음
  b.add(GEO.rbox(0.44, 0.3, 0.06, 0.04), '#ffffff', 0, 0.35, 0.49);
  return b.mesh();
}

export function rackModel() {
  const b = new Build();
  b.add(GEO.rbox(1.2, 0.8, 0.9, 0.08), '#8a5a3a', 0, 0.4, 0);
  b.add(GEO.box(1.24, 0.06, 0.94), '#6a4028', 0, 0.82, 0);
  b.add(GEO.box(1.1, 0.03, 0.8), '#f4f6fa', 0, 0.86, 0);
  return b.mesh();
}

export function sinkModel(theme) {
  const b = new Build();
  b.add(GEO.rbox(1.6, 0.86, 1.1, 0.1), '#b9c2cf', 0, 0.43, 0);
  b.add(GEO.rbox(1.68, 0.06, 1.16, 0.12), '#e9eef5', 0, 0.89, 0);
  b.add(GEO.rbox(0.9, 0.04, 0.7, 0.12), '#5ab4e6', 0.2, 0.9, 0);
  b.add(GEO.cyl(0.03, 0.03, 0.4, 6), '#c9ccd6', 0.2, 1.12, -0.42);
  b.add(GEO.cyl(0.03, 0.03, 0.3, 6), '#c9ccd6', 0.2, 1.3, -0.3, Math.PI / 2);
  b.add(GEO.sph(0.07, 8, 6), '#ffe14d', -0.52, 0.99, 0.2);
  b.add(GEO.box(1.6, 0.6, 0.1), theme.wallTrim, 0, 1.25, -0.52);
  return b.mesh();
}

export function trashModel() {
  const b = new Build();
  b.add(GEO.cyl(0.36, 0.3, 0.8, 14), '#5f7a8a', 0, 0.4, 0);
  b.add(GEO.cyl(0.39, 0.39, 0.06, 14), '#3f5a6a', 0, 0.82, 0);
  b.add(GEO.box(0.3, 0.3, 0.02), '#ffffff', 0, 0.45, 0.33);
  b.add(GEO.box(0.2, 0.04, 0.03), '#5f7a8a', 0, 0.45, 0.345);
  return b.mesh();
}

export function stoolModel(x, z, theme) {
  const b = new Build();
  b.add(GEO.cyl(0.24, 0.24, 0.1, 14), theme.noren, x, 0.52, z);
  b.add(GEO.cyl(0.05, 0.07, 0.5, 8), '#6a6f80', x, 0.25, z);
  b.add(GEO.cyl(0.2, 0.22, 0.04, 12), '#6a6f80', x, 0.02, z);
  return b;
}

export function deskModel(theme) {
  const b = new Build();
  b.add(GEO.rbox(1.2, 0.8, 1.6, 0.1), '#6a4a8a', 0, 0.4, 0);
  b.add(GEO.rbox(1.3, 0.06, 1.7, 0.1), '#8f6ab8', 0, 0.82, 0);
  b.add(GEO.box(0.08, 1.3, 1.4), '#ffffff', 0.5, 1.4, 0);
  b.add(GEO.box(0.1, 0.18, 1.2), '#ffc83d', 0.44, 1.9, 0);
  for (let i = 0; i < 3; i++) b.add(GEO.box(0.02, 0.1 + i * 0.12, 0.12), ['#4fb0ff', '#ffc83d', '#e8483b'][i], 0.45, 1.05 + (0.1 + i * 0.12) / 2, -0.3 + i * 0.25);
  b.add(GEO.cone(0.12, 0.2, 4), '#e8483b', 0.45, 1.62, 0.45);
  return b.mesh();
}

export function leverModel() {
  const b = new Build();
  b.add(GEO.rbox(0.5, 0.3, 0.5, 0.08), '#5a5f70', 0, 0.15, 0);
  b.add(GEO.cyl(0.04, 0.04, 0.7, 6), '#c9ccd6', 0.1, 0.55, 0, 0, 0, -0.4);
  b.add(GEO.sph(0.1, 10, 8), '#e8483b', 0.24, 0.87, 0);
  return b.mesh();
}

export function lanternGeo(b, x, y, z, color, s = 1) {
  b.add(GEO.cyl(0.05 * s, 0.05 * s, 0.06 * s, 8), '#2a1a14', x, y + 0.3 * s, z);
  b.add(GEO.cyl(0.05 * s, 0.05 * s, 0.06 * s, 8), '#2a1a14', x, y - 0.3 * s, z);
}
export function lanternGlow(b, x, y, z, color, s = 1) {
  b.add(GEO.sph(0.26 * s, 9, 7), color, x, y, z, 0, 0, 0, 1, 1.25, 1);
}

// 떠 있는 가이드 화살표
export function arrowMesh() {
  const b = new Build();
  b.add(GEO.cone(0.32, 0.5, 4), '#ffe14d', 0, 0, 0, Math.PI, Math.PI / 4, 0);
  b.add(GEO.box(0.22, 0.4, 0.22), '#ffe14d', 0, 0.4, 0, 0, Math.PI / 4, 0);
  const m = b.mesh(matGlow, false);
  return m;
}

export { col };
