import * as THREE from 'three';
import { CFG, ENEMY_DEFS, MAPS, SKINS, diffMul } from './config.js';
import { Meta } from './meta.js';
import { MetaUI } from './metaui.js';
import { World } from './world.js';
import { Enemies } from './enemies.js';
import { Skills } from './skills.js';
import { FX } from './fx.js';
import { UI } from './ui.js';
import { Input } from './input.js';
import { Audio } from './audio.js';
import { Save } from './save.js';
import { holeU, applySkin } from './holeclip.js';
import { params, DEBUG } from './rng.js';

const vibrate = (ms) => {
  try {
    navigator.vibrate && navigator.vibrate(ms);
  } catch (e) {
    /* 미지원 */
  }
};

export class Game {
  constructor(app, canvas, uiRoot) {
    this.app = app;
    this.save = Save.load();
    Meta.refreshDay();
    Audio.setMuted(!!this.save.muted);
    this.audio = Audio;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color('#cfe8ff');
    this.scene.fog = new THREE.Fog('#cfe8ff', 60, 160);
    this.camera = new THREE.PerspectiveCamera(CFG.cam.fov, 0.5, 0.5, 700);
    const hemi = new THREE.HemisphereLight('#ffffff', '#b9a6e0', 1.9);
    const sun = new THREE.DirectionalLight('#fff2df', 1.5);
    sun.position.set(30, 60, 25);
    this.scene.add(hemi, sun);

    this.baseSeed = parseInt(params.get('seed') || '20260926', 10);
    this.world = new World(this.scene, this.baseSeed, this.save.maps[this.save.sel.map].unlocked ? this.save.sel.map : 'city');
    this.applyMapLook(this.world.themeId);
    this.applySkin();
    this.mods = {};
    this.ui = new UI(uiRoot);
    this.metaUI = new MetaUI(this, uiRoot);
    this.fx = new FX(this.scene, this.camera, this.ui.$('#dmg-layer'));
    this.enemies = new Enemies(this.scene, this);
    this.skills = new Skills(this.scene, this);
    this.input = new Input(app, this.ui.$('#joy'));
    this.input.onFirst = () => {
      Audio.init();
      Audio.resume();
    };

    this.hole = { x: 0, z: 0, vx: 0, vz: 0, r: 1, targetR: 1, hp: 100, maxHp: 100, invuln: 0 };
    this.state = 'title';
    this.time = 0;
    this.camDist = CFG.cam.dist;
    this.camPunch = 0;
    this.camPunchV = 0;
    this.shakeAmt = 0;
    this.stopT = 0;
    this.enemySlow = 1;
    this.titleAngle = 0;
    this.speedMulDebug = Math.max(1, Math.min(8, parseInt(params.get('speed') || '1', 10)));
    this.god = DEBUG && params.has('god');

    this.bindUI();
    this.resize();
    window.addEventListener('resize', () => this.resize());
    document.addEventListener('visibilitychange', () => {
      if (document.hidden && this.state === 'play') this.pause();
    });
    this.world.setHole(0, 0, 1);
    this.showTitle();
    if (DEBUG) window.__game = this;
    this.last = performance.now();
    this.frames = 0;
    requestAnimationFrame((t) => this.loop(t));
  }

  // ---------- UI 연결 ----------
  bindUI() {
    const ui = this.ui;
    const $ = ui.$;
    const tap = (sel, fn) => {
      $(sel).addEventListener('click', (e) => {
        e.stopPropagation();
        Audio.init();
        Audio.resume();
        Audio.select();
        fn();
      });
    };
    tap('#btnStart', () => {
      if (this.save.maps[this.save.sel.map].unlocked) this.startRun({ daily: false });
    });
    tap('#btnPause', () => this.pause());
    tap('#btnResume', () => this.resume());
    tap('#btnRestart', () => this.startRun());
    tap('#btnToTitle', () => this.showTitle());
    tap('#btnAgain', () => this.startRun());
    tap('#btnResTitle', () => this.showTitle());
    const mute = () => {
      this.save.muted = !this.save.muted;
      Audio.setMuted(this.save.muted);
      ui.setMuteIcon(this.save.muted);
      Save.save();
    };
    tap('#btnMute', mute);
    tap('#btnMute2', mute);
    ui.setMuteIcon(this.save.muted);
  }

  applySkin() {
    applySkin(SKINS[this.save.skins.sel] || SKINS.void);
  }

  applyMapLook(id) {
    const sky = MAPS[id].sky;
    this.scene.background.set(sky);
    this.scene.fog.color.set(sky);
  }

  // 맵(테마) 또는 시드가 다르면 월드 재생성
  setWorld(map, seed = this.baseSeed) {
    if (this.world.themeId === map && this.world.seed === seed) return;
    this.world.dispose();
    this.world = new World(this.scene, seed, map);
    this.applyMapLook(map);
    this.world.setHole(this.hole.x, this.hole.z, this.hole.r);
  }

  showTitle() {
    this.state = 'title';
    Audio.stopMusic();
    const ui = this.ui;
    ['#hud', '#pause', '#result', '#levelup', '#tutorial'].forEach((s) => ui.hide(s));
    ui.show('#title');
    ui.setLowHp(false);
    this.input.enabled = false;
    this.input.release();
    this.world.reset();
    this.enemies.reset();
    this.skills.reset();
    this.fx.clear();
    Object.assign(this.hole, { x: 0, z: 0, vx: 0, vz: 0, r: 1.2, targetR: 1.2 });
    Meta.refreshDay();
    const sel = this.save.sel.map;
    this.setWorld(this.save.maps[sel].unlocked ? sel : this.world.themeId);
    this.metaUI.renderTitle();
    this.metaUI.maybePopup();
  }

  // ---------- 런 ----------
  startRun(opts = {}) {
    const ui = this.ui;
    const sv = this.save;
    // 데일리 챌린지 / 일반 런 설정
    let map = sv.sel.map;
    let diff = sv.sel.diff;
    let seed = this.baseSeed;
    let mod = null;
    if (opts.daily === undefined && this.lastRun) opts = this.lastRun;
    this.lastRun = { daily: !!opts.daily };
    if (opts.daily) {
      const ch = Meta.dailyChallenge();
      map = ch.map;
      diff = ch.diff;
      seed = ch.seed;
      mod = ch.mod;
    } else if (!sv.maps[map].unlocked) {
      map = 'city';
      diff = 1;
    }
    this.run = { map, diff, daily: !!opts.daily, mod };
    const dm = diffMul(diff);
    const md = mod || {};
    this.mods = {
      hpE: dm.hp * (md.hpE || 1),
      dmgE: dm.dmg,
      rateE: dm.rate * (md.rate || 1),
      sizeE: md.enemySize || 1,
      xp: md.xp || 1,
      growth: md.growth || 1,
      coin: dm.coin * (md.coin || 1),
      weights: MAPS[map].weights,
      tint: MAPS[map].enemyTint,
    };
    ['#title', '#pause', '#result', '#levelup', '#sheet', '#modal'].forEach((s) => ui.hide(s));
    ui.show('#hud');
    this.setWorld(map, seed);
    this.world.reset();
    this.enemies.reset();
    this.skills.reset();
    this.fx.clear();
    const up = sv.upg;
    const r0 = CFG.hole.startR * (1 + (up.size || 0) * 0.05) * (md.startR || 1);
    const hp = Math.round((CFG.hole.hp + (up.hp || 0) * 10) * (md.hp || 1));
    this.hole = { x: 0, z: 0, vx: 0, vz: 0, r: r0, targetR: r0, hp, maxHp: hp, invuln: 0 };
    this.upSpeed = (1 + (up.speed || 0) * 0.04) * (md.speed || 1);
    this.upXp = (1 + (up.xp || 0) * 0.06) * this.mods.xp;
    this.coinMul = 1 + (up.coin || 0) * 0.08;
    this.powerMul = 1 + (up.power || 0) * 0.06;
    this.armorMul = 1 - (up.armor || 0) * 0.03;
    this.rerolls = up.reroll || 0;
    this.revives = up.revive || 0;
    this.time = DEBUG && params.get('t') ? parseFloat(params.get('t')) : 0;
    this.level = 1;
    this.xp = 0;
    this.xpNeed = CFG.xpNeed(1);
    this.pendingLevels = 0;
    this.combo = 0;
    this.lastSwallowT = -9;
    this.stats = { swallowed: 0, kills: 0, maxR: r0, damage: 0, maxCombo: 0, miniKills: 0 };
    this.bonusCoins = 0;
    this.miniSpawned = this.time > CFG.run.miniAt + 5;
    this.bossSpawned = false;
    this.bossWarned = false;
    this.tierIdx = CFG.sizeTiers.findIndex((t) => t > r0);
    this.endT = 0;
    this.cleared = false;
    this.camDist = CFG.cam.dist + r0 * CFG.cam.distPerR;
    this.state = 'play';
    this.noLevelUp = false;
    this.input.enabled = true;
    this.input.release();
    ui.renderSkillbar(this.skills);
    ui.setLowHp(false);
    Audio.init();
    Audio.resume();
    Audio.setIntensity(0);
    Audio.startMusic();
    this.tutorialT = 0;
    if (!this.save.tutorialDone) ui.show('#tutorial');
    if (mod && mod.startSkill) {
      for (let i = 0; i < mod.startSkill[1]; i++) this.skills.apply({ kind: 'skill', id: mod.startSkill[0] });
      ui.renderSkillbar(this.skills);
    }
    if (this.run.daily) ui.banner(`데일리 챌린지<small>${mod.name}: ${mod.desc}</small>`, 'level');
    else if (diff > 1) ui.toast(`${MAPS[map].name} 난이도 ${diff}`);
    if (DEBUG && params.has('hp')) this.hole.hp = parseFloat(params.get('hp'));
    if (DEBUG && params.has('lvl')) {
      const n = parseInt(params.get('lvl'), 10);
      for (let i = 0; i < n; i++) {
        const c = this.skills.choices(1)[0];
        this.skills.apply(c);
      }
      ui.renderSkillbar(this.skills);
    }
  }

  pause() {
    if (this.state !== 'play') return;
    this.state = 'paused';
    this.input.release();
    this.ui.renderSkillbar(this.skills);
    this.ui.show('#pause');
  }

  resume() {
    if (this.state !== 'paused') return;
    this.ui.hide('#pause');
    this.state = 'play';
    this.last = performance.now();
  }

  // ---------- 이벤트 ----------
  hurt(amount, src) {
    const h = this.hole;
    if (this.state !== 'play') return false;
    if (h.invuln > 0 || this.god) return false;
    h.hp -= amount * this.mods.dmgE * this.armorMul;
    h.invuln = CFG.hole.iframe;
    this.ui.hurt();
    Audio.hurt();
    vibrate(45);
    this.shake(0.7);
    this.hitStop(0.05);
    holeU.uHoleHurt.value = 1;
    this.fx.burst(h.x, 0.5, h.z, 10, 0.7, ['#ff5d6c', '#ffffff']);
    if (h.hp <= 0) {
      if (this.revives > 0) {
        this.revives--;
        h.hp = h.maxHp * 0.5;
        h.invuln = 2.5;
        this.ui.banner('재탄생!<small>HP 50%로 부활</small>', 'size');
        this.flashScreen('#e8d8ff');
        this.fx.ring(h.x, h.z, h.r * 4 + 8, '#c79bff', 0.8);
        for (const e of [...this.enemies.list]) {
          const dx = e.x - h.x;
          const dz = e.z - h.z;
          const d = Math.hypot(dx, dz) || 1;
          if (d < h.r * 4 + 10) {
            e.kx += (dx / d) * 25;
            e.kz += (dz / d) * 25;
          }
        }
        Audio.sizeUp();
      } else {
        h.hp = 0;
        this.die();
      }
    }
    return true;
  }

  gainXp(v) {
    this.xp += v * this.upXp * this.skills.xpMul();
    while (this.xp >= this.xpNeed) {
      this.xp -= this.xpNeed;
      this.level++;
      this.xpNeed = CFG.xpNeed(this.level);
      this.pendingLevels++;
    }
  }

  grow(size, k) {
    const h = this.hole;
    const add = k * size * size * this.skills.growthMul() * (this.mods.growth || 1);
    h.targetR = Math.min(CFG.hole.maxR, Math.sqrt(h.targetR * h.targetR + add));
    this.stats.maxR = Math.max(this.stats.maxR, h.targetR);
    const tiers = CFG.sizeTiers;
    if (this.tierIdx >= 0 && this.tierIdx < tiers.length && h.targetR >= tiers[this.tierIdx]) {
      while (this.tierIdx < tiers.length && h.targetR >= tiers[this.tierIdx]) this.tierIdx++;
      this.ui.banner(`SIZE UP!<small>지름 ${(h.targetR * 2).toFixed(1)}m</small>`, 'size');
      this.camPunchV += 7;
      this.shake(0.5);
      Audio.sizeUp();
      vibrate([20, 30, 20]);
      this.fx.ring(h.x, h.z, h.targetR * 2.2, '#c79bff', 0.6);
    }
  }

  countCombo(size) {
    if (this.time - this.lastSwallowT < CFG.combo.window) this.combo++;
    else this.combo = 1;
    this.lastSwallowT = this.time;
    this.stats.maxCombo = Math.max(this.stats.maxCombo, this.combo);
    this.ui.combo(this.combo);
    Audio.pop(size, this.combo);
  }

  onSwallowProp(it) {
    this.stats.swallowed++;
    this.countCombo(it.size);
    this.gainXp(CFG.propXp(it.size));
    this.grow(it.size, CFG.hole.growthK);
    const h = this.hole;
    this.fx.burst(it.x, 0.4, it.z, 3 + it.size * 3, it.size * 0.6, ['#c79bff', '#ffffff', '#8a6bff']);
    if (it.size > h.r * 0.6) {
      vibrate(15);
      this.shake(0.15 + it.size * 0.05);
    }
  }

  onKill(e, swallowed) {
    this.stats.kills++;
    const xp = e.def.xp * Math.pow(e.baseSize / e.def.size, 1.3);
    if (swallowed) {
      this.stats.swallowed++;
      this.countCombo(e.size);
      this.gainXp(xp);
      this.grow(e.size, CFG.hole.enemyGrowthK);
      this.fx.burst(e.x, 0.6, e.z, 8 + e.size * 4, e.size * 0.6, ['#7ff8ff', '#ffffff', '#c79bff']);
      if (e.type === 'boss') this.win();
      else if (e.type === 'mini') {
        this.stats.miniKills++;
        this.ui.banner('대장 트럭 꿀꺽!', 'size');
        this.shake(1);
        this.hitStop(0.12);
      }
    } else {
      this.gainXp(xp * 0.6);
      Audio.hit();
      if (e.type === 'mini') {
        this.stats.miniKills++;
        this.ui.banner('대장 트럭 격파!', 'size');
        this.shake(1);
        this.hitStop(0.12);
      }
    }
  }

  moveHoleTo(x, z) {
    const H = CFG.map.half;
    this.hole.x = Math.max(-H, Math.min(H, x));
    this.hole.z = Math.max(-H, Math.min(H, z));
  }

  shake(a) {
    this.shakeAmt = Math.min(2, Math.max(this.shakeAmt, a));
  }
  hitStop(s) {
    this.stopT = Math.max(this.stopT, s);
  }
  flashScreen(c) {
    this.ui.flash(c);
  }

  die() {
    if (this.state !== 'play') return;
    this.state = 'dying';
    this.endT = 0;
    this.input.enabled = false;
    this.input.release();
    Audio.lose();
    Audio.stopMusic();
    vibrate([60, 40, 120]);
    this.ui.setLowHp(false);
  }

  win() {
    if (this.state !== 'play') return;
    this.cleared = true;
    this.state = 'clearing';
    this.endT = 0;
    this.input.enabled = false;
    this.input.release();
    this.ui.banner('메카 꿀꺽!<small>도시 정화 완료</small>', 'size');
    this.flashScreen('#ffffff');
    this.shake(2);
    Audio.win();
    Audio.stopMusic();
    vibrate([40, 40, 40, 40, 120]);
  }

  finish() {
    const st = this.stats;
    const C = CFG.coins;
    const run = this.run;
    const coins =
      Math.floor((this.time * C.perSec + st.kills * C.perKill + st.swallowed * C.perSwallow + (this.cleared ? C.clear : 0)) * this.skills.coinMul() * this.coinMul * this.mods.coin) + this.bonusCoins;
    const mapBest = run.daily ? this.save.daily.challenge.best : this.save.maps[run.map].best.time;
    const newBest = this.time > mapBest;
    const meta = Meta.recordRun({
      map: run.map,
      diff: run.diff,
      daily: run.daily,
      time: this.time,
      swallowed: st.swallowed,
      kills: st.kills,
      size: st.maxR * 2,
      maxCombo: st.maxCombo,
      level: this.level,
      cleared: this.cleared,
      miniKills: st.miniKills,
      evolutions: Object.keys(this.skills.evo).length,
      coins,
    });
    this.state = 'result';
    this.ui.hide('#hud');
    this.ui.hide('#tutorial');
    this.ui.showResult({
      cleared: this.cleared,
      time: this.time,
      swallowed: st.swallowed,
      size: st.maxR * 2,
      kills: st.kills,
      level: this.level,
      maxCombo: st.maxCombo,
      coins,
      newBest,
      bestTime: Math.max(mapBest, this.time),
      daily: run.daily,
      mapName: MAPS[run.map].name,
      diff: run.diff,
      meta,
    });
  }

  openLevelUp() {
    this.state = 'levelup';
    this.input.release();
    Audio.levelUp();
    vibrate(25);
    const pick = (choices) => this.ui.showLevelUp(choices, this.skills, onPick, this.rerolls, () => {
      if (this.rerolls <= 0) return;
      this.rerolls--;
      Audio.select();
      pick(this.skills.choices(3));
    });
    const onPick = (c) => {
      Audio.select();
      this.skills.apply(c);
      this.ui.renderSkillbar(this.skills);
      this.pendingLevels--;
      this.state = 'play';
      this.last = performance.now();
      this.fx.ring(this.hole.x, this.hole.z, this.hole.r * 2.5, '#7ce0ff', 0.5);
    };
    pick(this.skills.choices(3));
  }

  // ---------- 타임라인 ----------
  timeline() {
    const t = this.time;
    const h = this.hole;
    if (!this.miniSpawned && t >= CFG.run.miniAt) {
      this.miniSpawned = true;
      this.ui.banner('경고! 미니보스<small>청소 트럭 대장 접근 중</small>', 'boss');
      Audio.warn();
      const [x, z] = this.enemies.spawnPos(h, this.camDist * 0.8);
      const p = t / CFG.run.length;
      this.enemies.spawn('mini', x, z, 1 + p * 0.5, (1 + p) * this.mods.hpE);
    }
    if (!this.bossWarned && t >= CFG.run.bossAt - 3) {
      this.bossWarned = true;
      this.ui.banner('경고! 보스 출현<small>거대 청소 메카: 공격해서 줄인 뒤 삼켜라!</small>', 'boss');
      Audio.warn();
      vibrate([80, 60, 80]);
    }
    if (!this.bossSpawned && t >= CFG.run.bossAt) {
      this.bossSpawned = true;
      const [x, z] = this.enemies.spawnPos(h, this.camDist * 0.75);
      this.enemies.spawn('boss', x, z, 1, this.mods.hpE);
      Audio.setIntensity(1);
      this.shake(1.5);
    }
  }

  // ---------- 업데이트 ----------
  update(dt) {
    const h = this.hole;
    this.time += dt;
    holeU.uTime.value += dt;
    holeU.uHoleHurt.value = Math.max(0, holeU.uHoleHurt.value - dt * 3);
    h.invuln = Math.max(0, h.invuln - dt);

    // 이동
    const [jx, jy] = this.input.vec();
    const maxSp = (CFG.hole.speed + CFG.hole.speedPerR * (h.r - 1)) * this.upSpeed * this.skills.speedMul();
    const moving = jx !== 0 || jy !== 0;
    const a = moving ? CFG.hole.accel : CFG.hole.decel;
    h.vx += (jx * maxSp - h.vx) * Math.min(1, a * dt);
    h.vz += (jy * maxSp - h.vz) * Math.min(1, a * dt);
    h.x += h.vx * dt;
    h.z += h.vz * dt;
    this.traveled = (this.traveled || 0) + Math.hypot(h.vx, h.vz) * dt;
    const H = CFG.map.half;
    if (Math.abs(h.x) > H) {
      h.x = Math.sign(h.x) * (H + (Math.abs(h.x) - H) * Math.exp(-dt * 12));
      h.vx *= 0.8;
    }
    if (Math.abs(h.z) > H) {
      h.z = Math.sign(h.z) * (H + (Math.abs(h.z) - H) * Math.exp(-dt * 12));
      h.vz *= 0.8;
    }
    h.r += (h.targetR - h.r) * Math.min(1, dt * CFG.hole.visualLerp);
    this.world.setHole(h.x, h.z, h.r);

    // 튜토리얼
    if (!this.save.tutorialDone) {
      if (moving) this.tutorialT += dt;
      if (this.tutorialT > 1.5 && this.stats.swallowed >= 3) {
        this.save.tutorialDone = true;
        Save.save();
        this.ui.hide('#tutorial');
      }
    }

    this.timeline();
    this.enemies.updateSpawns(dt, this.time, h);
    const pull = this.skills.update(dt, h);
    const eaten = this.world.update(dt, h, this.skills.horizonMul(), pull);
    for (const it of eaten) this.onSwallowProp(it);
    this.enemies.update(dt, h, this.time);
    if (Math.random() < 0.5) this.fx.suck(h.x, h.z, h.r, 1);
    if (this.combo > 0 && this.time - this.lastSwallowT > CFG.combo.window) this.combo = 0;
    this.ui.setLowHp(h.hp / h.maxHp < 0.3 && this.state === 'play');
  }

  updateCamera(dt) {
    const h = this.hole;
    const want = CFG.cam.dist + h.r * CFG.cam.distPerR;
    this.camDist += (want - this.camDist) * Math.min(1, dt * CFG.cam.lerp);
    // 카메라 펀치 (스프링)
    this.camPunchV += (-this.camPunch * 60 - this.camPunchV * 9) * dt;
    this.camPunch += this.camPunchV * dt;
    const d = this.camDist * (1 - this.camPunch * 0.04);
    const tilt = (CFG.cam.tilt * Math.PI) / 180;
    let tx = h.x;
    let tz = h.z;
    let ang = 0;
    if (this.state === 'title') {
      this.titleAngle += dt * 0.12;
      ang = this.titleAngle;
    }
    const off = d * Math.cos(tilt);
    const cx = tx + Math.sin(ang) * off;
    const cz = tz + Math.cos(ang) * off;
    const cy = d * Math.sin(tilt);
    this.shakeAmt = Math.max(0, this.shakeAmt - dt * 3);
    const sa = this.shakeAmt * this.shakeAmt * (0.4 + h.r * 0.08);
    this.camera.position.set(cx + (Math.random() - 0.5) * sa, cy + (Math.random() - 0.5) * sa, cz + (Math.random() - 0.5) * sa);
    this.camera.lookAt(tx, 0, tz - (this.state === 'title' ? 0 : d * 0.04));
    const far = d * 1.3 + 40;
    this.scene.fog.near = far * 0.75;
    this.scene.fog.far = far * 1.6 + 30;
  }

  loop(t) {
    requestAnimationFrame((tt) => this.loop(tt));
    const realDt = Math.min(0.25, Math.max(0, (t - this.last) / 1000));
    let dt = Math.min(0.05, (t - this.last) / 1000);
    this.last = t;
    if (!(dt > 0)) dt = 0.016;
    const h = this.hole;
    if (this.state === 'play') {
      if (this.stopT > 0) {
        this.stopT -= dt;
      } else {
        for (let i = 0; i < this.speedMulDebug; i++) {
          if (this.state !== 'play') break;
          this.update(dt);
        }
      }
      if (this.state === 'play' && this.pendingLevels > 0 && !this.noLevelUp) this.openLevelUp();
      this.ui.updateHUD(this);
    } else if (this.state === 'dying') {
      this.endT += realDt;
      h.targetR = Math.max(0.05, h.r * 0.9);
      h.r *= Math.exp(-dt * 2.5);
      holeU.uTime.value += dt;
      this.world.setHole(h.x, h.z, h.r);
      this.enemies.update(dt * 0.3, h, this.time);
      if (this.endT > 1.6) this.finish();
    } else if (this.state === 'clearing') {
      this.endT += realDt;
      holeU.uTime.value += dt;
      this.world.update(dt * 0.5, h, 1, null);
      this.enemies.update(dt * 0.5, h, this.time);
      if (Math.random() < 0.8) this.fx.suck(h.x, h.z, h.r, 3);
      if (this.endT > 2.4) this.finish();
    } else if (this.state === 'title') {
      holeU.uTime.value += dt;
      this.world.setHole(h.x, h.z, h.r);
      this.fx.suck(h.x, h.z, h.r, 1);
    }
    this.fx.update(this.state === 'paused' || this.state === 'levelup' ? 0 : dt, this.w, this.h);
    this.updateCamera(this.state === 'paused' || this.state === 'levelup' ? 0 : dt);
    this.renderer.render(this.scene, this.camera);
    this.frames++;
  }

  resize() {
    const r = this.app.getBoundingClientRect();
    this.w = Math.max(1, r.width);
    this.h = Math.max(1, r.height);
    this.renderer.setSize(this.w, this.h, false);
    this.camera.aspect = this.w / this.h;
    this.camera.updateProjectionMatrix();
    this.fx.resize(this.h * this.renderer.getPixelRatio(), CFG.cam.fov);
  }

  // ---------- 디버그 ----------
  debugBoss() {
    this.time = CFG.run.bossAt - 0.1;
    this.bossWarned = true;
  }
  debugHitBoss(frac = 0.95) {
    const b = this.enemies.boss;
    if (b) this.enemies.damage(b, b.maxHp * frac);
  }
  debugKill() {
    if (this.state === 'levelup' || this.state === 'paused') {
      this.ui.hide('#levelup');
      this.ui.hide('#pause');
      this.pendingLevels = 0;
      this.state = 'play';
    }
    this.noLevelUp = true;
    this.revives = 0;
    this.god = false;
    this.hole.invuln = 0;
    this.hurt(99999, null);
  }
  debugGrow(r) {
    this.hole.targetR = r;
    this.hole.r = r;
  }
  debugXp(n) {
    this.gainXp(n);
  }
  debugCoins(n) {
    this.save.coins += n;
    Save.save();
    this.metaUI.renderTitle();
  }
}

export { ENEMY_DEFS };
