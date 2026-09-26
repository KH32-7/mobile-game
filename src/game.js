// 게임 시뮬레이션: 셰프, 적재, 조리, 벨트, 손님, 직원, 해금
import { THREE, gfx, Instancer, GEO, Build, col, matVC, updateCamera, canvasTex } from './gfx.js';
import { CFG, STAGES, MENUS, INGS, UPGRADES, MENU_ORDER, HATS, APRONS } from './config.js';
import { buildLayout, seatInfo, COUNTER_OUT, STOOL } from './layout.js';
import { Belt, buildBeltMesh, animateBeltTex, BELT_H } from './belt.js';
import { buildEnvironment, facilityMeshes, stoolMesh, makeActionPad, UnlockPad, themeFor, fmt } from './world.js';
import { plateGeo, toppingGeo, ingGeo, cashGeo, coinGeo, customerParts, makeChar, animChar, setHat, arrowMesh, ITEM_H } from './models.js';
import { Nav } from './nav.js';
import { audio } from './audio.js';
import { burst, ring, puff, updateParticles, clearParticles, popText, updatePops, clearPops } from './fx.js';
import { readMove } from './input.js';
import { newRun } from './save.js';

const SHIRTS = ['#ff6b5a', '#4fb0ff', '#ffc83d', '#6ee07a', '#b58cff', '#ff8fb8', '#58c7b4', '#ff9a3c', '#8a9ab8', '#e8e0d0'];
const HAIRS = ['#3a2a22', '#1a1a1a', '#8a5a2a', '#d9a441', '#6a3a8a', '#c0392b', '#e8e0d0', '#4a6aa8'];
const SKINS_C = ['#ffd9b8', '#f2c49b', '#d9a077', '#a8704a', '#ffe4cc'];
const DRIED = new THREE.Color(0.62, 0.56, 0.46);
const DIRTY = col('#d6cfc0');
const DRIED_PLATE = col('#9a9a9a');
const VIP_SHIRT = '#4a2a7a';

const _m = new THREE.Matrix4();
const _m2 = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _e = new THREE.Euler();
const _v = new THREE.Vector3();
const _s = new THREE.Vector3(1, 1, 1);
const _m3 = new THREE.Matrix4();
const _m4 = new THREE.Matrix4();
const SIT_LEGS = new THREE.Matrix4().makeTranslation(0, 0.2, 0).multiply(new THREE.Matrix4().makeRotationX(-1.3)).multiply(new THREE.Matrix4().makeTranslation(0, -0.18, 0));

function rand(a, b) {
  return a + Math.random() * (b - a);
}
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function ease(t) {
  // 탄성 팝
  if (t >= 1) return 1;
  return 1 - Math.pow(2, -9 * t) * Math.cos(t * Math.PI * 3.2);
}

export class Game {
  constructor(profile, hooks) {
    this.p = profile;
    this.hooks = hooks;
    this.inst = new Instancer(gfx.scene);
    this.initInstances();
    this.root = null;
    this.time = 0;
    this.paused = true;
    this.speed = 1;
    this.chefMesh = makeChar({ body: '#ffffff', hat: profile.cos.hat, apron: this.apronColor() });
    gfx.scene.add(this.chefMesh);
    this.arrow = arrowMesh();
    gfx.scene.add(this.arrow);
    this.flights = [];
    this.customers = [];
    this.staff = [];
    this.anims = [];
    this.nextCustId = 1;
    this.warnT = {};
    this.stepT = 0;
    this.stepAlt = false;
  }

  apronColor() {
    return (APRONS.find((a) => a.id === this.p.cos.apron) || APRONS[0]).color;
  }
  refreshCostume() {
    setHat(this.chefMesh, this.p.cos.hat);
    this.chefMesh.userData.apronMat.color.set(this.apronColor());
  }

  initInstances() {
    const I = this.inst;
    I.add('plate', plateGeo(), 700);
    for (const m of MENU_ORDER) I.add('top_' + m, toppingGeo(m), 220);
    for (const id of Object.keys(INGS)) I.add('ing_' + id, ingGeo(id), 160);
    I.add('cash', cashGeo(), 260);
    I.add('coin', coinGeo(), 120);
    const cp = customerParts();
    I.add('c_body', cp.body, 60);
    I.add('c_head', cp.head, 60);
    I.add('c_hair', cp.hair, 60);
    I.add('c_face', cp.face, 60, { shadow: false });
    I.add('c_crown', cp.crown, 8);
    I.add('c_legs', cp.legs, 60);
    I.add('spark', new Build().add(GEO.box(1, 0.35, 0.7), '#ffffff').geometry(), 300, { shadow: false });
    I.add('puff', new Build().add(GEO.sph(0.5, 8, 6), '#ffffff').geometry(), 200, { shadow: false });
    // 저사양 모드용 원형 그림자
    const blobTex = canvasTex(64, 64, (ctx) => {
      const g = ctx.createRadialGradient(32, 32, 4, 32, 32, 31);
      g.addColorStop(0, 'rgba(0,0,0,0.42)');
      g.addColorStop(0.6, 'rgba(0,0,0,0.25)');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 64);
    });
    const blobGeo = new THREE.PlaneGeometry(1, 1);
    blobGeo.rotateX(-Math.PI / 2);
    I.add('blob', blobGeo, 80, { shadow: false, mat: new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false }) });
  }

  // ---------------- 스테이지 로드 ----------------
  loadStage() {
    const p = this.p;
    const stage = STAGES[p.stage];
    this.stage = stage;
    this.lay = buildLayout(stage);
    this.theme = themeFor(stage, p.cos.skin);
    const run = p.run;
    this.run = run;
    if (this.root) {
      gfx.scene.remove(this.root);
      this.root.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
      });
    }
    clearParticles();
    clearPops();
    this.hooks.clearWorldUI && this.hooks.clearWorldUI();
    this.flights = [];
    this.customers = [];
    this.staff.forEach((s) => gfx.scene.remove(s.mesh));
    this.staff = [];
    this.anims = [];
    const root = new THREE.Group();
    this.root = root;
    gfx.scene.add(root);
    const L = this.lay;
    const theme = this.theme;
    gfx.hemi.color.set(theme.hemiSky);
    gfx.hemi.groundColor.set(theme.hemiGround);
    gfx.hemi.intensity = theme.hemi;
    gfx.sun.color.set(theme.light);
    gfx.sun.intensity = theme.sun;
    this.env = buildEnvironment(stage, L, theme);
    root.add(this.env);
    this.fac = facilityMeshes(stage, L, theme);

    const done = new Set(run.done);
    this.done = done;
    const has = (pred) => stage.unlocks.some((u) => done.has(u.id) && pred(u));
    this.ext = has((u) => u.t === 'extend');
    const len = this.ext ? stage.layout.len1 : stage.layout.len0;

    // 벨트
    this.belts = L.belts.map((bd, i) => {
      const b = new Belt(bd, len);
      b.built = i === 0 || has((u) => u.t === 'lever');
      return b;
    });
    for (const b of this.belts) {
      const saved = run.belts[b.id];
      if (Array.isArray(saved)) {
        saved.forEach((it, i) => {
          if (it && MENUS[it.m] && i < b.slots.length) b.slots[i].item = { m: it.m, laps: it.l || 0, dried: !!it.d };
        });
      }
      if (b.built) this.buildBeltVisual(b);
    }

    // 조리대 + 상자
    this.stations = {};
    for (const s of L.stations) {
      const built = stage.start.menus.includes(s.menu) || has((u) => u.t === 'station' && u.menu === s.menu);
      const sv = run.st[s.menu] || {};
      const cr = run.cr[s.menu];
      this.stations[s.menu] = {
        ...s,
        built,
        inp: Math.max(0, Math.min(CFG.station.inCap, sv.i | 0)),
        out: Math.max(0, Math.min(CFG.station.outCap, sv.o | 0)),
        incoming: 0,
        t: 0,
        crateN: Number.isFinite(cr) ? Math.max(0, Math.min(CFG.crate.max, cr)) : CFG.crate.max,
        crateT: 0,
        mesh: this.fac.stations[s.menu],
        crateMesh: this.fac.crates[s.menu],
      };
      if (built) {
        root.add(this.fac.stations[s.menu], this.fac.crates[s.menu]);
        this.addActionPad('crate', s.ing, s.crate.pad.x, s.crate.pad.z);
        this.addActionPad('in', s.ing, s.padIn.x, s.padIn.z, 0.9);
        this.addActionPad('out', s.menu, s.padOut.x, s.padOut.z, 0.9);
      }
    }
    // 접시 선반 + 설거지대
    root.add(this.fac.rack);
    this.sink = { ...L.sink, built: has((u) => u.t === 'sink'), q: Math.max(0, run.sinkQ | 0), t: 0 };
    if (this.sink.built) {
      root.add(this.fac.sink);
      this.addActionPad('sink', 'sink', L.sink.pad.x, L.sink.pad.z);
    }
    this.upgradeBuilt = has((u) => u.t === 'upgrade');
    if (this.upgradeBuilt) {
      root.add(this.fac.desk);
      this.addActionPad('upgrade', 'up', L.upgrade.x, L.upgrade.z, 1.25);
    }
    // 벨트별 투입구/수거함
    this.belts.forEach((b, i) => {
      b.feed = L.feeds[i];
      b.trash = L.trashes[i];
      b.trashS = b.nearestS(b.trash.x, b.trash.z);
      if (b.built) this.addBeltPads(b, i);
    });
    if (this.lay.lever && this.belts[1]?.built) root.add(this.fac.lever);

    // 좌석
    this.seats = [];
    const seatIds = [...stage.start.seats];
    for (const u of stage.unlocks) if (u.seats) seatIds.push(...u.seats);
    for (const id of seatIds) {
      const belt = this.belts.find((b) => b.id === id[0]);
      const unlocked = stage.start.seats.includes(id) || stage.unlocks.some((u) => u.seats && u.seats.includes(id) && done.has(u.id));
      const sv = run.seats[id] || {};
      const seat = { id, belt, unlocked, cust: null, dirty: Math.max(0, sv.d | 0), money: Math.max(0, +sv.m || 0), stool: null, reserved: false };
      this.placeSeat(seat);
      if (unlocked) this.addStool(seat);
      this.seats.push(seat);
    }

    // 업그레이드 값
    this.applyUpgrades();
    // 접시 수량 재계산
    const used = this.countPlatesUsed();
    this.rack = { ...L.rack, n: Math.max(0, this.platesTotal() - used) };

    // 셰프
    const chefStack = (run.stack || []).filter((it) => this.validItem(it)).slice(0, this.chefCap());
    this.chef = {
      isChef: true,
      x: L.belts[0].cx + (this.lay.m || 1) * 0.001,
      z: L.topZ - L.r - 2.6,
      ry: Math.PI,
      stack: chefStack,
      incoming: 0,
      lean: { x: 0, z: 0, vx: 0, vz: 0 },
      pv: { x: 0, z: 0 },
      zone: null,
      zoneT: 0,
      xferT: 0,
      moving: false,
      walkT: 0,
      mesh: this.chefMesh,
    };
    // 직원
    const roles = stage.unlocks.filter((u) => u.t === 'staff' && done.has(u.id)).map((u) => u.role);
    roles.forEach((role, i) => {
      const sv = run.staff[i];
      this.spawnStaff(role, sv && Array.isArray(sv.stack) ? sv.stack.filter((it) => this.validItem(it)) : [], false);
    });

    // 해금 발판
    this.pads = [];
    this.refreshPads(false);
    this.rebuildNav();
    this.rebuildZones();
    this.spawnT = run.cust === 0 ? CFG.cust.firstDelay : 2;
    this.rushT = run.rushT || 0;
    this.rush = null;
    this.combo = run.combo || 0;
    this.lastComboT = 0;
    updateCamera(0, this.chef.x, this.chef.z - 0.5, true);
    this.hooks.stageLoaded && this.hooks.stageLoaded();
  }

  validItem(it) {
    if (!it || typeof it !== 'object') return false;
    if (it.k === 'ing') return !!INGS[it.id];
    if (it.k === 'dish') return !!MENUS[it.m];
    return it.k === 'dirty';
  }

  platesTotal() {
    const seats = this.seats ? this.seats.filter((x) => x.unlocked).length : 2;
    return CFG.plates + seats * CFG.platesPerSeat + (this.run.upg.plates || 0) * CFG.platesPerLvl;
  }
  countPlatesUsed() {
    let n = this.sink.q;
    for (const s of Object.values(this.stations)) n += s.out;
    for (const b of this.belts) for (const sl of b.slots) if (sl.item) n++;
    const cnt = (st) => st.filter((it) => it.k === 'dish' || it.k === 'dirty').length;
    n += cnt(this.run.stack || []);
    for (const sv of this.run.staff || []) if (sv && Array.isArray(sv.stack)) n += cnt(sv.stack);
    for (const s of this.seats) n += s.dirty;
    return n;
  }

  applyUpgrades() {
    const u = this.run.upg;
    this.chefSpeed = CFG.chef.speed + (u.speed || 0) * CFG.chef.speedPerLvl;
    this.cookTime = CFG.station.cookTime * Math.pow(CFG.station.cookPerLvl, u.cook || 0);
    this.beltSpeed = CFG.belt.speed + (u.belt || 0) * CFG.belt.speedPerLvl;
    this.staffSpeed = CFG.staff.speed * (1 + (u.sspeed || 0) * CFG.staff.speedPerLvl);
    this.staffCap = CFG.staff.cap + (u.scap || 0) * CFG.staff.capPerLvl;
  }
  chefCap() {
    return CFG.chef.cap + (this.run.upg.cap || 0) * CFG.chef.capPerLvl;
  }

  buildBeltVisual(b) {
    if (b.group) {
      this.root.remove(b.group);
      b.group.traverse((o) => o.geometry && o.geometry.dispose());
    }
    const g = buildBeltMesh(b, this.theme);
    const wrap = new THREE.Group();
    const cz = b.topZ + b.len / 2;
    wrap.position.set(b.cx, 0, cz);
    g.position.set(-b.cx, 0, -cz);
    wrap.add(g);
    // 안쪽 섬 장식
    const deco = new Build();
    const inner = b.r - 0.5;
    deco.add(GEO.rbox(inner * 2 - 0.1, 0.5, b.len + inner * 1.2, 0.5), '#6a4a3a', 0, 0.25, 0);
    deco.add(GEO.cyl(0.25, 0.2, 0.3, 10), '#e8e0d0', 0, 0.65, -b.len / 2 + 0.2);
    deco.add(GEO.sph(0.35, 10, 8), '#4faa5a', 0, 1.0, -b.len / 2 + 0.2);
    deco.add(GEO.cyl(0.25, 0.2, 0.3, 10), '#e8e0d0', 0, 0.65, b.len / 2 - 0.2);
    deco.add(GEO.sph(0.32, 10, 8), '#ff8fb8', 0, 0.98, b.len / 2 - 0.2);
    deco.add(GEO.box(0.1, 0.5, 0.1), '#3a2a22', 0, 0.75, 0);
    deco.add(GEO.rbox(0.5, 0.36, 0.08, 0.05), '#ffffff', 0, 1.1, 0);
    const dm = deco.mesh();
    wrap.add(dm);
    b.group = wrap;
    this.root.add(wrap);
  }

  addBeltPads(b, i) {
    if (b.padMeshes) b.padMeshes.forEach((m) => this.root.remove(m));
    const f = makeActionPad('feed', 'feed', b.feed.x, b.feed.z, 1.0);
    const t = makeActionPad('trash', 'trash', b.trash.x, b.trash.z, 0.95);
    this.root.add(f, t);
    this.root.add(this.fac.trash[i]);
    b.padMeshes = [f, t];
  }

  addActionPad(type, id, x, z, size = 0.95) {
    const m = makeActionPad(type, id, x, z, size);
    this.root.add(m);
    return m;
  }

  placeSeat(seat) {
    const info = seatInfo(seat.id, seat.belt, seat.belt.len);
    Object.assign(seat, info);
    const out = seat.side === 'R' ? 1 : -1;
    seat.out = out;
    seat.zone = { x: seat.x + out * 0.5, z: seat.z };
    seat.stand = { x: seat.x + out * 0.55, z: seat.z };
  }

  addStool(seat) {
    if (seat.stool) this.root.remove(seat.stool);
    seat.stool = stoolMesh(seat.x, seat.z, this.theme);
    this.root.add(seat.stool);
    return seat.stool;
  }

  rebuildNav() {
    const L = this.lay;
    const obs = [];
    for (const b of this.belts) if (b.built) obs.push({ t: 'stad', x: b.cx, z0: b.topZ, z1: b.topZ + b.len, rad: b.r + COUNTER_OUT + 0.04 });
    for (const s of Object.values(this.stations)) {
      if (!s.built) continue;
      obs.push({ t: 'box', x: s.x, z: s.z, hw: 0.92, hd: 0.58 });
      obs.push({ t: 'box', x: s.crate.x, z: s.crate.z, hw: 0.62, hd: 0.5 });
    }
    obs.push({ t: 'box', x: L.rack.x, z: L.rack.z, hw: 0.62, hd: 0.47 });
    if (this.sink.built) obs.push({ t: 'box', x: L.sink.x, z: L.sink.z, hw: 0.85, hd: 0.6 });
    if (this.upgradeBuilt) obs.push({ t: 'box', x: L.upgrade.desk.x, z: L.upgrade.desk.z, hw: 0.66, hd: 0.86 });
    this.belts.forEach((b, i) => {
      if (b.built) obs.push({ t: 'box', x: L.trashes[i].bin.x, z: L.trashes[i].bin.z, hw: 0.38, hd: 0.38 });
    });
    if (L.lever && this.belts[1]?.built) obs.push({ t: 'box', x: L.lever.model.x, z: L.lever.model.z, hw: 0.28, hd: 0.28 });
    if (!this.nav) this.nav = new Nav(L.bounds);
    this.nav.bounds = L.bounds;
    this.nav.setObstacles(obs);
  }

  rebuildZones() {
    const Z = [];
    const sq = (type, x, z, h, ref) => Z.push({ type, x, z, hw: h, hd: h, ref });
    for (const s of Object.values(this.stations)) {
      if (!s.built) continue;
      sq('crate', s.crate.pad.x, s.crate.pad.z, 0.5, s);
      sq('in', s.padIn.x, s.padIn.z, 0.45, s);
      sq('out', s.padOut.x, s.padOut.z, 0.45, s);
    }
    if (this.sink.built) sq('sink', this.sink.pad.x, this.sink.pad.z, 0.5, this.sink);
    for (const b of this.belts) {
      if (!b.built) continue;
      sq('feed', b.feed.x, b.feed.z, 0.52, b);
      sq('trash', b.trash.x, b.trash.z, 0.5, b);
    }
    if (this.upgradeBuilt) sq('upgrade', this.lay.upgrade.x, this.lay.upgrade.z, 0.62, null);
    for (const seat of this.seats) if (seat.unlocked) Z.push({ type: 'seat', x: seat.zone.x, z: seat.zone.z, hw: 0.62, hd: 0.5, ref: seat });
    for (const pad of this.pads) Z.push({ type: 'unlock', x: pad.x, z: pad.z, hw: pad.ui.size * 0.45, hd: pad.ui.size * 0.45, ref: pad });
    this.zones = Z;
  }

  // 다음 해금 발판 (목록 순서대로 최대 2개 노출)
  refreshPads(animate = true) {
    const stage = this.stage;
    const want = stage.unlocks.filter((u) => !this.done.has(u.id)).slice(0, 2);
    // 제거
    for (const pad of this.pads.slice()) {
      if (!want.includes(pad.u)) {
        this.root.remove(pad.ui.mesh);
        this.pads.splice(this.pads.indexOf(pad), 1);
      }
    }
    for (const u of want) {
      if (this.pads.some((p) => p.u === u)) continue;
      const pos = this.unlockPos(u);
      const { label, icon } = this.unlockLabel(u);
      const kind = u.t === 'next' || u.t === 'final' ? 'next' : 'unlock';
      const ui = new UnlockPad(label, icon, u.cost, pos.x, pos.z, kind);
      const pad = { u, x: pos.x, z: pos.z, ui, paid: Math.min(u.cost, this.run.paid[u.id] || 0), payT: 0, coinT: 0 };
      ui.draw(pad.paid / u.cost, this.run.money > 0);
      this.root.add(ui.mesh);
      this.pads.push(pad);
      if (animate) this.popIn(ui.mesh, 0.25, ui.size);
    }
  }

  unlockPos(u) {
    const L = this.lay;
    switch (u.t) {
      case 'seats': {
        const a = this.seats ? this.seats.find((s) => s.id === u.seats[0]) : null;
        const b2 = this.seats ? this.seats.find((s) => s.id === u.seats[1]) : null;
        if (a && b2 && a.side === b2.side && a.belt === b2.belt) return { x: a.x + a.out * 0.35, z: (a.z + b2.z) / 2 };
        if (a) return { x: a.x + a.out * 0.35, z: a.z };
        return { x: 0, z: 0 };
      }
      case 'station': {
        const s = L.stations.find((x) => x.menu === u.menu);
        return { x: s.x, z: s.z + 1.05 };
      }
      case 'sink':
        return { x: L.sink.pad.x, z: L.sink.pad.z };
      case 'upgrade':
        return { x: L.upgrade.x, z: L.upgrade.z };
      case 'staff':
        return u.role === 'runner' ? { x: L.upgrade.x, z: L.upgrade.z - 2.1 } : { x: L.upgrade.x - 2.1 * L.m, z: L.upgrade.z };
      case 'extend':
        return { x: L.extPad.x, z: L.extPad.z };
      case 'lever':
        return { x: L.lever.x, z: L.lever.z };
      default:
        return { x: L.nextPad.x, z: L.nextPad.z };
    }
  }

  unlockLabel(u) {
    switch (u.t) {
      case 'seats':
        return { label: '좌석 +' + u.seats.length, icon: { glyph: 'seat' } };
      case 'station':
        return { label: MENUS[u.menu].name.replace(' 초밥', ''), icon: { menu: u.menu } };
      case 'sink':
        return { label: '설거지대', icon: { glyph: 'sink' } };
      case 'upgrade':
        return { label: '업그레이드', icon: { glyph: 'upgrade' } };
      case 'staff':
        return u.role === 'runner' ? { label: '운반 직원', icon: { glyph: 'staff' } } : { label: '조리 직원', icon: { glyph: 'hauler' } };
      case 'extend':
        return { label: '벨트 확장', icon: { glyph: 'belt' } };
      case 'lever':
        return { label: '분기 레버', icon: { glyph: 'lever' } };
      case 'final':
        return { label: '우주 최고', icon: { glyph: 'final' } };
      default:
        return { label: '새 식당 이전', icon: { glyph: 'next' } };
    }
  }

  popIn(obj, delay = 0, finalScale = 1) {
    const base = obj.scale.clone();
    if (finalScale !== 1) base.set(finalScale, 1, finalScale);
    obj.scale.set(0.001, 0.001, 0.001);
    this.anims.push({ obj, t: -delay, dur: 0.7, base });
  }

  // ---------------- 해금 ----------------
  doUnlock(pad) {
    const u = pad.u;
    const L = this.lay;
    this.done.add(u.id);
    this.run.done.push(u.id);
    delete this.run.paid[u.id];
    const pops = [];
    let at = { x: pad.x, z: pad.z };
    switch (u.t) {
      case 'seats':
        for (const id of u.seats) {
          const s = this.seats.find((x) => x.id === id);
          if (!s) continue;
          s.unlocked = true;
          this.rack.n += CFG.platesPerSeat;
          pops.push(this.addStool(s));
        }
        break;
      case 'station': {
        const s = this.stations[u.menu];
        s.built = true;
        s.inp = 0;
        s.out = 0;
        this.root.add(s.mesh, s.crateMesh);
        pops.push(s.mesh, s.crateMesh);
        pops.push(this.addActionPad('crate', s.ing, s.crate.pad.x, s.crate.pad.z));
        pops.push(this.addActionPad('in', s.ing, s.padIn.x, s.padIn.z, 0.9));
        pops.push(this.addActionPad('out', s.menu, s.padOut.x, s.padOut.z, 0.9));
        this.hooks.discover && this.hooks.discover(u.menu);
        at = { x: s.x, z: s.z };
        break;
      }
      case 'sink':
        this.sink.built = true;
        this.root.add(this.fac.sink);
        pops.push(this.fac.sink, this.addActionPad('sink', 'sink', L.sink.pad.x, L.sink.pad.z));
        at = { x: L.sink.x, z: L.sink.z };
        break;
      case 'upgrade':
        this.upgradeBuilt = true;
        this.root.add(this.fac.desk);
        pops.push(this.fac.desk, this.addActionPad('upgrade', 'up', L.upgrade.x, L.upgrade.z, 1.25));
        break;
      case 'staff': {
        const s = this.spawnStaff(u.role, [], true);
        s.x = pad.x;
        s.z = pad.z;
        pops.push(s.mesh);
        this.hooks.stat('staff', 1);
        break;
      }
      case 'extend': {
        this.ext = true;
        for (const b of this.belts) {
          b.setLen(this.stage.layout.len1);
          b.trashS = b.nearestS(b.trash.x, b.trash.z);
          if (b.built) {
            this.buildBeltVisual(b);
            pops.push(b.group);
          }
        }
        for (const s of this.seats) {
          this.placeSeat(s);
          if (s.unlocked && s.stool) s.stool.position.set(s.x, 0, s.z);
        }
        break;
      }
      case 'lever': {
        const b = this.belts[1];
        b.built = true;
        this.buildBeltVisual(b);
        this.addBeltPads(b, 1);
        this.root.add(this.fac.lever);
        pops.push(b.group, this.fac.lever, ...b.padMeshes, this.fac.trash[1]);
        for (const id of u.seats || []) {
          const s = this.seats.find((x) => x.id === id);
          if (s) {
            s.unlocked = true;
            this.rack.n += CFG.platesPerSeat;
            pops.push(this.addStool(s));
          }
        }
        at = { x: b.cx, z: b.topZ + b.len / 2 };
        break;
      }
      case 'next':
      case 'final':
        break;
    }
    pops.forEach((o, i) => this.popIn(o, i * 0.06));
    burst(at.x, 0.6, at.z, 46, { up: 7, speed: 5 });
    ring(at.x, at.z, 18, '#ffffff', 0.6, 4);
    gfx.shake = 0.55;
    audio.play('unlock');
    this.hooks.haptic(40);
    this.hooks.stat('unlocks', 1);
    popText(at.x, 2.2, at.z, 'NEW!', 'pop-new', 1.4);
    this.rebuildNav();
    if (u.t === 'next' || u.t === 'final') {
      this.hooks.stageClear(u.t === 'final');
      return;
    }
    this.refreshPads(true);
    this.rebuildZones();
    this.hooks.unlocked && this.hooks.unlocked(u);
    this.hooks.save();
  }

  spawnStaff(role, stack, pop) {
    const mesh = makeChar({ body: role === 'runner' ? '#4fb0ff' : '#6ee07a', hat: 'cap', cap: role === 'runner' ? '#2f6fd8' : '#2f9e5a', apron: role === 'runner' ? '#dfefff' : '#e8ffe8', hair: pick(HAIRS) });
    gfx.scene.add(mesh);
    const idle = this.lay.idle[role];
    const s = {
      role,
      x: idle.x + rand(-0.4, 0.4),
      z: idle.z + rand(-0.3, 0.3),
      ry: 0,
      stack: stack.slice(0, 8),
      incoming: 0,
      lean: { x: 0, z: 0, vx: 0, vz: 0 },
      pv: { x: 0, z: 0 },
      zone: null,
      zoneT: 0,
      xferT: 0,
      moving: false,
      walkT: Math.random() * 3,
      mesh,
      path: [],
      goal: null,
      task: null,
      wait: 0,
      think: 0,
    };
    this.staff.push(s);
    return s;
  }

  // ---------------- 메인 업데이트 ----------------
  update(dt) {
    this.time += dt;
    this.run.time += dt;
    this.updateChef(dt);
    for (const s of this.staff) this.updateStaff(s, dt);
    this.updateStations(dt);
    this.updateBelts(dt);
    this.updateCustomers(dt);
    this.updateFlights(dt);
    this.updateRush(dt);
    this.updateAnims(dt);
    this.updateGuide(dt);
  }

  // ---------------- 셰프 ----------------
  updateChef(dt) {
    const c = this.chef;
    const mv = readMove();
    const sp = this.chefSpeed;
    const tx = mv.dx * sp;
    const tz = mv.dy * sp;
    const moving = Math.hypot(tx, tz) > 0.05;
    const oldX = c.x;
    const oldZ = c.z;
    c.x += tx * dt;
    c.z += tz * dt;
    this.nav.collide(c, CFG.chef.radius);
    if (moving) {
      const target = Math.atan2(mv.dx, mv.dy);
      let d = target - c.ry;
      while (d > Math.PI) d -= Math.PI * 2;
      while (d < -Math.PI) d += Math.PI * 2;
      c.ry += d * Math.min(1, dt * 14);
      c.walkT += dt;
      this.stepT -= dt * (sp / 3.4);
      if (this.stepT <= 0) {
        this.stepT = 0.27;
        this.stepAlt = !this.stepAlt;
        audio.play('step', this.stepAlt ? 1 : 0);
        if (Math.random() < 0.35) puff(c.x, 0.05, c.z, '#ffffff', 0.12, 1, 0.4);
      }
    }
    c.moving = moving;
    this.updateLean(c, dt, (c.x - oldX) / Math.max(dt, 1e-4), (c.z - oldZ) / Math.max(dt, 1e-4));
    this.actorZones(c, dt);
  }

  updateLean(a, dt, vx, vz) {
    // 속도 변화(가속)에 반대로 기우는 스프링
    const ax = (vx - a.pv.x) / Math.max(dt, 1e-4);
    const az = (vz - a.pv.z) / Math.max(dt, 1e-4);
    a.pv.x = vx;
    a.pv.z = vz;
    const k = 60;
    const damp = 7;
    const tx = Math.max(-0.5, Math.min(0.5, -ax * 0.012));
    const tz = Math.max(-0.5, Math.min(0.5, -az * 0.012));
    const L = a.lean;
    L.vx += ((tx - L.x) * k - L.vx * damp) * dt;
    L.vz += ((tz - L.z) * k - L.vz * damp) * dt;
    L.x += L.vx * dt;
    L.z += L.vz * dt;
  }

  findZone(a) {
    for (const z of this.zones) {
      if (Math.abs(a.x - z.x) < z.hw && Math.abs(a.z - z.z) < z.hd) {
        if (!a.isChef && (z.type === 'unlock' || z.type === 'upgrade')) continue;
        return z;
      }
    }
    return null;
  }

  actorZones(a, dt) {
    const z = this.findZone(a);
    if (z !== a.zone) {
      if (a.zone && a.isChef && a.zone.type === 'upgrade') this.hooks.closeUpgrade && this.hooks.closeUpgrade();
      a.zone = z;
      a.zoneT = 0;
      a.xferT = 0.05;
      a.upgOpened = false;
    }
    if (!z) return;
    a.zoneT += dt;
    if (z.type === 'unlock') {
      if (a.isChef) this.payPad(z.ref, dt);
      return;
    }
    if (z.type === 'upgrade') {
      if (a.isChef && !a.upgOpened && ((!a.moving && a.zoneT > 0.15) || a.zoneT > 0.8)) {
        a.upgOpened = true;
        this.hooks.openUpgrade();
      }
      return;
    }
    a.xferT -= dt;
    let guard = 0;
    while (a.xferT <= 0 && guard++ < 3) {
      const ok = this.transfer(a, z);
      if (ok) a.xferT += CFG.transfer;
      else {
        a.xferT = 0.05;
        break;
      }
    }
  }

  room(a) {
    const cap = a.isChef ? this.chefCap() : this.staffCap;
    return cap - a.stack.length - a.incoming;
  }

  stackTopPos(a, out = {}) {
    let h = 0;
    for (const it of a.stack) h += (ITEM_H[it.k] || 0.2) * 1.22;
    const fx = Math.sin(a.ry) * 0.42;
    const fz = Math.cos(a.ry) * 0.42;
    out.x = a.x + fx + a.lean.x * h * 0.6;
    out.y = 0.74 + h;
    out.z = a.z + fz + a.lean.z * h * 0.6;
    return out;
  }

  // 한 번의 아이템 이동. 성공 시 true
  transfer(a, z) {
    const r = z.ref;
    switch (z.type) {
      case 'crate': {
        if (r.crateN < 1 || this.room(a) <= 0) return false;
        r.crateN--;
        const it = { k: 'ing', id: r.ing };
        this.fly(it, { x: r.crate.x + rand(-0.2, 0.2), y: 0.6, z: r.crate.z }, () => this.stackTopPos(a), () => this.pushStack(a, it), a);
        return true;
      }
      case 'in': {
        if (r.inp + r.incoming >= CFG.station.inCap) {
          if (a.isChef) this.warn('full_' + r.menu, '조리대 재료가 가득 찼어요', r.x, r.z);
          return false;
        }
        const idx = this.findTop(a.stack, (it) => it.k === 'ing' && it.id === r.ing);
        if (idx < 0) return false;
        const [it] = a.stack.splice(idx, 1);
        r.incoming++;
        const from = this.stackTopPos(a);
        this.fly(it, from, { x: r.x - 0.46, y: 1.0 + r.inp * 0.05, z: r.z }, () => {
          r.incoming--;
          r.inp++;
          audio.play('drop', r.inp);
        });
        if (a.isChef) this.hooks.tut && this.hooks.tut('deposit');
        return true;
      }
      case 'out': {
        if (r.out < 1 || this.room(a) <= 0) return false;
        r.out--;
        const it = { k: 'dish', m: r.menu };
        this.fly(it, { x: r.x + 0.46, y: 1.0 + r.out * 0.2, z: r.z }, () => this.stackTopPos(a), () => this.pushStack(a, it), a);
        return true;
      }
      case 'sink': {
        const idx = this.findTop(a.stack, (it) => it.k === 'dirty');
        if (idx < 0) return false;
        const [it] = a.stack.splice(idx, 1);
        this.fly(it, this.stackTopPos(a), { x: r.x - 0.35, y: 1.0 + Math.min(r.q, 12) * 0.07, z: r.z }, () => {
          r.q++;
          audio.play('clack');
        });
        return true;
      }
      case 'feed': {
        const idx = this.findTop(a.stack, (it) => it.k === 'dish');
        if (idx < 0) return false;
        const b = r;
        const sl = b.slotNear(b.feedS, b.sp * 0.5);
        if (!sl || sl.item || sl.res) {
          if (b.free() === 0 && a.isChef) {
            this.warn('beltfull', '벨트가 꽉 찼어요! 손님이 원하는 메뉴만 올려요', b.feed.x, b.feed.z, 'bad');
          }
          return false;
        }
        const [it] = a.stack.splice(idx, 1);
        sl.res = true;
        const from = this.stackTopPos(a);
        this.fly(
          it,
          from,
          () => {
            const p = b.point(b.slotS(sl));
            return { x: p.x, y: BELT_H + 0.02, z: p.z };
          },
          () => {
            sl.res = false;
            sl.item = { m: it.m, laps: 0, dried: false };
            audio.play('clack');
            if (a.isChef) this.hooks.tut && this.hooks.tut('feed');
          },
          null,
          0.22
        );
        return true;
      }
      case 'trash': {
        const b = r;
        if (this.room(a) <= 0) return false;
        let target = null;
        for (const sl of b.slots) {
          if (sl.item && sl.item.dried && !sl.res && b.dist(b.slotS(sl), b.trashS) < 0.55) {
            target = sl;
            break;
          }
        }
        if (!target) return false;
        const p = b.point(b.slotS(target));
        target.item = null;
        const it = { k: 'dirty' };
        puff(p.x, 1.0, p.z, '#b8a888', 0.2, 3);
        audio.play('dry');
        this.hooks.stat('dried', 1);
        this.fly(it, { x: p.x, y: BELT_H + 0.05, z: p.z }, () => this.stackTopPos(a), () => this.pushStack(a, it), a);
        return true;
      }
      case 'seat': {
        const seat = r;
        if (seat.money > 0 && a.isChef) {
          this.collectMoney(seat, a);
          return true;
        }
        const busy = seat.cust && seat.cust.state !== 'leave';
        if (seat.dirty > 0 && !busy && this.room(a) > 0) {
          seat.dirty--;
          const it = { k: 'dirty' };
          this.fly(it, { x: seat.cx, y: BELT_H + seat.dirty * 0.07, z: seat.cz }, () => this.stackTopPos(a), () => this.pushStack(a, it), a);
          return true;
        }
        return false;
      }
    }
    return false;
  }

  findTop(stack, pred) {
    for (let i = stack.length - 1; i >= 0; i--) if (pred(stack[i])) return i;
    return -1;
  }

  pushStack(a, it) {
    a.stack.push(it);
    if (a.isChef) {
      audio.play('pick', a.stack.length);
      this.hooks.haptic(8);
      if (it.k === 'ing') this.hooks.tut && this.hooks.tut('pick');
      if (it.k === 'dish') this.hooks.tut && this.hooks.tut('dish');

    }
  }

  collectMoney(seat, a) {
    const amt = Math.floor(seat.money);
    seat.money = 0;
    if (amt <= 0) return;
    this.addMoney(amt);
    const n = Math.min(10, 2 + Math.floor(Math.log2(amt + 1)));
    for (let i = 0; i < n; i++) {
      const it = { k: 'coin' };
      this.fly(
        it,
        { x: seat.cx + rand(-0.15, 0.15), y: BELT_H + 0.1, z: seat.cz + rand(-0.15, 0.15) },
        () => ({ x: a.x, y: 1.1, z: a.z }),
        () => {
          audio.play('coin');
        },
        null,
        0.32 + i * 0.045,
        1.4
      );
    }
    popText(seat.cx, 1.6, seat.cz, '+' + fmt(amt), 'pop-money', 1.0);
    this.hooks.haptic(15);
    this.hooks.tut && this.hooks.tut('money');
  }

  addMoney(n) {
    this.run.money += n;
    this.run.earned += n;
    this.hooks.stat('earned', n);
    this.hooks.money && this.hooks.money(n);
  }

  payPad(pad, dt) {
    const c = this.chef;
    if (c.zoneT < 0.2) return;
    const u = pad.u;
    if (this.run.money <= 0) {
      if (pad.paid < u.cost) this.warn('nomoney', '돈이 부족해요. 손님 자리의 돈을 챙겨요', pad.x, pad.z);
      return;
    }
    pad.payT += dt;
    const stepT = 0.035;
    while (pad.payT >= stepT) {
      pad.payT -= stepT;
      const chunk = Math.max(1, Math.ceil(u.cost / (CFG.unlockTime / stepT)));
      const pay = Math.min(chunk, Math.floor(this.run.money), u.cost - pad.paid);
      if (pay <= 0) break;
      this.run.money -= pay;
      pad.paid += pay;
      this.run.paid[u.id] = pad.paid;
      pad.coinT -= stepT;
      if (pad.coinT <= 0) {
        pad.coinT = 0.07;
        audio.play('pay');
        const it = { k: 'coin' };
        this.fly(it, { x: c.x, y: 1.2, z: c.z }, { x: pad.x + rand(-0.3, 0.3), y: 0.05, z: pad.z + rand(-0.3, 0.3) }, null, null, 0.28, 1.2);
      }
      if (pad.paid >= u.cost) {
        this.hooks.money && this.hooks.money(0);
        this.doUnlock(pad);
        return;
      }
    }
    pad.ui.draw(pad.paid / u.cost, true);
    this.hooks.money && this.hooks.money(0);
  }

  warn(key, text, x, z, cls = '') {
    const t = this.warnT[key] || 0;
    if (this.time - t < 4) return;
    this.warnT[key] = this.time;
    this.hooks.toast(text, cls);
    if (cls === 'bad') audio.play('error');
  }

  // ---------------- 비행 아이템 ----------------
  fly(it, from, to, done, actor = null, dur = 0.26, h = 0.9) {
    if (actor) actor.incoming++;
    this.flights.push({ it, from: { ...from }, to, done, actor, t: 0, dur, h, ry: rand(0, 6) });
  }

  updateFlights(dt) {
    for (let i = this.flights.length - 1; i >= 0; i--) {
      const f = this.flights[i];
      f.t += dt;
      if (f.t >= f.dur) {
        this.flights.splice(i, 1);
        if (f.actor) f.actor.incoming--;
        f.done && f.done();
      }
    }
  }

  // ---------------- 조리 ----------------
  updateStations(dt) {
    for (const s of Object.values(this.stations)) {
      if (!s.built) continue;
      // 부두 상자 보충
      if (s.crateN < CFG.crate.max) {
        s.crateT += dt;
        if (s.crateT >= CFG.crate.regen) {
          s.crateT = 0;
          s.crateN++;
        }
      }
      const canCook = s.inp > 0 && s.out < CFG.station.outCap && this.rack.n > 0;
      if (canCook) {
        const boost = this.staff.some((h) => h.role === 'hauler') ? 1.15 : 1;
        s.t += dt * boost;
        if (Math.random() < dt * 4) puff(s.x - 0.3 + rand(-0.2, 0.2), 1.1, s.z, '#ffffff', 0.14, 1, 1.0);
        if (s.t >= this.cookTime) {
          s.t = 0;
          s.inp--;
          this.rack.n--;
          s.out++;
          audio.play('cook');
          this.hooks.discover && this.hooks.discover(s.menu);
          puff(s.x + 0.46, 1.2, s.z, '#fff6d0', 0.18, 3, 1.4);
        }
      } else if (s.inp > 0 && this.rack.n <= 0) {
        s.t = Math.min(s.t, this.cookTime * 0.95);
      }
    }
    // 설거지
    if (this.sink.built && this.sink.q > 0) {
      this.sink.t += dt;
      if (Math.random() < dt * 6) puff(this.sink.x + 0.2, 1.0, this.sink.z, '#bfeaff', 0.15, 1, 0.8);
      if (this.sink.t >= CFG.sink.washTime) {
        this.sink.t = 0;
        this.sink.q--;
        this.rack.n++;
        audio.play('wash');
        this.hooks.stat('washed', 1);
      }
    }
  }

  // ---------------- 벨트 ----------------
  updateBelts(dt) {
    let near = 0;
    for (const b of this.belts) {
      if (!b.built) continue;
      b.update(dt, this.beltSpeed, (sl) => {
        sl.item.laps++;
        if (!sl.item.dried && sl.item.laps >= CFG.belt.dryLaps) {
          sl.item.dried = true;
          const p = b.point(b.slotS(sl));
          puff(p.x, 1.0, p.z, '#a89a70', 0.2, 4, 0.8);
          audio.play('dry');
          this.warn('dried', '접시가 말라버렸어요! 수거함 발판에서 치워요', p.x, p.z);
        }
      });
      const d = Math.hypot(this.chef.x - b.cx, this.chef.z - (b.topZ + b.len / 2));
      near = Math.max(near, Math.max(0, 1 - d / 9));
    }
    animateBeltTex(dt, this.beltSpeed);
    audio.beltLevel(near);
  }

  driedCount(b) {
    let n = 0;
    for (const sl of b.slots) if (sl.item && sl.item.dried) n++;
    return n;
  }

  // ---------------- 손님 ----------------
  stars() {
    const h = this.run.hist;
    const avg = h.reduce((a, b) => a + b, 0) / h.length;
    return Math.max(1, Math.min(5, 1 + avg * 4));
  }
  satisfaction() {
    const h = this.run.hist;
    return h.reduce((a, b) => a + b, 0) / h.length;
  }

  builtMenus() {
    return Object.values(this.stations)
      .filter((s) => s.built)
      .map((s) => s.menu);
  }

  freeSeats() {
    return this.seats.filter((s) => s.unlocked && !s.cust && s.dirty === 0 && !s.reserved);
  }

  spawnInterval() {
    const stars = this.stars();
    const seats = Math.max(2, this.seats.filter((s) => s.unlocked).length);
    // 좌석이 늘수록 손님이 더 자주 옴 (좌석당 평균 회전 주기 기준)
    let iv = (CFG.cust.seatCycle / seats / this.stage.cust) * (1.5 - ((stars - 1) / 4) * 0.8);
    iv = Math.max(1.2, iv);
    if (this.rush && this.rush.t > 0) iv *= 0.45;
    return iv;
  }

  queueSpot(i) {
    const L = this.lay;
    return { x: L.door.x + 1.5, z: L.door.z - 1.0 - i * 0.85 };
  }

  updateCustomers(dt) {
    // 줄 선 손님 먼저 자리 배정
    const queued = this.customers.filter((c) => c.state === 'toQueue' || c.state === 'queue');
    if (queued.length) {
      const free = this.freeSeats();
      if (free.length) {
        const c = queued[0];
        const seat = pick(free);
        c.seat = seat;
        seat.reserved = true;
        c.state = 'enter';
        c.path = this.nav.path(c.x, c.z, seat.stand.x, seat.stand.z);
      }
    }
    this.spawnT -= dt;
    if (this.spawnT <= 0) {
      const free = this.freeSeats();
      const qn = this.customers.filter((c) => c.state === 'toQueue' || c.state === 'queue').length;
      if (free.length && !qn) {
        this.spawnCustomer(pick(free), {});
        this.spawnT = this.spawnInterval() * rand(0.75, 1.25);
      } else if (!free.length && qn < 3 && this.run.cust > 4) {
        this.spawnCustomer(null, {});
        this.spawnT = this.spawnInterval() * rand(1.2, 1.8);
        if (qn === 2) this.warn('queue', '손님이 줄을 섰어요! 좌석을 늘리거나 빨리 치워요', 0, 0);
      } else this.spawnT = 1;
    }
    for (let i = this.customers.length - 1; i >= 0; i--) {
      const c = this.customers[i];
      this.updateCustomer(c, dt);
      if (c.state === 'gone') {
        this.customers.splice(i, 1);
        this.hooks.custGone && this.hooks.custGone(c);
      }
    }
  }

  spawnCustomer(seat, opt) {
    const menus = this.builtMenus();
    if (!menus.length) return null;
    if (seat) seat.reserved = true;
    const L = this.lay;
    let orders;
    if (opt.vip) {
      const pool = menus.slice().sort(() => Math.random() - 0.5);
      orders = [0, 1, 2].map((i) => pool[i % pool.length]);
    } else if (opt.group) {
      orders = Array(opt.n || 2).fill(opt.menu);
    } else {
      const r = Math.random();
      const n = this.run.cust < 2 ? 1 : r < 0.42 ? 1 : r < 0.84 ? 2 : 3;
      // 최근 해금된 메뉴 가중치
      orders = [];
      for (let k = 0; k < n; k++) orders.push(pick(menus));
    }
    const c = {
      id: this.nextCustId++,
      seat,
      x: L.door.x + rand(-0.6, 0.6),
      z: L.door.z + 2.2,
      ry: Math.PI,
      state: 'enter',
      path: [],
      orders,
      oi: 0,
      wait: 0,
      waits: [],
      pat: CFG.cust.patience * (opt.vip ? 1.7 : 1),
      patMax: CFG.cust.patience * (opt.vip ? 1.7 : 1),
      eatT: 0,
      bill: 0,
      vip: !!opt.vip,
      group: !!opt.group,
      shirt: col(opt.vip ? VIP_SHIRT : opt.shirt || pick(SHIRTS)),
      hair: col(pick(HAIRS)),
      skin: col(pick(SKINS_C)),
      pants: col(pick(['#3a3f55', '#5a4a3a', '#2a4a6a', '#4a4a4a'])),
      walkT: Math.random() * 5,
      sitT: 0,
      dish: null,
      emote: null,
      bob: 0,
      scale: opt.vip ? 1.08 : rand(0.92, 1.05),
    };
    if (seat) c.path = [{ x: L.door.x, z: L.door.z - 0.6 }, ...this.nav.path(L.door.x, L.door.z - 0.6, seat.stand.x, seat.stand.z)];
    else {
      c.state = 'toQueue';
      c.qPat = 28;
      const qi = this.customers.filter((o) => o.state === 'toQueue' || o.state === 'queue').length;
      const sp = this.queueSpot(qi);
      c.path = [{ x: L.door.x, z: L.door.z - 0.6 }, sp];
    }
    this.customers.push(c);
    this.run.cust++;
    return c;
  }

  walk(c, dt, speed) {
    if (!c.path.length) return true;
    const t = c.path[0];
    const dx = t.x - c.x;
    const dz = t.z - c.z;
    const d = Math.hypot(dx, dz);
    const step = speed * dt;
    if (d <= step) {
      c.x = t.x;
      c.z = t.z;
      c.path.shift();
    } else {
      c.x += (dx / d) * step;
      c.z += (dz / d) * step;
    }
    if (d > 0.01) {
      const target = Math.atan2(dx, dz);
      let dd = target - c.ry;
      while (dd > Math.PI) dd -= Math.PI * 2;
      while (dd < -Math.PI) dd += Math.PI * 2;
      c.ry += dd * Math.min(1, dt * 12);
    }
    c.walkT += dt;
    return c.path.length === 0;
  }

  updateCustomer(c, dt) {
    const seat = c.seat;
    switch (c.state) {
      case 'toQueue':
      case 'queue': {
        c.qPat -= dt;
        const qi = this.customers.filter((o) => o.state === 'toQueue' || o.state === 'queue').indexOf(c);
        const sp = this.queueSpot(Math.max(0, qi));
        if (c.state === 'queue') c.path = Math.hypot(sp.x - c.x, sp.z - c.z) > 0.05 ? [sp] : [];
        if (this.walk(c, dt, CFG.cust.walk)) {
          c.state = 'queue';
          c.ry = Math.PI;
        }
        if (c.qPat <= 0) {
          const L = this.lay;
          c.state = 'leave';
          c.path = [{ x: L.door.x, z: L.door.z + 2.5 }];
          this.hooks.emote && this.hooks.emote(c, 'angry');
        }
        break;
      }
      case 'enter':
        if (this.walk(c, dt, CFG.cust.walk)) {
          c.state = 'sit';
          c.sitT = 0;
        }
        break;
      case 'sit':
        c.sitT += dt * 3;
        c.x += (seat.x - c.x) * Math.min(1, dt * 10);
        c.z += (seat.z - c.z) * Math.min(1, dt * 10);
        c.ry = seat.ry;
        if (c.sitT >= 1) {
          c.x = seat.x;
          c.z = seat.z;
          seat.cust = c;
          seat.reserved = false;
          c.state = 'wait';
          c.wait = 0;
          this.hooks.order && this.hooks.order(c);
        }
        break;
      case 'wait': {
        c.wait += dt;
        const dried = this.driedCount(seat.belt);
        c.pat -= dt * (1 + dried * 0.25);
        c.sweat = dried > 0;
        // 벨트에서 원하는 접시 집기
        const want = c.orders[c.oi];
        const b = seat.belt;
        for (const sl of b.slots) {
          const it = sl.item;
          if (!it || it.dried || it.m !== want || sl.res) continue;
          if (b.dist(b.slotS(sl), seat.s) < CFG.belt.grab) {
            sl.item = null;
            const p = b.point(b.slotS(sl));
            this.grab(c, want, p);
            break;
          }
        }
        if (c.state === 'wait' && c.pat <= 0) this.leave(c, true);
        break;
      }
      case 'eat':
        c.eatT -= dt;
        c.bob += dt;
        if (c.eatT <= 0) {
          c.dish = null;
          seat.dirty++;
          const price = MENUS[c.orders[c.oi]].price * this.stage.priceMul;
          c.bill += Math.round(price * c.tipMul);
          this.hooks.stat('plates', 1);
          this.hooks.served && this.hooks.served(c.orders[c.oi]);
          c.oi++;
          if (c.oi >= c.orders.length) this.leave(c, false);
          else {
            c.state = 'wait';
            c.wait = 0;
            c.pat = Math.min(c.patMax, c.pat + c.patMax * 0.5);
            this.hooks.order && this.hooks.order(c);
          }
        }
        break;
      case 'leave':
        if (this.walk(c, dt, CFG.cust.walk * 1.1)) c.state = 'gone';
        break;
    }
  }

  grab(c, m, p) {
    c.state = 'fetch';
    const seat = c.seat;
    const waited = c.wait;
    c.waits.push(waited);
    if (waited <= CFG.combo.fast) {
      this.combo++;
    } else if (waited > CFG.combo.slow) {
      this.combo = 0;
    }
    this.run.combo = this.combo;
    this.hooks.stat('maxCombo', this.combo);
    c.tipMul = this.combo >= 2 ? 1 + Math.min(this.combo * CFG.combo.tipPer, CFG.combo.maxMul - 1) : 1;
    this.fly(
      { k: 'dish', m },
      { x: p.x, y: BELT_H + 0.02, z: p.z },
      { x: seat.cx, y: BELT_H, z: seat.cz },
      () => {
        c.state = 'eat';
        c.dish = m;
        c.eatT = CFG.cust.eat;
        audio.play('eat');
      },
      null,
      0.2,
      0.3
    );
    audio.play('happy');
    if (this.combo >= 2) {
      popText(seat.x, 2.3, seat.z, `콤보 ${this.combo}<small>팁 +${Math.round((c.tipMul - 1) * 100)}%</small>`, 'pop-combo', 1.1);
      audio.play('combo', this.combo);
      this.hooks.combo && this.hooks.combo(this.combo, c.tipMul);
    }
    this.hooks.emote && this.hooks.emote(c, waited <= CFG.combo.fast ? 'heart' : 'happy');
  }

  leave(c, angry) {
    const seat = c.seat;
    if (c.state === 'fetch') return;
    c.state = 'leave';
    seat.cust = null;
    seat.reserved = false;
    if (c.dish) {
      seat.dirty++;
      c.dish = null;
    }
    const L = this.lay;
    let score;
    const dried = this.driedCount(seat.belt);
    if (angry) {
      score = c.oi > 0 ? 0.25 : 0;
      this.combo = 0;
      this.run.combo = 0;
      this.hooks.emote && this.hooks.emote(c, 'angry');
      audio.play('angry');
      this.hooks.stat('angry', 1);
      this.hooks.comboBreak && this.hooks.comboBreak();
    } else {
      const avg = c.waits.reduce((a, b) => a + b, 0) / Math.max(1, c.waits.length);
      score = Math.max(0.3, Math.min(1, 1.1 - Math.max(0, avg - 8) / 35 - dried * 0.08));
      if (c.vip) {
        c.bill *= 3;
        popText(seat.x, 2.6, seat.z, 'VIP 보너스 x3!', 'pop-vip', 1.6);
        this.hooks.stat('vip', 1);
        burst(seat.x, 1.4, seat.z, 30, { colors: ['#ffc83d', '#ffffff', '#b58cff'] });
        audio.play('unlock');
      }
      this.hooks.emote && this.hooks.emote(c, score > 0.8 ? 'heart' : 'happy');
    }
    this.run.hist.push(score);
    if (this.run.hist.length > 20) this.run.hist.shift();
    this.hooks.stat('bestStars', this.stars());
    if (c.bill > 0) {
      seat.money += c.bill;
      audio.play('cash');
      popText(seat.cx, 1.5, seat.cz, '+' + fmt(c.bill), 'pop-bill', 1.0);
      this.hooks.stat('customers', 1);
    }
    c.path = [{ x: seat.stand.x, z: seat.stand.z }, ...this.nav.path(seat.stand.x, seat.stand.z, L.door.x, L.door.z - 0.6), { x: L.door.x, z: L.door.z + 2.5 }];
  }

  // ---------------- 러시 타임 ----------------
  updateRush(dt) {
    this.rushT += dt;
    this.run.rushT = this.rushT;
    const next = this.run.nextRush || CFG.rush.first;
    if (this.rush) {
      this.rush.t -= dt;
      if (this.rush.t <= 0) {
        this.rush = null;
        this.hooks.stat('rushes', 1);
        this.hooks.rushEnd && this.hooks.rushEnd();
      }
    }
    if (this.rushT >= next && this.done.size >= 2) {
      const free = this.freeSeats();
      if (free.length < 1) {
        this.run.nextRush = this.rushT + 8;
        return;
      }
      this.rushT = 0;
      this.run.nextRush = rand(CFG.rush.min, CFG.rush.max);
      const menus = this.builtMenus();
      if (free.length >= 3 && (Math.random() < 0.55 || menus.length < 2)) {
        const m = pick(menus);
        const n = Math.min(4, free.length);
        const shirt = pick(SHIRTS);
        free.sort(() => Math.random() - 0.5);
        for (let i = 0; i < n; i++) {
          const c = this.spawnCustomer(free[i], { group: true, menu: m, n: 2, shirt });
          if (c) {
            c.x += i * 0.5;
            c.z += i * 0.6;
          }
        }
        this.rush = { t: 25, type: 'group', menu: m };
        this.hooks.banner('러시 타임!', `단체 손님 ${n}명: ${MENUS[m].name} x${n * 2}`, m);
        audio.play('rush');
      } else {
        this.spawnCustomer(pick(free), { vip: true });
        this.rush = { t: 20, type: 'vip' };
        this.hooks.banner('VIP 손님!', '세트 3종을 순서대로 내면 팁 3배', null);
        audio.play('vip');
      }
      this.hooks.haptic(30);
    }
  }

  // ---------------- 직원 AI ----------------
  demand() {
    // 메뉴별 (대기 중 주문 수 - 벨트 위 신선한 접시 수)
    const d = {};
    for (const c of this.customers) {
      if (c.state === 'wait' || c.state === 'sit' || c.state === 'enter') {
        const m = c.orders[c.oi];
        if (m) d[m] = (d[m] || 0) + 1;
      }
    }
    for (const b of this.belts) for (const sl of b.slots) if (sl.item && !sl.item.dried) d[sl.item.m] = (d[sl.item.m] || 0) - 1;
    return d;
  }

  goTo(s, x, z, task) {
    s.path = this.nav.path(s.x, s.z, x, z);
    s.goal = { x, z };
    s.task = task;
    s.wait = 0;
  }

  updateStaff(s, dt) {
    const sp = this.staffSpeed;
    const ox = s.x;
    const oz = s.z;
    let moving = false;
    if (s.path.length) {
      moving = true;
      const t = s.path[0];
      const dx = t.x - s.x;
      const dz = t.z - s.z;
      const d = Math.hypot(dx, dz);
      const step = sp * dt;
      if (d <= step) {
        s.x = t.x;
        s.z = t.z;
        s.path.shift();
      } else {
        s.x += (dx / d) * step;
        s.z += (dz / d) * step;
      }
      if (d > 0.02) {
        const target = Math.atan2(dx, dz);
        let dd = target - s.ry;
        while (dd > Math.PI) dd -= Math.PI * 2;
        while (dd < -Math.PI) dd += Math.PI * 2;
        s.ry += dd * Math.min(1, dt * 10);
      }
      s.walkT += dt;
    }
    s.moving = moving;
    this.updateLean(s, dt, (s.x - ox) / Math.max(dt, 1e-4), (s.z - oz) / Math.max(dt, 1e-4));
    this.actorZones(s, dt);
    if (moving) return;
    s.wait += dt;
    s.think -= dt;
    if (s.think > 0) return;
    s.think = 0.25;
    if (s.role === 'runner') this.thinkRunner(s);
    else this.thinkHauler(s);
  }

  thinkRunner(s) {
    const L = this.lay;
    const hasDirty = s.stack.some((it) => it.k === 'dirty');
    const hasDish = s.stack.some((it) => it.k === 'dish');
    const task = s.task;
    // 현재 작업 유지 조건
    if (task === 'feed' && hasDish && s.wait < 7) return;
    if (task === 'sink' && hasDirty && s.wait < 3) return;
    if (task === 'trash' && s.wait < 6 && this.room(s) > 0 && this.belts.some((b) => b.built && this.driedCount(b) > 0)) return;
    if (task === 'seat' && s.wait < 0.6) return;
    if (task === 'pick' && s.wait < 1.2 && this.room(s) > 0) return;
    if (hasDirty && this.sink.built && (this.room(s) <= 0 || !this.seats.some((x) => x.dirty > 0 && !x.cust))) {
      this.goTo(s, L.sink.pad.x, L.sink.pad.z, 'sink');
      return;
    }
    if (hasDish) {
      const dishes = s.stack.filter((it) => it.k === 'dish');
      let best = null;
      let bestScore = -1;
      for (const b of this.belts) {
        if (!b.built || b.free() === 0) continue;
        let sc = b.free();
        for (const seat of this.seats) if (seat.belt === b && seat.cust && dishes.some((d) => d.m === seat.cust.orders[seat.cust.oi])) sc += 5;
        if (sc > bestScore) {
          bestScore = sc;
          best = b;
        }
      }
      if (best) {
        this.goTo(s, best.feed.x + rand(-0.12, 0.12), best.feed.z + rand(-0.1, 0.1), 'feed');
        return;
      }
    }
    // 1) 더러운 접시
    if (this.sink.built && this.room(s) > 0) {
      const dirtySeat = this.seats.filter((x) => x.unlocked && x.dirty > 0 && !x.cust).sort((a, b) => Math.hypot(a.zone.x - s.x, a.zone.z - s.z) - Math.hypot(b.zone.x - s.x, b.zone.z - s.z))[0];
      if (dirtySeat && !this.staff.some((o) => o !== s && o.target === dirtySeat)) {
        s.target = dirtySeat;
        this.goTo(s, dirtySeat.zone.x, dirtySeat.zone.z, 'seat');
        return;
      }
    }
    s.target = null;
    // 2) 수요 있는 완성 접시
    const dem = this.demand();
    if (this.room(s) > 0) {
      let st = null;
      let bestD = 0;
      for (const x of Object.values(this.stations)) {
        if (!x.built || x.out < 1) continue;
        const d = dem[x.menu] || 0;
        if (d > bestD) {
          bestD = d;
          st = x;
        }
      }
      const beltFree = this.belts.some((b) => b.built && b.free() > 1);
      if (st && beltFree) {
        this.goTo(s, st.padOut.x, st.padOut.z, 'pick');
        return;
      }
      // 3) 마른 접시 수거
      const db = this.belts.find((b) => b.built && this.driedCount(b) > 0);
      if (db) {
        this.goTo(s, db.trash.x, db.trash.z, 'trash');
        return;
      }
    }
    if (hasDirty && this.sink.built) {
      this.goTo(s, L.sink.pad.x, L.sink.pad.z, 'sink');
      return;
    }
    // 대기
    const idle = L.idle.runner;
    if (Math.hypot(s.x - idle.x, s.z - idle.z) > 1.2) this.goTo(s, idle.x + rand(-0.5, 0.5), idle.z + rand(-0.3, 0.3), 'idle');
  }

  thinkHauler(s) {
    const hasIng = s.stack.filter((it) => it.k === 'ing');
    if (s.task === 'crate' && s.wait < 1.5 && this.room(s) > 0) return;
    if (s.task === 'deliver' && hasIng.length && s.wait < 2) return;
    if (hasIng.length) {
      // 가진 재료가 들어갈 조리대
      const top = hasIng[hasIng.length - 1];
      const st = Object.values(this.stations).find((x) => x.built && x.ing === top.id && x.inp + x.incoming < CFG.station.inCap);
      if (st) {
        this.goTo(s, st.padIn.x, st.padIn.z, 'deliver');
        return;
      }
      if (this.room(s) > 0 && s.task !== 'crate') {
        /* 들어갈 곳이 없으면 다른 재료를 더 챙김 */
      } else return;
    }
    const dem = this.demand();
    let best = null;
    let bestScore = -1e9;
    for (const x of Object.values(this.stations)) {
      if (!x.built || x.crateN < 1) continue;
      const fill = x.inp + x.incoming;
      if (fill >= CFG.station.inCap - 1) continue;
      if (x.out >= CFG.station.outCap && (dem[x.menu] || 0) <= 0) continue;
      const sc = (dem[x.menu] || 0) * 3 - fill - x.out * 0.5;
      if (sc > bestScore) {
        bestScore = sc;
        best = x;
      }
    }
    if (best && !hasIng.length) {
      this.goTo(s, best.crate.pad.x, best.crate.pad.z, 'crate');
      return;
    }
    const idle = this.lay.idle.hauler;
    if (Math.hypot(s.x - idle.x, s.z - idle.z) > 1.2) this.goTo(s, idle.x + rand(-0.5, 0.5), idle.z + rand(-0.3, 0.3), 'idle');
  }

  // ---------------- 팝업 애니메이션 ----------------
  updateAnims(dt) {
    for (let i = this.anims.length - 1; i >= 0; i--) {
      const a = this.anims[i];
      a.t += dt;
      if (a.t < 0) continue;
      const k = Math.min(1, a.t / a.dur);
      const e = ease(k);
      a.obj.scale.set(a.base.x * e, a.base.y * e, a.base.z * e);
      if (k >= 1) {
        a.obj.scale.copy(a.base);
        this.anims.splice(i, 1);
      }
    }
  }

  // ---------------- 가이드 화살표 ----------------
  guideTarget() {
    const t = this.hooks.tutTarget && this.hooks.tutTarget();
    if (t) return t;
    const pad = this.pads[0];
    if (pad && this.run.money >= pad.u.cost * 0.35 - pad.paid) return { x: pad.x, z: pad.z };
    return null;
  }

  updateGuide(dt) {
    const t = this.guideTarget();
    this.guide = t;
    if (!t) {
      this.arrow.visible = false;
      return;
    }
    this.arrow.visible = true;
    this.arrow.position.set(t.x, 2.0 + Math.abs(Math.sin(this.time * 4)) * 0.45 + (t.y || 0), t.z);
    this.arrow.rotation.y += dt * 2.5;
  }

  // ---------------- 렌더 준비 ----------------
  render(dt) {
    const I = this.inst;
    I.begin();
    const tp = {};
    // 벨트 위 접시
    for (const b of this.belts) {
      if (!b.built) continue;
      for (const sl of b.slots) {
        if (!sl.item) continue;
        const s = b.slotS(sl);
        b.point(s, tp);
        const ry = tp.a === 0 ? 0 : tp.a === Math.PI ? Math.PI : -tp.a;
        this.drawDish(sl.item.m, tp.x, BELT_H + 0.02, tp.z, ry + sl.i, 1, sl.item.dried);
      }
    }
    // 비행 아이템
    for (const f of this.flights) {
      const k = Math.min(1, f.t / f.dur);
      const to = typeof f.to === 'function' ? f.to() : f.to;
      const x = f.from.x + (to.x - f.from.x) * k;
      const z = f.from.z + (to.z - f.from.z) * k;
      const y = f.from.y + (to.y - f.from.y) * k + Math.sin(k * Math.PI) * f.h;
      this.drawItem(f.it, x, y, z, f.ry + k * 4, 1);
    }
    // 스택
    this.drawStack(this.chef);
    for (const s of this.staff) this.drawStack(s);
    // 조리대
    for (const s of Object.values(this.stations)) {
      if (!s.built) continue;
      for (let i = 0; i < s.inp; i++) this.drawItem({ k: 'ing', id: s.ing }, s.x - 0.46 + (i % 2) * 0.04, 1.0 + i * 0.12, s.z + (i % 2 ? 0.03 : -0.03), 0.1 * i, 0.9);
      for (let i = 0; i < s.out; i++) this.drawDish(s.menu, s.x + 0.46, 0.98 + i * 0.2, s.z, 0, 1);
      // 부두 상자
      for (let i = 0; i < s.crateN; i++) {
        const col2 = i % 3;
        const row = Math.floor(i / 3);
        this.drawItem({ k: 'ing', id: s.ing }, s.crate.x - 0.33 + col2 * 0.33, 0.52 + row * 0.16, s.crate.z + (row % 2 ? 0.1 : -0.1), row * 0.3, 0.9);
      }
    }
    // 접시 선반
    const rn = Math.min(this.rack.n, 24);
    for (let i = 0; i < rn; i++) {
      const colI = i % 2;
      const h = Math.floor(i / 2);
      I.put('plate', this.rack.x - 0.25 + colI * 0.5, 0.88 + h * 0.07, this.rack.z, 0, 0.9);
    }
    // 설거지대
    if (this.sink.built) for (let i = 0; i < Math.min(this.sink.q, 14); i++) I.put('plate', this.sink.x - 0.45, 0.93 + i * 0.07, this.sink.z + 0.05, i, 0.9, DIRTY);
    // 좌석: 빈 접시 + 돈
    for (const seat of this.seats) {
      if (!seat.unlocked) continue;
      const fz = seat.side === 'R' ? 1 : -1;
      for (let i = 0; i < Math.min(seat.dirty, 8); i++) I.put('plate', seat.cx, BELT_H + i * 0.07, seat.cz - 0.2 * fz, i, 0.85, DIRTY);
      if (seat.money > 0) {
        const unit = 5 * this.stage.priceMul;
        const n = Math.min(10, Math.max(1, Math.ceil(seat.money / (unit * 1.6))));
        for (let i = 0; i < n; i++) I.put('cash', seat.cx + (i % 2) * 0.04 * fz, BELT_H + i * 0.075, seat.cz + 0.22 * fz, (i % 3) * 0.2 + 0.2 * fz, 0.9);
      }
    }
    // 손님
    for (const c of this.customers) this.drawCustomer(c);
    if (!gfx.renderer.shadowMap.enabled) {
      I.put('blob', this.chef.x, 0.02, this.chef.z, 0, 1.1);
      for (const s of this.staff) I.put('blob', s.x, 0.02, s.z, 0, 1.0);
      for (const c of this.customers) I.put('blob', c.x, c.state === 'enter' || c.state === 'leave' ? 0.02 : 0.015, c.z, 0, 0.9);
    }
    updateParticles(dt, I);
    I.end();

    // 셰프 + 직원 메시
    this.placeChar(this.chef, dt);
    for (const s of this.staff) this.placeChar(s, dt);
    // 노렌 흔들림
    const nor = this.env?.userData.noren;
    if (nor) nor.children.forEach((p, i) => (p.rotation.x = Math.sin(this.time * 1.6 + i) * 0.06));
    // 발판 맥동
    for (const pad of this.pads) {
      const on = this.chef.zone && this.chef.zone.ref === pad;
      const k = pad.ui.size * (on ? 1.06 + Math.sin(this.time * 18) * 0.03 : 1 + Math.sin(this.time * 3) * 0.025);
      if (!this.anims.some((a) => a.obj === pad.ui.mesh)) pad.ui.mesh.scale.set(k, 1, k);
      if (!on && pad.ui.lastAfford !== this.run.money > 0) pad.ui.draw(pad.paid / pad.u.cost, this.run.money > 0);
    }
  }

  placeChar(a, dt) {
    const m = a.mesh;
    m.position.set(a.x, 0, a.z);
    m.rotation.y = a.ry;
    animChar(m, a.walkT, a.moving, a.stack.length > 0 || a.incoming > 0, a.isChef ? this.chefSpeed / 3.4 : 0.8);
  }

  drawStack(a) {
    let h = 0;
    const fx = Math.sin(a.ry) * 0.42;
    const fz = Math.cos(a.ry) * 0.42;
    const n = a.stack.length;
    const sway = a.moving ? Math.sin(a.walkT * 11) * 0.02 : 0;
    const S = 1.22;
    for (let i = 0; i < n; i++) {
      const it = a.stack[i];
      const k = Math.pow(h, 1.25) * 0.55;
      const x = a.x + fx + a.lean.x * k + Math.cos(a.ry) * sway * h;
      const z = a.z + fz + a.lean.z * k - Math.sin(a.ry) * sway * h;
      this.drawItem(it, x, 0.74 + h, z, a.ry + Math.sin(i * 1.7) * 0.12, S);
      h += (ITEM_H[it.k] || 0.2) * S;
    }
  }

  drawItem(it, x, y, z, ry, s) {
    const I = this.inst;
    switch (it.k) {
      case 'ing':
        I.put('ing_' + it.id, x, y, z, ry, s);
        break;
      case 'dish':
        this.drawDish(it.m, x, y, z, ry, s, false);
        break;
      case 'dirty':
        I.put('plate', x, y, z, ry, s, DIRTY);
        break;
      case 'coin':
        I.put('coin', x, y, z, ry * 3, s * 1.1, null, 0, 0);
        break;
      case 'cash':
        I.put('cash', x, y, z, ry, s);
        break;
    }
  }

  drawDish(m, x, y, z, ry, s, dried) {
    this.inst.put('plate', x, y, z, ry, s, dried ? DRIED_PLATE : col(MENUS[m].plate));
    this.inst.put('top_' + m, x, y, z, ry, s, dried ? DRIED : null);
  }

  drawCustomer(c) {
    const I = this.inst;
    const sitting = c.state === 'wait' || c.state === 'eat' || c.state === 'fetch' || (c.state === 'sit' && c.sitT > 0.3);
    const walking = (c.state === 'enter' || c.state === 'leave' || c.state === 'toQueue' || c.state === 'queue') && c.path.length > 0;
    const bounce = walking ? Math.abs(Math.sin(c.walkT * 10)) * 0.08 : 0;
    const y = sitting ? 0.42 : bounce;
    const sc = c.scale;
    _e.set(0, c.ry, walking ? Math.sin(c.walkT * 10) * 0.06 : 0);
    _q.setFromEuler(_e);
    _m.compose(_v.set(c.x, y, c.z), _q, _s.set(sc, sc, sc));
    // 몸통
    I.putMatrix('c_body', _m, c.shirt);
    // 다리 (앉으면 앞으로)
    if (sitting) I.putMatrix('c_legs', _m3.copy(_m).multiply(SIT_LEGS), c.pants);
    else I.putMatrix('c_legs', _m, c.pants);
    // 머리
    let hb = 0;
    let tilt = 0;
    if (c.state === 'eat') {
      hb = Math.abs(Math.sin(c.bob * 9)) * 0.05;
      tilt = 0.25;
    } else if (c.state === 'wait' && c.pat < c.patMax * 0.3) {
      tilt = Math.sin(this.time * 20) * 0.08;
    }
    _e.set(tilt, 0, c.state === 'wait' && c.pat < c.patMax * 0.3 ? Math.sin(this.time * 20) * 0.1 : 0);
    _q.setFromEuler(_e);
    _m2.compose(_v.set(0, 0.87 + hb, 0), _q, _s.set(1, 1, 1));
    const hm = _m4.copy(_m).multiply(_m2);
    I.putMatrix('c_head', hm, c.skin);
    I.putMatrix('c_hair', hm, c.hair);
    I.putMatrix('c_face', hm, null);
    if (c.vip) {
      _m2.makeTranslation(0, 0.22, 0);
      I.putMatrix('c_crown', _m3.copy(hm).multiply(_m2), null);
    }
    // 먹는 접시
    if (c.dish) {
      this.drawDish(c.dish, c.seat.cx, BELT_H, c.seat.cz, 0, 1 - Math.max(0, 1 - c.eatT / CFG.cust.eat) * 0.35, false);
    }
  }

  // ---------------- 저장 ----------------
  serialize() {
    const run = this.run;
    run.st = {};
    run.cr = {};
    for (const s of Object.values(this.stations)) {
      if (!s.built) continue;
      run.st[s.menu] = { i: s.inp + s.incoming, o: s.out };
      run.cr[s.menu] = s.crateN;
    }
    run.sinkQ = this.sink.q;
    run.belts = {};
    for (const b of this.belts) {
      run.belts[b.id] = b.slots.map((sl) => (sl.item ? { m: sl.item.m, l: sl.item.laps, d: sl.item.dried ? 1 : 0 } : null));
    }
    run.stack = this.chef.stack.slice();
    run.staff = this.staff.map((s) => ({ role: s.role, stack: s.stack.slice() }));
    run.seats = {};
    for (const s of this.seats) {
      let d = s.dirty;
      if (s.cust && s.cust.dish) d++;
      run.seats[s.id] = { d, m: s.money };
    }
    run.combo = this.combo;
  }

  // 오프라인 수익 속도 (초당)
  idleRate() {
    const runners = this.staff.filter((s) => s.role === 'runner').length;
    const haulers = this.staff.filter((s) => s.role === 'hauler').length;
    if (!runners) return 0;
    const seats = this.seats.filter((s) => s.unlocked).length;
    const menus = this.builtMenus();
    const avg = menus.reduce((a, m) => a + MENUS[m].price, 0) / Math.max(1, menus.length);
    const staffF = Math.min(1, runners * 0.45 + haulers * 0.35);
    return seats * avg * this.stage.priceMul * 0.05 * staffF * (this.stars() / 5) * this.stage.cust * CFG.offline.share;
  }

  // 디버그: 모든 해금 완료 (다음 식당 발판 직전까지)
  debugUnlockAll() {
    let guard = 0;
    while (guard++ < 40) {
      const pad = this.pads[0];
      if (!pad || pad.u.t === 'next' || pad.u.t === 'final') break;
      this.doUnlock(pad);
    }
  }
}
