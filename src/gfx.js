// three.js 렌더러, 카메라, 조명, 지오메트리 빌더, 인스턴스 렌더러
import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export { THREE };

export const gfx = {
  renderer: null,
  scene: null,
  camera: null,
  sun: null,
  hemi: null,
  camTarget: new THREE.Vector3(),
  camPos: new THREE.Vector3(),
  shake: 0,
  viewW: 10.5,
  pitch: 0.93,
  zoom: 1,
  width: 390,
  height: 844,
};

export const matVC = new THREE.MeshLambertMaterial({ vertexColors: true });
export const matGlow = new THREE.MeshBasicMaterial({ vertexColors: true });

export function initGfx(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(1.5, window.devicePixelRatio || 1));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  gfx.renderer = renderer;

  const scene = new THREE.Scene();
  gfx.scene = scene;
  const camera = new THREE.PerspectiveCamera(30, 390 / 844, 1, 120);
  gfx.camera = camera;

  const hemi = new THREE.HemisphereLight(0xffffff, 0x886644, 1.1);
  scene.add(hemi);
  gfx.hemi = hemi;
  const sun = new THREE.DirectionalLight(0xffeedd, 1.5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  const sc = sun.shadow.camera;
  sc.left = -13;
  sc.right = 13;
  sc.top = 13;
  sc.bottom = -13;
  sc.near = 1;
  sc.far = 50;
  sun.shadow.bias = -0.0012;
  sun.shadow.normalBias = 0.03;
  sun.shadow.radius = 3;
  scene.add(sun);
  scene.add(sun.target);
  gfx.sun = sun;
  resize();
}

export function setShadows(on) {
  gfx.renderer.shadowMap.enabled = on;
  gfx.sun.castShadow = on;
  gfx.scene.traverse((o) => {
    if (o.material) o.material.needsUpdate = true;
  });
}

export function resize() {
  const app = document.getElementById('app');
  const w = app.clientWidth;
  const h = app.clientHeight;
  gfx.width = w;
  gfx.height = h;
  gfx.renderer.setSize(w, h, false);
  gfx.camera.aspect = w / h;
  gfx.camera.updateProjectionMatrix();
}

const tmpV = new THREE.Vector3();
// 카메라: 보이는 가로폭을 일정하게 유지하는 쿼터뷰
export function updateCamera(dt, tx, tz, snap = false) {
  const cam = gfx.camera;
  const vfov = THREE.MathUtils.degToRad(cam.fov);
  const hTan = Math.tan(vfov / 2) * cam.aspect;
  const W = gfx.viewW * gfx.zoom;
  let dist = W / 2 / hTan;
  dist = Math.min(Math.max(dist, 16), 48);
  const k = snap ? 1 : 1 - Math.exp(-dt * 6);
  gfx.camTarget.x += (tx - gfx.camTarget.x) * k;
  gfx.camTarget.z += (tz - gfx.camTarget.z) * k;
  gfx.camTarget.y = 0.6;
  const p = gfx.pitch;
  cam.position.set(gfx.camTarget.x, gfx.camTarget.y + Math.sin(p) * dist, gfx.camTarget.z + Math.cos(p) * dist);
  if (gfx.shake > 0) {
    const s = gfx.shake * 0.25;
    cam.position.x += (Math.random() - 0.5) * s;
    cam.position.y += (Math.random() - 0.5) * s;
    gfx.shake = Math.max(0, gfx.shake - dt * 3);
  }
  cam.lookAt(gfx.camTarget.x, gfx.camTarget.y, gfx.camTarget.z);
  const sun = gfx.sun;
  sun.position.set(gfx.camTarget.x - 7, 16, gfx.camTarget.z + 5);
  sun.target.position.set(gfx.camTarget.x, 0, gfx.camTarget.z - 1.5);
}

// 월드 좌표 -> 화면 픽셀
export function project(x, y, z, out) {
  tmpV.set(x, y, z).project(gfx.camera);
  out.x = (tmpV.x * 0.5 + 0.5) * gfx.width;
  out.y = (-tmpV.y * 0.5 + 0.5) * gfx.height;
  out.vis = tmpV.z < 1 && out.x > -60 && out.x < gfx.width + 60 && out.y > -80 && out.y < gfx.height + 60;
  return out;
}

// ---------- 색 캐시 ----------
const colorCache = new Map();
export function col(hex) {
  let c = colorCache.get(hex);
  if (!c) {
    c = new THREE.Color(hex);
    colorCache.set(hex, c);
  }
  return c;
}

// ---------- 정점색 지오메트리 빌더 ----------
const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _e = new THREE.Euler();
const _p = new THREE.Vector3();
const _s = new THREE.Vector3();

export function prep(geo, color) {
  let g = geo.index ? geo.toNonIndexed() : geo.clone();
  for (const k of Object.keys(g.attributes)) if (k !== 'position' && k !== 'normal') g.deleteAttribute(k);
  const n = g.attributes.position.count;
  const arr = new Float32Array(n * 3);
  const c = new THREE.Color(color);
  for (let i = 0; i < n; i++) {
    arr[i * 3] = c.r;
    arr[i * 3 + 1] = c.g;
    arr[i * 3 + 2] = c.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(arr, 3));
  return g;
}

export class Build {
  constructor() {
    this.parts = [];
  }
  add(geo, color, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) {
    const g = prep(geo, color);
    _e.set(rx, ry, rz);
    _q.setFromEuler(_e);
    _m.compose(_p.set(x, y, z), _q, _s.set(sx, sy, sz));
    g.applyMatrix4(_m);
    this.parts.push(g);
    return this;
  }
  addGeo(g) {
    this.parts.push(g);
    return this;
  }
  geometry() {
    if (!this.parts.length) return null;
    const g = mergeGeometries(this.parts, false);
    this.parts.forEach((p) => p.dispose());
    this.parts = [];
    return g;
  }
  mesh(mat = matVC, shadow = true) {
    const g = this.geometry();
    const m = new THREE.Mesh(g || new THREE.BufferGeometry(), mat);
    m.castShadow = shadow;
    m.receiveShadow = true;
    return m;
  }
}

// 자주 쓰는 기본 도형
export const GEO = {
  box: (w, h, d) => new THREE.BoxGeometry(w, h, d),
  cyl: (rt, rb, h, seg = 14) => new THREE.CylinderGeometry(rt, rb, h, seg),
  sph: (r, ws = 14, hs = 10) => new THREE.SphereGeometry(r, ws, hs),
  cone: (r, h, seg = 12) => new THREE.ConeGeometry(r, h, seg),
  cap: (r, l, seg = 8) => new THREE.CapsuleGeometry(r, l, 4, seg),
  torus: (r, t, rs = 8, ts = 16, arc = Math.PI * 2) => new THREE.TorusGeometry(r, t, rs, ts, arc),
  // 둥근 모서리 박스 (살짝 둥글게 보이도록 extrude)
  rbox: (w, h, d, r = 0.06) => {
    const s = new THREE.Shape();
    const x = -w / 2;
    const y = -d / 2;
    r = Math.min(r, w / 2 - 0.001, d / 2 - 0.001);
    s.moveTo(x + r, y);
    s.lineTo(x + w - r, y);
    s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + d - r);
    s.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
    s.lineTo(x + r, y + d);
    s.quadraticCurveTo(x, y + d, x, y + d - r);
    s.lineTo(x, y + r);
    s.quadraticCurveTo(x, y, x + r, y);
    const g = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: false, curveSegments: 3 });
    g.rotateX(-Math.PI / 2);
    g.translate(0, -h / 2, 0);
    return g;
  },
};

// ---------- 인스턴스 렌더러 ----------
export class Instancer {
  constructor(scene) {
    this.scene = scene;
    this.types = new Map();
  }
  add(name, geo, max, { shadow = true, mat = matVC } = {}) {
    const mesh = new THREE.InstancedMesh(geo, mat, max);
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(max * 3).fill(1), 3);
    mesh.instanceColor.setUsage(THREE.DynamicDrawUsage);
    mesh.castShadow = shadow;
    mesh.receiveShadow = false;
    mesh.frustumCulled = false;
    mesh.count = 0;
    this.scene.add(mesh);
    this.types.set(name, { mesh, n: 0, max, prev: -1 });
  }
  has(name) {
    return this.types.has(name);
  }
  begin() {
    for (const t of this.types.values()) t.n = 0;
  }
  put(name, x, y, z, ry = 0, s = 1, color = null, rx = 0, rz = 0, sy = s) {
    const t = this.types.get(name);
    if (!t || t.n >= t.max) return;
    _e.set(rx, ry, rz);
    _q.setFromEuler(_e);
    _m.compose(_p.set(x, y, z), _q, _s.set(s, sy, s));
    t.mesh.setMatrixAt(t.n, _m);
    const c = color || WHITE;
    t.mesh.instanceColor.setXYZ(t.n, c.r, c.g, c.b);
    t.n++;
  }
  putMatrix(name, m, color = null) {
    const t = this.types.get(name);
    if (!t || t.n >= t.max) return;
    t.mesh.setMatrixAt(t.n, m);
    const c = color || WHITE;
    t.mesh.instanceColor.setXYZ(t.n, c.r, c.g, c.b);
    t.n++;
  }
  end() {
    for (const t of this.types.values()) {
      t.mesh.count = t.n;
      t.mesh.visible = t.n > 0;
      if (t.n === 0 && t.prev === 0) continue;
      t.prev = t.n;
      if (t.n === 0) continue;
      const im = t.mesh.instanceMatrix;
      const ic = t.mesh.instanceColor;
      im.clearUpdateRanges();
      im.addUpdateRange(0, t.n * 16);
      im.needsUpdate = true;
      ic.clearUpdateRanges();
      ic.addUpdateRange(0, t.n * 3);
      ic.needsUpdate = true;
    }
  }
}
export const WHITE = new THREE.Color(1, 1, 1);

// ---------- 캔버스 텍스처 ----------
export function canvasTex(w, h, draw, repeat = false) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  draw(ctx, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  if (repeat) {
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
  }
  return t;
}

// 결정적 난수 (텍스처용)
export function mulberry(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
