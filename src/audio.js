// WebAudio 합성 효과음 + 절차적 라운지 BGM
let ctx = null, master = null, sfxBus = null, bgmBus = null;
let muted = false;
let bgmOn = false, bgmTimer = null, nextNoteTime = 0, step = 0;
let noiseBuf = null;

export function initAudio() {
  if (ctx) { if (ctx.state === 'suspended') ctx.resume().catch(() => {}); return; }
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  try { ctx = new AC(); } catch { return; }
  master = ctx.createGain();
  master.gain.value = muted ? 0 : 0.9;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -14; comp.ratio.value = 4;
  master.connect(comp).connect(ctx.destination);
  sfxBus = ctx.createGain(); sfxBus.gain.value = 0.55; sfxBus.connect(master);
  bgmBus = ctx.createGain(); bgmBus.gain.value = 0.16; bgmBus.connect(master);
  noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 1, ctx.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  if (bgmOn) startScheduler();
}

export function setMuted(m) {
  muted = m;
  if (master) master.gain.setTargetAtTime(m ? 0 : 0.9, ctx.currentTime, 0.02);
}
export function isMuted() { return muted; }

export function suspendAudio() { if (ctx && ctx.state === 'running') ctx.suspend().catch(() => {}); }
export function resumeAudio() { if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {}); }

const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

function tone({ freq, type = 'sine', t = 0, dur = 0.15, vol = 0.3, attack = 0.005, slideTo = null, bus = sfxBus, filter = null }) {
  if (!ctx) return;
  const now = ctx.currentTime + t;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, now);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, now + dur);
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(vol, now + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  let node = o;
  if (filter) {
    const f = ctx.createBiquadFilter();
    f.type = filter.type || 'lowpass'; f.frequency.value = filter.freq; f.Q.value = filter.q || 0.7;
    node.connect(f); node = f;
  }
  node.connect(g).connect(bus);
  o.start(now); o.stop(now + dur + 0.02);
}

function noise({ t = 0, dur = 0.1, vol = 0.2, freq = 3000, type = 'highpass', bus = sfxBus }) {
  if (!ctx) return;
  const now = ctx.currentTime + t;
  const s = ctx.createBufferSource();
  s.buffer = noiseBuf;
  const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq;
  const g = ctx.createGain();
  g.gain.setValueAtTime(vol, now);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  s.connect(f).connect(g).connect(bus);
  s.start(now, Math.random() * 0.5); s.stop(now + dur + 0.02);
}

const PENTA = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26, 28];

export const sfx = {
  pickup() { tone({ freq: 520, type: 'triangle', dur: 0.06, vol: 0.15, slideTo: 700 }); },
  place(size = 4) {
    tone({ freq: 190 - size * 6, type: 'triangle', dur: 0.12, vol: 0.4, slideTo: 80 });
    noise({ dur: 0.04, vol: 0.12, freq: 2500 });
  },
  invalid() { tone({ freq: 140, type: 'square', dur: 0.12, vol: 0.08, filter: { freq: 600 } }); },
  clear(lines = 1, combo = 0) {
    const base = 60 + Math.min(lines - 1, 4) * 3 + Math.min(combo, 6);
    const n = 3 + Math.min(lines, 4);
    for (let i = 0; i < n; i++) {
      tone({ freq: mtof(base + PENTA[i]), type: 'triangle', t: i * 0.045, dur: 0.22, vol: 0.2 });
      tone({ freq: mtof(base + 12 + PENTA[i]), type: 'sine', t: i * 0.045, dur: 0.18, vol: 0.08 });
    }
    noise({ dur: 0.25, vol: 0.15, freq: 5000 });
  },
  tick(i = 0) { tone({ freq: mtof(72 + Math.min(i, 24)), type: 'square', dur: 0.035, vol: 0.05, filter: { freq: 3000 } }); },
  chips(i = 0) { tone({ freq: mtof(67 + (i % 12)), type: 'sine', dur: 0.08, vol: 0.14 }); },
  mult(i = 0) { tone({ freq: mtof(74 + (i % 12)), type: 'triangle', dur: 0.1, vol: 0.18 }); },
  joker(i = 0) {
    const f = mtof(79 + (i % 5) * 2);
    tone({ freq: f, type: 'sine', dur: 0.35, vol: 0.18 });
    tone({ freq: f * 2.76, type: 'sine', dur: 0.15, vol: 0.05 });
  },
  xmult() {
    tone({ freq: 330, type: 'sawtooth', dur: 0.25, vol: 0.1, slideTo: 990, filter: { freq: 2500 } });
    tone({ freq: 660, type: 'square', dur: 0.2, vol: 0.05, t: 0.08, filter: { freq: 3000 } });
  },
  glass() { noise({ dur: 0.3, vol: 0.25, freq: 6000 }); tone({ freq: 2400, type: 'sine', dur: 0.15, vol: 0.06, slideTo: 3200 }); },
  total() {
    tone({ freq: mtof(72), type: 'triangle', dur: 0.3, vol: 0.2 });
    tone({ freq: mtof(79), type: 'triangle', dur: 0.3, vol: 0.15, t: 0.06 });
  },
  buy() { tone({ freq: 988, type: 'square', dur: 0.08, vol: 0.1, filter: { freq: 4000 } }); tone({ freq: 1319, type: 'square', dur: 0.25, vol: 0.1, t: 0.07, filter: { freq: 4000 } }); },
  sell() { tone({ freq: 1319, type: 'square', dur: 0.08, vol: 0.08, filter: { freq: 4000 } }); tone({ freq: 880, type: 'square', dur: 0.2, vol: 0.08, t: 0.07, filter: { freq: 4000 } }); },
  click() { tone({ freq: 800, type: 'sine', dur: 0.05, vol: 0.12 }); },
  roundClear() { [0, 4, 7, 12, 16].forEach((n, i) => tone({ freq: mtof(67 + n), type: 'triangle', t: i * 0.08, dur: 0.4, vol: 0.2 })); },
  boss() { tone({ freq: 110, type: 'sawtooth', dur: 0.8, vol: 0.2, slideTo: 55, filter: { freq: 800 } }); noise({ dur: 0.6, vol: 0.1, freq: 400, type: 'lowpass' }); },
  gameOver() {
    [0, -3, -6, -12].forEach((n, i) => tone({ freq: mtof(60 + n), type: 'sawtooth', t: i * 0.22, dur: 0.4, vol: 0.12, filter: { freq: 1200 } }));
  },
  newTray() { tone({ freq: 600, type: 'sine', dur: 0.08, vol: 0.1 }); tone({ freq: 900, type: 'sine', dur: 0.08, vol: 0.08, t: 0.05 }); },
};

// ---------- BGM: ii-V-I-vi 라운지 루프 (스윙 8분) ----------
const BPM = 86;
const CHORDS = [
  { root: 50, notes: [53, 57, 60, 64] }, // Dm9
  { root: 43, notes: [53, 57, 59, 64] }, // G13
  { root: 48, notes: [52, 55, 59, 62] }, // Cmaj9
  { root: 45, notes: [52, 55, 60, 64] }, // Am7
  { root: 50, notes: [53, 57, 60, 64] },
  { root: 43, notes: [53, 56, 59, 63] }, // G7b9 느낌
  { root: 48, notes: [52, 55, 59, 62] },
  { root: 45, notes: [52, 55, 60, 63] },
];

function scheduleStep(s, time) {
  if (!ctx) return;
  const bar = Math.floor(s / 8) % CHORDS.length;
  const ch = CHORDS[bar];
  const e = s % 8; // 8분음표 인덱스
  const t = time - ctx.currentTime;
  // 베이스: 4분음표 워킹
  if (e % 2 === 0) {
    const q = e / 2;
    const next = CHORDS[(bar + 1) % CHORDS.length].root;
    const walk = [ch.root, ch.root + 7, ch.root + 12 - 2, next + 1][q];
    tone({ freq: mtof(walk - 12), type: 'triangle', t, dur: 0.5, vol: 0.5, bus: bgmBus, filter: { freq: 500 } });
  }
  // 일렉 피아노 컴핑
  if (e === 2 || e === 5) {
    ch.notes.forEach((n, i) => {
      tone({ freq: mtof(n), type: 'sine', t: t + i * 0.008, dur: e === 2 ? 0.9 : 0.5, vol: 0.12, bus: bgmBus });
      tone({ freq: mtof(n + 12), type: 'sine', t: t + i * 0.008, dur: 0.25, vol: 0.02, bus: bgmBus });
    });
  }
  // 멜로디 한 조각 (짝수 마디마다)
  if (bar % 2 === 1 && (e === 1 || e === 4 || e === 6)) {
    const scale = ch.notes.map((n) => n + 12);
    const n = scale[(s * 7 + bar) % scale.length];
    tone({ freq: mtof(n), type: 'triangle', t, dur: 0.35, vol: 0.07, bus: bgmBus, filter: { freq: 2200 } });
  }
  // 브러시 하이햇
  noise({ t, dur: e % 2 ? 0.05 : 0.09, vol: e % 2 ? 0.05 : 0.08, freq: 7000, bus: bgmBus });
  if (e === 2 || e === 6) noise({ t, dur: 0.18, vol: 0.06, freq: 1800, type: 'bandpass', bus: bgmBus });
}

function startScheduler() {
  if (bgmTimer || !ctx) return;
  nextNoteTime = ctx.currentTime + 0.1;
  const eighth = 60 / BPM / 2;
  bgmTimer = setInterval(() => {
    if (!ctx || ctx.state !== 'running') return;
    while (nextNoteTime < ctx.currentTime + 0.25) {
      const swing = step % 2 ? eighth * 0.33 : 0;
      scheduleStep(step, nextNoteTime + swing);
      nextNoteTime += eighth;
      step++;
    }
    if (nextNoteTime < ctx.currentTime) nextNoteTime = ctx.currentTime + 0.05;
  }, 60);
}

export function startBgm() {
  bgmOn = true;
  if (ctx) startScheduler();
}
export function stopBgm() {
  bgmOn = false;
  if (bgmTimer) { clearInterval(bgmTimer); bgmTimer = null; }
}
