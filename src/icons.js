// 캔버스로 그리는 메뉴/재료/UI 아이콘 (외부 이미지 없이)
import { MENUS, INGS } from './config.js';

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
export { rr };

function outline(ctx, w = 3) {
  ctx.lineWidth = w;
  ctx.strokeStyle = 'rgba(40,24,20,0.85)';
  ctx.stroke();
}

function nigiri(ctx, s, fish, stripe, extra) {
  // 밥
  ctx.fillStyle = '#fbf8f0';
  rr(ctx, s * 0.2, s * 0.48, s * 0.6, s * 0.26, s * 0.12);
  ctx.fill();
  outline(ctx, s * 0.04);
  // 생선
  ctx.fillStyle = fish;
  ctx.beginPath();
  ctx.moveTo(s * 0.12, s * 0.52);
  ctx.quadraticCurveTo(s * 0.5, s * 0.2, s * 0.88, s * 0.46);
  ctx.quadraticCurveTo(s * 0.9, s * 0.6, s * 0.8, s * 0.6);
  ctx.quadraticCurveTo(s * 0.5, s * 0.46, s * 0.18, s * 0.64);
  ctx.quadraticCurveTo(s * 0.08, s * 0.6, s * 0.12, s * 0.52);
  ctx.fill();
  outline(ctx, s * 0.04);
  if (stripe) {
    ctx.strokeStyle = stripe;
    ctx.lineWidth = s * 0.035;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      const x = s * (0.32 + i * 0.16);
      ctx.moveTo(x, s * 0.36);
      ctx.lineTo(x + s * 0.06, s * 0.54);
      ctx.stroke();
    }
  }
  if (extra) extra(ctx, s);
}

function gunkan(ctx, s, top, dots) {
  ctx.fillStyle = '#1d2b22';
  rr(ctx, s * 0.2, s * 0.4, s * 0.6, s * 0.36, s * 0.08);
  ctx.fill();
  outline(ctx, s * 0.04);
  ctx.fillStyle = '#2f4a38';
  ctx.fillRect(s * 0.24, s * 0.5, s * 0.52, s * 0.04);
  ctx.fillStyle = top;
  ctx.beginPath();
  ctx.ellipse(s * 0.5, s * 0.4, s * 0.3, s * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();
  outline(ctx, s * 0.035);
  if (dots) {
    ctx.fillStyle = dots;
    for (let i = 0; i < 7; i++) {
      ctx.beginPath();
      ctx.arc(s * (0.3 + (i % 4) * 0.13 + (i > 3 ? 0.06 : 0)), s * (0.36 + (i > 3 ? 0.07 : 0)), s * 0.05, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.arc(s * (0.29 + i * 0.13), s * 0.345, s * 0.015, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.beginPath();
    ctx.ellipse(s * 0.42, s * 0.37, s * 0.12, s * 0.04, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawMenu(ctx, id, s) {
  switch (id) {
    case 'salmon':
      nigiri(ctx, s, '#ff8a4c', '#ffe1cc');
      break;
    case 'tuna':
      nigiri(ctx, s, '#d4263f', null, (c) => {
        c.fillStyle = 'rgba(255,255,255,0.3)';
        c.beginPath();
        c.ellipse(s * 0.45, s * 0.42, s * 0.18, s * 0.04, -0.2, 0, Math.PI * 2);
        c.fill();
      });
      break;
    case 'tamago':
      ctx.fillStyle = '#fbf8f0';
      rr(ctx, s * 0.2, s * 0.52, s * 0.6, s * 0.22, s * 0.1);
      ctx.fill();
      outline(ctx, s * 0.04);
      ctx.fillStyle = '#ffd23f';
      rr(ctx, s * 0.14, s * 0.28, s * 0.72, s * 0.3, s * 0.06);
      ctx.fill();
      outline(ctx, s * 0.04);
      ctx.fillStyle = '#1d2b22';
      ctx.fillRect(s * 0.44, s * 0.27, s * 0.12, s * 0.47);
      break;
    case 'ebi':
      ctx.fillStyle = '#fbf8f0';
      rr(ctx, s * 0.22, s * 0.56, s * 0.56, s * 0.2, s * 0.1);
      ctx.fill();
      outline(ctx, s * 0.04);
      ctx.fillStyle = '#e9a53c';
      ctx.beginPath();
      ctx.ellipse(s * 0.46, s * 0.46, s * 0.3, s * 0.13, -0.35, 0, Math.PI * 2);
      ctx.fill();
      outline(ctx, s * 0.04);
      ctx.fillStyle = '#f7c86a';
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(s * (0.28 + i * 0.08), s * (0.5 - i * 0.03), s * 0.03, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#ff4a3a';
      ctx.beginPath();
      ctx.moveTo(s * 0.7, s * 0.32);
      ctx.lineTo(s * 0.9, s * 0.18);
      ctx.lineTo(s * 0.86, s * 0.36);
      ctx.closePath();
      ctx.fill();
      outline(ctx, s * 0.03);
      break;
    case 'udon':
      ctx.fillStyle = '#b8392e';
      ctx.beginPath();
      ctx.moveTo(s * 0.12, s * 0.44);
      ctx.lineTo(s * 0.88, s * 0.44);
      ctx.quadraticCurveTo(s * 0.84, s * 0.82, s * 0.5, s * 0.82);
      ctx.quadraticCurveTo(s * 0.16, s * 0.82, s * 0.12, s * 0.44);
      ctx.fill();
      outline(ctx, s * 0.04);
      ctx.fillStyle = '#f6e7bf';
      ctx.beginPath();
      ctx.ellipse(s * 0.5, s * 0.44, s * 0.38, s * 0.1, 0, 0, Math.PI * 2);
      ctx.fill();
      outline(ctx, s * 0.035);
      ctx.strokeStyle = '#e0c98a';
      ctx.lineWidth = s * 0.02;
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.arc(s * (0.34 + i * 0.1), s * 0.44, s * 0.05, 0, Math.PI);
        ctx.stroke();
      }
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(s * 0.62, s * 0.42, s * 0.06, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ff7ab8';
      ctx.lineWidth = s * 0.02;
      ctx.beginPath();
      ctx.arc(s * 0.62, s * 0.42, s * 0.03, 0, Math.PI * 1.6);
      ctx.stroke();
      ctx.fillStyle = '#5fbf4a';
      ctx.fillRect(s * 0.34, s * 0.4, s * 0.05, s * 0.03);
      ctx.fillRect(s * 0.44, s * 0.46, s * 0.05, s * 0.03);
      ctx.strokeStyle = '#6b4a2a';
      ctx.lineWidth = s * 0.03;
      ctx.beginPath();
      ctx.moveTo(s * 0.62, s * 0.12);
      ctx.lineTo(s * 0.52, s * 0.44);
      ctx.moveTo(s * 0.74, s * 0.14);
      ctx.lineTo(s * 0.58, s * 0.44);
      ctx.stroke();
      break;
    case 'uni':
      gunkan(ctx, s, '#ffb52e');
      ctx.fillStyle = '#ffcf5a';
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.ellipse(s * (0.32 + i * 0.12), s * 0.37, s * 0.06, s * 0.035, 0.4, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    case 'ikura':
      gunkan(ctx, s, '#ff6a1f', '#ff4a10');
      break;
    case 'unagi':
      nigiri(ctx, s, '#8a5530', null, (c) => {
        c.strokeStyle = '#4a2a14';
        c.lineWidth = s * 0.04;
        for (let i = 0; i < 3; i++) {
          c.beginPath();
          c.moveTo(s * (0.28 + i * 0.18), s * 0.4);
          c.lineTo(s * (0.3 + i * 0.18), s * 0.56);
          c.stroke();
        }
        c.fillStyle = '#1d2b22';
        c.fillRect(s * 0.46, s * 0.34, s * 0.08, s * 0.4);
      });
      break;
    case 'dessert':
      ctx.strokeStyle = '#c99a5a';
      ctx.lineWidth = s * 0.04;
      ctx.beginPath();
      ctx.moveTo(s * 0.12, s * 0.82);
      ctx.lineTo(s * 0.86, s * 0.14);
      ctx.stroke();
      [['#8fd16a', 0.34, 0.62], ['#ffffff', 0.5, 0.47], ['#ff9cc4', 0.66, 0.32]].forEach(([c, x, y]) => {
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(s * x, s * y, s * 0.13, 0, Math.PI * 2);
        ctx.fill();
        outline(ctx, s * 0.035);
      });
      break;
    case 'star': {
      ctx.fillStyle = '#b58cff';
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 5;
        const r = i % 2 ? s * 0.17 : s * 0.38;
        ctx.lineTo(s * 0.5 + Math.cos(a) * r, s * 0.52 + Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fill();
      outline(ctx, s * 0.04);
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.beginPath();
      ctx.arc(s * 0.43, s * 0.44, s * 0.06, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    default:
      ctx.fillStyle = '#ccc';
      ctx.fillRect(s * 0.2, s * 0.2, s * 0.6, s * 0.6);
  }
}

export function drawIng(ctx, id, s) {
  const c = INGS[id]?.color || '#ccc';
  ctx.save();
  switch (id) {
    case 'salmon':
    case 'tuna':
    case 'eel':
      ctx.fillStyle = c;
      rr(ctx, s * 0.14, s * 0.3, s * 0.72, s * 0.4, s * 0.1);
      ctx.fill();
      outline(ctx, s * 0.04);
      ctx.strokeStyle = id === 'salmon' ? '#ffe1cc' : 'rgba(255,255,255,0.3)';
      ctx.lineWidth = s * 0.035;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(s * (0.3 + i * 0.16), s * 0.32);
        ctx.lineTo(s * (0.38 + i * 0.16), s * 0.68);
        ctx.stroke();
      }
      break;
    case 'egg':
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = '#fff6df';
        ctx.beginPath();
        ctx.ellipse(s * (0.28 + i * 0.22), s * 0.5, s * 0.1, s * 0.14, 0, 0, Math.PI * 2);
        ctx.fill();
        outline(ctx, s * 0.035);
      }
      break;
    case 'shrimp':
      ctx.strokeStyle = c;
      ctx.lineWidth = s * 0.16;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(s * 0.5, s * 0.5, s * 0.22, Math.PI * 0.2, Math.PI * 1.5);
      ctx.stroke();
      ctx.fillStyle = '#ff4a3a';
      ctx.beginPath();
      ctx.moveTo(s * 0.5, s * 0.22);
      ctx.lineTo(s * 0.72, s * 0.14);
      ctx.lineTo(s * 0.66, s * 0.34);
      ctx.fill();
      break;
    case 'noodle':
      ctx.fillStyle = c;
      rr(ctx, s * 0.14, s * 0.38, s * 0.72, s * 0.26, s * 0.1);
      ctx.fill();
      outline(ctx, s * 0.04);
      ctx.fillStyle = '#c0392b';
      ctx.fillRect(s * 0.44, s * 0.36, s * 0.1, s * 0.3);
      break;
    case 'uni':
      ctx.fillStyle = '#3a2a4a';
      ctx.beginPath();
      ctx.arc(s * 0.5, s * 0.52, s * 0.24, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#3a2a4a';
      ctx.lineWidth = s * 0.03;
      for (let i = 0; i < 14; i++) {
        const a = (i / 14) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(s * 0.5 + Math.cos(a) * s * 0.2, s * 0.52 + Math.sin(a) * s * 0.2);
        ctx.lineTo(s * 0.5 + Math.cos(a) * s * 0.36, s * 0.52 + Math.sin(a) * s * 0.36);
        ctx.stroke();
      }
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(s * 0.5, s * 0.5, s * 0.1, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'berry':
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.moveTo(s * 0.26, s * 0.36);
      ctx.quadraticCurveTo(s * 0.5, s * 0.28, s * 0.74, s * 0.36);
      ctx.quadraticCurveTo(s * 0.7, s * 0.7, s * 0.5, s * 0.84);
      ctx.quadraticCurveTo(s * 0.3, s * 0.7, s * 0.26, s * 0.36);
      ctx.fill();
      outline(ctx, s * 0.035);
      ctx.fillStyle = '#4fbf4a';
      ctx.beginPath();
      ctx.ellipse(s * 0.5, s * 0.3, s * 0.2, s * 0.07, 0, 0, Math.PI * 2);
      ctx.fill();
      break;
    case 'roe':
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      rr(ctx, s * 0.28, s * 0.24, s * 0.44, s * 0.56, s * 0.08);
      ctx.fill();
      outline(ctx, s * 0.035);
      ctx.fillStyle = c;
      for (let i = 0; i < 9; i++) {
        ctx.beginPath();
        ctx.arc(s * (0.37 + (i % 3) * 0.13), s * (0.46 + Math.floor(i / 3) * 0.1), s * 0.05, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    case 'star':
      drawMenu(ctx, 'star', s);
      break;
  }
  ctx.restore();
}

const cache = new Map();
export function iconURL(kind, id, size = 96) {
  const key = kind + ':' + id + ':' + size;
  if (cache.has(key)) return cache.get(key);
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d');
  ctx.lineJoin = 'round';
  if (kind === 'menu') drawMenu(ctx, id, size);
  else drawIng(ctx, id, size);
  const url = c.toDataURL();
  cache.set(key, url);
  return url;
}

export function menuImg(id, cls = 'mi') {
  return `<img class="${cls}" src="${iconURL('menu', id)}" alt="${MENUS[id]?.name || ''}" draggable="false">`;
}
export function ingImg(id, cls = 'mi') {
  return `<img class="${cls}" src="${iconURL('ing', id)}" alt="${INGS[id]?.name || ''}" draggable="false">`;
}

// UI 아이콘 (인라인 SVG)
export const SVG = {
  coin: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#ffc83d" stroke="#b9770e" stroke-width="2"/><circle cx="12" cy="12" r="6" fill="none" stroke="#e8a21a" stroke-width="1.6"/><path d="M12 8v8" stroke="#b9770e" stroke-width="2" stroke-linecap="round"/></svg>',
  pearl: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="#f4eefc" stroke="#9a86c9" stroke-width="2"/><circle cx="9" cy="9" r="3" fill="#fff"/><circle cx="14" cy="15" r="4" fill="#dcd0f2" opacity=".6"/></svg>',
  star: '<svg viewBox="0 0 24 24"><path d="M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5-4.9-4.5 6.6-.8z" fill="#ffc83d" stroke="#b9770e" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  heart: '<svg viewBox="0 0 24 24"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" fill="#ff4f6d" stroke="#a3213a" stroke-width="1.6"/></svg>',
  angry: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#ff5a3c" stroke="#8a1e10" stroke-width="1.6"/><path d="M7 9l3 1.5M17 9l-3 1.5" stroke="#3a0a04" stroke-width="2" stroke-linecap="round"/><path d="M8 17q4-3 8 0" stroke="#3a0a04" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
  happy: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#ffd23f" stroke="#a37a00" stroke-width="1.6"/><path d="M7.5 10q1.5-2 3 0M13.5 10q1.5-2 3 0" stroke="#3a2a00" stroke-width="1.8" fill="none" stroke-linecap="round"/><path d="M7 14q5 5 10 0z" fill="#8a2a1a"/></svg>',
  sweat: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#ffd23f" stroke="#a37a00" stroke-width="1.6"/><path d="M8 11h3M13 11h3" stroke="#3a2a00" stroke-width="1.8" stroke-linecap="round"/><path d="M9 16h6" stroke="#3a2a00" stroke-width="1.8" stroke-linecap="round"/><path d="M19 4q2 3 0 5q-2-2 0-5z" fill="#5ac8ff"/></svg>',
  crown: '<svg viewBox="0 0 24 24"><path d="M3 18l1.5-10 5 4.5L12 5l2.5 7.5 5-4.5L21 18z" fill="#ffc83d" stroke="#b9770e" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  pause: '<svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1.5" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1.5" fill="currentColor"/></svg>',
  sound: '<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8q3 4 0 8M18.5 5.5q5 6.5 0 13" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
  mute: '<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  mission: '<svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2.5" fill="#fff4dc" stroke="#7a4a1a" stroke-width="1.8"/><path d="M8 9l2 2 4-4M8 15h8" stroke="#e8483b" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
  calendar: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3" fill="#fff" stroke="#7a4a1a" stroke-width="1.8"/><rect x="3" y="5" width="18" height="5" rx="2" fill="#e8483b"/><circle cx="12" cy="15" r="3" fill="#ffc83d"/></svg>',
  book: '<svg viewBox="0 0 24 24"><path d="M4 5q4-2 8 1v14q-4-3-8-1z" fill="#ffe2b8" stroke="#7a4a1a" stroke-width="1.6"/><path d="M20 5q-4-2-8 1v14q4-3 8-1z" fill="#fff4dc" stroke="#7a4a1a" stroke-width="1.6"/></svg>',
  shirt: '<svg viewBox="0 0 24 24"><path d="M8 3l-5 4 3 3 2-1v12h8V9l2 1 3-3-5-4q-2 2-4 2t-4-2z" fill="#4fb0ff" stroke="#1a4a7a" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  trophy: '<svg viewBox="0 0 24 24"><path d="M7 3h10v5a5 5 0 0 1-10 0z" fill="#ffc83d" stroke="#b9770e" stroke-width="1.6"/><path d="M7 5H4q0 4 3.5 4.5M17 5h3q0 4-3.5 4.5" stroke="#b9770e" stroke-width="1.6" fill="none"/><path d="M10 13h4v4h3v3H7v-3h3z" fill="#e8a21a" stroke="#b9770e" stroke-width="1.4"/></svg>',
  chart: '<svg viewBox="0 0 24 24"><rect x="4" y="12" width="4" height="8" rx="1" fill="#4fb0ff"/><rect x="10" y="7" width="4" height="13" rx="1" fill="#ffc83d"/><rect x="16" y="3" width="4" height="17" rx="1" fill="#e8483b"/></svg>',
  gear: '<svg viewBox="0 0 24 24"><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm8.5 5l-2 .4-.6 1.5 1.2 1.7-1.8 1.8-1.7-1.2-1.5.6-.4 2h-2.6l-.4-2-1.5-.6-1.7 1.2-1.8-1.8 1.2-1.7-.6-1.5-2-.4v-2.6l2-.4.6-1.5-1.2-1.7 1.8-1.8 1.7 1.2 1.5-.6.4-2h2.6l.4 2 1.5.6 1.7-1.2 1.8 1.8-1.2 1.7.6 1.5 2 .4z" fill="currentColor"/></svg>',
  arrow: '<svg viewBox="0 0 24 24"><path d="M12 2l8 10h-5v10H9V12H4z" fill="#ffe14d" stroke="#8a5a00" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  hand: '<svg viewBox="0 0 48 48"><path d="M18 6a3 3 0 0 1 6 0v16l2-.5V14a3 3 0 0 1 6 0v9l2 .3V17a3 3 0 0 1 6 0v14q0 11-10 13h-5q-6 0-10-6l-7-10a3 3 0 0 1 4.5-4L18 29z" fill="#fff" stroke="#333" stroke-width="2.2" stroke-linejoin="round"/></svg>',
  menu: '<svg viewBox="0 0 24 24"><rect x="4" y="6" width="16" height="2.6" rx="1.3" fill="currentColor"/><rect x="4" y="11" width="16" height="2.6" rx="1.3" fill="currentColor"/><rect x="4" y="16" width="16" height="2.6" rx="1.3" fill="currentColor"/></svg>',
  up2: '<svg viewBox="0 0 24 24"><path d="M12 3l7 7h-4v5H9v-5H5z" fill="#35c46a" stroke="#167a3a" stroke-width="1.6" stroke-linejoin="round"/><rect x="6" y="17" width="12" height="3.5" rx="1.5" fill="#ffc83d" stroke="#b9770e" stroke-width="1.4"/></svg>',
  lock: '<svg viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="11" rx="2.5" fill="#8a8f9e"/><path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="#8a8f9e" stroke-width="2.4" fill="none"/></svg>',
  up: '<svg viewBox="0 0 24 24"><path d="M12 4l7 8h-4v8H9v-8H5z" fill="#fff"/></svg>',
  plate: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="13" rx="9" ry="5" fill="#fff" stroke="#667" stroke-width="1.6"/><ellipse cx="12" cy="12.5" rx="5" ry="2.5" fill="#e8eef5"/></svg>',
  belt: '<svg viewBox="0 0 24 24"><rect x="2" y="8" width="20" height="8" rx="4" fill="#556" /><circle cx="6" cy="12" r="2" fill="#ccd"/><circle cx="18" cy="12" r="2" fill="#ccd"/><rect x="8" y="5" width="8" height="4" rx="1" fill="#ff9a3c"/></svg>',
  fire: '<svg viewBox="0 0 24 24"><path d="M12 2q5 5 5 11a5 5 0 0 1-10 0q0-3 2-5 0 3 2 3 0-5 1-9z" fill="#ff7a2a" stroke="#a3350a" stroke-width="1.4"/></svg>',
  run: '<svg viewBox="0 0 24 24"><circle cx="15" cy="4.5" r="2.5" fill="#fff"/><path d="M9 21l3-6 3 2v4M7 12l3-4h4l2 4 3 1M12 8l-2 5 4 3" stroke="#fff" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  stack: '<svg viewBox="0 0 24 24"><rect x="5" y="15" width="14" height="4" rx="1.5" fill="#fff"/><rect x="6" y="10" width="12" height="4" rx="1.5" fill="#fff" opacity=".85"/><rect x="7" y="5" width="10" height="4" rx="1.5" fill="#fff" opacity=".7"/></svg>',
};
