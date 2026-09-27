// 진입점: 루프, 입력, 화면 흐름
import { CONFIG, DEBUG, SEED_PARAM } from './config.js';
import { Game, DAILY_RULES } from './game.js';
import { Renderer, computeLayout, GEM_COLOR } from './render.js';
import { FX } from './fx.js';
import { UI } from './ui.js';
import { effectLabel, fmt, JOKERS, AXIS_LABEL } from './jokers.js';
import { HANDS } from './items.js';
import { initAudio, sfx, setMuted, isMuted, startBgm, suspendAudio, resumeAudio, setVolumes, setBgmMode, duckBgm } from './audio.js';
import { Meta, dateKey } from './meta.js';
import { SKIN_BY_ID } from './metadata.js';
import { hashSeed } from './rng.js';

const canvas = document.getElementById('cv');
const renderer = new Renderer(canvas);
const game = new Game();
game.isUndiscovered = (id) => !meta.d.discovered.includes(id);
const meta = new Meta();
const rec = meta.d;
setMuted(!!rec.muted);
setVolumes(rec.settings.bgm, rec.settings.sfx);
renderer.setTheme(SKIN_BY_ID[rec.sel.skin]);

const app = {
  game,
  fx: new FX(),
  drag: null,
  clearing: [],
  bubbles: [],
  beams: [],
  comboWord: null,
  intro: null,
  showdown: false,
  jokerBounce: [],
  trayAnim: [1, 1, 1],
  swapSel: new Set(),
  fitCache: [true, true, true],
  calc: { active: false, chips: 0, mult: 0, label: '', labelAlpha: 0, chipsPulse: 0, multPulse: 0, merge: 0, totalShown: 0, fade: 1 },
  shownScore: 0,
  scoreHold: 0,
  scorePulse: 0,
  coinPulse: 0,
  banner: null,
  tutorial: false,
  hit: {},
  inRun: false,
  paused: false,
  seq: null,
  queue: [],
  pendingEnd: null,
  timers: [],
  gemFlash: null,
};
let L = null;
let time = 0;

// ---------- 레이아웃 ----------
const safeProbe = document.createElement('div');
safeProbe.style.cssText = 'position:fixed;left:0;top:0;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top) 0 env(safe-area-inset-bottom) 0;';
document.body.appendChild(safeProbe);

// 적응형 해상도: 프레임이 계속 무거우면 DPR을 낮춤 (최대 2)
let dprCap = 2;
function resize() {
  const vw = window.innerWidth, vh = window.innerHeight;
  const cs = getComputedStyle(safeProbe);
  const safe = { top: parseFloat(cs.paddingTop) || 0, bottom: parseFloat(cs.paddingBottom) || 0 };
  const dpr = Math.min(dprCap, 2, window.devicePixelRatio || 1);
  L = computeLayout(vw, vh, safe);
  renderer.resize(vw, vh, dpr, L);
}
window.addEventListener('resize', resize);
resize();

// ---------- 유틸 ----------
const vibrate = (ms) => { if (!rec.settings.vib) return; try { if (navigator.vibrate) navigator.vibrate(ms); } catch { /* 무시 */ } };
const later = (t, fn) => app.timers.push({ t, fn });
function refreshFit() {
  for (let i = 0; i < 3; i++) {
    const p = game.tray[i];
    app.fitCache[i] = !!p && !p.hidden && game.fitsAnywhere(p.shape);
  }
}
function banner(title, sub, color, life = 1.6, boss = null) { app.banner = { title, sub, color, t: 0, life, boss }; }
function saveRec() { rec.muted = isMuted(); meta.save(); }
// 라운드 진행 중에는 알림을 모아뒀다가 클리어/상점/타이틀에서 표시
function canToast() { return !app.inRun || !!ui.current; }
function flushToasts() {
  if (!canToast()) return;
  let delay = 0;
  while (meta.toasts.length) {
    const t = meta.toasts.shift();
    setTimeout(() => ui.toast(t.text, t.kind), delay);
    delay += 350;
  }
}
const jokerN = () => Math.max(5, game.jokerSlots);
const popX = (x) => Math.max(L.gx + 46, Math.min(L.gx + L.gw - 46, x));
let runStart = { ante: 0, hit: 0 };
let lastOpts = { stake: 1, deck: 'basic' };

function dailyRule() {
  const d = dateKey();
  return DAILY_RULES[hashSeed('rule-' + d) % DAILY_RULES.length];
}

// ---------- UI 콜백 ----------
const ui = new UI({
  setup: () => { sfx.click(); ui.showSetup(meta); },
  start: () => startRun({ stake: rec.sel.stake, deck: rec.sel.deck }),
  daily: () => {
    meta.refreshDaily();
    if (rec.daily.played) { sfx.invalid(); ui.toast('오늘의 데일리 런은 이미 도전함. 내일 다시!'); return; }
    startRun({ daily: true });
  },
  dailyRule: () => dailyRule(),
  continueRun: () => continueRun(),
  unlock: (kind, id) => {
    const ok = kind === 'joker' ? meta.unlockJoker(id) : kind === 'deck' ? meta.unlockDeck(id) : meta.unlockSkin(id);
    if (ok) { sfx.buy(); vibrate(20); ui.toast('해금 완료!', 'ach'); } else { sfx.invalid(); ui.toast('토큰이 부족함'); }
    ui.showCollection(meta);
  },
  skin: (id) => { rec.sel.skin = id; meta.save(); renderer.setTheme(SKIN_BY_ID[id]); sfx.click(); ui.showCollection(meta); },
  abandon: () => {
    const daily = !!game.opts.daily;
    meta.onRunAbandon();
    app.inRun = false; app.paused = false;
    game.phase = 'title';
    if (daily) toTitle(); else ui.showSetup(meta);
  },
  resume: () => resume(),
  restart: () => {
    // 데일리 결과 화면의 다시하기는 일반 런 설정으로
    if (lastOpts.daily) { ui.showSetup(meta); return; }
    startRun(lastOpts);
  },
  toTitle: () => toTitle(),
  toggleMute: () => {
    setMuted(!isMuted()); saveRec();
    if (ui.current === 'title') ui.showTitle(meta, isMuted(), SEED_PARAM);
    else if (ui.current === 'pause') ui.showPause(rec.settings, isMuted());
    else if (ui.current === 'settings') ui.showSettings(meta, isMuted());
  },
  settings: (patch) => {
    Object.assign(rec.settings, patch);
    setVolumes(rec.settings.bgm, rec.settings.sfx);
    meta.save();
    if (patch.sfx != null) sfx.click();
    if (patch.vib) vibrate(30);
  },
  buyJoker: (i) => {
    const o = i === 'rare' ? game.shop.rare : game.shop.jokers[i];
    if (game.buyJoker(i)) { sfx.buy(); vibrate(15); app.coinPulse = 1; meta.onBuy(game, { kind: 'joker', ed: o.ed }); saveShop(); ui.showShop(game); }
    else { sfx.invalid(); ui.toast(game.coins < o.price ? '코인이 부족함' : '조커 슬롯이 가득 참'); }
  },
  buyCard: (i) => {
    const o = game.shop.cards[i];
    if (game.buyCard(i)) { sfx.card(); if (o.kind === 'planet') sfx.levelUp(); vibrate(15); meta.onBuy(game, { kind: o.kind }); saveShop(); ui.showShop(game); }
    else { sfx.invalid(); ui.toast('코인이 부족함'); }
  },
  buyPack: (i) => {
    if (game.buyPack(i)) { sfx.packOpen(); vibrate(20); meta.onShop(game); saveShop(); ui.showShop(game); }
    else { sfx.invalid(); ui.toast('코인이 부족함'); }
  },
  choosePack: (k) => {
    const c = game.packOpen && game.packOpen.choices[k];
    if (game.choosePack(k)) { sfx.card(); meta.onBuy(game, c); saveShop(); ui.showShop(game); }
    else { sfx.invalid(); ui.toast('조커 슬롯이 가득 참. 판매하거나 건너뛰기'); }
  },
  skipPack: () => { game.skipPack(); sfx.click(); saveShop(); ui.showShop(game); },
  buyVoucher: () => {
    if (game.buyVoucher()) { sfx.buy(); sfx.levelUp(); vibrate(20); meta.onBuy(game, { kind: 'voucher' }); saveShop(); ui.showShop(game); }
    else { sfx.invalid(); ui.toast('코인이 부족함'); }
  },
  buySpecial: (arg, slot = 'special') => {
    const o = game.shop[slot];
    if (game.buySpecial(arg, slot)) { sfx.buy(); sfx.levelUp(); vibrate(20); meta.onBuy(game, { kind: o.id === 's_clone' ? 'joker' : 'special' }); saveShop(); ui.showShop(game); }
    else { sfx.invalid(); ui.toast(game.coins < o.price ? '코인이 부족함' : '조건이 맞지 않음'); }
  },
  rescue: (how, idx) => {
    if (how === 'decline') { game.declineRescue(); app.stuck = false; endNow(); return; }
    if (!game.rescue(how, idx)) { sfx.invalid(); ui.toast('구제할 수 없음'); return; }
    sfx.allClear(); vibrate([30, 30, 60]); app.fx.flash = 0.8;
    const cell = L.cell;
    for (const r of game.rescuedRows || []) { app.beams.push({ row: r, t: 0, life: 0.3, color: '#3ddc97' }); for (let c = 0; c < 8; c++) app.fx.burst(L.board.x + (c + 0.5) * cell, L.board.y + (r + 0.5) * cell, 2, 3, 200, cell * 0.25); }
    app.comboWord = { text: '구제!', sub: '가로줄 3개 제거', color: '#3ddc97', t: 0, life: 1.2, size: 44 };
    refreshFit();
    const out = game.resolveStuck();
    handleStuck(out);
    if (out === 'over') endNow(); else savePlayNow();
  },
  claimMission: (i, w) => { const r = w ? meta.claimWeekly(i) : meta.claimMission(i); if (r) { sfx.coins(6); vibrate([15, 20, 15]); } return r; },
  claimAll: () => { const r = meta.claimAll(); if (r) { sfx.coins(6); sfx.levelUp(); vibrate([15, 20, 15, 20, 30]); } return r; },
  claimAchievement: (id) => { const r = meta.claimAchievement(id); if (r) { sfx.coins(6); vibrate([15, 20, 15]); } return r; },
  sell: (i) => { if (game.sell(i)) { sfx.sell(); app.coinPulse = 1; saveShop(); ui.showShop(game); } },
  sellInRun: (i) => {
    if (game.phase !== 'play' || !game.sell(i)) return;
    sfx.sell(); app.coinPulse = 1; ui.hideTip();
    meta.saveRun(game.snapshot('play'));
  },
  reroll: () => { if (game.reroll()) { sfx.click(); sfx.card(); meta.onShop(game); saveShop(); ui.showShop(game); } else { sfx.invalid(); ui.toast('코인이 부족함'); } },
  move: (a, b) => { game.moveJoker(a, b); sfx.click(); saveShop(); },
  denied: () => sfx.invalid(),
  next: () => { sfx.click(); game.nextRound(); ui.hideAll(); beginRound(); },
  endless: () => { sfx.click(); game.continueEndless(); saveShop(); ui.showShop(game); setBgmMode('shop', game.ante); },
  coachDone: (id) => {
    if (id === 'calc') rec.coach.calc = true;
    else if (id === 'tray') rec.coach.tray = true;
    else if (id === 'shop') rec.coach.shop = true;
    else if (id.startsWith('boss:')) { const b = id.slice(5); if (!rec.coach.bosses.includes(b)) rec.coach.bosses.push(b); }
    meta.save();
    flushToasts();
  },
  claimCalendar: () => {
    const r = meta.claimCalendar();
    if (r) { sfx.coins(6); sfx.levelUp(); vibrate([20, 30, 20]); }
    return r;
  },
  claimChest: () => {
    const r = meta.claimChest();
    if (r) { sfx.packOpen(); sfx.coins(6); vibrate([20, 30, 60]); }
    return r;
  },
  shareDaily: (text) => {
    try {
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(() => ui.toast('결과를 복사함'), () => ui.toast('복사하지 못함'));
      else ui.toast('복사하지 못함');
    } catch { ui.toast('복사하지 못함'); }
  },
});

function saveShop() { meta.saveRun(game.snapshot('shop')); }
// 저장은 드롭 프레임을 막지 않도록 유휴 시간에 (마지막 요청만)
let saveQueued = false;
const idle = window.requestIdleCallback ? (fn) => window.requestIdleCallback(fn, { timeout: 400 }) : (fn) => setTimeout(fn, 30);
function savePlay() {
  if (saveQueued) return;
  saveQueued = true;
  idle(() => { saveQueued = false; if (game.phase === 'play' && app.inRun) meta.saveRun(game.snapshot('play')); });
}
function savePlayNow() { if (game.phase === 'play') meta.saveRun(game.snapshot('play')); }

function resetRunVisuals() {
  app.fx.clear();
  app.bubbles = []; app.clearing = []; app.jokerBounce = []; app.beams = [];
  app.comboWord = null; app.queue = []; app.seq = null; app.pendingEnd = null; app.intro = null; app.swapSel.clear(); renderer.setAnte(game.ante);
  app.calc.active = false; app.calc.merge = 0; app.calc.labelAlpha = 0;
}

function startRun(opts = {}) {
  initAudio();
  startBgm();
  const daily = !!opts.daily;
  if (daily) {
    meta.refreshDaily();
    if (rec.daily.played) { ui.toast('오늘의 데일리 런은 이미 도전함'); toTitle(); return; }
  }
  lastOpts = opts;
  const seed = daily ? 'daily-' + dateKey() : SEED_PARAM || Math.random().toString(36).slice(2, 10);
  runStart = { ante: rec.stats.bestAnte, hit: rec.stats.bestHit };
  game.newRun(seed, daily
    ? { stake: 1, deck: 'basic', daily: true, pool: meta.jokerPool(true), rule: dailyRule().id }
    : { stake: opts.stake || 1, deck: opts.deck || 'basic', pool: meta.jokerPool(false) });
  meta.onRunStart(game);
  app.inRun = true;
  app.paused = false;
  resetRunVisuals();
  ui.hideAll();
  if (!rec.tutorialDone) app.tutorial = true;
  beginRound();
}

function setHud() {
  app.hud = { ante: game.ante, blind: game.blind, name: game.blindName, color: game.blind === 2 ? game.bossDef.color : null, endless: game.endless, boss: game.boss };
}

function beginRound() {
  setHud();
  app.stuck = false;
  app.coinsShown = game.coins;
  app.shownScore = game.roundScore || 0; app.scoreHold = 0;
  app.seq = null; app.queue = []; app.drag = null; app.pendingEnd = null;
  app.calc.active = false; app.calc.merge = 0; app.calc.labelAlpha = 0;
  app.swapSel.clear(); renderer.setAnte(game.ante);
  app.timers = [];
  app.trayAnim = [-0.0, -0.12, -0.24];
  app.showdown = game.blind === 2 && game.isShowdown();
  refreshFit();
  meta.onAnte(game.ante, game);
  savePlay();
  setBgmMode(app.showdown ? 'showdown' : game.blind === 2 ? 'boss' : 'normal', game.ante);
  if (app.showdown) {
    app.intro = { t: 0, life: 2.4, name: game.bossDef.name, desc: game.bossDef.desc, color: game.bossDef.color, target: game.target };
    sfx.showdown(); vibrate([40, 60, 40, 60, 120]);
    app.fx.shake(8, 0.6);
  } else if (game.blind === 2) {
    banner('보스: ' + game.bossDef.name, game.bossDef.desc, game.bossDef.color, 2.4, game.boss);
    sfx.boss(); vibrate(40);
    app.fx.shake(6, 0.4);
  } else {
    banner(game.blindName, `목표 ${fmt(game.target)}`, game.blind === 1 ? '#ffb627' : '#36c9ff', 1.4);
    sfx.newTray();
  }
  if (!rec.coach.tray && game.ante === 1 && game.blind === 0) later(0.1, () => ui.showTrayCard());
  // 처음 만나는 보스는 저주 설명 카드
  if (game.blind === 2 && !rec.coach.bosses.includes(game.boss)) {
    later(app.showdown ? 2.4 : 0.3, () => ui.showBossCard(game));
  }
}

function continueRun() {
  const snap = rec.run;
  if (!snap) return;
  initAudio();
  startBgm();
  try { game.restore(snap); } catch { meta.clearRun(); toTitle(); return; }
  lastOpts = { ...game.opts };
  runStart = { ante: rec.stats.bestAnte, hit: rec.stats.bestHit };
  app.inRun = true;
  app.paused = false;
  resetRunVisuals();
  ui.hideAll();
  if (game.phase === 'shop') {
    refreshFit(); setBgmMode('shop', game.ante); ui.showShop(game);
    if (!rec.coach.shop) setTimeout(() => ui.showCoach('shop'), 450);
    return;
  }
  if (snap.kind === 'play') {
    setHud();
    app.shownScore = game.roundScore; app.scoreHold = 0;
    app.showdown = game.blind === 2 && game.isShowdown();
    refreshFit();
    setBgmMode(app.showdown ? 'showdown' : game.blind === 2 ? 'boss' : 'normal', game.ante);
    banner('이어하기', `${game.blindName} · ${fmt(game.roundScore)} / ${fmt(game.target)}`, '#9fe8c8', 1.2);
    app.coinsShown = game.coins;
    const st = game.resolveStuck();
    handleStuck(st);
    if (st === 'over') endNow();
    return;
  }
  beginRound();
}

function toTitle() {
  meta.refreshDaily();
  app.inRun = false;
  app.paused = false;
  app.showdown = false;
  game.phase = 'title';
  app.drag = null;
  setBgmMode('normal', 1);
  ui.showTitle(meta, isMuted(), SEED_PARAM);
  if (meta.calendarClaimable && rec.stats.runs >= 1) setTimeout(() => { if (ui.current === 'title' && !ui.modalOpen) ui.showCalendar(meta); }, 350);
  flushToasts();
}

function pause() {
  if (!app.inRun || app.paused || game.phase !== 'play' || ui.current) return;
  app.paused = true;
  app.drag = null;
  ui.showPause(rec.settings, isMuted());
}
function resume() { app.paused = false; ui.hide('pause'); }

// ---------- 배치 + 점수 연출 (비차단 큐) ----------
const COMBO_WORDS = [[12, '레전더리!', '#c86bff', 4], [8, '언빌리버블!', '#ff4d6d', 4], [5, '엑설런트!', '#ffb627', 3], [3, '그레잇!', '#36c9ff', 2], [2, '굿!', '#3ddc97', 1]];

function doPlace(i, r, c) {
  const res = game.place(i, r, c);
  if (!res) return false;
  app.swapSel.clear();
  if (app.tutorial) { app.tutorial = false; rec.tutorialDone = true; saveRec(); }
  if (res.cleared) meta.onClear(res, game);
  const cell = L.cell;
  sfx.place(res.piece.size);
  vibrate(8);
  const cx = L.board.x + (c + res.piece.w / 2) * cell, cy = L.board.y + (r + res.piece.h / 2) * cell;
  app.fx.pop(popX(cx), cy, '+' + res.placePts, '#b5f5d6', 16, 0.7, -50);
  // 착지 먼지
  for (const p of res.placed) app.fx.burst(L.board.x + (p.c + 0.5) * cell, L.board.y + (p.r + 0.5) * cell, res.color, 1, 90, cell * 0.18);
  for (const b of res.bubbles) addBubble(b.idx, b.text, '#8f6bff');
  if (res.comboBroken) app.fx.pop(L.calc.x + L.calc.w / 2, L.board.y - 4, '콤보 끊김', '#ff8fa3', 15, 0.9);
  if (res.cleared) clearFx(res);
  const outcome = game.resolve();
  refreshFit();
  if (outcome === 'newTray') { app.trayAnim = [0, -0.1, -0.2]; later(0.12, () => sfx.newTray()); }
  if (outcome === 'phoenix') {
    app.trayAnim = [0, -0.1, -0.2];
    app.comboWord = { text: '불사조 부활!', sub: '보드 초기화 · 트레이 +1', color: '#ff8a3d', t: 0, life: 1.6, size: 40 };
    sfx.phoenix(); app.fx.flash = 1; app.fx.shake(10, 0.5);
    for (let k = 0; k < 30; k++) app.fx.burst(L.board.x + Math.random() * L.board.w, L.board.y + L.board.h, k % 2 ? 6 : 1, 2, 420, cell * 0.3);
  }
  handleStuck(outcome);
  if (outcome === 'roundClear' || outcome === 'over') app.pendingEnd = { type: outcome };
  else savePlay();
  if (outcome === 'roundClear') {
    // 라운드 결과는 바로 저장 (연출 도중 종료해도 보상 유지)
    meta.onRoundClear(game);
    if (game.phase === 'victory') {
      app.pendingEnd.sum = meta.onRunEnd(game, true);
      game.runStats = { rounds: 0, bosses: 0, lines: 0, gems: 0 };
    } else { meta.onShop(game); saveShop(); }
  } else if (outcome === 'over') {
    app.pendingEnd.newBest = { ante: game.ante > runStart.ante, hit: game.runBestHit > runStart.hit };
    app.pendingEnd.sum = meta.onRunEnd(game, false);
  }
  if (res.cleared) enqueue(res);
  else maybeEnd();
  return true;
}

// 막힘: 교체 가능하면 교체 버튼 강조, 아니면 구제 모달
function handleStuck(outcome) {
  app.stuck = outcome === 'stuck';
  if (outcome === 'stuck') { later(0.2, () => { sfx.invalid(); ui.toast('놓을 곳이 없음! 아래 트레이 교체 버튼을 누를 것'); }); vibrate([30, 40, 30]); }
  if (outcome === 'rescue') later(0.4, () => ui.showRescue(game));
}

function doSwap() {
  const sel = [...app.swapSel];
  if (!game.swapTray(sel)) { rejectInput(); return; }
  app.swapSel.clear();
  if (sel.length && sel.length < 3) ui.toast(`조각 ${sel.length}개 교체`);
  sfx.newTray(); sfx.card(); vibrate(15);
  app.trayAnim = [0, -0.08, -0.16];
  refreshFit();
  const out = game.resolveStuck();
  handleStuck(out);
  if (out === 'over') endNow();
  savePlay();
}

function endNow() {
  app.pendingEnd = { type: 'over', newBest: { ante: game.ante > runStart.ante, hit: game.runBestHit > runStart.hit } };
  app.pendingEnd.sum = meta.onRunEnd(game, false);
  maybeEnd();
}

function clearFx(res) {
  const cell = L.cell;
  for (const cl of res.cleared.cells) {
    app.clearing.push({ r: cl.r, c: cl.c, color: cl.color, t: 0, life: 0.26 });
    const x = L.board.x + (cl.c + 0.5) * cell, y = L.board.y + (cl.r + 0.5) * cell;
    later(0.2, () => app.fx.burst(x, y, cl.color, 4, 280, cell * 0.32));
    if (cl.broken) { app.fx.burst(x, y, 3, 12, 340, cell * 0.22); app.fx.ring(x, y, '#9ff0ff', cell); later(0.1, () => sfx.glass()); }
  }
  const lines = res.cleared.rows.length + res.cleared.cols.length;
  const col = ['#36c9ff', '#3ddc97', '#ffb627', '#ff4d6d', '#c86bff'][Math.min(4, lines - 1)];
  res.cleared.rows.forEach((row, k) => app.beams.push({ row, t: -k * 0.04, life: 0.22, color: col }));
  res.cleared.cols.forEach((c2, k) => app.beams.push({ col: c2, t: -k * 0.04, life: 0.22, color: col }));
  sfx.clear(lines, res.combo);
  if (lines >= 2) app.boardGlow = { t: 0, color: col };
  if (res.combo >= 3) app.feltWave = { t: 0, color: res.combo >= 5 ? 'rgba(255,77,109,A)' : 'rgba(255,182,39,A)' };
  vibrate(lines > 1 ? [20, 30, 20] : 20);
  app.fx.shake(2 + lines * 2.5, 0.25);
  if (lines >= 2) app.fx.hitstop(0.04 + lines * 0.02);
  if (res.boardEmpty) {
    app.comboWord = { text: '올 클리어!', sub: '+$3', color: '#ffe066', t: 0, life: 1.6, size: 46 };
    later(0.1, () => sfx.allClear());
    app.fx.flash = 1; app.fx.shake(14, 0.5); app.fx.hitstop(0.14);
    const bx = L.board.x + L.board.w / 2, by = L.board.y + L.board.h / 2;
    for (let k = 0; k < 4; k++) later(k * 0.08, () => app.fx.ring(bx, by, ['#ffe066', '#ff4d6d', '#36c9ff', '#3ddc97'][k], L.board.w * (0.5 + k * 0.2)));
    for (let k = 0; k < 40; k++) app.fx.burst(bx, by, k % 7, 1, 520, cell * 0.35);
    vibrate([40, 30, 40, 30, 80]);
  } else {
    const w = COMBO_WORDS.find(([n]) => res.combo >= n && (res.combo === n || (n >= 12 && res.combo % 4 === 0)));
    if (w) { app.comboWord = { text: w[1], sub: `콤보 ${res.combo}`, color: w[2], t: 0, life: 1.1, size: 44 }; later(0.08, () => sfx.combo(w[3])); }
  }
}

function addBubble(idx, text, color) {
  app.bubbles = app.bubbles.filter((b) => b.idx !== idx);
  app.bubbles.push({ idx, text, color, t: 0, life: 1.0 });
  while (app.bubbles.length > 3) app.bubbles.shift();
  app.jokerBounce[idx] = 0;
}

function enqueue(res) {
  app.scoreHold += res.total;
  app.queue.push(res);
  if (!app.seq) nextSeq();
}

function nextSeq() {
  const res = app.queue.shift();
  if (!res) { app.seq = null; duckBgm(false); maybeEnd(); return; }
  duckBgm(true);
  const base = res.steps[0];
  const k = app.calc;
  k.active = true; k.chips = base.chips; k.mult = base.mult; k.chipsPulse = 1; k.multPulse = 1; k.merge = 0; k.fade = 1;
  k.chipsShown = 0; k.multShown = 0;
  let label = `${HANDS[base.hand].name} Lv.${base.lv}`;
  if (base.combo > 0) label += ` · 콤보 +${base.combo}`;
  k.label = label; k.labelAlpha = 1;
  const n = res.steps.length - 1;
  app.seq = { res, i: 1, timer: 0.3, stepDur: n > 10 ? 0.11 : n > 5 ? 0.17 : 0.24, stage: 'steps', tick: 0, t: 0 };
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
    app.fx.pop(popX(x), y - cell * 0.3, effectLabel(e), col, 15, 0.8);
    app.fx.ring(x, y, GEM_COLOR[step.gem], cell * 0.8);
    app.gemFlash = { r: step.r, c: step.c, gem: step.gem };
    if (e.t === 'xmult') sfx.xmult(); else if (e.t === 'chips') sfx.chips(i); else sfx.mult(i);
  } else if (step.kind === 'joker') {
    app.activeJoker = step.idx;
    addBubble(step.idx, (step.ed ? '에디션 ' : '') + effectLabel(e), e.t === 'chips' ? '#1a7fe0' : e.t === 'coins' ? '#c98a00' : e.t === 'xmult' ? '#c0102f' : '#e0304f');
    const jp = game.jokers.length > 1 ? ((step.idx / (game.jokers.length - 1)) * 2 - 1) * 0.6 : 0; // 슬롯 위치 패닝
    if (e.t === 'xmult') { sfx.xmult(jp); app.fx.shake(5, 0.15); } else sfx.joker(i, jp);
    if (e.t === 'coins') { app.coinPulse = 1; sfx.coins(e.v); }
    vibrate(6);
  } else if (step.kind === 'synergy') {
    app.fx.pop(L.calc.x + L.calc.w / 2, L.calc.y + L.calc.h + 12, `시너지 [${AXIS_LABEL[step.axis]}] ${step.n}장 ${effectLabel(e)}`, '#3ddc97', 17, 1.0);
    sfx.xmult(); app.fx.shake(4, 0.15); vibrate(8);
  } else if (step.kind === 'curse') {
    app.fx.pop(L.calc.x + L.calc.w / 2, L.calc.y + L.calc.h + 12, '저주 ' + effectLabel(e), '#ff4d6d', 16, 0.9);
    sfx.invalid();
  }
}

function speedMul() {
  const base = rec.settings.speed || 1;
  return base * (app.queue.length >= 2 ? 2.5 : app.queue.length === 1 ? 1.6 : 1);
}

function updateSeq(rawDt) {
  const s = app.seq;
  if (!s) return;
  const dt = rawDt * speedMul();
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
    app.gemFlash = null;
    s.stage = 'merge';
    s.timer = 0.22;
    s.t = 0;
    k.totalShown = 0; k.totalReady = false;
    return;
  }
  if (s.stage === 'merge') {
    s.t += dt;
    k.merge = Math.min(1, s.t / 0.22);
    if (s.timer > 0) return;
    k.merge = 1; k.totalReady = true;
    s.stage = 'total';
    s.timer = 0.5; s.t = 0;
    const total = s.res.total;
    const big = total >= game.target * 0.35 || total >= 5000;
    sfx.total(big);
    app.fx.shake(big ? 14 : 5, big ? 0.45 : 0.2);
    if (big) { app.fx.hitstop(0.1); app.fx.flash = 0.8; vibrate([30, 20, 50]); }
    return;
  }
  if (s.stage === 'total') {
    s.t += dt;
    const p = Math.min(1, s.t / 0.3);
    const target = s.res.total;
    const prev = k.totalShown;
    k.totalShown = Math.floor(target * (1 - Math.pow(1 - p, 3)));
    if (Math.floor(prev / Math.max(1, target / 8)) !== Math.floor(k.totalShown / Math.max(1, target / 8))) sfx.tick(s.tick++);
    if (s.timer > 0) return;
    k.totalShown = target;
    app.scoreHold = Math.max(0, app.scoreHold - target);
    app.scorePulse = 1;
    s.stage = 'fade';
    s.timer = 0.3;
    return;
  }
  if (s.stage === 'fade') {
    k.fade = Math.max(0, s.timer / 0.3);
    if (s.timer > 0) return;
    finishSeq();
  }
}

function finishSeq() {
  const k = app.calc;
  app.activeJoker = null;
  const lastRes = app.seq && app.seq.res;
  k.active = false; k.merge = 0; k.fade = 1;
  app.gemFlash = null;
  app.seq = null;
  // 칩 x 배수 코치: 두 번째 줄 제거 때, 라운드 클리어 배너와 겹치지 않게
  if (!rec.coach.calc && !app.queue.length && (app.coachClears = (app.coachClears || 0) + 1) >= 2 && !app.pendingEnd && !app.banner) {
    later(0.1, () => { if (!rec.coach.calc && !app.pendingEnd && !ui.current) ui.showCoach('calc', { calc: L.calc, score: L.score, vals: lastRes ? { chips: lastRes.chips, mult: lastRes.mult, total: lastRes.total, hand: lastRes.hand } : null }); });
  }
  nextSeq();
}

// 탭으로 점수 연출 스킵
function skipSeq() {
  if (!app.seq && !app.queue.length) return;
  const all = [app.seq && app.seq.res, ...app.queue].filter(Boolean);
  const last = all[all.length - 1];
  app.queue = [];
  app.scoreHold = 0;
  app.scorePulse = 1;
  const k = app.calc;
  if (last) { k.chips = last.chips; k.mult = last.mult; k.totalShown = last.total; k.totalReady = true; }
  app.seq = null;
  k.active = false; k.merge = 0; k.fade = 1;
  app.gemFlash = null;
  app.bubbles = [];
  duckBgm(false);
  maybeEnd();
}

function maybeEnd() {
  const pe = app.pendingEnd;
  if (!pe || pe.fired || app.seq || app.queue.length) return;
  pe.fired = true;
  app.bubbles = [];
  if (pe.type === 'roundClear') {
    sfx.roundClear();
    vibrate([20, 40, 20, 40, 60]);
    banner(game.wasFinal ? '승리!' : '라운드 클리어!', `${fmt(game.roundScore)} 점`, '#3ddc97', 1.3);
    app.fx.flash = 0.8;
    for (let i = 0; i < 24; i++) app.fx.burst(L.board.x + Math.random() * L.board.w, L.board.y + Math.random() * L.board.h, i % 7, 3, 300, L.cell * 0.3);
    later(1.2, () => {
      if (game.phase === 'victory') ui.showVictory(game, meta, pe.sum);
      else {
        setBgmMode('shop', game.ante); ui.showShop(game);
        if (!rec.coach.shop) setTimeout(() => ui.showCoach('shop'), 450);
      }
      flushToasts();
    });
  } else {
    sfx.gameOver();
    vibrate([60, 40, 120]);
    app.fx.shake(10, 0.5);
    banner(game.gameOverReason === 'stuck' ? '놓을 곳이 없음!' : '트레이 소진!', `${fmt(game.roundScore)} / ${fmt(game.target)}`, '#ff4d6d', 1.5);
    later(1.5, () => { ui.showOver(game, meta, pe.sum, pe.newBest); flushToasts(); });
  }
}

// ---------- 입력 ----------
function pos(e) { return { x: e.clientX, y: e.clientY }; }
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
    d.preview = d.lines.lines ? game.previewScore(d.piece, row, col) : null;
    sfx.tick(d.lines.lines ? 6 : 0);
    if (d.lines.lines) vibrate(4);
  }
  d.valid = valid;
  d.lastRow = row; d.lastCol = col;
}

function rejectInput() {
  sfx.invalid();
  app.fx.shake(3, 0.12);
  vibrate(12);
}

canvas.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  initAudio();
  if (!app.inRun || app.paused || ui.current) return;
  const p = pos(e);
  if (inRect(p, { x: L.pause.x - 4, y: L.pause.y - 4, w: L.pause.w + 8, h: L.pause.h + 8 })) { sfx.click(); pause(); return; }
  // 보스/쇼다운 인트로 중 입력: 인트로를 즉시 끝내고 그대로 조작 이어감
  if (app.intro) { app.intro = null; sfx.click(); }
  if (game.phase !== 'play' || app.pendingEnd) {
    if (app.seq || app.queue.length) skipSeq();
    return;
  }
  const n = jokerN();
  for (let i = 0; i < game.jokers.length; i++) {
    if (inRect(p, L.jokerRect(i, n))) { sfx.click(); ui.showJokerTip(game.jokers[i], game, i); return; }
  }
  if (inRect(p, app.hit.blind)) { sfx.click(); ui.showBossTip(game); return; }
  if (inRect(p, L.swapBtn)) { if (!app.drag) doSwap(); return; }
  if (app.drag) return;
  for (let i = 0; i < 3; i++) {
    if (!inRect(p, L.traySlot(i))) continue;
    const piece = game.tray[i];
    if (!piece) return;
    if (piece.hidden) { rejectInput(); return; }
    app.drag = { idx: i, piece, sx: p.x, sy: p.y, fx: p.x, fy: p.y, scale: L.pieceScale(piece) / L.cell, id: e.pointerId, touch: e.pointerType !== 'mouse', valid: false };
    try { canvas.setPointerCapture(e.pointerId); } catch { /* 무시 */ }
    sfx.pickup();
    vibrate(5);
    updateDrag();
    return;
  }
  // 빈 곳 탭 = 점수 연출 스킵
  if (app.seq || app.queue.length) skipSeq();
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
  if (e.type === 'pointercancel') { app.trayAnim[d.idx] = 0.6; return; }
  if (d.valid && game.phase === 'play' && !app.pendingEnd) {
    const tp = performance.now();
    doPlace(d.idx, d.row, d.col);
    if (DEBUG) (window.__bjPerf ||= []).push(['place', Math.round(performance.now() - tp)]);
  } else if (Math.hypot(p.x - d.sx, p.y - d.sy) < 10 && game.phase === 'play') {
    // 탭 = 교체 대상 선택 토글
    app.trayAnim[d.idx] = 0.3;
    if (app.swapSel.has(d.idx)) app.swapSel.delete(d.idx); else app.swapSel.add(d.idx);
    sfx.click(); vibrate(8);
    if (!rec.coach.swapsel && game.swapsLeft > 0) { rec.coach.swapsel = true; meta.save(); ui.toast('선택한 조각만 교체 가능. 아래 교체 버튼을 누를 것'); }
  } else {
    app.trayAnim[d.idx] = 0.6;
    // 보드 위에서 놓았는데 못 놓는 자리면 거절 피드백
    if (d.fy - L.cell * 2 < L.board.y + L.board.h && d.fy > L.board.y) rejectInput();
  }
}
canvas.addEventListener('pointerup', endDrag);
canvas.addEventListener('pointercancel', endDrag);
window.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('touchmove', (e) => { if (e.cancelable && (!e.target.closest || !e.target.closest('.screen, .tip, .coach, .modal'))) e.preventDefault(); }, { passive: false });
document.addEventListener('pointerdown', () => initAudio(), { capture: true });
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' || e.key === 'p') { if (app.paused) resume(); else pause(); }
});

document.addEventListener('visibilitychange', () => {
  if (document.hidden) { pause(); suspendAudio(); }
  else {
    resumeAudio();
    if (meta.refreshDaily() && ui.current === 'title') ui.showTitle(meta, isMuted(), SEED_PARAM);
    if (ui.current === 'title' && meta.calendarClaimable && rec.stats.runs >= 1 && !ui.modalOpen) ui.showCalendar(meta);
  }
});

// ---------- 루프 ----------
let dailyCheck = 0;
function update(dt) {
  app.fx.update(dt);
  for (const c of app.clearing) c.t += dt;
  app.clearing = app.clearing.filter((c) => c.t < c.life);
  for (const b of app.beams) b.t += dt;
  app.beams = app.beams.filter((b) => b.t < b.life);
  if (app.comboWord) { app.comboWord.t += dt; if (app.comboWord.t > app.comboWord.life) app.comboWord = null; }
  if (app.intro) { app.intro.t += dt; if (app.intro.t > app.intro.life) app.intro = null; }
  for (const b of app.bubbles) b.t += dt;
  app.bubbles = app.bubbles.filter((b) => b.t < b.life);
  for (let i = 0; i < app.jokerBounce.length; i++) if (app.jokerBounce[i] != null) app.jokerBounce[i] += dt;
  for (let i = 0; i < 3; i++) app.trayAnim[i] = Math.min(1, app.trayAnim[i] + dt * 3.2);
  const k = app.calc;
  // 칩/배수 숫자 0.12초 굴림
  const tw = 1 - Math.exp(-dt / 0.035);
  if (k.chipsShown != null) k.chipsShown += (k.chips - k.chipsShown) * tw;
  if (k.multShown != null) k.multShown += (k.mult - k.multShown) * tw;
  // 코인 HUD: 점수 연출이 끝난 뒤에 카운트업
  if (app.coinsShown == null) app.coinsShown = game.coins;
  const holdCoins = app.seq || app.queue.length || (app.pendingEnd && app.pendingEnd.type === 'roundClear');
  if (!holdCoins && Math.round(app.coinsShown) !== game.coins) {
    const diff = game.coins - app.coinsShown;
    if (!app.coinAnim && diff > 0.5) {
      app.coinAnim = true;
      sfx.coins(Math.min(6, Math.ceil(diff)));
      app.fx.pop(L.hud.x + L.hud.w - 38, L.hud.y + 54, '+$' + Math.round(diff), '#ffe68a', 16, 0.9, -40);
      for (let q = 0; q < 6; q++) app.fx.burst(L.hud.x + L.hud.w - 58, L.hud.y + 24, 1, 1, 160, 5);
      app.coinPulse = 1;
    }
    app.coinsShown += Math.sign(diff) * Math.max(dt * 20, Math.abs(diff) * Math.min(1, dt * 5));
    if (Math.abs(game.coins - app.coinsShown) < 0.5) { app.coinsShown = game.coins; app.coinAnim = false; }
  }
  if (app.boardGlow) { app.boardGlow.t += dt; if (app.boardGlow.t > 0.3) app.boardGlow = null; }
  if (app.feltWave) { app.feltWave.t += dt; if (app.feltWave.t > 0.7) app.feltWave = null; }
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
  if (meta.toasts.length) flushToasts();
  for (const t of app.timers) { t.t -= dt; if (t.t <= 0 && !t.done) { t.done = true; t.fn(); } }
  app.timers = app.timers.filter((t) => !t.done);
  // 자정이 지나면 데일리/미션 갱신
  dailyCheck += dt;
  if (dailyCheck > 20) {
    dailyCheck = 0;
    if (meta.refreshDaily() && ui.current === 'title') ui.showTitle(meta, isMuted(), SEED_PARAM);
  }
}

let last = performance.now();
let slowFrames = 0, fastFrames = 0;
function adaptResolution(rawDt) {
  if (document.hidden) return;
  if (rawDt > 0.034) { slowFrames++; fastFrames = 0; } else if (rawDt < 0.02) { fastFrames++; slowFrames = Math.max(0, slowFrames - 1); }
  const maxDpr = Math.min(2, window.devicePixelRatio || 1);
  if (slowFrames > 45 && dprCap > 1) { dprCap = Math.max(1, dprCap - 0.5); slowFrames = 0; resize(); }
  else if (fastFrames > 600 && dprCap < maxDpr) { dprCap = Math.min(maxDpr, dprCap + 0.5); fastFrames = 0; resize(); }
}
function frame(now) {
  const rawDt = (now - last) / 1000;
  if (app.inRun) adaptResolution(rawDt);
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  time += dt;
  const t0 = performance.now();
  if (!app.paused) {
    if (app.fx.stop > 0) { app.fx.stop -= dt; app.fx.update(0); }
    else update(dt);
  }
  const t1 = performance.now();
  renderer.draw(app, time);
  if (DEBUG) { const t2 = performance.now(); window.__bjFrames = (window.__bjFrames || 0) + 1; if (t2 - t0 > 8) (window.__bjPerf ||= []).push([Math.round(t1 - t0), Math.round(t2 - t1), app.drag ? 'drag' : app.seq ? 'seq' : '-', app.fx.parts.length]); }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

toTitle();

// ---------- 디버그/테스트 훅 ----------
if (DEBUG) {
  window.__bjJokers = JOKERS.map((j) => j.id);
  window.__bj = {
    game, app, meta, ui, renderer,
    layout: () => L,
    toTitleForTest() { toTitle(); },
    stuckCheck() { const o = game.resolveStuck(); handleStuck(o); if (o === 'over') endNow(); return o; },
    jumpTo(ante, blind) {
      game.ante = ante; game.blind = blind; game.pickBoss(); game.startRound();
      ui.hideAll(); beginRound();
    },
    unlockAll() {
      rec.unlocked.jokers = window.__bjJokers.slice(); rec.discovered = window.__bjJokers.slice(); meta.save();
    },
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
      return {
        tokens: rec.tokens, level: meta.level.lvl, hasRun: !!rec.run, runKind: rec.run ? rec.run.kind : null,
        phase: game.phase, ui: ui.current || null, coach: ui.coachOpen, seq: !!app.seq, queue: app.queue.length, pending: !!app.pendingEnd,
        paused: app.paused, intro: !!app.intro, ante: game.ante, blind: game.blind, score: game.roundScore, target: game.target,
        coins: game.coins, jokers: game.jokers.map((j) => j.id), handsLeft: game.handsLeft, combo: game.combo,
        tray: game.tray.map((p) => (p ? p.shape.id : null)), board: game.board.filter(Boolean).length,
      };
    },
  };
}
