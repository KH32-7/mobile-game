// 밸런스 수치와 콘텐츠 정의를 한 곳에 모음

export const SAVE_KEY = 'sushi-loop-save';
export const SAVE_VERSION = 3;

export const CFG = {
  chef: { speed: 3.5, speedPerLvl: 0.32, cap: 5, capPerLvl: 2, radius: 0.34 },
  transfer: 0.085, // 아이템 1개 옮기는 간격(초)
  crate: { max: 10, regen: 0.75 },
  station: { inCap: 10, outCap: 8, cookTime: 1.5, cookPerLvl: 0.86 },
  sink: { washTime: 0.55 },
  belt: { spacing: 0.92, speed: 0.95, speedPerLvl: 0.2, dryLaps: 3, grab: 0.28 },
  cust: { patience: 56, eat: 2.4, seatCycle: 24, maxOrders: 3, walk: 2.3, firstDelay: 1.5 },
  combo: { fast: 10, tipPer: 0.1, maxMul: 3, slow: 22 },
  rush: { first: 75, min: 95, max: 140 },
  staff: { speed: 2.5, cap: 3, speedPerLvl: 0.14, capPerLvl: 1 },
  offline: { capHours: 2, minSec: 120, share: 0.45 },
  plates: 10,
  platesPerSeat: 2,
  platesPerLvl: 4,
  unlockTime: 1.25, // 발판 결제에 걸리는 최소 시간
  autosave: 5,
};

// 메뉴: 접시 색은 회전초밥집 가격표 느낌으로 메뉴마다 다르게
export const MENUS = {
  salmon: { name: '연어 초밥', ing: 'salmon', price: 10, plate: '#ff9a3c', desc: '기름진 연어를 얹은 대표 메뉴' },
  tamago: { name: '달걀 초밥', ing: 'egg', price: 14, plate: '#ffd23f', desc: '달콤한 두툼 계란말이 초밥' },
  tuna: { name: '참치 초밥', ing: 'tuna', price: 20, plate: '#e2394f', desc: '진한 붉은살 참치' },
  ebi: { name: '새우튀김', ing: 'shrimp', price: 18, plate: '#4fb0ff', desc: '바삭한 튀김옷의 왕새우' },
  udon: { name: '우동 그릇', ing: 'noodle', price: 22, plate: '#7a5cff', desc: '따끈한 국물의 쫄깃한 면', bowl: true },
  uni: { name: '성게 군함', ing: 'uni', price: 26, plate: '#1fbf8f', desc: '김으로 감싼 바다의 버터' },
  unagi: { name: '장어 초밥', ing: 'eel', price: 28, plate: '#2b2b2b', desc: '달콤 짭짤한 소스의 장어' },
  dessert: { name: '딸기 모찌', ing: 'berry', price: 20, plate: '#ff7ab8', desc: '말랑한 찹쌀떡 디저트' },
  ikura: { name: '연어알 군함', ing: 'roe', price: 30, plate: '#c0c7d6', desc: '톡톡 터지는 연어알' },
  star: { name: '은하 젤리', ing: 'star', price: 36, plate: '#9b6bff', desc: '무중력에서 굳힌 별빛 젤리' },
};
export const MENU_ORDER = ['salmon', 'tamago', 'tuna', 'ebi', 'udon', 'uni', 'unagi', 'dessert', 'ikura', 'star'];

export const INGS = {
  salmon: { name: '연어', color: '#ff8a4c' },
  egg: { name: '달걀', color: '#ffd84a' },
  tuna: { name: '참치', color: '#c9243d' },
  shrimp: { name: '새우', color: '#ff9f7a' },
  noodle: { name: '면', color: '#f3e2b5' },
  uni: { name: '성게', color: '#ffb52e' },
  eel: { name: '장어', color: '#7a4a2a' },
  berry: { name: '딸기', color: '#ff4f6d' },
  roe: { name: '연어알', color: '#ff6a1f' },
  star: { name: '별가루', color: '#b58cff' },
};

// 업그레이드 (식당별로 초기화, Pizza Ready 방식)
export const UPGRADES = [
  { id: 'speed', name: '이동 속도', icon: 'run', max: 6, base: 25, growth: 1.75, tab: 'chef', desc: '셰프가 더 빨리 걸음' },
  { id: 'cap', name: '적재량', icon: 'stack', max: 7, base: 30, growth: 1.7, tab: 'chef', desc: '한 번에 +2개 더 운반' },
  { id: 'cook', name: '조리 속도', icon: 'fire', max: 6, base: 40, growth: 1.8, tab: 'shop', desc: '조리 시간 14% 단축' },
  { id: 'belt', name: '벨트 속도', icon: 'belt', max: 5, base: 45, growth: 1.8, tab: 'shop', desc: '벨트가 더 빨리 돌아감' },
  { id: 'plates', name: '접시 추가', icon: 'plate', max: 6, base: 35, growth: 1.65, tab: 'shop', desc: '깨끗한 접시 +4장' },
  { id: 'sspeed', name: '직원 속도', icon: 'run', max: 5, base: 60, growth: 1.8, tab: 'staff', desc: '직원 이동 속도 +14%', needStaff: true },
  { id: 'scap', name: '직원 적재량', icon: 'stack', max: 4, base: 70, growth: 1.85, tab: 'staff', desc: '직원이 +1개 더 운반', needStaff: true },
];

// 스테이지(식당). 좌석 id: 벨트-면-번호 (A-R-0 = A벨트 오른쪽 첫 좌석)
export const STAGES = [
  {
    id: 'alley',
    name: '골목 포장마차',
    sub: '밤골목 작은 회전초밥',
    priceMul: 1,
    cust: 1,
    theme: 'alley',
    layout: { r: 1.5, len0: 3, len1: 5, topZ: -3, twoBelts: false, mirror: false, menus: ['salmon', 'tamago', 'tuna'] },
    start: { menus: ['salmon'], seats: ['A-R-0', 'A-R-1'] },
    unlocks: [
      { id: 's1', t: 'seats', seats: ['A-L-0', 'A-L-1'], cost: 15 },
      { id: 'sink', t: 'sink', cost: 30 },
      { id: 'st_tamago', t: 'station', menu: 'tamago', cost: 50 },
      { id: 'upg', t: 'upgrade', cost: 70 },
      { id: 'run1', t: 'staff', role: 'runner', cost: 100 },
      { id: 's2', t: 'seats', seats: ['A-R-2', 'A-L-2'], cost: 130 },
      { id: 'haul1', t: 'staff', role: 'hauler', cost: 170 },
      { id: 'st_tuna', t: 'station', menu: 'tuna', cost: 220 },
      { id: 'ext', t: 'extend', cost: 280 },
      { id: 's3', t: 'seats', seats: ['A-R-3', 'A-R-4'], cost: 340 },
      { id: 's4', t: 'seats', seats: ['A-L-3', 'A-L-4'], cost: 420 },
      { id: 'run2', t: 'staff', role: 'runner', cost: 520 },
      { id: 'next', t: 'next', cost: 850 },
    ],
  },
  {
    id: 'mall',
    costMul: 0.75,
    name: '쇼핑몰 푸드코트',
    sub: '북적이는 주말의 쇼핑몰',
    priceMul: 3,
    cust: 1.15,
    theme: 'mall',
    layout: { r: 1.6, len0: 3, len1: 5, topZ: -3, twoBelts: true, mirror: false, menus: ['salmon', 'tuna', 'ebi', 'udon'] },
    start: { menus: ['salmon'], seats: ['A-R-0', 'A-R-1'] },
    unlocks: [
      { id: 's1', t: 'seats', seats: ['A-L-0', 'A-L-1'], cost: 45 },
      { id: 'sink', t: 'sink', cost: 110 },
      { id: 'st_tuna', t: 'station', menu: 'tuna', cost: 180 },
      { id: 'upg', t: 'upgrade', cost: 240 },
      { id: 's2', t: 'seats', seats: ['A-R-2', 'A-L-2'], cost: 330 },
      { id: 'run1', t: 'staff', role: 'runner', cost: 450 },
      { id: 'st_ebi', t: 'station', menu: 'ebi', cost: 600 },
      { id: 'lever', t: 'lever', seats: ['B-L-0', 'B-L-1'], cost: 800 },
      { id: 'haul1', t: 'staff', role: 'hauler', cost: 1000 },
      { id: 's3', t: 'seats', seats: ['B-R-0', 'B-R-1'], cost: 1200 },
      { id: 'st_udon', t: 'station', menu: 'udon', cost: 1500 },
      { id: 'ext', t: 'extend', cost: 1800 },
      { id: 's4', t: 'seats', seats: ['A-R-3', 'A-L-3'], cost: 2100 },
      { id: 'run2', t: 'staff', role: 'runner', cost: 2500 },
      { id: 's5', t: 'seats', seats: ['B-L-2', 'B-R-2'], cost: 2900 },
      { id: 's6', t: 'seats', seats: ['B-R-3', 'B-L-3'], cost: 3400 },
      { id: 'haul2', t: 'staff', role: 'hauler', cost: 4000 },
      { id: 'next', t: 'next', cost: 6000 },
    ],
  },
  {
    id: 'beach',
    costMul: 0.75,
    name: '바닷가 스시바',
    sub: '파도 소리 들리는 해변',
    priceMul: 8,
    cust: 1.3,
    theme: 'beach',
    layout: { r: 1.6, len0: 3, len1: 5, topZ: -3, twoBelts: true, mirror: true, menus: ['salmon', 'uni', 'ebi', 'unagi', 'dessert'] },
    start: { menus: ['salmon'], seats: ['A-R-0', 'A-R-1'] },
    unlocks: [
      { id: 's1', t: 'seats', seats: ['A-L-0', 'A-L-1'], cost: 120 },
      { id: 'sink', t: 'sink', cost: 280 },
      { id: 'st_uni', t: 'station', menu: 'uni', cost: 450 },
      { id: 'upg', t: 'upgrade', cost: 600 },
      { id: 'run1', t: 'staff', role: 'runner', cost: 850 },
      { id: 's2', t: 'seats', seats: ['A-R-2', 'A-L-2'], cost: 1100 },
      { id: 'st_ebi', t: 'station', menu: 'ebi', cost: 1500 },
      { id: 'lever', t: 'lever', seats: ['B-L-0', 'B-L-1'], cost: 2000 },
      { id: 'haul1', t: 'staff', role: 'hauler', cost: 2500 },
      { id: 'st_unagi', t: 'station', menu: 'unagi', cost: 3100 },
      { id: 's3', t: 'seats', seats: ['B-R-0', 'B-R-1'], cost: 3800 },
      { id: 'ext', t: 'extend', cost: 4500 },
      { id: 'run2', t: 'staff', role: 'runner', cost: 5400 },
      { id: 'st_dessert', t: 'station', menu: 'dessert', cost: 6400 },
      { id: 's4', t: 'seats', seats: ['A-R-3', 'A-L-3'], cost: 7500 },
      { id: 's5', t: 'seats', seats: ['B-L-2', 'B-R-2'], cost: 8800 },
      { id: 'haul2', t: 'staff', role: 'hauler', cost: 10000 },
      { id: 'next', t: 'next', cost: 15000 },
    ],
  },
  {
    id: 'ryokan',
    costMul: 0.75,
    name: '고급 료칸',
    sub: '대나무 숲 속 오마카세',
    priceMul: 20,
    cust: 1.45,
    theme: 'ryokan',
    layout: { r: 1.7, len0: 3, len1: 5, topZ: -3, twoBelts: true, mirror: false, menus: ['tuna', 'unagi', 'uni', 'ikura', 'dessert'] },
    start: { menus: ['tuna'], seats: ['A-R-0', 'A-R-1'] },
    unlocks: [
      { id: 's1', t: 'seats', seats: ['A-L-0', 'A-L-1'], cost: 300 },
      { id: 'sink', t: 'sink', cost: 700 },
      { id: 'st_unagi', t: 'station', menu: 'unagi', cost: 1100 },
      { id: 'upg', t: 'upgrade', cost: 1500 },
      { id: 'run1', t: 'staff', role: 'runner', cost: 2100 },
      { id: 's2', t: 'seats', seats: ['A-R-2', 'A-L-2'], cost: 2800 },
      { id: 'st_uni', t: 'station', menu: 'uni', cost: 3700 },
      { id: 'lever', t: 'lever', seats: ['B-L-0', 'B-L-1'], cost: 4800 },
      { id: 'haul1', t: 'staff', role: 'hauler', cost: 6000 },
      { id: 'st_ikura', t: 'station', menu: 'ikura', cost: 7500 },
      { id: 's3', t: 'seats', seats: ['B-R-0', 'B-R-1'], cost: 9000 },
      { id: 'ext', t: 'extend', cost: 11000 },
      { id: 'run2', t: 'staff', role: 'runner', cost: 13000 },
      { id: 'st_dessert', t: 'station', menu: 'dessert', cost: 15500 },
      { id: 's4', t: 'seats', seats: ['A-R-3', 'A-L-3'], cost: 18000 },
      { id: 's5', t: 'seats', seats: ['B-L-2', 'B-R-2'], cost: 21000 },
      { id: 'haul2', t: 'staff', role: 'hauler', cost: 25000 },
      { id: 'next', t: 'next', cost: 38000 },
    ],
  },
  {
    id: 'space',
    costMul: 0.75,
    name: '우주 정거장',
    sub: '궤도 위 무중력 회전초밥',
    priceMul: 50,
    cust: 1.6,
    theme: 'space',
    layout: { r: 1.7, len0: 3, len1: 5, topZ: -3, twoBelts: true, mirror: true, menus: ['star', 'salmon', 'tuna', 'uni', 'dessert'] },
    start: { menus: ['star'], seats: ['A-R-0', 'A-R-1'] },
    unlocks: [
      { id: 's1', t: 'seats', seats: ['A-L-0', 'A-L-1'], cost: 800 },
      { id: 'sink', t: 'sink', cost: 1800 },
      { id: 'st_salmon', t: 'station', menu: 'salmon', cost: 2800 },
      { id: 'upg', t: 'upgrade', cost: 3800 },
      { id: 'run1', t: 'staff', role: 'runner', cost: 5000 },
      { id: 's2', t: 'seats', seats: ['A-R-2', 'A-L-2'], cost: 6800 },
      { id: 'st_tuna', t: 'station', menu: 'tuna', cost: 9000 },
      { id: 'lever', t: 'lever', seats: ['B-L-0', 'B-L-1'], cost: 12000 },
      { id: 'haul1', t: 'staff', role: 'hauler', cost: 15000 },
      { id: 'st_uni', t: 'station', menu: 'uni', cost: 19000 },
      { id: 's3', t: 'seats', seats: ['B-R-0', 'B-R-1'], cost: 23000 },
      { id: 'ext', t: 'extend', cost: 28000 },
      { id: 'run2', t: 'staff', role: 'runner', cost: 33000 },
      { id: 'st_dessert', t: 'station', menu: 'dessert', cost: 39000 },
      { id: 's4', t: 'seats', seats: ['A-R-3', 'A-L-3'], cost: 46000 },
      { id: 's5', t: 'seats', seats: ['B-L-2', 'B-R-2'], cost: 54000 },
      { id: 'haul2', t: 'staff', role: 'hauler', cost: 64000 },
      { id: 'final', t: 'final', cost: 100000 },
    ],
  },
];

// 비용 배율 적용 (보기 좋은 숫자로 반올림)
for (const st of STAGES) {
  if (!st.costMul) continue;
  for (const u of st.unlocks) {
    const c = u.cost * st.costMul;
    const step = c >= 10000 ? 500 : c >= 1000 ? 50 : 5;
    u.cost = Math.max(step, Math.round(c / step) * step);
  }
}

// 식당 테마 색상
export const THEMES = {
  alley: {
    bg: '#1c2040', fog: '#1c2040', floor: 'planks', floorColor: '#b98a5a', ground: '#34364a', groundTex: 'asphalt',
    wall: '#6b3a2a', wallTrim: '#3a1f18', counter: '#d8a86a', counterTop: '#f1d7a8', noren: '#23407a', lantern: '#ff5a3c',
    accent: '#e8483b', light: 0xffe2b8, hemiSky: 0xbcc8ff, hemiGround: 0x6b4a3a, sun: 1.55, hemi: 1.15, props: 'alley',
  },
  mall: {
    bg: '#a9dcf2', fog: '#a9dcf2', floor: 'tiles', floorColor: '#f2eee6', ground: '#d7dde3', groundTex: 'tiles',
    wall: '#f7f3ea', wallTrim: '#58c7b4', counter: '#e9e3d6', counterTop: '#ffffff', noren: '#1aa493', lantern: '#ffffff',
    accent: '#ff6b5a', light: 0xffffff, hemiSky: 0xe8f6ff, hemiGround: 0x9aa4ad, sun: 1.5, hemi: 1.2, props: 'mall',
  },
  beach: {
    bg: '#8fdcff', fog: '#8fdcff', floor: 'planks', floorColor: '#e2c08c', ground: '#f3d9a2', groundTex: 'sand',
    wall: '#57b8c9', wallTrim: '#f7f3ea', counter: '#c98b4e', counterTop: '#f6e0b4', noren: '#ff7a3a', lantern: '#ffd23f',
    accent: '#ff7a3a', light: 0xfff2d8, hemiSky: 0xcff0ff, hemiGround: 0xc9a46a, sun: 1.65, hemi: 1.15, props: 'beach',
  },
  ryokan: {
    bg: '#243428', fog: '#243428', floor: 'tatami', floorColor: '#d5c98a', ground: '#4a5a44', groundTex: 'gravel',
    wall: '#3b2a22', wallTrim: '#f3ead2', counter: '#8a5a3a', counterTop: '#e6c99a', noren: '#5a2d7a', lantern: '#ffcf7a',
    accent: '#c9a24a', light: 0xffe0b0, hemiSky: 0xd9e8c8, hemiGround: 0x5a4a30, sun: 1.45, hemi: 1.1, props: 'ryokan',
  },
  space: {
    bg: '#0b0d24', fog: '#0b0d24', floor: 'metal', floorColor: '#aab4c8', ground: '#1a1d38', groundTex: 'void',
    wall: '#3a4466', wallTrim: '#3de0ff', counter: '#dfe6f2', counterTop: '#ffffff', noren: '#ff3fa4', lantern: '#3de0ff',
    accent: '#3de0ff', light: 0xe8eeff, hemiSky: 0xc8d4ff, hemiGround: 0x3a3060, sun: 1.5, hemi: 1.25, props: 'space',
  },
};

// 인테리어 스킨 (컬렉션): 테마 색 일부를 덮어씀
export const SKINS = [
  { id: 'base', name: '기본 인테리어', price: 0, over: {} },
  { id: 'sakura', name: '벚꽃 인테리어', price: 60, over: { noren: '#ff8fb8', lantern: '#ffc2d8', counter: '#e8b4b8', floorTint: '#ffd9e4' } },
  { id: 'indigo', name: '쪽빛 인테리어', price: 90, over: { noren: '#1d2f6f', lantern: '#8fb0ff', counter: '#5b6ea8', floorTint: '#b8c4ff' } },
  { id: 'gold', name: '황금 인테리어', price: 160, over: { noren: '#1a1a1a', lantern: '#ffd23f', counter: '#e0b040', floorTint: '#ffe8a0' } },
];

export const HATS = [
  { id: 'chef', name: '셰프 모자', price: 0 },
  { id: 'band', name: '머리띠 하치마키', price: 25 },
  { id: 'cat', name: '고양이 귀', price: 50 },
  { id: 'pirate', name: '해적 모자', price: 80 },
  { id: 'crown', name: '황금 왕관', price: 140 },
  { id: 'helmet', name: '우주 헬멧', price: 200 },
];
export const APRONS = [
  { id: 'white', name: '흰 앞치마', price: 0, color: '#ffffff' },
  { id: 'navy', name: '남색 앞치마', price: 20, color: '#27407a' },
  { id: 'red', name: '빨간 앞치마', price: 35, color: '#e2394f' },
  { id: 'pink', name: '분홍 앞치마', price: 45, color: '#ff8fb8' },
  { id: 'black', name: '검은 앞치마', price: 70, color: '#2a2a2e' },
  { id: 'gold', name: '금빛 앞치마', price: 150, color: '#f2c230' },
];

// 업적 (진주 보상)
export const ACHIEVEMENTS = [
  { id: 'plate1', name: '첫 접시', desc: '초밥 1접시 판매', stat: 'plates', goal: 1, reward: 5 },
  { id: 'plate100', name: '단골 가게', desc: '초밥 100접시 판매', stat: 'plates', goal: 100, reward: 15 },
  { id: 'plate1000', name: '초밥 장인', desc: '초밥 1,000접시 판매', stat: 'plates', goal: 1000, reward: 40 },
  { id: 'cust50', name: '입소문', desc: '손님 50명 접대', stat: 'customers', goal: 50, reward: 10 },
  { id: 'cust500', name: '줄 서는 맛집', desc: '손님 500명 접대', stat: 'customers', goal: 500, reward: 30 },
  { id: 'unlock1', name: '첫 확장', desc: '해금 발판 1개 완료', stat: 'unlocks', goal: 1, reward: 5 },
  { id: 'unlock20', name: '인테리어 공사', desc: '해금 발판 20개 완료', stat: 'unlocks', goal: 20, reward: 25 },
  { id: 'staff1', name: '사장님', desc: '첫 직원 고용', stat: 'staff', goal: 1, reward: 10 },
  { id: 'combo10', name: '타이밍 장인', desc: '콤보 10 달성', stat: 'maxCombo', goal: 10, reward: 15 },
  { id: 'combo25', name: '회전의 달인', desc: '콤보 25 달성', stat: 'maxCombo', goal: 25, reward: 30 },
  { id: 'vip1', name: 'VIP 대접', desc: 'VIP 세트 완벽 서빙', stat: 'vip', goal: 1, reward: 10 },
  { id: 'vip10', name: '미슐랭 후보', desc: 'VIP 세트 10번 완료', stat: 'vip', goal: 10, reward: 35 },
  { id: 'wash300', name: '반짝반짝', desc: '접시 300장 설거지', stat: 'washed', goal: 300, reward: 20 },
  { id: 'dry20', name: '위생 관리', desc: '마른 접시 20개 수거', stat: 'dried', goal: 20, reward: 10 },
  { id: 'earn10k', name: '만원의 행복', desc: '누적 수익 10K', stat: 'earned', goal: 10000, reward: 20 },
  { id: 'earn1m', name: '백만장자', desc: '누적 수익 1M', stat: 'earned', goal: 1000000, reward: 60 },
  { id: 'stage2', name: '2호점 오픈', desc: '쇼핑몰로 이전', stat: 'stage', goal: 2, reward: 25 },
  { id: 'stage3', name: '바다 전망', desc: '바닷가로 이전', stat: 'stage', goal: 3, reward: 35 },
  { id: 'stage4', name: '오마카세', desc: '료칸으로 이전', stat: 'stage', goal: 4, reward: 45 },
  { id: 'stage5', name: '우주 진출', desc: '우주 정거장으로 이전', stat: 'stage', goal: 5, reward: 60 },
  { id: 'star5', name: '별 다섯 개', desc: '식당 별점 4.8 이상', stat: 'bestStars', goal: 4.8, reward: 20 },
  { id: 'rush10', name: '러시 마스터', desc: '러시 타임 10번 버티기', stat: 'rushes', goal: 10, reward: 20 },
];

// 일일 미션 템플릿 (목표는 현재 식당 규모에 맞춰 조정)
export const MISSION_POOL = [
  { type: 'plates', text: '초밥 {n}접시 판매', base: 40, reward: 8 },
  { type: 'customers', text: '손님 {n}명 접대', base: 15, reward: 8 },
  { type: 'earned', text: '돈 {n} 벌기', base: 300, reward: 10, money: true },
  { type: 'unlocks', text: '해금 발판 {n}개 완료', base: 2, reward: 10 },
  { type: 'combo', text: '콤보 {n} 달성', base: 6, reward: 10, max: true },
  { type: 'washed', text: '접시 {n}장 설거지', base: 30, reward: 8 },
  { type: 'vip', text: 'VIP 세트 {n}번 완료', base: 1, reward: 12 },
  { type: 'dried', text: '마른 접시 {n}개 수거', base: 3, reward: 8 },
];

// 7일 출석 보상
export const ATTEND = [
  { pearls: 10 },
  { pearls: 15 },
  { money: 1 },
  { pearls: 20 },
  { pearls: 25 },
  { money: 2 },
  { pearls: 50, hat: 'band' },
];
