// localStorage 래퍼 (모든 접근 try/catch)
const KEY = 'blockJoker.v1';
const DEF = { bestAnte: 0, bestHit: 0, bestRound: 0, wins: 0, tutorialDone: false, muted: false };

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEF };
    return { ...DEF, ...JSON.parse(raw) };
  } catch {
    return { ...DEF };
  }
}

export function save(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* 무시 */ }
}
