// DOM 오버레이 화면 도우미
import { CARDS, RELICS } from './config.js';
import { drawIcon, iconDataURL } from './icons.js';

const imgCache = new Map();
let faceMaker = null;

export function setFaceMaker(fn) {
  faceMaker = fn;
}

export function cardImg(id) {
  const key = 'card:' + id;
  if (imgCache.has(key)) return imgCache.get(key);
  const c = faceMaker(id, 80, 98, 2);
  // 비용 방울
  const g = c.getContext('2d');
  g.setTransform(2, 0, 0, 2, 0, 0);
  const x = 12;
  const y = 14;
  const r = 9;
  g.fillStyle = '#c04ae0';
  g.beginPath();
  g.moveTo(x, y - r * 1.25);
  g.bezierCurveTo(x + r * 0.9, y - r * 0.3, x + r, y + r * 0.2, x + r * 0.95, y + r * 0.35);
  g.arc(x, y + r * 0.2, r, 0.15, Math.PI - 0.15);
  g.bezierCurveTo(x - r, y + r * 0.2, x - r * 0.9, y - r * 0.3, x, y - r * 1.25);
  g.fill();
  g.strokeStyle = '#fff';
  g.lineWidth = 1.5;
  g.stroke();
  g.fillStyle = '#fff';
  g.font = '900 12px system-ui, -apple-system, "Apple SD Gothic Neo", "Noto Sans KR", sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(String(CARDS[id].cost), x, y + 2);
  const url = c.toDataURL();
  imgCache.set(key, url);
  return url;
}

// 미발견 카드: 어두운 카드 + 아이콘 실루엣
export function lockedImg(id) {
  const key = 'locked:' + id;
  if (imgCache.has(key)) return imgCache.get(key);
  const w = 80;
  const h = 98;
  const c = document.createElement('canvas');
  c.width = w * 2;
  c.height = h * 2;
  const g = c.getContext('2d');
  g.scale(2, 2);
  const grad = g.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#3a4262');
  grad.addColorStop(1, '#1e2238');
  g.fillStyle = grad;
  g.beginPath();
  g.roundRect(0, 0, w, h, 9);
  g.fill();
  g.strokeStyle = 'rgba(255,255,255,0.18)';
  g.lineWidth = 2;
  g.stroke();
  const ic = document.createElement('canvas');
  ic.width = ic.height = 120;
  const ig = ic.getContext('2d');
  ig.translate(60, 60);
  drawIcon(ig, id, 44);
  ig.setTransform(1, 0, 0, 1, 0, 0);
  ig.globalCompositeOperation = 'source-in';
  ig.fillStyle = '#0e1020';
  ig.fillRect(0, 0, 120, 120);
  g.drawImage(ic, w / 2 - 30, h * 0.44 - 30, 60, 60);
  g.fillStyle = 'rgba(255,255,255,0.35)';
  g.font = '900 22px system-ui, sans-serif';
  g.textAlign = 'center';
  g.fillText('?', w / 2, h - 12);
  const url = c.toDataURL();
  imgCache.set(key, url);
  return url;
}

export function iconImg(id, bg) {
  const key = 'icon:' + id + bg;
  if (imgCache.has(key)) return imgCache.get(key);
  const url = iconDataURL(id, 96, bg);
  imgCache.set(key, url);
  return url;
}

export function relicImg(id) {
  return iconImg(RELICS[id].icon, '#fff3d6');
}

export function cardHtml(id, extra = '') {
  const c = CARDS[id];
  return `<div class="card ${extra}"><img src="${cardImg(id)}" alt="${c.name}"><span class="cost">${c.cost}</span></div>`;
}

export function crownSvg(color) {
  return `<svg viewBox="0 0 24 20" width="22" height="18"><path d="M2 17 L1.5 5 L7 10 L12 2 L17 10 L22.5 5 L22 17 Z" fill="${color}" stroke="#2a2233" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
}

export class UI {
  constructor(root, onAction) {
    this.root = root;
    this.onAction = onAction;
    this.down = null;
    root.addEventListener('pointerdown', (e) => {
      const t = e.target.closest('[data-act]');
      this.down = t ? { t, x: e.clientX, y: e.clientY } : null;
    });
    root.addEventListener('pointerup', (e) => {
      const t = e.target.closest('[data-act]');
      const d = this.down;
      this.down = null;
      if (!t || !d || d.t !== t) return;
      if (Math.hypot(e.clientX - d.x, e.clientY - d.y) > 14) return;
      if (t.classList.contains('disabled')) return;
      e.preventDefault();
      this.onAction(t.dataset.act, t.dataset.arg, t);
    });
    root.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  show(html, cls = '') {
    this.root.innerHTML = `<div class="screen ${cls}">${html}</div>`;
    this.root.classList.add('active');
    return this.root.firstElementChild;
  }

  modal(html, cls = '') {
    const m = document.createElement('div');
    m.className = 'modal ' + cls;
    m.innerHTML = `<div class="modal-box">${html}</div>`;
    this.root.appendChild(m);
    this.root.classList.add('active');
    return m;
  }

  closeModals() {
    this.root.querySelectorAll('.modal').forEach((m) => m.remove());
    if (!this.root.querySelector('.screen')) this.root.classList.remove('active');
  }

  hide() {
    this.root.innerHTML = '';
    this.root.classList.remove('active');
  }
}

export { drawIcon };
