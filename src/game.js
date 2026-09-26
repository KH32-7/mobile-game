// 게임 로직 (DOM 없음, 순수 상태 머신)
import { CONFIG, DEBUG, targetFor, COLORS } from './config.js';
import { RNG } from './rng.js';
import { SHAPES } from './pieces.js';
import { JOKERS, JOKER_BY_ID } from './jokers.js';
import { BOSSES, BOSS_BY_ID } from './bosses.js';

const N = CONFIG.BOARD;
const idx = (r, c) => r * N + c;

export class Game {
  constructor() {
    this.rng = new RNG(1);
    this.phase = 'title';
    this.board = new Array(N * N).fill(null);
    this.tray = [null, null, null];
    this.jokers = [];
    this.stats = { bestHit: 0 };
  }

  // ---------- 런 ----------
  newRun(seed) {
    this.seedStr = String(seed);
    this.rng = new RNG(this.seedStr);
    this.ante = 1;
    this.blind = 0; // 0 스몰, 1 빅, 2 보스
    this.coins = CONFIG.START_COINS + (DEBUG ? CONFIG.DEBUG_BONUS_COINS : 0);
    this.jokers = [];
    this.endless = false;
    this.runBestHit = 0;
    this.totalLines = 0;
    this.lastBoss = null;
    this.pickBoss();
    this.startRound();
  }

  pickBoss() {
    const pool = BOSSES.filter((b) => b.id !== this.lastBoss);
    this.boss = this.rng.pick(pool).id;
    this.lastBoss = this.boss;
  }

  get curse() { return this.blind === 2 ? this.boss : null; }
  get bossDef() { return BOSS_BY_ID[this.boss]; }
  get blindName() { return this.blind === 2 ? this.bossDef.name : CONFIG.BLIND_NAMES[this.blind]; }

  startRound() {
    this.phase = 'play';
    this.board.fill(null);
    this.target = targetFor(this.ante, this.blind);
    this.roundScore = 0;
    this.combo = 0;
    this.missStreak = 0;
    this.placedCount = 0;
    this.handsLeft = CONFIG.HANDS - (this.curse === 'poor' ? 2 : 0);
    this.gameOverReason = null;
    this.shop = null;
    this.jokers.forEach((j, i) => { j.disabled = this.curse === 'seal' && i === 0; });
    for (const j of this.jokers) if (JOKER_BY_ID[j.id].id === 'chain') j.v = 0;
    if (this.curse === 'lock') {
      for (const [r, c] of [[3, 3], [3, 4], [4, 3], [4, 4]]) this.board[idx(r, c)] = { color: -1, stone: true };
    }
    if (this.curse === 'rubble') this.scatterRubble(12);
    this.tray = [null, null, null];
    this.drawTray();
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
  }

  hasPassive(p) { return this.jokers.some((j) => !j.disabled && JOKER_BY_ID[j.id].passive === p); }

  // ---------- 조각 ----------
  makePiece(shape) {
    const giant = this.curse === 'giant';
    if (!shape) {
      const pool = SHAPES.filter((s) => !(giant && s.size <= 2));
      shape = this.rng.weighted(pool.map((s) => [s, s.weight]));
    }
    const gems = {};
    let gemChance = CONFIG.GEM_PIECE_CHANCE;
    if (this.hasPassive('gemChance')) gemChance += 0.3;
    const gemEntries = Object.entries(CONFIG.GEM_WEIGHTS);
    let tries = gemChance > 0.4 ? 2 : 1;
    for (let t = 0; t < tries; t++) {
      if (this.rng.chance(t === 0 ? Math.min(gemChance, 0.9) : 0.3)) {
        gems[this.rng.int(shape.size)] = this.rng.weighted(gemEntries);
      }
    }
    return { shape, color: this.rng.int(COLORS.length), gems, hidden: false };
  }

  drawTray() {
    this.handsLeft--;
    const pieces = [0, 1, 2].map(() => this.makePiece());
    const visible = this.curse === 'fog' ? [0, 1] : [0, 1, 2];
    // 약한 보정: 놓을 수 있는 조각이 하나도 없으면 높은 확률로 하나를 교체
    if (!visible.some((i) => this.fitsAnywhere(pieces[i].shape)) && this.rng.chance(CONFIG.PLACEABLE_ASSIST)) {
      const giant = this.curse === 'giant';
      const pool = this.rng.shuffle(SHAPES.filter((s) => !(giant && s.size <= 2)).slice());
      const fit = pool.find((s) => this.fitsAnywhere(s));
      if (fit) pieces[visible[this.rng.int(visible.length)]] = this.makePiece(fit);
    }
    if (this.curse === 'fog') pieces[2].hidden = true;
    this.tray = pieces;
    this.trayDrawnAt = this.placedCount;
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

  fullLines(board = this.board) {
    const rows = [], cols = [];
    for (let r = 0; r < N; r++) { let f = true; for (let c = 0; c < N; c++) if (!board[idx(r, c)]) { f = false; break; } if (f) rows.push(r); }
    for (let c = 0; c < N; c++) { let f = true; for (let r = 0; r < N; r++) if (!board[idx(r, c)]) { f = false; break; } if (f) cols.push(c); }
    return { rows, cols, lines: rows.length + cols.length };
  }

  // 놓았을 때 지워질 줄 미리보기
  previewLines(piece, r, c) {
    const b = this.board.slice();
    for (const [dr, dc] of piece.shape.cells) b[idx(r + dr, c + dc)] = { color: 0 };
    return this.fullLines(b);
  }

  // ---------- 배치 + 점수 ----------
  place(trayIdx, r, c) {
    const piece = this.tray[trayIdx];
    if (!piece || piece.hidden || !this.canPlace(piece.shape, r, c)) return null;
    const shape = piece.shape;
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

    const res = { placed, placePts: shape.size * CONFIG.PLACE_PTS_PER_CELL, bubbles: [], steps: [], total: 0, cleared: null, coins: 0, piece: shape, color: piece.color };
    this.roundScore += res.placePts;

    // 배치 훅
    this.jokers.forEach((j, i) => {
      if (j.disabled) return;
      const d = JOKER_BY_ID[j.id];
      if (d.onPlace) { const txt = d.onPlace(this, j, shape); if (txt) res.bubbles.push({ idx: i, text: txt }); }
    });

    const { rows, cols, lines } = this.fullLines();
    if (!lines) {
      this.missStreak++;
      if (this.combo > 0 && this.missStreak >= CONFIG.COMBO_GRACE) {
        this.combo = 0;
        res.comboBroken = true;
        this.jokers.forEach((j) => { const d = JOKER_BY_ID[j.id]; if (d.onComboBreak) d.onComboBreak(this, j); });
      }
      return res;
    }

    // 제거 대상 칸
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
    const flat = this.curse === 'flat';
    const chipCells = flat ? cells.filter((cl) => inCol.has(cl.k)).length : cells.length;
    const chipLines = flat ? cols.length : lines;

    const comboBefore = this.curse === 'nocombo' ? 0 : this.combo;
    let chips = chipCells * CONFIG.CHIP_PER_CELL + chipLines * CONFIG.CHIP_PER_LINE;
    let mult = 1 + (lines - 1) + comboBefore;
    const steps = res.steps;
    steps.push({ kind: 'base', chips, mult, lines, combo: comboBefore });

    const apply = (e) => {
      if (e.t === 'chips') chips += e.v;
      else if (e.t === 'mult') mult += e.v;
      else if (e.t === 'xmult') mult *= e.v;
      else if (e.t === 'coins') { this.coins += e.v; res.coins += e.v; }
    };

    // 보석
    const gemTimes = this.hasPassive('gemDouble') ? 2 : 1;
    let gemCount = 0;
    const sorted = cells.slice().sort((a, b) => a.r - b.r || a.c - b.c);
    for (const cl of sorted) {
      if (!cl.gem || cl.gem === 'steel') continue;
      gemCount++;
      for (let t = 0; t < gemTimes; t++) {
        let e;
        if (cl.gem === 'gold') e = { t: 'chips', v: CONFIG.GEM_GOLD_CHIPS };
        else if (cl.gem === 'ruby') e = { t: 'mult', v: CONFIG.GEM_RUBY_MULT };
        else e = { t: 'xmult', v: CONFIG.GEM_GLASS_XMULT };
        apply(e);
        steps.push({ kind: 'gem', r: cl.r, c: cl.c, gem: cl.gem, e, chips, mult });
      }
      if (cl.gem === 'glass' && this.rng.chance(CONFIG.GEM_GLASS_BREAK)) cl.broken = true;
    }
    // 강철: 줄 제거가 일어날 때 보드 위 모든 강철 칸 발동
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

    // 제거 후 상태 (조커 판정용)
    let remainingAfter = 0;
    for (let k = 0; k < N * N; k++) { const cell = this.board[k]; if (cell && !cell.stone && !clearSet.has(k)) remainingAfter++; }
    const corners = [idx(0, 0), idx(0, N - 1), idx(N - 1, 0), idx(N - 1, N - 1)];
    const ctx = {
      rows, cols, lines, cells, cellCount: cells.length, piece: shape,
      combo: this.combo + 1, lastInTray, gemCount,
      hasCorner: corners.some((k) => clearSet.has(k)),
      remainingAfter, boardEmptyAfter: remainingAfter === 0,
    };

    this.jokers.forEach((j, i) => {
      if (j.disabled) return;
      const d = JOKER_BY_ID[j.id];
      if (!d.onScore) return;
      const effects = d.onScore(this, j, ctx);
      if (!effects) return;
      for (const e of effects) {
        apply(e);
        steps.push({ kind: 'joker', idx: i, e, chips, mult });
      }
    });

    const total = Math.floor(chips * mult);
    res.total = total;
    res.chips = chips;
    res.mult = mult;
    res.cleared = { rows, cols, cells };
    this.roundScore += total;
    this.totalLines += lines;
    if (total > this.runBestHit) this.runBestHit = total;

    // 보드에서 제거
    for (const cl of cells) this.board[cl.k] = null;
    this.combo++;
    this.missStreak = 0;
    res.combo = this.combo;
    return res;
  }

  // 배치 연출이 끝난 뒤 상태 결정
  resolve() {
    if (this.roundScore >= this.target) {
      this.finishRound();
      return 'roundClear';
    }
    if (this.tray.every((p) => !p)) {
      if (this.handsLeft <= 0) { this.gameOver('hands'); return 'over'; }
      this.drawTray();
      if (!this.anyPlaceable()) { this.gameOver('stuck'); return 'over'; }
      return 'newTray';
    }
    if (!this.anyPlaceable()) { this.gameOver('stuck'); return 'over'; }
    return 'continue';
  }

  gameOver(reason) {
    this.phase = 'over';
    this.gameOverReason = reason;
  }

  finishRound() {
    const base = CONFIG.BLIND_REWARD[this.blind];
    const hands = this.handsLeft * CONFIG.COIN_PER_HAND;
    const interest = Math.min(CONFIG.INTEREST_MAX, Math.floor(this.coins / CONFIG.INTEREST_STEP));
    let jokerCoins = 0;
    for (const j of this.jokers) { const d = JOKER_BY_ID[j.id]; if (d.onRoundEnd && !j.disabled) jokerCoins += d.onRoundEnd(this, j); }
    const total = base + hands + interest + jokerCoins;
    this.coins += total;
    this.jokers.forEach((j) => { j.disabled = false; });
    this.rewards = { base, hands, handsLeft: this.handsLeft, interest, jokerCoins, total };
    this.wasFinal = !this.endless && this.blind === 2 && this.ante === CONFIG.FINAL_ANTE;
    this.phase = this.wasFinal ? 'victory' : 'shop';
    this.clearedAnte = this.ante;
    this.clearedBlind = this.blind;
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
  openShop() {
    this.rerollCost = CONFIG.REROLL_BASE;
    this.shop = this.rollOffers();
  }

  rollOffers() {
    const owned = new Set(this.jokers.map((j) => j.id));
    const offers = [];
    for (let i = 0; i < CONFIG.SHOP_SIZE; i++) {
      const taken = new Set([...owned, ...offers.map((o) => o.id)]);
      const pool = JOKERS.filter((j) => !taken.has(j.id));
      if (!pool.length) break;
      const d = this.rng.weighted(pool.map((j) => [j, CONFIG.RARITY_WEIGHT[j.rarity]]));
      offers.push({ id: d.id, price: CONFIG.PRICE[d.rarity], sold: false });
    }
    return offers;
  }

  buy(i) {
    const o = this.shop && this.shop[i];
    if (!o || o.sold || this.coins < o.price || this.jokers.length >= CONFIG.JOKER_SLOTS) return false;
    this.coins -= o.price;
    o.sold = true;
    this.jokers.push({ id: o.id, v: 0, price: o.price });
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
    this.shop = this.rollOffers();
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
