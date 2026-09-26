// 보스 라운드 저주
export const BOSSES = [
  { id: 'lock', name: '봉인된 심장', desc: '보드 가운데 2x2 칸이 돌로 막힘', color: '#8e87a3' },
  { id: 'fog', name: '안개 딜러', desc: '트레이 조각이 2개만 공개됨', color: '#9fb4c7' },
  { id: 'giant', name: '거인의 손', desc: '1~2칸 조각이 나오지 않음', color: '#ff8a3d' },
  { id: 'flat', name: '수평선', desc: '가로줄은 점수(칩)를 주지 않음', color: '#36c9ff' },
  { id: 'poor', name: '빈털터리', desc: '이번 라운드 트레이 -2', color: '#ffb627' },
  { id: 'nocombo', name: '끊어진 사슬', desc: '콤보 배수가 적용되지 않음', color: '#ff4d6d' },
  { id: 'rubble', name: '잔해 더미', desc: '보드에 잡동사니 블록 12칸이 깔린 채 시작', color: '#a3620a' },
  { id: 'seal', name: '조커 봉인', desc: '가장 왼쪽 조커가 비활성화됨', color: '#8f6bff' },
];

export const BOSS_BY_ID = Object.fromEntries(BOSSES.map((b) => [b.id, b]));
