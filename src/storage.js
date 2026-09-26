// 진행 중인 원정 저장 (지도 화면 기준 이어하기)
const RUN_KEY = 'pocketSiege.run.v1';

export function loadRun() {
  try {
    const raw = localStorage.getItem(RUN_KEY);
    if (!raw) return null;
    const r = JSON.parse(raw);
    if (!r || !Array.isArray(r.deck) || !Array.isArray(r.map)) return null;
    return r;
  } catch {
    return null;
  }
}

export function writeRun(r) {
  try {
    if (r) localStorage.setItem(RUN_KEY, JSON.stringify(r));
    else localStorage.removeItem(RUN_KEY);
  } catch {
    /* 저장 불가 */
  }
}
