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
const STYLES = {
  meadow: { bpm: 76, chords: [[53, 57, 60, 64], [52, 55, 59, 62], [50, 53, 57, 60], [48, 52, 55, 59], [46, 50, 53, 57], [45, 48, 52, 55], [43, 46, 50, 53], [48, 53, 55, 58]], scale: [72, 74, 76, 79, 81, 84], pad: 'triangle', lead: 'sine', padCut: 1100, kick: [0, 2], hat: 0.05, leadP: 0.38, arp: false },
  desert: { bpm: 90, chords: [[50, 53, 57, 62], [51, 55, 58, 62], [50, 53, 57, 60], [48, 51, 55, 58]], scale: [74, 75, 78, 79, 81, 82, 86], pad: 'sawtooth', lead: 'square', padCut: 700, kick: [0, 1.5, 2.5], hat: 0.07, leadP: 0.45, arp: false, shaker: true },
  snow: { bpm: 62, chords: [[48, 55, 62, 64], [45, 52, 59, 60], [41, 48, 55, 57], [43, 50, 57, 59]], scale: [79, 81, 83, 86, 88, 91], pad: 'sine', lead: 'sine', padCut: 1600, kick: [], hat: 0.02, leadP: 0.5, arp: false, bell: true },
  space: { bpm: 100, chords: [[45, 52, 57, 60], [41, 48, 53, 57], [48, 55, 60, 64], [43, 50, 55, 59]], scale: [69, 72, 74, 76, 79, 81], pad: 'sawtooth', lead: 'triangle', padCut: 900, kick: [0, 1, 2, 3], hat: 0.04, leadP: 0.2, arp: true },
};
let style = STYLES.meadow;
let bossMode = false;
export function setBgmStyle(world, boss) {
  style = STYLES[world] || STYLES.meadow;
  bossMode = !!boss;
}
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

function note(freq, t, dur, vol, type = 'sine', cut = 0) {
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
  n.connect(g).connect(musicBus);
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
  s.connect(fl).connect(g).connect(musicBus);
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
    o.detune.value = (i - 1.5) * 5;
    const g = ctx.createGain();
    const fl = ctx.createBiquadFilter();
    fl.type = 'lowpass';
    fl.frequency.value = S.padCut;
    const pv = S.pad === 'sawtooth' ? 0.035 : 0.065;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(pv, t0 + (S.bell ? 0.4 : 0.08));
    g.gain.exponentialRampToValueAtTime(pv * 0.4, t0 + BEAT * 2);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + BEAT * 4 - 0.02);
    o.connect(fl).connect(g).connect(musicBus);
    o.start(t0);
    o.stop(t0 + BEAT * 4);
  });
  // 베이스
  const bassT = S.arp ? [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5] : [0, 2.5];
  bassT.forEach((b, i) => note(mtof(ch[0] - 12 + (!S.arp && i ? 7 : 0)), t0 + b * BEAT, BEAT * (S.arp ? 0.45 : 1.4), S.arp ? 0.12 : 0.2, S.arp ? 'sawtooth' : 'sine', S.arp ? 500 : 0));
  // 드럼
  const kicks = bossMode ? [0, 1, 2, 3] : S.kick;
  kicks.forEach((b) => {
    const t = t0 + b * BEAT;
    const o = ctx.createOscillator();
    o.frequency.setValueAtTime(120, t);
    o.frequency.exponentialRampToValueAtTime(45, t + 0.12);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(bossMode ? 0.32 : 0.26, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.2);
    o.connect(g).connect(musicBus);
    o.start(t);
    o.stop(t + 0.22);
  });
  for (let k = 0; k < 8; k++) hat(t0 + k * BEAT * 0.5 + (k % 2 ? BEAT * 0.08 : 0), (k % 2 ? 1 : 0.5) * S.hat);
  if (S.shaker) for (let k = 0; k < 16; k++) hat(t0 + k * BEAT * 0.25, k % 4 === 2 ? 0.05 : 0.02, 5000, 0.04);
  if (bossMode) note(mtof(ch[0] - 24), t0, BEAT * 4, 0.08, 'sawtooth', 200);
  // 아르페지오 (우주)
  if (S.arp) for (let k = 0; k < 16; k++) note(mtof(ch[k % 4] + 12 + (k % 8 >= 4 ? 12 : 0)), t0 + k * BEAT * 0.25, BEAT * 0.3, 0.035, 'square', 1800);
  // 멜로디
  for (let k = 0; k < 8; k++) {
    if (Math.random() > (barIdx % 4 === 3 ? S.leadP * 0.5 : S.leadP)) continue;
    const t = t0 + k * BEAT * 0.5 + (k % 2 ? BEAT * 0.08 : 0);
    const m = S.scale[Math.floor(Math.random() * S.scale.length)] - (barIdx % 2 ? 0 : 12) - (bossMode ? 2 : 0);
    if (S.bell) {
      note(mtof(m), t, 1.6, 0.05, 'sine');
      note(mtof(m) * 2.76, t, 0.8, 0.012, 'sine');
    } else note(mtof(m), t, S.lead === 'square' ? 0.25 : 0.6, S.lead === 'square' ? 0.03 : 0.06, S.lead, S.lead === 'square' ? 2400 : 0);
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
