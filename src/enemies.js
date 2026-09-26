import * as THREE from 'three';
import { CFG, ENEMY_DEFS } from './config.js';
import { ENEMY_MODELS, MISC } from './models.js';
import { patchFlash, patchHoleClip } from './holeclip.js';
import { BlobShadows, makeFaller, stepFaller, blobTexture } from './world.js';

const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _v = new THREE.Vector3();
const _s = new THREE.Vector3();
const _up = new THREE.Vector3(0, 1, 0);
const HIDE = new THREE.Matrix4().makeScale(0, 0, 0);
const TYPES = Object.keys(ENEMY_DEFS);

export class Enemies {
  constructor(scene, game) {
    this.scene = scene;
    this.game = game;
    this.meshes = {};
    this.flash = {};
    this.free = {};
    const mat = patchFlash(new THREE.MeshLambertMaterial({ vertexColors: true }));
    let total = 0;
    for (const t of TYPES) {
      const cap = ENEMY_DEFS[t].cap;
      total += cap;
      const geo = ENEMY_MODELS[t]();
      const fa = new THREE.InstancedBufferAttribute(new Float32Array(cap), 1);
      fa.setUsage(THREE.DynamicDrawUsage);
      geo.setAttribute('aFlash', fa);
      const mesh = new THREE.InstancedMesh(geo, mat, cap);
      mesh.frustumCulled = false;
      mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      for (let i = 0; i < cap; i++) {
        mesh.setMatrixAt(i, HIDE);
        mesh.setColorAt(i, new THREE.Color(1, 1, 1));
      }
      scene.add(mesh);
      this.meshes[t] = mesh;
      this.flash[t] = fa;
      this.free[t] = [];
    }
    this.shadowSlots = total;
    this.shadows = new BlobShadows(scene, total, blobTexture());
    this._tint = new THREE.Color();

    // 적 투사체 (쓰레기 봉투)
    this.projCap = 80;
    this.projMesh = new THREE.InstancedMesh(MISC.trashBag(), new THREE.MeshLambertMaterial({ vertexColors: true }), this.projCap);
    this.projMesh.frustumCulled = false;
    this.projMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(this.projMesh);
    // 경고 원
    const rg = new THREE.RingGeometry(0.82, 1, 32);
    rg.rotateX(-Math.PI / 2);
    const rm = patchHoleClip(new THREE.MeshBasicMaterial({ color: 0xff3355, transparent: true, opacity: 0.75, depthWrite: false }));
    this.markCap = 100;
    this.markMesh = new THREE.InstancedMesh(rg, rm, this.markCap);
    this.markMesh.frustumCulled = false;
    this.markMesh.renderOrder = 2;
    this.markMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(this.markMesh);
    const fg = new THREE.CircleGeometry(1, 32);
    fg.rotateX(-Math.PI / 2);
    this.fillMesh = new THREE.InstancedMesh(
      fg,
      patchHoleClip(new THREE.MeshBasicMaterial({ color: 0xff3355, transparent: true, opacity: 0.22, depthWrite: false })),
      this.markCap
    );
    this.fillMesh.frustumCulled = false;
    this.fillMesh.renderOrder = 2;
    this.fillMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(this.fillMesh);
    this.reset();
  }

  reset() {
    this.list = [];
    this.fallers = [];
    this.projs = [];
    this.marks = [];
    this.spawnAcc = 0;
    this.swarmT = CFG.spawn.swarmEvery;
    for (const t of TYPES) {
      const cap = ENEMY_DEFS[t].cap;
      this.free[t] = [];
      for (let i = cap - 1; i >= 0; i--) this.free[t].push(i);
      const mesh = this.meshes[t];
      for (let i = 0; i < cap; i++) mesh.setMatrixAt(i, HIDE);
      mesh.instanceMatrix.needsUpdate = true;
    }
    for (let i = 0; i < this.shadowSlots; i++) this.shadows.hide(i);
    this.shadows.flush();
    this.boss = null;
    this.mini = null;
  }

  shadowIndex(e) {
    let base = 0;
    for (const t of TYPES) {
      if (t === e.type) return base + e.slot;
      base += ENEMY_DEFS[t].cap;
    }
    return 0;
  }

  aliveCount() {
    return this.list.length;
  }

  spawn(type, x, z, sizeMul = 1, hpMul = 1) {
    const def = ENEMY_DEFS[type];
    if (!this.free[type].length) return null;
    const slot = this.free[type].pop();
    const size = def.size * sizeMul;
    const e = {
      type,
      def,
      slot,
      x,
      z,
      vx: 0,
      vz: 0,
      kx: 0,
      kz: 0,
      rot: Math.atan2(-x, -z),
      baseSize: size,
      size,
      hp: def.hp * hpMul,
      maxHp: def.hp * hpMul,
      flash: 0,
      state: 'move',
      timer: 0,
      atk: 1 + Math.random() * 2,
      sawCd: 0,
      hitCd: 0,
      speedMul: (0.9 + Math.random() * 0.2) * (0.85 + 0.15 * sizeMul),
      dmgMul: 1 + (sizeMul - 1) * 0.35,
      shadowI: 0,
      bob: Math.random() * 10,
      spawnT: 0,
    };
    e.shadowI = this.shadowIndex(e);
    const mesh = this.meshes[type];
    this._tint.set((this.game.mods && this.game.mods.tint) || '#ffffff');
    mesh.setColorAt(slot, this._tint);
    mesh.instanceColor.needsUpdate = true;
    this.list.push(e);
    if (type === 'boss') this.boss = e;
    if (type === 'mini') this.mini = e;
    return e;
  }

  // 화면 밖 스폰 위치
  spawnPos(hole, dist) {
    const H = CFG.map.half + 4;
    for (let tries = 0; tries < 8; tries++) {
      const a = Math.random() * Math.PI * 2;
      const x = hole.x + Math.cos(a) * dist;
      const z = hole.z + Math.sin(a) * dist;
      if (Math.abs(x) < H && Math.abs(z) < H) return [x, z];
    }
    const a = Math.random() * Math.PI * 2;
    return [Math.max(-H, Math.min(H, hole.x + Math.cos(a) * dist)), Math.max(-H, Math.min(H, hole.z + Math.sin(a) * dist))];
  }

  updateSpawns(dt, t, hole) {
    const g = this.game;
    const S = CFG.spawn;
    const p = Math.min(1.3, t / CFG.run.length);
    const M = g.mods || {};
    const sizeMul = (1 + p * S.sizeGrow) * (M.sizeE || 1);
    const hpMul = (1 + p * S.hpGrow) * (M.hpE || 1);
    const W = M.weights || { dasher: 1, thrower: 1, giant: 1 };
    const dist = g.camDist * 0.95 + 8;
    if (this.boss) {
      // 보스전 중에는 졸개만 소량
      this.spawnAcc += dt * 0.8;
    } else {
      this.spawnAcc += dt * (S.baseRate + p * S.rateGrow) * (M.rateE || 1);
    }
    while (this.spawnAcc >= 1) {
      this.spawnAcc -= 1;
      if (this.list.length >= S.maxAlive) break;
      const r = Math.random();
      const pd = t > 35 ? (0.16 + p * 0.1) * W.dasher : 0;
      const pt = t > 70 ? (0.16 + p * 0.05) * W.thrower : 0;
      const pg = t > 105 ? (0.06 + p * 0.06) * W.giant : 0;
      let type = 'sweeper';
      if (r < pd) type = 'dasher';
      else if (r < pd + pt) type = 'thrower';
      else if (r < pd + pt + pg) type = 'giant';
      const [x, z] = this.spawnPos(hole, dist);
      this.spawn(type, x, z, sizeMul * (0.85 + Math.random() * 0.3), hpMul);
    }
    this.swarmT -= dt;
    if (this.swarmT <= 0) {
      this.swarmT = S.swarmEvery;
      const a = Math.random() * Math.PI * 2;
      const n = 10 + Math.floor(p * 18);
      for (let i = 0; i < n; i++) {
        const aa = a + (Math.random() - 0.5) * 0.9;
        const dd = dist + Math.random() * 8;
        const x = Math.max(-100, Math.min(100, hole.x + Math.cos(aa) * dd));
        const z = Math.max(-100, Math.min(100, hole.z + Math.sin(aa) * dd));
        this.spawn('sweeper', x, z, sizeMul * (0.7 + Math.random() * 0.3), hpMul * 0.8);
      }
      g.ui.toast('청소 로봇 무리가 몰려온다!');
    }
  }

  // 피해
  damage(e, amount, kx = 0, kz = 0, silent = false) {
    if (e.dead) return;
    const g = this.game;
    amount *= g.powerMul || 1;
    e.hp -= amount;
    e.flash = 1;
    e.kx += kx;
    e.kz += kz;
    g.stats.damage += amount;
    if (!silent) g.fx.dmgNumber(e.x, e.size * 1.6 + 0.6, e.z, amount, e.type === 'boss' || e.type === 'mini');
    if (e.type === 'boss' && e.hp < 1) e.hp = 1;
    if (e.hp <= 0) this.kill(e);
  }

  kill(e) {
    e.dead = true;
    const g = this.game;
    this.removeFromList(e);
    this.meshes[e.type].setMatrixAt(e.slot, HIDE);
    this.free[e.type].push(e.slot);
    this.shadows.hide(e.shadowI);
    g.fx.burst(e.x, 0.8, e.z, Math.min(40, 8 + e.size * 6), e.size, ['#ffffff', '#ffd84d', '#9fd8ff', '#ff9fb3']);
    g.fx.ring(e.x, e.z, e.size * 1.8, '#ffe8a0', 0.35);
    g.onKill(e, false);
    if (e === this.mini) this.mini = null;
  }

  swallow(e, hole) {
    e.dead = true;
    const g = this.game;
    this.removeFromList(e);
    this.shadows.hide(e.shadowI);
    const mesh = this.meshes[e.type];
    const fa = this.flash[e.type];
    const f = makeFaller(mesh, e.slot, e.x - hole.x, e.z - hole.z, e.rot, e.size, e.size, hole.r, () => {
      this.free[e.type].push(e.slot);
      fa.array[e.slot] = 0;
    });
    f.enemyType = e.type;
    this.fallers.push(f);
    g.onKill(e, true);
    if (e === this.boss) this.boss = null;
    if (e === this.mini) this.mini = null;
  }

  removeFromList(e) {
    const i = this.list.indexOf(e);
    if (i >= 0) this.list.splice(i, 1);
  }

  nearest(x, z, maxD = 1e9, exclude) {
    let best = null;
    let bd = maxD * maxD;
    for (const e of this.list) {
      if (exclude && exclude.has(e)) continue;
      const d = (e.x - x) ** 2 + (e.z - z) ** 2;
      if (d < bd) {
        bd = d;
        best = e;
      }
    }
    return best;
  }

  throwTrash(e, hole, speedMul = 1) {
    if (this.projs.length >= this.projCap) return;
    const flight = 1.35 / speedMul;
    const tx = hole.x + hole.vx * flight * 0.55 + (Math.random() - 0.5) * 2;
    const tz = hole.z + hole.vz * flight * 0.55 + (Math.random() - 0.5) * 2;
    const rad = 1.1 + e.size * 0.25;
    this.projs.push({ sx: e.x, sz: e.z, sy: e.size * 1.8, tx, tz, t: 0, T: flight, dmg: e.def.dmg * e.dmgMul, rad, s: 0.5 + e.size * 0.35 });
    this.marks.push({ x: tx, z: tz, r: rad, t: 0, T: flight, kind: 'trash' });
  }

  slam(boss, hole) {
    const rad = 3 + boss.size * 0.45;
    const tx = hole.x + hole.vx * 0.5;
    const tz = hole.z + hole.vz * 0.5;
    this.marks.push({ x: tx, z: tz, r: rad, t: 0, T: 1.3, kind: 'slam', dmg: boss.def.dmg * 1.2 });
  }

  update(dt, hole, t) {
    const g = this.game;
    const fitR = hole.r * CFG.hole.fit;
    const list = this.list;
    // 분리 (간단한 쌍 검사)
    for (let i = 0; i < list.length; i++) {
      const a = list[i];
      for (let j = i + 1; j < list.length; j++) {
        const b = list[j];
        const dx = b.x - a.x;
        const dz = b.z - a.z;
        const min = (a.size + b.size) * 0.85;
        const d2 = dx * dx + dz * dz;
        if (d2 < min * min && d2 > 1e-6) {
          const d = Math.sqrt(d2);
          const push = ((min - d) / d) * 0.5;
          const wa = b.size / (a.size + b.size);
          const wb = 1 - wa;
          a.x -= dx * push * wa;
          a.z -= dz * push * wa;
          b.x += dx * push * wb;
          b.z += dz * push * wb;
        }
      }
    }

    for (let n = list.length - 1; n >= 0; n--) {
      const e = list[n];
      if (!e) continue;
      const def = e.def;
      e.spawnT += dt;
      const shrink = e.type === 'boss' ? 0.22 + 0.78 * (e.hp / e.maxHp) : 0.55 + 0.45 * Math.max(0, e.hp / e.maxHp);
      const target = e.baseSize * shrink;
      e.size += (target - e.size) * Math.min(1, dt * 6);
      const dx = hole.x - e.x;
      const dz = hole.z - e.z;
      const d = Math.hypot(dx, dz) || 0.001;
      const nx = dx / d;
      const nz = dz / d;
      const small = e.size < fitR;
      let spd = def.speed * e.speedMul * g.enemySlow;
      let mx = 0;
      let mz = 0;
      e.atk -= dt;
      e.flash = Math.max(0, e.flash - dt * 6);

      if (e.type === 'dasher' || e.type === 'mini') {
        if (e.state === 'move') {
          mx = nx;
          mz = nz;
          if (small && e.type === 'dasher') {
            mx = -nx;
            mz = -nz;
            spd *= 0.8;
          }
          if (d < 12 + e.size * 3 && e.atk <= 0 && !small) {
            e.state = 'wind';
            e.timer = 0.65;
            e.dashDir = [nx, nz];
          }
        } else if (e.state === 'wind') {
          e.flash = Math.max(e.flash, 0.5 + 0.5 * Math.sin(e.timer * 40));
          spd = 0;
          e.timer -= dt;
          if (e.timer <= 0) {
            e.state = 'dash';
            e.timer = 0.75;
            g.audio.whoosh(0.6);
          }
        } else if (e.state === 'dash') {
          mx = e.dashDir[0];
          mz = e.dashDir[1];
          spd = def.dashSpeed * (0.8 + 0.2 * e.speedMul) * (e.type === 'mini' ? 1 : 1);
          e.timer -= dt;
          if (Math.random() < 0.5) g.fx.puff(e.x, e.z, e.size);
          if (e.timer <= 0) {
            e.state = 'move';
            e.atk = e.type === 'mini' ? 3 : 2.5 + Math.random() * 2;
          }
        }
      } else if (e.type === 'thrower') {
        const range = def.range + e.size * 3;
        if (small && d < range * 0.7) {
          mx = -nx;
          mz = -nz;
          spd *= 0.8;
        } else if (d > range) {
          mx = nx;
          mz = nz;
        } else if (d < range * 0.6) {
          mx = -nx * 0.6;
          mz = -nz * 0.6;
        } else {
          mx = -nz * 0.4;
          mz = nx * 0.4;
        }
        if (d < range * 1.15 && e.atk <= 0) {
          e.atk = 2.4 + Math.random() * 1.2;
          this.throwTrash(e, hole);
          e.flash = 0.6;
        }
      } else if (e.type === 'boss') {
        mx = nx;
        mz = nz;
        if (e.atk <= 0) {
          e.atk = 3.2;
          this.slam(e, hole);
          if (Math.random() < 0.5) {
            for (let k = 0; k < 3; k++) {
              const a = Math.random() * Math.PI * 2;
              this.spawn('sweeper', e.x + Math.cos(a) * e.size, e.z + Math.sin(a) * e.size, 1 + Math.min(1.3, t / 300) * 1.4, 1.5);
            }
          }
          if (Math.random() < 0.6) this.throwTrash(e, hole, 0.9);
        }
      } else {
        // sweeper, giant
        mx = nx;
        mz = nz;
        if (small && e.type === 'sweeper') {
          mx = -nx;
          mz = -nz;
          spd *= 0.75;
        }
      }
      // 흔들리는 접근 (군집 느낌)
      const wob = Math.sin(t * 2 + e.bob) * 0.25;
      const vx = (mx - mz * wob) * spd;
      const vz = (mz + mx * wob) * spd;
      e.vx += (vx - e.vx) * Math.min(1, dt * 5);
      e.vz += (vz - e.vz) * Math.min(1, dt * 5);
      e.x += (e.vx + e.kx) * dt;
      e.z += (e.vz + e.kz) * dt;
      const kd = Math.exp(-dt * 5);
      e.kx *= kd;
      e.kz *= kd;
      const H = CFG.map.half + 6;
      e.x = Math.max(-H, Math.min(H, e.x));
      e.z = Math.max(-H, Math.min(H, e.z));
      if (Math.abs(e.vx) + Math.abs(e.vz) > 0.05) {
        const want = Math.atan2(e.vx, e.vz);
        let diff = want - e.rot;
        diff = Math.atan2(Math.sin(diff), Math.cos(diff));
        e.rot += diff * Math.min(1, dt * 8);
      }

      // 홀과의 상호작용
      const dd = Math.hypot(e.x - hole.x, e.z - hole.z);
      if (e.size < fitR) {
        if (dd < hole.r * 0.98 - e.size * 0.25) {
          this.swallow(e, hole);
          continue;
        }
      } else {
        // 큰 적: 홀 안으로 못 들어옴 + 접촉 피해
        const minD = hole.r + e.size * 0.55;
        if (dd < minD) {
          const px = (e.x - hole.x) / (dd || 1);
          const pz = (e.z - hole.z) / (dd || 1);
          e.x = hole.x + px * minD;
          e.z = hole.z + pz * minD;
        }
        if (dd < hole.r + e.size * 0.85) {
          if (g.hurt(def.dmg * e.dmgMul, e)) {
            const px = (e.x - hole.x) / (dd || 1);
            const pz = (e.z - hole.z) / (dd || 1);
            const kb = e.type === 'boss' ? 4 : 14;
            e.kx += px * kb;
            e.kz += pz * kb;
            if (e.state === 'dash') e.timer = 0;
          }
          g.skills.onRimContact(e, dt);
        }
      }
    }

    // 투사체
    let pi = 0;
    for (let n = this.projs.length - 1; n >= 0; n--) {
      const p = this.projs[n];
      p.t += dt;
      const k = Math.min(1, p.t / p.T);
      if (k >= 1) {
        this.projs.splice(n, 1);
        const dd = Math.hypot(p.tx - hole.x, p.tz - hole.z);
        g.fx.burst(p.tx, 0.3, p.tz, 10, 0.6, ['#6b7b6e', '#a8b8a0', '#ffffff']);
        if (dd < hole.r + p.rad * 0.7) g.hurt(p.dmg, null);
        continue;
      }
    }
    for (const p of this.projs) {
      const k = Math.min(1, p.t / p.T);
      const x = p.sx + (p.tx - p.sx) * k;
      const z = p.sz + (p.tz - p.sz) * k;
      const y = p.sy * (1 - k) + Math.sin(k * Math.PI) * (6 + p.s * 2);
      _q.setFromAxisAngle(_up, p.t * 6);
      _m.compose(_v.set(x, y, z), _q, _s.set(p.s, p.s, p.s));
      this.projMesh.setMatrixAt(pi++, _m);
    }
    this.projMesh.count = pi;
    this.projMesh.instanceMatrix.needsUpdate = true;

    // 경고 원
    let mi = 0;
    for (let n = this.marks.length - 1; n >= 0; n--) {
      const m = this.marks[n];
      m.t += dt;
      if (m.t >= m.T) {
        this.marks.splice(n, 1);
        if (m.kind === 'slam') {
          g.fx.ring(m.x, m.z, m.r, '#ff6680', 0.5);
          g.fx.burst(m.x, 0.3, m.z, 24, 1.5, ['#ffffff', '#ff8fa3', '#ffd84d']);
          g.shake(0.6);
          g.audio.boom(0.7);
          if (Math.hypot(m.x - hole.x, m.z - hole.z) < m.r + hole.r * 0.5) g.hurt(m.dmg, null);
        }
      }
    }
    for (const m of this.marks) {
      const k = m.t / m.T;
      _m.makeScale(m.r, 1, m.r);
      _m.setPosition(m.x, 0.05, m.z);
      this.markMesh.setMatrixAt(mi, _m);
      _m.makeScale(m.r * k, 1, m.r * k);
      _m.setPosition(m.x, 0.04, m.z);
      this.fillMesh.setMatrixAt(mi, _m);
      mi++;
    }
    this.markMesh.count = mi;
    this.fillMesh.count = mi;
    this.markMesh.instanceMatrix.needsUpdate = true;
    this.fillMesh.instanceMatrix.needsUpdate = true;

    // 행렬 갱신 (사용 중인 최대 슬롯까지만 그림)
    const maxSlot = this._maxSlot || (this._maxSlot = {});
    for (const t2 of TYPES) maxSlot[t2] = -1;
    for (const f of this.fallers) {
      const tt = f.enemyType;
      if (tt && f.slot > maxSlot[tt]) maxSlot[tt] = f.slot;
    }
    for (const e of list) if (e.slot > maxSlot[e.type]) maxSlot[e.type] = e.slot;
    for (const e of list) {
      const mesh = this.meshes[e.type];
      const pop = Math.min(1, e.spawnT * 4);
      const s = e.size * (0.6 + 0.4 * pop);
      const bob = e.type === 'sweeper' ? Math.abs(Math.sin(t * 10 + e.bob)) * 0.05 * e.size : 0;
      _q.setFromAxisAngle(_up, e.rot);
      // 큰 적은 키를 눌러서 카메라를 가리지 않게
      const sy = (s / (1 + Math.max(0, s - 2) * 0.09)) * (1 + (e.state === 'wind' ? 0.1 * Math.sin(e.timer * 50) : 0));
      _m.compose(_v.set(e.x, bob, e.z), _q, _s.set(s, sy, s));
      mesh.setMatrixAt(e.slot, _m);
      this.flash[e.type].array[e.slot] = e.flash;
      this.shadows.set(e.shadowI, e.x, e.z, e.size * 0.9);
    }
    for (let n = this.fallers.length - 1; n >= 0; n--) {
      if (stepFaller(this.fallers[n], dt, hole, g.world.wellDepth)) this.fallers.splice(n, 1);
    }
    for (const t2 of TYPES) {
      this.meshes[t2].count = maxSlot[t2] + 1;
      this.meshes[t2].instanceMatrix.needsUpdate = true;
      this.flash[t2].needsUpdate = true;
    }
    this.shadows.flush();
  }
}
