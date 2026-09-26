// 게임 상태/규칙: 런 진행, 충돌, 게이트, 전투, 요새, 파워업, 결과
import * as THREE from 'three';
import { CFG, THEMES, COLORS, REVIVE_COST } from './config.js';
import { pickChunk, applyGate, gateLabel, makeRng } from './chunks.js';
import { save, persist, startCount, magnetTime, bootsTime, recruitTime, startShieldChance, gateLuck, coinMult, fortMult, skin, track, checkAchievements, addGems, unlockTheme, weekInfo, reportWeekly } from './data.js';
import { sfx, setIntensity } from './audio.js';
import { PU_NAMES } from './entities.js';

const vib = (ms) => { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) { /* 무시 */ } };

export class Game {
  constructor({ world, chars, ents, swarm, parts, popups, ui, opts, hat }) {
    Object.assign(this, { world, chars, ents, swarm, parts, popups, ui, opts, hat });
    this.themeBase = 0;
    this.startDist = 0;
    this.mult = 1;
    this.state = 'title';
    this.mode = 'run';
    this.time = 0;
    this.dist = 0;
    this.lane = 1;
    this.v3 = new THREE.Vector3();
    this.hitstop = 0;
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
    this.world.resetTheme(save.themes.sel);
    this.applySkin();
    this.swarm.reset(14, 0, 0);
    this.world.camPos.set(3, 3, -8);
    this.ui.show('title');
    this.ui.tutorial(null);
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
    this.rng = makeRng(weekly ? this.weekly.seed : (o.seed ?? (Date.now() & 0xffffff)));
    this.dist = o.start || 0;
    this.startDist = this.dist;
    this.section = Math.floor(this.dist / CFG.sectionLen);
    this.themeBase = weekly ? this.weekly.seed % THEMES.length : save.themes.sel;
    this.world.resetTheme(this.themeIdx());
    this.applySkin();
    this.mult = save.mset.level;
    this.revived = false;
    this.invuln = 0;
    this.trackT = 0;
    this.runTime = 0;
    this.lane = 1;
    this.mode = 'run';
    this.modeT = 0;
    this.speed = this.sectionSpeed();
    this.speedF = 1;
    const n = o.count || (weekly ? 10 : startCount());
    this.swarm.reset(n, this.dist, 0);
    this.coinsRun = 0;
    this.maxCount = n;
    this.forts = 0;
    this.enemiesKilled = 0;
    this.pu = { magnet: 0, boots: 0, recruit: 0 };
    this.shield = Math.random() < startShieldChance();
    this.genD = this.dist + (save.tutorialDone ? 30 : 60);
    this.slot = 0;
    this.fortPlaced = new Set();
    this.chargers = [];
    this.siegeAcc = 0;
    this.battleAcc = 0;
    this.battleE = null;
    this.coinSfxT = 0;
    this.hitSfxT = 0;
    this.deathCause = '';
    this.dbg = { maxY: 0, minHW: 99, gates: [] };
    this.tut = save.tutorialDone ? null : 'lr';
    this.ui.tutorial(this.tut);
    this.state = 'play';
    this.ui.show('play');
    this.ui.banner(weekly ? '주간 챌린지' : `구간 ${this.section + 1}`, weekly ? `목표 ${this.weekly.target}m` : THEMES[this.themeIdx()].name);
    this.generate();
    save.stats.runs++;
    persist();
    this.notify(checkAchievements());
    setIntensity(0);
  }

  sectionSpeed() {
    const frac = (this.dist % CFG.sectionLen) / CFG.sectionLen;
    return Math.min(CFG.maxSpeed, CFG.baseSpeed + CFG.speedPerSection * this.section + CFG.speedInSection * frac) * (this.opts.speed || 1);
  }

  // ---------- 절차적 생성 ----------
  generate() {
    let guard = 0;
    while (this.genD < this.dist + CFG.spawnAhead && guard++ < 50) {
      const sec = Math.floor(this.genD / CFG.sectionLen);
      const fortD = (sec + 1) * CFG.sectionLen;
      const D = sec + ((this.genD % CFG.sectionLen) / CFG.sectionLen) * 0.9;
      if (!this.fortPlaced.has(fortD) && this.genD > fortD - 75) {
        this.placeFortress(fortD, sec);
        this.genD = fortD + 30;
        continue;
      }
      const ch = pickChunk(this.rng, D, this.slot++, this.opts.chunks);
      const ctx = { count: this.swarm.count, luck: gateLuck() };
      const c = ch.gen(this.rng, D, ctx);
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
      else if (it.t === 'enemy') this.ents.addEnemy(it, base);
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

  placeFortress(fortD, sec) {
    this.fortPlaced.add(fortD);
    const items = [];
    for (let l = 0; l < 3; l++) for (let i = 0; i < 6; i++) items.push({ t: 'coin', x: (l - 1) * CFG.laneW, d: 10 + i * 3, y: 0.6 });
    this.spawnItems(items, fortD - 60);
    const hp = Math.round((CFG.fortressHpBase + CFG.fortressHpPerLevel * sec) * (this.opts.fortHp || 1));
    this.ents.placeFortress(fortD, hp);
  }

  // ---------- 입력 ----------
  action(a) {
    if (this.state !== 'play') return;
    if (a === 'pause') { this.pause(); return; }
    if (this.mode === 'dying') return;
    if (a === 'left' || a === 'right') {
      const nl = Math.max(0, Math.min(2, this.lane + (a === 'left' ? -1 : 1)));
      if (nl !== this.lane) { this.lane = nl; sfx.lane(); }
      if (this.tut === 'lr') this.advanceTut('up');
    } else if (a === 'up') {
      const L = this.swarm.leader;
      if (L && L.y < 0.25) {
        this.swarm.jump(this.speed * this.speedF + 2, this.pu.boots > 0);
        sfx.jump();
        save.stats.jumps++;
        this.notify(track('jumps', 1));
      }
      if (this.tut === 'up') this.advanceTut('down');
    } else if (a === 'down') {
      this.swarm.slide(this.speed * this.speedF + 2);
      sfx.slide();
      save.stats.slides++;
      this.notify(track('slides', 1));
      if (this.tut === 'down') this.advanceTut(null);
    }
  }

  advanceTut(next) {
    this.tut = next;
    this.ui.tutorial(next);
    if (!next) { save.tutorialDone = true; persist(); }
  }

  pause() {
    if (this.state !== 'play') return;
    this.state = 'pause';
    this.ui.show('pause');
  }
  resume() {
    if (this.state !== 'pause') return;
    this.state = 'play';
    this.ui.show('play');
  }

  // ---------- 업데이트 ----------
  update(dtReal) {
    this.time += dtReal;
    if (this.state === 'title') { this.updateTitle(dtReal); return; }
    if (this.state === 'pause' || this.state === 'over' || this.state === 'revive') return;
    let dt = dtReal;
    if (this.hitstop > 0) { this.hitstop -= dtReal; dt *= 0.06; }
    if (this.mode === 'dying') dt *= 0.35;
    this.step(dt);
  }

  updateTitle(dt) {
    this.dist += 6 * dt;
    this.swarm.update(dt, this.dist, 6, Math.sin(this.time * 0.6) * 0.6);
    // 가끔 점프
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

  step(dt) {
    const sw = this.swarm;
    this.modeT += dt;
    if (this.mode === 'run') this.speed = this.sectionSpeed();
    const fTarget = this.mode === 'battle' ? CFG.battleSpeed : (this.mode === 'siege' || this.mode === 'breach' || this.mode === 'dying') ? 0 : 1;
    this.speedF += (fTarget - this.speedF) * (1 - Math.exp(-dt * (fTarget < this.speedF ? 10 : 3)));
    const vel = this.speed * this.speedF;
    this.dist += vel * dt;
    const f = this.ents.fortress;
    if (f && f.active && !f.broken && this.dist > f.d - 2.6) this.dist = f.d - 2.6;

    const laneX = (this.lane - 1) * CFG.laneW;
    sw.update(dt, this.dist, Math.max(vel, 4), laneX);

    for (const k in this.pu) if (this.pu[k] > 0) this.pu[k] = Math.max(0, this.pu[k] - dt);
    if (this.invuln > 0) this.invuln -= dt;
    this.runTime += dt;
    this.trackT += dt;
    if (this.trackT > 1 && this.mode !== 'dying') { this.trackT = 0; this.trackRun(); }

    if (this.mode !== 'dying') {
      this.checkGates();
      this.checkObstacles();
      this.checkCoins(dt);
      this.checkPowerups();
      this.checkEnemies(dt);
      this.checkFortress(dt);
    }
    if (this.mode === 'breach' && this.modeT > 1.3) this.mode = 'run';
    this.updateChargers(dt);

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
    this.renderEnemies();
    for (const c of this.chargers) this.chars.push(c.x, c.y, -c.d, 0, 1, 1.1, 1, this.swarm.skin.crew[c.alt ? 1 : 0], 0, -0.5);
    this.chars.end();

    // 방패 돔
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
    const focus = { x: L ? L.x : 0, d: this.dist, spread };
    const sr = Math.min(1, (this.speed - CFG.baseSpeed * 0.6) / (CFG.maxSpeed - CFG.baseSpeed * 0.6)) * this.speedF;
    this.world.update(dt, this.dist, vel, focus, sr, 'play');

    // 인원 라벨
    if (L) {
      const p = this.project(L.x, L.y + 1.55, -this.dist);
      this.ui.setCount(sw.count, p.x, p.y, p.ok, this.mode === 'battle' || this.mode === 'siege');
    } else this.ui.setCount(0, 0, 0, false);

    const labels = [];
    for (const e of this.ents.enemies) {
      if (e.dead || e.count <= 0) continue;
      const ed = e.d - e.adv;
      if (ed - this.dist > 70) continue;
      const p = this.project(e.x, 1.5, -(ed + e.rz * 0.3));
      if (p.ok) labels.push({ n: e.count, x: p.x, y: p.y });
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

  // ---------- 게이트 ----------
  checkGates() {
    const sw = this.swarm;
    const L = sw.leader;
    if (!L) return;
    for (const row of this.ents.gateRows) {
      if (row.used || this.dist < row.d) continue;
      row.used = true;
      let best = null, bd = 1e9;
      for (const g of row.gates) { const d = Math.abs(L.x - g.x); if (d < bd) { bd = d; best = g; } }
      if (!best || bd > best.w / 2 + 0.6) continue;
      best.chosen = true;
      const before = sw.count;
      const after = Math.max(0, Math.min(CFG.maxCount, applyGate(before, best)));
      const removed = sw.setCount(after, 0, best.x);
      const delta = after - before;
      this.dbg.gates.push({ label: gateLabel(best), before, after });
      const good = delta >= 0;
      this.popups.show(best.x, 2.2, -row.d, (delta >= 0 ? '+' : '') + delta, good ? 'good' : 'bad');
      if (good) {
        sfx.gateGood(best.op === 'x');
        vib(10);
        this.parts.burst(best.x, 1.2, -row.d, 18, { color: 0x6ac8ff, speed: 5, up: 3, size: 0.16 });
        save.stats.goodGates++;
        this.notify(track('goodGates', 1));
        // 새 멤버 톡톡 팝
        for (let i = 0; i < Math.min(12, delta); i++) setTimeout(() => sfx.pop(), i * 35);
      } else {
        sfx.gateBad();
        vib([20, 30, 20]);
        this.world.shake = Math.max(this.world.shake, 0.35);
        this.ui.flash(true);
        for (const m of removed) this.parts.burst(m.x, 0.5, -(this.dist + m.rel), 3, { color: COLORS.bad, speed: 3, up: 2, size: 0.13 });
        if (after <= 0) this.deathCause = `${gateLabel(best)} 게이트에서 전멸`;
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
      if (o.d + o.halfL < lo || o.d - o.halfL > hi) continue;
      if (o.x + o.halfW < sw.bounds.minX - r || o.x - o.halfW > sw.bounds.maxX + r) continue;
      for (let j = sw.members.length - 1; j >= 0; j--) {
        const m = sw.members[j];
        const md = this.dist + m.rel;
        if (Math.abs(md - o.d) > o.halfL + r) continue;
        if (Math.abs(m.x - o.x) > o.halfW + r * 0.6) continue;
        const top = m.y + sw.height(m);
        if (top < o.y0 + 0.02 || m.y > o.y1) continue;
        // 충돌
        if (this.opts.god || this.invuln > 0) continue;
        if (this.shield) { this.breakObstacle(o); break; }
        this.hitMember(j, o);
      }
    }
  }

  breakObstacle(o) {
    this.shield = false;
    o.dead = true;
    o.t = 0;
    sfx.shieldBreak();
    vib(30);
    this.world.shake = Math.max(this.world.shake, 0.5);
    this.parts.burst(o.x, 1, -o.d, 30, { color: 0x5ae8ff, speed: 7, up: 4, size: 0.2 });
    this.popups.show(o.x, 2, -o.d, '방패!', 'good');
  }

  hitMember(j, o) {
    const sw = this.swarm;
    const m = sw.members[j];
    const wasLeader = j === 0;
    const dir = m.x >= o.x ? 1 : -1;
    const md = this.dist + m.rel;
    sw.kill(j, this.dist, dir);
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
      sw.setCount(sw.count + 1, c.d - this.dist, c.x);
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
      if (e.state === 'idle' && front - this.dist < 18) e.state = 'alert';
      if (e.state === 'alert') {
        e.adv += dt * 2.2;
        const lateral = B.maxX + 0.25 > e.x - e.hw && B.minX - 0.25 < e.x + e.hw;
        if (lateral && this.dist + 0.4 >= front && this.mode === 'run') {
          e.state = 'battle';
          this.mode = 'battle';
          this.modeT = 0;
          this.battleE = e;
          this.battleAcc = 0;
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
    // 적이 아군 앞쪽으로 돌진
    const want = e.d - e.rz - this.dist - 0.35;
    if (want > e.adv) e.adv += Math.min(want - e.adv, dt * 8);
    this.battleAcc += dt * (CFG.battleRateBase + Math.min(sw.count, e.count) * CFG.battleRateScale);
    while (this.battleAcc >= 1 && e.count > 0 && sw.count > 0) {
      this.battleAcc -= 1;
      e.count--;
      this.enemiesKilled++;
      // 적 대표 멤버 제거 (가장 앞)
      let ex = e.x, ed = e.d - e.adv;
      if (e.count < e.members.length) {
        let bi = 0, bz = 1e9;
        for (let i = 0; i < e.members.length; i++) if (e.members[i].oz < bz) { bz = e.members[i].oz; bi = i; }
        const em = e.members.splice(bi, 1)[0];
        ex = e.x + em.ox; ed = e.d - e.adv + em.oz;
      }
      // 아군 가장 앞 멤버 (리더는 최후)
      let bi = -1, br = -1e9;
      for (let i = 1; i < sw.members.length; i++) if (sw.members[i].rel > br) { br = sw.members[i].rel; bi = i; }
      if (bi < 0) bi = 0;
      const m = sw.members[bi];
      const mx = m ? m.x : ex, md = m ? this.dist + m.rel : ed;
      sw.remove(bi, 1);
      const px = (ex + mx) / 2, pd = (ed + md) / 2;
      this.parts.burst(px, 0.5, -pd, 3, { color: COLORS.enemy, speed: 4, up: 3, size: 0.13 });
      this.parts.burst(px, 0.5, -pd, 3, { color: this.swarm.skin.crew[0], speed: 4, up: 3, size: 0.13 });
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
      this.popups.show(e.x, 2, -(e.d - e.adv), '격파!', 'good');
    } else if (sw.count <= 0) {
      this.deathCause = '적 무리에게 전멸';
    }
  }

  renderEnemies() {
    const t = this.time;
    for (const e of this.ents.enemies) {
      if (e.members.length === 0) continue;
      const ed0 = e.d - e.adv;
      if (ed0 - this.dist > 110) continue;
      const active = e.state !== 'idle';
      for (const em of e.members) {
        em.ph += 0.016 * (active ? 14 : 5);
        const b = Math.abs(Math.sin(em.ph));
        let x = e.x + em.ox, d = ed0 + em.oz;
        if (e.state === 'battle') { x += (Math.random() - 0.5) * 0.12; }
        const y = active ? b * 0.28 : b * 0.06;
        this.chars.push(x, y, -d, Math.PI, 1, 1 + (b - 0.5) * 0.1, 1, em.ox > 0 ? COLORS.enemy : COLORS.enemyAlt, 0, 0);
      }
    }
  }

  // ---------- 요새 ----------
  checkFortress(dt) {
    const f = this.ents.fortress;
    if (!f || !f.active || f.broken) return;
    const sw = this.swarm;
    if (this.mode !== 'siege' && this.dist >= f.d - 2.7) {
      this.mode = 'siege';
      this.modeT = 0;
      this.siegeAcc = 0;
      this.ui.banner('요새 돌격!', `성문 체력 ${Math.ceil(f.hp)}`);
      sfx.alarm();
    }
    if (this.mode !== 'siege') return;
    if (this.modeT < 0.4) return;
    this.siegeAcc += dt * (CFG.fortressRate + Math.min(60, f.hp * CFG.fortressRateScale));
    while (this.siegeAcc >= 1 && sw.count > 0 && sw.members.length > 0) {
      this.siegeAcc -= 1;
      let bi = -1, br = -1e9;
      for (let i = 1; i < sw.members.length; i++) if (sw.members[i].rel > br) { br = sw.members[i].rel; bi = i; }
      if (bi < 0) bi = 0;
      const m = sw.members[bi];
      const rep = Math.max(1, Math.round(sw.count / sw.members.length));
      this.chargers.push({ x: m.x, y: m.y, d: this.dist + m.rel, vy: 3, alt: m.alt, rep, tx: (Math.random() - 0.5) * 2.4 });
      sw.remove(bi, rep);
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
        this.parts.burst(c.x, 0.8, -(f.d - 0.9), 3, { color: this.swarm.skin.crew[0], speed: 3, up: 2, size: 0.12, vz: 3 });
        this.parts.burst(c.x, 1.2, -(f.d - 0.9), 1, { color: 0x8a5a32, speed: 3, up: 3, size: 0.18, vz: 3 });
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
    // 붕괴 파편
    const wp = new THREE.Vector3();
    for (const p of f.parts) {
      p.m.getWorldPosition(wp);
      const n = p.kind === 'door' ? 8 : 10;
      const col = p.m.material.color.getHex();
      for (let i = 0; i < n; i++) {
        this.parts.spawn(wp.x + (Math.random() - 0.5) * p.m.scale.x, wp.y + (Math.random() - 0.5) * Math.min(3, p.m.scale.y), wp.z + 0.5,
          { color: col, speed: 6, up: 5, vz: 1.5, size: 0.3 + Math.random() * 0.35, life: 1.6 + Math.random() * 0.6, gravity: 18, spin: 10 });
      }
      p.m.visible = false;
    }
    f.sign.visible = false;
    for (let i = 0; i < 40; i++) this.parts.spawn((Math.random() - 0.5) * 8, 0.5, -f.d + 1, { color: 0xd8d0c0, speed: 3, up: 1.5, size: 0.5, life: 1.2, gravity: -1, spin: 2 });
    sfx.collapse();
    vib([40, 40, 80]);
    this.world.shake = 1.3;
    this.hitstop = 0.14;
    this.ui.flash(false);
    // 남은 인원 → 보너스 코인
    const sw = this.swarm;
    const keep = Math.min(sw.count, startCount() + CFG.fortressKeepExtra);
    const excess = sw.count - keep;
    const bonus = Math.round((excess * CFG.fortressCoinPerMember + CFG.fortressCoinBase * (this.section + 1)) * fortMult());
    const gems = 1 + Math.floor(this.section / 2);
    addGems(gems);
    const removed = sw.setCount(keep);
    for (const m of removed) this.parts.burst(m.x, 0.6, -(this.dist + m.rel), 2, { color: COLORS.coin, speed: 2, up: 5, size: 0.16 });
    this.coinsRun += bonus;
    this.forts++;
    save.stats.forts++;
    save.stats.maxFortsRun = Math.max(save.stats.maxFortsRun, this.forts);
    this.notify(track('fortress', 1));
    this.notify(track('fortRun', this.forts));
    this.popups.show(0, 3, -(this.dist + 2), `+${bonus} 코인  +${gems} 보석`, 'big');
    this.section++;
    this.world.setTheme(this.themeIdx());
    if (!this.weekly && unlockTheme(this.themeIdx())) this.ui.toast(`새 테마 해금: ${THEMES[this.themeIdx()].name}`);
    setIntensity(Math.min(2, this.section));
    const th = THEMES[this.themeIdx()];
    setTimeout(() => { if (this.state === 'play') this.ui.banner(`구간 ${this.section + 1} · ${th.name}`, '속도 UP! 더 어려워져요'); }, 900);
    this.mode = 'breach';
    this.modeT = 0;
    setTimeout(() => this.ents.hideFortress(), 50);
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
  }

  score() { return Math.floor(Math.max(0, this.dist - this.startDist) * this.mult); }

  trackRun() {
    const d = Math.floor(this.dist);
    this.notify(track('dist', d));
    this.notify(track('count', this.maxCount));
    this.notify(track('coinsRun', this.coinsRun));
  }

  // 게임 오버 연출 이후: 부활 가능하면 부활 제안, 아니면 결과
  endRun() {
    if (!this.revived && save.gems >= REVIVE_COST && !this.opts.noRevive) {
      this.state = 'revive';
      this.ui.showRevive(REVIVE_COST, save.gems);
      return;
    }
    this.finishRun();
  }

  revive() {
    if (this.state !== 'revive' || save.gems < REVIVE_COST) return;
    save.gems -= REVIVE_COST;
    save.stats.revives++;
    this.revived = true;
    persist();
    const sw = this.swarm;
    sw.reset(10, this.dist, (this.lane - 1) * CFG.laneW);
    // 주변 위험 요소 제거
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
    this.ui.banner('부활!', '무리 10명으로 다시 달려요');
    sfx.powerup();
    this.parts.burst((this.lane - 1) * CFG.laneW, 1, -this.dist, 30, { color: 0xffffff, speed: 6, up: 4, size: 0.18 });
    this.notify(checkAchievements());
  }

  finishRun() {
    this.state = 'over';
    this.trackRun();
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
      weeklyText = got ? `주간 챌린지 성공! 보석 +5, 코인 +300` : `주간 챌린지 ${d}m / 목표 ${this.weekly.target}m`;
    }
    this.notify(checkAchievements());
    persist();
    this.ui.showOver({ head: this.weekly ? '주간 챌린지 결과' : '게임 오버', dist: d, score: sc, mult: this.mult, newBest, cause: weeklyText || this.deathCause || '무리가 모두 사라짐', maxCount: this.maxCount, coins, forts: this.forts });
  }

  notify(list) {
    if (!list || !list.length) return;
    persist();
    for (const n of list) this.ui.toast(n.text);
    sfx.powerup();
  }
}
