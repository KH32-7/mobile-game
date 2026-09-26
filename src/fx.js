// 파티클, 숫자 팝업, 화면 흔들림, 히트스톱
export class FX {
  constructor() {
    this.parts = [];
    this.pops = [];
    this.rings = [];
    this.shakeT = 0; this.shakeMag = 0;
    this.stop = 0; // 히트스톱 남은 시간
    this.flash = 0;
  }
  shake(mag, dur = 0.3) { this.shakeMag = Math.max(this.shakeMag * (this.shakeT > 0 ? 1 : 0), mag); this.shakeT = Math.max(this.shakeT, dur); }
  hitstop(t) { this.stop = Math.max(this.stop, t); }
  burst(x, y, color, n = 8, speed = 220, size = 7) {
    for (let i = 0; i < n; i++) {
      if (this.parts.length > 500) this.parts.shift();
      const a = Math.random() * Math.PI * 2;
      const v = speed * (0.4 + Math.random() * 0.8);
      this.parts.push({
        x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - speed * 0.5,
        life: 0.6 + Math.random() * 0.5, t: 0, size: size * (0.5 + Math.random() * 0.7),
        rot: Math.random() * 6, vr: (Math.random() - 0.5) * 14, color, kind: Math.random() < 0.25 ? 'spark' : 'shard',
      });
    }
  }
  ring(x, y, color, r = 60) { this.rings.push({ x, y, color, r, t: 0, life: 0.45 }); }
  pop(x, y, text, color = '#fff', size = 22, life = 0.9, vy = -60) {
    this.pops.push({ x, y, text, color, size, t: 0, life, vy });
  }
  update(dt) {
    if (this.shakeT > 0) { this.shakeT -= dt; if (this.shakeT <= 0) this.shakeMag = 0; }
    if (this.flash > 0) this.flash = Math.max(0, this.flash - dt * 3);
    for (const p of this.parts) {
      p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 900 * dt; p.vx *= 0.985; p.rot += p.vr * dt;
    }
    this.parts = this.parts.filter((p) => p.t < p.life);
    for (const p of this.pops) { p.t += dt; p.y += p.vy * dt; p.vy *= 0.94; }
    this.pops = this.pops.filter((p) => p.t < p.life);
    for (const r of this.rings) r.t += dt;
    this.rings = this.rings.filter((r) => r.t < r.life);
  }
  offset() {
    if (this.shakeT <= 0) return [0, 0];
    const m = this.shakeMag * Math.min(1, this.shakeT / 0.15);
    return [(Math.random() * 2 - 1) * m, (Math.random() * 2 - 1) * m];
  }
  clear() { this.parts = []; this.pops = []; this.rings = []; }
}
