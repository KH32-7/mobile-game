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
