// 게임 로직 (DOM 없음, 순수 상태 머신)
import { CONFIG, DEBUG, targetFor, COLORS } from './config.js';
import { RNG } from './rng.js';
import { SHAPES, SHAPE_BY_ID } from './pieces.js';
import { JOKERS, JOKER_BY_ID, EDITIONS, editionEffect } from './jokers.js';
import { BOSSES, SHOWDOWNS, BOSS_BY_ID } from './bosses.js';
import { HANDS, HAND_KEYS, handType, PLANETS, GEM_CARDS, PACKS, VOUCHERS, PLANET_BY_ID, GEM_CARD_BY_ID, PACK_BY_ID } from './items.js';

const N = CONFIG.BOARD;
const idx = (r, c) => r * N + c;

export const DAILY_RULES = [
  { id: 'gemfest', name: '보석 축제', desc: '보석 박힌 조각이 훨씬 자주 등장' },
  { id: 'bigpurse', name: '두둑한 지갑', desc: '시작 코인 +$10' },
  { id: 'gift', name: '조커 선물', desc: '무작위 고급 조커 1장을 들고 시작' },
  { id: 'rush', name: '급행', desc: '트레이 -1, 목표 점수 x0.8' },
  { id: 'comboparty', name: '콤보 파티', desc: '콤보 유예 +2 배치' },
];

const emptyStats = () => ({ rounds: 0, bosses: 0, lines: 0, gems: 0 });
const packPiece = (p) => (p ? { s: p.shape.id, c: p.color, g: p.gems, h: !!p.hidden } : null);
const unpackPiece = (o) => (o && SHAPE_BY_ID[o.s] ? { shape: SHAPE_BY_ID[o.s], color: o.c | 0, gems: o.g || {}, hidden: !!o.h } : null);

export class Game {
  constructor() {
    this.rng = new RNG(1);
    this.phase = 'title';
    this.board = new Array(N * N).fill(null);
    this.tray = [null, null, null];
    this.jokers = [];
    this.vouchers = [];
    this.lineLv = Object.fromEntries(HAND_KEYS.map((k) => [k, 1]));
    this.opts = { stake: 1, deck: 'basic', pool: null, daily: false };
    this.runStats = emptyStats();
    this.pendingGems = [];
    this.applyOpts();
  }

  // ---------- 런 ----------
  // opts: { stake, deck, pool(조커 id 배열), daily, rule }
  newRun(seed, opts = {}) {
    this.seedStr = String(seed);
    this.rng = new RNG(this.seedStr);
    this.opts = { stake: 1, deck: 'basic', pool: null, daily: false, rule: null, ...opts };
    this.vouchers = [];
    this.lineLv = Object.fromEntries(HAND_KEYS.map((k) => [k, 1]));
    this.pendingGems = [];
    this.applyOpts();
    this.ante = 1;
    this.blind = 0; // 0 스몰, 1 빅, 2 보스
    this.coins = CONFIG.START_COINS + (this.opts.deck === 'rich' ? 6 : 0) + (this.opts.rule === 'bigpurse' ? 10 : 0) + (DEBUG ? CONFIG.DEBUG_BONUS_COINS : 0);
    this.jokers = [];
    this.endless = false;
    this.runBestHit = 0;
    this.totalLines = 0;
    this.runStats = emptyStats();
    this.lastBoss = null;
    this.lastShopIds = [];
    this.voucherOffer = null;
    this.voucherAnte = 0;
    if (this.opts.deck === 'joker') {
      const commons = this.poolIds().filter((id) => JOKER_BY_ID[id].rarity === 'common');
      if (commons.length) this.jokers.push({ id: this.rng.pick(commons), v: 0, price: CONFIG.PRICE.common });
    }
    if (this.opts.rule === 'gift') {
      const unc = this.poolIds().filter((id) => JOKER_BY_ID[id].rarity === 'uncommon');
      if (unc.length) this.jokers.push({ id: this.rng.pick(unc), v: 0, price: CONFIG.PRICE.uncommon });
    }
    this.pickBoss();
    this.startRound();
  }

  hasVoucher(id) { return this.vouchers.includes(id); }

  applyOpts() {
    const o = this.opts;
    this.baseSlots = CONFIG.JOKER_SLOTS - (o.deck === 'spare' ? 1 : 0);
    this.baseGrace = CONFIG.COMBO_GRACE + (o.deck === 'combo' ? 1 : 0) + (o.rule === 'comboparty' ? 2 : 0);
    this.baseGem = (o.deck === 'gem' ? CONFIG.GEM_PIECE_CHANCE : 0) + (o.rule === 'gemfest' ? 0.3 : 0);
    this.handsBonus = (o.deck === 'spare' ? 1 : 0) - (o.stake >= 4 ? 1 : 0) - (o.rule === 'rush' ? 1 : 0);
    this.stakeTargetMult = (o.stake >= 5 ? 1.6 : o.stake >= 3 ? 1.3 : 1) * (o.rule === 'rush' ? 0.8 : 1);
  }

  get jokerSlots() {
    return this.baseSlots + (this.hasVoucher('v_slot') ? 1 : 0) + this.jokers.filter((j) => j.ed === 'neg').length;
  }
  get comboGrace() {
    if (this.curse === 'slow') return 1;
    return this.baseGrace + (this.hasVoucher('v_grip') ? 1 : 0);
  }
  get gemBonus() { return this.baseGem + (this.hasVoucher('v_gemrain') ? 0.12 : 0); }
  get interestCap() {
    return CONFIG.INTEREST_MAX + (this.hasVoucher('v_vault') ? 5 : 0) + (this.hasPassive('interestUp') ? 5 : 0);
  }

  poolIds() { return this.opts.pool && this.opts.pool.length ? this.opts.pool.filter((id) => JOKER_BY_ID[id]) : JOKERS.map((j) => j.id); }

  targetOf(ante, blind, boss = this.boss) {
    let m = this.stakeTargetMult;
    if (blind === 2 && boss === 'greed') m *= 1.5;
    return targetFor(ante, blind, m);
  }

  levelSum() { return HAND_KEYS.reduce((a, k) => a + this.lineLv[k], 0); }
  handLevel(k) { return this.lineLv[k] + (this.hasPassive('architect') ? 2 : 0); }
  handValues(k, lines = 1) {
    const h = HANDS[k], lv = this.handLevel(k);
    let c = h.c + h.lc * (lv - 1), m = h.m + h.lm * (lv - 1);
    if (k === 'multi') m += Math.max(0, lines - 3);
    return { c, m, lv };
  }

  // ---------- 저장 스냅샷 ----------
  snapshot(kind) {
    const s = {
      v: 2, kind, seedStr: this.seedStr, rngS: this.rng.s, opts: this.opts,
      ante: this.ante, blind: this.blind, coins: this.coins,
      jokers: this.jokers.map((j) => ({ id: j.id, v: j.v || 0, price: j.price, ed: j.ed || null })),
      vouchers: this.vouchers, lineLv: this.lineLv, pendingGems: this.pendingGems,
      endless: this.endless, runBestHit: this.runBestHit, totalLines: this.totalLines, runStats: this.runStats,
      lastBoss: this.lastBoss, boss: this.boss, lastShopIds: this.lastShopIds,
      voucherOffer: this.voucherOffer, voucherAnte: this.voucherAnte,
    };
    if (kind === 'shop') {
      Object.assign(s, { shop: this.shop, rerollCost: this.rerollCost, rewards: this.rewards });
    } else if (kind === 'play') {
      Object.assign(s, {
        board: this.board, tray: this.tray.map(packPiece), target: this.target, roundScore: this.roundScore,
        combo: this.combo, missStreak: this.missStreak, placedCount: this.placedCount, handsLeft: this.handsLeft,
        trayClears: this.trayClears, lastClearLines: this.lastClearLines, trayFull: this.trayFull,
        disabled: this.jokers.map((j) => !!j.disabled),
      });
    }
    return JSON.parse(JSON.stringify(s));
  }

  restore(s) {
    if (!s || (s.v !== 1 && s.v !== 2)) throw new Error('bad save');
    this.seedStr = s.seedStr;
    this.rng = new RNG(this.seedStr);
    this.rng.s = s.rngS;
    this.opts = { stake: 1, deck: 'basic', pool: null, daily: false, rule: null, ...s.opts };
    this.applyOpts();
    this.ante = s.ante; this.blind = s.blind; this.coins = s.coins;
    this.jokers = (s.jokers || []).filter((j) => JOKER_BY_ID[j.id]).map((j) => ({ id: j.id, v: j.v || 0, price: j.price || 4, ed: j.ed || null }));
    this.vouchers = Array.isArray(s.vouchers) ? s.vouchers.slice() : [];
    this.lineLv = Object.fromEntries(HAND_KEYS.map((k) => [k, (s.lineLv && s.lineLv[k]) || 1]));
    this.pendingGems = Array.isArray(s.pendingGems) ? s.pendingGems.slice() : [];
    this.endless = !!s.endless; this.runBestHit = s.runBestHit || 0; this.totalLines = s.totalLines || 0;
    this.runStats = { ...emptyStats(), ...(s.runStats || {}) };
    this.lastBoss = s.lastBoss; this.boss = BOSS_BY_ID[s.boss] ? s.boss : 'lock';
    this.lastShopIds = s.lastShopIds || [];
    this.voucherOffer = s.voucherOffer || null; this.voucherAnte = s.voucherAnte || 0;
    this.packOpen = null;
    if (s.kind === 'shop' && s.shop) {
      this.shop = s.shop;
      this.rerollCost = s.rerollCost || CONFIG.REROLL_BASE;
      this.rewards = null;
      this.board.fill(null);
      this.tray = [null, null, null];
      this.target = this.targetOf(this.ante, this.blind);
      this.roundScore = 0; this.handsLeft = 0;
      this.phase = 'shop';
    } else if (s.kind === 'play' && Array.isArray(s.board)) {
      this.phase = 'play';
      this.shop = null;
      this.board = s.board.map((c) => (c ? { ...c } : null));
      this.tray = (s.tray || []).map(unpackPiece);
      while (this.tray.length < 3) this.tray.push(null);
      this.target = s.target; this.roundScore = s.roundScore; this.combo = s.combo || 0; this.missStreak = s.missStreak || 0;
      this.placedCount = s.placedCount || 0; this.handsLeft = s.handsLeft || 0; this.trayClears = s.trayClears || 0;
      this.lastClearLines = s.lastClearLines || 0; this.trayFull = !!s.trayFull;
      (s.disabled || []).forEach((d, i) => { if (this.jokers[i]) this.jokers[i].disabled = d; });
      this.gameOverReason = null;
    } else {
      this.startRound();
    }
  }

  // ---------- 보스 ----------
  isShowdown(ante = this.ante) { return ante % CONFIG.FINAL_ANTE === 0; }

  pickBoss() {
    if (this.isShowdown()) {
      this.boss = this.rng.pick(SHOWDOWNS).id;
      return;
    }
    const a = this.ante;
    const w = a <= 2 ? [3, 1, 0] : a <= 5 ? [1, 2, 1] : [1, 2, 2];
    const pool = BOSSES.filter((b) => b.id !== this.lastBoss && w[b.tier - 1] > 0);
    this.boss = this.rng.weighted(pool.map((b) => [b, w[b.tier - 1]])).id;
    this.lastBoss = this.boss;
  }

  get curse() { return this.blind === 2 ? this.boss : null; }
  get bossDef() { return BOSS_BY_ID[this.boss]; }
  get blindName() { return this.blind === 2 ? this.bossDef.name : CONFIG.BLIND_NAMES[this.blind]; }
  get gemsOff() { return this.curse === 'nogem' || this.curse === 'tower'; }

  startRound() {
    this.phase = 'play';
    this.board.fill(null);
    this.target = this.targetOf(this.ante, this.blind);
    this.roundScore = 0;
    this.combo = 0;
    this.missStreak = 0;
    this.placedCount = 0;
    this.trayClears = 0;
    this.lastClearLines = 0;
    this.handsLeft = CONFIG.HANDS + this.handsBonus + (this.hasVoucher('v_tray') ? 1 : 0) - (this.curse === 'poor' ? 1 : 0);
    this.gameOverReason = null;
    this.shop = null;
    this.packOpen = null;
    this.jokers.forEach((j, i) => { j.disabled = this.curse === 'seal' && i === 0; });
    for (const j of this.jokers) if (j.id === 'chain') j.v = 0;
    if (this.curse === 'lock') this.placeStones();
    if (this.curse === 'rubble') this.scatterRubble(10);
    this.tray = [null, null, null];
    this.drawTray();
  }

  placeStones() {
    for (const [r, c] of [[3, 3], [3, 4], [4, 3], [4, 4]]) this.board[idx(r, c)] = { color: -1, stone: true };
  }

  scatterRubble(n) {
    let placed = 0, guard = 0;
    while (placed < n && guard++ < 500) {
      const r = this.rng.int(N), c = this.rng.int(N);
      if (this.board[idx(r, c)]) continue;
      this.board[idx(r, c)] = { color: this.rng.int(COLORS.length), junk: true };
      if (this.fullLines().lines) { this.board[idx(r, c)] = null; continue; }
      placed++;
    }
    return placed;
  }

  hasPassive(p) { return this.jokers.some((j) => !j.disabled && JOKER_BY_ID[j.id].passive === p); }

  // ---------- 조각 ----------
  makePiece(shape) {
    const giant = this.curse === 'giant';
    if (!shape) {
      const pool = SHAPES.filter((s) => !(giant && s.size <= 2));
      const heavy = this.curse === 'heavy';
      shape = this.rng.weighted(pool.map((s) => [s, s.weight * (heavy && (s.size >= 5 || s.tags.includes('rect')) ? 3 : 1)]));
    }
    const gems = {};
    let gemChance = CONFIG.GEM_PIECE_CHANCE;
    if (this.hasPassive('gemChance')) gemChance += 0.3;
    gemChance += this.gemBonus || 0;
    const gemEntries = Object.entries(CONFIG.GEM_WEIGHTS);
    const tries = gemChance > 0.4 ? 2 : 1;
    for (let t = 0; t < tries; t++) {
      if (this.rng.chance(t === 0 ? Math.min(gemChance, 0.9) : 0.3)) {
        gems[this.rng.int(shape.size)] = this.rng.weighted(gemEntries);
      }
    }
    if (this.hasPassive('midas')) {
      const k = this.rng.int(shape.size);
      if (!gems[k]) gems[k] = 'gold';
    }
    return { shape, color: this.rng.int(COLORS.length), gems, hidden: false };
  }

  drawTray() {
    this.handsLeft--;
    const pieces = [0, 1, 2].map(() => this.makePiece());
    // 보석 부여 카드
    if (this.pendingGems.length) {
      const gem = this.pendingGems.shift();
      for (const p of pieces) p.gems[this.rng.int(p.shape.size)] = gem;
    }
    const curse = this.curse;
    if (curse === 'creep' && this.placedCount > 0) this.scatterRubble(2);
    if (curse === 'tower') this.scatterRubble(3);
    if (curse === 'night' && this.jokers.length) {
      this.jokers.forEach((j) => { j.disabled = false; });
      this.jokers[this.rng.int(this.jokers.length)].disabled = true;
    }
    // 약한 보정: 놓을 수 있는 조각이 하나도 없으면 높은 확률로 하나를 교체
    const visible = curse === 'fog' ? [0, 1] : [0, 1, 2];
    if (!pieces.some((p) => this.fitsAnywhere(p.shape)) && this.rng.chance(CONFIG.PLACEABLE_ASSIST)) {
      const giant = curse === 'giant';
      const pool = this.rng.shuffle(SHAPES.filter((s) => !(giant && s.size <= 2)).slice());
      const fit = pool.find((s) => this.fitsAnywhere(s));
      if (fit) pieces[visible[this.rng.int(visible.length)]] = this.makePiece(fit);
    }
    if (curse === 'fog') pieces[2].hidden = true;
    this.tray = pieces;
    this.trayClears = 0;
    this.trayFull = true;
  }

  canPlace(shape, r, c) {
    for (const [dr, dc] of shape.cells) {
      const rr = r + dr, cc = c + dc;
      if (rr < 0 || cc < 0 || rr >= N || cc >= N) return false;
      if (this.board[idx(rr, cc)]) return false;
    }
    return true;
  }

  fitsAnywhere(shape) {
    for (let r = 0; r <= N - shape.h; r++) for (let c = 0; c <= N - shape.w; c++) if (this.canPlace(shape, r, c)) return true;
    return false;
  }

  anyPlaceable() {
    return this.tray.some((p) => p && !p.hidden && this.fitsAnywhere(p.shape));
  }

  // 공개 조각이 모두 안 들어가면 숨긴 조각을 공개 (안개)
  revealIfStuck() {
    if (this.anyPlaceable()) return false;
    const hidden = this.tray.filter((p) => p && p.hidden);
    if (!hidden.length) return false;
    hidden.forEach((p) => { p.hidden = false; });
    return true;
  }

  fullLines(board = this.board) {
    const rows = [], cols = [];
    for (let r = 0; r < N; r++) { let f = true; for (let c = 0; c < N; c++) if (!board[idx(r, c)]) { f = false; break; } if (f) rows.push(r); }
    for (let c = 0; c < N; c++) { let f = true; for (let r = 0; r < N; r++) if (!board[idx(r, c)]) { f = false; break; } if (f) cols.push(c); }
    return { rows, cols, lines: rows.length + cols.length };
  }

  previewLines(piece, r, c) {
    const b = this.board.slice();
    for (const [dr, dc] of piece.shape.cells) b[idx(r + dr, c + dc)] = { color: 0 };
    return this.fullLines(b);
  }

  // ---------- 배치 + 점수 ----------
  place(trayIdx, r, c) {
    if (this.phase !== 'play') return null;
    const piece = this.tray[trayIdx];
    if (!piece || piece.hidden || !this.canPlace(piece.shape, r, c)) return null;
    const shape = piece.shape;
    const firstInTray = this.tray.every((p) => p);
    const placed = [];
    shape.cells.forEach(([dr, dc], k) => {
      const cell = { color: piece.color, gem: piece.gems[k] || null };
      this.board[idx(r + dr, c + dc)] = cell;
      placed.push({ r: r + dr, c: c + dc, gem: cell.gem });
    });
    this.tray[trayIdx] = null;
    this.placedCount++;
    const lastInTray = this.tray.every((p) => !p);
    for (const p of this.tray) if (p) p.hidden = false;

    const res = { placed, placePts: shape.size * CONFIG.PLACE_PTS_PER_CELL, bubbles: [], steps: [], total: 0, cleared: null, coins: 0, piece: shape, color: piece.color, row: r, col: c };
    this.roundScore += res.placePts;

    this.jokers.forEach((j, i) => {
      if (j.disabled) return;
      const d = JOKER_BY_ID[j.id];
      if (d.onPlace) { const txt = d.onPlace(this, j, shape, placed); if (txt) res.bubbles.push({ idx: i, text: txt }); }
    });

    const { rows, cols, lines } = this.fullLines();
    if (!lines) {
      this.missStreak++;
      this.jokers.forEach((j) => { if (!j.disabled) { const d = JOKER_BY_ID[j.id]; if (d.onMiss) d.onMiss(this, j); } });
      if (this.combo > 0 && this.missStreak >= this.comboGrace) {
        this.combo = 0;
        res.comboBroken = true;
        this.jokers.forEach((j) => { const d = JOKER_BY_ID[j.id]; if (d.onComboBreak) d.onComboBreak(this, j); });
      }
      return res;
    }

    const clearSet = new Map();
    const inRow = new Set(), inCol = new Set();
    for (const rr of rows) for (let cc = 0; cc < N; cc++) { clearSet.set(idx(rr, cc), { r: rr, c: cc }); inRow.add(idx(rr, cc)); }
    for (const cc of cols) for (let rr = 0; rr < N; rr++) { clearSet.set(idx(rr, cc), { r: rr, c: cc }); inCol.add(idx(rr, cc)); }
    const cells = [];
    for (const [k, pos] of clearSet) {
      const cell = this.board[k];
      if (cell.stone) continue;
      cells.push({ ...pos, color: cell.color, gem: cell.gem || null, k });
    }
    // 칩 무효 저주
    const curse = this.curse;
    const rowNull = curse === 'flat', colNull = curse === 'vertnull';
    const okCell = (cl) => (rowNull ? inCol.has(cl.k) : colNull ? inRow.has(cl.k) : true);
    const chipCells = cells.filter(okCell).length;
    const okLines = (rowNull ? 0 : rows.length) + (colNull ? 0 : cols.length);

    const hand = handType(rows.length, cols.length);
    const hv = this.handValues(hand, lines);
    const comboBefore = curse === 'nocombo' ? 0 : this.combo;
    let chips = chipCells * CONFIG.CHIP_PER_CELL + Math.round(hv.c * (okLines / lines));
    let mult = hv.m + comboBefore;
    const steps = res.steps;
    steps.push({ kind: 'base', chips, mult, lines, combo: comboBefore, hand, lv: hv.lv });

    const apply = (e) => {
      if (e.t === 'chips') chips += e.v;
      else if (e.t === 'mult') mult += e.v;
      else if (e.t === 'xmult') mult *= e.v;
      else if (e.t === 'coins') { this.coins += e.v; res.coins += e.v; }
    };

    // 보석
    const gemTimes = this.hasPassive('gemDouble') ? 2 : 1;
    const glassX = this.hasPassive('glassCannon') ? 2.5 : CONFIG.GEM_GLASS_XMULT;
    const glassBreak = this.hasPassive('glassCannon') ? 0.5 : CONFIG.GEM_GLASS_BREAK;
    const midas = this.hasPassive('midas');
    let gemCount = 0, goldCount = 0;
    const sorted = cells.slice().sort((a, b) => a.r - b.r || a.c - b.c);
    if (!this.gemsOff) {
      for (const cl of sorted) {
        if (!cl.gem || cl.gem === 'steel') continue;
        gemCount++;
        if (cl.gem === 'gold') goldCount++;
        for (let t = 0; t < gemTimes; t++) {
          let e;
          if (cl.gem === 'gold') e = { t: 'chips', v: CONFIG.GEM_GOLD_CHIPS };
          else if (cl.gem === 'ruby') e = { t: 'mult', v: CONFIG.GEM_RUBY_MULT };
          else e = { t: 'xmult', v: glassX };
          apply(e);
          steps.push({ kind: 'gem', r: cl.r, c: cl.c, gem: cl.gem, e, chips, mult });
          if (cl.gem === 'gold' && midas) { const e2 = { t: 'xmult', v: 1.3 }; apply(e2); steps.push({ kind: 'gem', r: cl.r, c: cl.c, gem: 'gold', e: e2, chips, mult }); }
        }
        if (cl.gem === 'glass' && this.rng.chance(glassBreak)) cl.broken = true;
      }
      const steelX = this.hasPassive('steelBoost') ? 1.5 : CONFIG.GEM_STEEL_XMULT;
      for (let k = 0; k < N * N; k++) {
        const cell = this.board[k];
        if (!cell || cell.gem !== 'steel') continue;
        if (clearSet.has(k)) gemCount++;
        for (let t = 0; t < gemTimes; t++) {
          const e = { t: 'xmult', v: steelX };
          apply(e);
          steps.push({ kind: 'gem', r: Math.floor(k / N), c: k % N, gem: 'steel', e, chips, mult });
        }
      }
    }

    let remainingAfter = 0;
    for (let k = 0; k < N * N; k++) { const cell = this.board[k]; if (cell && !cell.stone && !clearSet.has(k)) remainingAfter++; }
    const corners = [idx(0, 0), idx(0, N - 1), idx(N - 1, 0), idx(N - 1, N - 1)];
    const edge = (i) => i === 0 || i === N - 1;
    const mid = (i) => i === 3 || i === 4;
    this.trayClears++;
    const ctx = {
      rows, cols, lines, cells, cellCount: cells.length, piece: shape, hand,
      combo: this.combo + 1, lastInTray, firstInTray, gemCount, goldCount,
      hasCorner: corners.some((k) => clearSet.has(k)),
      edgeLines: rows.filter(edge).length + cols.filter(edge).length,
      centerLines: rows.filter(mid).length + cols.filter(mid).length,
      remainingAfter, boardEmptyAfter: remainingAfter === 0,
      prevLines: this.lastClearLines, trayClears: this.trayClears,
    };

    this.jokers.forEach((j, i) => {
      if (j.disabled) return;
      const d = JOKER_BY_ID[j.id];
      let effects = null;
      if (d.id === 'dupe') {
        const right = this.jokers[i + 1];
        const rd = right && !right.disabled && JOKER_BY_ID[right.id];
        if (rd && rd.onScore && rd.id !== 'dupe') effects = rd.onScore(this, { ...right }, ctx);
      } else if (d.onScore) effects = d.onScore(this, j, ctx);
      if (effects) for (const e of effects) { apply(e); steps.push({ kind: 'joker', idx: i, e, chips, mult }); }
      const ee = editionEffect(j.ed);
      if (ee) { apply(ee); steps.push({ kind: 'joker', idx: i, e: ee, chips, mult, ed: j.ed }); }
    });

    // 저주 최종 보정
    if (curse === 'lonely' && lines === 1) { const e = { t: 'xmult', v: 0.5 }; apply(e); steps.push({ kind: 'curse', e, chips, mult }); }
    if (curse === 'crimson') { const e = { t: 'xmult', v: 0.5 }; apply(e); steps.push({ kind: 'curse', e, chips, mult }); }

    const total = Math.floor(chips * mult);
    res.total = total;
    res.chips = chips;
    res.mult = mult;
    res.hand = hand;
    res.cleared = { rows, cols, cells };
    this.roundScore += total;
    this.totalLines += lines;
    this.runStats.lines += lines;
    this.runStats.gems += cells.filter((cl) => cl.gem).length;
    res.boardEmpty = remainingAfter === 0;
    if (res.boardEmpty) { this.coins += 3; res.coins += 3; }
    if (curse === 'tax' && this.coins > 0) { this.coins--; res.coins--; res.taxed = true; }
    if (total > this.runBestHit) this.runBestHit = total;

    for (const cl of cells) this.board[cl.k] = null;
    this.combo++;
    this.missStreak = 0;
    this.lastClearLines = lines;
    res.combo = this.combo;
    return res;
  }

  // 배치 직후 상태 결정 (연출과 무관하게 즉시)
  resolve() {
    if (this.roundScore >= this.target) {
      this.finishRound();
      return 'roundClear';
    }
    if (this.tray.every((p) => !p)) {
      if (this.handsLeft <= 0) return this.tryPhoenix('hands');
      this.drawTray();
      this.revealIfStuck();
      if (!this.anyPlaceable()) return this.tryPhoenix('stuck');
      return 'newTray';
    }
    this.revealIfStuck();
    if (!this.anyPlaceable()) return this.tryPhoenix('stuck');
    return 'continue';
  }

  tryPhoenix(reason) {
    const i = this.jokers.findIndex((j) => j.id === 'phoenix' && !j.disabled);
    if (i >= 0) {
      this.jokers.splice(i, 1);
      this.board.fill(null);
      if (this.curse === 'lock') this.placeStones();
      this.handsLeft += 1;
      this.drawTray();
      return 'phoenix';
    }
    this.gameOver(reason);
    return 'over';
  }

  gameOver(reason) {
    this.phase = 'over';
    this.gameOverReason = reason;
  }

  finishRound() {
    const base = this.opts.stake >= 2 && this.blind === 0 ? 0 : CONFIG.BLIND_REWARD[this.blind];
    const hands = this.handsLeft * CONFIG.COIN_PER_HAND;
    const interest = this.opts.stake >= 5 ? 0 : Math.min(this.interestCap, Math.floor(this.coins / CONFIG.INTEREST_STEP));
    let jokerCoins = 0;
    for (const j of this.jokers) { const d = JOKER_BY_ID[j.id]; if (d.onRoundEnd && !j.disabled) jokerCoins += d.onRoundEnd(this, j) || 0; }
    const total = base + hands + interest + jokerCoins;
    this.coins += total;
    this.jokers.forEach((j) => { j.disabled = false; });
    this.rewards = { base, hands, handsLeft: this.handsLeft, interest, jokerCoins, total };
    this.wasFinal = !this.endless && this.blind === 2 && this.ante === CONFIG.FINAL_ANTE;
    this.phase = this.wasFinal ? 'victory' : 'shop';
    this.clearedAnte = this.ante;
    this.clearedBlind = this.blind;
    this.runStats.rounds++;
    if (this.blind === 2) this.runStats.bosses++;
    this.advance();
    this.openShop();
  }

  advance() {
    this.blind++;
    if (this.blind > 2) {
      this.blind = 0;
      this.ante++;
      this.pickBoss();
    }
  }

  // ---------- 상점 ----------
  price(base) { return Math.max(1, base - (this.hasVoucher('v_coupon') ? 1 : 0)); }

  openShop() {
    this.rerollCost = CONFIG.REROLL_BASE - (this.hasVoucher('v_coupon') ? 2 : 0);
    if (this.voucherAnte !== this.ante) {
      const left = VOUCHERS.filter((v) => !this.vouchers.includes(v.id));
      this.voucherOffer = left.length ? { id: this.rng.pick(left).id, price: 10, sold: false } : null;
      this.voucherAnte = this.ante;
    }
    this.shop = {
      jokers: this.rollJokers(CONFIG.SHOP_SIZE + (this.hasVoucher('v_wholesale') ? 1 : 0)),
      cards: this.rollCards(2),
      packs: this.rollPacks(2),
    };
  }

  rollEdition() {
    const r = this.rng.next();
    if (r < 0.015) return 'neg';
    if (r < 0.035) return 'poly';
    if (r < 0.07) return 'holo';
    if (r < 0.12) return 'foil';
    return null;
  }

  jokerOffer(d, ed) {
    const base = d.rarity === 'legendary' ? 20 : CONFIG.PRICE[d.rarity];
    return { id: d.id, ed, price: this.price(base + (ed ? EDITIONS[ed].price : 0)), sold: false };
  }

  rollJokers(n, legendBoost = 1) {
    const owned = new Set(this.jokers.map((j) => j.id));
    const offers = [];
    const recent = new Set(this.lastShopIds || []);
    for (let i = 0; i < n; i++) {
      const taken = new Set([...owned, ...offers.map((o) => o.id)]);
      const pool = this.poolIds().map((id) => JOKER_BY_ID[id]).filter((j) => !taken.has(j.id));
      if (!pool.length) break;
      const d = this.rng.weighted(pool.map((j) => {
        let w = j.rarity === 'legendary' ? 0.6 * legendBoost : CONFIG.RARITY_WEIGHT[j.rarity];
        if (recent.has(j.id)) w *= 0.25;
        return [j, w];
      }));
      offers.push(this.jokerOffer(d, this.rollEdition()));
    }
    this.lastShopIds = offers.map((o) => o.id);
    return offers;
  }

  rollCards(n) {
    const out = [];
    for (let i = 0; i < n; i++) {
      if (this.rng.chance(0.6)) out.push({ kind: 'planet', id: this.rng.pick(PLANETS).id, price: this.price(3), sold: false });
      else out.push({ kind: 'gem', id: this.rng.pick(GEM_CARDS).id, price: this.price(3), sold: false });
    }
    return out;
  }

  rollPacks(n) {
    const out = [];
    for (let i = 0; i < n; i++) {
      const p = this.rng.pick(PACKS);
      out.push({ id: p.id, price: this.price(p.price), sold: false });
    }
    return out;
  }

  buyJoker(i) {
    const o = this.shop && this.shop.jokers[i];
    if (!o || o.sold || this.coins < o.price) return false;
    if (this.jokers.length >= this.jokerSlots && o.ed !== 'neg') return false;
    this.coins -= o.price;
    o.sold = true;
    this.jokers.push({ id: o.id, v: 0, price: o.price, ed: o.ed || null });
    return true;
  }

  useCard(kind, id) {
    if (kind === 'planet') {
      const p = PLANET_BY_ID[id];
      this.lineLv[p.hand] += this.hasVoucher('v_telescope') ? 2 : 1;
      return p.hand;
    }
    const g = GEM_CARD_BY_ID[id];
    this.pendingGems.push(g.gem);
    return g.gem;
  }

  buyCard(i) {
    const o = this.shop && this.shop.cards[i];
    if (!o || o.sold || this.coins < o.price) return false;
    this.coins -= o.price;
    o.sold = true;
    this.useCard(o.kind, o.id);
    return true;
  }

  buyPack(i) {
    const o = this.shop && this.shop.packs[i];
    if (!o || o.sold || this.coins < o.price) return false;
    this.coins -= o.price;
    o.sold = true;
    const pk = PACK_BY_ID[o.id];
    let choices;
    if (pk.kind === 'joker') choices = this.rollJokers(3, 5).map((j) => ({ kind: 'joker', id: j.id, ed: j.ed }));
    else if (pk.kind === 'planet') choices = this.rng.shuffle(PLANETS.slice()).slice(0, 3).map((p) => ({ kind: 'planet', id: p.id }));
    else choices = this.rng.shuffle(GEM_CARDS.slice()).slice(0, 3).map((p) => ({ kind: 'gem', id: p.id }));
    this.packOpen = { pack: o.id, kind: pk.kind, choices };
    return true;
  }

  choosePack(k) {
    const po = this.packOpen;
    if (!po) return false;
    const c = po.choices[k];
    if (!c) return false;
    if (c.kind === 'joker') {
      if (this.jokers.length >= this.jokerSlots && c.ed !== 'neg') return false;
      const d = JOKER_BY_ID[c.id];
      this.jokers.push({ id: c.id, v: 0, price: d.rarity === 'legendary' ? 20 : CONFIG.PRICE[d.rarity], ed: c.ed || null });
    } else this.useCard(c.kind, c.id);
    this.packOpen = null;
    return true;
  }

  skipPack() { this.packOpen = null; }

  buyVoucher() {
    const o = this.voucherOffer;
    if (!o || o.sold || this.coins < o.price) return false;
    this.coins -= o.price;
    o.sold = true;
    this.vouchers.push(o.id);
    return true;
  }

  sellValue(j) { return Math.max(1, Math.floor(j.price / 2)); }

  sell(i) {
    const j = this.jokers[i];
    if (!j) return false;
    this.coins += this.sellValue(j);
    this.jokers.splice(i, 1);
    return true;
  }

  reroll() {
    if (this.coins < this.rerollCost) return false;
    this.coins -= this.rerollCost;
    this.rerollCost++;
    this.shop.jokers = this.rollJokers(CONFIG.SHOP_SIZE + (this.hasVoucher('v_wholesale') ? 1 : 0));
    return true;
  }

  moveJoker(from, to) {
    if (from === to || from < 0 || to < 0 || from >= this.jokers.length || to >= this.jokers.length) return;
    const [j] = this.jokers.splice(from, 1);
    this.jokers.splice(to, 0, j);
  }

  continueEndless() {
    this.endless = true;
    this.phase = 'shop';
  }

  nextRound() { this.startRound(); }
}
