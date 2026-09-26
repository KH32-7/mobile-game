// 시각 점검용 (테스트 아님): 중후반 상태 스크린샷
import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
const page = await ctx.newPage();
page.on('pageerror', (e) => console.log('[pe]', e.message));
page.on('console', (m) => m.type() === 'error' && console.log('[err]', m.text()));
await page.goto('http://localhost:4820/?debug');
await page.waitForTimeout(1000);
await page.locator('#t-start').tap();
await page.waitForTimeout(500);
const ev = (f, a) => page.evaluate(f, a);
const stages = (process.env.STAGES || '0').split(',').map(Number);
for (const st of stages) {
  await ev((st) => { const a = __game; a.p.tut = 6; if (a.p.stage !== st) { a.p.stage = st; a.p.run = null; } a.p.run = a.p.run || { money: 0, earned: 0, done: [], paid: {}, upg: {}, st: {}, cr: {}, sinkQ: 0, belts: {}, stack: [], seats: {}, hist: [0.7,0.7,0.7,0.7], combo: 0, rushT: 0, time: 0, cust: 0, plates: 0, bestCombo: 0, staff: [] }; a.game.loadStage(); a.settingsQ = 1; }, st);
  const n = Number(process.env.UNLOCKS || 99);
  await ev((n) => { const g = __game.game; for (let i = 0; i < n; i++) { const p = g.pads[0]; if (!p || p.u.t === 'next' || p.u.t === 'final') break; g.doUnlock(p); } }, n);
  await ev(() => { __game.speed = 5; });
  await page.waitForTimeout(Number(process.env.WAIT || 20000));
  await ev(() => { __game.speed = 1; });
  // 셰프를 벨트 근처로
  await ev(() => { const g = __game.game; g.chef.x = g.belts[0].cx + 2.9; g.chef.z = g.belts[0].topZ + 1.5; });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `shots/play-${st}-a.png` });
  await ev(() => { const g = __game.game; g.chef.x = 0; g.chef.z = g.lay.kitchenZ + 2; });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: `shots/play-${st}-b.png` });
  console.log(await ev(() => { const g = __game.game; return JSON.stringify({ money: g.run.money|0, cust: g.customers.length, staff: g.staff.map(s => s.role + ':' + s.task + ':' + s.stack.length), rack: g.rack.n, sinkQ: g.sink.q, belt: g.belts.map(b => b.count() + '/' + b.slots.length), stars: g.stars().toFixed(2), st: Object.values(g.stations).map(s => s.menu + s.inp + '/' + s.out) }); }));
}
await b.close();
