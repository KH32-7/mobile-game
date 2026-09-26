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

export function fmtToPar(n) {
  if (n == null) return '-';
  return n === 0 ? 'E' : n > 0 ? '+' + n : String(n);
}
