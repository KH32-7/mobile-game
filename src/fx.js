// 파티클(인스턴싱) + DOM 월드 팝업/말풍선
import { THREE, col, project, gfx } from './gfx.js';

const parts = [];
const MAX = 400;

export function spawnParticle(p) {
  if (parts.length >= MAX) parts.shift();
  parts.push({ grav: -9, drag: 0.98, spin: 0, rot: Math.random() * 6, ...p, life: p.life || 1, t: 0 });
}

export function burst(x, y, z, n, opts = {}) {
  const colors = opts.colors || ['#ffd23f', '#ff5a7a', '#4fb0ff', '#6ee07a', '#ffffff', '#ff9a3c'];
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2;
    const sp = (opts.speed || 4) * (0.5 + Math.random() * 0.7);
    spawnParticle({
      type: opts.type || 'spark',
      x,
      y,
      z,
      vx: Math.cos(a) * sp * (opts.spread ?? 0.6),
      vy: (opts.up ?? 5) * (0.6 + Math.random() * 0.6),
      vz: Math.sin(a) * sp * (opts.spread ?? 0.6),
      life: (opts.life || 1.1) * (0.7 + Math.random() * 0.6),
      size: (opts.size || 0.12) * (0.7 + Math.random() * 0.6),
      color: col(colors[Math.floor(Math.random() * colors.length)]),
      grav: opts.grav ?? -9,
      spin: (Math.random() - 0.5) * 14,
    });
  }
}

export function ring(x, z, n = 14, color = '#ffffff', r = 0.4, speed = 3) {
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    spawnParticle({
      type: 'puff',
      x: x + Math.cos(a) * r,
      y: 0.15,
      z: z + Math.sin(a) * r,
      vx: Math.cos(a) * speed,
      vy: 0.4,
      vz: Math.sin(a) * speed,
      life: 0.55,
      size: 0.28,
      color: col(color),
      grav: 0,
      drag: 0.9,
    });
  }
}

export function puff(x, y, z, color = '#ffffff', size = 0.25, n = 3, up = 1.2) {
  for (let i = 0; i < n; i++) {
    spawnParticle({
      type: 'puff',
      x: x + (Math.random() - 0.5) * 0.2,
      y,
      z: z + (Math.random() - 0.5) * 0.2,
      vx: (Math.random() - 0.5) * 0.4,
      vy: up * (0.6 + Math.random() * 0.6),
      vz: (Math.random() - 0.5) * 0.4,
      life: 0.9,
      size,
      color: col(color),
      grav: 0,
      drag: 0.96,
    });
  }
}

export function updateParticles(dt, inst) {
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i];
    p.t += dt;
    if (p.t >= p.life) {
      parts.splice(i, 1);
      continue;
    }
    p.vy += p.grav * dt;
    const dr = Math.pow(p.drag, dt * 60);
    p.vx *= dr;
    p.vz *= dr;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.z += p.vz * dt;
    if (p.y < 0.03 && p.type === 'spark') {
      p.y = 0.03;
      p.vy *= -0.3;
      p.vx *= 0.6;
      p.vz *= 0.6;
    }
    p.rot += p.spin * dt;
    const k = p.t / p.life;
    let s = p.size;
    if (p.type === 'puff') s = p.size * (0.6 + k * 0.9) * (1 - k * k);
    else s = p.size * (k > 0.7 ? (1 - k) / 0.3 : 1);
    inst.put(p.type, p.x, p.y, p.z, p.rot, s, p.color, p.rot * 0.7, 0);
  }
}

export function clearParticles() {
  parts.length = 0;
}

// ---------- DOM 팝업 ----------
const layer = () => document.getElementById('world-ui');
const pops = [];
const tmp = { x: 0, y: 0, vis: false };

export function popText(x, y, z, text, cls = '', dur = 1.1) {
  const el = document.createElement('div');
  el.className = 'pop ' + cls;
  el.innerHTML = text;
  layer().appendChild(el);
  pops.push({ el, x, y, z, t: 0, dur });
  if (pops.length > 40) {
    const o = pops.shift();
    o.el.remove();
  }
}

export function updatePops(dt) {
  for (let i = pops.length - 1; i >= 0; i--) {
    const p = pops[i];
    p.t += dt;
    if (p.t >= p.dur) {
      p.el.remove();
      pops.splice(i, 1);
      continue;
    }
    project(p.x, p.y + p.t * 1.1, p.z, tmp);
    const k = p.t / p.dur;
    const sc = k < 0.15 ? 0.5 + (k / 0.15) * 0.7 : k < 0.3 ? 1.2 - ((k - 0.15) / 0.15) * 0.2 : 1;
    p.el.style.transform = `translate(${tmp.x}px, ${tmp.y}px) translate(-50%, -50%) scale(${sc})`;
    const dim = tmp.y < (window.__hudBottom || 0) ? 0.3 : 1;
    p.el.style.opacity = String((k > 0.75 ? (1 - k) / 0.25 : 1) * dim);
  }
}

export function clearPops() {
  pops.forEach((p) => p.el.remove());
  pops.length = 0;
}

export { THREE, gfx };
