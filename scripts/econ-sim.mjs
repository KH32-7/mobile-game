// 보석 경제 시뮬레이션: 실제 meta.js 정산 코드(업적, 미션, 출석, 시즌 포함)로 "하루 2런, 매일 접속" 플레이어를 돌려 표 출력
// 사용: node scripts/econ-sim.mjs
import * as meta from '../src/meta.js';
import { RELIC_PRICE } from '../src/meta.js';
import { BALL_SKINS, TRAILS, FLAGS } from '../src/worlds.js';

const prices = Object.values(RELIC_PRICE).sort((a, b) => a - b);
const total = prices.reduce((a, b) => a + b, 0) + [...BALL_SKINS, ...TRAILS, ...FLAGS].reduce((a, b) => a + (b.season ? 0 : b.price), 0) + meta.PERKS[0].price;
// 런별 성적 가정: 첫 런은 사람 비평가 기록(18홀 완주, +2, 버디 4, 홀인원 3)과 같은 "잘 친 첫 런", 이후 평균적인 런
const profile = (n) =>
  n === 1
    ? { holes: 18, birdies: 4, eagles: 3, aces: 3, complete: true, toPar: 2, bumpers: 8, crates: 3, coins: 6 }
    : { holes: Math.min(18, 6 + (n % 5) * 3), birdies: 2, eagles: n % 3 === 0 ? 1 : 0, aces: n % 6 === 0 ? 1 : 0, complete: n % 5 === 4, toPar: n % 5 === 4 ? 1 : 3, bumpers: 5, crates: 2, coins: 4 };
meta.meta();
let day = new Date(2026, 0, 1);
const rows = [];
let firstUnlock = null,
  allUnlock = null;
for (let n = 1; n <= 60; n++) {
  if (n % 2 === 1) {
    day = new Date(day.getTime() + 86400000);
    meta.rollDaily(day);
    meta.claimStreak();
  }
  const p = profile(n);
  for (const [k, v] of Object.entries({ holes: p.holes, birdies: p.birdies + p.eagles, eagles: p.eagles, aces: p.aces, parOrBetter: p.holes - 3, bumpers: p.bumpers, crates: p.crates, coins: p.coins, relicsTaken: Math.min(10, p.holes - 1), bossClears: p.holes >= 6 ? 1 : 0 })) meta.track(k, v);
  const r = meta.finishRun({ mode: 'normal', world: 'meadow', date: '', holesCleared: p.holes, toPar: p.toPar, strokes: p.holes * 4, complete: p.complete, relicsCount: Math.min(10, p.holes - 1), maxCoins: 25, counts: { aces: p.aces, eagles: p.eagles, birdies: p.birdies } });
  meta.missionView().forEach((v) => v.done && !v.claimed && meta.claimMission(v.i));
  meta.claimSet();
  const sv = meta.seasonView();
  for (let lv = 1; lv <= sv.level; lv++) meta.claimSeason(lv);
  const g = meta.meta().stats.gemsEarned + 0;
  const held = meta.meta().gems;
  if (firstUnlock == null && held >= prices[0]) firstUnlock = n;
  if (allUnlock == null && g >= total) allUnlock = n;
  if ([1, 2, 3, 4, 5, 10, 20, 40, 60].includes(n)) rows.push(`| ${n} | ${p.holes}${p.complete ? ' (완주)' : ''} | +${r.gems} | ${held} | ${sv.level} |`);
}
console.log('| 런 | 클리어 홀 | 런 정산 보석 | 보유 보석 (업적/출석/미션/시즌 포함) | 시즌 Lv |');
console.log('|---|---|---|---|---|');
console.log(rows.join('\n'));
console.log(`\n가장 싼 유물 해금(${prices[0]}): ${firstUnlock}런째, 전체 해금(${total}, 시즌 해금권 별도): ${allUnlock ?? '60런 초과'}`);
