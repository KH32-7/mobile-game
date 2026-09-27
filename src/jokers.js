// 조커 정의 (61종)
// onScore(g, j, ctx) -> 효과 배열 [{t:'chips'|'mult'|'xmult'|'coins', v}]
// onPlace(g, j, piece, placed) -> 말풍선 문구(선택)
// onMiss(g, j) 줄을 못 지운 배치, onComboBreak(g, j), onRoundEnd(g, j) -> 코인
// passive: 게임 규칙을 바꾸는 패시브 키

const chips = (v) => ({ t: 'chips', v });
const mult = (v) => ({ t: 'mult', v });
const xmult = (v) => ({ t: 'xmult', v });
const coins = (v) => ({ t: 'coins', v });

export const JOKERS = [
  // ---------- 일반 ----------
  { id: 'rower', name: '줄꾼', rarity: 'common', hue: 350,
    desc: () => '가로줄 제거당 +4 배수',
    onScore: (g, j, ctx) => (ctx.rows.length ? [mult(4 * ctx.rows.length)] : null) },
  { id: 'vert', name: '세로본능', rarity: 'common', hue: 200,
    desc: () => '세로줄 제거당 +30 칩',
    onScore: (g, j, ctx) => (ctx.cols.length ? [chips(30 * ctx.cols.length)] : null) },
  { id: 'minimal', name: '미니멀리스트', rarity: 'common', hue: 180, grow: true,
    desc: (j) => `1~2칸 조각을 놓을 때마다 +15 칩 적립, 다음 줄 제거 때 사용 (적립 ${j.v || 0})`,
    onPlace: (g, j, piece) => { if (piece.size <= 2) { j.v = (j.v || 0) + 15; return '+15 적립'; } return null; },
    onScore: (g, j) => { if (!j.v) return null; const v = j.v; j.v = 0; return [chips(v)]; } },
  { id: 'gambler', name: '도박꾼', rarity: 'common', hue: 120,
    desc: () => '1/4 확률로 x2.5 배수',
    onScore: (g) => (g.rng.chance(0.25) ? [xmult(2.5)] : null) },
  { id: 'snowball', name: '눈덩이', rarity: 'common', hue: 195, grow: true,
    desc: (j) => `줄을 지울 때마다 칩이 +3씩 영구 성장 (현재 +${j.v || 0} 칩)`,
    onScore: (g, j, ctx) => { j.v = (j.v || 0) + 3 * ctx.lines; return [chips(j.v)]; } },
  { id: 'twins', name: '쌍둥이', rarity: 'common', hue: 230,
    desc: () => '정확히 2줄 동시 제거 시 +5 배수',
    onScore: (g, j, ctx) => (ctx.lines === 2 ? [mult(5)] : null) },
  { id: 'miner', name: '광부', rarity: 'common', hue: 35,
    desc: () => '제거된 칸 1개당 +3 칩',
    onScore: (g, j, ctx) => [chips(3 * ctx.cellCount)] },
  { id: 'vault', name: '금고지기', rarity: 'common', hue: 55,
    desc: (j) => `라운드 클리어 시 +$4 (런 전체 최대 $20, 받은 돈 $${j.v || 0})`,
    onRoundEnd: (g, j) => { const pay = Math.max(0, Math.min(4, 20 - (j.v || 0))); j.v = (j.v || 0) + pay; return pay; } },
  { id: 'lapidary', name: '세공사', rarity: 'common', hue: 310,
    desc: () => '제거된 보석 칸 1개당 +3 배수',
    onScore: (g, j, ctx) => (ctx.gemCount ? [mult(3 * ctx.gemCount)] : null) },
  { id: 'barfan', name: '막대광', rarity: 'common', hue: 260,
    desc: () => '일자 막대 조각으로 줄을 지우면 +60 칩',
    onScore: (g, j, ctx) => (ctx.piece.tags.includes('bar') ? [chips(60)] : null) },
  { id: 'vein', name: '보석 광맥', rarity: 'common', hue: 285, passive: 'gemChance',
    desc: () => '보석 박힌 조각이 훨씬 자주 등장' },
  { id: 'closer', name: '마무리 투수', rarity: 'common', hue: 15,
    desc: () => '트레이의 마지막 조각으로 줄을 지우면 +3 배수 (2줄 이상이면 +8)',
    onScore: (g, j, ctx) => (ctx.lastInTray ? [mult(ctx.lines >= 2 ? 8 : 3)] : null) },
  { id: 'recycler', name: '재활용꾼', rarity: 'common', hue: 110, grow: true,
    desc: (j) => `라운드마다 트레이 교체 +1. 교체할 때마다 +5 배수 적립, 다음 줄 제거 때 사용 (적립 ${j.v || 0})`,
    onSwap: (g, j) => { j.v = (j.v || 0) + 5; },
    onScore: (g, j) => { if (!j.v) return null; const v = j.v; j.v = 0; return [mult(v)]; } },
  { id: 'piggy', name: '저금통', rarity: 'common', hue: 340,
    desc: (j) => `줄 제거 시 1/3 확률로 +$1 (런 전체 최대 $12, 모은 돈 $${j.v || 0})`,
    onScore: (g, j) => { if ((j.v || 0) >= 12 || !g.rng.chance(1 / 3)) return null; j.v = (j.v || 0) + 1; return [coins(1)]; } },
  { id: 'redchip', name: '레드 칩', rarity: 'common', hue: 0,
    desc: () => '+4 배수',
    onScore: () => [mult(4)] },
  { id: 'bluechip', name: '블루 칩', rarity: 'common', hue: 215,
    desc: () => '+40 칩',
    onScore: () => [chips(40)] },
  { id: 'squarefan', name: '네모 신사', rarity: 'common', hue: 45,
    desc: () => '2x2 네모 조각으로 줄을 지우면 +5 배수',
    onScore: (g, j, ctx) => (ctx.piece.tags.includes('square') ? [mult(5)] : null) },
  { id: 'lshape', name: 'L자 집사', rarity: 'common', hue: 150,
    desc: () => 'L자 조각으로 줄을 지우면 +50 칩',
    onScore: (g, j, ctx) => (ctx.piece.tags.includes('L') ? [chips(50)] : null) },
  { id: 'tfan', name: 'T자 요정', rarity: 'common', hue: 275,
    desc: () => 'T자 조각으로 줄을 지우면 +5 배수',
    onScore: (g, j, ctx) => (ctx.piece.tags.includes('T') ? [mult(5)] : null) },
  { id: 'zigzag', name: '지그재그', rarity: 'common', hue: 100,
    desc: () => 'S/Z 조각으로 줄을 지우면 +5 배수',
    onScore: (g, j, ctx) => (ctx.piece.tags.includes('S') ? [mult(5)] : null) },
  { id: 'edge', name: '벼랑 끝', rarity: 'common', hue: 20,
    desc: () => '보드 가장자리 줄(맨 위/아래/왼쪽/오른쪽)을 지울 때마다 +4 배수',
    onScore: (g, j, ctx) => (ctx.edgeLines ? [mult(4 * ctx.edgeLines)] : null) },
  { id: 'center', name: '한가운데', rarity: 'common', hue: 170,
    desc: () => '가운데 줄(4, 5번째)을 지울 때마다 +40 칩',
    onScore: (g, j, ctx) => (ctx.centerLines ? [chips(40 * ctx.centerLines)] : null) },
  { id: 'parity', name: '짝수 광대', rarity: 'common', hue: 250,
    desc: () => '짝수 번째 배치로 줄을 지우면 +5 배수',
    onScore: (g) => (g.placedCount % 2 === 0 ? [mult(5)] : null) },
  { id: 'firststrike', name: '선제공격', rarity: 'common', hue: 5,
    desc: () => '트레이의 첫 조각으로 줄을 지우면 +50 칩',
    onScore: (g, j, ctx) => (ctx.firstInTray ? [chips(50)] : null) },
  { id: 'goldrush', name: '골드러시', rarity: 'common', hue: 50,
    desc: () => '금 보석 칸을 지울 때마다 +$1',
    onScore: (g, j, ctx) => (ctx.goldCount ? [coins(ctx.goldCount)] : null) },
  { id: 'blocky', name: '벽돌공', rarity: 'common', hue: 25,
    desc: () => '줄을 지운 조각의 칸 수 x 6 칩',
    onScore: (g, j, ctx) => [chips(6 * ctx.piece.size)] },
  { id: 'crowd', name: '만원 버스', rarity: 'common', hue: 330,
    desc: () => '제거 후 보드에 블록이 20개 이상 남으면 +6 배수',
    onScore: (g, j, ctx) => (ctx.remainingAfter >= 20 ? [mult(6)] : null) },
  { id: 'tip', name: '팁 항아리', rarity: 'common', hue: 90,
    desc: () => '라운드 클리어 시 남은 트레이 1개당 +$1 추가',
    onRoundEnd: (g) => g.handsLeft },

  // ---------- 고급 ----------
  { id: 'corner', name: '모서리 사냥꾼', rarity: 'uncommon', hue: 30,
    desc: () => '제거한 줄에 모서리 칸이 있으면 x1.5 배수',
    onScore: (g, j, ctx) => (ctx.hasCorner ? [xmult(1.5)] : null) },
  { id: 'chain', name: '연쇄광', rarity: 'uncommon', hue: 280, grow: true,
    desc: (j) => `콤보마다 +1 배수 누적, 콤보가 끊기면 초기화 (현재 +${j.v || 0})`,
    onScore: (g, j) => { j.v = (j.v || 0) + 1; return [mult(j.v)]; },
    onComboBreak: (g, j) => { j.v = 0; } },
  { id: 'bigblock', name: '빅블록', rarity: 'uncommon', hue: 25, grow: true,
    desc: (j) => `3x3 조각을 놓으면 다음 줄 제거 x3 배수${j.v ? ' (충전됨)' : ''}`,
    onPlace: (g, j, piece) => { if (piece.id === 'o3') { j.v = 1; return '충전!'; } return null; },
    onScore: (g, j) => { if (!j.v) return null; j.v = 0; return [xmult(3)]; } },
  { id: 'jeweler', name: '보석상', rarity: 'uncommon', hue: 300, passive: 'gemDouble',
    desc: () => '보석 칸 효과가 2번 발동' },
  { id: 'rich', name: '부자', rarity: 'uncommon', hue: 50,
    desc: (j, g) => `보유 코인 $5당 +1 배수${g ? ` (현재 +${Math.floor(g.coins / 5)})` : ''}`,
    onScore: (g) => { const v = Math.floor(g.coins / 5); return v ? [mult(v)] : null; } },
  { id: 'cross', name: '십자포화', rarity: 'uncommon', hue: 10,
    desc: () => '가로줄과 세로줄을 동시에 제거하면 x2 배수',
    onScore: (g, j, ctx) => (ctx.rows.length && ctx.cols.length ? [xmult(2)] : null) },
  { id: 'saver', name: '절약왕', rarity: 'uncommon', hue: 140,
    desc: () => '남은 트레이 1개당 +1 배수',
    onScore: (g) => (g.handsLeft ? [mult(g.handsLeft)] : null) },
  { id: 'lastchance', name: '막판뒤집기', rarity: 'uncommon', hue: 330,
    desc: () => '마지막 트레이에서 x2 배수',
    onScore: (g) => (g.handsLeft === 0 ? [xmult(2)] : null) },
  { id: 'tidy', name: '깔끔쟁이', rarity: 'uncommon', hue: 170,
    desc: () => '제거 후 보드에 남은 블록이 12개 이하면 +6 배수',
    onScore: (g, j, ctx) => (ctx.remainingAfter <= 12 ? [mult(6)] : null) },
  { id: 'comboamp', name: '콤보 증폭기', rarity: 'uncommon', hue: 190,
    desc: () => '콤보 1당 +3 배수',
    onScore: (g, j, ctx) => (ctx.combo > 1 ? [mult(3 * (ctx.combo - 1))] : null) },
  { id: 'steady', name: '꾸준이', rarity: 'uncommon', hue: 120, grow: true,
    desc: (j) => `라운드를 클리어할 때마다 +3 배수 영구 성장 (현재 +${j.v || 0})`,
    onScore: (g, j) => (j.v ? [mult(j.v)] : null),
    onRoundEnd: (g, j) => { j.v = (j.v || 0) + 3; return 0; } },
  { id: 'astronomer', name: '천문학자', rarity: 'uncommon', hue: 235,
    desc: () => '줄 강화 레벨이 오른 만큼(레벨 합계 - 5) +2 배수',
    onScore: (g) => { const v = g.levelSum() - 5; return v > 0 ? [mult(2 * v)] : null; } },
  { id: 'miser', name: '수전노', rarity: 'uncommon', hue: 60,
    desc: () => '보유 코인 $1당 +3 칩',
    onScore: (g) => (g.coins > 0 ? [chips(3 * g.coins)] : null) },
  { id: 'sniper', name: '저격수', rarity: 'uncommon', hue: 355,
    desc: () => '정확히 1줄만 제거하면 x1.5 배수',
    onScore: (g, j, ctx) => (ctx.lines === 1 ? [xmult(1.5)] : null) },
  { id: 'echo', name: '메아리', rarity: 'uncommon', hue: 205,
    desc: () => '직전 제거와 같은 줄 수를 지우면 x1.5 배수',
    onScore: (g, j, ctx) => (ctx.prevLines === ctx.lines ? [xmult(1.5)] : null) },
  { id: 'gemcutter', name: '원석 가공사', rarity: 'uncommon', hue: 320,
    desc: () => '조각을 놓을 때 1/4 확률로 한 칸에 루비가 박힘',
    onPlace: (g, j, piece, placed) => {
      if (!placed || !g.rng.chance(0.25)) return null;
      const free = placed.filter((p) => !p.gem);
      if (!free.length) return null;
      const p = g.rng.pick(free);
      const cell = g.board[p.r * 8 + p.c];
      if (cell) { cell.gem = 'ruby'; p.gem = 'ruby'; }
      return '루비!';
    } },
  { id: 'mirror', name: '거울 광대', rarity: 'uncommon', hue: 185,
    desc: () => '가로줄 수와 세로줄 수가 같게 지우면 x1.8 배수',
    onScore: (g, j, ctx) => (ctx.rows.length && ctx.rows.length === ctx.cols.length ? [xmult(1.8)] : null) },
  { id: 'patience', name: '인내심', rarity: 'uncommon', hue: 80, grow: true,
    desc: (j) => `줄을 못 지운 배치마다 +2 배수 적립, 줄 제거 때 사용 (적립 ${j.v || 0})`,
    onMiss: (g, j) => { j.v = (j.v || 0) + 2; },
    onScore: (g, j) => { if (!j.v) return null; const v = j.v; j.v = 0; return [mult(v)]; } },
  { id: 'trayhoard', name: '트레이 저축왕', rarity: 'uncommon', hue: 160,
    desc: () => '남은 트레이 1개당 +15 칩',
    onScore: (g) => (g.handsLeft ? [chips(15 * g.handsLeft)] : null) },
  { id: 'bank', name: '중앙은행', rarity: 'uncommon', hue: 45, passive: 'freeReroll',
    desc: () => '상점마다 첫 리롤 무료' },

  // ---------- 빌드 축 (서로 배타적) ----------
  { id: 'horizon', name: '수평주의자', rarity: 'uncommon', hue: 355,
    desc: () => '[가로 특화] 가로줄만 지우면 x1.6 배수, 세로줄이 섞이면 x0.5',
    onScore: (g, j, ctx) => (ctx.rows.length && !ctx.cols.length ? [xmult(1.6)] : ctx.cols.length ? [xmult(0.5)] : null) },
  { id: 'vertigo', name: '수직주의자', rarity: 'uncommon', hue: 205,
    desc: () => '[세로 특화] 세로줄만 지우면 x1.6 배수, 가로줄이 섞이면 x0.5',
    onScore: (g, j, ctx) => (ctx.cols.length && !ctx.rows.length ? [xmult(1.6)] : ctx.rows.length ? [xmult(0.5)] : null) },
  { id: 'zealot', name: '보석 광신도', rarity: 'rare', hue: 300,
    desc: () => '[보석 특화] 제거된 보석 1개당 x1.3 배수, 보석이 없으면 x0.6',
    onScore: (g, j, ctx) => (ctx.gemCount ? [xmult(Math.pow(1.3, ctx.gemCount))] : [xmult(0.6)]) },
  { id: 'sprinter', name: '폭주족', rarity: 'rare', hue: 20,
    desc: () => '[콤보 특화] 콤보 1당 x0.3 배수 추가, 콤보가 1이면 x0.5',
    onScore: (g, j, ctx) => (ctx.combo > 1 ? [xmult(1 + 0.3 * (ctx.combo - 1))] : [xmult(0.5)]) },

  // ---------- 희귀 ----------
  { id: 'empty', name: '빈자리', rarity: 'rare', hue: 160,
    desc: () => '제거 후 보드가 완전히 비면 x4 배수 + $5',
    onScore: (g, j, ctx) => (ctx.boardEmptyAfter ? [xmult(4), coins(5)] : null) },
  { id: 'sweep', name: '대청소', rarity: 'rare', hue: 0,
    desc: () => '3줄 이상 동시 제거 시 x3 배수',
    onScore: (g, j, ctx) => (ctx.lines >= 3 ? [xmult(3)] : null) },
  { id: 'collector', name: '수집가', rarity: 'rare', hue: 45, grow: true,
    desc: (j) => `2줄 이상 동시 제거할 때마다 x0.25 배수 성장 (현재 x${(1 + (j.v || 0)).toFixed(2)})`,
    onScore: (g, j, ctx) => {
      if (ctx.lines >= 2) j.v = (j.v || 0) + 0.25;
      return j.v ? [xmult(1 + j.v)] : null;
    } },
  { id: 'steelheart', name: '강철심장', rarity: 'rare', hue: 215, passive: 'steelBoost',
    desc: () => '강철 칸 효과가 x1.2 대신 x1.5' },
  { id: 'dupe', name: '복제 인형', rarity: 'rare', hue: 200,
    desc: () => '바로 오른쪽 조커의 점수 효과를 복사' },
  { id: 'glasscannon', name: '유리 대포', rarity: 'rare', hue: 190, passive: 'glassCannon',
    desc: () => '유리 보석이 x1.5 대신 x2.5, 대신 깨질 확률 50%' },
  { id: 'hexed', name: '흑마술사', rarity: 'rare', hue: 290, grow: true,
    desc: (j) => `보스를 격파할 때마다 x0.5 배수 성장 (현재 x${(1 + (j.v || 0)).toFixed(1)})`,
    onScore: (g, j) => (j.v ? [xmult(1 + j.v)] : null),
    onRoundEnd: (g, j) => { if (g.blind === 2) j.v = (j.v || 0) + 0.5; return 0; } },
  { id: 'quadra', name: '사중주', rarity: 'rare', hue: 265,
    desc: () => '4줄 이상 동시 제거 시 x5 배수',
    onScore: (g, j, ctx) => (ctx.lines >= 4 ? [xmult(5)] : null) },
  { id: 'momentum', name: '모멘텀', rarity: 'rare', hue: 15,
    desc: () => '한 트레이 안에서 2번째 제거 x1.5, 3번째 제거 x2 배수',
    onScore: (g, j, ctx) => (ctx.trayClears >= 2 ? [xmult(1 + 0.5 * (ctx.trayClears - 1))] : null) },

  // ---------- 전설 ----------
  { id: 'jesterking', name: '광대왕', rarity: 'legendary', hue: 45,
    desc: () => '언제나 x3 배수',
    onScore: () => [xmult(3)] },
  { id: 'infinity', name: '무한궤도', rarity: 'legendary', hue: 280,
    desc: () => '콤보 1당 x0.5 배수 (콤보 4면 x2.5)',
    onScore: (g, j, ctx) => (ctx.combo > 1 ? [xmult(1 + 0.5 * (ctx.combo - 1))] : null) },
  { id: 'midas', name: '미다스', rarity: 'legendary', hue: 50, passive: 'midas',
    desc: () => '모든 새 조각 한 칸에 금 보석, 금 보석이 x1.3 배수도 추가' },
  { id: 'phoenix', name: '불사조', rarity: 'legendary', hue: 15, passive: 'phoenix',
    desc: () => '게임 오버를 1번 막고 보드를 비운 뒤 트레이 +1 (발동 후 사라짐)' },
  { id: 'architect', name: '설계자', rarity: 'legendary', hue: 220, passive: 'architect',
    desc: () => '모든 줄 강화 레벨 +2로 취급' },
];

export const JOKER_BY_ID = Object.fromEntries(JOKERS.map((j) => [j.id, j]));

export const RARITY_LABEL = { common: '일반', uncommon: '고급', rare: '희귀', legendary: '전설' };
export const RARITY_COLOR = { common: '#4fa3ff', uncommon: '#3ddc97', rare: '#ff4d6d', legendary: '#c86bff' };

// 에디션
export const EDITIONS = {
  foil: { name: '포일', desc: '+30 칩', color: '#9fd8ff', price: 2 },
  holo: { name: '홀로', desc: '+6 배수', color: '#ff9ff0', price: 3 },
  poly: { name: '폴리크롬', desc: 'x1.5 배수', color: '#ffe066', price: 5 },
  neg: { name: '네거티브', desc: '조커 슬롯 +1', color: '#d0d0ff', price: 5 },
};

export function editionEffect(ed) {
  if (ed === 'foil') return { t: 'chips', v: 30 };
  if (ed === 'holo') return { t: 'mult', v: 6 };
  if (ed === 'poly') return { t: 'xmult', v: 1.5 };
  return null;
}

export function jokerDesc(inst, g) {
  const d = JOKER_BY_ID[inst.id];
  let s = d.desc(inst, g);
  if (inst.ed && EDITIONS[inst.ed]) s += ` · ${EDITIONS[inst.ed].name}: ${EDITIONS[inst.ed].desc}`;
  return s;
}

export function effectLabel(e) {
  if (e.t === 'chips') return `+${fmt(e.v)} 칩`;
  if (e.t === 'mult') return `+${fmt(e.v)} 배수`;
  if (e.t === 'xmult') return `x${+e.v.toFixed(2)} 배수`;
  if (e.t === 'coins') return `+$${e.v}`;
  return '';
}

export function fmt(n) {
  if (n >= 1e9) return (n / 1e9).toFixed(2).replace(/\.?0+$/, '') + 'B';
  if (n >= 1e6) return (n / 1e6).toFixed(n >= 1e7 ? 1 : 2).replace(/\.?0+$/, '') + 'M';
  if (Math.abs(n - Math.round(n)) > 0.001) return n.toFixed(1);
  return Math.round(n).toLocaleString('en-US');
}
