// 줄 종류(핸드), 줄 강화 카드(행성), 보석 부여 카드(타로), 부스터 팩, 바우처

// 줄 종류: 기본 칩/배수 + 레벨당 증가량
export const HANDS = {
  row: { name: '가로줄', c: 10, m: 1, lc: 10, lm: 1 },
  col: { name: '세로줄', c: 10, m: 1, lc: 10, lm: 1 },
  double: { name: '더블', c: 25, m: 1.5, lc: 15, lm: 1 },
  multi: { name: '멀티', c: 40, m: 2, lc: 20, lm: 1.5 },
  cross: { name: '십자', c: 35, m: 2, lc: 20, lm: 1.5 },
};
export const HAND_KEYS = Object.keys(HANDS);

export function handType(rows, cols) {
  if (rows > 0 && cols > 0) return 'cross';
  const n = rows + cols;
  if (n >= 3) return 'multi';
  if (n === 2) return 'double';
  return rows ? 'row' : 'col';
}

export const PLANETS = [
  { id: 'p_row', hand: 'row', name: '수성', color: '#9fd8ff' },
  { id: 'p_col', hand: 'col', name: '금성', color: '#ffd29f' },
  { id: 'p_double', hand: 'double', name: '화성', color: '#ff7f6b' },
  { id: 'p_multi', hand: 'multi', name: '목성', color: '#ffb86b' },
  { id: 'p_cross', hand: 'cross', name: '토성', color: '#e6d27a' },
];

export const GEM_CARDS = [
  { id: 't_gold', gem: 'gold', name: '금 세공', desc: '다음 트레이 조각 3개에 금 보석(+칩)', color: '#ffd23f' },
  { id: 't_ruby', gem: 'ruby', name: '루비 세공', desc: '다음 트레이 조각 3개에 루비(+배수)', color: '#ff2e63' },
  { id: 't_glass', gem: 'glass', name: '유리 세공', desc: '다음 트레이 조각 3개에 유리(x1.5 배수)', color: '#9ff0ff' },
  { id: 't_steel', gem: 'steel', name: '강철 세공', desc: '다음 트레이 조각 3개에 강철(보드에 있는 동안 x1.2)', color: '#b8c2d6' },
];

export const PACKS = [
  { id: 'pk_joker', kind: 'joker', name: '조커 팩', desc: '조커 3장 중 1장 선택', price: 5, color: '#8f6bff' },
  { id: 'pk_planet', kind: 'planet', name: '천체 팩', desc: '줄 강화 카드 3장 중 1장 선택', price: 4, color: '#36c9ff' },
  { id: 'pk_gem', kind: 'gem', name: '보석 팩', desc: '보석 부여 카드 3장 중 1장 선택', price: 4, color: '#ff4d6d' },
];

export const VOUCHERS = [
  { id: 'v_tray', name: '여분 트레이', desc: '라운드마다 트레이 +1' },
  { id: 'v_slot', name: '넓은 테이블', desc: '조커 슬롯 +1' },
  { id: 'v_coupon', name: '할인 쿠폰', desc: '리롤 비용 -$2, 모든 카드 -$1' },
  { id: 'v_wholesale', name: '도매상', desc: '상점 조커 진열 +1' },
  { id: 'v_gemrain', name: '보석비', desc: '보석 박힌 조각 확률 +12%' },
  { id: 'v_vault', name: '금고 열쇠', desc: '이자 상한 +$5' },
  { id: 'v_grip', name: '콤보 그립', desc: '콤보 유예 +1 배치' },
  { id: 'v_telescope', name: '망원경', desc: '줄 강화 카드가 레벨을 2씩 올림' },
  { id: 'v_swap', name: '재활용 센터', desc: '라운드마다 트레이 교체 +1' },
];
export const VOUCHER_BY_ID = Object.fromEntries(VOUCHERS.map((v) => [v.id, v]));
export const PLANET_BY_ID = Object.fromEntries(PLANETS.map((p) => [p.id, p]));
export const GEM_CARD_BY_ID = Object.fromEntries(GEM_CARDS.map((p) => [p.id, p]));
export const PACK_BY_ID = Object.fromEntries(PACKS.map((p) => [p.id, p]));
