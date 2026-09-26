// WebAudio 합성 효과음 + 절차적 BGM
let ctx = null;
let master = null;
let sfxBus = null;
let musicBus = null;
let noiseBuf = null;
let muted = false;
let musicOn = false;
let nextNoteTime = 0;
let step = 0;
let schedTimer = null;
let intensity = 0;
let lastPop = 0;
let popChain = 0;

export function initAudio(isMuted) {
  muted = !!isMuted;
}

function ensure() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  try {
    ctx = new AC();
  } catch (e) { return null; }
  master = ctx.createGain();
  master.gain.value = muted ? 0 : 0.8;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -14;
  comp.ratio.value = 4;
  master.connect(comp);
  comp.connect(ctx.destination);
  sfxBus = ctx.createGain();
  sfxBus.gain.value = 0.9;
  sfxBus.connect(master);
  musicBus = ctx.createGain();
  musicBus.gain.value = 0.32;
  musicBus.connect(master);
  noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 1, ctx.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return ctx;
}

export function unlockAudio() {
  const c = ensure();
  if (c && c.state === 'suspended') c.resume().catch(() => {});
}

export function setMuted(m) {
  muted = m;
  if (master) master.gain.setTargetAtTime(m ? 0 : 0.8, ctx.currentTime, 0.02);
}
export const isMuted = () => muted;

export function suspendAudio() { if (ctx && ctx.state === 'running') ctx.suspend().catch(() => {}); }
export function resumeAudio() { if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {}); }

function tone(freq, dur, { type = 'sine', vol = 0.3, attack = 0.005, slide = 0, delay = 0, bus = null } = {}) {
  if (!ctx || muted) return;
  const t = ctx.currentTime + delay;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(30, freq * slide), t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g);
  g.connect(bus || sfxBus);
  o.start(t);
  o.stop(t + dur + 0.02);
}

function noise(dur, { vol = 0.3, freq = 1200, q = 1, type = 'lowpass', sweep = 0, delay = 0, bus = null } = {}) {
  if (!ctx || muted) return;
  const t = ctx.currentTime + delay;
  const s = ctx.createBufferSource();
  s.buffer = noiseBuf;
  const f = ctx.createBiquadFilter();
  f.type = type;
  f.frequency.setValueAtTime(freq, t);
  if (sweep) f.frequency.exponentialRampToValueAtTime(Math.max(40, freq * sweep), t + dur);
  f.Q.value = q;
  const g = ctx.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f); f.connect(g); g.connect(bus || sfxBus);
  s.start(t, Math.random() * 0.5);
  s.stop(t + dur + 0.02);
}

export const sfx = {
  gateGood(mult) {
    const base = mult ? 523 : 440;
    [0, 4, 7, 12].forEach((s, i) => tone(base * Math.pow(2, s / 12), 0.16, { type: 'triangle', vol: 0.22, delay: i * 0.055 }));
    tone(base * 2, 0.3, { type: 'sine', vol: 0.12, delay: 0.22, slide: 1.5 });
  },
  gateBad() {
    [12, 8, 5, 0].forEach((s, i) => tone(330 * Math.pow(2, s / 12), 0.18, { type: 'sawtooth', vol: 0.1, delay: i * 0.06 }));
    tone(160, 0.4, { type: 'square', vol: 0.08, slide: 0.5, delay: 0.1 });
  },
  pop() {
    if (!ctx) return;
    const now = ctx.currentTime;
    if (now - lastPop < 0.03) return;
    popChain = now - lastPop < 0.25 ? Math.min(popChain + 1, 24) : 0;
    lastPop = now;
    tone(520 + popChain * 28 + Math.random() * 60, 0.07, { type: 'sine', vol: 0.18, slide: 1.8 });
  },
  hit() {
    noise(0.16, { vol: 0.35, freq: 900, sweep: 0.3 });
    tone(140, 0.14, { type: 'square', vol: 0.12, slide: 0.5 });
  },
  clash() {
    if (!ctx) return;
    const now = ctx.currentTime;
    if (now - lastPop < 0.035) return;
    popChain = now - lastPop < 0.25 ? Math.min(popChain + 1, 30) : 0;
    lastPop = now;
    tone(300 + popChain * 22 + Math.random() * 40, 0.06, { type: 'square', vol: 0.08, slide: 2.2 });
    noise(0.05, { vol: 0.12, freq: 3000, type: 'bandpass', q: 2 });
  },
  coin() {
    tone(1318, 0.07, { type: 'square', vol: 0.06 });
    tone(1760, 0.16, { type: 'square', vol: 0.06, delay: 0.06 });
  },
  jump() { tone(300, 0.2, { type: 'triangle', vol: 0.14, slide: 2.4 }); },
  slide() { noise(0.25, { vol: 0.16, freq: 2400, type: 'bandpass', q: 0.8, sweep: 0.4 }); },
  lane() { noise(0.09, { vol: 0.08, freq: 1800, type: 'bandpass', q: 1.2, sweep: 1.6 }); },
  powerup() {
    [0, 7, 12, 16, 19].forEach((s, i) => tone(660 * Math.pow(2, s / 12), 0.12, { type: 'triangle', vol: 0.14, delay: i * 0.045 }));
  },
  shieldBreak() {
    noise(0.35, { vol: 0.3, freq: 4000, type: 'highpass', sweep: 0.3 });
    tone(900, 0.3, { type: 'triangle', vol: 0.15, slide: 0.4 });
  },
  gateHit() {
    noise(0.08, { vol: 0.14, freq: 700, sweep: 0.5 });
  },
  collapse() {
    noise(1.4, { vol: 0.55, freq: 1600, sweep: 0.08 });
    tone(90, 1.0, { type: 'sine', vol: 0.4, slide: 0.4 });
    noise(0.8, { vol: 0.25, freq: 300, delay: 0.3 });
    [0, 4, 7, 12, 16].forEach((s, i) => tone(523 * Math.pow(2, s / 12), 0.2, { type: 'triangle', vol: 0.12, delay: 0.5 + i * 0.08 }));
  },
  gameOver() {
    [7, 3, 0, -5].forEach((s, i) => tone(392 * Math.pow(2, s / 12), 0.3, { type: 'triangle', vol: 0.18, delay: i * 0.16 }));
  },
  click() { tone(880, 0.05, { type: 'sine', vol: 0.12 }); },
  alarm() { [0, 0.18].forEach((d) => tone(740, 0.14, { type: 'square', vol: 0.07, delay: d })); },
};

// ---------- BGM (128 BPM 업템포 루프) ----------
const BPM = 128;
const PROG = [
  [45, 52, 57, 60, 64], // Am
  [41, 48, 53, 57, 60], // F
  [48, 55, 60, 64, 67], // C
  [43, 50, 55, 59, 62], // G
];
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

function scheduleNote(t, s) {
  const bar = Math.floor(s / 16) % 4;
  const i = s % 16;
  const chord = PROG[bar];
  const b = musicBus;
  // 킥
  if (i % 4 === 0) {
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
    g.gain.setValueAtTime(0.9, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
    o.connect(g); g.connect(b); o.start(t); o.stop(t + 0.2);
  }
  // 햇
  if (i % 2 === 1 || intensity > 1) {
    const s2 = ctx.createBufferSource(); s2.buffer = noiseBuf;
    const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 7000;
    const g = ctx.createGain(); g.gain.setValueAtTime(i % 2 === 1 ? 0.18 : 0.07, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    s2.connect(f); f.connect(g); g.connect(b); s2.start(t, Math.random() * 0.5); s2.stop(t + 0.06);
  }
  // 스네어
  if (i === 4 || i === 12) {
    const s3 = ctx.createBufferSource(); s3.buffer = noiseBuf;
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 1800; f.Q.value = 0.7;
    const g = ctx.createGain(); g.gain.setValueAtTime(0.35, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
    s3.connect(f); f.connect(g); g.connect(b); s3.start(t, Math.random() * 0.5); s3.stop(t + 0.15);
  }
  // 베이스 (옥타브 펌핑)
  if (i % 2 === 0) {
    const n = chord[0] - 12 + (i % 4 === 2 ? 12 : 0);
    const o = ctx.createOscillator(); const g = ctx.createGain(); const f = ctx.createBiquadFilter();
    o.type = 'sawtooth'; o.frequency.value = mtof(n);
    f.type = 'lowpass'; f.frequency.setValueAtTime(900, t); f.frequency.exponentialRampToValueAtTime(200, t + 0.14);
    g.gain.setValueAtTime(0.28, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
    o.connect(f); f.connect(g); g.connect(b); o.start(t); o.stop(t + 0.18);
  }
  // 아르페지오
  if (intensity > 0 || i % 4 === 0) {
    const pat = [1, 2, 3, 4, 3, 2, 4, 3];
    const n = chord[pat[i % 8]] + 12;
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = 'square'; o.frequency.value = mtof(n);
    g.gain.setValueAtTime(0.05, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    o.connect(g); g.connect(b); o.start(t); o.stop(t + 0.12);
  }
}

function scheduler() {
  if (!ctx || !musicOn) return;
  const spb = 60 / BPM / 4;
  while (nextNoteTime < ctx.currentTime + 0.12) {
    if (!muted) scheduleNote(nextNoteTime, step);
    nextNoteTime += spb;
    step++;
  }
}

export function startMusic() {
  const c = ensure();
  if (!c) return;
  if (musicOn) return;
  musicOn = true;
  step = 0;
  nextNoteTime = c.currentTime + 0.08;
  schedTimer = setInterval(scheduler, 30);
}

export function stopMusic() {
  musicOn = false;
  if (schedTimer) clearInterval(schedTimer);
  schedTimer = null;
}

export function setIntensity(v) { intensity = v; }
