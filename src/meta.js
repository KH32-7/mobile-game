// 장기 진행 (영구 저장, 버전 + 마이그레이션)
import { DEBUG } from './config.js';
import { JOKERS, JOKER_BY_ID } from './jokers.js';
import { RNG } from './rng.js';
import {
  STARTER_JOKERS, UNLOCK_COST, DECKS, DECK_BY_ID, STAKES, SKINS, SKIN_BY_ID, ACHIEVEMENTS, MISSIONS, MISSION_BY_ID,
  WEEKLY, WEEKLY_BY_ID, WEEKLY_CHEST, CALENDAR,
} from './metadata.js';
import { BOSS_BY_ID } from './bosses.js';

export const META_VERSION = 3;
const KEY = 'blockJoker.meta';
const OLD_KEY = 'blockJoker.v1';

const STAT_KEYS = [
  'runs', 'wins', 'roundsCleared', 'bossesBeaten', 'totalLines', 'gemsCleared', 'jokersBought', 'bestHit', 'bestRoundScore',
  'maxCombo', 'maxLines', 'bestAnte', 'dailyRuns', 'tokensEarned', 'allClears', 'maxJokers', 'maxCoins', 'bestStreak',
  'maxLineLv', 'maxVouchers', 'legendsOwned', 'showdowns', 'editions', 'planetsUsed',
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
    stakeRecords: {},
    deckWins: {}, // { deckId: 승리한 최고 스테이크 }
    sel: { stake: 1, deck: 'basic', skin: 'neon' },
    achievements: {},
    achClaimed: {},
    daily: { date: '', missions: [], played: false, best: 0, bestAnte: 0 },
    dailyHistory: {}, // { 'YYYY-MM-DD': { ante, hit, won, rule } }
    weekly: { week: '', missions: [], chest: false },
    streak: { last: '', count: 0, claimed: '' },
    settings: { bgm: 0.7, sfx: 0.9, vib: true, speed: 1 },
    coach: { calc: false, shop: false, bosses: [] },
    run: null,
    tutorialDone: false,
    muted: false,
  };
}

const isObj = (o) => o && typeof o === 'object' && !Array.isArray(o);
const num = (v, d = 0) => (typeof v === 'number' && isFinite(v) ? v : d);
const str = (v, d = '') => (typeof v === 'string' ? v : d);

export function migrate(raw) {
  const d = defaults();
  if (!isObj(raw)) return d;
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
  if (isObj(raw.deckWins)) for (const [k, v] of Object.entries(raw.deckWins)) if (DECK_BY_ID[k]) d.deckWins[k] = num(v);
  if (isObj(raw.sel)) {
    d.sel.stake = Math.min(d.stakeUnlocked, Math.max(1, num(raw.sel.stake, 1)));
    d.sel.deck = d.unlocked.decks.includes(raw.sel.deck) ? raw.sel.deck : 'basic';
    d.sel.skin = d.unlocked.skins.includes(raw.sel.skin) ? raw.sel.skin : 'neon';
  }
  if (isObj(raw.achievements)) for (const a of ACHIEVEMENTS) if (raw.achievements[a.id]) d.achievements[a.id] = num(raw.achievements[a.id], 1);
  // v3 이전 업적은 이미 지급된 것으로 처리
  if (isObj(raw.achClaimed)) { for (const a of ACHIEVEMENTS) if (raw.achClaimed[a.id]) d.achClaimed[a.id] = true; }
  else for (const k of Object.keys(d.achievements)) d.achClaimed[k] = true;
  if (isObj(raw.daily)) {
    d.daily.date = str(raw.daily.date);
    d.daily.played = !!raw.daily.played;
    d.daily.best = num(raw.daily.best);
    d.daily.bestAnte = num(raw.daily.bestAnte);
    if (Array.isArray(raw.daily.missions)) {
      d.daily.missions = raw.daily.missions
        .filter((m) => isObj(m) && MISSION_BY_ID[m.id])
        .map((m) => ({ id: m.id, n: num(m.n, MISSION_BY_ID[m.id].n), p: num(m.p), done: !!m.done, claimed: m.claimed !== false && !!m.done && (m.claimed === true || raw.version < 3 || !('claimed' in m)) }));
    }
  }
  if (isObj(raw.dailyHistory)) {
    for (const [k, v] of Object.entries(raw.dailyHistory)) if (isObj(v) && /^\d{4}-\d{2}-\d{2}$/.test(k)) d.dailyHistory[k] = { ante: num(v.ante), hit: num(v.hit), won: !!v.won, rule: str(v.rule) };
  }
  if (isObj(raw.weekly)) {
    d.weekly.week = str(raw.weekly.week);
    d.weekly.chest = !!raw.weekly.chest;
    if (Array.isArray(raw.weekly.missions)) {
      d.weekly.missions = raw.weekly.missions.filter((m) => isObj(m) && WEEKLY_BY_ID[m.id]).map((m) => ({ id: m.id, n: num(m.n, WEEKLY_BY_ID[m.id].n), p: num(m.p), done: !!m.done }));
    }
  }
  if (isObj(raw.streak)) d.streak = { last: str(raw.streak.last), count: num(raw.streak.count), claimed: str(raw.streak.claimed, raw.version < 3 ? str(raw.streak.last) : '') };
  if (isObj(raw.settings)) {
    const s = raw.settings;
    d.settings = {
      bgm: Math.min(1, Math.max(0, num(s.bgm, 0.7))), sfx: Math.min(1, Math.max(0, num(s.sfx, 0.9))),
      vib: s.vib !== false, speed: [1, 2, 4].includes(s.speed) ? s.speed : 1,
    };
  }
  if (isObj(raw.coach)) {
    d.coach.calc = !!raw.coach.calc;
    d.coach.shop = !!raw.coach.shop;
    d.coach.bosses = Array.isArray(raw.coach.bosses) ? raw.coach.bosses.filter((b) => BOSS_BY_ID[b]) : [];
  }
  if (isObj(raw.run) && (raw.run.v === 1 || raw.run.v === 2)) d.run = raw.run;
  d.tutorialDone = !!raw.tutorialDone;
  if (d.tutorialDone && raw.version < 3) { d.coach.calc = true; d.coach.shop = true; }
  d.muted = !!raw.muted;
  return d;
}

export function dateKey(dt = new Date()) {
  const y = dt.getFullYear(), m = String(dt.getMonth() + 1).padStart(2, '0'), day = String(dt.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function weekKey(dt = new Date()) {
  const d = new Date(dt);
  const wd = (d.getDay() + 6) % 7; // 월요일 = 0
  d.setDate(d.getDate() - wd);
  return dateKey(d);
}

export function levelInfo(xp) {
  let lvl = 1, need = 100, rest = xp;
  while (rest >= need) { rest -= need; lvl++; need = 100 + (lvl - 1) * 60; }
  return { lvl, cur: rest, need };
}

export class Meta {
  constructor() {
    this.d = this.load();
    this.toasts = [];
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

  // ---------- 데일리 / 주간 / 출석 ----------
  // 날짜가 바뀌었으면 미션을 새로 뽑음. 반환: 출석 보상을 받을 수 있는지
  refreshDaily() {
    const now = this.now();
    const today = dateKey(now);
    const dl = this.d.daily;
    let changed = false;
    if (dl.date !== today) {
      const rng = new RNG('missions-' + today);
      const pool = rng.shuffle(MISSIONS.slice());
      dl.date = today;
      dl.played = false;
      dl.best = 0; dl.bestAnte = 0;
      dl.missions = pool.slice(0, 3).map((m) => ({ id: m.id, n: m.n, p: 0, done: false }));
      changed = true;
    }
    const wk = weekKey(now);
    const w = this.d.weekly;
    if (w.week !== wk) {
      const rng = new RNG('weekly-' + wk);
      w.week = wk;
      w.chest = false;
      w.missions = rng.shuffle(WEEKLY.slice()).slice(0, 3).map((m) => ({ id: m.id, n: m.n, p: 0, done: false }));
      changed = true;
    }
    const keys = Object.keys(this.d.dailyHistory).sort();
    while (keys.length > 14) delete this.d.dailyHistory[keys.shift()];
    if (changed) this.save();
    return changed;
  }

  get calendarClaimable() { return this.d.streak.claimed !== dateKey(this.now()); }

  // 이어지는 출석 수 (오늘 받으면 몇 일째인지)
  nextStreak() {
    const st = this.d.streak;
    const today = dateKey(this.now());
    if (st.claimed === today) return st.count;
    const y = new Date(this.now()); y.setDate(y.getDate() - 1);
    return st.last === dateKey(y) ? st.count + 1 : 1;
  }

  calendarDay() { return ((Math.max(1, this.nextStreak()) - 1) % 7) + 1; }

  claimCalendar() {
    if (!this.calendarClaimable) return 0;
    const st = this.d.streak;
    const today = dateKey(this.now());
    st.count = this.nextStreak();
    st.last = today;
    st.claimed = today;
    const day = ((st.count - 1) % 7) + 1;
    const reward = CALENDAR[day - 1];
    this.d.tokens += reward;
    this.d.stats.tokensEarned += reward;
    this.d.stats.bestStreak = Math.max(this.d.stats.bestStreak, st.count);
    this.checkAchievements();
    this.save();
    return reward;
  }

  missionProgress(id, v, isMax = false) {
    for (const m of this.d.daily.missions) {
      if (m.id !== id || m.done) continue;
      m.p = isMax ? Math.max(m.p, v) : m.p + v;
      if (m.p >= m.n) {
        m.p = m.n; m.done = true; m.claimed = false;
        const def = MISSION_BY_ID[m.id];
        this.toast(`미션 완료: ${def.text(m.n)} (미션에서 받기)`, 'ach');
      }
    }
    for (const m of this.d.weekly.missions) {
      if (m.id !== id || m.done) continue;
      const def = WEEKLY_BY_ID[m.id];
      m.p = def.max ? Math.max(m.p, v) : m.p + v;
      if (m.p >= m.n) { m.p = m.n; m.done = true; this.toast(`주간 미션 완료: ${def.text(m.n)}`, 'ach'); }
    }
  }

  claimMission(i) {
    const m = this.d.daily.missions[i];
    if (!m || !m.done || m.claimed) return 0;
    m.claimed = true;
    const r = MISSION_BY_ID[m.id].reward;
    this.d.tokens += r; this.d.stats.tokensEarned += r;
    this.save();
    return r;
  }

  claimAchievement(id) {
    const a = ACHIEVEMENTS.find((x) => x.id === id);
    if (!a || !this.d.achievements[id] || this.d.achClaimed[id]) return 0;
    this.d.achClaimed[id] = true;
    this.d.tokens += a.reward; this.d.stats.tokensEarned += a.reward;
    this.save();
    return a.reward;
  }

  get claimables() {
    return this.d.daily.missions.filter((m) => m.done && !m.claimed).length + ACHIEVEMENTS.filter((a) => this.d.achievements[a.id] && !this.d.achClaimed[a.id]).length + (this.chestReady ? 1 : 0);
  }

  get missionsDone() { return this.d.daily.missions.filter((m) => m.done).length; }
  get weeklyDone() { return this.d.weekly.missions.filter((m) => m.done).length; }
  get chestReady() { return this.weeklyDone >= 3 && !this.d.weekly.chest; }

  claimChest() {
    if (!this.chestReady) return 0;
    this.d.weekly.chest = true;
    this.d.tokens += WEEKLY_CHEST;
    this.d.stats.tokensEarned += WEEKLY_CHEST;
    this.save();
    return WEEKLY_CHEST;
  }

  // ---------- 업적 ----------
  checkAchievements() {
    const ctx = {
      discovered: this.d.discovered.length,
      maxStakeWon: Math.max(0, ...Object.entries(this.d.stakeRecords).filter(([k, v]) => v.won && k !== 'daily').map(([k]) => +k)),
    };
    for (const a of ACHIEVEMENTS) {
      if (this.d.achievements[a.id]) continue;
      if (a.check(this.d.stats, ctx)) {
        this.d.achievements[a.id] = Date.now();
        this.toast(`업적 달성: ${a.name} (프로필에서 받기)`, 'ach');
      }
    }
  }

  // ---------- 런 이벤트 ----------
  onRunStart(game) {
    if (game.opts.daily) {
      this.d.daily.played = true;
      this.d.stats.dailyRuns++;
      this.missionProgress('daily', 1);
      this.d.dailyHistory[this.d.daily.date] = { ante: 1, hit: 0, won: false, rule: game.opts.rule || '' };
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
    if (game.opts.daily) {
      this.d.daily.best = Math.max(this.d.daily.best, res.total);
      const h = this.d.dailyHistory[this.d.daily.date];
      if (h) h.hit = Math.max(h.hit, res.total);
    }
    this.checkAchievements();
  }

  onRoundClear(game) {
    const s = this.d.stats;
    s.roundsCleared++;
    s.bestRoundScore = Math.max(s.bestRoundScore, game.roundScore);
    s.maxCoins = Math.max(s.maxCoins, game.coins);
    if (game.clearedBlind === 2) {
      s.bossesBeaten++;
      this.missionProgress('boss', 1);
      if (game.clearedAnte % 8 === 0) s.showdowns++;
    }
    this.missionProgress('rounds', 1);
    this.onAnte(game.phase === 'victory' ? game.clearedAnte : game.ante, game);
    this.checkAchievements();
    this.save();
  }

  onAnte(ante, game) {
    this.d.stats.bestAnte = Math.max(this.d.stats.bestAnte, ante);
    const rec = this.stakeRec(game);
    rec.bestAnte = Math.max(rec.bestAnte, ante);
    if (game.opts.daily) {
      this.d.daily.bestAnte = Math.max(this.d.daily.bestAnte, ante);
      const h = this.d.dailyHistory[this.d.daily.date];
      if (h) h.ante = Math.max(h.ante, ante);
    }
  }

  onShop(game) {
    let changed = false;
    const ids = [...(game.shop ? game.shop.jokers : []), ...((game.packOpen && game.packOpen.choices) || []).filter((c) => c.kind === 'joker')];
    for (const o of ids) if (!this.d.discovered.includes(o.id)) { this.d.discovered.push(o.id); o.isNew = true; changed = true; }
    if (changed) this.checkAchievements();
  }

  onBuy(game, item) {
    const s = this.d.stats;
    if (!item || item.kind === 'joker') {
      s.jokersBought++;
      this.missionProgress('buy', 1);
      if (item && item.ed) s.editions++;
    }
    if (item && item.kind === 'planet') { s.planetsUsed++; this.missionProgress('planet', 1); }
    s.maxJokers = Math.max(s.maxJokers, game.jokers.length);
    s.maxLineLv = Math.max(s.maxLineLv, ...Object.values(game.lineLv));
    s.maxVouchers = Math.max(s.maxVouchers, game.vouchers.length);
    s.legendsOwned = Math.max(s.legendsOwned, game.jokers.filter((j) => JOKER_BY_ID[j.id].rarity === 'legendary').length);
    this.checkAchievements();
  }

  stakeRec(game) {
    const k = game.opts.daily ? 'daily' : String(game.opts.stake);
    if (!this.d.stakeRecords[k]) this.d.stakeRecords[k] = { bestAnte: 0, bestHit: 0, won: false };
    return this.d.stakeRecords[k];
  }

  // 런 종료 (패배 또는 승리). 포기는 onRunAbandon
  onRunEnd(game, won) {
    const rs = game.runStats;
    const s = this.d.stats;
    s.runs++;
    let tokens = rs.rounds + rs.bosses * 2 + (won ? 12 : 0);
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
      if (!game.opts.daily) {
        const dk = game.opts.deck;
        this.d.deckWins[dk] = Math.max(this.d.deckWins[dk] || 0, game.opts.stake);
        if (game.opts.stake >= this.d.stakeUnlocked && this.d.stakeUnlocked < STAKES.length) {
          this.d.stakeUnlocked = game.opts.stake + 1;
          stakeUnlocked = STAKES[this.d.stakeUnlocked - 1];
          this.toast(`새 난이도 해금: ${stakeUnlocked.name} 스테이크`, 'ach');
        }
      }
    }
    if (game.opts.daily) {
      const h = this.d.dailyHistory[this.d.daily.date];
      if (h) { h.ante = Math.max(h.ante, game.ante); h.won = h.won || won; }
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

  onRunAbandon() { this.d.run = null; this.save(); }

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

  totalUnlockCost() {
    let t = 0;
    for (const j of JOKERS) if (!STARTER_JOKERS.includes(j.id)) t += this.jokerCost(j.id);
    for (const dk of DECKS) t += dk.cost;
    for (const sk of SKINS) t += sk.cost;
    return t;
  }

  jokerPool(daily) { return daily ? JOKERS.map((j) => j.id) : this.d.unlocked.jokers.slice(); }

  saveRun(snap) { this.d.run = snap; this.save(); }
  clearRun() { this.d.run = null; this.save(); }
}

export { DECKS, STAKES, SKINS, ACHIEVEMENTS };
