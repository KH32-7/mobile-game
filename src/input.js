// 플로팅 가상 조이스틱 (Pointer Events) + 키보드
export class Input {
  constructor(area, joyEl) {
    this.area = area;
    this.joy = joyEl;
    this.knob = joyEl.querySelector('.knob');
    this.enabled = false;
    this.id = null;
    this.ox = 0;
    this.oy = 0;
    this.x = 0;
    this.y = 0;
    this.R = 56;
    this.keys = new Set();
    this.onFirst = null;
    this.touchedAt = 0;

    area.addEventListener('pointerdown', (e) => this.down(e));
    window.addEventListener('pointermove', (e) => this.move(e));
    window.addEventListener('pointerup', (e) => this.up(e));
    window.addEventListener('pointercancel', (e) => this.up(e));
    window.addEventListener('keydown', (e) => {
      this.keys.add(e.key.toLowerCase());
    });
    window.addEventListener('keyup', (e) => this.keys.delete(e.key.toLowerCase()));
    window.addEventListener('blur', () => {
      this.keys.clear();
      this.release();
    });
  }

  local(e) {
    const r = this.area.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  }

  down(e) {
    this.onFirst && this.onFirst();
    if (!this.enabled || this.id !== null) return;
    if (e.target.closest('button, .card, .btn')) return;
    this.id = e.pointerId;
    const [x, y] = this.local(e);
    this.ox = x;
    this.oy = y;
    this.x = 0;
    this.y = 0;
    this.joy.style.display = 'block';
    this.joy.style.transform = `translate(${x}px, ${y}px)`;
    this.knob.style.transform = 'translate(-50%, -50%)';
    this.touchedAt = performance.now();
    try {
      this.area.setPointerCapture(e.pointerId);
    } catch (err) {
      /* 무시 */
    }
    e.preventDefault();
  }

  move(e) {
    if (e.pointerId !== this.id) return;
    const [x, y] = this.local(e);
    let dx = x - this.ox;
    let dy = y - this.oy;
    const d = Math.hypot(dx, dy);
    // 너무 멀리 끌면 조이스틱 중심이 따라옴
    if (d > this.R * 1.6) {
      const k = (d - this.R * 1.6) / d;
      this.ox += dx * k;
      this.oy += dy * k;
      dx = x - this.ox;
      dy = y - this.oy;
      this.joy.style.transform = `translate(${this.ox}px, ${this.oy}px)`;
    }
    const dd = Math.hypot(dx, dy);
    const m = Math.min(1, dd / this.R);
    this.x = dd > 0 ? (dx / dd) * m : 0;
    this.y = dd > 0 ? (dy / dd) * m : 0;
    const kx = this.x * this.R;
    const ky = this.y * this.R;
    this.knob.style.transform = `translate(calc(-50% + ${kx}px), calc(-50% + ${ky}px))`;
  }

  up(e) {
    if (e.pointerId !== this.id) return;
    this.release();
  }

  release() {
    this.id = null;
    this.x = 0;
    this.y = 0;
    this.joy.style.display = 'none';
  }

  get active() {
    return this.id !== null || this.keyVec()[2];
  }

  keyVec() {
    const k = this.keys;
    let x = 0;
    let y = 0;
    if (k.has('a') || k.has('arrowleft')) x -= 1;
    if (k.has('d') || k.has('arrowright')) x += 1;
    if (k.has('w') || k.has('arrowup')) y -= 1;
    if (k.has('s') || k.has('arrowdown')) y += 1;
    const d = Math.hypot(x, y);
    return d ? [x / d, y / d, true] : [0, 0, false];
  }

  vec() {
    if (this.id !== null) return [this.x, this.y];
    const [x, y] = this.keyVec();
    return [x, y];
  }
}
