// 밸런스 수치 모음
const params = new URLSearchParams(typeof location !== 'undefined' ? location.search : '');

export const DEBUG = params.has('debug');
export const SEED_PARAM = params.get('seed');

export const CONFIG = {
  BOARD: 8,
  TRAY_SIZE: 3,
  HANDS: 6, // 라운드당 받을 수 있는 트레이 수

  // 점수
  PLACE_PTS_PER_CELL: 1, // 배치만 해도 받는 점수
  CHIP_PER_CELL: 5,
  CHIP_PER_LINE: 10,
  COMBO_GRACE: 4,
  COMBO_MULT: 1, // 콤보 1당 배수 // 줄을 못 지운 배치가 이 횟수에 도달하면 콤보 끊김

  // 보석
  GEM_PIECE_CHANCE: 0.13, // 조각 하나에 보석이 박힐 확률
  GEM_WEIGHTS: { gold: 40, ruby: 30, glass: 15, steel: 15 },
  GEM_GOLD_CHIPS: 25,
  GEM_RUBY_MULT: 3,
  GEM_GLASS_XMULT: 1.5,
  GEM_GLASS_BREAK: 0.25,
  GEM_STEEL_XMULT: 1.2,

  // 목표 점수 (Balatro 곡선 참고)
  ANTE_BASE: [370, 1200, 2650, 4500, 7200, 10700, 15500, 22000],
  ENDLESS_GROWTH: 1.9,
  BLIND_MULT: [1, 1.5, 2],
  BLIND_NAMES: ['스몰 블라인드', '빅 블라인드'],
  FINAL_ANTE: 8,

  // 경제
  START_COINS: 4,
  BLIND_REWARD: [3, 4, 5],
  COIN_PER_HAND: 1,
  INTEREST_STEP: 5,
  INTEREST_MAX: 5,
  REROLL_BASE: 5,
  JOKER_SLOTS: 5,
  SHOP_SIZE: 3,
  PRICE: { common: 4, uncommon: 6, rare: 8 },
  RARITY_WEIGHT: { common: 60, uncommon: 30, rare: 10 },

  // 조각 생성 보정: 놓을 수 있는 조각이 하나도 없을 때 교체할 확률
  PLACEABLE_ASSIST: 0.85,
  SWAPS: 2, // 라운드당 트레이 교체
  RESCUE_PER_ANTE: 5, // 막힘 구제 비용: 앤티 x $5 또는 보유 코인 40% 중 큰 값
  PLANET_BASE: 3, // 줄 강화 카드 가격 = 3 + 현재 레벨
  LATE_SHOP_ANTE: 4, // 희귀 확정 슬롯, 에디션 부여 상시
  AXIS_WEIGHT: 1.6, // 빌드 축 조커 상점 가중치
  SYNERGY_WEIGHT: 3.5, // 보유 조커와 같은 축이면

  DEBUG_TARGET_SCALE: 0.06,
  DEBUG_BONUS_COINS: 10,
};

export function targetFor(ante, blind, mult = 1) {
  let base;
  if (ante <= CONFIG.ANTE_BASE.length) base = CONFIG.ANTE_BASE[ante - 1];
  else base = CONFIG.ANTE_BASE[CONFIG.ANTE_BASE.length - 1] * Math.pow(CONFIG.ENDLESS_GROWTH, ante - CONFIG.ANTE_BASE.length);
  let t = base * CONFIG.BLIND_MULT[blind] * mult;
  if (DEBUG && params.get('debug') !== 'hard') t *= CONFIG.DEBUG_TARGET_SCALE;
  if (DEBUG && params.get('debug') === 'hard') t *= 100;
  t = Math.max(10, t);
  // 보기 좋은 숫자로 반올림
  const mag = t >= 10000 ? 1000 : t >= 1000 ? 100 : 10;
  return Math.round(t / mag) * mag;
}

export const COLORS = [
  { base: '#ff4d6d', light: '#ffb3c1', dark: '#9d0a2b' }, // 루비 레드
  { base: '#ffb627', light: '#ffe29a', dark: '#a3620a' }, // 앰버
  { base: '#3ddc97', light: '#b5f5d6', dark: '#107a50' }, // 에메랄드
  { base: '#36c9ff', light: '#b3ecff', dark: '#0a6690' }, // 아쿠아
  { base: '#8f6bff', light: '#d6c9ff', dark: '#452199' }, // 자수정
  { base: '#ff6bd6', light: '#ffc9f0', dark: '#94197a' }, // 핑크
  { base: '#ff8a3d', light: '#ffd0ad', dark: '#a3450a' }, // 오렌지
];

export const STONE_COLOR = { base: '#5d5670', light: '#8e87a3', dark: '#2b2638' };
