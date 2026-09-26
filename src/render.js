// Canvas 2D 렌더러: 정적 코스는 오프스크린에 미리 그림, 움직이는 요소만 매 프레임
import { T, PHYS } from './config.js';
import { TILE, SLOPE_DIR } from './gen.js';
import { cupPos, millAngle, moverPos } from './physics.js';
import { mulberry32 } from './rng.js';
import { drawBallSkin, drawFlag } from './draw.js';

export const THEMES = [
  { name: '전반 9홀', hue: 100, sat: 58, light: 50, voidA: '#1f6b45', voidB: '#185a39', dot: 'rgba(120,200,120,0.18)', rail: '#fff3dc', railSide: '#caa472', bg: '#175434', sand: '#f4db8e', flag: '#ff3d3d' },
  { name: '후반 9홀', hue: 150, sat: 45, light: 48, voidA: '#3a2f6b', voidB: '#2f2659', dot: 'rgba(200,170,255,0.16)', rail: '#ffe6c9', railSide: '#c98b63', bg: '#2a2150', sand: '#f2cf98', flag: '#ffb300' },
];

const FONT = 'system-ui,-apple-system,"Apple SD Gothic Neo","Noto Sans KR",sans-serif';

// 정적 코스 레이어: 코스 밖 지면 + 월드 장식 + 바닥 + 조명 + 재질별 벽 (여백 MG 타일 포함)
export const MG = 4;
export function renderStatic(h, theme, world, S = 2, pattern = null) {
  const W = h.cols * T,
    H = h.rows * T;
  const OW = W + MG * 2 * T,
    OH = H + MG * 2 * T;
  const c = document.createElement('canvas');
  c.width = OW * S;
  c.height = OH * S;
  const x = c.getContext('2d');
  x.scale(S, S);
  x.translate(MG * T, MG * T);
  const rng = mulberry32(h.seed ^ (h.idx * 977));
  const g = h.grid;
  if (pattern) {
    x.fillStyle = pattern;
    x.fillRect(-MG * T, -MG * T, OW, OH);
  } else drawGround(x, -MG * T, -MG * T, OW, OH, theme, world, rng);
  // 공중에 뜬 섬: 드롭 섀도 + 측면 단면 (흙/돌 두께)
  const EXP = 5,
    D = 22;
  const isFloorT = (tx, ty) => tx >= 0 && ty >= 0 && tx < g.cols && ty < g.rows && g.t[ty * g.cols + tx] !== TILE.VOID;
  const islandPath = (ox, oy) => {
    x.beginPath();
    for (let ty = 0; ty < g.rows; ty++) for (let tx = 0; tx < g.cols; tx++) if (isFloorT(tx, ty)) x.rect(tx * T - EXP + ox, ty * T - EXP + oy, T + EXP * 2, T + EXP * 2);
  };
  x.save();
  x.filter = 'blur(9px)';
  x.fillStyle = 'rgba(0,0,0,0.42)';
  islandPath(12, D + 16);
  x.fill();
  x.restore();
  const CL = CLIFF[world.id] || CLIFF.meadow;
  for (let k = D; k >= 1; k--) {
    const u = k / D;
    x.fillStyle = k === D ? CL[2] : k % 5 === 0 ? CL[1] : mixHex(CL[0], CL[2], u * 0.8);
    islandPath(0, k);
    x.fill();
  }
  // 섬 윗면 가장자리 (러프 테두리)
  x.fillStyle = `hsl(${theme.hue},${theme.sat - 8}%,${theme.light - 12}%)`;
  islandPath(0, 0);
  x.fill();
  // 바닥 타일: 페어웨이(줄무늬) / 러프(가장자리) 2단 잔디
  const rough = (tx, ty) => {
    for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) if (!isFloorT(tx + ox, ty + oy)) return true;
    return false;
  };
  for (let ty = 0; ty < g.rows; ty++)
    for (let tx = 0; tx < g.cols; tx++) {
      const v = g.t[ty * g.cols + tx];
      if (v === TILE.VOID) continue;
      const px = tx * T,
        py = ty * T;
      const chk = (tx + ty) % 2;
      const stripe = ty % 2;
      const isRough = rough(tx, ty);
      const L = theme.light + (1 - ty / g.rows) * 6 + (isRough ? -2.5 : stripe ? 3.5 : 0);
      if (v === TILE.GRASS || v >= TILE.SN) {
        x.fillStyle = `hsl(${theme.hue},${theme.sat - (isRough ? 6 : 0)}%,${L}%)`;
        x.fillRect(px, py, T, T);
        if (v >= TILE.SN) {
          // 경사: 내리막 쪽으로 어두워지는 명암
          const [sdx, sdy] = SLOPE_DIR[v];
          const cx0 = px + T / 2 - sdx * T * 0.5,
            cy0 = py + T / 2 - sdy * T * 0.5;
          const sg = x.createLinearGradient(cx0, cy0, cx0 + sdx * T, cy0 + sdy * T);
          sg.addColorStop(0, 'rgba(255,255,220,0.28)');
          sg.addColorStop(1, 'rgba(0,20,0,0.28)');
          x.fillStyle = sg;
          x.fillRect(px, py, T, T);
        }
        if (v >= TILE.SN) {
          const [dx, dy] = SLOPE_DIR[v];
          x.strokeStyle = 'rgba(0,0,0,0.12)';
          x.lineWidth = 1;
          for (let k = 4; k < T; k += 8) {
            x.beginPath();
            if (dx) {
              x.moveTo(px + k, py + 2);
              x.lineTo(px + k, py + T - 2);
            } else {
              x.moveTo(px + 2, py + k);
              x.lineTo(px + T - 2, py + k);
            }
            x.stroke();
          }
          void dy;
        }
      } else if (v === TILE.SAND) {
        x.fillStyle = theme.sand;
        x.fillRect(px, py, T, T);
        x.fillStyle = 'rgba(160,110,40,0.25)';
        for (let k = 0; k < 10; k++) x.fillRect(px + rng() * T, py + rng() * T, 1.6, 1.6);
        x.fillStyle = 'rgba(255,255,255,0.3)';
        for (let k = 0; k < 5; k++) x.fillRect(px + rng() * T, py + rng() * T, 1.4, 1.4);
      } else if (v === TILE.WATER) {
        const gr = x.createLinearGradient(px, py, px, py + T);
        const wc = theme.water || ['#3db3ff', '#1e88e5'];
        gr.addColorStop(0, wc[0]);
        gr.addColorStop(1, wc[1]);
        x.fillStyle = gr;
        x.fillRect(px, py, T, T);
      } else if (v === TILE.ICE) {
        x.fillStyle = chk ? (theme.ice || ['#dff6ff'])[0] : (theme.ice || [0, '#cdefff'])[1];
        x.fillRect(px, py, T, T);
        x.strokeStyle = 'rgba(255,255,255,0.9)';
        x.lineWidth = 1.5;
        x.beginPath();
        const o = rng() * 12;
        x.moveTo(px + 4 + o, py + T - 4);
        x.lineTo(px + 12 + o, py + 6);
        x.stroke();
        x.strokeStyle = 'rgba(120,180,220,0.35)';
        x.lineWidth = 1;
        x.beginPath();
        x.moveTo(px + rng() * T, py + rng() * T);
        x.lineTo(px + rng() * T, py + rng() * T);
        x.stroke();
      }
    }
  // 물/모래 가장자리
  const tv = (tx, ty) => (tx < 0 || ty < 0 || tx >= g.cols || ty >= g.rows ? 0 : g.t[ty * g.cols + tx]);
  for (let ty = 0; ty < g.rows; ty++)
    for (let tx = 0; tx < g.cols; tx++) {
      const v = tv(tx, ty);
      if (v !== TILE.WATER && v !== TILE.SAND) continue;
      const px = tx * T,
        py = ty * T;
      x.fillStyle = v === TILE.WATER ? 'rgba(255,255,255,0.75)' : 'rgba(150,100,30,0.35)';
      const w = v === TILE.WATER ? 2.5 : 1.5;
      if (tv(tx, ty - 1) !== v && tv(tx, ty - 1)) x.fillRect(px, py, T, w);
      if (tv(tx, ty + 1) !== v && tv(tx, ty + 1)) x.fillRect(px, py + T - w, T, w);
      if (tv(tx - 1, ty) !== v && tv(tx - 1, ty)) x.fillRect(px, py, w, T);
      if (tv(tx + 1, ty) !== v && tv(tx + 1, ty)) x.fillRect(px + T - w, py, w, T);
      if (v === TILE.WATER && tv(tx, ty - 1) !== TILE.WATER) {
        x.fillStyle = 'rgba(0,40,90,0.25)';
        x.fillRect(px, py, T, 6);
      }
    }
  // 잔디결 텍스처 + 그린 패치 (잔디 칸만)
  x.save();
  x.beginPath();
  for (let ty = 0; ty < g.rows; ty++)
    for (let tx = 0; tx < g.cols; tx++) {
      const v = g.t[ty * g.cols + tx];
      if (v === TILE.GRASS || v >= TILE.SN) x.rect(tx * T, ty * T, T, T);
    }
  x.clip();
  for (const cu of h.cups) {
    const ctx0 = Math.floor(cu.x / T),
      cty0 = Math.floor(cu.y / T);
    const tv0 = g.t[cty0 * g.cols + ctx0];
    if (tv0 !== TILE.GRASS) continue;
    const R = T * 2.1;
    const gg = x.createRadialGradient(cu.x - 6, cu.y - 6, 4, cu.x, cu.y, R);
    gg.addColorStop(0, `hsl(${theme.hue - 4},${theme.sat + 8}%,${theme.light + 12}%)`);
    gg.addColorStop(0.85, `hsl(${theme.hue - 4},${theme.sat + 6}%,${theme.light + 8}%)`);
    gg.addColorStop(1, `hsla(${theme.hue},${theme.sat}%,${theme.light}%,0)`);
    x.fillStyle = gg;
    x.beginPath();
    x.arc(cu.x, cu.y, R, 0, 7);
    x.fill();
    x.strokeStyle = 'rgba(255,255,255,0.18)';
    x.lineWidth = 1.5;
    x.beginPath();
    x.arc(cu.x, cu.y, R * 0.86, 0, 7);
    x.stroke();
  }
  x.globalAlpha = 0.55;
  x.fillStyle = grassTexture(x);
  for (let ty = 0; ty < g.rows; ty++)
    for (let tx = 0; tx < g.cols; tx++) {
      const v = g.t[ty * g.cols + tx];
      if (v === TILE.GRASS || v >= TILE.SN) x.fillRect(tx * T, ty * T, T, T);
    }
  x.globalAlpha = 1;
  x.restore();
  // 조명 (바닥 전체)
  x.save();
  x.beginPath();
  for (let ty = 0; ty < g.rows; ty++) for (let tx = 0; tx < g.cols; tx++) if (g.t[ty * g.cols + tx] !== TILE.VOID) x.rect(tx * T, ty * T, T, T);
  x.clip();
  const lg = x.createRadialGradient(W * 0.15, -H * 0.05, 10, W * 0.4, H * 0.4, Math.max(W, H) * 1.15);
  lg.addColorStop(0, 'rgba(255,250,215,0.28)');
  lg.addColorStop(0.45, 'rgba(255,255,255,0.04)');
  lg.addColorStop(1, 'rgba(10,0,40,0.22)');
  x.fillStyle = lg;
  x.fillRect(0, 0, W, H);
  // 잔디 결 (미세 점)
  x.fillStyle = 'rgba(0,0,0,0.06)';
  for (let k = 0; k < g.rows * g.cols * 3; k++) x.fillRect(rng() * W, rng() * H, 1.2, 2.4);
  x.fillStyle = 'rgba(255,255,255,0.07)';
  for (let k = 0; k < g.rows * g.cols * 2; k++) x.fillRect(rng() * W, rng() * H, 1, 2);
  x.restore();
  // 벽 그림자 (광원 왼쪽 위)
  for (const s of h.segs) {
    const strong = s.ny === 1 || s.nx === 1;
    const d = strong ? 10 : 4;
    const a = strong ? 0.3 : 0.12;
    let gx0, gy0, gx1, gy1, rx, ry, rw, rh;
    if (s.ny) {
      rx = s.x1;
      rw = s.x2 - s.x1;
      ry = s.ny > 0 ? s.y1 : s.y1 - d;
      rh = d;
      gx0 = gx1 = 0;
      gy0 = s.y1;
      gy1 = s.y1 + s.ny * d;
    } else {
      ry = s.y1;
      rh = s.y2 - s.y1;
      rx = s.nx > 0 ? s.x1 : s.x1 - d;
      rw = d;
      gy0 = gy1 = 0;
      gx0 = s.x1;
      gx1 = s.x1 + s.nx * d;
    }
    const gr = x.createLinearGradient(gx0, gy0, gx1, gy1);
    gr.addColorStop(0, `rgba(0,0,0,${a})`);
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = gr;
    x.fillRect(rx, ry, rw, rh);
  }
  // 코스 밖 장식 (벽에 닿지 않는 칸)
  const isVoid = (tx, ty) => tx < 0 || ty < 0 || tx >= g.cols || ty >= g.rows || g.t[ty * g.cols + tx] === TILE.VOID;
  const decos = [];
  for (let ty = -MG; ty < g.rows + MG; ty++)
    for (let tx = -MG; tx < g.cols + MG; tx++) {
      let ok = true;
      for (let oy = -1; oy <= 1 && ok; oy++) for (let ox = -1; ox <= 1; ox++) if (!isVoid(tx + ox, ty + oy)) ok = false;
      if (!ok || rng() > 0.34) continue;
      decos.push([(tx + 0.5) * T + (rng() - 0.5) * 12, (ty + 0.5) * T + (rng() - 0.5) * 12, rng(), rng()]);
    }
  decos.sort((a, b) => a[1] - b[1]);
  for (const [dx, dy, r1, r2] of decos) drawDeco(x, dx, dy, r1, r2, world, theme);
  drawWalls(x, h, world.wall || 'wood', theme, rng);
  // 티 매트
  const tx = h.tee.x,
    ty = h.tee.y;
  x.fillStyle = 'rgba(0,0,0,0.18)';
  roundRect(x, tx - 15, ty - 11, 30, 24, 5);
  x.fill();
  x.fillStyle = `hsl(${theme.hue},50%,34%)`;
  roundRect(x, tx - 15, ty - 12, 30, 24, 5);
  x.fill();
  x.fillStyle = '#fff';
  for (const ox of [-10, 10]) {
    x.beginPath();
    x.arc(tx + ox, ty - 6, 2.2, 0, 7);
    x.fill();
  }
  return c;
}

const CLIFF = {
  meadow: ['#8a5a32', '#5e3a1c', '#3f2612'],
  desert: ['#c9864a', '#9a5c2c', '#6e3f1d'],
  snow: ['#a9c2dc', '#7f9dbf', '#56718f'],
  space: ['#4a3a8a', '#2e2166', '#1a1040'],
};
function mixHex(a, b, t) {
  const pa = parseInt(a.slice(1), 16),
    pb = parseInt(b.slice(1), 16);
  const ch = (sh) => Math.round(((pa >> sh) & 255) * (1 - t) + ((pb >> sh) & 255) * t);
  return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
}
// 잔디결 노이즈 텍스처 (한 번 그려 캐시)
let grassTex = null;
function grassTexture(x) {
  if (!grassTex) {
    const c = document.createElement('canvas');
    c.width = c.height = 96;
    const g = c.getContext('2d');
    const rng = mulberry32(4321);
    for (let k = 0; k < 900; k++) {
      const px = rng() * 96,
        py = rng() * 96,
        l = 2 + rng() * 3;
      g.strokeStyle = rng() < 0.5 ? 'rgba(0,40,0,0.22)' : 'rgba(255,255,220,0.2)';
      g.lineWidth = 0.8;
      g.beginPath();
      g.moveTo(px, py);
      g.lineTo(px + (rng() - 0.5) * 1.5, py - l);
      g.stroke();
    }
    grassTex = c;
  }
  return x.createPattern(grassTex, 'repeat');
}

// 이음매 없는 지면 패턴 (월드 좌표 320 단위 반복, 2배 해상도)
const PAT = 320;
export function makeGroundPattern(ctx, theme, world) {
  const c = document.createElement('canvas');
  c.width = c.height = PAT * 2;
  const x = c.getContext('2d');
  x.scale(2, 2);
  x.fillStyle = theme.voidA;
  x.fillRect(0, 0, PAT, PAT);
  for (let oy = -1; oy <= 1; oy++)
    for (let ox = -1; ox <= 1; ox++) {
      x.save();
      x.translate(ox * PAT, oy * PAT);
      drawGround(x, 0, 0, PAT, PAT, theme, world, mulberry32(1234), true);
      x.restore();
    }
  const rng = mulberry32(777);
  const decos = [];
  for (let k = 0; k < 7; k++) decos.push([rng() * PAT, rng() * PAT, rng(), rng()]);
  decos.sort((a, b) => a[1] - b[1]);
  for (let oy = -1; oy <= 1; oy++) for (let ox = -1; ox <= 1; ox++) for (const [dx, dy, r1, r2] of decos) drawDeco(x, dx + ox * PAT, dy + oy * PAT, r1, r2, world, theme);
  const p = ctx.createPattern(c, 'repeat');
  if (p.setTransform) p.setTransform(new DOMMatrix([0.5, 0, 0, 0.5, 0, 0]));
  return p;
}

function drawGround(x, x0, y0, w, h, theme, world, rng, noBase) {
  if (!noBase) {
    x.fillStyle = theme.voidA;
    x.fillRect(x0, y0, w, h);
  }
  const id = world.id;
  // 큰 얼룩으로 자연스러운 지면
  for (let k = 0; k < 60; k++) {
    x.fillStyle = k % 2 ? theme.voidB : theme.dot;
    x.globalAlpha = id === 'space' ? 0.35 : 0.5;
    x.beginPath();
    x.ellipse(x0 + rng() * w, y0 + rng() * h, 20 + rng() * 60, 14 + rng() * 40, rng() * 3, 0, 7);
    x.fill();
  }
  x.globalAlpha = 1;
  if (id === 'meadow') {
    x.strokeStyle = 'rgba(160,230,140,0.22)';
    x.lineWidth = 1.2;
    for (let k = 0; k < (w * h) / 500; k++) {
      const px = x0 + rng() * w,
        py = y0 + rng() * h;
      x.beginPath();
      x.moveTo(px, py);
      x.lineTo(px - 2, py - 5);
      x.moveTo(px + 2, py);
      x.lineTo(px + 3, py - 5);
      x.stroke();
    }
  } else if (id === 'desert') {
    x.strokeStyle = 'rgba(255,230,180,0.35)';
    x.lineWidth = 1.5;
    for (let k = 0; k < h / 14; k++) {
      const py = y0 + k * 14 + rng() * 6;
      x.beginPath();
      for (let px = x0; px <= x0 + w; px += 8) x.lineTo(px, py + Math.sin(px * 0.05 + k) * 4);
      x.stroke();
    }
  } else if (id === 'snow') {
    x.fillStyle = 'rgba(255,255,255,0.9)';
    for (let k = 0; k < (w * h) / 300; k++) x.fillRect(x0 + rng() * w, y0 + rng() * h, 1.5, 1.5);
    x.fillStyle = 'rgba(120,150,190,0.15)';
    for (let k = 0; k < 30; k++) {
      x.beginPath();
      x.ellipse(x0 + rng() * w, y0 + rng() * h, 30 + rng() * 40, 8 + rng() * 8, 0, 0, 7);
      x.fill();
    }
  } else if (id === 'space') {
    for (let k = 0; k < 8; k++) {
      const px = x0 + rng() * w,
        py = y0 + rng() * h,
        r = 60 + rng() * 120;
      const gr = x.createRadialGradient(px, py, 0, px, py, r);
      const hue = [280, 200, 320, 240][k % 4];
      gr.addColorStop(0, `hsla(${hue},80%,55%,0.22)`);
      gr.addColorStop(1, `hsla(${hue},80%,40%,0)`);
      x.fillStyle = gr;
      x.fillRect(px - r, py - r, r * 2, r * 2);
    }
    for (let k = 0; k < (w * h) / 180; k++) {
      x.fillStyle = `rgba(255,255,255,${0.3 + rng() * 0.7})`;
      const s = rng() < 0.1 ? 2 : 1;
      x.fillRect(x0 + rng() * w, y0 + rng() * h, s, s);
    }
  }
}

function shadowBlob(x, px, py, rx, ry, a = 0.28) {
  x.fillStyle = `rgba(0,0,0,${a})`;
  x.beginPath();
  x.ellipse(px, py, rx, ry, 0, 0, 7);
  x.fill();
}

function drawDeco(x, px, py, r1, r2, world, theme) {
  const id = world.id;
  if (id === 'meadow') {
    if (r1 < 0.55) {
      const s = 11 + r2 * 7;
      shadowBlob(x, px + 7, py + 9, s * 1.05, s * 0.6);
      x.fillStyle = '#5d4037';
      x.fillRect(px - 2, py, 4, 8);
      const cols = theme.hue > 120 ? ['#1b5e4a', '#2e7d62', '#4caf88'] : ['#1b5e20', '#2e7d32', '#4caf50'];
      x.fillStyle = cols[0];
      for (const [ox, oy, rr] of [[-s * 0.45, -2, 0.7], [s * 0.45, -2, 0.7], [0, -s * 0.5, 0.8]]) {
        x.beginPath();
        x.arc(px + ox, py + oy, s * rr, 0, 7);
        x.fill();
      }
      x.fillStyle = cols[1];
      x.beginPath();
      x.arc(px - 2, py - s * 0.45, s * 0.62, 0, 7);
      x.fill();
      x.fillStyle = cols[2];
      x.beginPath();
      x.arc(px - s * 0.3, py - s * 0.7, s * 0.28, 0, 7);
      x.fill();
    } else if (r1 < 0.8) {
      shadowBlob(x, px + 3, py + 4, 9, 4, 0.22);
      for (const [ox, oy, rr, col] of [[-5, 0, 5, '#2e7d32'], [4, 0, 6, '#388e3c'], [0, -4, 5, '#43a047']]) {
        x.fillStyle = col;
        x.beginPath();
        x.arc(px + ox, py + oy, rr, 0, 7);
        x.fill();
      }
    } else {
      const fc = ['#ff8a80', '#fff176', '#ffffff', '#ce93d8'][Math.floor(r2 * 4)];
      for (let k = 0; k < 3; k++) {
        const fx = px + (k - 1) * 6,
          fy = py + (k % 2) * 4;
        x.fillStyle = fc;
        for (let q = 0; q < 5; q++) {
          x.beginPath();
          x.arc(fx + Math.cos((q * 6.28) / 5) * 2, fy + Math.sin((q * 6.28) / 5) * 2, 1.6, 0, 7);
          x.fill();
        }
        x.fillStyle = '#ffb300';
        x.beginPath();
        x.arc(fx, fy, 1.2, 0, 7);
        x.fill();
      }
    }
  } else if (id === 'desert') {
    if (r1 < 0.45) {
      const hgt = 18 + r2 * 10;
      shadowBlob(x, px + 8, py + 4, 10, 4);
      x.lineCap = 'round';
      x.strokeStyle = '#2e7d32';
      x.lineWidth = 9;
      x.beginPath();
      x.moveTo(px, py);
      x.lineTo(px, py - hgt);
      x.moveTo(px, py - hgt * 0.45);
      x.lineTo(px - 8, py - hgt * 0.45);
      x.lineTo(px - 8, py - hgt * 0.75);
      x.moveTo(px, py - hgt * 0.6);
      x.lineTo(px + 8, py - hgt * 0.6);
      x.lineTo(px + 8, py - hgt * 0.85);
      x.stroke();
      x.strokeStyle = '#66bb6a';
      x.lineWidth = 2.5;
      x.beginPath();
      x.moveTo(px - 2, py - 2);
      x.lineTo(px - 2, py - hgt + 2);
      x.stroke();
      if (r2 > 0.6) {
        x.fillStyle = '#f06292';
        x.beginPath();
        x.arc(px, py - hgt - 3, 3, 0, 7);
        x.fill();
      }
    } else if (r1 < 0.8) {
      const s = 7 + r2 * 7;
      shadowBlob(x, px + 4, py + 4, s, s * 0.5);
      x.fillStyle = '#8d6e63';
      x.beginPath();
      x.moveTo(px - s, py + 2);
      x.lineTo(px - s * 0.6, py - s * 0.7);
      x.lineTo(px + s * 0.3, py - s);
      x.lineTo(px + s, py - s * 0.2);
      x.lineTo(px + s * 0.8, py + 3);
      x.closePath();
      x.fill();
      x.fillStyle = '#bcaaa4';
      x.beginPath();
      x.moveTo(px - s * 0.6, py - s * 0.7);
      x.lineTo(px + s * 0.3, py - s);
      x.lineTo(px + s * 0.1, py - s * 0.4);
      x.closePath();
      x.fill();
    } else {
      x.strokeStyle = '#a1887f';
      x.lineWidth = 1.5;
      for (let k = 0; k < 5; k++) {
        const a = -1.2 + k * 0.6;
        x.beginPath();
        x.moveTo(px, py);
        x.lineTo(px + Math.cos(a - 1.57) * 8, py + Math.sin(a - 1.57) * 8);
        x.stroke();
      }
    }
  } else if (id === 'snow') {
    if (r1 < 0.6) {
      const s = 12 + r2 * 8;
      shadowBlob(x, px + 8, py + 5, s * 0.9, s * 0.35, 0.18);
      x.fillStyle = '#5d4037';
      x.fillRect(px - 2, py - 2, 4, 6);
      for (let k = 0; k < 3; k++) {
        const w = s * (1 - k * 0.25),
          yb = py - k * s * 0.45;
        x.fillStyle = '#2e5e4e';
        x.beginPath();
        x.moveTo(px - w * 0.7, yb);
        x.lineTo(px + w * 0.7, yb);
        x.lineTo(px, yb - s * 0.75);
        x.closePath();
        x.fill();
        x.fillStyle = '#ffffff';
        x.beginPath();
        x.moveTo(px - w * 0.3, yb - s * 0.42);
        x.lineTo(px + w * 0.25, yb - s * 0.42);
        x.lineTo(px, yb - s * 0.75);
        x.closePath();
        x.fill();
      }
    } else {
      shadowBlob(x, px + 3, py + 5, 12, 4, 0.12);
      x.fillStyle = '#ffffff';
      x.beginPath();
      x.ellipse(px, py, 12, 7, 0, Math.PI, 0);
      x.fill();
      x.fillStyle = 'rgba(150,180,220,0.4)';
      x.beginPath();
      x.ellipse(px + 3, py, 8, 3, 0, 0, Math.PI);
      x.fill();
    }
  } else if (id === 'space') {
    if (r1 < 0.2) {
      const s = 8 + r2 * 12;
      const hue = Math.floor(r2 * 360);
      const gr = x.createRadialGradient(px - s * 0.4, py - s * 0.4, 1, px, py, s);
      gr.addColorStop(0, `hsl(${hue},70%,75%)`);
      gr.addColorStop(1, `hsl(${hue},60%,30%)`);
      x.fillStyle = gr;
      x.beginPath();
      x.arc(px, py, s, 0, 7);
      x.fill();
      if (r2 > 0.4) {
        x.strokeStyle = `hsla(${(hue + 40) % 360},80%,80%,0.8)`;
        x.lineWidth = 2;
        x.beginPath();
        x.ellipse(px, py, s * 1.7, s * 0.45, -0.35, 0, 7);
        x.stroke();
      }
    } else if (r1 < 0.45) {
      const s = 4 + r2 * 5;
      x.fillStyle = '#6d6a80';
      x.beginPath();
      for (let k = 0; k < 7; k++) {
        const a = (k / 7) * 6.28,
          rr = s * (0.75 + ((k * 37) % 10) / 30);
        x.lineTo(px + Math.cos(a) * rr, py + Math.sin(a) * rr);
      }
      x.closePath();
      x.fill();
      x.fillStyle = 'rgba(255,255,255,0.25)';
      x.beginPath();
      x.arc(px - s * 0.3, py - s * 0.3, s * 0.3, 0, 7);
      x.fill();
    } else {
      x.fillStyle = 'rgba(255,255,255,0.9)';
      const s = 2 + r2 * 3;
      x.beginPath();
      x.moveTo(px, py - s * 2);
      x.lineTo(px + s * 0.4, py - s * 0.4);
      x.lineTo(px + s * 2, py);
      x.lineTo(px + s * 0.4, py + s * 0.4);
      x.lineTo(px, py + s * 2);
      x.lineTo(px - s * 0.4, py + s * 0.4);
      x.lineTo(px - s * 2, py);
      x.lineTo(px - s * 0.4, py - s * 0.4);
      x.closePath();
      x.fill();
    }
  }
}

const WALLS = {
  wood: { side: '#7a4a24', top: '#c98c4f', hi: '#f0c48a', grain: '#8d5a2b' },
  sandstone: { side: '#9c6a3c', top: '#e7c28c', hi: '#fff0d0', grain: '#c99a62' },
  ice: { side: '#6aa3cc', top: '#e3f6ff', hi: '#ffffff', grain: '#a9dcf5' },
  neon: { side: '#140a2e', top: '#2a1a58', hi: '#6ef3ff', grain: '#ff4fd8' },
};

function drawWalls(x, h, kind, theme, rng) {
  const M = WALLS[kind] || WALLS.wood;
  const RW = 10;
  const path = (oy, extra = 0) => {
    x.beginPath();
    for (const s of h.segs) {
      const ox = -s.nx * (RW / 2 - 1 + extra),
        oyy = -s.ny * (RW / 2 - 1 + extra);
      x.moveTo(s.x1 + ox, s.y1 + oyy + oy);
      x.lineTo(s.x2 + ox, s.y2 + oyy + oy);
    }
  };
  x.lineCap = 'round';
  x.lineJoin = 'round';
  // 드롭 섀도 (블러)
  const HGT = kind === 'neon' ? 6 : 9;
  x.save();
  x.shadowColor = kind === 'neon' ? 'rgba(255,79,216,0.6)' : 'rgba(0,0,0,0.5)';
  x.shadowBlur = kind === 'neon' ? 16 : 10;
  x.shadowOffsetX = kind === 'neon' ? 0 : 4;
  x.shadowOffsetY = kind === 'neon' ? 0 : 6;
  x.strokeStyle = M.side;
  x.lineWidth = RW;
  path(HGT);
  x.stroke();
  x.restore();
  // 앞면/옆면: 높이만큼 쌓아 올린 블록 (아래로 갈수록 어두운 2톤)
  for (let k = HGT; k >= 1; k--) {
    x.strokeStyle = k > HGT * 0.55 ? mixHex(M.side, '#000000', 0.25) : M.side;
    x.lineWidth = RW;
    path(k);
    x.stroke();
  }
  // 윗면과 앞면 경계선
  x.strokeStyle = 'rgba(0,0,0,0.25)';
  x.lineWidth = RW + 1;
  path(0.8);
  x.stroke();
  // 윗면
  x.strokeStyle = M.top;
  x.lineWidth = RW;
  path(0);
  x.stroke();
  if (kind === 'wood') {
    // 나뭇결 + 못
    x.strokeStyle = M.grain;
    x.lineWidth = 1.3;
    x.setLineDash([14, 5, 4, 7]);
    path(0.5);
    x.stroke();
    x.setLineDash([]);
    x.fillStyle = '#5d3a1a';
    for (const s of h.segs)
      for (const [px, py] of [[s.x1, s.y1], [s.x2, s.y2]]) {
        x.beginPath();
        x.arc(px - s.nx * 4, py - s.ny * 4, 1.6, 0, 7);
        x.fill();
      }
  } else if (kind === 'sandstone') {
    x.strokeStyle = M.grain;
    x.lineWidth = 1.5;
    path(2);
    x.stroke();
    x.strokeStyle = 'rgba(255,255,255,0.35)';
    x.lineWidth = 1;
    x.setLineDash([3, 9]);
    path(-1.5);
    x.stroke();
    x.setLineDash([]);
  } else if (kind === 'ice') {
    x.strokeStyle = 'rgba(169,220,245,0.9)';
    x.lineWidth = 3;
    path(1.5);
    x.stroke();
    x.fillStyle = '#ffffff';
    for (const s of h.segs) {
      const n = Math.max(1, Math.floor(Math.hypot(s.x2 - s.x1, s.y2 - s.y1) / 40));
      for (let k = 0; k < n; k++) {
        const u = (k + rng()) / n;
        const px = s.x1 + (s.x2 - s.x1) * u - s.nx * 4,
          py = s.y1 + (s.y2 - s.y1) * u - s.ny * 4;
        x.fillRect(px - 0.5, py - 3, 1, 6);
        x.fillRect(px - 3, py - 0.5, 6, 1);
      }
    }
  } else if (kind === 'neon') {
    x.save();
    x.shadowColor = M.grain;
    x.shadowBlur = 8;
    x.strokeStyle = M.grain;
    x.lineWidth = 2.2;
    path(-2);
    x.stroke();
    x.shadowColor = M.hi;
    x.strokeStyle = M.hi;
    x.lineWidth = 1.2;
    path(2);
    x.stroke();
    x.restore();
  }
  // 하이라이트
  if (kind !== 'neon') {
    x.globalAlpha = 0.85;
    x.strokeStyle = M.hi;
    x.lineWidth = 2;
    path(-2.6);
    x.stroke();
    x.globalAlpha = 1;
  }
}

function roundRect(x, px, py, w, h, r) {
  x.beginPath();
  x.moveTo(px + r, py);
  x.arcTo(px + w, py, px + w, py + h, r);
  x.arcTo(px + w, py + h, px, py + h, r);
  x.arcTo(px, py + h, px, py, r);
  x.arcTo(px, py, px + w, py, r);
  x.closePath();
}

const TELE_COLS = [
  ['#e040fb', '#f8bbff'],
  ['#00e5ff', '#b2ffff'],
];

export class Renderer {
  constructor(canvas) {
    this.cv = canvas;
    this.ctx = canvas.getContext('2d');
    this.dpr = 1;
    this.w = 0;
    this.h = 0;
    this.layer = null;
    this.bumpFlash = new Map();
  }
  resize() {
    this.dpr = Math.min(2, window.devicePixelRatio || 1);
    const r = this.cv.getBoundingClientRect();
    this.w = Math.max(1, r.width);
    this.h = Math.max(1, r.height);
    this.cv.width = Math.round(this.w * this.dpr);
    this.cv.height = Math.round(this.h * this.dpr);
  }
  setHole(h, theme, world) {
    this.hole = h;
    this.theme = theme;
    this.world = world;
    const wd = world || { id: 'meadow', wall: 'wood' };
    const key = wd.id + theme.voidA;
    if (this.patKey !== key) {
      this.patKey = key;
      this.bgPattern = makeGroundPattern(this.ctx, theme, wd);
    }
    this.layer = renderStatic(h, theme, wd, 2, this.bgPattern);

    this.waterTiles = [];
    this.slopeTiles = [];
    const g = h.grid;
    for (let y = 0; y < g.rows; y++)
      for (let x = 0; x < g.cols; x++) {
        const v = g.t[y * g.cols + x];
        if (v === TILE.WATER) this.waterTiles.push([x, y]);
        if (v >= TILE.SN) this.slopeTiles.push([x, y, v]);
      }
  }
  flashBumper(bp) {
    this.bumpFlash.set(bp, 0.25);
  }

  draw(G, dt, time) {
    const c = this.ctx;
    const { dpr } = this;
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    const th = this.theme || THEMES[0];
    c.fillStyle = th.bg;
    c.fillRect(0, 0, this.w, this.h);
    const h = this.hole;
    if (!h || !G.st) return;
    const cam = G.cam;
    const sx = cam.shakeX || 0,
      sy = cam.shakeY || 0;
    c.save();
    c.translate(this.w / 2 + sx, cam.cy + sy);
    c.scale(cam.scale, cam.scale);
    c.translate(-cam.x, -cam.y);
    // 월드 바깥 배경 패턴
    if (this.bgPattern) {
      const x0 = cam.x - this.w / 2 / cam.scale - 40,
        y0 = cam.y - cam.cy / cam.scale - 40;
      c.fillStyle = this.bgPattern;
      c.fillRect(x0, y0, this.w / cam.scale + 80, this.h / cam.scale + 80);
    }
    c.drawImage(this.layer, -MG * T, -MG * T, (h.cols + MG * 2) * T, (h.rows + MG * 2) * T);
    const st = G.st;
    // 블랙홀 (우주 월드의 물)
    if (this.world && this.world.blackhole) {
      for (const [tx, ty] of this.waterTiles) {
        const cx = tx * T + T / 2,
          cy = ty * T + T / 2;
        c.strokeStyle = 'rgba(200,120,255,0.55)';
        c.lineWidth = 1.5;
        for (let k = 0; k < 3; k++) {
          const a = -time * 2.2 + k * 2.1 + tx + ty;
          c.beginPath();
          c.arc(cx, cy, 4 + k * 4, a, a + 2.2);
          c.stroke();
        }
      }
    }
    // 물결
    c.strokeStyle = this.world && this.world.blackhole ? 'rgba(0,0,0,0)' : 'rgba(255,255,255,0.45)';
    c.lineWidth = 1.5;
    c.beginPath();
    for (const [tx, ty] of this.waterTiles) {
      for (let k = 0; k < 2; k++) {
        const yy = ty * T + 10 + k * 12 + Math.sin(time * 1.5 + tx + k) * 2;
        const ph = time * 2 + tx * 1.3 + k * 2;
        c.moveTo(tx * T + 5, yy + Math.sin(ph) * 1.5);
        for (let xx = 6; xx <= T - 5; xx += 4) c.lineTo(tx * T + xx, yy + Math.sin(ph + xx * 0.3) * 1.5);
      }
    }
    c.stroke();
    // 경사 화살표
    c.fillStyle = 'rgba(255,255,255,0.4)';
    for (const [tx, ty, v] of this.slopeTiles) {
      const [dx, dy] = SLOPE_DIR[v];
      const off = ((time * 18) % 16) - 8;
      const cx = tx * T + T / 2 + dx * off,
        cy = ty * T + T / 2 + dy * off;
      c.save();
      c.beginPath();
      c.rect(tx * T, ty * T, T, T);
      c.clip();
      for (const k of [-16, 0, 16]) {
        const ax = cx + dx * k,
          ay = cy + dy * k;
        c.beginPath();
        c.moveTo(ax + dx * 6, ay + dy * 6);
        c.lineTo(ax - dx * 3 + dy * 7, ay - dy * 3 + dx * 7);
        c.lineTo(ax - dx * 0 + dy * 0, ay);
        c.lineTo(ax - dx * 3 - dy * 7, ay - dy * 3 - dx * 7);
        c.closePath();
        c.fill();
      }
      c.restore();
    }
    // 텔레포터
    h.teles.forEach((tp, i) => {
      const [c1, c2] = TELE_COLS[i % 2];
      for (const p of [tp.a, tp.b]) {
        c.fillStyle = 'rgba(0,0,0,0.25)';
        c.beginPath();
        c.ellipse(p.x + 1, p.y + 2, 14, 13, 0, 0, 7);
        c.fill();
        const gr = c.createRadialGradient(p.x, p.y, 1, p.x, p.y, 14);
        gr.addColorStop(0, '#fff');
        gr.addColorStop(0.4, c2);
        gr.addColorStop(1, c1);
        c.fillStyle = gr;
        c.beginPath();
        c.arc(p.x, p.y, 13, 0, 7);
        c.fill();
        c.strokeStyle = 'rgba(255,255,255,0.9)';
        c.lineWidth = 2;
        for (let k = 0; k < 3; k++) {
          c.beginPath();
          c.arc(p.x, p.y, 5 + k * 3, time * (3 + k) + k * 2, time * (3 + k) + k * 2 + 2.2);
          c.stroke();
        }
      }
    });
    // 코인
    h.coins.forEach((cn, i) => {
      if (st.coinTaken[i]) return;
      const w = Math.abs(Math.cos(time * 3 + i)) * 7 + 1;
      const by = Math.sin(time * 4 + i) * 1.5;
      c.fillStyle = 'rgba(0,0,0,0.2)';
      c.beginPath();
      c.ellipse(cn.x + 2, cn.y + 4, 7, 3, 0, 0, 7);
      c.fill();
      c.fillStyle = '#ffca28';
      c.beginPath();
      c.ellipse(cn.x, cn.y - 3 + by, w, 8, 0, 0, 7);
      c.fill();
      c.strokeStyle = '#f57f17';
      c.lineWidth = 1.5;
      c.stroke();
      c.fillStyle = 'rgba(255,255,255,0.7)';
      c.fillRect(cn.x - w * 0.3, cn.y - 7 + by, Math.max(1, w * 0.25), 6);
    });
    // 상자
    h.crates.forEach((cr, i) => {
      if (!st.crateAlive[i]) return;
      const s = cr.s,
        x0 = cr.x - s / 2,
        y0 = cr.y - s / 2;
      c.fillStyle = 'rgba(0,0,0,0.3)';
      c.fillRect(x0 + 3, y0 + 5, s, s);
      c.fillStyle = '#9c6230';
      c.fillRect(x0, y0 + 3, s, s - 3);
      c.fillStyle = '#d99a52';
      c.fillRect(x0, y0 - 1, s, s - 3);
      c.strokeStyle = '#7a4a1e';
      c.lineWidth = 2;
      c.strokeRect(x0 + 1, y0, s - 2, s - 5);
      c.beginPath();
      c.moveTo(x0 + 3, y0 + 2);
      c.lineTo(x0 + s - 3, y0 + s - 7);
      c.moveTo(x0 + s - 3, y0 + 2);
      c.lineTo(x0 + 3, y0 + s - 7);
      c.stroke();
    });
    // 컵
    h.cups.forEach((cu, i) => {
      const p = cupPos(h, st, i);
      const r = PHYS.cupR * G.M.cupMul;
      if (st.cupGone[i]) {
        c.strokeStyle = 'rgba(0,0,0,0.35)';
        c.lineWidth = 3;
        c.beginPath();
        c.moveTo(p.x - 7, p.y - 7);
        c.lineTo(p.x + 7, p.y + 7);
        c.moveTo(p.x + 7, p.y - 7);
        c.lineTo(p.x - 7, p.y + 7);
        c.stroke();
        return;
      }
      // 컨시드 거리 표시 (진짜 컵만)
      if (cu.real && G.run && h.cups.length === 1) {
        c.strokeStyle = 'rgba(255,255,255,0.22)';
        c.lineWidth = 1.2;
        c.setLineDash([2, 5]);
        c.beginPath();
        c.arc(p.x, p.y, PHYS.gimmeR * (G.mercy ? 1.3 : 1), 0, 7);
        c.stroke();
        c.setLineDash([]);
      }
      // 흡입 범위 힌트 (자석)
      if (G.M.pull > 1) {
        c.strokeStyle = 'rgba(255,82,82,0.25)';
        c.setLineDash([3, 4]);
        c.lineWidth = 1.5;
        c.beginPath();
        c.arc(p.x, p.y, r * PHYS.cupPullR * G.M.pull, 0, 7);
        c.stroke();
        c.setLineDash([]);
      }
      c.fillStyle = 'rgba(255,255,255,0.55)';
      c.beginPath();
      c.arc(p.x, p.y, r + 2.5, 0, 7);
      c.fill();
      const gr = c.createRadialGradient(p.x - 2, p.y - 3, 1, p.x, p.y, r);
      gr.addColorStop(0, '#000');
      gr.addColorStop(1, '#2b2b2b');
      c.fillStyle = gr;
      c.beginPath();
      c.arc(p.x, p.y, r, 0, 7);
      c.fill();
      c.fillStyle = 'rgba(0,0,0,0.5)';
      c.beginPath();
      c.arc(p.x, p.y + 1.5, r - 2, 0, Math.PI);
      c.fill();
      // 가짜 컵 단서: 테두리 금
      if (!cu.real) {
        c.strokeStyle = 'rgba(90,60,30,0.9)';
        c.lineWidth = 1.4;
        c.beginPath();
        c.moveTo(p.x + r * 0.5, p.y - r - 2);
        c.lineTo(p.x + r * 0.2, p.y - r + 3);
        c.lineTo(p.x + r * 0.6, p.y - r + 6);
        c.moveTo(p.x - r - 2, p.y + 2);
        c.lineTo(p.x - r + 4, p.y + 4);
        c.stroke();
      }
      // 진짜 컵 반짝임 (보스 입장 직후)
      if (cu.real && G.revealT > 0 && h.cups.length > 1) {
        const k = (time * 2) % 1;
        c.strokeStyle = `rgba(255,241,118,${1 - k})`;
        c.lineWidth = 3;
        c.beginPath();
        c.arc(p.x, p.y, r + 4 + k * 22, 0, 7);
        c.stroke();
      }
    });
    // 움직이는 벽
    for (const mv of h.movers) {
      const p = moverPos(mv, st.t);
      const hl = mv.len / 2;
      c.lineCap = 'round';
      c.strokeStyle = 'rgba(0,0,0,0.3)';
      c.lineWidth = 11;
      c.beginPath();
      c.moveTo(p.x - hl + 3, p.y + 6);
      c.lineTo(p.x + hl + 3, p.y + 6);
      c.stroke();
      c.strokeStyle = '#c2410c';
      c.beginPath();
      c.moveTo(p.x - hl, p.y + 3);
      c.lineTo(p.x + hl, p.y + 3);
      c.stroke();
      c.strokeStyle = '#ff8a50';
      c.beginPath();
      c.moveTo(p.x - hl, p.y);
      c.lineTo(p.x + hl, p.y);
      c.stroke();
      c.strokeStyle = '#fff';
      c.lineWidth = 2;
      c.setLineDash([5, 6]);
      c.beginPath();
      c.moveTo(p.x - hl + 2, p.y - 1);
      c.lineTo(p.x + hl - 2, p.y - 1);
      c.stroke();
      c.setLineDash([]);
    }
    // 범퍼
    for (const bp of h.bumpers) {
      let f = this.bumpFlash.get(bp) || 0;
      if (f > 0) {
        f -= dt;
        this.bumpFlash.set(bp, f);
      }
      const k = 1 + Math.max(0, f) * 1.2;
      c.fillStyle = 'rgba(0,0,0,0.32)';
      c.beginPath();
      c.ellipse(bp.x + 4, bp.y + 9, bp.r + 2, bp.r * 0.8, 0, 0, 7);
      c.fill();
      // 원기둥 옆면
      c.fillStyle = '#880e4f';
      c.beginPath();
      c.arc(bp.x, bp.y + 7, bp.r * k, 0, Math.PI);
      c.lineTo(bp.x - bp.r * k, bp.y);
      c.arc(bp.x, bp.y, bp.r * k, Math.PI, 0, true);
      c.closePath();
      c.fill();
      c.fillStyle = 'rgba(255,255,255,0.18)';
      c.fillRect(bp.x - bp.r * k * 0.7, bp.y, 3, 6);
      const tg = c.createRadialGradient(bp.x - 3, bp.y - 4, 1, bp.x, bp.y, bp.r * k);
      tg.addColorStop(0, f > 0 ? '#fffde7' : '#ff8ab4');
      tg.addColorStop(1, f > 0 ? '#fff176' : '#e91e63');
      c.fillStyle = tg;
      c.beginPath();
      c.arc(bp.x, bp.y, bp.r * k, 0, 7);
      c.fill();
      c.fillStyle = '#fff';
      c.beginPath();
      c.arc(bp.x, bp.y, bp.r * 0.5 * k, 0, 7);
      c.fill();
      c.fillStyle = 'rgba(255,255,255,0.6)';
      c.beginPath();
      c.arc(bp.x - 3, bp.y - 4, 2.5, 0, 7);
      c.fill();
    }
    // 에코 궤적
    if (G.echo && G.echo.length > 1) {
      c.strokeStyle = 'rgba(206,147,216,0.55)';
      c.lineWidth = 3;
      c.setLineDash([2, 6]);
      c.lineCap = 'round';
      c.beginPath();
      G.echo.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])));
      c.stroke();
      c.setLineDash([]);
      const e = G.echo[G.echo.length - 1];
      c.fillStyle = 'rgba(206,147,216,0.45)';
      c.beginPath();
      c.arc(e[0], e[1], PHYS.ballR, 0, 7);
      c.fill();
    }
    // 조준
    if (G.aim && G.aim.power > 0) this.drawAim(c, G, time);
    // 공
    for (const b of st.balls) this.drawBall(c, b, G, time);
    // 풍차 (공 위로)
    for (const m of h.mills) {
      const a0 = millAngle(m, st.t);
      for (const pass of [0, 1]) {
        for (let k = 0; k < m.arms; k++) {
          const a = a0 + (k * Math.PI * 2) / m.arms;
          const ex = m.x + Math.cos(a) * m.len,
            ey = m.y + Math.sin(a) * m.len;
          c.lineCap = 'round';
          if (pass === 0) {
            c.strokeStyle = 'rgba(0,0,0,0.28)';
            c.lineWidth = m.bladeW + 3;
            c.beginPath();
            c.moveTo(m.x + 5, m.y + 8);
            c.lineTo(ex + 5, ey + 8);
            c.stroke();
          } else {
            c.strokeStyle = k % 2 ? '#9e9e9e' : '#8e1b1b';
            c.lineWidth = m.bladeW;
            c.beginPath();
            c.moveTo(m.x, m.y + 3);
            c.lineTo(ex, ey + 3);
            c.stroke();
            c.strokeStyle = k % 2 ? '#fafafa' : '#ef5350';
            c.lineWidth = m.bladeW;
            c.beginPath();
            c.moveTo(m.x, m.y);
            c.lineTo(ex, ey);
            c.stroke();
            c.strokeStyle = 'rgba(0,0,0,0.15)';
            c.lineWidth = 1;
            c.beginPath();
            c.moveTo(m.x + Math.cos(a + 1.57) * 1.5, m.y + Math.sin(a + 1.57) * 1.5);
            c.lineTo(ex + Math.cos(a + 1.57) * 1.5, ey + Math.sin(a + 1.57) * 1.5);
            c.stroke();
          }
        }
      }
      c.fillStyle = '#3e2723';
      c.beginPath();
      c.arc(m.x, m.y + 5, m.hubR, 0, 7);
      c.fill();
      c.fillRect(m.x - m.hubR, m.y, m.hubR * 2, 5);
      c.fillStyle = '#8d6e63';
      c.beginPath();
      c.arc(m.x, m.y, m.hubR, 0, 7);
      c.fill();
      c.fillStyle = '#ffd54f';
      c.beginPath();
      c.arc(m.x, m.y, m.hubR * 0.4, 0, 7);
      c.fill();
    }
    // 깃발 (맨 위)
    h.cups.forEach((cu, i) => {
      if (st.cupGone[i]) return;
      const p = cupPos(h, st, i);
      const pole = 38;
      let fade = 1;
      // 공이 가까우면 깃발 반투명
      for (const b of st.balls) if (Math.hypot(b.x - p.x, b.y - (p.y - 20)) < 30) fade = 0.45;
      c.globalAlpha = fade;
      c.strokeStyle = 'rgba(0,0,0,0.25)';
      c.lineWidth = 2.5;
      c.beginPath();
      c.moveTo(p.x, p.y);
      c.lineTo(p.x + 14, p.y + 8);
      c.stroke();
      if (cu.real) drawFlag(c, p.x, p.y, pole, G.cos ? G.cos.flag : { id: 'theme' }, th.flag, time + i);
      else {
        // 가짜 컵 단서: 깃발이 반대로 휘날림
        c.save();
        c.translate(p.x, 0);
        c.scale(-1, 1);
        drawFlag(c, 0, p.y, pole, G.cos ? G.cos.flag : { id: 'theme' }, th.flag, -time + i);
        c.restore();
      }
      c.globalAlpha = 1;
    });
    G.fx.draw(c);
    c.restore();
    this.drawScreen(c, G, time);
  }

  drawAim(c, G, time) {
    const b = G.st.balls[0];
    const a = G.aim;
    const hue = 120 * (1 - a.power);
    const col = `hsl(${hue},95%,${60 - a.power * 8}%)`;
    // 새총 고무줄: 공 양옆 두 점에서 당긴 지점으로
    const pull = 10 + a.power * 48;
    const px = b.x - a.dx * pull,
      py = b.y - a.dy * pull;
    const nx = -a.dy,
      ny = a.dx;
    const fork = 13;
    c.lineCap = 'round';
    for (const pass of [0, 1]) {
      c.strokeStyle = pass ? col : 'rgba(0,0,0,0.3)';
      c.lineWidth = (pass ? 3 : 5.5) + a.power * 3;
      c.beginPath();
      c.moveTo(b.x + nx * fork + (pass ? 0 : 1.5), b.y + ny * fork + (pass ? 0 : 2.5));
      c.lineTo(px + (pass ? 0 : 1.5), py + (pass ? 0 : 2.5));
      c.lineTo(b.x - nx * fork + (pass ? 0 : 1.5), b.y - ny * fork + (pass ? 0 : 2.5));
      c.stroke();
    }
    c.fillStyle = '#5d4037';
    for (const sgn of [1, -1]) {
      c.beginPath();
      c.arc(b.x + nx * fork * sgn, b.y + ny * fork * sgn, 3, 0, 7);
      c.fill();
    }
    c.fillStyle = col;
    c.beginPath();
    c.arc(px, py, 4 + a.power * 2, 0, 7);
    c.fill();
    // 미리보기 점선
    if (a.path) {
      // 점선은 끝으로 갈수록 흐려짐
      const pts = a.path.pts;
      let total = 0;
      for (let i = 1; i < pts.length; i++) total += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      const full = Math.max(total, a.path.fullLen || total);
      const gap = 11;
      let d = (time * 28) % gap;
      let acc = 0;
      for (let i = 1; i < pts.length; i++) {
        const [x0, y0] = pts[i - 1],
          [x1, y1] = pts[i];
        const L = Math.hypot(x1 - x0, y1 - y0);
        while (d <= acc + L) {
          const u = (d - acc) / (L || 1);
          const f = d / full;
          c.fillStyle = `hsla(${hue},95%,${70 - a.power * 10}%,${Math.max(0, 0.95 * (1 - f * f))})`;
          c.beginPath();
          c.arc(x0 + (x1 - x0) * u, y0 + (y1 - y0) * u, (2 + a.power * 1.8) * (1 - f * 0.5), 0, 7);
          c.fill();
          d += gap;
        }
        acc += L;
      }
      // 반사점
      c.fillStyle = '#fff';
      for (let i = 1; i < a.path.pts.length - 1; i++) {
        c.beginPath();
        c.arc(a.path.pts[i][0], a.path.pts[i][1], 3, 0, 7);
        c.fill();
      }
      if (a.path.end) {
        const e = pts[pts.length - 1];
        c.strokeStyle = 'rgba(255,255,255,0.55)';
        c.lineWidth = 1.5;
        c.beginPath();
        c.arc(e[0], e[1], PHYS.ballR, 0, 7);
        c.stroke();
      }
    }
    // 파워 링
    c.strokeStyle = 'rgba(0,0,0,0.35)';
    c.lineWidth = 5;
    c.beginPath();
    c.arc(b.x, b.y, 16, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2);
    c.stroke();
    c.strokeStyle = col;
    c.lineWidth = 3.5;
    c.beginPath();
    c.arc(b.x, b.y, 16, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * a.power);
    c.stroke();
  }

  drawBall(c, b, G, time) {
    if (b.dead) return;
    const r = PHYS.ballR;
    let s = 1,
      bx = b.x,
      by = b.y;
    if (b.sunk) {
      const u = Math.min(1, (b.sinkT || 0) / 0.35);
      s = 1 - u * 0.8;
      bx = b.x + (b.sinkX - b.x) * u;
      by = b.y + (b.sinkY - b.y) * u;
      if (u >= 1) return;
    }
    if (b.waterSink) {
      s = Math.max(0, 1 - b.waterSink * 2);
      if (s <= 0) return;
    }
    // 잔상
    if (b.trail && b.trail.length > 1) {
      for (let i = 0; i < b.trail.length; i++) {
        const p = b.trail[i];
        const u = i / b.trail.length;
        const tr = G.cos ? G.cos.trail : { color: '255,255,255' };
        c.fillStyle = tr.rainbow ? `hsla(${(i * 30 + time * 200) % 360},90%,65%,${0.4 * u})` : `rgba(${tr.color},${(tr.id === 'basic' ? 0.28 : 0.45) * u})`;
        c.beginPath();
        c.arc(p[0], p[1], r * (0.4 + 0.6 * u), 0, 7);
        c.fill();
      }
    }
    const ghost = b.ghostComp >= 0;
    c.globalAlpha = ghost ? 0.5 : 1;
    c.fillStyle = 'rgba(0,0,0,0.3)';
    c.beginPath();
    c.ellipse(bx + 2.5, by + 3.5, r * s, r * 0.8 * s, 0, 0, 7);
    c.fill();
    drawBallSkin(c, bx, by, r * s, G.cos ? G.cos.ball : { colors: ['#fff', '#bdbdbd'] }, time);
    if (b.skimming) {
      c.strokeStyle = 'rgba(255,255,255,0.8)';
      c.lineWidth = 1.5;
      c.beginPath();
      c.arc(bx, by, r + 4 + Math.sin(time * 20) * 1.5, 0, 7);
      c.stroke();
    }
    c.globalAlpha = 1;
  }

  drawScreen(c, G, time) {
    if (!this.vig || this.vigW !== this.w || this.vigH !== this.h) {
      this.vigW = this.w;
      this.vigH = this.h;
      this.vig = c.createRadialGradient(this.w / 2, this.h * 0.45, Math.min(this.w, this.h) * 0.35, this.w / 2, this.h * 0.5, Math.max(this.w, this.h) * 0.75);
      this.vig.addColorStop(0, 'rgba(0,0,0,0)');
      this.vig.addColorStop(1, 'rgba(0,0,0,0.35)');
    }
    c.fillStyle = this.vig;
    c.fillRect(0, 0, this.w, this.h);
    // 바람 표시
    const h = this.hole;
    if (h.wind && !G.M.windbreak && G.view) {
      const x = 34,
        y = G.view.bottom - 40;
      const a = Math.atan2(h.wind.y, h.wind.x);
      c.fillStyle = 'rgba(0,0,0,0.35)';
      c.beginPath();
      c.arc(x, y, 22, 0, 7);
      c.fill();
      c.save();
      c.translate(x, y);
      c.rotate(a);
      c.strokeStyle = '#fff';
      c.fillStyle = '#fff';
      c.lineWidth = 3;
      const wob = Math.sin(time * 6) * 2;
      c.beginPath();
      c.moveTo(-12, wob * 0.3);
      c.lineTo(8, 0);
      c.stroke();
      c.beginPath();
      c.moveTo(13, 0);
      c.lineTo(5, -6);
      c.lineTo(5, 6);
      c.fill();
      c.restore();
      c.fillStyle = '#fff';
      c.font = `700 10px ${FONT}`;
      c.textAlign = 'center';
      c.fillText('바람', x, y - 28);
    }
    // 드래그 시작점 (취소 영역)
    if (G.aim && G.aim.sx != null) {
      c.strokeStyle = G.aim.power > 0 ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.8)';
      c.lineWidth = 2;
      c.setLineDash([4, 4]);
      c.beginPath();
      c.arc(G.aim.sx, G.aim.sy, 16, 0, 7);
      c.stroke();
      c.setLineDash([]);
      if (G.aim.power > 0) {
        c.strokeStyle = 'rgba(255,255,255,0.3)';
        c.lineWidth = 2;
        c.beginPath();
        c.moveTo(G.aim.sx, G.aim.sy);
        c.lineTo(G.aim.cx, G.aim.cy);
        c.stroke();
        c.fillStyle = 'rgba(255,255,255,0.9)';
        c.beginPath();
        c.arc(G.aim.cx, G.aim.cy, 6, 0, 7);
        c.fill();
        c.font = `800 15px ${FONT}`;
        c.textAlign = 'center';
        c.lineWidth = 3;
        c.strokeStyle = 'rgba(0,0,0,0.5)';
        const txt = Math.round(G.aim.power * 100) + '%';
        c.strokeText(txt, G.aim.cx, G.aim.cy - 20);
        c.fillStyle = '#fff';
        c.fillText(txt, G.aim.cx, G.aim.cy - 20);
      } else {
        c.font = `700 12px ${FONT}`;
        c.textAlign = 'center';
        c.fillStyle = 'rgba(255,255,255,0.9)';
        c.fillText('취소', G.aim.sx, G.aim.sy - 24);
      }
    }
    // 튜토리얼: 컵 스포트라이트
    if (G.spot === 'cup' && this.hole) {
      const ci = this.hole.cups.findIndex((q) => q.real);
      const p = cupPos(this.hole, G.st, ci);
      const [sx, sy] = G.toScreen(p.x, p.y - 12);
      const r = 58 + Math.sin(time * 4) * 4;
      c.fillStyle = 'rgba(0,0,0,0.55)';
      c.beginPath();
      c.rect(0, 0, this.w, this.h);
      c.arc(sx, sy, r, 0, Math.PI * 2, true);
      c.fill('evenodd');
      c.strokeStyle = '#ffd54f';
      c.lineWidth = 3;
      c.setLineDash([8, 6]);
      c.lineDashOffset = -time * 20;
      c.beginPath();
      c.arc(sx, sy, r, 0, 7);
      c.stroke();
      c.setLineDash([]);
    }
    // 첫 샷 손가락 고스트 (당겼다 놓기 시범)
    if (G.showGhost && G.showGhost()) {
      const b = G.st.balls[0];
      const ci = this.hole.cups.findIndex((q) => q.real);
      const p = cupPos(this.hole, G.st, ci);
      const [bx, by] = G.toScreen(b.x, b.y);
      const [cx, cy] = G.toScreen(p.x, p.y);
      let dx = cx - bx,
        dy = cy - by;
      const L = Math.hypot(dx, dy) || 1;
      dx /= L;
      dy /= L;
      const T0 = (time % 2.4) / 2.4;
      const drag = T0 < 0.15 ? 0 : T0 < 0.6 ? (T0 - 0.15) / 0.45 : T0 < 0.72 ? 1 : -1;
      const sx = bx + dx * 30,
        sy = by + dy * 30;
      if (drag >= 0) {
        const fx = sx - dx * 90 * drag,
          fy = sy - dy * 90 * drag;
        c.strokeStyle = 'rgba(255,255,255,0.7)';
        c.setLineDash([5, 5]);
        c.lineWidth = 2;
        c.beginPath();
        c.moveTo(sx, sy);
        c.lineTo(fx, fy);
        c.stroke();
        c.setLineDash([]);
        c.globalAlpha = 0.9;
        c.fillStyle = '#fff';
        c.strokeStyle = 'rgba(0,0,0,0.35)';
        c.lineWidth = 3;
        c.beginPath();
        c.arc(fx, fy, 16 - drag * 2, 0, 7);
        c.fill();
        c.stroke();
        c.fillStyle = 'rgba(255,183,77,0.9)';
        c.beginPath();
        c.ellipse(fx, fy - 6, 6, 5, 0, 0, 7);
        c.fill();
        c.globalAlpha = 1;
      } else {
        const k = (T0 - 0.72) / 0.28;
        c.strokeStyle = `rgba(255,255,255,${1 - k})`;
        c.lineWidth = 3;
        c.beginPath();
        c.arc(sx - dx * 90, sy - dy * 90, 16 + k * 20, 0, 7);
        c.stroke();
        c.fillStyle = `rgba(255,241,118,${1 - k})`;
        c.beginPath();
        c.moveTo(bx, by);
        c.lineTo(bx + dx * 60 * k + dy * 6, by + dy * 60 * k - dx * 6);
        c.lineTo(bx + dx * 60 * k - dy * 6, by + dy * 60 * k + dx * 6);
        c.fill();
      }
    }
    // 큰 스코어 텍스트: 화면 위쪽 중앙 고정, 불투명 외곽선
    const bt = G.bigText;
    if (bt) {
      const u = bt.t;
      const pop = u < 0.12 ? 0.6 + (u / 0.12) * 0.55 : u < 0.25 ? 1.15 - ((u - 0.12) / 0.13) * 0.15 : 1;
      const alpha = bt.t > bt.life * 0.85 ? Math.max(0, (bt.life - bt.t) / (bt.life * 0.15)) : 1;
      const y0 = (G.view ? G.view.top : 100) + 58;
      c.save();
      c.globalAlpha = alpha;
      c.translate(this.w / 2, y0);
      c.scale(pop, pop);
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      const size = Math.min(50, (this.w * 0.88) / Math.max(4, bt.text.length * 0.62));
      c.font = `900 ${size}px ${FONT}`;
      if (bt.bad) {
        const w = c.measureText(bt.text).width + 40;
        c.fillStyle = '#c62828';
        c.beginPath();
        c.roundRect(-w / 2, -size * 0.72, w, size * 1.44, 18);
        c.fill();
      }
      c.shadowColor = 'rgba(0,0,0,0.55)';
      c.shadowBlur = 8;
      c.shadowOffsetY = 5;
      c.lineJoin = 'round';
      c.lineWidth = 12;
      c.strokeStyle = '#ffffff';
      c.strokeText(bt.text, 0, 0);
      c.shadowColor = 'transparent';
      c.lineWidth = 3;
      c.strokeStyle = 'rgba(0,0,0,0.35)';
      c.strokeText(bt.text, 0, 0);
      const gr = c.createLinearGradient(0, -size / 2, 0, size / 2);
      gr.addColorStop(0, bt.c1);
      gr.addColorStop(1, bt.c2);
      c.fillStyle = bt.bad ? '#ffffff' : gr;
      if (bt.bad) {
        c.lineWidth = 12;
        c.strokeStyle = '#ffffff';
      }
      c.fillStyle = bt.bad ? '#c62828' : gr;
      c.fillText(bt.text, 0, 0);
      if (bt.sub) {
        c.font = `800 17px ${FONT}`;
        const w2 = c.measureText(bt.sub).width + 28;
        c.fillStyle = 'rgba(20,20,30,0.85)';
        c.beginPath();
        c.roundRect(-w2 / 2, size * 0.78 - 15, w2, 30, 15);
        c.fill();
        c.fillStyle = '#fff';
        c.fillText(bt.sub, 0, size * 0.78 + 1);
      }
      c.restore();
    }
  }
}
