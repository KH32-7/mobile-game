// 진입점: 앱 상태, 루프, 저장, 튜토리얼, 오프라인 수익, 디버그
import './style.css';
import { initGfx, gfx, resize, updateCamera, setShadows } from './gfx.js';
import { initInput, input, reset as resetInput } from './input.js';
import { audio } from './audio.js';
import { loadProfile, writeProfile, newRun, today, wipe } from './save.js';
import { Game } from './game.js';
import { Meta } from './meta.js';
import { UI } from './ui.js';
import { CFG, STAGES, UPGRADES, HATS, APRONS, SKINS, MENUS, PERKS } from './config.js';
import { updatePops } from './fx.js';
import { fmt } from './world.js';

const params = new URLSearchParams(location.search);
const DEBUG = params.has('debug');

const app = {
  p: null,
  game: null,
  meta: null,
  ui: null,
  pauseReasons: new Set(['title']),
  speed: 1,
  newDex: false,
  saveT: 0,
  hiddenAt: 0,
  started: false,
  W: () => gfx.width,
  H: () => gfx.height,

  setPaused(on, why) {
    if (on) this.pauseReasons.add(why);
    else this.pauseReasons.delete(why);
    if (on) resetInput();
  },
  get paused() {
    return this.pauseReasons.size > 0;
  },

  save() {
    if (!this.game) return;
    this.game.serialize();
    this.p.lastSeen = Date.now();
    writeProfile(this.p);
  },

  haptic(ms) {
    if (!this.p.settings.haptic) return;
    try {
      navigator.vibrate && navigator.vibrate(ms);
    } catch {
      /* 무시 */
    }
  },

  toggleMute() {
    const on = !(this.p.settings.sfx || this.p.settings.bgm);
    this.p.settings.sfx = on;
    this.p.settings.bgm = on;
    audio.setSfx(on);
    audio.setBgm(on);
    this.ui.setMuteIcon(on);
    this.save();
  },

  setSetting(k, v) {
    this.p.settings[k] = v;
    if (k === 'sfx') audio.setSfx(v);
    if (k === 'bgm') audio.setBgm(v);
    if (k === 'shadows') {
      setShadows(v);
      this.sessionLowQ = false;
    }
    this.ui.setMuteIcon(this.p.settings.sfx || this.p.settings.bgm);
    this.save();
  },

  moneyUnit() {
    // 출석 보상 등 돈 보상 기준: 다음 해금 비용의 절반 정도
    const pad = this.game?.pads?.[0];
    const base = pad ? pad.u.cost * 0.5 : 50 * STAGES[this.p.stage].priceMul;
    return Math.max(10, Math.round(base));
  },

  perkCost(k) {
    return k.base + k.step * (this.p.perks[k.id] || 0);
  },
  perkAffordable() {
    return PERKS.some((k) => (this.p.perks[k.id] || 0) < k.max && this.p.pearls >= this.perkCost(k));
  },
  buyPerk(id) {
    const k = PERKS.find((x) => x.id === id);
    const lvl = this.p.perks[id] || 0;
    if (!k || lvl >= k.max || this.p.pearls < this.perkCost(k)) {
      audio.play('error');
      return false;
    }
    this.p.pearls -= this.perkCost(k);
    this.p.perks[id] = lvl + 1;
    this.game.applyUpgrades();
    audio.play('unlock');
    this.ui.toast(`${k.name} Lv.${lvl + 1}!`, 'good');
    this.save();
    return true;
  },
  // 병목을 보고 추천 업그레이드 고르기
  recommendUpgrade() {
    const g = this.game;
    const B = g.bneck || {};
    const cands = [];
    if ((B.rack || 0) > 8) cands.push('plates');
    if ((B.full || 0) > 8) cands.push('cap');
    if ((B.cook || 0) > 8) cands.push('cook');
    if ((B.wait || 0) > 8) cands.push('belt');
    cands.push('speed', 'cap');
    if (g.staff.length) cands.push('sspeed');
    for (const id of cands) {
      const u = UPGRADES.find((x) => x.id === id);
      if ((g.run.upg[id] || 0) < u.max && (!u.needStaff || g.staff.length)) return id;
    }
    return null;
  },
  startSeason() {
    const p = this.p;
    this.ui.curtain(() => {
      p.season = (p.season || 1) + 1;
      p.stage = 0;
      p.run = newRun();
      p.finished = false;
      p.pearls += 100;
      this.game.loadStage();
      this.save();
      setTimeout(() => this.ui.banner(`${p.season}시즌 시작!`, `모든 수익 x${(1 + (p.season - 1) * 0.5).toFixed(1)}`, null), 700);
    }, `${(p.season || 1) + 1}시즌`);
  },

  upgCost(u) {
    const lvl = this.p.run.upg[u.id] || 0;
    return Math.round(u.base * Math.pow(u.growth, lvl) * STAGES[this.p.stage].priceMul * (1 + ((this.p.season || 1) - 1) * 0.5));
  },

  buyUpgrade(id) {
    const u = UPGRADES.find((x) => x.id === id);
    const run = this.p.run;
    const lvl = run.upg[id] || 0;
    if (!u || lvl >= u.max) return false;
    const cost = this.upgCost(u);
    if (run.money < cost) {
      audio.play('error');
      return false;
    }
    run.money -= cost;
    run.upg[id] = lvl + 1;
    if (id === 'plates') this.game.rack.n += CFG.platesPerLvl;
    this.game.applyUpgrades();
    audio.play('unlock');
    this.haptic(25);
    this.ui.toast(`${u.name} Lv.${lvl + 1}!`);
    this.save();
    return true;
  },

  buyCostume(tab, id) {
    const cos = this.p.cos;
    const list = tab === 'hat' ? HATS : tab === 'apron' ? APRONS : SKINS;
    const owned = tab === 'hat' ? cos.hats : tab === 'apron' ? cos.aprons : cos.skins;
    const it = list.find((x) => x.id === id);
    if (!it) return;
    if (!owned.includes(id)) {
      if (this.p.pearls < it.price) {
        audio.play('error');
        return;
      }
      this.p.pearls -= it.price;
      owned.push(id);
      audio.play('unlock');
      this.ui.toast(`${it.name} 획득!`);
    } else audio.play('click');
    if (tab === 'hat') cos.hat = id;
    else if (tab === 'apron') cos.apron = id;
    else {
      const changed = cos.skin !== id;
      cos.skin = id;
      if (changed) {
        this.save();
        this.ui.close(true);
        this.ui.curtain(() => {
          this.game.loadStage();
          this.game.refreshCostume();
        }, it.name);
      }
    }
    this.game.refreshCostume();
    this.save();
  },

  claimAttend() {
    const r = this.meta.attendClaim(this.moneyUnit());
    if (!r) return null;
    if (r.money) this.game.addMoney(r.money);
    audio.play('unlock');
    const parts = [];
    if (r.pearls) parts.push(`진주 +${r.pearls}`);
    if (r.money) parts.push(`돈 +${fmt(r.money)}`);
    if (r.hat) parts.push('하치마키 모자 획득!');
    this.ui.toast(`${r.day}일차 보상: ${parts.join(', ')}`);
    this.save();
    return r;
  },

  // 식당 이전
  stageClear(final) {
    const g = this.game;
    const p = this.p;
    const sum = { stage: p.stage, name: g.stage.name, earned: g.run.earned, cust: g.run.cust, stars: g.stars(), bestCombo: g.run.bestCombo || p.stats.maxCombo, time: g.run.time, pearls: 20 + p.stage * 15 };
    p.records[p.stage] = { earned: sum.earned, cust: sum.cust, stars: sum.stars, time: sum.time };
    p.pearls += sum.pearls;
    this.save();
    this.ui.openResult(sum, final, () => {
      if (final) {
        p.finished = true;
        this.save();
        return;
      }
      const nextIdx = Math.min(STAGES.length - 1, p.stage + 1);
      this.ui.curtain(() => {
        p.stage = nextIdx;
        p.run = newRun();
        p.stats.stage = p.stage + 1;
        this.meta.checkAch();
        g.loadStage();
        this.save();
        setTimeout(() => this.ui.banner(`${p.stage + 1}호점 오픈!`, STAGES[p.stage].name, null), 700);
      }, STAGES[nextIdx].name);
    });
  },

  restartStage() {
    this.ui.curtain(() => {
      this.p.run = newRun();
      this.game.loadStage();
      this.save();
      this.ui.toast('식당을 새로 시작했어요');
    }, STAGES[this.p.stage].name);
  },

  wipeAll() {
    wipe();
    this.p = null;
    location.reload();
  },

  toTitle() {
    this.save();
    this.setPaused(true, 'title');
    audio.holdBgm(true);
    document.getElementById('app').classList.add('at-title');
    this.ui.showTitle(() => this.startPlay());
  },

  startPlay() {
    audio.resume();
    audio.startBgm();
    this.setPaused(false, 'title');
    audio.holdBgm(false);
    document.getElementById('app').classList.remove('at-title');
    if (!this.started) {
      this.started = true;
      this.checkOffline(this.p.lastSeen);
      // 출석은 모달로 가로막지 않고, 잠시 플레이한 뒤 안내만 띄움
      if (this.meta.attendAvailable() && this.p.stats.plates > 0) setTimeout(() => this.meta.attendAvailable() && this.ui.toast('오늘의 출석 보상이 있어요! 왼쪽 출석 버튼을 눌러요', 'good'), 12000);
    }
  },

  checkOffline(since) {
    const sec = (Date.now() - since) / 1000;
    if (!(sec >= CFG.offline.minSec)) return;
    const capped = Math.min(sec, CFG.offline.capHours * 3600 + (this.p.perks.offline || 0) * 1800);
    const rate = this.game.idleRate();
    // 자리 비운 보상은 다음 해금 1개 남짓으로 상한 (진행 붕괴 방지)
    const pad = this.game.pads[0];
    const capAmt = (pad ? pad.u.cost : 400 * STAGES[this.p.stage].priceMul) * 1.2;
    const amt = Math.floor(Math.min(rate * capped, capAmt));
    if (amt < 1) {
      if (this.p.stats.plates > 20) this.ui.toast('직원을 고용하면 자리를 비운 동안에도 돈을 벌어요');
      return;
    }
    const canDouble = this.p.doubleDay !== today();
    this.ui.openOffline(amt, capped, canDouble, (mul) => {
      if (mul === 2) this.p.doubleDay = today();
      const total = amt * mul;
      this.game.addMoney(total);
      this.p.stats.offline += total;
      this.meta.stat('offline', 0);
      audio.play('cash');
      for (let i = 0; i < 8; i++) setTimeout(() => audio.play('coin'), i * 60);
      this.ui.flashMoney();
      this.save();
    });
  },

  // ---------------- 튜토리얼 ----------------
  tutStep() {
    return this.p.tut;
  },
  tutEvent(evt) {
    const t = this.p.tut;
    const map = { 0: 'pick', 1: 'deposit', 2: 'dish', 3: 'feed', 4: 'money', 5: 'unlock' };
    if (map[t] === evt) {
      this.p.tut = t + 1;
      audio.play('happy');
      if (this.p.tut === 6) this.ui.toast('잘했어요! 이제 가게를 쭉쭉 키워봐요');
      this.save();
    }
  },
  // 생산 루프에서 지금 할 다음 행동 (상자 -> 조리대 -> 완성 접시 -> 벨트)
  loopTarget() {
    const g = this.game;
    const c = g.chef;
    const P = (o) => o && { x: o.x, z: o.z };
    if (c.stack.some((i) => i.k === 'dish')) {
      const b = g.belts.find((x) => x.built && x.free() > 0);
      if (b) return P(b.feed);
    }
    const ing = c.stack.find((i) => i.k === 'ing');
    if (ing) return P(Object.values(g.stations).find((x) => x.built && x.ing === ing.id)?.padIn);
    const st = Object.values(g.stations).find((x) => x.built && x.out > 0);
    if (st) return P(st.padOut);
    const cook = Object.values(g.stations).find((x) => x.built && x.inp > 0);
    if (cook) return P(cook.padOut);
    const cr = Object.values(g.stations).find((x) => x.built && x.crateN > 0);
    return cr ? P(cr.crate.pad) : null;
  },
  tutState() {
    const g = this.game;
    const t = this.p.tut;
    const money = g.seats.find((x) => x.money > 0);
    const eating = g.seats.find((x) => x.cust && (x.cust.state === 'eat' || x.cust.state === 'fetch'));
    const pad = g.pads[0];
    const short = pad ? pad.u.cost - pad.paid - Math.floor(g.run.money) : 0;
    const onBelt = new Set();
    for (const b of g.belts) for (const sl of b.slots) if (sl.item && !sl.item.dried) onBelt.add(sl.item.m);
    const waiting = g.seats.find((x) => x.cust && x.cust.state === 'wait' && onBelt.has(x.cust.orders[x.cust.oi]));
    return { t, money, eating, pad, short, waiting };
  },
  tutTarget() {
    const t = this.p.tut;
    const g = this.game;
    if (t < 6 && g.done.size >= 2) this.p.tut = 6;
    if (this.p.tut >= 6 || g.p.stage > 0) return this.hintTarget();
    const st = Object.values(g.stations).find((s) => s.built);
    const S = this.tutState();
    switch (t) {
      case 0:
        return st && { x: st.crate.pad.x, z: st.crate.pad.z };
      case 1:
        return st && { x: st.padIn.x, z: st.padIn.z };
      case 2:
        if (st && st.out === 0 && st.inp === 0 && !g.chef.stack.some((i) => i.k === 'ing')) return { x: st.crate.pad.x, z: st.crate.pad.z };
        if (st && st.out === 0 && st.inp === 0) return { x: st.padIn.x, z: st.padIn.z };
        return st && { x: st.padOut.x, z: st.padOut.z };
      case 3:
        if (!g.chef.stack.some((i) => i.k === 'dish')) return st && { x: st.padOut.x, z: st.padOut.z };
        return { x: g.belts[0].feed.x, z: g.belts[0].feed.z };
      case 4:
        if (S.money) return { x: S.money.zone.x, z: S.money.zone.z };
        if (S.eating) return { x: S.eating.zone.x, z: S.eating.zone.z };
        if (S.waiting) return { x: S.waiting.zone.x, z: S.waiting.zone.z };
        return this.loopTarget();
      case 5:
        if (S.short > 0) return S.money ? { x: S.money.zone.x, z: S.money.zone.z } : this.loopTarget();
        return S.pad ? { x: S.pad.x, z: S.pad.z } : null;
    }
    return null;
  },
  tutText() {
    const t = this.p.tut;
    const g = this.game;
    if (t >= 6 || g.p.stage > 0) return null;
    const S = this.tutState();
    if (t === 4) {
      if (S.money) return '손님이 두고 간 돈을 밟아서 챙겨요';
      if (S.eating) return '손님이 먹는 중이에요! 다 먹으면 돈을 두고 가요';
      if (S.waiting) return '손님이 초밥을 집어 갈 거예요. 자리 옆에서 기다려요';
      return '초밥을 더 만들어 벨트에 올려요';
    }
    if (t === 5) {
      if (S.short > 0 && S.money) return '손님 자리의 돈을 챙겨요';
      if (S.short > 0) return `초밥을 한 접시 더 팔아 ${S.short}원을 모아요`;
      return '초록 발판에 서 있으면 새 좌석이 열려요';
    }
    return [
      '드래그해서 이동! 노란 생선 상자 발판을 밟아요',
      '조리대 파란 발판에 재료를 넣어요',
      '완성된 초밥을 보라 발판에서 챙겨요',
      '초록 투입구 발판에서 벨트에 올려요',
    ][t];
  },
  // 튜토리얼 이후: 병목이나 멈춰 있을 때 다음 할 일을 화살표로 안내
  hintTarget() {
    const g = this.game;
    const c = g.chef;
    const P = (o) => o && { x: o.x, z: o.z };
    if (g.rack.n === 0 && g.sink.built) {
      if (c.stack.some((i) => i.k === 'dirty')) return P(g.sink.pad);
      const s = g.seats.find((x) => x.dirty > 0 && !x.cust);
      if (s) return P(s.zone);
    }
    if ((this.idleT || 0) < 3.5) return null;
    const pad = g.pads[0];
    if (pad && g.run.money + pad.paid >= pad.u.cost) return P(pad);
    if (c.stack.some((i) => i.k === 'dish')) {
      const b = g.belts.find((x) => x.built && x.free() > 0);
      if (b) return P(b.feed);
    }
    const ms = g.seats.find((x) => x.money > 0);
    if (ms) return P(ms.zone);
    const ing = c.stack.find((i) => i.k === 'ing');
    if (ing) return P(Object.values(g.stations).find((s) => s.built && s.ing === ing.id)?.padIn);
    const dem = g.demand();
    const st = Object.values(g.stations).find((s) => s.built && s.out > 0 && (dem[s.menu] || 0) > 0);
    if (st) return P(st.padOut);
    const need = Object.values(g.stations).find((s) => s.built && (dem[s.menu] || 0) > 0 && s.inp === 0);
    if (need) return P(need.crate.pad);
    if (c.stack.some((i) => i.k === 'dirty') && g.sink.built) return P(g.sink.pad);
    return null;
  },
};

// ---------------- 초기화 ----------------
function boot() {
  const { profile, corrupt } = loadProfile();
  app.p = profile;
  initGfx(document.getElementById('gl'));
  setShadows(profile.settings.shadows);
  audio.setSfx(profile.settings.sfx);
  audio.setBgm(profile.settings.bgm);

  app.meta = new Meta(profile, {
    missionDone: (m) => app.ui && app.ui.toast(`미션 완료! ${m.text}`, 'good'),
    achDone: (a) => app.ui && app.ui.toast(`업적 달성: ${a.name}`, 'good'),
  });
  app.ui = new UI(app);

  const hooks = {
    stat: (k, n) => app.meta.stat(k, n),
    toast: (t, c) => app.ui.toast(t, c),
    banner: (a, b, m) => app.ui.banner(a, b, m),
    haptic: (ms) => app.haptic(ms),
    openUpgrade: () => app.ui.openUpgrade(),
    closeUpgrade: () => app.ui.panel && app.ui.panel.cls === 'upgrade' && app.ui.close(),
    stageClear: (final) => app.stageClear(final),
    save: () => app.save(),
    money: (n) => n > 0 && app.ui.flashMoney(),
    combo: (n, mul) => {
      app.ui.combo(n, mul);
      if (n > (app.game.run.bestCombo || 0)) app.game.run.bestCombo = n;
    },
    comboBreak: () => app.ui.comboBreak(),
    emote: (c, t) => app.ui.emote(c, t),
    discover: (m) => {
      if (app.meta.discover(m)) {
        app.newDex = true;
        app.ui.toast(`새 레시피 발견! ${MENUS[m].name}`, 'good');
      }
    },
    served: (m) => app.meta.served(m),
    tut: (e) => app.tutEvent(e),
    tutTarget: () => app.tutTarget(),
    unlocked: (u) => {
      app.tutEvent('unlock');
      if (u.t === 'sink') app.ui.toast('빈 접시를 설거지대에 가져가면 다시 쓸 수 있어요');
      if (u.t === 'staff') app.ui.toast(u.role === 'runner' ? '운반 직원이 접시를 나르고 치워요' : '조리 직원이 재료를 채워줘요');
      if (u.t === 'lever') app.ui.toast('두 번째 벨트 오픈! 투입구가 하나 더 생겼어요');
      if (u.t === 'extend') app.ui.toast('벨트가 길어졌어요! 좌석을 더 놓을 수 있어요');
      if (u.t === 'upgrade') app.ui.toast('보라색 책상 앞 발판에서 업그레이드해요');
    },
    clearWorldUI: () => app.ui.clearWorld(),
    stageLoaded: () => {},
  };
  app.game = new Game(profile, hooks);
  app.game.loadStage();
  window.__game = app;
  window.__gfx = gfx;
  window.__input = input;
  window.__audio = audio;
  window.__UPG = UPGRADES;

  initInput(document.getElementById('gl'));
  input.onFirst = () => audio.resume();

  if (corrupt) setTimeout(() => app.ui.toast('저장 데이터가 손상되어 새로 시작해요', 'bad'), 800);

  // 첫 실행: 짧은 로딩 연출 후 타이틀
  document.getElementById('app').classList.add('at-title');
  app.ui.showTitle(() => app.startPlay());

  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      app.hiddenAt = Date.now();
      app.setPaused(true, 'hidden');
      app.save();
      audio.suspend();
    } else {
      app.setPaused(false, 'hidden');
      if (app.started) audio.resume();
      if (app.started && app.hiddenAt && !app.ui.panel) app.checkOffline(app.hiddenAt);
      app.hiddenAt = 0;
    }
  });
  window.addEventListener('pagehide', () => app.save());
  document.addEventListener('contextmenu', (e) => e.preventDefault());
  document.addEventListener('pointerdown', () => audio.resume(), { once: false, passive: true });

  if (DEBUG) buildDebug();
  requestAnimationFrame(loop);
}

const perf = { js: 0, gl: 0, calls: 0, tris: 0 };
window.__perf = perf;
let last = performance.now();
let titleT = 0;
function loop(now) {
  const dtRaw = Math.min(0.2, Math.max(0, (now - last) / 1000));
  last = now;
  const g = app.game;
  const paused = app.paused;
  if (!paused) {
    const sub = Math.max(1, Math.ceil(dtRaw / 0.05));
    const steps = sub * (app.speed > 1 ? app.speed : 1);
    const t1 = performance.now();
    for (let i = 0; i < steps; i++) {
      if (app.bot) app.bot(dtRaw / sub);
      g.update(dtRaw / sub);
    }
    autoQuality();
    perf.upd = (perf.upd || 0) * 0.9 + (performance.now() - t1) * 0.1;
    app.p.stats.playSec += dtRaw;
    app.saveT += dtRaw;
    if (app.saveT >= CFG.autosave) {
      app.saveT = 0;
      app.save();
    }
  }
  const t2 = performance.now();
  g.render(paused ? 0 : dtRaw);
  perf.rend = (perf.rend || 0) * 0.9 + (performance.now() - t2) * 0.1;
  if (app.pauseReasons.has('title')) {
    titleT += dtRaw;
    const L = g.lay;
    updateCamera(dtRaw, L.belts[0].cx + Math.sin(titleT * 0.25) * 2.5, L.topZ + 1 + Math.cos(titleT * 0.2) * 2);
  } else {
    const b = g.lay.bounds;
    const cut = g.camCut;
    if (cut) {
      // 해금 카메라 컷: 새 시설로 이동 + 줌인, 잠깐 입력 잠금
      input.locked = true; // 이동만 잠깐 멈춤 (터치 추적은 유지)
      gfx.zoom += (0.9 - gfx.zoom) * Math.min(1, dtRaw * 8);
      updateCamera(dtRaw, cut.x, cut.z - 0.3, false, 9);
    } else {
      input.locked = false;
      gfx.zoom += (1 - gfx.zoom) * Math.min(1, dtRaw * 5);
      updateCamera(dtRaw, Math.max(b.x0 + 3.2, Math.min(b.x1 - 3.2, g.chef.x)), Math.max(b.z0 + 5.6, Math.min(b.z1 - 3.5, g.chef.z - 0.4)), false, g.lastCutEnd && g.time - g.lastCutEnd < 0.8 ? 8 : 6);
    }
  }
  app.ui.updateHud(dtRaw);
  app.ui.updateWorld();
  updatePops(dtRaw);
  if (!paused) {
    app.idleT = input.active ? 0 : (app.idleT || 0) + dtRaw;
    const tt = app.tutText();
    app.ui.tut(tt, app.p.tut === 0 && !input.active);
    app.ui.updateEdge(g.guide);
    app.ui.updatePointer(g.guide, !!tt && app.p.tut > 0);
  } else {
    app.ui.updateEdge(null);
    app.ui.updatePointer(null, false);
  }
  const tr = performance.now();
  gfx.renderer.render(gfx.scene, gfx.camera);
  const te = performance.now();
  perf.js = perf.js * 0.9 + (tr - now) * 0.1;
  perf.gl = perf.gl * 0.9 + (te - tr) * 0.1;
  perf.calls = gfx.renderer.info.render.calls;
  perf.frame = (perf.frame || 16) * 0.9 + dtRaw * 1000 * 0.1;
  perf.tris = gfx.renderer.info.render.triangles;
  requestAnimationFrame(loop);
}

// 저사양 기기 자동 감지: 실제 경과 시간 기준으로 프레임이 느리면 단계적으로 품질을 낮춤
// 1단계: 그림자 끄기(원형 그림자로 대체), 2단계: 해상도 배율 1.0
const aq = { start: 0, n: 0, sum: 0, last: 0, step: 0 };
function autoQuality() {
  const now = performance.now();
  if (!aq.start) {
    aq.start = now + 1500;
    aq.last = now;
    return;
  }
  const dt = now - aq.last;
  aq.last = now;
  if (now < aq.start || aq.step >= 2) return;
  aq.n++;
  aq.sum += dt;
  if (now - aq.start < 3000) return;
  const avg = aq.sum / aq.n;
  aq.start = now;
  aq.n = 0;
  aq.sum = 0;
  if (avg < 40) {
    aq.step = 2;
    return;
  }
  if (aq.step === 0 && app.p.settings.shadows && !app.p.settings.qLocked) {
    // 세션 한정: 저장된 설정은 바꾸지 않음
    setShadows(false);
    app.sessionLowQ = true;
    app.ui.toast('기기 성능에 맞춰 그림자를 간단하게 바꿨어요 (설정에서 변경 가능)');
    aq.step = 1;
  } else if (gfx.renderer.getPixelRatio() > 1) {
    gfx.renderer.setPixelRatio(1);
    resize();
    aq.step = 2;
  } else aq.step = 2;
}

// ---------------- 디버그 ----------------
function buildDebug() {
  const d = document.createElement('div');
  d.className = 'debug';
  d.innerHTML = `
    <button data-a="money">+돈</button>
    <button data-a="speed">x1</button>
    <button data-a="unlock">해금</button>
    <button data-a="rush">러시</button>
    <button data-a="offline">오프라인</button>
    <button data-a="pearl">+진주</button>`;
  document.getElementById('app').appendChild(d);
  d.addEventListener('pointerdown', (e) => e.stopPropagation());
  d.addEventListener('click', (e) => {
    const a = e.target.dataset.a;
    const g = app.game;
    if (a === 'money') {
      const pad = g.pads[0];
      g.addMoney(Math.max(1000, pad ? pad.u.cost * 2 : 1000));
    } else if (a === 'speed') {
      app.speed = app.speed === 1 ? 5 : 1;
      e.target.textContent = 'x' + app.speed;
    } else if (a === 'unlock') {
      g.debugUnlockAll();
    } else if (a === 'rush') {
      g.rushT = 9999;
      g.run.nextRush = 1;
    } else if (a === 'offline') {
      app.save();
      app.checkOffline(Date.now() - 2 * 3600 * 1000);
    } else if (a === 'pearl') {
      app.p.pearls += 200;
    }
  });
}

boot();
