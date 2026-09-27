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
  // paid: 지금까지 낸 금액 (정수)
  draw(paid, afford) {
    paid = Math.min(this.cost, Math.max(0, Math.round(paid)));
    const q = paid / this.cost;
    if (paid === this.lastP && afford === this.lastAfford) return;
    this.lastP = paid;
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
    const remain = this.cost - paid;
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

UnlockPad.prototype.dispose = function () {
  this.tex.dispose();
  this.mesh.material.dispose();
};

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
  gfx.scene.fog = null;

  // 바깥 지면
  const gTex = floorTex(theme.groundTex, theme.ground);
  gTex.repeat.set(12, 12);
  const GD = z1 - z0 + 40;
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(90, GD), new THREE.MeshLambertMaterial({ map: gTex }));
  ground.matrixAutoUpdate = true;
  gTex.repeat.set(12, GD / 7.5);
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, -0.02, z0 - 0.9 + GD / 2);
  ground.receiveShadow = true;
  root.add(ground);

  // 식당 바닥
  const fTex = floorTex(theme.floor, theme.floorColor);
  fTex.repeat.set(W / 4, D / 4);
  const floorMat = new THREE.MeshLambertMaterial({ map: fTex, color: theme.floorTint || '#ffffff' });
  // 주방 타일 구역과 겹치지 않게 식당 바닥은 주방 앞부터 (겹쳐 그리기 줄이기)
  const kEdge = lay.kitchenZ + 1.9;
  const DF = z1 - kEdge;
  fTex.repeat.set(W / 4, DF / 4);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, DF), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.set((x0 + x1) / 2, 0, (kEdge + z1) / 2);
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
  // 노렌: 천 3장 + 흰 문양을 한 메시로 (윗변 기준으로 흔들림)
  const nb = new Build();
  for (let i = 0; i < 3; i++) nb.add(GEO.box(0.86, 0.9, 0.012), theme.noren, -0.9 + i * 0.9, -0.45, 0);
  nb.add(GEO.cyl(0.16, 0.16, 0.02, 16), '#ffffff', 0, -0.45, 0.012, Math.PI / 2);
  const noren = nb.mesh(matVC, true);
  noren.position.set(0, 2.5, z1 + 0.02);
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
  const water = new THREE.Mesh(new THREE.PlaneGeometry(90, 30), new THREE.MeshBasicMaterial({ color: waterCol }));
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

// ---------- 식당별 바닥 소품 (하단 1/3 채우기 + 대표 소품) ----------
export function buildDecor(stage, lay, theme) {
  const b = new Build();
  const glow = new Build();
  const obs = [];
  const { x0, x1, z1 } = lay.bounds;
  const m = lay.m;
  const th = stage.theme;
  let zb = -1e9;
  for (const bl of lay.belts) zb = Math.max(zb, bl.topZ + stage.layout.len1 + bl.r + 0.85);
  const box = (x, z, hw, hd) => obs.push({ t: 'box', x, z, hw, hd });
  const fw = z1 - 0.45; // 앞벽 안쪽 줄

  const planter = (x, z, pot, leaf) => {
    b.add(GEO.cyl(0.3, 0.24, 0.45, 10), pot, x, 0.225, z);
    b.add(GEO.sph(0.38, 10, 8), leaf, x, 0.72, z);
    b.add(GEO.sph(0.26, 8, 6), leaf, x + 0.14, 0.98, z + 0.06);
    box(x, z, 0.32, 0.32);
  };
  const bench = (x, z, c) => {
    b.add(GEO.rbox(1.5, 0.1, 0.46, 0.06), c, x, 0.46, z);
    b.add(GEO.box(1.5, 0.36, 0.08), c, x, 0.7, z + 0.2);
    for (const sx of [-0.62, 0.62]) b.add(GEO.box(0.08, 0.42, 0.4), '#4a4a55', x + sx, 0.21, z);
    box(x, z, 0.78, 0.3);
  };
  // 앞벽 양쪽 (문과 대기줄 피해서)
  const leftX = -(lay.halfW - 0.5);
  const rightX = lay.halfW - 0.5;
  const L1 = Math.min(leftX, -2.2);
  const R1 = Math.max(rightX, 3.0);

  if (th === 'alley') {
    // 마네키네코, 술통, 대나무 화분, 벤치, 수족관
    const cx = -3.2;
    b.add(GEO.rbox(0.5, 0.55, 0.4, 0.14), '#ffffff', cx, 0.3, fw);
    b.add(GEO.sph(0.24, 10, 8), '#ffffff', cx, 0.78, fw);
    b.add(GEO.cone(0.08, 0.14, 4), '#ffffff', cx - 0.14, 0.99, fw, 0, 0.8, -0.3);
    b.add(GEO.cone(0.08, 0.14, 4), '#ffffff', cx + 0.14, 0.99, fw, 0, 0.8, 0.3);
    b.add(GEO.cap(0.06, 0.24, 6), '#ffffff', cx + 0.22, 0.95, fw + 0.05, 0, 0, -0.3);
    b.add(GEO.sph(0.05, 6, 5), '#e2394f', cx, 0.58, fw + 0.2);
    b.add(GEO.cyl(0.12, 0.12, 0.02, 10), '#ffc83d', cx, 0.4, fw + 0.21, Math.PI / 2);
    box(cx, fw, 0.3, 0.25);
    for (const [x, s] of [[-4.6, 1], [-5.3, 0.8]]) {
      b.add(GEO.cyl(0.32 * s, 0.32 * s, 0.6 * s, 12), '#a8743e', x, 0.3 * s, fw);
      b.add(GEO.cyl(0.33 * s, 0.33 * s, 0.05, 12), '#3a2a22', x, 0.12 * s, fw);
      b.add(GEO.cyl(0.33 * s, 0.33 * s, 0.05, 12), '#3a2a22', x, 0.48 * s, fw);
      b.add(GEO.rbox(0.3 * s, 0.2 * s, 0.02, 0.03), '#ffffff', x, 0.32 * s, fw + 0.33 * s);
      box(x, fw, 0.33 * s, 0.33 * s);
    }
    for (const x of [3.4, 5.2]) {
      b.add(GEO.rbox(0.6, 0.4, 0.6, 0.08), '#5a3a22', x, 0.2, fw);
      for (let i = 0; i < 4; i++) {
        const h = 1.2 + i * 0.25;
        b.add(GEO.cyl(0.04, 0.05, h, 6), '#6fae4a', x - 0.15 + (i % 2) * 0.3, 0.4 + h / 2, fw - 0.12 + Math.floor(i / 2) * 0.24);
        b.add(GEO.cone(0.14, 0.4, 5), '#4f8e3a', x - 0.15 + (i % 2) * 0.3, 0.4 + h, fw - 0.12 + Math.floor(i / 2) * 0.24);
      }
      box(x, fw, 0.32, 0.32);
    }
    // 수족관 (벨트 아래 중앙)
    const ax = lay.belts[0].cx;
    const az = zb + 2.35;
    b.add(GEO.rbox(1.6, 0.5, 0.7, 0.06), '#3a2a22', ax, 0.25, az);
    glow.add(GEO.box(1.46, 0.62, 0.56), '#3aa0d8', ax, 0.82, az);
    b.add(GEO.box(1.6, 0.06, 0.7), '#3a2a22', ax, 1.15, az);
    for (let i = 0; i < 4; i++) glow.add(GEO.sph(0.07, 6, 5), ['#ff8a4c', '#ffd23f', '#ff5a7a', '#ffffff'][i], ax - 0.5 + i * 0.32, 0.75 + (i % 2) * 0.15, az + 0.29, 0, 0, 0, 1.6, 0.8, 0.6);
    box(ax, az, 0.82, 0.37);
  } else if (th === 'mall') {
    planter(-3.0, fw, '#ffffff', '#3fae5a');
    planter(3.4, fw, '#ffffff', '#5fcf6a');
    bench(-4.8, fw - 0.05, '#58c7b4');
    // 자판기
    b.add(GEO.rbox(0.9, 1.7, 0.6, 0.08), '#e8483b', 5.4, 0.85, fw - 0.05);
    glow.add(GEO.box(0.7, 0.9, 0.02), '#bfe6ff', 5.35, 1.15, fw + 0.26);
    for (let i = 0; i < 3; i++) b.add(GEO.cyl(0.06, 0.06, 0.2, 8), ['#ffd23f', '#4fb0ff', '#6ee07a'][i], 5.15 + i * 0.2, 1.15, fw + 0.24);
    box(5.4, fw - 0.05, 0.46, 0.32);
    // 분수 (중앙)
    const az = zb + 1.8;
    b.add(GEO.cyl(0.85, 0.9, 0.35, 20), '#e9e4da', 0, 0.175, az);
    glow.add(GEO.cyl(0.72, 0.72, 0.04, 20), '#7fd4ff', 0, 0.34, az);
    b.add(GEO.cyl(0.12, 0.16, 0.7, 10), '#e9e4da', 0, 0.6, az);
    glow.add(GEO.sph(0.2, 8, 6), '#bfeaff', 0, 1.0, az, 0, 0, 0, 1, 1.4, 1);
    box(0, az, 0.9, 0.9);
    // 에스컬레이터
    const e = lay.escalator;
    if (e) {
      const ez = zb - 2.0;
      e.z = ez + 1.8;
      b.add(GEO.box(0.9, 0.12, 2.2), '#7a8494', e.x, 0.06, ez);
      for (let i = 0; i < 7; i++) b.add(GEO.box(0.78, 0.05, 0.22), '#c9ccd6', e.x, 0.14 - i * 0.0, ez - 1.0 + i * 0.3);
      for (const sx of [-0.47, 0.47]) {
        b.add(GEO.box(0.06, 0.8, 2.2), '#dfe6f2', e.x + sx, 0.45, ez);
        glow.add(GEO.box(0.08, 0.06, 2.2), '#58c7b4', e.x + sx, 0.88, ez);
      }
      glow.add(GEO.box(0.8, 0.04, 0.3), '#ffd23f', e.x, 0.17, ez + 1.05);
      box(e.x, ez, 0.5, 1.1);
    }
  } else if (th === 'beach') {
    // 비치 체어, 파라솔, 서핑보드, 티키 횃불, 모래성
    for (const [x, c] of [[-3.1, '#ff7a3a'], [-4.9, '#4fb0ff']]) {
      b.add(GEO.box(0.6, 0.06, 1.2), c, x, 0.32, fw - 0.4, -0.15, 0, 0);
      b.add(GEO.box(0.6, 0.06, 0.6), c, x, 0.55, fw - 1.05, 0.9, 0, 0);
      for (const sx of [-0.26, 0.26]) b.add(GEO.cyl(0.03, 0.03, 0.34, 5), '#ffffff', x + sx, 0.17, fw - 0.4);
      box(x, fw - 0.6, 0.34, 0.66);
    }
    b.add(GEO.cyl(0.04, 0.04, 2.2, 6), '#ffffff', -4.0, 1.1, fw - 0.2);
    b.add(GEO.cone(1.3, 0.5, 10), '#ff5a7a', -4.0, 2.2, fw - 0.2);
    for (const [x, c, r] of [[3.2, '#ffd23f', 0.1], [3.7, '#4fb0ff', -0.1], [4.2, '#ff7a3a', 0.05]]) b.add(GEO.rbox(0.4, 0.08, 1.7, 0.2), c, x, 0.85, fw - 0.1, 1.45, 0, r);
    box(3.7, fw - 0.1, 0.8, 0.25);
    for (const x of [5.4, -6.4]) {
      b.add(GEO.cyl(0.05, 0.07, 1.5, 6), '#8a5a2e', x, 0.75, fw);
      b.add(GEO.cyl(0.14, 0.1, 0.25, 8), '#5a3a1e', x, 1.55, fw);
      glow.add(GEO.cone(0.12, 0.35, 6), '#ffb13d', x, 1.85, fw);
      box(x, fw, 0.15, 0.15);
    }
    const az = zb + 1.75;
    b.add(GEO.cyl(0.9, 1.0, 0.25, 14), '#f3d9a2', 0, 0.12, az);
    b.add(GEO.cyl(0.35, 0.4, 0.5, 8), '#e9c98a', 0, 0.5, az);
    for (const a of [0, 1.6, 3.2, 4.8]) b.add(GEO.cyl(0.14, 0.16, 0.45, 6), '#e9c98a', Math.cos(a) * 0.6, 0.45, az + Math.sin(a) * 0.5);
    b.add(GEO.cone(0.1, 0.25, 4), '#ff5a3c', 0, 0.9, az);
    box(0, az, 1.0, 1.0);
  } else if (th === 'ryokan') {
    // 석등, 분재, 대나무 울타리, 돌 정원
    for (const x of [-3.0, 3.4]) {
      b.add(GEO.box(0.5, 0.25, 0.5), '#9a9a8a', x, 0.125, fw);
      b.add(GEO.cyl(0.08, 0.1, 0.5, 6), '#9a9a8a', x, 0.5, fw);
      b.add(GEO.box(0.55, 0.08, 0.55), '#8a8a7a', x, 1.1, fw);
      glow.add(GEO.box(0.34, 0.3, 0.34), '#ffcf7a', x, 0.9, fw);
      b.add(GEO.cone(0.45, 0.35, 4), '#8a8a7a', x, 1.32, fw, 0, Math.PI / 4, 0);
      box(x, fw, 0.3, 0.3);
    }
    for (const x of [-4.8, 5.2]) {
      b.add(GEO.rbox(0.8, 0.45, 0.5, 0.06), '#5a3a2a', x, 0.22, fw);
      b.add(GEO.cyl(0.25, 0.2, 0.18, 10), '#3a4a5a', x, 0.54, fw);
      b.add(GEO.cyl(0.04, 0.06, 0.4, 5), '#6a4a2a', x, 0.8, fw, 0, 0, 0.3);
      b.add(GEO.sph(0.3, 8, 6), '#3f7e3a', x - 0.12, 1.02, fw, 0, 0, 0, 1.3, 0.6, 1);
      b.add(GEO.sph(0.22, 8, 6), '#4f8e3a', x + 0.18, 1.1, fw, 0, 0, 0, 1.2, 0.6, 1);
      box(x, fw, 0.42, 0.28);
    }
    for (let x = x0 + 0.3; x < -1.6; x += 0.22) b.add(GEO.cyl(0.05, 0.05, 1.3, 5), '#8fbf5a', x, 0.65, z1 - 0.12);
    for (let x = 1.6; x < x1 - 0.2; x += 0.22) b.add(GEO.cyl(0.05, 0.05, 1.3, 5), '#8fbf5a', x, 0.65, z1 - 0.12);
    const az = zb + 1.8;
    b.add(GEO.rbox(2.2, 0.06, 1.2, 0.3), '#e8e2d0', 0, 0.03, az);
    for (const [x, z, s] of [[-0.5, -0.1, 0.3], [0.4, 0.2, 0.22], [0.75, -0.3, 0.15]]) b.add(new THREE.IcosahedronGeometry(s, 0), '#7a7a70', x, s * 0.6, az + z);
    for (let i = 0; i < 5; i++) b.add(GEO.torus(0.35 + i * 0.12, 0.012, 3, 24, Math.PI), '#c9c2ae', -0.5, 0.065, az - 0.1, -Math.PI / 2, 0, 0);
    box(0, az, 1.1, 0.6);
  } else if (th === 'space') {
    // 우주인 동상, 홀로 단말기, 식물 돔, 화물 상자
    const ax = -3.2;
    b.add(GEO.cyl(0.35, 0.4, 0.3, 10), '#5a6488', ax, 0.15, fw);
    b.add(GEO.cap(0.24, 0.3, 8), '#e8ecf5', ax, 0.75, fw);
    b.add(GEO.sph(0.24, 10, 8), '#e8ecf5', ax, 1.22, fw);
    glow.add(GEO.sph(0.16, 8, 6), '#3de0ff', ax, 1.23, fw + 0.12, 0, 0, 0, 1.2, 0.8, 0.5);
    box(ax, fw, 0.4, 0.4);
    b.add(GEO.rbox(0.6, 1.0, 0.4, 0.06), '#3a4466', 3.2, 0.5, fw);
    glow.add(GEO.box(0.5, 0.35, 0.02), '#3de0ff', 3.2, 0.8, fw + 0.21);
    glow.add(GEO.cone(0.3, 0.6, 12), '#ff3fa4', 3.2, 1.45, fw, Math.PI, 0, 0);
    box(3.2, fw, 0.32, 0.22);
    for (const x of [-4.9, 5.0]) {
      b.add(GEO.cyl(0.4, 0.45, 0.2, 12), '#5a6488', x, 0.1, fw);
      b.add(GEO.sph(0.35, 10, 8), '#5fcf6a', x, 0.45, fw, 0, 0, 0, 1, 0.8, 1);
      const dome = new THREE.SphereGeometry(0.42, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2);
      glow.add(dome, '#8fd8ff', x, 0.2, fw, 0, 0, 0, 1, 1, 1);
      box(x, fw, 0.45, 0.45);
    }
    const az = zb + 1.75;
    b.add(GEO.cyl(0.7, 0.8, 0.2, 16), '#3a4466', 0, 0.1, az);
    glow.add(GEO.sph(0.4, 12, 10), '#ff8fb8', 0, 1.0, az);
    glow.add(GEO.torus(0.62, 0.03, 4, 32), '#3de0ff', 0, 1.0, az, 1.2, 0, 0);
    box(0, az, 0.8, 0.8);
  }
  void L1;
  void R1;
  void m;
  const mesh = b.mesh();
  const glowMesh = glow.parts.length ? glow.mesh(matGlow, false) : null;
  return { mesh, glowMesh, obs };
}

// 벨트 안쪽 섬 장식 (식당 테마별 대표 소품)
export function islandDeco(bl, themeId, theme) {
  const d = new Build();
  const inner = bl.r - 0.5;
  const L = bl.len;
  const top = -L / 2 + 0.25;
  const bot = L / 2 - 0.25;
  d.add(GEO.rbox(inner * 2 - 0.1, 0.5, L + inner * 1.2, 0.5), themeId === 'space' ? '#3a4466' : themeId === 'mall' ? '#d8d2c6' : '#6a4a3a', 0, 0.25, 0);
  if (themeId === 'alley') {
    d.add(GEO.cyl(0.1, 0.1, 0.5, 8), '#ffffff', -0.2, 0.75, top);
    d.add(GEO.cyl(0.1, 0.1, 0.5, 8), '#6fae4a', 0.2, 0.75, top);
    d.add(GEO.cyl(0.25, 0.2, 0.3, 10), '#e8e0d0', 0, 0.65, bot);
    d.add(GEO.sph(0.32, 10, 8), '#ff8fb8', 0, 0.98, bot);
    d.add(GEO.cyl(0.03, 0.03, 0.9, 5), '#3a2a22', 0, 0.95, 0);
    d.add(GEO.sph(0.2, 10, 8), theme.lantern, 0, 1.45, 0, 0, 0, 0, 1, 1.25, 1);
  } else if (themeId === 'mall') {
    d.add(GEO.cyl(0.25, 0.2, 0.3, 10), '#ffffff', 0, 0.65, top);
    d.add(GEO.sph(0.35, 10, 8), '#ff8fb8', 0, 1.0, top);
    d.add(GEO.cyl(0.25, 0.2, 0.3, 10), '#ffffff', 0, 0.65, bot);
    d.add(GEO.sph(0.35, 10, 8), '#ffd23f', 0, 1.0, bot);
    d.add(GEO.rbox(0.9, 0.5, 0.1, 0.08), '#58c7b4', 0, 1.1, 0);
  } else if (themeId === 'beach') {
    d.add(GEO.cyl(0.06, 0.08, 1.2, 6), '#a0764a', 0, 1.1, 0);
    for (let i = 0; i < 5; i++) d.add(GEO.box(0.8, 0.04, 0.22), '#3faa4a', Math.cos(i * 1.26) * 0.3, 1.7, Math.sin(i * 1.26) * 0.3, 0, -i * 1.26, -0.4);
    d.add(GEO.sph(0.18, 8, 6), '#ffb0c8', 0, 0.6, top, 0, 0, 0, 1.3, 0.5, 1);
    d.add(GEO.cone(0.16, 0.3, 6), '#fff0d0', 0, 0.65, bot);
  } else if (themeId === 'ryokan') {
    d.add(GEO.cyl(0.3, 0.3, 0.06, 14), '#3a6a8a', 0, 0.53, top + 0.3);
    d.add(GEO.cyl(0.04, 0.06, 0.4, 5), '#6a4a2a', 0, 0.7, bot, 0, 0, 0.3);
    d.add(GEO.sph(0.28, 8, 6), '#3f7e3a', -0.1, 0.95, bot, 0, 0, 0, 1.3, 0.6, 1);
    d.add(GEO.box(0.3, 0.2, 0.3), '#9a9a8a', 0, 0.6, 0);
    d.add(GEO.cone(0.28, 0.25, 4), '#8a8a7a', 0, 0.85, 0, 0, Math.PI / 4, 0);
  } else {
    d.add(GEO.cyl(0.2, 0.25, 0.2, 10), '#5a6488', 0, 0.6, 0);
    d.add(GEO.sph(0.26, 10, 8), '#ff8fb8', 0, 1.05, 0);
    d.add(GEO.torus(0.4, 0.025, 4, 28), '#3de0ff', 0, 1.05, 0, 1.2, 0, 0);
    d.add(GEO.sph(0.2, 8, 6), '#5fcf6a', 0, 0.7, top);
    d.add(GEO.sph(0.2, 8, 6), '#5fcf6a', 0, 0.7, bot);
  }
  return d.mesh();
}
