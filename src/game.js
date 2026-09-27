// 게임 상태/규칙: 런 진행, 튜토리얼, 충돌, 게이트, 전투, 요새, 보너스 계단, 파워업, 결과
import * as THREE from 'three';
import { CFG, THEMES, COLORS, REVIVE_COSTS } from './config.js';
import { pickChunk, applyGate, gateLabel, makeRng, TUT_CHUNKS } from './chunks.js';
import { save, persist, startCount, magnetTime, bootsTime, recruitTime, startShieldChance, gateLuck, coinMult, fortMult, skin, track, checkAchievements, addGems, addFrags, themeFort, weekInfo, reportWeekly } from './data.js';
import { sfx, setIntensity, setMusic, duck, setWind } from './audio.js';
import { PU_NAMES } from './entities.js';

const vib = (ms) => { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) { /* 무시 */ } };
const TUT_TRIGGER = { lr: 13, up: 5.2, down: 6.5 };

export class Game {
  constructor({ world, chars, ents, swarm, parts, popups, ui, opts, hat }) {
    Object.assign(this, { world, chars, ents, swarm, parts, popups, ui, opts, hat });
    this.themeBase = 0;
    this.startDist = 0;
    this.mult = 1;
    this.crowdScore = 0;
    this.state = 'title';
    this.mode = 'run';
    this.time = 0;
    this.dist = 0;
    this.lane = 1;
    this.v3 = new THREE.Vector3();
    this.wp = new THREE.Vector3();
    this.hitstop = 0;
    this.slowT = 0;
    this.titleSetup();
  }

  // ---------- 타이틀 ----------
  titleSetup() {
    this.state = 'title';
    this.ents.clearAll();
    this.parts.clear();
    this.dist = 0;
    this.lane = 1;
    this.speed = 6;
    this.section = 0;
    this.swarm.ground = null;
    this.world.resetTheme(save.themes.sel, 0);
    this.applySkin();
    this.swarm.reset(14, 0, 0);
    this.swarm.lookBack = false;
    this.world.snapNext = true;
    this.ui.show('title');
    this.ui.tutorial(null);
    this.ui.battleHint(false);
    setMusic('title');
    duck(false);
  }

  applySkin() {
    const sk = skin();
    this.swarm.skin = sk;
    this.swarm.hat = this.hat;
    this.hat.set(sk.hat, sk.leader);
  }

  themeIdx(section = this.section) { return (this.themeBase + section) % THEMES.length; }

  // ---------- 런 시작 ----------
  startRun(weekly = false) {
    this.ents.clearAll();
    this.parts.clear();
    const o = this.opts;
    this.weekly = weekly ? weekInfo() : null;
    this.tutorial = !save.tutorialDone && !weekly && !this.opts.noTutorial;
    this.tutIdx = 0;
    this.tutWait = null;
    this.rng = makeRng(weekly ? this.weekly.seed : (o.seed ?? (Date.now() & 0xffffff)));
    this.dist = o.start || 0;
    this.startDist = this.dist;
    this.section = Math.floor(this.dist / CFG.sectionLen);
    this.themeBase = weekly ? this.weekly.seed % THEMES.length : save.themes.sel;
    this.world.resetTheme(this.themeIdx(), this.dist);
    this.world.snapNext = true;
    this.applySkin();
    this.mult = save.mset.level;
    this.crowdScore = 0;
    this.revives = 0;
    this.invuln = 0;
    this.trackT = 0;
    this.runTime = 0;
    this.lane = 1;
    this.mode = 'run';
    this.modeT = 0;
    this.speed = this.sectionSpeed();
    this.speedF = 1;
    this.hitstop = 0;
    this.slowT = 0;
    this.jumpBuf = 0;
    this.rush = 0;
    this.attract = null;
    this.attractT = 0;
    this.laneT = -1;
    this.combo = 0;
    this.distAcc = 0;
    this.swarm.ground = null;
    const n = o.count || (this.tutorial ? 15 : weekly ? 12 : startCount());
    this.swarm.reset(n, this.dist, 0);
    this.swarm.lookBack = true;
    this.coinsRun = 0;
    this.coinTally = 0;
    this.maxCount = n;
    this.forts = 0;
    this.enemiesKilled = 0;
    this.pu = { magnet: 0, boots: 0, recruit: 0 };
    this.shield = Math.random() < startShieldChance();
    this.genD = this.dist + (this.tutorial ? 10 : 30);
    this.slot = 0;
    this.goodForced = new Set();
    this.fortPlaced = new Set();
    this.chargers = [];
    this.siegeAcc = 0;
    this.battleAcc = 0;
    this.battleE = null;
    this.coinSfxT = 0;
    this.hitSfxT = 0;
    this.deathCause = '';
    this.stair = null;
    this.dbg = { maxY: 0, minHW: 99, gates: [], capped: 0 };
    this.ui.tutorial(null);
    this.ui.battleHint(false);
    this.ui.holdToasts(true);
    this.state = 'play';
    this.ui.show('play');
    if (!this.tutorial) this.ui.banner(weekly ? '주간 챌린지' : `구간 ${this.section + 1}`, weekly ? `목표 ${this.weekly.target}m` : THEMES[this.themeIdx()].name);
    else this.ui.banner('스웜 서퍼', '무리를 이끌고 달려요!');
    this.generate();
    save.stats.runs++;
    persist();
    this.notify(checkAchievements());
    setIntensity(0);
    setMusic('run', this.themeIdx());
    duck(false);
  }

  sectionSpeed() {
    const frac = (this.dist % CFG.sectionLen) / CFG.sectionLen;
    const base = Math.min(CFG.maxSpeed, CFG.baseSpeed + CFG.speedPerSection * this.section + CFG.speedInSection * frac);
    return base * (this.opts.speed || 1) * (this.tutorial ? 0.85 : 1);
  }

  // ---------- 절차적 생성 ----------
  generate() {
    let guard = 0;
    while (this.genD < this.dist + CFG.spawnAhead && guard++ < 50) {
      if (this.tutorial && this.tutIdx < TUT_CHUNKS.length) {
        const c = TUT_CHUNKS[this.tutIdx++]();
        this.spawnItems(c.items, this.genD);
        this.genD += c.len;
        continue;
      }
      const sec = Math.floor(this.genD / CFG.sectionLen);
      const fortD = (sec + 1) * CFG.sectionLen;
      const frac = (this.genD % CFG.sectionLen) / CFG.sectionLen;
      const D = sec + frac * 0.9;
      if (!this.fortPlaced.has(fortD) && this.genD > fortD - 75) {
        this.placeFortress(fortD, sec);
        this.genD = fortD + 30;
        continue;
      }
      const ch = pickChunk(this.rng, D, this.slot++, this.opts.chunks);
      // 700~950m 구간에는 좋은 게이트 줄 1개 보장
      const allGood = frac > 0.7 && frac < 0.95 && !this.goodForced.has(sec) && (ch.cat === 'gate');
      const ctx = { count: this.swarm.count, luck: gateLuck(), allGood, lane: this.lane };
      const c = ch.gen(this.rng, D, ctx);
      if (ctx.usedGood) this.goodForced.add(sec);
      if (this.genD + c.len > fortD - 60 && !this.fortPlaced.has(fortD)) {
        this.genD = fortD - 74;
        continue;
      }
      this.spawnItems(c.items, this.genD);
      this.genD += c.len;
    }
  }

  spawnItems(items, base) {
    for (const it of items) {
      if (it.t === 'obs') this.ents.addObstacle(it, base);
      else if (it.t === 'gates') this.ents.addGateRow(it, base);
      else if (it.t === 'coin') this.ents.addCoin(it, base);
      else if (it.t === 'enemy') {
        this.ents.addEnemy(it, base);
        const e = this.ents.enemies[this.ents.enemies.length - 1];
        // 조우 직전에 현재 인원 기준으로 다시 정할 비율. 가끔은 피해야 하는 큰 무리
        const sec = Math.floor((base + it.d) / CFG.sectionLen);
        e.frac = it.tut ? null : this.rng() < 0.15 + sec * 0.04 ? 0.85 + this.rng() * 0.4 : 0.22 + this.rng() * 0.3 + Math.min(0.35, sec * 0.08);
      }
      else if (it.t === 'power') this.ents.addPower(it, base, this.rollPower());
    }
  }

  rollPower() {
    const w = { ...CFG.powerupWeights };
    w.shield += save.upgrades.shield * 0.4;
    const tot = Object.values(w).reduce((a, b) => a + b, 0);
    let r = this.rng() * tot;
    for (const k in w) { r -= w[k]; if (r <= 0) return k; }
    return 'magnet';
  }

  fortHp(sec, count) {
    const raw = Math.max(count * CFG.fortHpFloor, CFG.fortHpBase + CFG.fortHpPerSec * sec + count * (CFG.fortHpFrac + CFG.fortHpFracPerSec * sec));
    const cap = count * Math.min(CFG.fortHpCapMax, CFG.fortHpCap + CFG.fortHpCapPerSec * sec);
    return Math.max(1, Math.min(Math.round(raw * (this.opts.fortHp || 1)), Math.floor(cap)));
  }

  placeFortress(fortD, sec) {
    this.fortPlaced.add(fortD);
    const items = [];
    for (let l = 0; l < 3; l++) for (let i = 0; i < 6; i++) items.push({ t: 'coin', x: (l - 1) * CFG.laneW, d: 10 + i * 3, y: 0.6 });
    this.spawnItems(items, fortD - 60);
    this.ents.placeFortress(fortD, this.fortHp(sec, this.swarm.count));
    this.ents.fortress.sec = sec;
    this.ents.fortress.hpFinal = false;
  }

  // ---------- 입력 ----------
  action(a) {
    if (this.state !== 'play') return;
    if (a === 'pause') { this.pause(); return; }
    if (this.mode === 'dying') return;
    if (a === 'tap') {
      if (this.mode === 'stairs' && this.stair && this.stair.phase === 'hold') { this.stair.hold = Math.min(this.stair.hold, 0.05); this.ui.closeReward(); return; }
      if (this.mode === 'battle' || this.mode === 'siege') {
        this.rush = Math.min(1, this.rush + 0.2);
        this.ui.rushPulse();
        sfx.tick();
      }
      return;
    }
    if (this.tutWait) {
      const st = this.tutWait.step;
      const ok = (st === 'lr' && (a === 'left' || a === 'right')) || (st === 'up' && a === 'up') || (st === 'down' && a === 'down');
      if (!ok) return;
      this.tutWait.o.tutDone = true;
      this.tutWait = null;
      this.ui.tutorial(null);
      sfx.powerup();
    }
    if (this.mode === 'stairs') return;
    if (a === 'left' || a === 'right') {
      const nl = Math.max(0, Math.min(2, this.lane + (a === 'left' ? -1 : 1)));
      if (nl !== this.lane) { this.lane = nl; this.laneT = this.time; sfx.lane(); }
    } else if (a === 'up') {
      if (!this.tryJump()) this.jumpBuf = CFG.jumpBuffer;
    } else if (a === 'down') {
      this.jumpBuf = 0;
      this.swarm.slide(this.speed * this.speedF + 2);
      sfx.slide();
      save.stats.slides++;
      this.notify(track('slides', 1));
    }
  }

  tryJump() {
    const L = this.swarm.leader;
    if (!L || L.y > 0.25) return false;
    this.swarm.jump(this.speed * this.speedF + 2, this.pu.boots > 0);
    sfx.jump();
    save.stats.jumps++;
    this.notify(track('jumps', 1));
    return true;
  }

  pause() {
    if (this.state !== 'play' && this.state !== 'countdown') return;
    this.state = 'pause';
    this.ui.countdown(0);
    this.ui.show('pause');
    duck(true);
  }
  // 재개 시 3, 2, 1 카운트다운
  resume() {
    if (this.state !== 'pause') return;
    this.state = 'countdown';
    this.cdT = 3;
    this.cdShown = 0;
    this.ui.show('play');
    duck(false);
  }

  // ---------- 업데이트 ----------
  wind(v) {
    const q = Math.round(v * 20) / 20;
    if (q !== this._wind) { this._wind = q; setWind(q); }
  }

  update(dtReal) {
    this.time += dtReal;
    if (this.state !== 'play') this.wind(0);
    if (this.state === 'title') { this.updateTitle(dtReal); return; }
    if (this.state === 'revive') {
      this.reviveT -= dtReal;
      this.ui.reviveBar(Math.max(0, this.reviveT / 6));
      if (this.reviveT <= 0) this.finishRun();
      return;
    }
    if (this.state === 'countdown') {
      this.cdT -= dtReal;
      const n = Math.ceil(this.cdT);
      if (n !== this.cdShown && n > 0) { this.cdShown = n; this.ui.countdown(n); sfx.tick(); }
      if (this.cdT <= 0) { this.state = 'play'; this.ui.countdown(0); sfx.go(); }
      return;
    }
    if (this.state !== 'play') return;
    let scale = 1;
    if (this.hitstop > 0) { this.hitstop -= dtReal; scale = 0.06; }
    if (this.slowT > 0) { this.slowT -= dtReal; scale = Math.min(scale, 0.3); }
    if (this.tutWait) scale = Math.min(scale, 0.2);
    if (this.mode === 'dying') scale *= 0.35;
    this.step(dtReal * scale, dtReal);
  }

  updateTitle(dt) {
    this.dist += 6 * dt;
    this.swarm.update(dt, this.dist, 6, Math.sin(this.time * 0.6) * 0.6);
    if (Math.random() < dt * 0.35) this.swarm.jump(6, false);
    this.chars.begin();
    this.swarm.render(this.chars, this.dist, this.time, false);
    this.chars.end();
    this.ents.update(dt, this.time, this.dist);
    this.parts.update(dt);
    this.world.update(dt, this.dist, 6, { x: 0, d: this.dist, spread: 0 }, 0, 'title');
    this.ui.setCount(0, 0, 0, false);
    this.ui.setEnemyLabels([]);
  }

  step(dt, dtReal) {
    const sw = this.swarm;
    this.modeT += dt;
    if (this.mode === 'run') this.speed = this.sectionSpeed();
    const fTarget = this.mode === 'battle' ? CFG.battleSpeed : (this.mode === 'siege' || this.mode === 'dying' || this.mode === 'stairs') ? 0 : 1;
    this.speedF += (fTarget - this.speedF) * (1 - Math.exp(-dt * (fTarget < this.speedF ? 10 : 3)));
    let vel = this.speed * this.speedF;
    if (this.mode === 'stairs') vel = this.updateStairs(dt, dtReal);
    this.dist += vel * dt;
    this.distAcc += vel * dt * this.mult * this.comboMult();
    const f = this.ents.fortress;
    if (f && f.active && !f.broken && this.dist > f.d - 2.6) this.dist = f.d - 2.6;

    const laneX = (this.lane - 1) * CFG.laneW;
    sw.update(dt, this.dist, Math.max(vel, 4), laneX, this.attract);

    // 점프 입력 버퍼: 착지 직전 입력도 착지 순간 점프
    if (this.jumpBuf > 0) { this.jumpBuf -= dtReal; if (this.tryJump()) this.jumpBuf = 0; }
    if (this.rush > 0) this.rush = Math.max(0, this.rush - dt * 0.6);

    for (const k in this.pu) if (this.pu[k] > 0) this.pu[k] = Math.max(0, this.pu[k] - dt);
    if (this.invuln > 0) this.invuln -= dt;
    this.runTime += dt;
    this.trackT += dt;
    if (this.trackT > 1 && this.mode !== 'dying') { this.trackT = 0; this.trackRun(); }
    if (this.runTime > 2.5 && !this.tutorial) this.ui.holdToasts(false);

    if (this.mode !== 'dying') {
      this.updateTutorial();
      this.checkGates(dt);
      this.checkObstacles();
      this.checkCoins(dt);
      this.checkPowerups();
      this.checkEnemies(dt);
      this.checkFortress(dt);
    }
    this.updateChargers(dt);
    this.ui.battleHint(this.mode === 'battle' || this.mode === 'siege');

    // 보상 코인 카운트업
    if (this.coinTally > 0) {
      const k = Math.max(1, Math.ceil(this.coinTally * Math.min(1, dtReal * 4)));
      this.coinTally -= k; this.coinsRun += k;
      if (Math.random() < 0.5) sfx.tally();
    }

    if (sw.count > this.maxCount) this.maxCount = sw.count;
    if (sw.leader) { this.dbg.maxY = Math.max(this.dbg.maxY, sw.leader.y); if (sw.leader.slideT > 0) this.dbg.minHW = Math.min(this.dbg.minHW, sw.form.hw); }
    if (sw.count <= 0 && this.mode !== 'dying' && this.chargers.length === 0) this.die();
    if (this.mode === 'dying' && this.modeT > 1.0) this.endRun();

    this.generate();
    this.ents.update(dt, this.time, this.dist);
    this.parts.update(dt);
    this.renderScene(dt, vel);
  }

  renderScene(dt, vel) {
    const sw = this.swarm;
    this.chars.begin();
    sw.render(this.chars, this.dist, this.time, this.pu.boots > 0);
    this.renderEnemies(dt);
    for (const c of this.chargers) this.chars.push(c.x, c.y, -c.d, 0, 1, 1.1, 1, this.swarm.skin.crew[c.alt ? 1 : 0], 0, -0.5, true, this.time * 20, 1.2);
    this.chars.end();

    const dome = this.ents.shieldDome;
    dome.visible = this.shield && sw.members.length > 0;
    if (dome.visible) {
      const cx = (sw.bounds.minX + sw.bounds.maxX) / 2;
      const r = Math.max(1.2, sw.form.R * 1.3 + 0.6);
      dome.position.set(cx, 0, -(this.dist - sw.form.rz - 0.2));
      dome.scale.set(Math.max(1.1, (sw.bounds.maxX - sw.bounds.minX) / 2 + 0.6), r * 0.8, sw.form.rz + 1.2);
      dome.material.opacity = 0.16 + Math.sin(this.time * 6) * 0.05;
    }

    const L = sw.leader;
    const spread = Math.min(4, sw.form.rz);
    const lift = sw.ground ? sw.ground(this.dist) : 0;
    const focus = { x: L ? L.x : 0, d: this.dist, spread, lift };
    const sr = Math.min(1, (this.speed - CFG.baseSpeed * 0.6) / (CFG.maxSpeed - CFG.baseSpeed * 0.6)) * this.speedF;
    this.wind(this.mode === 'dying' ? 0 : Math.max(0.05, sr));
    const inten = this.mode === 'battle' || this.mode === 'siege' ? 2 : Math.min(2, this.section);
    if (inten !== this._inten) { this._inten = inten; setIntensity(inten); }
    this.world.update(dt, this.dist, vel, focus, sr, 'play');

    let my = null;
    if (L) {
      my = this.project(L.x, L.y + lift + 1.55, -this.dist);
      this.ui.setCount(sw.count, my.x, my.y, my.ok, this.mode === 'battle' || this.mode === 'siege');
    } else this.ui.setCount(0, 0, 0, false);

    const labels = [];
    const f = this.ents.fortress;
    const wall = f && f.active && !f.broken ? f.d : Infinity;
    for (const e of this.ents.enemies) {
      if (e.dead || e.count <= 0) continue;
      const ed = e.d - e.adv;
      if (ed - this.dist > 55 || ed > wall) continue; // 멀거나 성벽 너머는 표시 안 함
      const p = this.project(e.x, 1.5, -(ed + e.rz * 0.3));
      if (!p.ok) continue;
      // 내 인원 배지와 겹치면 위로 올림
      if (my && Math.abs(p.x - my.x) < 90 && Math.abs(p.y - my.y) < 44) p.y = my.y - 46;
      labels.push({ n: e.count, x: p.x, y: p.y, danger: e.danger && e.state !== 'battle', hit: e.hitT > 0 });
      if (e.hitT > 0) e.hitT -= dt;
    }
    this.ui.setEnemyLabels(labels);

    const pus = [];
    for (const k of ['magnet', 'boots', 'recruit']) if (this.pu[k] > 0) pus.push({ kind: k, frac: this.pu[k] / (k === 'magnet' ? magnetTime() : k === 'boots' ? bootsTime() : recruitTime()) });
    if (this.shield) pus.push({ kind: 'shield', frac: 1 });
    this.ui.setPowerups(pus);
    this.ui.setHud(this.dist, this.coinsRun, (this.dist % CFG.sectionLen) / CFG.sectionLen, this.section, THEMES[this.themeIdx()].name, this.score(), this.mult);
  }

  project(x, y, z) {
    this.v3.set(x, y, z).project(this.world.camera);
    const el = this.ui.root;
    return { x: (this.v3.x * 0.5 + 0.5) * el.clientWidth, y: (-this.v3.y * 0.5 + 0.5) * el.clientHeight, ok: this.v3.z < 1 && this.v3.z > -1 };
  }

  // ---------- 튜토리얼 ----------
  updateTutorial() {
    if (!this.tutorial || this.tutWait) return;
    for (const o of this.ents.obstacles) {
      if (!o.tut || o.tutDone) continue;
      const ahead = o.d - o.halfL - this.dist;
      if (ahead > TUT_TRIGGER[o.tut] || ahead < -2) continue;
      if (o.tut === 'lr' && this.lane !== 1) { o.tutDone = true; continue; }
      this.tutWait = { step: o.tut, o };
      this.ui.tutorial(o.tut);
      sfx.tut();
      return;
    }
    for (const r of this.ents.gateRows) {
      if (r.tut && !r.tutShown && r.d - this.dist < 32) { r.tutShown = true; this.ui.tutorial('gate'); }
      if (r.tut && r.used && !r.tutHidden) { r.tutHidden = true; this.ui.tutorial(null); }
    }
    let tutEnemy = false;
    for (const e of this.ents.enemies) {
      if (!e.tut) continue;
      tutEnemy = true;
      if (!e.tutShown && e.d - this.dist < 30) { e.tutShown = true; this.ui.tutorial('enemy'); }
      if (e.dead || e.state === 'passed') { this.finishTutorial(); return; }
    }
    // 안전장치: 튜토리얼 청크를 모두 지났는데 적이 사라진 경우
    if (!tutEnemy && this.tutIdx >= TUT_CHUNKS.length && this.dist > 260) this.finishTutorial();
  }

  finishTutorial() {
    this.tutorial = false;
    save.tutorialDone = true;
    persist();
    this.ui.tutorial(null);
    this.ui.banner('튜토리얼 완료!', '이제 진짜 시작, 요새까지 달려요');
    sfx.gateGood(true);
  }

  // ---------- 게이트 ----------
  // 게이트 선택은 목표 레인 기준 (2개짜리 줄의 가운데 레인은 리더 x 로 결정)
  pickGate(row) {
    const L = this.swarm.leader;
    const lx = (this.lane - 1) * CFG.laneW;
    let best = null, bd = 1e9, second = 1e9;
    for (const g of row.gates) {
      const d = Math.abs(lx - g.x);
      if (d < bd) { second = bd; bd = d; best = g; } else if (d < second) second = d;
    }
    if (best && Math.abs(second - bd) < 0.05 && L) {
      bd = 1e9;
      for (const g of row.gates) { const d = Math.abs(L.x - g.x); if (d < bd) { bd = d; best = g; } }
    }
    return best;
  }

  checkGates(dt) {
    const sw = this.swarm;
    if (!sw.leader) return;
    const vel = Math.max(4, this.speed * this.speedF);
    if (this.attractT > 0) { this.attractT -= dt; if (this.attractT <= 0) this.attract = null; }
    for (const row of this.ents.gateRows) {
      if (row.used) continue;
      const ahead = row.d - this.dist;
      // 가까워지면 현재 인원 기준으로 게이트 값 보정
      if (ahead < 45 && !row.capped) {
        row.capped = true;
        const growCap = CFG.growCapBase + CFG.growCapPerSec * this.section;
        for (const g of row.gates) {
          let changed = false;
          if (g.op === '-') {
            const cap = Math.max(1, Math.floor(sw.count * 0.5));
            if (g.v > cap) { g.v = cap; changed = true; }
          } else if (g.op === '÷' && g.v > 2 && sw.count >= 200) { g.v = 2; changed = true; }
          else if (g.op === 'x' && sw.count * (g.v - 1) > growCap) {
            g.op = '+'; g.v = Math.max(10, Math.round(growCap / 10) * 10); changed = true;
          }
          if (changed) { this.ents.drawGate(g.mesh, g); this.dbg.capped++; }
        }
      }
      // 통과 직전: 현재 목표 레인의 게이트 쪽으로 무리 전체를 흡착 (레인을 바꾸면 따라감)
      if (ahead < vel * 0.6 && ahead > -1) {
        const g = this.pickGate(row);
        if (g) { this.attract = { x: g.x, k: 1.1, w: g.w }; this.attractT = 0.6; }
      }
      if (this.dist < row.d) continue;
      row.used = true;
      const best = this.pickGate(row);
      row.target = best;
      if (!best) continue;
      this.attract = { x: best.x, k: 1.1, w: best.w };
      this.attractT = Math.max(0.35, (sw.form.rz * 2 + 1) / vel);
      best.chosen = true;
      const before = sw.count;
      let after = Math.max(0, Math.min(CFG.maxCount, applyGate(before, best)));
      // 손해 게이트 상한: 통과 직전 인원의 50% 까지만 잃음
      if (after < before) after = Math.max(Math.ceil(before * 0.5), after, Math.min(before, 1));
      // 아슬아슬: 통과 0.3초 안에 레인을 바꿔 이득 게이트를 잡으면 +10%
      let clutch = 0;
      if (after > before && this.time - this.laneT < 0.3 && this.laneT > 0) {
        clutch = Math.max(1, Math.round(after * 0.1));
        after = Math.min(CFG.maxCount, after + clutch);
      }
      const removed = sw.setCount(after, 0.2, best.x, best.w * 0.8);
      const delta = after - before;
      this.dbg.gates.push({ label: gateLabel(best), before, after, lane: this.lane, x: best.x });
      const good = delta >= 0;
      this.popups.show(best.x, 2.2, -row.d, (delta >= 0 ? '+' : '') + delta, good ? 'good' : 'bad');
      if (clutch) { this.popups.show(best.x, 3.2, -row.d, `아슬아슬! +${clutch}`, 'big'); sfx.stamp(); }
      if (good) {
        sfx.gateGood(best.op === 'x');
        vib(10);
        this.parts.burst(best.x, 1.2, -row.d, 18, { color: 0x6ac8ff, speed: 5, up: 3, size: 0.16, vz: -2 });
        save.stats.goodGates++;
        this.notify(track('goodGates', 1));
        for (let i = 0; i < Math.min(12, delta); i++) setTimeout(() => sfx.pop(), 60 + i * 35);
        if (best.op === 'x') { this.slowT = 0.15; this.ui.stamp(gateLabel(best), true); sfx.stamp(); this.world.shake = Math.max(this.world.shake, 0.3); }
      } else {
        sfx.gateBad();
        vib([20, 30, 20]);
        this.world.shake = Math.max(this.world.shake, 0.35);
        this.ui.flash(true);
        if (best.op === '÷') this.ui.stamp(gateLabel(best), false);
        for (const m of removed) this.parts.burst(m.x, 0.5, -(this.dist + m.rel), 3, { color: COLORS.bad, speed: 3, up: 2, size: 0.13 });
      }
    }
  }

  // ---------- 장애물 ----------
  checkObstacles() {
    const sw = this.swarm;
    const r = CFG.memberR;
    const lo = this.dist + sw.bounds.minRel - 1.5, hi = this.dist + 1.5;
    for (const o of this.ents.obstacles) {
      if (o.dead) continue;
      // 무리 꼬리까지 지나간 장애물: 손실 없으면 콤보 +1, 잃었으면 콤보 끊김
      if (!o.scored && o.d + o.halfL < lo && o.d + o.halfL > lo - 6 && !this.tutorial) {
        o.scored = true;
        const near = Math.abs(o.x - (sw.bounds.minX + sw.bounds.maxX) / 2) < o.halfW + 2.5;
        if (near) {
          if (o.kills > 0) { if (this.combo >= 3) this.popups.show(o.x, 2, -o.d, '콤보 끊김', 'bad'); this.combo = 0; }
          else { this.combo++; if (this.combo >= 3) this.ui.combo(this.combo, this.comboMult()); }
        }
      }
      if (o.d + o.halfL < lo || o.d - o.halfL > hi) continue;
      if (o.x + o.halfW < sw.bounds.minX - r || o.x - o.halfW > sw.bounds.maxX + r) continue;
      for (let j = sw.members.length - 1; j >= 0; j--) {
        const m = sw.members[j];
        const md = this.dist + m.rel;
        if (Math.abs(md - o.d) > o.halfL + r) continue;
        if (Math.abs(m.x - o.x) > o.halfW + r * 0.6) continue;
        const top = m.y + sw.height(m);
        if (top < o.y0 + 0.02 || m.y > o.y1) continue;
        if (this.opts.god || this.invuln > 0) continue;
        if (this.shield && !this.tutorial) { this.breakObstacle(o); break; }
        // 튜토리얼 중이거나 피해 상한에 도달한 장애물: 튕겨 나며 비틀거림
        if (this.tutorial || o.spent) { this.stumble(m, o); continue; }
        o.kills = o.kills || 0;
        if (!o.cap) o.cap = Math.max(CFG.obstacleCapMin, Math.ceil(sw.count * (o.kind === 'train' ? CFG.trainCapFrac : CFG.obstacleCapFrac)));
        const rep = Math.max(1, Math.round(sw.count / sw.members.length));
        this.hitMember(j, o);
        o.kills += rep;
        if (o.kills >= o.cap && sw.count > 0) {
          o.spent = true;
          this.dbg.capped++;
          this.popups.show(o.x, 2.2, -o.d, '버텼다!', 'good');
        }
      }
    }
  }

  stumble(m, o) {
    if (m.stag > 0.3) return;
    m.stag = 0.7;
    if (o.kind === 'train') { m.vx = (m.x >= o.x ? 1 : -1) * 9; m.vrel = -4; }
    else if (m.y < 0.2) { m.vy = o.kind === 'bar' ? 0 : 5.8; m.g = CFG.gravity; m.vrel = -3; if (o.kind === 'bar') m.slideT = 0.4; }
  }

  breakObstacle(o) {
    this.shield = false;
    o.dead = true;
    o.t = 0;
    sfx.shieldBreak();
    vib(30);
    this.world.shake = Math.max(this.world.shake, 0.5);
    this.parts.burst(o.x, 1, -o.d, 30, { color: 0x5ae8ff, speed: 7, up: 4, size: 0.2, vz: -3 });
    this.popups.show(o.x, 2, -o.d, '방패!', 'good');
  }

  hitMember(j, o) {
    const sw = this.swarm;
    const m = sw.members[j];
    const wasLeader = j === 0;
    const dir = m.x >= o.x ? 1 : -1;
    const md = this.dist + m.rel;
    sw.kill(j, this.dist, dir);
    if (this.combo) { this.combo = 0; this.ui.combo(0); }
    this.parts.burst(m.x, m.y + 0.4, -md, 5, { color: wasLeader ? this.swarm.skin.leader : this.swarm.skin.crew[0], speed: 4, up: 3, size: 0.12 });
    if (this.time - this.hitSfxT > 0.05) { sfx.hit(); this.hitSfxT = this.time; }
    this.world.shake = Math.max(this.world.shake, wasLeader ? 0.6 : 0.22);
    vib(wasLeader ? 40 : 12);
    if (wasLeader) {
      this.hitstop = 0.09;
      this.ui.flash(true);
      if (sw.count > 0) this.popups.show(m.x, 1.8, -md, '리더 교체!', 'bad');
    }
    if (sw.count <= 0) this.deathCause = o.kind === 'train' ? '기차에 부딪혀 전멸' : o.kind === 'cone' ? '콘에 걸려 전멸' : '장애물에 부딪혀 전멸';
  }

  // ---------- 코인 ----------
  checkCoins(dt) {
    const sw = this.swarm;
    const L = sw.leader;
    if (!L) return;
    const B = sw.bounds;
    const lo = this.dist + B.minRel - 0.8, hi = this.dist + 0.8;
    const magnet = this.pu.magnet > 0, recruit = this.pu.recruit > 0;
    const rad = recruit ? CFG.recruitRadius : CFG.magnetRadius;
    const cx = (B.minX + B.maxX) / 2, cd = this.dist - sw.form.rz * 0.5;
    for (const c of this.ents.coins) {
      if (!c.alive) continue;
      if (magnet || recruit) {
        const dx = cx - c.x, dd = cd - c.d;
        if (c.pull || (Math.abs(dd) < rad && Math.abs(dx) < rad && c.d > this.dist - 2)) {
          c.pull = 1;
          const k = Math.min(1, dt * 10);
          c.x += dx * k; c.d += dd * k + this.speed * this.speedF * dt; c.y += (0.8 - c.y) * k;
          if (Math.abs(dx) < 0.7 && Math.abs(dd) < 0.9) { this.collectCoin(c, recruit); continue; }
        }
      }
      if (c.d < lo || c.d > hi || c.x < B.minX - 0.6 || c.x > B.maxX + 0.6) continue;
      for (let j = 0; j < sw.members.length; j++) {
        const m = sw.members[j];
        if (Math.abs(m.x - c.x) > 0.5) continue;
        if (Math.abs(this.dist + m.rel - c.d) > 0.55) continue;
        if (c.y < m.y - 0.3 || c.y > m.y + sw.height(m) + 0.4) continue;
        this.collectCoin(c, recruit);
        break;
      }
    }
  }

  collectCoin(c, recruit) {
    c.alive = false;
    if (recruit) {
      const sw = this.swarm;
      sw.setCount(sw.count + 1, c.d - this.dist, c.x, 0.4);
      this.parts.burst(c.x, c.y, -c.d, 4, { color: 0x7ad0ff, speed: 2, up: 2, size: 0.12 });
      if (this.time - this.coinSfxT > 0.04) { sfx.pop(); this.coinSfxT = this.time; }
      return;
    }
    this.coinsRun += 1;
    this.parts.burst(c.x, c.y, -c.d, 3, { color: COLORS.coin, speed: 2, up: 2, size: 0.1, gravity: 6 });
    if (this.time - this.coinSfxT > 0.05) { sfx.coin(); this.coinSfxT = this.time; }
  }

  // ---------- 파워업 ----------
  checkPowerups() {
    const sw = this.swarm;
    for (const p of this.ents.powerups) {
      if (!p.alive) continue;
      if (p.d > this.dist + 1 || p.d < this.dist + sw.bounds.minRel - 1) continue;
      let hit = false;
      for (const m of sw.members) if (Math.abs(m.x - p.x) < 0.85 && Math.abs(this.dist + m.rel - p.d) < 0.9) { hit = true; break; }
      if (!hit) continue;
      p.alive = false;
      sfx.powerup();
      vib(15);
      this.parts.burst(p.x, 1.1, -p.d, 20, { color: 0xffffff, speed: 5, up: 3, size: 0.14 });
      if (p.kind === 'magnet') this.pu.magnet = magnetTime();
      else if (p.kind === 'boots') this.pu.boots = bootsTime();
      else if (p.kind === 'recruit') this.pu.recruit = recruitTime();
      else if (p.kind === 'shield') this.shield = true;
      this.popups.show(p.x, 2.2, -p.d, PU_NAMES[p.kind] + '!', 'big');
      save.stats.powerups++;
      this.notify(track('powerups', 1));
    }
  }

  // ---------- 적 무리 ----------
  checkEnemies(dt) {
    const sw = this.swarm;
    const B = sw.bounds;
    for (const e of this.ents.enemies) {
      if (e.dead) continue;
      const front = e.d - e.adv - e.rz;
      // 조우 30m 전: 현재 인원 기준으로 적 인원 재계산
      if (!e.sized && e.frac && front - this.dist < 30) {
        e.sized = true;
        e.count = e.startCount = Math.max(3, Math.round(sw.count * e.frac));
        this.ents.layoutEnemy(e);
      }
      e.danger = e.count > sw.count * 0.7;
      if (e.state === 'idle' && front - this.dist < 18) e.state = 'alert';
      if (e.tut && e.state !== 'battle' && sw.leader) e.x += (sw.leader.x - e.x) * Math.min(1, dt * 3); // 튜토리얼 적은 플레이어 레인으로 다가옴
      if (e.state === 'alert') {
        e.adv += dt * 2.2;
        const L = sw.leader;
        const lateral = L && (e.tut || Math.abs(L.x - e.x) < e.hw + 0.7); // 튜토리얼 적은 반드시 부딪힘
        if (lateral && this.dist + 0.4 >= front && this.mode === 'run') {
          e.state = 'battle';
          this.mode = 'battle';
          this.dbg.battles = (this.dbg.battles || 0) + 1;
          this.modeT = 0;
          this.battleE = e;
          this.battleAcc = -0.3 * CFG.battleRateBase; // 0.3초 서로 파고드는 푸시 후 상쇄 시작
          this.rush = 0;
          for (const m of sw.members) m.vrel += 5;
          e.adv += 1.2;
          this.world.shake = Math.max(this.world.shake, 0.4);
          sfx.alarm();
          vib(20);
        } else if (this.dist + B.minRel > e.d + e.rz + 1) e.state = 'passed';
      }
    }
    if (this.mode === 'battle') this.updateBattle(dt);
  }

  updateBattle(dt) {
    const e = this.battleE;
    const sw = this.swarm;
    const want = e.d - e.rz - this.dist - 0.35;
    if (want > e.adv) e.adv += Math.min(want - e.adv, dt * 8);
    // 탭 연타로 돌격 속도 증가
    this.battleAcc += dt * (CFG.battleRateBase + Math.min(sw.count, e.count) * CFG.battleRateScale) * (1 + this.rush);
    while (this.battleAcc >= 1 && e.count > 0 && sw.count > 0) {
      this.battleAcc -= 1;
      e.count--;
      this.enemiesKilled++;
      let ex = e.x, ed = e.d - e.adv;
      if (e.count < e.members.length) {
        let bi = 0, bz = 1e9;
        for (let i = 0; i < e.members.length; i++) if (e.members[i].oz < bz) { bz = e.members[i].oz; bi = i; }
        const em = e.members.splice(bi, 1)[0];
        ex = e.x + em.ox; ed = e.d - e.adv + em.oz;
      }
      let bi = -1, br = -1e9;
      for (let i = 1; i < sw.members.length; i++) if (sw.members[i].rel > br) { br = sw.members[i].rel; bi = i; }
      if (bi < 0) bi = 0;
      const m = sw.members[bi];
      const mx = m ? m.x : ex, md = m ? this.dist + m.rel : ed;
      sw.remove(bi, 1);
      const px = (ex + mx) / 2, pd = (ed + md) / 2;
      this.parts.burst(px, 0.5, -pd, 2, { color: COLORS.enemy, speed: 4, up: 3, size: 0.12 });
      this.parts.burst(px, 0.5, -pd, 2, { color: this.swarm.skin.crew[0], speed: 4, up: 3, size: 0.12 });
      // 상쇄된 두 캐릭터가 서로 튕겨 나가는 미니 래그돌
      if (sw.flyers.length < 60) {
        const side = Math.random() < 0.5 ? -1 : 1;
        sw.flyers.push({ x: mx, y: 0.3, z: -md, vx: side * (2 + Math.random() * 3), vy: 5 + Math.random() * 3, vz: 3 + Math.random() * 2, rx: 0, rz: 0, vrx: (Math.random() - 0.5) * 16, vrz: side * 10, life: 0.9, color: this.swarm.skin.crew[0] });
        sw.flyers.push({ x: ex, y: 0.3, z: -ed, vx: -side * (2 + Math.random() * 3), vy: 5 + Math.random() * 3, vz: -3 - Math.random() * 2, rx: 0, rz: 0, vrx: (Math.random() - 0.5) * 16, vrz: -side * 10, life: 0.9, color: COLORS.enemy });
      }
      e.hitT = 0.12;
      sfx.clash();
    }
    if (this.modeT % 0.1 < dt) this.world.shake = Math.max(this.world.shake, 0.12);
    if (e.count <= 0) {
      e.dead = true;
      e.members.length = 0;
      e.state = 'dead';
      this.mode = 'run';
      const killed = e.startCount || 0;
      save.stats.enemies += killed;
      this.notify(track('enemies', killed));
      this.battleE = null;
      sfx.gateGood(false);
      sfx.stamp();
      this.ui.stamp('격파', true);
      this.slowT = 0.2;
      // 코인 분수
      const bonus = Math.max(3, Math.round(killed * 0.3));
      this.coinTally += bonus;
      this.popups.show(e.x, 2.4, -(e.d - e.adv), `+${bonus} 코인`, 'coin');
      this.parts.burst(e.x, 0.8, -(e.d - e.adv), 24, { color: COLORS.coin, speed: 3, up: 8, size: 0.16, gravity: 16 });
      if (e.tut && this.tutorial) this.finishTutorial();
    } else if (sw.count <= 0) {
      this.deathCause = '적 무리에게 전멸';
    }
  }

  renderEnemies(dt) {
    for (const e of this.ents.enemies) {
      if (e.members.length === 0) continue;
      const ed0 = e.d - e.adv;
      if (ed0 - this.dist > 110) continue;
      const active = e.state !== 'idle';
      for (const em of e.members) {
        em.ph += dt * (active ? 14 : 5);
        const b = Math.abs(Math.sin(em.ph));
        let x = e.x + em.ox;
        const d = ed0 + em.oz;
        if (e.state === 'battle') x += (Math.random() - 0.5) * 0.12;
        const y = active ? b * 0.28 : b * 0.06;
        this.chars.push(x, y, -d, Math.PI, 1, 1 + (b - 0.5) * 0.1, 1, em.ox > 0 ? COLORS.enemy : COLORS.enemyAlt, 0, 0, true, active ? em.ph : Math.sin(em.ph) * 0.3, active ? 1 : 0.4);
      }
    }
  }

  // ---------- 요새 ----------
  checkFortress(dt) {
    const f = this.ents.fortress;
    if (!f || !f.active || f.broken) return;
    const sw = this.swarm;
    if (!f.hpFinal && f.d - this.dist < 55) {
      f.hpFinal = true;
      f.hp = f.maxHp = this.fortHp(f.sec, sw.count);
      this.ents.drawFortressHp();
    }
    if (this.mode !== 'siege' && this.dist >= f.d - 2.7) {
      this.mode = 'siege';
      this.modeT = 0;
      this.siegeAcc = 0;
      this.rush = 0;
      this.ui.banner('요새 돌격!', `성문 체력 ${Math.ceil(f.hp)} · 탭 연타로 가속`);
      sfx.alarm();
    }
    if (this.mode !== 'siege') return;
    if (this.modeT < 0.4) return;
    this.siegeAcc += dt * (CFG.fortressRate + Math.min(60, f.hp * CFG.fortressRateScale)) * (1 + this.rush);
    let inflight = 0;
    for (const c of this.chargers) inflight += c.rep;
    // 이미 날아가는 인원으로 성문이 부서지면 더 보내지 않음 (헛된 소모 방지)
    while (this.siegeAcc >= 1 && sw.count > 0 && sw.members.length > 0 && inflight < f.hp) {
      this.siegeAcc -= 1;
      let bi = -1, br = -1e9;
      for (let i = 1; i < sw.members.length; i++) if (sw.members[i].rel > br) { br = sw.members[i].rel; bi = i; }
      if (bi < 0) bi = 0;
      const m = sw.members[bi];
      const rep = Math.max(1, Math.round(sw.count / sw.members.length));
      const r2 = Math.min(rep, Math.ceil(f.hp - inflight));
      this.chargers.push({ x: m.x, y: m.y, d: this.dist + m.rel, vy: 3, alt: m.alt, rep: r2, tx: (Math.random() - 0.5) * 2.4 });
      inflight += r2;
      sw.remove(bi, r2);
    }
  }

  updateChargers(dt) {
    const f = this.ents.fortress;
    for (let i = this.chargers.length - 1; i >= 0; i--) {
      const c = this.chargers[i];
      c.d += dt * 16;
      c.x += (c.tx - c.x) * Math.min(1, dt * 6);
      c.vy -= 20 * dt; c.y = Math.max(0, c.y + c.vy * dt);
      if (!f || !f.active || f.broken) { this.chargers.splice(i, 1); continue; }
      if (c.d >= f.d - 0.9) {
        this.chargers.splice(i, 1);
        f.hp -= c.rep;
        f.shake = 1;
        this.parts.burst(c.x, 0.8, -(f.d - 0.9), 3, { color: this.swarm.skin.crew[0], speed: 3, up: 2, size: 0.12, vz: -1 });
        this.parts.burst(c.x, 1.2, -(f.d - 0.9), 1, { color: 0x8a5a32, speed: 3, up: 3, size: 0.16, vz: -1 });
        sfx.pop();
        if (Math.random() < 0.3) sfx.gateHit();
        this.world.shake = Math.max(this.world.shake, 0.1);
        this.ents.drawFortressHp();
        if (f.hp <= 0) { this.breakFortress(); break; }
      }
    }
    if (this.mode === 'siege' && f && !f.broken && this.swarm.count <= 0 && this.chargers.length === 0) {
      this.deathCause = '요새 앞에서 전멸';
    }
  }

  breakFortress() {
    const f = this.ents.fortress;
    f.broken = true;
    this.chargers.length = 0;
    // 붕괴 파편: 작게, 적게, 카메라 반대쪽으로
    for (const p of f.parts) {
      p.m.getWorldPosition(this.wp);
      const n = p.kind === 'door' ? 5 : 6;
      const col = p.m.material.color.getHex();
      for (let i = 0; i < n; i++) {
        this.parts.spawn(this.wp.x + (Math.random() - 0.5) * p.m.scale.x, this.wp.y + (Math.random() - 0.5) * Math.min(3, p.m.scale.y), this.wp.z - 0.3,
          { color: col, speed: 4, up: 5, vz: -3, size: 0.15 + Math.random() * 0.2, life: 1.2 + Math.random() * 0.5, gravity: 18, spin: 10 });
      }
      p.m.visible = false;
    }
    f.sign.visible = false;
    for (let i = 0; i < 24; i++) this.parts.spawn((Math.random() - 0.5) * 8, 0.5, -f.d - 0.5, { color: 0xd8d0c0, speed: 2, up: 1.2, vz: -1, size: 0.35, life: 1, gravity: -1, spin: 2 });
    sfx.collapse();
    vib([40, 40, 80]);
    this.world.shake = 1.0;
    this.hitstop = 0.12;
    this.ui.flash(false);

    const sw = this.swarm;
    this.forts++;
    save.stats.forts++;
    save.stats.maxFortsRun = Math.max(save.stats.maxFortsRun, this.forts);
    this.notify(track('fortress', 1));
    this.notify(track('fortRun', this.forts));
    // 테마 해금: 그 테마에서 요새 3개 격파
    if (!this.weekly) {
      const ti = this.themeIdx();
      if (themeFort(ti)) this.ui.toast(`시작 테마 해금: ${THEMES[ti].name}`);
      else if (!save.themes.unlocked.includes(ti)) this.ui.toast(`${THEMES[ti].name} 요새 ${save.themes.forts[ti]}/3`);
    }
    this.section++;
    // 무리 보너스 점수: 남은 인원 x 구간 x 10
    const crowd = sw.count * this.section * CFG.crowdBonusPerSec;
    this.crowdScore += crowd;
    this.ui.crowdBonus(crowd);

    // 보너스 계단
    const sec = this.section - 1;
    const base = CFG.stairThr0 + CFG.stairThrPerSec * sec;
    let reached = 0; // 첫 칸(x1)은 항상
    CFG.stairMults.forEach((_, i) => { if (i > 0 && sw.count >= Math.round(base * Math.pow(CFG.stairThrGrow, i))) reached = i; });
    const sd = f.d + 1.2;
    this.ents.placeStairs(sd);
    sw.ground = (d) => this.ents.stairHeight(d);
    this.stair = { d: sd, reached, target: sd + (reached + 1) * CFG.stairStepLen - 1.1, step: -1, phase: 'climb', hold: 0, sinkT: 0 };
    if (reached < 0) this.stair.target = sd + 0.4;
    this.mode = 'stairs';
    this.modeT = 0;
    this.fortHideT = setTimeout(() => this.ents.hideFortress(), 50);
  }

  // 계단 오르기 → 도달 배수 보상 → 계단 가라앉음
  updateStairs(dt, dtReal) {
    const st = this.stair;
    const sw = this.swarm;
    if (st.phase === 'climb') {
      if (this.modeT < 0.35) return 0;
      const i = Math.floor((this.dist - st.d) / CFG.stairStepLen);
      if (i > st.step && i >= 0 && i <= st.reached) {
        st.step = i;
        sfx.step(i);
        this.popups.show(0, (i + 1) * CFG.stairStepH + 2.2, -(st.d + (i + 0.5) * CFG.stairStepLen), 'x' + CFG.stairMults[i], 'coin');
      }
      if (this.dist >= st.target - 0.05) {
        st.phase = 'hold';
        st.hold = 3.0;
        this.ents.glowStep(st.reached);
        const mult = st.reached >= 0 ? CFG.stairMults[st.reached] : 1;
        const coins = Math.round((CFG.stairCoinBase + CFG.stairCoinPerSec * (this.section - 1)) * mult * fortMult());
        const gems = st.reached >= 3 ? 1 : 0;
        if (gems) addGems(gems);
        const frag = addFrags(2, this.rng);
        persist();
        this.coinTally += coins;
        this.ui.rewardCard({ mult, coins, gems, frag, crowd: this.crowdScore });
        this.ui.coinFly(Math.min(14, 4 + Math.round(mult * 2)));
        this.world.shake = 0.3;
        sfx.powerup();
        this.parts.burst(0, (st.reached + 1) * CFG.stairStepH + 1.5, -this.dist - 1, 30, { color: COLORS.coin, speed: 5, up: 6, size: 0.18, vz: -1 });
        return 0;
      }
      return 9;
    }
    if (st.phase === 'hold') {
      st.hold -= dtReal;
      if (st.hold <= 0) { st.phase = 'sink'; st.sinkT = 0.5; this.ui.closeReward(); }
      return 0;
    }
    st.sinkT -= dtReal;
    this.ents.stairs.sink = Math.max(0, st.sinkT / 0.5);
    this.ents.stairs.g.scale.y = Math.max(0.001, this.ents.stairs.sink);
    if (st.sinkT <= 0) {
      this.ents.hideStairs();
      sw.ground = null;
      for (const m of sw.members) { m.y = Math.max(m.y, 0.01); m.vy = 0; }
      this.mode = 'run';
      this.modeT = 0;
      this.stair = null;
      this.world.setTheme(this.themeIdx());
      setMusic('run', this.themeIdx());

      setIntensity(Math.min(2, this.section));
      this.ui.banner(`구간 ${this.section + 1} · ${THEMES[this.themeIdx()].name}`, '속도 UP! 더 어려워져요');
    }
    return 0;
  }

  // ---------- 종료 ----------
  die() {
    this.mode = 'dying';
    this.modeT = 0;
    sfx.gameOver();
    vib([60, 50, 60]);
    this.world.shake = 0.8;
    this.ui.flash(true);
    this.ui.tutorial(null);
    this.ui.battleHint(false);
  }

  comboMult() { return 1 + Math.min(this.combo || 0, 20) * 0.05; }
  distScore() { return Math.floor(this.distAcc || 0); }
  score() { return this.distScore() + this.crowdScore; }

  trackRun() {
    const d = Math.floor(this.dist);
    this.notify(track('dist', d));
    this.notify(track('count', this.maxCount));
    this.notify(track('coinsRun', this.coinsRun));
  }

  reviveCost() { return REVIVE_COSTS[Math.min(this.revives, REVIVE_COSTS.length - 1)]; }

  // 게임 오버 연출 이후: 부활 가능하면 부활 제안 (판 안에서 여러 번, 비용 증가)
  endRun() {
    const cost = this.reviveCost();
    if (save.gems >= cost && !this.opts.noRevive) {
      this.state = 'revive';
      this.reviveT = 6;
      this.ui.showRevive(cost, save.gems, this.revives + 1);
      duck(true);
      return;
    }
    this.finishRun();
  }

  revive() {
    const cost = this.reviveCost();
    if (this.state !== 'revive' || save.gems < cost) return;
    save.gems -= cost;
    save.stats.revives++;
    this.revives++;
    persist();
    const sw = this.swarm;
    sw.reset(10, this.dist, (this.lane - 1) * CFG.laneW);
    for (const o of this.ents.obstacles) if (o.d > this.dist - 8 && o.d - o.halfL < this.dist + 30) { o.dead = true; o.t = 0; }
    for (const e of this.ents.enemies) if (!e.dead && e.d < this.dist + 30) { e.dead = true; e.members.length = 0; }
    this.battleE = null;
    this.chargers.length = 0;
    const f = this.ents.fortress;
    this.mode = f && f.active && !f.broken && this.dist >= f.d - 2.7 ? 'siege' : 'run';
    this.modeT = 0;
    this.invuln = 2.5;
    this.shield = true;
    this.state = 'play';
    this.ui.show('play');
    duck(false);
    this.ui.banner('부활!', '무리 10명으로 다시 달려요');
    sfx.powerup();
    this.parts.burst((this.lane - 1) * CFG.laneW, 1, -this.dist, 30, { color: 0xffffff, speed: 6, up: 4, size: 0.18 });
    this.notify(checkAchievements());
  }

  finishRun() {
    if (this.state === 'over') return;
    this.state = 'over';
    duck(true);
    this.trackRun();
    this.coinsRun += Math.max(0, this.coinTally);
    this.coinTally = 0;
    const d = Math.floor(this.dist);
    const sc = this.score();
    const coins = Math.round(this.coinsRun * coinMult());
    const newBest = sc > save.bestScore;
    if (newBest) save.bestScore = sc;
    if (d > save.bestDist) save.bestDist = d;
    if (this.maxCount > save.bestCount) save.bestCount = this.maxCount;
    save.coins += coins;
    save.stats.totalCoins += coins;
    save.stats.totalDist += Math.floor(this.dist - this.startDist);
    save.stats.playTime += this.runTime;
    this.notify(track('coins', coins));
    let weeklyText = '';
    if (this.weekly) {
      const got = reportWeekly(d);
      weeklyText = got ? '주간 챌린지 성공! 보석 +2, 코인 +300' : `주간 챌린지 ${d}m / 목표 ${this.weekly.target}m`;
    }
    this.notify(checkAchievements());
    this.ui.holdToasts(false);
    persist();
    this.ui.showOver({ head: this.weekly ? '주간 챌린지 결과' : '게임 오버', dist: d, score: sc, distScore: this.distScore(), crowdScore: this.crowdScore, mult: this.mult, newBest, cause: weeklyText || this.deathCause || '무리가 모두 사라짐', maxCount: this.maxCount, coins, forts: this.forts });
  }

  notify(list) {
    if (!list || !list.length) return;
    persist();
    for (const n of list) this.ui.toast(n.text);
    sfx.powerup();
  }
}
