// 저장 데이터: 코인, 기록, 업그레이드, 일일 미션
import { CFG } from './config.js';

const KEY = 'swarm-surfers-v1';

const defaults = () => ({
  coins: 0,
  bestDist: 0,
  bestCount: 0,
  upgrades: { start: 0, magnet: 0, shield: 0, luck: 0 },
  muted: false,
  tutorialDone: false,
  missions: null,
  runs: 0,
});

export const save = load();

function load() {
  let d = defaults();
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw);
      d = { ...d, ...p, upgrades: { ...d.upgrades, ...(p.upgrades || {}) } };
    }
  } catch (e) { /* 저장 불가 환경 */ }
  return d;
}

export function persist() {
  try { localStorage.setItem(KEY, JSON.stringify(save)); } catch (e) { /* 무시 */ }
}

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

export const startCount = () => 5 + save.upgrades.start * 3;
export const magnetTime = () => CFG.magnetBase + save.upgrades.magnet * CFG.magnetPerLvl;
export const startShieldChance = () => save.upgrades.shield * 0.1;
export const gateLuck = () => save.upgrades.luck * 0.05;

// ---------- 일일 미션 ----------
const POOL = [
  { type: 'maxCount', scope: 'run', targets: [60, 100, 150, 250], text: (t) => `한 판에 인원 ${t}명 달성`, reward: 150 },
  { type: 'dist', scope: 'run', targets: [800, 1500, 2500], text: (t) => `한 판에 ${t}m 달리기`, reward: 150 },
  { type: 'coins', scope: 'day', targets: [300, 600, 1000], text: (t) => `코인 ${t}개 모으기`, reward: 120 },
  { type: 'fortress', scope: 'day', targets: [1, 2, 3], text: (t) => `요새 ${t}개 부수기`, reward: 200 },
  { type: 'enemies', scope: 'day', targets: [80, 200, 400], text: (t) => `적 ${t}명 물리치기`, reward: 150 },
  { type: 'goodGates', scope: 'day', targets: [10, 25, 40], text: (t) => `파란 게이트 ${t}번 통과`, reward: 120 },
  { type: 'powerups', scope: 'day', targets: [3, 6, 10], text: (t) => `파워업 ${t}개 먹기`, reward: 120 },
];

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

export function ensureMissions() {
  const key = todayKey();
  if (save.missions && save.missions.date === key) return save.missions.list;
  let h = hashStr(key);
  const rnd = () => { h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0; h = Math.imul(h ^ (h >>> 13), 3266489909) >>> 0; h ^= h >>> 16; return (h >>> 0) / 4294967296; };
  const idx = POOL.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
  const list = idx.slice(0, 3).map((i) => {
    const p = POOL[i];
    const ti = Math.floor(rnd() * p.targets.length);
    return { type: p.type, target: p.targets[ti], progress: 0, done: false, reward: p.reward + ti * 50 };
  });
  save.missions = { date: key, list };
  persist();
  return list;
}

export function missionText(m) {
  const p = POOL.find((x) => x.type === m.type);
  return p ? p.text(m.target) : m.type;
}

// 런 중 값 보고. run 스코프는 최댓값, day 스코프는 누적. 완료된 미션 목록 반환
export function reportMission(type, value) {
  const list = ensureMissions();
  const done = [];
  for (const m of list) {
    if (m.type !== type || m.done) continue;
    const p = POOL.find((x) => x.type === type);
    if (p.scope === 'run') m.progress = Math.max(m.progress, value);
    else m.progress += value;
    if (m.progress >= m.target) {
      m.progress = m.target;
      m.done = true;
      save.coins += m.reward;
      done.push(m);
    }
  }
  return done;
}
