import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto('http://localhost:4820/');
await page.waitForTimeout(800);
await page.locator('#t-start').tap({ force: true });
await page.waitForTimeout(7000);
const m = () => page.evaluate(() => new Promise((res) => { let n = 0; const t0 = performance.now(); const f = () => { n++; if (performance.now() - t0 < 3000) requestAnimationFrame(f); else res((n / 3).toFixed(1)); }; requestAnimationFrame(f); }));
console.log('after auto', await m(), await page.evaluate(() => __game.p.settings.shadows + ' pr=' + __gfx.renderer.getPixelRatio()));
for (const pr of [1, 0.75, 0.5]) {
  await page.evaluate((pr) => { __gfx.renderer.setPixelRatio(pr); window.dispatchEvent(new Event('resize')); }, pr);
  await page.waitForTimeout(500);
  console.log('pr', pr, await m());
}
await page.evaluate(() => { __game.game.env.visible = false; });
console.log('noenv pr0.5', await m());
await b.close();
