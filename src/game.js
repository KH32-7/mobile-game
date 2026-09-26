// 게임 상태 머신: 런/홀 진행, 샷, 이벤트, 보상
import { T, PHYS, RUN, SCORE_TEXT } from './config.js';
import { generateHole, distField, BOSS, isPass, TILE } from './gen.js';
import { makeState, newBall, stepWorld, relicMods, previewPath, settleToFloor, cupPos } from './physics.js';
import { planShot } from './ai.js';
import { RELICS, RELIC_MAP, CONSUMABLES } from './relics.js';
import { WORLDS, WORLD_MAP } from './worlds.js';
import { mulberry32, mix, hashStr, dateSeedStr } from './rng.js';
import { FX } from './fx.js';
import { sfx } from './audio.js';
import * as meta from './meta.js';

const FIXED = 1 / 120;
const vib = (p) => {
  try {
    if (navigator.vibrate) navigator.vibrate(p);
  } catch {
    /* 미지원 */
  }
};

export class Game {
  constructor(renderer, ui, opts = {}) {
    this.R = renderer;
    this.ui = ui;
    this.opts = opts;
    this.fx = new FX();
    this.cam = { x: 0, y: 0, scale: 1, cy: 0, shake: 0, shakeX: 0, shakeY: 0, overview: false };
    this.state = 'title';
    this.paused = false;
    this.timeScale = 1;
    this.slowT = 0;
    this.acc = 0;
    this.time = 0;
    this.bigText = null;
    this.aim = null;
    this.echo = null;
    this.run = null;
    this.hole = null;
    this.st = null;
    this.M = relicMods(new Set());
    this.view = { top: 100, bottom: 700 };
    this.lastTap = 0;
    this.demo = null;
  }

  // ---------- 화면 레이아웃 / 카메라 ----------
  layout(top, bottom) {
    this.view.top = top;
    this.view.bottom = bottom;
    this.hudTop = top - 50;
  }
  camTarget(snap = false) {
    const h = this.hole;
    if (!h) return;
    const W = this.R.w,
      worldW = h.cols * T,
      worldH = h.rows * T;
    const top = this.view.top,
      bot = this.view.bottom;
    const availH = Math.max(100, bot - top);
    const fit = Math.min((W - 6) / worldW, 1.6);
    const over = Math.min(fit, availH / (worldH + 8));
    const scale = this.cam.overview || this.state === 'intro' || this.state === 'title' ? over : fit;
    let cy, y;
    if (worldH * scale <= availH) {
      cy = top + availH / 2;
      y = worldH / 2;
    } else {
      cy = top + availH / 2;
      const b = this.st && this.st.balls[0];
      let fy = b ? b.y : h.tee.y;
      if (this.aim && this.aim.path) {
        const e = this.aim.path.pts[this.aim.path.pts.length - 1];
        fy = fy * 0.65 + e[1] * 0.35;
      }
      const halfAbove = (cy - top) / scale,
        halfBelow = (bot - cy) / scale;
      y = Math.max(halfAbove - 6, Math.min(worldH - halfBelow + 6, fy));
    }
    const c = this.cam;
    const k = snap ? 1 : 0.1;
    c.x = worldW / 2;
    c.scale += (scale - c.scale) * (snap ? 1 : 0.15);
    c.y += (y - c.y) * k;
    c.cy += (cy - c.cy) * (snap ? 1 : 0.2);
  }
  toWorld(sx, sy) {
    const c = this.cam;
    return [(sx - this.R.w / 2) / c.scale + c.x, (sy - c.cy) / c.scale + c.y];
  }
  toScreen(wx, wy) {
    const c = this.cam;
    return [(wx - c.x) * c.scale + this.R.w / 2, (wy - c.y) * c.scale + c.cy];
  }
  shake(a) {
    this.cam.shake = Math.max(this.cam.shake, a);
  }

  // ---------- 타이틀 데모 ----------
  startDemo(worldId) {
    const seed = hashStr('demo-' + worldId + '-' + Math.floor(Math.random() * 1000));
    this.state = 'title';
    this.run = null;
    this.setHole(generateHole(seed, 3 + Math.floor(Math.random() * 4), worldId), worldId, 0);
    this.demo = { wait: 1.2 };
    this.camTarget(true);
  }

  setHole(h, worldId, idx) {
    this.hole = h;
    this.st = makeState(h);
    this.st.balls = [newBall(h.tee.x, h.tee.y)];
    this.df = distField(h);
    const w = WORLD_MAP[worldId] || WORLDS[0];
    this.world = w;
    this.theme = w.themes[idx >= 9 ? 1 : 0];
    this.R.setHole(h, this.theme, w);
    this.fx.clear();
    this.aim = null;
    this.echo = null;
    this.cos = { ball: meta.cosmetic('ball'), trail: meta.cosmetic('trail'), flag: meta.cosmetic('flag') };
  }

  // ---------- 런 ----------
  newRun({ mode = 'normal', world = 'meadow', seed = null, startRelic = null }) {
    const date = dateSeedStr();
    if (mode === 'daily') {
      seed = hashStr('daily-' + date);
      world = WORLDS[hashStr('dw-' + date) % WORLDS.length].id;
    }
    if (seed == null) seed = (Math.random() * 2 ** 32) >>> 0;
    const hearts = this.opts.hearts || RUN.startHearts;
    this.run = {
      mode,
      world,
      seed,
      date,
      holeIdx: this.opts.startHole || 0,
      hearts,
      maxHearts: Math.max(hearts, RUN.maxHearts),
      coins: 0,
      maxCoins: 0,
      relics: [],
      scorecard: [],
      strokesTotal: 0,
      parTotal: 0,
      counts: { aces: 0, eagles: 0, birdies: 0 },
    };
    if (startRelic) this.addRelic(startRelic, true);
    this.startHole(this.run.holeIdx);
  }

  resumeRun(snap) {
    this.run = JSON.parse(JSON.stringify(snap));
    this.startHole(this.run.holeIdx, true);
  }

  runSnapshot() {
    return JSON.parse(JSON.stringify(this.run));
  }

  get relicSet() {
    return new Set(this.run ? this.run.relics : []);
  }
  has(id) {
    return this.run && this.run.relics.includes(id);
  }

  addRelic(id, silent) {
    const r = this.run;
    if (id === '_heart') {
      r.hearts = Math.min(r.maxHearts, r.hearts + 1);
      sfx.heal();
      return;
    }
    if (id === '_coins') {
      r.coins += 6;
      r.maxCoins = Math.max(r.maxCoins, r.coins);
      sfx.coin();
      return;
    }
    if (r.relics.includes(id)) return;
    r.relics.push(id);
    if (id === 'vitality') {
      r.maxHearts += 2;
      r.hearts = Math.min(r.maxHearts, r.hearts + 2);
    }
    meta.track('relicsTaken');
    const isNew = meta.discover(id);
    meta.persist();
    this.M = relicMods(this.relicSet);
    if (!silent) sfx.relic();
    return isNew;
  }

  startHole(idx, resumed = false) {
    const r = this.run;
    r.holeIdx = idx;
    const h = generateHole(r.seed, idx, r.world);
    this.setHole(h, r.world, idx);
    this.M = relicMods(this.relicSet);
    this.par = h.par + (this.has('parplus') ? 1 : 0);
    this.strokes = 0;
    this.lost = 0;
    this.firstShot = true;
    this.mulliganUsed = false;
    this.snap = null;
    this.timeLeft = h.timeLimit || 0;
    this.holeCoins = 0;
    this.cam.overview = false;
    this.state = 'intro';
    this.introT = 1.6;
    this.camTarget(true);
    // 이어하기 저장 (홀 시작 시점)
    meta.saveRun(this.runSnapshot());
    const boss = BOSS[idx];
    const nine = idx === 9 ? `후반 9홀 시작` : idx === 0 ? `${this.world.name} 코스` : '';
    this.ui.banner(`HOLE ${idx + 1}`, `파 ${this.par}${nine ? ' · ' + nine : ''}${resumed ? ' · 이어하기' : ''}`, boss ? `보스: ${boss.name}<br>${boss.desc}` : '');
    this.ui.hud(this);
    this.ui.showTutorial(idx === this.run.holeIdx && !meta.meta().settings.tutorial);
  }

  // ---------- 입력 ----------
  canAim() {
    return this.state === 'ready' && !this.paused;
  }
  onDown(x, y) {
    if (this.paused) return;
    if (this.state === 'intro') {
      this.introT = Math.min(this.introT, 0.15);
      return;
    }
    if (this.state === 'rolling') {
      const now = performance.now();
      // 브레이크: 더블탭
      if (this.has('brake') && now - this.lastTap < 320) {
        for (const b of this.st.balls)
          if (b.moving && !b.brakeUsed) {
            b.vx *= 0.02;
            b.vy *= 0.02;
            b.brakeUsed = true;
            this.fx.ring(b.x, b.y, '#ff5252', 22, 0.4);
            this.fx.pop('브레이크!', b.x, b.y - 18, { color: '#ff8a80', size: 14 });
            sfx.lip();
          }
      }
      this.lastTap = now;
      // 스키 왁스: 얼음 위에서 탭 방향으로 꺾기
      if (this.has('skiwax')) {
        const [wx, wy] = this.toWorld(x, y);
        for (const b of this.st.balls) {
          if (!b.moving || b.steerUsed) continue;
          const tv = this.hole.grid.t[Math.floor(b.y / T) * this.hole.cols + Math.floor(b.x / T)];
          if (tv !== TILE.ICE) continue;
          const sp = Math.hypot(b.vx, b.vy);
          const d = Math.hypot(wx - b.x, wy - b.y) || 1;
          b.vx = ((wx - b.x) / d) * sp;
          b.vy = ((wy - b.y) / d) * sp;
          b.steerUsed = true;
          this.fx.sparkle(b.x, b.y, '#80deea', 8);
          this.fx.pop('슝!', b.x, b.y - 16, { color: '#80deea', size: 14 });
        }
      }
      return;
    }
    if (!this.canAim()) return;
    this.aim = { sx: x, sy: y, cx: x, cy: y, power: 0, dx: 0, dy: 0, path: null, lastTick: 0 };
  }
  onMove(x, y) {
    const a = this.aim;
    if (!a || this.state !== 'ready') return;
    a.cx = x;
    a.cy = y;
    const dx = a.sx - x,
      dy = a.sy - y;
    const len = Math.hypot(dx, dy);
    if (len < PHYS.cancelPx) {
      a.power = 0;
      a.path = null;
      return;
    }
    a.dx = dx / len;
    a.dy = dy / len;
    a.power = Math.min(1, len / PHYS.maxDragPx);
    const tick = Math.floor(a.power * 10);
    if (tick !== a.lastTick) {
      a.lastTick = tick;
      sfx.aimTick(a.power);
    }
    const b = this.st.balls[0];
    const v0 = a.power * this.maxSpeed();
    const k = 0.9,
      aa = 140;
    const dist = Math.min(1100, v0 / k - (aa / (k * k)) * Math.log(1 + (k * v0) / aa)) + 10;
    const bounces = (this.has('longaim') ? 3 : 1) + (this.has('cushion') ? 1 : 0);
    a.path = previewPath(this.hole, this.st, b.x, b.y, a.dx, a.dy, dist, bounces);
  }
  onUp() {
    const a = this.aim;
    if (!a) return;
    this.aim = null;
    if (this.state !== 'ready') return;
    if (a.power <= 0) {
      this.ui.toast('샷 취소');
      return;
    }
    this.shoot(a.dx, a.dy, a.power);
  }
  onCancel() {
    this.aim = null;
  }

  maxSpeed() {
    let s = PHYS.maxShotSpeed * (this.has('tailwind') ? 1.25 : 1);
    if (this.firstShot && this.has('luckytee')) s *= 1.3;
    return s;
  }

  shoot(dx, dy, power) {
    const st = this.st;
    const b = st.balls[0];
    const sp = power * this.maxSpeed();
    // 멀리건용 스냅샷
    this.snap = {
      x: b.x,
      y: b.y,
      strokes: this.strokes,
      hearts: this.run.hearts,
      lost: this.lost,
      coins: this.run.coins,
      crateAlive: st.crateAlive.slice(),
      coinTaken: st.coinTaken.slice(),
      cupGone: st.cupGone.slice(),
      firstShot: this.firstShot,
    };
    this.shotStart = { x: b.x, y: b.y };
    const reset = (bb) => Object.assign(bb, { moving: true, stopT: 0, rollT: 0, ghostUsed: false, ghostComp: -1, skimUsed: false, skimming: false, lip: -1, waterHit: false, steerUsed: false, brakeUsed: false, trail: [] });
    const fire = (bb, ang) => {
      const c = Math.cos(ang),
        s = Math.sin(ang);
      bb.vx = (dx * c - dy * s) * sp;
      bb.vy = (dx * s + dy * c) * sp;
      reset(bb);
    };
    if (this.firstShot && this.has('split')) {
      const b2 = newBall(b.x, b.y);
      fire(b, -0.09);
      fire(b2, 0.09);
      st.balls.push(b2);
      this.fx.pop('분열!', b.x, b.y - 20, { color: '#80deea' });
    } else fire(b, 0);
    this.strokes++;
    meta.track('shots');
    this.firstShot = false;
    this.state = 'rolling';
    this.shotPath = [[b.x, b.y]];
    this.pathTick = 0;
    this.settleT = 0;
    sfx.shot(power);
    vib(12);
    if (power > 0.75) this.shake(3 * power);
    this.fx.ring(b.x, b.y, '#ffffff', 16, 0.3);
    this.ui.showTutorial(false);
    if (!meta.meta().settings.tutorial) {
      meta.meta().settings.tutorial = true;
      meta.persist();
    }
    this.ui.hud(this);
  }

  // ---------- 업데이트 ----------
  update(dtReal) {
    if (this.paused) return;
    this.time += dtReal;
    if (this.slowT > 0) {
      this.slowT -= dtReal;
      if (this.slowT <= 0) this.timeScale = 1;
    }
    const dt = dtReal * this.timeScale;
    // 카메라 흔들림
    const c = this.cam;
    if (c.shake > 0.05) {
      c.shakeX = (Math.random() - 0.5) * c.shake * 2;
      c.shakeY = (Math.random() - 0.5) * c.shake * 2;
      c.shake *= Math.pow(0.02, dtReal);
    } else c.shakeX = c.shakeY = c.shake = 0;
    if (this.bigText) {
      this.bigText.t += dtReal;
      if (this.bigText.t > this.bigText.life) this.bigText = null;
    }
    this.fx.update(dt);
    if (!this.st) return;

    if (this.state === 'title') this.updateDemo(dt);
    if (this.state === 'intro') {
      this.introT -= dtReal;
      if (this.introT <= 0) {
        this.state = 'ready';
        this.ui.banner(null);
      }
    }
    // 보스 제한 시간
    if (this.timeLeft > 0 && (this.state === 'ready' || this.state === 'rolling')) {
      this.timeLeft -= dtReal;
      if (this.timeLeft <= 0) {
        this.strokes++;
        this.timeLeft = 30;
        const b = this.st.balls[0];
        this.fx.pop('시간 초과! +1', b.x, b.y - 24, { color: '#ff8a80', size: 18, life: 1.4 });
        sfx.heart();
        this.shake(4);
        if (this.state === 'ready') this.heartCheck();
      }
      this.ui.timer(this.timeLeft);
    }
    // 고정 스텝 물리 (월드 시간은 항상 흐름: 풍차/움직이는 벽)
    this.acc += dt;
    let n = 0;
    const ev = [];
    while (this.acc >= FIXED && n < 10) {
      this.acc -= FIXED;
      n++;
      if (this.state === 'rolling' || (this.state === 'title' && this.demo && this.demo.rolling)) stepWorld(this.hole, this.st, FIXED, this.M, ev);
      else this.st.t += FIXED;
      if (ev.length) {
        this.handleEvents(ev);
        ev.length = 0;
      }
      if (this.state === 'rolling' && ++this.pathTick % 3 === 0) {
        const b = this.st.balls[0];
        if (b.moving) this.shotPath.push([b.x, b.y]);
      }
    }
    if (n >= 10) this.acc = 0;
    // 잔상/애니메이션
    for (const b of this.st.balls) {
      if (b.moving) {
        b.trail.push([b.x, b.y]);
        if (b.trail.length > 12) b.trail.shift();
        if (this.cos.trail.sparkle && Math.random() < 0.4) this.fx.add({ x: b.x, y: b.y, vx: (Math.random() - 0.5) * 30, vy: (Math.random() - 0.5) * 30, life: 0.5, color: '#fff59d', type: 'star', size: 2.5, drag: 2 });
      } else if (b.trail.length) b.trail.shift();
      if (b.sunk) b.sinkT = (b.sinkT || 0) + dt;
      if (b.waterHit) b.waterSink = (b.waterSink || 0) + dt;
    }
    if (this.state === 'rolling') this.checkSettled(dt);
    this.camTarget();
  }

  updateDemo(dt) {
    const d = this.demo;
    if (!d) return;
    const b = this.st.balls[0];
    if (d.rolling) {
      if (!b.moving) {
        d.rolling = false;
        d.wait = 1.4;
        if (b.sunk) {
          this.fx.confetti(b.sinkX, b.sinkY, 30);
          d.reset = 1.2;
        }
        if (b.waterHit) {
          Object.assign(b, { x: d.px, y: d.py, waterHit: false, waterSink: 0 });
        }
      }
      return;
    }
    if (d.reset > 0) {
      d.reset -= dt;
      if (d.reset <= 0) this.startDemo(this.world.id);
      return;
    }
    d.wait -= dt;
    if (d.wait <= 0) {
      const shot = planShot(this.hole, this.st, b.x, b.y, this.M, PHYS.maxShotSpeed, { angles: 16, powers: [0.3, 0.5, 0.75] });
      if (!shot) return;
      d.px = b.x;
      d.py = b.y;
      b.vx = Math.cos(shot.a) * shot.p * PHYS.maxShotSpeed;
      b.vy = Math.sin(shot.a) * shot.p * PHYS.maxShotSpeed;
      Object.assign(b, { moving: true, stopT: 0, rollT: 0, lip: -1, trail: [] });
      d.rolling = true;
    }
  }

  handleEvents(ev) {
    const demo = this.state === 'title';
    for (const e of ev) {
      switch (e.type) {
        case 'wall':
          if (!demo) sfx.wall(e.speed, e.wood);
          if (e.speed > 220) this.fx.sparks(e.x, e.y, e.nx, e.ny, Math.min(10, Math.floor(e.speed / 80)));
          if (e.speed > 650 && !demo) this.shake(2.5);
          break;
        case 'bumper':
          this.R.flashBumper(e.bp);
          this.fx.sparks(e.x, e.y, 0, -1, 10, '#ff80ab');
          this.fx.ring(e.x, e.y, '#ff4f8b', 22, 0.3);
          if (demo) break;
          sfx.bumper();
          meta.track('bumpers');
          if (this.has('bounceking')) this.gainCoins(1, e.x, e.y - 16);
          break;
        case 'crate':
          this.fx.debris(e.x, e.y);
          if (demo) break;
          sfx.crate();
          this.shake(4);
          vib(15);
          meta.track('crates');
          break;
        case 'cup':
          if (demo) {
            sfx.cup();
            break;
          }
          if (this.hole.cups[e.cup].real) {
            sfx.cup();
            this.timeScale = 0.3;
            this.slowT = 0.55;
            vib([20, 40, 30]);
          } else {
            e.ball.fake = true;
          }
          break;
        case 'lip':
          if (demo) break;
          sfx.lip();
          this.fx.pop('립아웃!', e.x, e.y - 18, { color: '#ffe57f', size: 15 });
          this.fx.sparks(e.x, e.y, 0, -1, 6);
          break;
        case 'water':
          this.fx.splash(e.x, e.y);
          if (demo) break;
          sfx.splash();
          this.shake(3);
          vib(30);
          meta.track('water');
          break;
        case 'skim':
          this.fx.ring(e.x, e.y, '#e1f5fe', 18, 0.4);
          if (!demo) this.fx.pop('스침!', e.x, e.y - 16, { color: '#b3e5fc', size: 14 });
          break;
        case 'tele':
          this.fx.ring(e.x, e.y, '#e040fb', 26, 0.4);
          this.fx.ring(e.tx, e.ty, '#e040fb', 26, 0.5);
          this.fx.sparkle(e.tx, e.ty, '#f8bbff', 10);
          if (!demo) sfx.tele();
          break;
        case 'coin':
          this.fx.sparkle(e.x, e.y, '#fff59d', 10);
          if (demo) break;
          meta.track('coins');
          this.gainCoins(1, e.x, e.y - 14);
          break;
        case 'ghost':
          if (demo) break;
          sfx.ghost();
          this.fx.pop('통과!', e.x, e.y - 16, { color: '#d1c4e9', size: 14 });
          break;
      }
    }
  }

  gainCoins(n, x, y) {
    const r = this.run;
    if (!r) return;
    r.coins += n;
    r.maxCoins = Math.max(r.maxCoins, r.coins);
    this.holeCoins += n;
    sfx.coin();
    if (x != null) this.fx.pop(`+${n}`, x, y, { color: '#ffe082', size: 14 });
    this.ui.hud(this, 'coin');
  }

  checkSettled(dt) {
    const balls = this.st.balls;
    const sunkReal = balls.find((b) => b.sunk && !b.fake);
    if (sunkReal) {
      this.settleT += dt;
      if (this.settleT > 0.35) this.holeComplete(sunkReal);
      return;
    }
    if (balls.some((b) => b.moving)) return;
    this.settleT += dt;
    const wait = balls.some((b) => b.waterHit || b.fake) ? 0.7 : 0.05;
    if (this.settleT < wait) return;
    this.resolveShot();
  }

  resolveShot() {
    const st = this.st;
    const r = this.run;
    const snap = this.snap;
    if (this.has('echo')) this.echo = this.shotPath;
    let balls = st.balls;
    // 가짜 컵
    const fake = balls.find((b) => b.fake);
    if (fake) {
      st.cupGone[fake.sinkCup] = true;
      this.strokes++;
      this.fx.pop('가짜 컵! +1', fake.sinkX, fake.sinkY - 20, { color: '#ff8a80', size: 18, life: 1.4 });
      sfx.heart();
      this.shake(4);
    }
    const water = balls.filter((b) => b.waterHit);
    let alive = balls.filter((b) => !b.waterHit && !b.fake && !b.dead);
    if (!alive.length) {
      // 전부 물 또는 가짜 컵 -> 이전 위치로
      if (water.length) {
        this.strokes++;
        const w = water[0];
        this.fx.pop('벌타 +1', w.x, w.y - 20, { color: '#80d8ff', size: 16, life: 1.3 });
      }
      const b = newBall(snap.x, snap.y);
      st.balls = [b];
    } else {
      // 여러 공이면 컵에 가장 가까운 공만 남김
      let best = alive[0];
      if (alive.length > 1) {
        const score = (b) => {
          const d = this.df[Math.floor(b.y / T) * this.hole.cols + Math.floor(b.x / T)];
          return d < 0 ? 1e9 : d;
        };
        best = alive.reduce((a, b) => (score(b) < score(a) ? b : a));
      }
      const tv = this.hole.grid.t[Math.floor(best.y / T) * this.hole.cols + Math.floor(best.x / T)];
      if (!isPass(tv) && tv !== TILE.WATER) settleToFloor(this.hole, best);
      best.trail = [];
      best.ghostComp = -1;
      st.balls = [best];
    }
    this.state = 'ready';
    this.heartCheck();
    this.ui.hud(this);
  }

  // 파를 넘기는 게 확정된 타수만큼 하트 차감
  heartCheck() {
    const r = this.run;
    const need = this.strokes + 1 - this.par;
    const delta = need - this.lost;
    if (delta > 0) {
      r.hearts = Math.max(0, r.hearts - delta);
      this.lost = need;
      const b = this.st.balls[0];
      this.fx.pop(`-${'♥'.repeat(Math.min(3, delta))}`, b.x, b.y - 26, { color: '#ff5c8a', size: 20, life: 1.3 });
      sfx.heart();
      vib([20, 40, 20]);
      this.shake(3);
      this.ui.hud(this, 'heart');
      this.checkDeath();
    }
  }
  checkDeath() {
    if (this.run.hearts > 0 || this.state === 'decide') return;
    this.state = 'decide';
    this.aim = null;
    if (this.has('mulligan') && !this.mulliganUsed && this.snap) this.ui.mulliganPrompt(this);
    else setTimeout(() => this.gameOver(), 900);
  }
  debugLoseHeart() {
    if (!this.run || this.state !== 'ready') return;
    this.run.hearts = Math.max(0, this.run.hearts - 1);
    sfx.heart();
    this.ui.hud(this, 'heart');
    this.checkDeath();
  }

  canMulligan() {
    return this.has('mulligan') && !this.mulliganUsed && this.snap && (this.state === 'ready' || this.state === 'decide');
  }
  useMulligan() {
    if (!this.canMulligan()) return;
    const s = this.snap;
    const st = this.st;
    this.mulliganUsed = true;
    this.strokes = s.strokes;
    this.run.hearts = s.hearts;
    this.lost = s.lost;
    this.run.coins = s.coins;
    st.crateAlive = s.crateAlive;
    st.coinTaken = s.coinTaken;
    st.cupGone = s.cupGone;
    this.firstShot = s.firstShot;
    st.balls = [newBall(s.x, s.y)];
    this.state = 'ready';
    this.fx.ring(s.x, s.y, '#ffb300', 30, 0.5);
    this.fx.pop('멀리건!', s.x, s.y - 20, { color: '#ffd54f', size: 18 });
    sfx.relic();
    this.ui.hud(this);
  }

  holeComplete(ball) {
    const r = this.run;
    const diff = this.strokes - this.par;
    const ace = this.strokes === 1;
    this.state = 'celebrate';
    let key = ace ? 'ace' : String(Math.max(-3, diff));
    let text = SCORE_TEXT[key] || (diff > 0 ? `+${diff}` : 'WOW');
    if (diff >= 3) text = `+${diff}`;
    let coins = 0,
      heal = 0;
    const rng = mulberry32(mix(r.seed, r.holeIdx, 4242));
    if (ace) {
      coins = RUN.coinAce;
      heal = 1;
    } else if (diff <= -2) {
      coins = RUN.coinEagle;
      heal = 1;
    } else if (diff === -1) {
      coins = RUN.coinBirdie;
      heal = this.has('harvest') || rng() < RUN.birdieHealChance ? 1 : 0;
    } else if (diff === 0) coins = RUN.coinPar;
    if (diff < 0 && this.has('harvest') && heal === 1 && diff <= -2) heal = 2;
    if (this.has('coinmag')) coins += 1;
    const colors = ace || diff <= -2 ? ['#fff176', '#ff9100'] : diff === -1 ? ['#b9f6ca', '#00c853'] : diff === 0 ? ['#e3f2fd', '#42a5f5'] : ['#ffcdd2', '#e53935'];
    const subs = [];
    if (coins) subs.push(`+${coins} 코인`);
    const healed = Math.min(heal, r.maxHearts - r.hearts);
    if (healed > 0) subs.push(`하트 +${healed}`);
    this.bigText = { text, sub: subs.join('  '), t: 0, life: 2.2, c1: colors[0], c2: colors[1] };
    r.coins += coins;
    r.maxCoins = Math.max(r.maxCoins, r.coins);
    r.hearts += healed;
    if (healed) sfx.heal();
    const level = ace || diff <= -2 ? 2 : diff === -1 ? 1 : 0;
    if (diff <= 0) sfx.fanfare(level);
    const cx = ball.sinkX,
      cy = ball.sinkY;
    this.fx.confetti(cx, cy, diff <= 0 ? 70 : 25);
    if (diff <= -1) {
      let k = 0;
      const fire = () => {
        if (k++ >= (level === 2 ? 6 : 3) || this.state !== 'celebrate') return;
        this.fx.firework(cx + (Math.random() - 0.5) * 200, cy + (Math.random() - 0.3) * 200);
        sfx.bumper();
        setTimeout(fire, 260);
      };
      setTimeout(fire, 300);
    }
    this.shake(ace ? 6 : 3);
    // 기록
    r.scorecard.push({ hole: r.holeIdx + 1, par: this.par, strokes: this.strokes });
    r.strokesTotal += this.strokes;
    r.parTotal += this.par;
    meta.track('holes');
    meta.track('strokes', this.strokes);
    if (ace) {
      meta.track('aces');
      r.counts.aces++;
    }
    if (diff <= -2) {
      meta.track('eagles');
      r.counts.eagles++;
    }
    if (diff <= -1) {
      meta.track('birdies');
      if (diff === -1) r.counts.birdies++;
    }
    if (diff <= 0) meta.track('parOrBetter');
    if (diff > 0) meta.track('bogeys');
    if (this.hole.boss) meta.track('bossClears');
    meta.persist();
    const ach = meta.checkAchievements();
    for (const a of ach) this.ui.toast(`업적 달성! <b>${a.name}</b> +${a.gems} 보석`, 2600);
    if (ach.length) meta.takeNotices();
    this.ui.hud(this);
    setTimeout(() => this.afterHole(), 2300);
  }

  afterHole() {
    if (this.state !== 'celebrate') return;
    const r = this.run;
    if (r.holeIdx >= RUN.holes - 1) {
      this.showResult(true);
      return;
    }
    this.state = 'reward';
    this.ui.rewardScreen(this, this.rewardOptions(), (id) => {
      if (id) {
        const isNew = this.addRelic(id);
        const def = RELIC_MAP[id] || CONSUMABLES.find((c) => c.id === id);
        if (def) this.ui.toast(`<b>${def.name}</b> 획득${isNew ? ' · 도감에 새로 등록!' : ''}`);
      } else {
        r.coins += RUN.skipCoins;
        r.maxCoins = Math.max(r.maxCoins, r.coins);
        sfx.coin();
      }
      this.ui.hud(this);
      if (RUN.shopAfter.includes(r.holeIdx)) {
        this.state = 'shop';
        this.ui.shopScreen(this, this.shopItems(), () => this.startHole(r.holeIdx + 1));
      } else this.startHole(r.holeIdx + 1);
    });
  }

  relicPool() {
    const owned = new Set(this.run.relics);
    const unlocked = new Set(meta.meta().unlockedRelics);
    return RELICS.filter((x) => unlocked.has(x.id) && !owned.has(x.id));
  }
  pickRelics(rng, n, exclude = []) {
    const pool = this.relicPool().filter((x) => !exclude.includes(x.id));
    const out = [];
    while (out.length < n && pool.length) {
      const tw = pool.reduce((s, x) => s + 1 / x.rarity, 0);
      let t = rng() * tw;
      let k = 0;
      for (; k < pool.length - 1; k++) {
        t -= 1 / pool[k].rarity;
        if (t <= 0) break;
      }
      out.push(pool.splice(k, 1)[0]);
    }
    return out;
  }
  rewardOptions() {
    const r = this.run;
    const rng = mulberry32(mix(r.seed, r.holeIdx, 777));
    const out = this.pickRelics(rng, 3).map((x) => x.id);
    let k = 0;
    while (out.length < 3) out.push(CONSUMABLES[k++ % CONSUMABLES.length].id);
    return out;
  }
  shopItems() {
    const r = this.run;
    const rng = mulberry32(mix(r.seed, r.holeIdx, 999));
    const rel = this.pickRelics(rng, 3).map((x) => ({ id: x.id, price: RUN.relicPriceMin + x.rarity * 2 + Math.floor(rng() * 3), sold: false }));
    rel.push({ id: '_heart', price: RUN.shopHeartPrice, sold: false });
    return rel;
  }
  buy(item) {
    const r = this.run;
    if (item.sold || r.coins < item.price) return false;
    if (item.id === '_heart' && r.hearts >= r.maxHearts) return false;
    r.coins -= item.price;
    item.sold = true;
    this.addRelic(item.id);
    this.ui.hud(this);
    return true;
  }

  gameOver() {
    if (this.state === 'result' || !this.run) return;
    sfx.gameOver();
    this.showResult(false);
  }

  showResult(complete) {
    const r = this.run;
    this.state = 'result';
    const holesCleared = r.scorecard.length;
    const toPar = r.strokesTotal - r.parTotal;
    const res = meta.finishRun({
      mode: r.mode,
      world: r.world,
      date: r.date,
      holesCleared,
      toPar,
      strokes: r.strokesTotal,
      complete,
      relicsCount: r.relics.length,
      maxCoins: r.maxCoins,
      counts: r.counts,
    });
    meta.takeNotices();
    this.ui.resultScreen(this, { complete, holesCleared, toPar, ...res });
  }

  quitToTitle() {
    this.run = null;
    this.paused = false;
    this.ui.showTitle();
  }

  // ---------- 디버그 ----------
  autoShotPlan() {
    const b = this.st.balls[0];
    const shot = planShot(this.hole, this.st, b.x, b.y, this.M, this.maxSpeed(), { angles: 32 });
    return shot;
  }
  autoAimDrag() {
    const s = this.autoShotPlan();
    if (!s) return null;
    const x0 = this.R.w / 2,
      y0 = (this.view.top + this.view.bottom) / 2;
    const len = Math.max(PHYS.cancelPx + 1, s.p * PHYS.maxDragPx);
    return { x0, y0, x1: x0 - Math.cos(s.a) * len, y1: y0 - Math.sin(s.a) * len, power: s.p, sunk: s.sunk };
  }
  debugAutoShot() {
    if (this.state !== 'ready') return;
    const s = this.autoShotPlan();
    if (s) this.shoot(Math.cos(s.a), Math.sin(s.a), s.p);
  }
  debugSink() {
    if (this.state !== 'ready' && this.state !== 'rolling') return;
    const b = this.st.balls[0];
    const i = this.hole.cups.findIndex((c) => c.real);
    const c = cupPos(this.hole, this.st, i);
    if (this.state === 'ready') this.strokes++;
    this.state = 'rolling';
    Object.assign(b, { sunk: true, moving: false, sinkCup: i, sinkX: c.x, sinkY: c.y, sinkT: 0 });
    sfx.cup();
    this.settleT = 0;
  }
  info() {
    return {
      state: this.state,
      hole: this.run ? this.run.holeIdx + 1 : 0,
      hearts: this.run ? this.run.hearts : 0,
      coins: this.run ? this.run.coins : 0,
      strokes: this.strokes,
      par: this.par,
      relics: this.run ? this.run.relics.slice() : [],
      ball: this.st ? { x: this.st.balls[0].x, y: this.st.balls[0].y, moving: this.st.balls.some((b) => b.moving) } : null,
      world: this.world && this.world.id,
      boss: this.hole && this.hole.boss,
    };
  }
}
