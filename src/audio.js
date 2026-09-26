// WebAudio 합성 효과음(레이어드) + 절차적 BGM 4곡(일반/보스/상점/쇼다운), 앤티에 따라 악기 적층
let ctx = null, master = null, sfxBus = null, bgmBus = null, bgmFilter = null, revIn = null, shaper = null;
let ducked = false;
let muted = false;
let vol = { bgm: 0.7, sfx: 0.9 };
let bgmOn = false, bgmTimer = null, nextNoteTime = 0, step = 0;
let noiseBuf = null;
let mode = 'normal', pendingMode = null, intensity = 1;

export function initAudio() {
  if (ctx) { if (ctx.state === 'suspended') ctx.resume().catch(() => {}); return; }
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  try { ctx = new AC(); } catch { return; }
  buildGraph(ctx);
  master.gain.value = muted ? 0 : 0.9;
  applyVolumes();
  if (bgmOn) startScheduler();
}

// 오디오 그래프: 버스 -> (드라이 + 절차적 리버브 센드) -> 마스터 컴프레서
function buildGraph(c) {
  master = c.createGain();
  master.gain.value = 0.9;
  const comp = c.createDynamicsCompressor();
  comp.threshold.value = -18; comp.knee.value = 8; comp.ratio.value = 3; comp.attack.value = 0.004; comp.release.value = 0.18;
  // 메이크업 게인 + 브릭월 리미터 (피크 약 -3dBFS)
  const makeup = c.createGain(); makeup.gain.value = 1.7;
  const limiter = c.createDynamicsCompressor();
  limiter.threshold.value = -6.5; limiter.knee.value = 0; limiter.ratio.value = 20; limiter.attack.value = 0.001; limiter.release.value = 0.08;
  // 최종 소프트 클리퍼: 피크를 -3dBFS 아래로
  const clip = c.createWaveShaper();
  const cn = 2048, cc = new Float32Array(cn);
  for (let i = 0; i < cn; i++) { const x = (i / (cn - 1)) * 4 - 2; cc[i] = 0.7 * Math.tanh(x / 0.7); }
  clip.curve = cc;
  master.connect(comp).connect(makeup).connect(limiter).connect(clip).connect(c.destination);
  // 노이즈 임펄스 리버브
  const conv = c.createConvolver();
  const len = Math.floor(c.sampleRate * 1.8);
  const ir = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = ir.getChannelData(ch);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2);
  }
  conv.buffer = ir;
  const revLp = c.createBiquadFilter(); revLp.type = 'lowpass'; revLp.frequency.value = 5000;
  const revOut = c.createGain(); revOut.gain.value = 0.32;
  revIn = c.createGain(); revIn.gain.value = 1;
  revIn.connect(conv).connect(revLp).connect(revOut).connect(master);
  sfxBus = c.createGain(); sfxBus.gain.value = 1.0 * vol.sfx; sfxBus.connect(master);
  const sfxSend = c.createGain(); sfxSend.gain.value = 0.35; sfxBus.connect(sfxSend).connect(revIn);
  bgmFilter = c.createBiquadFilter(); bgmFilter.type = 'lowpass'; bgmFilter.frequency.value = 9000;
  bgmBus = c.createGain(); bgmBus.gain.value = 0.14 * vol.bgm; bgmBus.connect(bgmFilter).connect(master);
  const bgmSend = c.createGain(); bgmSend.gain.value = 0.25; bgmFilter.connect(bgmSend).connect(revIn);
  // 디스토션 (xmult 슬램용)
  shaper = c.createWaveShaper();
  const n = 1024, curve = new Float32Array(n);
  for (let i = 0; i < n; i++) { const x = (i / (n - 1)) * 2 - 1; curve[i] = Math.tanh(x * 4) * 0.8; }
  shaper.curve = curve; shaper.oversample = '2x';
  shaper.connect(sfxBus);
  noiseBuf = c.createBuffer(1, c.sampleRate * 1, c.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
}

function applyVolumes() {
  if (!ctx) return;
  sfxBus.gain.setTargetAtTime(1.0 * vol.sfx, ctx.currentTime, 0.02);
  bgmBus.gain.setTargetAtTime(0.14 * vol.bgm * (ducked ? 0.45 : 1), ctx.currentTime, 0.08);
}

// 점수 연출 중 BGM 덕킹
export function duckBgm(on) {
  if (ducked === on) return;
  ducked = on;
  applyVolumes();
}

export function setVolumes(bgm, sfxV) { vol = { bgm, sfx: sfxV }; applyVolumes(); }

export function setMuted(m) {
  muted = m;
  if (master) master.gain.setTargetAtTime(m ? 0 : 0.9, ctx.currentTime, 0.02);
}
export function isMuted() { return muted; }

export function suspendAudio() { if (ctx && ctx.state === 'running') ctx.suspend().catch(() => {}); }
export function resumeAudio() { if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {}); }

const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

function tone({ freq, type = 'sine', t = 0, dur = 0.15, vol: v = 0.3, attack = 0.005, slideTo = null, bus = sfxBus, filter = null, detune = 0, dist = false, exact = false }) {
  if (!ctx) return;
  const now = ctx.currentTime + Math.max(0, t);
  if (bus === sfxBus && !exact) {
    // 효과음 피치/볼륨 랜덤화 (반복 피로 감소)
    const k = Math.pow(2, (Math.random() - 0.5) * 0.04);
    freq *= k; if (slideTo) slideTo *= k;
    v *= 0.9 + Math.random() * 0.2;
  }
  if (dist) bus = shaper;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, now);
  if (detune) o.detune.value = detune;
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, now + dur);
  g.gain.setValueAtTime(0.0001, now);
  g.gain.exponentialRampToValueAtTime(v, now + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  let node = o;
  if (filter) {
    const f = ctx.createBiquadFilter();
    f.type = filter.type || 'lowpass'; f.frequency.value = filter.freq; f.Q.value = filter.q || 0.7;
    if (filter.to) f.frequency.exponentialRampToValueAtTime(filter.to, now + dur);
    node.connect(f); node = f;
  }
  node.connect(g).connect(bus);
  o.start(now); o.stop(now + dur + 0.03);
}

function noise({ t = 0, dur = 0.1, vol: v = 0.2, freq = 3000, type = 'highpass', bus = sfxBus, to = null, q = 0.7 }) {
  if (!ctx) return;
  const now = ctx.currentTime + Math.max(0, t);
  if (bus === sfxBus) v *= 0.9 + Math.random() * 0.2;
  const s = ctx.createBufferSource();
  s.buffer = noiseBuf;
  const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
  if (to) f.frequency.exponentialRampToValueAtTime(to, now + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(v, now);
  g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
  s.connect(f).connect(g).connect(bus);
  s.start(now, Math.random() * 0.5); s.stop(now + dur + 0.03);
}

// 금속성 타격 (비정수배 배음)
function metal(t, base, v, dur) {
  [1, 2.76, 5.4, 8.93].forEach((r, i) => tone({ freq: base * r, type: 'sine', t, dur: dur / (1 + i * 0.6), vol: v / (1 + i), attack: 0.002 }));
}

const PENTA = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26, 28];

export const sfx = {
  pickup() { tone({ freq: 520, type: 'triangle', dur: 0.08, vol: 1.8, slideTo: 760 }); tone({ freq: 1040, type: 'sine', dur: 0.05, vol: 0.6, slideTo: 1520 }); noise({ dur: 0.03, vol: 0.75, freq: 5000 }); },
  // 착지음: 저음 쿵 + 나무 공명 + 짧은 클릭
  place(size = 4) {
    const f = 130 - size * 5;
    tone({ freq: f, type: 'sine', dur: 0.16, vol: 2.16, slideTo: 48, attack: 0.002 });
    // 250~800Hz 배음: 삼각파 2배음 + 짧은 나무 타격
    tone({ freq: f * 2.6, type: 'triangle', dur: 0.09, vol: 1.62, slideTo: f * 1.8 });
    tone({ freq: 480 - size * 10, type: 'triangle', dur: 0.05, vol: 0.99 });
    noise({ dur: 0.045, vol: 1.8, freq: 620, type: 'bandpass', q: 3 });
    noise({ dur: 0.03, vol: 0.9, freq: 1800, type: 'bandpass', q: 1.5 });
  },
  invalid() { tone({ freq: 140, type: 'square', dur: 0.14, vol: 0.09, filter: { freq: 600 } }); tone({ freq: 110, type: 'square', dur: 0.14, vol: 0.07, t: 0.07, filter: { freq: 500 } }); },
  // 줄 제거: 크래시 + 벨 코드 + 서브 붐, 줄 수에 따라 피치 상승
  clear(lines = 1, combo = 0) {
    const base = 60 + Math.min(lines - 1, 4) * 3 + Math.min(combo, 8);
    const n = 3 + Math.min(lines, 4);
    for (let i = 0; i < n; i++) {
      tone({ freq: mtof(base + PENTA[i]), type: 'triangle', t: i * 0.04, dur: 0.28, vol: 0.044 });
      tone({ freq: mtof(base + 12 + PENTA[i]), type: 'sine', t: i * 0.04, dur: 0.22, vol: 0.018 });
    }
    // 크래시: 노이즈 버스트 + 밴드패스 스윕 + 저역 킥
    noise({ dur: 0.45 + lines * 0.08, vol: 0.05 + lines * 0.04, freq: 9000, to: 2500 });
    noise({ dur: 0.35, vol: 0.054, freq: 500, type: 'bandpass', q: 4, to: 5000 + lines * 800 });
    noise({ dur: 0.12, vol: 0.062, freq: 1200, type: 'bandpass', q: 0.8 });
    tone({ freq: 150, type: 'sine', dur: 0.22, vol: 0.124 + lines * 0.05, slideTo: 42, attack: 0.001 });
    tone({ freq: 70, type: 'sine', dur: 0.35, vol: 0.074 + lines * 0.05, slideTo: 36 });
  },
  // 칩 틱: 피치가 상승하는 짧은 클릭
  tick(i = 0) {
    tone({ freq: mtof(72 + Math.min(i, 30)), type: 'square', dur: 0.04, vol: 1.8, filter: { freq: 3500 }, exact: true });
    tone({ freq: mtof(84 + Math.min(i, 30)), type: 'sine', dur: 0.03, vol: 1.2, exact: true });
    noise({ dur: 0.015, vol: 2.0, freq: 4000 + i * 200, type: 'bandpass', q: 2 });
  },
  chips(i = 0) { tone({ freq: mtof(67 + (i % 12)), type: 'triangle', dur: 0.12, vol: 1.875 }); tone({ freq: mtof(79 + (i % 12)), type: 'sine', dur: 0.08, vol: 0.75 }); noise({ dur: 0.03, vol: 0.7, freq: 7000 }); },
  mult(i = 0) { tone({ freq: mtof(74 + (i % 12)), type: 'triangle', dur: 0.14, vol: 2.25 }); tone({ freq: mtof(86 + (i % 12)), type: 'sine', dur: 0.1, vol: 0.7 }); noise({ dur: 0.04, vol: 0.5, freq: 3000, type: 'bandpass' }); },
  joker(i = 0) {
    const f = mtof(79 + (i % 5) * 2);
    tone({ freq: f, type: 'sine', dur: 0.35, vol: 0.36 });
    tone({ freq: f * 2.76, type: 'sine', dur: 0.15, vol: 0.1 });
    noise({ dur: 0.05, vol: 0.12, freq: 6000 });
  },
  // x배수: 금속 슬램
  xmult() {
    metal(0, 180, 0.28, 0.6);
    metal(0, 181.7, 0.12, 0.5);
    tone({ freq: 110, type: 'sawtooth', dur: 0.3, vol: 0.069, slideTo: 60, dist: true, filter: { freq: 1800 } });
    noise({ dur: 0.18, vol: 0.116, freq: 2500, type: 'bandpass', q: 0.6 });
    tone({ freq: 90, type: 'sine', dur: 0.35, vol: 0.154, slideTo: 40 });
    tone({ freq: 330, type: 'sawtooth', dur: 0.22, vol: 0.023, slideTo: 990, filter: { freq: 2500 } });
  },
  glass() { noise({ dur: 0.35, vol: 0.28, freq: 6000 }); [2400, 3100, 4200].forEach((f, i) => tone({ freq: f, type: 'sine', dur: 0.2, vol: 0.05, t: i * 0.03 })); },
  total(big = false) {
    tone({ freq: mtof(72), type: 'triangle', dur: 0.35, vol: 0.2 });
    tone({ freq: mtof(79), type: 'triangle', dur: 0.35, vol: 0.15, t: 0.06 });
    tone({ freq: mtof(84), type: 'triangle', dur: 0.4, vol: 0.12, t: 0.12 });
    if (big) { metal(0.05, 220, 0.2, 0.8); tone({ freq: 55, type: 'sine', dur: 0.6, vol: 0.4, slideTo: 30 }); }
  },
  // 콤보 문구: 단계별 상승 아르페지오
  combo(level = 1) {
    const base = 67 + level * 3;
    [0, 4, 7, 12, 16].slice(0, 2 + level).forEach((n, i) => tone({ freq: mtof(base + n), type: 'square', t: i * 0.05, dur: 0.18, vol: 0.046, filter: { freq: 3500 } }));
    tone({ freq: mtof(base + 24), type: 'sine', t: 0.05 * (2 + level), dur: 0.5, vol: 0.078 });
    noise({ dur: 0.4, vol: 0.052, freq: 8000, to: 12000 });
  },
  allClear() {
    [0, 4, 7, 11, 14, 19, 24].forEach((n, i) => { tone({ freq: mtof(60 + n), type: 'triangle', t: i * 0.06, dur: 0.6, vol: 0.01 }); tone({ freq: mtof(72 + n), type: 'sine', t: i * 0.06, dur: 0.5, vol: 0.003 }); });
    noise({ dur: 1.2, vol: 0.011, freq: 3000, to: 12000 });
    tone({ freq: 50, type: 'sine', dur: 0.9, vol: 0.027, slideTo: 30 });
    metal(0.42, 260, 0.2, 1.2);
  },
  buy() { tone({ freq: 988, type: 'square', dur: 0.08, vol: 0.1, filter: { freq: 4000 } }); tone({ freq: 1319, type: 'square', dur: 0.25, vol: 0.1, t: 0.07, filter: { freq: 4000 } }); noise({ dur: 0.05, vol: 0.06, freq: 8000, t: 0.07 }); },
  sell() { tone({ freq: 1319, type: 'square', dur: 0.08, vol: 0.08, filter: { freq: 4000 } }); tone({ freq: 880, type: 'square', dur: 0.2, vol: 0.08, t: 0.07, filter: { freq: 4000 } }); },
  card() { noise({ dur: 0.12, vol: 0.12, freq: 3000, type: 'bandpass', to: 6000 }); tone({ freq: 660, type: 'sine', dur: 0.2, vol: 0.08, slideTo: 1320 }); },
  levelUp() { [0, 7, 12, 19].forEach((n, i) => tone({ freq: mtof(72 + n), type: 'triangle', t: i * 0.07, dur: 0.35, vol: 0.14 })); },
  packOpen() { noise({ dur: 0.35, vol: 0.18, freq: 1500, type: 'bandpass', to: 7000 }); [0, 5, 9, 14].forEach((n, i) => tone({ freq: mtof(76 + n), type: 'sine', t: 0.15 + i * 0.05, dur: 0.3, vol: 0.1 })); },
  click() { tone({ freq: 800, type: 'sine', dur: 0.05, vol: 0.12 }); },
  roundClear() { [0, 4, 7, 12, 16].forEach((n, i) => tone({ freq: mtof(67 + n), type: 'triangle', t: i * 0.08, dur: 0.4, vol: 0.2 })); metal(0.35, 330, 0.12, 0.8); },
  boss() { tone({ freq: 110, type: 'sawtooth', dur: 0.8, vol: 0.2, slideTo: 55, filter: { freq: 800 } }); noise({ dur: 0.6, vol: 0.12, freq: 400, type: 'lowpass' }); tone({ freq: 55, type: 'sine', dur: 1, vol: 0.4 }); },
  showdown() {
    for (let i = 0; i < 4; i++) { tone({ freq: 60, type: 'sine', t: i * 0.35, dur: 0.4, vol: 0.55, slideTo: 35 }); noise({ t: i * 0.35, dur: 0.2, vol: 0.2, freq: 300, type: 'lowpass' }); }
    [0, 1, 6].forEach((n, i) => tone({ freq: mtof(48 + n), type: 'sawtooth', t: 1.2, dur: 1.2, vol: 0.08, filter: { freq: 1400 }, detune: i * 5 }));
  },
  coins(n = 1) { for (let i = 0; i < Math.min(6, n); i++) tone({ freq: 1500 + i * 120, type: 'square', t: i * 0.05, dur: 0.06, vol: 0.05, filter: { freq: 5000 } }); },
  gameOver() {
    [0, -3, -6, -12].forEach((n, i) => tone({ freq: mtof(60 + n), type: 'sawtooth', t: i * 0.22, dur: 0.4, vol: 0.12, filter: { freq: 1200 } }));
    tone({ freq: 60, type: 'sine', t: 0.7, dur: 0.8, vol: 0.4, slideTo: 30 });
  },
  newTray() { tone({ freq: 600, type: 'sine', dur: 0.08, vol: 0.1 }); tone({ freq: 900, type: 'sine', dur: 0.08, vol: 0.08, t: 0.05 }); noise({ dur: 0.1, vol: 0.05, freq: 3000, type: 'bandpass', to: 6000 }); },
  phoenix() { noise({ dur: 1, vol: 0.25, freq: 400, type: 'bandpass', to: 6000 }); [0, 7, 12, 19, 24].forEach((n, i) => tone({ freq: mtof(62 + n), type: 'sawtooth', t: 0.2 + i * 0.08, dur: 0.5, vol: 0.07, filter: { freq: 3000 } })); },
};

// ---------- BGM ----------
const SONGS = {
  normal: {
    bpm: 86, swing: 0.33,
    chords: [
      { root: 50, notes: [53, 57, 60, 64] }, { root: 43, notes: [53, 57, 59, 64] }, { root: 48, notes: [52, 55, 59, 62] }, { root: 45, notes: [52, 55, 60, 64] },
      { root: 50, notes: [53, 57, 60, 64] }, { root: 43, notes: [53, 56, 59, 63] }, { root: 48, notes: [52, 55, 59, 62] }, { root: 45, notes: [52, 55, 60, 63] },
    ],
    comp: [2, 5], melodyBars: 1,
  },
  shop: {
    bpm: 104, swing: 0.1,
    chords: [
      { root: 53, notes: [57, 60, 64, 67] }, { root: 52, notes: [55, 59, 62, 65] }, { root: 50, notes: [53, 57, 60, 64] }, { root: 55, notes: [59, 62, 65, 69] },
    ],
    comp: [1, 3, 4, 6], melodyBars: 0, bossa: true,
  },
  boss: {
    bpm: 96, swing: 0.2,
    chords: [
      { root: 45, notes: [48, 52, 55, 59] }, { root: 45, notes: [48, 52, 55, 59] }, { root: 41, notes: [45, 48, 52, 55] }, { root: 44, notes: [47, 50, 53, 56] },
    ],
    comp: [0, 3, 6], melodyBars: 1, drone: true, tom: true,
  },
  showdown: {
    bpm: 112, swing: 0.05,
    chords: [
      { root: 40, notes: [43, 47, 50, 53] }, { root: 41, notes: [44, 48, 51, 55] }, { root: 40, notes: [43, 47, 50, 53] }, { root: 38, notes: [42, 45, 49, 52] },
    ],
    comp: [0, 2, 3, 5, 6], melodyBars: 0, drone: true, tom: true, kick: true,
  },
};

function scheduleStep(s, time) {
  if (!ctx) return;
  const song = SONGS[mode];
  const bar = Math.floor(s / 8) % song.chords.length;
  const ch = song.chords[bar];
  const e = s % 8;
  const t = time - ctx.currentTime;
  const B = bgmBus;
  // 베이스
  if (song.bossa ? e === 0 || e === 3 || e === 4 || e === 7 : e % 2 === 0) {
    const q = song.bossa ? [0, 0, 0, 7, 12, 0, 0, 7][e] : [0, 7, 10, 13][e / 2];
    const next = song.chords[(bar + 1) % song.chords.length].root;
    const note = song.bossa ? ch.root + q : e === 6 ? next + 1 : ch.root + q;
    tone({ freq: mtof(note), type: 'triangle', t, dur: 0.42, vol: 0.42, bus: B, filter: { freq: 1400 } });
    tone({ freq: mtof(note + 12), type: 'triangle', t, dur: 0.25, vol: 0.14, bus: B, filter: { freq: 2000 } });
    noise({ t, dur: 0.03, vol: 0.05, freq: 700, type: 'bandpass', q: 3, bus: B });
  }
  // 컴핑
  if (song.comp.includes(e)) {
    ch.notes.forEach((n, i) => {
      if (mode === 'showdown') tone({ freq: mtof(n), type: 'sawtooth', t: t + i * 0.004, dur: 0.18, vol: 0.035, bus: B, filter: { freq: 1600 } });
      else tone({ freq: mtof(n), type: 'sine', t: t + i * 0.008, dur: song.bossa ? 0.25 : e === 2 ? 0.9 : 0.5, vol: 0.11, bus: B });
      if (!song.bossa && mode !== 'showdown') tone({ freq: mtof(n + 12), type: 'sine', t: t + i * 0.008, dur: 0.25, vol: 0.02, bus: B });
    });
  }
  if (song.drone && e === 0) tone({ freq: mtof(ch.root - 12), type: 'sawtooth', t, dur: (60 / song.bpm) * 4, vol: 0.05, bus: B, filter: { freq: 900 } });
  // 멜로디 (앤티 3 이상 적층)
  if (intensity >= 2 && song.melodyBars && bar % 2 === 1 && (e === 1 || e === 4 || e === 6)) {
    const scale = ch.notes.map((n) => n + 12);
    const n = scale[(s * 7 + bar) % scale.length];
    tone({ freq: mtof(n), type: 'triangle', t, dur: 0.35, vol: 0.07, bus: B, filter: { freq: 2200 } });
  }
  // 패드 (앤티 5 이상)
  if (intensity >= 3 && e === 0) ch.notes.forEach((n) => tone({ freq: mtof(n + 12), type: 'sine', t, dur: (60 / song.bpm) * 4, vol: 0.018, attack: 0.4, bus: B }));
  // 드럼
  noise({ t, dur: e % 2 ? 0.05 : 0.09, vol: e % 2 ? 0.045 : 0.075, freq: 7000, bus: B });
  if (e === 2 || e === 6) noise({ t, dur: 0.18, vol: 0.06, freq: 1800, type: 'bandpass', bus: B });
  if ((song.kick && e % 2 === 0) || (intensity >= 3 && e === 0)) { tone({ freq: 90, type: 'sine', t, dur: 0.14, vol: 0.22, slideTo: 45, bus: B }); noise({ t, dur: 0.02, vol: 0.08, freq: 2500, type: 'bandpass', bus: B }); }
  if (song.tom && (e === 7 || (e === 5 && bar % 2))) tone({ freq: 140, type: 'sine', t, dur: 0.2, vol: 0.25, slideTo: 80, bus: B });
  if (intensity >= 4 && e % 2 === 1) noise({ t, dur: 0.03, vol: 0.05, freq: 9000, bus: B }); // 셰이커 (앤티 7+)
}

function startScheduler() {
  if (bgmTimer || !ctx) return;
  nextNoteTime = ctx.currentTime + 0.1;
  bgmTimer = setInterval(() => {
    if (!ctx || ctx.state !== 'running') return;
    while (nextNoteTime < ctx.currentTime + 0.25) {
      if (step % 8 === 0 && pendingMode) { mode = pendingMode; pendingMode = null; step = 0; }
      const eighth = 60 / SONGS[mode].bpm / 2;
      const swing = step % 2 ? eighth * SONGS[mode].swing : 0;
      scheduleStep(step, nextNoteTime + swing);
      nextNoteTime += eighth;
      step++;
    }
    if (nextNoteTime < ctx.currentTime) nextNoteTime = ctx.currentTime + 0.05;
  }, 60);
}

// mode: normal | boss | shop | showdown, ante 로 적층 강도 결정
export function setBgmMode(m, ante = 1) {
  intensity = ante >= 7 ? 4 : ante >= 5 ? 3 : ante >= 3 ? 2 : 1;
  if (m !== mode) pendingMode = m;
  if (bgmFilter && ctx) bgmFilter.frequency.setTargetAtTime(m === 'shop' ? 6000 : 9000, ctx.currentTime, 0.3);
}
export function getBgmMode() { return pendingMode || mode; }

export function startBgm() {
  bgmOn = true;
  if (ctx) startScheduler();
}
export function stopBgm() {
  bgmOn = false;
  if (bgmTimer) { clearInterval(bgmTimer); bgmTimer = null; }
}

// ---------- 오프라인 렌더 (계측용) ----------
// 예: await window.__bjAudio.renderOffline('clear', [3, 2]) -> AudioBuffer
export async function renderOffline(name, args = [], seconds = 1.6) {
  const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
  if (!OAC) return null;
  const off = new OAC(2, Math.floor(44100 * seconds), 44100);
  const saved = { ctx, master, sfxBus, bgmBus, bgmFilter, revIn, shaper, noiseBuf };
  ctx = off;
  buildGraph(off);
  try {
    if (name === 'bgm') { for (let k = 0; k < 16; k++) scheduleStep(k, k * (60 / SONGS[mode].bpm / 2)); }
    else if (sfx[name]) sfx[name](...args);
    return await off.startRendering();
  } finally {
    ({ ctx, master, sfxBus, bgmBus, bgmFilter, revIn, shaper, noiseBuf } = saved);
  }
}
// 계측: 피크, 활성 구간 RMS(dB), 150Hz 이하 에너지 비율
export async function measure(name, args = [], seconds = 1.6) {
  const buf = await renderOffline(name, args, seconds);
  if (!buf) return null;
  const d = buf.getChannelData(0);
  let peak = 0, first = -1, last = -1;
  for (let i = 0; i < d.length; i++) { const a = Math.abs(d[i]); if (a > peak) peak = a; if (a > 0.003) { if (first < 0) first = i; last = i; } }
  let sum = 0, lowE = 0, totE = 0;
  const k = 1 - Math.exp((-2 * Math.PI * 150) / buf.sampleRate);
  let y1 = 0, y2 = 0;
  for (let i = 0; i < d.length; i++) {
    y1 += k * (d[i] - y1); y2 += k * (y1 - y2);
    lowE += y2 * y2; totE += d[i] * d[i];
    if (i >= first && i <= last) sum += d[i] * d[i];
  }
  const n = Math.max(1, last - first + 1);
  const rms = Math.sqrt(sum / n);
  return { peak, peakDb: 20 * Math.log10(peak + 1e-9), rmsDb: 20 * Math.log10(rms + 1e-9), lowRatio: lowE / (totE + 1e-12) };
}
if (typeof window !== 'undefined') window.__bjAudio = { renderOffline, measure, sfxNames: () => Object.keys(sfx) };
