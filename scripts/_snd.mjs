import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await (await b.newContext({ viewport: { width: 390, height: 844 } })).newPage();
await page.goto('http://localhost:4820/');
await page.waitForTimeout(800);
const r = await page.evaluate(() => __audio.measure());
for (const [k, v] of Object.entries(r.sfx)) console.log(k.padEnd(8), JSON.stringify(v));
console.log('bgm', JSON.stringify(r.bgm));
await b.close();
