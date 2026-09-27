import * as THREE from 'three';
import { CFG, ENEMY_DEFS, MAPS, SKINS, EVOLUTIONS, diffMul } from './config.js';
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

const NORENDER = DEBUG && params.has('norender');
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
    this.ui.audio = Audio;
    this.metaUI = new MetaUI(this, uiRoot);
    this.fx = new FX(this.scene, this.camera, this.ui.$('#dmg-layer'));
    this.enemies = new Enemies(this.scene, this);
    this.skills = new Skills(this.scene, this);
    this.world.markGame = this;
    this.enemies.setTheme(this.world.themeId);
    this.applySkin();
    Audio.setVolumes(this.save.settings.music, this.save.settings.sfx);
    this.input = new Input(app, this.ui.$('#joy'));
    this.input.onFirst = () => {
      Audio.init();
      Audio.resume();
    };

    this.hole = { x: 0, z: 0, vx: 0, vz: 0, r: 1, targetR: 1, hp: 100, maxHp: 100, invuln: 0 };
    this.state = 'title';
    this.time = 0;
    this.camDist = 30;
    this.viewFar = 20;
    this.viewNear = 12;
    this.viewHalfW = 8;
    this.camFocus = null;
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
      if (document.hidden) {
        if (this.state === 'play') this.pause();
        Audio.suspend();
      } else if (this.state !== 'paused') Audio.resume();
    });
    this.world.setHole(0, 0, 1);
    // 첫 실행: 타이틀/출석 없이 바로 튜토리얼 런
    if (!this.save.tutorialDone && !(DEBUG && params.has('title'))) {
      this.showTitle(true);
      this.startRun({ daily: false, tutorial: true });
    } else this.showTitle();
    // 손상된 저장 데이터 알림
    if (Save.status === 'restored') setTimeout(() => this.ui.toast('저장 데이터가 손상되어 백업에서 복구함'), 600);
    else if (Save.status === 'failed') setTimeout(() => this.ui.toast('저장 데이터를 복구하지 못함'), 600);
    if (DEBUG) {
      window.__game = this;
      window.__meta = Meta;
      window.__audio = Audio;
    }
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
    tap('#btnMute', () => this.metaUI.openSettings());
    tap('#btnMute2', mute);
    this.muteToggle = mute;
    ui.setMuteIcon(this.save.muted);
    // 배경음/효과음 개별 볼륨 (일시정지 메뉴, 설정 모달 공용)
    this.app.addEventListener('input', (e) => {
      const el = e.target.closest && e.target.closest('.vol');
      if (!el) return;
      this.save.settings[el.dataset.vol] = el.value / 100;
      Audio.setVolumes(this.save.settings.music, this.save.settings.sfx);
      Save.save();
    });
    this.app.addEventListener('change', (e) => {
      if (e.target.closest && e.target.closest('.vol')) {
        Audio.init();
        Audio.select();
      }
    });
    this.syncVolumes = () => this.app.querySelectorAll('.vol').forEach((el) => (el.value = Math.round(this.save.settings[el.dataset.vol] * 100)));
  }

  applySkin() {
    const sk = SKINS[this.save.skins.sel] || SKINS.void;
    applySkin(sk);
    if (this.world && this.world.markMat) this.world.markMat.color.set(sk.rim);
    if (this.world && this.world.silMat) this.world.silMat.color.set(sk.rim);
    if (this.enemies) this.enemies.cEdible.set(sk.rim);
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
    this.world.markGame = this;
    this.applyMapLook(map);
    if (this.enemies) this.enemies.setTheme(map);
    this.applySkin();
    this.world.setHole(this.hole.x, this.hole.z, this.hole.r);
  }

  showTitle(silent = false) {
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
    // 출석 보상 모달은 첫 판을 끝낸 뒤부터
    if (!silent && this.save.stats.runs >= 1) this.metaUI.maybePopup();
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
      bossTint: MAPS[map].bossTint,
      bossName: MAPS[map].bossName,
      miniName: MAPS[map].miniName,
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
    const hp = Math.round((CFG.hole.hp + (up.hp || 0) * 15) * (md.hp || 1));
    this.hole = { x: 0, z: 0, vx: 0, vz: 0, r: r0, targetR: r0, hp, maxHp: hp, invuln: 0 };
    this.upSpeed = (1 + (up.speed || 0) * 0.04) * (md.speed || 1);
    this.upXp = (1 + (up.xp || 0) * 0.06) * this.mods.xp;
    this.coinMul = 1 + (up.coin || 0) * 0.08;
    this.powerMul = 1 + (up.power || 0) * 0.06;
    this.armorMul = 1 - (up.armor || 0) * 0.04;
    this.rerolls = up.reroll || 0;
    this.revives = up.revive || 0;
    this.time = DEBUG && params.get('t') ? parseFloat(params.get('t')) : 0;
    this.level = 1;
    this.xp = 0;
    this.xpNeed = CFG.xpNeed(1);
    this.pendingLevels = 0;
    this.combo = 0;
    this.lastSwallowT = -9;
    this.dmgLog = {};
    this.stats = { swallowed: 0, kills: 0, maxR: r0, damage: 0, maxCombo: 0, miniKills: 0 };
    this.bonusCoins = 0;
    this.miniSpawned = this.time > CFG.run.miniAt + 5;
    this.bossSpawned = false;
    this.bossWarned = false;
    this.tierIdx = CFG.sizeTiers.findIndex((t) => t > r0);
    this.endT = 0;
    this.cleared = false;
    this.camDist = this.camWant(r0);
    this.camFocus = null;
    this.state = 'play';
    this.noLevelUp = false;
    this.input.enabled = true;
    this.input.release();
    ui.renderSkillbar(this.skills);
    ui.setLowHp(false);
    Audio.init();
    Audio.resume();
    Audio.setMusicMode('normal');
    Audio.startMusic();
    this.tutorialT = 0;
    this.tutorial = !!opts.tutorial || !this.save.tutorialDone;
    this.tutCount = 0;
    this.tutStep = 1;
    this.tutTarget = null;
    ui.hide('#tutorial');
    if (this.tutorial) {
      ui.show('#tutorial');
      ui.setTutorial(1, 0);
    }
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
    Audio.pauseMusic();
    this.input.release();
    this.ui.renderSkillbar(this.skills);
    this.ui.show('#pause');
    this.syncVolumes();
  }

  resume() {
    if (this.state !== 'paused') return;
    this.ui.hide('#pause');
    this.state = 'play';
    this.last = performance.now();
    Audio.resume();
    Audio.resumeMusic();
  }

  // ---------- 이벤트 ----------
  hurt(amount, src) {
    const h = this.hole;
    if (this.state !== 'play') return false;
    if (h.invuln > 0 || this.god) return false;
    const dmg = amount * this.mods.dmgE * this.armorMul * (this.tutorial ? 0.25 : 1);
    h.hp -= dmg;
    const key = typeof src === 'string' ? src : src ? src.type + (src.state === 'dash' ? '-dash' : '') : 'etc';
    this.dmgLog[key] = Math.round((this.dmgLog[key] || 0) + dmg);
    // 체력이 낮을수록 무적 시간을 길게
    h.invuln = h.hp / h.maxHp <= 0.3 ? CFG.hole.iframeLow : CFG.hole.iframe;
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
    // 240초 이후엔 감쇠를 풀어 도시를 통째로 삼키는 후반 와이드 샷
    const fall = this.time > CFG.run.lateAt ? CFG.growthFalloffLate(h.targetR) : CFG.growthFalloff(h.targetR);
    const add = k * size * size * fall * this.skills.growthMul() * (this.mods.growth || 1);
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

  countCombo(size, bot = false) {
    if (this.time - this.lastSwallowT < CFG.combo.window) this.combo++;
    else this.combo = 1;
    this.lastSwallowT = this.time;
    this.stats.maxCombo = Math.max(this.stats.maxCombo, this.combo);
    this.ui.combo(this.combo);
    if (bot) Audio.eatBot(size);
    else Audio.pop(size, this.combo);
  }

  onSwallowProp(it) {
    this.stats.swallowed++;
    this.countCombo(it.size);
    this.gainXp(CFG.propXp(it.size) * 0.4 * CFG.xpFalloff(this.hole.targetR));
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
    const xp = e.def.xp * 0.35 * (e.baseSize / e.def.size);
    if (swallowed) {
      this.stats.swallowed++;
      this.countCombo(e.size, true);
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
      Audio.kill();
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
    const newBest = this.time > mapBest && this.time >= 10;
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
      walletAfter: this.save.coins,
      nextUpg: Meta.nextUpgrade(),
    });
  }

  openLevelUp() {
    this.state = 'levelup';
    this.input.release();
    Audio.levelUp();
    vibrate(25);
    Audio.setMusicMode('levelup');
    const pick = (choices) => this.ui.showLevelUp(choices, this.skills, onPick, this.rerolls, () => {
      if (this.rerolls <= 0) return;
      this.rerolls--;
      Audio.select();
      pick(this.skills.choices(3));
    });
    const onPick = (c) => {
      Audio.setMusicMode(this.enemies.boss ? 'boss' : 'normal');
      if (c.kind === 'evo') {
        this.ui.banner(`진화!<small>${EVOLUTIONS[c.id].name}</small>`, 'evo');
        this.flashScreen('rgba(220,190,255,0.5)');
        this.fx.ring(this.hole.x, this.hole.z, this.hole.r * 4 + 6, '#ffffff', 0.8);
        this.fx.burst(this.hole.x, 1, this.hole.z, 50, 2, ['#ff6b6b', '#ffd24a', '#8dff4a', '#3ff0ff', '#a861ff']);
        this.shake(0.8);
        Audio.evolve();
      }
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

  updateTutorial(dt, moving) {
    const h = this.hole;
    const ui = this.ui;
    const en = this.enemies;
    if (moving) this.tutorialT += dt;
    if (this.tutStep === 1) {
      const n = Math.min(3, this.stats.swallowed);
      if (n !== this.tutCount) {
        this.tutCount = n;
        ui.setTutorial(1, n);
      }
      if (n >= 3 || this.time > 40) {
        this.tutStep = 2;
        Audio.levelUp();
        const a = Math.random() * Math.PI * 2;
        this.tutTarget = en.spawn('sweeper', h.x + Math.cos(a) * 9, h.z + Math.sin(a) * 9, Math.max(0.5, (h.r * 0.55) / ENEMY_DEFS.sweeper.size), 0.5);
        ui.setTutorial(2, 0);
      }
    } else if (this.tutStep === 2) {
      const t = this.tutTarget;
      if (!t || t.dead) {
        this.tutStep = 3;
        this.tutSafe = 0;
        Audio.levelUp();
        const a = Math.random() * Math.PI * 2;
        this.tutTarget = en.spawn('sweeper', h.x + Math.cos(a) * 11, h.z + Math.sin(a) * 11, (h.r * 1.7) / ENEMY_DEFS.sweeper.size, 50);
        if (this.tutTarget) this.tutTarget.speedMul = 0.75;
        ui.setTutorial(3, 0);
      }
    } else if (this.tutStep === 3) {
      const t = this.tutTarget;
      this.tutSafe += dt;
      if (h.invuln > 0.9) this.tutSafe = 0; // 맞으면 처음부터
      ui.setTutorial(3, Math.min(5, this.tutSafe));
      if (this.tutSafe >= 5 || !t || t.dead) {
        if (t && !t.dead) en.kill(t);
        this.tutorial = false;
        this.tutTarget = null;
        this.save.tutorialDone = true;
        Save.save();
        ui.hide('#tutorial');
        ui.banner('튜토리얼 완료!<small>이제 진짜 청소 로봇 군단이 온다</small>', 'level');
        Audio.levelUp();
      }
    }
  }

  // 화면 밖 목표(삼킬 수 있게 된 보스, 먹을 만한 큰 물체)를 가리키는 가장자리 화살표
  updateArrow() {
    const el = this.ui.arrow;
    const h = this.hole;
    const boss = this.enemies.boss;
    let tgt = null;
    let label = '';
    let gold = false;
    let red = false;
    const tut = this.tutorial && this.tutTarget && !this.tutTarget.dead ? this.tutTarget : null;
    const target = tut || boss || this.enemies.mini;
    if (target && target.size < h.r * CFG.hole.fit) {
      tgt = target;
      label = '삼켜!';
      gold = true;
    } else if (target) {
      tgt = target;
      red = true;
      label = Math.round(Math.max(0, Math.hypot(target.x - h.x, target.z - h.z) - target.size)) + 'm';
    } else if (this.world.bigTarget) {
      tgt = this.world.bigTarget;
      label = '';
    }
    if (!tgt) {
      el.style.display = 'none';
      return;
    }
    const v = (this._av ||= new THREE.Vector3());
    v.set(tgt.x, 0.5, tgt.z).project(this.camera);
    let sx = v.x;
    let sy = v.y;
    const on = Math.abs(sx) < 0.85 && Math.abs(sy) < 0.8 && v.z < 1;
    if (on && !gold) {
      el.classList.remove('red');
      el.style.display = 'none';
      return;
    }
    if (v.z > 1) {
      sx = -sx;
      sy = -sy;
    }
    const W = this.w;
    const H = this.h;
    let px = (sx * 0.5 + 0.5) * W;
    let py = (-sy * 0.5 + 0.5) * H;
    const cx = W / 2;
    const cy = H / 2;
    let ang = Math.atan2(py - cy, px - cx);
    if (!on) {
      // HUD(위 180px)와 스킬바(아래 70px)를 피한 사각형 가장자리로
      const top = 190;
      const bot = H - 80;
      const ccy = (top + bot) / 2;
      ang = Math.atan2(py - ccy, px - cx);
      const mx = W / 2 - 34;
      const my = (bot - top) / 2;
      const k = Math.min(mx / Math.abs(Math.cos(ang) || 1e-6), my / Math.abs(Math.sin(ang) || 1e-6));
      px = cx + Math.cos(ang) * k;
      py = ccy + Math.sin(ang) * k;
    } else {
      py -= 60;
      ang = Math.PI / 2;
    }
    el.style.display = 'block';
    el.classList.toggle('gold', gold);
    el.classList.toggle('red', red);
    el.style.transform = `translate(${px.toFixed(0)}px, ${py.toFixed(0)}px)`;
    el.firstChild.style.transform = `rotate(${ang.toFixed(3)}rad)`;
    if (el.lastChild.textContent !== label) el.lastChild.textContent = label;
  }

  // ---------- 타임라인 ----------
  timeline() {
    const t = this.time;
    const h = this.hole;
    // 화면 좌/우 가장자리 바로 바깥 (가까운 쪽이 맵 안이면 그쪽)
    const edge = (size) => {
      const H = CFG.map.half;
      const off = this.viewHalfW + size * 0.7;
      let side = Math.random() < 0.5 ? -1 : 1;
      if (Math.abs(h.x + side * off) > H) side = -side;
      return [Math.max(-H, Math.min(H, h.x + side * off)), Math.max(-H, Math.min(H, h.z - this.viewFar * 0.25))];
    };
    if (!this.miniSpawned && t >= CFG.run.miniAt) {
      this.miniSpawned = true;
      this.ui.banner(`경고! 미니보스<small>${this.mods.miniName} 접근 중</small>`, 'boss');
      Audio.stinger();
      const p = t / CFG.run.length;
      const sm = Math.max(1, (h.r * 1.3) / ENEMY_DEFS.mini.size);
      const [x, z] = edge(ENEMY_DEFS.mini.size * sm);
      const mn = this.enemies.spawn('mini', x, z, sm, (1 + p) * this.mods.hpE);
      if (mn) {
        mn.introT = 2;
        mn.atk = 4;
      }
    }
    if (!this.bossWarned && t >= CFG.run.bossAt - 3) {
      this.bossWarned = true;
      this.ui.banner(`경고! 보스 출현<small>${this.mods.bossName}: 공격해서 줄인 뒤 삼켜라!</small>`, 'boss');
      Audio.warn();
      vibrate([80, 60, 80]);
    }
    if (!this.bossSpawned && t >= CFG.run.bossAt) {
      this.bossSpawned = true;
      const sm = Math.max(1, (h.r * 1.6) / ENEMY_DEFS.boss.size);
      const [x, z] = edge(ENEMY_DEFS.boss.size * sm);
      // 일반 적 정리 + 5초 무적 + 보스 비추는 카메라 인트로
      this.enemies.clearMinions();
      const b = this.enemies.spawn('boss', x, z, sm, this.mods.hpE);
      if (b) {
        b.introT = 3.2;
        this.camFocus = { x, z, t: 0, T: 3.2 };
      }
      h.invuln = Math.max(h.invuln, 5);
      this.flashScreen('rgba(255,170,210,0.35)');
      Audio.setMusicMode('boss');
      Audio.boom(1);
      this.shake(0.8);
    }
  }

  // ---------- 업데이트 ----------
  update(dt) {
    const h = this.hole;
    this.time += dt;
    Audio.setRunTime(this.time);
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

    this.timeline();
    if (!this.tutorial) this.enemies.updateSpawns(dt, this.time, h);
    this.updateArrow();
    const pull = this.skills.update(dt, h);
    const eaten = this.world.update(dt, h, this.skills.horizonMul(), pull);
    for (const it of eaten) this.onSwallowProp(it);
    // 튜토리얼 3단계: 작은 것 3개 -> 보라 링 청소봇 삼키기 -> 빨간 링 5초 피하기
    if (this.tutorial) this.updateTutorial(dt, moving);

    this.enemies.update(dt, h, this.time);
    if (Math.random() < 0.5) this.fx.suck(h.x, h.z, h.r, 1);
    if (this.combo > 0 && this.time - this.lastSwallowT > CFG.combo.window) this.combo = 0;
    this.ui.setLowHp(h.hp / h.maxHp < 0.3 && this.state === 'play');
  }

  // 홀 반지름에 맞는 카메라 거리 (세로 화면 aspect 보정: 화면 가로 폭 = baseW + r * wPerR)
  camWant(r) {
    const tanH = Math.tan((CFG.cam.fov * Math.PI) / 360) * Math.max(0.3, this.camera.aspect);
    const W = CFG.cam.baseW + r * CFG.cam.wPerR;
    return W / (2 * tanH);
  }

  updateCamera(dt) {
    const h = this.hole;
    let want = this.camWant(h.r);
    const f = this.camFocus;
    let fw = 0;
    if (f) {
      f.t += dt;
      const k = f.t / f.T;
      fw = k < 0.2 ? k / 0.2 : k > 0.8 ? (1 - k) / 0.2 : 1;
      fw = fw * fw * (3 - 2 * fw);
      want *= 1 + 0.35 * fw;
      if (f.t >= f.T) this.camFocus = null;
    }
    if (this.state === 'dying') want = this.camDist; // 사망 연출: 현재 거리 고정
    if (this.state === 'clearing') want = Math.max(want, this.camDist);
    if (dt > 0) this.camDist += (want - this.camDist) * Math.min(1, dt * (f ? 4 : this.state === 'clearing' ? 1.6 : CFG.cam.lerp));
    // 카메라 펀치 (스프링)
    this.camPunchV += (-this.camPunch * 60 - this.camPunchV * 9) * dt;
    this.camPunch += this.camPunchV * dt;
    const d = this.camDist * (1 - this.camPunch * 0.04);
    const tilt = (CFG.cam.tilt * Math.PI) / 180;
    let tx = h.x;
    let tz = h.z;
    if (f) {
      tx += (f.x - h.x) * fw;
      tz += (f.z - h.z) * fw;
    }
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
    this.camera.lookAt(tx, 0, tz);
    // 화면에 보이는 바닥 범위 (스폰/정리 기준)
    const vf = (CFG.cam.fov * Math.PI) / 360;
    const tanH = Math.tan(vf) * this.camera.aspect;
    const hc = d * Math.sin(tilt);
    const topA = tilt - vf;
    const botA = tilt + vf;
    this.viewFar = (topA > 0.05 ? hc / Math.tan(topA) : d * 3) - off;
    this.viewNear = off - (botA < Math.PI / 2 ? hc / Math.tan(botA) : hc / Math.tan(botA));
    this.viewHalfW = d * tanH * 1.05;
    this.scene.fog.near = d * 1.25;
    this.scene.fog.far = d * 2.6 + 20;
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
      // 피날레: 3초간 반경이 급팽창하며 블록째 건물을 빨아들이는 와이드 샷
      this.endT += realDt;
      holeU.uTime.value += dt;
      if (this.endT > 0.4 && this.endT < 3.4) {
        h.r += dt * (3 + h.r * 0.25);
        h.targetR = h.r;
      }
      this.world.setHole(h.x, h.z, h.r);
      const eaten = this.world.update(dt, h, 1.4, null);
      for (const it of eaten) {
        if (it.size > 1.5 && Math.random() < 0.35) Audio.pop(it.size, 3);
        if (it.size > 3) this.shake(0.4);
      }
      this.enemies.update(dt * 0.5, h, this.time);
      if (Math.random() < 0.8) this.fx.suck(h.x, h.z, h.r, 3);
      if (this.endT > 4.2) this.finish();
    } else if (this.state === 'title') {
      holeU.uTime.value += dt;
      this.world.setHole(h.x, h.z, h.r);
      this.fx.suck(h.x, h.z, h.r, 1);
    }
    this.fx.update(this.state === 'paused' || this.state === 'levelup' ? 0 : dt, this.w, this.h);
    this.updateCamera(this.state === 'paused' || this.state === 'levelup' ? 0 : dt);
    if (!NORENDER || this.frames % 30 === 0) this.renderer.render(this.scene, this.camera);
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
