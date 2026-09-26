// WebAudio 합성 효과음 + 절차적 로파이 BGM (일본풍 펜타토닉)
// 믹스 기준: 마스터 피크 약 -3dBFS, 주요 효과음 RMS -24~-20dB, 폰 스피커용 250~800Hz 배음 레이어
let ctx = null;
let sfxBus = null;
let bgmBus = null;
let beltGain = null;
let noiseBuf = null;
const enabled = { sfx: true, bgm: true };
let bgmTimer = null;
let bgmHeld = false;
let measuring = false;
let nextNote = 0;
let step = 0;
let bar = 0;
const coinState = { t: 0, n: 0 };
const tickState = { t: 0, n: 0 };
const SFX_VOL = 2.0;
const BGM_VOL = 0.6;

// 결정적 난수 (BGM 계측 재현용)
let seed = 12345;
function rnd() {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

// 마스터 체인: 버스 -> 믹스 -> 리미터 -> 출력 (피크 약 -3dBFS)
function buildChain(c, dest) {
  const mix = c.createGain();
  mix.gain.value = 0.9;
  const lim = c.createDynamicsCompressor();
  lim.threshold.value = -9;
  lim.knee.value = 2;
  lim.ratio.value = 20;
  lim.attack.value = 0.001;
  lim.release.value = 0.12;
  const out = c.createGain();
  out.gain.value = 0.92;
  mix.connect(lim);
  lim.connect(out);
  out.connect(dest);
  const sfx = c.createGain();
  sfx.gain.value = SFX_VOL;
  sfx.connect(mix);
  const bgm = c.createGain();
  bgm.gain.value = BGM_VOL;
  bgm.connect(mix);
  return { sfx, bgm, mix };
}

function makeNoise(c) {
  const b = c.createBuffer(1, Math.floor(c.sampleRate * 1.5), c.sampleRate);
  const d = b.getChannelData(0);
  let s = 777;
  for (let i = 0; i < d.length; i++) {
    s = (s * 1664525 + 1013904223) >>> 0;
    d[i] = (s / 4294967296) * 2 - 1;
  }
  return b;
}

export const audio = {
  init() {
    if (ctx) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      const ch = buildChain(ctx, ctx.destination);
      sfxBus = ch.sfx;
      bgmBus = ch.bgm;
      sfxBus.gain.value = enabled.sfx ? SFX_VOL : 0;
      bgmBus.gain.value = enabled.bgm && !bgmHeld ? BGM_VOL : 0;
      noiseBuf = makeNoise(ctx);
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
    if (sfxBus) sfxBus.gain.setTargetAtTime(on ? SFX_VOL : 0, ctx.currentTime, 0.05);
  },
  setBgm(on) {
    enabled.bgm = on;
    this.applyBgmGain();
  },
  // 일시정지 메뉴/백그라운드 동안 BGM 멈춤
  holdBgm(on) {
    bgmHeld = on;
    this.applyBgmGain();
  },
  applyBgmGain() {
    if (!bgmBus || !ctx) return;
    bgmBus.gain.setTargetAtTime(enabled.bgm && !bgmHeld ? BGM_VOL : 0, ctx.currentTime, 0.08);
  },
  get on() {
    return enabled.sfx || enabled.bgm;
  },
  get bgmPlaying() {
    return !!bgmTimer && enabled.bgm && !bgmHeld && !!ctx && ctx.state === 'running';
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
    if (beltGain && ctx) beltGain.gain.setTargetAtTime(enabled.sfx ? v * 0.09 : 0, ctx.currentTime, 0.2);
  },
  play(name, arg = 0) {
    if (measuring || !ctx || !enabled.sfx || ctx.state !== 'running') return;
    const f = SFX[name];
    if (f) f(ctx.currentTime, arg);
  },
  // OfflineAudioContext 로 효과음/BGM 을 렌더해서 피크, RMS, 저역 비중 계측
  async measure(names = ['pick', 'clack', 'coin', 'cash', 'unlock', 'happy', 'angry', 'combo', 'rush', 'error', 'step', 'pay', 'eat', 'wash']) {
    const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    if (!OAC) return null;
    const saved = { ctx, sfxBus, bgmBus, noiseBuf };
    const res = { sfx: {}, bgm: null };
    const sr = 44100;
    measuring = true;
    try {
      for (const n of names) {
        const oc = new OAC(1, sr * 2, sr);
        const ch = buildChain(oc, oc.destination);
        ctx = oc;
        sfxBus = ch.sfx;
        bgmBus = ch.bgm;
        noiseBuf = makeNoise(oc);
        coinState.n = 0;
        tickState.n = 0;
        SFX[n](0.02, 3);
        const buf = await oc.startRendering();
        res.sfx[n] = stats(buf.getChannelData(0));
      }
      // BGM 4마디: 채널0 = 전체, 채널1 = 150Hz 이하 저역
      const dur = 16 * 4 * S16 + 1;
      const oc = new OAC(2, Math.ceil(sr * dur), sr);
      const merger = oc.createChannelMerger(2);
      merger.connect(oc.destination);
      const full = oc.createGain();
      full.connect(merger, 0, 0);
      const lp1 = oc.createBiquadFilter();
      lp1.type = 'lowpass';
      lp1.frequency.value = 150;
      lp1.Q.value = 0.5;
      const lp2 = oc.createBiquadFilter();
      lp2.type = 'lowpass';
      lp2.frequency.value = 150;
      lp2.Q.value = 0.5;
      full.connect(lp1);
      lp1.connect(lp2);
      lp2.connect(merger, 0, 1);
      const ch = buildChain(oc, full);
      ctx = oc;
      sfxBus = ch.sfx;
      bgmBus = ch.bgm;
      noiseBuf = makeNoise(oc);
      seed = 4242;
      const oldBar = bar;
      bar = 0;
      let t = 0.05;
      for (let i = 0; i < 64; i++) {
        playStep(t, i);
        t += S16 * (i % 2 === 0 ? 1.12 : 0.88);
        if ((i + 1) % 16 === 0) bar++;
      }
      bar = oldBar;
      const buf = await oc.startRendering();
      const a = buf.getChannelData(0);
      const lo = buf.getChannelData(1);
      const st = stats(a);
      let ea = 0;
      let el = 0;
      for (let i = 0; i < a.length; i++) {
        ea += a[i] * a[i];
        el += lo[i] * lo[i];
      }
      st.lowRatio = ea > 0 ? el / ea : 0;
      res.bgm = st;
    } finally {
      measuring = false;
      ctx = saved.ctx;
      sfxBus = saved.sfxBus;
      bgmBus = saved.bgmBus;
      noiseBuf = saved.noiseBuf;
    }
    return res;
  },
};

function stats(d) {
  let peak = 0;
  let last = 0;
  for (let i = 0; i < d.length; i++) {
    const v = Math.abs(d[i]);
    if (v > peak) peak = v;
    if (v > 0.003) last = i;
  }
  // 소리가 나는 구간(첫 샘플 ~ 마지막 유효 샘플) 기준 RMS
  let first = 0;
  while (first < last && Math.abs(d[first]) < 0.003) first++;
  let sum = 0;
  const n = Math.max(1, last - first + 1);
  for (let i = first; i <= last; i++) sum += d[i] * d[i];
  const rms = Math.sqrt(sum / n);
  const db = (x) => (x > 0 ? 20 * Math.log10(x) : -120);
  return { peakDb: +db(peak).toFixed(1), rmsDb: +db(rms).toFixed(1), dur: +(n / 44100).toFixed(2) };
}

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
  s.start(t, rnd() * 0.5);
  s.stop(t + a + dur + 0.05);
}

const SFX = {
  step(t, alt) {
    // 발걸음: 저역 쿵 + 폰 스피커용 400Hz 대역 톡
    noise(t, 0.05, { vol: 0.192, type: 'lowpass', freq: alt ? 520 : 440 });
    tone(t, alt ? 330 : 290, 0.04, { type: 'triangle', vol: 0.06 });
  },
  pick(t, n) {
    // 적재 틱: 쌓일수록 피치 상승
    const f = 520 * Math.pow(1.06, Math.min(n, 18));
    tone(t, f, 0.08, { type: 'triangle', vol: 0.3 });
    tone(t + 0.01, f * 2, 0.05, { type: 'sine', vol: 0.1 });
  },
  drop(t, n) {
    const f = 700 * Math.pow(1.04, Math.min(n, 12));
    tone(t, f, 0.06, { type: 'square', vol: 0.09, filter: 2400 });
    noise(t, 0.05, { vol: 0.15, freq: 2600, q: 3 });
  },
  clack(t) {
    // 접시 달그락: 고역 핑 + 중역 몸통
    tone(t, 1850 + rnd() * 200, 0.07, { type: 'sine', vol: 0.224 });
    tone(t + 0.02, 2600 + rnd() * 300, 0.06, { type: 'sine', vol: 0.112 });
    tone(t, 520, 0.05, { type: 'triangle', vol: 0.134 });
    noise(t, 0.04, { vol: 0.134, freq: 3500, q: 3 });
  },
  coin(t) {
    if (t - coinState.t > 0.6) coinState.n = 0;
    coinState.t = t;
    coinState.n = Math.min(coinState.n + 1, 24);
    const f = 1300 * Math.pow(1.03, coinState.n);
    tone(t, f, 0.08, { type: 'square', vol: 0.117, filter: 5000 });
    tone(t + 0.045, f * 1.5, 0.16, { type: 'square', vol: 0.104, filter: 6000 });
    tone(t, 650, 0.05, { type: 'triangle', vol: 0.078 });
  },
  pay(t) {
    if (t - tickState.t > 0.5) tickState.n = 0;
    tickState.t = t;
    tickState.n = Math.min(tickState.n + 1, 40);
    tone(t, 600 * Math.pow(1.025, tickState.n), 0.06, { type: 'triangle', vol: 0.16 });
  },
  unlock(t) {
    // 팡파레
    const notes = [523, 659, 784, 1047, 1319];
    notes.forEach((f, i) => tone(t + i * 0.07, f, 0.25, { type: 'triangle', vol: 0.12 }));
    tone(t + 0.35, 1568, 0.5, { type: 'sine', vol: 0.072 });
    [262, 330, 392, 523, 659, 784].forEach((f) => tone(t + 0.35, f, 0.6, { type: 'sawtooth', vol: 0.021, filter: 2200 }));
    noise(t + 0.3, 0.4, { vol: 0.048, freq: 6000, q: 0.5 });
  },
  pop(t) {
    tone(t, 300, 0.12, { type: 'sine', vol: 0.3, slide: 3 });
    tone(t, 600, 0.08, { type: 'triangle', vol: 0.1, slide: 2 });
  },
  happy(t) {
    tone(t, 880, 0.1, { type: 'triangle', vol: 0.2 });
    tone(t + 0.08, 1175, 0.16, { type: 'triangle', vol: 0.2 });
    tone(t, 440, 0.12, { type: 'sine', vol: 0.06 });
  },
  angry(t) {
    tone(t, 180, 0.25, { type: 'sawtooth', vol: 0.16, slide: 0.7, filter: 1200 });
    tone(t + 0.12, 150, 0.3, { type: 'sawtooth', vol: 0.16, slide: 0.7, filter: 1000 });
    tone(t, 360, 0.3, { type: 'square', vol: 0.04, slide: 0.7, filter: 900 });
  },
  eat(t) {
    noise(t, 0.05, { vol: 0.45, freq: 900, q: 2 });
    noise(t + 0.09, 0.05, { vol: 0.375, freq: 1100, q: 2 });
  },
  combo(t, n) {
    const base = 660 * Math.pow(1.059, Math.min(n, 12));
    [1, 1.25, 1.5].forEach((m, i) => tone(t + i * 0.045, base * m, 0.12, { type: 'triangle', vol: 0.162 }));
    tone(t, base / 2, 0.2, { type: 'sine', vol: 0.054 });
  },
  rush(t) {
    // 타이코 북: 저역 + 250~500Hz 가죽 울림
    for (let i = 0; i < 4; i++) {
      tone(t + i * 0.16, 110, 0.18, { type: 'sine', vol: 0.165, slide: 0.5 });
      tone(t + i * 0.16, 330, 0.12, { type: 'triangle', vol: 0.077, slide: 0.6 });
      noise(t + i * 0.16, 0.08, { vol: 0.11, type: 'bandpass', freq: 450, q: 1.2 });
    }
    tone(t + 0.66, 880, 0.3, { type: 'square', vol: 0.039, filter: 3000 });
  },
  vip(t) {
    // 징
    [220, 331, 441, 662].forEach((f, i) => tone(t, f, 1.2, { type: 'sine', vol: i === 3 ? 0.05 : 0.12 }));
    tone(t, 1320, 0.8, { type: 'sine', vol: 0.018 });
  },
  wash(t) {
    noise(t, 0.12, { vol: 0.14, freq: 1800, q: 0.8 });
    tone(t + 0.03, 900 + rnd() * 400, 0.05, { type: 'sine', vol: 0.08, slide: 1.8 });
  },
  dry(t) {
    tone(t, 400, 0.15, { type: 'sine', vol: 0.16, slide: 0.5 });
  },
  error(t) {
    tone(t, 220, 0.12, { type: 'square', vol: 0.108, filter: 1500 });
    tone(t + 0.12, 180, 0.15, { type: 'square', vol: 0.108, filter: 1500 });
  },
  click(t) {
    tone(t, 900, 0.05, { type: 'triangle', vol: 0.18 });
  },
  open(t) {
    tone(t, 500, 0.08, { type: 'triangle', vol: 0.15, slide: 1.6 });
  },
  cook(t) {
    tone(t, 1400, 0.05, { type: 'sine', vol: 0.08 });
    tone(t + 0.05, 1760, 0.08, { type: 'sine', vol: 0.08 });
  },
  whoosh(t) {
    noise(t, 0.25, { vol: 0.18, freq: 900, q: 0.7, a: 0.08 });
  },
  cash(t) {
    tone(t, 1568, 0.08, { type: 'square', vol: 0.1, filter: 5000 });
    tone(t + 0.07, 2093, 0.25, { type: 'square', vol: 0.1, filter: 6000 });
    tone(t, 523, 0.1, { type: 'triangle', vol: 0.125 });
    noise(t, 0.08, { vol: 0.1, freq: 5000, q: 2 });
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
  f.type = 'bandpass';
  f.frequency.value = 380;
  f.Q.value = 0.8;
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
  [110.0, 196.0, 277.18, 329.63], // A7sus 느낌
];
let melIdx = 4;

function scheduleBgm() {
  if (!ctx || measuring) return;
  while (nextNote < ctx.currentTime + 0.25) {
    if (!bgmHeld) playStep(nextNote, step);
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
  // 킥: 저역 + 폰 스피커용 중역 클릭
  if (s === 0 || s === 10) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.setValueAtTime(120, t);
    o.frequency.exponentialRampToValueAtTime(50, t + 0.12);
    env(g, t, 0.003, 0.22, 0.14);
    o.connect(g);
    g.connect(bgmBus);
    o.start(t);
    o.stop(t + 0.25);
    tone(t, 260, 0.04, { type: 'triangle', vol: 0.14, bus: bgmBus, slide: 0.6 });
  }
  // 스네어 (부드러운 림)
  if (s === 4 || s === 12) noise(t, 0.12, { vol: 0.16, freq: 1800, q: 0.7, bus: bgmBus });
  // 하이햇
  if (s % 2 === 0) noise(t, 0.03, { vol: s % 4 === 2 ? 0.07 : 0.045, type: 'highpass', freq: 7000, bus: bgmBus });
  // 베이스: 기본음 + 2, 3배음 (폰 스피커에서도 들리도록)
  if (s === 0 || s === 7 || s === 10) {
    const f = ch[0] / 2;
    tone(t, f, 0.35, { type: 'sine', vol: 0.15, bus: bgmBus });
    tone(t, f * 2, 0.3, { type: 'triangle', vol: 0.13, bus: bgmBus });
    tone(t, f * 3, 0.22, { type: 'sine', vol: 0.06, bus: bgmBus });
    tone(t, f * 4, 0.18, { type: 'sine', vol: 0.04, bus: bgmBus });
  }
  // 패드 (마디 시작)
  if (s === 0) {
    for (let i = 1; i < 4; i++) tone(t, ch[i], S16 * 15, { type: 'sawtooth', vol: 0.03, a: 0.3, bus: bgmBus, filter: 1100 });
  }
  // 코토 느낌 멜로디: 랜덤 워크
  const pattern = [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0];
  const pBar = bar % 8;
  if (pattern[s] && (pBar < 6 || s < 8) && rnd() < 0.8) {
    melIdx += Math.floor(rnd() * 5) - 2;
    melIdx = Math.max(0, Math.min(scale.length - 1, melIdx));
    pluck(t, scale[melIdx], 0.13, 0.6);
    if (rnd() < 0.2) pluck(t + S16, scale[Math.max(0, melIdx - 1)], 0.07, 0.4);
  }
  // 바이닐 잡음
  if (s % 4 === 0 && rnd() < 0.5) noise(t + rnd() * 0.1, 0.01, { vol: 0.04, type: 'highpass', freq: 3000, bus: bgmBus });
}
