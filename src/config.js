// 밸런스 수치 모음
export const CFG = {
  map: { half: 96, pitch: 32, roadW: 8, blockHalf: 12, groundHalf: 104 },

  hole: {
    startR: 1.0,
    speed: 7.0, // 기본 이동 속도 (유닛/초)
    speedPerR: 0.55, // 반지름 1 증가당 추가 속도
    accel: 10,
    decel: 4.2,
    hp: 100,
    iframe: 0.9,
    growthK: 0.2, // r^2 += growthK * size^2
    enemyGrowthK: 0.16,
    fit: 0.94, // size < r * fit 이면 삼킬 수 있음
    visualLerp: 3.2,
    maxR: 16,
  },

  cam: { fov: 42, tilt: 55, dist: 13, distPerR: 4.4, lerp: 2.6 },

  run: { length: 300, miniAt: 150, bossAt: 300 },

  // 레벨 L -> L+1 필요 XP
  xpNeed: (lvl) => Math.floor(8 + lvl * 6 + Math.pow(lvl, 1.85)),
  // 오브젝트 XP
  propXp: (size) => 1 + size * size * 1.6,

  sizeTiers: [1.5, 2, 2.6, 3.3, 4.2, 5.2, 6.5, 8, 10, 12.5, 15],

  combo: { window: 1.4 },

  spawn: {
    baseRate: 0.9, // 초당
    rateGrow: 3.4, // 5분 동안 추가
    maxAlive: 150,
    sizeGrow: 2.3, // 5분 동안 크기 배율 추가
    hpGrow: 3.2,
    swarmEvery: 32,
  },

  coins: { perSec: 0.25, perKill: 0.35, perSwallow: 0.06, clear: 150 },
};

// 적 정의 (size = 바닥 반지름)
export const ENEMY_DEFS = {
  sweeper: { name: '청소봇', size: 0.75, hp: 8, speed: 3.3, dmg: 8, xp: 3, cap: 160 },
  dasher: { name: '돌진봇', size: 1.05, hp: 16, speed: 2.6, dmg: 12, xp: 6, cap: 60, dashSpeed: 15 },
  thrower: { name: '투척봇', size: 1.15, hp: 14, speed: 2.4, dmg: 10, xp: 7, cap: 50, range: 13 },
  giant: { name: '거대 청소기', size: 2.5, hp: 80, speed: 1.5, dmg: 18, xp: 26, cap: 24 },
  mini: { name: '청소 트럭 대장', size: 5.0, hp: 1100, speed: 2.1, dmg: 22, xp: 160, cap: 2, dashSpeed: 12 },
  boss: { name: '거대 청소 메카', size: 11, hp: 5200, speed: 1.7, dmg: 28, xp: 600, cap: 1 },
};

// 영구 업그레이드
export const UPGRADES = [
  { id: 'size', name: '시작 크기', desc: (l) => `시작 반지름 +${l * 8}%`, max: 5, cost: [40, 90, 160, 260, 400] },
  { id: 'hp', name: '최대 HP', desc: (l) => `최대 HP +${l * 15}`, max: 5, cost: [30, 70, 130, 210, 320] },
  { id: 'speed', name: '이동 속도', desc: (l) => `이동 속도 +${l * 6}%`, max: 5, cost: [35, 80, 140, 230, 350] },
  { id: 'xp', name: 'XP 획득', desc: (l) => `XP 획득 +${l * 10}%`, max: 5, cost: [45, 100, 180, 290, 440] },
];

// 스킬 정의
export const SKILLS = {
  orbit: {
    name: '파편 위성',
    color: '#9fd8ff',
    desc: (l) => `삼킨 파편 ${l + 1}개가 홀 주위를 돌며 적을 타격 (피해 ${8 + l * 4})`,
  },
  cannon: {
    name: '역류 캐논',
    color: '#ffb36b',
    desc: (l) => `삼킨 잔해를 가장 가까운 적에게 발사 (${Math.min(3, 1 + Math.floor(l / 2))}발, 피해 ${10 + l * 6})`,
  },
  pulse: {
    name: '중력 펄스',
    color: '#c79bff',
    desc: (l) => `${(5.4 - l * 0.5).toFixed(1)}초마다 충격파로 적을 밀치고 작은 물체를 끌어당김`,
  },
  horizon: {
    name: '사건의 지평선',
    color: '#8a7dff',
    desc: (l) => `흡입 범위 +${l * 22}%, 가까운 작은 물체가 빨려옴`,
  },
  glutton: {
    name: '폭식',
    color: '#ff7aa8',
    desc: (l) => `성장률 +${l * 18}%, XP +${l * 5}%`,
  },
  haste: {
    name: '가속',
    color: '#7dffc4',
    desc: (l) => `이동 속도 +${l * 10}%`,
  },
  regen: {
    name: '재생',
    color: '#8dff7a',
    desc: (l) => `초당 HP ${(l * 0.7).toFixed(1)} 회복, 최대 HP +${l * 10}`,
  },
  bolt: {
    name: '블랙 번개',
    color: '#b8f0ff',
    desc: (l) => `연쇄 번개가 적 ${2 + l}명을 감전 (피해 ${10 + l * 5})`,
  },
  dash: {
    name: '웜홀 대시',
    color: '#ff9bf2',
    desc: (l) => `${(6.5 - l * 0.6).toFixed(1)}초마다 이동 방향으로 순간이동, 도착 지점 충격 피해`,
  },
  nova: {
    name: '초신성',
    color: '#ffe066',
    desc: (l) => `${20 - l * 2}초마다 거대한 폭발 (피해 ${40 + l * 35})`,
  },
  saw: {
    name: '톱니 테두리',
    color: '#ff6b6b',
    desc: (l) => `홀 테두리에 닿은 큰 적에게 지속 피해 (${10 + l * 7}/0.4초)`,
  },
  greed: {
    name: '탐욕',
    color: '#ffd24a',
    desc: (l) => `XP +${l * 12}%, 코인 +${l * 10}%`,
  },
};

// 진화 스킬: 두 스킬 조합
export const EVOLUTIONS = {
  accretion: {
    name: '강착 원반',
    color: '#c6b8ff',
    from: ['orbit', 'horizon'],
    need: { orbit: 5, horizon: 2 },
    desc: () => '파편 위성 진화: 파편 10개가 넓게 돌며 2.5배 피해, 작은 적을 끌어당김',
  },
  singularity: {
    name: '특이점 포',
    color: '#ff9f6b',
    from: ['cannon', 'glutton'],
    need: { cannon: 5, glutton: 2 },
    desc: () => '역류 캐논 진화: 탄환이 작은 블랙홀이 되어 적을 빨아들이고 폭발',
  },
};

export const SKILL_MAX = 5;
