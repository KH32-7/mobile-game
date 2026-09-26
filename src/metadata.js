// 장기 진행 데이터: 덱, 난이도(스테이크), 스킨, 업적, 일일 미션

export const STARTER_JOKERS = [
  'rower', 'vert', 'minimal', 'gambler', 'snowball', 'twins', 'miner', 'vault', 'barfan', 'closer', 'piggy', 'corner',
  'redchip', 'bluechip',
];
export const UNLOCK_COST = { common: 15, uncommon: 25, rare: 40, legendary: 70 };

// 7일 출석 캘린더 보상 (7일차 대형 보상)
export const CALENDAR = [5, 6, 8, 10, 12, 15, 40];

export const DECKS = [
  { id: 'basic', name: '기본 덱', desc: '특별한 효과 없음', cost: 0, color: '#8f6bff' },
  { id: 'rich', name: '부자 덱', desc: '시작 코인 +$6', cost: 30, color: '#ffd23f' },
  { id: 'gem', name: '보석 덱', desc: '보석 박힌 조각이 2배 자주 등장', cost: 45, color: '#ff2e63' },
  { id: 'combo', name: '콤보 덱', desc: '콤보 유지 여유 +1 배치', cost: 45, color: '#36c9ff' },
  { id: 'spare', name: '여유 덱', desc: '라운드마다 트레이 +1, 조커 슬롯 -1', cost: 60, color: '#3ddc97' },
  { id: 'joker', name: '조커 덱', desc: '해금된 일반 조커 1장을 들고 시작', cost: 60, color: '#ff8a3d' },
];
export const DECK_BY_ID = Object.fromEntries(DECKS.map((d) => [d.id, d]));

export const STAKES = [
  { lv: 1, name: '화이트', color: '#f0f0f0', desc: '기본 난이도' },
  { lv: 2, name: '레드', color: '#ff4d6d', desc: '스몰 블라인드 보상 없음' },
  { lv: 3, name: '그린', color: '#3ddc97', desc: '+ 목표 점수 x1.3' },
  { lv: 4, name: '블랙', color: '#9a9aa8', desc: '+ 라운드 트레이 -1' },
  { lv: 5, name: '골드', color: '#ffd23f', desc: '+ 이자 없음, 목표 점수 x1.6' },
];

export const SKINS = [
  { id: 'neon', name: '네온 라운지', cost: 0, bg: ['#3a1760', '#1c0b33', '#0a0414'], felt: ['#12603f', '#063322'], trim: '#d4a537' },
  { id: 'ruby', name: '루비 벨벳', cost: 35, bg: ['#4a0f1f', '#220713', '#0c0206'], felt: ['#7a1030', '#3a0616'], trim: '#ffcf5a' },
  { id: 'ocean', name: '심해 카지노', cost: 35, bg: ['#0f2a5a', '#081633', '#030814'], felt: ['#0e4f6e', '#052636'], trim: '#7fe3ff' },
  { id: 'sakura', name: '벚꽃 살롱', cost: 50, bg: ['#5a2350', '#2e0f2a', '#12040f'], felt: ['#6b2a5e', '#341230'], trim: '#ffb3d9' },
  { id: 'noir', name: '누아르 골드', cost: 70, bg: ['#2a2a2a', '#141414', '#050505'], felt: ['#1f1f24', '#0c0c10'], trim: '#ffd23f' },
];
export const SKIN_BY_ID = Object.fromEntries(SKINS.map((s) => [s.id, s]));

// 업적: check(stats, ctx) 로 판정, 보상 토큰
export const ACHIEVEMENTS = [
  { id: 'first_clear', name: '첫 발걸음', desc: '라운드 1개 클리어', reward: 5, check: (s) => s.roundsCleared >= 1 },
  { id: 'ante3', name: '판이 커진다', desc: '앤티 3 도달', reward: 5, check: (s) => s.bestAnte >= 3 },
  { id: 'ante5', name: '하이 롤러', desc: '앤티 5 도달', reward: 10, check: (s) => s.bestAnte >= 5 },
  { id: 'ante8', name: '마지막 테이블', desc: '앤티 8 도달', reward: 15, check: (s) => s.bestAnte >= 8 },
  { id: 'win', name: '하우스를 이기다', desc: '첫 승리', reward: 25, check: (s) => s.wins >= 1 },
  { id: 'hit1k', name: '천 점짜리 한 방', desc: '한 방에 1,000점', reward: 5, check: (s) => s.bestHit >= 1000 },
  { id: 'hit10k', name: '만 점짜리 한 방', desc: '한 방에 10,000점', reward: 10, check: (s) => s.bestHit >= 10000 },
  { id: 'hit100k', name: '잭팟', desc: '한 방에 100,000점', reward: 20, check: (s) => s.bestHit >= 100000 },
  { id: 'triple', name: '삼중 제거', desc: '3줄 동시 제거', reward: 5, check: (s) => s.maxLines >= 3 },
  { id: 'quad', name: '사중 제거', desc: '4줄 이상 동시 제거', reward: 10, check: (s) => s.maxLines >= 4 },
  { id: 'combo5', name: '연쇄 반응', desc: '콤보 5 달성', reward: 5, check: (s) => s.maxCombo >= 5 },
  { id: 'combo10', name: '멈추지 않는 손', desc: '콤보 10 달성', reward: 10, check: (s) => s.maxCombo >= 10 },
  { id: 'allclear', name: '깨끗한 테이블', desc: '보드를 완전히 비우기', reward: 10, check: (s) => s.allClears >= 1 },
  { id: 'fullhand', name: '풀 하우스', desc: '조커 슬롯을 가득 채우기', reward: 5, check: (s) => s.maxJokers >= 5 },
  { id: 'rich50', name: '두둑한 지갑', desc: '한 번에 $50 보유', reward: 10, check: (s) => s.maxCoins >= 50 },
  { id: 'gems50', name: '보석 수집가', desc: '보석 칸 누적 50개 제거', reward: 10, check: (s) => s.gemsCleared >= 50 },
  { id: 'lines500', name: '줄 청소부', desc: '누적 500줄 제거', reward: 15, check: (s) => s.totalLines >= 500 },
  { id: 'boss5', name: '보스 사냥꾼', desc: '보스 누적 5회 격파', reward: 10, check: (s) => s.bossesBeaten >= 5 },
  { id: 'daily1', name: '오늘의 도전', desc: '데일리 런 플레이', reward: 5, check: (s) => s.dailyRuns >= 1 },
  { id: 'dex10', name: '조커 도감가', desc: '조커 10종 발견', reward: 10, check: (s, c) => c.discovered >= 10 },
  { id: 'streak7', name: '단골 손님', desc: '7일 연속 출석', reward: 15, check: (s) => s.bestStreak >= 7 },
  { id: 'stake2', name: '레드 카펫', desc: '레드 난이도 이상에서 승리', reward: 20, check: (s, c) => c.maxStakeWon >= 2 },
  { id: 'planet5', name: '별을 읽는 자', desc: '줄 강화 레벨 5 달성', reward: 10, check: (s) => s.maxLineLv >= 5 },
  { id: 'voucher3', name: '쿠폰 수집가', desc: '한 런에서 바우처 3장', reward: 10, check: (s) => s.maxVouchers >= 3 },
  { id: 'legend', name: '전설과의 만남', desc: '전설 조커 보유', reward: 15, check: (s) => s.legendsOwned >= 1 },
  { id: 'showdown', name: '쇼다운', desc: '앤티 8 쇼다운 보스 격파', reward: 25, check: (s) => s.showdowns >= 1 },
  { id: 'edition', name: '반짝반짝', desc: '에디션 조커 구매', reward: 5, check: (s) => s.editions >= 1 },
];

// 일일 미션 풀 (날짜 시드로 3개 선택)
export const MISSIONS = [
  { id: 'lines', text: (n) => `줄 ${n}개 제거`, n: 90, reward: 10 },
  { id: 'hit', text: (n) => `한 방에 ${n.toLocaleString('en-US')}점 이상`, n: 2500, reward: 10, max: true },
  { id: 'buy', text: (n) => `조커 ${n}장 구매`, n: 6, reward: 10 },
  { id: 'boss', text: (n) => `보스 ${n}회 격파`, n: 2, reward: 12 },
  { id: 'gems', text: (n) => `보석 칸 ${n}개 제거`, n: 25, reward: 10 },
  { id: 'multi', text: (n) => `3줄 이상 동시 제거 ${n}회`, n: 3, reward: 12 },
  { id: 'rounds', text: (n) => `라운드 ${n}개 클리어`, n: 10, reward: 10 },
  { id: 'combo', text: (n) => `콤보 ${n} 달성`, n: 8, reward: 10, max: true },
  { id: 'planet', text: (n) => `줄 강화 카드 ${n}장 사용`, n: 4, reward: 10 },
  { id: 'daily', text: () => '데일리 런 플레이', n: 1, reward: 8 },
];

// 주간 미션 (월요일 갱신, 3개 모두 완료 시 주간 상자)
export const WEEKLY = [
  { id: 'lines', text: (n) => `줄 ${n}개 제거`, n: 600 },
  { id: 'boss', text: (n) => `보스 ${n}회 격파`, n: 10 },
  { id: 'rounds', text: (n) => `라운드 ${n}개 클리어`, n: 40 },
  { id: 'gems', text: (n) => `보석 칸 ${n}개 제거`, n: 120 },
  { id: 'daily', text: (n) => `데일리 런 ${n}회`, n: 4 },
  { id: 'hit', text: (n) => `한 방에 ${n.toLocaleString('en-US')}점 이상`, n: 20000, max: true },
];
export const WEEKLY_CHEST = 60;
export const WEEKLY_BY_ID = Object.fromEntries(WEEKLY.map((m) => [m.id, m]));
export const MISSION_BY_ID = Object.fromEntries(MISSIONS.map((m) => [m.id, m]));
