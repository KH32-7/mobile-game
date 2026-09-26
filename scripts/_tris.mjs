import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto('http://localhost:4820/');
await page.waitForTimeout(1500);
console.log(await page.evaluate(() => {
  const tri = (o) => { let n = 0; o.traverse((c) => { if (c.geometry && c.visible) { const g = c.geometry; const k = g.index ? g.index.count : g.attributes.position.count; n += (k / 3) * (c.isInstancedMesh ? c.count : 1); } }); return n; };
  const out = [];
  const g = __game.game;
  out.push('env ' + tri(g.env));
  g.env.children.forEach((c, i) => out.push('  env' + i + ' ' + c.type + ' ' + tri(c)));
  out.push('root ' + tri(g.root));
  g.root.children.forEach((c, i) => { const t = tri(c); if (t > 300) out.push('  root' + i + ' ' + t); });
  out.push('chef ' + tri(g.chefMesh));
  return out.join('\n');
}));
await b.close();
