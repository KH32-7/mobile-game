// 모든 밸런스 수치를 한 곳에 모음
// 좌표 단위: 타일. 아레나 18 x 32, 아래(y 큼)가 플레이어(팀 0), 위가 적(팀 1)

export const ARENA = {
  W: 18,
  H: 32,
  RIVER_Y: 16,
  RIVER_HALF: 1.0, // 강 폭 절반 (15 ~ 17)
  BRIDGES: [3.5, 14.5],
  BRIDGE_HALF: 1.1,
  TILT: 0.86, // 세로 압축 비율 (살짝 기울어진 느낌)
};

export const BATTLE = {
  DURATION: 180,
  DOUBLE_AT: 60, // 남은 시간 60초부터 엘릭서 2배
  OVERTIME: 60,
  ELIXIR_MAX: 10,
  ELIXIR_START: 5,
  ELIXIR_PER_SEC: 1 / 2.8,
  DEPLOY_TIME: 1.0,
  SIGHT: 5.5,
  HAND_SIZE: 4,
  MERGE_PICK_RADIUS: 1.0,
  MAX_LEVEL: 3,
};

// 레벨(별)별 배율
export const LEVEL_MULT = [1, 1.65, 2.5];
export const SIZE_MULT = [1, 1.18, 1.36];

export const TOWERS = {
  princess: { hp: 1400, dmg: 52, hitSpeed: 0.8, range: 7.5, r: 1.25, proj: 'arrow', projSpeed: 16 },
  king: { hp: 2400, dmg: 70, hitSpeed: 1.0, range: 7.0, r: 1.6, proj: 'cannon', projSpeed: 12 },
  pos: {
    // 팀 0 기준. 팀 1 은 y 반전
    king: { x: 9, y: 29.2 },
    princess: [
      { x: 3.5, y: 25.6 },
      { x: 14.5, y: 25.6 },
    ],
  },
};

// kind: troop | building | spell
// targets: ground | all | buildings
// speed: 타일/초, range: 타일(몸 가장자리 기준)
export const CARDS = {
  knight: {
    name: '기사', cost: 3, kind: 'troop', rarity: 'common', color: '#6f8fb8',
    hp: 1100, dmg: 125, hitSpeed: 1.2, speed: 1.0, range: 0.6, r: 0.45, targets: 'ground', mass: 4,
    desc: '튼튼한 근접 전사',
  },
  archers: {
    name: '궁수 3인', cost: 3, kind: 'troop', rarity: 'common', color: '#c8739a', count: 3,
    hp: 210, dmg: 70, hitSpeed: 1.0, speed: 1.0, range: 5.0, r: 0.34, targets: 'all', proj: 'arrow', projSpeed: 14, mass: 1,
    desc: '공중도 쏘는 원거리 3인조',
  },
  giant: {
    name: '거인', cost: 5, kind: 'troop', rarity: 'rare', color: '#c89a5a',
    hp: 2700, dmg: 165, hitSpeed: 1.5, speed: 0.75, range: 0.8, r: 0.72, targets: 'buildings', mass: 12,
    desc: '건물만 노리는 탱커',
  },
  goblins: {
    name: '고블린 무리', cost: 2, kind: 'troop', rarity: 'common', color: '#6fae4f', count: 3,
    hp: 170, dmg: 95, hitSpeed: 1.1, speed: 1.5, range: 0.5, r: 0.32, targets: 'ground', mass: 1,
    desc: '빠르고 싼 근접 3마리',
  },
  skeletons: {
    name: '해골 떼', cost: 3, kind: 'troop', rarity: 'epic', color: '#b9b6c9', count: 10,
    hp: 62, dmg: 62, hitSpeed: 1.0, speed: 1.5, range: 0.45, r: 0.26, targets: 'ground', mass: 0.6,
    desc: '10마리 해골 물량',
  },
  wizard: {
    name: '마법사', cost: 5, kind: 'troop', rarity: 'rare', color: '#8a64c9',
    hp: 520, dmg: 190, hitSpeed: 1.4, speed: 1.0, range: 5.5, r: 0.42, targets: 'all', proj: 'orb', projSpeed: 11, splash: 1.5, mass: 3,
    desc: '범위 마법 공격',
  },
  minidragon: {
    name: '미니 드래곤', cost: 4, kind: 'troop', rarity: 'rare', color: '#d8704a', air: true,
    hp: 760, dmg: 110, hitSpeed: 1.6, speed: 1.5, range: 3.5, r: 0.5, targets: 'all', proj: 'flame', projSpeed: 10, splash: 1.2, mass: 4,
    desc: '하늘을 나는 화염 브레스',
  },
  bomber: {
    name: '폭탄병', cost: 2, kind: 'troop', rarity: 'common', color: '#7c7f8f',
    hp: 290, dmg: 190, hitSpeed: 1.8, speed: 1.0, range: 4.5, r: 0.36, targets: 'ground', proj: 'bomb', projSpeed: 8, splash: 1.5, mass: 2,
    desc: '지상 범위 폭탄 투척',
  },
  lancer: {
    name: '창기병', cost: 4, kind: 'troop', rarity: 'rare', color: '#b5835a',
    hp: 1050, dmg: 200, hitSpeed: 1.4, speed: 1.0, range: 1.2, r: 0.55, targets: 'ground', charge: true, mass: 6,
    desc: '달리면 돌격! 첫 타 2배',
  },
  cannon: {
    name: '대포', cost: 3, kind: 'building', rarity: 'common', color: '#8a8a8a',
    hp: 820, dmg: 115, hitSpeed: 0.9, range: 5.5, r: 0.75, targets: 'ground', proj: 'cannon', projSpeed: 12, lifetime: 30,
    desc: '지상 방어 건물',
  },
  totem: {
    name: '치유 토템', cost: 3, kind: 'building', rarity: 'rare', color: '#5fb59a',
    hp: 700, dmg: 0, hitSpeed: 1.0, range: 0, r: 0.6, targets: 'none', heal: 55, healRadius: 3.5, lifetime: 25,
    desc: '주변 아군을 계속 치유',
  },
  fireball: {
    name: '화염구', cost: 4, kind: 'spell', rarity: 'rare', color: '#e0643a',
    dmg: 480, radius: 2.5, towerPct: 0.35, knock: 0.9,
    desc: '범위 폭발 + 넉백',
  },
  lightning: {
    name: '번개', cost: 6, kind: 'spell', rarity: 'epic', color: '#e8c840',
    dmg: 820, radius: 3.5, towerPct: 0.35, hits: 3, stun: 0.6,
    desc: '체력 높은 적 3명 강타',
  },
  freeze: {
    name: '얼음', cost: 3, kind: 'spell', rarity: 'epic', color: '#7fc8e8',
    dmg: 90, radius: 3.0, towerPct: 0.35, slow: 0.5, slowTime: 4.5,
    desc: '범위 둔화 50%',
  },
  arrows: {
    name: '화살비', cost: 3, kind: 'spell', rarity: 'common', color: '#9aa65a',
    dmg: 170, radius: 4.0, towerPct: 0.35,
    desc: '넓은 범위 화살 세례',
  },
  golem: {
    name: '골렘', cost: 8, kind: 'troop', rarity: 'epic', color: '#7a6a5a',
    hp: 4600, dmg: 260, hitSpeed: 2.5, speed: 0.72, range: 0.8, r: 0.85, targets: 'buildings', mass: 20,
    deathSpawn: { card: 'golemite', count: 2 }, deathDmg: 200, deathRadius: 2,
    desc: '죽으면 두 개로 분열',
  },
  golemite: {
    name: '꼬마 골렘', cost: 0, kind: 'troop', token: true, color: '#8a7a6a',
    hp: 950, dmg: 60, hitSpeed: 2.5, speed: 0.72, range: 0.6, r: 0.5, targets: 'buildings', mass: 8,
    deathDmg: 60, deathRadius: 1.5,
  },
  assassin: {
    name: '암살자', cost: 4, kind: 'troop', rarity: 'epic', color: '#4a4a6a',
    hp: 680, dmg: 170, hitSpeed: 1.0, speed: 1.5, range: 0.6, r: 0.4, targets: 'ground', blink: { range: 6, cd: 6 }, mass: 3,
    desc: '적 뒤로 점멸, 첫 타 2배',
  },
  musketeer: {
    name: '총사', cost: 4, kind: 'troop', rarity: 'rare', color: '#5a7ab8',
    hp: 620, dmg: 155, hitSpeed: 1.1, speed: 1.0, range: 6.0, r: 0.4, targets: 'all', proj: 'bullet', projSpeed: 20, mass: 3,
    desc: '긴 사거리 저격수',
  },
  bats: {
    name: '박쥐 떼', cost: 2, kind: 'troop', rarity: 'common', color: '#6a4a8a', count: 5, air: true,
    hp: 72, dmg: 72, hitSpeed: 1.1, speed: 2.0, range: 0.5, r: 0.26, targets: 'all', mass: 0.5,
    desc: '빠른 공중 5마리',
  },
  valkyrie: {
    name: '여전사', cost: 4, kind: 'troop', rarity: 'rare', color: '#d89a4a',
    hp: 1450, dmg: 150, hitSpeed: 1.5, speed: 1.0, range: 0.7, r: 0.5, targets: 'ground', spin: 1.3, mass: 6,
    desc: '회전 도끼로 주변 모두 타격',
  },
};

export const PLAYABLE = Object.keys(CARDS).filter((k) => !CARDS[k].token);

export const STARTER_DECK = ['knight', 'archers', 'goblins', 'skeletons', 'giant', 'fireball', 'bomber', 'cannon'];

export const DECK_MAX = 12;
export const DECK_MIN = 8;

export const RELICS = {
  elixirStart: { name: '엘릭서 샘', desc: '전투 시작 엘릭서 +2', icon: 'drop' },
  firstStar: { name: '훈련 교본', desc: '매 전투 첫 소환 유닛은 자동 2성', icon: 'book' },
  kingHp: { name: '강철 성벽', desc: '킹 타워 최대 HP +20%', icon: 'wall' },
  spellDiscount: { name: '비전 두루마리', desc: '주문 비용 -1 (최소 1)', icon: 'scroll' },
  mergeHeal: { name: '치유의 인장', desc: '합성 시 주변 아군 30% 회복', icon: 'heart' },
  elixirRate: { name: '연금술 플라스크', desc: '엘릭서 충전 속도 +12%', icon: 'flask' },
  towerDmg: { name: '파수꾼 깃발', desc: '내 타워 공격력 +25%', icon: 'flag' },
  warDrum: { name: '전쟁 북', desc: '내 유닛 이동 속도 +12%', icon: 'drum' },
  goldCrown: { name: '황금 왕관', desc: '전투 골드 +50%', icon: 'crown' },
  mergeDiscount: { name: '대장장이 망치', desc: '합성 비용 -1 (최소 1)', icon: 'hammer' },
  guardKnight: { name: '수호 기사단', desc: '전투 시작 시 기사 1명 배치', icon: 'shield' },
  thorns: { name: '가시 성벽', desc: '타워 근처 적이 초당 피해', icon: 'thorn' },
};

// 캠페인 난이도
export const CAMPAIGN = {
  STAGES: 10,
  GOLD_BATTLE: 40,
  GOLD_ELITE: 75,
  REST_HEAL: 0.4,
  SHOP: { card: [45, 70, 95], relic: 140, heal: 60, healAmt: 0.3, remove: 70 },
};

// 스테이지(0~9)별 적 설정
export function stageParams(row, type) {
  const t = row / 9;
  const elite = type === 'elite';
  const boss = type === 'boss';
  return {
    react: lerp(2.3, 0.75, t) * (elite ? 0.85 : 1) * (boss ? 0.8 : 1),
    mistake: lerp(0.35, 0.05, t) * (elite ? 0.7 : 1),
    statMult: 1 + 0.045 * row + (elite ? 0.12 : 0) + (boss ? 0.1 : 0),
    towerMult: 1 + 0.05 * row + (elite ? 0.1 : 0),
    kingMult: boss ? 2.2 : 1,
    deckTier: Math.min(3, Math.floor(row / 3) + (elite ? 1 : 0)),
    boss,
    elite,
  };
}

// 적 덱 풀 (tier 별)
export const ENEMY_DECKS = [
  [
    ['knight', 'archers', 'goblins', 'bomber', 'giant', 'arrows', 'cannon', 'skeletons'],
    ['knight', 'bats', 'goblins', 'archers', 'musketeer', 'arrows', 'bomber', 'totem'],
  ],
  [
    ['giant', 'musketeer', 'goblins', 'bats', 'fireball', 'knight', 'archers', 'bomber'],
    ['lancer', 'archers', 'skeletons', 'minidragon', 'arrows', 'knight', 'cannon', 'goblins'],
    ['valkyrie', 'musketeer', 'bats', 'goblins', 'fireball', 'giant', 'archers', 'freeze'],
  ],
  [
    ['giant', 'wizard', 'minidragon', 'skeletons', 'fireball', 'knight', 'bats', 'totem'],
    ['golem', 'musketeer', 'bats', 'bomber', 'lightning', 'valkyrie', 'goblins', 'arrows'],
    ['assassin', 'lancer', 'wizard', 'skeletons', 'freeze', 'archers', 'cannon', 'minidragon'],
  ],
  [
    ['golem', 'wizard', 'minidragon', 'skeletons', 'lightning', 'valkyrie', 'bats', 'fireball'],
    ['giant', 'assassin', 'musketeer', 'minidragon', 'fireball', 'freeze', 'skeletons', 'totem'],
    ['lancer', 'wizard', 'valkyrie', 'bats', 'lightning', 'archers', 'goblins', 'golem'],
  ],
];

export const BOSS = {
  summonEvery: 22,
  summons: ['skeletons', 'knight', 'bats', 'goblins'],
};

export const RARITY_WEIGHT = { common: 5, rare: 3, epic: 1.6 };

export function lerp(a, b, t) {
  return a + (b - a) * t;
}

// ---------- 장기 진행 (메타) ----------
export const SAVE_VERSION = 2;

// 영구 카드 레벨: 레벨당 HP/공격력 +8%
export const CARD_LEVEL_BONUS = 0.08;
export const CARD_MAX_LEVEL = 6;
// index = 현재 레벨 - 1 → 다음 레벨 비용
export const LEVEL_COST = [
  { shards: 2, coins: 20 },
  { shards: 4, coins: 50 },
  { shards: 10, coins: 150 },
  { shards: 20, coins: 400 },
  { shards: 40, coins: 800 },
];

export const START_COINS = 100;

// 트로피 사다리 (아레나)
export const ARENAS = [
  { name: '풀밭 훈련장', min: 0, grass: ['#8fce6a', '#9bd874'], top: ['#8ccb68', '#98d571'], edge: '#8a6a44', bg: '#3b6a44', color: '#5aae4a', coins: 0, unlock: [] },
  { name: '고블린 숲', min: 300, grass: ['#6cbc78', '#78c884'], top: ['#68b874', '#74c480'], edge: '#5a4a34', bg: '#264a36', color: '#2f9a6a', coins: 150, unlock: ['bats', 'musketeer'] },
  { name: '해골 협곡', min: 700, grass: ['#cdbf8e', '#d8ca9a'], top: ['#c9bb8a', '#d4c696'], edge: '#7a6a5a', bg: '#4a4038', color: '#b09a5a', coins: 300, unlock: ['wizard', 'valkyrie', 'arrows'] },
  { name: '용암 요새', min: 1200, grass: ['#c49a7a', '#cea686'], top: ['#c09676', '#caa282'], edge: '#5a3a2a', bg: '#4a2a22', color: '#e0643a', coins: 500, unlock: ['minidragon', 'lancer', 'freeze'] },
  { name: '얼음 왕좌', min: 1800, grass: ['#bcdcec', '#c8e6f4'], top: ['#b8d8e8', '#c4e2f0'], edge: '#6a8aa0', bg: '#2e4a62', color: '#6ab8e8', coins: 800, unlock: ['golem', 'assassin', 'lightning', 'totem'] },
];

export const TROPHY = { win: 30, loss: 20, crownBonus: 2 };

// 원정 난이도 단계
export const RUN_TIERS = [
  { name: '견습', stat: 0, reward: 1 },
  { name: '기사', stat: 0.12, reward: 1.35 },
  { name: '영웅', stat: 0.24, reward: 1.7 },
  { name: '전설', stat: 0.38, reward: 2.1 },
  { name: '신화', stat: 0.55, reward: 2.6 },
];

export const CHEST_INTERVAL_MS = 3 * 60 * 60 * 1000;

export const MISSION_POOL = [
  { id: 'play', text: '카드 {n}장 사용', n: 30, coins: 50 },
  { id: 'merge', text: '합성 {n}회', n: 5, coins: 70 },
  { id: 'win', text: '대전 {n}회 승리', n: 2, coins: 80 },
  { id: 'tower', text: '타워 {n}개 파괴', n: 3, coins: 60 },
  { id: 'spell', text: '주문 {n}회 사용', n: 8, coins: 50 },
  { id: 'stage', text: '원정 스테이지 {n}개 진행', n: 3, coins: 70 },
  { id: 'star3', text: '3성 유닛 {n}회 만들기', n: 1, coins: 80 },
  { id: 'quick', text: '빠른 대전 {n}판 플레이', n: 2, coins: 50 },
];

export const ACHIEVEMENTS = [
  { id: 'win1', name: '첫 승리', desc: '대전 1회 승리', stat: 'wins', n: 1, coins: 50 },
  { id: 'win50', name: '백전노장', desc: '대전 50회 승리', stat: 'wins', n: 50, coins: 400 },
  { id: 'merge1', name: '합성 입문', desc: '합성 1회', stat: 'merges', n: 1, coins: 40 },
  { id: 'merge100', name: '합성 장인', desc: '합성 누적 100회', stat: 'merges', n: 100, coins: 300 },
  { id: 'star3', name: '별 셋', desc: '3성 유닛 만들기', stat: 'star3', n: 1, coins: 80 },
  { id: 'tower50', name: '파괴자', desc: '타워 누적 50개 파괴', stat: 'towers', n: 50, coins: 300 },
  { id: 'king10', name: '왕 시해자', desc: '킹 타워 10회 파괴', stat: 'kingKills', n: 10, coins: 250 },
  { id: 'run1', name: '원정 완주', desc: '원정 1회 클리어', stat: 'runWins', n: 1, coins: 300 },
  { id: 'tier5', name: '신화의 정복자', desc: '난이도 신화 클리어', stat: 'maxTierCleared', n: 5, coins: 1000 },
  { id: 'col12', name: '수집가', desc: '카드 12종 보유', stat: 'owned', n: 12, coins: 150 },
  { id: 'colAll', name: '완전 수집', desc: '모든 카드 보유', stat: 'owned', n: 20, coins: 500 },
  { id: 'lvl5', name: '강화의 달인', desc: '카드 하나를 레벨 5로', stat: 'maxCardLevel', n: 5, coins: 250 },
  { id: 'tro500', name: '떠오르는 별', desc: '트로피 500 달성', stat: 'bestTrophies', n: 500, coins: 150 },
  { id: 'tro1500', name: '전장의 지배자', desc: '트로피 1500 달성', stat: 'bestTrophies', n: 1500, coins: 500 },
  { id: 'boss3', name: '보스 사냥꾼', desc: '보스 3회 처치', stat: 'bossKills', n: 3, coins: 300 },
  { id: 'streak7', name: '개근상', desc: '연속 출석 7일', stat: 'bestStreak', n: 7, coins: 200 },
  { id: 'chest20', name: '상자 수집가', desc: '상자 20개 열기', stat: 'chests', n: 20, coins: 200 },
  { id: 'perfect10', name: '퍼펙트', desc: '3크라운 승리 10회', stat: 'threeCrowns', n: 10, coins: 250 },
  { id: 'spell100', name: '주문 달인', desc: '주문 100회 사용', stat: 'spells', n: 100, coins: 150 },
];
