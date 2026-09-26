// 밸런스 시뮬레이션: 탐욕 배치 봇 + 합리적 구매 봇
// 사용: node scripts/sim.mjs [runs] [mode]  mode: 0 = 조커 없음, 1 = 합리적 구매, 2 = 1과 같지만 앤티별 도달 분포 출력
import { Game } from '../src/game.js';
import { JOKER_BY_ID } from '../src/jokers.js';

const runs = +(process.argv[2] || 40);
const mode = +(process.argv[3] || 1);
const N = 8;

function evalBoard(g) {
  let pen = 0;
  for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
    const f = !!g.board[r * N + c];
    if (c < N - 1 && f !== !!g.board[r * N + c + 1]) pen++;
    if (r < N - 1 && f !== !!g.board[(r + 1) * N + c]) pen++;
  }
  return -pen;
}

function bestMove(g) {
  let best = null;
  g.tray.forEach((p, i) => {
    if (!p || p.hidden) return;
    for (let r = 0; r <= N - p.shape.h; r++) for (let c = 0; c <= N - p.shape.w; c++) {
      if (!g.canPlace(p.shape, r, c)) continue;
      const snap = g.board.slice();
      for (const [dr, dc] of p.shape.cells) g.board[(r + dr) * N + c + dc] = { color: 0 };
      const { rows, cols, lines } = g.fullLines();
      const cs = new Set();
      rows.forEach((rr) => { for (let x = 0; x < N; x++) cs.add(rr * N + x); });
      cols.forEach((cc) => { for (let x = 0; x < N; x++) cs.add(x * N + cc); });
      for (const k of cs) if (!g.board[k].stone) g.board[k] = null;
      const s = lines * 40 + lines * lines * 10 + evalBoard(g) + p.shape.size * 0.5;
      g.board = snap;
      if (!best || s > best.s) best = { s, i, r, c };
    }
  });
  return best;
}

const RV = { common: 1, uncommon: 2, rare: 3.2, legendary: 5 };
const EV = { foil: 0.5, holo: 0.8, poly: 1.5, neg: 2 };
const val = (o) => RV[JOKER_BY_ID[o.id].rarity] + (o.ed ? EV[o.ed] : 0);

function shopBot(g) {
  const s = g.shop;
  // 바우처
  if (g.voucherOffer && !g.voucherOffer.sold && g.coins >= 12) g.buyVoucher();
  for (let pass = 0; pass < 3; pass++) {
    // 조커
    const offers = s.jokers.map((o, i) => ({ o, i })).filter((x) => !x.o.sold).sort((a, b) => val(b.o) - val(a.o));
    for (const { o, i } of offers) {
      if (g.coins < o.price) continue;
      if (g.jokers.length < g.jokerSlots || o.ed === 'neg') { g.buyJoker(i); continue; }
      let wi = 0;
      g.jokers.forEach((j, k) => { if (val(j) < val(g.jokers[wi])) wi = k; });
      if (val(o) > val(g.jokers[wi]) + 0.8 && g.coins + g.sellValue(g.jokers[wi]) >= o.price) { g.sell(wi); g.buyJoker(i); }
    }
    // 팩
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
    // 행성/보석 카드
    s.cards.forEach((c, i) => { if (!c.sold && g.coins >= c.price + 4) g.buyCard(i); });
    if (g.coins >= g.rerollCost + 12 && g.jokers.some((j) => JOKER_BY_ID[j.id].rarity === 'common')) g.reroll();
    else break;
  }
}

let anteSum = 0, wins = 0; const hist = {};
for (let run = 0; run < runs; run++) {
  const g = new Game();
  g.newRun('sim' + run, { stake: 1 });
  let guard = 0;
  while (guard++ < 100000) {
    if (g.phase === 'play') {
      const m = bestMove(g);
      if (!m) { g.gameOver('stuck'); continue; }
      g.place(m.i, m.r, m.c);
      g.resolve();
    } else if (g.phase === 'shop') {
      if (mode >= 1) shopBot(g);
      g.nextRound();
    } else break;
  }
  const won = g.phase === 'victory';
  if (won) wins++;
  const reached = won ? 9 : g.ante;
  anteSum += reached;
  hist[reached] = (hist[reached] || 0) + 1;
}
console.log(`mode ${mode} runs ${runs} avg ante ${(anteSum / runs).toFixed(2)} win ${((wins / runs) * 100).toFixed(1)}%`, JSON.stringify(hist));
