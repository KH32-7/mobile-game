// 스테이지 환경 구성: 바닥, 벽, 부두, 소품, 발판 텍스처
import { THREE, Build, GEO, matVC, matGlow, canvasTex, mulberry, gfx } from './gfx.js';
import { THEMES, SKINS, MENUS, INGS } from './config.js';
import { drawMenu, drawIng, rr } from './icons.js';
import { stationModel, crateModel, rackModel, sinkModel, trashModel, stoolModel, deskModel, leverModel, lanternGlow } from './models.js';

export function themeFor(stage, skinId) {
  const base = THEMES[stage.theme];
  const skin = SKINS.find((s) => s.id === skinId) || SKINS[0];
  return { ...base, ...skin.over };
}

// ---------- 바닥 텍스처 ----------
function floorTex(kind, color) {
  const rnd = mulberry(kind.length * 991);
  return canvasTex(
    256,
    256,
    (ctx, w, h) => {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, w, h);
      if (kind === 'planks') {
        for (let row = 0; row < 8; row++) {
          const y = row * 32;
          let x = -((row * 57) % 128);
          while (x < w) {
            const len = 90 + rnd() * 80;
            const shade = 0.88 + rnd() * 0.2;
            ctx.fillStyle = `rgba(${shade > 1 ? 255 : 0},${shade > 1 ? 240 : 0},${shade > 1 ? 220 : 0},${Math.abs(1 - shade) * 0.9})`;
            ctx.fillRect(x, y, len, 32);
            ctx.strokeStyle = 'rgba(70,40,20,0.35)';
            ctx.lineWidth = 2;
            ctx.strokeRect(x + 1, y + 1, len - 2, 30);
            ctx.strokeStyle = 'rgba(90,50,20,0.12)';
            ctx.lineWidth = 1;
            for (let k = 0; k < 3; k++) {
              ctx.beginPath();
              const yy = y + 6 + rnd() * 20;
              ctx.moveTo(x + 4, yy);
              ctx.bezierCurveTo(x + len * 0.3, yy + 3, x + len * 0.6, yy - 3, x + len - 4, yy);
              ctx.stroke();
            }
            x += len;
          }
        }
      } else if (kind === 'tiles') {
        for (let i = 0; i < 4; i++)
          for (let j = 0; j < 4; j++) {
            ctx.fillStyle = (i + j) % 2 ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.12)';
            ctx.fillRect(i * 64, j * 64, 64, 64);
            ctx.strokeStyle = 'rgba(80,90,100,0.25)';
            ctx.lineWidth = 2;
            ctx.strokeRect(i * 64, j * 64, 64, 64);
          }
      } else if (kind === 'tatami') {
        for (let i = 0; i < 2; i++)
          for (let j = 0; j < 4; j++) {
            const x = i * 128 + (j % 2) * 64;
            ctx.fillStyle = 'rgba(0,0,0,0.04)';
            ctx.fillRect(x, j * 64, 128, 64);
            ctx.strokeStyle = 'rgba(60,70,20,0.18)';
            ctx.lineWidth = 1;
            for (let k = 0; k < 64; k += 4) {
              ctx.beginPath();
              ctx.moveTo(x, j * 64 + k);
              ctx.lineTo(x + 128, j * 64 + k);
              ctx.stroke();
            }
            ctx.strokeStyle = '#3a4a2a';
            ctx.lineWidth = 5;
            ctx.strokeRect(x + 2, j * 64 + 2, 124, 60);
          }
      } else if (kind === 'metal') {
        for (let i = 0; i < 4; i++)
          for (let j = 0; j < 4; j++) {
            ctx.fillStyle = (i + j) % 2 ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)';
            ctx.fillRect(i * 64 + 2, j * 64 + 2, 60, 60);
            ctx.strokeStyle = 'rgba(40,50,70,0.4)';
            ctx.lineWidth = 3;
            ctx.strokeRect(i * 64 + 2, j * 64 + 2, 60, 60);
            ctx.fillStyle = 'rgba(40,50,70,0.4)';
            for (const [a, b] of [[8, 8], [56, 8], [8, 56], [56, 56]]) {
              ctx.beginPath();
              ctx.arc(i * 64 + a, j * 64 + b, 2.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }
      } else if (kind === 'asphalt' || kind === 'sand' || kind === 'gravel') {
        const n = kind === 'gravel' ? 900 : 1600;
        for (let i = 0; i < n; i++) {
          const l = rnd();
          ctx.fillStyle = l > 0.5 ? `rgba(255,255,255,${0.04 + rnd() * 0.08})` : `rgba(0,0,0,${0.04 + rnd() * 0.08})`;
          const s = kind === 'gravel' ? 2 + rnd() * 5 : 1 + rnd() * 2.5;
          ctx.beginPath();
          ctx.arc(rnd() * w, rnd() * h, s, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (kind === 'void') {
        // 우주: 거의 검정
        for (let i = 0; i < 60; i++) {
          ctx.fillStyle = `rgba(255,255,255,${rnd() * 0.5})`;
          ctx.fillRect(rnd() * w, rnd() * h, 1.5, 1.5);
        }
      }
    },
    true
  );
}

// ---------- 발판 텍스처 ----------
const padTexCache = new Map();
export function actionPadTex(type, id) {
  const key = type + ':' + id;
  if (padTexCache.has(key)) return padTexCache.get(key);
  const t = canvasTex(128, 128, (ctx, w) => {
    ctx.clearRect(0, 0, w, w);
    const colr = { crate: '#ffffff', in: '#7fd4ff', out: '#ffd36b', feed: '#ffffff', trash: '#ff9a8a', sink: '#8fe8ff', upgrade: '#ffe14d' }[type] || '#fff';
    ctx.fillStyle = 'rgba(255,255,255,0.16)';
    rr(ctx, 6, 6, w - 12, w - 12, 22);
    ctx.fill();
    ctx.setLineDash([16, 9]);
    ctx.lineWidth = 7;
    ctx.strokeStyle = colr;
    rr(ctx, 7, 7, w - 14, w - 14, 22);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.save();
    ctx.translate(w * 0.2, w * 0.2);
    const s = w * 0.6;
    if (type === 'crate' || type === 'in') drawIng(ctx, id, s);
    else if (type === 'out') drawMenu(ctx, id, s);
    else if (type === 'feed') {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(s * 0.5, s * 0.05);
      ctx.lineTo(s * 0.9, s * 0.45);
      ctx.lineTo(s * 0.64, s * 0.45);
      ctx.lineTo(s * 0.64, s * 0.9);
      ctx.lineTo(s * 0.36, s * 0.9);
      ctx.lineTo(s * 0.36, s * 0.45);
      ctx.lineTo(s * 0.1, s * 0.45);
      ctx.closePath();
      ctx.fill();
    } else if (type === 'trash') {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(s * 0.25, s * 0.3, s * 0.5, s * 0.6);
      ctx.fillRect(s * 0.15, s * 0.18, s * 0.7, s * 0.1);
      ctx.fillRect(s * 0.4, s * 0.08, s * 0.2, s * 0.1);
    } else if (type === 'sink') {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(s * 0.5, s * 0.55, s * 0.42, s * 0.24, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#5ab4e6';
      ctx.beginPath();
      ctx.ellipse(s * 0.5, s * 0.52, s * 0.22, s * 0.11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#8fe8ff';
      for (const [x, y, r] of [[0.2, 0.2, 0.08], [0.36, 0.1, 0.06], [0.75, 0.18, 0.1]]) {
        ctx.beginPath();
        ctx.arc(s * x, s * y, s * r, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (type === 'upgrade') {
      ctx.fillStyle = '#ffe14d';
      ctx.beginPath();
      ctx.moveTo(s * 0.5, s * 0.02);
      ctx.lineTo(s * 0.95, s * 0.5);
      ctx.lineTo(s * 0.68, s * 0.5);
      ctx.lineTo(s * 0.68, s * 0.95);
      ctx.lineTo(s * 0.32, s * 0.95);
      ctx.lineTo(s * 0.32, s * 0.5);
      ctx.lineTo(s * 0.05, s * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#8a5a00';
      ctx.stroke();
    }
    ctx.restore();
  });
  padTexCache.set(key, t);
  return t;
}

const padGeo = new THREE.PlaneGeometry(1, 1);
padGeo.rotateX(-Math.PI / 2);
export function makeActionPad(type, id, x, z, size = 0.95) {
  const mat = new THREE.MeshBasicMaterial({ map: actionPadTex(type, id), transparent: true, depthWrite: false });
  const m = new THREE.Mesh(padGeo, mat);
  m.position.set(x, 0.025, z);
  m.scale.set(size, 1, size);
  m.renderOrder = 1;
  return m;
}

// 해금 발판: 캔버스 동적 텍스처
export class UnlockPad {
  constructor(label, icon, cost, x, z, kind = 'unlock') {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 256;
    this.canvas.height = 256;
    this.ctx = this.canvas.getContext('2d');
    this.tex = new THREE.CanvasTexture(this.canvas);
    this.tex.colorSpace = THREE.SRGBColorSpace;
    this.tex.anisotropy = 4;
    const mat = new THREE.MeshBasicMaterial({ map: this.tex, transparent: true, depthWrite: false });
    this.mesh = new THREE.Mesh(padGeo, mat);
    this.mesh.position.set(x, 0.03, z);
    this.mesh.renderOrder = 2;
    this.size = kind === 'next' ? 2.0 : 1.7;
    this.mesh.scale.set(this.size, 1, this.size);
    this.label = label;
    this.icon = icon;
    this.cost = cost;
    this.kind = kind;
    this.lastP = -1;
    this.lastAfford = null;
    this.draw(0, true);
  }
  draw(p, afford) {
    const q = Math.round(p * 60) / 60;
    if (q === this.lastP && afford === this.lastAfford) return;
    this.lastP = q;
    this.lastAfford = afford;
    const ctx = this.ctx;
    const w = 256;
    ctx.clearRect(0, 0, w, w);
    const base = this.kind === 'next' ? '#ff9a3c' : '#35c46a';
    const dark = this.kind === 'next' ? '#a3500a' : '#167a3a';
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    rr(ctx, 10, 16, w - 20, w - 20, 34);
    ctx.fill();
    ctx.fillStyle = afford ? base : '#7f9a88';
    if (this.kind === 'next' && !afford) ctx.fillStyle = '#b89070';
    rr(ctx, 10, 8, w - 20, w - 20, 34);
    ctx.fill();
    // 진행도 채우기 (아래에서 위로)
    if (q > 0) {
      ctx.save();
      rr(ctx, 10, 8, w - 20, w - 20, 34);
      ctx.clip();
      ctx.fillStyle = this.kind === 'next' ? '#ffd23f' : '#9ff06a';
      const hh = (w - 20) * q;
      ctx.fillRect(10, 8 + (w - 20) - hh, w - 20, hh);
      ctx.restore();
    }
    ctx.lineWidth = 8;
    ctx.strokeStyle = '#ffffff';
    rr(ctx, 14, 12, w - 28, w - 28, 30);
    ctx.stroke();
    // 아이콘
    ctx.save();
    ctx.translate(w * 0.29, 16);
    const s = w * 0.42;
    if (this.icon.menu) drawMenu(ctx, this.icon.menu, s);
    else drawGlyph(ctx, this.icon.glyph, s);
    ctx.restore();
    // 라벨
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = dark;
    ctx.lineJoin = 'round';
    ctx.lineWidth = 9;
    ctx.textAlign = 'center';
    ctx.font = 'bold 38px system-ui, -apple-system, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';
    ctx.strokeText(this.label, w / 2, 164);
    ctx.fillText(this.label, w / 2, 164);
    // 비용
    const remain = Math.ceil(this.cost * (1 - q));
    ctx.font = 'bold 56px system-ui, -apple-system, sans-serif';
    const txt = fmt(remain);
    const tw = ctx.measureText(txt).width;
    const cx = w / 2 + 20;
    ctx.lineWidth = 10;
    ctx.strokeText(txt, cx, 226);
    ctx.fillText(txt, cx, 226);
    // 동전
    const x0 = cx - tw / 2 - 30;
    ctx.fillStyle = '#ffc83d';
    ctx.beginPath();
    ctx.arc(x0, 207, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#b9770e';
    ctx.stroke();
    this.tex.needsUpdate = true;
  }
}

function drawGlyph(ctx, g, s) {
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  const W = '#ffffff';
  ctx.fillStyle = W;
  ctx.strokeStyle = W;
  ctx.lineWidth = s * 0.08;
  switch (g) {
    case 'seat':
      ctx.beginPath();
      ctx.ellipse(s * 0.5, s * 0.35, s * 0.3, s * 0.12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(s * 0.44, s * 0.35, s * 0.12, s * 0.45);
      ctx.fillRect(s * 0.25, s * 0.8, s * 0.5, s * 0.08);
      break;
    case 'sink':
      ctx.beginPath();
      ctx.ellipse(s * 0.5, s * 0.6, s * 0.4, s * 0.22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(s * 0.3, s * 0.2);
      ctx.lineTo(s * 0.5, s * 0.1);
      ctx.lineTo(s * 0.5, s * 0.4);
      ctx.stroke();
      ctx.fillStyle = '#5ab4e6';
      ctx.beginPath();
      ctx.ellipse(s * 0.5, s * 0.58, s * 0.22, s * 0.1, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'staff':
    case 'hauler':
      ctx.beginPath();
      ctx.arc(s * 0.5, s * 0.3, s * 0.18, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(s * 0.15, s * 0.95);
      ctx.quadraticCurveTo(s * 0.5, s * 0.35, s * 0.85, s * 0.95);
      ctx.fill();
      ctx.fillStyle = g === 'hauler' ? '#2f9e5a' : '#2f6fd8';
      ctx.fillRect(s * 0.3, s * 0.1, s * 0.4, s * 0.1);
      break;
    case 'upgrade':
      ctx.beginPath();
      ctx.moveTo(s * 0.5, s * 0.05);
      ctx.lineTo(s * 0.92, s * 0.5);
      ctx.lineTo(s * 0.66, s * 0.5);
      ctx.lineTo(s * 0.66, s * 0.95);
      ctx.lineTo(s * 0.34, s * 0.95);
      ctx.lineTo(s * 0.34, s * 0.5);
      ctx.lineTo(s * 0.08, s * 0.5);
      ctx.closePath();
      ctx.fill();
      break;
    case 'belt':
      ctx.beginPath();
      ctx.ellipse(s * 0.5, s * 0.5, s * 0.42, s * 0.26, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(s * 0.82, s * 0.3);
      ctx.lineTo(s * 0.95, s * 0.5);
      ctx.lineTo(s * 0.72, s * 0.52);
      ctx.fill();
      break;
    case 'lever':
      ctx.beginPath();
      ctx.moveTo(s * 0.5, s * 0.9);
      ctx.lineTo(s * 0.72, s * 0.2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(s * 0.74, s * 0.18, s * 0.13, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(s * 0.25, s * 0.82, s * 0.5, s * 0.14);
      break;
    case 'next':
      ctx.beginPath();
      ctx.moveTo(s * 0.1, s * 0.5);
      ctx.lineTo(s * 0.5, s * 0.15);
      ctx.lineTo(s * 0.9, s * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.fillRect(s * 0.2, s * 0.5, s * 0.6, s * 0.42);
      ctx.fillStyle = '#ff9a3c';
      ctx.fillRect(s * 0.42, s * 0.62, s * 0.16, s * 0.3);
      break;
    case 'final':
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 5;
        const r = i % 2 ? s * 0.18 : s * 0.42;
        ctx.lineTo(s * 0.5 + Math.cos(a) * r, s * 0.52 + Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fill();
      break;
  }
}

export function fmt(n) {
  n = Math.floor(n);
  if (n < 1000) return String(n);
  if (n < 1e6) return (n / 1000).toFixed(n < 1e4 ? 1 : 0).replace(/\.0$/, '') + 'K';
  if (n < 1e9) return (n / 1e6).toFixed(n < 1e7 ? 2 : 1).replace(/\.0+$/, '') + 'M';
  return (n / 1e9).toFixed(2) + 'B';
}

// ---------- 환경 ----------
export function buildEnvironment(stage, lay, theme) {
  const root = new THREE.Group();
  const { x0, x1, z0, z1 } = lay.bounds;
  const W = x1 - x0;
  const D = z1 - z0;
  gfx.scene.background = new THREE.Color(theme.bg);
  gfx.scene.fog = new THREE.Fog(theme.fog, 38, 70);

  // 바깥 지면
  const gTex = floorTex(theme.groundTex, theme.ground);
  gTex.repeat.set(12, 12);
  const GD = z1 - z0 + 40;
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(90, GD), new THREE.MeshLambertMaterial({ map: gTex }));
  gTex.repeat.set(12, GD / 7.5);
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, -0.02, z0 - 0.9 + GD / 2);
  ground.receiveShadow = true;
  root.add(ground);

  // 식당 바닥
  const fTex = floorTex(theme.floor, theme.floorColor);
  fTex.repeat.set(W / 4, D / 4);
  const floorMat = new THREE.MeshLambertMaterial({ map: fTex, color: theme.floorTint || '#ffffff' });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set((x0 + x1) / 2, 0, (z0 + z1) / 2);
  floor.receiveShadow = true;
  root.add(floor);

  // 주방 바닥 (타일 띠)
  const kb = new Build();
  kb.add(GEO.box(W, 0.012, lay.kitchenZ + 1.9 - z0), '#e9e4da', (x0 + x1) / 2, 0.006, (z0 + lay.kitchenZ + 1.9) / 2);
  const kmesh = kb.mesh(matVC, false);
  kmesh.receiveShadow = true;
  root.add(kmesh);
  const ktex = floorTex('tiles', '#f2efe8');
  ktex.repeat.set(W / 2, (lay.kitchenZ + 1.9 - z0) / 2);
  kmesh.material = new THREE.MeshLambertMaterial({ map: ktex, color: theme.floor === 'metal' ? '#c8d0e0' : '#ffffff' });
  // 카운터 경계 줄
  const b = new Build();
  b.add(GEO.box(W, 0.03, 0.12), theme.accent, (x0 + x1) / 2, 0.015, lay.kitchenZ + 1.9);

  // 벽: 좌우 낮은 벽, 앞쪽 문 있는 벽
  const wallH = 1.1;
  const wt = 0.3;
  b.add(GEO.box(wt, wallH, D + wt), theme.wall, x0 - wt / 2, wallH / 2, (z0 + z1) / 2);
  b.add(GEO.box(wt, wallH, D + wt), theme.wall, x1 + wt / 2, wallH / 2, (z0 + z1) / 2);
  b.add(GEO.box(wt + 0.06, 0.1, D + wt + 0.06), theme.wallTrim, x0 - wt / 2, wallH, (z0 + z1) / 2);
  b.add(GEO.box(wt + 0.06, 0.1, D + wt + 0.06), theme.wallTrim, x1 + wt / 2, wallH, (z0 + z1) / 2);
  const doorHalf = 1.4;
  const fw = (W - doorHalf * 2) / 2;
  b.add(GEO.box(fw, 0.55, wt), theme.wall, x0 + fw / 2, 0.275, z1 + wt / 2);
  b.add(GEO.box(fw, 0.55, wt), theme.wall, x1 - fw / 2, 0.275, z1 + wt / 2);
  b.add(GEO.box(fw, 0.06, wt + 0.06), theme.wallTrim, x0 + fw / 2, 0.55, z1 + wt / 2);
  b.add(GEO.box(fw, 0.06, wt + 0.06), theme.wallTrim, x1 - fw / 2, 0.55, z1 + wt / 2);
  // 문 기둥 + 노렌
  for (const sx of [-1, 1]) b.add(GEO.box(0.22, 2.6, 0.22), theme.wallTrim === '#f7f3ea' ? '#6b3a2a' : theme.wall, sx * doorHalf, 1.3, z1 + wt / 2);
  b.add(GEO.box(doorHalf * 2 + 0.6, 0.22, 0.3), theme.wall, 0, 2.6, z1 + wt / 2);
  root.add(b.mesh());
  // 노렌 천 (조금씩 흔들리는 3장)
  const noren = new THREE.Group();
  const nmat = new THREE.MeshLambertMaterial({ color: theme.noren, side: THREE.DoubleSide });
  for (let i = 0; i < 3; i++) {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(0.86, 0.9, 1, 3), nmat);
    p.geometry.translate(0, -0.45, 0);
    p.position.set(-0.9 + i * 0.9, 2.5, z1 + 0.02);
    p.castShadow = true;
    noren.add(p);
  }
  // 노렌 문양 (흰 원)
  const nb = new Build();
  nb.add(GEO.cyl(0.16, 0.16, 0.01, 16), '#ffffff', 0, 2.05, z1 + 0.035, Math.PI / 2);
  const nm = nb.mesh(matVC, false);
  noren.add(nm);
  root.add(noren);
  root.userData.noren = noren;

  // 부두 (뒤쪽): 나무 데크 + 물
  const pier = new Build();
  pier.add(GEO.box(W + 0.6, 0.2, 1.4), stage.theme === 'space' ? '#4a5270' : '#8a5a36', (x0 + x1) / 2, -0.08, z0 - 0.3);
  for (let x = x0; x <= x1; x += 1.6) pier.add(GEO.cyl(0.12, 0.12, 1.4, 8), stage.theme === 'space' ? '#3de0ff' : '#5a3a22', x, -0.2, z0 - 1.0);
  // 난간
  for (let x = x0 + 0.4; x <= x1; x += 2.2) pier.add(GEO.cyl(0.06, 0.06, 0.7, 6), '#6a4a2a', x, 0.35, z0 - 0.9);
  pier.add(GEO.box(W, 0.07, 0.07), '#6a4a2a', (x0 + x1) / 2, 0.68, z0 - 0.9);
  root.add(pier.mesh());
  const waterCol = { alley: '#1d3a5a', mall: '#3fa9d8', beach: '#2ec4d8', ryokan: '#2a5a4a', space: '#000000' }[stage.theme];
  const water = new THREE.Mesh(new THREE.PlaneGeometry(90, 30), new THREE.MeshLambertMaterial({ color: waterCol, transparent: true, opacity: 0.92 }));
  water.rotation.x = -Math.PI / 2;
  water.position.set(0, -0.25, z0 - 16);
  root.add(water);
  root.userData.water = water;

  // 테마 소품
  const props = new Build();
  const glow = new Build();
  // 부두에 댄 배 (입고 느낌)
  if (stage.theme !== 'space') {
    const bx = x0 + 3.2;
    const bz = z0 - 2.6;
    props.add(GEO.rbox(4.2, 0.7, 1.6, 0.7), stage.theme === 'mall' ? '#ffffff' : '#b0582e', bx, -0.05, bz);
    props.add(GEO.rbox(4.3, 0.12, 1.7, 0.72), '#f4f0e0', bx, 0.32, bz);
    props.add(GEO.rbox(1.3, 0.8, 1.0, 0.15), '#f7f3ea', bx + 0.8, 0.75, bz);
    props.add(GEO.box(1.4, 0.1, 1.1), theme.accent, bx + 0.8, 1.18, bz);
    props.add(GEO.cyl(0.05, 0.05, 1.8, 6), '#6a4a2a', bx - 0.9, 1.2, bz);
    for (let i = 0; i < 3; i++) props.add(GEO.box(0.5, 0.35, 0.4), '#9a6a3a', bx - 1.4 + i * 0.55, 0.55, bz + 0.1);
    lanternGlow(glow, bx - 0.9, 2.0, bz, theme.lantern, 0.6);
    // 반대편 작은 배
    props.add(GEO.rbox(2.6, 0.5, 1.1, 0.5), '#3f6fae', x1 - 2.8, -0.1, z0 - 3.2);
    props.add(GEO.rbox(2.7, 0.1, 1.2, 0.52), '#f4f0e0', x1 - 2.8, 0.18, z0 - 3.2);
  } else {
    const bx = x0 + 3.2;
    const bz = z0 - 2.8;
    props.add(GEO.cap(0.8, 2.4, 10), '#e8ecf5', bx, 0.2, bz, 0, 0, Math.PI / 2);
    props.add(GEO.cone(0.5, 0.8, 8), '#ff3fa4', bx + 2.1, 0.2, bz, 0, 0, -Math.PI / 2);
    glow.add(GEO.cyl(0.3, 0.3, 0.1, 10), '#3de0ff', bx - 0.6, 0.85, bz, 0, 0, 0);
    glow.add(GEO.sph(0.25, 8, 6), '#3de0ff', bx - 2.2, 0.2, bz);
  }
  const rnd = mulberry(stage.id.length * 77 + 3);
  // 등불: 좌우 벽 위
  for (let z = z0 + 2; z < z1 - 1; z += 3.2) {
    for (const x of [x0 - 0.15, x1 + 0.15]) {
      props.add(GEO.cyl(0.05, 0.05, 1.3, 6), '#3a2a22', x, wallH + 0.65, z);
      props.add(GEO.cyl(0.07, 0.07, 0.07, 8), '#2a1a14', x, wallH + 1.25, z);
      lanternGlow(glow, x, wallH + 1.0, z, theme.lantern, 0.9);
    }
  }
  // 문 양옆 등불
  for (const sx of [-1, 1]) {
    lanternGlow(glow, sx * (doorHalf + 0.5), 2.0, z1 + 0.4, theme.lantern, 1.1);
    props.add(GEO.cyl(0.03, 0.03, 0.5, 5), '#2a1a14', sx * (doorHalf + 0.5), 2.55, z1 + 0.4);
  }
  // 간판
  props.add(GEO.rbox(3.2, 0.7, 0.14, 0.12), theme.wall, 0, 3.15, z1 + 0.12);
  root.add(signMesh(stage.name, theme, z1 + 0.2));

  if (stage.theme === 'alley') {
    // 옆 건물들
    for (const sx of [-1, 1]) {
      for (let i = 0; i < 4; i++) {
        const h = 3 + rnd() * 3;
        const x = sx * (lay.halfW + 2.4 + rnd() * 0.6);
        const z = z0 + 2 + i * 5.2;
        props.add(GEO.box(3.4, h, 4.6), ['#3a3550', '#4a3a48', '#35405a'][i % 3], x, h / 2, z);
        for (let k = 0; k < 3; k++) glow.add(GEO.box(0.05, 0.5, 0.6), rnd() > 0.4 ? '#ffd88a' : '#5a6080', x - sx * 1.72, 1.2 + k * 1.1, z - 1 + rnd() * 2);
      }
    }
    // 줄 전구
    for (let x = x0 + 0.5; x < x1; x += 0.9) glow.add(GEO.sph(0.07, 6, 5), ['#ffd23f', '#ff6a5a', '#7fd4ff'][Math.floor(rnd() * 3)], x, 2.3 - Math.sin(((x - x0) / W) * Math.PI) * 0.4, z1 + 0.6);
    // 가로등
    for (const sx of [-1, 1]) {
      props.add(GEO.cyl(0.07, 0.09, 3.2, 8), '#2a2e3a', sx * 4.2, 1.6, z1 + 2.2);
      glow.add(GEO.sph(0.22, 10, 8), '#fff2c0', sx * 4.2, 3.25, z1 + 2.2);
    }
    // 상자 더미
    for (let i = 0; i < 5; i++) props.add(GEO.box(0.7, 0.5, 0.6), '#9a6a3a', x1 + 1.2 + rnd(), 0.25 + (i % 2) * 0.5, z0 + 3 + i * 0.4, 0, rnd(), 0);
  } else if (stage.theme === 'mall') {
    for (const sx of [-1, 1]) {
      for (let i = 0; i < 4; i++) {
        const x = sx * (lay.halfW + 2.6);
        const z = z0 + 2 + i * 5;
        props.add(GEO.box(3.2, 3.4, 4.4), '#ffffff', x, 1.7, z);
        glow.add(GEO.box(0.06, 0.6, 3.6), ['#ff6b5a', '#4fb0ff', '#ffc83d', '#58c7b4'][i], x - sx * 1.62, 2.8, z);
        props.add(GEO.box(0.05, 1.8, 3.4), '#bfe6ff', x - sx * 1.61, 1.1, z);
      }
    }
    for (const [x, z] of [[x0 + 0.6, z1 - 0.6], [x1 - 0.6, z1 - 0.6], [x0 + 0.6, lay.kitchenZ + 2.6], [x1 - 0.6, lay.kitchenZ + 2.6]]) {
      props.add(GEO.cyl(0.3, 0.24, 0.5, 10), '#ffffff', x, 0.25, z);
      props.add(GEO.sph(0.45, 10, 8), '#3fae5a', x, 0.85, z);
      props.add(GEO.sph(0.32, 10, 8), '#5fcf6a', x + 0.15, 1.15, z + 0.1);
    }
    // 흰 기둥
    for (const sx of [-1, 1]) props.add(GEO.cyl(0.3, 0.3, 4, 12), '#f4f0e8', sx * (lay.halfW + 0.6), 2, z1 + 0.6);
  } else if (stage.theme === 'beach') {
    for (let i = 0; i < 10; i++) {
      const sx = i % 2 ? 1 : -1;
      const x = sx * (lay.halfW + 1.6 + rnd() * 3);
      const z = z0 + rnd() * (D + 6);
      palm(props, x, z, rnd);
    }
    for (let i = 0; i < 4; i++) {
      const x = -6 + i * 4 + rnd();
      const z = z1 + 3 + rnd() * 2;
      props.add(GEO.cyl(0.04, 0.04, 2, 6), '#ffffff', x, 1, z);
      props.add(GEO.cone(1.1, 0.5, 8), ['#ff6b5a', '#4fb0ff', '#ffc83d', '#ff8fb8'][i], x, 2.1, z);
    }
    // 서핑보드
    props.add(GEO.rbox(0.5, 0.08, 1.8, 0.24), '#ff7a3a', x1 + 0.8, 0.8, z1 - 2, 1.2, 0, 0.2);
  } else if (stage.theme === 'ryokan') {
    for (let i = 0; i < 14; i++) {
      const sx = i % 2 ? 1 : -1;
      const x = sx * (lay.halfW + 1 + rnd() * 3);
      const z = z0 + rnd() * (D + 4);
      const h = 3 + rnd() * 2.5;
      props.add(GEO.cyl(0.08, 0.1, h, 6), '#6fae4a', x, h / 2, z);
      for (let k = 1; k < h; k += 0.7) props.add(GEO.cyl(0.1, 0.1, 0.05, 6), '#4f8e3a', x, k, z);
      props.add(GEO.cone(0.5, 1.2, 5), '#3f7e3a', x, h, z);
    }
    for (const sx of [-1, 1]) {
      const x = sx * (lay.halfW + 1.2);
      const z = z1 - 1;
      props.add(GEO.box(0.6, 0.3, 0.6), '#9a9a8a', x, 0.15, z);
      props.add(GEO.cyl(0.1, 0.12, 0.6, 6), '#9a9a8a', x, 0.6, z);
      props.add(GEO.box(0.7, 0.1, 0.7), '#8a8a7a', x, 1.3, z);
      glow.add(GEO.box(0.4, 0.35, 0.4), '#ffcf7a', x, 1.08, z);
      props.add(GEO.cone(0.55, 0.4, 4), '#8a8a7a', x, 1.55, z, 0, Math.PI / 4, 0);
    }
    // 연못
    const pond = new THREE.Mesh(new THREE.CircleGeometry(1.8, 20), new THREE.MeshLambertMaterial({ color: '#3a7a8a' }));
    pond.rotation.x = -Math.PI / 2;
    pond.position.set(x1 + 3.2, 0.01, z1 - 4);
    root.add(pond);
  } else if (stage.theme === 'space') {
    // 별
    const starGeo = new THREE.BufferGeometry();
    const pts = [];
    for (let i = 0; i < 500; i++) pts.push((rnd() - 0.5) * 90, -2 - rnd() * 6, (rnd() - 0.5) * 90);
    starGeo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    root.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.12 })));
    const planet = new THREE.Mesh(new THREE.SphereGeometry(4, 24, 16), new THREE.MeshLambertMaterial({ color: '#ff8fb8', emissive: '#3a1030' }));
    planet.position.set(x1 + 8, -3, z0 - 6);
    root.add(planet);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(6, 0.3, 4, 40), new THREE.MeshLambertMaterial({ color: '#ffd9a0', emissive: '#403020' }));
    ring.position.copy(planet.position);
    ring.rotation.x = 1.2;
    root.add(ring);
    // 네온 라인
    glow.add(GEO.box(W, 0.05, 0.05), '#3de0ff', (x0 + x1) / 2, 0.03, z1 - 0.1);
    glow.add(GEO.box(0.05, 0.05, D), '#ff3fa4', x0 + 0.1, 0.03, (z0 + z1) / 2);
    glow.add(GEO.box(0.05, 0.05, D), '#ff3fa4', x1 - 0.1, 0.03, (z0 + z1) / 2);
    // 창문 틀
    for (const sx of [-1, 1]) props.add(GEO.box(0.4, 3, 0.4), '#5a6488', sx * (lay.halfW + 0.2), 1.5, z1 + 0.2);
  }
  root.add(props.mesh());
  const glowMesh = glow.mesh(matGlow, false);
  root.add(glowMesh);
  return root;
}

function palm(b, x, z, rnd) {
  const h = 2.6 + rnd() * 1.4;
  for (let i = 0; i < 6; i++) b.add(GEO.cyl(0.14 - i * 0.01, 0.16 - i * 0.01, h / 6, 7), '#a0764a', x + i * 0.05, (h / 6) * (i + 0.5), z);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    b.add(GEO.box(1.4, 0.05, 0.36), '#3faa4a', x + 0.3 + Math.cos(a) * 0.6, h + 0.05, z + Math.sin(a) * 0.6, 0, -a, -0.35);
  }
  b.add(GEO.sph(0.12, 6, 5), '#6a4a2a', x + 0.3, h - 0.1, z + 0.1);
}

function signMesh(name, theme, z) {
  const tex = canvasTex(512, 112, (ctx, w, h) => {
    ctx.fillStyle = theme.wall;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = theme.wallTrim;
    ctx.lineWidth = 8;
    ctx.strokeRect(6, 6, w - 12, h - 12);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 56px system-ui, -apple-system, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, w / 2, h / 2 + 2);
  });
  const m = new THREE.Mesh(new THREE.PlaneGeometry(3.1, 0.68), new THREE.MeshBasicMaterial({ map: tex }));
  m.position.set(0, 3.15, z);
  return m;
}

// ---------- 해금 가능한 시설 메시 (앵커 기준 로컬 좌표) ----------
export function facilityMeshes(stage, lay, theme) {
  const out = { stations: {}, crates: {}, sink: null, rack: null, desk: null, trash: [], stools: {}, lever: null };
  for (const st of lay.stations) {
    const g = stationModel(st.menu, theme);
    g.position.set(st.x, 0, st.z);
    out.stations[st.menu] = g;
    const c = crateModel(st.ing, theme);
    c.position.set(st.crate.x, 0, st.crate.z);
    out.crates[st.menu] = c;
  }
  out.sink = sinkModel(theme);
  out.sink.position.set(lay.sink.x, 0, lay.sink.z);
  out.rack = rackModel();
  out.rack.position.set(lay.rack.x, 0, lay.rack.z);
  out.desk = deskModel(theme);
  out.desk.position.set(lay.upgrade.desk.x, 0, lay.upgrade.desk.z);
  if (lay.m < 0) out.desk.rotation.y = Math.PI;
  out.trash = lay.trashes.map((t) => {
    const m = trashModel();
    m.position.set(t.bin.x, 0, t.bin.z);
    return m;
  });
  if (lay.lever) {
    out.lever = leverModel();
    out.lever.position.set(lay.lever.model.x, 0, lay.lever.model.z);
  }
  return out;
}

export function stoolMesh(x, z, theme) {
  const b = stoolModel(0, 0, theme);
  const m = b.mesh();
  m.position.set(x, 0, z);
  return m;
}
