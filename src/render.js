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

export function renderStatic(h, theme, S = 2) {
  const W = h.cols * T,
    H = h.rows * T;
  const c = document.createElement('canvas');
  c.width = W * S;
  c.height = H * S;
  const x = c.getContext('2d');
  x.scale(S, S);
  const rng = mulberry32(h.seed ^ (h.idx * 977));
  const g = h.grid;
  // 벽 영역 (산울타리 패턴)
  x.fillStyle = theme.voidA;
  x.fillRect(0, 0, W, H);
  for (let ty = 0; ty < g.rows; ty++)
    for (let tx = 0; tx < g.cols; tx++) {
      if (g.t[ty * g.cols + tx] !== TILE.VOID) continue;
      x.fillStyle = (tx + ty) % 2 ? theme.voidA : theme.voidB;
      x.fillRect(tx * T, ty * T, T, T);
      x.fillStyle = theme.dot;
      for (let k = 0; k < 4; k++) {
        x.beginPath();
        x.arc(tx * T + rng() * T, ty * T + rng() * T, theme.stars ? 0.6 + rng() * 1.2 : 2 + rng() * 3, 0, 7);
        x.fill();
      }
    }
  // 바닥 타일
  for (let ty = 0; ty < g.rows; ty++)
    for (let tx = 0; tx < g.cols; tx++) {
      const v = g.t[ty * g.cols + tx];
      if (v === TILE.VOID) continue;
      const px = tx * T,
        py = ty * T;
      const chk = (tx + ty) % 2;
      const L = theme.light + (1 - ty / g.rows) * 7 + (chk ? 3.5 : 0);
      if (v === TILE.GRASS || v >= TILE.SN) {
        x.fillStyle = `hsl(${theme.hue + (v >= TILE.SN ? -14 : 0)},${theme.sat}%,${L - (v >= TILE.SN ? 4 : 0)}%)`;
        x.fillRect(px, py, T, T);
        // 잔디 결
        x.fillStyle = 'rgba(255,255,255,0.05)';
        x.fillRect(px, py, T, T / 2);
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
  // 전체 그라데이션 광택
  const gl = x.createLinearGradient(0, 0, W, H);
  gl.addColorStop(0, 'rgba(255,255,255,0.08)');
  gl.addColorStop(1, 'rgba(0,0,0,0.08)');
  x.fillStyle = gl;
  x.fillRect(0, 0, W, H);
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
  // 입체 레일: 옆면 -> 윗면 -> 하이라이트
  const RW = 9;
  const railPass = (col, w, oy, alpha = 1) => {
    x.globalAlpha = alpha;
    x.strokeStyle = col;
    x.lineWidth = w;
    x.lineCap = 'round';
    x.beginPath();
    for (const s of h.segs) {
      const ox = -s.nx * (RW / 2 - 1),
        oyy = -s.ny * (RW / 2 - 1);
      x.moveTo(s.x1 + ox, s.y1 + oyy + oy);
      x.lineTo(s.x2 + ox, s.y2 + oyy + oy);
    }
    x.stroke();
    x.globalAlpha = 1;
  };
  railPass('rgba(0,0,0,0.25)', RW + 2, 5);
  railPass(theme.railSide, RW, 3.5);
  railPass(theme.rail, RW, 0);
  railPass('#ffffff', 2.2, -2.2, 0.8);
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
    this.layer = renderStatic(h, theme, 2);
    // 월드 밖 배경 패턴 (벽 영역과 같은 무늬)
    const pc = document.createElement('canvas');
    pc.width = pc.height = T * 2;
    const px = pc.getContext('2d');
    const rng = mulberry32(99);
    for (let k = 0; k < 4; k++) {
      px.fillStyle = (k === 0 || k === 3) ? theme.voidB : theme.voidA;
      px.fillRect((k % 2) * T, (k >> 1) * T, T, T);
    }
    px.fillStyle = theme.dot;
    for (let k = 0; k < 12; k++) {
      px.beginPath();
      px.arc(rng() * T * 2, rng() * T * 2, theme.stars ? 0.6 + rng() * 1.2 : 2 + rng() * 3, 0, 7);
      px.fill();
    }
    this.bgPattern = this.ctx.createPattern(pc, 'repeat');
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
    c.drawImage(this.layer, 0, 0, h.cols * T, h.rows * T);
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
      c.fillStyle = 'rgba(0,0,0,0.3)';
      c.beginPath();
      c.arc(bp.x + 3, bp.y + 5, bp.r + 1, 0, 7);
      c.fill();
      c.fillStyle = '#ad1457';
      c.beginPath();
      c.arc(bp.x, bp.y + 3, bp.r * k, 0, 7);
      c.fill();
      c.fillStyle = f > 0 ? '#fff59d' : '#ff4f8b';
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
      c.fillStyle = '#5d4037';
      c.beginPath();
      c.arc(m.x, m.y + 2, m.hubR, 0, 7);
      c.fill();
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
      drawFlag(c, p.x, p.y, pole, G.cos ? G.cos.flag : { id: 'theme' }, th.flag, time + i);
      c.globalAlpha = 1;
    });
    G.fx.draw(c);
    c.restore();
    this.drawScreen(c, G, time);
  }

  drawAim(c, G, time) {
    const b = G.st.balls[0];
    const a = G.aim;
    const col = a.power < 0.5 ? '#b9f6ca' : a.power < 0.8 ? '#ffe57f' : '#ff8a80';
    // 당김 고무줄
    const pull = a.power * 40;
    c.strokeStyle = 'rgba(0,0,0,0.25)';
    c.lineWidth = 5;
    c.lineCap = 'round';
    c.beginPath();
    c.moveTo(b.x, b.y);
    c.lineTo(b.x - a.dx * pull, b.y - a.dy * pull);
    c.stroke();
    c.strokeStyle = col;
    c.lineWidth = 3;
    c.stroke();
    // 미리보기 점선
    if (a.path) {
      c.strokeStyle = 'rgba(255,255,255,0.9)';
      c.lineWidth = 2.5;
      c.setLineDash([6, 6]);
      c.lineDashOffset = -time * 30;
      c.beginPath();
      a.path.pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])));
      c.stroke();
      c.setLineDash([]);
      c.lineDashOffset = 0;
      // 반사점
      c.fillStyle = '#fff';
      for (let i = 1; i < a.path.pts.length - 1; i++) {
        c.beginPath();
        c.arc(a.path.pts[i][0], a.path.pts[i][1], 3, 0, 7);
        c.fill();
      }
      const e = a.path.pts[a.path.pts.length - 1];
      c.strokeStyle = 'rgba(255,255,255,0.7)';
      c.lineWidth = 1.5;
      c.beginPath();
      c.arc(e[0], e[1], PHYS.ballR, 0, 7);
      c.stroke();
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
    // 큰 텍스트 팝
    const bt = G.bigText;
    if (bt) {
      const u = bt.t / bt.life;
      const pop = u < 0.12 ? 0.3 + (u / 0.12) * 0.9 : u < 0.2 ? 1.2 - ((u - 0.12) / 0.08) * 0.2 : 1;
      const alpha = u > 0.8 ? (1 - u) / 0.2 : 1;
      c.save();
      c.globalAlpha = alpha;
      c.translate(this.w / 2, this.h * 0.4);
      c.scale(pop, pop);
      c.rotate(Math.sin(time * 3) * 0.03);
      c.textAlign = 'center';
      c.textBaseline = 'middle';
      const size = Math.min(52, (this.w * 0.9) / Math.max(4, bt.text.length * 0.62));
      c.font = `900 ${size}px ${FONT}`;
      c.lineWidth = 10;
      c.strokeStyle = 'rgba(0,0,0,0.45)';
      c.strokeText(bt.text, 0, 4);
      c.lineWidth = 7;
      c.strokeStyle = '#fff';
      c.strokeText(bt.text, 0, 0);
      const gr = c.createLinearGradient(0, -size / 2, 0, size / 2);
      gr.addColorStop(0, bt.c1);
      gr.addColorStop(1, bt.c2);
      c.fillStyle = gr;
      c.fillText(bt.text, 0, 0);
      if (bt.sub) {
        c.font = `800 18px ${FONT}`;
        c.lineWidth = 4;
        c.strokeStyle = 'rgba(0,0,0,0.5)';
        c.strokeText(bt.sub, 0, size * 0.75);
        c.fillStyle = '#fff';
        c.fillText(bt.sub, 0, size * 0.75);
      }
      c.restore();
    }
  }
}
