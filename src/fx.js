// 파티클 + 텍스트 팝업 (월드 좌표)
export class FX {
  constructor() {
    this.parts = [];
    this.pops = [];
    this.rings = [];
  }
  clear() {
    this.parts.length = 0;
    this.pops.length = 0;
    this.rings.length = 0;
  }
  add(p) {
    if (this.parts.length > 500) this.parts.shift();
    this.parts.push({ vx: 0, vy: 0, g: 0, drag: 2, size: 3, rot: 0, vr: 0, type: 'dot', life: 0.6, t: 0, ...p });
  }
  sparks(x, y, nx, ny, n, color = '#fff8d0') {
    for (let i = 0; i < n; i++) {
      const a = Math.atan2(ny, nx) + (Math.random() - 0.5) * 1.8;
      const s = 80 + Math.random() * 200;
      this.add({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0.2 + Math.random() * 0.2, color, type: 'spark', size: 2, drag: 5 });
    }
  }
  splash(x, y) {
    for (let i = 0; i < 26; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 40 + Math.random() * 160;
      this.add({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 60, g: 260, life: 0.5 + Math.random() * 0.4, color: i % 3 ? '#bfe9ff' : '#ffffff', size: 2 + Math.random() * 3, drag: 1.5 });
    }
    this.ring(x, y, '#e1f5fe', 34, 0.6);
    this.ring(x, y, '#ffffff', 20, 0.45);
  }
  ring(x, y, color, r, life = 0.4, w = 3) {
    this.rings.push({ x, y, color, r, life, t: 0, w });
  }
  debris(x, y, color = '#b07a3c', n = 14) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 60 + Math.random() * 180;
      this.add({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0.5 + Math.random() * 0.4, color: i % 2 ? color : '#8d5524', type: 'rect', size: 3 + Math.random() * 4, vr: (Math.random() - 0.5) * 20, drag: 4 });
    }
  }
  confetti(x, y, n = 60) {
    const cols = ['#ff5252', '#ffd740', '#69f0ae', '#40c4ff', '#e040fb', '#ffffff', '#ff9100'];
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 100 + Math.random() * 320;
      this.add({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 120, g: 240, life: 1.1 + Math.random() * 0.9, color: cols[i % cols.length], type: 'rect', size: 3 + Math.random() * 4, vr: (Math.random() - 0.5) * 16, drag: 2.2 });
    }
  }
  firework(x, y) {
    const cols = ['#ff5252', '#ffd740', '#69f0ae', '#40c4ff', '#e040fb'];
    const c = cols[Math.floor(Math.random() * cols.length)];
    for (let i = 0; i < 36; i++) {
      const a = (i / 36) * Math.PI * 2;
      const s = 140 + Math.random() * 40;
      this.add({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, g: 60, life: 0.9, color: c, type: 'spark', size: 2.2, drag: 2.5 });
    }
    this.ring(x, y, c, 50, 0.5, 2);
  }
  sparkle(x, y, color = '#fff59d', n = 10) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 30 + Math.random() * 90;
      this.add({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0.5 + Math.random() * 0.3, color, type: 'star', size: 3 + Math.random() * 2, drag: 3 });
    }
  }
  pop(text, x, y, opts = {}) {
    this.pops.push({ text, x, y, t: 0, life: opts.life || 1.0, size: opts.size || 16, color: opts.color || '#fff', vy: opts.vy ?? -40 });
  }
  update(dt) {
    for (const p of this.parts) {
      p.t += dt;
      p.vy += p.g * dt;
      const k = Math.max(0, 1 - p.drag * dt);
      p.vx *= k;
      p.vy *= k;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rot += p.vr * dt;
    }
    this.parts = this.parts.filter((p) => p.t < p.life);
    for (const p of this.pops) {
      p.t += dt;
      p.y += p.vy * dt;
    }
    this.pops = this.pops.filter((p) => p.t < p.life);
    for (const r of this.rings) r.t += dt;
    this.rings = this.rings.filter((r) => r.t < r.life);
  }
  draw(ctx) {
    for (const r of this.rings) {
      const u = r.t / r.life;
      ctx.globalAlpha = 1 - u;
      ctx.strokeStyle = r.color;
      ctx.lineWidth = r.w * (1 - u) + 0.5;
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.r * (0.3 + u * 0.9), 0, Math.PI * 2);
      ctx.stroke();
    }
    for (const p of this.parts) {
      const u = p.t / p.life;
      ctx.globalAlpha = Math.min(1, (1 - u) * 1.5);
      ctx.fillStyle = p.color;
      ctx.strokeStyle = p.color;
      if (p.type === 'spark') {
        ctx.lineWidth = p.size;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 0.04, p.y - p.vy * 0.04);
        ctx.stroke();
      } else if (p.type === 'rect') {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      } else if (p.type === 'star') {
        const s = p.size * (1 - u * 0.5);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y - s);
        ctx.lineTo(p.x + s * 0.3, p.y - s * 0.3);
        ctx.lineTo(p.x + s, p.y);
        ctx.lineTo(p.x + s * 0.3, p.y + s * 0.3);
        ctx.lineTo(p.x, p.y + s);
        ctx.lineTo(p.x - s * 0.3, p.y + s * 0.3);
        ctx.lineTo(p.x - s, p.y);
        ctx.lineTo(p.x - s * 0.3, p.y - s * 0.3);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - u * 0.5), 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const p of this.pops) {
      const u = p.t / p.life;
      const sc = u < 0.15 ? 0.6 + (u / 0.15) * 0.5 : 1.1 - Math.min(0.1, (u - 0.15) * 0.5);
      ctx.globalAlpha = u > 0.7 ? (1 - u) / 0.3 : 1;
      ctx.font = `900 ${Math.round(p.size * sc)}px system-ui,-apple-system,"Apple SD Gothic Neo","Noto Sans KR",sans-serif`;
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'rgba(0,0,0,0.55)';
      ctx.strokeText(p.text, p.x, p.y);
      ctx.fillStyle = p.color;
      ctx.fillText(p.text, p.x, p.y);
    }
    ctx.globalAlpha = 1;
  }
}
