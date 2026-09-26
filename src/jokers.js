// 조커 정의
// onScore(g, j, ctx) -> 효과 배열 [{t:'chips'|'mult'|'xmult'|'coins', v}]
// onPlace(g, j, piece) -> 말풍선 문구(선택)
// onComboBreak(g, j), onRoundEnd(g, j) -> 코인, 패시브는 flags 로 표시

const chips = (v) => ({ t: 'chips', v });
const mult = (v) => ({ t: 'mult', v });
const xmult = (v) => ({ t: 'xmult', v });
const coins = (v) => ({ t: 'coins', v });

export const JOKERS = [
  {
    id: 'rower', name: '줄꾼', rarity: 'common', glyph: '═', hue: 350,
    desc: () => '가로줄 제거당 +4 배수',
    onScore: (g, j, ctx) => (ctx.rows.length ? [mult(4 * ctx.rows.length)] : null),
  },
  {
    id: 'vert', name: '세로본능', rarity: 'common', glyph: '║', hue: 200,
    desc: () => '세로줄 제거당 +30 칩',
    onScore: (g, j, ctx) => (ctx.cols.length ? [chips(30 * ctx.cols.length)] : null),
  },
  {
    id: 'corner', name: '모서리 사냥꾼', rarity: 'uncommon', glyph: '◰', hue: 30,
    desc: () => '제거한 줄에 모서리 칸이 있으면 x2 배수',
    onScore: (g, j, ctx) => (ctx.hasCorner ? [xmult(2)] : null),
  },
  {
    id: 'chain', name: '연쇄광', rarity: 'uncommon', glyph: '∞', hue: 280, grow: true,
    desc: (j) => `콤보마다 +1 배수 누적, 콤보가 끊기면 초기화 (현재 +${j.v || 0})`,
    onScore: (g, j) => { j.v = (j.v || 0) + 1; return [mult(j.v)]; },
    onComboBreak: (g, j) => { j.v = 0; },
  },
  {
    id: 'minimal', name: '미니멀리스트', rarity: 'common', glyph: '▪', hue: 180, grow: true,
    desc: (j) => `1~2칸 조각을 놓을 때마다 +15 칩 적립, 다음 줄 제거 때 사용 (적립 ${j.v || 0})`,
    onPlace: (g, j, piece) => { if (piece.size <= 2) { j.v = (j.v || 0) + 15; return '+15 적립'; } return null; },
    onScore: (g, j) => { if (!j.v) return null; const v = j.v; j.v = 0; return [chips(v)]; },
  },
  {
    id: 'bigblock', name: '빅블록', rarity: 'uncommon', glyph: '▣', hue: 25, grow: true,
    desc: (j) => `3x3 조각을 놓으면 다음 줄 제거 x3 배수${j.v ? ' (충전됨)' : ''}`,
    onPlace: (g, j, piece) => { if (piece.id === 'o3') { j.v = 1; return '충전!'; } return null; },
    onScore: (g, j) => { if (!j.v) return null; j.v = 0; return [xmult(3)]; },
  },
  {
    id: 'empty', name: '빈자리', rarity: 'rare', glyph: '□', hue: 160,
    desc: () => '제거 후 보드가 완전히 비면 x4 배수 + $5',
    onScore: (g, j, ctx) => (ctx.boardEmptyAfter ? [xmult(4), coins(5)] : null),
  },
  {
    id: 'gambler', name: '도박꾼', rarity: 'common', glyph: '⚂', hue: 120,
    desc: () => '1/4 확률로 x4 배수',
    onScore: (g) => (g.rng.chance(0.25) ? [xmult(4)] : null),
  },
  {
    id: 'jeweler', name: '보석상', rarity: 'uncommon', glyph: '◆', hue: 300, passive: 'gemDouble',
    desc: () => '보석 칸 효과가 2번 발동',
  },
  {
    id: 'rich', name: '부자', rarity: 'uncommon', glyph: '$', hue: 50,
    desc: (j, g) => `보유 코인 $5당 +1 배수${g ? ` (현재 +${Math.floor(g.coins / 5)})` : ''}`,
    onScore: (g) => { const v = Math.floor(g.coins / 5); return v ? [mult(v)] : null; },
  },
  {
    id: 'sweep', name: '대청소', rarity: 'rare', glyph: '≡', hue: 0,
    desc: () => '3줄 이상 동시 제거 시 x3 배수',
    onScore: (g, j, ctx) => (ctx.lines >= 3 ? [xmult(3)] : null),
  },
  {
    id: 'snowball', name: '눈덩이', rarity: 'common', glyph: '❄', hue: 195, grow: true,
    desc: (j) => `줄을 지울 때마다 칩이 +3씩 영구 성장 (현재 +${j.v || 0} 칩)`,
    onScore: (g, j, ctx) => { j.v = (j.v || 0) + 3 * ctx.lines; return [chips(j.v)]; },
  },
  {
    id: 'collector', name: '수집가', rarity: 'rare', glyph: '✦', hue: 45, grow: true,
    desc: (j) => `2줄 이상 동시 제거할 때마다 x0.25 배수 성장 (현재 x${(1 + (j.v || 0)).toFixed(2)})`,
    onScore: (g, j, ctx) => {
      if (ctx.lines >= 2) j.v = (j.v || 0) + 0.25;
      return j.v ? [xmult(1 + j.v)] : null;
    },
  },
  {
    id: 'twins', name: '쌍둥이', rarity: 'common', glyph: '‖', hue: 230,
    desc: () => '정확히 2줄 동시 제거 시 +8 배수',
    onScore: (g, j, ctx) => (ctx.lines === 2 ? [mult(8)] : null),
  },
  {
    id: 'cross', name: '십자포화', rarity: 'uncommon', glyph: '✚', hue: 10,
    desc: () => '가로줄과 세로줄을 동시에 제거하면 x2.5 배수',
    onScore: (g, j, ctx) => (ctx.rows.length && ctx.cols.length ? [xmult(2.5)] : null),
  },
  {
    id: 'miner', name: '광부', rarity: 'common', glyph: '⛏', hue: 35,
    desc: () => '제거된 칸 1개당 +3 칩',
    onScore: (g, j, ctx) => [chips(3 * ctx.cellCount)],
  },
  {
    id: 'vault', name: '금고지기', rarity: 'common', glyph: '▤', hue: 55,
    desc: () => '라운드 클리어 시 +$4',
    onRoundEnd: () => 4,
  },
  {
    id: 'saver', name: '절약왕', rarity: 'uncommon', glyph: '⌂', hue: 140,
    desc: () => '남은 트레이 1개당 +2 배수',
    onScore: (g) => (g.handsLeft ? [mult(2 * g.handsLeft)] : null),
  },
  {
    id: 'lastchance', name: '막판뒤집기', rarity: 'uncommon', glyph: '!', hue: 330,
    desc: () => '마지막 트레이에서 x3 배수',
    onScore: (g) => (g.handsLeft === 0 ? [xmult(3)] : null),
  },
  {
    id: 'lapidary', name: '세공사', rarity: 'common', glyph: '◇', hue: 310,
    desc: () => '제거된 보석 칸 1개당 +3 배수',
    onScore: (g, j, ctx) => (ctx.gemCount ? [mult(3 * ctx.gemCount)] : null),
  },
  {
    id: 'barfan', name: '막대광', rarity: 'common', glyph: '┃', hue: 260,
    desc: () => '일자 막대 조각으로 줄을 지우면 +60 칩',
    onScore: (g, j, ctx) => (ctx.piece.tags.includes('bar') ? [chips(60)] : null),
  },
  {
    id: 'steelheart', name: '강철심장', rarity: 'rare', glyph: '⬢', hue: 215, passive: 'steelBoost',
    desc: () => '강철 칸 효과가 x1.2 대신 x1.5',
  },
  {
    id: 'vein', name: '보석 광맥', rarity: 'common', glyph: '⟡', hue: 285, passive: 'gemChance',
    desc: () => '보석 박힌 조각이 훨씬 자주 등장',
  },
  {
    id: 'closer', name: '마무리 투수', rarity: 'common', glyph: '➤', hue: 15,
    desc: () => '트레이의 마지막 조각으로 줄을 지우면 +10 배수',
    onScore: (g, j, ctx) => (ctx.lastInTray ? [mult(10)] : null),
  },
  {
    id: 'tidy', name: '깔끔쟁이', rarity: 'uncommon', glyph: '✧', hue: 170,
    desc: () => '제거 후 보드에 남은 블록이 12개 이하면 +12 배수',
    onScore: (g, j, ctx) => (ctx.remainingAfter <= 12 ? [mult(12)] : null),
  },
  {
    id: 'piggy', name: '저금통', rarity: 'common', glyph: '◎', hue: 340,
    desc: () => '줄 제거 시 1/3 확률로 +$1',
    onScore: (g) => (g.rng.chance(1 / 3) ? [coins(1)] : null),
  },
];

export const JOKER_BY_ID = Object.fromEntries(JOKERS.map((j) => [j.id, j]));

export const RARITY_LABEL = { common: '일반', uncommon: '고급', rare: '희귀' };
export const RARITY_COLOR = { common: '#4fa3ff', uncommon: '#3ddc97', rare: '#ff4d6d' };

export function jokerDesc(inst, g) {
  const d = JOKER_BY_ID[inst.id];
  return d.desc(inst, g);
}

export function effectLabel(e) {
  if (e.t === 'chips') return `+${fmt(e.v)} 칩`;
  if (e.t === 'mult') return `+${fmt(e.v)} 배수`;
  if (e.t === 'xmult') return `x${+e.v.toFixed(2)} 배수`;
  if (e.t === 'coins') return `+$${e.v}`;
  return '';
}

export function fmt(n) {
  if (n >= 1e6) return (n / 1e6).toFixed(n >= 1e7 ? 1 : 2).replace(/\.0+$/, '') + 'M';
  if (Math.abs(n - Math.round(n)) > 0.001) return n.toFixed(1);
  return Math.round(n).toLocaleString('en-US');
}
