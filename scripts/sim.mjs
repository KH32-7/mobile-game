// 밸런스 시뮬레이션: 탐욕 봇이 조커 없이/있이 몇 앤티까지 가는지 측정
// 사용: node scripts/sim.mjs [runs] [withJokers]
import { Game } from '../src/game.js';
import { JOKER_BY_ID } from '../src/jokers.js';

const runs = +(process.argv[2] || 30);
const withJokers = process.argv[3] === '1';
const N = 8;

function evalBoard(g) {
  // 빈칸 연결성 휴리스틱: 고립된 빈칸과 거친 경계에 벌점
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
      const clearSet = new Set();
      rows.forEach((rr) => { for (let x = 0; x < N; x++) clearSet.add(rr * N + x); });
      cols.forEach((cc) => { for (let x = 0; x < N; x++) clearSet.add(x * N + cc); });
      for (const k of clearSet) if (!g.board[k].stone) g.board[k] = null;
      const s = lines * 40 + lines * lines * 10 + evalBoard(g) + p.shape.size * 0.5;
      g.board = snap;
      if (!best || s > best.s) best = { s, i, r, c };
    }
  });
  return best;
}

let anteSum = 0; const hist = {};
for (let run = 0; run < runs; run++) {
  const g = new Game();
  g.newRun('sim' + run);
  let guard = 0;
  while (guard++ < 100000) {
    if (g.phase === 'play') {
      const m = bestMove(g);
      if (!m) { g.gameOver('stuck'); continue; }
      g.place(m.i, m.r, m.c);
      g.resolve();
    } else if (g.phase === 'shop' || g.phase === 'victory') {
      if (g.phase === 'victory') break;
      if (withJokers) {
        for (let k = 0; k < 3; k++) {
          const i = g.shop.findIndex((o) => !o.sold && o.price <= g.coins);
          if (i >= 0 && g.jokers.length < 5) g.buy(i);
        }
      }
      g.nextRound();
    } else break;
  }
  const reached = g.phase === 'victory' ? 9 : g.ante;
  anteSum += reached;
  const key = reached + '-' + g.blind;
  hist[key] = (hist[key] || 0) + 1;
}
console.log('avg ante', (anteSum / runs).toFixed(2), JSON.stringify(Object.fromEntries(Object.entries(hist).sort())));
