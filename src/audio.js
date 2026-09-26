// WebAudio 합성 효과음 + 절차적 칠 BGM
let ctx = null;
let master = null;
let sfxBus = null;
let musicBus = null;
let noiseBuf = null;
let muted = false;
let bgmTimer = null;
let nextBar = 0;
let barIdx = 0;
let bgmOn = false;

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
  master.gain.value = muted ? 0 : 0.9;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -14;
  comp.ratio.value = 4;
  master.connect(comp).connect(ctx.destination);
  sfxBus = ctx.createGain();
  sfxBus.gain.value = 0.8;
  sfxBus.connect(master);
  musicBus = ctx.createGain();
  musicBus.gain.value = 0.32;
  musicBus.connect(master);
  noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 1, ctx.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  if (bgmOn) startBgm();
}

export function setMuted(m) {
  muted = m;
  if (master && ctx) master.gain.setTargetAtTime(m ? 0 : 0.9, ctx.currentTime, 0.05);
}
export const isMuted = () => muted;

export function suspend() {
  if (ctx && ctx.state === 'running') ctx.suspend().catch(() => {});
}
export function resume() {
  if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
}

function ok() {
  return ctx && ctx.state === 'running';
}

function tone({ f = 440, f2 = null, type = 'sine', t = 0, dur = 0.2, vol = 0.3, attack = 0.005, bus = sfxBus, q = null, lp = null }) {
  const now = ctx.currentTime + t;
  const o = ctx.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(f, now);
  if (f2) o.frequency.exponentialRampToValueAtTime(Math.max(20, f2), now + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(vol, now + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  let node = o;
  if (lp) {
    const fl = ctx.createBiquadFilter();
    fl.type = 'lowpass';
    fl.frequency.value = lp;
    if (q) fl.Q.value = q;
    o.connect(fl);
    node = fl;
  }
  node.connect(g).connect(bus);
  o.start(now);
  o.stop(now + dur + 0.05);
}

function noise({ t = 0, dur = 0.2, vol = 0.3, type = 'bandpass', f = 1000, f2 = null, q = 1, bus = sfxBus, attack = 0.003 }) {
  const now = ctx.currentTime + t;
  const s = ctx.createBufferSource();
  s.buffer = noiseBuf;
  const fl = ctx.createBiquadFilter();
  fl.type = type;
  fl.frequency.setValueAtTime(f, now);
  if (f2) fl.frequency.exponentialRampToValueAtTime(f2, now + dur);
  fl.Q.value = q;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(vol, now + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  s.connect(fl).connect(g).connect(bus);
  s.start(now, Math.random() * 0.5);
  s.stop(now + dur + 0.05);
}

export const sfx = {
  shot(p) {
    if (!ok()) return;
    noise({ dur: 0.06, vol: 0.5 + p * 0.3, type: 'highpass', f: 2500, q: 0.7 });
    tone({ f: 1400 + p * 500, f2: 500, type: 'triangle', dur: 0.08, vol: 0.35 });
    tone({ f: 180, f2: 90, dur: 0.12, vol: 0.2 * p + 0.05 });
  },
  wall(speed, wood) {
    if (!ok()) return;
    const v = Math.min(1, speed / 700);
    if (v < 0.04) return;
    tone({ f: wood ? 260 : 520 + v * 200, f2: wood ? 160 : 300, type: wood ? 'triangle' : 'square', dur: 0.07, vol: 0.05 + v * 0.22, lp: 2200 });
    noise({ dur: 0.04, vol: 0.05 + v * 0.18, f: wood ? 900 : 2200, q: 2 });
  },
  bumper() {
    if (!ok()) return;
    tone({ f: 300, f2: 900, type: 'square', dur: 0.12, vol: 0.18, lp: 3000 });
    tone({ f: 600, f2: 1400, type: 'sine', dur: 0.16, vol: 0.2 });
  },
  crate() {
    if (!ok()) return;
    noise({ dur: 0.25, vol: 0.45, type: 'lowpass', f: 1400, f2: 200, q: 1 });
    tone({ f: 140, f2: 60, type: 'triangle', dur: 0.2, vol: 0.3 });
  },
  cup() {
    if (!ok()) return;
    // 딸그락 + 딸랑
    for (let i = 0; i < 4; i++) tone({ f: 900 + i * 120, type: 'triangle', t: i * 0.05, dur: 0.05, vol: 0.15 });
    [1318, 1760, 2637].forEach((f, i) => tone({ f, t: 0.18 + i * 0.07, dur: 0.9, vol: 0.18 }));
  },
  fanfare(level) {
    if (!ok()) return;
    const seqs = {
      0: [523, 659, 784],
      1: [523, 659, 784, 1047],
      2: [523, 659, 784, 1047, 1319, 1568],
    };
    const s = seqs[Math.min(2, level)];
    s.forEach((f, i) => {
      tone({ f, type: 'triangle', t: 0.35 + i * 0.09, dur: 0.35, vol: 0.2 });
      tone({ f: f / 2, type: 'sine', t: 0.35 + i * 0.09, dur: 0.3, vol: 0.1 });
    });
  },
  lip() {
    if (!ok()) return;
    tone({ f: 1500, f2: 1100, type: 'triangle', dur: 0.12, vol: 0.2 });
    tone({ f: 700, f2: 400, type: 'square', dur: 0.08, vol: 0.06, lp: 2000 });
  },
  splash() {
    if (!ok()) return;
    noise({ dur: 0.5, vol: 0.5, type: 'lowpass', f: 3000, f2: 300, q: 0.8 });
    tone({ f: 500, f2: 120, dur: 0.25, vol: 0.25 });
    for (let i = 0; i < 4; i++) tone({ f: 900 + Math.random() * 900, f2: 1600, t: 0.15 + i * 0.06, dur: 0.06, vol: 0.06 });
  },
  coin() {
    if (!ok()) return;
    tone({ f: 988, type: 'square', dur: 0.08, vol: 0.1, lp: 5000 });
    tone({ f: 1319, type: 'square', t: 0.07, dur: 0.22, vol: 0.1, lp: 5000 });
  },
  relic() {
    if (!ok()) return;
    [523, 659, 784, 1047, 1319].forEach((f, i) => tone({ f, type: 'triangle', t: i * 0.06, dur: 0.4, vol: 0.16 }));
    noise({ t: 0.1, dur: 0.6, vol: 0.08, type: 'highpass', f: 6000, q: 0.5 });
  },
  tele() {
    if (!ok()) return;
    tone({ f: 300, f2: 1600, type: 'sine', dur: 0.25, vol: 0.2 });
    tone({ f: 1600, f2: 300, type: 'sine', t: 0.2, dur: 0.25, vol: 0.15 });
  },
  heart() {
    if (!ok()) return;
    tone({ f: 330, f2: 160, type: 'sawtooth', dur: 0.35, vol: 0.15, lp: 1200 });
    tone({ f: 220, f2: 110, type: 'sine', t: 0.12, dur: 0.35, vol: 0.2 });
  },
  heal() {
    if (!ok()) return;
    [660, 880, 1320].forEach((f, i) => tone({ f, type: 'sine', t: i * 0.08, dur: 0.3, vol: 0.15 }));
  },
  click() {
    if (!ok()) return;
    tone({ f: 800, f2: 600, type: 'triangle', dur: 0.05, vol: 0.12 });
  },
  aimTick(p) {
    if (!ok()) return;
    tone({ f: 300 + p * 700, type: 'sine', dur: 0.03, vol: 0.04 });
  },
  gameOver() {
    if (!ok()) return;
    [392, 330, 262, 196].forEach((f, i) => tone({ f, type: 'triangle', t: i * 0.18, dur: 0.4, vol: 0.18 }));
  },
  ghost() {
    if (!ok()) return;
    tone({ f: 600, f2: 200, type: 'sine', dur: 0.3, vol: 0.12 });
  },
};

// ---------- BGM ----------
const BPM = 76;
const BEAT = 60 / BPM;
// Fmaj7 - Em7 - Dm7 - Cmaj7 / Bbmaj7 - Am7 - Gm7 - C7sus
const CHORDS = [
  [53, 57, 60, 64],
  [52, 55, 59, 62],
  [50, 53, 57, 60],
  [48, 52, 55, 59],
  [46, 50, 53, 57],
  [45, 48, 52, 55],
  [43, 46, 50, 53],
  [48, 53, 55, 58],
];
const PENTA = [72, 74, 76, 79, 81, 84];
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

function scheduleBar(t0) {
  const ch = CHORDS[barIdx % CHORDS.length];
  // 패드 (부드러운 로즈 느낌)
  ch.forEach((m, i) => {
    const o = ctx.createOscillator();
    o.type = 'triangle';
    o.frequency.value = mtof(m);
    o.detune.value = (i - 1.5) * 4;
    const g = ctx.createGain();
    const fl = ctx.createBiquadFilter();
    fl.type = 'lowpass';
    fl.frequency.value = 1100;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.07, t0 + 0.08);
    g.gain.exponentialRampToValueAtTime(0.025, t0 + BEAT * 2);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + BEAT * 4 - 0.02);
    o.connect(fl).connect(g).connect(musicBus);
    o.start(t0);
    o.stop(t0 + BEAT * 4);
  });
  // 베이스
  [0, 2.5].forEach((b, i) => {
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = mtof(ch[0] - 12 + (i ? 7 : 0));
    const g = ctx.createGain();
    const t = t0 + b * BEAT;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.22, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + BEAT * 1.4);
    o.connect(g).connect(musicBus);
    o.start(t);
    o.stop(t + BEAT * 1.5);
  });
  // 하이햇 (스윙)
  for (let k = 0; k < 8; k++) {
    const t = t0 + k * BEAT * 0.5 + (k % 2 ? BEAT * 0.08 : 0);
    const s = ctx.createBufferSource();
    s.buffer = noiseBuf;
    const fl = ctx.createBiquadFilter();
    fl.type = 'highpass';
    fl.frequency.value = 7000;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(k % 2 ? 0.05 : 0.025, t + 0.003);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    s.connect(fl).connect(g).connect(musicBus);
    s.start(t, Math.random() * 0.5);
    s.stop(t + 0.07);
  }
  // 킥 (1, 3박)
  [0, 2].forEach((b) => {
    const t = t0 + b * BEAT;
    const o = ctx.createOscillator();
    o.frequency.setValueAtTime(120, t);
    o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.28, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
    o.connect(g).connect(musicBus);
    o.start(t);
    o.stop(t + 0.22);
  });
  // 멜로디 (가끔)
  for (let k = 0; k < 8; k++) {
    if (Math.random() > (barIdx % 4 === 3 ? 0.2 : 0.38)) continue;
    const t = t0 + k * BEAT * 0.5 + (k % 2 ? BEAT * 0.08 : 0);
    const m = PENTA[Math.floor(Math.random() * PENTA.length)] - (barIdx % 2 ? 0 : 12);
    const o = ctx.createOscillator();
    o.type = 'sine';
    o.frequency.value = mtof(m);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.06, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
    o.connect(g).connect(musicBus);
    o.start(t);
    o.stop(t + 0.65);
  }
  barIdx++;
}

export function startBgm() {
  bgmOn = true;
  if (!ctx || bgmTimer) return;
  nextBar = ctx.currentTime + 0.1;
  bgmTimer = setInterval(() => {
    if (!ctx || ctx.state !== 'running') return;
    if (nextBar < ctx.currentTime - 0.2) nextBar = ctx.currentTime + 0.05;
    while (nextBar < ctx.currentTime + 0.5) {
      scheduleBar(nextBar);
      nextBar += BEAT * 4;
    }
    if (nextBar > ctx.currentTime + 8) nextBar = ctx.currentTime + 0.1;
  }, 120);
}

export function stopBgm() {
  bgmOn = false;
  if (bgmTimer) clearInterval(bgmTimer);
  bgmTimer = null;
}
