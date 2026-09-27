// 플로팅 조이스틱: 화면 아무 곳이나 드래그
export const input = {
  active: false,
  id: null,
  ox: 0,
  oy: 0,
  x: 0,
  y: 0,
  dx: 0,
  dy: 0,
  mag: 0,
  enabled: true,
  keys: new Set(),
  onFirst: null,
  touched: false,
};

const R = 56;
let el = null;
let knob = null;

export function initInput(target) {
  el = document.createElement('div');
  el.className = 'joy';
  el.innerHTML = '<div class="joy-knob"></div>';
  document.getElementById('app').appendChild(el);
  knob = el.firstChild;

  target.addEventListener('pointerdown', (e) => {
    if (!input.enabled) return;
    if (input.id !== null) return;
    input.id = e.pointerId;
    const r = target.getBoundingClientRect();
    input.ox = e.clientX - r.left;
    input.oy = e.clientY - r.top;
    input.x = input.ox;
    input.y = input.oy;
    input.active = true;
    input.dx = input.dy = input.mag = 0;
    try {
      target.setPointerCapture(e.pointerId);
    } catch {
      /* 무시 */
    }
    el.style.transform = `translate(${input.ox - R}px, ${input.oy - R}px)`;
    el.classList.add('on');
    knob.style.transform = 'translate(0px, 0px)';
    if (!input.touched) {
      input.touched = true;
      input.onFirst && input.onFirst();
    }
    e.preventDefault();
  });
  const move = (e) => {
    if (e.pointerId !== input.id) return;
    const r = target.getBoundingClientRect();
    input.x = e.clientX - r.left;
    input.y = e.clientY - r.top;
    let dx = input.x - input.ox;
    let dy = input.y - input.oy;
    const d = Math.hypot(dx, dy);
    // 멀리 끌면 조이스틱 중심이 따라옴
    if (d > R * 1.4) {
      const k = (d - R * 1.4) / d;
      input.ox += dx * k;
      input.oy += dy * k;
      dx = input.x - input.ox;
      dy = input.y - input.oy;
      el.style.transform = `translate(${input.ox - R}px, ${input.oy - R}px)`;
    }
    const dd = Math.hypot(dx, dy);
    const m = Math.min(1, dd / R);
    input.mag = dd < 6 ? 0 : Math.min(1, 0.35 + m * 0.75);
    input.dx = dd > 0 ? dx / dd : 0;
    input.dy = dd > 0 ? dy / dd : 0;
    const kx = input.dx * Math.min(dd, R);
    const ky = input.dy * Math.min(dd, R);
    knob.style.transform = `translate(${kx}px, ${ky}px)`;
  };
  target.addEventListener('pointermove', move);
  const up = (e) => {
    if (e.pointerId !== input.id) return;
    input.id = null;
    input.active = false;
    input.mag = 0;
    el.classList.remove('on');
  };
  target.addEventListener('pointerup', up);
  target.addEventListener('pointercancel', up);
  target.addEventListener('lostpointercapture', up);

  // 데스크톱 키보드 보조
  window.addEventListener('keydown', (e) => input.keys.add(e.key.toLowerCase()));
  window.addEventListener('keyup', (e) => input.keys.delete(e.key.toLowerCase()));
  window.addEventListener('blur', () => {
    input.keys.clear();
    reset();
  });
}

export function reset() {
  input.id = null;
  input.active = false;
  input.mag = 0;
  el && el.classList.remove('on');
}

export function readMove() {
  if (input.locked) return { dx: 0, dy: 0 };
  let dx = input.active ? input.dx * input.mag : 0;
  let dy = input.active ? input.dy * input.mag : 0;
  const k = input.keys;
  if (k.size) {
    let kx = 0;
    let ky = 0;
    if (k.has('arrowleft') || k.has('a')) kx -= 1;
    if (k.has('arrowright') || k.has('d')) kx += 1;
    if (k.has('arrowup') || k.has('w')) ky -= 1;
    if (k.has('arrowdown') || k.has('s')) ky += 1;
    if (kx || ky) {
      const l = Math.hypot(kx, ky);
      dx = kx / l;
      dy = ky / l;
    }
  }
  return { dx, dy };
}
