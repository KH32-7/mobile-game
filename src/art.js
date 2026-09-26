// 조커 일러스트 (절차적 Canvas 드로잉)
// 각 조커 = 배경 패턴 + 캐릭터(얼굴/모자/표정/소품) 조합으로 고유한 인상을 만듦

// ch: 캐릭터, mood: 표정, prop: 소품, pat: 배경, acc: 액세서리, hat: 모자
export const ART = {
  rower: { ch: 'jester', hat: 'bells', mood: 'grin', prop: 'rowbar', pat: 'stripesH' },
  vert: { ch: 'jester', hat: 'bells2', mood: 'smirk', prop: 'colbar', pat: 'stripesV' },
  minimal: { ch: 'blob', mood: 'calm', prop: 'dot', pat: 'plain', acc: 'beret' },
  gambler: { ch: 'jester', hat: 'top', mood: 'wink', prop: 'dice', pat: 'checker', acc: 'cigar' },
  snowball: { ch: 'snowman', mood: 'happy', prop: 'snowflake', pat: 'snow' },
  twins: { ch: 'twins', mood: 'happy', prop: null, pat: 'dots' },
  miner: { ch: 'miner', mood: 'grin', prop: 'pickaxe', pat: 'rock', acc: 'mustache' },
  vault: { ch: 'robot', mood: 'calm', prop: 'coins', pat: 'grid' },
  lapidary: { ch: 'jester', hat: 'beret', mood: 'focus', prop: 'gem', pat: 'diamonds', acc: 'monocle' },
  barfan: { ch: 'clown', mood: 'shock', prop: 'bar', pat: 'rays' },
  vein: { ch: 'mole', mood: 'happy', prop: 'gems', pat: 'rock' },
  closer: { ch: 'jester', hat: 'cap', mood: 'cool', prop: 'ball', pat: 'rays' },
  piggy: { ch: 'pig', mood: 'happy', prop: 'coin', pat: 'dots' },
  redchip: { ch: 'chip', mood: 'grin', prop: null, pat: 'rays', tint: '#ff3355' },
  bluechip: { ch: 'chip', mood: 'calm', prop: null, pat: 'rays', tint: '#3388ff' },
  squarefan: { ch: 'jester', hat: 'top', mood: 'calm', prop: 'square', pat: 'checker', acc: 'bowtie' },
  lshape: { ch: 'butler', mood: 'calm', prop: 'lblock', pat: 'stripesV', acc: 'mustache' },
  tfan: { ch: 'fairy', mood: 'happy', prop: 'tblock', pat: 'stars' },
  zigzag: { ch: 'snake', mood: 'smirk', prop: 'sblock', pat: 'zig' },
  edge: { ch: 'jester', hat: 'bells', mood: 'shock', prop: 'cliff', pat: 'plain' },
  center: { ch: 'monk', mood: 'calm', prop: 'target', pat: 'rings' },
  parity: { ch: 'twoface', mood: 'grin', prop: null, pat: 'checker' },
  firststrike: { ch: 'knight', mood: 'angry', prop: 'sword', pat: 'rays' },
  goldrush: { ch: 'miner', mood: 'grin', prop: 'nugget', pat: 'rays', acc: 'beard' },
  blocky: { ch: 'bear', mood: 'happy', prop: 'bricks', pat: 'bricks', acc: 'hardhat' },
  crowd: { ch: 'crowd', mood: 'shock', prop: null, pat: 'dots' },
  tip: { ch: 'jester', hat: 'bells2', mood: 'happy', prop: 'jar', pat: 'waves', acc: 'bowtie' },
  corner: { ch: 'cat', mood: 'smirk', prop: 'cornerMark', pat: 'grid' },
  chain: { ch: 'jester', hat: 'bells', mood: 'crazy', prop: 'chain', pat: 'spiral' },
  bigblock: { ch: 'giant', mood: 'grin', prop: 'bigblock', pat: 'grid' },
  jeweler: { ch: 'jester', hat: 'crown', mood: 'focus', prop: 'gem', pat: 'diamonds', acc: 'monocle' },
  rich: { ch: 'jester', hat: 'top', mood: 'smirk', prop: 'moneybag', pat: 'rays', acc: 'mustache' },
  cross: { ch: 'robot', mood: 'angry', prop: 'crosshair', pat: 'crossP' },
  saver: { ch: 'grandma', mood: 'happy', prop: 'piggybank', pat: 'waves', acc: 'glasses' },
  lastchance: { ch: 'jester', hat: 'bells', mood: 'sweat', prop: 'hourglass', pat: 'rays' },
  tidy: { ch: 'maid', mood: 'happy', prop: 'broom', pat: 'sparkle' },
  comboamp: { ch: 'robot', mood: 'crazy', prop: 'bolt', pat: 'zig' },
  steady: { ch: 'turtle', mood: 'calm', prop: 'plant', pat: 'waves' },
  astronomer: { ch: 'wizard', mood: 'focus', prop: 'telescope', pat: 'stars', acc: 'beard' },
  miser: { ch: 'goblin', mood: 'smirk', prop: 'coins', pat: 'dots' },
  sniper: { ch: 'jester', hat: 'beret', mood: 'wink', prop: 'crosshair', pat: 'rings' },
  echo: { ch: 'ghost', mood: 'happy', prop: 'waves2', pat: 'rings' },
  gemcutter: { ch: 'dwarf', mood: 'focus', prop: 'ruby', pat: 'rock', acc: 'beard' },
  mirror: { ch: 'jester', hat: 'bells2', mood: 'smirk', prop: 'mirror', pat: 'mirrorP' },
  patience: { ch: 'sloth', mood: 'sleepy', prop: 'clock', pat: 'waves' },
  trayhoard: { ch: 'squirrel', mood: 'happy', prop: 'tray', pat: 'dots' },
  bank: { ch: 'robot', mood: 'calm', prop: 'bankIcon', pat: 'grid', acc: 'bowtie' },
  empty: { ch: 'ghost', mood: 'calm', prop: null, pat: 'plain', faded: true },
  sweep: { ch: 'maid', mood: 'angry', prop: 'bigbroom', pat: 'sparkle' },
  collector: { ch: 'jester', hat: 'crown', mood: 'grin', prop: 'jars', pat: 'stars', acc: 'monocle' },
  steelheart: { ch: 'robot', mood: 'calm', prop: 'heart', pat: 'rivets' },
  dupe: { ch: 'doll', mood: 'crazy', prop: 'thread', pat: 'checker' },
  glasscannon: { ch: 'clown', mood: 'crazy', prop: 'cannon', pat: 'shards' },
  hexed: { ch: 'witch', mood: 'smirk', prop: 'cauldron', pat: 'stars' },
  quadra: { ch: 'band', mood: 'happy', prop: 'notes', pat: 'rays' },
  momentum: { ch: 'jester', hat: 'helmet', mood: 'angry', prop: 'rocket', pat: 'speed' },
  jesterking: { ch: 'jester', hat: 'kingcrown', mood: 'grin', prop: 'scepter', pat: 'rays', acc: 'beard' },
  infinity: { ch: 'cosmic', mood: 'calm', prop: 'infinity', pat: 'spiral' },
  midas: { ch: 'king', mood: 'smirk', prop: 'goldhand', pat: 'rays', acc: 'beard' },
  phoenix: { ch: 'phoenix', mood: 'angry', prop: 'flames', pat: 'rays' },
  architect: { ch: 'owl', mood: 'focus', prop: 'blueprint', pat: 'grid', acc: 'glasses' },
};

const TAU = Math.PI * 2;
const hsl = (h, s, l, a = 1) => `hsla(${h},${s}%,${l}%,${a})`;

function circle(g, x, y, r, fill, stroke, lw = 3) {
  g.beginPath(); g.arc(x, y, r, 0, TAU);
  if (fill) { g.fillStyle = fill; g.fill(); }
  if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); }
}
function ell(g, x, y, rx, ry, fill, stroke, lw = 3, rot = 0) {
  g.beginPath(); g.ellipse(x, y, rx, ry, rot, 0, TAU);
  if (fill) { g.fillStyle = fill; g.fill(); }
  if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); }
}
function poly(g, pts, fill, stroke, lw = 3) {
  g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath();
  if (fill) { g.fillStyle = fill; g.fill(); }
  if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); }
}
function rrect(g, x, y, w, h, r, fill, stroke, lw = 3) {
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
  if (fill) { g.fillStyle = fill; g.fill(); }
  if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); }
}
const INK = '#1a0d24';

// ---------- 배경 ----------
function drawPattern(g, pat, hue) {
  const base = hsl(hue, 55, 30), light = hsl(hue, 60, 42), dark = hsl(hue, 60, 18);
  const grd = g.createLinearGradient(0, 0, 0, 100);
  grd.addColorStop(0, light); grd.addColorStop(1, dark);
  g.fillStyle = grd; g.fillRect(-10, -10, 120, 120);
  g.save();
  g.globalAlpha = 0.22;
  g.fillStyle = hsl(hue, 70, 70); g.strokeStyle = hsl(hue, 70, 70); g.lineWidth = 3;
  switch (pat) {
    case 'stripesH': for (let y = 0; y < 100; y += 14) g.fillRect(-10, y, 120, 6); break;
    case 'stripesV': for (let x = 0; x < 100; x += 14) g.fillRect(x, -10, 6, 120); break;
    case 'checker': for (let y = 0; y < 100; y += 16) for (let x = (y / 16) % 2 ? 16 : 0; x < 100; x += 32) g.fillRect(x, y, 16, 16); break;
    case 'dots': for (let y = 6; y < 100; y += 14) for (let x = (y / 14) % 2 ? 13 : 6; x < 100; x += 14) circle(g, x, y, 3, hsl(hue, 70, 70)); break;
    case 'rays': for (let i = 0; i < 12; i++) { g.save(); g.translate(50, 50); g.rotate((i / 12) * TAU); poly(g, [[0, 0], [-8, -80], [8, -80]], hsl(hue, 80, 75)); g.restore(); } break;
    case 'stars': for (let i = 0; i < 14; i++) { const x = (i * 37) % 100, y = (i * 53) % 100; star(g, x, y, 3 + (i % 3), hsl(50, 90, 85)); } break;
    case 'snow': for (let i = 0; i < 18; i++) circle(g, (i * 41) % 100, (i * 29) % 100, 2 + (i % 3), '#fff'); break;
    case 'grid': for (let x = 0; x <= 100; x += 12.5) { g.fillRect(x, -10, 1.5, 120); g.fillRect(-10, x, 120, 1.5); } break;
    case 'diamonds': for (let y = 0; y < 110; y += 20) for (let x = (y / 20) % 2 ? 10 : 0; x < 110; x += 20) poly(g, [[x, y - 8], [x + 6, y], [x, y + 8], [x - 6, y]], hsl(hue, 80, 75)); break;
    case 'waves': for (let y = 10; y < 100; y += 16) { g.beginPath(); for (let x = -10; x <= 110; x += 5) g.lineTo(x, y + Math.sin(x / 8) * 4); g.stroke(); } break;
    case 'rock': for (let i = 0; i < 10; i++) poly(g, [[(i * 31) % 100, (i * 47) % 100], [(i * 31) % 100 + 10, (i * 47) % 100 + 3], [(i * 31) % 100 + 5, (i * 47) % 100 + 10]], hsl(hue, 30, 60)); break;
    case 'rings': for (let r = 10; r < 80; r += 12) circle(g, 50, 50, r, null, hsl(hue, 70, 70), 2); break;
    case 'spiral': g.beginPath(); for (let a = 0; a < 30; a += 0.2) g.lineTo(50 + Math.cos(a) * a * 2.2, 50 + Math.sin(a) * a * 2.2); g.stroke(); break;
    case 'zig': for (let y = 8; y < 100; y += 18) { g.beginPath(); for (let x = -10, k = 0; x <= 110; x += 10, k++) g.lineTo(x, y + (k % 2 ? 6 : -6)); g.stroke(); } break;
    case 'crossP': g.fillRect(44, -10, 12, 120); g.fillRect(-10, 44, 120, 12); break;
    case 'sparkle': for (let i = 0; i < 10; i++) star(g, (i * 43) % 100, (i * 67) % 100, 4, '#fff', 4); break;
    case 'bricks': for (let y = 0; y < 100; y += 12) for (let x = (y / 12) % 2 ? -10 : 0; x < 110; x += 20) g.strokeRect(x, y, 20, 12); break;
    case 'rivets': for (let y = 8; y < 100; y += 20) for (let x = 8; x < 100; x += 20) circle(g, x, y, 2.5, '#fff'); break;
    case 'shards': for (let i = 0; i < 8; i++) poly(g, [[(i * 29) % 100, (i * 41) % 100], [(i * 29) % 100 + 14, (i * 41) % 100 + 4], [(i * 29) % 100 + 4, (i * 41) % 100 + 16]], '#dff'); break;
    case 'speed': for (let i = 0; i < 9; i++) g.fillRect(-10 + ((i * 37) % 40), (i * 11) % 100, 50, 2.5); break;
    case 'mirrorP': g.fillRect(48, -10, 4, 120); break;
    default: break;
  }
  g.restore();
  // 비네트
  const v = g.createRadialGradient(50, 45, 20, 50, 50, 75);
  v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.45)');
  g.fillStyle = v; g.fillRect(-10, -10, 120, 120);
  void base;
}

function star(g, x, y, r, fill, pts = 5) {
  g.beginPath();
  for (let i = 0; i < pts * 2; i++) {
    const a = (i / (pts * 2)) * TAU - Math.PI / 2;
    const rr = i % 2 ? r * 0.45 : r;
    g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  g.closePath(); g.fillStyle = fill; g.fill();
}

// ---------- 얼굴 ----------
function face(g, cx, cy, s, mood, opt = {}) {
  const ink = opt.ink || INK;
  const ex = 9 * s, ey = -3 * s;
  g.lineCap = 'round'; g.lineJoin = 'round';
  const eye = (x, closed, wink) => {
    if (closed || wink) { g.beginPath(); g.arc(cx + x, cy + ey + 1 * s, 3.5 * s, Math.PI * 1.1, Math.PI * 1.9, false); g.strokeStyle = ink; g.lineWidth = 2.4 * s; g.stroke(); return; }
    ell(g, cx + x, cy + ey, 3.6 * s, 4.6 * s, '#fff', ink, 1.6 * s);
    circle(g, cx + x + 0.6 * s, cy + ey + 0.6 * s, 2.2 * s, ink);
    circle(g, cx + x + 1.3 * s, cy + ey - 0.6 * s, 0.8 * s, '#fff');
  };
  const mouth = () => {
    g.strokeStyle = ink; g.lineWidth = 2.4 * s; g.fillStyle = ink;
    const my = cy + 9 * s;
    switch (mood) {
      case 'grin': g.beginPath(); g.moveTo(cx - 10 * s, my - 2 * s); g.quadraticCurveTo(cx, my + 12 * s, cx + 10 * s, my - 2 * s); g.closePath(); g.fill(); g.fillStyle = '#fff'; g.fillRect(cx - 7 * s, my - 1 * s, 14 * s, 3 * s); break;
      case 'smirk': g.beginPath(); g.moveTo(cx - 7 * s, my + 1 * s); g.quadraticCurveTo(cx + 2 * s, my + 5 * s, cx + 9 * s, my - 3 * s); g.stroke(); break;
      case 'shock': ell(g, cx, my + 2 * s, 4 * s, 5.5 * s, ink); break;
      case 'angry': g.beginPath(); g.moveTo(cx - 8 * s, my + 4 * s); g.quadraticCurveTo(cx, my - 2 * s, cx + 8 * s, my + 4 * s); g.stroke(); break;
      case 'sleepy': ell(g, cx + 2 * s, my + 2 * s, 3 * s, 2 * s, ink); break;
      case 'crazy': g.beginPath(); g.moveTo(cx - 11 * s, my - 3 * s); g.quadraticCurveTo(cx, my + 14 * s, cx + 11 * s, my - 3 * s); g.closePath(); g.fill(); ell(g, cx + 3 * s, my + 5 * s, 3 * s, 2.4 * s, '#ff5c7a'); break;
      case 'sweat': g.beginPath(); for (let i = 0; i <= 6; i++) g.lineTo(cx - 8 * s + i * 2.7 * s, my + (i % 2 ? 2 : -1) * s); g.stroke(); break;
      case 'focus': g.beginPath(); g.moveTo(cx - 5 * s, my + 1 * s); g.lineTo(cx + 5 * s, my + 1 * s); g.stroke(); break;
      default: g.beginPath(); g.arc(cx, my - 2 * s, 8 * s, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke();
    }
  };
  const closed = mood === 'sleepy';
  eye(-ex, closed, false);
  eye(ex, closed, mood === 'wink');
  if (mood === 'angry' || mood === 'focus') {
    g.strokeStyle = ink; g.lineWidth = 2.4 * s;
    g.beginPath(); g.moveTo(cx - ex - 5 * s, cy + ey - 8 * s); g.lineTo(cx - ex + 4 * s, cy + ey - 5 * s); g.stroke();
    g.beginPath(); g.moveTo(cx + ex + 5 * s, cy + ey - 8 * s); g.lineTo(cx + ex - 4 * s, cy + ey - 5 * s); g.stroke();
  }
  if (mood === 'cool') {
    rrect(g, cx - ex - 6 * s, cy + ey - 4 * s, 12 * s, 8 * s, 3 * s, ink);
    rrect(g, cx + ex - 6 * s, cy + ey - 4 * s, 12 * s, 8 * s, 3 * s, ink);
    g.fillStyle = ink; g.fillRect(cx - 3 * s, cy + ey - 2 * s, 6 * s, 2 * s);
  }
  if (mood === 'sweat') poly(g, [[cx + 17 * s, cy - 8 * s], [cx + 20 * s, cy - 1 * s], [cx + 14 * s, cy - 1 * s]], '#9fe8ff');
  mouth();
  if (!opt.noCheek) { circle(g, cx - 13 * s, cy + 5 * s, 3.2 * s, 'rgba(255,90,120,0.45)'); circle(g, cx + 13 * s, cy + 5 * s, 3.2 * s, 'rgba(255,90,120,0.45)'); }
}

const SKIN = '#ffd9b8';

// ---------- 모자 ----------
function hat(g, type, cx, cy, hue) {
  const c1 = hsl(hue, 80, 55), c2 = hsl((hue + 180) % 360, 70, 55);
  switch (type) {
    case 'bells': case 'bells2': {
      const n = type === 'bells' ? 2 : 3;
      const tips = n === 2 ? [[cx - 34, cy - 18], [cx + 34, cy - 18]] : [[cx - 34, cy - 14], [cx, cy - 44], [cx + 34, cy - 14]];
      tips.forEach(([tx, ty], i) => {
        poly(g, [[cx - 22, cy - 6], [tx, ty], [cx + (i - (n - 1) / 2) * 10, cy - 20], [cx + 22, cy - 6]], i % 2 ? c2 : c1, INK, 2.5);
        circle(g, tx, ty, 5, '#ffd23f', INK, 2);
      });
      rrect(g, cx - 24, cy - 10, 48, 9, 4, '#fff', INK, 2.5);
      break;
    }
    case 'top': rrect(g, cx - 16, cy - 36, 32, 28, 3, INK); rrect(g, cx - 26, cy - 11, 52, 6, 3, INK); g.fillStyle = c1; g.fillRect(cx - 16, cy - 16, 32, 5); break;
    case 'crown': case 'kingcrown': {
      const big = type === 'kingcrown';
      const w = big ? 30 : 22, hh = big ? 26 : 18;
      poly(g, [[cx - w, cy - 6], [cx - w, cy - 6 - hh], [cx - w / 2, cy - 6 - hh * 0.5], [cx, cy - 6 - hh * 1.1], [cx + w / 2, cy - 6 - hh * 0.5], [cx + w, cy - 6 - hh], [cx + w, cy - 6]], '#ffd23f', INK, 2.5);
      circle(g, cx, cy - 6 - hh * 0.55, 4, '#ff2e63'); circle(g, cx - w / 2, cy - 12, 3, '#36c9ff'); circle(g, cx + w / 2, cy - 12, 3, '#3ddc97');
      break;
    }
    case 'beret': ell(g, cx + 4, cy - 12, 26, 11, c1, INK, 2.5, -0.15); circle(g, cx + 6, cy - 23, 3, c1, INK, 2); break;
    case 'cap': ell(g, cx, cy - 12, 24, 14, c1, INK, 2.5); ell(g, cx + 20, cy - 6, 16, 5, c1, INK, 2.5); break;
    case 'helmet': ell(g, cx, cy - 8, 30, 26, c1, INK, 2.5); g.fillStyle = 'rgba(160,230,255,0.6)'; g.fillRect(cx - 22, cy - 6, 44, 10); break;
    default: break;
  }
}

// ---------- 소품 ----------
function block(g, x, y, s, hue) {
  rrect(g, x, y, s, s, s * 0.2, hsl(hue, 80, 55), INK, 1.8);
  g.fillStyle = 'rgba(255,255,255,0.45)'; g.fillRect(x + s * 0.2, y + s * 0.18, s * 0.35, s * 0.15);
}
function blocksShape(g, cells, x, y, s, hue) { for (const [r, c] of cells) block(g, x + c * s, y + r * s, s, hue); }

function prop(g, p, hue) {
  const px = 76, py = 74;
  switch (p) {
    case 'dice': rrect(g, px - 12, py - 12, 24, 24, 5, '#fff', INK, 2.5); [[-6, -6], [6, 6], [0, 0], [6, -6], [-6, 6]].forEach(([a, b]) => circle(g, px + a, py + b, 2.4, INK)); break;
    case 'coin': circle(g, px, py, 11, '#ffd23f', INK, 2.5); g.fillStyle = '#a36b00'; g.font = '900 14px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('$', px, py + 1); break;
    case 'coins': for (let i = 0; i < 4; i++) ell(g, px, py + 8 - i * 5, 12, 4, '#ffd23f', INK, 2); break;
    case 'gem': case 'ruby': poly(g, [[px - 11, py - 4], [px - 5, py - 11], [px + 5, py - 11], [px + 11, py - 4], [px, py + 11]], p === 'ruby' ? '#ff2e63' : '#5ce1ff', INK, 2.5); g.strokeStyle = 'rgba(255,255,255,0.7)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(px - 11, py - 4); g.lineTo(px + 11, py - 4); g.stroke(); break;
    case 'gems': [['#ff2e63', -8], ['#ffd23f', 0], ['#5ce1ff', 8]].forEach(([c, dx]) => poly(g, [[px + dx - 5, py - 2], [px + dx, py - 8], [px + dx + 5, py - 2], [px + dx, py + 6]], c, INK, 1.8)); break;
    case 'snowflake': g.strokeStyle = '#fff'; g.lineWidth = 3; for (let i = 0; i < 3; i++) { g.save(); g.translate(px, py); g.rotate((i / 3) * Math.PI); g.beginPath(); g.moveTo(-12, 0); g.lineTo(12, 0); g.stroke(); g.restore(); } break;
    case 'pickaxe': g.save(); g.translate(px, py); g.rotate(-0.6); rrect(g, -2, -4, 4, 26, 2, '#a0703a', INK, 2); g.beginPath(); g.moveTo(-14, -2); g.quadraticCurveTo(0, -12, 14, -2); g.lineWidth = 5; g.strokeStyle = '#b8c2d6'; g.stroke(); g.restore(); break;
    case 'rowbar': blocksShape(g, [[0, 0], [0, 1], [0, 2], [0, 3]], 60, 78, 9, hue); break;
    case 'colbar': blocksShape(g, [[0, 0], [1, 0], [2, 0], [3, 0]], 80, 58, 9, hue); break;
    case 'bar': blocksShape(g, [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]], 82, 50, 9, hue + 40); break;
    case 'square': blocksShape(g, [[0, 0], [0, 1], [1, 0], [1, 1]], 66, 64, 11, hue + 40); break;
    case 'bigblock': blocksShape(g, [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]], 62, 60, 10, hue + 30); break;
    case 'lblock': blocksShape(g, [[0, 0], [1, 0], [2, 0], [2, 1]], 70, 58, 10, hue + 40); break;
    case 'tblock': blocksShape(g, [[0, 0], [0, 1], [0, 2], [1, 1]], 64, 66, 10, hue + 60); break;
    case 'sblock': blocksShape(g, [[0, 1], [0, 2], [1, 0], [1, 1]], 62, 66, 10, hue + 60); break;
    case 'dot': block(g, 70, 70, 13, hue + 150); break;
    case 'ball': circle(g, px, py, 10, '#fff', INK, 2.5); g.strokeStyle = '#ff4d6d'; g.lineWidth = 1.8; g.beginPath(); g.arc(px - 12, py, 9, -0.7, 0.7); g.stroke(); g.beginPath(); g.arc(px + 12, py, 9, Math.PI - 0.7, Math.PI + 0.7); g.stroke(); break;
    case 'cliff': poly(g, [[60, 100], [60, 76], [84, 76], [100, 100]], '#6b4a2a', INK, 2.5); break;
    case 'target': case 'crosshair': circle(g, px, py, 12, null, '#ff4d6d', 3); circle(g, px, py, 5, '#ff4d6d'); g.strokeStyle = '#ff4d6d'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(px - 17, py); g.lineTo(px + 17, py); g.moveTo(px, py - 17); g.lineTo(px, py + 17); g.stroke(); break;
    case 'sword': g.save(); g.translate(px, py); g.rotate(0.7); rrect(g, -3, -22, 6, 30, 2, '#dfe6f0', INK, 2); rrect(g, -9, 6, 18, 4, 2, '#ffd23f', INK, 2); rrect(g, -2.5, 10, 5, 9, 2, '#8a5a2a', INK, 2); g.restore(); break;
    case 'nugget': poly(g, [[px - 12, py + 4], [px - 6, py - 8], [px + 6, py - 9], [px + 12, py + 2], [px + 4, py + 9]], '#ffd23f', INK, 2.5); break;
    case 'bricks': for (let i = 0; i < 3; i++) rrect(g, 60 + (i % 2) * 8, 70 + i * 8 - 16, 22, 8, 2, '#d0643a', INK, 1.8); break;
    case 'jar': rrect(g, px - 11, py - 10, 22, 24, 6, 'rgba(200,240,255,0.6)', INK, 2.5); circle(g, px - 3, py + 6, 4, '#ffd23f'); circle(g, px + 4, py + 2, 4, '#ffd23f'); break;
    case 'cornerMark': g.strokeStyle = '#ffd23f'; g.lineWidth = 5; g.beginPath(); g.moveTo(66, 90); g.lineTo(90, 90); g.lineTo(90, 66); g.stroke(); break;
    case 'chain': for (let i = 0; i < 3; i++) ell(g, 64 + i * 10, 76 + (i % 2 ? -4 : 4), 7, 4.5, null, '#dfe6f0', 3, i % 2 ? 0.6 : -0.6); break;
    case 'moneybag': ell(g, px, py + 3, 13, 12, '#c9a24a', INK, 2.5); poly(g, [[px - 5, py - 9], [px + 5, py - 9], [px + 8, py - 15], [px - 8, py - 15]], '#c9a24a', INK, 2); g.fillStyle = '#5a3a00'; g.font = '900 13px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('$', px, py + 4); break;
    case 'piggybank': case 'pig': ell(g, px, py, 14, 10, '#ff9fc0', INK, 2.5); circle(g, px + 12, py - 1, 4, '#ff7fa8', INK, 1.5); g.fillStyle = INK; g.fillRect(px - 3, py - 11, 6, 2); break;
    case 'hourglass': poly(g, [[px - 10, py - 14], [px + 10, py - 14], [px, py], [px + 10, py + 14], [px - 10, py + 14], [px, py]], 'rgba(220,240,255,0.7)', INK, 2.5); poly(g, [[px - 5, py + 12], [px + 5, py + 12], [px, py + 5]], '#ffd23f'); break;
    case 'broom': case 'bigbroom': { const big = p === 'bigbroom'; g.save(); g.translate(px, py); g.rotate(-0.5); rrect(g, -2, -26, 4, 30, 2, '#a0703a', INK, 2); poly(g, [[-8, 2], [8, 2], [big ? 14 : 10, 18], [big ? -14 : -10, 18]], '#ffd23f', INK, 2); g.restore(); break; }
    case 'bolt': poly(g, [[px + 2, py - 16], [px - 8, py + 2], [px, py + 2], [px - 4, py + 16], [px + 8, py - 3], [px, py - 3]], '#ffe066', INK, 2.5); break;
    case 'plant': rrect(g, px - 8, py, 16, 12, 3, '#c0643a', INK, 2); ell(g, px - 5, py - 6, 5, 8, '#3ddc97', INK, 2, -0.5); ell(g, px + 5, py - 7, 5, 8, '#3ddc97', INK, 2, 0.5); break;
    case 'telescope': g.save(); g.translate(px, py); g.rotate(-0.6); rrect(g, -16, -5, 30, 10, 3, '#8f6bff', INK, 2.5); rrect(g, 12, -7, 6, 14, 2, '#ffd23f', INK, 2); g.restore(); break;
    case 'waves2': for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(62, 74, 8 + i * 7, -0.8, 0.8); g.strokeStyle = 'rgba(255,255,255,0.8)'; g.lineWidth = 2.5; g.stroke(); } break;
    case 'mirror': ell(g, px, py - 2, 11, 15, 'rgba(200,240,255,0.8)', '#ffd23f', 3.5); rrect(g, px - 2, py + 12, 4, 10, 2, '#ffd23f'); break;
    case 'clock': circle(g, px, py, 13, '#fff', INK, 2.5); g.strokeStyle = INK; g.lineWidth = 2.2; g.beginPath(); g.moveTo(px, py); g.lineTo(px, py - 8); g.moveTo(px, py); g.lineTo(px + 6, py + 2); g.stroke(); break;
    case 'tray': rrect(g, 58, 78, 34, 10, 3, '#c9a24a', INK, 2.5); blocksShape(g, [[0, 0]], 62, 68, 9, hue); blocksShape(g, [[0, 0]], 72, 68, 9, hue + 60); blocksShape(g, [[0, 0]], 82, 68, 9, hue + 120); break;
    case 'bankIcon': poly(g, [[60, 70], [76, 58], [92, 70]], '#dfe6f0', INK, 2); for (let i = 0; i < 3; i++) rrect(g, 63 + i * 10, 71, 5, 14, 1, '#dfe6f0', INK, 1.5); rrect(g, 60, 86, 32, 4, 1, '#dfe6f0', INK, 1.5); break;
    case 'jars': for (let i = 0; i < 3; i++) { rrect(g, 58 + i * 12, 70, 10, 16, 3, 'rgba(200,240,255,0.6)', INK, 1.8); circle(g, 63 + i * 12, 80, 3, ['#ff2e63', '#ffd23f', '#5ce1ff'][i]); } break;
    case 'heart': g.beginPath(); g.moveTo(px, py + 12); g.bezierCurveTo(px - 18, py, px - 10, py - 14, px, py - 5); g.bezierCurveTo(px + 10, py - 14, px + 18, py, px, py + 12); g.fillStyle = '#b8c2d6'; g.fill(); g.strokeStyle = INK; g.lineWidth = 2.5; g.stroke(); break;
    case 'thread': g.strokeStyle = '#ff4d6d'; g.lineWidth = 2; g.beginPath(); g.moveTo(58, 60); g.bezierCurveTo(90, 70, 60, 90, 94, 96); g.stroke(); circle(g, 58, 60, 4, '#dfe6f0', INK, 1.5); break;
    case 'cannon': g.save(); g.translate(px, py); g.rotate(-0.4); rrect(g, -14, -6, 28, 12, 5, 'rgba(180,240,255,0.75)', INK, 2.5); g.restore(); circle(g, px - 6, py + 9, 6, '#6b4a2a', INK, 2); break;
    case 'cauldron': ell(g, px, py + 4, 15, 11, '#2b2b3a', INK, 2.5); ell(g, px, py - 5, 14, 4, '#3ddc97'); circle(g, px - 4, py - 10, 3, '#3ddc97'); circle(g, px + 5, py - 14, 2, '#3ddc97'); break;
    case 'notes': g.fillStyle = '#fff'; g.strokeStyle = '#fff'; g.lineWidth = 2.5; [[64, 80], [82, 72]].forEach(([x, y]) => { ell(g, x, y, 5, 4, '#fff', null, 0, -0.4); g.beginPath(); g.moveTo(x + 4, y); g.lineTo(x + 4, y - 16); g.stroke(); }); g.beginPath(); g.moveTo(68, 64); g.lineTo(86, 56); g.stroke(); break;
    case 'rocket': g.save(); g.translate(px, py); g.rotate(0.8); rrect(g, -6, -16, 12, 26, 6, '#fff', INK, 2); poly(g, [[-6, 6], [-11, 12], [-6, 10]], '#ff4d6d'); poly(g, [[6, 6], [11, 12], [6, 10]], '#ff4d6d'); poly(g, [[-4, 12], [0, 22], [4, 12]], '#ffb627'); g.restore(); break;
    case 'scepter': g.save(); g.translate(px, py); g.rotate(0.4); rrect(g, -2, -14, 4, 32, 2, '#ffd23f', INK, 2); circle(g, 0, -18, 6, '#ff2e63', INK, 2); g.restore(); break;
    case 'infinity': g.strokeStyle = '#fff'; g.lineWidth = 4; g.beginPath(); for (let a = 0; a <= TAU + 0.1; a += 0.1) { const d = 1 + Math.sin(a) ** 2; g.lineTo(76 + (14 * Math.cos(a)) / d, 76 + (14 * Math.sin(a) * Math.cos(a)) / d); } g.stroke(); break;
    case 'goldhand': ell(g, px, py, 10, 12, '#ffd23f', INK, 2.5); for (let i = 0; i < 4; i++) rrect(g, px - 9 + i * 5, py - 20, 4, 12, 2, '#ffd23f', INK, 1.5); break;
    case 'flames': for (let i = 0; i < 3; i++) { const x = 60 + i * 12; poly(g, [[x - 6, 100], [x, 74 - (i % 2) * 8], [x + 6, 100]], ['#ff4d6d', '#ffb627', '#ffe066'][i]); } break;
    case 'blueprint': rrect(g, 58, 64, 34, 26, 2, '#1f5fbf', '#dfe6f0', 2); g.strokeStyle = '#dfe6f0'; g.lineWidth = 1.2; g.strokeRect(63, 69, 12, 9); g.strokeRect(75, 69, 12, 16); break;
    default: break;
  }
}

// ---------- 캐릭터 ----------
function character(g, a, hue) {
  const ch = a.ch;
  const cx = 44, cy = 50;
  const body = (col) => { g.beginPath(); g.moveTo(cx - 26, 104); g.quadraticCurveTo(cx - 24, cy + 22, cx, cy + 22); g.quadraticCurveTo(cx + 24, cy + 22, cx + 26, 104); g.closePath(); g.fillStyle = col; g.fill(); g.strokeStyle = INK; g.lineWidth = 2.5; g.stroke(); };
  const ruff = () => { for (let i = -2; i <= 2; i++) ell(g, cx + i * 9, cy + 22, 7, 5, i % 2 ? '#fff' : hsl(hue, 70, 75), INK, 2); };
  switch (ch) {
    case 'jester': case 'butler': case 'monk': case 'knight': case 'grandma': case 'maid': case 'wizard': case 'witch': case 'king': case 'dwarf': case 'miner': case 'clown': case 'goblin': case 'doll': {
      const skin = ch === 'goblin' ? '#8fd46b' : ch === 'doll' ? '#f5e6f0' : ch === 'clown' ? '#fff5f0' : SKIN;
      const outfit = { butler: '#222', monk: '#c47a3d', knight: '#b8c2d6', grandma: '#b07ad6', maid: '#222', wizard: '#4b3aa8', witch: '#2b1a3a', king: '#b01040', dwarf: '#6b4a2a', miner: '#3d5a8a' }[ch] || hsl(hue, 70, 50);
      body(outfit);
      if (ch === 'jester' || ch === 'clown' || ch === 'doll') ruff();
      if (ch === 'maid') rrect(g, cx - 10, cy + 26, 20, 30, 4, '#fff', INK, 2);
      if (ch === 'butler' || a.acc === 'bowtie') poly(g, [[cx - 9, cy + 20], [cx, cy + 24], [cx - 9, cy + 28]], '#ff2e63', INK, 1.5), poly(g, [[cx + 9, cy + 20], [cx, cy + 24], [cx + 9, cy + 28]], '#ff2e63', INK, 1.5);
      circle(g, cx, cy, 22, skin, INK, 2.5);
      if (ch === 'jester') { poly(g, [[cx - 5, cy - 16], [cx, cy - 20], [cx + 5, cy - 16], [cx, cy - 12]], hsl((hue + 180) % 360, 80, 55)); }
      if (ch === 'clown') { circle(g, cx - 22, cy - 8, 9, '#ff8a3d'); circle(g, cx + 22, cy - 8, 9, '#ff8a3d'); }
      face(g, cx, cy + 2, 1, a.mood, { noCheek: ch === 'goblin' || ch === 'knight' });
      if (ch === 'clown') circle(g, cx, cy + 5, 4.5, '#ff2e3a', INK, 1.5);
      if (ch === 'goblin') { poly(g, [[cx - 20, cy - 4], [cx - 36, cy - 12], [cx - 21, cy + 4]], '#8fd46b', INK, 2); poly(g, [[cx + 20, cy - 4], [cx + 36, cy - 12], [cx + 21, cy + 4]], '#8fd46b', INK, 2); }
      if (a.acc === 'beard' || ch === 'dwarf') { g.beginPath(); g.moveTo(cx - 18, cy + 8); g.quadraticCurveTo(cx, cy + 40, cx + 18, cy + 8); g.quadraticCurveTo(cx, cy + 20, cx - 18, cy + 8); g.fillStyle = ch === 'king' || ch === 'jester' ? '#fff' : '#b07a3a'; g.fill(); g.strokeStyle = INK; g.lineWidth = 2; g.stroke(); }
      if (a.acc === 'mustache') { ell(g, cx - 6, cy + 9, 7, 3, INK, null, 0, 0.3); ell(g, cx + 6, cy + 9, 7, 3, INK, null, 0, -0.3); }
      if (a.acc === 'monocle') { circle(g, cx + 9, cy - 1, 6.5, null, '#ffd23f', 2.2); }
      if (a.acc === 'glasses') { circle(g, cx - 9, cy - 1, 6, null, INK, 2); circle(g, cx + 9, cy - 1, 6, null, INK, 2); }
      if (a.acc === 'cigar') { rrect(g, cx + 8, cy + 10, 14, 4, 2, '#8a5a2a'); circle(g, cx + 23, cy + 12, 2, '#ff8a3d'); }
      // 모자
      const hatType = a.hat || { knight: 'helmetK', wizard: 'wizard', witch: 'witch', king: 'kingcrown', miner: 'hardhat', dwarf: 'hood', maid: 'maidcap', monk: null, grandma: 'bun', butler: null, goblin: null, doll: 'bow' }[ch] || null;
      if (hatType === 'wizard' || hatType === 'witch') {
        poly(g, [[cx - 26, cy - 12], [cx + 6, cy - 58], [cx + 26, cy - 12]], hatType === 'wizard' ? '#4b3aa8' : '#2b1a3a', INK, 2.5);
        ell(g, cx, cy - 12, 32, 6, hatType === 'wizard' ? '#4b3aa8' : '#2b1a3a', INK, 2.5);
        star(g, cx + 2, cy - 30, 5, '#ffe066');
      } else if (hatType === 'hardhat' || a.acc === 'hardhat') {
        ell(g, cx, cy - 14, 24, 14, '#ffd23f', INK, 2.5); rrect(g, cx - 28, cy - 14, 56, 5, 2, '#ffd23f', INK, 2); circle(g, cx, cy - 22, 4, '#fff', INK, 1.5);
      } else if (hatType === 'helmetK') {
        rrect(g, cx - 24, cy - 26, 48, 22, 10, '#b8c2d6', INK, 2.5); poly(g, [[cx, cy - 26], [cx - 4, cy - 40], [cx + 10, cy - 34]], '#ff4d6d', INK, 2);
      } else if (hatType === 'hood') {
        ell(g, cx, cy - 12, 24, 14, '#3a6b2a', INK, 2.5);
      } else if (hatType === 'maidcap') {
        rrect(g, cx - 18, cy - 24, 36, 8, 4, '#fff', INK, 2);
      } else if (hatType === 'bun') {
        circle(g, cx, cy - 24, 9, '#ddd', INK, 2);
      } else if (hatType === 'bow') {
        poly(g, [[cx, cy - 20], [cx - 14, cy - 28], [cx - 14, cy - 12]], '#ff4d6d', INK, 2); poly(g, [[cx, cy - 20], [cx + 14, cy - 28], [cx + 14, cy - 12]], '#ff4d6d', INK, 2);
      } else if (hatType) hat(g, hatType, cx, cy - 8, hue);
      break;
    }
    case 'blob': { ell(g, cx, cy + 14, 26, 30, hsl(hue + 30, 70, 65), INK, 2.5); face(g, cx, cy + 8, 1, a.mood); if (a.acc === 'beret') hat(g, 'beret', cx, cy - 6, hue + 180); break; }
    case 'snowman': { circle(g, cx, cy + 30, 22, '#fff', INK, 2.5); circle(g, cx, cy - 2, 18, '#fff', INK, 2.5); face(g, cx, cy - 2, 0.85, a.mood); poly(g, [[cx, cy + 3], [cx + 12, cy + 5], [cx, cy + 7]], '#ff8a3d'); rrect(g, cx - 14, cy - 30, 28, 14, 2, INK); break; }
    case 'twins': { for (const [dx, hh] of [[-14, hue], [14, hue + 180]]) { circle(g, cx + dx, cy + 6, 17, SKIN, INK, 2.5); face(g, cx + dx, cy + 8, 0.7, dx < 0 ? 'happy' : 'grin', { noCheek: true }); poly(g, [[cx + dx - 16, cy - 4], [cx + dx, cy - 30], [cx + dx + 16, cy - 4]], hsl(hh, 80, 55), INK, 2); circle(g, cx + dx, cy - 30, 4, '#ffd23f', INK, 1.5); } break; }
    case 'robot': { body('#8a95a8'); rrect(g, cx - 22, cy - 22, 44, 40, 8, '#b8c2d6', INK, 2.5); g.strokeStyle = INK; g.lineWidth = 2.5; g.beginPath(); g.moveTo(cx, cy - 22); g.lineTo(cx, cy - 32); g.stroke(); circle(g, cx, cy - 34, 4, '#ff4d6d', INK, 1.5); rrect(g, cx - 16, cy - 12, 32, 22, 5, '#1a2a3a'); const ec = a.mood === 'angry' ? '#ff4d6d' : a.mood === 'crazy' ? '#ffe066' : '#5ce1ff'; circle(g, cx - 8, cy - 3, 4, ec); circle(g, cx + 8, cy - 3, 4, ec); g.fillStyle = ec; g.fillRect(cx - 8, cy + 5, 16, 2.5); if (a.acc === 'bowtie') { poly(g, [[cx - 9, cy + 20], [cx, cy + 24], [cx - 9, cy + 28]], '#ff2e63'); poly(g, [[cx + 9, cy + 20], [cx, cy + 24], [cx + 9, cy + 28]], '#ff2e63'); } break; }
    case 'ghost': { g.globalAlpha = a.faded ? 0.55 : 0.95; g.beginPath(); g.moveTo(cx - 24, cy + 40); g.lineTo(cx - 24, cy); g.arc(cx, cy, 24, Math.PI, 0); g.lineTo(cx + 24, cy + 40); for (let i = 0; i < 4; i++) g.quadraticCurveTo(cx + 24 - i * 12 - 6, cy + 32, cx + 24 - (i + 1) * 12, cy + 40); g.closePath(); g.fillStyle = '#f0f4ff'; g.fill(); g.strokeStyle = INK; g.lineWidth = 2.5; g.stroke(); g.globalAlpha = 1; face(g, cx, cy + 2, 0.9, a.mood); break; }
    case 'cat': { body(hsl(hue, 40, 40)); poly(g, [[cx - 20, cy - 10], [cx - 16, cy - 32], [cx - 4, cy - 18]], '#f0a860', INK, 2.5); poly(g, [[cx + 20, cy - 10], [cx + 16, cy - 32], [cx + 4, cy - 18]], '#f0a860', INK, 2.5); circle(g, cx, cy, 21, '#f0a860', INK, 2.5); face(g, cx, cy + 2, 0.9, a.mood); g.strokeStyle = INK; g.lineWidth = 1.5; for (const s of [-1, 1]) { g.beginPath(); g.moveTo(cx + s * 10, cy + 6); g.lineTo(cx + s * 26, cy + 3); g.moveTo(cx + s * 10, cy + 8); g.lineTo(cx + s * 26, cy + 10); g.stroke(); } break; }
    case 'bear': { body('#8a5a2a'); circle(g, cx - 18, cy - 16, 8, '#a0703a', INK, 2.5); circle(g, cx + 18, cy - 16, 8, '#a0703a', INK, 2.5); circle(g, cx, cy, 22, '#a0703a', INK, 2.5); ell(g, cx, cy + 9, 9, 7, '#e0b080'); face(g, cx, cy + 1, 0.9, a.mood, { noCheek: true }); if (a.acc === 'hardhat') { ell(g, cx, cy - 16, 22, 12, '#ffd23f', INK, 2.5); rrect(g, cx - 26, cy - 16, 52, 5, 2, '#ffd23f', INK, 2); } break; }
    case 'pig': { body('#ff9fc0'); circle(g, cx, cy, 22, '#ffb3cc', INK, 2.5); poly(g, [[cx - 18, cy - 12], [cx - 12, cy - 28], [cx - 4, cy - 18]], '#ff9fc0', INK, 2); poly(g, [[cx + 18, cy - 12], [cx + 12, cy - 28], [cx + 4, cy - 18]], '#ff9fc0', INK, 2); face(g, cx, cy - 2, 0.85, a.mood, { noCheek: true }); ell(g, cx, cy + 10, 8, 6, '#ff7fa8', INK, 2); circle(g, cx - 3, cy + 10, 1.5, INK); circle(g, cx + 3, cy + 10, 1.5, INK); break; }
    case 'chip': { const t = a.tint || '#ff3355'; circle(g, cx + 6, cy + 4, 34, t, INK, 3); for (let i = 0; i < 8; i++) { g.save(); g.translate(cx + 6, cy + 4); g.rotate((i / 8) * TAU); g.fillStyle = '#fff'; g.fillRect(-4, -34, 8, 9); g.restore(); } circle(g, cx + 6, cy + 4, 22, '#fff', INK, 2); face(g, cx + 6, cy + 4, 0.8, a.mood); break; }
    case 'mole': { body('#6b5a4a'); circle(g, cx, cy, 22, '#7a6a5a', INK, 2.5); ell(g, cx, cy + 6, 6, 5, '#ff9fc0', INK, 1.5); face(g, cx, cy - 2, 0.8, a.mood, { noCheek: true }); rrect(g, cx - 18, cy - 24, 36, 8, 4, '#ffd23f', INK, 2); circle(g, cx, cy - 22, 4, '#fff'); break; }
    case 'fairy': { ell(g, cx - 20, cy + 6, 14, 22, 'rgba(200,240,255,0.7)', INK, 2, -0.5); ell(g, cx + 20, cy + 6, 14, 22, 'rgba(200,240,255,0.7)', INK, 2, 0.5); body('#ff9fe0'); circle(g, cx, cy, 20, SKIN, INK, 2.5); face(g, cx, cy + 2, 0.85, a.mood); star(g, cx, cy - 26, 7, '#ffe066'); break; }
    case 'snake': { g.strokeStyle = '#3ddc97'; g.lineWidth = 14; g.lineCap = 'round'; g.beginPath(); g.moveTo(cx - 20, 100); g.bezierCurveTo(cx + 30, 90, cx - 30, 70, cx, cy + 16); g.stroke(); g.strokeStyle = INK; g.lineWidth = 2; ell(g, cx, cy + 2, 20, 17, '#3ddc97', INK, 2.5); face(g, cx, cy + 2, 0.8, a.mood, { noCheek: true }); poly(g, [[cx, cy + 18], [cx - 3, cy + 26], [cx, cy + 23], [cx + 3, cy + 26]], '#ff2e63'); break; }
    case 'twoface': { body('#333'); g.save(); g.beginPath(); g.arc(cx, cy, 22, Math.PI / 2, Math.PI * 1.5); g.closePath(); g.fillStyle = '#fff'; g.fill(); g.beginPath(); g.arc(cx, cy, 22, -Math.PI / 2, Math.PI / 2); g.closePath(); g.fillStyle = '#222'; g.fill(); g.restore(); circle(g, cx, cy, 22, null, INK, 2.5); face(g, cx, cy + 2, 0.9, a.mood, { ink: '#ff4d6d' }); break; }
    case 'crowd': { for (let i = 0; i < 5; i++) { const x = 18 + (i % 3) * 26 + (i > 2 ? 13 : 0), y = i > 2 ? 62 : 40; circle(g, x, y, 13, [SKIN, '#f0c090', '#e0a878', '#ffd9b8', '#d09060'][i], INK, 2); face(g, x, y + 1, 0.45, i % 2 ? 'shock' : 'happy', { noCheek: true }); } break; }
    case 'giant': { body(hsl(hue, 60, 45)); circle(g, cx, cy - 2, 26, '#b8d68a', INK, 2.5); face(g, cx, cy, 1.05, a.mood, { noCheek: true }); break; }
    case 'turtle': { ell(g, cx + 4, cy + 20, 30, 20, '#3d8a3d', INK, 2.5); for (let i = -1; i <= 1; i++) poly(g, [[cx + 4 + i * 14, cy + 10], [cx + 10 + i * 14, cy + 18], [cx + 4 + i * 14, cy + 26], [cx - 2 + i * 14, cy + 18]], '#5aa85a', INK, 1.5); circle(g, cx - 18, cy, 14, '#8fd46b', INK, 2.5); face(g, cx - 18, cy + 1, 0.6, a.mood, { noCheek: true }); break; }
    case 'sloth': { body('#9a8a70'); circle(g, cx, cy, 22, '#b0a080', INK, 2.5); ell(g, cx, cy + 2, 18, 12, '#e0d0b0'); ell(g, cx - 9, cy - 1, 6, 4, '#5a4a3a', null, 0, 0.3); ell(g, cx + 9, cy - 1, 6, 4, '#5a4a3a', null, 0, -0.3); face(g, cx, cy + 1, 0.8, a.mood, { noCheek: true, ink: '#1a0d24' }); break; }
    case 'squirrel': { ell(g, cx + 22, cy + 6, 14, 26, '#c47a3d', INK, 2.5, 0.3); body('#c47a3d'); circle(g, cx, cy, 20, '#d68a4a', INK, 2.5); poly(g, [[cx - 16, cy - 10], [cx - 12, cy - 26], [cx - 4, cy - 16]], '#d68a4a', INK, 2); poly(g, [[cx + 16, cy - 10], [cx + 12, cy - 26], [cx + 4, cy - 16]], '#d68a4a', INK, 2); face(g, cx, cy + 2, 0.8, a.mood); break; }
    case 'band': { for (let i = 0; i < 4; i++) { const x = 14 + i * 20, y = 48 + (i % 2) * 8; circle(g, x, y, 10, [SKIN, '#f0c090', '#ffd9b8', '#e0a878'][i], INK, 2); face(g, x, y + 1, 0.38, 'happy', { noCheek: true }); poly(g, [[x - 9, y - 6], [x, y - 20], [x + 9, y - 6]], hsl(hue + i * 40, 80, 55), INK, 1.5); } break; }
    case 'cosmic': { circle(g, cx, cy + 4, 28, '#1a0d3a', '#c86bff', 3); for (let i = 0; i < 8; i++) star(g, cx - 18 + ((i * 13) % 36), cy - 14 + ((i * 17) % 36), 2.5, '#fff'); face(g, cx, cy + 4, 0.9, a.mood, { ink: '#e6ddff', noCheek: true }); break; }
    case 'phoenix': { for (const s of [-1, 1]) poly(g, [[cx, cy + 10], [cx + s * 42, cy - 20], [cx + s * 34, cy + 6], [cx + s * 44, cy + 14], [cx + s * 20, cy + 26]], s < 0 ? '#ff8a3d' : '#ffb627', INK, 2); ell(g, cx, cy + 20, 14, 20, '#ff4d6d', INK, 2.5); circle(g, cx, cy - 4, 15, '#ff6b3d', INK, 2.5); poly(g, [[cx - 3, cy - 18], [cx + 2, cy - 34], [cx + 6, cy - 18]], '#ffe066', INK, 2); face(g, cx, cy - 3, 0.6, a.mood, { noCheek: true }); poly(g, [[cx - 3, cy + 2], [cx + 10, cy + 4], [cx - 3, cy + 7]], '#ffd23f', INK, 1.5); break; }
    case 'owl': { body('#8a6a4a'); ell(g, cx, cy + 2, 24, 26, '#a07a50', INK, 2.5); poly(g, [[cx - 20, cy - 16], [cx - 18, cy - 30], [cx - 8, cy - 20]], '#a07a50', INK, 2); poly(g, [[cx + 20, cy - 16], [cx + 18, cy - 30], [cx + 8, cy - 20]], '#a07a50', INK, 2); circle(g, cx - 9, cy - 3, 9, '#fff', INK, 2); circle(g, cx + 9, cy - 3, 9, '#fff', INK, 2); circle(g, cx - 9, cy - 3, 4, INK); circle(g, cx + 9, cy - 3, 4, INK); poly(g, [[cx - 4, cy + 6], [cx + 4, cy + 6], [cx, cy + 13]], '#ffb627', INK, 1.5); if (a.acc === 'glasses') { circle(g, cx - 9, cy - 3, 10, null, INK, 2); circle(g, cx + 9, cy - 3, 10, null, INK, 2); } break; }
    default: circle(g, cx, cy, 22, SKIN, INK, 2.5); face(g, cx, cy, 1, a.mood);
  }
}

// 카드 일러스트 영역(0..100 정규 좌표)에 그림
export function drawJokerArt(g, id, w, h, hue) {
  const a = ART[id] || { ch: 'jester', hat: 'bells', mood: 'grin', pat: 'rays' };
  g.save();
  const s = Math.max(w, h) / 100;
  g.translate((w - 100 * s) / 2, (h - 100 * s) / 2);
  g.scale(s, s);
  drawPattern(g, a.pat, hue);
  character(g, a, hue);
  if (a.prop) prop(g, a.prop, hue);
  g.restore();
}
