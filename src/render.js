// 캔버스 렌더링: 아레나, 유닛, 타워, 이펙트, HUD, 카드 UI
import { ARENA, BATTLE, CARDS, ARENAS } from './config.js';
import { drawIcon, iconBitmap, star } from './icons.js';

export const FONT = 'system-ui, -apple-system, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';
const { W, H, TILT, RIVER_Y, BRIDGES, BRIDGE_HALF } = ARENA;
const TEAM = [
  { main: '#3d86ea', dark: '#1f4f9e', light: '#9fd0ff' },
  { main: '#e5484d', dark: '#9a2230', light: '#ffb0a0' },
];
const RARITY = { common: '#c2cddd', rare: '#f2a444', epic: '#c77af2' };

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function hash(n) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

export class Renderer {
  constructor(canvas) {
    this.cv = canvas;
    this.ctx = canvas.getContext('2d');
    this.shakeAmt = 0;
    this.shakeX = 0;
    this.shakeY = 0;
    this.time = 0;
    this.crownFx = [];
    this.crownPop = [0, 0];
    this.crownShown = [0, 0];
    this.banner = null;
    this.endBanner = null;
    this.cardCache = new Map();
    this.cardShake = [0, 0, 0, 0];
    this.denyText = null;
    this.themeIdx = 0;
  }

  setTheme(i) {
    if (i === this.themeIdx && this.arenaCache) return;
    this.themeIdx = i;
    if (this.L) this.buildArena();
  }

  resize(w, h, dpr, safe) {
    this.w = w;
    this.h = h;
    this.dpr = dpr;
    this.cv.width = Math.round(w * dpr);
    this.cv.height = Math.round(h * dpr);
    this.cv.style.width = w + 'px';
    this.cv.style.height = h + 'px';
    const L = {};
    L.safeTop = safe.top;
    L.safeBottom = safe.bottom;
    L.hudH = 44 + safe.top;
    const pad = 8;
    const gap = 6;
    let cardW = (w - pad * 2 - gap * 4) / 4.68;
    cardW = Math.min(cardW, 96);
    const cardH = Math.min(cardW * 1.22, 118);
    const nextW = cardW * 0.68;
    const barH = 24;
    const panelH = pad + cardH + 8 + barH + pad + safe.bottom;
    L.panel = { y: h - panelH, h: panelH };
    const rowW = nextW + gap + (cardW + gap) * 4 - gap;
    const x0 = (w - rowW) / 2;
    const cy = L.panel.y + pad + 2;
    L.next = { x: x0, y: cy + cardH - nextW * 1.22, w: nextW, h: nextW * 1.22 };
    L.cards = [];
    for (let i = 0; i < 4; i++) L.cards.push({ x: x0 + nextW + gap + i * (cardW + gap), y: cy, w: cardW, h: cardH });
    L.bar = { x: x0, y: cy + cardH + 8, w: rowW, h: barH };
    L.pause = { x: 6, y: safe.top + 2, w: 44, h: 40 };
    // 아레나
    const availH = L.panel.y - L.hudH - 6;
    const TOPM = 1.3; // 적 킹 타워 높이만큼 위 여유
    const s = Math.min(w / (W + 0.4), availH / (H * TILT + TOPM));
    L.s = s;
    L.aw = W * s;
    L.ah = H * TILT * s;
    L.ox = (w - L.aw) / 2;
    L.oy = L.hudH + 3 + TOPM * s + (availH - L.ah - TOPM * s) / 2;
    this.L = L;
    this.cardCache.clear();
    this.buildArena();
  }

  w2s(x, y, z = 0) {
    const L = this.L;
    return { x: L.ox + x * L.s, y: L.oy + y * L.s * TILT - z * L.s };
  }

  s2w(px, py) {
    const L = this.L;
    return { x: (px - L.ox) / L.s, y: (py - L.oy) / (L.s * TILT) };
  }

  overArena(py) {
    return py < this.L.panel.y - 2 && py > this.L.hudH;
  }

  shake(a) {
    this.shakeAmt = Math.min(22, Math.max(this.shakeAmt, a));
  }

  // ---------- 아레나 정적 캐시 ----------
  buildArena() {
    const L = this.L;
    const dpr = this.dpr;
    const c = document.createElement('canvas');
    c.width = Math.round(this.w * dpr);
    c.height = Math.round(this.h * dpr);
    const g = c.getContext('2d');
    g.scale(dpr, dpr);
    // 바깥 배경
    const TH = ARENAS[this.themeIdx] || ARENAS[0];
    const bg = g.createLinearGradient(0, 0, 0, this.h);
    bg.addColorStop(0, TH.bg);
    bg.addColorStop(1, shade(TH.bg, -0.25));
    g.fillStyle = bg;
    g.fillRect(0, 0, this.w, this.h);
    for (let i = 0; i < 120; i++) {
      g.fillStyle = `rgba(20,40,20,${0.08 + hash(i) * 0.1})`;
      g.beginPath();
      g.arc(hash(i + 3) * this.w, hash(i + 7) * this.h, 2 + hash(i + 9) * 6, 0, Math.PI * 2);
      g.fill();
    }
    const s = L.s;
    const sy = s * TILT;
    const X = (x) => L.ox + x * s;
    const Y = (y) => L.oy + y * sy;
    // 테두리 (나무 울타리/돌)
    g.fillStyle = 'rgba(0,0,0,0.25)';
    rr(g, X(-0.35), Y(-0.35) + 4, L.aw + 0.7 * s, L.ah + 0.7 * sy, 10);
    g.fill();
    g.fillStyle = TH.edge;
    rr(g, X(-0.3), Y(-0.3), L.aw + 0.6 * s, L.ah + 0.6 * sy, 10);
    g.fill();
    g.fillStyle = shade(TH.edge, -0.25);
    rr(g, X(-0.15), Y(-0.15), L.aw + 0.3 * s, L.ah + 0.3 * sy, 8);
    g.fill();
    // 잔디 체커
    for (let ty = 0; ty < H; ty++) {
      for (let tx = 0; tx < W; tx++) {
        const dark = (tx + ty) % 2 === 0;
        const own = ty >= 16;
        g.fillStyle = dark ? (own ? TH.grass[0] : TH.top[0]) : own ? TH.grass[1] : TH.top[1];
        g.fillRect(X(tx), Y(ty), s + 0.5, sy + 0.5);
      }
    }
    // 얼룩
    for (let i = 0; i < 70; i++) {
      const x = hash(i * 3.1) * W;
      const y = hash(i * 5.7) * H;
      if (Math.abs(y - RIVER_Y) < 1.3) continue;
      g.fillStyle = `rgba(255,255,220,${0.05 + hash(i) * 0.08})`;
      g.beginPath();
      g.ellipse(X(x), Y(y), s * (0.3 + hash(i + 1) * 0.6), sy * (0.2 + hash(i + 2) * 0.4), 0, 0, Math.PI * 2);
      g.fill();
    }
    // 흙길 (레인)
    g.fillStyle = 'rgba(214,180,120,0.55)';
    for (const bx of BRIDGES) {
      rr(g, X(bx - 0.75), Y(5.5), 1.5 * s, (H - 11) * sy, 6);
      g.fill();
    }
    rr(g, X(3.5), Y(28.4), 11 * s, 1.5 * sy, 6);
    g.fill();
    rr(g, X(3.5), Y(2.1), 11 * s, 1.5 * sy, 6);
    g.fill();
    // 강
    const ry0 = Y(RIVER_Y - 1);
    const ry1 = Y(RIVER_Y + 1);
    g.fillStyle = '#6ea0b8';
    g.fillRect(X(0), ry0 - 3, L.aw, ry1 - ry0 + 6);
    const rg = g.createLinearGradient(0, ry0, 0, ry1);
    rg.addColorStop(0, '#4fb2e8');
    rg.addColorStop(0.5, '#6cc6f2');
    rg.addColorStop(1, '#3f9ed8');
    g.fillStyle = rg;
    g.fillRect(X(0), ry0, L.aw, ry1 - ry0);
    // 강둑
    g.fillStyle = '#c9b48a';
    g.fillRect(X(0), ry0 - 3, L.aw, 3);
    g.fillStyle = '#a89068';
    g.fillRect(X(0), ry1, L.aw, 3);
    // 다리
    for (const bx of BRIDGES) {
      const x0 = X(bx - BRIDGE_HALF);
      const bw = BRIDGE_HALF * 2 * s;
      const y0 = Y(RIVER_Y - 1.35);
      const y1 = Y(RIVER_Y + 1.35);
      g.fillStyle = 'rgba(0,0,0,0.25)';
      g.fillRect(x0 + 3, y0 + 4, bw, y1 - y0);
      g.fillStyle = '#b8864e';
      g.fillRect(x0, y0, bw, y1 - y0);
      g.strokeStyle = '#8a5e32';
      g.lineWidth = 1;
      for (let py = y0; py < y1; py += Math.max(4, sy * 0.35)) {
        g.beginPath();
        g.moveTo(x0, py);
        g.lineTo(x0 + bw, py);
        g.stroke();
      }
      g.fillStyle = '#7a4e28';
      g.fillRect(x0 - 3, y0 - 3, 4, y1 - y0 + 6);
      g.fillRect(x0 + bw - 1, y0 - 3, 4, y1 - y0 + 6);
    }
    // 타워 받침 돌
    const pads = [
      [9, 29.2, 2.3], [3.5, 25.6, 1.8], [14.5, 25.6, 1.8],
      [9, H - 29.2, 2.3], [3.5, H - 25.6, 1.8], [14.5, H - 25.6, 1.8],
    ];
    for (const [x, y, r] of pads) {
      g.fillStyle = '#b9ad98';
      g.beginPath();
      g.ellipse(X(x), Y(y), r * s, r * sy, 0, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = '#9a8e78';
      g.lineWidth = 2;
      g.stroke();
      g.fillStyle = '#c9bea8';
      g.beginPath();
      g.ellipse(X(x), Y(y) - 2, r * s * 0.85, r * sy * 0.85, 0, 0, Math.PI * 2);
      g.fill();
    }
    // 꽃/덤불 장식 (가장자리)
    for (let i = 0; i < 26; i++) {
      const side = i % 2;
      const x = side ? W - 0.3 - hash(i) * 0.6 : 0.3 + hash(i) * 0.6;
      const y = 1 + hash(i + 11) * (H - 2);
      if (Math.abs(y - RIVER_Y) < 1.6) continue;
      g.fillStyle = '#5fa04a';
      g.beginPath();
      g.arc(X(x), Y(y), s * 0.32, 0, Math.PI * 2);
      g.fill();
      g.fillStyle = ['#ffe36b', '#ff9ab0', '#ffffff'][i % 3];
      g.beginPath();
      g.arc(X(x) + 2, Y(y) - 2, s * 0.1, 0, Math.PI * 2);
      g.fill();
    }
    // 중앙선 표시
    g.strokeStyle = 'rgba(255,255,255,0.25)';
    g.setLineDash([6, 6]);
    g.lineWidth = 2;
    g.beginPath();
    g.moveTo(X(0.5), Y(H / 2 + 1.45));
    g.lineTo(X(W - 0.5), Y(H / 2 + 1.45));
    g.stroke();
    g.setLineDash([]);
    this.arenaCache = c;
  }

  // ---------- 메인 ----------
  draw(game, dt) {
    const ctx = this.ctx;
    this.time += dt;
    const dpr = this.dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // 흔들림
    if (this.shakeAmt > 0.1) {
      this.shakeX = (Math.random() - 0.5) * this.shakeAmt;
      this.shakeY = (Math.random() - 0.5) * this.shakeAmt;
      this.shakeAmt *= Math.pow(0.02, dt);
    } else {
      this.shakeX = this.shakeY = 0;
      this.shakeAmt = 0;
    }
    ctx.drawImage(this.arenaCache, 0, 0, this.w, this.h);
    const b = game.battle;
    if (!b) return;
    ctx.save();
    ctx.translate(this.shakeX, this.shakeY);
    this.drawArenaShake(ctx);
    this.drawRiver(ctx);
    this.drawMarks(ctx, b);
    const dragInfo = this.dragInfo(game);
    if (dragInfo && dragInfo.zone) this.drawZone(ctx, b, dragInfo.card);
    this.drawEntities(ctx, b, game);
    this.drawProjectiles(ctx, b);
    this.drawSpells(ctx, b);
    this.drawFx(ctx, b);
    if (dragInfo) this.drawDragWorld(ctx, b, dragInfo);
    ctx.restore();
    this.drawBanner(ctx, dt);
    this.drawHud(ctx, b, game, dt);
    this.drawPanel(ctx, b, game, dt);
    if (dragInfo) this.drawDragCard(ctx, dragInfo);
    if (game.tutView) this.drawTutorial(ctx, game.tutView);
    this.drawCrownFx(ctx, dt, game);
    this.drawEndBanner(ctx, dt);
    if (game.debug) {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(this.w - 70, this.L.hudH + 2, 66, 16);
      ctx.fillStyle = '#fff';
      ctx.font = `11px ${FONT}`;
      ctx.textAlign = 'left';
      ctx.fillText(`fps ${game.fps | 0} x${game.timeScale}`, this.w - 66, this.L.hudH + 14);
    }
  }

  drawArenaShake() {}

  drawRiver(ctx) {
    const L = this.L;
    const t = this.time;
    ctx.strokeStyle = 'rgba(255,255,255,0.35)';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 9; i++) {
      const y = RIVER_Y - 0.7 + (i % 3) * 0.6;
      const x = ((i * 2.3 + t * 0.8) % (W + 2)) - 1;
      if (BRIDGES.some((bx) => Math.abs(x + 0.4 - bx) < BRIDGE_HALF + 0.5)) continue;
      const p = this.w2s(x, y);
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.quadraticCurveTo(p.x + L.s * 0.4, p.y - 3, p.x + L.s * 0.8, p.y);
      ctx.stroke();
    }
  }

  drawMarks(ctx, b) {
    const s = this.L.s;
    for (const m of b.fx.marks) {
      const p = this.w2s(m.x, m.y);
      const a = Math.min(1, m.life / m.max * 1.5);
      ctx.save();
      ctx.globalAlpha = a;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, m.r * s, m.r * s * TILT, 0, 0, Math.PI * 2);
      if (m.scorch) {
        ctx.fillStyle = m.color;
        ctx.fill();
      } else if (m.fill) {
        ctx.fillStyle = 'rgba(190,232,255,0.35)';
        ctx.fill();
        ctx.strokeStyle = m.color;
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        ctx.setLineDash([5, 4]);
        ctx.lineDashOffset = -this.time * 20;
        ctx.strokeStyle = m.color;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = 'rgba(255,255,255,0.12)';
        ctx.fill();
        ctx.setLineDash([]);
      }
      ctx.restore();
    }
  }

  drawZone(ctx, b, id) {
    const c = CARDS[id];
    if (c.kind === 'spell') return;
    const s = this.L.s;
    const sy = s * TILT;
    const X = (x) => this.L.ox + x * s;
    const Y = (y) => this.L.oy + y * sy;
    ctx.save();
    ctx.fillStyle = 'rgba(230,40,40,0.22)';
    const pl = c.kind !== 'building' && b.pocketOpen(0, 2);
    const pr = c.kind !== 'building' && b.pocketOpen(0, 16);
    // 왼쪽 절반
    ctx.fillRect(X(0), Y(0), 9 * s, (pl ? 10.8 : 17.4) * sy);
    if (pl) ctx.fillRect(X(0), Y(14.6), 9 * s, 2.8 * sy);
    ctx.fillRect(X(9), Y(0), 9 * s, (pr ? 10.8 : 17.4) * sy);
    if (pr) ctx.fillRect(X(9), Y(14.6), 9 * s, 2.8 * sy);
    // 허용 구역 격자
    ctx.strokeStyle = 'rgba(255,255,255,0.28)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 1; x < W; x++) {
      ctx.moveTo(X(x), Y(17.4));
      ctx.lineTo(X(x), Y(H));
    }
    for (let y = 18; y < H; y++) {
      ctx.moveTo(X(0), Y(y));
      ctx.lineTo(X(W), Y(y));
    }
    ctx.stroke();
    ctx.restore();
  }

  // ---------- 엔티티 ----------
  drawEntities(ctx, b, game) {
    const list = b.ents.slice();
    list.sort((a, c) => (a.air ? 100 : 0) + a.y - ((c.air ? 100 : 0) + c.y));
    for (const e of list) {
      if (e.kind === 'tower') this.drawTower(ctx, e, b);
      else if (e.kind === 'building') this.drawBuilding(ctx, e);
      else this.drawUnit(ctx, e);
    }
    void game;
  }

  visR(e) {
    return Math.max(e.r * 1.4, 0.44) * this.L.s;
  }

  drawToken(ctx, e, cx, cy, vr, alpha = 1) {
    const tc = TEAM[e.team];
    const c = CARDS[e.card];
    ctx.save();
    ctx.globalAlpha = alpha;
    // 코인 두께
    ctx.fillStyle = tc.dark;
    ctx.beginPath();
    ctx.arc(cx, cy + vr * 0.14, vr, 0, Math.PI * 2);
    ctx.fill();
    // 테두리
    ctx.fillStyle = tc.main;
    ctx.beginPath();
    ctx.arc(cx, cy, vr, 0, Math.PI * 2);
    ctx.fill();
    // 면
    ctx.fillStyle = c.color;
    ctx.beginPath();
    ctx.arc(cx, cy, vr * 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.beginPath();
    ctx.arc(cx - vr * 0.1, cy - vr * 0.12, vr * 0.62, Math.PI * 1.05, Math.PI * 1.75);
    ctx.lineTo(cx - vr * 0.1, cy - vr * 0.12);
    ctx.fill();
    const flip = Math.cos(e.face) < -0.2;
    const ic = iconBitmap(e.card, 96);
    if (flip) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(-1, 1);
      ctx.drawImage(ic, -vr * 0.86, -vr * 0.86, vr * 1.72, vr * 1.72);
      ctx.restore();
    } else {
      ctx.drawImage(ic, cx - vr * 0.86, cy - vr * 0.86, vr * 1.72, vr * 1.72);
    }
    // 피격 플래시
    if (e.flash > 0) {
      ctx.globalAlpha = alpha * Math.min(1, e.flash / 0.12) * 0.75;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx, cy, vr, 0, Math.PI * 2);
      ctx.fill();
    }
    if (e.slowT > 0) {
      ctx.globalAlpha = alpha * 0.4;
      ctx.fillStyle = '#8fd8ff';
      ctx.beginPath();
      ctx.arc(cx, cy, vr, 0, Math.PI * 2);
      ctx.fill();
    }
    if (e.mergeFlash > 0) {
      const m = e.mergeFlash;
      ctx.globalAlpha = m;
      ctx.fillStyle = '#fff6b0';
      ctx.beginPath();
      ctx.arc(cx, cy, vr, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffe36b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, vr * (1 + (1 - m) * 1.4), 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  drawStars(ctx, n, cx, y, size) {
    if (n <= 1) return;
    const gap = size * 1.9;
    for (let i = 0; i < n; i++) {
      const x = cx + (i - (n - 1) / 2) * gap;
      star(ctx, x, y, size);
      ctx.fillStyle = '#ffd83a';
      ctx.fill();
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#8a5a00';
      ctx.stroke();
    }
  }

  drawHp(ctx, e, cx, y, w) {
    const tc = TEAM[e.team];
    const f = Math.max(0, e.hp / e.maxHp);
    ctx.fillStyle = 'rgba(20,20,30,0.75)';
    ctx.fillRect(cx - w / 2 - 1, y - 1, w + 2, 5);
    ctx.fillStyle = tc.main;
    ctx.fillRect(cx - w / 2, y, w * f, 3);
  }

  drawUnit(ctx, e) {
    const s = this.L.s;
    const vr = this.visR(e);
    const p = this.w2s(e.x, e.y);
    let z = 0;
    if (e.air) z = 1.3 + Math.sin(this.time * 4 + e.id) * 0.08;
    else if (e.moving) z = Math.abs(Math.sin(e.walk)) * 0.14;
    let alpha = 1;
    let scale = 1;
    if (e.deployT > 0) {
      const k = 1 - e.deployT / BATTLE.DEPLOY_TIME;
      z += (1 - Math.min(1, k * 2.5)) * 2.5;
      alpha = 0.55 + 0.45 * Math.min(1, k * 2);
      scale = 0.85 + 0.15 * Math.min(1, k * 2);
    }
    let lx = 0;
    let ly = 0;
    if (e.atkAnim > 0) {
      const l = Math.sin(e.atkAnim * Math.PI) * 0.18 * s;
      lx = Math.cos(e.face) * l;
      ly = Math.sin(e.face) * l * TILT;
    }
    // 그림자
    ctx.fillStyle = e.air ? 'rgba(0,0,0,0.18)' : 'rgba(0,0,0,0.28)';
    ctx.beginPath();
    ctx.ellipse(p.x + lx, p.y + 1, vr * (e.air ? 0.7 : 0.95), vr * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    const r = vr * scale;
    if (!e.air) {
      // 받침
      ctx.fillStyle = TEAM[e.team].dark;
      ctx.beginPath();
      ctx.ellipse(p.x + lx, p.y, r * 0.7, r * 0.28, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    const cx = p.x + lx;
    const cy = p.y + ly - r * 0.95 - z * s;
    if (e.charging) {
      ctx.strokeStyle = 'rgba(255,230,160,0.8)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 3; i++) {
        const a = e.face + Math.PI + (i - 1) * 0.35;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a) * r * 1.1, cy + Math.sin(a) * r * 1.1 * TILT);
        ctx.lineTo(cx + Math.cos(a) * r * 1.9, cy + Math.sin(a) * r * 1.9 * TILT);
        ctx.stroke();
      }
    }
    this.drawToken(ctx, e, cx, cy, r, alpha);
    if (e.deployT > 0) {
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, r + 3, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - e.deployT / BATTLE.DEPLOY_TIME));
      ctx.stroke();
    }
    let top = cy - r - 3;
    if (e.level > 1) {
      this.drawStars(ctx, e.level, cx, top - 2, Math.max(3.2, r * 0.3));
      top -= Math.max(3.2, r * 0.3) * 2 + 2;
    }
    if (e.hp < e.maxHp) this.drawHp(ctx, e, cx, top - 4, Math.max(16, r * 1.8));
    if (e.stunT > 0) {
      for (let i = 0; i < 3; i++) {
        const a = this.time * 6 + (i * Math.PI * 2) / 3;
        star(ctx, cx + Math.cos(a) * r * 0.8, cy - r - 2 + Math.sin(a) * 3, 3);
        ctx.fillStyle = '#ffe36b';
        ctx.fill();
      }
    }
  }

  drawBuilding(ctx, e) {
    const s = this.L.s;
    const p = this.w2s(e.x, e.y);
    const R = e.r * s * 1.15;
    const tc = TEAM[e.team];
    let alpha = 1;
    let drop = 0;
    if (e.deployT > 0) {
      const k = 1 - e.deployT / BATTLE.DEPLOY_TIME;
      drop = (1 - Math.min(1, k * 2.5)) * 2.5 * s;
      alpha = 0.6 + 0.4 * k;
    }
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    ctx.beginPath();
    ctx.ellipse(p.x + 2, p.y + 2, R * 1.2, R * 0.55, 0, 0, Math.PI * 2);
    ctx.fill();
    // 2.5D 받침 상자
    const bh = R * 0.45;
    const top = p.y - bh - drop;
    ctx.fillStyle = '#8a7e6a';
    ctx.beginPath();
    ctx.ellipse(p.x, p.y - drop, R, R * TILT * 0.5, 0, 0, Math.PI);
    ctx.lineTo(p.x - R, top);
    ctx.lineTo(p.x + R, top);
    ctx.closePath();
    ctx.fillRect(p.x - R, top, R * 2, bh);
    ctx.fill();
    ctx.fillStyle = tc.main;
    ctx.fillRect(p.x - R, top + bh * 0.35, R * 2, bh * 0.3);
    ctx.fillStyle = '#c8bca4';
    ctx.beginPath();
    ctx.ellipse(p.x, top, R, R * TILT * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    const vr = R * 0.78;
    const cx = p.x;
    const cy = top - vr * 0.75;
    this.drawToken(ctx, e, cx, cy, vr, alpha);
    let ty = cy - vr - 3;
    if (e.level > 1) {
      this.drawStars(ctx, e.level, cx, ty - 2, Math.max(3.2, vr * 0.28));
      ty -= Math.max(3.2, vr * 0.28) * 2 + 2;
    }
    this.drawHp(ctx, e, cx, ty - 4, Math.max(20, vr * 2));
  }

  drawTower(ctx, t, b) {
    const s = this.L.s;
    const p = this.w2s(t.x, t.y);
    const R = t.r * s;
    const king = t.towerType === 'king';
    const tc = TEAM[t.team];
    const boss = t.team === 1 && king && b.params.boss;
    if (!t.alive) {
      // 잔해
      ctx.fillStyle = 'rgba(0,0,0,0.25)';
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, R * 1.1, R * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      for (let i = 0; i < 9; i++) {
        const a = hash(t.id * 10 + i) * Math.PI * 2;
        const d = hash(t.id * 7 + i) * R * 0.8;
        const sz = R * (0.18 + hash(i + t.id) * 0.2);
        const x = p.x + Math.cos(a) * d;
        const y = p.y + Math.sin(a) * d * 0.45 - sz * 0.4;
        ctx.fillStyle = i % 4 === 0 ? tc.dark : i % 2 ? '#a89c86' : '#8a7e6a';
        ctx.beginPath();
        ctx.moveTo(x - sz, y + sz * 0.5);
        ctx.lineTo(x - sz * 0.3, y - sz * 0.6);
        ctx.lineTo(x + sz * 0.8, y - sz * 0.3);
        ctx.lineTo(x + sz, y + sz * 0.5);
        ctx.closePath();
        ctx.fill();
      }
      // 연기
      ctx.fillStyle = 'rgba(90,90,90,0.25)';
      for (let i = 0; i < 3; i++) {
        const k = (this.time * 0.4 + i / 3) % 1;
        ctx.beginPath();
        ctx.arc(p.x + Math.sin(k * 6 + i) * 4, p.y - R * 0.5 - k * R * 2, R * (0.2 + k * 0.4), 0, Math.PI * 2);
        ctx.globalAlpha = 1 - k;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      return;
    }
    const bw = R * (king ? 0.95 : 0.85);
    const bh = R * (king ? 1.35 : 1.6);
    const base = p.y;
    const topY = base - bh;
    // 그림자
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(p.x + R * 0.25, base + R * 0.08, R * 1.2, R * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    // 몸체
    const grad = ctx.createLinearGradient(p.x - bw, 0, p.x + bw, 0);
    if (boss) {
      grad.addColorStop(0, '#9a8aa8');
      grad.addColorStop(0.5, '#6a5a78');
      grad.addColorStop(1, '#3a2e48');
    } else {
      grad.addColorStop(0, '#efe4d0');
      grad.addColorStop(0.45, '#cdbfa6');
      grad.addColorStop(1, '#8e8068');
    }
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(p.x - bw, topY);
    ctx.lineTo(p.x - bw, base);
    ctx.ellipse(p.x, base, bw, bw * 0.42, 0, Math.PI, 0, true);
    ctx.lineTo(p.x + bw, topY);
    ctx.closePath();
    ctx.fill();
    // 벽돌 줄
    ctx.strokeStyle = 'rgba(80,60,40,0.25)';
    ctx.lineWidth = 1;
    for (let i = 1; i < 4; i++) {
      const y = topY + (bh * i) / 4;
      ctx.beginPath();
      ctx.ellipse(p.x, y, bw, bw * 0.42, 0, 0.1, Math.PI - 0.1);
      ctx.stroke();
    }
    // 팀 띠
    ctx.fillStyle = tc.main;
    ctx.beginPath();
    const by = topY + bh * 0.18;
    ctx.ellipse(p.x, by + bh * 0.14, bw, bw * 0.42, 0, 0, Math.PI);
    ctx.lineTo(p.x - bw, by);
    ctx.ellipse(p.x, by, bw, bw * 0.42, 0, Math.PI, 0, true);
    ctx.closePath();
    ctx.fill();
    // 문 / 창
    ctx.fillStyle = '#4a3a2a';
    if (king) {
      ctx.beginPath();
      ctx.moveTo(p.x - bw * 0.3, base + bw * 0.38);
      ctx.lineTo(p.x - bw * 0.3, base - bh * 0.3);
      ctx.arc(p.x, base - bh * 0.3, bw * 0.3, Math.PI, 0);
      ctx.lineTo(p.x + bw * 0.3, base + bw * 0.38);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(p.x, base - bh * 0.35, bw * 0.16, Math.PI, 0);
      ctx.lineTo(p.x + bw * 0.16, base - bh * 0.12);
      ctx.lineTo(p.x - bw * 0.16, base - bh * 0.12);
      ctx.fill();
    }
    // 윗면
    ctx.fillStyle = boss ? '#7a6a88' : '#dcd0b8';
    ctx.beginPath();
    ctx.ellipse(p.x, topY, bw * 1.08, bw * 0.46, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = boss ? '#5a4a68' : '#bcae94';
    ctx.beginPath();
    ctx.ellipse(p.x, topY, bw * 0.78, bw * 0.32, 0, 0, Math.PI * 2);
    ctx.fill();
    // 총안(요철)
    const nM = king ? 7 : 5;
    for (let i = 0; i < nM; i++) {
      const a = Math.PI * (0.08 + (0.84 * i) / (nM - 1));
      const mx = p.x + Math.cos(a) * bw * 0.95;
      const my = topY + Math.sin(a) * bw * 0.4;
      const mw = bw * 0.24;
      ctx.fillStyle = boss ? '#6a5a78' : '#e8dcc4';
      ctx.fillRect(mx - mw / 2, my - mw * 0.9, mw, mw * 0.9);
      ctx.fillStyle = boss ? '#4a3a58' : '#b0a288';
      ctx.fillRect(mx - mw / 2, my - mw * 0.2, mw, mw * 0.2);
    }
    // 피격 플래시
    if (t.flash > 0) {
      ctx.save();
      ctx.globalAlpha = Math.min(1, t.flash / 0.12) * 0.55;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(p.x - bw, topY - bw * 0.46, bw * 2, bh + bw * 0.9);
      ctx.restore();
    }
    // 위 장식
    if (king) {
      // 대포
      const aimX = Math.cos(t.aim);
      const aimY = Math.sin(t.aim) * TILT;
      const len = R * 0.75 * (1 - (t.recoil > 0 ? t.recoil * 0.25 : 0));
      ctx.strokeStyle = '#2e2e3a';
      ctx.lineWidth = R * 0.32;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p.x, topY - R * 0.15);
      ctx.lineTo(p.x + aimX * len, topY - R * 0.15 + aimY * len);
      ctx.stroke();
      ctx.lineCap = 'butt';
      // 왕 토큰
      const kr = R * 0.42;
      const ky = topY - R * 0.55;
      ctx.fillStyle = tc.dark;
      ctx.beginPath();
      ctx.arc(p.x, ky + kr * 0.14, kr, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = tc.main;
      ctx.beginPath();
      ctx.arc(p.x, ky, kr, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = boss ? '#5a3a6a' : '#f3c9a0';
      ctx.beginPath();
      ctx.arc(p.x, ky, kr * 0.78, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#2a2233';
      ctx.beginPath();
      ctx.arc(p.x - kr * 0.28, ky + kr * 0.05, kr * 0.1, 0, Math.PI * 2);
      ctx.arc(p.x + kr * 0.28, ky + kr * 0.05, kr * 0.1, 0, Math.PI * 2);
      ctx.fill();
      if (boss) {
        ctx.fillStyle = '#ff4a6a';
        ctx.beginPath();
        ctx.arc(p.x - kr * 0.28, ky + kr * 0.05, kr * 0.07, 0, Math.PI * 2);
        ctx.arc(p.x + kr * 0.28, ky + kr * 0.05, kr * 0.07, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.save();
      ctx.translate(p.x, ky - kr * 0.85);
      drawIcon(ctx, 'crown', kr * 0.62);
      ctx.restore();
      if (!t.active) {
        ctx.fillStyle = '#ffffff';
        ctx.font = `900 ${Math.round(R * 0.5)}px ${FONT}`;
        ctx.textAlign = 'left';
        const zz = (this.time * 0.8) % 1;
        ctx.globalAlpha = 1 - zz;
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#2a2233';
        ctx.strokeText('Zz', p.x + kr * 0.9, ky - kr * 0.3 - zz * R * 0.6);
        ctx.fillText('Zz', p.x + kr * 0.9, ky - kr * 0.3 - zz * R * 0.6);
        ctx.globalAlpha = 1;
      }
    } else {
      const ar = R * 0.34;
      const ay = topY - ar * 0.8;
      ctx.fillStyle = tc.dark;
      ctx.beginPath();
      ctx.arc(p.x, ay + ar * 0.14, ar, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = tc.main;
      ctx.beginPath();
      ctx.arc(p.x, ay, ar, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f2d8e6';
      ctx.beginPath();
      ctx.arc(p.x, ay, ar * 0.78, 0, Math.PI * 2);
      ctx.fill();
      const ic = iconBitmap('archers', 96);
      ctx.drawImage(ic, p.x - ar * 0.85, ay - ar * 0.85, ar * 1.7, ar * 1.7);
    }
    // HP 바
    const hbW = Math.max(40, R * 2.2);
    const hbY = t.team === 1 ? base + R * 0.5 : topY - R * (king ? 1.35 : 1.05) - 8;
    ctx.fillStyle = 'rgba(20,20,30,0.8)';
    rr(ctx, p.x - hbW / 2 - 2, hbY - 2, hbW + 4, 12, 4);
    ctx.fill();
    ctx.fillStyle = tc.main;
    const f = Math.max(0, t.hp / t.maxHp);
    rr(ctx, p.x - hbW / 2, hbY, Math.max(2, hbW * f), 8, 3);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = `bold 9px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(Math.ceil(t.hp), p.x, hbY + 4.5);
    ctx.textBaseline = 'alphabetic';
  }

  drawProjectiles(ctx, b) {
    const s = this.L.s;
    for (const p of b.projs) {
      const q = this.w2s(p.x, p.y, p.z);
      const g = this.w2s(p.x, p.y);
      const ang = Math.atan2(Math.sin(p.ang || 0) * TILT, Math.cos(p.ang || 0));
      if (p.type === 'arrow' || p.type === 'bullet') {
        const len = p.type === 'arrow' ? s * 0.55 : s * 0.3;
        ctx.strokeStyle = p.type === 'arrow' ? '#6a4a2a' : '#ffe080';
        ctx.lineWidth = p.type === 'arrow' ? 2 : 2.5;
        ctx.beginPath();
        ctx.moveTo(q.x - Math.cos(ang) * len, q.y - Math.sin(ang) * len);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
        if (p.type === 'arrow') {
          ctx.fillStyle = '#e8e8f0';
          ctx.beginPath();
          ctx.arc(q.x, q.y, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (p.type === 'cannon' || p.type === 'bomb') {
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.beginPath();
        ctx.ellipse(g.x, g.y, s * 0.18, s * 0.08, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = p.type === 'bomb' ? '#3a3a4a' : '#2a2a30';
        ctx.beginPath();
        ctx.arc(q.x, q.y, s * (p.type === 'bomb' ? 0.2 : 0.17), 0, Math.PI * 2);
        ctx.fill();
        if (p.type === 'bomb') {
          ctx.fillStyle = Math.sin(this.time * 40) > 0 ? '#ffd040' : '#ff7a2a';
          ctx.beginPath();
          ctx.arc(q.x + s * 0.12, q.y - s * 0.18, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        const col = p.type === 'flame' ? ['#ffe36b', '#ff7a2a'] : ['#f0e0ff', '#9a5ae8'];
        ctx.fillStyle = col[1];
        ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.arc(q.x - Math.cos(ang) * s * 0.25, q.y - Math.sin(ang) * s * 0.25, s * 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.arc(q.x, q.y, s * 0.24, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = col[0];
        ctx.beginPath();
        ctx.arc(q.x, q.y, s * 0.13, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  drawSpells(ctx, b) {
    const s = this.L.s;
    for (const sp of b.spells) {
      const k = Math.min(1, sp.t / sp.delay);
      if (sp.id === 'fireball') {
        const x = sp.sx + (sp.x - sp.sx) * k;
        const y = sp.sy + (sp.y - sp.sy) * k;
        const z = Math.sin(k * Math.PI) * 4 + 1;
        const q = this.w2s(x, y, z);
        const g = this.w2s(x, y);
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(g.x, g.y, s * 0.5, s * 0.2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(255,120,40,0.4)';
        ctx.beginPath();
        ctx.arc(q.x, q.y, s * 0.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ff8a3a';
        ctx.beginPath();
        ctx.arc(q.x, q.y, s * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffe36b';
        ctx.beginPath();
        ctx.arc(q.x, q.y, s * 0.28, 0, Math.PI * 2);
        ctx.fill();
      } else if (sp.id === 'arrows') {
        ctx.strokeStyle = '#5a3a1a';
        ctx.lineWidth = 2;
        for (let i = 0; i < 14; i++) {
          const a = hash(i + sp.x) * Math.PI * 2;
          const r = Math.sqrt(hash(i * 3 + sp.y)) * CARDS.arrows.radius;
          const x = sp.x + Math.cos(a) * r;
          const y = sp.y + Math.sin(a) * r;
          const kk = Math.min(1, k * (1 + hash(i) * 0.3));
          const q = this.w2s(x, y, (1 - kk) * 7);
          ctx.beginPath();
          ctx.moveTo(q.x, q.y - s * 0.6);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    }
  }

  drawFx(ctx, b) {
    const s = this.L.s;
    const f = b.fx;
    for (const r of f.rings) {
      const k = 1 - r.life / r.max;
      const p = this.w2s(r.x, r.y);
      const rad = (r.r0 + (r.r1 - r.r0) * (1 - Math.pow(1 - k, 2))) * s;
      ctx.globalAlpha = Math.max(0, 1 - k);
      ctx.strokeStyle = r.color;
      ctx.lineWidth = r.width * (1 - k * 0.5);
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, rad, rad * TILT, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    for (const d of f.debris) {
      const q = this.w2s(d.x, d.y, d.z);
      const g = this.w2s(d.x, d.y);
      const sz = d.s * s;
      ctx.globalAlpha = Math.min(1, d.life * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(g.x - sz / 2, g.y - sz / 4, sz, sz / 2);
      ctx.save();
      ctx.translate(q.x, q.y);
      ctx.rotate(d.rot);
      ctx.fillStyle = d.color;
      ctx.fillRect(-sz / 2, -sz / 2, sz, sz);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
    for (const p of f.parts) {
      const q = this.w2s(p.x, p.y, p.z);
      ctx.globalAlpha = Math.max(0, p.life / p.max);
      ctx.fillStyle = p.color;
      const sz = p.size * s;
      ctx.fillRect(q.x - sz / 2, q.y - sz / 2, sz, sz);
    }
    ctx.globalAlpha = 1;
    for (const bo of f.bolts) {
      const p = this.w2s(bo.x, bo.y);
      const k = bo.life / bo.max;
      ctx.globalAlpha = k;
      ctx.strokeStyle = '#fffbe0';
      ctx.lineWidth = 4;
      ctx.shadowColor = '#ffe36b';
      ctx.beginPath();
      let x = p.x + (hash(bo.seed) - 0.5) * 30;
      let y = this.L.hudH;
      ctx.moveTo(x, y);
      const steps = 8;
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        x = p.x + (i === steps ? 0 : (hash(bo.seed + i + Math.floor(this.time * 30)) - 0.5) * 24);
        y = this.L.hudH + (p.y - s * 0.6 - this.L.hudH) * t;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.strokeStyle = '#ffe36b';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
    ctx.textAlign = 'center';
    for (const t of f.texts) {
      const q = this.w2s(t.x, t.y, t.z);
      const k = t.life / t.max;
      const sz = Math.round(Math.max(10, s * 0.55) * t.size * (k > 0.8 ? 1 + (k - 0.8) * 2 : 1));
      ctx.globalAlpha = Math.min(1, k * 2.5);
      ctx.font = `900 ${sz}px ${FONT}`;
      ctx.lineWidth = 3;
      ctx.strokeStyle = 'rgba(30,20,40,0.85)';
      ctx.strokeText(t.text, q.x, q.y);
      ctx.fillStyle = t.color;
      ctx.fillText(t.text, q.x, q.y);
    }
    ctx.globalAlpha = 1;
  }

  // ---------- 드래그 ----------
  dragInfo(game) {
    const d = game.drag;
    const b = game.battle;
    if (!d || !b || b.ended) return null;
    const id = b.teams[0].hand[d.idx];
    if (!id) return null;
    const over = this.overArena(d.y);
    const info = { card: id, idx: d.idx, sx: d.x, sy: d.y, over, zone: false };
    if (over) {
      const w = this.s2w(d.x, d.y);
      info.wx = w.x;
      info.wy = w.y;
      info.merge = b.findMerge(0, id, w.x, w.y);
      info.snap = b.snap(0, id, w.x, w.y);
      info.zone = !info.merge;
      info.afford = b.teams[0].elixir >= b.costOf(0, id, !!info.merge);
    }
    return info;
  }

  drawDragWorld(ctx, b, info) {
    if (!info.over) return;
    const s = this.L.s;
    const c = CARDS[info.card];
    if (info.merge) {
      const m = info.merge;
      const p = this.w2s(m.x, m.y);
      const vr = this.visR(m);
      const pulse = 1 + Math.sin(this.time * 10) * 0.08;
      ctx.strokeStyle = '#ffe36b';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, vr * 1.5 * pulse, vr * 0.7 * pulse, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(p.x, p.y - vr * 0.95 - (m.air ? 1.3 * s : 0), vr * 1.25 * pulse, 0, Math.PI * 2);
      ctx.stroke();
      const txt = '합성! ' + '★'.repeat(m.level + 1);
      ctx.font = `900 15px ${FONT}`;
      ctx.textAlign = 'center';
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#3a2a10';
      const ty = p.y - vr * 2.4 - (m.air ? 1.3 * s : 0) - 10;
      ctx.strokeText(txt, p.x, ty);
      ctx.fillStyle = '#ffe36b';
      ctx.fillText(txt, p.x, ty);
      return;
    }
    const sp = info.snap;
    const p = this.w2s(sp.x, sp.y);
    if (c.kind === 'spell') {
      ctx.fillStyle = 'rgba(255,255,255,0.18)';
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, c.radius * s, c.radius * s * TILT, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.setLineDash([6, 5]);
      ctx.lineDashOffset = -this.time * 25;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.save();
      ctx.globalAlpha = 0.85;
      ctx.drawImage(iconBitmap(info.card, 96), p.x - s * 0.9, p.y - s * 1.1, s * 1.8, s * 1.8);
      ctx.restore();
    } else {
      // 유닛 실루엣
      const n = c.count || 1;
      for (let i = 0; i < n; i++) {
        let ox = 0;
        let oy = 0;
        if (n > 1) {
          const r = (n > 5 ? 0.42 : 0.5) * Math.sqrt(i + 0.5);
          const a = i * 2.39996 - Math.PI / 2;
          ox = Math.cos(a) * r;
          oy = Math.sin(a) * r * 0.9;
        }
        const ghost = { team: 0, card: info.card, face: -Math.PI / 2, flash: 0, slowT: 0, mergeFlash: 0 };
        const q = this.w2s(sp.x + ox, sp.y + oy);
        const vr = Math.max(c.r * 1.4, 0.44) * s * (c.kind === 'building' ? 0.9 : 1);
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.beginPath();
        ctx.ellipse(q.x, q.y, vr * 0.9, vr * 0.38, 0, 0, Math.PI * 2);
        ctx.fill();
        this.drawToken(ctx, ghost, q.x, q.y - vr * 0.95 - (c.air ? 1.3 * s : 0), vr, 0.7);
      }
      if (c.range > 2) {
        ctx.strokeStyle = 'rgba(255,255,255,0.35)';
        ctx.setLineDash([4, 5]);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, (c.range + c.r) * s, (c.range + c.r) * s * TILT, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
    if (!info.afford) {
      ctx.font = `900 13px ${FONT}`;
      ctx.textAlign = 'center';
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#300';
      ctx.strokeText('엘릭서 부족', p.x, p.y + 18);
      ctx.fillStyle = '#ff9a9a';
      ctx.fillText('엘릭서 부족', p.x, p.y + 18);
    }
  }

  drawDragCard(ctx, info) {
    if (info.over) return;
    const r = this.L.cards[info.idx];
    const w = r.w * 1.08;
    const h = r.h * 1.08;
    ctx.save();
    ctx.globalAlpha = 0.95;
    ctx.drawImage(this.cardFace(info.card, r.w, r.h), info.sx - w / 2, info.sy - h * 0.6, w, h);
    ctx.restore();
  }

  // ---------- 카드 ----------
  cardFace(id, w, h) {
    const key = `${id}@${w | 0}x${h | 0}`;
    let c = this.cardCache.get(key);
    if (c) return c;
    c = buildCardFace(id, w, h, this.dpr);
    this.cardCache.set(key, c);
    return c;
  }

  costBubble(ctx, x, y, r, cost, dim) {
    ctx.fillStyle = dim ? '#6a5a7a' : '#c04ae0';
    ctx.beginPath();
    ctx.moveTo(x, y - r * 1.25);
    ctx.bezierCurveTo(x + r * 0.9, y - r * 0.3, x + r, y + r * 0.2, x + r * 0.95, y + r * 0.35);
    ctx.arc(x, y + r * 0.2, r, 0.15, Math.PI - 0.15);
    ctx.bezierCurveTo(x - r, y + r * 0.2, x - r * 0.9, y - r * 0.3, x, y - r * 1.25);
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.font = `900 ${Math.round(r * 1.25)}px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(cost, x, y + r * 0.2);
    ctx.textBaseline = 'alphabetic';
  }

  drawPanel(ctx, b, game, dt) {
    const L = this.L;
    const P = L.panel;
    const g = ctx.createLinearGradient(0, P.y, 0, this.h);
    g.addColorStop(0, '#34466e');
    g.addColorStop(1, '#1d2744');
    ctx.fillStyle = g;
    ctx.fillRect(0, P.y, this.w, P.h);
    ctx.fillStyle = '#d8b25a';
    ctx.fillRect(0, P.y, this.w, 3);
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(0, P.y + 3, this.w, 3);
    const T = b.teams[0];
    // 다음 카드
    const n = L.next;
    ctx.fillStyle = '#c8d4f0';
    ctx.font = `800 10px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.fillText('다음', n.x + n.w / 2, n.y - 4);
    if (T.queue[0]) {
      ctx.save();
      ctx.globalAlpha = 0.85;
      ctx.drawImage(this.cardFace(T.queue[0], n.w, n.h), n.x, n.y, n.w, n.h);
      ctx.restore();
      this.costBubble(ctx, n.x + 8, n.y + 10, 7, b.costOf(0, T.queue[0], false), false);
    }
    // 손패
    for (let i = 0; i < 4; i++) {
      const r = L.cards[i];
      const id = T.hand[i];
      if (!id) continue;
      if (this.cardShake[i] > 0) this.cardShake[i] -= dt * 3;
      const sh = this.cardShake[i] > 0 ? Math.sin(this.cardShake[i] * 40) * 5 * this.cardShake[i] : 0;
      const dragging = game.drag && game.drag.idx === i;
      const sel = game.selected === i;
      const lift = sel ? -10 : 0;
      if (dragging) {
        ctx.strokeStyle = 'rgba(255,255,255,0.5)';
        ctx.setLineDash([5, 4]);
        ctx.lineWidth = 2;
        rr(ctx, r.x + 2, r.y + 2, r.w - 4, r.h - 4, 8);
        ctx.stroke();
        ctx.setLineDash([]);
        continue;
      }
      const x = r.x + sh;
      const y = r.y + lift;
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      rr(ctx, x + 2, y + 4, r.w, r.h, 9);
      ctx.fill();
      ctx.drawImage(this.cardFace(id, r.w, r.h), x, y, r.w, r.h);
      const cost = b.costOf(0, id, false);
      const afford = T.elixir >= cost;
      if (!afford) {
        ctx.fillStyle = 'rgba(15,15,30,0.55)';
        rr(ctx, x, y, r.w, r.h, 9);
        ctx.fill();
        // 충전 진행
        const f = Math.min(1, T.elixir / cost);
        ctx.fillStyle = 'rgba(192,74,224,0.35)';
        ctx.fillRect(x + 3, y + r.h - 3 - (r.h - 6) * f, r.w - 6, (r.h - 6) * f);
      }
      if (sel) {
        ctx.strokeStyle = '#ffe36b';
        ctx.lineWidth = 3;
        rr(ctx, x - 1, y - 1, r.w + 2, r.h + 2, 10);
        ctx.stroke();
      }
      // 합성 가능 표시
      if (CARDS[id].kind !== 'spell') {
        const can = b.ents.some((e) => e.alive && e.team === 0 && e.card === id && e.level < 3);
        if (can) {
          const pulse = 0.75 + Math.sin(this.time * 6) * 0.25;
          ctx.globalAlpha = pulse;
          ctx.fillStyle = '#ffd83a';
          rr(ctx, x + r.w / 2 - 20, y - 8, 40, 15, 7);
          ctx.fill();
          ctx.globalAlpha = 1;
          ctx.fillStyle = '#4a2a00';
          ctx.font = `900 10px ${FONT}`;
          ctx.textAlign = 'center';
          ctx.fillText('합성★', x + r.w / 2, y + 3);
        }
      }
      this.costBubble(ctx, x + 11, y + 13, 9, cost, !afford);
    }
    // 엘릭서 바
    const B = L.bar;
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    rr(ctx, B.x, B.y, B.w, B.h, B.h / 2);
    ctx.fill();
    const bx0 = B.x + 30;
    const bw = B.w - 34;
    const f = T.elixir / BATTLE.ELIXIR_MAX;
    const eg = ctx.createLinearGradient(0, B.y, 0, B.y + B.h);
    eg.addColorStop(0, '#f08aff');
    eg.addColorStop(0.5, '#c04ae0');
    eg.addColorStop(1, '#8a2ab8');
    ctx.fillStyle = eg;
    rr(ctx, bx0, B.y + 4, Math.max(0.01, bw * f), B.h - 8, (B.h - 8) / 2);
    ctx.fill();
    if (b.double) {
      ctx.fillStyle = `rgba(255,255,255,${0.15 + Math.sin(this.time * 8) * 0.1})`;
      rr(ctx, bx0, B.y + 4, Math.max(0.01, bw * f), B.h - 8, (B.h - 8) / 2);
      ctx.fill();
    }
    ctx.strokeStyle = 'rgba(0,0,0,0.45)';
    ctx.lineWidth = 1.5;
    for (let i = 1; i < 10; i++) {
      const x = bx0 + (bw * i) / 10;
      ctx.beginPath();
      ctx.moveTo(x, B.y + 4);
      ctx.lineTo(x, B.y + B.h - 4);
      ctx.stroke();
    }
    this.costBubble(ctx, B.x + 14, B.y + B.h / 2 - 2, 11, Math.floor(T.elixir), false);
    if (this.denyText) {
      this.denyText.t -= dt;
      if (this.denyText.t <= 0) this.denyText = null;
      else {
        ctx.globalAlpha = Math.min(1, this.denyText.t * 3);
        ctx.font = `900 14px ${FONT}`;
        ctx.textAlign = 'center';
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#300';
        ctx.strokeText(this.denyText.text, this.w / 2, P.y - 12);
        ctx.fillStyle = '#ffb0b0';
        ctx.fillText(this.denyText.text, this.w / 2, P.y - 12);
        ctx.globalAlpha = 1;
      }
    }
  }

  deny(text, idx) {
    this.denyText = { text, t: 1.1 };
    if (idx !== undefined) this.cardShake[idx] = 1;
  }

  // ---------- HUD ----------
  crownPos(team) {
    const L = this.L;
    const y = L.safeTop + 22;
    return team === 0 ? { x: this.w - 88, y } : { x: this.w - 36, y };
  }

  drawHud(ctx, b, game, dt) {
    const L = this.L;
    const g = ctx.createLinearGradient(0, 0, 0, L.hudH);
    g.addColorStop(0, '#2a3658');
    g.addColorStop(1, '#1e2742');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, this.w, L.hudH);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(0, L.hudH, this.w, 3);
    // 일시정지 버튼
    const pb = L.pause;
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    rr(ctx, pb.x + 2, pb.y + 2, pb.w - 4, pb.h - 4, 10);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.fillRect(pb.x + pb.w / 2 - 7, pb.y + 12, 5, 16);
    ctx.fillRect(pb.x + pb.w / 2 + 2, pb.y + 12, 5, 16);
    // 스테이지
    ctx.textAlign = 'left';
    const maxW = this.w / 2 - 38 - (pb.x + pb.w + 6);
    ctx.fillStyle = '#c8d4f0';
    ctx.font = `800 11px ${FONT}`;
    ctx.fillText(fit(ctx, game.info?.label || '', maxW), pb.x + pb.w + 6, L.safeTop + 18);
    ctx.fillStyle = '#8fa0c8';
    ctx.font = `700 10px ${FONT}`;
    ctx.fillText(fit(ctx, game.info?.sub || '', maxW), pb.x + pb.w + 6, L.safeTop + 33);
    // 타이머
    const cx = this.w / 2 - 10;
    const tt = Math.max(0, Math.ceil(b.clock));
    const mm = Math.floor(tt / 60);
    const ss = String(tt % 60).padStart(2, '0');
    ctx.textAlign = 'center';
    ctx.fillStyle = b.phase === 'overtime' ? '#ffcf6b' : '#8fa0c8';
    ctx.font = `800 10px ${FONT}`;
    ctx.fillText(b.phase === 'overtime' ? '연장전' : b.double ? '엘릭서 2배' : '남은 시간', cx, L.safeTop + 14);
    ctx.fillStyle = b.clock < 10 && b.phase === 'overtime' ? '#ff8a8a' : '#ffffff';
    ctx.font = `900 21px ${FONT}`;
    ctx.fillText(`${mm}:${ss}`, cx, L.safeTop + 36);
    // 크라운
    for (const team of [0, 1]) {
      const p = this.crownPos(team);
      if (this.crownPop[team] > 0) this.crownPop[team] -= dt * 2.5;
      const sc = 1 + Math.max(0, this.crownPop[team]) * 0.6;
      ctx.fillStyle = TEAM[team].dark;
      rr(ctx, p.x - 24, p.y - 16, 48, 32, 10);
      ctx.fill();
      ctx.fillStyle = TEAM[team].main;
      rr(ctx, p.x - 22, p.y - 14, 44, 28, 8);
      ctx.fill();
      ctx.save();
      ctx.translate(p.x - 8, p.y);
      ctx.scale(sc, sc);
      drawIcon(ctx, 'crown', 9);
      ctx.restore();
      ctx.fillStyle = '#fff';
      ctx.font = `900 17px ${FONT}`;
      ctx.textAlign = 'center';
      ctx.fillText(this.crownShown[team], p.x + 11, p.y + 6);
    }
  }

  addCrown(team, wx, wy, onArrive) {
    const p = this.w2s(wx, wy);
    this.crownFx.push({ team, x: p.x, y: p.y - 30, t: 0, onArrive });
  }

  drawCrownFx(ctx, dt) {
    for (const c of this.crownFx) {
      c.t += dt;
      const k = Math.min(1, c.t / 1.1);
      const to = this.crownPos(c.team);
      let x;
      let y;
      let sc;
      if (k < 0.35) {
        const q = k / 0.35;
        x = c.x;
        y = c.y - q * 30;
        sc = 0.5 + q * 1.6;
      } else {
        const q = (k - 0.35) / 0.65;
        const e = q * q * (3 - 2 * q);
        x = c.x + (to.x - c.x) * e;
        y = c.y - 30 + (to.y - c.y + 30) * e - Math.sin(q * Math.PI) * 40;
        sc = 2.1 - e * 1.4;
      }
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = 'rgba(255,230,120,0.35)';
      ctx.beginPath();
      ctx.arc(0, 0, 18 * sc, 0, Math.PI * 2);
      ctx.fill();
      drawIcon(ctx, 'crown', 12 * sc);
      ctx.restore();
      if (k >= 1 && !c.done) {
        c.done = true;
        this.crownShown[c.team]++;
        this.crownPop[c.team] = 1;
        c.onArrive?.();
      }
    }
    this.crownFx = this.crownFx.filter((c) => !c.done);
  }

  syncCrowns(b) {
    this.crownFx = [];
    this.crownShown = [b.teams[0].crowns, b.teams[1].crowns];
  }

  announce(text, color = '#ffffff') {
    this.banner = { text, color, t: 0 };
  }

  drawBanner(ctx, dt) {
    const bn = this.banner;
    if (!bn) return;
    bn.t += dt;
    if (bn.t > 2) {
      this.banner = null;
      return;
    }
    const k = bn.t < 0.2 ? bn.t / 0.2 : bn.t > 1.6 ? (2 - bn.t) / 0.4 : 1;
    const y = this.L.oy + this.L.ah * 0.5;
    ctx.save();
    ctx.globalAlpha = k;
    ctx.fillStyle = 'rgba(20,16,40,0.6)';
    ctx.fillRect(0, y - 26, this.w, 44);
    ctx.font = `900 ${Math.round(22 * (0.8 + k * 0.2))}px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#1a1030';
    ctx.strokeText(bn.text, this.w / 2, y + 5);
    ctx.fillStyle = bn.color;
    ctx.fillText(bn.text, this.w / 2, y + 5);
    ctx.restore();
  }

  showEnd(text, color) {
    this.endBanner = { text, color, t: 0 };
  }

  drawEndBanner(ctx, dt) {
    const e = this.endBanner;
    if (!e) return;
    e.t += dt;
    const k = Math.min(1, e.t / 0.35);
    const y = this.L.oy + this.L.ah * 0.45;
    ctx.save();
    ctx.fillStyle = `rgba(10,8,25,${0.45 * k})`;
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.translate(this.w / 2, y);
    const sc = k < 1 ? 0.3 + k * 0.9 : 1.2 - Math.min(0.2, (e.t - 0.35) * 0.8);
    ctx.scale(sc, sc);
    ctx.font = `900 46px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.lineWidth = 9;
    ctx.strokeStyle = '#1a1030';
    ctx.strokeText(e.text, 0, 0);
    ctx.fillStyle = e.color;
    ctx.fillText(e.text, 0, 0);
    ctx.restore();
  }

  // ---------- 튜토리얼 ----------
  drawTutorial(ctx, tut) {
    const t = this.time;
    if (tut.from && tut.to) {
      const k = (t % 1.8) / 1.8;
      const e = k < 0.15 ? 0 : k > 0.8 ? 1 : (k - 0.15) / 0.65;
      const ee = e * e * (3 - 2 * e);
      const x = tut.from.x + (tut.to.x - tut.from.x) * ee;
      const y = tut.from.y + (tut.to.y - tut.from.y) * ee;
      ctx.save();
      ctx.globalAlpha = k > 0.9 ? (1 - k) * 10 : 1;
      if (k > 0.8) {
        ctx.strokeStyle = 'rgba(255,255,255,0.8)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(tut.to.x, tut.to.y, 10 + (k - 0.8) * 120, 0, Math.PI * 2);
        ctx.stroke();
      }
      drawHand(ctx, x, y);
      ctx.restore();
    }
    if (tut.text) {
      ctx.font = `800 14px ${FONT}`;
      const lines = tut.text.split('\n');
      const w = Math.max(...lines.map((l) => ctx.measureText(l).width)) + 24;
      const h = lines.length * 19 + 14;
      const x = this.w / 2 - w / 2;
      const y = tut.textY ?? this.L.panel.y - h - 16;
      ctx.fillStyle = 'rgba(255,250,235,0.95)';
      rr(ctx, x, y, w, h, 12);
      ctx.fill();
      ctx.strokeStyle = '#d8b25a';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = '#3a2a4a';
      ctx.textAlign = 'center';
      lines.forEach((l, i) => ctx.fillText(l, this.w / 2, y + 22 + i * 19));
    }
  }

  // 타이틀 배경용
  drawIdle(dt) {
    const ctx = this.ctx;
    this.time += dt;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    if (this.arenaCache) ctx.drawImage(this.arenaCache, 0, 0, this.w, this.h);
    this.drawRiver(ctx);
  }
}

function fit(ctx, text, maxW) {
  if (ctx.measureText(text).width <= maxW) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(t + '..').width > maxW) t = t.slice(0, -1);
  return t + '..';
}

function drawHand(ctx, x, y) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(-0.35);
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.beginPath();
  ctx.ellipse(6, 30, 14, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.strokeStyle = '#2a2233';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(-5, 0);
  ctx.lineTo(-5, 18);
  ctx.quadraticCurveTo(-14, 12, -16, 18);
  ctx.quadraticCurveTo(-10, 30, -2, 38);
  ctx.lineTo(16, 38);
  ctx.quadraticCurveTo(22, 28, 20, 18);
  ctx.lineTo(20, 14);
  ctx.quadraticCurveTo(16, 10, 12, 14);
  ctx.quadraticCurveTo(9, 10, 5, 13);
  ctx.lineTo(5, 0);
  ctx.quadraticCurveTo(0, -6, -5, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255;
  let g = (n >> 8) & 255;
  let b = n & 255;
  const f = (v) => Math.round(amt < 0 ? v * (1 + amt) : v + (255 - v) * amt);
  r = f(r);
  g = f(g);
  b = f(b);
  return `rgb(${r},${g},${b})`;
}

export function buildCardFace(id, w, h, dpr) {
  let c;
  c = document.createElement('canvas');
  c.width = Math.round(w * dpr);
  c.height = Math.round(h * dpr);
  const g = c.getContext('2d');
  g.scale(dpr, dpr);
  const cd = CARDS[id];
  const rad = Math.min(10, w * 0.12);
  g.fillStyle = RARITY[cd.rarity] || '#ccc';
  rr(g, 0, 0, w, h, rad);
  g.fill();
  const inner = g.createLinearGradient(0, 0, 0, h);
  inner.addColorStop(0, '#fff8e8');
  inner.addColorStop(0.08, cd.color);
  inner.addColorStop(1, shade(cd.color, -0.35));
  g.fillStyle = inner;
  rr(g, 3, 3, w - 6, h - 6, rad - 2);
  g.fill();
  // 광택
  g.fillStyle = 'rgba(255,255,255,0.18)';
  g.beginPath();
  g.ellipse(w * 0.5, h * 0.18, w * 0.45, h * 0.12, 0, 0, Math.PI * 2);
  g.fill();
  // 아이콘
  g.save();
  g.translate(w / 2, h * 0.44);
  drawIcon(g, id, Math.min(w, h) * 0.3);
  g.restore();
  // 이름 띠
  g.fillStyle = 'rgba(20,16,30,0.62)';
  g.fillRect(3, h - h * 0.24, w - 6, h * 0.24 - 3);
  let fs = Math.max(9, Math.round(w * 0.16));
  g.font = `800 ${fs}px ${FONT}`;
  while (g.measureText(cd.name).width > w - 8 && fs > 8) {
    fs--;
    g.font = `800 ${fs}px ${FONT}`;
  }
  g.fillStyle = '#fff';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(cd.name, w / 2, h - h * 0.12 - 1);
  // 종류 뱃지
  const badge = cd.kind === 'spell' ? '주문' : cd.kind === 'building' ? '건물' : cd.air ? '공중' : cd.count ? `x${cd.count}` : '';
  if (badge) {
    g.font = `800 ${Math.max(8, Math.round(w * 0.12))}px ${FONT}`;
    const bw = g.measureText(badge).width + 8;
    g.fillStyle = 'rgba(20,16,30,0.55)';
    rr(g, w - bw - 4, 5, bw, Math.max(12, w * 0.17), 5);
    g.fill();
    g.fillStyle = '#fff';
    g.fillText(badge, w - bw / 2 - 4, 5 + Math.max(12, w * 0.17) / 2 + 0.5);
  }
return c;
}
