// 밸런스 수치 모음
export const CFG = {
  map: { half: 96, pitch: 32, roadW: 8, blockHalf: 12, groundHalf: 104 },

  hole: {
    startR: 1.0,
    speed: 7.0, // 기본 이동 속도 (유닛/초)
    speedPerR: 0.55, // 반지름 1 증가당 추가 속도
    accel: 10,
    decel: 4.2,
    hp: 120,
    iframe: 1.2,
    iframeLow: 1.8,
    growthK: 0.15, // r^2 += growthK * size^2 * growthFalloff(r)
    enemyGrowthK: 0.07,
    fit: 0.94, // size < r * fit 이면 삼킬 수 있음
    visualLerp: 3.2,
    maxR: 16,
  },

  // 화면 가로 폭(월드 유닛) = baseW + r * wPerR, 세로 화면 aspect 에 맞춰 거리 자동 계산
  cam: { fov: 50, tilt: 66, baseW: 13, wPerR: 5.2, lerp: 2.6 },

  run: { length: 300, miniAt: 150, bossAt: 300, lateAt: 240 },

  // 레벨 L -> L+1 필요 XP
  xpNeed: (lvl) => Math.floor(8 + lvl * 6 + Math.pow(lvl, 1.95)),
  // 홀이 클수록 같은 물체의 성장/XP 효율 감소 (후반 폭주 방지)
  growthFalloff: (r) => 1 / (1 + 0.085 * r * r),
  growthFalloffLate: (r) => 1 / (1 + 0.025 * r * r),
  xpFalloff: (r) => 1 / (1 + 0.05 * r * r),
  // 오브젝트 XP
  propXp: (size) => 1 + size * size * 1.6,

  sizeTiers: [1.5, 2, 2.6, 3.3, 4.2, 5.2, 6.5, 8, 10, 12.5, 15],

  combo: { window: 1.4 },

  spawn: {
    baseRate: 1.5, // 초당
    rateGrow: 4.5, // 5분 동안 추가
    maxAlive: 120,
    sizeGrow: 3.2, // 5분 동안 크기 배율 추가
    hpGrow: 2.6,
    swarmEvery: 32,
  },

  coins: { perSec: 0.38, perKill: 0.5, perSwallow: 0.09, clear: 220 },
};

// 적 정의 (size = 바닥 반지름)
export const ENEMY_DEFS = {
  sweeper: { name: '청소봇', size: 0.75, hp: 8, speed: 3.3, dmg: 8, xp: 3, cap: 160 },
  dasher: { name: '돌진봇', size: 1.05, hp: 16, speed: 2.6, dmg: 12, xp: 6, cap: 60, dashSpeed: 15 },
  thrower: { name: '투척봇', size: 1.15, hp: 14, speed: 2.4, dmg: 5, xp: 7, cap: 50, range: 13 },
  giant: { name: '거대 청소기', size: 2.5, hp: 80, speed: 1.5, dmg: 14, xp: 26, cap: 24 },
  mini: { name: '청소 트럭 대장', size: 5.0, hp: 450, speed: 2.1, dmg: 16, xp: 160, cap: 2, dashSpeed: 12 },
  boss: { name: '거대 청소 메카', size: 11, hp: 2600, speed: 1.7, dmg: 28, xp: 600, cap: 1 },
};

// 영구 업그레이드 트리 (tier 2 는 tier 1 합계 레벨, tier 3 은 tier 2 합계 레벨 필요)
const costs = (base, n, g = 1.38) => Array.from({ length: n }, (_, i) => Math.round((base * Math.pow(g, i)) / 5) * 5);
export const UPGRADES = [
  { id: 'hp', tier: 1, name: '최대 HP', desc: (l) => `최대 HP +${l * 15}`, max: 10, cost: costs(40, 10) },
  { id: 'armor', tier: 1, name: '중력 장갑', desc: (l) => `받는 피해 -${l * 4}%`, max: 10, cost: costs(50, 10) },
  { id: 'size', tier: 1, name: '시작 크기', desc: (l) => `시작 반지름 +${l * 5}%`, max: 10, cost: costs(55, 10) },
  { id: 'speed', tier: 2, name: '이동 속도', desc: (l) => `이동 속도 +${l * 4}%`, max: 10, cost: costs(90, 10) },
  { id: 'xp', tier: 2, name: 'XP 획득', desc: (l) => `XP 획득 +${l * 6}%`, max: 10, cost: costs(100, 10) },
  { id: 'power', tier: 2, name: '스킬 위력', desc: (l) => `스킬 피해 +${l * 6}%`, max: 10, cost: costs(110, 10) },
  { id: 'coin', tier: 3, name: '코인 획득', desc: (l) => `코인 획득 +${l * 8}%`, max: 10, cost: costs(160, 10) },
  { id: 'reroll', tier: 3, name: '카드 재추첨', desc: (l) => `판마다 카드 다시 뽑기 ${l}회`, max: 3, cost: [300, 650, 1100] },
  { id: 'revive', tier: 3, name: '재탄생', desc: () => '판마다 1회 HP 50%로 부활', max: 1, cost: [1400] },
];
export const TIER_REQ = { 1: 0, 2: 10, 3: 12 };

// 맵 (테마)
export const MAPS = {
  city: {
    name: '파스텔 시티',
    sub: '도로와 공원, 자동차가 가득한 도심',
    art: 'linear-gradient(160deg,#cfe8ff 0%,#c3e8b0 55%,#9d98b8 56%,#9d98b8 70%,#f1e8da 71%)',
    unlock: null,
    sky: '#cfe8ff',
    enemyTint: '#ffffff',
    bossTint: '#ffffff',
    bossName: '거대 청소 메카',
    miniName: '청소 트럭 대장',
    weights: { dasher: 1, thrower: 1, giant: 1 },
  },
  beach: {
    name: '선샤인 비치',
    sub: '파라솔과 보트, 모래성이 있는 해변',
    art: 'linear-gradient(160deg,#bff0ff 0%,#7fd3ff 35%,#f7e3b5 36%,#f7e3b5 70%,#d9b48a 71%)',
    unlock: { map: 'city', diff: 1 },
    sky: '#c4f1ff',
    enemyTint: '#fff4d8',
    bossTint: '#a8ecff',
    bossName: '해변 정화 메카',
    miniName: '모래 청소 트럭',
    weights: { dasher: 0.8, thrower: 1.7, giant: 0.9 },
  },
  factory: {
    name: '러스티 팩토리',
    sub: '컨테이너와 공장 굴뚝의 산업 지대',
    art: 'linear-gradient(160deg,#f4e2cf 0%,#d9d4cc 50%,#8f8a94 51%,#8f8a94 62%,#ffd23f 63%,#ffd23f 65%,#d9d4cc 66%)',
    unlock: { map: 'beach', diff: 1 },
    sky: '#f6e4d2',
    enemyTint: '#ffe6d0',
    bossTint: '#ffb080',
    bossName: '산업 분쇄 메카',
    miniName: '녹슨 지게차 대장',
    weights: { dasher: 1.6, thrower: 0.8, giant: 1.5 },
  },
};
export const MAP_ORDER = ['city', 'beach', 'factory'];
export const MAX_DIFF = 5;
export const diffMul = (d) => ({
  hp: 1 + (d - 1) * 0.45,
  dmg: 1 + (d - 1) * 0.22,
  rate: 1 + (d - 1) * 0.18,
  coin: 1 + (d - 1) * 0.35,
});

// 홀 스킨
export const SKINS = {
  void: { name: '보이드', rim: '#a861ff', well: '#5c2994', swirl: '#5a26a0', how: '기본 스킨', cost: 0 },
  neon: { name: '네온 시안', rim: '#3ff0ff', well: '#0f5a7a', swirl: '#1f8fb0', how: '코인 300', cost: 300 },
  sakura: { name: '벚꽃', rim: '#ff8fc8', well: '#8a2f64', swirl: '#c04a8a', how: '코인 500', cost: 500 },
  lava: { name: '용암', rim: '#ff7a2f', well: '#7a1f0a', swirl: '#c8401a', how: '업적: 시티 메카 격파', ach: 'boss_city' },
  toxic: { name: '독성', rim: '#8dff4a', well: '#2c5a12', swirl: '#4f9a1f', how: '업적: 누적 처치 1000', ach: 'kill_1000' },
  gold: { name: '황금', rim: '#ffd24a', well: '#7a5a0a', swirl: '#c89a1a', how: '7일 연속 출석', ach: 'streak_7' },
  galaxy: { name: '은하', rim: '#ffffff', well: '#1a1060', swirl: '#4a3ac0', how: '업적: 난이도 5 클리어', ach: 'diff_5', rainbow: true },
};

// 스킬 해금 (처음엔 일부만)
export const START_SKILLS = ['orbit', 'cannon', 'pulse', 'horizon', 'glutton', 'haste', 'regen'];
export const SKILL_COST = { bolt: 120, saw: 160, dash: 220, greed: 260, nova: 380 };

// 업적
export const ACHIEVEMENTS = [
  { id: 'first_bite', name: '첫 한 입', desc: '처음으로 무언가 삼키기', reward: 10, test: (s) => s.swallowed >= 1 },
  { id: 'swallow_500', name: '먹보', desc: '누적 2,000개 삼키기', reward: 60, test: (s) => s.swallowed >= 2000 },
  { id: 'swallow_5000', name: '도시 청소부', desc: '누적 5,000개 삼키기', reward: 150, test: (s) => s.swallowed >= 5000 },
  { id: 'swallow_20000', name: '우주의 위장', desc: '누적 20,000개 삼키기', reward: 400, test: (s) => s.swallowed >= 20000 },
  { id: 'kill_100', name: '로봇 사냥꾼', desc: '누적 처치 400', reward: 50, test: (s) => s.kills >= 400 },
  { id: 'kill_1000', name: '고철 수집가', desc: '누적 처치 1,000', reward: 200, test: (s) => s.kills >= 1000 },
  { id: 'survive_3', name: '버티기 성공', desc: '한 판에서 3분 생존', reward: 60, test: (s) => s.bestTime >= 180 },
  { id: 'survive_5', name: '끈기', desc: '누적 플레이 30분', reward: 100, test: (s) => s.playTime >= 1800 },
  { id: 'mini_kill', name: '트럭 제압', desc: '미니보스 처치', reward: 80, test: (s) => s.miniKills >= 1 },
  { id: 'boss_city', name: '시티 해방', desc: '파스텔 시티 메카 삼키기', reward: 200, test: (s, m) => m.city.clear >= 1 },
  { id: 'boss_beach', name: '해변 해방', desc: '선샤인 비치 메카 삼키기', reward: 250, test: (s, m) => m.beach.clear >= 1 },
  { id: 'boss_factory', name: '공장 해방', desc: '러스티 팩토리 메카 삼키기', reward: 300, test: (s, m) => m.factory.clear >= 1 },
  { id: 'size_10', name: '거대 구멍', desc: '지름 24m 달성', reward: 60, test: (s) => s.maxSize >= 24 },
  { id: 'size_20', name: '싱크홀', desc: '지름 30m 달성', reward: 150, test: (s) => s.maxSize >= 30 },
  { id: 'combo_30', name: '폭풍 흡입', desc: '콤보 x80 달성', reward: 80, test: (s) => s.maxCombo >= 80 },
  { id: 'level_15', name: '성장 가속', desc: '한 판에서 Lv 25 도달', reward: 80, test: (s) => s.maxLevel >= 25 },
  { id: 'evolve', name: '진화', desc: '스킬 진화 달성', reward: 100, test: (s) => s.evolutions >= 1 },
  { id: 'streak_7', name: '개근상', desc: '7일 연속 출석', reward: 200, test: (s) => s.bestStreak >= 7 },
  { id: 'daily_clear', name: '오늘의 도전자', desc: '데일리 챌린지 완료', reward: 100, test: (s) => s.dailyClears >= 1 },
  { id: 'upg_20', name: '연구 투자', desc: '영구 강화 합계 20레벨', reward: 150, test: (s) => s.upgLevels >= 20 },
  { id: 'diff_5', name: '공허의 지배자', desc: '아무 맵 난이도 5 클리어', reward: 500, test: (s, m) => Object.values(m).some((x) => x.clear >= 5) },
  { id: 'all_maps', name: '세계 여행', desc: '모든 맵 해금', reward: 200, test: (s, m) => Object.values(m).every((x) => x.unlocked) },
];

// 일일 미션 풀 (kind: sum = 누적, max = 한 판 최고)
export const MISSIONS = [
  { id: 'swallow', kind: 'sum', key: 'swallowed', targets: [150, 300, 500], text: (n) => `오브젝트 ${n}개 삼키기`, reward: 40 },
  { id: 'kills', kind: 'sum', key: 'kills', targets: [60, 120, 200], text: (n) => `로봇 ${n}대 처치`, reward: 40 },
  { id: 'runs', kind: 'sum', key: 'runs', targets: [2, 3], text: (n) => `${n}판 플레이`, reward: 30 },
  { id: 'survive', kind: 'max', key: 'time', targets: [120, 180, 240], text: (n) => `한 판에서 ${n / 60}분 생존`, reward: 50 },
  { id: 'size', kind: 'max', key: 'size', targets: [6, 9, 12], text: (n) => `지름 ${n}m 달성`, reward: 50 },
  { id: 'combo', kind: 'max', key: 'maxCombo', targets: [15, 25], text: (n) => `콤보 x${n} 달성`, reward: 45 },
  { id: 'level', kind: 'max', key: 'level', targets: [8, 12], text: (n) => `한 판에서 Lv ${n} 도달`, reward: 45 },
  { id: 'mini', kind: 'sum', key: 'miniKills', targets: [1], text: () => '미니보스 처치', reward: 60 },
];
export const MISSION_BONUS = 60;

// 연속 출석 보상 (7일 주기)
export const STREAK_REWARDS = [20, 30, 40, 60, 80, 100, 160];

// 데일리 챌린지 변형
export const DAILY_MODS = [
  { id: 'giants', name: '거인의 날', desc: '적이 30% 더 크고 XP 1.3배', enemySize: 1.3, xp: 1.3 },
  { id: 'glass', name: '유리 대포', desc: 'HP 절반, 성장 1.6배', hp: 0.5, growth: 1.6 },
  { id: 'swarm', name: '대군세', desc: '적 출현 1.7배, 코인 1.5배', rate: 1.7, coin: 1.5 },
  { id: 'feast', name: '대잔치', desc: '시작부터 크고 빠름, 적 체력 1.4배', startR: 1.5, speed: 1.15, hpE: 1.4 },
  { id: 'storm', name: '번개 폭풍', desc: '블랙 번개 Lv3로 시작', startSkill: ['bolt', 3] },
  { id: 'orbit', name: '위성 축제', desc: '파편 위성 Lv3로 시작', startSkill: ['orbit', 3] },
];
export const DAILY_REWARD = 150;
export const DAILY_GOAL = 180; // 초 생존 또는 클리어

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
// 진화 스킬: 무기 Lv5 + 짝 패시브 보유. 12개 스킬이 모두 한 번 이상 재료로 쓰임
export const WEAPONS = ['orbit', 'cannon', 'pulse', 'bolt', 'dash', 'nova', 'saw'];
export const PASSIVES = ['horizon', 'glutton', 'haste', 'regen', 'greed'];
export const EVOLUTIONS = {
  accretion: {
    name: '강착 원반',
    color: '#c6b8ff',
    from: ['orbit', 'horizon'],
    need: { orbit: 5, horizon: 1 },
    desc: () => '파편 위성 진화: 파편 10개가 넓게 돌며 2.5배 피해, 작은 적을 끌어당김',
  },
  singularity: {
    name: '특이점 포',
    color: '#ff9f6b',
    from: ['cannon', 'glutton'],
    need: { cannon: 5, glutton: 1 },
    desc: () => '역류 캐논 진화: 탄환이 작은 블랙홀이 되어 적을 빨아들이고 폭발',
  },
  storm: {
    name: '폭풍 번개',
    color: '#9ff4ff',
    from: ['bolt', 'haste'],
    need: { bolt: 5, haste: 1 },
    desc: () => '블랙 번개 진화: 두 배로 자주, 두 줄기로 튀며 1.6배 피해',
  },
  vampsaw: {
    name: '흡혈 톱니',
    color: '#ff5d7a',
    from: ['saw', 'regen'],
    need: { saw: 5, regen: 1 },
    desc: () => '톱니 테두리 진화: 테두리 근처 모든 적을 갈아내고 피해만큼 HP 회복',
  },
  collapse: {
    name: '중력 붕괴',
    color: '#b07bff',
    from: ['pulse', 'horizon'],
    need: { pulse: 5, horizon: 1 },
    desc: () => '중력 펄스 진화: 큰 적까지 끌어당긴 뒤 2배 충격파로 튕겨냄',
  },
  goldnova: {
    name: '황금 초신성',
    color: '#ffd24a',
    from: ['nova', 'greed'],
    need: { nova: 5, greed: 1 },
    desc: () => '초신성 진화: 재사용 40% 단축, 1.5배 피해, 터질 때마다 코인',
  },
  rift: {
    name: '차원 균열',
    color: '#ff9bf2',
    from: ['dash', 'haste'],
    need: { dash: 5, haste: 1 },
    desc: () => '웜홀 대시 진화: 대시 간격 절반, 지나간 자리에 균열이 남아 적을 벰',
  },
};
// 무기 -> 진화, 패시브 -> 진화 목록
export const EVO_OF = {};
for (const [id, ev] of Object.entries(EVOLUTIONS)) for (const f of ev.from) (EVO_OF[f] ||= []).push(id);

export const SKILL_MAX = 5;
