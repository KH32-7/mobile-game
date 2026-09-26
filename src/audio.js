// WebAudio 합성 효과음 + 절차적 BGM
let ctx = null;
let master = null;
let sfx = null;
let music = null;
let noiseBuf = null;
let muted = false;
let lastPop = 0;

function now() {
  return ctx.currentTime;
}

function env(g, t, a, peak, d) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
}

function tone(type, f0, f1, dur, vol, dest = sfx, when = 0) {
  if (!ctx) return;
  const t = now() + when;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f0, t);
  if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
  env(g, t, 0.005, vol, dur);
  o.connect(g).connect(dest);
  o.start(t);
  o.stop(t + dur + 0.05);
}

function noise(dur, vol, freq = 1200, q = 1, type = 'lowpass', dest = sfx, sweepTo = null, when = 0) {
  if (!ctx) return;
  const t = now() + when;
  const s = ctx.createBufferSource();
  s.buffer = noiseBuf;
  const f = ctx.createBiquadFilter();
  f.type = type;
  f.frequency.setValueAtTime(freq, t);
  if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, t + dur);
  f.Q.value = q;
  const g = ctx.createGain();
  env(g, t, 0.005, vol, dur);
  s.connect(f).connect(g).connect(dest);
  s.start(t, Math.random() * 0.5);
  s.stop(t + dur + 0.05);
}

// ---------- BGM ----------
const BPM = 112;
const STEP = 60 / BPM / 4;
const PROG = [
  [45, 57, 60, 64],
  [41, 53, 57, 60],
  [48, 55, 60, 64],
  [43, 55, 59, 62],
];
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
let seqTimer = null;
let nextTime = 0;
let step = 0;
let intensity = 0;

function scheduleStep(s, t) {
  const bar = Math.floor(s / 16) % 4;
  const st = s % 16;
  const ch = PROG[bar];
  // 킥
  if (st % 4 === 0) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.setValueAtTime(140, t);
    o.frequency.exponentialRampToValueAtTime(40, t + 0.15);
    env(g, t, 0.003, 0.5, 0.18);
    o.connect(g).connect(music);
    o.start(t);
    o.stop(t + 0.25);
  }
  // 하이햇
  if (st % 2 === 1) {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuf;
    const f = ctx.createBiquadFilter();
    f.type = 'highpass';
    f.frequency.value = 7000;
    const g = ctx.createGain();
    env(g, t, 0.002, 0.06 + intensity * 0.04, 0.04);
    src.connect(f).connect(g).connect(music);
    src.start(t, Math.random());
    src.stop(t + 0.08);
  }
  // 베이스
  if (st % 4 === 0 || st === 14) {
    const o = ctx.createOscillator();
    const f = ctx.createBiquadFilter();
    const g = ctx.createGain();
    o.type = 'sawtooth';
    o.frequency.value = mtof(ch[0] - 12 + (st === 14 ? 12 : 0));
    f.type = 'lowpass';
    f.frequency.value = 500 + intensity * 500;
    env(g, t, 0.01, 0.2, STEP * 3);
    o.connect(f).connect(g).connect(music);
    o.start(t);
    o.stop(t + STEP * 4);
  }
  // 아르페지오
  const arp = [1, 2, 3, 2, 1, 3, 2, 3];
  if (st % 2 === 0 || intensity > 0.5) {
    const n = ch[arp[(st >> (intensity > 0.5 ? 0 : 1)) % 8]] + 12;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'triangle';
    o.frequency.value = mtof(n);
    env(g, t, 0.005, 0.07, STEP * 1.6);
    o.connect(g).connect(music);
    o.start(t);
    o.stop(t + STEP * 2);
  }
  // 패드 (마디 시작)
  if (st === 0) {
    for (const m of ch.slice(1)) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.value = mtof(m);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.035, t + 0.4);
      g.gain.linearRampToValueAtTime(0.0001, t + STEP * 16);
      o.connect(g).connect(music);
      o.start(t);
      o.stop(t + STEP * 16 + 0.1);
    }
  }
}

export const Audio = {
  init() {
    if (ctx) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = muted ? 0 : 0.8;
      const comp = ctx.createDynamicsCompressor();
      master.connect(comp).connect(ctx.destination);
      sfx = ctx.createGain();
      sfx.gain.value = 0.8;
      sfx.connect(master);
      music = ctx.createGain();
      music.gain.value = 0.45;
      music.connect(master);
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 1.5, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    } catch (e) {
      ctx = null;
    }
  },
  resume() {
    if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
  },
  setMuted(m) {
    muted = m;
    if (master) master.gain.setTargetAtTime(m ? 0 : 0.8, ctx.currentTime, 0.02);
  },
  get muted() {
    return muted;
  },
  startMusic() {
    if (!ctx || seqTimer) return;
    nextTime = ctx.currentTime + 0.1;
    step = 0;
    seqTimer = setInterval(() => {
      if (!ctx) return;
      while (nextTime < ctx.currentTime + 0.12) {
        scheduleStep(step, nextTime);
        nextTime += STEP;
        step++;
      }
    }, 25);
  },
  stopMusic() {
    clearInterval(seqTimer);
    seqTimer = null;
  },
  setIntensity(v) {
    intensity = v;
  },
  // 삼키기 팝: 크기가 클수록 낮고, 콤보가 이어질수록 높아짐
  pop(size, combo) {
    if (!ctx) return;
    const t = performance.now();
    if (t - lastPop < 28) return;
    lastPop = t;
    const base = 820 / (0.55 + size * 0.75);
    const f = Math.min(2400, base * Math.pow(1.045, Math.min(combo, 24)));
    tone('sine', f, f * 0.45, 0.13 + Math.min(0.25, size * 0.05), 0.35);
    tone('triangle', f * 1.5, f * 0.8, 0.06, 0.12);
    if (size > 2) noise(0.35, 0.25, 400, 1, 'lowpass', sfx, 80);
  },
  hit() {
    noise(0.07, 0.15, 2500, 2, 'bandpass');
  },
  hurt() {
    tone('sawtooth', 300, 80, 0.25, 0.3);
    noise(0.2, 0.3, 800, 1, 'lowpass');
  },
  zap() {
    noise(0.18, 0.2, 5000, 4, 'bandpass', sfx, 1500);
    tone('square', 1200, 300, 0.12, 0.06);
  },
  shoot() {
    tone('square', 500, 180, 0.1, 0.08);
  },
  pulse() {
    tone('sine', 180, 60, 0.4, 0.35);
    noise(0.35, 0.12, 600, 1, 'lowpass', sfx, 100);
  },
  whoosh(v = 1) {
    noise(0.35, 0.25 * v, 300, 2, 'bandpass', sfx, 3000);
  },
  boom(v = 1) {
    noise(0.8 * v, 0.5, 1200, 1, 'lowpass', sfx, 60);
    tone('sine', 110, 35, 0.6 * v, 0.45);
  },
  levelUp() {
    [0, 4, 7, 12].forEach((s, i) => tone('triangle', mtof(72 + s), mtof(72 + s), 0.18, 0.18, sfx, i * 0.07));
  },
  sizeUp() {
    [0, 7, 12, 19].forEach((s, i) => tone('sawtooth', mtof(55 + s), mtof(55 + s), 0.25, 0.08, sfx, i * 0.05));
    tone('sine', 80, 220, 0.5, 0.3);
  },
  select() {
    tone('sine', 900, 1300, 0.08, 0.2);
  },
  warn() {
    for (let i = 0; i < 3; i++) {
      tone('square', 440, 440, 0.25, 0.1, sfx, i * 0.6);
      tone('square', 330, 330, 0.25, 0.1, sfx, i * 0.6 + 0.3);
    }
  },
  win() {
    [0, 4, 7, 12, 16, 19, 24].forEach((s, i) => tone('triangle', mtof(64 + s), mtof(64 + s), 0.3, 0.16, sfx, i * 0.09));
  },
  lose() {
    [12, 7, 3, 0].forEach((s, i) => tone('triangle', mtof(57 + s), mtof(57 + s), 0.35, 0.16, sfx, i * 0.16));
  },
};
