// 보스 라운드 저주 (일반 16종 + 앤티 8 쇼다운 3종)
// tier: 1 약함, 2 보통, 3 강함 (앤티에 따라 등장 가중치 조정)
export const BOSSES = [
  { id: 'lock', name: '봉인된 심장', desc: '보드 가운데 2x2 칸이 돌로 막힘', color: '#8e87a3', tier: 1 },
  { id: 'fog', name: '안개 딜러', desc: '트레이 조각이 2개만 공개됨', color: '#9fb4c7', tier: 1 },
  { id: 'giant', name: '거인의 손', desc: '1~2칸 조각이 나오지 않음', color: '#ff8a3d', tier: 1 },
  { id: 'flat', name: '지평선', desc: '가로줄은 칩을 주지 않음', color: '#36c9ff', tier: 2 },
  { id: 'vertnull', name: '수직선', desc: '세로줄은 칩을 주지 않음', color: '#7fe3ff', tier: 2 },
  { id: 'poor', name: '빈털터리', desc: '이번 라운드 트레이 -1', color: '#ffb627', tier: 2 },
  { id: 'nocombo', name: '끊어진 사슬', desc: '콤보 배수가 적용되지 않음', color: '#ff4d6d', tier: 2 },
  { id: 'rubble', name: '잔해 더미', desc: '보드에 잡동사니 블록 10칸이 깔린 채 시작', color: '#a3620a', tier: 1 },
  { id: 'seal', name: '조커 봉인', desc: '가장 왼쪽 조커가 비활성화됨', color: '#8f6bff', tier: 2 },
  { id: 'heavy', name: '무거운 짐', desc: '3x3, 2x3, 5칸 조각이 자주 나옴', color: '#c47a3d', tier: 1 },
  { id: 'nogem', name: '보석 도둑', desc: '보석 효과가 발동하지 않음', color: '#ff2e63', tier: 1 },
  { id: 'tax', name: '세리', desc: '줄을 지울 때마다 $1 잃음', color: '#d4a537', tier: 1 },
  { id: 'creep', name: '잠식', desc: '새 트레이를 받을 때마다 빈칸 2개에 잡동사니', color: '#5d8a3d', tier: 2 },
  { id: 'lonely', name: '외톨이', desc: '1줄만 지우면 점수 절반', color: '#9a9aa8', tier: 2 },
  { id: 'greed', name: '탐욕', desc: '목표 점수 +50%', color: '#ffd23f', tier: 3 },
  { id: 'slow', name: '느림보', desc: '콤보 유예가 1배치뿐', color: '#6b8aff', tier: 2 },
];

export const SHOWDOWNS = [
  { id: 'crimson', name: '진홍 여왕', desc: '최종 배수가 절반', color: '#ff2e4d', showdown: true },
  { id: 'tower', name: '황금 탑', desc: '새 트레이마다 잡동사니 3칸, 보석 효과 없음', color: '#ffc21a', showdown: true },
  { id: 'night', name: '영원한 밤', desc: '트레이마다 무작위 조커 1장 비활성', color: '#6b5cff', showdown: true },
];

export const BOSS_BY_ID = Object.fromEntries([...BOSSES, ...SHOWDOWNS].map((b) => [b.id, b]));
