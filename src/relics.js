// 유물 정의 (40종). 효과 구현은 physics.js / game.js 에서 id 로 참조함
// rarity: 1 일반, 2 희귀, 3 영웅. tags: 시너지 표시용. up: 강화 가능 (Lv2 설명)
export const RELICS = [
  { id: 'sticky', name: '끈끈이 공', desc: '벽에 닿으면 속도의 절반을 흡수해서 멀리 튀지 않음', color: '#8bc34a', rarity: 1, tags: ['벽'] },
  { id: 'ghost', name: '유령 공', desc: '샷마다 안쪽 벽 1번을 그대로 통과', color: '#b39ddb', rarity: 2, tags: ['벽'] },
  { id: 'magnet', name: '자석 컵', desc: '컵 흡입 반경 2배', color: '#ef5350', rarity: 2, tags: ['컵'], up: '컵 흡입 반경 3배' },
  { id: 'mulligan', name: '멀리건', desc: '홀마다 1번, 방금 친 샷을 되돌림', color: '#ffb300', rarity: 2, tags: ['하트'], up: '홀마다 2번 되돌림' },
  { id: 'split', name: '분열 샷', desc: '홀 첫 샷에 공이 2개로 갈라짐. 하나만 들어가도 성공', color: '#26c6da', rarity: 3, tags: ['첫 샷'] },
  { id: 'longaim', name: '긴 조준선', desc: '조준선이 2배 길고 반사 3회까지 보임', color: '#42a5f5', rarity: 1, tags: ['조준', '벽'] },
  { id: 'bounceking', name: '바운스 킹', desc: '범퍼 반발 1.5배, 범퍼에 맞을 때마다 코인 +1', color: '#ec407a', rarity: 1, tags: ['범퍼', '코인'], up: '범퍼 반발 2배, 코인 +2' },
  { id: 'skiwax', name: '스키 왁스', desc: '얼음 위를 구르는 중 화면을 탭하면 그 방향으로 꺾음 (샷당 1회)', color: '#80deea', rarity: 1, tags: ['지형'] },
  { id: 'sandproof', name: '모래 무시', desc: '모래가 잔디처럼 굴러감', color: '#e0c068', rarity: 1, tags: ['지형'] },
  { id: 'waterski', name: '수상 스키', desc: '샷마다 물 위를 한 번 스치고 지나감', color: '#29b6f6', rarity: 2, tags: ['지형', '물'] },
  { id: 'windbreak', name: '바람막이', desc: '바람을 무시하고 경사 영향이 절반', color: '#a1887f', rarity: 1, tags: ['지형'] },
  { id: 'parplus', name: '파 여유', desc: '모든 홀의 파 +1', color: '#66bb6a', rarity: 3, tags: ['하트'] },
  { id: 'luckytee', name: '행운의 티', desc: '홀 첫 샷 파워 1.3배', color: '#ff7043', rarity: 1, tags: ['첫 샷', '파워'], up: '홀 첫 샷 파워 1.5배' },
  { id: 'echo', name: '에코 샷', desc: '직전 샷의 궤적이 유령처럼 남음', color: '#9575cd', rarity: 1, tags: ['조준'] },
  { id: 'heavy', name: '쇳덩이 공', desc: '상자를 쉽게 부수고 경사와 바람을 덜 탐', color: '#78909c', rarity: 1, tags: ['지형', '상자'] },
  { id: 'coinmag', name: '동전 자석', desc: '코스 코인 줍는 범위 3배, 홀마다 코인 +1', color: '#fdd835', rarity: 1, tags: ['코인'], up: '줍는 범위 4배, 홀마다 코인 +2' },
  { id: 'harvest', name: '하트 수확', desc: '버디 이하로 끝내면 하트가 반드시 회복', color: '#f06292', rarity: 2, tags: ['하트'] },
  { id: 'brake', name: '브레이크', desc: '공이 구르는 중 두 번 탭하면 즉시 멈춤 (샷당 1회)', color: '#e53935', rarity: 2, tags: ['조작'] },
  { id: 'cushion', name: '당구 달인', desc: '벽 반발 증가, 조준선 반사 +1', color: '#5c6bc0', rarity: 1, tags: ['벽', '조준'] },
  { id: 'vitality', name: '여분의 심장', desc: '최대 하트 +2, 하트 2 회복', color: '#d81b60', rarity: 2, tags: ['하트'] },
  { id: 'tailwind', name: '순풍', desc: '최대 파워 +25%', color: '#4db6ac', rarity: 1, tags: ['파워'], up: '최대 파워 +40%' },
  { id: 'bigcup', name: '큰 컵', desc: '컵 크기 1.35배, 빠른 공도 잘 들어감', color: '#8d6e63', rarity: 2, tags: ['컵'], up: '컵 크기 1.6배' },
  // 신규 18종
  { id: 'glass', name: '유리 공', desc: '코인 획득 2배. 대신 벽에 세게 부딪히면 벌타 +1 (샷당 1회)', color: '#b2ebf2', rarity: 2, tags: ['코인', '벽'], trade: true },
  { id: 'feather', name: '깃털 공', desc: '마찰 25% 감소로 멀리 굴러감. 대신 최대 파워 -15%', color: '#fff9c4', rarity: 1, tags: ['파워'], trade: true, up: '마찰 35% 감소' },
  { id: 'bouncy', name: '탱탱볼', desc: '벽과 범퍼에서 훨씬 잘 튐. 대신 모래에서 1.5배 느려짐', color: '#ff80ab', rarity: 1, tags: ['벽', '범퍼'], trade: true },
  { id: 'greed', name: '탐욕의 주머니', desc: '코인 획득 +50%. 대신 최대 하트 -1', color: '#ffa000', rarity: 2, tags: ['코인'], trade: true },
  { id: 'gambler', name: '도박사의 컵', desc: '버디 이하 코인 보상 2배. 대신 보기 이상이면 코인 -3', color: '#7cb342', rarity: 1, tags: ['코인'], trade: true },
  { id: 'shield', name: '보호막', desc: '홀마다 첫 하트 손실 1번 막음', color: '#4fc3f7', rarity: 3, tags: ['하트'], up: '홀마다 2번 막음' },
  { id: 'lifevest', name: '구명조끼', desc: '홀마다 1번, 물에 빠져도 벌타 없음', color: '#ff7043', rarity: 1, tags: ['물', '지형'], up: '홀마다 2번' },
  { id: 'radar', name: '컵 레이더', desc: '컵에 들어가는 속도 한계 +40% (세게 쳐도 쏙)', color: '#26a69a', rarity: 1, tags: ['컵'], up: '속도 한계 +70%' },
  { id: 'carpenter', name: '목수', desc: '상자를 부술 때마다 코인 +2', color: '#a1887f', rarity: 1, tags: ['상자', '코인'] },
  { id: 'pinball', name: '핀볼 마법사', desc: '한 샷에 범퍼 3번 이상 맞히면 코인 +5', color: '#ab47bc', rarity: 1, tags: ['범퍼', '코인'] },
  { id: 'comeback', name: '역전의 명수', desc: '하트가 2개 이하일 때 컵 크기 1.5배', color: '#ff5252', rarity: 2, tags: ['컵', '하트'] },
  { id: 'warpmaster', name: '워프 전문가', desc: '워프를 지나면 속도 1.4배 + 코인 +1', color: '#e040fb', rarity: 1, tags: ['워프', '코인'] },
  { id: 'sloperider', name: '경사 타기', desc: '경사 가속 1.6배', color: '#9ccc65', rarity: 1, tags: ['지형'], trade: true },
  { id: 'lastchance', name: '마지막 기회', desc: '하트가 0이 되면 런당 1번 하트 1개로 버팀', color: '#c62828', rarity: 3, tags: ['하트'] },
  { id: 'eagleeye', name: '독수리 눈', desc: '버디 이하 코인 보상 3배. 대신 모든 홀 파 -1 (최소 2)', color: '#5d4037', rarity: 3, tags: ['코인'], trade: true },
  { id: 'twincoin', name: '쌍둥이 동전', desc: '코스 위 코인 1개가 2코인', color: '#ffd54f', rarity: 1, tags: ['코인'] },
  { id: 'acehunter', name: '홀인원 사냥꾼', desc: '홀인원하면 하트 +2, 코인 +10', color: '#ffca28', rarity: 2, tags: ['첫 샷', '하트'] },
  { id: 'turtle', name: '거북이 등껍질', desc: '모든 홀 파 +1. 대신 최대 파워 -25%', color: '#558b2f', rarity: 2, tags: ['파워', '하트'], trade: true },
];
// 태그 시너지: 같은 태그 2개면 1단계, 3개 이상이면 2단계 (효과는 곱연산으로 쌓임)
export const SYNERGY = {
  코인: ['코인 획득 x1.25', '코인 획득 x1.6'],
  벽: ['벽 반사 직후 속도 +8%', '벽 반사 직후 속도 +20%'],
  범퍼: ['범퍼 파워 x1.15', '범퍼 파워 x1.35, 범퍼 맞을 때 코인 +1'],
  컵: ['컵 크기 x1.1', '컵 크기 x1.25'],
  파워: ['최대 파워 +8%', '최대 파워 +20%'],
  '첫 샷': ['홀 첫 샷 파워 +10%', '홀 첫 샷 파워 +20%, 홀인원 코인 x2'],
  하트: ['최대 하트 +1', '최대 하트 +2'],
  지형: ['모래/경사/바람 영향 -15%', '모래/경사/바람 영향 -40%'],
  조준: ['조준선 길이 x1.3', '조준선 길이 x1.7, 반사 +1'],
  상자: ['상자 부수면 코인 +1', '상자가 쉽게 부서지고 코인 +2'],
  물: ['구명조끼/스침 홀당 +1회', '구명조끼/스침 홀당 +2회'],
};
export function synergyLevels(ids) {
  const cnt = {};
  for (const id of ids) {
    const r = RELIC_MAP[id];
    if (r) for (const t of r.tags || []) cnt[t] = (cnt[t] || 0) + 1;
  }
  const lv = {};
  for (const t of Object.keys(SYNERGY)) lv[t] = cnt[t] >= 3 ? 2 : cnt[t] >= 2 ? 1 : 0;
  lv._cnt = cnt;
  return lv;
}
export const RARITY = { 1: { name: '일반', color: '#9e9e9e', w: 60 }, 2: { name: '희귀', color: '#2f80ff', w: 30 }, 3: { name: '영웅', color: '#a64dff', w: 10 } };

export const RELIC_MAP = Object.fromEntries(RELICS.map((r) => [r.id, r]));

// 유물 풀이 바닥났을 때 채우는 소모품
export const CONSUMABLES = [
  { id: '_heart', name: '하트 +1', desc: '하트 1개 회복', color: '#e91e63', consumable: true },
  { id: '_coins', name: '코인 주머니', desc: '코인 +6', color: '#fbc02d', consumable: true },
  { id: '_maxheart', name: '튼튼한 심장', desc: '최대 하트 +1', color: '#ad1457', consumable: true },
];
export const UPGRADE = { id: '_up', name: '유물 강화', color: '#00bfa5' };
export function defOf(id) {
  if (id && id.startsWith('_up:')) {
    const r = RELIC_MAP[id.slice(4)];
    return { id, name: `${r.name} 강화`, desc: `Lv2: ${r.up}`, color: UPGRADE.color, rarity: 2, tags: r.tags, upgrade: r.id };
  }
  return RELIC_MAP[id] || CONSUMABLES.find((c) => c.id === id);
}

// 코드로 그리는 유물 아이콘
export function drawRelicIcon(ctx, id, s) {
  const r = id.startsWith('_up') ? UPGRADE : RELIC_MAP[id] || CONSUMABLES.find((c) => c.id === id);
  if (id.startsWith('_up:')) id = '_up';
  const c = s / 2;
  ctx.save();
  ctx.clearRect(0, 0, s, s);
  // 배지
  const g = ctx.createLinearGradient(0, 0, 0, s);
  g.addColorStop(0, lighten(r.color, 0.35));
  g.addColorStop(1, r.color);
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.beginPath();
  ctx.arc(c, c + s * 0.04, s * 0.46, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(c, c, s * 0.45, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.7)';
  ctx.lineWidth = s * 0.04;
  ctx.stroke();
  ctx.translate(c, c);
  ctx.scale(s / 64, s / 64);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const W = '#fff';
  const D = 'rgba(0,0,0,0.55)';
  const ball = (x, y, rr = 9) => {
    ctx.fillStyle = W;
    ctx.beginPath();
    ctx.arc(x, y, rr, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.arc(x + rr * 0.3, y + rr * 0.3, rr * 0.55, 0, Math.PI * 2);
    ctx.fill();
  };
  const line = (pts, col = W, w = 4, dash) => {
    ctx.strokeStyle = col;
    ctx.lineWidth = w;
    ctx.setLineDash(dash || []);
    ctx.beginPath();
    pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    ctx.stroke();
    ctx.setLineDash([]);
  };
  const heart = (x, y, k, col) => {
    ctx.fillStyle = col;
    ctx.beginPath();
    ctx.moveTo(x, y + 8 * k);
    ctx.bezierCurveTo(x - 14 * k, y - 2 * k, x - 7 * k, y - 12 * k, x, y - 5 * k);
    ctx.bezierCurveTo(x + 7 * k, y - 12 * k, x + 14 * k, y - 2 * k, x, y + 8 * k);
    ctx.fill();
  };
  switch (id) {
    case 'sticky':
      ball(0, 2, 11);
      ctx.fillStyle = '#c5e1a5';
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.ellipse(-7 + i * 7, 14 + (i % 2) * 3, 2.5, 5, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    case 'ghost':
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      ctx.beginPath();
      ctx.arc(0, -4, 13, Math.PI, 0);
      ctx.lineTo(13, 14);
      for (let i = 0; i < 4; i++) ctx.lineTo(13 - (i + 0.5) * 6.5, i % 2 ? 14 : 9);
      ctx.lineTo(-13, 14);
      ctx.fill();
      ctx.fillStyle = D;
      ctx.beginPath();
      ctx.arc(-5, -4, 2.8, 0, 7);
      ctx.arc(5, -4, 2.8, 0, 7);
      ctx.fill();
      break;
    case 'magnet':
      line([[-12, -12], [-12, 4]], W, 8);
      line([[12, -12], [12, 4]], W, 8);
      ctx.strokeStyle = W;
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(0, 4, 12, 0, Math.PI);
      ctx.stroke();
      line([[-12, -14], [-12, -8]], '#90a4ae', 8);
      line([[12, -14], [12, -8]], '#90a4ae', 8);
      break;
    case 'mulligan':
      ctx.strokeStyle = W;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(0, 2, 13, -Math.PI * 0.9, Math.PI * 0.75);
      ctx.stroke();
      ctx.fillStyle = W;
      ctx.beginPath();
      ctx.moveTo(-20, -8);
      ctx.lineTo(-6, -10);
      ctx.lineTo(-15, 2);
      ctx.fill();
      break;
    case 'split':
      line([[0, 18], [0, 4], [-12, -10]], W, 4, [4, 4]);
      line([[0, 4], [12, -10]], W, 4, [4, 4]);
      ball(-13, -12, 7);
      ball(13, -12, 7);
      break;
    case 'longaim':
      ball(-14, 14, 6);
      line([[-14, 14], [10, -10], [0, -18]], W, 3.5, [5, 4]);
      line([[10, -10], [18, 0]], W, 3.5, [5, 4]);
      break;
    case 'bounceking':
      ctx.fillStyle = '#fff176';
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, 7);
      ctx.fill();
      ctx.fillStyle = r.color;
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, 7);
      ctx.fill();
      ctx.fillStyle = W;
      ctx.beginPath();
      ctx.moveTo(-10, -14);
      ctx.lineTo(-5, -22);
      ctx.lineTo(0, -15);
      ctx.lineTo(5, -22);
      ctx.lineTo(10, -14);
      ctx.fill();
      break;
    case 'skiwax':
      line([[-16, 10], [16, -4]], W, 5);
      line([[-16, 18], [16, 4]], W, 5);
      ctx.fillStyle = '#e1f5fe';
      ctx.fillRect(-6, -18, 12, 10);
      break;
    case 'sandproof':
      ctx.fillStyle = '#fff3c4';
      ctx.beginPath();
      ctx.ellipse(0, 6, 17, 9, 0, 0, 7);
      ctx.fill();
      line([[-16, -14], [16, 16]], '#d32f2f', 5);
      break;
    case 'waterski':
      ctx.strokeStyle = W;
      ctx.lineWidth = 4;
      for (let k = 0; k < 2; k++) {
        ctx.beginPath();
        for (let x = -18; x <= 18; x += 2) ctx.lineTo(x, 8 + k * 8 + Math.sin(x * 0.4) * 3);
        ctx.stroke();
      }
      ball(0, -8, 8);
      break;
    case 'windbreak':
      for (let i = 0; i < 3; i++) line([[-18, -10 + i * 9], [4 - i * 4, -10 + i * 9]], W, 4);
      ctx.fillStyle = '#5d4037';
      ctx.fillRect(8, -18, 7, 36);
      break;
    case 'parplus':
      ctx.fillStyle = W;
      ctx.font = 'bold 22px system-ui,sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('P+1', 0, 2);
      break;
    case 'luckytee':
      ctx.fillStyle = W;
      ctx.beginPath();
      ctx.moveTo(-10, -2);
      ctx.lineTo(10, -2);
      ctx.lineTo(2, 4);
      ctx.lineTo(2, 20);
      ctx.lineTo(-2, 20);
      ctx.lineTo(-2, 4);
      ctx.fill();
      ball(0, -11, 8);
      break;
    case 'echo':
      for (let i = 3; i >= 0; i--) {
        ctx.globalAlpha = 0.25 + (3 - i) * 0.25;
        ctx.fillStyle = W;
        ctx.beginPath();
        ctx.arc(-15 + i * 9, 10 - i * 7, 6, 0, 7);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      break;
    case 'heavy':
      ctx.fillStyle = '#cfd8dc';
      ctx.beginPath();
      ctx.arc(0, 2, 14, 0, 7);
      ctx.fill();
      ctx.fillStyle = '#546e7a';
      ctx.fillRect(-4, -18, 8, 8);
      ctx.fillStyle = D;
      ctx.font = 'bold 12px system-ui,sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('KG', 0, 4);
      break;
    case 'coinmag':
      ctx.fillStyle = '#fff59d';
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, 7);
      ctx.fill();
      ctx.strokeStyle = '#f9a825';
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.fillStyle = '#f57f17';
      ctx.font = 'bold 16px system-ui,sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('C', 0, 1);
      break;
    case 'harvest':
      heart(0, 0, 1.4, W);
      line([[0, -10], [0, -18]], '#2e7d32', 3);
      break;
    case 'brake':
      ctx.fillStyle = W;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2 + Math.PI / 8;
        ctx.lineTo(Math.cos(a) * 16, Math.sin(a) * 16);
      }
      ctx.fill();
      ctx.fillStyle = r.color;
      ctx.fillRect(-9, -3, 18, 6);
      break;
    case 'cushion':
      line([[-18, 16], [0, -12], [18, 16]], W, 4, [5, 4]);
      line([[-20, -16], [20, -16]], W, 6);
      break;
    case 'vitality':
    case '_heart':
    case '_maxheart':
      heart(0, 0, 1.6, W);
      if (id === 'vitality') {
        ctx.fillStyle = r.color;
        ctx.font = 'bold 13px system-ui,sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('+2', 0, -1);
      }
      break;
    case 'tailwind':
      ctx.strokeStyle = W;
      ctx.lineWidth = 4;
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.moveTo(-18, -10 + i * 10);
        ctx.lineTo(8, -10 + i * 10);
        ctx.arc(8, -14 + i * 10, 4, Math.PI / 2, -Math.PI / 2, true);
        ctx.stroke();
      }
      break;
    case 'bigcup':
      ctx.fillStyle = '#3e2723';
      ctx.beginPath();
      ctx.ellipse(0, 8, 16, 8, 0, 0, 7);
      ctx.fill();
      line([[2, 8], [2, -20]], W, 3);
      ctx.fillStyle = '#ff5252';
      ctx.beginPath();
      ctx.moveTo(3, -20);
      ctx.lineTo(17, -15);
      ctx.lineTo(3, -10);
      ctx.fill();
      break;
    case '_coins':
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = '#fff59d';
        ctx.beginPath();
        ctx.ellipse(-4 + i * 4, 10 - i * 8, 12, 5, 0, 0, 7);
        ctx.fill();
        ctx.strokeStyle = '#f9a825';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      break;
    case 'glass':
      ctx.globalAlpha = 0.85;
      ball(0, 0, 14);
      ctx.globalAlpha = 1;
      line([[-4, -12], [2, -3], [-3, 3], [4, 12]], '#4dd0e1', 2.5);
      break;
    case 'feather':
      ctx.fillStyle = W;
      ctx.beginPath();
      ctx.ellipse(2, -2, 8, 18, 0.6, 0, 7);
      ctx.fill();
      line([[-12, 16], [10, -14]], '#bdbdbd', 2);
      break;
    case 'bouncy':
      ctx.fillStyle = W;
      ctx.beginPath();
      ctx.ellipse(0, -2, 13, 11, 0, 0, 7);
      ctx.fill();
      line([[-14, 16], [14, 16]], W, 4);
      line([[-8, 12], [-4, 8]], W, 2);
      line([[8, 12], [4, 8]], W, 2);
      break;
    case 'greed':
    case 'gambler':
    case 'twincoin':
    case 'eagleeye': {
      const n = id === 'twincoin' ? 2 : 1;
      for (let i = 0; i < n; i++) {
        ctx.fillStyle = '#fff59d';
        ctx.beginPath();
        ctx.arc(-5 * (n - 1) + i * 10, 2 - i * 4, 11, 0, 7);
        ctx.fill();
        ctx.strokeStyle = '#f9a825';
        ctx.lineWidth = 2.5;
        ctx.stroke();
      }
      ctx.fillStyle = D;
      ctx.font = 'bold 13px system-ui,sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(id === 'greed' ? '+50' : id === 'gambler' ? 'x2' : id === 'eagleeye' ? 'x3' : '2', 0, 1);
      break;
    }
    case 'shield':
      ctx.fillStyle = W;
      ctx.beginPath();
      ctx.moveTo(0, -18);
      ctx.lineTo(15, -11);
      ctx.quadraticCurveTo(14, 10, 0, 19);
      ctx.quadraticCurveTo(-14, 10, -15, -11);
      ctx.closePath();
      ctx.fill();
      heart(0, 0, 0.9, r.color);
      break;
    case 'lifevest':
      ctx.strokeStyle = W;
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.arc(0, 0, 13, 0, 7);
      ctx.stroke();
      ctx.strokeStyle = '#e53935';
      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        ctx.arc(0, 0, 13, (i * Math.PI) / 2 - 0.25, (i * Math.PI) / 2 + 0.25);
        ctx.stroke();
      }
      break;
    case 'radar':
      ctx.strokeStyle = W;
      ctx.lineWidth = 3;
      for (const rr of [6, 12, 18]) {
        ctx.beginPath();
        ctx.arc(0, 0, rr, 0, 7);
        ctx.stroke();
      }
      line([[0, 0], [13, -13]], '#b9f6ca', 3);
      break;
    case 'carpenter':
      ctx.fillStyle = '#d99a52';
      ctx.fillRect(-12, -8, 18, 18);
      ctx.strokeStyle = '#7a4a1e';
      ctx.lineWidth = 2;
      ctx.strokeRect(-12, -8, 18, 18);
      line([[6, -16], [16, -6]], W, 5);
      line([[11, -11], [0, 6]], '#5d4037', 3);
      break;
    case 'pinball':
      for (const [x, y] of [[-10, -6], [10, -6], [0, 10]]) {
        ctx.fillStyle = W;
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, 7);
        ctx.fill();
        ctx.fillStyle = r.color;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 7);
        ctx.fill();
      }
      break;
    case 'comeback':
      heart(-5, 2, 1.1, W);
      line([[4, 12], [16, -10]], '#ffeb3b', 4);
      line([[16, -10], [9, -9]], '#ffeb3b', 4);
      break;
    case 'warpmaster':
      ctx.strokeStyle = W;
      ctx.lineWidth = 3.5;
      for (let k = 0; k < 3; k++) {
        ctx.beginPath();
        ctx.arc(0, 0, 5 + k * 5, k * 1.5, k * 1.5 + 3.8);
        ctx.stroke();
      }
      break;
    case 'sloperider':
      ctx.fillStyle = W;
      ctx.beginPath();
      ctx.moveTo(-18, 14);
      ctx.lineTo(18, 14);
      ctx.lineTo(18, -10);
      ctx.closePath();
      ctx.fill();
      ball(-4, 0, 6);
      break;
    case 'lastchance':
      heart(0, 2, 1.6, W);
      line([[-2, -8], [3, 0], [-3, 4], [2, 12]], r.color, 2.5);
      break;
    case 'acehunter':
      ctx.fillStyle = '#212121';
      ctx.beginPath();
      ctx.ellipse(0, 10, 14, 6, 0, 0, 7);
      ctx.fill();
      ctx.fillStyle = W;
      ctx.font = 'bold 18px system-ui,sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('1', 0, -6);
      break;
    case 'turtle':
      ctx.fillStyle = '#c5e1a5';
      ctx.beginPath();
      ctx.ellipse(0, 2, 16, 12, 0, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(-16, 1, 32, 5);
      ctx.strokeStyle = '#33691e';
      ctx.lineWidth = 2;
      line([[-6, -8], [-6, 1]], '#33691e', 2);
      line([[6, -8], [6, 1]], '#33691e', 2);
      ctx.fillStyle = '#c5e1a5';
      ctx.beginPath();
      ctx.arc(19, 0, 4, 0, 7);
      ctx.fill();
      break;
    case '_up':
      ctx.fillStyle = W;
      ctx.beginPath();
      ctx.moveTo(0, -18);
      ctx.lineTo(15, 0);
      ctx.lineTo(6, 0);
      ctx.lineTo(6, 16);
      ctx.lineTo(-6, 16);
      ctx.lineTo(-6, 0);
      ctx.lineTo(-15, 0);
      ctx.closePath();
      ctx.fill();
      break;
    default:
      ball(0, 0, 10);
  }
  ctx.restore();
}

function lighten(hex, t) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255,
    g = (n >> 8) & 255,
    b = n & 255;
  const f = (v) => Math.round(v + (255 - v) * t);
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}
