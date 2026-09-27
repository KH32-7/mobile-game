// localStorage 저장: 버전 필드 + 마이그레이션 + 손상 데이터 안전 처리
import { SAVE_KEY, SAVE_VERSION } from './config.js';

export function today(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function newRun() {
  return {
    money: 0,
    earned: 0,
    done: [],
    paid: {},
    upg: {},
    st: {},
    cr: {},
    sinkQ: 0,
    belts: {},
    stack: [],
    seats: {},
    hist: [0.7, 0.7, 0.7, 0.7, 0.7, 0.7],
    combo: 0,
    rushT: 0,
    time: 0,
    cust: 0,
    plates: 0,
    bestCombo: 0,
    staff: [],
  };
}

export function defaultProfile() {
  return {
    v: SAVE_VERSION,
    created: Date.now(),
    lastSeen: Date.now(),
    pearls: 0,
    stage: 0,
    run: newRun(),
    records: [],
    stats: { plates: 0, customers: 0, earned: 0, unlocks: 0, staff: 0, maxCombo: 0, vip: 0, washed: 0, dried: 0, stage: 1, bestStars: 0, rushes: 0, playSec: 0, offline: 0, angry: 0 },
    ach: {},
    missions: { day: '', list: [] },
    attend: { last: '', day: 0 },
    cos: { hats: ['chef'], aprons: ['white'], skins: ['base'], hat: 'chef', apron: 'white', skin: 'base' },
    dex: {},
    settings: { sfx: true, bgm: true, haptic: true, shadows: true, qLocked: false },
    tut: 0,
    perks: {},
    season: 1,
    doubleDay: '',
    finished: false,
  };
}

// 이전 버전 -> 현재 버전
function migrate(p) {
  if (!p || typeof p !== 'object') return null;
  let v = Number(p.v) || 1;
  if (v < 2) {
    // v1: 돈이 최상위에 있었음
    p.run = p.run || newRun();
    if (typeof p.money === 'number') p.run.money = p.money;
    delete p.money;
    v = 2;
  }
  if (v < 3) {
    p.cos = p.cos || {};
    p.cos.skins = p.cos.skins || ['base'];
    p.cos.skin = p.cos.skin || 'base';
    v = 3;
  }
  if (v < 4) {
    p.perks = p.perks || {};
    p.season = p.season || 1;
    v = 4;
  }
  p.v = SAVE_VERSION;
  return p;
}

// 기본값과 병합하면서 타입이 틀린 필드는 기본값으로 교정
function sanitize(p) {
  const d = defaultProfile();
  const out = deepMerge(d, p);
  const run = out.run;
  const dr = newRun();
  for (const k of Object.keys(dr)) {
    if (typeof run[k] !== typeof dr[k] || (Array.isArray(dr[k]) && !Array.isArray(run[k]))) run[k] = dr[k];
  }
  const num = (x, def = 0) => (Number.isFinite(x) ? x : def);
  run.money = Math.max(0, num(run.money));
  run.earned = Math.max(0, num(run.earned));
  out.pearls = Math.max(0, num(out.pearls));
  out.stage = Math.max(0, Math.min(4, Math.floor(num(out.stage))));
  out.season = Math.max(1, Math.floor(num(out.season, 1)));
  if (!out.perks || typeof out.perks !== 'object') out.perks = {};
  if (!Array.isArray(run.hist) || !run.hist.length) run.hist = dr.hist;
  run.hist = run.hist.filter((x) => Number.isFinite(x)).slice(-20);
  if (!run.hist.length) run.hist = dr.hist;
  run.stack = run.stack.filter((it) => it && typeof it === 'object' && typeof it.k === 'string');
  if (!Array.isArray(out.records)) out.records = [];
  for (const k of Object.keys(out.stats)) out.stats[k] = num(out.stats[k], d.stats[k] ?? 0);
  return out;
}

function deepMerge(base, over) {
  if (Array.isArray(base)) return Array.isArray(over) ? over : base;
  if (base && typeof base === 'object') {
    const o = { ...base };
    if (over && typeof over === 'object' && !Array.isArray(over)) {
      for (const k of Object.keys(over)) {
        if (k in base) o[k] = deepMerge(base[k], over[k]);
        else o[k] = over[k];
      }
    }
    return o;
  }
  return over === undefined || typeof over !== typeof base ? base : over;
}

export function loadProfile() {
  let raw = null;
  try {
    raw = localStorage.getItem(SAVE_KEY);
  } catch {
    raw = null;
  }
  if (!raw) return { profile: defaultProfile(), fresh: true };
  try {
    const parsed = JSON.parse(raw);
    const m = migrate(parsed);
    if (!m) throw new Error('bad');
    return { profile: sanitize(m), fresh: false };
  } catch {
    // 손상된 저장: 백업 후 새로 시작
    try {
      localStorage.setItem(SAVE_KEY + '-corrupt', raw);
    } catch {
      /* 무시 */
    }
    return { profile: defaultProfile(), fresh: true, corrupt: true };
  }
}

export function writeProfile(p) {
  try {
    p.v = SAVE_VERSION;
    localStorage.setItem(SAVE_KEY, JSON.stringify(p));
    return true;
  } catch {
    return false;
  }
}

export function wipe() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    /* 무시 */
  }
}
