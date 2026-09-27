// 테마 월드 + 꾸미기 아이템 정의 (DOM 없음)
// weights: 요소 가중치 배수, unlockShift: 요소 등장 홀 앞당김
export const WORLDS = [
  {
    id: 'meadow',
    name: '초원',
    desc: '푸른 잔디와 연못. 기본 코스',
    weights: {},
    wall: 'wood',
    diff: 0,
    windFrom: 7,
    windChance: 0.3,
    themes: [
      { hue: 100, sat: 58, light: 50, voidA: '#1f6b45', voidB: '#185a39', dot: 'rgba(120,200,120,0.18)', rail: '#fff3dc', railSide: '#caa472', bg: '#175434', sand: '#f4db8e', flag: '#ff3d3d', water: ['#3db3ff', '#1e88e5'], ice: ['#dff6ff', '#cdefff'] },
      { hue: 150, sat: 45, light: 47, voidA: '#2f6b5e', voidB: '#255a4f', dot: 'rgba(160,230,200,0.16)', rail: '#ffe6c9', railSide: '#c98b63', bg: '#214e45', sand: '#f2cf98', flag: '#ffb300', water: ['#39c0e8', '#1a86c9'], ice: ['#dff6ff', '#cdefff'] },
    ],
  },
  {
    id: 'desert',
    name: '사막',
    desc: '모래 함정과 모래바람, 경사가 많음',
    weights: { sand: 3, water: 0.35, slope: 1.6, crate: 1.4 },
    wall: 'sandstone',
    diff: 1,
    windFrom: 3,
    windChance: 0.55,
    themes: [
      { hue: 34, sat: 42, light: 47, voidA: '#d39a5c', voidB: '#c2854a', dot: 'rgba(255,225,170,0.45)', rail: '#fff0d6', railSide: '#b77a45', bg: '#b8804a', sand: '#f9e4a8', flag: '#2979ff', water: ['#26c6da', '#00897b'], ice: ['#e6f7ff', '#d3efff'] },
      { hue: 26, sat: 36, light: 43, voidA: '#a8603f', voidB: '#955436', dot: 'rgba(255,190,150,0.35)', rail: '#ffe3cf', railSide: '#b0694c', bg: '#874c31', sand: '#f6dc9c', flag: '#00e5ff', water: ['#26c6da', '#00897b'], ice: ['#e6f7ff', '#d3efff'] },
    ],
  },
  {
    id: 'snow',
    name: '설원',
    desc: '미끄러운 얼음판과 눈 언덕',
    weights: { ice: 3.5, slope: 1.5, sand: 0.8, mill: 1.3 },
    wall: 'ice',
    diff: 2,
    windFrom: 5,
    windChance: 0.4,
    themes: [
      { hue: 150, sat: 38, light: 44, voidA: '#e6eef6', voidB: '#d6e2ee', dot: 'rgba(255,255,255,0.9)', rail: '#ffffff', railSide: '#98b4cf', bg: '#dfe9f3', sand: '#ffffff', flag: '#e53935', water: ['#4fc3f7', '#0277bd'], ice: ['#e8fbff', '#bfeaff'] },
      { hue: 170, sat: 30, light: 38, voidA: '#b7c6dc', voidB: '#a9b9d1', dot: 'rgba(230,240,255,0.8)', rail: '#f4f8ff', railSide: '#8aa0c8', bg: '#a3b3cc', sand: '#f4f8ff', flag: '#ff9100', water: ['#4fc3f7', '#0277bd'], ice: ['#e8fbff', '#bfeaff'] },
    ],
  },
  {
    id: 'space',
    name: '우주',
    desc: '워프 게이트, 범퍼, 블랙홀',
    weights: { tele: 3, bumper: 2, mover: 1.6, water: 1.2, sand: 0.5 },
    diff: 3,
    teleFrom: 2,
    windFrom: 99,
    windChance: 0,
    blackhole: true,
    wall: 'neon',
    themes: [
      { hue: 250, sat: 22, light: 34, voidA: '#120b2e', voidB: '#0e0826', dot: 'rgba(255,255,255,0.5)', rail: '#d7ccff', railSide: '#6a5acd', bg: '#0b0620', sand: '#c7b8ff', flag: '#00e676', water: ['#2a0845', '#000000'], ice: ['#b3e5fc', '#81d4fa'], stars: true },
      { hue: 285, sat: 20, light: 32, voidA: '#1d0b2b', voidB: '#170823', dot: 'rgba(255,220,255,0.5)', rail: '#ffd1f5', railSide: '#b0479b', bg: '#12061c', sand: '#e0b8ff', flag: '#ffea00', water: ['#2a0845', '#000000'], ice: ['#b3e5fc', '#81d4fa'], stars: true },
    ],
  },
];
export const WORLD_MAP = Object.fromEntries(WORLDS.map((w) => [w.id, w]));

// 별 3개 목표
export const STAR_GOALS = ['전반 9홀 클리어', '18홀 완주', '파 이하(E 이하)로 완주'];

// 꾸미기
export const BALL_SKINS = [
  { id: 'white', name: '클래식', price: 0, colors: ['#ffffff', '#bdbdbd'] },
  { id: 'gold', name: '황금 공', price: 35, colors: ['#fff59d', '#f9a825'] },
  { id: 'melon', name: '수박', price: 30, colors: ['#a5d6a7', '#2e7d32'], stripe: '#1b5e20' },
  { id: 'eight', name: '8볼', price: 40, colors: ['#616161', '#111111'], dot: '#ffffff' },
  { id: 'neon', name: '네온 핑크', price: 45, colors: ['#ffb3d9', '#ff2d95'], glow: '#ff4fb0' },
  { id: 'rainbow', name: '무지개', price: 60, colors: null, rainbow: true },
  { id: 'season', name: '시즌 벚꽃 공', price: 0, season: true, colors: ['#ffe4ef', '#ff7aa8'], stripe: '#ffffff' },
];
export const TRAILS = [
  { id: 'basic', name: '기본', price: 0, color: '255,255,255' },
  { id: 'fire', name: '불꽃', price: 30, color: '255,140,40' },
  { id: 'mint', name: '민트', price: 25, color: '100,255,200' },
  { id: 'rainbow', name: '무지개', price: 45, rainbow: true },
  { id: 'star', name: '별가루', price: 55, color: '255,240,120', sparkle: true },
  { id: 'season', name: '벚꽃잎', price: 0, season: true, color: '255,170,200', sparkle: true },
];
export const FLAGS = [
  { id: 'theme', name: '월드 기본', price: 0 },
  { id: 'check', name: '체커', price: 25, pattern: 'check' },
  { id: 'pirate', name: '해적', price: 35, color: '#212121', mark: '#ffffff' },
  { id: 'rainbow', name: '무지개', price: 40, rainbow: true },
  { id: 'royal', name: '로열', price: 50, color: '#7b1fa2', mark: '#ffd600' },
  { id: 'season', name: '시즌 깃발', price: 0, season: true, color: '#ff7aa8', mark: '#ffffff' },
];
