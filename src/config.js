// 밸런스 수치 모음
export const CFG = {
  // 트랙
  laneW: 2.2,
  trackHalfW: 3.6,
  sectionLen: 1000,
  spawnAhead: 150,
  despawnBehind: 40,

  // 속도 (m/s)
  baseSpeed: 13,
  speedPerSection: 1.7,
  speedInSection: 1.6,
  maxSpeed: 26,

  // 리더 레인 이동 스프링
  leaderK: 260,
  leaderDamp: 30,

  // 점프/슬라이드
  jumpV: 7.4,
  gravity: 23,
  bootsJumpV: 12.5,
  bootsGravity: 13,
  slideTime: 0.8,
  maxWaveDelay: 0.7,

  // 멤버 몸체/충돌
  memberR: 0.2,
  standH: 0.78,
  slideH: 0.32,

  // 무리 대형
  spacing: 0.27,
  maxHalfW: 1.9,
  slideHalfW: 0.72,
  memberK: 38,
  memberDamp: 7.5,
  maxRender: 200,
  maxCount: 99999,

  // 적
  enemyRender: 90,
  battleSpeed: 0.12,
  battleRateBase: 26,
  battleRateScale: 0.9,

  // 요새: 체력 = 기본 + 진입 인원 비율, 상한은 진입 인원 비율
  fortHpBase: 8,
  fortHpPerSec: 10,
  fortHpFrac: 0.3,
  fortHpFracPerSec: 0.06,
  fortHpCap: 0.85,
  fortHpCapPerSec: 0.06,
  stairMults: [1.2, 1.5, 2, 3, 4, 5],
  stairStepLen: 2.6,
  stairStepH: 0.42,
  stairThr0: 6,
  stairThrPerSec: 5,
  stairThrGrow: 1.55,
  stairCoinBase: 25,
  stairCoinPerSec: 15,
  crowdBonusPerSec: 10,
  fortressRate: 22,
  fortressRateScale: 0.12,

  // 장애물 1개가 지울 수 있는 최대 인원
  obstacleCapFrac: 0.25,
  obstacleCapMin: 3,
  trainCapFrac: 0.5,
  growCapBase: 120,
  growCapPerSec: 90,
  jumpBuffer: 0.18,
  gateSnapTime: 0.2,

  // 파워업 (초)
  magnetBase: 7,
  magnetPerLvl: 1.5,
  magnetRadius: 7,
  bootsTime: 9,
  recruitTime: 6,
  recruitRadius: 8,
  powerupWeights: { magnet: 3, shield: 2, boots: 2, recruit: 2 },

  // 업그레이드
  upgrades: {
    start:  { name: '시작 인원',   max: 10, baseCost: 120, mult: 1.55, desc: (l) => `시작 ${12 + l * 3}명` },
    magnet: { name: '자석 지속',   max: 8,  baseCost: 100, mult: 1.6,  desc: (l) => `${(7 + l * 1.5).toFixed(1)}초` },
    shield: { name: '방패 확률',   max: 8,  baseCost: 140, mult: 1.6,  desc: (l) => `시작 방패 ${l * 10}%` },
    luck:   { name: '게이트 행운', max: 8,  baseCost: 150, mult: 1.65, desc: (l) => `좋은 게이트 +${l * 5}%` },
  },
};

export const THEMES = [
  { name: '도시', sky: 0x8fd3ff, fog: 0xa8dcff, ground: 0x6fbf5a, track: '#5b6475', stripe: '#e8eef7', edge: '#ffcf3a',
    hemiSky: 0xffffff, hemiGround: 0x6a8fb0, sun: 0xfff2dd, buildings: [0x4d8cf0, 0xf06a8a, 0xffc94d, 0x7ad18c, 0xb58cf0, 0xf0f0f0], prop: 0x3fa34d, propShape: 'tree' },
  { name: '사막', sky: 0xffcf8a, fog: 0xf7c58a, ground: 0xe8b56a, track: '#a0714a', stripe: '#fff3dc', edge: '#ff7b3a',
    hemiSky: 0xfff0d0, hemiGround: 0xc27a3a, sun: 0xffe0b0, buildings: [0xd9894a, 0xc26a3a, 0xf0b070, 0xe8c090, 0xb85a30], prop: 0x4f9a3a, propShape: 'cactus' },
  { name: '설원', sky: 0x7fb4e8, fog: 0xb4cde8, ground: 0xf2f6ff, track: '#56688a', stripe: '#ffffff', edge: '#ff5a6a',
    hemiSky: 0xffffff, hemiGround: 0x7f98c0, sun: 0xfff4e8, buildings: [0xd8404a, 0x2a4a8a, 0x1f8f9a, 0x6a3a9a, 0xe8872a, 0x3a6ad0], prop: 0x1f5a3f, propShape: 'pine', snow: true },
  { name: '네온', sky: 0x2a1a55, fog: 0x3a2270, ground: 0x2a2250, track: '#2c2448', stripe: '#ff5ce1', edge: '#39f0ff',
    hemiSky: 0xb0a0ff, hemiGround: 0x40206a, sun: 0xffc0ff, buildings: [0xff4fd8, 0x4ff0ff, 0x8f5cff, 0xffe04f, 0x4fff9a], prop: 0xff4fd8, propShape: 'pine' },
  { name: '정글', sky: 0x9fe8b0, fog: 0xa8e0a0, ground: 0x3f9a3a, track: '#6b5a44', stripe: '#f5f0c8', edge: '#ffd23a',
    hemiSky: 0xf0fff0, hemiGround: 0x2f6a2a, sun: 0xfff6c8, buildings: [0x5aa84a, 0x8a6a3a, 0x3f7a3a, 0xa8c85a, 0x6a8a3a], prop: 0x2f8a2a, propShape: 'tree' },
];

export const COLORS = {
  member: 0x3aa8ff,
  memberAlt: 0x52c0ff,
  leader: 0xffc83a,
  enemy: 0xff4a4a,
  enemyAlt: 0xe83838,
  coin: 0xffd23a,
  good: 0x2a8cff,
  bad: 0xff3b4f,
};

// 리더 스킨 컬렉션 (보석으로 해금, 작은 패시브 보너스)
export const SKINS = [
  { id: 'basic', name: '젤리', cost: 0, leader: 0xffc83a, crew: [0x3aa8ff, 0x52c0ff], hat: 'none', bonus: '기본 캐릭터', perk: {} },
  { id: 'mint', name: '새싹 젤리', cost: 2, leader: 0x7affb8, crew: [0x2ac890, 0x5ae0b0], hat: 'leaf', bonus: '코인 +10%', perk: { coin: 0.1 } },
  { id: 'bear', name: '곰 젤리', cost: 5, leader: 0xc88a5a, crew: [0xa8703f, 0xd09a6a], hat: 'ears', bonus: '시작 인원 +4', perk: { start: 4 } },
  { id: 'bunny', name: '토끼 젤리', cost: 8, leader: 0xfff4fa, crew: [0xff9ac8, 0xffbadc], hat: 'bunny', bonus: '슈퍼점프 +3초', perk: { boots: 3 } },
  { id: 'knight', name: '기사 젤리', cost: 10, leader: 0xc0c8d8, crew: [0x5a6ab0, 0x7a8ad0], hat: 'helmet', bonus: '시작 방패 +25%', perk: { shield: 0.25 } },
  { id: 'devil', name: '자석 젤리', cost: 12, leader: 0xff5a6a, crew: [0xff7a5a, 0xff9a7a], hat: 'horn', bonus: '자석 +3초', perk: { magnet: 3 } },
  { id: 'lucky', name: '행운 젤리', cost: 15, leader: 0x9aff5a, crew: [0x3ad06a, 0x6ae88a], hat: 'leaf', bonus: '좋은 게이트 +8%', perk: { luck: 0.08 } },
  { id: 'ninja', name: '닌자 젤리', cost: 18, leader: 0x3a3a50, crew: [0x5a5a7a, 0x7a7a9a], hat: 'band', bonus: '확성기 +3초', perk: { recruit: 3 } },
  { id: 'king', name: '왕 젤리', cost: 25, leader: 0xffd84a, crew: [0x8a5aff, 0xa87aff], hat: 'crown', bonus: '요새 보상 +30%', perk: { fort: 0.3 } },
];

export const REVIVE_COSTS = [1, 2, 4, 8];
