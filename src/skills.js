import * as THREE from 'three';
import { CFG, SKILLS, EVOLUTIONS, SKILL_MAX } from './config.js';
import { MISC } from './models.js';

const _m = new THREE.Matrix4();
const _q = new THREE.Quaternion();
const _v = new THREE.Vector3();
const _s = new THREE.Vector3();
const _e = new THREE.Euler();
const MAX_OWNED = 6;

export class Skills {
  constructor(scene, game) {
    this.game = game;
    this.orbMesh = new THREE.InstancedMesh(MISC.shard(), new THREE.MeshLambertMaterial({ vertexColors: true, emissive: 0x3a2a70 }), 12);
    this.orbMesh.frustumCulled = false;
    this.orbMesh.count = 0;
    this.orbMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(this.orbMesh);
    this.bulletMesh = new THREE.InstancedMesh(MISC.bullet(), new THREE.MeshBasicMaterial({ color: 0xffffff }), 60);
    this.bulletMesh.frustumCulled = false;
    this.bulletMesh.count = 0;
    this.bulletMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.bulletMesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(60 * 3), 3);
    scene.add(this.bulletMesh);
    this.reset();
  }

  reset() {
    this.lv = {};
    this.evo = {};
    this.order = [];
    this.timers = { cannon: 1, pulse: 3, bolt: 1.5, dash: 4, nova: 10 };
    this.orbAngle = 0;
    this.bullets = [];
    this.orbMesh.count = 0;
    this.bulletMesh.count = 0;
  }

  level(id) {
    return this.lv[id] || 0;
  }
  ownedCount() {
    return Object.keys(this.lv).length;
  }

  horizonMul() {
    return 1 + this.level('horizon') * 0.22 + (this.evo.accretion ? 0.2 : 0);
  }
  growthMul() {
    return 1 + this.level('glutton') * 0.18;
  }
  xpMul() {
    return 1 + this.level('glutton') * 0.05 + this.level('greed') * 0.12;
  }
  coinMul() {
    return 1 + this.level('greed') * 0.1;
  }
  speedMul() {
    return 1 + this.level('haste') * 0.1;
  }

  // 레벨업 카드 후보
  choices(n = 3) {
    const pool = [];
    for (const [id, ev] of Object.entries(EVOLUTIONS)) {
      if (this.evo[id]) continue;
      const ok = Object.entries(ev.need).every(([k, v]) => this.level(k) >= v);
      if (ok) pool.push({ kind: 'evo', id, w: 6 });
    }
    const full = this.ownedCount() >= MAX_OWNED;
    for (const id of Object.keys(SKILLS)) {
      const l = this.level(id);
      if (l >= SKILL_MAX) continue;
      if (l === 0 && full) continue;
      pool.push({ kind: 'skill', id, lvl: l + 1, w: l > 0 ? 1.6 : 1 });
    }
    const out = [];
    while (out.length < n && pool.length) {
      const tot = pool.reduce((a, b) => a + b.w, 0);
      let r = Math.random() * tot;
      let k = 0;
      for (; k < pool.length - 1; k++) {
        r -= pool[k].w;
        if (r <= 0) break;
      }
      out.push(pool.splice(k, 1)[0]);
    }
    if (out.length < n) out.push({ kind: 'heal', id: 'heal' });
    if (out.length < n) out.push({ kind: 'coin', id: 'coin' });
    return out;
  }

  apply(c) {
    const g = this.game;
    if (c.kind === 'skill') {
      if (!this.lv[c.id]) this.order.push(c.id);
      this.lv[c.id] = (this.lv[c.id] || 0) + 1;
      if (c.id === 'regen') {
        g.hole.maxHp += 10;
        g.hole.hp += 10;
      }
    } else if (c.kind === 'evo') {
      this.evo[c.id] = true;
    } else if (c.kind === 'heal') {
      g.hole.hp = Math.min(g.hole.maxHp, g.hole.hp + g.hole.maxHp * 0.35);
    } else if (c.kind === 'coin') {
      g.bonusCoins += 25;
    }
  }

  onRimContact(e, dt) {
    const l = this.level('saw');
    if (!l || e.dead) return;
    e.sawCd = (e.sawCd || 0) - dt;
    if (e.sawCd <= 0) {
      e.sawCd = 0.4;
      const g = this.game;
      g.enemies.damage(e, 10 + l * 7);
      const a = Math.atan2(e.z - g.hole.z, e.x - g.hole.x);
      g.fx.burst(g.hole.x + Math.cos(a) * g.hole.r, 0.3, g.hole.z + Math.sin(a) * g.hole.r, 6, 0.5, ['#ff6b6b', '#ffd84d']);
    }
  }

  update(dt, hole) {
    const g = this.game;
    const en = g.enemies;
    const fx = g.fx;
    const pull = [];
    const r = hole.r;
    const fitR = r * CFG.hole.fit;

    for (const e of en.list) if (e.orbCd > 0) e.orbCd -= dt;

    // 재생
    const rl = this.level('regen');
    if (rl) hole.hp = Math.min(hole.maxHp, hole.hp + rl * 0.7 * dt);

    // 파편 위성 / 강착 원반
    const ol = this.level('orbit');
    if (ol) {
      const acc = !!this.evo.accretion;
      const cnt = acc ? 10 : ol + 1;
      const rad = acc ? r * 1.5 + 3.2 : r + 1.4 + ol * 0.25;
      const spd = acc ? 2.2 : 2.6;
      const dmg = (8 + ol * 4) * (acc ? 2.5 : 1);
      const ss = (acc ? 0.55 : 0.4) + r * 0.07;
      this.orbAngle += dt * spd;
      this.orbMesh.count = cnt;
      for (let k = 0; k < cnt; k++) {
        const a = this.orbAngle + (k / cnt) * Math.PI * 2;
        const x = hole.x + Math.cos(a) * rad;
        const z = hole.z + Math.sin(a) * rad;
        const y = 0.9 + Math.sin(a * 2 + k) * 0.25 + r * 0.1;
        _e.set(a * 2, a * 3, k);
        _q.setFromEuler(_e);
        _m.compose(_v.set(x, y, z), _q, _s.set(ss, ss, ss));
        this.orbMesh.setMatrixAt(k, _m);
        for (const e of en.list) {
          if (e.orbCd > 0) continue;
          const dd = Math.hypot(e.x - x, e.z - z);
          if (dd < e.size * 0.9 + ss + 0.3) {
            e.orbCd = 0.35;
            const kx = (e.x - hole.x) / (Math.hypot(e.x - hole.x, e.z - hole.z) || 1);
            const kz = (e.z - hole.z) / (Math.hypot(e.x - hole.x, e.z - hole.z) || 1);
            en.damage(e, dmg, kx * 3, kz * 3);
            fx.burst(x, y, z, 4, 0.4, ['#c6b8ff', '#ffffff']);
          }
        }
      }
      if (acc) {
        for (const e of en.list) {
          if (e.size < fitR) {
            const dx = hole.x - e.x;
            const dz = hole.z - e.z;
            const d = Math.hypot(dx, dz) || 1;
            if (d < rad + 3) {
              e.kx += (dx / d) * 14 * dt;
              e.kz += (dz / d) * 14 * dt;
            }
          }
        }
      }
      this.orbMesh.instanceMatrix.needsUpdate = true;
    } else this.orbMesh.count = 0;

    // 역류 캐논 / 특이점 포
    const cl = this.level('cannon');
    if (cl) {
      this.timers.cannon -= dt;
      if (this.timers.cannon <= 0) {
        this.timers.cannon = Math.max(0.55, 1.6 - cl * 0.13);
        const shots = Math.min(3, 1 + Math.floor(cl / 2)) + (this.evo.singularity ? 1 : 0);
        const used = new Set();
        for (let s = 0; s < shots; s++) {
          const t = en.nearest(hole.x, hole.z, 20 + r * 3, used);
          if (!t) break;
          used.add(t);
          const dx = t.x - hole.x;
          const dz = t.z - hole.z;
          const d = Math.hypot(dx, dz) || 1;
          this.bullets.push({ x: hole.x, y: 0.6, z: hole.z, vx: (dx / d) * 24, vy: 9, vz: (dz / d) * 24, t: 0, target: t, sing: !!this.evo.singularity });
        }
        if (used.size) g.audio.shoot();
      }
    }
    let bi = 0;
    for (let n = this.bullets.length - 1; n >= 0; n--) {
      const b = this.bullets[n];
      b.t += dt;
      const tg = b.target;
      if (tg && !tg.dead) {
        const dx = tg.x - b.x;
        const dz = tg.z - b.z;
        const d = Math.hypot(dx, dz) || 1;
        const sp = 26;
        b.vx += ((dx / d) * sp - b.vx) * Math.min(1, dt * 7);
        b.vz += ((dz / d) * sp - b.vz) * Math.min(1, dt * 7);
      }
      b.vy -= 18 * dt;
      b.x += b.vx * dt;
      b.y = Math.max(0.6, b.y + b.vy * dt);
      b.z += b.vz * dt;
      let hit = null;
      for (const e of en.list) {
        if (Math.hypot(e.x - b.x, e.z - b.z) < e.size * 0.9 + 0.5) {
          hit = e;
          break;
        }
      }
      if (hit || b.t > 1.6) {
        this.bullets.splice(n, 1);
        const dmg = 10 + cl * 6;
        if (hit) {
          en.damage(hit, dmg * (b.sing ? 1.3 : 1), b.vx * 0.1, b.vz * 0.1);
          fx.burst(b.x, b.y, b.z, 8, 0.5, ['#ffb36b', '#ffffff']);
        }
        if (b.sing) {
          const R = 3 + r * 0.6;
          fx.ring(b.x, b.z, R, '#b07bff', 0.4);
          fx.burst(b.x, 0.5, b.z, 14, 0.8, ['#7a5cff', '#1a0f2e', '#d3b8ff']);
          for (const e of [...en.list]) {
            const dx = b.x - e.x;
            const dz = b.z - e.z;
            const d = Math.hypot(dx, dz);
            if (d < R + e.size * 0.5) {
              e.kx += (dx / (d || 1)) * 8;
              e.kz += (dz / (d || 1)) * 8;
              if (e !== hit) en.damage(e, dmg * 0.7, 0, 0, false);
            }
          }
        }
      }
    }
    for (const b of this.bullets) {
      const s = b.sing ? 0.6 + r * 0.05 : 0.35 + r * 0.04;
      _m.makeScale(s, s, s);
      _m.setPosition(b.x, b.y, b.z);
      this.bulletMesh.setMatrixAt(bi, _m);
      this.bulletMesh.instanceColor.setXYZ(bi, b.sing ? 0.55 : 1, b.sing ? 0.35 : 0.72, b.sing ? 1 : 0.42);
      bi++;
    }
    this.bulletMesh.count = bi;
    this.bulletMesh.instanceMatrix.needsUpdate = true;
    this.bulletMesh.instanceColor.needsUpdate = true;

    // 중력 펄스
    const pl = this.level('pulse');
    if (pl) {
      this.timers.pulse -= dt;
      if (this.timers.pulse <= 0) {
        this.timers.pulse = 5.4 - pl * 0.5;
        const R = r * 2 + 5 + pl * 1.2;
        fx.ring(hole.x, hole.z, R, '#c79bff', 0.6);
        fx.ring(hole.x, hole.z, R * 0.6, '#8a6bff', 0.45);
        g.audio.pulse();
        for (const e of [...en.list]) {
          const dx = e.x - hole.x;
          const dz = e.z - hole.z;
          const d = Math.hypot(dx, dz) || 1;
          if (d < R + e.size * 0.5) {
            if (e.size < fitR) {
              e.kx -= (dx / d) * 16;
              e.kz -= (dz / d) * 16;
            } else {
              const kb = e.type === 'boss' ? 2 : 16 / Math.max(1, e.size * 0.5);
              en.damage(e, 6 + pl * 4, (dx / d) * kb, (dz / d) * kb);
            }
          }
        }
        g.world.query(hole.x, hole.z, R, pull);
        for (let k = pull.length - 1; k >= 0; k--) {
          const i = pull[k];
          if (Math.hypot(g.world.pX[i] - hole.x, g.world.pZ[i] - hole.z) > R) pull.splice(k, 1);
        }
      }
    }

    // 블랙 번개
    const bl = this.level('bolt');
    if (bl) {
      this.timers.bolt -= dt;
      if (this.timers.bolt <= 0) {
        this.timers.bolt = Math.max(0.9, 2.4 - bl * 0.22);
        let cur = en.nearest(hole.x, hole.z, 12 + r * 2);
        if (cur) {
          const pts = [[hole.x, 1 + r * 0.3, hole.z]];
          const hitSet = new Set();
          const chains = 2 + bl;
          for (let c = 0; c < chains && cur; c++) {
            hitSet.add(cur);
            pts.push([cur.x, cur.size * 1.2 + 0.4, cur.z]);
            en.damage(cur, 10 + bl * 5);
            fx.burst(cur.x, cur.size, cur.z, 5, 0.4, ['#c8f4ff', '#ffffff']);
            cur = en.nearest(cur.x, cur.z, 9 + r, hitSet);
          }
          fx.lightning(pts);
          g.audio.zap();
        }
      }
    }

    // 웜홀 대시
    const dl = this.level('dash');
    if (dl) {
      this.timers.dash -= dt;
      const sp = Math.hypot(hole.vx, hole.vz);
      if (this.timers.dash <= 0 && sp > 1.5) {
        this.timers.dash = 6.5 - dl * 0.6;
        const dist = 6 + dl * 1.5 + r * 1.2;
        const nx = hole.vx / sp;
        const nz = hole.vz / sp;
        const ox = hole.x;
        const oz = hole.z;
        g.moveHoleTo(hole.x + nx * dist, hole.z + nz * dist);
        hole.invuln = Math.max(hole.invuln, 0.5);
        for (let k = 0; k < 16; k++) {
          const t = k / 15;
          fx.emit(ox + (hole.x - ox) * t, 0.4, oz + (hole.z - oz) * t, 0, 2, 0, k % 2 ? '#ff9bf2' : '#8a6bff', 0.6 + r * 0.1, 0.5, 0);
        }
        fx.ring(hole.x, hole.z, r * 1.8 + 2, '#ff9bf2', 0.4);
        g.audio.whoosh(1);
        const R = r * 1.6 + 2;
        for (const e of [...en.list]) {
          const d = Math.hypot(e.x - hole.x, e.z - hole.z);
          if (d < R + e.size * 0.5) en.damage(e, 20 + dl * 8, ((e.x - hole.x) / (d || 1)) * 8, ((e.z - hole.z) / (d || 1)) * 8);
        }
      }
    }

    // 초신성
    const nl = this.level('nova');
    if (nl) {
      this.timers.nova -= dt;
      if (this.timers.nova <= 0) {
        this.timers.nova = 20 - nl * 2;
        const R = 10 + nl * 2 + r * 2;
        fx.ring(hole.x, hole.z, R, '#ffe066', 0.7);
        fx.ring(hole.x, hole.z, R * 0.7, '#ff8f5a', 0.55);
        fx.burst(hole.x, 1, hole.z, 50, 2.5, ['#ffe066', '#ff8f5a', '#ffffff', '#ff5d8f']);
        g.flashScreen('#fff6d0');
        g.shake(1.2);
        g.hitStop(0.08);
        g.audio.boom(1.2);
        for (const e of [...en.list]) {
          const dx = e.x - hole.x;
          const dz = e.z - hole.z;
          const d = Math.hypot(dx, dz) || 1;
          if (d < R + e.size * 0.5) en.damage(e, 40 + nl * 35, (dx / d) * 18, (dz / d) * 18);
        }
      }
    }

    return pull;
  }
}
