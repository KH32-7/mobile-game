// 밸런스 시뮬레이션
// 사용: node scripts/sim.mjs [runs] [buy] [place] [stake]
//   buy: 0 = 구매 안 함, 1 = 합리적 구매, 2 = 비싼 조커부터 구매, 3 = 범용 조커만(빌드 축 무시), 4 = 빌드 축 집중
//   place: greedy = 한 수 탐욕, tray = 트레이 전체(2수) 탐색
import { Game } from '../src/game.js';
import { JOKER_BY_ID } from '../src/jokers.js';

const runs = +(process.argv[2] || 40);
const buyMode = +(process.argv[3] ?? 1);
const placeMode = process.argv[4] || 'tray';
const stake = +(process.argv[5] || 1);
const N = 8;
let pref = null; // 축 빌드 봇의 선호 방향

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
  return { nb, lines: rows.length + cols.length, nr: rows.length, nc: cols.length };
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
      const { nb, lines, nr, nc } = applyMove(b, p.shape, r, c);
      // 축 빌드: 선호 방향 줄은 가산, 반대 방향이 섞이면 감산
      let ax = 0;
      if (pref === 'row' && lines) ax = nc ? -60 : 25 * nr;
      else if (pref === 'col' && lines) ax = nr ? -60 : 25 * nc;
      out.push({ i, r, c, nb, lines, s: lines * 40 + lines * lines * 12 + evalBits(nb) + ax });
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

function axisPref(g) {
  const c = {};
  for (const j of g.jokers) { const a = JOKER_BY_ID[j.id].axis; if (a) c[a] = (c[a] || 0) + 1; }
  const best = Object.entries(c).sort((a, b) => b[1] - a[1])[0];
  return best ? best[0] : null;
}
function offerVal(g, o) {
  const d = JOKER_BY_ID[o.id];
  if (buyMode === 3 && d.axis) return -99;
  let v = val(o);
  if (buyMode === 4 && d.axis) {
    const cur = axisPref(g) || runAxis;
    v += d.axis === cur ? 4 : -3;
  }
  return v;
}
let runAxis = 'row';
function shopBot(g) {
  const s = g.shop;
  const val2 = (o) => offerVal(g, o);
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
    const offers = s.jokers.map((o, i) => ({ o, i }));
    if (s.rare) offers.push({ o: s.rare, i: 'rare' });
    offers.filter((x) => !x.o.sold && val2(x.o) > 0).sort((a, b) => val2(b.o) - val2(a.o)).forEach(({ o, i }) => {
      if (g.coins < o.price) return;
      if (g.jokers.length < g.jokerSlots || o.ed === 'neg') { g.buyJoker(i); return; }
      let wi = 0;
      g.jokers.forEach((j, k) => { if (val2(j) < val2(g.jokers[wi])) wi = k; });
      if (val2(o) > val2(g.jokers[wi]) + 0.8 && g.coins + g.sellValue(g.jokers[wi]) >= o.price) { g.sell(wi); g.buyJoker(i); }
    });
    if (s.enhance && !s.enhance.sold && g.coins >= s.enhance.price + 6) { const k = g.jokers.findIndex((j) => !j.ed); if (k >= 0) g.buySpecial(k, 'enhance'); }
    s.packs.forEach((p, i) => {
      if (p.sold || g.coins < p.price + 3) return;
      if (p.id === 'pk_joker' && g.jokers.length >= g.jokerSlots) return;
      g.buyPack(i);
      const ch = g.packOpen.choices;
      let k = 0;
      if (g.packOpen.kind === 'joker') ch.forEach((c, n) => { if (val2(c) > val2(ch[k])) k = n; });
      else if (g.packOpen.kind === 'planet') { const d = ch.findIndex((c) => c.id === 'p_double'); k = d >= 0 ? d : 0; }
      if (!g.choosePack(k)) g.skipPack();
    });
    s.cards.forEach((c, i) => { if (!c.sold && g.coins >= c.price + 4) g.buyCard(i); });
    if (s.special && !s.special.sold && g.coins >= s.special.price + 5) {
      if (s.special.id === 's_level') g.buySpecial('double');
      else if (s.special.id === 's_clone' && g.jokers.length < g.jokerSlots && g.jokers.length) g.buySpecial(0);
      else if (s.special.id === 's_edition') { const k = g.jokers.findIndex((j) => !j.ed); if (k >= 0) g.buySpecial(k); }
    }
    if (g.coins >= g.rerollCost + 12 && (g.jokers.length < g.jokerSlots || g.jokers.some((j) => val2(j) < 2))) g.reroll();
    else break;
  }
}

const anteCoins = {}; const anteCoinSeen = {}; const earlyHit = {};
let hitLog = 0, roundBest = 0, hitRatioSum = 0, hitRatioN = 0;
const byAnte = {}; const reasons = {};
let earlyRound = 0;
let startHands = null, swaps = 0, rescues = 0, traysUsed = 0;
let anteSum = 0, wins = 0, ante1Deaths = 0, bigHits = 0, clears = 0, maxCoins = 0, movesPerRound = 0, roundsCnt = 0;
const hist = {};
for (let run = 0; run < runs; run++) {
  const g = new Game();
  g.newRun('sim' + run, { stake });
  runAxis = run % 2 ? 'col' : 'row';
  pref = null;
  let guard = 0;
  while (guard++ < 100000) {
    if (g.phase === 'play') {
      const m = bestMove(g);
      if (!m) { g.gameOver('stuck'); continue; }
      const res = g.place(m.i, m.r, m.c);
      if (res && res.cleared) {
        clears++;
        if (res.total > roundBest) roundBest = res.total;
        if (g.ante <= 3) earlyRound = Math.max(earlyRound, res.total / g.target);
        if (g.ante <= 3) { const k = g.ante + '-' + g.blind; const r0 = res.total / g.target; (earlyHit[k] ||= { s: 0, n: 0, max: 0 }); if (r0 > earlyHit[k].max) earlyHit[k].max = r0; }
        if (process.env.SIM_HITS && g.jokers.length >= 3 && res.total > g.target * 0.8 && hitLog < 25) { hitLog++; const b = res.steps[0]; console.log(`ante ${g.ante} target ${g.target} total ${res.total} lines ${b.lines} base ${b.chips}x${b.mult} final ${Math.round(res.chips)}x${res.mult.toFixed(1)} combo ${b.combo}`, res.steps.filter((x) => x.kind !== 'base').map((x) => (x.kind === 'joker' ? g.jokers[x.idx]?.id : x.gem) + ':' + x.e.t[0] + x.e.v).join(' ')); }
        const base = res.steps[0].chips * res.steps[0].mult;
        if (base > g.target * 0.25) bigHits++;
      }
      if (startHands == null) startHands = g.handsLeft + 1;
      let out = g.resolve();
      while (out === 'stuck' || out === 'rescue') {
        if (out === 'stuck') { g.swapTray(); swaps++; out = g.resolveStuck(); continue; }
        rescues++;
        if (g.coins >= g.rescueCost) g.rescue('coins');
        else if (g.jokers.length) { let wi = 0; g.jokers.forEach((j, k) => { if (val(j) < val(g.jokers[wi])) wi = k; }); g.rescue('joker', wi); }
        else { out = g.declineRescue(); break; }
        out = g.resolveStuck();
      }
      if (out === 'roundClear' && g.clearedAnte <= 3) { const k = g.clearedAnte + '-' + g.clearedBlind; if (earlyHit[k]) { earlyHit[k].s += earlyRound; earlyHit[k].n++; } }
      if (out === 'roundClear' || g.phase !== 'play') earlyRound = 0;
      if (out === 'roundClear') { roundsCnt++; movesPerRound += g.placedCount; traysUsed += startHands - g.rewards.handsLeft; if (g.jokers.length >= 3) { hitRatioSum += roundBest / g.target; hitRatioN++; } roundBest = 0; const ak = g.clearedAnte + '-' + g.clearedBlind; (byAnte[ak] ||= []).push(startHands - g.rewards.handsLeft); startHands = null; }
    } else if (g.phase === 'shop') {
      startHands = null;
      maxCoins = Math.max(maxCoins, g.coins);
      if (!anteCoinSeen[run + ':' + g.ante]) { anteCoinSeen[run + ':' + g.ante] = 1; (anteCoins[g.ante] ||= []).push(g.coins); }
      if (buyMode >= 1) shopBot(g);
      g.nextRound();
      pref = buyMode === 4 ? (axisPref(g) === 'row' || axisPref(g) === 'col' ? axisPref(g) : null) : null;
    } else break;
  }
  const won = g.phase === 'victory';
  if (!won) reasons[g.gameOverReason] = (reasons[g.gameOverReason] || 0) + 1;
  if (won) wins++;
  const reached = won ? 9 : g.ante;
  if (reached === 1) ante1Deaths++;
  anteSum += reached;
  hist[reached] = (hist[reached] || 0) + 1;
}
console.log(`buy ${buyMode} place ${placeMode} stake ${stake} runs ${runs}: avg ante ${(anteSum / runs).toFixed(2)} win ${((wins / runs) * 100).toFixed(1)}% ante1 death ${((ante1Deaths / runs) * 100).toFixed(1)}% | base clear > 25% target: ${((bigHits / Math.max(1, clears)) * 100).toFixed(1)}% | moves/round ${(movesPerRound / Math.max(1, roundsCnt)).toFixed(1)} | best hit/target (jokers 3+) ${(hitRatioSum / Math.max(1, hitRatioN) * 100).toFixed(0)}% | trays/round ${(traysUsed / Math.max(1, roundsCnt)).toFixed(2)} | swaps/run ${(swaps / runs).toFixed(1)} rescues/run ${(rescues / runs).toFixed(2)} | max coins ${maxCoins}`, JSON.stringify(hist));

if (process.env.SIM_DETAIL) console.log('death:', JSON.stringify(reasons));
if (process.env.SIM_DETAIL) console.log(Object.entries(byAnte).sort().map(([k, v]) => `${k}:${(v.reduce((a, b) => a + b, 0) / v.length).toFixed(1)}`).join(' '));
const avg = (a) => (a && a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0);
console.log(`앤티 진입 시 보유 코인 평균: ${[2, 3, 4, 5, 6, 7, 8].map((a) => `A${a} $${avg(anteCoins[a]).toFixed(0)}`).join(' ')}`);
console.log(`앤티 1~3 라운드 최고 한 방/목표 평균: ${Object.entries(earlyHit).sort().map(([k, v]) => `${k} ${(v.s / Math.max(1, v.n)).toFixed(2)}`).join(' ')}`);
