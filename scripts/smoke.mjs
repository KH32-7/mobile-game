// 스모크 테스트: npm run build 후 vite preview 를 띄워 실제 터치 입력으로 전체 흐름을 검증
// 사용법: node scripts/smoke.mjs  (PORT 환경변수로 포트 변경 가능)
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync, existsSync } from 'node:fs';

const PORT = Number(process.env.PORT || 4791);
const BASE = `http://localhost:${PORT}/`;
const SHOTS = 'shots';
mkdirSync(SHOTS, { recursive: true });

const exe = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome', '/opt/pw-browsers/chromium/chrome-linux/chrome'].find((p) => existsSync(p));

let server = null;
async function ensureServer() {
  try {
    const r = await fetch(BASE);
    if (r.ok && (await r.text()).includes('포켓 시즈')) return;
  } catch {
    /* 서버 없음 */
  }
  server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' });
  for (let i = 0; i < 50; i++) {
    await new Promise((r) => setTimeout(r, 200));
    try {
      const r = await fetch(BASE);
      if (r.ok) return;
    } catch {
      /* 대기 */
    }
  }
  throw new Error('preview 서버 시작 실패');
}

const errors = [];
const log = (...a) => console.log('[smoke]', ...a);
function assert(cond, msg) {
  if (!cond) throw new Error('검증 실패: ' + msg);
  log('OK', msg);
}

async function newPage(browser, w = 390, h = 844) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  const page = await ctx.newPage();
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`[${w}x${h}] ${m.text()}`);
  });
  page.on('pageerror', (e) => errors.push(`[${w}x${h}] ${e}`));
  const cdp = await ctx.newCDPSession(page);
  page.touchDrag = async (from, to, steps = 10) => {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: from.x, y: from.y, id: 1 }] });
    for (let i = 1; i <= steps; i++) {
      const x = from.x + ((to.x - from.x) * i) / steps;
      const y = from.y + ((to.y - from.y) * i) / steps;
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y, id: 1 }] });
      await page.waitForTimeout(16);
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  };
  page.tapSel = async (sel) => {
    const el = page.locator(sel).first();
    await el.waitFor({ state: 'visible', timeout: 8000 });
    const b = await el.boundingBox();
    await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2);
    await page.waitForTimeout(250);
  };
  return page;
}

const state = (page) => page.evaluate(() => ({ scene: window.__ps.scene }));

// 손패의 i번째 카드를 월드 좌표 (wx, wy) 로 드래그
async function dragCard(page, i, wx, wy) {
  const from = await page.evaluate((i) => window.__ps.cardCenter(i), i);
  const to = await page.evaluate(([x, y]) => window.__ps.worldToClient(x, y), [wx, wy]);
  await page.touchDrag(from, to);
  await page.waitForTimeout(80);
}

// 합성 가능한 카드가 손에 올 때까지 카드를 내고, 오면 유닛 위에 드롭
async function playUntilMerge(page, maxPlays = 14) {
  for (let n = 0; n < maxPlays; n++) {
    const info = await page.evaluate(() => {
      const b = window.__ps.battle;
      const hand = b.teams[0].hand;
      for (let i = 0; i < 4; i++) {
        const u = b.ents.find((e) => e.alive && e.team === 0 && e.card === hand[i] && e.level < 3 && e.kind !== 'tower' && e.deployT <= 0);
        if (u) return { merge: true, i, x: u.x, y: u.y, id: u.id, level: u.level };
      }
      return { merge: false, hand };
    });
    if (info.merge) {
      await dragCard(page, info.i, info.x, info.y);
      const after = await page.evaluate((id) => {
        const b = window.__ps.battle;
        const u = b.ents.find((e) => e.id === id);
        return { merges: b.stats.merges[0], level: u ? u.level : -1 };
      }, info.id);
      return { ...after, before: info.level };
    }
    // 손패 첫 카드를 뒤쪽에 배치 (주문이면 적 진영에)
    const spell = await page.evaluate(() => {
      const b = window.__ps.battle;
      return window.__ps.game && b.teams[0].hand[0] && ['fireball', 'lightning', 'freeze', 'arrows'].includes(b.teams[0].hand[0]);
    });
    if (spell) await dragCard(page, 0, 9, 6);
    else await dragCard(page, 0, 4 + (n % 3) * 5, 29.5);
    await page.waitForTimeout(350);
  }
  return null;
}

// 승리할 때까지 양 레인으로 카드 투입
async function pushToWin(page, timeoutMs = 90000) {
  const t0 = Date.now();
  let k = 0;
  while (Date.now() - t0 < timeoutMs) {
    const s = await page.evaluate(() => {
      const b = window.__ps.battle;
      const threat = b?.ents.find((e) => e.alive && e.team === 1 && e.kind === 'troop' && e.y > 17);
      return { scene: window.__ps.scene, ended: b?.ended, hand: b?.teams[0].hand, threat: threat ? { x: threat.x, y: threat.y } : null };
    });
    if (s.scene !== 'battle') return s.scene;
    if (!s.ended) {
      // 한 레인을 집중 공략 (왼쪽 프린세스가 부서지면 오른쪽)
      const leftAlive = await page.evaluate(() => window.__ps.battle.towers.find((t) => t.team === 1 && t.towerType === 'princess' && t.lane === 0).alive);
      const lane = leftAlive ? 3.5 : 14.5;
      const si = s.hand.findIndex((id) => ['fireball', 'lightning', 'arrows'].includes(id));
      const spell = ['fireball', 'lightning', 'freeze', 'arrows'].includes(s.hand[0]);
      if (si >= 0) await dragCard(page, si, 9, 2.8); // 주문으로 킹 타워 직접 공략
      else if (spell) await dragCard(page, 0, s.threat ? s.threat.x : 9, s.threat ? s.threat.y : 3.5);
      else if (s.threat && k % 2 === 1) await dragCard(page, 0, s.threat.x, Math.min(31, s.threat.y + 1.5));
      else await dragCard(page, 0, lane, 18.2);
      k++;
    }
    await page.waitForTimeout(500);
  }
  return 'timeout';
}

async function main() {
  await ensureServer();
  const browser = await chromium.launch(exe ? { executablePath: exe } : {});
  try {
    // ---------- 1. 타이틀 + 메타 진행 ----------
    let page = await newPage(browser);
    await page.goto(BASE);
    await page.evaluate(() => localStorage.clear());
    await page.goto(BASE);
    await page.waitForTimeout(700);
    await page.screenshot({ path: `${SHOTS}/01-title.png` });
    assert((await state(page)).scene === 'title', '타이틀(로비) 표시');
    const coins0 = await page.evaluate(() => window.__ps.profile.coins);

    await page.tapSel('[data-act="chest"]');
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${SHOTS}/02-chest.png` });
    const afterChest = await page.evaluate(() => ({ coins: window.__ps.profile.coins, knight: window.__ps.profile.cards.knight }));
    assert(afterChest.coins > coins0 && afterChest.knight.shards >= 2, `무료 상자 보상 획득 (코인 ${coins0} -> ${afterChest.coins}, 기사 조각 ${afterChest.knight.shards})`);
    await page.tapSel('.modal [data-act="closeModal"]');

    await page.tapSel('[data-act="collection"]');
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${SHOTS}/03-collection.png` });
    await page.tapSel('[data-testid="card-knight"]');
    await page.screenshot({ path: `${SHOTS}/04-card-detail.png` });
    await page.tapSel('[data-testid="upgrade"]');
    await page.waitForTimeout(300);
    const lvl = await page.evaluate(() => window.__ps.profile.cards.knight.level);
    assert(lvl === 2, '기사 카드 영구 레벨업 Lv.2');
    await page.screenshot({ path: `${SHOTS}/05-upgraded.png` });

    await page.reload();
    await page.waitForTimeout(600);
    const persisted = await page.evaluate(() => ({ lvl: window.__ps.profile.cards.knight.level, v: JSON.parse(localStorage.getItem('pocketSiege.profile')).version }));
    assert(persisted.lvl === 2 && persisted.v >= 2, '새로고침 후 카드 레벨/저장 버전 유지');

    // 미션/업적/통계/트로피 로드 화면
    for (const [act, name] of [['missions', '06-missions'], ['achievements', '07-achievements'], ['stats', '08-stats'], ['road', '09-road']]) {
      await page.tapSel(`[data-act="${act}"]`);
      await page.waitForTimeout(250);
      await page.screenshot({ path: `${SHOTS}/${name}.png` });
      await page.tapSel('[data-act="title"]');
    }

    // ---------- 2. 빠른 대전 (튜토리얼 + 소환 + 합성 + 승리) ----------
    await page.goto(BASE + '?debug&elixir&seed=7');
    await page.waitForTimeout(500);
    await page.tapSel('[data-act="quick"]');
    await page.waitForTimeout(900);
    assert((await state(page)).scene === 'battle', '빠른 대전 시작');
    await page.screenshot({ path: `${SHOTS}/10-battle-tutorial.png` });

    const beforeUnits = await page.evaluate(() => window.__ps.battle.ents.filter((e) => e.team === 0 && e.kind !== 'tower').length);
    const firstCard = await page.evaluate(() => window.__ps.battle.teams[0].hand[0]);
    await dragCard(page, 0, ['fireball', 'arrows', 'freeze', 'lightning'].includes(firstCard) ? 9 : 5, ['fireball', 'arrows', 'freeze', 'lightning'].includes(firstCard) ? 6 : 28);
    await page.waitForTimeout(200);
    const played = await page.evaluate(() => window.__ps.battle.stats.played[0]);
    const afterUnits = await page.evaluate(() => window.__ps.battle.ents.filter((e) => e.team === 0 && e.kind !== 'tower').length);
    assert(played === 1 && (afterUnits > beforeUnits || ['fireball', 'arrows', 'freeze', 'lightning'].includes(firstCard)), `카드 드래그로 소환 (${firstCard}, 유닛 ${beforeUnits} -> ${afterUnits})`);

    // 드래그 중 화면 (범위/실루엣 표시)
    {
      const from = await page.evaluate(() => window.__ps.cardCenter(1));
      const to = await page.evaluate(() => window.__ps.worldToClient(12, 24));
      const cdp = await page.context().newCDPSession(page);
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: from.x, y: from.y, id: 2 }] });
      for (let i = 1; i <= 8; i++) {
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: from.x + ((to.x - from.x) * i) / 8, y: from.y + ((to.y - from.y) * i) / 8, id: 2 }] });
        await page.waitForTimeout(16);
      }
      await page.waitForTimeout(100);
      await page.screenshot({ path: `${SHOTS}/11-dragging.png` });
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    }

    const merged = await playUntilMerge(page);
    assert(merged && merged.merges >= 1 && merged.level === merged.before + 1, `같은 카드 드롭으로 합성 발생 (레벨 ${merged?.before} -> ${merged?.level})`);
    await page.waitForTimeout(250);
    await page.screenshot({ path: `${SHOTS}/12-merge.png` });

    // 일시정지 메뉴
    const pb = await page.evaluate(() => {
      const L = window.__ps.layout();
      const r = document.getElementById('cv').getBoundingClientRect();
      return { x: r.left + L.pause.x + L.pause.w / 2, y: r.top + L.pause.y + L.pause.h / 2 };
    });
    await page.touchscreen.tap(pb.x, pb.y);
    await page.waitForTimeout(300);
    assert(await page.evaluate(() => window.__ps.game.paused), '일시정지');
    await page.screenshot({ path: `${SHOTS}/13-pause.png` });
    await page.tapSel('[data-act="resume"]');
    assert(!(await page.evaluate(() => window.__ps.game.paused)), '재개');

    await page.waitForTimeout(1500);
    await page.screenshot({ path: `${SHOTS}/14-combat.png` });
    const r1 = await pushToWin(page);
    assert(r1 === 'result', `대전 종료 후 결과 화면 (${r1})`);
    await page.screenshot({ path: `${SHOTS}/15-quick-result.png` });
    const quick = await page.evaluate(() => ({ tro: window.__ps.profile.trophies, wins: window.__ps.profile.stats.quickWins, win: window.__ps.game.lastResult.winner, res: window.__ps.game.lastResult, towers: window.__ps.game.battle?.towers.map((t) => t.team + t.towerType + ':' + Math.round(t.hp)) }));
    log('quick result', JSON.stringify(quick));
    assert(quick.win === 0 && quick.tro > 0, `빠른 대전 승리 + 트로피 획득 (${quick.tro})`);
    await page.tapSel('[data-act="title"]');

    // ---------- 3. 원정: 승리 -> 보상 -> 다음 스테이지 ----------
    await page.tapSel('[data-act="newrun"]');
    await page.waitForTimeout(400);
    assert((await state(page)).scene === 'map', '원정 지도');
    await page.screenshot({ path: `${SHOTS}/16-map.png` });
    await page.tapSel('.mnode.avail');
    await page.waitForTimeout(600);
    assert((await state(page)).scene === 'battle', '스테이지 1 전투 시작');
    const r2 = await pushToWin(page);
    assert(r2 === 'result', '스테이지 1 결과');
    await page.screenshot({ path: `${SHOTS}/17-stage-result.png` });
    await page.tapSel('[data-testid="to-reward"]');
    await page.waitForTimeout(300);
    assert((await state(page)).scene === 'reward', '보상 선택 화면');
    await page.screenshot({ path: `${SHOTS}/18-reward.png` });
    const deckLen = await page.evaluate(() => window.__ps.game.run.deck.length);
    await page.tapSel('[data-testid="reward-card-0"]');
    await page.screenshot({ path: `${SHOTS}/19-deck-add.png` });
    await page.tapSel('[data-testid="deck-add"]');
    await page.waitForTimeout(400);
    const afterReward = await page.evaluate(() => ({ scene: window.__ps.scene, deck: window.__ps.game.run.deck.length, row: window.__ps.game.run.row }));
    assert(afterReward.scene === 'map' && afterReward.deck === deckLen + 1 && afterReward.row === 0, '보상 카드 덱 추가 후 지도 복귀');
    await page.screenshot({ path: `${SHOTS}/20-map-2.png` });

    // 새로고침 후 원정 이어하기 (지도 기준)
    await page.reload();
    await page.waitForTimeout(600);
    await page.tapSel('[data-act="continue"]');
    await page.waitForTimeout(400);
    const cont = await page.evaluate(() => ({ scene: window.__ps.scene, row: window.__ps.game.run.row }));
    assert(cont.scene === 'map' && cont.row === 0, '새로고침 후 원정 이어하기');

    // 다음 스테이지 진입 (전투 노드 우선)
    const nodeSel = await page.evaluate(() => {
      const n = [...document.querySelectorAll('.mnode.avail')];
      const b = n.find((e) => e.classList.contains('t-battle') || e.classList.contains('t-elite')) || n[0];
      return `[data-testid="${b.dataset.testid}"]`;
    });
    await page.tapSel(nodeSel);
    await page.waitForTimeout(700);
    const s2 = await page.evaluate(() => ({ scene: window.__ps.scene, label: window.__ps.game.info?.label, cur: window.__ps.game.run.cur }));
    assert(s2.cur && s2.cur.row === 1 && ['battle', 'shop', 'rest'].includes(s2.scene), `다음 스테이지 진입 (${s2.scene} ${s2.label || ''})`);
    await page.screenshot({ path: `${SHOTS}/21-stage2.png` });

    // ---------- 3-b. 보스 스테이지 (?stage=10) 격파 -> 원정 성공 -> 난이도 해금 ----------
    await page.goto(BASE + '?debug&elixir&notut&stage=10&seed=5');
    await page.waitForTimeout(500);
    await page.tapSel('[data-act="abandon"]');
    await page.tapSel('[data-act="abandonYes"]');
    await page.tapSel('[data-act="runEndOk"]');
    await page.tapSel('[data-act="newrun"]');
    await page.tapSel('.mnode.avail');
    await page.waitForTimeout(1200);
    const boss = await page.evaluate(() => ({ scene: window.__ps.scene, boss: window.__ps.battle?.params.boss }));
    assert(boss.scene === 'battle' && boss.boss, '보스전 시작');
    await page.screenshot({ path: `${SHOTS}/22-boss.png` });
    const r3 = await pushToWin(page, 120000);
    const bres = await page.evaluate(() => ({ res: window.__ps.game.lastResult, towers: window.__ps.battle?.towers.map((t) => t.team + t.towerType + ':' + Math.round(t.hp)), t: window.__ps.battle?.time }));
    log('boss result', JSON.stringify(bres));
    assert(r3 === 'result' && bres.res.winner === 0, '보스전 승리');
    await page.tapSel('[data-testid="to-reward"]');
    await page.waitForTimeout(400);
    const end = await page.evaluate(() => ({ scene: window.__ps.scene, tier: window.__ps.profile.tierUnlocked, runWins: window.__ps.profile.stats.runWins, run: !!window.__ps.game.run }));
    assert(end.scene === 'runEnd' && end.tier === 2 && end.runWins === 1 && !end.run, '보스 격파 -> 원정 성공, 난이도 2 해금');
    await page.screenshot({ path: `${SHOTS}/23-run-clear.png` });
    await page.context().close();

    // ---------- 4. 다른 화면 크기 레이아웃 ----------
    for (const [w, h] of [[360, 640], [430, 932]]) {
      const p2 = await newPage(browser, w, h);
      await p2.goto(BASE + '?notut&seed=3');
      await p2.waitForTimeout(500);
      await p2.screenshot({ path: `${SHOTS}/30-title-${w}x${h}.png` });
      await p2.tapSel('[data-act="quick"]');
      await p2.waitForTimeout(800);
      await dragCard(p2, 0, 4, 27);
      await p2.waitForTimeout(1500);
      await p2.screenshot({ path: `${SHOTS}/31-battle-${w}x${h}.png` });
      const L = await p2.evaluate(() => window.__ps.layout());
      const ok = L.cards.every((c) => c.x >= 0 && c.x + c.w <= w && c.y + c.h <= h) && L.oy + L.ah <= L.panel.y + 1 && L.ox >= 0;
      assert(ok, `${w}x${h} 레이아웃: 카드/아레나가 화면 안에 있고 겹치지 않음`);
      await p2.context().close();
    }

    // 데스크톱 (마우스)
    {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      const p3 = await ctx.newPage();
      p3.on('pageerror', (e) => errors.push(`[desktop] ${e}`));
      p3.on('console', (m) => m.type() === 'error' && errors.push(`[desktop] ${m.text()}`));
      await p3.goto(BASE + '?notut');
      await p3.waitForTimeout(500);
      await p3.click('[data-act="quick"]').catch(() => {});
      await p3.mouse.click(640, 400);
      await p3.waitForTimeout(300);
      await p3.screenshot({ path: `${SHOTS}/32-desktop.png` });
      await ctx.close();
    }

    assert(errors.length === 0, `콘솔 에러 0개 ${errors.length ? JSON.stringify(errors) : ''}`);
    log('모든 검증 통과');
  } finally {
    await browser.close();
    if (server) server.kill();
  }
}

main().catch((e) => {
  console.error(e);
  if (errors.length) console.error('console errors:', errors);
  if (server) server.kill();
  process.exit(1);
});
