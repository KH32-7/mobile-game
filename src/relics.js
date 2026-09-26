// 유물 정의 (22종). 효과 구현은 physics.js / game.js 에서 id 로 참조함
export const RELICS = [
  { id: 'sticky', name: '끈끈이 공', desc: '벽에 닿으면 속도의 절반을 흡수해서 멀리 튀지 않음', color: '#8bc34a', rarity: 1 },
  { id: 'ghost', name: '유령 공', desc: '샷마다 안쪽 벽 1번을 그대로 통과', color: '#b39ddb', rarity: 2 },
  { id: 'magnet', name: '자석 컵', desc: '컵 흡입 반경 2배', color: '#ef5350', rarity: 2 },
  { id: 'mulligan', name: '멀리건', desc: '홀마다 1번, 방금 친 샷을 되돌림', color: '#ffb300', rarity: 2 },
  { id: 'split', name: '분열 샷', desc: '홀 첫 샷에 공이 2개로 갈라짐. 하나만 들어가도 성공', color: '#26c6da', rarity: 3 },
  { id: 'longaim', name: '긴 조준선', desc: '조준선이 반사 3회까지 보임', color: '#42a5f5', rarity: 1 },
  { id: 'bounceking', name: '바운스 킹', desc: '범퍼 반발 1.5배, 범퍼에 맞을 때마다 코인 +1', color: '#ec407a', rarity: 1 },
  { id: 'skiwax', name: '스키 왁스', desc: '얼음 위를 구르는 중 화면을 탭하면 그 방향으로 꺾음 (샷당 1회)', color: '#80deea', rarity: 1 },
  { id: 'sandproof', name: '모래 무시', desc: '모래가 잔디처럼 굴러감', color: '#e0c068', rarity: 1 },
  { id: 'waterski', name: '수상 스키', desc: '샷마다 물 위를 한 번 스치고 지나감', color: '#29b6f6', rarity: 2 },
  { id: 'windbreak', name: '바람막이', desc: '바람을 무시하고 경사 영향이 절반', color: '#a1887f', rarity: 1 },
  { id: 'parplus', name: '파 여유', desc: '모든 홀의 파 +1', color: '#66bb6a', rarity: 3 },
  { id: 'luckytee', name: '행운의 티', desc: '홀 첫 샷 파워 1.3배', color: '#ff7043', rarity: 1 },
  { id: 'echo', name: '에코 샷', desc: '직전 샷의 궤적이 유령처럼 남음', color: '#9575cd', rarity: 1 },
  { id: 'heavy', name: '쇳덩이 공', desc: '상자를 쉽게 부수고 경사와 바람을 덜 탐', color: '#78909c', rarity: 1 },
  { id: 'coinmag', name: '동전 자석', desc: '코스 코인 줍는 범위 3배, 홀마다 코인 +1', color: '#fdd835', rarity: 1 },
  { id: 'harvest', name: '하트 수확', desc: '버디 이하로 끝내면 하트가 반드시 회복', color: '#f06292', rarity: 2 },
  { id: 'brake', name: '브레이크', desc: '공이 구르는 중 두 번 탭하면 즉시 멈춤 (샷당 1회)', color: '#e53935', rarity: 2 },
  { id: 'cushion', name: '당구 달인', desc: '벽 반발 증가, 조준선 반사 +1', color: '#5c6bc0', rarity: 1 },
  { id: 'vitality', name: '여분의 심장', desc: '최대 하트 +2, 하트 2 회복', color: '#d81b60', rarity: 2 },
  { id: 'tailwind', name: '순풍', desc: '최대 파워 +25%', color: '#4db6ac', rarity: 1 },
  { id: 'bigcup', name: '큰 컵', desc: '컵 크기 1.35배, 빠른 공도 잘 들어감', color: '#8d6e63', rarity: 2 },
];

export const RELIC_MAP = Object.fromEntries(RELICS.map((r) => [r.id, r]));

// 유물 풀이 바닥났을 때 채우는 소모품
export const CONSUMABLES = [
  { id: '_heart', name: '하트 +1', desc: '하트 1개 회복', color: '#e91e63', consumable: true },
  { id: '_coins', name: '코인 주머니', desc: '코인 +6', color: '#fbc02d', consumable: true },
];

// 코드로 그리는 유물 아이콘
export function drawRelicIcon(ctx, id, s) {
  const r = RELIC_MAP[id] || CONSUMABLES.find((c) => c.id === id);
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
