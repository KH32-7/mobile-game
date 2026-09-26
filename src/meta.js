// 장기 진행: 프로필, 카드 컬렉션/레벨, 트로피, 데일리, 상자, 업적, 통계
import {
  SAVE_VERSION, CARDS, PLAYABLE, STARTER_DECK, LEVEL_COST, CARD_MAX_LEVEL, START_COINS, ARENAS,
  CHEST_INTERVAL_MS, MISSION_POOL, ACHIEVEMENTS, RUN_TIERS, RARITY_WEIGHT,
} from './config.js';
import { makeRng } from './rng.js';

const KEY = 'pocketSiege.profile';
const OLD_KEY = 'pocketSiege.save.v1';

const STAT_KEYS = [
  'battles', 'wins', 'losses', 'draws', 'quickWins', 'quickLosses', 'runs', 'runWins', 'merges', 'maxMergesBattle',
  'towers', 'kingKills', 'played', 'spells', 'star3', 'bossKills', 'chests', 'upgrades', 'threeCrowns', 'bestStage',
  'maxTierCleared', 'coinsEarned',
];

export function dayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function yesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return dayKey(d);
}

export function defaultProfile() {
  const cards = {};
  for (const id of STARTER_DECK) cards[id] = { level: 1, shards: 0 };
  const stats = {};
  for (const k of STAT_KEYS) stats[k] = 0;
  return {
    version: SAVE_VERSION,
    coins: START_COINS,
    cards,
    trophies: 0,
    bestTrophies: 0,
    arenaClaimed: [0],
    tierUnlocked: 1,
    tierSelected: 1,
    daily: null,
    streak: { last: null, count: 0, best: 0, claimed: null },
    chest: { nextAt: 0, first: true },
    ach: {},
    stats,
    tutDone: false,
    muted: false,
    seen: {},
  };
}

// 저장본 마이그레이션 (버전 필드 기반, 알 수 없는 값은 기본값으로 보정)
export function migrate(raw) {
  const base = defaultProfile();
  if (!raw || typeof raw !== 'object') return base;
  const p = { ...base, ...raw };
  // v1 (구 기록 형식): bestStage, runWins, battleWins, quickWins, tutDone, muted
  if (!raw.version || raw.version < 2) {
    p.stats = { ...base.stats };
    p.stats.bestStage = raw.bestStage | 0;
    p.stats.runWins = raw.runWins | 0;
    p.stats.wins = raw.battleWins | 0;
    p.stats.quickWins = raw.quickWins | 0;
    p.cards = base.cards;
    p.coins = START_COINS;
  }
  p.version = SAVE_VERSION;
  p.stats = { ...base.stats, ...(p.stats || {}) };
  for (const k of STAT_KEYS) if (typeof p.stats[k] !== 'number' || !isFinite(p.stats[k])) p.stats[k] = 0;
  if (!p.cards || typeof p.cards !== 'object') p.cards = base.cards;
  for (const id of Object.keys(p.cards)) {
    if (!CARDS[id] || CARDS[id].token) {
      delete p.cards[id];
      continue;
    }
    const c = p.cards[id];
    p.cards[id] = { level: clampInt(c?.level, 1, CARD_MAX_LEVEL, 1), shards: clampInt(c?.shards, 0, 99999, 0) };
  }
  for (const id of STARTER_DECK) if (!p.cards[id]) p.cards[id] = { level: 1, shards: 0 };
  p.coins = clampInt(p.coins, 0, 1e9, START_COINS);
  p.trophies = clampInt(p.trophies, 0, 99999, 0);
  p.bestTrophies = Math.max(p.trophies, clampInt(p.bestTrophies, 0, 99999, 0));
  if (!Array.isArray(p.arenaClaimed)) p.arenaClaimed = [0];
  p.tierUnlocked = clampInt(p.tierUnlocked, 1, RUN_TIERS.length, 1);
  p.tierSelected = clampInt(p.tierSelected, 1, p.tierUnlocked, 1);
  p.streak = { ...base.streak, ...(p.streak || {}) };
  p.chest = { ...base.chest, ...(p.chest || {}) };
  if (!p.ach || typeof p.ach !== 'object') p.ach = {};
  if (!p.seen || typeof p.seen !== 'object') p.seen = {};
  return p;
}

function clampInt(v, a, b, d) {
  const n = Math.floor(Number(v));
  if (!isFinite(n)) return d;
  return Math.max(a, Math.min(b, n));
}

export function loadProfile() {
  let raw = null;
  try {
    const s = localStorage.getItem(KEY);
    if (s) raw = JSON.parse(s);
    else {
      const old = localStorage.getItem(OLD_KEY);
      if (old) raw = JSON.parse(old);
    }
  } catch {
    raw = null;
  }
  return migrate(raw);
}

export function saveProfile(p) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* 저장 불가 */
  }
}

// ---------- 카드 ----------
export const owned = (p) => Object.keys(p.cards).filter((id) => CARDS[id]);
export const cardLevel = (p, id) => p.cards[id]?.level || 1;
export function cardLevels(p) {
  const o = {};
  for (const id of Object.keys(p.cards)) o[id] = p.cards[id].level;
  return o;
}

export function upgradeCost(p, id) {
  const c = p.cards[id];
  if (!c || c.level >= CARD_MAX_LEVEL) return null;
  return LEVEL_COST[c.level - 1];
}

export function canUpgrade(p, id) {
  const cost = upgradeCost(p, id);
  return !!cost && p.cards[id].shards >= cost.shards && p.coins >= cost.coins;
}

export function upgradeCard(p, id) {
  if (!canUpgrade(p, id)) return false;
  const cost = upgradeCost(p, id);
  p.cards[id].shards -= cost.shards;
  p.coins -= cost.coins;
  p.cards[id].level++;
  p.stats.upgrades++;
  return true;
}

export const upgradableCount = (p) => owned(p).filter((id) => canUpgrade(p, id)).length;

// 조각 지급: 미보유면 해금(레벨 1) 후 나머지 조각 적립
export function addShards(p, id, n) {
  if (!CARDS[id] || CARDS[id].token) return { id, n, isNew: false };
  let isNew = false;
  if (!p.cards[id]) {
    p.cards[id] = { level: 1, shards: 0 };
    isNew = true;
    n = Math.max(0, n - 1);
  }
  p.cards[id].shards += n;
  return { id, n, isNew };
}

export function addCoins(p, n) {
  n = Math.round(n);
  p.coins += n;
  p.stats.coinsEarned += n;
  return n;
}

// 보유 카드 가중 랜덤 (+ 해금 가능 카드 약간)
export function randomCardFor(p, rng, allowNew) {
  const unlockable = allowNew ? unlockableCards(p) : [];
  if (unlockable.length && rng() < 0.25) return unlockable[Math.floor(rng() * unlockable.length)];
  const own = owned(p);
  const tot = own.reduce((s, id) => s + RARITY_WEIGHT[CARDS[id].rarity], 0);
  let r = rng() * tot;
  for (const id of own) {
    r -= RARITY_WEIGHT[CARDS[id].rarity];
    if (r <= 0) return id;
  }
  return own[0];
}

// 현재 아레나까지 열린 카드 중 미보유
export function unlockableCards(p) {
  const ar = arenaIndex(p.bestTrophies);
  const pool = new Set();
  for (let i = 0; i <= ar; i++) ARENAS[i].unlock.forEach((id) => pool.add(id));
  return [...pool].filter((id) => !p.cards[id]);
}

// ---------- 아레나/트로피 ----------
export function arenaIndex(tro) {
  let i = 0;
  for (let k = 0; k < ARENAS.length; k++) if (tro >= ARENAS[k].min) i = k;
  return i;
}

export function claimableArenas(p) {
  const top = arenaIndex(p.bestTrophies);
  const out = [];
  for (let i = 1; i <= top; i++) if (!p.arenaClaimed.includes(i)) out.push(i);
  return out;
}

export function claimArena(p, i) {
  if (p.arenaClaimed.includes(i) || arenaIndex(p.bestTrophies) < i) return null;
  p.arenaClaimed.push(i);
  const A = ARENAS[i];
  const got = [];
  addCoins(p, A.coins);
  for (const id of A.unlock) got.push(addShards(p, id, 3));
  return { coins: A.coins, cards: got };
}

export function applyTrophies(p, delta) {
  const floor = ARENAS[arenaIndex(p.trophies)].min;
  const before = p.trophies;
  p.trophies = Math.max(delta < 0 ? floor : 0, p.trophies + delta);
  p.bestTrophies = Math.max(p.bestTrophies, p.trophies);
  return p.trophies - before;
}

// ---------- 데일리 ----------
export function ensureDaily(p) {
  const today = dayKey();
  if (!p.daily || p.daily.date !== today) {
    const seed = today.split('-').reduce((s, v) => s * 31 + Number(v), 7);
    const rng = makeRng(seed);
    const pool = MISSION_POOL.slice();
    const missions = [];
    for (let i = 0; i < 3; i++) {
      const m = pool.splice(Math.floor(rng() * pool.length), 1)[0];
      missions.push({ id: m.id, n: m.n, coins: m.coins, progress: 0, claimed: false });
    }
    p.daily = { date: today, missions };
  }
  return p.daily;
}

export function missionText(m) {
  const def = MISSION_POOL.find((x) => x.id === m.id);
  return def ? def.text.replace('{n}', m.n) : m.id;
}

export function progressMission(p, id, amt) {
  if (!amt) return;
  ensureDaily(p);
  for (const m of p.daily.missions) if (m.id === id && !m.claimed) m.progress = Math.min(m.n, m.progress + amt);
}

export const claimableMissions = (p) => (ensureDaily(p), p.daily.missions.filter((m) => m.progress >= m.n && !m.claimed).length);

export function claimMission(p, idx) {
  ensureDaily(p);
  const m = p.daily.missions[idx];
  if (!m || m.claimed || m.progress < m.n) return null;
  m.claimed = true;
  addCoins(p, m.coins);
  const rng = makeRng(Date.now() & 0xffffff);
  const id = randomCardFor(p, rng, false);
  addShards(p, id, 2);
  return { coins: m.coins, card: id, shards: 2 };
}

// 연속 출석
export function checkStreak(p) {
  const today = dayKey();
  if (p.streak.last === today) return;
  p.streak.count = p.streak.last === yesterdayKey() ? p.streak.count + 1 : 1;
  p.streak.last = today;
  p.streak.best = Math.max(p.streak.best, p.streak.count);
}

export const streakClaimable = (p) => p.streak.last === dayKey() && p.streak.claimed !== dayKey();

export function streakReward(count) {
  const d = ((count - 1) % 7) + 1;
  return { coins: 20 + d * 15, shards: d === 7 ? 10 : 2 + d };
}

export function claimStreak(p) {
  if (!streakClaimable(p)) return null;
  p.streak.claimed = dayKey();
  const r = streakReward(p.streak.count);
  addCoins(p, r.coins);
  const rng = makeRng((Date.now() ^ 0x5bd1e995) & 0xffffff);
  const id = randomCardFor(p, rng, p.streak.count % 7 === 0);
  const s = addShards(p, id, r.shards);
  return { coins: r.coins, cards: [s] };
}

// ---------- 무료 상자 (실제 시간 기준) ----------
export const chestReady = (p, now = Date.now()) => now >= p.chest.nextAt;
export const chestRemain = (p, now = Date.now()) => Math.max(0, p.chest.nextAt - now);

export function openChest(p, now = Date.now()) {
  if (!chestReady(p, now)) return null;
  p.chest.nextAt = now + CHEST_INTERVAL_MS;
  p.stats.chests++;
  const rng = makeRng(now & 0xffffff);
  const res = { coins: 0, cards: [] };
  if (p.chest.first) {
    // 첫 상자: 바로 강화해볼 수 있게 고정 보상
    p.chest.first = false;
    res.coins = addCoins(p, 60);
    res.cards.push(addShards(p, 'knight', 4));
    res.cards.push(addShards(p, 'archers', 2));
    return res;
  }
  const ar = arenaIndex(p.bestTrophies);
  res.coins = addCoins(p, 40 + Math.floor(rng() * 40) + ar * 20);
  const n = 2 + (rng() < 0.4 ? 1 : 0);
  for (let i = 0; i < n; i++) {
    const id = randomCardFor(p, rng, true);
    res.cards.push(addShards(p, id, 2 + Math.floor(rng() * 4) + ar));
  }
  return res;
}

export function fmtTime(ms) {
  const s = Math.ceil(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  return `${h}:${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
}

// ---------- 업적 ----------
export function achValue(p, a) {
  switch (a.stat) {
    case 'owned':
      return owned(p).length;
    case 'maxCardLevel':
      return Math.max(...owned(p).map((id) => p.cards[id].level));
    case 'bestTrophies':
      return p.bestTrophies;
    case 'bestStreak':
      return p.streak.best;
    default:
      return p.stats[a.stat] || 0;
  }
}

export function achState(p, a) {
  const v = achValue(p, a);
  const claimed = !!p.ach[a.id];
  return { v: Math.min(v, a.n), done: v >= a.n, claimed };
}

export const claimableAch = (p) => ACHIEVEMENTS.filter((a) => {
  const s = achState(p, a);
  return s.done && !s.claimed;
}).length;

export function claimAch(p, id) {
  const a = ACHIEVEMENTS.find((x) => x.id === id);
  if (!a) return null;
  const s = achState(p, a);
  if (!s.done || s.claimed) return null;
  p.ach[id] = Date.now();
  addCoins(p, a.coins);
  return { coins: a.coins };
}

// 전투 결과를 통계/미션에 반영
export function recordBattle(p, b, res, mode) {
  const st = p.stats;
  st.battles++;
  if (res.winner === 0) st.wins++;
  else if (res.winner === 1) st.losses++;
  else st.draws++;
  const bs = b.stats;
  st.merges += bs.merges[0];
  st.maxMergesBattle = Math.max(st.maxMergesBattle, bs.merges[0]);
  st.towers += res.crowns[0] === 3 ? 3 : res.crowns[0];
  if (res.winner === 0 && res.reason === 'king') st.kingKills++;
  if (res.crowns[0] === 3) st.threeCrowns++;
  st.played += bs.played[0];
  st.spells += bs.spells[0];
  st.star3 += bs.star3[0];
  progressMission(p, 'play', bs.played[0]);
  progressMission(p, 'merge', bs.merges[0]);
  progressMission(p, 'tower', res.crowns[0]);
  progressMission(p, 'spell', bs.spells[0]);
  progressMission(p, 'star3', bs.star3[0]);
  if (res.winner === 0) progressMission(p, 'win', 1);
  if (mode === 'quick') progressMission(p, 'quick', 1);
}

export function quickDeck(p, rng) {
  const own = owned(p);
  const spells = own.filter((id) => CARDS[id].kind === 'spell');
  const others = own.filter((id) => CARDS[id].kind !== 'spell');
  const pick = (arr, n) => {
    const a = arr.slice();
    const out = [];
    while (out.length < n && a.length) out.push(a.splice(Math.floor(rng() * a.length), 1)[0]);
    return out;
  };
  const ns = Math.min(spells.length, 1 + (rng() < 0.5 ? 1 : 0));
  const deck = [...pick(spells, ns), ...pick(others, 8 - ns)];
  while (deck.length < 8) deck.push(...pick(own.filter((id) => !deck.includes(id)), 8 - deck.length));
  return deck.slice(0, 8);
}

export { PLAYABLE };
