// 보석 경제 시뮬레이션: 실제 meta.js 정산 코드로 "하루 2런, 매일 접속" 플레이어를 돌려 누적 보석과 해금 시점 표를 출력
// 사용: node scripts/econ-sim.mjs
import * as meta from '../src/meta.js';
import { RELIC_PRICE } from '../src/meta.js';
import { BALL_SKINS, TRAILS, FLAGS } from '../src/worlds.js';

const prices = Object.values(RELIC_PRICE).sort((a, b) => a - b);
const total = prices.reduce((a, b) => a + b, 0) + [...BALL_SKINS, ...TRAILS, ...FLAGS].reduce((a, b) => a + (b.season ? 0 : b.price), 0) + meta.PERKS[0].price;
// 런별 성적 가정: 초반엔 5~7홀, 점점 늘어 10런 이후 가끔 완주
const profile = (n) => {
  const holes = Math.min(18, 5 + Math.floor(n * 0.8));
  return { holes, birdies: Math.floor(holes / 4), eagles: n > 6 ? 1 : 0, aces: n % 5 === 4 ? 1 : 0, complete: holes >= 18, toPar: holes >= 18 ? (n > 14 ? -1 : 2) : 3 };
};
meta.meta();
let day = new Date(2026, 0, 1);
const rows = [];
let firstUnlock = null,
  allUnlock = null;
for (let n = 1; n <= 40; n++) {
  if (n % 2 === 1) {
    day = new Date(day.getTime() + 86400000);
    meta.rollDaily(day);
    meta.claimStreak();
  }
  const p = profile(n);
  const r = meta.finishRun({ mode: 'normal', world: 'meadow', date: '', holesCleared: p.holes, toPar: p.toPar, strokes: p.holes * 4, complete: p.complete, relicsCount: 5, maxCoins: 20, counts: { aces: p.aces, eagles: p.eagles, birdies: p.birdies } });
  // 미션은 이틀에 하나 정도 달성한다고 가정
  if (n % 2 === 0) meta.addGems(3);
  const g = meta.meta().stats.gemsEarned;
  if (firstUnlock == null && g >= prices[0]) firstUnlock = n;
  if (allUnlock == null && g >= total) allUnlock = n;
  if ([1, 2, 3, 5, 10, 20, 30, 40].includes(n)) rows.push(`| ${n} | ${p.holes} | +${r.gems} | ${g} |`);
}
console.log('| 런 | 클리어 홀 | 이번 런 보석 | 누적 보석 (업적/출석/미션 포함) |');
console.log('|---|---|---|---|');
console.log(rows.join('\n'));
console.log(`\n가장 싼 유물 해금(${prices[0]}): ${firstUnlock}런째, 전체 해금(${total}): ${allUnlock ?? '40런 초과'}`);
