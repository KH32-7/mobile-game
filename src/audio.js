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
let musicFilter = null;
let reverbSend = null;
let vol = { music: 1, sfx: 1 };


// 오디오 그래프 (실시간/오프라인 계측 공용)
const MASTER = 1.2;
function buildGraph(c, gain) {
  master = c.createGain();
  master.gain.value = gain;
  // 마스터 컴프레서
  const comp = c.createDynamicsCompressor();
  comp.threshold.value = -16;
  comp.knee.value = 8;
  comp.ratio.value = 4;
  comp.attack.value = 0.004;
  comp.release.value = 0.2;
  master.connect(comp).connect(c.destination);
  noiseBuf = c.createBuffer(1, c.sampleRate * 1, c.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  // 절차적 리버브: 감쇠하는 스테레오 노이즈 임펄스
  const len = Math.floor(c.sampleRate * 1.6);
  const ir = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const cd = ir.getChannelData(ch);
    for (let i = 0; i < len; i++) cd[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
  }
  const conv = c.createConvolver();
  conv.buffer = ir;
  const wet = c.createGain();
  wet.gain.value = 0.22;
  conv.connect(wet).connect(master);
  reverbSend = conv;
  sfxBus = c.createGain();
  sfxBus.gain.value = 0.8 * vol.sfx;
  sfxBus.connect(master);
  const sfxSend = c.createGain();
  sfxSend.gain.value = 0.35;
  sfxBus.connect(sfxSend).connect(conv);
  // 음악: 상황별 로우패스 (조준 중 닫힘)
  musicFilter = c.createBiquadFilter();
  musicFilter.type = 'lowpass';
  musicFilter.frequency.value = 16000;
  musicFilter.Q.value = 0.6;
  musicBus = c.createGain();
  musicBus.gain.value = 0.4 * vol.music;
  musicBus.connect(musicFilter).connect(master);
  const musSend = c.createGain();
  musSend.gain.value = 0.5;
  musicFilter.connect(musSend).connect(conv);
}

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
  buildGraph(ctx, muted ? 0 : MASTER);
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  if (bgmOn) startBgm();
}

export function setMuted(m) {
  muted = m;
  if (master && ctx) master.gain.setTargetAtTime(m ? 0 : MASTER, ctx.currentTime, 0.05);
}
export const isMuted = () => muted;
export function setVolumes(music, sfx) {
  vol = { music, sfx };
  if (!ctx) return;
  musicBus.gain.setTargetAtTime(0.4 * music, ctx.currentTime, 0.05);
  sfxBus.gain.setTargetAtTime(0.8 * sfx, ctx.currentTime, 0.05);
}
// 음악 상황: 'aim' (필터 닫힘), 'tense' (컵 근처), 'normal'
let mood = 'normal';
export function setMood(m) {
  if (!ctx || !musicFilter || m === mood) return;
  mood = m;
  const f = m === 'aim' ? 900 : m === 'tense' ? 2200 : 16000;
  musicFilter.frequency.setTargetAtTime(f, ctx.currentTime, m === 'normal' ? 0.25 : 0.08);
  musicBus.gain.setTargetAtTime(0.4 * vol.music * (m === 'tense' ? 0.6 : 1), ctx.currentTime, 0.1);
}
const rnd = (k = 0.08) => 1 + (Math.random() * 2 - 1) * k;
// 금속 모달 합성 (비정수배 부분음)
function metal(f0, t, dur, v, ratios = [1, 2.76, 5.4, 8.93]) {
  ratios.forEach((r, i) => tone({ f: f0 * r, type: 'sine', t, dur: dur / (1 + i * 0.6), vol: v / (1 + i * 0.9) }));
}

export function suspend() {
  if (ctx && ctx.state === 'running') ctx.suspend().catch(() => {});
}
export function resume() {
  if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
}

let offline = false;
function ok() {
  return ctx && (offline || ctx.state === 'running');
}

let gainK = 1;
function tone({ f = 440, f2 = null, type = 'sine', t = 0, dur = 0.2, vol = 0.3, attack = 0.005, bus = sfxBus, q = null, lp = null }) {
  const now = ctx.currentTime + t;
  vol = Math.min(1, vol * gainK);
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
  vol = Math.min(1, vol * gainK);
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
    const k = rnd();
    // 주 레이어: 2~4kHz 클럽 페이스 '딱' 클릭 (폰 스피커가 잘 내는 대역)
    noise({ dur: 0.045, vol: 0.7 + p * 0.3, type: 'bandpass', f: 3000 * k, q: 2.5 });
    tone({ f: 3300 * k, f2: 2400, type: 'sine', dur: 0.035, vol: 0.35 });
    noise({ dur: 0.02, vol: 0.25, type: 'highpass', f: 5500, q: 0.7 });
    // 보조: 공 몸체 톤 (500Hz~1kHz 피치 드롭) + 약한 저역 무게감
    tone({ f: 1000 * k + p * 300, f2: 420, type: 'triangle', dur: 0.06, vol: 0.18 });
    tone({ f: 150 * k, f2: 80, type: 'sine', dur: 0.08, vol: 0.02 + p * 0.03 });
  },
  wall(speed, mat = 'wood') {
    if (!ok()) return;
    const v = Math.min(1, speed / 700);
    if (v < 0.04) return;
    const k = rnd(0.1);
    const g = (0.05 + v * 0.22) * rnd(0.15);
    if (mat === true || mat === 'wood') {
      tone({ f: 210 * k, f2: 140, type: 'triangle', dur: 0.09, vol: g * 1.2, lp: 1400 });
      noise({ dur: 0.05, vol: g, type: 'bandpass', f: 900 * k, q: 3 });
    } else if (mat === 'ice') {
      tone({ f: 520 * k, type: 'triangle', dur: 0.08, vol: g * 0.9 });
      tone({ f: 1850 * k, type: 'sine', dur: 0.18, vol: g * 0.7 });
      tone({ f: 1850 * 2.7 * k, type: 'sine', dur: 0.08, vol: g * 0.3 });
      noise({ dur: 0.03, vol: g * 0.8, type: 'highpass', f: 5000, q: 1 });
    } else if (mat === 'sandstone') {
      noise({ dur: 0.07, vol: g * 1.1, type: 'lowpass', f: 900 * k, q: 1 });
      tone({ f: 120 * k, f2: 80, type: 'sine', dur: 0.1, vol: g });
    } else if (mat === 'neon') {
      tone({ f: 620 * k, f2: 280, type: 'square', dur: 0.09, vol: g * 0.8, lp: 2600 });
      noise({ dur: 0.05, vol: g * 0.6, type: 'bandpass', f: 3200 * k, q: 6 });
    } else {
      tone({ f: 520 * k, f2: 300, type: 'square', dur: 0.07, vol: g, lp: 2200 });
    }
  },
  bumper() {
    if (!ok()) return;
    tone({ f: 300, f2: 900, type: 'square', dur: 0.12, vol: 0.18, lp: 3000 });
    tone({ f: 600, f2: 1400, type: 'sine', dur: 0.16, vol: 0.2 });
  },
  crate() {
    if (!ok()) return;
    tone({ f: 380, f2: 240, type: 'triangle', dur: 0.12, vol: 0.2 });
    noise({ dur: 0.25, vol: 0.45, type: 'lowpass', f: 1400, f2: 200, q: 1 });
    tone({ f: 140, f2: 60, type: 'triangle', dur: 0.2, vol: 0.3 });
  },
  cup() {
    if (!ok()) return;
    // 컵 안에서 딸그락 (금속 모달) 후 딸랑
    const k = rnd(0.05);
    [0, 0.07, 0.12, 0.155].forEach((t, i) => metal(1320 * k * (1 - i * 0.04), t, 0.18, 0.12 - i * 0.02));
    noise({ t: 0, dur: 0.2, vol: 0.12, type: 'bandpass', f: 3000, q: 4 });
    tone({ f: 300, f2: 190, t: 0.17, dur: 0.15, vol: 0.12 });
    metal(1760 * k, 0.28, 1.2, 0.14, [1, 2.4, 3.9, 6.1]);
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
    // 풍덩: 필터드 노이즈 스윕 + 거품
    noise({ dur: 0.6, vol: 0.55, type: 'bandpass', f: 2400, f2: 250, q: 1.2 });
    noise({ dur: 0.18, vol: 0.35, type: 'lowpass', f: 600, q: 0.7 });
    tone({ f: 420, f2: 110, dur: 0.22, vol: 0.25 });
    for (let i = 0; i < 6; i++) tone({ f: 700 + Math.random() * 900, f2: 1500 + Math.random() * 600, t: 0.12 + i * 0.05 + Math.random() * 0.03, dur: 0.05, vol: 0.05 });
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
  // 관중 환호: 대역 노이즈 군중 + 박수 (버디 이상)
  cheer(level = 1) {
    if (!ok()) return;
    const dur = 1.2 + level * 0.5;
    for (const pan of [-0.6, 0.6]) {
      const s0 = ctx.createBufferSource();
      s0.buffer = noiseBuf;
      s0.loop = true;
      const f = ctx.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.value = 1100 + pan * 200;
      f.Q.value = 0.6;
      const g = ctx.createGain();
      const now = ctx.currentTime;
      const v = (0.22 + level * 0.06) * gainK;
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(v, now + 0.25);
      g.gain.setValueAtTime(v, now + dur * 0.5);
      g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      const pn = panNode(pan);
      if (pn) s0.connect(f).connect(g).connect(pn).connect(sfxBus);
      else s0.connect(f).connect(g).connect(sfxBus);
      s0.start(now, Math.random() * 0.5);
      s0.stop(now + dur + 0.05);
    }
    for (let i = 0; i < 10 + level * 8; i++) noise({ t: 0.1 + Math.random() * dur * 0.8, dur: 0.03, vol: 0.12 + Math.random() * 0.1, type: 'bandpass', f: 1500 + Math.random() * 1500, q: 1.2 });
    [1047, 1319].forEach((f, i) => tone({ f, type: 'triangle', t: 0.15 + i * 0.2, dur: 0.25, vol: 0.05 }));
  },
  tick() {
    if (!ok()) return;
    tone({ f: 1500, type: 'square', dur: 0.04, vol: 0.08, lp: 3000 });
  },
  stinger(win) {
    if (!ok()) return;
    const seq = win ? [523, 659, 784, 1047, 1319] : [392, 370, 349, 262];
    seq.forEach((f, i) => {
      tone({ f, type: 'triangle', t: i * (win ? 0.09 : 0.16), dur: win ? 0.5 : 0.6, vol: 0.18 });
      tone({ f: f / 2, type: 'sine', t: i * (win ? 0.09 : 0.16), dur: 0.5, vol: 0.1 });
    });
    if (win) metal(2093, 0.5, 1.4, 0.1);
  },
  sting() {
    if (!ok()) return;
    // 컵 근처 긴장감: 상승 트레몰로
    [880, 1109, 1319, 1760].forEach((f, i) => tone({ f, type: 'sine', t: i * 0.05, dur: 0.35, vol: 0.06 }));
    noise({ dur: 0.4, vol: 0.05, type: 'highpass', f: 5000, f2: 9000, q: 0.5 });
  },
  ghost() {
    if (!ok()) return;
    tone({ f: 600, f2: 200, type: 'sine', dur: 0.3, vol: 0.12 });
  },
};

// 믹스 기준(주요 효과음 RMS -24~-20dB, 작은 소리도 -35dB 이상)에 맞춘 효과음별 게인
const SFX_GAIN = { cheer: 1, shot: 2.7, wall: 4.3, cup: 0.6, splash: 1.3, coin: 1.6, bumper: 2.2, crate: 1.7, relic: 0.7, lip: 3.4, tele: 1.05, heart: 0.75, heal: 0.8, click: 4.2, aimTick: 11, tick: 4.2, sting: 1.6, ghost: 2.6, fanfare: 0.72, stinger: 0.66, gameOver: 0.8 };
for (const [k, g] of Object.entries(SFX_GAIN)) {
  const orig = sfx[k];
  sfx[k] = (...a) => {
    gainK = g;
    try {
      orig(...a);
    } finally {
      gainK = 1;
    }
  };
}

// ---------- 구르는 소리 (속도 비례, 지면별) ----------
let roll = null;
export function rollSound(surface, speed) {
  if (!ctx || ctx.state !== 'running') return;
  if (!roll) {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuf;
    src.loop = true;
    const f = ctx.createBiquadFilter();
    const g = ctx.createGain();
    g.gain.value = 0;
    // 잔디 요철감: 저주파 진폭 변조
    const lfo = ctx.createOscillator();
    const lg = ctx.createGain();
    lfo.frequency.value = 18;
    lg.gain.value = 0;
    lfo.connect(lg).connect(g.gain);
    src.connect(f).connect(g).connect(sfxBus);
    src.start();
    lfo.start();
    roll = { src, f, g, lfo, lg };
  }
  const t = ctx.currentTime;
  const v = Math.min(1, speed / 700);
  let vol = 0,
    freq = 400,
    q = 0.7,
    type = 'lowpass',
    wob = 0;
  if (speed > 12) {
    if (surface === 2) {
      type = 'bandpass';
      freq = 1800 + v * 1500;
      q = 0.9;
      vol = 0.1 + v * 0.22;
      wob = vol * 0.5;
    } else if (surface === 4) {
      type = 'bandpass';
      freq = 4200 + v * 2000;
      q = 6;
      vol = 0.05 + v * 0.1;
    } else if (surface === 3) {
      type = 'bandpass';
      freq = 900;
      q = 1.5;
      vol = 0.12 * v + 0.04;
      wob = vol * 0.6;
    } else {
      type = 'lowpass';
      freq = 260 + v * 500;
      q = 0.8;
      vol = 0.1 + v * 0.3;
      wob = vol * 0.35;
    }
  }
  if (roll.f.type !== type) roll.f.type = type;
  roll.f.frequency.setTargetAtTime(freq, t, 0.05);
  roll.f.Q.setTargetAtTime(q, t, 0.05);
  roll.g.gain.setTargetAtTime(vol, t, 0.06);
  roll.lg.gain.setTargetAtTime(wob, t, 0.06);
  roll.lfo.frequency.setTargetAtTime(8 + v * 30, t, 0.1);
}

// ---------- BGM: 월드별 4종 + 보스 변주 ----------
// 모티프: MIDI 72(C5 523Hz) ~ 95(B6 1976Hz), null 은 쉼표
const MOTIFS = {
  meadow: [
    [76, null, 79, 81, 79, null, 76, 74],
    [72, null, 74, 76, null, null, 74, null],
    [76, null, 79, 81, 84, null, 81, 79],
    [81, null, null, 79, 76, null, null, null],
    [74, null, 76, 79, 76, null, 74, 72],
    [74, null, 76, null, 72, null, null, null],
    [76, 79, 81, 84, 86, null, 84, 81],
    [79, null, 76, null, 72, null, null, null],
  ],
  desert: [
    [74, 75, 78, 79, 78, null, 75, 74],
    [74, null, null, 72, 74, null, null, null],
    [79, 81, 82, 81, 79, null, 78, 75],
    [74, null, null, null, 75, 74, null, null],
    [86, null, 84, 82, 81, null, 79, 78],
    [79, null, 78, 75, 74, null, null, null],
    [74, 75, 78, 79, 81, 82, 81, 79],
    [78, null, 75, null, 74, null, null, null],
  ],
  snow: [
    [79, null, null, 83, 86, null, null, null],
    [84, null, 83, null, 79, null, null, null],
    [76, null, null, 79, 83, null, null, null],
    [81, null, 79, null, 76, null, null, null],
    [77, null, null, 81, 84, null, 88, null],
    [86, null, 84, null, 81, null, null, null],
    [79, null, 83, null, 86, null, 91, null],
    [88, null, null, null, 86, null, null, null],
  ],
  space: [
    [81, null, 84, 81, 88, null, 86, 84],
    [81, null, null, 79, 76, null, null, null],
    [77, null, 81, 77, 84, null, 83, 81],
    [79, null, null, 76, 72, null, null, null],
    [72, 76, 79, 84, 88, null, 84, 79],
    [81, null, 79, null, 76, null, null, null],
    [74, 79, 83, 86, 91, null, 86, 83],
    [84, null, null, null, 81, null, null, null],
  ],
};
const STYLES = {
  meadow: { id: 'meadow', bpm: 76, chords: [[53, 57, 60, 64], [52, 55, 59, 62], [50, 53, 57, 60], [48, 52, 55, 59], [46, 50, 53, 57], [45, 48, 52, 55], [43, 46, 50, 53], [48, 53, 55, 58]], scale: [72, 74, 76, 79, 81, 84], pad: 'triangle', lead: 'sine', padCut: 1100, kick: [0, 2], hat: 0.05, leadP: 0.38, arp: false },
  desert: { id: 'desert', bpm: 90, chords: [[50, 53, 57, 62], [51, 55, 58, 62], [50, 53, 57, 60], [48, 51, 55, 58]], scale: [74, 75, 78, 79, 81, 82, 86], pad: 'sawtooth', lead: 'square', padCut: 700, kick: [0, 1.5, 2.5], hat: 0.07, leadP: 0.45, arp: false, shaker: true },
  snow: { id: 'snow', bpm: 62, chords: [[48, 55, 62, 64], [45, 52, 59, 60], [41, 48, 55, 57], [43, 50, 57, 59]], scale: [79, 81, 83, 86, 88, 91], pad: 'sine', lead: 'sine', padCut: 1600, kick: [], hat: 0.02, leadP: 0.5, arp: false, bell: true },
  space: { id: 'space', bpm: 100, chords: [[45, 52, 57, 60], [41, 48, 53, 57], [48, 55, 60, 64], [43, 50, 55, 59]], scale: [69, 72, 74, 76, 79, 81], pad: 'sawtooth', lead: 'triangle', padCut: 900, kick: [0, 1, 2, 3], hat: 0.04, leadP: 0.2, arp: true },
};
let style = STYLES.meadow;
let bossMode = false;
export function setBgmStyle(world, boss) {
  style = STYLES[world] || STYLES.meadow;
  bossMode = !!boss;
}
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

function panNode(p) {
  if (!ctx.createStereoPanner) return null;
  const pn = ctx.createStereoPanner();
  pn.pan.value = p;
  return pn;
}
function note(freq, t, dur, vol, type = 'sine', cut = 0, pan = 0) {
  const o = ctx.createOscillator();
  o.type = type;
  o.frequency.value = freq;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  let n = o;
  if (cut) {
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = cut;
    o.connect(f);
    n = f;
  }
  const pn = pan ? panNode(pan) : null;
  if (pn) n.connect(g).connect(pn).connect(musicBus);
  else n.connect(g).connect(musicBus);
  o.start(t);
  o.stop(t + dur + 0.05);
}
function hat(t, vol, cut = 7000, dur = 0.05) {
  const s = ctx.createBufferSource();
  s.buffer = noiseBuf;
  const fl = ctx.createBiquadFilter();
  fl.type = 'highpass';
  fl.frequency.value = cut;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.003);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  const pn = panNode(0.45);
  if (pn) s.connect(fl).connect(g).connect(pn).connect(musicBus);
  else s.connect(fl).connect(g).connect(musicBus);
  s.start(t, Math.random() * 0.5);
  s.stop(t + dur + 0.02);
}

function beatLen() {
  return 60 / (style.bpm * (bossMode ? 1.15 : 1));
}

function scheduleBar(t0) {
  const S = style;
  const BEAT = beatLen();
  let ch = S.chords[barIdx % S.chords.length];
  if (bossMode) ch = ch.map((m, i) => (i === 1 ? m - 1 : m) - 2); // 단조 변주
  // 패드
  ch.forEach((m, i) => {
    const o = ctx.createOscillator();
    o.type = S.pad;
    o.frequency.value = mtof(m);
    o.detune.value = (i - 1.5) * 9; // 스테레오 디튠
    const g = ctx.createGain();
    const fl = ctx.createBiquadFilter();
    fl.type = 'lowpass';
    fl.frequency.value = S.padCut;
    const pv = S.pad === 'sawtooth' ? 0.035 : 0.065;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(pv, t0 + (S.bell ? 0.4 : 0.08));
    g.gain.exponentialRampToValueAtTime(pv * 0.4, t0 + BEAT * 2);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + BEAT * 4 - 0.02);
    const pn = panNode([-0.75, 0.75, -0.35, 0.35][i % 4]);
    if (pn) o.connect(fl).connect(g).connect(pn).connect(musicBus);
    else o.connect(fl).connect(g).connect(musicBus);
    o.start(t0);
    o.stop(t0 + BEAT * 4);
  });
  // 베이스
  const bassT = S.arp ? [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5] : [0, 2.5];
  bassT.forEach((b, i) => {
    const bm = ch[0] - 12 + (!S.arp && i ? 7 : 0);
    note(mtof(bm), t0 + b * BEAT, BEAT * (S.arp ? 0.45 : 1.4), S.arp ? 0.08 : 0.12, S.arp ? 'sawtooth' : 'sine', S.arp ? 500 : 0);
    // 폰 스피커에서도 들리는 배음 (한 옥타브 + 5도 위)
    note(mtof(bm + 12), t0 + b * BEAT, BEAT * (S.arp ? 0.4 : 1.2), S.arp ? 0.05 : 0.08, 'triangle', 900);
    if (!S.arp) note(mtof(bm + 19), t0 + b * BEAT, BEAT * 0.8, 0.03, 'triangle', 1200);
  });
  // 드럼
  const kicks = bossMode ? [0, 1, 2, 3] : S.kick;
  kicks.forEach((b) => {
    const t = t0 + b * BEAT;
    const o = ctx.createOscillator();
    o.frequency.setValueAtTime(120, t);
    o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(bossMode ? 0.24 : 0.18, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
    o.connect(g).connect(musicBus);
    o.start(t);
    o.stop(t + 0.22);
    note(320, t, 0.05, 0.05, 'triangle', 1500); // 킥 어택 배음
  });
  for (let k = 0; k < 8; k++) hat(t0 + k * BEAT * 0.5 + (k % 2 ? BEAT * 0.08 : 0), (k % 2 ? 1 : 0.5) * S.hat);
  if (S.shaker) for (let k = 0; k < 16; k++) hat(t0 + k * BEAT * 0.25, k % 4 === 2 ? 0.05 : 0.02, 5000, 0.04);
  if (bossMode) note(mtof(ch[0] - 24), t0, BEAT * 4, 0.08, 'sawtooth', 200);
  // 아르페지오 (우주)
  if (S.arp) for (let k = 0; k < 16; k++) note(mtof(ch[k % 4] + 12 + (k % 8 >= 4 ? 12 : 0)), t0 + k * BEAT * 0.25, BEAT * 0.3, 0.035, 'square', 1800);
  // 월드별 고정 모티프 (8마디, 8분음표, 500Hz~2kHz 대역) - 매번 같은 선율이라 기억에 남음
  const motif = MOTIFS[S.id] || MOTIFS.meadow;
  const bar = motif[barIdx % motif.length];
  bar.forEach((m, k) => {
    if (m == null) return;
    const t = t0 + k * BEAT * 0.5 + (k % 2 ? BEAT * 0.06 : 0);
    const f = mtof(m - (bossMode ? 1 : 0));
    const len = bar[k + 1] == null && k < 7 ? 0.95 : 0.45;
    if (S.bell) {
      note(f, t, BEAT * 1.6, 0.15, 'sine', 0, 0.25);
      note(f * 2.76, t, BEAT * 0.6, 0.025, 'sine', 0, -0.25);
    } else {
      note(f, t, BEAT * len * 1.4, S.lead === 'square' ? 0.07 : 0.15, S.lead, S.lead === 'square' ? 2600 : 0, 0.2);
      note(f * 2, t, BEAT * len, 0.03, 'sine', 0, -0.3);
    }
  });
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
      nextBar += beatLen() * 4;
    }
    if (nextBar > ctx.currentTime + 8) nextBar = ctx.currentTime + 0.1;
  }, 120);
}

export function stopBgm() {
  bgmOn = false;
  if (bgmTimer) clearInterval(bgmTimer);
  bgmTimer = null;
}

// ---------- 믹스 계측 (OfflineAudioContext): 피크, 최대 100ms RMS, 150Hz 이하 에너지 비중 ----------
export async function measure(name, args = [], dur = 1.2) {
  const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  if (!OAC) return null;
  const sr = 44100;
  const off = new OAC(2, Math.floor(sr * dur), sr);
  const saved = { ctx, master, sfxBus, musicBus, noiseBuf, musicFilter, reverbSend, barIdx, style, bossMode };
  ctx = off;
  offline = true;
  buildGraph(off, MASTER);
  try {
    if (name === 'bgm') {
      if (args[0]) setBgmStyle(args[0], !!args[1]);
      barIdx = 0;
      scheduleBar(0.02);
    } else if (name === 'mix') {
      // 실제 플레이처럼 겹칠 때 마스터 피크
      barIdx = 0;
      scheduleBar(0.02);
      sfx.shot(1);
      sfx.wall(700, 'wood');
      sfx.cup();
      sfx.fanfare(2);
    } else sfx[name](...args);
  } finally {
    ({ ctx, master, sfxBus, musicBus, noiseBuf, musicFilter, reverbSend, barIdx, style, bossMode } = saved);
    offline = false;
  }
  const buf = await off.startRendering();
  const L = buf.getChannelData(0),
    R = buf.getChannelData(1);
  let peak = 0,
    tot = 0,
    low = 0,
    y = 0,
    y5 = 0,
    y2k = 0,
    mid = 0,
    hi = 0,
    diff = 0,
    sum = 0;
  const a = 1 - Math.exp((-2 * Math.PI * 150) / sr);
  const a5 = 1 - Math.exp((-2 * Math.PI * 500) / sr);
  const a2 = 1 - Math.exp((-2 * Math.PI * 2000) / sr);
  const win = Math.floor(sr * 0.1);
  let acc = 0,
    best = 0;
  const sq = new Float32Array(L.length);
  for (let i = 0; i < L.length; i++) {
    const x = (L[i] + R[i]) / 2;
    peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
    y += a * (x - y);
    y5 += a5 * (x - y5);
    y2k += a2 * (x - y2k);
    tot += x * x;
    low += y * y;
    mid += (y2k - y5) ** 2;
    hi += (x - y2k) ** 2;
    diff += (L[i] - R[i]) ** 2;
    sum += (L[i] + R[i]) ** 2;
    sq[i] = x * x;
    acc += sq[i];
    if (i >= win) acc -= sq[i - win];
    if (acc > best) best = acc;
  }
  const db = (v) => (v > 0 ? 20 * Math.log10(v) : -120);
  return { name, peakDb: +db(peak).toFixed(1), rmsDb: +db(Math.sqrt(best / win)).toFixed(1), lowRatio: +(tot ? low / tot : 0).toFixed(3), midRatio: +(tot ? mid / tot : 0).toFixed(3), hiRatio: +(tot ? hi / tot : 0).toFixed(3), stereo: +(sum ? Math.sqrt(diff / sum) : 0).toFixed(3) };
}
