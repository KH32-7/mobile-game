// Canvas 2D 렌더러 (모든 그래픽 절차적 생성)
import { COLORS, STONE_COLOR, CONFIG } from './config.js';
import { JOKER_BY_ID, RARITY_COLOR, EDITIONS, fmt } from './jokers.js';
import { drawJokerArt, drawBossIcon } from './art.js';
import { SKINS } from './metadata.js';
import { HANDS } from './items.js';

export const FONT = 'system-ui, -apple-system, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';
const N = CONFIG.BOARD;

export const GEM_COLOR = { gold: '#ffd23f', ruby: '#ff2e63', glass: '#9ff0ff', steel: '#b8c2d6' };
export const GEM_NAME = { gold: '금', ruby: '루비', glass: '유리', steel: '강철' };

const ANTE_TINT = [null, 'rgba(40,200,220,0.10)', 'rgba(60,110,255,0.12)', 'rgba(150,80,255,0.13)', 'rgba(230,70,200,0.12)', 'rgba(255,160,40,0.12)', 'rgba(255,60,60,0.13)', 'rgba(200,0,40,0.18)'];

// 어두운/회색 보스 색은 밝게 섞어 대비 확보
export function readable(hex) {
  if (!hex || hex[0] !== '#' || hex.length < 7) return hex;
  const n = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const lum = (0.2126 * n[0] + 0.7152 * n[1] + 0.0722 * n[2]) / 255;
  const sat = (Math.max(...n) - Math.min(...n)) / 255;
  const k = lum < 0.55 || sat < 0.25 ? 0.45 : 0;
  if (!k) return hex;
  return '#' + n.map((v) => Math.round(v + (255 - v) * k).toString(16).padStart(2, '0')).join('');
}

function rr(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function computeLayout(vw, vh, safe) {
  const gw = Math.min(vw, 500, Math.max(320, vh * 0.62));
  const gx = Math.round((vw - gw) / 2);
  const pad = 12;
  const top = safe.top + 4;
  const bottom = vh - safe.bottom - 6;
  const hudH = 48;
  const scoreH = 44;
  const jgap = 6;
  const cardW = Math.floor((gw - pad * 2 - jgap * 4) / 5);
  const jokH = Math.round(Math.min(Math.max(cardW * 1.05, 54), 80));
  const calcH = 50;
  const stripH = 16;
  const barH = 44;
  const fixed = hudH + scoreH + jokH + stripH + calcH + 2 + barH;
  const avail = bottom - top - fixed - 16;
  const trayK = 2.7 / 8; // 트레이 높이 = 보드 * trayK + 8
  let board = Math.min(gw - pad * 2, (avail - 8) / (1 + trayK));
  board = Math.floor(board / N) * N;
  const cell = board / N;
  const trayH = Math.round(board * trayK + 8);
  const used = fixed + board + trayH;
  let spare = bottom - top - used;
  const gap = Math.max(3, Math.min(16, spare / 6));
  const lead = Math.max(0, (spare - gap * 5) / 2);
  let y = top + Math.min(lead, 10);
  const L = { vw, vh, gx, gw, pad, cell, gap };
  L.hud = { x: gx + pad, y, w: gw - pad * 2, h: hudH }; y += hudH + gap * 0.5;
  L.score = { x: gx + pad, y, w: gw - pad * 2, h: scoreH }; y += scoreH + gap;
  L.jokers = { x: gx + pad, y, w: gw - pad * 2, h: jokH, cardW, gap: jgap }; y += jokH + 2;
  L.strip = { x: gx + pad, y, w: gw - pad * 2, h: stripH }; y += stripH + Math.min(gap, 6);
  L.calc = { x: gx + pad, y, w: gw - pad * 2, h: calcH }; y += calcH + gap;
  // 남는 공간은 보드와 트레이 주변에
  const rest = bottom - (y + board + trayH);
  y += Math.max(0, rest * 0.35);
  L.board = { x: Math.round(gx + (gw - board) / 2), y: Math.round(y), w: board, h: board }; y += board + Math.max(gap, rest * 0.3) + 4;
  y = Math.min(y, bottom - trayH - barH);
  L.tray = { x: gx + pad, y, w: gw - pad * 2, h: trayH };
  // 하단 바: 트레이 교체(왼쪽), 일시정지(오른쪽) - 한 손 엄지 도달 영역
  L.bar = { x: gx + pad, y: y + trayH, w: gw - pad * 2, h: barH };
  L.pause = { x: L.bar.x + L.bar.w - 48, y: L.bar.y, w: 48, h: 44 };
  L.swapBtn = { x: L.bar.x, y: L.bar.y, w: Math.min(190, L.bar.w * 0.55), h: 44 };
  L.traySlot = (i) => ({ x: L.tray.x + (L.tray.w / 3) * i, y: L.tray.y, w: L.tray.w / 3, h: L.tray.h });
  L.trayScale = Math.min(cell * 0.6, (L.tray.w / 3 - 14) / 5, (trayH - 10) / 3.2);
  // 3칸 이하 조각은 더 크게 보여 줌
  L.trayBig = Math.max(L.trayScale, Math.min(cell * 0.74, (L.tray.w / 3 - 12) / 3.3, (trayH - 8) / 3.15));
  L.pieceScale = (p) => (p.shape.w <= 3 && p.shape.h <= 3 ? L.trayBig : L.trayScale);
  L.jokerRect = (i, n = 5) => {
    const cw = Math.min(cardW, Math.floor((L.jokers.w - jgap * (n - 1)) / n));
    const tot = cw * n + jgap * (n - 1);
    return { x: L.jokers.x + (L.jokers.w - tot) / 2 + i * (cw + jgap), y: L.jokers.y, w: cw, h: jokH };
  };
  return L;
}

export class Renderer {
  constructor(canvas) {
    this.cv = canvas;
    this.ctx = canvas.getContext('2d');
    this.blockCache = new Map();
    this.bg = null;
    this.dpr = 1;
    this.theme = SKINS[0];
    this.cardCache = new Map();
  }

  setAnte(ante) {
    if (this.ante === ante) return;
    this.ante = ante;
    if (this.L) { this.buildBg(this.L.vw, this.L.vh); this.bgShown = null; }
  }

  setTheme(skin) {
    this.theme = skin || SKINS[0];
    if (this.L) { this.buildBg(this.L.vw, this.L.vh); this.bgShown = null; }
  }

  // 드롭 순간에 스프라이트를 처음 만들지 않도록 미리 생성
  prewarm() {
    const L = this.L;
    if (!L || typeof document === 'undefined') return;
    for (let c = -1; c < COLORS.length; c++) { this.block(c, L.cell); this.block(c, L.trayScale); this.block(c, L.trayBig); }
    const saved = this.ctx;
    for (const gm of ['gold', 'ruby', 'glass', 'steel']) { this.drawGem(gm, -100, -100, L.cell, 0); this.drawGem(gm, -100, -100, L.trayScale, 0); this.drawGem(gm, -100, -100, L.trayBig, 0); }
    this.ctx = saved;
  }

  paintBg(which) {
    if (!this.bgCv || this.bgShown === which) return;
    const g = this.bgCv.getContext('2d');
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, this.bgCv.width, this.bgCv.height);
    g.drawImage(which === 'plain' ? this.bgPlain : this.bg, 0, 0);
    this.bgShown = which;
  }

  resize(vw, vh, dpr, L) {
    this.dpr = dpr;
    this.cv.width = Math.round(vw * dpr);
    this.cv.height = Math.round(vh * dpr);
    this.cv.style.width = vw + 'px';
    this.cv.style.height = vh + 'px';
    // 정적 배경은 별도 캔버스에 한 번만 그림 (매 프레임 전체 화면 복사 제거)
    this.bgCv = this.bgCv || (typeof document !== 'undefined' && document.getElementById('bgcv'));
    if (this.bgCv) {
      this.bgCv.width = this.cv.width; this.bgCv.height = this.cv.height;
      this.bgCv.style.width = vw + 'px'; this.bgCv.style.height = vh + 'px';
      this.bgShown = null;
    }
    this.L = L;
    this.blockCache.clear();
    if (this.gemCache) this.gemCache.clear();
    this.buildBg(vw, vh);
    this.prewarm();
  }

  buildBg(vw, vh) {
    const L = this.L;
    const T = this.theme;
    this.bgPlain = this.buildBgLayer(vw, vh, false);
    this.bg = this.buildBgLayer(vw, vh, true);
  }

  buildBgLayer(vw, vh, table) {
    const L = this.L;
    const T = this.theme;
    const c = document.createElement('canvas');
    c.width = Math.round(vw * this.dpr); c.height = Math.round(vh * this.dpr);
    const g = c.getContext('2d');
    g.scale(this.dpr, this.dpr);
    const grd = g.createRadialGradient(vw / 2, vh * 0.35, 20, vw / 2, vh * 0.4, Math.max(vw, vh) * 0.8);
    grd.addColorStop(0, T.bg[0]);
    grd.addColorStop(0.55, T.bg[1]);
    grd.addColorStop(1, T.bg[2]);
    g.fillStyle = grd; g.fillRect(0, 0, vw, vh);
    // 다이아 패턴
    g.globalAlpha = 0.05; g.strokeStyle = '#ffffff'; g.lineWidth = 1;
    const s = 34;
    for (let x = -vh; x < vw + vh; x += s) {
      g.beginPath(); g.moveTo(x, 0); g.lineTo(x + vh, vh); g.stroke();
      g.beginPath(); g.moveTo(x, vh); g.lineTo(x + vh, 0); g.stroke();
    }
    g.globalAlpha = 1;
    // 펠트 테이블 (보드 + 트레이 영역)
    if (table) {
    const fx = L.gx + 4, fy = Math.max(L.calc.y + L.calc.h + 3, L.board.y - 10), fw = L.gw - 8, fh = Math.min(vh - 2, L.bar.y + L.bar.h + 4) - fy;
    g.save();
    rr(g, fx, fy, fw, fh, 22);
    const fg = g.createRadialGradient(vw / 2, fy + fh * 0.4, 10, vw / 2, fy + fh * 0.4, fh);
    fg.addColorStop(0, T.felt[0]); fg.addColorStop(1, T.felt[1]);
    g.fillStyle = fg; g.fill();
    g.clip();
    // 앤티마다 펠트에 은은한 색 변화
    const tint = ANTE_TINT[((this.ante || 1) - 1) % ANTE_TINT.length];
    if (tint) { g.fillStyle = tint; g.fillRect(fx, fy, fw, fh); }
    // 펠트 노이즈
    for (let i = 0; i < (fw * fh) / 30; i++) {
      g.fillStyle = Math.random() < 0.5 ? 'rgba(255,255,255,0.035)' : 'rgba(0,0,0,0.06)';
      g.fillRect(fx + Math.random() * fw, fy + Math.random() * fh, 1.5, 1.5);
    }
    g.restore();
    rr(g, fx, fy, fw, fh, 22);
    g.strokeStyle = T.trim; g.lineWidth = 2; g.shadowColor = T.trim; g.shadowBlur = 10; g.stroke();
    g.shadowBlur = 0;
    rr(g, fx + 5, fy + 5, fw - 10, fh - 10, 18);
    g.strokeStyle = 'rgba(212,165,55,0.35)'; g.lineWidth = 1; g.stroke();
    // 트레이 구분선
    g.strokeStyle = 'rgba(0,0,0,0.25)'; g.lineWidth = 1;
    g.beginPath(); g.moveTo(L.tray.x + 10, L.tray.y - 4); g.lineTo(L.tray.x + L.tray.w - 10, L.tray.y - 4); g.stroke();
    // 보드 틀 + 빈칸 (정적)
    const b = L.board, cell = L.cell;
    rr(g, b.x - 6, b.y - 6, b.w + 12, b.h + 12, 12);
    g.fillStyle = 'rgba(0,0,0,0.45)'; g.fill();
    g.strokeStyle = 'rgba(120,255,200,0.25)'; g.lineWidth = 1.5; g.stroke();
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      const x = b.x + c * cell, y = b.y + r * cell;
      rr(g, x + 1.5, y + 1.5, cell - 3, cell - 3, cell * 0.14);
      g.fillStyle = (r + c) % 2 ? 'rgba(0,0,0,0.30)' : 'rgba(0,0,0,0.38)'; g.fill();
      g.strokeStyle = 'rgba(255,255,255,0.05)'; g.lineWidth = 1; g.stroke();
    }
    // 트레이 슬롯 자리
    for (let i = 0; i < 3; i++) {
      const slot = L.traySlot(i);
      const cx = slot.x + slot.w / 2, cy = slot.y + slot.h / 2;
      const r2 = Math.min(slot.w, slot.h) * 0.36;
      g.beginPath(); g.arc(cx, cy, r2, 0, Math.PI * 2);
      g.fillStyle = 'rgba(0,0,0,0.14)'; g.fill();
      g.setLineDash([5, 6]); g.strokeStyle = 'rgba(255,215,120,0.2)'; g.lineWidth = 2; g.stroke(); g.setLineDash([]);
    }
    }
    // 스캔라인
    g.fillStyle = 'rgba(0,0,0,0.10)';
    for (let y = 0; y < vh; y += 3) g.fillRect(0, y, vw, 1);
    // 비네트
    const vg = g.createRadialGradient(vw / 2, vh / 2, Math.min(vw, vh) * 0.3, vw / 2, vh / 2, Math.max(vw, vh) * 0.75);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.55)');
    g.fillStyle = vg; g.fillRect(0, 0, vw, vh);
    return c;
  }

  // 광택 젬 블록 스프라이트
  block(colorIdx, size) {
    const s = Math.max(4, Math.round(size));
    const key = colorIdx + ':' + s;
    let c = this.blockCache.get(key);
    if (c) return c;
    const col = colorIdx < 0 ? STONE_COLOR : COLORS[colorIdx];
    c = document.createElement('canvas');
    const px = Math.round(s * this.dpr);
    c.width = px; c.height = px;
    const g = c.getContext('2d');
    g.scale(this.dpr, this.dpr);
    const m = Math.max(1, s * 0.04);
    const r = s * 0.18;
    // 바탕
    rr(g, m, m, s - m * 2, s - m * 2, r);
    const lg = g.createLinearGradient(0, 0, s, s);
    lg.addColorStop(0, col.light); lg.addColorStop(0.35, col.base); lg.addColorStop(1, col.dark);
    g.fillStyle = lg; g.fill();
    // 베벨
    const b = s * 0.14;
    g.save(); rr(g, m, m, s - m * 2, s - m * 2, r); g.clip();
    g.fillStyle = 'rgba(0,0,0,0.25)';
    g.beginPath(); g.moveTo(s, 0); g.lineTo(s, s); g.lineTo(0, s); g.lineTo(b, s - b); g.lineTo(s - b, s - b); g.lineTo(s - b, b); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,255,255,0.22)';
    g.beginPath(); g.moveTo(0, 0); g.lineTo(s, 0); g.lineTo(s - b, b); g.lineTo(b, b); g.lineTo(b, s - b); g.lineTo(0, s); g.closePath(); g.fill();
    g.restore();
    // 윗면
    rr(g, b, b, s - b * 2, s - b * 2, r * 0.6);
    const ig = g.createLinearGradient(0, b, 0, s - b);
    ig.addColorStop(0, col.base); ig.addColorStop(1, col.dark);
    g.fillStyle = ig; g.globalAlpha = 0.55; g.fill(); g.globalAlpha = 1;
    // 광택
    g.save(); rr(g, b, b, s - b * 2, s - b * 2, r * 0.6); g.clip();
    g.fillStyle = 'rgba(255,255,255,0.35)';
    g.beginPath(); g.ellipse(s * 0.35, s * 0.2, s * 0.5, s * 0.22, -0.4, 0, Math.PI * 2); g.fill();
    g.restore();
    g.fillStyle = 'rgba(255,255,255,0.85)';
    g.beginPath(); g.arc(s * 0.28, s * 0.27, s * 0.05, 0, Math.PI * 2); g.fill();
    if (colorIdx < 0) {
      // 돌 금
      g.strokeStyle = 'rgba(0,0,0,0.45)'; g.lineWidth = Math.max(1, s * 0.04);
      g.beginPath(); g.moveTo(s * 0.2, s * 0.3); g.lineTo(s * 0.45, s * 0.5); g.lineTo(s * 0.4, s * 0.8); g.moveTo(s * 0.45, s * 0.5); g.lineTo(s * 0.8, s * 0.55); g.stroke();
    }
    this.blockCache.set(key, c);
    return c;
  }

  drawBlock(colorIdx, x, y, size, alpha = 1) {
    // 스프라이트는 보드 칸 / 트레이 칸 두 크기만 캐시하고 나머지는 스케일해서 그림 (애니메이션 중 캐시 폭증 방지)
    let base = size;
    if (this.L) { base = size <= this.L.trayScale * 1.1 ? this.L.trayScale : size <= this.L.trayBig * 1.1 ? this.L.trayBig : this.L.cell; if (size > base * 1.3) base = size; }
    const img = this.block(colorIdx, base);
    const ctx = this.ctx;
    if (alpha !== 1) ctx.globalAlpha = alpha;
    ctx.drawImage(img, x, y, size, size);
    if (alpha !== 1) ctx.globalAlpha = 1;
  }

  // 보석은 캐시한 스프라이트로 그리고 펄스만 스케일
  drawGem(type, cx, cy, size, t = 0) {
    if (!this.gemCache) this.gemCache = new Map();
    const key = type + '|' + Math.round(size) + '|' + this.dpr;
    let img = this.gemCache.get(key);
    if (!img) {
      const S = Math.ceil(size);
      img = document.createElement('canvas');
      img.width = Math.round(S * this.dpr); img.height = Math.round(S * this.dpr);
      const saved = this.ctx;
      this.ctx = img.getContext('2d');
      this.ctx.scale(this.dpr, this.dpr);
      this.drawGemRaw(type, S / 2, S / 2, size, 0, true);
      this.ctx = saved;
      this.gemCache.set(key, img);
    }
    const pulse = 1 + Math.sin(t * 4 + cx * 0.1) * 0.06;
    const d = size * pulse;
    this.ctx.drawImage(img, cx - d / 2, cy - d / 2, d, d);
  }

  drawGemRaw(type, cx, cy, size, t = 0, still = false) {
    const ctx = this.ctx;
    const s = size * 0.3;
    const pulse = still ? 1 : 1 + Math.sin(t * 4 + cx * 0.1) * 0.06;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(pulse, pulse);
    ctx.shadowColor = GEM_COLOR[type]; ctx.shadowBlur = size * 0.2;
    ctx.beginPath();
    if (type === 'gold') {
      for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2 + Math.PI / 6; ctx.lineTo(Math.cos(a) * s, Math.sin(a) * s); }
    } else if (type === 'ruby') {
      ctx.moveTo(0, -s * 1.1); ctx.lineTo(s * 0.9, 0); ctx.lineTo(0, s * 1.1); ctx.lineTo(-s * 0.9, 0);
    } else if (type === 'glass') {
      ctx.moveTo(-s * 0.9, -s * 0.9); ctx.lineTo(s * 0.9, -s * 0.9); ctx.lineTo(s * 0.9, s * 0.9); ctx.lineTo(-s * 0.9, s * 0.9);
    } else {
      for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2 + Math.PI / 8; ctx.lineTo(Math.cos(a) * s, Math.sin(a) * s); }
    }
    ctx.closePath();
    const g = ctx.createLinearGradient(-s, -s, s, s);
    if (type === 'gold') { g.addColorStop(0, '#fff6b0'); g.addColorStop(0.5, '#ffd23f'); g.addColorStop(1, '#b37a00'); }
    else if (type === 'ruby') { g.addColorStop(0, '#ffc2d1'); g.addColorStop(0.5, '#ff2e63'); g.addColorStop(1, '#7a0020'); }
    else if (type === 'glass') { g.addColorStop(0, 'rgba(255,255,255,0.95)'); g.addColorStop(0.5, 'rgba(160,240,255,0.6)'); g.addColorStop(1, 'rgba(80,180,220,0.8)'); }
    else { g.addColorStop(0, '#ffffff'); g.addColorStop(0.5, '#aab4c8'); g.addColorStop(1, '#4a5366'); }
    ctx.fillStyle = g; ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineWidth = Math.max(1, size * 0.03); ctx.stroke();
    // 패싯
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = Math.max(0.7, size * 0.02);
    ctx.beginPath(); ctx.moveTo(-s * 0.4, -s * 0.2); ctx.lineTo(0, -s * 0.5); ctx.lineTo(s * 0.4, -s * 0.2); ctx.stroke();
    if (type === 'steel') { ctx.fillStyle = '#2b3140'; ctx.beginPath(); ctx.arc(0, 0, s * 0.25, 0, Math.PI * 2); ctx.fill(); }
    if (type === 'gold') { ctx.fillStyle = '#7a5200'; ctx.font = `900 ${Math.round(s * 1.1)}px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('$', 0, s * 0.05); }
    ctx.restore();
  }

  drawPiece(piece, x, y, cell, alpha = 1, t = 0) {
    piece.shape.cells.forEach(([r, c], k) => {
      this.drawBlock(piece.color, x + c * cell, y + r * cell, cell, alpha);
      const gem = piece.gems[k];
      if (gem) this.drawGem(gem, x + c * cell + cell / 2, y + r * cell + cell / 2, cell, t);
    });
  }

  text(str, x, y, { size = 16, color = '#fff', weight = 800, align = 'left', base = 'middle', stroke = null, sw = 4, glow = null, maxW } = {}) {
    const ctx = this.ctx;
    ctx.font = `${weight} ${size}px ${FONT}`;
    ctx.textAlign = align; ctx.textBaseline = base;
    if (glow) { ctx.shadowColor = glow; ctx.shadowBlur = Math.min(10, size * 0.3); }
    if (stroke) { ctx.lineJoin = 'round'; ctx.strokeStyle = stroke; ctx.lineWidth = sw; ctx.strokeText(str, x, y, maxW); }
    ctx.fillStyle = color; ctx.fillText(str, x, y, maxW);
    if (glow) ctx.shadowBlur = 0;
  }

  // ---------- 메인 드로우 ----------
  draw(app, time) {
    const { ctx, L } = this;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, L.vw, L.vh);
    if (!app.inRun) {
      if (this.bgCv) this.paintBg('plain'); else ctx.drawImage(this.bgPlain, 0, 0, L.vw, L.vh);
      this.drawTitleDeco(app, time);
      return;
    }
    if (this.bgCv) this.paintBg('table'); else ctx.drawImage(this.bg, 0, 0, L.vw, L.vh);
    if (app.showdown) {
      const pulse = 0.25 + Math.sin(time * 2.2) * 0.08;
      const vg = ctx.createRadialGradient(L.vw / 2, L.vh / 2, L.vw * 0.2, L.vw / 2, L.vh / 2, Math.max(L.vw, L.vh) * 0.7);
      vg.addColorStop(0, 'rgba(120,0,30,0)'); vg.addColorStop(1, `rgba(170,0,40,${pulse})`);
      ctx.fillStyle = vg; ctx.fillRect(0, 0, L.vw, L.vh);
    }
    if (app.feltWave && app.feltWave.t < 0.7) {
      const q = app.feltWave.t / 0.7;
      const cx = L.board.x + L.board.w / 2, cy = L.board.y + L.board.h / 2;
      const rad = (0.2 + q) * Math.max(L.board.w, L.board.h) * 1.1;
      const wg = ctx.createRadialGradient(cx, cy, rad * 0.7, cx, cy, rad);
      wg.addColorStop(0, 'rgba(0,0,0,0)'); wg.addColorStop(0.7, app.feltWave.color.replace('A', String(0.35 * (1 - q)))); wg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = wg; ctx.fillRect(L.gx, L.board.y - 14, L.gw, L.tray.y + L.tray.h - L.board.y + 20);
    }
    const [sx, sy] = app.fx.offset();
    ctx.save();
    ctx.translate(sx, sy);
    this.drawHud(app, time);
    this.drawJokers(app, time);
    this.drawCalc(app, time);
    this.drawBoard(app, time);
    this.drawTray(app, time);
    this.drawBar(app, time);
    this.drawBeams(app);
    this.drawFx(app, time);
    this.drawComboWord(app);
    this.drawBubbles(app);
    ctx.restore();
    this.drawDrag(app, time);
    this.drawBanner(app, time);
    if (app.tutorial && !app.banner) this.drawTutorial(app, time);
    if (app.fx.flash > 0) { ctx.fillStyle = `rgba(255,255,255,${app.fx.flash * 0.35})`; ctx.fillRect(0, 0, L.vw, L.vh); }
    if (app.intro) this.drawIntro(app, time);
  }

  drawBeams(app) {
    const { ctx, L } = this;
    const b = L.board, cell = L.cell;
    for (const bm of app.beams) {
      const t = bm.t / bm.life;
      if (t < 0 || t > 1) continue;
      const head = t * 1.3; // 스윕 진행
      ctx.save();
      if (bm.row != null) {
        const y = b.y + bm.row * cell;
        const x0 = b.x - 10, len = b.w + 20;
        const g = ctx.createLinearGradient(x0, 0, x0 + len, 0);
        const hpos = Math.min(1, head);
        g.addColorStop(0, 'rgba(255,255,255,0)');
        g.addColorStop(Math.max(0, hpos - 0.35), 'rgba(255,255,255,0)');
        g.addColorStop(Math.max(0.001, hpos - 0.05), `rgba(255,255,255,${0.9 * (1 - t)})`);
        g.addColorStop(Math.min(1, hpos + 0.001), 'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.fillRect(x0, y + cell * 0.2, len, cell * 0.6);
        ctx.globalAlpha = (1 - t) * 0.5; ctx.fillStyle = bm.color; ctx.fillRect(x0, y + cell * 0.45, len, cell * 0.1);
      } else {
        const x = b.x + bm.col * cell;
        const y0 = b.y - 10, len = b.h + 20;
        const g = ctx.createLinearGradient(0, y0, 0, y0 + len);
        const hpos = Math.min(1, head);
        g.addColorStop(0, 'rgba(255,255,255,0)');
        g.addColorStop(Math.max(0, hpos - 0.35), 'rgba(255,255,255,0)');
        g.addColorStop(Math.max(0.001, hpos - 0.05), `rgba(255,255,255,${0.9 * (1 - t)})`);
        g.addColorStop(Math.min(1, hpos + 0.001), 'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.fillRect(x + cell * 0.2, y0, cell * 0.6, len);
        ctx.globalAlpha = (1 - t) * 0.5; ctx.fillStyle = bm.color; ctx.fillRect(x + cell * 0.45, y0, cell * 0.1, len);
      }
      ctx.restore();
    }
  }

  drawComboWord(app) {
    const w = app.comboWord;
    if (!w) return;
    const { ctx, L } = this;
    const t = w.t / w.life;
    const sc = t < 0.12 ? 0.3 + (t / 0.12) * 1.0 : t < 0.22 ? 1.3 - ((t - 0.12) / 0.1) * 0.3 : 1 + (t - 0.22) * 0.1;
    const a = t > 0.75 ? (1 - t) / 0.25 : 1;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.translate(L.board.x + L.board.w / 2, L.board.y + L.board.h * 0.42 - t * 20);
    ctx.rotate(-0.06);
    ctx.scale(sc, sc);
    // 큰 글로우 텍스트는 한 번만 오프스크린에 그려 두고 매 프레임 이미지로 그림 (롱태스크 방지)
    if (w._spr === undefined) w._spr = this.comboSprite(w, L.board.w);
    if (w._spr) ctx.drawImage(w._spr.cv, -w._spr.ox, -w._spr.oy, w._spr.w, w._spr.h);
    ctx.restore();
  }

  comboSprite(w, maxW) {
    const size = w.size || 44;
    const W = Math.ceil(maxW + 40), H = Math.ceil(size * 1.9 + (w.sub ? 30 : 0));
    const k = Math.min(2, this.dpr);
    const cv = document.createElement('canvas');
    cv.width = Math.ceil(W * k); cv.height = Math.ceil(H * k);
    const g = cv.getContext('2d');
    if (!g) return null;
    g.scale(k, k);
    const saved = this.ctx; this.ctx = g;
    const ox = W / 2, oy = size * 0.95;
    g.globalAlpha = 0.3;
    this.text(w.text, ox, oy, { size, color: w.color, weight: 900, align: 'center', stroke: w.color, sw: 16, maxW });
    g.globalAlpha = 1;
    this.text(w.text, ox, oy, { size, color: w.color, weight: 900, align: 'center', stroke: 'rgba(20,0,40,0.9)', sw: 8, maxW });
    if (w.sub) this.text(w.sub, ox, oy + size * 0.75, { size: 17, color: '#fff', weight: 900, align: 'center', stroke: 'rgba(20,0,40,0.9)', sw: 5 });
    this.ctx = saved;
    return { cv, ox, oy, w: W, h: H };
  }

  drawIntro(app, time) {
    const it = app.intro;
    const { ctx, L } = this;
    const t = it.t / it.life;
    const a = t < 0.15 ? t / 0.15 : t > 0.85 ? (1 - t) / 0.15 : 1;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle = 'rgba(8,0,12,0.92)'; ctx.fillRect(0, 0, L.vw, L.vh);
    const cy = L.vh * 0.45;
    // 방사형 빛
    ctx.translate(L.vw / 2, cy);
    ctx.rotate(time * 0.3);
    ctx.globalAlpha = a * 0.25;
    for (let i = 0; i < 16; i++) {
      ctx.rotate(Math.PI / 8);
      ctx.fillStyle = it.color;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-30, -L.vh); ctx.lineTo(30, -L.vh); ctx.closePath(); ctx.fill();
    }
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.globalAlpha = a;
    const sc = 0.8 + Math.min(1, t * 4) * 0.2;
    ctx.translate(L.vw / 2, cy); ctx.scale(sc, sc);
    this.text('쇼다운', 0, -64, { size: 18, color: '#fff', weight: 900, align: 'center' });
    this.text(it.name, 0, -18, { size: 42, color: it.color, weight: 900, align: 'center', glow: it.color, stroke: 'rgba(0,0,0,0.8)', sw: 6, maxW: L.gw - 20 });
    this.text(it.desc, 0, 30, { size: 15, color: '#fff', weight: 800, align: 'center', maxW: L.gw - 30 });
    this.text(`목표 ${fmt(it.target)}`, 0, 60, { size: 15, color: '#ffe68a', weight: 900, align: 'center' });
    ctx.restore();
  }

  drawTitleDeco(app, time) {
    // 타이틀 배경에 떠다니는 블록
    const { L } = this;
    const n = 14;
    for (let i = 0; i < n; i++) {
      const s = 26 + (i % 4) * 8;
      const x = ((i * 97.3 + time * (12 + (i % 3) * 6)) % (L.vw + 80)) - 40;
      const y = (i * 61.7) % L.vh + Math.sin(time + i) * 10;
      this.drawBlock(i % COLORS.length, x, y, s, 0.14);
    }
  }

  drawHud(app, time) {
    const { ctx, L } = this;
    const g = app.game;
    const h = L.hud;

    // 앤티 / 블라인드 (라운드 시작 시점 정보)
    const bx = h.x + 4;
    const hd = app.hud || { ante: g.ante, blind: g.blind, name: g.blindName, color: g.blind === 2 ? g.bossDef.color : null, endless: g.endless };
    this.text(`앤티 ${hd.ante}${hd.endless ? '' : ' / ' + CONFIG.FINAL_ANTE}`, bx, h.y + 15, { size: 13, color: '#c9b8ff', weight: 700 });
    const boss = hd.blind === 2;
    const bcol = boss ? readable(hd.color) : hd.blind === 1 ? '#ffb627' : '#36c9ff';
    if (boss) drawBossIcon(ctx, hd.boss, bx + 9, h.y + 34, 9);
    this.text((boss ? '보스 · ' : '') + hd.name, bx + (boss ? 22 : 0), h.y + 34, { size: 16, color: bcol, weight: 900, stroke: 'rgba(0,0,0,0.55)', sw: 3, maxW: h.w - 190 });
    app.hit.blind = { x: bx, y: h.y, w: h.w - 180, h: h.h };
    // 코인
    const cx = h.x + h.w;
    rr(ctx, cx - 76, h.y + 6, 76, 36, 18);
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fill();
    ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 1.5; ctx.stroke();
    this.drawCoin(cx - 58, h.y + 24, 10);
    const coinPulse = app.coinPulse > 0 ? 1 + app.coinPulse * 0.4 : 1;
    ctx.save(); ctx.translate(cx - 26, h.y + 24); ctx.scale(coinPulse, coinPulse);
    this.text(String(Math.round(app.coinsShown ?? g.coins)), 0, 1, { size: 18, color: '#ffe68a', weight: 900, align: 'center' });
    ctx.restore();

    // 점수 바
    const s = L.score;
    rr(ctx, s.x, s.y, s.w, s.h, 12);
    ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1; ctx.stroke();
    const prog = Math.min(1, app.shownScore / g.target);
    const bw = s.w - 16;
    if (app.shownScore >= g.target) {
      const pulse = 0.6 + Math.sin(time * 8) * 0.4;
      rr(ctx, s.x - 1, s.y - 1, s.w + 2, s.h + 2, 13);
      ctx.strokeStyle = `rgba(255,210,63,${pulse * 0.25})`; ctx.lineWidth = 9; ctx.stroke();
      ctx.strokeStyle = `rgba(255,210,63,${pulse})`; ctx.lineWidth = 3; ctx.stroke();
    }
    rr(ctx, s.x + 8, s.y + s.h - 12, bw, 6, 3);
    ctx.fillStyle = 'rgba(255,255,255,0.1)'; ctx.fill();
    if (prog > 0) {
      rr(ctx, s.x + 8, s.y + s.h - 12, Math.max(6, bw * prog), 6, 3);
      const pg = ctx.createLinearGradient(s.x, 0, s.x + bw, 0);
      pg.addColorStop(0, '#36c9ff'); pg.addColorStop(1, '#ff4d6d');
      ctx.fillStyle = pg; ctx.fill();
      if (prog >= 0.5) {
        // 불꽃
        const fx = s.x + 8 + bw * prog, fy = s.y + s.h - 9;
        const inten = prog >= 1 ? 1.4 : 0.7 + (prog - 0.5);
        for (let i = 0; i < 5; i++) {
          const ph = time * 12 + i * 1.7;
          const hh = (8 + Math.sin(ph) * 4 + i * 1.5) * inten;
          const ox = -i * 5 * inten;
          ctx.fillStyle = i % 2 ? 'rgba(255,190,60,0.85)' : 'rgba(255,90,60,0.8)';
          ctx.beginPath(); ctx.moveTo(fx + ox - 4, fy + 2); ctx.quadraticCurveTo(fx + ox + Math.sin(ph) * 3, fy - hh, fx + ox + 4, fy + 2); ctx.fill();
        }
        ctx.fillStyle = 'rgba(255,255,200,0.9)'; ctx.beginPath(); ctx.arc(fx, fy - 1, 2.5 * inten, 0, Math.PI * 2); ctx.fill();
      }
    }
    const scPulse = 1 + app.scorePulse * 0.15;
    ctx.save(); ctx.translate(s.x + 12, s.y + 17); ctx.scale(scPulse, scPulse);
    this.text(fmt(app.shownScore), 0, 0, { size: 22, weight: 900, color: '#fff' });
    ctx.restore();
    ctx.font = `900 22px ${FONT}`;
    const sw = ctx.measureText(fmt(app.shownScore)).width * scPulse;
    this.text(`/ ${fmt(g.target)}`, s.x + 18 + sw, s.y + 19, { size: 13, color: '#b9a8e6', weight: 700 });
    // 남은 트레이
    const tx = s.x + s.w - 10;
    this.text('트레이', tx - 34, s.y + 17, { size: 11, color: '#9fe8c8', weight: 700, align: 'right' });
    for (let i = 0; i < Math.min(8, g.handsLeft + 1); i++) {
      const on = i < g.handsLeft;
      const px = tx - 28 + (i % 4) * 7, py = s.y + 8 + Math.floor(i / 4) * 10;
      rr(ctx, px, py, 5, 8, 1.5);
      ctx.fillStyle = on ? '#3ddc97' : i === g.handsLeft && g.tray.some(Boolean) ? '#ffd23f' : 'rgba(255,255,255,0.15)'; ctx.fill();
    }
    if (g.handsLeft === 0) this.text('마지막!', tx, s.y + 17, { size: 11, color: '#ff4d6d', weight: 900, align: 'right' });
  }

  drawCoin(x, y, r) {
    const ctx = this.ctx;
    const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 1, x, y, r);
    g.addColorStop(0, '#fff6b0'); g.addColorStop(0.6, '#ffc21a'); g.addColorStop(1, '#a36b00');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    this.text('$', x, y + 1, { size: r * 1.3, color: '#7a4f00', weight: 900, align: 'center' });
  }

  // 조커 카드 스프라이트 (프레임 + 일러스트 + 이름판). 캐시
  jokerSprite(id, w, h) {
    const key = id + '|' + Math.round(w) + '|' + Math.round(h) + '|' + this.dpr;
    let c = this.cardCache.get(key);
    if (c) return c;
    const d = JOKER_BY_ID[id];
    c = document.createElement('canvas');
    c.width = Math.round(w * this.dpr); c.height = Math.round(h * this.dpr);
    const g = c.getContext('2d');
    g.scale(this.dpr, this.dpr);
    const plate = Math.max(15, Math.round(h * 0.2));
    rr(g, 0, 0, w, h, 8);
    g.fillStyle = '#140a22'; g.fill();
    // 일러스트
    g.save();
    rr(g, 3, 3, w - 6, h - plate - 3, 6); g.clip();
    g.translate(3, 3);
    drawJokerArt(g, id, w - 6, h - plate - 3, d.hue);
    g.restore();
    // 이름판
    const pg = g.createLinearGradient(0, h - plate, 0, h);
    pg.addColorStop(0, '#f6ecd8'); pg.addColorStop(1, '#d8c7a4');
    rr(g, 3, h - plate - 1, w - 6, plate - 2, 4); g.fillStyle = pg; g.fill();
    const fs = Math.max(11, Math.min(13, (w - 8) / Math.max(3, d.name.length) * 1.2));
    g.font = `900 ${fs}px ${FONT}`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#2a1640';
    g.fillText(d.name, w / 2, h - plate / 2 - 1, w - 8);
    // 테두리
    rr(g, 1, 1, w - 2, h - 2, 7.5);
    g.strokeStyle = RARITY_COLOR[d.rarity]; g.lineWidth = 2.2; g.stroke();
    this.cardCache.set(key, c);
    if (this.cardCache.size > 400) this.cardCache.delete(this.cardCache.keys().next().value);
    return c;
  }

  // 네거티브 에디션: 픽셀 색 반전 + 보라 셰이드 (캐릭터가 또렷하게 보이도록)
  negSprite(id, w, h) {
    const key = 'neg|' + id + '|' + Math.round(w) + '|' + Math.round(h) + '|' + this.dpr;
    let c = this.cardCache.get(key);
    if (c) return c;
    const src = this.jokerSprite(id, w, h);
    c = document.createElement('canvas');
    c.width = src.width; c.height = src.height;
    const g = c.getContext('2d');
    g.drawImage(src, 0, 0);
    try {
      const im = g.getImageData(0, 0, c.width, c.height);
      const d = im.data;
      for (let i = 0; i < d.length; i += 4) {
        if (!d[i + 3]) continue;
        const r = 255 - d[i], gg = 255 - d[i + 1], b = 255 - d[i + 2];
        d[i] = r * 0.8 + 40; d[i + 1] = gg * 0.75 + 20; d[i + 2] = Math.min(255, b * 0.9 + 60);
      }
      g.putImageData(im, 0, 0);
    } catch { /* 무시 */ }
    this.cardCache.set(key, c);
    return c;
  }

  drawJokerCard(j, x, y, w, h, { scale = 1, disabled = false, time = 0, rot = 0 } = {}) {
    const { ctx } = this;
    const d = JOKER_BY_ID[j.id];
    ctx.save();
    ctx.translate(x + w / 2, y + h / 2);
    if (rot) ctx.rotate(rot);
    ctx.scale(scale, scale);
    ctx.translate(-w / 2, -h / 2);
    if (!disabled && d.rarity === 'legendary') { ctx.shadowColor = '#c86bff'; ctx.shadowBlur = 10; }
    ctx.drawImage(j.ed === 'neg' && !disabled ? this.negSprite(j.id, w, h) : this.jokerSprite(j.id, w, h), 0, 0, w, h);
    ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
    // 에디션 반짝임
    if (j.ed && !disabled) {
      ctx.save();
      rr(ctx, 2, 2, w - 4, h - 4, 7); ctx.clip();
      const band = ((time * 0.6) % 1.6) - 0.3;

      const gx = ctx.createLinearGradient(band * w - h, 0, band * w + h, h);
      const col = j.ed === 'foil' ? '200,235,255' : j.ed === 'holo' ? '255,160,240' : j.ed === 'poly' ? `${128 + 127 * Math.sin(time * 3) | 0},${128 + 127 * Math.sin(time * 3 + 2) | 0},${128 + 127 * Math.sin(time * 3 + 4) | 0}` : '220,220,255';
      gx.addColorStop(0, `rgba(${col},0)`); gx.addColorStop(0.45, `rgba(${col},0)`); gx.addColorStop(0.5, `rgba(${col},0.55)`); gx.addColorStop(0.55, `rgba(${col},0)`); gx.addColorStop(1, `rgba(${col},0)`);
      ctx.fillStyle = gx; ctx.fillRect(0, 0, w, h);
      if (j.ed === 'holo' || j.ed === 'poly') {
        ctx.globalAlpha = 0.12; ctx.fillStyle = `hsl(${(time * 60) % 360},90%,60%)`; ctx.fillRect(0, 0, w, h); ctx.globalAlpha = 1;
      }
      ctx.restore();
      const tag = EDITIONS[j.ed].name;
      ctx.font = `900 9px ${FONT}`;
      const tw = ctx.measureText(tag).width + 6;
      rr(ctx, 3, 3, tw, 12, 4); ctx.fillStyle = 'rgba(0,0,0,0.65)'; ctx.fill();
      this.text(tag, 3 + tw / 2, 9.5, { size: 9, color: EDITIONS[j.ed].color, weight: 900, align: 'center' });
    }
    if (d.rarity === 'legendary' && !disabled) {
      rr(ctx, 1, 1, w - 2, h - 2, 7.5);
      ctx.strokeStyle = `hsla(${(time * 90) % 360},90%,70%,0.9)`; ctx.lineWidth = 2; ctx.stroke();
    }
    // 성장/충전 배지
    if (d.grow && j.v) {
      const label = d.id === 'bigblock' ? '충전' : d.id === 'collector' ? 'x' + (1 + j.v).toFixed(2) : d.id === 'hexed' ? 'x' + (1 + j.v).toFixed(1) : '+' + fmt(j.v);
      ctx.font = `800 10px ${FONT}`;
      const bw = ctx.measureText(label).width + 8;
      rr(ctx, w - bw - 2, 2, bw, 15, 7);
      ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fill();
      this.text(label, w - bw / 2 - 2, 10, { size: 10, color: '#ffe68a', weight: 800, align: 'center' });
    }
    if (disabled) {
      rr(ctx, 0, 0, w, h, 8); ctx.fillStyle = 'rgba(10,0,20,0.6)'; ctx.fill();
      ctx.strokeStyle = '#ff4d6d'; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(6, 6); ctx.lineTo(w - 6, h - 6); ctx.moveTo(w - 6, 6); ctx.lineTo(6, h - 6); ctx.stroke();
    }
    ctx.restore();
  }

  drawJokers(app, time) {
    const { ctx, L } = this;
    const g = app.game;
    const n = Math.max(5, g.jokerSlots);
    for (let i = 0; i < Math.max(g.jokerSlots, g.jokers.length); i++) {
      const r = L.jokerRect(i, n);
      const j = g.jokers[i];
      if (!j) {
        rr(ctx, r.x, r.y, r.w, r.h, 8);
        ctx.setLineDash([4, 4]); ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1.5; ctx.stroke(); ctx.setLineDash([]);
        continue;
      }
      const bt = app.jokerBounce[i] ?? 9;
      const sc = bt < 0.4 ? 1 + 0.15 * (1 - bt / 0.4) : 1;
      const lift = bt < 0.3 ? -Math.sin((bt / 0.3) * Math.PI) * 8 : 0;
      const rot = bt < 0.4 ? Math.sin(bt * 45) * 0.105 * (1 - bt / 0.4) : Math.sin(time * 1.3 + i) * 0.015;
      const dragOff = app.jokerDrag && app.jokerDrag.idx === i ? app.jokerDrag.dx : 0;
      const dim = app.seq && app.activeJoker != null && app.activeJoker !== i;
      if (dim) ctx.globalAlpha = 0.5;
      this.drawJokerCard(j, r.x + dragOff, r.y + lift + (dragOff ? -6 : 0), r.w, r.h, { scale: dragOff ? 1.08 : sc, disabled: j.disabled, time, rot });
      ctx.globalAlpha = 1;
    }
    if (!g.jokers.length && app.game.ante === 1 && app.game.blind === 0) {
      this.text('조커 슬롯 · 상점에서 구매', L.jokers.x + L.jokers.w / 2, L.jokers.y + L.jokers.h / 2, { size: 12, color: 'rgba(255,255,255,0.35)', weight: 700, align: 'center' });
    }
  }

  drawCalc(app, time) {
    const { ctx, L } = this;
    const c = L.calc;
    const k = app.calc;
    const g = app.game;
    const bw = (c.w - 40) / 2;
    const m = k.merge || 0;
    const e = m * m * (3 - 2 * m);
    const cp = 1 + k.chipsPulse * 0.12, mp = 1 + k.multPulse * 0.12;
    const pv = !k.active && app.drag && app.drag.valid && app.drag.preview;
    const chipTxt = k.active ? fmt(Math.round(k.chipsShown ?? k.chips)) : pv ? fmt(pv.chips) : '칩';
    // 배수 표시 정책: 최종 배수가 정수면 정수로 굴리고, 아니면 소수 1자리 고정
    const mv = k.multShown ?? k.mult;
    const multTxt = k.active ? (Number.isInteger(k.mult) ? String(Math.round(mv)) : mv.toFixed(1)) : pv ? fmt(pv.mult) : '배수';
    const big = k.active || pv;
    if (e < 1) {
      ctx.save();
      ctx.globalAlpha = Math.pow(1 - e, 2) * (pv ? 0.72 : 1);
      // 칩 박스
      ctx.save(); ctx.translate(c.x + bw / 2 + e * (bw / 2 + 20), c.y + c.h / 2); ctx.scale(cp, cp);
      rr(ctx, -bw / 2, -c.h / 2 + 4, bw, c.h - 8, 10);
      const cg = ctx.createLinearGradient(0, -c.h / 2, 0, c.h / 2);
      cg.addColorStop(0, '#1a8cff'); cg.addColorStop(1, '#0a4aa3');
      if (k.chipsPulse > 0.05) { ctx.strokeStyle = `rgba(54,201,255,${Math.min(0.6, k.chipsPulse * 0.6)})`; ctx.lineWidth = 3 + k.chipsPulse * 8; ctx.stroke(); }
      ctx.fillStyle = cg; ctx.fill();
      this.text(chipTxt, 0, 1, { size: big ? 24 : 15, color: '#fff', weight: 900, align: 'center', maxW: bw - 12, stroke: 'rgba(0,0,0,0.35)', sw: 3 });
      ctx.restore();
      this.text('X', c.x + c.w / 2, c.y + c.h / 2 + 1, { size: 22, color: '#fff', weight: 900, align: 'center', stroke: 'rgba(255,77,109,0.6)', sw: 4 });
      // 배수 박스
      ctx.save(); ctx.translate(c.x + c.w - bw / 2 - e * (bw / 2 + 20), c.y + c.h / 2); ctx.scale(mp, mp);
      rr(ctx, -bw / 2, -c.h / 2 + 4, bw, c.h - 8, 10);
      const mg = ctx.createLinearGradient(0, -c.h / 2, 0, c.h / 2);
      mg.addColorStop(0, '#ff3b5c'); mg.addColorStop(1, '#a3082a');
      if (k.multPulse > 0.05) { ctx.strokeStyle = `rgba(255,77,109,${Math.min(0.6, k.multPulse * 0.6)})`; ctx.lineWidth = 3 + k.multPulse * 8; ctx.stroke(); }
      ctx.fillStyle = mg; ctx.fill();
      this.text(multTxt, 0, 1, { size: big ? 24 : 15, color: '#fff', weight: 900, align: 'center', maxW: bw - 12, stroke: 'rgba(0,0,0,0.35)', sw: 3 });
      ctx.restore();
      ctx.restore();
    }
    // 합쳐진 공식 막대: 칩 X 배수 = 합계
    if (e > 0) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, (e - 0.45) * 2.2)) * (k.fade ?? 1);
      const pop = 1 + Math.max(0, 0.12 - Math.abs(e - 0.9)) * 2;
      ctx.translate(c.x + c.w / 2, c.y + c.h / 2); ctx.scale(pop, pop);
      rr(ctx, -c.w / 2, -c.h / 2 + 4, c.w, c.h - 8, 12);
      const gg = ctx.createLinearGradient(-c.w / 2, 0, c.w / 2, 0);
      gg.addColorStop(0, '#0a4aa3'); gg.addColorStop(0.35, '#2a0f4a'); gg.addColorStop(0.65, '#2a0f4a'); gg.addColorStop(1, '#a3082a');
      ctx.fillStyle = gg; ctx.fill();
      ctx.strokeStyle = 'rgba(255,182,39,0.3)'; ctx.lineWidth = 7; ctx.stroke(); ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 2; ctx.stroke();
      const parts = [
        [fmt(k.chips), '#7fd0ff', 17], [' X ', '#fff', 15], [fmt(k.mult), '#ff8fa3', 17], [' = ', '#fff', 15], [k.totalReady === false || !k.totalShown ? '?' : fmt(k.totalShown), '#ffe68a', 26],
      ];
      let tw = 0;
      for (const [t, , fs] of parts) { ctx.font = `900 ${fs}px ${FONT}`; tw += ctx.measureText(t).width; }
      const fit = Math.min(1, (c.w - 20) / tw);
      ctx.scale(fit, fit);
      let xx = -tw / 2;
      for (const [t, col, fs] of parts) {
        ctx.font = `900 ${fs}px ${FONT}`;
        const ww = ctx.measureText(t).width;
        this.text(t, xx, 1, { size: fs, color: col, weight: 900, align: 'left', stroke: 'rgba(0,0,0,0.5)', sw: 3, glow: fs > 20 ? '#ffb627' : null });
        xx += ww;
      }
      ctx.restore();
    }
    ctx.globalAlpha = 1;
    // 라벨 (줄 종류, 레벨, 콤보)
    if (pv) {
      this.text(`${HANDS[pv.hand].name} Lv.${pv.lv} · ${fmt(pv.chips)} X ${fmt(pv.mult)} 예상 (조커 제외)`, c.x + c.w / 2, L.strip.y + L.strip.h / 2, { size: 12, color: '#9fe8ff', weight: 900, align: 'center', stroke: 'rgba(0,0,0,0.8)', sw: 3, maxW: c.w });
    } else if (k.label && k.labelAlpha > 0) {
      ctx.globalAlpha = k.labelAlpha;
      this.text(k.label, c.x + c.w / 2, L.strip.y + L.strip.h / 2, { size: 12, color: '#ffe68a', weight: 900, align: 'center', stroke: 'rgba(0,0,0,0.8)', sw: 3, maxW: c.w });
      ctx.globalAlpha = 1;
    } else if (!k.active && g.blind === 2 && g.phase === 'play') {
      drawBossIcon(ctx, g.boss, c.x + c.w / 2 - Math.min(c.w, ctx.measureText(g.bossDef.desc).width * 1.05) / 2 - 12, L.strip.y + L.strip.h / 2, 7);
      this.text(g.bossDef.desc, c.x + c.w / 2, L.strip.y + L.strip.h / 2, { size: 11, color: g.bossDef.color, weight: 800, align: 'center', maxW: c.w - 30, stroke: 'rgba(0,0,0,0.8)', sw: 3 });
    }
  }

  cellXY(r, c) {
    const b = this.L.board;
    return [b.x + c * this.L.cell, b.y + r * this.L.cell];
  }

  drawBoard(app, time) {
    const { ctx, L } = this;
    const g = app.game;
    const b = L.board, cell = L.cell;
    // 보드 틀과 빈칸은 배경 레이어에 미리 그려 둠
    const drag = app.drag;
    const hl = drag && drag.valid ? drag.lines : null;
    const hlSet = new Set();
    if (hl) {
      hl.rows.forEach((r) => { for (let c = 0; c < N; c++) hlSet.add(r * N + c); });
      hl.cols.forEach((c) => { for (let r = 0; r < N; r++) hlSet.add(r * N + c); });
    }
    // 블록
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      const cellD = g.board[r * N + c];
      if (!cellD) continue;
      const x = b.x + c * cell, y = b.y + r * cell;
      const col = cellD.stone ? -1 : hlSet.has(r * N + c) ? drag.piece.color : cellD.color;
      this.drawBlock(col, x, y, cell);
      if (cellD.gem) this.drawGem(cellD.gem, x + cell / 2, y + cell / 2, cell, time);
    }
    // 고스트
    if (drag && drag.valid) {
      const [gx, gy] = this.cellXY(drag.row, drag.col);
      this.drawPiece(drag.piece, gx, gy, cell, 0.38, time);
      // 지워질 줄 하이라이트
      if (hlSet.size) {
        const pulse = 0.25 + Math.sin(time * 10) * 0.12;
        ctx.fillStyle = `rgba(255,255,255,${pulse})`;
        for (const k of hlSet) {
          const x = b.x + (k % N) * cell, y = b.y + Math.floor(k / N) * cell;
          rr(ctx, x + 2, y + 2, cell - 4, cell - 4, cell * 0.14); ctx.fill();
        }
      }
    }
    // 제거 중인 칸
    // 0.08초 흰 플래시 -> 1.2배 팽창 -> 파편
    for (const cl of app.clearing) {
      const tt = cl.t;
      if (tt < 0 || tt >= cl.life) continue;
      const x = b.x + cl.c * cell, y = b.y + cl.r * cell;
      let s = cell, a = 1, white = 0;
      if (tt < 0.08) { white = 1; }
      else { const q = (tt - 0.08) / (cl.life - 0.08); s = cell * (1 + 0.2 * Math.min(1, q * 2)); a = 1 - q; white = 0.5 * (1 - q); }
      this.drawBlock(cl.color, x + (cell - s) / 2, y + (cell - s) / 2, s, a);
      ctx.fillStyle = `rgba(255,255,255,${white})`;
      rr(ctx, x + (cell - s) / 2, y + (cell - s) / 2, s, s, s * 0.18); ctx.fill();
    }
    // 여러 줄 제거 시 보드 테두리 발광
    if (app.boardGlow && app.boardGlow.t < 0.3) {
      const q = 1 - app.boardGlow.t / 0.3;
      rr(ctx, b.x - 6, b.y - 6, b.w + 12, b.h + 12, 12);
      ctx.strokeStyle = app.boardGlow.color;
      for (let k = 0; k < 3; k++) { ctx.globalAlpha = q * (0.8 - k * 0.25); ctx.lineWidth = 4 + k * 6; ctx.stroke(); }
      ctx.globalAlpha = 1;
    }
    // 예상 점수 칩 (하이라이트 줄 끝)
    if (drag && drag.valid && drag.preview) {
      const pv = drag.preview;
      let px, py;
      if (pv.rows.length) { px = b.x; py = b.y + (pv.rows[0] + 0.5) * cell; } else { px = b.x + (pv.cols[0] + 0.5) * cell; py = b.y + 12; }
      const label = '+' + fmt(pv.total);
      ctx.font = `900 13px ${FONT}`;
      const w2 = ctx.measureText(label).width + 14;
      px = Math.min(px, b.x + b.w - w2 / 2); px = Math.max(px, b.x + w2 / 2);
      rr(ctx, px - w2 / 2, py - 11, w2, 22, 11);
      ctx.fillStyle = 'rgba(20,6,40,0.92)'; ctx.fill(); ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 1.5; ctx.stroke();
      this.text(label, px, py + 0.5, { size: 13, color: '#ffe68a', weight: 900, align: 'center' });
    }
    // 콤보 카운터 + 남은 유예
    if (g.phase === 'play') {
      const grace = g.comboGrace;
      const left = Math.max(0, grace - g.missStreak);
      const label = g.combo > 0 ? `콤보 ${g.combo} · 다음 +${g.combo * CONFIG.COMBO_MULT} 배수` : '콤보 0 · 연속 제거 = 배수 UP';
      const dots = g.combo > 0 ? grace : 0;
      ctx.font = `900 13px ${FONT}`;
      const tw = ctx.measureText(label).width + 6;
      const pw = tw + 16 + dots * 9;
      const px = b.x + b.w - pw + 4, py = b.y - 16;
      rr(ctx, px, py, pw, 20, 10);
      const hot = g.combo >= 5 ? '#ff4d6d' : g.combo >= 3 ? '#ffb627' : g.combo > 0 ? '#36c9ff' : '#8f80b8';
      ctx.fillStyle = 'rgba(10,4,24,0.9)'; ctx.fill();
      ctx.strokeStyle = hot; ctx.lineWidth = 1.5; ctx.stroke();
      this.text(label, px + 8, py + 10.5, { size: 13, color: hot, weight: 900 });
      for (let i = 0; i < dots; i++) {
        ctx.beginPath(); ctx.arc(px + 12 + tw + i * 9, py + 10, 3.2, 0, Math.PI * 2);
        ctx.fillStyle = i < left ? hot : 'rgba(255,255,255,0.18)'; ctx.fill();
      }
    }
    // 스캔 하이라이트 (점수 계산 중 보석 칸)
    if (app.gemFlash) {
      const f = app.gemFlash;
      const x = b.x + f.c * cell, y = b.y + f.r * cell;
      rr(ctx, x, y, cell, cell, cell * 0.2);
      ctx.globalAlpha = 0.35; ctx.strokeStyle = GEM_COLOR[f.gem]; ctx.lineWidth = 8; ctx.stroke();
      ctx.globalAlpha = 1; ctx.lineWidth = 3; ctx.stroke();
    }
  }

  drawBar(app, time) {
    const { ctx, L } = this;
    const g = app.game;
    // 트레이 교체
    const sb = L.swapBtn;
    const left = g.swapsLeft || 0, max = g.maxSwaps || 2;
    const stuck = app.stuck;
    const pulse = stuck ? 0.6 + Math.sin(time * 8) * 0.4 : 0;
    rr(ctx, sb.x, sb.y + 4, sb.w, sb.h - 8, 18);
    ctx.fillStyle = left ? (stuck ? `rgba(255,190,40,${0.35 + pulse * 0.3})` : 'rgba(0,0,0,0.35)') : 'rgba(0,0,0,0.2)'; ctx.fill();
    ctx.strokeStyle = left ? (stuck ? '#ffd23f' : 'rgba(255,215,120,0.55)') : 'rgba(255,255,255,0.12)'; ctx.lineWidth = stuck ? 2.5 : 1.5; ctx.stroke();
    const nsel = app.swapSel ? app.swapSel.size : 0;
    this.text(nsel ? `↻ ${nsel}개 교체` : '↻ 트레이 교체', sb.x + 14, sb.y + sb.h / 2 + 1, { size: 14, color: left ? '#ffe68a' : 'rgba(255,255,255,0.35)', weight: 900 });
    for (let i = 0; i < max; i++) {
      ctx.beginPath(); ctx.arc(sb.x + sb.w - 18 - (max - 1 - i) * 14, sb.y + sb.h / 2, 5, 0, Math.PI * 2);
      ctx.fillStyle = i < left ? '#3ddc97' : 'rgba(255,255,255,0.15)'; ctx.fill();
    }
    if (!stuck && left && !nsel && g.phase === 'play') this.text('조각 탭 = 골라서 교체', sb.x + sb.w + 8, sb.y + sb.h / 2 + 1, { size: 11, color: 'rgba(255,230,160,0.55)', weight: 700, maxW: L.pause.x - sb.x - sb.w - 12 });
    if (stuck && left) this.text('놓을 곳 없음! 교체하기', sb.x + sb.w + 8, sb.y + sb.h / 2 + 1, { size: 12, color: '#ffd23f', weight: 900, maxW: L.pause.x - sb.x - sb.w - 12 });
    // 일시정지
    const p = L.pause;
    rr(ctx, p.x + 2, p.y + 2, p.w - 4, p.h - 4, 12);
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fill();
    ctx.strokeStyle = 'rgba(255,255,255,0.25)'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = '#fff';
    ctx.fillRect(p.x + p.w / 2 - 7, p.y + 14, 4, 16); ctx.fillRect(p.x + p.w / 2 + 3, p.y + 14, 4, 16);
  }

  drawTray(app, time) {
    const { ctx, L } = this;
    const g = app.game;
    // 빈 트레이 자리 문양 (자리 원은 배경에 미리 그림)
    for (let i = 0; i < 3; i++) {
      const slot = L.traySlot(i);
      const cx = slot.x + slot.w / 2, cy = slot.y + slot.h / 2;
      const r = Math.min(slot.w, slot.h) * 0.36;
      if (!g.tray[i]) {
        ctx.globalAlpha = 0.35;
        this.text(['♠', '♦', '♣'][i], cx, cy + 1, { size: r * 0.8, color: '#ffd77a', weight: 900, align: 'center' });
        ctx.globalAlpha = 1;
      }
    }
    if (app.pendingEnd && app.pendingEnd.type === 'roundClear') return;
    for (let i = 0; i < 3; i++) {
      const p = g.tray[i];
      if (!p) continue;
      if (app.drag && app.drag.idx === i) continue;
      const slot = L.traySlot(i);
      const ts = L.pieceScale(p);
      const at = app.trayAnim[i] ?? 1;
      const e = at >= 1 ? 1 : 1 - Math.pow(1 - at, 3);
      const w = p.shape.w * ts, h = p.shape.h * ts;
      const x = slot.x + (slot.w - w) / 2;
      const y = slot.y + (slot.h - h) / 2 + (1 - e) * 60;
      if (p.hidden) {
        const cw = Math.min(slot.w - 20, 70), chh = cw * 1.2;
        const cx = slot.x + (slot.w - cw) / 2, cy = slot.y + (slot.h - chh) / 2 + (1 - e) * 60;
        rr(ctx, cx, cy, cw, chh, 8);
        const bg = ctx.createLinearGradient(cx, cy, cx + cw, cy + chh);
        bg.addColorStop(0, '#4b2a7a'); bg.addColorStop(1, '#1f0f3a');
        ctx.fillStyle = bg; ctx.fill(); ctx.strokeStyle = '#9fb4c7'; ctx.lineWidth = 2; ctx.stroke();
        this.text('?', cx + cw / 2, cy + chh / 2, { size: 32, color: '#cfe0f0', weight: 900, align: 'center', glow: '#9fb4c7' });
        continue;
      }
      const fits = app.fitCache[i];
      ctx.globalAlpha = e * (fits ? 1 : 0.35);
      this.drawPiece(p, x, y, ts, 1, time);
      ctx.globalAlpha = 1;
      if (app.swapSel && app.swapSel.has(i)) {
        rr(ctx, slot.x + 6, slot.y + 4, slot.w - 12, slot.h - 8, 12);
        ctx.setLineDash([6, 5]); ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 2.5; ctx.stroke(); ctx.setLineDash([]);
        rr(ctx, slot.x + slot.w / 2 - 22, slot.y + 2, 44, 18, 9); ctx.fillStyle = '#ffd23f'; ctx.fill();
        this.text('교체', slot.x + slot.w / 2, slot.y + 11.5, { size: 11, color: '#3a2200', weight: 900, align: 'center' });
      }
    }
  }

  drawDrag(app, time) {
    const d = app.drag;
    if (!d) return;
    const cell = this.L.cell * d.scale;
    const w = d.piece.shape.w * cell, h = d.piece.shape.h * cell;
    const [sx, sy] = [d.px - w / 2, d.py - h / 2];
    const ctx = this.ctx;
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 8; ctx.shadowOffsetY = 6;
    this.drawPiece(d.piece, sx, sy, cell, 1, time);
    ctx.restore();
  }

  drawFx(app) {
    const { ctx } = this;
    const fx = app.fx;
    for (const r of fx.rings) {
      const t = r.t / r.life;
      ctx.strokeStyle = r.color; ctx.globalAlpha = 1 - t; ctx.lineWidth = 4 * (1 - t) + 1;
      ctx.beginPath(); ctx.arc(r.x, r.y, r.r * (0.3 + t), 0, Math.PI * 2); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    for (const p of fx.parts) {
      const t = p.t / p.life;
      ctx.globalAlpha = 1 - t * t;
      if (p.kind === 'spark') {
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * 0.3 * (1 - t), 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        const col = p.color < 0 ? STONE_COLOR : COLORS[p.color] || COLORS[0];
        ctx.fillStyle = col.base;
        ctx.beginPath(); ctx.moveTo(-p.size / 2, -p.size / 2); ctx.lineTo(p.size / 2, -p.size / 3); ctx.lineTo(0, p.size / 2); ctx.closePath(); ctx.fill();
        ctx.fillStyle = col.light; ctx.globalAlpha *= 0.7;
        ctx.beginPath(); ctx.moveTo(-p.size / 2, -p.size / 2); ctx.lineTo(p.size / 4, -p.size / 3); ctx.lineTo(-p.size / 6, 0); ctx.closePath(); ctx.fill();
        ctx.restore();
      }
    }
    ctx.globalAlpha = 1;
    for (const p of fx.pops) {
      const t = p.t / p.life;
      const sc = t < 0.15 ? 0.6 + (t / 0.15) * 0.6 : t < 0.3 ? 1.2 - ((t - 0.15) / 0.15) * 0.2 : 1;
      ctx.save(); ctx.globalAlpha = t > 0.7 ? (1 - t) / 0.3 : 1;
      ctx.translate(p.x, p.y); ctx.scale(sc, sc);
      this.text(p.text, 0, 0, { size: p.size, color: p.color, weight: 900, align: 'center', stroke: 'rgba(0,0,0,0.75)', sw: 4 });
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  drawBubbles(app) {
    const { ctx, L } = this;
    app.bubbles.forEach((b, order) => {
      const r = L.jokerRect(b.idx, Math.max(5, app.game.jokerSlots));
      const t = b.t / b.life;
      const a = t < 0.1 ? t / 0.1 : t > 0.75 ? (1 - t) / 0.25 : 1;
      ctx.font = `900 13px ${FONT}`;
      const w = Math.max(r.w, ctx.measureText(b.text).width + 14);
      let x = r.x + r.w / 2 - w / 2;
      x = Math.max(L.gx + 16, Math.min(L.gx + L.gw - w - 16, x));
      // 조커 카드 위쪽으로 쌓아 공식 바를 가리지 않음
      const y = Math.max(2, r.y - 30 - Math.min(t * 30, 4) - order * 27);
      ctx.globalAlpha = a;
      rr(ctx, x, y, w, 24, 8);
      ctx.fillStyle = b.color; ctx.fill();
      if (order === 0) { ctx.beginPath(); ctx.moveTo(r.x + r.w / 2 - 6, y + 23); ctx.lineTo(r.x + r.w / 2, y + 30); ctx.lineTo(r.x + r.w / 2 + 6, y + 23); ctx.fill(); }
      this.text(b.text, x + w / 2, y + 12.5, { size: 13, color: '#fff', weight: 900, align: 'center', stroke: 'rgba(0,0,0,0.35)', sw: 3 });
      ctx.globalAlpha = 1;
    });
  }

  drawBanner(app, time) {
    const bn = app.banner;
    if (!bn) return;
    const { ctx, L } = this;
    const t = bn.t / bn.life;
    const ein = Math.min(1, bn.t / 0.25);
    const eout = t > 0.8 ? (1 - t) / 0.2 : 1;
    const a = Math.min(ein, eout);
    const cy = L.board.y + L.board.h * 0.45;
    const h = bn.sub ? 92 : 70;
    const x = L.gx + (1 - ein) * -L.gw * 0.3;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle = 'rgba(10,4,24,0.88)';
    ctx.fillRect(L.gx, cy - h / 2, L.gw, h);
    ctx.fillStyle = bn.color;
    ctx.fillRect(L.gx, cy - h / 2, L.gw, 3); ctx.fillRect(L.gx, cy + h / 2 - 3, L.gw, 3);
    if (bn.boss) drawBossIcon(ctx, bn.boss, x + 34, cy, 24);
    this.text(bn.title, x + L.gw / 2 + (bn.boss ? 18 : 0), cy - (bn.sub ? 14 : 0), { size: bn.boss ? 26 : 30, color: readable(bn.color), weight: 900, align: 'center', stroke: 'rgba(0,0,0,0.6)', sw: 5, maxW: L.gw - 20 });
    if (bn.sub) this.text(bn.sub, x + L.gw / 2, cy + 22, { size: 14, color: '#fff', weight: 700, align: 'center', maxW: L.gw - 24 });
    ctx.restore();
  }

  drawTutorial(app, time) {
    const { ctx, L } = this;
    const g = app.game;
    const i = g.tray.findIndex((p, k) => p && !p.hidden && app.fitCache[k]);
    if (i < 0 || app.drag) return;
    const slot = L.traySlot(i);
    const sx = slot.x + slot.w / 2, sy = slot.y + slot.h / 2;
    const ex = L.board.x + L.board.w / 2, ey = L.board.y + L.board.h / 2;
    const cyc = (time % 2.2) / 2.2;
    const k = cyc < 0.15 ? 0 : cyc > 0.8 ? 1 : (cyc - 0.15) / 0.65;
    const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
    const hx = sx + (ex - sx) * e, hy = sy + (ey - sy) * e;
    // 안내 박스
    const bw = Math.min(L.gw - 40, 300);
    const by = L.board.y + 14;
    ctx.save();
    rr(ctx, L.gx + (L.gw - bw) / 2, by, bw, 58, 12);
    ctx.fillStyle = 'rgba(10,4,24,0.85)'; ctx.fill();
    ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 1.5; ctx.stroke();
    this.text('조각을 끌어서 보드에 놓기', L.gx + L.gw / 2, by + 19, { size: 15, color: '#ffe68a', weight: 900, align: 'center' });
    this.text('줄을 채우면 칩 X 배수 점수!', L.gx + L.gw / 2, by + 40, { size: 13, color: '#fff', weight: 700, align: 'center' });
    // 손가락
    ctx.globalAlpha = cyc > 0.9 ? (1 - cyc) * 10 : 1;
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(hx, hy, 16 * (k > 0 && k < 1 ? 0.85 : 1), 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(hx, hy, 26, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.stroke();
    ctx.restore();
  }
}
