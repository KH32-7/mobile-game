// 저장 데이터 + 장기 진행: 재화, 업그레이드, 스킨, 테마, 미션 세트(배수), 일일 미션, 출석, 주간 챌린지, 업적, 통계
import { CFG, SKINS, THEMES } from './config.js';

const KEY = 'swarm-surfers-v1';
export const SAVE_VERSION = 2;

const defStats = () => ({ runs: 0, totalDist: 0, totalCoins: 0, forts: 0, enemies: 0, goodGates: 0, powerups: 0, jumps: 0, slides: 0, revives: 0, playTime: 0, maxFortsRun: 0, gemsEarned: 0 });

const defaults = () => ({
  v: SAVE_VERSION,
  coins: 0,
  gems: 0,
  bestDist: 0,
  bestCount: 0,
  bestScore: 0,
  upgrades: { start: 0, magnet: 0, shield: 0, luck: 0 },
  muted: false,
  muteMusic: false,
  muteSfx: false,
  tutorialDone: false,
  skins: { owned: ['basic'], sel: 'basic', lv: {}, frags: {} },
  seen: [],
  themes: { unlocked: [0], sel: 0, seen: 1 },
  mset: { level: 1, done: 0, inSet: 0, list: [] },
  daily: null,
  streak: { last: '', count: 0 },
  weekly: { week: '', best: 0, claimed: false },
  ach: {},
  achSeen: 0,
  stats: defStats(),
});

const num = (v, d = 0) => (typeof v === 'number' && isFinite(v) ? v : d);
const obj = (v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : {});

// 이전 버전/손상된 데이터를 안전하게 현재 형식으로
export function migrate(p) {
  const d = defaults();
  p = obj(p);
  const ver = num(p.v, 1);
  d.coins = Math.max(0, num(p.coins));
  d.gems = Math.max(0, num(p.gems));
  d.bestDist = num(p.bestDist);
  d.bestCount = num(p.bestCount);
  d.bestScore = num(p.bestScore, ver < 2 ? d.bestDist : 0);
  for (const k in d.upgrades) d.upgrades[k] = Math.max(0, Math.min(CFG.upgrades[k].max, Math.floor(num(obj(p.upgrades)[k]))));
  d.muted = !!p.muted;
  d.muteMusic = typeof p.muteMusic === 'boolean' ? p.muteMusic : d.muted;
  d.muteSfx = typeof p.muteSfx === 'boolean' ? p.muteSfx : d.muted;
  if (Array.isArray(p.seen)) d.seen = p.seen.filter((x) => typeof x === 'string');
  d.tutorialDone = !!p.tutorialDone;
  const sk = obj(p.skins);
  if (Array.isArray(sk.owned)) d.skins.owned = [...new Set(['basic', ...sk.owned.filter((id) => SKINS.some((s) => s.id === id))])];
  if (d.skins.owned.includes(sk.sel)) d.skins.sel = sk.sel;
  for (const s2 of SKINS) {
    const lv = Math.floor(num(obj(sk.lv)[s2.id], 1));
    if (d.skins.owned.includes(s2.id)) d.skins.lv[s2.id] = Math.max(1, Math.min(SKIN_MAX_LV, lv));
    const fr = Math.floor(num(obj(sk.frags)[s2.id], 0));
    if (fr > 0) d.skins.frags[s2.id] = fr;
  }
  const th = obj(p.themes);
  if (Array.isArray(th.unlocked)) d.themes.unlocked = [...new Set([0, ...th.unlocked.filter((i) => Number.isInteger(i) && i >= 0 && i < THEMES.length)])];
  if (d.themes.unlocked.includes(th.sel)) d.themes.sel = th.sel;
  d.themes.seen = num(th.seen, d.themes.unlocked.length);
  d.themes.forts = {};
  for (const k in obj(th.forts)) d.themes.forts[k] = num(th.forts[k]);
  const ms = obj(p.mset);
  d.mset.level = Math.max(1, Math.min(30, Math.floor(num(ms.level, 1))));
  d.mset.done = num(ms.done);
  d.mset.inSet = Math.max(0, Math.min(2, num(ms.inSet)));
  if (Array.isArray(ms.list)) d.mset.list = ms.list.filter((m) => m && MPOOL.some((x) => x.type === m.type) && num(m.target) > 0);
  // v1 의 missions(일일) 필드 이관
  const daily = p.daily || p.missions;
  if (daily && typeof daily.date === 'string' && Array.isArray(daily.list)) d.daily = daily;
  const st = obj(p.streak);
  d.streak.last = typeof st.last === 'string' ? st.last : '';
  d.streak.count = num(st.count);
  const wk = obj(p.weekly);
  d.weekly = { week: typeof wk.week === 'string' ? wk.week : '', best: num(wk.best), claimed: !!wk.claimed };
  const ach = obj(p.ach);
  for (const a of ACHS) if (ach[a.id]) d.ach[a.id] = true;
  d.achSeen = num(p.achSeen);
  const s = obj(p.stats);
  for (const k in d.stats) d.stats[k] = num(s[k], d.stats[k]);
  if (ver < 2) d.stats.runs = Math.max(d.stats.runs, num(p.runs));
  d.v = SAVE_VERSION;
  return d;
}

export let save = defaults();

export function loadSave() {
  let p = null;
  try { const raw = localStorage.getItem(KEY); if (raw) p = JSON.parse(raw); } catch (e) { p = null; }
  save = migrate(p);
  fillMissionSet();
  persist();
  return save;
}

export function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(save)); } catch (e) { /* 저장 불가 환경 */ }
}

// ---------- 업그레이드 / 스킨 보너스 ----------
export function upgradeCost(id) {
  const u = CFG.upgrades[id];
  const lvl = save.upgrades[id] || 0;
  if (lvl >= u.max) return null;
  return Math.round(u.baseCost * Math.pow(u.mult, lvl) / 10) * 10;
}

export function buyUpgrade(id) {
  const c = upgradeCost(id);
  if (c == null || save.coins < c) return false;
  save.coins -= c;
  save.upgrades[id] = (save.upgrades[id] || 0) + 1;
  persist();
  return true;
}

export const skin = () => SKINS.find((s) => s.id === save.skins.sel) || SKINS[0];
export const SKIN_MAX_LV = 5;
export const SKIN_LV_COST = [0, 5, 10, 20, 40];
export const SKIN_UNLOCK_FRAGS = 10;
export const skinLv = (id) => save.skins.lv[id] || 1;
export const perkScale = (id) => 1 + 0.25 * (skinLv(id) - 1);
const perk = (k) => { const s = skin(); const v = s.perk[k] || 0; return k === 'start' ? Math.round(v * perkScale(s.id)) : v * perkScale(s.id); };
export const startCount = () => 12 + save.upgrades.start * 3 + perk('start');
export const magnetTime = () => CFG.magnetBase + save.upgrades.magnet * CFG.magnetPerLvl + perk('magnet');
export const bootsTime = () => CFG.bootsTime + perk('boots');
export const recruitTime = () => CFG.recruitTime + perk('recruit');
export const startShieldChance = () => save.upgrades.shield * 0.1 + perk('shield');
export const gateLuck = () => save.upgrades.luck * 0.05 + perk('luck');
export const coinMult = () => 1 + perk('coin');
export const fortMult = () => 1 + perk('fort');

export function buySkin(id) {
  const s = SKINS.find((x) => x.id === id);
  if (!s || save.skins.owned.includes(id) || save.gems < s.cost) return false;
  save.gems -= s.cost;
  save.skins.owned.push(id);
  save.skins.lv[id] = 1;
  save.skins.sel = id;
  persist();
  return true;
}
// 조각으로 해금
export function unlockSkinFrags(id) {
  const f = save.skins.frags[id] || 0;
  if (save.skins.owned.includes(id) || f < SKIN_UNLOCK_FRAGS) return false;
  save.skins.frags[id] = f - SKIN_UNLOCK_FRAGS;
  save.skins.owned.push(id);
  save.skins.lv[id] = 1;
  save.skins.sel = id;
  persist();
  return true;
}
export function skinUpCost(id) { const lv = skinLv(id); return lv >= SKIN_MAX_LV ? null : SKIN_LV_COST[lv]; }
export function levelUpSkin(id) {
  const c = skinUpCost(id);
  if (c == null || !save.skins.owned.includes(id) || (save.skins.frags[id] || 0) < c) return false;
  save.skins.frags[id] -= c;
  save.skins.lv[id] = skinLv(id) + 1;
  persist();
  return true;
}
// 무작위 스킨 조각 지급 (최대 레벨 제외)
export function addFrags(n, rnd = Math.random) {
  const pool = SKINS.filter((s) => s.id !== 'basic' && !(save.skins.owned.includes(s.id) && skinLv(s.id) >= SKIN_MAX_LV));
  if (!pool.length) return null;
  const s = pool[Math.floor(rnd() * pool.length)];
  save.skins.frags[s.id] = (save.skins.frags[s.id] || 0) + n;
  return { id: s.id, name: s.name, n };
}
export function selectSkin(id) { if (save.skins.owned.includes(id)) { save.skins.sel = id; persist(); } }
export function selectTheme(i) { if (save.themes.unlocked.includes(i)) { save.themes.sel = i; persist(); } }
// 해당 테마에서 요새 3개를 부수면 시작 테마로 해금. 해금되면 true
export const THEME_FORTS = 3;
export function themeFort(i) {
  save.themes.forts = save.themes.forts || {};
  save.themes.forts[i] = (save.themes.forts[i] || 0) + 1;
  if (save.themes.forts[i] >= THEME_FORTS) return unlockTheme(i);
  persist();
  return false;
}
export function unlockTheme(i) {
  if (save.themes.unlocked.includes(i)) return false;
  save.themes.unlocked.push(i);
  persist();
  return true;
}

// ---------- 날짜 ----------
export function dayKey(d = new Date()) { return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`; }
export function weekInfo(d = new Date()) {
  const day = Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000 + 3) / 7); // 월요일 기준 주 번호
  const seed = hashStr('week-' + day);
  return { key: 'W' + day, seed, target: 1200 + (seed % 5) * 200 };
}
export function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
function seededRnd(seed) {
  let h = seed >>> 0;
  return () => { h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0; h = Math.imul(h ^ (h >>> 13), 3266489909) >>> 0; h ^= h >>> 16; return (h >>> 0) / 4294967296; };
}

// ---------- 출석 ----------
export const STREAK_REWARDS = [{ c: 80 }, { c: 120 }, { f: 3 }, { c: 200 }, { g: 1 }, { c: 300 }, { g: 2 }];
export function streakAvailable() { return save.streak.last !== dayKey(); }
export function claimStreak() {
  if (!streakAvailable()) return null;
  const y = new Date(); y.setDate(y.getDate() - 1);
  save.streak.count = save.streak.last === dayKey(y) ? save.streak.count + 1 : 1;
  save.streak.last = dayKey();
  const r = STREAK_REWARDS[(save.streak.count - 1) % 7];
  if (r.c) save.coins += r.c;
  if (r.g) addGems(r.g);
  if (r.f) r.frag = addFrags(r.f);
  persist();
  return r;
}

export function addGems(n) { save.gems += n; save.stats.gemsEarned += n; }

// ---------- 주간 챌린지 ----------
export function weeklyState() {
  const w = weekInfo();
  if (save.weekly.week !== w.key) save.weekly = { week: w.key, best: 0, claimed: false };
  return { ...w, best: save.weekly.best, claimed: save.weekly.claimed };
}
// 결과 반영, 보상 지급 시 true
export function reportWeekly(dist) {
  const w = weeklyState();
  save.weekly.best = Math.max(save.weekly.best, Math.floor(dist));
  if (!save.weekly.claimed && dist >= w.target) {
    save.weekly.claimed = true;
    addGems(2); save.coins += 300;
    persist();
    return true;
  }
  persist();
  return false;
}

// ---------- 미션 공통 풀 ----------
// scope run: 한 판 최댓값, sum: 누적
const MPOOL = [
  { type: 'dist', scope: 'run', base: 500, step: 250, text: (t) => `한 판에 ${t}m 달리기` },
  { type: 'count', scope: 'run', base: 50, step: 30, text: (t) => `한 판에 인원 ${t}명 달성` },
  { type: 'coinsRun', scope: 'run', base: 60, step: 30, text: (t) => `한 판에 코인 ${t}개 모으기` },
  { type: 'fortRun', scope: 'run', base: 1, step: 0.34, text: (t) => `한 판에 요새 ${t}개 부수기` },
  { type: 'coins', scope: 'sum', base: 200, step: 120, text: (t) => `코인 ${t}개 모으기` },
  { type: 'fortress', scope: 'sum', base: 1, step: 0.5, text: (t) => `요새 ${t}개 부수기` },
  { type: 'enemies', scope: 'sum', base: 60, step: 40, text: (t) => `적 ${t}명 물리치기` },
  { type: 'goodGates', scope: 'sum', base: 8, step: 4, text: (t) => `파란 게이트 ${t}번 통과` },
  { type: 'powerups', scope: 'sum', base: 2, step: 1, text: (t) => `파워업 ${t}개 먹기` },
  { type: 'jumps', scope: 'sum', base: 15, step: 8, text: (t) => `점프 ${t}번 하기` },
  { type: 'slides', scope: 'sum', base: 10, step: 6, text: (t) => `슬라이드 ${t}번 하기` },
];
export const missionText = (m) => (MPOOL.find((x) => x.type === m.type) || { text: () => m.type }).text(m.target);

// 미션 목표는 레벨마다 약 1.6배 (요새 계열은 완만하게)
const GROW = { fortRun: 1.25, fortress: 1.4 };
function makeMission(type, tier) {
  const p = MPOOL.find((x) => x.type === type);
  const target = Math.max(1, Math.round(p.base * Math.pow(GROW[type] || 1.6, tier)));
  return { type, target, progress: 0, done: false, reward: Math.round(60 + tier * 15) };
}

// 미션 세트 (배수 미션) 3개 유지
function fillMissionSet() {
  const ms = save.mset;
  const rnd = seededRnd(hashStr('mset' + ms.done + ms.level));
  let guard = 0;
  while (ms.list.length < 3 && guard++ < 50) {
    const cand = MPOOL[Math.floor(rnd() * MPOOL.length)];
    if (ms.list.some((m) => m.type === cand.type)) continue;
    ms.list.push(makeMission(cand.type, ms.level - 1));
  }
}

export function ensureDaily() {
  const key = dayKey();
  if (save.daily && save.daily.date === key) return save.daily.list;
  const rnd = seededRnd(hashStr(key));
  const idx = MPOOL.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
  const list = idx.slice(0, 3).map((i) => makeMission(MPOOL[i].type, 1 + Math.floor(rnd() * 3)));
  list.forEach((m) => { m.reward = Math.round(m.reward + 30); });
  save.daily = { date: key, list };
  persist();
  return list;
}

// 이벤트 보고. run 값은 현재 판 값, sum 값은 증가량. 완료 알림 목록 반환
export function track(type, value) {
  const out = [];
  const p = MPOOL.find((x) => x.type === type);
  if (!p) return out;
  const upd = (m) => {
    if (m.type !== type || m.done) return false;
    if (p.scope === 'run') m.progress = Math.max(m.progress, value); else m.progress += value;
    if (m.progress >= m.target) { m.progress = m.target; m.done = true; m.reward = Math.round(m.reward); save.coins += m.reward; return true; }
    return false;
  };
  for (const m of ensureDaily()) if (upd(m)) out.push({ kind: 'daily', text: `일일 미션 완료! +${m.reward} 코인` });
  const ms = save.mset;
  for (let i = 0; i < ms.list.length; i++) {
    const m = ms.list[i];
    if (upd(m)) {
      const fr = addFrags(1);
      out.push({ kind: 'mission', text: `미션 완료! +${m.reward} 코인${fr ? `, ${fr.name} 조각 +1` : ''}` });
      ms.done++;
      ms.inSet++;
      ms.list.splice(i, 1); i--;
      if (ms.inSet >= 3) {
        ms.inSet = 0;
        if (ms.level < 30) ms.level++;
        const g = ms.level % 2 === 0 ? 1 : 0;
        if (g) addGems(g);
        out.push({ kind: 'level', text: `미션 배수 x${ms.level}!${g ? ' 보석 +1' : ''}` });
      }
    }
  }
  fillMissionSet();
  return out;
}

// ---------- 업적 (18개) ----------
const S = (k) => (s) => s.stats[k];
export const ACHS = [
  { id: 'run1', name: '첫 질주', desc: '첫 판 플레이', v: S('runs'), goal: 1, gem: 1 },
  { id: 'run50', name: '단골 러너', desc: '50판 플레이', v: S('runs'), goal: 50, gem: 3 },
  { id: 'd500', name: '워밍업', desc: '한 판 500m', v: (s) => s.bestDist, goal: 500, gem: 1 },
  { id: 'd1500', name: '장거리 주자', desc: '한 판 1500m', v: (s) => s.bestDist, goal: 1500, gem: 2 },
  { id: 'd3000', name: '마라토너', desc: '한 판 3000m', v: (s) => s.bestDist, goal: 3000, gem: 3 },
  { id: 'd5000', name: '끝없는 질주', desc: '한 판 5000m', v: (s) => s.bestDist, goal: 5000, gem: 5 },
  { id: 'c100', name: '작은 군단', desc: '인원 100명', v: (s) => s.bestCount, goal: 100, gem: 1 },
  { id: 'c300', name: '큰 군단', desc: '인원 300명', v: (s) => s.bestCount, goal: 300, gem: 2 },
  { id: 'c1000', name: '대군세', desc: '인원 1000명', v: (s) => s.bestCount, goal: 1000, gem: 5 },
  { id: 'f1', name: '성문 파괴자', desc: '요새 1개 격파', v: S('forts'), goal: 1, gem: 1 },
  { id: 'f10', name: '공성 전문가', desc: '요새 누적 10개', v: S('forts'), goal: 10, gem: 3 },
  { id: 'fr3', name: '정복자', desc: '한 판에 요새 3개', v: S('maxFortsRun'), goal: 3, gem: 4 },
  { id: 'e500', name: '맞대결', desc: '적 누적 500명', v: S('enemies'), goal: 500, gem: 2 },
  { id: 'e5000', name: '무적 군단', desc: '적 누적 5000명', v: S('enemies'), goal: 5000, gem: 5 },
  { id: 'coin5k', name: '저금통', desc: '코인 누적 5000개', v: S('totalCoins'), goal: 5000, gem: 2 },
  { id: 'gate100', name: '계산의 달인', desc: '파란 게이트 100번', v: S('goodGates'), goal: 100, gem: 2 },
  { id: 'pu30', name: '아이템 수집가', desc: '파워업 30개', v: S('powerups'), goal: 30, gem: 2 },
  { id: 'skin3', name: '패셔니스타', desc: '스킨 3종 보유', v: (s) => s.skins.owned.length, goal: 3, gem: 2 },
  { id: 'mx5', name: '배수 사냥꾼', desc: '미션 배수 x5', v: (s) => s.mset.level, goal: 5, gem: 3 },
  { id: 'rev1', name: '불사조', desc: '부활 1번', v: S('revives'), goal: 1, gem: 1 },
];

export function checkAchievements() {
  const out = [];
  for (const a of ACHS) {
    if (save.ach[a.id]) continue;
    if (a.v(save) >= a.goal) { save.ach[a.id] = true; addGems(achGem(a)); out.push({ kind: 'ach', text: `업적 달성: ${a.name}! 보석 +${achGem(a)}` }); }
  }
  if (out.length) persist();
  return out;
}
export const achGem = () => 1;
export const achCount = () => ACHS.filter((a) => save.ach[a.id]).length;

// 타이틀 알림 뱃지
export function badges() {
  const all = {
    missions: streakAvailable() && features().missions,
    skins: features().skins && SKINS.some((s) => (!save.skins.owned.includes(s.id) && (save.gems >= s.cost || (save.skins.frags[s.id] || 0) >= SKIN_UNLOCK_FRAGS)) || (save.skins.owned.includes(s.id) && skinUpCost(s.id) != null && (save.skins.frags[s.id] || 0) >= skinUpCost(s.id))),
    shop: features().shop && Object.keys(CFG.upgrades).some((id) => { const c = upgradeCost(id); return c != null && save.coins >= c; }),
    ach: features().ach && achCount() > save.achSeen,
    themes: features().themes && save.themes.unlocked.length > save.themes.seen,
  };
  // 실제 행동 가능한 항목 최대 2개만
  const out = {};
  let n = 0;
  for (const k of ['missions', 'skins', 'shop', 'ach', 'themes']) if (all[k] && n < 2) { out[k] = true; n++; }
  return out;
}

// 단계적 기능 노출
export function features() {
  const r = save.stats.runs;
  return {
    records: r >= 1,
    missions: r >= 1,
    shop: r >= 1,
    skins: r >= 2 || save.gems > 0,
    ach: r >= 2,
    weekly: r >= 3,
    themes: save.themes.unlocked.length >= 2,
  };
}
// 처음 노출되는 기능 목록 (한 번만)
export function newFeatures() {
  const f = features();
  const out = [];
  for (const k in f) if (f[k] && !save.seen.includes(k)) { save.seen.push(k); out.push(k); }
  if (out.length) persist();
  return out;
}
