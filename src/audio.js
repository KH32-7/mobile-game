// WebAudio 합성 효과음 + 절차적 BGM
// 구조: sfx 버스 -> (드라이 + 절차적 리버브 센드) -> 마스터 컴프레서
//       music 버스 -> 로우패스(레벨업 필터) -> 덕킹 게인 -> 마스터
let ctx = null;
let master = null;
let sfx = null;
let music = null;
let musicFilter = null;
let musicDuck = null;
let revSend = null;
let noiseBuf = null;
let muted = false;
let lastPop = 0;
let volMusic = 0.7;
let volSfx = 0.9;

let tOff = 0; // 오프라인 계측용 시간 오프셋
let outGain = null;
const now = () => ctx.currentTime + tOff;
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

function env(g, t, a, peak, d) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + a);
  g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
}

function tone(type, f0, f1, dur, vol, dest = sfx, when = 0, attack = 0.004) {
  if (!ctx) return;
  const t = now() + when;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f0, t);
  if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
  env(g, t, attack, vol, dur);
  o.connect(g).connect(dest);
  o.start(t);
  o.stop(t + dur + attack + 0.05);
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
  env(g, t, 0.004, vol, dur);
  s.connect(f).connect(g).connect(dest);
  s.start(t, Math.random() * 0.5);
  s.stop(t + dur + 0.05);
}

// 노이즈 임펄스 응답 (스테레오, 지수 감쇠)
function makeImpulse(sec = 2.2, decay = 3.2) {
  const len = Math.floor(ctx.sampleRate * sec);
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < len; i++) {
      const k = i / len;
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - k, decay) * (i < 90 ? i / 90 : 1);
    }
  }
  return buf;
}

// 배경음 덕킹 (큰 효과음 순간 음악을 잠깐 낮춤)
function duck(amount = 0.45, hold = 0.35) {
  if (!ctx) return;
  const t = now();
  const p = musicDuck.gain;
  p.cancelScheduledValues(t);
  p.setValueAtTime(p.value, t);
  p.linearRampToValueAtTime(1 - amount, t + 0.03);
  p.setTargetAtTime(1, t + hold, 0.25);
}

// ---------- BGM ----------
const MODES = {
  normal: {
    bpm: 112,
    prog: [
      [45, 57, 60, 64],
      [41, 53, 57, 60],
      [48, 55, 60, 64],
      [43, 55, 59, 62],
    ],
    lead: false,
  },
  boss: {
    bpm: 132,
    prog: [
      [38, 50, 53, 57],
      [46, 50, 53, 58],
      [43, 50, 55, 58],
      [45, 49, 52, 57],
    ],
    lead: true,
  },
};
let mode = 'normal';
let seqTimer = null;
let nextTime = 0;
let step = 0;

function scheduleStep(s, t) {
  const M = MODES[mode === 'boss' ? 'boss' : 'normal'];
  const STEP = 60 / M.bpm / 4;
  const bar = Math.floor(s / 16) % 4;
  const st = s % 16;
  const ch = M.prog[bar];
  const boss = M.lead;
  // 킥 (피치 드롭)
  if (st % 4 === 0 || (boss && st === 10)) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.setValueAtTime(150, t);
    o.frequency.exponentialRampToValueAtTime(42, t + 0.14);
    env(g, t, 0.002, 0.26, 0.18);
    o.connect(g).connect(music);
    o.start(t);
    o.stop(t + 0.3);
    // 폰 스피커용 중역 노크 + 클릭
    const k2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    k2.type = 'triangle';
    k2.frequency.setValueAtTime(420, t);
    k2.frequency.exponentialRampToValueAtTime(180, t + 0.06);
    env(g2, t, 0.001, 0.32, 0.08);
    k2.connect(g2).connect(music);
    k2.start(t);
    k2.stop(t + 0.12);
  }
  // 스네어
  if (st === 4 || st === 12) {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuf;
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = 1800;
    const g = ctx.createGain();
    env(g, t, 0.002, 0.16, 0.14);
    src.connect(f).connect(g).connect(music);
    src.start(t, Math.random());
    src.stop(t + 0.2);
  }
  // 하이햇
  if (st % 2 === 1 || boss) {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuf;
    const f = ctx.createBiquadFilter();
    f.type = 'highpass';
    f.frequency.value = 7500;
    const g = ctx.createGain();
    env(g, t, 0.002, st % 2 ? 0.07 : 0.035, 0.035);
    src.connect(f).connect(g).connect(music);
    src.start(t, Math.random());
    src.stop(t + 0.08);
  }
  // 베이스
  if (st % 4 === 0 || st === 14 || (boss && st % 2 === 0)) {
    const o = ctx.createOscillator();
    const f = ctx.createBiquadFilter();
    const g = ctx.createGain();
    o.type = 'sawtooth';
    o.frequency.value = mtof(ch[0] - 12 + (st === 14 ? 12 : 0));
    f.type = 'lowpass';
    f.frequency.setValueAtTime(boss ? 1800 : 1400, t);
    f.frequency.exponentialRampToValueAtTime(450, t + STEP * 2);
    env(g, t, 0.01, 0.16, STEP * (boss ? 1.6 : 3));
    o.connect(f).connect(g).connect(music);
    o.start(t);
    o.stop(t + STEP * 4);
    // 베이스 배음 (한 옥타브 + 5도 위, 250~800Hz 대역)
    const o2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    o2.type = 'square';
    o2.frequency.value = mtof(ch[0] + 12 + (st === 14 ? 12 : 0));
    const f2 = ctx.createBiquadFilter();
    f2.type = 'bandpass';
    f2.frequency.value = 500;
    f2.Q.value = 0.8;
    env(g2, t, 0.01, 0.1, STEP * (boss ? 1.4 : 2.5));
    o2.connect(f2).connect(g2).connect(music);
    o2.start(t);
    o2.stop(t + STEP * 4);
  }
  // 아르페지오
  const arp = [1, 2, 3, 2, 1, 3, 2, 3];
  if (st % 2 === 0) {
    const n = ch[arp[(st >> 1) % 8]] + 12;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'triangle';
    o.frequency.value = mtof(n);
    env(g, t, 0.005, 0.065, STEP * 1.6);
    o.connect(g).connect(music);
    o.start(t);
    o.stop(t + STEP * 2);
  }
  // 보스 리드
  if (boss && (st === 0 || st === 6 || st === 8 || st === 11)) {
    const o = ctx.createOscillator();
    const f = ctx.createBiquadFilter();
    const g = ctx.createGain();
    o.type = 'square';
    o.frequency.value = mtof(ch[[3, 2, 3, 1][st % 4]] + 12);
    f.type = 'lowpass';
    f.frequency.value = 2200;
    env(g, t, 0.01, 0.05, STEP * 2.5);
    o.connect(f).connect(g).connect(music);
    o.start(t);
    o.stop(t + STEP * 3);
  }
  // 패드 (마디 시작, 디튠 두 겹)
  if (st === 0) {
    for (const m of ch.slice(1)) {
      for (const det of [-6, 6]) {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sawtooth';
        o.frequency.value = mtof(m);
        o.detune.value = det;
        const f = ctx.createBiquadFilter();
        f.type = 'lowpass';
        f.frequency.value = 900;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.linearRampToValueAtTime(0.012, t + 0.5);
        g.gain.linearRampToValueAtTime(0.0001, t + STEP * 16);
        o.connect(f).connect(g).connect(music);
        o.start(t);
        o.stop(t + STEP * 16 + 0.1);
      }
    }
  }
  return STEP;
}

// 노드 그래프 구성 (실시간/오프라인 공용)
// 마스터: 컴프레서 -> 메이크업 게인 -> 리미터(-3dBFS 근처)
function build(c) {
  ctx = c;
  master = ctx.createGain();
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -20;
  comp.knee.value = 10;
  comp.ratio.value = 5;
  comp.attack.value = 0.003;
  comp.release.value = 0.18;
  outGain = ctx.createGain();
  outGain.gain.value = 1.2;
  const lim = ctx.createDynamicsCompressor();
  lim.threshold.value = -10;
  lim.knee.value = 0;
  lim.ratio.value = 20;
  lim.attack.value = 0.001;
  lim.release.value = 0.08;
  master.connect(comp).connect(outGain).connect(lim).connect(ctx.destination);
  noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 1.5, ctx.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const conv = ctx.createConvolver();
  conv.buffer = makeImpulse();
  const revOut = ctx.createGain();
  revOut.gain.value = 0.5;
  conv.connect(revOut).connect(master);
  revSend = ctx.createGain();
  revSend.gain.value = 0.25;
  revSend.connect(conv);
  sfx = ctx.createGain();
  sfx.connect(master);
  sfx.connect(revSend);
  music = ctx.createGain();
  musicFilter = ctx.createBiquadFilter();
  musicFilter.type = 'lowpass';
  musicFilter.frequency.value = 18000;
  // BGM 저역 정리 (폰 스피커): 60Hz 이하 컷
  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 90;
  musicDuck = ctx.createGain();
  music.connect(hp).connect(musicFilter).connect(musicDuck).connect(master);
  const mSend = ctx.createGain();
  mSend.gain.value = 0.12;
  musicDuck.connect(mSend).connect(conv);
  applyVolumes();
}

function applyVolumes() {
  if (!ctx) return;
  const t = now();
  master.gain.setTargetAtTime(muted ? 0 : 0.9, t, 0.02);
  sfx.gain.setTargetAtTime(volSfx, t, 0.02);
  music.gain.setTargetAtTime(volMusic * 0.42, t, 0.02);
}

export const Audio = {
  init() {
    if (ctx) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      build(new AC());
    } catch (e) {
      ctx = null;
    }
  },
  resume() {
    if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
  },
  suspend() {
    if (ctx && ctx.state === 'running') ctx.suspend().catch(() => {});
  },
  setMuted(m) {
    muted = m;
    applyVolumes();
  },
  get muted() {
    return muted;
  },
  setVolumes(m, s) {
    volMusic = m;
    volSfx = s;
    applyVolumes();
  },
  startMusic() {
    if (!ctx || seqTimer) return;
    nextTime = ctx.currentTime + 0.1;
    step = 0;
    seqTimer = setInterval(() => {
      if (!ctx || ctx.state !== 'running') return;
      if (nextTime < ctx.currentTime) nextTime = ctx.currentTime + 0.05;
      while (nextTime < ctx.currentTime + 0.12) {
        nextTime += scheduleStep(step, nextTime);
        step++;
      }
    }, 25);
  },
  stopMusic() {
    clearInterval(seqTimer);
    seqTimer = null;
  },
  // 일시정지: 스케줄러 정지 + 오디오 컨텍스트 정지
  pauseMusic() {
    this.stopMusic();
    this.suspend();
  },
  resumeMusic() {
    this.startMusic();
  },
  // normal / boss / levelup (레벨업 중엔 로우패스로 먹먹하게)
  setMusicMode(m) {
    if (m === 'levelup') {
      if (musicFilter) musicFilter.frequency.setTargetAtTime(650, now(), 0.08);
      return;
    }
    if (m === 'boss' && mode !== 'boss') step = 0;
    mode = m;
    if (musicFilter) musicFilter.frequency.setTargetAtTime(18000, now(), 0.15);
  },
  get mode() {
    return mode;
  },
  // 삼키기 팝: 크기가 클수록 낮고 두꺼움, 콤보가 이어질수록 높아짐
  pop(size, combo) {
    if (!ctx) return;
    const t = performance.now();
    if (t - lastPop < 28) return;
    lastPop = t;
    const rnd = 1 + (Math.random() - 0.5) * 0.12;
    const base = 820 / (0.55 + size * 0.75);
    const f = Math.min(2400, base * Math.pow(1.045, Math.min(combo, 24)) * rnd);
    tone('sine', f, f * 0.45, 0.12 + Math.min(0.25, size * 0.05), 0.65);
    tone('triangle', f * 1.5, f * 0.8, 0.06, 0.2);
    noise(0.02, 0.2, 3500, 0.7, 'highpass');
    if (size > 0.5) {
      const lf = Math.max(45, 230 - size * 28) * rnd;
      tone('sine', lf, lf * 0.55, 0.16 + size * 0.05, 0.28 * Math.min(1, size / 2), sfx, 0, 0.006);
      // 저역 몸통의 중역 배음 (폰 스피커에서도 들리게)
      tone('triangle', lf * 3.2, lf * 1.8, 0.14 + size * 0.04, 0.16 * Math.min(1, size / 1.5), sfx, 0, 0.004);
    }
    if (size > 1.8) {
      // 서브베이스 쿵 + 럼블 + 250~800Hz 배음
      tone('sine', 62, 30, 0.55, 0.14, sfx, 0, 0.005);
      tone('triangle', 330, 150, 0.35, 0.3, sfx, 0, 0.003);
      tone('square', 500 * rnd, 260, 0.12, 0.08, sfx, 0, 0.002);
      noise(0.75, 0.08, 170, 0.8, 'lowpass', sfx, 50);
      noise(0.3, 0.18, 450, 1.2, 'bandpass', sfx, 250);
      duck(0.45, 0.35);
    }
  },
  hit() {
    noise(0.07, 0.6, 2500, 2, 'bandpass');
    tone('square', 360 * (0.9 + Math.random() * 0.2), 180, 0.08, 0.45);
  },
  hurt() {
    tone('sawtooth', 420, 110, 0.28, 0.28);
    tone('square', 620, 300, 0.12, 0.08);
    tone('sine', 90, 40, 0.3, 0.12);
    noise(0.22, 0.28, 900, 1, 'lowpass', sfx, 200);
    duck(0.35, 0.2);
  },
  zap() {
    noise(0.18, 0.5, 5000, 4, 'bandpass', sfx, 1500);
    tone('square', 1300, 280, 0.12, 0.2);
    tone('sawtooth', 2400 * (0.9 + Math.random() * 0.2), 900, 0.05, 0.12);
  },
  shoot() {
    tone('square', 520 * (0.9 + Math.random() * 0.2), 180, 0.1, 0.4);
    noise(0.04, 0.35, 1800, 1, 'bandpass');
  },
  pulse() {
    tone('sine', 190, 55, 0.45, 0.18);
    tone('triangle', 520, 220, 0.3, 0.12);
    noise(0.4, 0.08, 700, 1, 'lowpass', sfx, 90);
  },
  whoosh(v = 1) {
    noise(0.35, 0.22 * v, 300, 2, 'bandpass', sfx, 3000);
  },
  boom(v = 1) {
    noise(0.9 * v, 0.12, 1400, 1, 'lowpass', sfx, 50);
    tone('sine', 95, 28, 0.7 * v, 0.1, sfx, 0, 0.004);
    tone('triangle', 380, 140, 0.3, 0.3);
    noise(0.4, 0.25, 600, 1, 'bandpass', sfx, 250);
    duck(0.6, 0.5);
  },
  levelUp() {
    [0, 4, 7, 12, 16].forEach((s, i) => {
      tone('triangle', mtof(72 + s), mtof(72 + s), 0.22, 0.09, sfx, i * 0.06);
      tone('sine', mtof(84 + s), mtof(84 + s), 0.15, 0.03, sfx, i * 0.06 + 0.01);
    });
    duck(0.4, 0.4);
  },
  evolve() {
    tone('sawtooth', 110, 880, 0.8, 0.07);
    [0, 4, 7, 11, 14, 19].forEach((s, i) => tone('triangle', mtof(64 + s), mtof(64 + s), 0.6, 0.07, sfx, 0.3 + i * 0.05));
    noise(1.0, 0.1, 6000, 1, 'highpass', sfx, 12000, 0.3);
    duck(0.7, 1.0);
  },
  sizeUp() {
    [0, 7, 12, 19].forEach((s, i) => tone('sawtooth', mtof(55 + s), mtof(55 + s), 0.25, 0.07, sfx, i * 0.05));
    tone('sine', 140, 330, 0.5, 0.12);
    duck(0.4, 0.4);
  },
  coin() {
    tone('square', 1320 * (0.95 + Math.random() * 0.1), 1320, 0.06, 0.12);
    tone('square', 1760, 1760, 0.1, 0.1, sfx, 0.05);
  },
  select() {
    tone('sine', 900, 1300, 0.09, 0.5);
    tone('triangle', 450, 650, 0.08, 0.3);
  },
  warn() {
    for (let i = 0; i < 3; i++) {
      tone('square', 440, 440, 0.25, 0.09, sfx, i * 0.6);
      tone('square', 330, 330, 0.25, 0.09, sfx, i * 0.6 + 0.3);
    }
  },
  win() {
    [0, 4, 7, 12, 16, 19, 24].forEach((s, i) => tone('triangle', mtof(64 + s), mtof(64 + s), 0.35, 0.16, sfx, i * 0.09));
    duck(0.8, 1.5);
  },
  // OfflineAudioContext 로 렌더해 피크/RMS/대역 비중을 계측 (스모크 테스트용)
  async measure() {
    const saved = { ctx, master, sfx, music, musicFilter, musicDuck, revSend, noiseBuf, outGain, mode, lastPop, muted };
    const SR = 44100;
    const OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    const render = async (sec, fn) => {
      build(new OAC(2, Math.floor(SR * sec), SR));
      muted = false;
      applyVolumes();
      master.gain.value = 0.9;
      sfx.gain.value = volSfx;
      music.gain.value = volMusic * 0.42;
      fn();
      return ctx.startRendering();
    };
    const stat = (buf) => {
      let peak = 0;
      const ch = [buf.getChannelData(0), buf.getChannelData(1)];
      for (const c of ch) for (let i = 0; i < c.length; i++) peak = Math.max(peak, Math.abs(c[i]));
      // 활성 구간 RMS: 10ms 블록 중 가장 큰 블록 대비 -20dB 이내 블록만 평균 (리버브 꼬리 제외)
      const B = Math.floor(SR * 0.01);
      const blocks = [];
      for (let o = 0; o + B <= ch[0].length; o += B) {
        let e = 0;
        for (let i = o; i < o + B; i++) e += (ch[0][i] ** 2 + ch[1][i] ** 2) / 2;
        blocks.push(e / B);
      }
      const mx = Math.max(...blocks);
      const act = blocks.filter((e) => e > mx * 0.01);
      const rms = Math.sqrt(act.reduce((a, b) => a + b, 0) / Math.max(1, act.length));
      return { peakDb: +(20 * Math.log10(peak + 1e-9)).toFixed(1), rmsDb: +(20 * Math.log10(rms + 1e-9)).toFixed(1), dur: +((act.length * B) / SR).toFixed(2) };
    };
    const lowRatio = (buf) => {
      const x = buf.getChannelData(0);
      const N = 8192;
      const re = new Float64Array(N);
      const im = new Float64Array(N);
      let low = 0;
      let all = 0;
      for (let off = 0; off + N <= x.length; off += N) {
        for (let i = 0; i < N; i++) {
          re[i] = x[off + i] * (0.5 - 0.5 * Math.cos((2 * Math.PI * i) / N));
          im[i] = 0;
        }
        for (let i = 1, j = 0; i < N; i++) {
          let bit = N >> 1;
          for (; j & bit; bit >>= 1) j ^= bit;
          j ^= bit;
          if (i < j) {
            [re[i], re[j]] = [re[j], re[i]];
          }
        }
        for (let len = 2; len <= N; len <<= 1) {
          const a = (-2 * Math.PI) / len;
          for (let i = 0; i < N; i += len) {
            for (let k = 0; k < len / 2; k++) {
              const wr = Math.cos(a * k);
              const wi = Math.sin(a * k);
              const ur = re[i + k];
              const ui = im[i + k];
              const vr = re[i + k + len / 2] * wr - im[i + k + len / 2] * wi;
              const vi = re[i + k + len / 2] * wi + im[i + k + len / 2] * wr;
              re[i + k] = ur + vr;
              im[i + k] = ui + vi;
              re[i + k + len / 2] = ur - vr;
              im[i + k + len / 2] = ui - vi;
            }
          }
        }
        for (let b = 1; b < N / 2; b++) {
          const f = (b * SR) / N;
          if (f < 20) continue;
          const p = re[b] * re[b] + im[b] * im[b];
          all += p;
          if (f < 150) low += p;
        }
      }
      return all ? +(low / all).toFixed(3) : 0;
    };
    const out = { sfx: {} };
    const tests = {
      pop_small: () => this.pop(0.3, 1),
      pop_mid: () => this.pop(1.2, 6),
      pop_big: () => this.pop(3, 1),
      hurt: () => this.hurt(),
      boom: () => this.boom(1),
      levelUp: () => this.levelUp(),
      sizeUp: () => this.sizeUp(),
      zap: () => this.zap(),
      shoot: () => this.shoot(),
      pulse: () => this.pulse(),
      evolve: () => this.evolve(),
      hit: () => this.hit(),
      coin: () => this.coin(),
      select: () => this.select(),
    };
    try {
      for (const [k, fn] of Object.entries(tests)) {
        lastPop = 0;
        const b = await render(1.6, fn);
        out.sfx[k] = { ...stat(b), low: lowRatio(b) };
      }
      // BGM 단독 (일반/보스)
      for (const m of ['normal', 'boss']) {
        const b = await render(8.2, () => {
          mode = m;
          let t = 0.05;
          let st = 0;
          while (t < 8) t += scheduleStep(st++, t);
        });
        out['bgm_' + m] = { ...stat(b), low: lowRatio(b) };
      }
      // 실제 믹스: BGM + 연속 팝 + 큰 이벤트
      const b = await render(8.2, () => {
        mode = 'normal';
        let t = 0.05;
        let st = 0;
        while (t < 8) t += scheduleStep(st++, t);
        for (let i = 0; i < 20; i++) {
          tOff = 0.2 + i * 0.35;
          lastPop = -1e9;
          this.pop(0.4 + (i % 5) * 0.5, i);
        }
        tOff = 2;
        this.boom(1);
        tOff = 4;
        this.hurt();
        tOff = 5.5;
        this.levelUp();
        tOff = 0;
      });
      out.mix = { ...stat(b), low: lowRatio(b) };
    } finally {
      tOff = 0;
      ({ ctx, master, sfx, music, musicFilter, musicDuck, revSend, noiseBuf, outGain, mode, lastPop, muted } = saved);
    }
    return out;
  },
  lose() {
    [12, 7, 3, 0].forEach((s, i) => tone('triangle', mtof(57 + s), mtof(57 + s), 0.4, 0.16, sfx, i * 0.16));
    tone('sine', 110, 30, 1.2, 0.4, sfx, 0.5);
  },
};
