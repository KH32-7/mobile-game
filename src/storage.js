// localStorage 래퍼 (모든 접근 try/catch)
const PREFIX = 'roguePutt.';

export function load(key, def) {
  try {
    const v = localStorage.getItem(PREFIX + key);
    return v == null ? def : JSON.parse(v);
  } catch {
    return def;
  }
}

export function save(key, val) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(val));
  } catch {
    /* 저장 불가 환경 */
  }
}

// 기록: 완주 최고 (파 대비 최저), 최다 홀 클리어
export function getRecords() {
  return load('records', { bestToPar: null, bestHoles: 0, runs: 0, daily: {} });
}

export function submitRun({ mode, date, holesCleared, toPar, complete }) {
  const r = getRecords();
  r.runs = (r.runs || 0) + 1;
  let newBest = false;
  if (complete && (r.bestToPar == null || toPar < r.bestToPar)) {
    r.bestToPar = toPar;
    newBest = true;
  }
  if (holesCleared > (r.bestHoles || 0)) {
    r.bestHoles = holesCleared;
    if (!complete) newBest = true;
  }
  if (mode === 'daily') {
    r.daily = r.daily || {};
    const prev = r.daily[date];
    const better = !prev || holesCleared > prev.holes || (holesCleared === prev.holes && toPar < prev.toPar);
    if (better) r.daily[date] = { holes: holesCleared, toPar };
    // 오래된 데일리 정리
    const keys = Object.keys(r.daily).sort();
    while (keys.length > 14) delete r.daily[keys.shift()];
  }
  save('records', r);
  return { records: r, newBest };
}

export function fmtToPar(n) {
  if (n == null) return '-';
  return n === 0 ? 'E' : n > 0 ? '+' + n : String(n);
}
