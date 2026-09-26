// 빠른 확인용: 타이틀/게임 화면 스크린샷
import { chromium } from 'playwright';
const exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const url = process.env.URL || 'http://localhost:4820/';
const b = await chromium.launch({ executablePath: exe, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
const page = await ctx.newPage();
page.on('console', (m) => (m.type() === 'error' || m.type() === 'warning') && console.log('[console]', m.type(), m.text()));
page.on('pageerror', (e) => console.log('[pageerror]', e.message));
await page.goto(url + (process.env.Q || ''));
await page.waitForTimeout(1500);
await page.screenshot({ path: 'shots/look-title.png' });
await page.tap('#t-start');
await page.waitForTimeout(Number(process.env.WAIT || 2500));
await page.screenshot({ path: 'shots/look-game.png' });
if (process.env.EVAL) console.log(await page.evaluate(process.env.EVAL));
await b.close();
