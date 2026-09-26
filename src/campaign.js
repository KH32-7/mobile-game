// 로그라이크 원정: 지도 생성, 보상, 상점
import { CARDS, PLAYABLE, RELICS, STARTER_DECK, CAMPAIGN, RARITY_WEIGHT, ENEMY_DECKS, stageParams } from './config.js';
import { makeRng } from './rng.js';

export const NODE_INFO = {
  battle: { name: '일반전', icon: 'knight', color: '#5a8fe0' },
  elite: { name: '엘리트전', icon: 'golem', color: '#e05a5a' },
  shop: { name: '상점', icon: 'crown', color: '#e0b040' },
  rest: { name: '휴식', icon: 'heart', color: '#50c080' },
  boss: { name: '보스전', icon: 'skeletons', color: '#8a4ae0' },
};

function pickType(row, rng) {
  if (row === 0) return 'battle';
  if (row === 1) return rng() < 0.75 ? 'battle' : 'shop';
  const r = rng();
  if (r < 0.44) return 'battle';
  if (r < 0.66) return 'elite';
  if (r < 0.82) return 'rest';
  return 'shop';
}

export function genMap(seed) {
  const rng = makeRng(seed * 7 + 13);
  const rows = [];
  for (let r = 0; r < CAMPAIGN.STAGES; r++) {
    let types;
    if (r === 0) types = ['battle'];
    else if (r === CAMPAIGN.STAGES - 1) types = ['boss'];
    else if (r === CAMPAIGN.STAGES - 2) types = ['rest', 'shop'];
    else {
      const n = rng() < 0.55 ? 3 : 2;
      types = [];
      for (let i = 0; i < n; i++) types.push(pickType(r, rng));
      if (!types.includes('battle') && !types.includes('elite')) types[0] = 'battle';
    }
    rows.push(types.map((type, i) => ({ type, col: i, next: [] })));
  }
  for (let r = 0; r < rows.length - 1; r++) {
    const a = rows[r];
    const b = rows[r + 1];
    const n = a.length;
    const m = b.length;
    a.forEach((node, i) => {
      const j = n === 1 ? Math.floor(rng() * m) : Math.round((i * (m - 1)) / (n - 1));
      node.next.push(j);
      const k = j + (rng() < 0.5 ? -1 : 1);
      if (k >= 0 && k < m && rng() < 0.6) node.next.push(k);
    });
    if (n === 1) for (let j = 0; j < m; j++) if (!a[0].next.includes(j)) a[0].next.push(j);
    for (let j = 0; j < m; j++) {
      if (!a.some((node) => node.next.includes(j))) {
        const i = Math.min(n - 1, Math.round((j * (n - 1)) / Math.max(1, m - 1)));
        a[i].next.push(j);
      }
    }
    a.forEach((node) => node.next.sort());
  }
  return rows;
}

export function newRun(seed) {
  return {
    seed,
    deck: STARTER_DECK.slice(),
    relics: [],
    gold: 30,
    kingHpFrac: 1,
    map: genMap(seed),
    row: -1,
    col: -1,
    wins: 0,
    rngState: seed,
  };
}

export function availableNodes(run) {
  if (run.row < 0) return run.map[0].map((_, i) => i);
  const cur = run.map[run.row][run.col];
  return cur.next.slice();
}

export function runRng(run) {
  run.rngState = (run.rngState * 1103515245 + 12345) >>> 0;
  return makeRng(run.rngState);
}

export function copies(deck, id) {
  return deck.filter((d) => d === id).length;
}

export function rollCards(run, n, rng) {
  const pool = PLAYABLE.filter((id) => copies(run.deck, id) < 2);
  const out = [];
  while (out.length < n && pool.length) {
    const tot = pool.reduce((s, id) => s + RARITY_WEIGHT[CARDS[id].rarity], 0);
    let r = rng() * tot;
    let pick = pool[0];
    for (const id of pool) {
      r -= RARITY_WEIGHT[CARDS[id].rarity];
      if (r <= 0) {
        pick = id;
        break;
      }
    }
    out.push(pick);
    pool.splice(pool.indexOf(pick), 1);
  }
  return out;
}

export function rollRelics(run, n, rng) {
  const pool = Object.keys(RELICS).filter((k) => !run.relics.includes(k));
  const out = [];
  while (out.length < n && pool.length) out.push(pool.splice(Math.floor(rng() * pool.length), 1)[0]);
  return out;
}

export function enemySetup(row, type, rng) {
  const params = stageParams(row, type);
  const tierDecks = ENEMY_DECKS[params.deckTier];
  const deck = tierDecks[Math.floor(rng() * tierDecks.length)].slice();
  return { params, deck };
}
