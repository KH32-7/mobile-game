// 영구 저장 (localStorage). 버전 필드 + 마이그레이션
import { MAP_ORDER, START_SKILLS } from './config.js';

const KEY = 'void-maw-save';
const OLD_KEYS = ['void-maw-save-v1'];
export const SAVE_VER = 2;

const mapDefaults = (unlocked) => ({ unlocked, diff: 1, clear: 0, best: { time: 0, size: 0, kills: 0 } });

export const defaults = () => ({
  ver: SAVE_VER,
  coins: 0,
  muted: false,
  settings: { music: 0.7, sfx: 0.9 },
  tutorialDone: false,
  upg: { size: 0, hp: 0, speed: 0, xp: 0, coin: 0, power: 0, armor: 0, reroll: 0, revive: 0 },
  maps: Object.fromEntries(MAP_ORDER.map((m, i) => [m, mapDefaults(i === 0)])),
  sel: { map: 'city', diff: 1 },
  skills: [...START_SKILLS],
  skins: { owned: ['void'], sel: 'void' },
  stats: {
    swallowed: 0,
    kills: 0,
    runs: 0,
    playTime: 0,
    bestTime: 0,
    maxSize: 0,
    maxCombo: 0,
    maxLevel: 0,
    bossKills: 0,
    miniKills: 0,
    evolutions: 0,
    dailyClears: 0,
    bestStreak: 0,
    upgLevels: 0,
    coinsEarned: 0,
  },
  ach: {}, // id -> 달성 시각
  seen: { ach: [], unlocks: [] }, // 아직 확인 안 한 새 알림
  daily: { date: '', missions: [], bonusClaimed: false, challenge: { best: 0, done: false, claimed: false } },
  streak: { last: '', count: 0, claimed: '' },
});

// 기본값 위에 저장값을 타입 검사하며 덮어씀 (알 수 없는/깨진 필드는 기본값 유지)
function mergeDeep(base, v) {
  if (v === undefined || v === null) return base;
  if (Array.isArray(base)) return Array.isArray(v) ? v : base;
  if (typeof base === 'object' && base !== null) {
    if (typeof v !== 'object' || Array.isArray(v)) return base;
    const out = { ...base };
    for (const k of Object.keys(v)) {
      out[k] = k in base ? mergeDeep(base[k], v[k]) : v[k];
    }
    return out;
  }
  if (typeof base === 'number') return typeof v === 'number' && isFinite(v) ? v : base;
  if (typeof base === 'boolean') return typeof v === 'boolean' ? v : base;
  if (typeof base === 'string') return typeof v === 'string' ? v : base;
  return v;
}

// v1 (버전 필드 없음) -> v2
function migrate(d) {
  if (!d || typeof d !== 'object') return defaults();
  let ver = typeof d.ver === 'number' ? d.ver : 1;
  if (ver < 2) {
    const n = defaults();
    n.coins = d.coins | 0;
    n.muted = !!d.muted;
    n.tutorialDone = !!d.tutorialDone;
    if (d.upg) for (const k of ['size', 'hp', 'speed', 'xp']) n.upg[k] = Math.min(10, d.upg[k] | 0);
    const b = d.best || {};
    n.maps.city.best = { time: b.time || 0, size: b.size || 0, kills: b.kills || 0 };
    if (b.cleared) {
      n.maps.city.clear = 1;
      n.maps.city.diff = 2;
      n.maps.beach.unlocked = true;
    }
    n.stats.bestTime = b.time || 0;
    n.stats.maxSize = b.size || 0;
    n.stats.runs = d.runs | 0;
    d = n;
    ver = 2;
  }
  d.ver = SAVE_VER;
  return d;
}

export const Save = {
  data: defaults(),
  load() {
    let raw = null;
    try {
      raw = localStorage.getItem(KEY);
      if (!raw) {
        for (const k of OLD_KEYS) {
          raw = localStorage.getItem(k);
          if (raw) break;
        }
      }
    } catch (e) {
      raw = null;
    }
    try {
      const parsed = raw ? JSON.parse(raw) : null;
      this.data = parsed ? mergeDeep(defaults(), migrate(parsed)) : defaults();
    } catch (e) {
      this.data = defaults();
    }
    // 무결성 보정
    const d = this.data;
    d.maps.city.unlocked = true;
    for (const m of MAP_ORDER) d.maps[m].diff = Math.max(1, Math.min(5, d.maps[m].diff | 0));
    if (!d.maps[d.sel.map] || !d.maps[d.sel.map].unlocked) d.sel.map = 'city';
    d.sel.diff = Math.max(1, Math.min(d.maps[d.sel.map].diff, d.sel.diff | 0));
    for (const s of START_SKILLS) if (!d.skills.includes(s)) d.skills.push(s);
    if (!d.skins.owned.includes('void')) d.skins.owned.push('void');
    if (!d.skins.owned.includes(d.skins.sel)) d.skins.sel = 'void';
    this.save();
    return d;
  },
  save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(this.data));
    } catch (e) {
      /* 저장 불가 환경 */
    }
  },
};
