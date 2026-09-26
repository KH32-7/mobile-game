// WebAudio 합성 효과음 + 절차적 로파이 BGM (일본풍 펜타토닉)
let ctx = null;
let master = null;
let sfxBus = null;
let bgmBus = null;
let beltGain = null;
let noiseBuf = null;
let enabled = { sfx: true, bgm: true };
let bgmTimer = null;
let nextNote = 0;
let step = 0;
let bar = 0;
const coinState = { t: 0, n: 0 };
const tickState = { t: 0, n: 0 };

export const audio = {
  init() {
    if (ctx) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.8;
      const comp = ctx.createDynamicsCompressor();
      comp.threshold.value = -14;
      comp.ratio.value = 4;
      master.connect(comp);
      comp.connect(ctx.destination);
      sfxBus = ctx.createGain();
      sfxBus.gain.value = enabled.sfx ? 0.9 : 0;
      sfxBus.connect(master);
      bgmBus = ctx.createGain();
      bgmBus.gain.value = enabled.bgm ? 0.42 : 0;
      bgmBus.connect(master);
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 1.5, ctx.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      startBelt();
    } catch (e) {
      ctx = null;
    }
  },
  resume() {
    if (!ctx) this.init();
    if (ctx && ctx.state !== 'running') ctx.resume().catch(() => {});
  },
  suspend() {
    if (ctx && ctx.state === 'running') ctx.suspend().catch(() => {});
  },
  setSfx(on) {
    enabled.sfx = on;
    if (sfxBus) sfxBus.gain.setTargetAtTime(on ? 0.9 : 0, ctx.currentTime, 0.05);
  },
  setBgm(on) {
    enabled.bgm = on;
    if (bgmBus) bgmBus.gain.setTargetAtTime(on ? 0.42 : 0, ctx.currentTime, 0.1);
  },
  get on() {
    return enabled.sfx || enabled.bgm;
  },
  startBgm() {
    if (!ctx || bgmTimer) return;
    nextNote = ctx.currentTime + 0.1;
    bgmTimer = setInterval(scheduleBgm, 50);
  },
  stopBgm() {
    clearInterval(bgmTimer);
    bgmTimer = null;
  },
  beltLevel(v) {
    if (beltGain && ctx) beltGain.gain.setTargetAtTime(enabled.sfx ? v * 0.05 : 0, ctx.currentTime, 0.2);
  },
  play(name, arg = 0) {
    if (!ctx || !enabled.sfx || ctx.state !== 'running') return;
    const f = SFX[name];
    if (f) f(ctx.currentTime, arg);
  },
};

// ---------- 기본 합성 도구 ----------
function env(g, t, a, peak, dec, sus = 0.0001) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + a);
  g.gain.exponentialRampToValueAtTime(Math.max(sus, 0.0001), t + a + dec);
}
function tone(t, freq, dur, { type = 'sine', vol = 0.3, a = 0.005, bus = sfxBus, slide = 0, filter = 0 } = {}) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, freq * slide), t + dur);
  env(g, t, a, vol, dur);
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
  o.stop(t + a + dur + 0.05);
}
function noise(t, dur, { vol = 0.2, type = 'bandpass', freq = 1200, q = 1, bus = sfxBus, a = 0.002 } = {}) {
  const s = ctx.createBufferSource();
  s.buffer = noiseBuf;
  const f = ctx.createBiquadFilter();
  f.type = type;
  f.frequency.value = freq;
  f.Q.value = q;
  const g = ctx.createGain();
  env(g, t, a, vol, dur);
  s.connect(f);
  f.connect(g);
  g.connect(bus);
  s.start(t, Math.random() * 0.5);
  s.stop(t + a + dur + 0.05);
}

const SFX = {
  step(t, alt) {
    noise(t, 0.05, { vol: 0.07, type: 'lowpass', freq: alt ? 420 : 360 });
  },
  pick(t, n) {
    // 적재 틱: 쌓일수록 피치 상승
    const f = 520 * Math.pow(1.06, Math.min(n, 18));
    tone(t, f, 0.07, { type: 'triangle', vol: 0.16 });
    tone(t + 0.01, f * 2, 0.04, { type: 'sine', vol: 0.05 });
  },
  drop(t, n) {
    const f = 700 * Math.pow(1.04, Math.min(n, 12));
    tone(t, f, 0.05, { type: 'square', vol: 0.05, filter: 2400 });
    noise(t, 0.04, { vol: 0.08, freq: 2600, q: 3 });
  },
  clack(t) {
    // 접시 달그락
    tone(t, 1850 + Math.random() * 200, 0.06, { type: 'sine', vol: 0.12 });
    tone(t + 0.02, 2600 + Math.random() * 300, 0.05, { type: 'sine', vol: 0.06 });
    noise(t, 0.03, { vol: 0.06, freq: 4000, q: 4 });
  },
  coin(t) {
    const now = t;
    if (now - coinState.t > 0.6) coinState.n = 0;
    coinState.t = now;
    coinState.n = Math.min(coinState.n + 1, 24);
    const f = 1300 * Math.pow(1.03, coinState.n);
    tone(t, f, 0.08, { type: 'square', vol: 0.05, filter: 5000 });
    tone(t + 0.045, f * 1.5, 0.14, { type: 'square', vol: 0.045, filter: 6000 });
  },
  pay(t) {
    if (t - tickState.t > 0.5) tickState.n = 0;
    tickState.t = t;
    tickState.n = Math.min(tickState.n + 1, 40);
    tone(t, 600 * Math.pow(1.025, tickState.n), 0.05, { type: 'triangle', vol: 0.09 });
  },
  unlock(t) {
    // 팡파레
    const notes = [523, 659, 784, 1047, 1319];
    notes.forEach((f, i) => tone(t + i * 0.07, f, 0.25, { type: 'triangle', vol: 0.18 }));
    tone(t + 0.35, 1568, 0.5, { type: 'sine', vol: 0.12 });
    [523, 659, 784].forEach((f) => tone(t + 0.35, f, 0.6, { type: 'sawtooth', vol: 0.04, filter: 2200 }));
    noise(t + 0.3, 0.4, { vol: 0.06, freq: 6000, q: 0.5 });
  },
  pop(t) {
    tone(t, 300, 0.12, { type: 'sine', vol: 0.2, slide: 3 });
  },
  happy(t) {
    tone(t, 880, 0.09, { type: 'triangle', vol: 0.12 });
    tone(t + 0.08, 1175, 0.14, { type: 'triangle', vol: 0.12 });
  },
  angry(t) {
    tone(t, 180, 0.25, { type: 'sawtooth', vol: 0.1, slide: 0.7, filter: 900 });
    tone(t + 0.12, 150, 0.3, { type: 'sawtooth', vol: 0.1, slide: 0.7, filter: 800 });
  },
  eat(t) {
    noise(t, 0.05, { vol: 0.08, freq: 900, q: 2 });
    noise(t + 0.09, 0.05, { vol: 0.07, freq: 1100, q: 2 });
  },
  combo(t, n) {
    const base = 660 * Math.pow(1.059, Math.min(n, 12));
    [1, 1.25, 1.5].forEach((m, i) => tone(t + i * 0.045, base * m, 0.1, { type: 'triangle', vol: 0.1 }));
  },
  rush(t) {
    for (let i = 0; i < 4; i++) {
      tone(t + i * 0.16, 110, 0.18, { type: 'sine', vol: 0.35, slide: 0.5 });
      noise(t + i * 0.16, 0.08, { vol: 0.12, type: 'lowpass', freq: 300 });
    }
    tone(t + 0.66, 880, 0.3, { type: 'square', vol: 0.05, filter: 3000 });
  },
  vip(t) {
    // 징
    [220, 331, 441].forEach((f) => tone(t, f, 1.2, { type: 'sine', vol: 0.12 }));
    tone(t, 1320, 0.8, { type: 'sine', vol: 0.03 });
  },
  wash(t) {
    noise(t, 0.12, { vol: 0.07, freq: 1800, q: 0.8 });
    tone(t + 0.03, 900 + Math.random() * 400, 0.05, { type: 'sine', vol: 0.05, slide: 1.8 });
  },
  dry(t) {
    tone(t, 400, 0.15, { type: 'sine', vol: 0.1, slide: 0.5 });
  },
  error(t) {
    tone(t, 220, 0.12, { type: 'square', vol: 0.06, filter: 1200 });
    tone(t + 0.12, 180, 0.15, { type: 'square', vol: 0.06, filter: 1200 });
  },
  click(t) {
    tone(t, 900, 0.04, { type: 'triangle', vol: 0.12 });
  },
  open(t) {
    tone(t, 500, 0.08, { type: 'triangle', vol: 0.1, slide: 1.6 });
  },
  cook(t) {
    tone(t, 1400, 0.05, { type: 'sine', vol: 0.05 });
    tone(t + 0.05, 1760, 0.08, { type: 'sine', vol: 0.05 });
  },
  whoosh(t) {
    noise(t, 0.25, { vol: 0.12, freq: 900, q: 0.7, a: 0.08 });
  },
  cash(t) {
    tone(t, 1568, 0.08, { type: 'square', vol: 0.05, filter: 5000 });
    tone(t + 0.07, 2093, 0.25, { type: 'square', vol: 0.05, filter: 6000 });
    noise(t, 0.08, { vol: 0.05, freq: 5000, q: 2 });
  },
};

// ---------- 벨트 루프 (필터 노이즈 + 규칙적 딸깍) ----------
function startBelt() {
  beltGain = ctx.createGain();
  beltGain.gain.value = 0;
  const s = ctx.createBufferSource();
  s.buffer = noiseBuf;
  s.loop = true;
  const f = ctx.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.value = 260;
  const lfo = ctx.createOscillator();
  lfo.frequency.value = 3.2;
  const lfoG = ctx.createGain();
  lfoG.gain.value = 0.5;
  const am = ctx.createGain();
  am.gain.value = 0.6;
  lfo.connect(lfoG);
  lfoG.connect(am.gain);
  s.connect(f);
  f.connect(am);
  am.connect(beltGain);
  beltGain.connect(sfxBus);
  s.start();
  lfo.start();
}

// ---------- BGM ----------
// 미야코부시 음계 느낌: D Eb G A Bb + 로파이 코드 진행
const BPM = 78;
const S16 = 60 / BPM / 4;
const scale = [293.66, 311.13, 392.0, 440.0, 466.16, 587.33, 622.25, 783.99, 880.0];
const chords = [
  [146.83, 220.0, 261.63, 349.23], // Dm7
  [116.54, 233.08, 293.66, 349.23], // Bb
  [98.0, 233.08, 293.66, 349.23], // Gm7
  [110.0, 196.0, 277.18, 329.63], // A7sus-ish
];
let melIdx = 4;

function scheduleBgm() {
  if (!ctx) return;
  while (nextNote < ctx.currentTime + 0.25) {
    playStep(nextNote, step);
    nextNote += S16 * (step % 2 === 0 ? 1.12 : 0.88); // 스윙
    step++;
    if (step % 16 === 0) bar++;
  }
}

function pluck(t, f, vol, dur = 0.5) {
  const o = ctx.createOscillator();
  const o2 = ctx.createOscillator();
  const g = ctx.createGain();
  const fl = ctx.createBiquadFilter();
  o.type = 'triangle';
  o2.type = 'sine';
  o.frequency.value = f;
  o2.frequency.value = f * 2.01;
  fl.type = 'lowpass';
  fl.frequency.setValueAtTime(3200, t);
  fl.frequency.exponentialRampToValueAtTime(600, t + dur);
  env(g, t, 0.004, vol, dur);
  o.connect(fl);
  o2.connect(fl);
  fl.connect(g);
  g.connect(bgmBus);
  o.start(t);
  o2.start(t);
  o.stop(t + dur + 0.1);
  o2.stop(t + dur + 0.1);
}

function playStep(t, st) {
  const s = st % 16;
  const ch = chords[bar % 4];
  // 킥
  if (s === 0 || s === 10) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.setValueAtTime(120, t);
    o.frequency.exponentialRampToValueAtTime(45, t + 0.15);
    env(g, t, 0.003, 0.5, 0.22);
    o.connect(g);
    g.connect(bgmBus);
    o.start(t);
    o.stop(t + 0.3);
  }
  // 스네어 (부드러운 림)
  if (s === 4 || s === 12) noise(t, 0.12, { vol: 0.12, freq: 1800, q: 0.7, bus: bgmBus });
  // 하이햇
  if (s % 2 === 0) noise(t, 0.03, { vol: s % 4 === 2 ? 0.05 : 0.03, type: 'highpass', freq: 7000, bus: bgmBus });
  // 베이스
  if (s === 0 || s === 7 || s === 10) tone(t, ch[0] / 2, 0.35, { type: 'sine', vol: 0.28, bus: bgmBus });
  // 패드 (마디 시작)
  if (s === 0) {
    for (let i = 1; i < 4; i++) tone(t, ch[i], S16 * 15, { type: 'sawtooth', vol: 0.025, a: 0.3, bus: bgmBus, filter: 900 });
  }
  // 코토 느낌 멜로디: 랜덤 워크
  const pattern = [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0];
  const pBar = bar % 8;
  if (pattern[s] && (pBar < 6 || s < 8) && Math.random() < 0.8) {
    melIdx += Math.floor(Math.random() * 5) - 2;
    melIdx = Math.max(0, Math.min(scale.length - 1, melIdx));
    pluck(t, scale[melIdx], 0.1, 0.6);
    if (Math.random() < 0.2) pluck(t + S16, scale[Math.max(0, melIdx - 1)], 0.05, 0.4);
  }
  // 바이닐 잡음
  if (s % 4 === 0 && Math.random() < 0.5) noise(t + Math.random() * 0.1, 0.01, { vol: 0.03, type: 'highpass', freq: 3000, bus: bgmBus });
}
