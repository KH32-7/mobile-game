// WebAudio 합성 효과음 + 절차적 BGM
let ctx = null;
let master;
let sfxBus;
let musicBus;
let noiseBuf;
let muted = false;
let bgmMode = null;
let bgmTimer = null;
let nextNoteT = 0;
let step = 0;
const lastPlay = {};

export function initAudio() {
  if (ctx) {
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return;
  }
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  try {
    ctx = new AC();
  } catch {
    ctx = null;
    return;
  }
  master = ctx.createGain();
  master.gain.value = muted ? 0 : 0.8;
  master.connect(ctx.destination);
  sfxBus = ctx.createGain();
  sfxBus.gain.value = 0.7;
  sfxBus.connect(master);
  musicBus = ctx.createGain();
  musicBus.gain.value = 0.22;
  musicBus.connect(master);
  const len = ctx.sampleRate;
  noiseBuf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  if (bgmMode) startScheduler();
}

export function setMuted(m) {
  muted = m;
  if (master) master.gain.setTargetAtTime(m ? 0 : 0.8, ctx.currentTime, 0.05);
}
export const isMuted = () => muted;

export function suspendAudio(s) {
  if (!ctx) return;
  if (s) ctx.suspend().catch(() => {});
  else ctx.resume().catch(() => {});
}

function tone(freq, dur, { type = 'sine', vol = 0.3, attack = 0.005, slide = 0, delay = 0, bus = sfxBus, filter = 0 } = {}) {
  if (!ctx) return;
  const t = ctx.currentTime + delay;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, freq * slide), t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  let node = o;
  if (filter) {
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = filter;
    o.connect(f);
    node = f;
  }
  node.connect(g);
  g.connect(bus);
  o.start(t);
  o.stop(t + dur + 0.05);
}

function noise(dur, { vol = 0.3, freq = 1000, q = 1, type = 'bandpass', slide = 0, delay = 0, bus = sfxBus } = {}) {
  if (!ctx) return;
  const t = ctx.currentTime + delay;
  const s = ctx.createBufferSource();
  s.buffer = noiseBuf;
  const f = ctx.createBiquadFilter();
  f.type = type;
  f.frequency.setValueAtTime(freq, t);
  if (slide) f.frequency.exponentialRampToValueAtTime(Math.max(30, freq * slide), t + dur);
  f.Q.value = q;
  const g = ctx.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f);
  f.connect(g);
  g.connect(bus);
  s.start(t, Math.random() * 0.5);
  s.stop(t + dur + 0.05);
}

export function sfx(name) {
  if (!ctx || muted) return;
  // 같은 소리 과다 재생 방지
  const now = ctx.currentTime;
  const gap = { sword: 0.06, arrow: 0.07, shot: 0.08, magic: 0.08, cannonShot: 0.1, thud: 0.08, hitArrow: 0.1, boomSmall: 0.08 }[name] || 0.02;
  if (lastPlay[name] && now - lastPlay[name] < gap) return;
  lastPlay[name] = now;
  switch (name) {
    case 'click':
      tone(660, 0.07, { type: 'triangle', vol: 0.2 });
      break;
    case 'pick':
      tone(520, 0.06, { type: 'triangle', vol: 0.15, slide: 1.3 });
      break;
    case 'place':
      tone(300, 0.12, { type: 'square', vol: 0.12, slide: 1.8, filter: 1800 });
      noise(0.12, { vol: 0.25, freq: 600, slide: 0.5 });
      break;
    case 'deny':
      tone(160, 0.18, { type: 'square', vol: 0.12, filter: 900 });
      tone(120, 0.18, { type: 'square', vol: 0.1, filter: 900, delay: 0.08 });
      break;
    case 'sword':
      noise(0.09, { vol: 0.22, freq: 3200, q: 2, slide: 0.4 });
      tone(900 + Math.random() * 300, 0.05, { type: 'triangle', vol: 0.06 });
      break;
    case 'arrow':
      noise(0.12, { vol: 0.12, freq: 5000, q: 4, slide: 0.5 });
      break;
    case 'hitArrow':
      noise(0.35, { vol: 0.3, freq: 4000, q: 1.5, slide: 0.3 });
      break;
    case 'shot':
      noise(0.1, { vol: 0.25, freq: 1800, q: 1, slide: 0.3 });
      tone(200, 0.08, { type: 'square', vol: 0.08, slide: 0.5 });
      break;
    case 'magic':
      tone(700, 0.25, { type: 'sine', vol: 0.12, slide: 2 });
      tone(1050, 0.2, { type: 'triangle', vol: 0.06, slide: 1.5, delay: 0.03 });
      break;
    case 'cannonShot':
      tone(110, 0.2, { type: 'sine', vol: 0.3, slide: 0.5 });
      noise(0.15, { vol: 0.2, freq: 500, type: 'lowpass' });
      break;
    case 'thud':
      tone(90, 0.12, { type: 'sine', vol: 0.25, slide: 0.6 });
      break;
    case 'boomSmall':
      noise(0.35, { vol: 0.35, freq: 900, type: 'lowpass', slide: 0.3 });
      tone(80, 0.25, { vol: 0.3, slide: 0.5 });
      break;
    case 'boom':
      noise(0.7, { vol: 0.55, freq: 1200, type: 'lowpass', slide: 0.15 });
      tone(70, 0.5, { vol: 0.45, slide: 0.4 });
      break;
    case 'collapse':
      noise(1.4, { vol: 0.7, freq: 700, type: 'lowpass', slide: 0.1 });
      tone(55, 1.0, { vol: 0.5, slide: 0.5 });
      noise(0.8, { vol: 0.3, freq: 2500, q: 0.7, delay: 0.15, slide: 0.3 });
      break;
    case 'whoosh':
      noise(0.5, { vol: 0.25, freq: 400, q: 1, slide: 4 });
      break;
    case 'arrows':
      for (let i = 0; i < 5; i++) noise(0.15, { vol: 0.1, freq: 5000, q: 4, slide: 0.5, delay: i * 0.05 });
      break;
    case 'cast':
      tone(400, 0.3, { type: 'triangle', vol: 0.12, slide: 2.5 });
      break;
    case 'zap':
      noise(0.4, { vol: 0.5, freq: 3000, q: 0.5, slide: 0.2 });
      tone(1200, 0.3, { type: 'sawtooth', vol: 0.12, slide: 0.1, filter: 4000 });
      break;
    case 'freeze':
      for (let i = 0; i < 5; i++) tone(1400 + i * 300, 0.25, { type: 'sine', vol: 0.07, delay: i * 0.04 });
      noise(0.4, { vol: 0.15, freq: 6000, q: 3 });
      break;
    case 'blink':
      tone(1200, 0.15, { type: 'sine', vol: 0.12, slide: 0.3 });
      break;
    case 'merge':
      [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.22, { type: 'triangle', vol: 0.16, delay: i * 0.055 }));
      noise(0.3, { vol: 0.12, freq: 7000, q: 2, delay: 0.1 });
      break;
    case 'horn':
      tone(392, 0.35, { type: 'sawtooth', vol: 0.08, filter: 1500 });
      tone(523, 0.5, { type: 'sawtooth', vol: 0.08, filter: 1500, delay: 0.2 });
      break;
    case 'crown':
      [784, 988, 1175, 1568].forEach((f, i) => tone(f, 0.3, { type: 'triangle', vol: 0.14, delay: i * 0.07 }));
      break;
    case 'win':
      [523, 523, 659, 784, 659, 784, 1047].forEach((f, i) => tone(f, i === 6 ? 0.9 : 0.2, { type: 'square', vol: 0.09, filter: 3000, delay: i * 0.13 }));
      [262, 330, 392].forEach((f) => tone(f, 1.4, { type: 'triangle', vol: 0.1, delay: 0.8 }));
      break;
    case 'lose':
      [392, 370, 349, 262].forEach((f, i) => tone(f, i === 3 ? 1.0 : 0.35, { type: 'sawtooth', vol: 0.08, filter: 1200, delay: i * 0.3 }));
      break;
    case 'draw':
      [440, 392, 440].forEach((f, i) => tone(f, 0.3, { type: 'triangle', vol: 0.12, delay: i * 0.2 }));
      break;
    case 'coin':
      tone(988, 0.08, { type: 'square', vol: 0.08 });
      tone(1319, 0.2, { type: 'square', vol: 0.08, delay: 0.07 });
      break;
    case 'heal':
      [440, 554, 659].forEach((f, i) => tone(f, 0.3, { type: 'sine', vol: 0.12, delay: i * 0.08 }));
      break;
    default:
      break;
  }
}

// ---------- BGM ----------
const SCALE = [0, 2, 4, 7, 9, 12, 14, 16];
const PROG = [
  [0, 4, 7],
  [-3, 0, 4],
  [-7, -3, 0],
  [-5, -1, 2],
];
const BASE = { menu: 57, battle: 55, fast: 55 };

export function playBgm(mode) {
  if (bgmMode === mode) return;
  bgmMode = mode;
  step = 0;
  if (ctx) startScheduler();
}

function startScheduler() {
  if (bgmTimer) clearInterval(bgmTimer);
  if (!bgmMode) return;
  nextNoteT = ctx.currentTime + 0.1;
  bgmTimer = setInterval(schedule, 60);
}

export function stopBgm() {
  bgmMode = null;
  if (bgmTimer) clearInterval(bgmTimer);
  bgmTimer = null;
}

const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

function note(m, t, dur, type, vol, filter) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.value = mtof(m);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  if (filter) {
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = filter;
    o.connect(f);
    f.connect(g);
  } else o.connect(g);
  g.connect(musicBus);
  o.start(t);
  o.stop(t + dur + 0.05);
}

function hat(t, vol) {
  const s = ctx.createBufferSource();
  s.buffer = noiseBuf;
  const f = ctx.createBiquadFilter();
  f.type = 'highpass';
  f.frequency.value = 7000;
  const g = ctx.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
  s.connect(f);
  f.connect(g);
  g.connect(musicBus);
  s.start(t, Math.random());
  s.stop(t + 0.08);
}

function kick(t) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.frequency.setValueAtTime(140, t);
  o.frequency.exponentialRampToValueAtTime(45, t + 0.15);
  g.gain.setValueAtTime(0.5, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
  o.connect(g);
  g.connect(musicBus);
  o.start(t);
  o.stop(t + 0.25);
}

// 결정적 멜로디 (단계별 반복)
function melodyNote(bar, s) {
  const h = Math.sin(bar * 12.9898 + s * 78.233) * 43758.5453;
  const r = h - Math.floor(h);
  return r;
}

function schedule() {
  if (!ctx || !bgmMode) return;
  const bpm = bgmMode === 'menu' ? 92 : bgmMode === 'fast' ? 132 : 116;
  const sp = 60 / bpm / 2; // 8분음표
  while (nextNoteT < ctx.currentTime + 0.25) {
    const t = nextNoteT;
    const bar = Math.floor(step / 8) % 8;
    const s = step % 8;
    const chord = PROG[Math.floor(bar / 2) % 4];
    const root = BASE[bgmMode];
    if (!muted) {
      if (s === 0 || s === 4) note(root - 12 + chord[0], t, sp * 3.5, 'triangle', 0.35, 800);
      if (s === 2 || s === 6) note(root - 12 + chord[0] + 7, t, sp * 1.5, 'triangle', 0.22, 800);
      if (s % 2 === 1) note(root + chord[(s >> 1) % 3], t, sp * 0.9, 'sine', 0.08);
      if (bgmMode !== 'menu') {
        if (s === 0 || s === 4 || (bgmMode === 'fast' && s === 6)) kick(t);
        if (s % 2 === 1) hat(t, 0.06);
      }
      const r = melodyNote(bar, s);
      if (r > (bgmMode === 'menu' ? 0.55 : 0.4)) {
        const deg = SCALE[Math.floor(r * 100) % SCALE.length];
        note(root + 12 + chord[0] % 12 + deg - (deg > 9 ? 12 : 0), t, sp * 1.6, 'square', 0.045, 2200);
      }
    }
    step++;
    nextNoteT += sp;
  }
}
