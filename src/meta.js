// 장기 진행 (영구 저장): 보석, 해금, 월드 별, 업적, 통계, 일일 미션, 출석, 이어하기
import { load, save } from './storage.js';
import { RELICS } from './relics.js';
import { WORLDS, BALL_SKINS, TRAILS, FLAGS } from './worlds.js';
import { mulberry32, hashStr, dateSeedStr } from './rng.js';

export const SAVE_VERSION = 3;

// 처음부터 풀에 있는 유물 12종, 나머지는 보석으로 해금
export const STARTER_RELICS = ['sticky', 'magnet', 'longaim', 'bounceking', 'sandproof', 'luckytee', 'echo', 'heavy', 'coinmag', 'cushion', 'tailwind', 'mulligan'];
export const RELIC_PRICE = { ghost: 20, split: 30, skiwax: 12, waterski: 18, windbreak: 12, parplus: 40, harvest: 25, brake: 18, vitality: 30, bigcup: 25 };
export const PERKS = [{ id: 'startRelic', name: '시작 유물 선택', desc: '런 시작 시 해금된 유물 3개 중 1개를 골라서 시작', price: 50 }];

const STAT_KEYS = ['runs', 'holes', 'strokes', 'aces', 'albatross', 'eagles', 'birdies', 'parOrBetter', 'bogeys', 'bossClears', 'water', 'bumpers', 'crates', 'coins', 'relicsTaken', 'dailies', 'completes', 'underPar', 'gemsEarned', 'shots'];

function defaults() {
  const worlds = {};
  WORLDS.forEach((w, i) => (worlds[w.id] = { unlocked: i === 0, stars: [false, false, false], bestHoles: 0, bestToPar: null, runs: 0 }));
  const stats = {};
  for (const k of STAT_KEYS) stats[k] = 0;
  Object.assign(stats, { bestRunStrokes: null, bestToPar: null, bestHoles: 0, maxRelicsRun: 0, maxCoinsRun: 0, maxStreak: 0 });
  return {
    v: SAVE_VERSION,
    gems: 0,
    unlockedRelics: [...STARTER_RELICS],
    discovered: [],
    cosmetics: { owned: { ball: ['white'], trail: ['basic'], flag: ['theme'] }, eq: { ball: 'white', trail: 'basic', flag: 'theme' } },
    perks: {},
    worlds,
    selWorld: 'meadow',
    stats,
    ach: {},
    daily: { date: '', missions: [], counters: {}, streak: 0, lastLogin: '', streakClaimed: '', best: {} },
    notices: [],
    run: null,
    settings: { muted: false, tutorial: false },
  };
}

const isObj = (o) => o && typeof o === 'object' && !Array.isArray(o);
// 기본값 위에 저장값을 타입이 맞는 것만 덮어씀
function mergeSafe(def, src) {
  if (!isObj(src)) return def;
  const out = Array.isArray(def) ? def.slice() : { ...def };
  for (const k of Object.keys(src)) {
    const dv = def[k],
      sv = src[k];
    if (dv === undefined) out[k] = sv;
    else if (isObj(dv)) out[k] = mergeSafe(dv, sv);
    else if (Array.isArray(dv)) out[k] = Array.isArray(sv) ? sv : dv;
    else if (dv === null) out[k] = sv;
    else if (typeof dv === typeof sv) out[k] = sv;
  }
  return out;
}

export function migrate(raw) {
  const d = defaults();
  if (!isObj(raw)) return d;
  let m = mergeSafe(d, raw);
  const v = typeof raw.v === 'number' ? raw.v : 1;
  if (v < 2) {
    // v1: 기록만 있던 시절 (records 키)
    if (isObj(raw.records)) {
      m.stats.bestToPar = raw.records.bestToPar ?? null;
      m.stats.bestHoles = raw.records.bestHoles || 0;
      m.stats.runs = raw.records.runs || 0;
    }
  }
  if (v < 3) {
    // v2 -> v3: 꾸미기 구조 변경 (skin 문자열 -> cosmetics 객체)
    if (typeof raw.skin === 'string' && BALL_SKINS.some((s) => s.id === raw.skin)) {
      if (!m.cosmetics.owned.ball.includes(raw.skin)) m.cosmetics.owned.ball.push(raw.skin);
      m.cosmetics.eq.ball = raw.skin;
    }
    delete m.skin;
    delete m.records;
  }
  // 무결성 보정
  m.v = SAVE_VERSION;
  m.gems = Math.max(0, Math.floor(+m.gems || 0));
  const relicIds = new Set(RELICS.map((r) => r.id));
  m.unlockedRelics = [...new Set([...STARTER_RELICS, ...m.unlockedRelics.filter((id) => relicIds.has(id))])];
  m.discovered = [...new Set(m.discovered.filter((id) => relicIds.has(id)))];
  for (const w of WORLDS) {
    const ww = m.worlds[w.id];
    if (!Array.isArray(ww.stars) || ww.stars.length !== 3) ww.stars = [false, false, false];
  }
  m.worlds.meadow.unlocked = true;
  if (!m.worlds[m.selWorld] || !m.worlds[m.selWorld].unlocked) m.selWorld = 'meadow';
  for (const kind of ['ball', 'trail', 'flag']) {
    const list = { ball: BALL_SKINS, trail: TRAILS, flag: FLAGS }[kind];
    m.cosmetics.owned[kind] = [...new Set([list[0].id, ...m.cosmetics.owned[kind].filter((id) => list.some((x) => x.id === id))])];
    if (!m.cosmetics.owned[kind].includes(m.cosmetics.eq[kind])) m.cosmetics.eq[kind] = list[0].id;
  }
  if (m.run && !(isObj(m.run) && typeof m.run.holeIdx === 'number' && Array.isArray(m.run.relics))) m.run = null;
  return m;
}

let M = null;
export function meta() {
  if (!M) {
    let raw = load('meta', null);
    if (!raw) {
      const oldRec = load('records', null); // v1 키
      if (oldRec) raw = { v: 1, records: oldRec };
    }
    M = migrate(raw);
    persist();
  }
  return M;
}
export function persist() {
  if (M) save('meta', M);
}
export function reloadMeta() {
  M = null;
  return meta();
}

// ---------- 날짜 / 일일 ----------
function dayStr(offset = 0, now = new Date()) {
  const d = new Date(now);
  d.setDate(d.getDate() + offset);
  return dateSeedStr(d);
}

export const MISSION_POOL = [
  { id: 'holes', key: 'holes', text: (n) => `홀 ${n}개 클리어`, targets: [6, 10], reward: 6 },
  { id: 'birdies', key: 'birdies', text: (n) => `버디 이하로 ${n}번 끝내기`, targets: [2, 4], reward: 8 },
  { id: 'coins', key: 'coins', text: (n) => `코스 코인 ${n}개 줍기`, targets: [4, 7], reward: 5 },
  { id: 'bumpers', key: 'bumpers', text: (n) => `범퍼 ${n}번 맞히기`, targets: [6, 10], reward: 5 },
  { id: 'crates', key: 'crates', text: (n) => `나무 상자 ${n}개 부수기`, targets: [3, 5], reward: 5 },
  { id: 'daily', key: 'dailies', text: () => '데일리 코스 완료하기', targets: [1], reward: 7 },
  { id: 'boss', key: 'bossClears', text: () => '보스 홀 클리어', targets: [1], reward: 8 },
  { id: 'relics', key: 'relicsTaken', text: (n) => `유물 ${n}개 얻기`, targets: [4, 6], reward: 5 },
  { id: 'pars', key: 'parOrBetter', text: (n) => `파 이하로 홀 ${n}개`, targets: [5, 8], reward: 6 },
];

export function rollDaily(now = new Date()) {
  const m = meta();
  const today = dayStr(0, now);
  const d = m.daily;
  if (d.lastLogin !== today) {
    d.streak = d.lastLogin === dayStr(-1, now) ? (d.streak || 0) + 1 : 1;
    d.lastLogin = today;
    m.stats.maxStreak = Math.max(m.stats.maxStreak || 0, d.streak);
  }
  if (d.date !== today) {
    d.date = today;
    d.counters = {};
    const rng = mulberry32(hashStr('missions-' + today));
    const pool = rng.shuffle(MISSION_POOL.slice()).slice(0, 3);
    d.missions = pool.map((p) => ({ id: p.id, target: rng.pick(p.targets), claimed: false }));
  }
  persist();
  checkAchievements();
  return d;
}

export function missionView() {
  const d = meta().daily;
  return d.missions.map((ms, i) => {
    const def = MISSION_POOL.find((p) => p.id === ms.id);
    const prog = Math.min(ms.target, d.counters[def.key] || 0);
    return { i, text: def.text(ms.target), prog, target: ms.target, reward: def.reward, done: prog >= ms.target, claimed: ms.claimed };
  });
}
export function claimMission(i) {
  const v = missionView()[i];
  if (!v || !v.done || v.claimed) return 0;
  meta().daily.missions[i].claimed = true;
  addGems(v.reward);
  return v.reward;
}
export const streakReward = () => 3 + 2 * Math.min(7, meta().daily.streak || 1);
export function canClaimStreak() {
  const d = meta().daily;
  return d.streakClaimed !== d.lastLogin;
}
export function claimStreak() {
  if (!canClaimStreak()) return 0;
  const r = streakReward();
  meta().daily.streakClaimed = meta().daily.lastLogin;
  addGems(r);
  return r;
}
export function badgeCount() {
  return missionView().filter((v) => v.done && !v.claimed).length + (canClaimStreak() ? 1 : 0);
}

// ---------- 통계 추적 (통계 + 오늘의 미션 카운터) ----------
export function track(key, n = 1) {
  const m = meta();
  m.stats[key] = (m.stats[key] || 0) + n;
  m.daily.counters[key] = (m.daily.counters[key] || 0) + n;
}

export function addGems(n) {
  const m = meta();
  m.gems += n;
  m.stats.gemsEarned = (m.stats.gemsEarned || 0) + n;
  persist();
}
function spend(n) {
  const m = meta();
  if (m.gems < n) return false;
  m.gems -= n;
  return true;
}

// ---------- 해금 ----------
export function unlockRelic(id) {
  const m = meta();
  if (m.unlockedRelics.includes(id) || !(id in RELIC_PRICE)) return false;
  if (!spend(RELIC_PRICE[id])) return false;
  m.unlockedRelics.push(id);
  persist();
  checkAchievements();
  return true;
}
export function discover(id) {
  const m = meta();
  if (!m.discovered.includes(id)) {
    m.discovered.push(id);
    return true;
  }
  return false;
}
const COS_LIST = { ball: BALL_SKINS, trail: TRAILS, flag: FLAGS };
export function buyCosmetic(kind, id) {
  const m = meta();
  const it = COS_LIST[kind].find((x) => x.id === id);
  if (!it || m.cosmetics.owned[kind].includes(id)) return false;
  if (!spend(it.price)) return false;
  m.cosmetics.owned[kind].push(id);
  m.cosmetics.eq[kind] = id;
  persist();
  checkAchievements();
  return true;
}
export function equip(kind, id) {
  const m = meta();
  if (!m.cosmetics.owned[kind].includes(id)) return false;
  m.cosmetics.eq[kind] = id;
  persist();
  return true;
}
export function buyPerk(id) {
  const p = PERKS.find((x) => x.id === id);
  const m = meta();
  if (!p || m.perks[id]) return false;
  if (!spend(p.price)) return false;
  m.perks[id] = true;
  persist();
  return true;
}
export const cosmetic = (kind) => COS_LIST[kind].find((x) => x.id === meta().cosmetics.eq[kind]) || COS_LIST[kind][0];

// ---------- 월드 ----------
export function worldProgress() {
  const m = meta();
  return WORLDS.map((w, i) => ({ ...w, i, ...m.worlds[w.id], starCount: m.worlds[w.id].stars.filter(Boolean).length }));
}
export const totalStars = () => worldProgress().reduce((s, w) => s + w.starCount, 0);

// ---------- 이어하기 ----------
export function saveRun(snap) {
  meta().run = snap;
  persist();
}
export function clearRun() {
  meta().run = null;
  persist();
}

// ---------- 런 종료 정산 ----------
export function finishRun(r) {
  // r: { mode, world, date, holesCleared, toPar, strokes, complete, relicsCount, maxCoins, counts: {aces, eagles, birdies} }
  const m = meta();
  track('runs');
  if (r.complete) track('completes');
  if (r.complete && r.toPar <= 0) track('underPar');
  if (r.mode === 'daily') track('dailies');
  const st = m.stats;
  st.maxRelicsRun = Math.max(st.maxRelicsRun || 0, r.relicsCount);
  st.maxCoinsRun = Math.max(st.maxCoinsRun || 0, r.maxCoins);
  let newBest = false;
  if (r.holesCleared > (st.bestHoles || 0)) {
    st.bestHoles = r.holesCleared;
    newBest = true;
  }
  if (r.complete) {
    if (st.bestToPar == null || r.toPar < st.bestToPar) {
      st.bestToPar = r.toPar;
      newBest = true;
    }
    if (st.bestRunStrokes == null || r.strokes < st.bestRunStrokes) st.bestRunStrokes = r.strokes;
  }
  // 월드 기록/별
  const newStars = [];
  const unlockedWorlds = [];
  if (r.mode === 'normal' && m.worlds[r.world]) {
    const w = m.worlds[r.world];
    w.runs++;
    w.bestHoles = Math.max(w.bestHoles, r.holesCleared);
    if (r.complete && (w.bestToPar == null || r.toPar < w.bestToPar)) w.bestToPar = r.toPar;
    const goals = [r.holesCleared >= 9, r.complete, r.complete && r.toPar <= 0];
    goals.forEach((ok, i) => {
      if (ok && !w.stars[i]) {
        w.stars[i] = true;
        newStars.push(i);
      }
    });
    // 다음 월드 해금: 이전 월드 별 1개 이상
    const wi = WORLDS.findIndex((x) => x.id === r.world);
    const next = WORLDS[wi + 1];
    if (next && w.stars[0] && !m.worlds[next.id].unlocked) {
      m.worlds[next.id].unlocked = true;
      unlockedWorlds.push(next.id);
      m.notices.push(`새 월드 해금: ${next.name}`);
    }
  }
  if (r.mode === 'daily') {
    const prev = m.daily.best[r.date];
    if (!prev || r.holesCleared > prev.holes || (r.holesCleared === prev.holes && r.toPar < prev.toPar)) m.daily.best[r.date] = { holes: r.holesCleared, toPar: r.toPar };
    const keys = Object.keys(m.daily.best).sort();
    while (keys.length > 14) delete m.daily.best[keys.shift()];
  }
  // 보석
  const c = r.counts || {};
  const breakdown = [
    ['클리어한 홀', r.holesCleared],
    ['버디', c.birdies || 0],
    ['이글 이상', (c.eagles || 0) * 3],
    ['홀인원', (c.aces || 0) * 5],
    ['완주 보너스', r.complete ? 10 : 0],
    ['새 별', newStars.length * 5],
    ['데일리 보너스', r.mode === 'daily' ? 3 : 0],
  ].filter((x) => x[1] > 0);
  const gems = breakdown.reduce((s, x) => s + x[1], 0);
  addGems(gems);
  m.run = null;
  persist();
  const ach = checkAchievements();
  return { gems, breakdown, newStars, unlockedWorlds, newBest, ach };
}

// ---------- 업적 ----------
export const ACHIEVEMENTS = [
  { id: 'first', name: '첫 컵인', desc: '홀 1개 클리어', gems: 3, test: (s) => s.holes >= 1 },
  { id: 'ace1', name: '홀인원!', desc: '홀인원 1회', gems: 10, test: (s) => s.aces >= 1 },
  { id: 'ace5', name: '홀인원 장인', desc: '홀인원 누적 5회', gems: 25, test: (s) => s.aces >= 5 },
  { id: 'birdie20', name: '버디 사냥꾼', desc: '버디 이하 누적 20회', gems: 10, test: (s) => s.birdies >= 20 },
  { id: 'eagle', name: '이글 아이', desc: '이글 이상 1회', gems: 8, test: (s) => s.eagles >= 1 },
  { id: 'front9', name: '전반 정복', desc: '한 런에서 9홀 클리어', gems: 5, test: (s) => s.bestHoles >= 9 },
  { id: 'complete', name: '완주', desc: '18홀 완주', gems: 15, test: (s) => s.completes >= 1 },
  { id: 'underpar', name: '언더파 골퍼', desc: '파 이하로 완주', gems: 20, test: (s) => s.underPar >= 1 },
  { id: 'boss3', name: '보스 사냥', desc: '보스 홀 누적 3회 클리어', gems: 10, test: (s) => s.bossClears >= 3 },
  { id: 'relic8', name: '수집가', desc: '한 런에서 유물 8개', gems: 8, test: (s) => s.maxRelicsRun >= 8 },
  { id: 'codex11', name: '도감 절반', desc: '유물 11종 발견', gems: 10, test: (s, m) => m.discovered.length >= 11 },
  { id: 'codex22', name: '도감 완성', desc: '유물 22종 모두 발견', gems: 40, test: (s, m) => m.discovered.length >= 22 },
  { id: 'splash20', name: '물수제비', desc: '물에 누적 20번 빠지기', gems: 5, test: (s) => s.water >= 20 },
  { id: 'crates30', name: '파괴왕', desc: '상자 누적 30개 부수기', gems: 8, test: (s) => s.crates >= 30 },
  { id: 'bumper100', name: '범퍼카', desc: '범퍼 누적 100번', gems: 8, test: (s) => s.bumpers >= 100 },
  { id: 'rich', name: '부자 골퍼', desc: '한 런에서 코인 40개 보유', gems: 8, test: (s) => s.maxCoinsRun >= 40 },
  { id: 'streak7', name: '개근상', desc: '7일 연속 출석', gems: 20, test: (s) => s.maxStreak >= 7 },
  { id: 'daily5', name: '매일 한 판', desc: '데일리 코스 5회', gems: 10, test: (s) => s.dailies >= 5 },
  { id: 'stars6', name: '별 수집가', desc: '별 6개 모으기', gems: 10, test: () => totalStars() >= 6 },
  { id: 'space', name: '우주 골프', desc: '우주 월드 해금', gems: 15, test: (s, m) => m.worlds.space.unlocked },
  { id: 'fashion', name: '패셔니스타', desc: '꾸미기 아이템 3개 구매', gems: 5, test: (s, m) => m.cosmetics.owned.ball.length + m.cosmetics.owned.trail.length + m.cosmetics.owned.flag.length - 3 >= 3 },
];

export function checkAchievements() {
  const m = meta();
  const got = [];
  for (const a of ACHIEVEMENTS) {
    if (m.ach[a.id]) continue;
    let ok = false;
    try {
      ok = a.test(m.stats, m);
    } catch {
      ok = false;
    }
    if (ok) {
      m.ach[a.id] = Date.now();
      m.gems += a.gems;
      m.stats.gemsEarned = (m.stats.gemsEarned || 0) + a.gems;
      m.notices.push(`업적 달성: ${a.name} (+${a.gems} 보석)`);
      got.push(a);
    }
  }
  if (got.length) persist();
  return got;
}

export function takeNotices() {
  const m = meta();
  const n = m.notices.slice();
  m.notices = [];
  persist();
  return n;
}
