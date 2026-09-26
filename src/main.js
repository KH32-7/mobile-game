// 진입점: 루프, 입력, 화면 흐름
import { CONFIG, DEBUG, SEED_PARAM } from './config.js';
import { Game } from './game.js';
import { Renderer, computeLayout, GEM_COLOR } from './render.js';
import { FX } from './fx.js';
import { UI } from './ui.js';
import { effectLabel, fmt } from './jokers.js';
import { initAudio, sfx, setMuted, isMuted, startBgm, suspendAudio, resumeAudio } from './audio.js';
import { load, save } from './storage.js';

const canvas = document.getElementById('cv');
const renderer = new Renderer(canvas);
const game = new Game();
const rec = load();
setMuted(!!rec.muted);

const app = {
  game,
  fx: new FX(),
  drag: null,
  clearing: [],
  bubbles: [],
  jokerBounce: [],
  trayAnim: [1, 1, 1],
  fitCache: [true, true, true],
  calc: { active: false, chips: 0, mult: 0, label: '', labelAlpha: 0, chipsPulse: 0, multPulse: 0, showTotal: 0, totalShown: 0 },
  shownScore: 0,
  scoreHold: 0,
  scorePulse: 0,
  coinPulse: 0,
  banner: null,
  tutorial: false,
  hit: {},
  inRun: false,
  paused: false,
  locked: false,
  seq: null,
  timers: [],
  gemFlash: null,
};
let L = null;
let time = 0;

// ---------- 레이아웃 ----------
const safeProbe = document.createElement('div');
safeProbe.style.cssText = 'position:fixed;left:0;top:0;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top) 0 env(safe-area-inset-bottom) 0;';
document.body.appendChild(safeProbe);

function resize() {
  const vw = window.innerWidth, vh = window.innerHeight;
  const cs = getComputedStyle(safeProbe);
  const safe = { top: parseFloat(cs.paddingTop) || 0, bottom: parseFloat(cs.paddingBottom) || 0 };
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  L = computeLayout(vw, vh, safe);
  renderer.resize(vw, vh, dpr, L);
}
window.addEventListener('resize', resize);
resize();

// ---------- 유틸 ----------
const vibrate = (ms) => { try { if (navigator.vibrate) navigator.vibrate(ms); } catch { /* 무시 */ } };
const later = (t, fn) => app.timers.push({ t, fn });
function refreshFit() {
  for (let i = 0; i < 3; i++) {
    const p = game.tray[i];
    app.fitCache[i] = !!p && !p.hidden && game.fitsAnywhere(p.shape);
  }
}
function banner(title, sub, color, life = 1.6) { app.banner = { title, sub, color, t: 0, life }; }
function saveRec() { rec.muted = isMuted(); save(rec); }

// ---------- UI 콜백 ----------
const ui = new UI({
  start: () => startRun(),
  resume: () => resume(),
  restart: () => startRun(),
  toTitle: () => toTitle(),
  toggleMute: () => {
    setMuted(!isMuted()); saveRec();
    if (ui.current === 'title') ui.showTitle(rec, isMuted(), SEED_PARAM);
    else if (ui.current === 'pause') ui.showPause(isMuted());
  },
  buy: (i) => { if (game.buy(i)) { sfx.buy(); vibrate(15); app.coinPulse = 1; ui.showShop(game); } },
  sell: (i) => { if (game.sell(i)) { sfx.sell(); app.coinPulse = 1; ui.showShop(game); } },
  reroll: () => { if (game.reroll()) { sfx.click(); ui.showShop(game); } else sfx.invalid(); },
  move: (a, b) => { game.moveJoker(a, b); sfx.click(); },
  denied: () => sfx.invalid(),
  next: () => { sfx.click(); game.nextRound(); ui.hideAll(); beginRound(); },
  endless: () => { sfx.click(); game.continueEndless(); ui.showShop(game); },
});

function startRun() {
  initAudio();
  startBgm();
  const seed = SEED_PARAM || Math.random().toString(36).slice(2, 10);
  game.newRun(seed);
  app.inRun = true;
  app.paused = false;
  app.fx.clear();
  app.bubbles = []; app.clearing = []; app.jokerBounce = [];
  ui.hideAll();
  if (!rec.tutorialDone) app.tutorial = true;
  beginRound();
}

function beginRound() {
  app.shownScore = 0; app.scoreHold = 0;
  app.locked = false; app.seq = null; app.drag = null;
  app.calc.active = false; app.calc.showTotal = 0; app.calc.labelAlpha = 0;
  app.timers = [];
  app.trayAnim = [-0.0, -0.12, -0.24];
  refreshFit();
  if (game.ante > rec.bestAnte) { rec.bestAnte = game.ante; saveRec(); }
  if (game.blind === 2) {
    banner('보스: ' + game.bossDef.name, game.bossDef.desc, game.bossDef.color, 2.4);
    sfx.boss(); vibrate(40);
    app.fx.shake(6, 0.4);
  } else {
    banner(game.blindName, `목표 ${fmt(game.target)}`, game.blind === 1 ? '#ffb627' : '#36c9ff', 1.4);
    sfx.newTray();
  }
}

function toTitle() {
  app.inRun = false;
  app.paused = false;
  game.phase = 'title';
  app.drag = null;
  ui.showTitle(rec, isMuted(), SEED_PARAM);
}

function pause() {
  if (!app.inRun || app.paused || game.phase !== 'play') return;
  app.paused = true;
  app.drag = null;
  ui.showPause(isMuted());
}
function resume() { app.paused = false; ui.hide('pause'); }

// ---------- 배치 + 점수 연출 ----------
function doPlace(i, r, c) {
  const res = game.place(i, r, c);
  if (!res) return false;
  if (app.tutorial) { app.tutorial = false; rec.tutorialDone = true; saveRec(); }
  const cell = L.cell;
  sfx.place(res.piece.size);
  vibrate(8);
  const cx = L.board.x + (c + res.piece.w / 2) * cell, cy = L.board.y + (r + res.piece.h / 2) * cell;
  app.fx.pop(cx, cy, '+' + res.placePts, '#b5f5d6', 16, 0.7, -50);
  for (const b of res.bubbles) addBubble(b.idx, b.text, '#8f6bff');
  if (res.comboBroken) app.fx.pop(L.calc.x + L.calc.w / 2, L.calc.y + L.calc.h / 2, '콤보 끊김', '#ff8fa3', 16, 0.9);
  if (res.cleared) {
    for (const cl of res.cleared.cells) {
      app.clearing.push({ r: cl.r, c: cl.c, color: cl.color, t: 0, life: 0.28 });
      const x = L.board.x + (cl.c + 0.5) * cell, y = L.board.y + (cl.r + 0.5) * cell;
      app.fx.burst(x, y, cl.color, 4, 240, cell * 0.28);
      if (cl.broken) { app.fx.burst(x, y, 3, 10, 320, cell * 0.2); app.fx.ring(x, y, '#9ff0ff', cell); later(0.1, () => sfx.glass()); }
    }
    const lines = res.cleared.rows.length + res.cleared.cols.length;
    for (const rr of res.cleared.rows) app.fx.ring(L.board.x + L.board.w / 2, L.board.y + (rr + 0.5) * cell, 'rgba(255,255,255,0.8)', L.board.w * 0.45);
    for (const cc of res.cleared.cols) app.fx.ring(L.board.x + (cc + 0.5) * cell, L.board.y + L.board.h / 2, 'rgba(255,255,255,0.8)', L.board.h * 0.45);
    sfx.clear(lines, res.combo);
    vibrate(lines > 1 ? [20, 30, 20] : 20);
    app.fx.shake(2 + lines * 2.5, 0.25);
    if (lines >= 2) app.fx.hitstop(0.05 + lines * 0.02);
    startSeq(res);
  } else {
    afterPlace();
  }
  refreshFit();
  return true;
}

function addBubble(idx, text, color) {
  app.bubbles = app.bubbles.filter((b) => b.idx !== idx);
  app.bubbles.push({ idx, text, color, t: 0, life: 1.0 });
  app.jokerBounce[idx] = 0;
}

function startSeq(res) {
  app.locked = true;
  app.scoreHold = res.total;
  const base = res.steps[0];
  const k = app.calc;
  k.active = true; k.chips = base.chips; k.mult = base.mult; k.chipsPulse = 1; k.multPulse = 1; k.showTotal = 0;
  let label = `${base.lines}줄 제거`;
  if (res.combo >= 2) label += ` · 콤보 ${res.combo}`;
  k.label = label; k.labelAlpha = 1;
  const n = res.steps.length - 1;
  app.seq = { res, i: 1, timer: 0.38, stepDur: n > 10 ? 0.12 : n > 5 ? 0.2 : 0.28, stage: 'steps', tick: 0 };
}

function runStep(step, i) {
  const k = app.calc;
  const e = step.e;
  const cell = L.cell;
  if (e.t === 'chips') k.chipsPulse = 1; else if (e.t !== 'coins') k.multPulse = 1;
  k.chips = step.chips; k.mult = step.mult;
  const col = e.t === 'chips' ? '#36c9ff' : e.t === 'coins' ? '#ffd23f' : '#ff4d6d';
  if (step.kind === 'gem') {
    const x = L.board.x + (step.c + 0.5) * cell, y = L.board.y + (step.r + 0.5) * cell;
    app.fx.pop(x, y - cell * 0.3, effectLabel(e), col, 15, 0.8);
    app.fx.ring(x, y, GEM_COLOR[step.gem], cell * 0.8);
    app.gemFlash = { r: step.r, c: step.c, gem: step.gem };
    if (e.t === 'xmult') sfx.xmult(); else if (e.t === 'chips') sfx.chips(i); else sfx.mult(i);
  } else if (step.kind === 'joker') {
    addBubble(step.idx, effectLabel(e), e.t === 'chips' ? '#1a7fe0' : e.t === 'coins' ? '#c98a00' : e.t === 'xmult' ? '#c0102f' : '#e0304f');
    if (e.t === 'xmult') { sfx.xmult(); app.fx.shake(4, 0.15); } else sfx.joker(i);
    if (e.t === 'coins') app.coinPulse = 1;
    vibrate(6);
  }
}

function updateSeq(dt) {
  const s = app.seq;
  if (!s) return;
  const k = app.calc;
  s.timer -= dt;
  if (s.stage === 'steps') {
    if (s.timer > 0) return;
    const steps = s.res.steps;
    if (s.i < steps.length) {
      runStep(steps[s.i], s.i);
      s.i++;
      s.timer = s.stepDur;
      return;
    }
    // 합계
    app.gemFlash = null;
    s.stage = 'total';
    s.timer = 0.55;
    s.t = 0;
    k.showTotal = 1; k.totalShown = 0;
    sfx.total();
    const total = s.res.total;
    const big = total >= game.target * 0.35 || total >= 5000;
    app.fx.shake(big ? 14 : 5, big ? 0.45 : 0.2);
    if (big) { app.fx.hitstop(0.12); app.fx.flash = 1; vibrate([30, 20, 50]); }
    return;
  }
  if (s.stage === 'total') {
    s.t += dt;
    const p = Math.min(1, s.t / 0.35);
    const target = s.res.total;
    const prev = k.totalShown;
    k.totalShown = Math.floor(target * (1 - Math.pow(1 - p, 3)));
    if (Math.floor(prev / Math.max(1, target / 8)) !== Math.floor(k.totalShown / Math.max(1, target / 8))) sfx.tick(s.tick++);
    if (s.timer > 0) return;
    k.totalShown = target;
    app.scoreHold = 0;
    app.scorePulse = 1;
    if (s.res.total > rec.bestHit) { rec.bestHit = s.res.total; saveRec(); }
    s.stage = 'fade';
    s.timer = 0.35;
    return;
  }
  if (s.stage === 'fade') {
    k.showTotal = Math.max(0, s.timer / 0.35);
    if (s.timer > 0) return;
    k.showTotal = 0;
    k.active = false;
    app.seq = null;
    app.locked = false;
    afterPlace();
  }
}

function afterPlace() {
  const r = game.resolve();
  refreshFit();
  if (r === 'roundClear') {
    app.locked = true;
    sfx.roundClear();
    vibrate([20, 40, 20, 40, 60]);
    banner('라운드 클리어!', `${fmt(game.roundScore)} 점`, '#3ddc97', 1.4);
    app.fx.flash = 0.8;
    for (let i = 0; i < 24; i++) app.fx.burst(L.board.x + Math.random() * L.board.w, L.board.y + Math.random() * L.board.h, i % 7, 3, 300, L.cell * 0.3);
    if (game.runBestHit > rec.bestHit) rec.bestHit = game.runBestHit;
    if (game.phase === 'victory') rec.wins = (rec.wins || 0) + 1;
    saveRec();
    later(1.5, () => {
      app.locked = false;
      if (game.phase === 'victory') ui.showVictory(game, rec);
      else ui.showShop(game);
    });
  } else if (r === 'over') {
    app.locked = true;
    const newBest = { ante: false, hit: false };
    if (game.ante > rec.bestAnte) { rec.bestAnte = game.ante; newBest.ante = true; }
    if (game.runBestHit >= rec.bestHit && game.runBestHit > 0) { rec.bestHit = game.runBestHit; newBest.hit = true; }
    saveRec();
    sfx.gameOver();
    vibrate([60, 40, 120]);
    app.fx.shake(10, 0.5);
    banner(game.gameOverReason === 'stuck' ? '놓을 곳이 없음!' : '트레이 소진!', `${fmt(game.roundScore)} / ${fmt(game.target)}`, '#ff4d6d', 1.6);
    later(1.7, () => { app.locked = false; ui.showOver(game, rec, newBest); });
  } else if (r === 'newTray') {
    app.trayAnim = [0, -0.1, -0.2];
    sfx.newTray();
    refreshFit();
  }
}

// ---------- 입력 ----------
function pos(e) {
  return { x: e.clientX, y: e.clientY };
}
const inRect = (p, r) => r && p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;

function updateDrag() {
  const d = app.drag;
  if (!d) return;
  const cell = L.cell;
  const w = d.piece.shape.w * cell, h = d.piece.shape.h * cell;
  // 손가락 위로 띄우기: 조각 아랫변이 손가락보다 약 1칸 위 (1칸 조각 중심 = 1.5칸 위)
  const lift = d.touch ? cell * 1.0 + h / 2 : h / 2 + cell * 0.35;
  d.px = d.fx;
  d.py = d.fy - lift * Math.min(1, d.scale * 1.05);
  const left = d.fx - w / 2, top = d.fy - lift - h / 2;
  const col = Math.round((left - L.board.x) / cell);
  const row = Math.round((top - L.board.y) / cell);
  d.row = row; d.col = col;
  const valid = game.canPlace(d.piece.shape, row, col);
  if (valid && (!d.valid || d.lastRow !== row || d.lastCol !== col)) {
    d.lines = game.previewLines(d.piece, row, col);
    sfx.tick(0);
  }
  d.valid = valid;
  d.lastRow = row; d.lastCol = col;
}

canvas.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  initAudio();
  if (!app.inRun || app.paused || ui.current) return;
  const p = pos(e);
  if (inRect(p, { x: L.pause.x - 4, y: L.pause.y - 4, w: L.pause.w + 8, h: L.pause.h + 8 })) { sfx.click(); pause(); return; }
  if (game.phase !== 'play') return;
  for (let i = 0; i < game.jokers.length; i++) {
    if (inRect(p, L.jokerRect(i))) { sfx.click(); ui.showJokerTip(game.jokers[i], game); return; }
  }
  if (inRect(p, app.hit.blind)) { sfx.click(); ui.showBossTip(game); return; }
  if (app.locked || app.drag) return;
  for (let i = 0; i < 3; i++) {
    if (!inRect(p, L.traySlot(i))) continue;
    const piece = game.tray[i];
    if (!piece || piece.hidden) return;
    app.drag = { idx: i, piece, fx: p.x, fy: p.y, scale: L.trayScale / L.cell, id: e.pointerId, touch: e.pointerType !== 'mouse', valid: false };
    try { canvas.setPointerCapture(e.pointerId); } catch { /* 무시 */ }
    sfx.pickup();
    vibrate(5);
    updateDrag();
    return;
  }
});

canvas.addEventListener('pointermove', (e) => {
  const d = app.drag;
  if (!d || e.pointerId !== d.id) return;
  e.preventDefault();
  const p = pos(e);
  d.fx = p.x; d.fy = p.y;
  updateDrag();
});

function endDrag(e) {
  const d = app.drag;
  if (!d || e.pointerId !== d.id) return;
  const p = pos(e);
  d.fx = p.x; d.fy = p.y;
  d.scale = 1;
  updateDrag();
  app.drag = null;
  if (e.type !== 'pointercancel' && d.valid && !app.locked) {
    doPlace(d.idx, d.row, d.col);
  } else {
    app.trayAnim[d.idx] = 0.6;
  }
}
canvas.addEventListener('pointerup', endDrag);
canvas.addEventListener('pointercancel', endDrag);
window.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('touchmove', (e) => { if (!e.target.closest || !e.target.closest('.screen, .tip')) e.preventDefault(); }, { passive: false });
document.addEventListener('pointerdown', () => initAudio(), { capture: true });
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' || e.key === 'p') { if (app.paused) resume(); else pause(); }
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) { pause(); suspendAudio(); }
  else resumeAudio();
});

// ---------- 루프 ----------
function update(dt) {
  app.fx.update(dt);
  for (const c of app.clearing) c.t += dt;
  app.clearing = app.clearing.filter((c) => c.t < c.life);
  for (const b of app.bubbles) b.t += dt;
  app.bubbles = app.bubbles.filter((b) => b.t < b.life);
  for (let i = 0; i < app.jokerBounce.length; i++) if (app.jokerBounce[i] != null) app.jokerBounce[i] += dt;
  for (let i = 0; i < 3; i++) app.trayAnim[i] = Math.min(1, app.trayAnim[i] + dt * 3.2);
  const k = app.calc;
  k.chipsPulse = Math.max(0, k.chipsPulse - dt * 4);
  k.multPulse = Math.max(0, k.multPulse - dt * 4);
  if (!k.active) k.labelAlpha = Math.max(0, k.labelAlpha - dt * 0.8);
  app.scorePulse = Math.max(0, app.scorePulse - dt * 3);
  app.coinPulse = Math.max(0, app.coinPulse - dt * 3);
  const tgt = Math.max(0, game.roundScore - app.scoreHold);
  if (app.shownScore < tgt) {
    app.shownScore = Math.min(tgt, app.shownScore + Math.max(1, (tgt - app.shownScore) * Math.min(1, dt * 7)));
    app.shownScore = Math.ceil(app.shownScore);
  } else if (app.shownScore > tgt) app.shownScore = tgt;
  if (app.banner) { app.banner.t += dt; if (app.banner.t > app.banner.life) app.banner = null; }
  if (app.drag && app.drag.scale < 1) { app.drag.scale = Math.min(1, app.drag.scale + dt * 8); updateDrag(); }
  updateSeq(dt);
  for (const t of app.timers) { t.t -= dt; if (t.t <= 0 && !t.done) { t.done = true; t.fn(); } }
  app.timers = app.timers.filter((t) => !t.done);
}

let last = performance.now();
function frame(now) {
  let dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  time += dt;
  if (!app.paused) {
    if (app.fx.stop > 0) { app.fx.stop -= dt; app.fx.update(0); }
    else update(dt);
  }
  renderer.draw(app, time);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

toTitle();

// ---------- 디버그/테스트 훅 ----------
if (DEBUG) {
  window.__bj = {
    game, app,
    layout: () => L,
    // 조각 i 를 (r, c)에 놓으려면 손가락을 어디서 떼야 하는지
    dropPoint(i, r, c) {
      const p = game.tray[i];
      const cell = L.cell;
      const w = p.shape.w * cell, h = p.shape.h * cell;
      const lift = cell * 1.0 + h / 2;
      return { x: L.board.x + c * cell + w / 2, y: L.board.y + r * cell + h / 2 + lift };
    },
    slotCenter(i) { const s = L.traySlot(i); return { x: s.x + s.w / 2, y: s.y + s.h / 2 }; },
    findMove() {
      let best = null;
      game.tray.forEach((p, i) => {
        if (!p || p.hidden) return;
        for (let r = 0; r <= CONFIG.BOARD - p.shape.h; r++) for (let c = 0; c <= CONFIG.BOARD - p.shape.w; c++) {
          if (!game.canPlace(p.shape, r, c)) continue;
          const lines = game.previewLines(p, r, c).lines;
          const s = lines * 100 + p.shape.size + (r + c) * 0.01;
          if (!best || s > best.s) best = { s, i, r, c };
        }
      });
      return best;
    },
    state() {
      return { phase: game.phase, ui: ui.current || null, locked: app.locked, paused: app.paused, ante: game.ante, blind: game.blind, score: game.roundScore, target: game.target, coins: game.coins, jokers: game.jokers.map((j) => j.id), handsLeft: game.handsLeft, tray: game.tray.map((p) => (p ? p.shape.id : null)) };
    },
  };
}
