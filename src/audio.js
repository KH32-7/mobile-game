// WebAudio 합성 효과음 + 절차적 BGM
let ctx = null;
let master = null;
let sfxBus = null;
let musicBus = null;
let noiseBuf = null;
let muted = false; // 효과음
let musicMuted = false;
let duckF = null;
let ducked = false;
let track = 'title';
let theme = 0;
let musicOn = false;
let nextNoteTime = 0;
let step = 0;
let schedTimer = null;
let intensity = 0;
let lastPop = 0;
let popChain = 0;

export function initAudio(sfxMuted, bgmMuted) {
  muted = !!sfxMuted;
  musicMuted = !!bgmMuted;
}

function makeImpulse(sec = 2.2, decay = 3) {
  const len = Math.floor(ctx.sampleRate * sec);
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
  }
  return buf;
}

let reverbIn = null;
const MUSIC_VOL = 0.5;
let xfade = null;
let pending = null; // { kind, theme, at }
let windSrc = null, windF = null, windG = null;

function ensure() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  try {
    ctx = new AC();
  } catch (e) { return null; }
  // 마스터: 게인 → 컴프레서 → 출력
  master = ctx.createGain();
  master.gain.value = 0.8;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -16;
  comp.knee.value = 8;
  comp.ratio.value = 5;
  comp.attack.value = 0.004;
  comp.release.value = 0.18;
  master.connect(comp);
  comp.connect(ctx.destination);
  noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  // 절차적 리버브 (노이즈 임펄스 컨볼버) 센드
  const conv = ctx.createConvolver();
  conv.buffer = makeImpulse();
  reverbIn = ctx.createGain();
  reverbIn.gain.value = 1;
  const revOut = ctx.createGain();
  revOut.gain.value = 0.35;
  reverbIn.connect(conv); conv.connect(revOut); revOut.connect(master);
  sfxBus = ctx.createGain();
  sfxBus.gain.value = muted ? 0 : 0.9;
  sfxBus.connect(master);
  const sfxSend = ctx.createGain(); sfxSend.gain.value = 0.25;
  sfxBus.connect(sfxSend); sfxSend.connect(reverbIn);
  musicBus = ctx.createGain();
  musicBus.gain.value = musicMuted ? 0 : MUSIC_VOL;
  duckF = ctx.createBiquadFilter();
  duckF.type = 'lowpass';
  duckF.frequency.value = 18000;
  // 저역 과다 방지: 150Hz 이하 로우셸프 감쇠
  const lowCut = ctx.createBiquadFilter();
  lowCut.type = 'lowshelf'; lowCut.frequency.value = 160; lowCut.gain.value = -9;
  xfade = ctx.createGain(); xfade.gain.value = 1;
  musicBus.connect(xfade); xfade.connect(lowCut); lowCut.connect(duckF);
  duckF.connect(master);
  const musSend = ctx.createGain(); musSend.gain.value = 0.18;
  duckF.connect(musSend); musSend.connect(reverbIn);
  // 속도감용 바람 노이즈 루프 (속도에 비례해 필터/볼륨)
  windSrc = ctx.createBufferSource();
  windSrc.buffer = noiseBuf; windSrc.loop = true;
  windF = ctx.createBiquadFilter(); windF.type = 'bandpass'; windF.frequency.value = 500; windF.Q.value = 0.6;
  windG = ctx.createGain(); windG.gain.value = 0;
  windSrc.connect(windF); windF.connect(windG); windG.connect(sfxBus);
  windSrc.start();
  return ctx;
}

export function unlockAudio() {
  const c = ensure();
  if (c && c.state === 'suspended') c.resume().catch(() => {});
}

// v: 0~1 속도 비율 (0 이면 바람 끔)
export function setWind(v) {
  if (!windG) return;
  const t = ctx.currentTime;
  windG.gain.setTargetAtTime(v > 0 ? 0.015 + v * 0.07 : 0, t, 0.25);
  windF.frequency.setTargetAtTime(350 + v * 1600, t, 0.25);
}

export function setMuted(m) {
  muted = m;
  if (sfxBus) sfxBus.gain.setTargetAtTime(m ? 0 : 0.9, ctx.currentTime, 0.02);
}
export function setMusicMuted(m) {
  musicMuted = m;
  applyMusicGain();
}
function applyMusicGain(fade = 0) {
  if (!musicBus) return;
  const v = musicMuted ? 0 : ducked ? MUSIC_VOL * 0.3 : MUSIC_VOL;
  musicBus.gain.setTargetAtTime(v, ctx.currentTime, fade ? fade / 3 : 0.08);
  duckF.frequency.setTargetAtTime(ducked ? 700 : 18000, ctx.currentTime, 0.08);
}
// 일시정지/부활 대기/게임 오버: 로우패스 + 30% 볼륨
export function duck(on) { ducked = !!on; applyMusicGain(); }
export const isMuted = () => muted;
export const audioCtx = () => ctx;

export function suspendAudio() { if (ctx && ctx.state === 'running') ctx.suspend().catch(() => {}); }
export function resumeAudio() { if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {}); }

function out(pan) {
  if (!pan || !ctx.createStereoPanner) return sfxBus;
  const p = ctx.createStereoPanner();
  p.pan.value = pan;
  p.connect(sfxBus);
  return p;
}

function tone(freq, dur, { type = 'sine', vol = 0.3, attack = 0.005, slide = 0, delay = 0, bus = null, pan = 0, lp = 0, detune = 0 } = {}) {
  if (!ctx || muted) return;
  const ny = ctx.sampleRate * 0.45;
  if (freq > ny) return; // 나이퀴스트 초과 부분음은 생략
  const t = ctx.currentTime + delay;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (detune) o.detune.value = detune;
  if (slide) o.frequency.exponentialRampToValueAtTime(Math.min(ny, Math.max(30, freq * slide)), t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  let node = o;
  if (lp) { const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = lp; o.connect(f); node = f; }
  node.connect(g);
  g.connect(bus || out(pan));
  o.start(t);
  o.stop(t + dur + 0.02);
}

function noise(dur, { vol = 0.3, freq = 1200, q = 1, type = 'lowpass', sweep = 0, delay = 0, bus = null, attack = 0, pan = 0 } = {}) {
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
  if (attack) { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + attack); }
  else g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  s.connect(f); f.connect(g); g.connect(bus || out(pan));
  s.start(t, Math.random() * 1.5);
  s.stop(t + dur + 0.02);
}

// 금속 모달 합성: 비정수배 부분음 + 각기 다른 감쇠
function modal(f0, { vol = 0.12, delay = 0, pan = 0, ratios = [1, 2.756, 5.404, 8.933], decays = [0.42, 0.24, 0.14, 0.08], amps = [1, 0.55, 0.3, 0.16] } = {}) {
  ratios.forEach((r, i) => tone(f0 * r, decays[i], { type: 'sine', vol: vol * amps[i], delay, pan, attack: 0.001 }));
}
const semi = (f, n) => f * Math.pow(2, n / 12);

export const sfx = {
  // 게이트 이득: 장3화음 상승 아르페지오 + 화음 패드, 곱하기는 반짝임과 서브 추가
  gateGood(mult) {
    const base = mult ? 523.25 : 440;
    [0, 4, 7, 12, 16].forEach((n, i) => {
      tone(semi(base, n), 0.22, { type: 'triangle', vol: 0.2, delay: i * 0.05, pan: -0.3 + i * 0.15 });
      tone(semi(base, n), 0.18, { type: 'sawtooth', vol: 0.05, delay: i * 0.05, lp: 2400, detune: 8 });
    });
    [0, 4, 7].forEach((n) => tone(semi(base * 2, n), 0.6, { type: 'sine', vol: 0.06, delay: 0.26, attack: 0.03 }));
    if (mult) {
      for (let i = 0; i < 6; i++) tone(semi(base * 4, [0, 7, 12, 16, 19, 24][i]), 0.12, { type: 'sine', vol: 0.05, delay: 0.3 + i * 0.03, pan: Math.random() * 1.4 - 0.7 });
      tone(90, 0.3, { type: 'sine', vol: 0.25, slide: 0.6 });
    }
  },
  // 게이트 손해: 단조 하강 아르페지오 + 낮은 와우
  gateBad() {
    [12, 8, 3, 0].forEach((n, i) => tone(semi(330, n), 0.2, { type: 'square', vol: 0.07, delay: i * 0.06, lp: 1600 }));
    tone(220, 0.45, { type: 'sawtooth', vol: 0.09, slide: 0.45, delay: 0.08, lp: 900 });
    noise(0.25, { vol: 0.08, freq: 500, sweep: 0.4, delay: 0.05 });
  },
  // 멤버 추가: 피치 랜덤 버블
  pop() {
    if (!ctx) return;
    const now = ctx.currentTime;
    if (now - lastPop < 0.03) return;
    popChain = now - lastPop < 0.25 ? Math.min(popChain + 1, 24) : 0;
    lastPop = now;
    const f = 320 + popChain * 18 + Math.random() * 260;
    tone(f, 0.07, { type: 'sine', vol: 0.18, slide: 2.4, pan: Math.random() * 1.2 - 0.6, attack: 0.002 });
    tone(f * 2.01, 0.04, { type: 'sine', vol: 0.04, slide: 2, attack: 0.001 });
  },
  // 충돌: 노이즈 버스트 + 저역 퍽 + 클릭
  hit() {
    noise(0.12, { vol: 0.3, freq: 1300, type: 'bandpass', q: 0.8, sweep: 0.4 });
    tone(150, 0.16, { type: 'sine', vol: 0.35, slide: 0.32, attack: 0.002 });
    tone(2400, 0.015, { type: 'square', vol: 0.05 });
  },
  clash() {
    if (!ctx) return;
    const now = ctx.currentTime;
    if (now - lastPop < 0.035) return;
    popChain = now - lastPop < 0.25 ? Math.min(popChain + 1, 30) : 0;
    lastPop = now;
    const pan = Math.random() * 1.2 - 0.6;
    tone(260 + popChain * 20 + Math.random() * 40, 0.06, { type: 'sine', vol: 0.14, slide: 2.6, pan });
    noise(0.04, { vol: 0.12, freq: 3200, type: 'bandpass', q: 2, pan });
    tone(110, 0.06, { type: 'sine', vol: 0.12, slide: 0.5 });
  },
  // 코인: 금속 모달 두 번 울림
  coin() {
    const pan = Math.random() * 0.6 - 0.3;
    modal(1318, { vol: 0.1, pan });
    modal(1760, { vol: 0.09, delay: 0.06, pan });
  },
  jump() {
    noise(0.22, { vol: 0.12, freq: 600, type: 'bandpass', q: 1.5, sweep: 4, attack: 0.02 });
    tone(300, 0.2, { type: 'triangle', vol: 0.12, slide: 2.4 });
  },
  slide() { noise(0.3, { vol: 0.16, freq: 2600, type: 'bandpass', q: 0.8, sweep: 0.3, attack: 0.02 }); },
  lane() { noise(0.12, { vol: 0.09, freq: 900, type: 'bandpass', q: 1.2, sweep: 2.4, attack: 0.02 }); },
  powerup() {
    [0, 7, 12, 16, 19, 24].forEach((n, i) => tone(semi(660, n), 0.14, { type: 'triangle', vol: 0.12, delay: i * 0.04, pan: -0.5 + i * 0.2 }));
    noise(0.4, { vol: 0.05, freq: 7000, type: 'highpass', attack: 0.05, delay: 0.1 });
  },
  shieldBreak() {
    noise(0.35, { vol: 0.25, freq: 4500, type: 'highpass', sweep: 0.4 });
    for (let i = 0; i < 8; i++) modal(1800 + Math.random() * 1600, { vol: 0.04, delay: Math.random() * 0.25, pan: Math.random() * 1.6 - 0.8, ratios: [1, 1.52, 2.24, 2.91], decays: [0.2, 0.12, 0.08, 0.05] });
    tone(900, 0.3, { type: 'triangle', vol: 0.12, slide: 0.4 });
  },
  // 성문 타격: 나무 노크
  gateHit() {
    tone(170, 0.09, { type: 'sine', vol: 0.2, slide: 0.7, attack: 0.001 });
    noise(0.06, { vol: 0.12, freq: 700, type: 'bandpass', q: 3 });
  },
  // 요새 붕괴: 필터드 노이즈 럼블 + 서브 + 파편 클릭 다수 + 팡파르
  collapse() {
    noise(1.8, { vol: 0.5, freq: 380, sweep: 0.25, attack: 0.03 });
    noise(0.5, { vol: 0.3, freq: 900, type: 'bandpass', q: 0.7, sweep: 0.5 });
    tone(62, 1.4, { type: 'sine', vol: 0.45, slide: 0.55, attack: 0.01 });
    for (let i = 0; i < 36; i++) {
      const d = 0.05 + Math.pow(Math.random(), 1.6) * 1.4;
      noise(0.012 + Math.random() * 0.02, { vol: 0.05 + Math.random() * 0.08, freq: 2500 + Math.random() * 4500, type: 'highpass', delay: d, pan: Math.random() * 1.8 - 0.9 });
      if (i % 4 === 0) tone(300 + Math.random() * 500, 0.05, { type: 'square', vol: 0.03, delay: d, lp: 1500 });
    }
    [0, 4, 7, 12, 16].forEach((n, i) => tone(semi(523.25, n), 0.25, { type: 'triangle', vol: 0.12, delay: 0.6 + i * 0.08 }));
  },
  gameOver() {
    [7, 3, 0, -5].forEach((n, i) => tone(semi(392, n), 0.35, { type: 'triangle', vol: 0.16, delay: i * 0.16, lp: 2000 }));
    tone(98, 0.8, { type: 'sine', vol: 0.2, delay: 0.5, slide: 0.7 });
  },
  click() { tone(880, 0.05, { type: 'sine', vol: 0.12 }); },
  alarm() { [0, 0.18].forEach((d) => { tone(740, 0.14, { type: 'square', vol: 0.06, delay: d, lp: 3000 }); tone(988, 0.14, { type: 'square', vol: 0.04, delay: d + 0.07, lp: 3000 }); }); },
  stamp() { tone(160, 0.3, { type: 'sine', vol: 0.3, slide: 0.5 }); noise(0.2, { vol: 0.3, freq: 600, sweep: 0.3 }); [0, 7, 12].forEach((n, i) => tone(semi(784, n), 0.2, { type: 'triangle', vol: 0.14, delay: 0.05 + i * 0.05 })); },
  step(i) { tone(semi(392, i * 2), 0.14, { type: 'triangle', vol: 0.16 }); modal(semi(784, i * 2), { vol: 0.04 }); },
  tally() { modal(1568 + Math.random() * 200, { vol: 0.035, decays: [0.12, 0.08, 0.05, 0.03] }); },
  tick() { tone(660, 0.08, { type: 'sine', vol: 0.15 }); },
  go() { tone(990, 0.2, { type: 'triangle', vol: 0.18 }); tone(1485, 0.25, { type: 'sine', vol: 0.08, delay: 0.05 }); },
  tut() { tone(520, 0.12, { type: 'sine', vol: 0.12, slide: 1.5 }); },
};

// ---------- BGM: 타이틀 전용 루프 + 테마별 변주 5종 ----------
const THEME_MUSIC = [
  { bpm: 128, prog: [[45, 52, 57, 60, 64], [41, 48, 53, 57, 60], [48, 55, 60, 64, 67], [43, 50, 55, 59, 62]], arp: [1, 2, 3, 4, 3, 2, 4, 3], wave: 'square', lead: [0, 0, 2, 0, 3, 0, 2, 1] }, // 도시: 팝 Am-F-C-G
  { bpm: 120, prog: [[50, 57, 62, 65, 69], [48, 55, 60, 63, 67], [46, 53, 58, 62, 65], [45, 52, 57, 61, 64]], arp: [1, 3, 2, 4, 1, 3, 2, 4], wave: 'sawtooth', lead: [0, 1, 0, 3, 0, 2, 0, 1] }, // 사막: Dm 계열 이국풍
  { bpm: 132, prog: [[48, 55, 60, 64, 67], [45, 52, 57, 60, 64], [41, 48, 53, 57, 60], [43, 50, 55, 59, 62]], arp: [4, 3, 2, 1, 2, 3, 4, 3], wave: 'triangle', lead: [3, 0, 2, 0, 1, 0, 2, 0] }, // 설원: 반짝이는 C-Am-F-G
  { bpm: 140, prog: [[42, 49, 54, 57, 61], [40, 47, 52, 55, 59], [45, 52, 57, 61, 64], [44, 51, 56, 59, 63]], arp: [1, 2, 3, 4, 1, 2, 3, 4], wave: 'sawtooth', lead: [0, 0, 1, 0, 0, 2, 3, 0] }, // 네온: F#m 신스웨이브
  { bpm: 124, prog: [[43, 50, 55, 59, 62], [48, 55, 60, 64, 67], [50, 57, 62, 66, 69], [43, 50, 55, 59, 62]], arp: [1, 2, 4, 2, 3, 2, 4, 2], wave: 'square', lead: [0, 2, 0, 1, 0, 3, 0, 2] }, // 정글: G-C-D-G 퍼커션
];
const TITLE_MUSIC = { bpm: 100, prog: [[48, 55, 60, 64, 71], [45, 52, 57, 60, 67], [41, 48, 53, 57, 64], [43, 50, 55, 59, 65]], arp: [1, 3, 4, 3, 2, 3, 4, 3], wave: 'triangle' };
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
const cur = () => (track === 'title' ? TITLE_MUSIC : THEME_MUSIC[theme % THEME_MUSIC.length]);

let panL = null, panR = null, hatBus = null;
function musicNodes() {
  if (panL) return;
  // 스테레오 버스: 아르페지오/리드는 좌우 ±0.4, 하이햇은 8kHz 하이셸프로 밝게
  panL = ctx.createStereoPanner ? ctx.createStereoPanner() : ctx.createGain();
  panR = ctx.createStereoPanner ? ctx.createStereoPanner() : ctx.createGain();
  if (panL.pan) { panL.pan.value = -0.4; panR.pan.value = 0.4; }
  panL.connect(musicBus); panR.connect(musicBus);
  // 스테레오 핑퐁 딜레이 (좌 0.18초, 우 0.27초) 로 공간감
  if (ctx.createStereoPanner) {
    const send = ctx.createGain(); send.gain.value = 0.35;
    const dl = ctx.createDelay(1), dr = ctx.createDelay(1);
    dl.delayTime.value = 0.18; dr.delayTime.value = 0.27;
    const fb = ctx.createGain(); fb.gain.value = 0.28;
    const pl = ctx.createStereoPanner(), pr = ctx.createStereoPanner();
    pl.pan.value = -1; pr.pan.value = 1;
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 500;
    panL.connect(send); panR.connect(send);
    send.connect(hp); hp.connect(dl); dl.connect(pl); pl.connect(musicBus);
    dl.connect(dr); dr.connect(pr); pr.connect(musicBus); dr.connect(fb); fb.connect(dl);
  }
  const shelf = ctx.createBiquadFilter();
  shelf.type = 'highshelf'; shelf.frequency.value = 8000; shelf.gain.value = 9;
  hatBus = ctx.createGain(); hatBus.gain.value = 1;
  hatBus.connect(shelf); shelf.connect(musicBus);
}

function env(o, g, t, v, dur, bus = musicBus) {
  g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  o.connect(g); g.connect(bus); o.start(t); o.stop(t + dur + 0.02);
}

function hat(t, v, dur, freq = 7000, bus = hatBus) {
  const s2 = ctx.createBufferSource(); s2.buffer = noiseBuf;
  const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = freq;
  const g = ctx.createGain(); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
  s2.connect(f); f.connect(g); g.connect(bus); s2.start(t, Math.random() * 1.5); s2.stop(t + dur + 0.01);
}

function snare(t, v) {
  const s3 = ctx.createBufferSource(); s3.buffer = noiseBuf;
  const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 2200; f.Q.value = 0.6;
  const g = ctx.createGain(); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
  s3.connect(f); f.connect(g); g.connect(musicBus); s3.start(t, Math.random() * 1.5); s3.stop(t + 0.17);
  const o = ctx.createOscillator(); const g2 = ctx.createGain(); o.frequency.setValueAtTime(240, t); o.frequency.exponentialRampToValueAtTime(160, t + 0.08);
  env(o, g2, t, v * 0.3, 0.09);
}

// 8마디 구성: A(1~4마디) + B(5~8마디, 코드 진행 변형과 리드), 8마디 끝에 필인
function scheduleNote(t, s) {
  musicNodes();
  const M = cur();
  const bar8 = Math.floor(s / 16) % 8;
  const partB = bar8 >= 4;
  const bar = partB ? [2, 3, 0, 1][bar8 - 4] : bar8;
  const i = s % 16;
  const chord = M.prog[bar];
  const title = track === 'title';
  const fill = !title && bar8 === 7 && i >= 12;
  const pan = i % 2 === 0 ? panL : panR;
  // 킥 (저역 과다 방지로 낮춤)
  if (!fill && (!title ? i % 4 === 0 : i === 0 || i === 10)) {
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.frequency.setValueAtTime(140, t); o.frequency.exponentialRampToValueAtTime(50, t + 0.1);
    env(o, g, t, title ? 0.32 : 0.5, 0.14);
  }
  // 하이햇: 8분 오프비트 + 16분 고스트, B 파트는 오픈햇
  if (!title) {
    if (i % 2 === 1) hat(t, 0.2, partB && i % 4 === 3 ? 0.14 : 0.05);
    else hat(t, intensity > 0 || partB ? 0.09 : 0.06, 0.03, 9000);
  } else { hat(t, i % 4 === 2 ? 0.08 : 0.03, 0.04, 9000); }
  // 스네어 + 필인
  if (!title && (i === 4 || i === 12) && !fill) snare(t, 0.3);
  if (fill) snare(t, 0.14 + (i - 12) * 0.06);
  if (!title && theme === 4 && (i === 7 || i === 14 || i === 15)) {
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.frequency.setValueAtTime(i === 7 ? 260 : 190, t); o.frequency.exponentialRampToValueAtTime(110, t + 0.15);
    env(o, g, t, 0.25, 0.16);
  }
  // 베이스 (낮춤)
  if (title ? i % 8 === 0 : i % 2 === 0) {
    const n = chord[0] - 12 + (!title && i % 4 === 2 ? 12 : 0);
    const o = ctx.createOscillator(); const g = ctx.createGain(); const f = ctx.createBiquadFilter();
    o.type = title ? 'triangle' : 'sawtooth'; o.frequency.value = mtof(n);
    f.type = 'lowpass'; f.frequency.setValueAtTime(title ? 700 : 1400, t); f.frequency.exponentialRampToValueAtTime(260, t + 0.14);
    g.gain.setValueAtTime(title ? 0.2 : 0.18, t); g.gain.exponentialRampToValueAtTime(0.001, t + (title ? 0.7 : 0.16));
    o.connect(f); f.connect(g); g.connect(musicBus); o.start(t); o.stop(t + (title ? 0.72 : 0.18));
  }
  // 아르페지오: 2.5배, 좌우 교대 팬, 한 옥타브 위 더블링
  if (title ? i % 2 === 0 : intensity > 0 || i % 2 === 0 || partB) {
    const n = chord[M.arp[i % 8]] + 12;
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = M.wave; o.frequency.value = mtof(n);
    env(o, g, t, title ? 0.16 : 0.13, title ? 0.28 : 0.12, pan);
    const o2 = ctx.createOscillator(); const g2 = ctx.createGain();
    o2.type = 'triangle'; o2.frequency.value = mtof(n + 12);
    env(o2, g2, t, title ? 0.05 : 0.05, 0.09, pan === panL ? panR : panL);
  }
  // 리드 멜로디: B 파트에서 연주, 2.5배
  if (!title && M.lead && (partB || intensity > 1) && i % 2 === 0) {
    const n = chord[1 + M.lead[(i / 2) % 8]] + 24;
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type = 'triangle'; o.frequency.value = mtof(n);
    o.detune.value = 6;
    env(o, g, t, 0.11, 0.2, (i / 2) % 2 ? panL : panR);
  }
  // 코드 패드 (마디 시작)
  if (i === 0) {
    for (const [k, n] of chord.slice(1).entries()) {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = mtof(n + 12);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(title ? 0.035 : 0.025, t + 0.3); g.gain.exponentialRampToValueAtTime(0.001, t + 1.8);
      o.connect(g); g.connect(k % 2 ? panL : panR); o.start(t); o.stop(t + 1.9);
    }
  }
}

function scheduler() {
  if (!ctx || !musicOn) return;
  while (nextNoteTime < ctx.currentTime + 0.12) {
    if (pending && nextNoteTime >= pending.at) { track = pending.kind; theme = pending.theme; step = 0; pending = null; }
    const spb = 60 / cur().bpm / 4;
    if (!musicMuted) scheduleNote(nextNoteTime, step);
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

// 곡 전환: 'title' 또는 'run' + 테마 번호
// 곡 전환: 반 마디 페이드아웃 → 곡 교체 → 반 마디 페이드인 (1마디 크로스페이드, 오디오 클록 기준)
export function setMusic(kind, themeIdx = 0) {
  if (kind === track && themeIdx === theme && !pending) return;
  if (!ctx || !musicOn) { track = kind; theme = themeIdx; step = 0; pending = null; return; }
  const half = (60 / cur().bpm) * 2;
  const t = ctx.currentTime;
  xfade.gain.cancelScheduledValues(t);
  xfade.gain.setValueAtTime(xfade.gain.value, t);
  xfade.gain.linearRampToValueAtTime(0.0001, t + half);
  xfade.gain.linearRampToValueAtTime(1, t + half * 2);
  pending = { kind, theme: themeIdx, at: t + half };
}

export function setIntensity(v) { intensity = v; }
