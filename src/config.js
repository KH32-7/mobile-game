// 밸런스/물리 수치 모음 (모든 튜닝 값은 여기서)
export const T = 32; // 타일 크기 (월드 단위)
export const COLS = 12;

export const PHYS = {
  ballR: 6.5,
  maxShotSpeed: 960, // 최대 파워 발사 속도
  maxDragPx: 150, // 최대 파워에 필요한 드래그 거리(화면 px)
  cancelPx: 16, // 이 거리 이내로 되돌리면 취소
  wallE: 0.72, // 벽 반발 계수
  wallTangent: 0.97, // 벽 접선 방향 감쇠
  bumperE: 1.18,
  bumperKick: 170,
  crateE: 0.45,
  crateBreakSpeed: 150,
  millE: 0.8,
  cupR: 10.5,
  cupPullR: 1.5, // cupR 배수
  cupPull: 380,
  captureSpeed: 215,
  lipSlow: 0.72,
  slopeAccel: 260,
  stopSpeed: 9,
  stopTime: 0.3,
  maxRollTime: 10,
  teleR: 11,
  coinR: 12,
  gimmeR: 52, // 이 거리 안에 멈추면 컨시드 (+1타로 홀아웃)
  maxSubMove: 3, // 서브스텝당 최대 이동 거리 (터널링 방지)
};

// 지면별 마찰: a = 선형 감속, k = 속도 비례 감속
export const SURF = {
  1: { a: 140, k: 0.9 }, // 잔디
  2: { a: 700, k: 3.2 }, // 모래
  3: { a: 140, k: 0.9 }, // 물 (스침용)
  4: { a: 12, k: 0.12 }, // 얼음
  5: { a: 110, k: 0.8 }, // 경사 (잔디 기반)
};

export const RUN = {
  holes: 18,
  startHearts: 5,
  maxHearts: 6,
  bossHoles: [5, 11, 17], // 0-index (6, 12, 18번 홀)
  shopAfter: [3, 8, 13], // 0-index, 이 홀 다음 상점
  coinBirdie: 2,
  coinEagle: 4,
  coinAce: 6,
  coinPar: 0,
  birdieHealChance: 0.25,
  skipCoins: 2,
  shopHeartPrice: 6,
  relicPriceMin: 6,
  relicPriceMax: 12,
  timeLimit: 60,
};

export const SCORE_TEXT = {
  ace: 'HOLE IN ONE!',
  '-3': 'ALBATROSS!',
  '-2': 'EAGLE!',
  '-1': 'BIRDIE',
  '0': 'PAR',
  '1': 'BOGEY',
  '2': 'DOUBLE BOGEY',
};
