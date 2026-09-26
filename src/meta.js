// 장기 진행 (영구 저장, 버전 + 마이그레이션)
import { DEBUG } from './config.js';
import { JOKERS, JOKER_BY_ID } from './jokers.js';
import { RNG } from './rng.js';
import {
  STARTER_JOKERS, UNLOCK_COST, DECKS, DECK_BY_ID, STAKES, SKINS, SKIN_BY_ID, ACHIEVEMENTS, MISSIONS, MISSION_BY_ID,
} from './metadata.js';

export const META_VERSION = 2;
const KEY = 'blockJoker.meta';
const OLD_KEY = 'blockJoker.v1';

const STAT_KEYS = [
  'runs', 'wins', 'roundsCleared', 'bossesBeaten', 'totalLines', 'gemsCleared', 'jokersBought', 'bestHit', 'bestRoundScore',
  'maxCombo', 'maxLines', 'bestAnte', 'dailyRuns', 'tokensEarned', 'allClears', 'maxJokers', 'maxCoins', 'bestStreak',
];

function defaults() {
  const stats = {};
  for (const k of STAT_KEYS) stats[k] = 0;
  return {
    version: META_VERSION,
    tokens: 0,
    xp: 0,
    stats,
    unlocked: { jokers: STARTER_JOKERS.slice(), decks: ['basic'], skins: ['neon'] },
    discovered: [],
    stakeUnlocked: 1,
    stakeRecords: {}, // { [lv]: { bestAnte, bestHit, won } }
    sel: { stake: 1, deck: 'basic', skin: 'neon' },
    achievements: {}, // { id: timestamp }
    daily: { date: '', missions: [], played: false, best: 0, bestAnte: 0 },
    streak: { last: '', count: 0 },
    run: null,
    tutorialDone: false,
    muted: false,
  };
}

const isObj = (o) => o && typeof o === 'object' && !Array.isArray(o);
const num = (v, d = 0) => (typeof v === 'number' && isFinite(v) ? v : d);

// 어떤 형태의 저장본이 와도 안전하게 현재 스키마로 맞춤
export function migrate(raw) {
  const d = defaults();
  if (!isObj(raw)) return d;
  // v1 (단순 기록) -> v2
  if (!raw.version || raw.version < 2) {
    d.stats.bestAnte = num(raw.bestAnte);
    d.stats.bestHit = num(raw.bestHit);
    d.stats.wins = num(raw.wins);
    d.tutorialDone = !!raw.tutorialDone;
    d.muted = !!raw.muted;
    return d;
  }
  d.tokens = Math.max(0, num(raw.tokens));
  d.xp = Math.max(0, num(raw.xp));
  if (isObj(raw.stats)) for (const k of STAT_KEYS) d.stats[k] = num(raw.stats[k]);
  if (isObj(raw.unlocked)) {
    const j = Array.isArray(raw.unlocked.jokers) ? raw.unlocked.jokers.filter((id) => JOKER_BY_ID[id]) : [];
    d.unlocked.jokers = [...new Set([...STARTER_JOKERS, ...j])];
    const dk = Array.isArray(raw.unlocked.decks) ? raw.unlocked.decks.filter((id) => DECK_BY_ID[id]) : [];
    d.unlocked.decks = [...new Set(['basic', ...dk])];
    const sk = Array.isArray(raw.unlocked.skins) ? raw.unlocked.skins.filter((id) => SKIN_BY_ID[id]) : [];
    d.unlocked.skins = [...new Set(['neon', ...sk])];
  }
  if (Array.isArray(raw.discovered)) d.discovered = [...new Set(raw.discovered.filter((id) => JOKER_BY_ID[id]))];
  d.stakeUnlocked = Math.min(STAKES.length, Math.max(1, num(raw.stakeUnlocked, 1)));
  if (isObj(raw.stakeRecords)) {
    for (const [k, v] of Object.entries(raw.stakeRecords)) {
      if (isObj(v)) d.stakeRecords[k] = { bestAnte: num(v.bestAnte), bestHit: num(v.bestHit), won: !!v.won };
    }
  }
  if (isObj(raw.sel)) {
    d.sel.stake = Math.min(d.stakeUnlocked, Math.max(1, num(raw.sel.stake, 1)));
    d.sel.deck = d.unlocked.decks.includes(raw.sel.deck) ? raw.sel.deck : 'basic';
    d.sel.skin = d.unlocked.skins.includes(raw.sel.skin) ? raw.sel.skin : 'neon';
  }
  if (isObj(raw.achievements)) for (const a of ACHIEVEMENTS) if (raw.achievements[a.id]) d.achievements[a.id] = num(raw.achievements[a.id], 1);
  if (isObj(raw.daily)) {
    d.daily.date = typeof raw.daily.date === 'string' ? raw.daily.date : '';
    d.daily.played = !!raw.daily.played;
    d.daily.best = num(raw.daily.best);
    d.daily.bestAnte = num(raw.daily.bestAnte);
    if (Array.isArray(raw.daily.missions)) {
      d.daily.missions = raw.daily.missions
        .filter((m) => isObj(m) && MISSION_BY_ID[m.id])
        .map((m) => ({ id: m.id, n: num(m.n, MISSION_BY_ID[m.id].n), p: num(m.p), done: !!m.done }));
    }
  }
  if (isObj(raw.streak)) d.streak = { last: typeof raw.streak.last === 'string' ? raw.streak.last : '', count: num(raw.streak.count) };
  if (isObj(raw.run) && raw.run.v === 1) d.run = raw.run;
  d.tutorialDone = !!raw.tutorialDone;
  d.muted = !!raw.muted;
  return d;
}

export function dateKey(dt = new Date()) {
  const y = dt.getFullYear(), m = String(dt.getMonth() + 1).padStart(2, '0'), day = String(dt.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function levelInfo(xp) {
  let lvl = 1, need = 100, rest = xp;
  while (rest >= need) { rest -= need; lvl++; need = 100 + (lvl - 1) * 60; }
  return { lvl, cur: rest, need };
}

export class Meta {
  constructor() {
    this.d = this.load();
    this.toasts = []; // UI에 띄울 알림 큐
    this.now = () => new Date();
  }

  load() {
    let raw = null;
    try {
      const s = localStorage.getItem(KEY);
      if (s) raw = JSON.parse(s);
      else {
        const old = localStorage.getItem(OLD_KEY);
        if (old) raw = JSON.parse(old);
      }
    } catch { raw = null; }
    return migrate(raw);
  }

  save() {
    try { localStorage.setItem(KEY, JSON.stringify(this.d)); } catch { /* 무시 */ }
  }

  toast(text, kind = 'info') { this.toasts.push({ text, kind }); }

  get level() { return levelInfo(this.d.xp); }

  addTokens(n, why) {
    if (n <= 0) return;
    this.d.tokens += n;
    this.d.stats.tokensEarned += n;
    if (why) this.toast(`${why} +${n} 토큰`, 'token');
  }

  addXp(n) {
    const before = this.level.lvl;
    this.d.xp += Math.max(0, Math.round(n));
    const after = this.level.lvl;
    if (after > before) {
      this.toast(`레벨 업! Lv.${after}`, 'level');
      this.addTokens(5 * (after - before), '레벨 보상');
    }
  }

  // ---------- 데일리 / 출석 ----------
  refreshDaily() {
    const today = dateKey(this.now());
    const dl = this.d.daily;
    if (dl.date !== today) {
      const rng = new RNG('missions-' + today);
      const pool = rng.shuffle(MISSIONS.slice());
      dl.date = today;
      dl.played = false;
      dl.best = 0; dl.bestAnte = 0;
      dl.missions = pool.slice(0, 3).map((m) => ({ id: m.id, n: m.n, p: 0, done: false }));
    }
    // 출석
    const st = this.d.streak;
    let reward = 0;
    if (st.last !== today) {
      const y = new Date(this.now()); y.setDate(y.getDate() - 1);
      st.count = st.last === dateKey(y) ? st.count + 1 : 1;
      st.last = today;
      reward = 3 + Math.min(st.count, 7) * 2;
      this.addTokens(reward, `출석 ${st.count}일째`);
      this.d.stats.bestStreak = Math.max(this.d.stats.bestStreak, st.count);
      this.checkAchievements();
    }
    this.save();
    return reward;
  }

  missionProgress(id, v, isMax = false) {
    for (const m of this.d.daily.missions) {
      if (m.id !== id || m.done) continue;
      m.p = isMax ? Math.max(m.p, v) : m.p + v;
      if (m.p >= m.n) {
        m.p = m.n; m.done = true;
        const def = MISSION_BY_ID[m.id];
        this.addTokens(def.reward, `미션 완료: ${def.text(m.n)}`);
      }
    }
  }

  get missionsDone() { return this.d.daily.missions.filter((m) => m.done).length; }

  // ---------- 업적 ----------
  checkAchievements() {
    const ctx = {
      discovered: this.d.discovered.length,
      maxStakeWon: Math.max(0, ...Object.entries(this.d.stakeRecords).filter(([, v]) => v.won).map(([k]) => +k)),
    };
    for (const a of ACHIEVEMENTS) {
      if (this.d.achievements[a.id]) continue;
      if (a.check(this.d.stats, ctx)) {
        this.d.achievements[a.id] = Date.now();
        this.toast(`업적 달성: ${a.name}`, 'ach');
        this.addTokens(a.reward);
      }
    }
  }

  // ---------- 런 이벤트 ----------
  onRunStart(game) {
    this.d.stats.runs++;
    if (game.opts.daily) {
      this.d.daily.played = true;
      this.d.stats.dailyRuns++;
      this.missionProgress('daily', 1);
    }
    this.checkAchievements();
    this.save();
  }

  onClear(res, game) {
    const s = this.d.stats;
    const lines = res.cleared.rows.length + res.cleared.cols.length;
    const gems = res.cleared.cells.filter((c) => c.gem).length;
    s.totalLines += lines;
    s.gemsCleared += gems;
    s.bestHit = Math.max(s.bestHit, res.total);
    s.maxCombo = Math.max(s.maxCombo, res.combo);
    s.maxLines = Math.max(s.maxLines, lines);
    s.maxCoins = Math.max(s.maxCoins, game.coins);
    if (res.boardEmpty) s.allClears++;
    this.missionProgress('lines', lines);
    this.missionProgress('gems', gems);
    this.missionProgress('hit', res.total, true);
    this.missionProgress('combo', res.combo, true);
    if (lines >= 3) this.missionProgress('multi', 1);
    const rec = this.stakeRec(game);
    rec.bestHit = Math.max(rec.bestHit, res.total);
    if (game.opts.daily) this.d.daily.best = Math.max(this.d.daily.best, res.total);
    this.checkAchievements();
  }

  onRoundClear(game) {
    const s = this.d.stats;
    s.roundsCleared++;
    s.bestRoundScore = Math.max(s.bestRoundScore, game.roundScore);
    s.maxCoins = Math.max(s.maxCoins, game.coins);
    if (game.clearedBlind === 2) { s.bossesBeaten++; this.missionProgress('boss', 1); }
    this.missionProgress('rounds', 1);
    this.onAnte(game.ante, game);
    this.checkAchievements();
    this.save();
  }

  onAnte(ante, game) {
    this.d.stats.bestAnte = Math.max(this.d.stats.bestAnte, ante);
    const rec = this.stakeRec(game);
    rec.bestAnte = Math.max(rec.bestAnte, ante);
    if (game.opts.daily) this.d.daily.bestAnte = Math.max(this.d.daily.bestAnte, ante);
  }

  onShop(game) {
    let changed = false;
    for (const o of game.shop || []) if (!this.d.discovered.includes(o.id)) { this.d.discovered.push(o.id); o.isNew = true; changed = true; }
    if (changed) this.checkAchievements();
  }

  onBuy(game) {
    this.d.stats.jokersBought++;
    this.d.stats.maxJokers = Math.max(this.d.stats.maxJokers, game.jokers.length);
    this.missionProgress('buy', 1);
    this.checkAchievements();
  }

  stakeRec(game) {
    const k = game.opts.daily ? 'daily' : String(game.opts.stake);
    if (!this.d.stakeRecords[k]) this.d.stakeRecords[k] = { bestAnte: 0, bestHit: 0, won: false };
    return this.d.stakeRecords[k];
  }

  // 런 종료 (패배, 승리, 포기). 토큰/경험치 정산
  onRunEnd(game, won) {
    const rs = game.runStats;
    const s = this.d.stats;
    let tokens = rs.rounds + rs.bosses * 3 + (won ? 15 : 0);
    if (!game.opts.daily) tokens = Math.round(tokens * (1 + 0.25 * (game.opts.stake - 1)));
    else tokens += 3;
    tokens = Math.max(1, tokens);
    if (DEBUG) tokens *= 10;
    const xp = rs.lines * 2 + rs.rounds * 10 + rs.bosses * 20 + (won ? 100 : 0);
    let stakeUnlocked = null;
    if (won) {
      s.wins++;
      const rec = this.stakeRec(game);
      rec.won = true;
      if (!game.opts.daily && game.opts.stake >= this.d.stakeUnlocked && this.d.stakeUnlocked < STAKES.length) {
        this.d.stakeUnlocked = game.opts.stake + 1;
        stakeUnlocked = STAKES[this.d.stakeUnlocked - 1];
        this.toast(`새 난이도 해금: ${stakeUnlocked.name} 스테이크`, 'ach');
      }
    }
    this.d.tokens += tokens;
    s.tokensEarned += tokens;
    const before = this.level.lvl;
    this.addXp(xp);
    this.d.run = null;
    this.checkAchievements();
    this.save();
    return { tokens, xp, level: this.level, levelUp: this.level.lvl > before, stakeUnlocked };
  }

  // ---------- 해금 ----------
  jokerCost(id) { return UNLOCK_COST[JOKER_BY_ID[id].rarity]; }
  isJokerUnlocked(id) { return this.d.unlocked.jokers.includes(id); }
  unlockJoker(id) {
    if (this.isJokerUnlocked(id)) return false;
    const c = this.jokerCost(id);
    if (this.d.tokens < c) return false;
    this.d.tokens -= c;
    this.d.unlocked.jokers.push(id);
    this.save();
    return true;
  }
  unlockDeck(id) {
    const dk = DECK_BY_ID[id];
    if (!dk || this.d.unlocked.decks.includes(id) || this.d.tokens < dk.cost) return false;
    this.d.tokens -= dk.cost;
    this.d.unlocked.decks.push(id);
    this.save();
    return true;
  }
  unlockSkin(id) {
    const sk = SKIN_BY_ID[id];
    if (!sk || this.d.unlocked.skins.includes(id) || this.d.tokens < sk.cost) return false;
    this.d.tokens -= sk.cost;
    this.d.unlocked.skins.push(id);
    this.save();
    return true;
  }

  jokerPool(daily) { return daily ? JOKERS.map((j) => j.id) : this.d.unlocked.jokers.slice(); }

  // ---------- 이어하기 ----------
  saveRun(snap) { this.d.run = snap; this.save(); }
  clearRun() { this.d.run = null; this.save(); }
}

export { DECKS, STAKES, SKINS, ACHIEVEMENTS };
