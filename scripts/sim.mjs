// 밸런스 시뮬레이션
// 사용: node scripts/sim.mjs [runs] [buy] [place] [stake]
//   buy: 0 = 구매 안 함, 1 = 합리적 구매, 2 = 비싼 조커부터 구매
//   place: greedy = 한 수 탐욕, tray = 트레이 전체(2수) 탐색
import { Game } from '../src/game.js';
import { JOKER_BY_ID } from '../src/jokers.js';

const runs = +(process.argv[2] || 40);
const buyMode = +(process.argv[3] ?? 1);
const placeMode = process.argv[4] || 'tray';
const stake = +(process.argv[5] || 1);
const N = 8;

// 가벼운 보드 (0/1) 위에서 평가
function toBits(g) { const b = new Uint8Array(64); for (let k = 0; k < 64; k++) b[k] = g.board[k] ? 1 : 0; return b; }
function fits(b, shape, r, c) {
  for (const [dr, dc] of shape.cells) { const rr = r + dr, cc = c + dc; if (rr < 0 || cc < 0 || rr >= N || cc >= N || b[rr * N + cc]) return false; }
  return true;
}
function applyMove(b, shape, r, c) {
  const nb = b.slice();
  for (const [dr, dc] of shape.cells) nb[(r + dr) * N + c + dc] = 1;
  const rows = [], cols = [];
  for (let i = 0; i < N; i++) {
    let fr = true, fc = true;
    for (let j = 0; j < N; j++) { if (!nb[i * N + j]) fr = false; if (!nb[j * N + i]) fc = false; }
    if (fr) rows.push(i); if (fc) cols.push(i);
  }
  for (const i of rows) for (let j = 0; j < N; j++) nb[i * N + j] = 0;
  for (const i of cols) for (let j = 0; j < N; j++) nb[j * N + i] = 0;
  return { nb, lines: rows.length + cols.length };
}
function evalBits(b) {
  let pen = 0, filled = 0;
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    const f = b[r * N + c]; filled += f;
    if (c < N - 1 && f !== b[r * N + c + 1]) pen++;
    if (r < N - 1 && f !== b[(r + 1) * N + c]) pen++;
    if (!f) {
      let n = 0;
      if (r > 0 && !b[(r - 1) * N + c]) n++; if (r < N - 1 && !b[(r + 1) * N + c]) n++;
      if (c > 0 && !b[r * N + c - 1]) n++; if (c < N - 1 && !b[r * N + c + 1]) n++;
      if (n === 0) pen += 4;
    }
  }
  return -pen - filled * 0.15;
}
function movesFor(b, pieces) {
  const out = [];
  pieces.forEach((p, i) => {
    if (!p || p.hidden) return;
    for (let r = 0; r <= N - p.shape.h; r++) for (let c = 0; c <= N - p.shape.w; c++) {
      if (!fits(b, p.shape, r, c)) continue;
      const { nb, lines } = applyMove(b, p.shape, r, c);
      out.push({ i, r, c, nb, lines, s: lines * 40 + lines * lines * 12 + evalBits(nb) });
    }
  });
  return out;
}
function bestMove(g) {
  const b = toBits(g);
  const moves = movesFor(b, g.tray);
  if (!moves.length) return null;
  if (placeMode === 'greedy') return moves.reduce((a, m) => (m.s > a.s ? m : a));
  // 트레이 전체 탐색 (가지치기한 3수 탐색)
  const lineScore = (l) => l * 40 + l * l * 12;
  moves.sort((a, m) => m.s - a.s);
  let best = null;
  for (const m of moves.slice(0, 8)) {
    const rest = g.tray.map((p, k) => (k === m.i ? null : p));
    let s;
    if (!rest.some(Boolean)) s = m.s;
    else {
      const m2 = movesFor(m.nb, rest).sort((a, x) => x.s - a.s);
      if (!m2.length) s = m.s - 500;
      else {
        s = -Infinity;
        for (const x of m2.slice(0, 6)) {
          const rest2 = rest.map((p, k) => (k === x.i ? null : p));
          let s2;
          if (!rest2.some(Boolean)) s2 = x.s;
          else {
            const m3 = movesFor(x.nb, rest2);
            s2 = m3.length ? lineScore(x.lines) + Math.max(...m3.map((y) => y.s)) : x.s - 500;
          }
          s = Math.max(s, lineScore(m.lines) + s2);
        }
      }
    }
    if (!best || s > best.s2) best = { ...m, s2: s };
  }
  return best;
}

const RV = { common: 1, uncommon: 2, rare: 3.2, legendary: 5 };
const EV = { foil: 0.5, holo: 0.8, poly: 1.5, neg: 2 };
const val = (o) => RV[JOKER_BY_ID[o.id].rarity] + (o.ed ? EV[o.ed] : 0);

function shopBot(g) {
  const s = g.shop;
  if (buyMode === 2) {
    for (let pass = 0; pass < 3; pass++) {
      const offers = s.jokers.map((o, i) => ({ o, i })).filter((x) => !x.o.sold).sort((a, b) => b.o.price - a.o.price);
      for (const { i, o } of offers) if (g.coins >= o.price && g.jokers.length < g.jokerSlots) g.buyJoker(i);
      if (g.coins >= g.rerollCost + 8 && g.jokers.length < g.jokerSlots) g.reroll(); else break;
    }
    return;
  }
  if (g.voucherOffer && !g.voucherOffer.sold && g.coins >= 12) g.buyVoucher();
  for (let pass = 0; pass < 3; pass++) {
    const offers = s.jokers.map((o, i) => ({ o, i })).filter((x) => !x.o.sold).sort((a, b) => val(b.o) - val(a.o));
    for (const { o, i } of offers) {
      if (g.coins < o.price) continue;
      if (g.jokers.length < g.jokerSlots || o.ed === 'neg') { g.buyJoker(i); continue; }
      let wi = 0;
      g.jokers.forEach((j, k) => { if (val(j) < val(g.jokers[wi])) wi = k; });
      if (val(o) > val(g.jokers[wi]) + 0.8 && g.coins + g.sellValue(g.jokers[wi]) >= o.price) { g.sell(wi); g.buyJoker(i); }
    }
    s.packs.forEach((p, i) => {
      if (p.sold || g.coins < p.price + 3) return;
      if (p.id === 'pk_joker' && g.jokers.length >= g.jokerSlots) return;
      g.buyPack(i);
      const ch = g.packOpen.choices;
      let k = 0;
      if (g.packOpen.kind === 'joker') ch.forEach((c, n) => { if (val(c) > val(ch[k])) k = n; });
      else if (g.packOpen.kind === 'planet') { const d = ch.findIndex((c) => c.id === 'p_double'); k = d >= 0 ? d : 0; }
      if (!g.choosePack(k)) g.skipPack();
    });
    s.cards.forEach((c, i) => { if (!c.sold && g.coins >= c.price + 4) g.buyCard(i); });
    if (s.special && !s.special.sold && g.coins >= s.special.price + 5) {
      if (s.special.id === 's_level') g.buySpecial('double');
      else if (s.special.id === 's_clone' && g.jokers.length < g.jokerSlots && g.jokers.length) g.buySpecial(0);
      else if (s.special.id === 's_edition') { const k = g.jokers.findIndex((j) => !j.ed); if (k >= 0) g.buySpecial(k); }
    }
    if (g.coins >= g.rerollCost + 12 && g.jokers.some((j) => JOKER_BY_ID[j.id].rarity === 'common')) g.reroll();
    else break;
  }
}

let anteSum = 0, wins = 0, ante1Deaths = 0, bigHits = 0, clears = 0, maxCoins = 0, movesPerRound = 0, roundsCnt = 0;
const hist = {};
for (let run = 0; run < runs; run++) {
  const g = new Game();
  g.newRun('sim' + run, { stake });
  let guard = 0;
  while (guard++ < 100000) {
    if (g.phase === 'play') {
      const m = bestMove(g);
      if (!m) { g.gameOver('stuck'); continue; }
      const res = g.place(m.i, m.r, m.c);
      if (res && res.cleared) {
        clears++;
        const base = res.steps[0].chips * res.steps[0].mult;
        if (base > g.target * 0.25) bigHits++;
      }
      const out = g.resolve();
      if (out === 'roundClear') { roundsCnt++; movesPerRound += g.placedCount; }
    } else if (g.phase === 'shop') {
      maxCoins = Math.max(maxCoins, g.coins);
      if (buyMode >= 1) shopBot(g);
      g.nextRound();
    } else break;
  }
  const won = g.phase === 'victory';
  if (won) wins++;
  const reached = won ? 9 : g.ante;
  if (reached === 1) ante1Deaths++;
  anteSum += reached;
  hist[reached] = (hist[reached] || 0) + 1;
}
console.log(`buy ${buyMode} place ${placeMode} stake ${stake} runs ${runs}: avg ante ${(anteSum / runs).toFixed(2)} win ${((wins / runs) * 100).toFixed(1)}% ante1 death ${((ante1Deaths / runs) * 100).toFixed(1)}% | base clear > 25% target: ${((bigHits / Math.max(1, clears)) * 100).toFixed(1)}% | moves/round ${(movesPerRound / Math.max(1, roundsCnt)).toFixed(1)} | max coins ${maxCoins}`, JSON.stringify(hist));
