import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// 로우폴리 플랫 셰이딩 지오메트리 빌더 (정점 색상 사용)
const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _e = new THREE.Euler();
const _s = new THREE.Vector3();
const _p = new THREE.Vector3();
const _c = new THREE.Color();

function part(geo, color, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1) {
  const g = geo.index ? geo.toNonIndexed() : geo.clone();
  geo.dispose();
  _e.set(rx, ry, rz);
  _q.setFromEuler(_e);
  _m.compose(_p.set(x, y, z), _q, _s.set(sx, sy, sz));
  g.applyMatrix4(_m);
  _c.set(color);
  const n = g.attributes.position.count;
  const arr = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    arr[i * 3] = _c.r;
    arr[i * 3 + 1] = _c.g;
    arr[i * 3 + 2] = _c.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(arr, 3));
  if (g.attributes.uv) g.deleteAttribute('uv');
  if (g.attributes.normal) g.deleteAttribute('normal');
  return g;
}

function build(parts) {
  const g = mergeGeometries(parts);
  g.computeVertexNormals();
  g.computeBoundingSphere();
  return g;
}

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s = 8) => new THREE.CylinderGeometry(rt, rb, h, s);
const cone = (r, h, s = 6) => new THREE.ConeGeometry(r, h, s);
const ico = (r, d = 0) => new THREE.IcosahedronGeometry(r, d);
const sph = (r, ws = 8, hs = 5, ts = 0, tl = Math.PI) => new THREE.SphereGeometry(r, ws, hs, 0, Math.PI * 2, ts, tl);

// ---------------- 소품 ----------------
export const PROP_TYPES = {
  cone: {
    size: 0.25,
    geo: () =>
      build([part(box(0.5, 0.06, 0.5), '#ff8c42', 0, 0.03), part(cone(0.2, 0.62, 6), '#ff9a52', 0, 0.36), part(cyl(0.12, 0.15, 0.1, 6), '#ffffff', 0, 0.42)]),
  },
  hydrant: {
    size: 0.3,
    geo: () =>
      build([
        part(cyl(0.17, 0.2, 0.6, 7), '#ff5d6c', 0, 0.3),
        part(cyl(0.1, 0.19, 0.16, 7), '#ff7a86', 0, 0.68),
        part(box(0.5, 0.1, 0.1), '#ffd0d4', 0, 0.42),
      ]),
  },
  trash: {
    size: 0.34,
    geo: () =>
      build([part(cyl(0.3, 0.25, 0.78, 8), '#6cc49a', 0, 0.39), part(cyl(0.33, 0.33, 0.08, 8), '#4fa37c', 0, 0.82)]),
  },
  bench: {
    size: 0.8,
    geo: () =>
      build([
        part(box(1.6, 0.1, 0.5), '#e0a46e', 0, 0.45),
        part(box(1.6, 0.36, 0.08), '#d4935c', 0, 0.76, -0.22),
        part(box(0.1, 0.45, 0.45), '#6b6680', -0.7, 0.22),
        part(box(0.1, 0.45, 0.45), '#6b6680', 0.7, 0.22),
      ]),
  },
  lamp: {
    size: 0.34,
    geo: () =>
      build([
        part(cyl(0.2, 0.24, 0.2, 6), '#6b6680', 0, 0.1),
        part(cyl(0.06, 0.08, 3.2, 6), '#7d7894', 0, 1.7),
        part(box(0.7, 0.08, 0.1), '#7d7894', 0.3, 3.25),
        part(box(0.36, 0.14, 0.3), '#fff4b8', 0.6, 3.2),
      ]),
  },
  tree: {
    size: 0.9,
    tint: ['#ffffff', '#e8ffe0', '#f4fff0', '#e0fff4'],
    geo: () =>
      build([
        part(cyl(0.12, 0.17, 1.2, 6), '#a67c5b', 0, 0.6),
        part(ico(0.95, 0), '#7fd18b', 0, 1.9, 0, 0.3, 0.5, 0),
        part(ico(0.6, 0), '#95dea0', 0.35, 2.55, 0.1, 0.6, 0.2, 0),
      ]),
  },
  sakura: {
    size: 0.9,
    geo: () =>
      build([
        part(cyl(0.12, 0.17, 1.2, 6), '#9c7258', 0, 0.6),
        part(ico(0.95, 0), '#ffb7d0', 0, 1.9, 0, 0.3, 0.5, 0),
        part(ico(0.6, 0), '#ffc9dc', -0.3, 2.5, 0.1, 0.6, 0.2, 0),
      ]),
  },
  bush: {
    size: 0.6,
    geo: () => build([part(ico(0.62, 0), '#8fd98a', 0, 0.42, 0, 0, 0, 0, 1, 0.75, 1), part(ico(0.4, 0), '#a4e39a', 0.35, 0.5, 0.2)]),
  },
  car: {
    size: 1.3,
    tint: ['#ff9aa2', '#ffc8a2', '#b5ead7', '#c7ceea', '#a0c4ff', '#fff3a0', '#ffc6ff', '#ffffff'],
    geo: () =>
      build([
        part(box(2.4, 0.6, 1.2), '#ffffff', 0, 0.55),
        part(box(1.3, 0.5, 1.06), '#ffffff', -0.15, 1.08),
        part(box(1.34, 0.36, 1.1), '#3d4466', -0.15, 1.08),
        part(box(0.06, 0.16, 0.9), '#fff6c2', 1.21, 0.6),
        part(cyl(0.28, 0.28, 0.2, 8), '#2e2b3a', 0.75, 0.28, 0.55, Math.PI / 2),
        part(cyl(0.28, 0.28, 0.2, 8), '#2e2b3a', -0.75, 0.28, 0.55, Math.PI / 2),
        part(cyl(0.28, 0.28, 0.2, 8), '#2e2b3a', 0.75, 0.28, -0.55, Math.PI / 2),
        part(cyl(0.28, 0.28, 0.2, 8), '#2e2b3a', -0.75, 0.28, -0.55, Math.PI / 2),
      ]),
  },
  bus: {
    size: 2.7,
    tint: ['#ffd166', '#8ecae6', '#b8e0a8', '#ffadad'],
    geo: () =>
      build([
        part(box(5.4, 1.7, 1.8), '#ffffff', 0, 1.15),
        part(box(4.6, 0.5, 1.84), '#3d4466', -0.2, 1.45),
        part(box(0.06, 0.8, 1.5), '#3d4466', 2.71, 1.45),
        part(box(5.2, 0.12, 1.6), '#eeeeee', 0, 2.05),
        part(cyl(0.38, 0.38, 0.24, 8), '#2e2b3a', 1.7, 0.38, 0.82, Math.PI / 2),
        part(cyl(0.38, 0.38, 0.24, 8), '#2e2b3a', -1.7, 0.38, 0.82, Math.PI / 2),
        part(cyl(0.38, 0.38, 0.24, 8), '#2e2b3a', 1.7, 0.38, -0.82, Math.PI / 2),
        part(cyl(0.38, 0.38, 0.24, 8), '#2e2b3a', -1.7, 0.38, -0.82, Math.PI / 2),
      ]),
  },
  kiosk: {
    size: 1.4,
    tint: ['#ffe5ec', '#e2f0cb', '#dfe7fd', '#fff1c1'],
    geo: () =>
      build([
        part(box(2, 1.6, 1.8), '#ffffff', 0, 0.8),
        part(box(1.4, 0.6, 0.06), '#4a5078', 0, 1.1, 0.91),
        part(box(2.4, 0.14, 2.3), '#ff8fa3', 0, 1.8, 0.15, 0.12),
        part(box(2.4, 0.3, 0.1), '#ffffff', 0, 1.62, 1.28),
      ]),
  },
  fountain: {
    size: 2.2,
    geo: () =>
      build([
        part(cyl(2.2, 2.3, 0.6, 12), '#e8e4f0', 0, 0.3),
        part(cyl(1.9, 1.9, 0.64, 12), '#8fd3ff', 0, 0.3),
        part(cyl(0.3, 0.4, 1.4, 8), '#e8e4f0', 0, 0.7),
        part(cyl(0.9, 0.5, 0.2, 10), '#e8e4f0', 0, 1.45),
        part(ico(0.3, 0), '#bfe8ff', 0, 1.75),
      ]),
  },
  house: {
    size: 2.9,
    tint: ['#ffe5ec', '#e2ece9', '#fff1e6', '#dfe7fd', '#fde2e4', '#f0f4c3'],
    geo: () =>
      build([
        part(box(4, 2.6, 4), '#ffffff', 0, 1.3),
        part(cone(3.25, 1.8, 4), '#ff9e9e', 0, 3.5, 0, 0, Math.PI / 4, 0),
        part(box(0.9, 1.4, 0.06), '#8a6a5a', 0, 0.7, 2.01),
        part(box(0.8, 0.7, 0.06), '#4a5078', -1.2, 1.6, 2.01),
        part(box(0.8, 0.7, 0.06), '#4a5078', 1.2, 1.6, 2.01),
        part(box(0.06, 0.7, 0.8), '#4a5078', 2.01, 1.6, 0),
        part(box(0.06, 0.7, 0.8), '#4a5078', -2.01, 1.6, 0),
        part(box(0.5, 1.0, 0.5), '#b88a7a', 1.1, 3.8, -0.8),
      ]),
  },
  shop: {
    size: 3.8,
    tint: ['#cde7ff', '#ffe0b5', '#e4d4ff', '#d4f5e0', '#ffd6e0'],
    geo: () =>
      build([
        part(box(6, 3.2, 5), '#ffffff', 0, 1.6),
        part(box(6.2, 0.3, 5.2), '#f4f1ff', 0, 3.3),
        part(box(5, 1.3, 0.06), '#4a5078', 0, 1.1, 2.51),
        part(box(6.2, 0.18, 1.2), '#ff7f9f', 0, 2.3, 3.0, 0.25),
        part(box(3, 0.6, 0.1), '#fff7d6', 0, 2.8, 2.56),
        part(box(0.06, 1.0, 3.6), '#4a5078', 3.01, 1.9, 0),
        part(box(0.06, 1.0, 3.6), '#4a5078', -3.01, 1.9, 0),
      ]),
  },
  building: {
    size: 4.8,
    tint: ['#cddafd', '#bee1e6', '#f0efeb', '#fad2e1', '#e2ece9', '#fff1c1'],
    geo: () => {
      const p = [part(box(7, 9, 7), '#ffffff', 0, 4.5), part(box(7.3, 0.4, 7.3), '#eceaf5', 0, 9.2), part(box(2, 1.2, 2), '#d8d4e8', 1.5, 10, -1)];
      for (let f = 0; f < 4; f++) {
        const y = 1.6 + f * 2;
        p.push(part(box(6, 0.8, 0.06), '#4a5078', 0, y, 3.51));
        p.push(part(box(6, 0.8, 0.06), '#4a5078', 0, y, -3.51));
        p.push(part(box(0.06, 0.8, 6), '#4a5078', 3.51, y, 0));
        p.push(part(box(0.06, 0.8, 6), '#4a5078', -3.51, y, 0));
      }
      return build(p);
    },
  },
  tower: {
    size: 6.0,
    tint: ['#c7ceea', '#b5ead7', '#e2d4f5', '#d0e8ff'],
    geo: () => {
      const p = [
        part(box(8, 16, 8), '#ffffff', 0, 8),
        part(box(6, 3, 6), '#f4f2ff', 0, 17.5),
        part(cyl(0.1, 0.15, 4, 5), '#9a95b0', 1, 21),
        part(ico(0.3, 0), '#ff6b8a', 1, 23),
      ];
      for (let f = 0; f < 7; f++) {
        const y = 1.8 + f * 2.1;
        p.push(part(box(7, 1, 0.06), '#48507a', 0, y, 4.01));
        p.push(part(box(7, 1, 0.06), '#48507a', 0, y, -4.01));
        p.push(part(box(0.06, 1, 7), '#48507a', 4.01, y, 0));
        p.push(part(box(0.06, 1, 7), '#48507a', -4.01, y, 0));
      }
      return build(p);
    },
  },
};

// ---------------- 해변 ----------------
Object.assign(PROP_TYPES, {
  ball: {
    size: 0.3,
    geo: () => build([part(ico(0.3, 1), '#ffffff', 0, 0.3), part(box(0.62, 0.62, 0.1), '#ff6b8a', 0, 0.3), part(box(0.1, 0.62, 0.62), '#4db8ff', 0, 0.3)]),
  },
  buoy: {
    size: 0.3,
    geo: () => build([part(cyl(0.3, 0.3, 0.3, 8), '#ff6b6b', 0, 0.15), part(cyl(0.31, 0.31, 0.1, 8), '#ffffff', 0, 0.2), part(cone(0.12, 0.4, 5), '#ffd84d', 0, 0.5)]),
  },
  surf: {
    size: 0.55,
    tint: ['#ff9aa2', '#a0e7ff', '#fff3a0', '#c7ceea'],
    geo: () => build([part(box(0.5, 0.08, 1.8), '#ffffff', 0, 0.05), part(box(0.1, 0.09, 1.6), '#ff7aa8', 0, 0.06)]),
  },
  chair: {
    size: 0.7,
    tint: ['#ffffff', '#b5ead7', '#ffdac1', '#c7ceea'],
    geo: () =>
      build([
        part(box(0.7, 0.08, 1.1), '#ffffff', 0, 0.3, 0.1),
        part(box(0.7, 0.08, 0.7), '#ffffff', 0, 0.55, -0.6, -0.6),
        part(box(0.06, 0.3, 0.06), '#d9c0a0', 0.3, 0.15, 0.5),
        part(box(0.06, 0.3, 0.06), '#d9c0a0', -0.3, 0.15, 0.5),
        part(box(0.06, 0.3, 0.06), '#d9c0a0', 0.3, 0.15, -0.3),
        part(box(0.06, 0.3, 0.06), '#d9c0a0', -0.3, 0.15, -0.3),
      ]),
  },
  umbrella: {
    size: 0.85,
    tint: ['#ffffff', '#ffe0f0', '#e0f4ff', '#fff6d0'],
    geo: () =>
      build([
        part(cyl(0.05, 0.05, 2.2, 5), '#f4efe6', 0, 1.1),
        part(cone(1.3, 0.55, 8), '#ff8fab', 0, 2.3),
        part(cone(1.32, 0.5, 8), '#ffffff', 0, 2.26, 0, 0, Math.PI / 8, 0, 1, 1, 1),
      ]),
  },
  castle: {
    size: 0.8,
    geo: () =>
      build([
        part(box(1.3, 0.5, 1.3), '#f2d49b', 0, 0.25),
        part(cyl(0.25, 0.3, 0.9, 6), '#f5d9a5', 0.5, 0.45, 0.5),
        part(cyl(0.25, 0.3, 0.9, 6), '#f5d9a5', -0.5, 0.45, 0.5),
        part(cyl(0.25, 0.3, 0.9, 6), '#f5d9a5', 0.5, 0.45, -0.5),
        part(cyl(0.25, 0.3, 0.9, 6), '#f5d9a5', -0.5, 0.45, -0.5),
        part(cone(0.35, 0.7, 6), '#eccb8a', 0, 0.85),
        part(box(0.04, 0.3, 0.2), '#ff6b8a', 0, 1.35, 0.1),
      ]),
  },
  rock: {
    size: 1.0,
    geo: () => build([part(ico(0.9, 0), '#b8b0c8', 0, 0.45, 0, 0.4, 0.3, 0, 1.1, 0.7, 1), part(ico(0.5, 0), '#c9c2d6', 0.6, 0.3, 0.3)]),
  },
  palm: {
    size: 0.9,
    geo: () => {
      const p = [
        part(cyl(0.12, 0.16, 1.4, 6), '#c49a6c', 0, 0.7, 0, 0, 0, 0.08),
        part(cyl(0.1, 0.12, 1.4, 6), '#b88d5f', 0.12, 2.05, 0, 0, 0, 0.16),
        part(ico(0.25, 0), '#8a6b4a', 0.25, 2.8, 0),
      ];
      for (let k = 0; k < 6; k++) {
        const a = (k / 6) * Math.PI * 2;
        p.push(part(box(1.4, 0.06, 0.45), k % 2 ? '#6fcf7f' : '#86dc8f', 0.25 + Math.cos(a) * 0.7, 2.75, Math.sin(a) * 0.7, 0, -a, -0.35));
      }
      return build(p);
    },
  },
  cart: {
    size: 1.0,
    tint: ['#ffe5ec', '#e0f4ff', '#fff6d0'],
    geo: () =>
      build([
        part(box(1.6, 0.9, 0.9), '#ffffff', 0, 0.75),
        part(cyl(0.3, 0.3, 0.1, 8), '#4a4760', 0.5, 0.3, 0.46, Math.PI / 2),
        part(cyl(0.3, 0.3, 0.1, 8), '#4a4760', -0.5, 0.3, 0.46, Math.PI / 2),
        part(cyl(0.04, 0.04, 1.2, 4), '#dddddd', 0, 1.8),
        part(cone(0.9, 0.4, 8), '#7ad0ff', 0, 2.4),
        part(ico(0.25, 0), '#ffb7d0', 0.4, 1.35, 0),
      ]),
  },
  lifeguard: {
    size: 1.5,
    geo: () =>
      build([
        part(box(0.12, 2.2, 0.12), '#f4efe6', 0.7, 1.1, 0.7),
        part(box(0.12, 2.2, 0.12), '#f4efe6', -0.7, 1.1, 0.7),
        part(box(0.12, 2.2, 0.12), '#f4efe6', 0.7, 1.1, -0.7),
        part(box(0.12, 2.2, 0.12), '#f4efe6', -0.7, 1.1, -0.7),
        part(box(1.7, 1.0, 1.7), '#ff6b6b', 0, 2.7),
        part(box(1.9, 0.12, 1.9), '#ffffff', 0, 3.25),
        part(box(1.1, 0.4, 0.06), '#3d4466', 0, 2.8, 0.86),
      ]),
  },
  boat: {
    size: 2.2,
    tint: ['#ffffff', '#ffe0e8', '#e0f0ff'],
    geo: () =>
      build([
        part(box(4, 0.8, 1.6), '#ffffff', 0, 0.4),
        part(cone(0.8, 1.2, 4), '#ffffff', 2.4, 0.4, 0, 0, Math.PI / 4, -Math.PI / 2, 1, 1, 1.4),
        part(box(4.1, 0.14, 1.64), '#4db8ff', 0, 0.2),
        part(box(1.4, 0.8, 1.2), '#f4f1ff', -0.6, 1.2),
        part(box(1.42, 0.3, 1.22), '#3d4466', -0.6, 1.3),
      ]),
  },
  hut: {
    size: 2.6,
    tint: ['#fff1e6', '#e2f7ff', '#ffeef5', '#f0ffe6'],
    geo: () =>
      build([
        part(box(3.4, 2.2, 3.2), '#ffffff', 0, 1.1),
        part(box(3.42, 0.35, 3.22), '#7ad0ff', 0, 0.5),
        part(box(3.42, 0.35, 3.22), '#7ad0ff', 0, 1.5),
        part(cone(2.8, 1.5, 4), '#f2c48d', 0, 2.95, 0, 0, Math.PI / 4, 0),
        part(box(0.9, 1.3, 0.06), '#8a6a5a', 0, 0.65, 1.61),
      ]),
  },
  hotel: {
    size: 5.2,
    tint: ['#ffe5ec', '#e0f4ff', '#fff6d0', '#e8ffe8'],
    geo: () => {
      const p = [part(box(9, 7, 6), '#ffffff', 0, 3.5), part(box(9.4, 0.4, 6.4), '#f4f1ff', 0, 7.2), part(box(3, 1.5, 2), '#ff9fb3', 2.5, 8, 0)];
      for (let f = 0; f < 3; f++) {
        const y = 1.6 + f * 2;
        p.push(part(box(8.2, 0.9, 0.06), '#48507a', 0, y, 3.01));
        p.push(part(box(8.6, 0.12, 0.8), '#ffffff', 0, y - 0.6, 3.4));
        p.push(part(box(8.2, 0.9, 0.06), '#48507a', 0, y, -3.01));
      }
      return build(p);
    },
  },
});

// ---------------- 공장 ----------------
Object.assign(PROP_TYPES, {
  crate: {
    size: 0.45,
    geo: () => build([part(box(0.8, 0.8, 0.8), '#e0b07a', 0, 0.4), part(box(0.82, 0.1, 0.82), '#c48f58', 0, 0.4), part(box(0.1, 0.82, 0.82), '#c48f58', 0, 0.4)]),
  },
  barrel: {
    size: 0.35,
    tint: ['#ff9f43', '#4db8ff', '#7fd18b', '#ff6b8a'],
    geo: () => build([part(cyl(0.32, 0.32, 0.9, 8), '#ffffff', 0, 0.45), part(cyl(0.34, 0.34, 0.08, 8), '#dddddd', 0, 0.3), part(cyl(0.34, 0.34, 0.08, 8), '#dddddd', 0, 0.65)]),
  },
  pallet: {
    size: 0.85,
    geo: () =>
      build([
        part(box(1.5, 0.14, 1.2), '#d4a574', 0, 0.07),
        part(box(1.3, 0.6, 1.0), '#9fd8ff', 0, 0.44),
        part(box(1.32, 0.08, 1.02), '#ffffff', 0, 0.5),
      ]),
  },
  forklift: {
    size: 1.2,
    geo: () =>
      build([
        part(box(1.5, 0.7, 1.1), '#ffc43d', 0, 0.6),
        part(box(0.9, 1.0, 1.0), '#ffd66b', -0.2, 1.4),
        part(box(0.8, 0.6, 0.06), '#3d4466', -0.2, 1.5, 0.51),
        part(box(0.1, 2, 0.1), '#555566', 0.85, 1.0, 0.3),
        part(box(0.1, 2, 0.1), '#555566', 0.85, 1.0, -0.3),
        part(box(0.8, 0.06, 0.12), '#555566', 1.25, 0.2, 0.3),
        part(box(0.8, 0.06, 0.12), '#555566', 1.25, 0.2, -0.3),
        part(cyl(0.25, 0.25, 0.15, 8), '#2e2b3a', 0.45, 0.25, 0.56, Math.PI / 2),
        part(cyl(0.25, 0.25, 0.15, 8), '#2e2b3a', -0.45, 0.25, 0.56, Math.PI / 2),
        part(cyl(0.25, 0.25, 0.15, 8), '#2e2b3a', 0.45, 0.25, -0.56, Math.PI / 2),
        part(cyl(0.25, 0.25, 0.15, 8), '#2e2b3a', -0.45, 0.25, -0.56, Math.PI / 2),
      ]),
  },
  pipe: {
    size: 1.4,
    geo: () => build([part(cyl(0.45, 0.45, 2.8, 10), '#b9c2d6', 0, 0.45, 0, 0, 0, Math.PI / 2), part(cyl(0.52, 0.52, 0.2, 10), '#8f98ad', 1.3, 0.45, 0, 0, 0, Math.PI / 2), part(cyl(0.52, 0.52, 0.2, 10), '#8f98ad', -1.3, 0.45, 0, 0, 0, Math.PI / 2)]),
  },
  truck: {
    size: 2.8,
    tint: ['#ffffff', '#ffe0b5', '#d0e8ff', '#e8d4ff'],
    geo: () =>
      build([
        part(box(3.8, 2.0, 1.9), '#ffffff', -0.8, 1.4),
        part(box(1.5, 1.4, 1.8), '#ff8f5a', 1.9, 1.1),
        part(box(0.06, 0.6, 1.5), '#3d4466', 2.66, 1.4),
        part(cyl(0.4, 0.4, 0.25, 8), '#2e2b3a', 1.9, 0.4, 0.85, Math.PI / 2),
        part(cyl(0.4, 0.4, 0.25, 8), '#2e2b3a', 1.9, 0.4, -0.85, Math.PI / 2),
        part(cyl(0.4, 0.4, 0.25, 8), '#2e2b3a', -1.6, 0.4, 0.85, Math.PI / 2),
        part(cyl(0.4, 0.4, 0.25, 8), '#2e2b3a', -1.6, 0.4, -0.85, Math.PI / 2),
      ]),
  },
  container: {
    size: 3.0,
    tint: ['#ff8f8f', '#7fc8ff', '#8fe0a0', '#ffc46b', '#c8a0ff'],
    geo: () => {
      const p = [part(box(6, 2.5, 2.4), '#ffffff', 0, 1.25)];
      for (let k = -5; k <= 5; k++) p.push(part(box(0.12, 2.3, 2.46), '#e8e8e8', k * 0.52, 1.25));
      return build(p);
    },
  },
  silo: {
    size: 2.6,
    tint: ['#ffffff', '#e8f4ff', '#fff4e0'],
    geo: () =>
      build([
        part(cyl(2.2, 2.2, 6, 12), '#ffffff', 0, 3),
        part(sph(2.2, 12, 4, 0, Math.PI / 2), '#e8e6f5', 0, 6),
        part(cyl(2.25, 2.25, 0.2, 12), '#ff8f5a', 0, 2),
        part(cyl(2.25, 2.25, 0.2, 12), '#ff8f5a', 0, 4),
        part(box(0.15, 6.5, 0.4), '#8f98ad', 2.25, 3.2),
      ]),
  },
  warehouse: {
    size: 4.6,
    tint: ['#e8e6f5', '#fff0e0', '#e0f0ff', '#f0ffe8'],
    geo: () =>
      build([
        part(box(8, 3.6, 6), '#ffffff', 0, 1.8),
        part(cyl(3.1, 3.1, 8.1, 10, 1, false), '#c8c4e0', 0, 3.6, 0, 0, 0, Math.PI / 2, 1, 1, 0.97),
        part(box(3, 2.6, 0.06), '#8f98ad', 0, 1.3, 3.01),
        part(box(1.4, 0.6, 0.06), '#48507a', 2.8, 2.6, 3.01),
        part(box(1.4, 0.6, 0.06), '#48507a', -2.8, 2.6, 3.01),
      ]),
  },
  plant: {
    size: 5.4,
    tint: ['#ffe0d0', '#e0e8ff', '#f4f0ff'],
    geo: () =>
      build([
        part(box(8, 5, 7), '#ffffff', 0, 2.5),
        part(box(8.2, 0.4, 7.2), '#e0dcef', 0, 5.2),
        part(cyl(0.8, 1.0, 9, 10), '#d8d0c8', 2.5, 7.5, -1.5),
        part(cyl(0.85, 0.85, 0.5, 10), '#ff6b6b', 2.5, 11.5, -1.5),
        part(cyl(0.6, 0.7, 6, 10), '#d8d0c8', -2, 6.5, 1.5),
        part(cyl(0.65, 0.65, 0.4, 10), '#ff6b6b', -2, 9.3, 1.5),
        part(box(6, 1, 0.06), '#48507a', 0, 3.5, 3.51),
        part(box(2.4, 2.4, 0.06), '#8f98ad', -2, 1.2, 3.51),
      ]),
  },
});

// ---------------- 적 (바닥 반지름 1 기준, +z 가 정면) ----------------
export const ENEMY_MODELS = {
  sweeper: () =>
    build([
      part(cyl(0.95, 1.0, 0.55, 12), '#f4f6ff', 0, 0.38),
      part(sph(0.62, 10, 4, 0, Math.PI / 2), '#5fd4c8', 0, 0.65),
      part(box(0.9, 0.2, 0.3), '#2b3050', 0, 0.8, 0.45),
      part(box(0.7, 0.08, 0.32), '#7ff8ff', 0, 0.8, 0.47),
      part(cyl(0.35, 0.35, 0.08, 6), '#ffd84d', 0.55, 0.06, 0.55),
      part(cyl(0.35, 0.35, 0.08, 6), '#ffd84d', -0.55, 0.06, 0.55),
      part(cyl(0.04, 0.04, 0.5, 4), '#8c8aa6', 0.3, 1.2, -0.2),
      part(ico(0.1, 0), '#ff5d6c', 0.3, 1.48, -0.2),
    ]),
  dasher: () =>
    build([
      part(box(1.4, 0.7, 1.5), '#ff9f43', 0, 0.55),
      part(box(1.2, 0.35, 0.9), '#ffb86b', 0, 1.05, -0.2),
      part(box(1.6, 0.35, 0.3), '#5b5870', 0, 0.45, 0.85),
      part(cone(0.18, 0.5, 4), '#e8e6f5', 0.45, 0.45, 1.15, Math.PI / 2),
      part(cone(0.18, 0.5, 4), '#e8e6f5', -0.45, 0.45, 1.15, Math.PI / 2),
      part(box(0.9, 0.16, 0.08), '#ff3b5c', 0, 1.05, 0.26),
      part(cyl(0.3, 0.3, 0.25, 8), '#34324a', 0.7, 0.3, 0.4, 0, 0, Math.PI / 2),
      part(cyl(0.3, 0.3, 0.25, 8), '#34324a', -0.7, 0.3, 0.4, 0, 0, Math.PI / 2),
      part(cyl(0.3, 0.3, 0.25, 8), '#34324a', 0.7, 0.3, -0.5, 0, 0, Math.PI / 2),
      part(cyl(0.3, 0.3, 0.25, 8), '#34324a', -0.7, 0.3, -0.5, 0, 0, Math.PI / 2),
    ]),
  thrower: () =>
    build([
      part(box(1.3, 1.0, 1.3), '#ffd93d', 0, 0.75),
      part(box(1.0, 0.5, 0.8), '#fff0a0', 0, 1.5, 0.1),
      part(box(0.7, 0.14, 0.06), '#2b3050', 0, 1.55, 0.52),
      part(box(0.5, 0.06, 0.07), '#7ff8ff', 0, 1.55, 0.54),
      part(cyl(0.38, 0.32, 0.6, 8), '#6cc49a', 0.2, 2.1, -0.35),
      part(box(0.14, 0.9, 0.14), '#8c8aa6', 0.7, 1.4, -0.2, 0.4),
      part(cyl(0.28, 0.28, 1.5, 8), '#34324a', 0, 0.28, 0.35, 0, 0, Math.PI / 2),
      part(cyl(0.28, 0.28, 1.5, 8), '#34324a', 0, 0.28, -0.35, 0, 0, Math.PI / 2),
    ]),
  giant: () =>
    build([
      part(box(1.6, 1.6, 1.3), '#e8e6f5', 0, 1.9),
      part(box(1.2, 0.8, 1.0), '#ff6b6b', 0, 3.0, 0.05),
      part(box(1.0, 0.24, 0.06), '#2b3050', 0, 3.05, 0.56),
      part(box(0.8, 0.1, 0.07), '#ff3b5c', 0, 3.05, 0.58),
      part(box(0.5, 1.4, 0.5), '#b9b6cc', 1.1, 1.8, 0.1, 0.3),
      part(box(0.5, 1.4, 0.5), '#b9b6cc', -1.1, 1.8, 0.1, 0.3),
      part(cyl(0.35, 0.2, 0.5, 6), '#5fd4c8', 1.1, 0.95, 0.45),
      part(cyl(0.35, 0.2, 0.5, 6), '#5fd4c8', -1.1, 0.95, 0.45),
      part(box(0.55, 1.1, 0.7), '#8c8aa6', 0.5, 0.55, 0),
      part(box(0.55, 1.1, 0.7), '#8c8aa6', -0.5, 0.55, 0),
      part(box(1.0, 0.3, 0.3), '#ffd84d', 0, 2.5, 0.66),
    ]),
  mini: () =>
    build([
      part(box(1.4, 0.9, 1.9), '#f4f6ff', 0, 0.8),
      part(box(1.3, 0.8, 0.7), '#5fd4c8', 0, 1.5, 0.55),
      part(box(1.1, 0.35, 0.06), '#2b3050', 0, 1.6, 0.91),
      part(box(1.3, 0.9, 1.1), '#ffd84d', 0, 1.6, -0.4),
      part(cyl(0.35, 0.35, 1.9, 10), '#ff8fa3', 0, 0.35, 1.05, 0, 0, Math.PI / 2),
      part(box(0.4, 0.2, 0.2), '#ff3b5c', 0.4, 2.05, 0.5),
      part(box(0.4, 0.2, 0.2), '#4d9bff', -0.4, 2.05, 0.5),
      part(cyl(0.3, 0.3, 1.6, 8), '#34324a', 0, 0.3, -0.6, 0, 0, Math.PI / 2),
    ]),
  boss: () =>
    build([
      // 다리
      part(box(0.45, 1.0, 0.6), '#7d7894', 0.45, 0.5, 0),
      part(box(0.45, 1.0, 0.6), '#7d7894', -0.45, 0.5, 0),
      part(box(0.6, 0.2, 0.9), '#4a4760', 0.45, 0.1, 0.1),
      part(box(0.6, 0.2, 0.9), '#4a4760', -0.45, 0.1, 0.1),
      // 몸통
      part(box(1.5, 1.1, 1.1), '#eeeaf8', 0, 1.55),
      part(box(1.2, 0.5, 0.06), '#ff3b5c', 0, 1.6, 0.56),
      part(box(1.7, 0.3, 1.2), '#ffd84d', 0, 2.2),
      // 머리
      part(box(0.9, 0.55, 0.8), '#5fd4c8', 0, 2.62, 0.05),
      part(box(0.7, 0.18, 0.06), '#1d1f33', 0, 2.65, 0.46),
      part(box(0.5, 0.08, 0.07), '#ff2f4f', 0, 2.65, 0.48),
      part(cyl(0.03, 0.03, 0.6, 4), '#9a95b0', 0.3, 3.1, -0.1),
      part(ico(0.08, 0), '#ff2f4f', 0.3, 3.42, -0.1),
      // 팔 + 흡입 노즐
      part(box(0.4, 0.4, 1.0), '#b9b6cc', 1.0, 1.9, 0.2),
      part(box(0.4, 0.4, 1.0), '#b9b6cc', -1.0, 1.9, 0.2),
      part(cyl(0.35, 0.18, 0.7, 8), '#ff8fa3', 1.0, 1.9, 0.9, Math.PI / 2),
      part(cyl(0.35, 0.18, 0.7, 8), '#ff8fa3', -1.0, 1.9, 0.9, Math.PI / 2),
      // 등 탱크
      part(cyl(0.3, 0.3, 1.1, 8), '#6cc49a', 0.35, 1.9, -0.7),
      part(cyl(0.3, 0.3, 1.1, 8), '#6cc49a', -0.35, 1.9, -0.7),
    ]),
};

// 기타 작은 모델
export const MISC = {
  shard: () => build([part(ico(0.5, 0), '#b7a6ff')]),
  trashBag: () => build([part(ico(0.45, 0), '#5a6b5e'), part(cone(0.18, 0.3, 4), '#4a5a4e', 0, 0.45)]),
  bullet: () => build([part(ico(0.4, 0), '#ffffff')]),
};
