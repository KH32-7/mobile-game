// 실시간 대전 시뮬레이션 (렌더링과 분리)
import { ARENA, BATTLE, TOWERS, CARDS, LEVEL_MULT, SIZE_MULT, BOSS, CARD_LEVEL_BONUS } from './config.js';

const { W, H, RIVER_Y, BRIDGES, BRIDGE_HALF } = ARENA;
let nextId = 1;

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const edgeDist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y) - a.r - b.r;

export function shuffle(arr, rng = Math.random) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export class Battle {
  /**
   * o: { playerDeck, enemyDeck, relics, params, kingHpFrac, debug, rng, hooks }
   */
  constructor(o) {
    this.o = o;
    this.rng = o.rng || Math.random;
    this.hooks = o.hooks || {};
    this.relics = new Set(o.relics || []);
    this.params = o.params;
    this.debug = !!o.debug;
    this.time = 0;
    this.clock = BATTLE.DURATION;
    this.phase = 'normal';
    this.ended = false;
    this.result = null;
    this.ents = [];
    this.projs = [];
    this.spells = [];
    this.fx = { parts: [], texts: [], rings: [], bolts: [], debris: [], marks: [] };
    this.stats = { merges: [0, 0], played: [0, 0], spells: [0, 0], star3: [0, 0] };
    this.cardLevels = o.cardLevels || {};
    this.bossT = BOSS.summonEvery * 0.6;
    this.thornT = 0;

    const mkTeam = (deck) => {
      const d = shuffle(deck, this.rng);
      return {
        elixir: BATTLE.ELIXIR_START,
        hand: d.slice(0, BATTLE.HAND_SIZE),
        queue: d.slice(BATTLE.HAND_SIZE),
        crowns: 0,
        firstSpawnDone: false,
      };
    };
    this.teams = [mkTeam(o.playerDeck), mkTeam(o.enemyDeck)];
    if (this.relics.has('elixirStart')) this.teams[0].elixir += 2;

    this.towers = [];
    this.makeTowers(0);
    this.makeTowers(1);

    if (this.relics.has('guardKnight')) this.spawnCard(0, 'knight', 9, 26.6, 1, true);
  }

  makeTowers(team) {
    const p = this.params;
    const fy = (y) => (team === 0 ? y : H - y);
    const mk = (type, pos, lane) => {
      const cfg = TOWERS[type];
      let maxHp = cfg.hp;
      let dmg = cfg.dmg;
      if (team === 1) {
        maxHp *= p.towerMult * (type === 'king' ? p.kingMult : 1);
        dmg *= p.towerMult;
        if (this.debug) maxHp *= 0.1;
      } else {
        if (type === 'king' && this.relics.has('kingHp')) maxHp *= 1.2;
        if (this.relics.has('towerDmg')) dmg *= 1.25;
      }
      let hp = maxHp;
      if (team === 0 && type === 'king') hp = Math.max(1, Math.round(maxHp * clamp(this.o.kingHpFrac ?? 1, 0.01, 1)));
      const t = {
        id: nextId++, team, kind: 'tower', towerType: type, lane, card: null,
        x: pos.x, y: fy(pos.y), z: 0, r: cfg.r * (team === 1 && type === 'king' && p.boss ? 1.18 : 1),
        maxHp, hp, dmg, hitSpeed: cfg.hitSpeed * (team === 1 && p.boss && type === 'king' ? 0.8 : 1),
        range: cfg.range, targets: 'all', proj: cfg.proj, projSpeed: cfg.projSpeed,
        splash: team === 1 && p.boss && type === 'king' ? 1.4 : 0,
        cd: 0, target: null, retarget: 0, alive: true, flash: 0, air: false, level: 1,
        active: type !== 'king' || (team === 1 && p.boss), deployT: 0, slowT: 0, stunT: 0,
        aim: team === 0 ? -Math.PI / 2 : Math.PI / 2, recoil: 0,
      };
      this.towers.push(t);
      this.ents.push(t);
      return t;
    };
    mk('king', TOWERS.pos.king, -1);
    mk('princess', TOWERS.pos.princess[0], 0);
    mk('princess', TOWERS.pos.princess[1], 1);
  }

  towerOf(team, type, lane) {
    return this.towers.find((t) => t.team === team && t.towerType === type && (lane === undefined || t.lane === lane));
  }

  // 플레이어 영구 카드 레벨 배율
  lvlMult(id) {
    const l = this.cardLevels[id] || 1;
    return 1 + CARD_LEVEL_BONUS * (l - 1);
  }

  // ---------- 비용/배치 ----------
  costOf(team, id, merge) {
    const c = CARDS[id];
    let cost = c.cost;
    if (team === 0) {
      if (c.kind === 'spell' && this.relics.has('spellDiscount')) cost = Math.max(1, cost - 1);
      if (merge && this.relics.has('mergeDiscount')) cost = Math.max(1, cost - 1);
    }
    return cost;
  }

  pocketOpen(team, x) {
    const lane = x < W / 2 ? 0 : 1;
    const t = this.towerOf(1 - team, 'princess', lane);
    return t && !t.alive;
  }

  // 드롭 좌표를 유효 배치 좌표로 스냅
  snap(team, id, x, y) {
    const c = CARDS[id];
    if (c.kind === 'spell') return { x: clamp(x, 0.5, W - 0.5), y: clamp(y, 0.5, H - 0.5) };
    x = clamp(x, 0.6, W - 0.6);
    const pocket = c.kind !== 'building' && this.pocketOpen(team, x);
    if (team === 0) {
      const minY = pocket ? 10.8 : 17.4;
      y = clamp(y, minY, H - 0.6);
      if (pocket && y > 14.6 && y < 17.4) y = y < 16 ? 14.6 : 17.4;
    } else {
      const maxY = pocket ? H - 10.8 : 14.6;
      y = clamp(y, 0.6, maxY);
      if (pocket && y > 14.6 && y < 17.4) y = y < 16 ? 14.6 : 17.4;
    }
    // 살아있는 타워와 겹치지 않게
    for (const t of this.towers) {
      if (!t.alive) continue;
      const d = Math.hypot(x - t.x, y - t.y);
      const need = t.r + (c.r || 0.4) + 0.05;
      if (d < need) {
        const a = d < 0.01 ? (team === 0 ? -Math.PI / 2 : Math.PI / 2) : Math.atan2(y - t.y, x - t.x);
        x = clamp(t.x + Math.cos(a) * need, 0.6, W - 0.6);
        y = t.y + Math.sin(a) * need;
      }
    }
    return { x, y };
  }

  inZone(team, id, x, y) {
    const s = this.snap(team, id, x, y);
    return Math.hypot(s.x - x, s.y - y) < 0.05;
  }

  findMerge(team, id, x, y) {
    const c = CARDS[id];
    if (!c || c.kind === 'spell') return null;
    let best = null;
    let bd = Infinity;
    for (const e of this.ents) {
      if (!e.alive || e.team !== team || e.card !== id || e.kind === 'tower') continue;
      if (e.level >= BATTLE.MAX_LEVEL) continue;
      const d = Math.hypot(e.x - x, e.y - y);
      if (d < e.r + BATTLE.MERGE_PICK_RADIUS && d < bd) {
        bd = d;
        best = e;
      }
    }
    return best;
  }

  canAfford(team, handIdx) {
    const T = this.teams[team];
    return T.elixir >= this.costOf(team, T.hand[handIdx], false);
  }

  playCard(team, handIdx, x, y) {
    if (this.ended) return null;
    const T = this.teams[team];
    const id = T.hand[handIdx];
    if (!id) return null;
    const c = CARDS[id];
    const merge = this.findMerge(team, id, x, y);
    const cost = this.costOf(team, id, !!merge);
    if (T.elixir < cost) return null;
    T.elixir -= cost;
    let res;
    if (merge) {
      this.mergeGroup(merge);
      res = { type: 'merge', x: merge.x, y: merge.y, level: merge.level };
    } else if (c.kind === 'spell') {
      const p = this.snap(team, id, x, y);
      this.castSpell(team, id, p.x, p.y);
      res = { type: 'spell', x: p.x, y: p.y };
      this.stats.spells[team]++;
    } else {
      const p = this.snap(team, id, x, y);
      let lvl = 1;
      if (team === 0 && !T.firstSpawnDone && this.relics.has('firstStar')) lvl = 2;
      this.spawnCard(team, id, p.x, p.y, lvl);
      T.firstSpawnDone = true;
      res = { type: 'spawn', x: p.x, y: p.y };
      this.hooks.sfx?.('place');
    }
    this.stats.played[team]++;
    T.queue.push(id);
    T.hand[handIdx] = T.queue.shift();
    return res;
  }

  // ---------- 생성 ----------
  makeUnit(team, id, x, y, level, groupId) {
    const c = CARDS[id];
    const m = team === 1 ? this.params.statMult : this.lvlMult(id);
    const lm = LEVEL_MULT[level - 1];
    let speed = c.speed || 0;
    if (team === 0 && this.relics.has('warDrum')) speed *= 1.12;
    const e = {
      id: nextId++, team, card: id, kind: c.kind === 'building' ? 'building' : 'troop',
      x, y, z: 0, baseR: c.r, r: c.r * SIZE_MULT[level - 1], level, groupId,
      maxHp: c.hp * m * lm, hp: c.hp * m * lm, dmg: c.dmg * m * lm,
      hitSpeed: c.hitSpeed, range: c.range, speed, air: !!c.air, targets: c.targets,
      splash: c.splash || 0, proj: c.proj || null, projSpeed: c.projSpeed || 12, mass: c.mass || 2,
      cd: 0, target: null, retarget: 0, deployT: BATTLE.DEPLOY_TIME, flash: 0, slowT: 0, stunT: 0,
      walk: this.rng() * 10, moving: false, face: team === 0 ? -Math.PI / 2 : Math.PI / 2,
      mergeFlash: 0, alive: true, inRange: false, moveDist: 0, charging: false,
      blinkCd: 1.5, bonusHit: false, healT: 0.5, lifeMax: c.lifetime || 0, atkAnim: 0,
    };
    return e;
  }

  spawnCard(team, id, x, y, level = 1, instant = false) {
    const c = CARDS[id];
    const n = c.count || 1;
    const gid = nextId++;
    const out = [];
    for (let i = 0; i < n; i++) {
      let ox = 0;
      let oy = 0;
      if (n > 1) {
        const rr = (n > 5 ? 0.42 : 0.5) * Math.sqrt(i + 0.5);
        const a = i * 2.39996 + (team === 0 ? -Math.PI / 2 : Math.PI / 2);
        ox = Math.cos(a) * rr;
        oy = Math.sin(a) * rr * 0.9;
      }
      const e = this.makeUnit(team, id, clamp(x + ox, 0.4, W - 0.4), clamp(y + oy, 0.4, H - 0.4), level, gid);
      if (instant) e.deployT = 0.2;
      this.ents.push(e);
      out.push(e);
    }
    // 소환 연출
    this.ring(x, y, 0.2, 1.6, 0.4, team === 0 ? '#9fd0ff' : '#ffb0a0', 3);
    for (let i = 0; i < 10; i++) this.part(x, y, 0.2, '#ffffff', 1.5, 0.5);
    return out;
  }

  mergeGroup(e) {
    const newLvl = Math.min(BATTLE.MAX_LEVEL, e.level + 1);
    const group = this.ents.filter((u) => u.alive && u.team === e.team && u.groupId === e.groupId && u.card === e.card);
    for (const u of group) this.setLevel(u, Math.max(u.level, newLvl));
    this.stats.merges[e.team]++;
    if (newLvl === 3) this.stats.star3[e.team]++;
    // 연출
    this.ring(e.x, e.y, 0.3, 2.8, 0.55, '#fff3a0', 5);
    this.ring(e.x, e.y, 0.1, 1.8, 0.4, '#ffffff', 3);
    for (let i = 0; i < 26; i++) this.part(e.x, e.y, 0.4, i % 2 ? '#ffe36b' : '#ffffff', 4, 0.8);
    this.text(e.x, e.y, 1.8, '★'.repeat(newLvl), '#ffe36b', 1.1, 1.4);
    this.hooks.sfx?.('merge');
    this.hooks.vib?.(25);
    if (e.team === 0 && this.relics.has('mergeHeal')) {
      for (const u of this.ents) {
        if (!u.alive || u.team !== 0 || u.kind === 'tower') continue;
        if (Math.hypot(u.x - e.x, u.y - e.y) < 3) {
          u.hp = Math.min(u.maxHp, u.hp + u.maxHp * 0.3);
          this.part(u.x, u.y, 0.5, '#7dff9a', 1.5, 0.6);
        }
      }
      this.ring(e.x, e.y, 0.3, 3, 0.6, '#7dff9a', 3);
    }
  }

  setLevel(u, lvl) {
    if (lvl <= u.level) return;
    const ratio = LEVEL_MULT[lvl - 1] / LEVEL_MULT[u.level - 1];
    u.maxHp *= ratio;
    u.hp = Math.min(u.maxHp, u.hp * ratio + u.maxHp * 0.25);
    u.dmg *= ratio;
    u.level = lvl;
    u.r = u.baseR * SIZE_MULT[lvl - 1];
    u.mergeFlash = 1;
    if (u.kind === 'building') u.hp = u.maxHp;
  }

  // ---------- 주문 ----------
  castSpell(team, id, x, y) {
    const c = CARDS[id];
    const king = this.towerOf(team, 'king');
    const sx = king.x;
    const sy = king.y + (team === 0 ? -1.5 : 1.5);
    const d = Math.hypot(x - sx, y - sy);
    let delay = 0.25;
    if (id === 'fireball') delay = d / 14;
    if (id === 'arrows') delay = 0.35 + d / 30;
    if (id === 'lightning') delay = 0.2;
    if (id === 'freeze') delay = 0.15;
    this.spells.push({ id, team, x, y, sx, sy, t: 0, delay, dmgMult: team === 1 ? this.params.statMult : this.lvlMult(id) });
    this.hooks.sfx?.(id === 'fireball' ? 'whoosh' : id === 'arrows' ? 'arrows' : 'cast');
    this.fx.marks.push({ x, y, r: c.radius, life: delay + 0.2, max: delay + 0.2, color: team === 0 ? '#9fd0ff' : '#ff9a8a' });
  }

  landSpell(s) {
    const c = CARDS[s.id];
    const enemies = this.ents.filter((e) => e.alive && e.team !== s.team && Math.hypot(e.x - s.x, e.y - s.y) < c.radius + e.r * 0.6);
    const dmgOf = (e) => c.dmg * s.dmgMult * (e.kind === 'tower' ? c.towerPct : 1);
    if (s.id === 'fireball' || s.id === 'arrows') {
      for (const e of enemies) {
        this.damage(e, dmgOf(e), null);
        if (s.id === 'fireball' && e.kind === 'troop' && e.mass < 10) {
          const a = Math.atan2(e.y - s.y, e.x - s.x);
          e.x += Math.cos(a) * c.knock;
          e.y += Math.sin(a) * c.knock;
        }
      }
      if (s.id === 'fireball') {
        this.explosion(s.x, s.y, c.radius, '#ff9a3a');
        this.hooks.shake?.(7);
        this.hooks.sfx?.('boom');
      } else {
        this.ring(s.x, s.y, 0.5, c.radius, 0.35, '#e8f0c0', 3);
        for (let i = 0; i < 18; i++) {
          const a = this.rng() * Math.PI * 2;
          const r = Math.sqrt(this.rng()) * c.radius;
          this.part(s.x + Math.cos(a) * r, s.y + Math.sin(a) * r, 0.2, '#d8c89a', 1, 0.4);
        }
        this.hooks.sfx?.('hitArrow');
      }
    } else if (s.id === 'lightning') {
      const sorted = enemies.sort((a, b) => b.hp - a.hp).slice(0, c.hits);
      for (const e of sorted) {
        this.damage(e, dmgOf(e), null);
        if (e.kind !== 'tower') {
          e.stunT = Math.max(e.stunT, c.stun);
          e.cd = Math.max(e.cd, e.hitSpeed * 0.5);
          e.charging = false;
          e.moveDist = 0;
        }
        this.fx.bolts.push({ x: e.x, y: e.y, life: 0.35, max: 0.35, seed: this.rng() * 1000 });
        this.ring(e.x, e.y, 0.2, 1.4, 0.3, '#fff6a0', 3);
      }
      if (!sorted.length) this.fx.bolts.push({ x: s.x, y: s.y, life: 0.35, max: 0.35, seed: this.rng() * 1000 });
      this.hooks.shake?.(6);
      this.hooks.sfx?.('zap');
    } else if (s.id === 'freeze') {
      for (const e of enemies) {
        this.damage(e, dmgOf(e), null);
        if (e.kind !== 'tower') e.slowT = Math.max(e.slowT, c.slowTime);
      }
      this.ring(s.x, s.y, 0.3, c.radius, 0.5, '#d8f4ff', 5);
      for (let i = 0; i < 24; i++) {
        const a = this.rng() * Math.PI * 2;
        const r = Math.sqrt(this.rng()) * c.radius;
        this.part(s.x + Math.cos(a) * r, s.y + Math.sin(a) * r, 0.3, '#e8f8ff', 1.5, 0.8);
      }
      this.fx.marks.push({ x: s.x, y: s.y, r: c.radius, life: 1.2, max: 1.2, color: '#bfe8ff', fill: true });
      this.hooks.sfx?.('freeze');
    }
  }

  // ---------- 전투 ----------
  canHit(a, t) {
    if (!t.alive || t.team === a.team) return false;
    if (a.targets === 'buildings') return t.kind !== 'troop';
    if (a.targets === 'ground') return !t.air;
    if (a.targets === 'none') return false;
    return true;
  }

  findTarget(e) {
    let best = null;
    let bd = Infinity;
    const isTroop = e.kind === 'troop';
    const sight = isTroop ? (e.targets === 'buildings' ? Infinity : BATTLE.SIGHT) : e.range;
    for (const t of this.ents) {
      if (!this.canHit(e, t)) continue;
      const d = edgeDist(e, t);
      if (d > sight) continue;
      // 배치 중인 유닛은 살짝 덜 우선
      const score = d + (t.deployT > 0 ? 0.5 : 0);
      if (score < bd) {
        bd = score;
        best = t;
      }
    }
    if (!best && isTroop) {
      // 가장 가까운 적 건물로 행군
      for (const t of this.ents) {
        if (!t.alive || t.team === e.team || t.kind === 'troop') continue;
        if (e.targets === 'ground' && t.air) continue;
        const d = edgeDist(e, t) + (t.kind === 'tower' && t.towerType === 'king' ? 1.5 : 0);
        if (d < bd) {
          bd = d;
          best = t;
        }
      }
    }
    return best;
  }

  damage(t, amt, src) {
    if (!t.alive || amt <= 0) return;
    t.hp -= amt;
    t.flash = 0.12;
    if (this.fx.texts.length < 45) {
      this.text(t.x + (this.rng() - 0.5) * 0.5, t.y, (t.kind === 'tower' ? 2.4 : 1.1) + t.r, Math.round(amt), t.team === 0 ? '#ffd0c8' : '#ffffff', 0.7, t.kind === 'tower' ? 1 : 0.85);
    }
    if (t.kind === 'tower' && t.towerType === 'king' && !t.active) this.activateKing(t);
    if (t.hp <= 0) this.kill(t, src);
  }

  activateKing(k) {
    if (k.active || !k.alive) return;
    k.active = true;
    this.text(k.x, k.y, 3.2, '킹 타워 기동!', '#ffe36b', 1.2, 1);
  }

  kill(t, src) {
    if (!t.alive) return;
    t.alive = false;
    t.hp = 0;
    if (t.kind === 'tower') {
      const other = this.teams[1 - t.team];
      if (t.towerType === 'king') {
        other.crowns = 3;
      } else {
        other.crowns = Math.min(3, other.crowns + 1);
        const k = this.towerOf(t.team, 'king');
        if (k) this.activateKing(k);
      }
      this.hooks.crown?.(1 - t.team, t.x, t.y);
      this.hooks.shake?.(t.towerType === 'king' ? 18 : 12);
      this.hooks.sfx?.('collapse');
      this.hooks.vib?.([40, 30, 60]);
      this.hooks.hitstop?.(0.12);
      for (let i = 0; i < 34; i++) {
        const a = this.rng() * Math.PI * 2;
        const sp = 2 + this.rng() * 5;
        this.fx.debris.push({
          x: t.x, y: t.y, z: 1 + this.rng() * 2, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp * 0.8,
          vz: 4 + this.rng() * 6, rot: this.rng() * 6, vr: (this.rng() - 0.5) * 12, s: 0.18 + this.rng() * 0.3,
          life: 1.6 + this.rng(), color: i % 3 ? '#b9ad98' : t.team === 0 ? '#5a8fe0' : '#e05a5a',
        });
      }
      this.explosion(t.x, t.y, 2.4, '#e8d8b8');
      if (t.towerType === 'king') this.finish(1 - t.team, 'king');
      return;
    }
    // 유닛 사망
    for (let i = 0; i < 8; i++) this.part(t.x, t.y, 0.3, '#ffffff', 2, 0.4);
    this.ring(t.x, t.y, 0.1, t.r + 0.5, 0.25, '#ffffff', 2);
    const c = CARDS[t.card];
    if (c.deathDmg) {
      for (const e of this.ents) {
        if (!e.alive || e.team === t.team || e.air) continue;
        if (Math.hypot(e.x - t.x, e.y - t.y) < c.deathRadius + e.r) this.damage(e, c.deathDmg * LEVEL_MULT[t.level - 1], t);
      }
      this.explosion(t.x, t.y, c.deathRadius, '#c8b89a');
      this.hooks.sfx?.('boom');
      this.hooks.shake?.(4);
    }
    if (c.deathSpawn) {
      const n = c.deathSpawn.count;
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const u = this.makeUnit(t.team, c.deathSpawn.card, clamp(t.x + Math.cos(a) * 0.7, 0.5, W - 0.5), t.y + Math.sin(a) * 0.5, t.level, nextId++);
        u.deployT = 0.3;
        this.ents.push(u);
      }
    }
  }

  attack(e, t) {
    let dmg = e.dmg;
    if (e.charging) {
      dmg *= 2;
      e.charging = false;
      this.ring(t.x, t.y, 0.2, 1.5, 0.3, '#ffcf6b', 4);
      this.hooks.shake?.(3);
    }
    if (e.bonusHit) {
      dmg *= 2;
      e.bonusHit = false;
    }
    e.moveDist = 0;
    e.atkAnim = 1;
    e.face = Math.atan2(t.y - e.y, t.x - e.x);
    if (e.kind === 'tower') {
      e.aim = e.face;
      e.recoil = 1;
    }
    if (e.proj) {
      const sz = e.kind === 'tower' ? (e.towerType === 'king' ? 2.6 : 2.2) : e.air ? 1.3 : 0.5;
      this.projs.push({
        type: e.proj, team: e.team, x: e.x, y: e.y, z: sz, z0: sz, tx: t.x, ty: t.y, target: t,
        speed: e.projSpeed, dmg, splash: e.splash, targets: e.targets, d0: Math.max(0.1, dist(e, t)), src: e,
      });
      this.hooks.sfx?.(e.proj === 'arrow' ? 'arrow' : e.proj === 'cannon' || e.proj === 'bomb' ? 'cannonShot' : e.proj === 'bullet' ? 'shot' : 'magic');
    } else if (CARDS[e.card]?.spin) {
      const rad = CARDS[e.card].spin * (e.r / e.baseR);
      for (const o of this.ents) {
        if (!this.canHit(e, o)) continue;
        if (edgeDist(e, o) < rad) this.damage(o, dmg, e);
      }
      this.ring(e.x, e.y, 0.3, rad + e.r, 0.25, '#ffe0a0', 3);
      this.hooks.sfx?.('sword');
    } else {
      this.damage(t, dmg, e);
      this.part(t.x, t.y, 0.5, '#ffffff', 1.5, 0.25);
      this.hooks.sfx?.('sword');
    }
  }

  hitProj(p) {
    if (p.splash) {
      for (const o of this.ents) {
        if (!o.alive || o.team === p.team) continue;
        if (p.targets === 'ground' && o.air) continue;
        if (Math.hypot(o.x - p.tx, o.y - p.ty) < p.splash + o.r * 0.5) this.damage(o, p.dmg, p.src);
      }
      const col = p.type === 'flame' ? '#ff8a3a' : p.type === 'orb' ? '#c89aff' : '#e8d0a0';
      this.explosion(p.tx, p.ty, p.splash, col, p.type === 'bomb' || p.type === 'cannon');
      if (p.type === 'bomb') {
        this.hooks.sfx?.('boomSmall');
        this.hooks.shake?.(2);
      }
    } else if (p.target && p.target.alive) {
      this.damage(p.target, p.dmg, p.src);
      this.part(p.tx, p.ty, 0.8, p.type === 'cannon' ? '#d8c8a8' : '#fff6d0', 1.2, 0.25);
      if (p.type === 'cannon') this.hooks.sfx?.('thud');
    }
  }

  // ---------- 이동 ----------
  nearestBridge(x) {
    return Math.abs(x - BRIDGES[0]) < Math.abs(x - BRIDGES[1]) ? BRIDGES[0] : BRIDGES[1];
  }

  waypoint(e, tx, ty) {
    if (e.air) return [tx, ty];
    const eSide = e.y > RIVER_Y ? 0 : 1;
    const tSide = ty > RIVER_Y ? 0 : 1;
    const inBand = Math.abs(e.y - RIVER_Y) < 1.2;
    if (eSide === tSide && !inBand) return [tx, ty];
    const bx = this.nearestBridge(e.x);
    const tol = BRIDGE_HALF - e.r * 0.5;
    if (inBand && Math.abs(e.x - bx) < BRIDGE_HALF + 0.2) {
      if (eSide === tSide && Math.abs(e.y - RIVER_Y) > 1.0) return [tx, ty];
      return [bx + clamp(e.x - bx, -tol * 0.5, tol * 0.5), tSide === 0 ? RIVER_Y + 1.6 : RIVER_Y - 1.6];
    }
    if (Math.abs(e.x - bx) < tol && Math.abs(e.y - RIVER_Y) < 2.2) {
      return [e.x, eSide === 0 ? RIVER_Y - 1.6 : RIVER_Y + 1.6];
    }
    return [bx, eSide === 0 ? RIVER_Y + 1.6 : RIVER_Y - 1.6];
  }

  moveToward(e, tx, ty, dt) {
    const [wx, wy] = this.waypoint(e, tx, ty);
    const dx = wx - e.x;
    const dy = wy - e.y;
    const d = Math.hypot(dx, dy);
    if (d < 0.01) return;
    let sp = e.speed * (e.slowT > 0 ? 0.5 : 1);
    if (e.charging) sp *= 2;
    const step = Math.min(d, sp * dt);
    e.x += (dx / d) * step;
    e.y += (dy / d) * step;
    e.face = Math.atan2(dy, dx);
    e.moving = true;
    e.walk += dt * sp * 6;
    if (CARDS[e.card].charge) {
      e.moveDist += step;
      if (!e.charging && e.moveDist > 2.5) {
        e.charging = true;
        this.text(e.x, e.y, 1.4, '돌격!', '#ffcf6b', 0.8, 0.8);
      }
    }
  }

  tryBlink(e, t) {
    const b = CARDS[e.card].blink;
    if (!b || e.blinkCd > 0) return false;
    const d = dist(e, t);
    if (d < 2 || d > b.range) return false;
    const a = Math.atan2(t.y - e.y, t.x - e.x);
    const off = t.r + e.r + 0.15;
    let nx = t.x + Math.cos(a) * off;
    let ny = t.y + Math.sin(a) * off;
    if (!this.validGround(nx, ny)) {
      nx = t.x - Math.cos(a) * off;
      ny = t.y - Math.sin(a) * off;
      if (!this.validGround(nx, ny)) return false;
    }
    for (let i = 0; i < 10; i++) this.part(e.x, e.y, 0.5, '#8a7ad8', 2, 0.4);
    e.x = clamp(nx, 0.4, W - 0.4);
    e.y = clamp(ny, 0.4, H - 0.4);
    for (let i = 0; i < 10; i++) this.part(e.x, e.y, 0.5, '#c8b8ff', 2, 0.4);
    this.ring(e.x, e.y, 0.1, 1.2, 0.3, '#c8b8ff', 3);
    e.blinkCd = b.cd;
    e.bonusHit = true;
    e.cd = Math.min(e.cd, 0.2);
    this.hooks.sfx?.('blink');
    return true;
  }

  validGround(x, y) {
    if (x < 0.4 || x > W - 0.4 || y < 0.4 || y > H - 0.4) return false;
    if (Math.abs(y - RIVER_Y) < 1.0) {
      return BRIDGES.some((b) => Math.abs(x - b) < BRIDGE_HALF);
    }
    return true;
  }

  updateEnt(e, dt) {
    if (e.flash > 0) e.flash -= dt;
    if (e.mergeFlash > 0) e.mergeFlash -= dt * 1.5;
    if (e.atkAnim > 0) e.atkAnim -= dt * 4;
    if (e.recoil > 0) e.recoil -= dt * 4;
    e.moving = false;
    if (e.deployT > 0) {
      e.deployT -= dt;
      return;
    }
    if (e.kind === 'tower' && !e.active) return;
    if (e.kind === 'building' && e.lifeMax) {
      e.hp -= (e.maxHp / e.lifeMax) * dt;
      if (e.hp <= 0) {
        this.kill(e, null);
        return;
      }
    }
    if (e.stunT > 0) {
      e.stunT -= dt;
      return;
    }
    const slow = e.slowT > 0 ? 0.5 : 1;
    if (e.slowT > 0) e.slowT -= dt;
    if (e.blinkCd > 0) e.blinkCd -= dt;
    const c = CARDS[e.card];
    if (c && c.heal) {
      e.healT -= dt;
      if (e.healT <= 0) {
        e.healT = 1;
        const amt = c.heal * LEVEL_MULT[e.level - 1] * (e.team === 1 ? this.params.statMult : 1);
        let any = false;
        for (const u of this.ents) {
          if (!u.alive || u.team !== e.team || u.kind === 'tower' || u === e) continue;
          if (Math.hypot(u.x - e.x, u.y - e.y) < c.healRadius && u.hp < u.maxHp) {
            u.hp = Math.min(u.maxHp, u.hp + amt);
            this.part(u.x, u.y, 0.6, '#7dff9a', 1, 0.5);
            any = true;
          }
        }
        this.ring(e.x, e.y, 0.3, c.healRadius, 0.6, any ? '#7dff9a' : 'rgba(125,255,154,0.4)', 2);
      }
      return;
    }
    if (e.cd > 0) e.cd -= dt * slow;
    if (e.retarget > 0) e.retarget -= dt;
    let t = e.target;
    if (t && (!t.alive || !this.canHit(e, t))) t = e.target = null;
    const inRangeNow = t && edgeDist(e, t) <= e.range;
    if (!t || (!inRangeNow && e.retarget <= 0)) {
      t = e.target = this.findTarget(e);
      e.retarget = 0.25;
    }
    if (!t) {
      e.inRange = false;
      return;
    }
    const d = edgeDist(e, t);
    if (d <= e.range) {
      if (!e.inRange) {
        e.inRange = true;
        e.cd = Math.max(e.cd, e.hitSpeed * 0.35);
      }
      e.face = Math.atan2(t.y - e.y, t.x - e.x);
      if (e.cd <= 0) {
        this.attack(e, t);
        e.cd = e.hitSpeed;
      }
    } else {
      e.inRange = false;
      if (e.kind === 'troop') {
        if (c.blink && this.tryBlink(e, t)) return;
        this.moveToward(e, t.x, t.y, dt);
      }
    }
  }

  separate() {
    const troops = this.ents.filter((e) => e.alive && e.kind === 'troop');
    const n = troops.length;
    for (let i = 0; i < n; i++) {
      const a = troops[i];
      for (let j = i + 1; j < n; j++) {
        const b = troops[j];
        if (a.air !== b.air) continue;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const minD = (a.r + b.r) * 0.92;
        const d2 = dx * dx + dy * dy;
        if (d2 >= minD * minD) continue;
        let d = Math.sqrt(d2);
        let nx;
        let ny;
        if (d < 0.001) {
          const ang = this.rng() * Math.PI * 2;
          nx = Math.cos(ang);
          ny = Math.sin(ang);
          d = 0;
        } else {
          nx = dx / d;
          ny = dy / d;
        }
        const ov = (minD - d) * 0.5;
        const ma = a.mass * (a.inRange ? 3 : 1) * (a.deployT > 0 ? 2 : 1);
        const mb = b.mass * (b.inRange ? 3 : 1) * (b.deployT > 0 ? 2 : 1);
        const tot = ma + mb;
        a.x -= nx * ov * 2 * (mb / tot);
        a.y -= ny * ov * 2 * (mb / tot);
        b.x += nx * ov * 2 * (ma / tot);
        b.y += ny * ov * 2 * (ma / tot);
      }
    }
    const statics = this.ents.filter((e) => e.alive && e.kind !== 'troop');
    for (const a of troops) {
      if (!a.air) {
        for (const s of statics) {
          const dx = a.x - s.x;
          const dy = a.y - s.y;
          const minD = a.r + s.r * 0.95;
          const d = Math.hypot(dx, dy);
          if (d < minD && d > 0.001) {
            a.x = s.x + (dx / d) * minD;
            a.y = s.y + (dy / d) * minD;
          }
        }
        // 강: 다리 위가 아니면 밀어냄
        if (Math.abs(a.y - RIVER_Y) < 1.0) {
          const bx = this.nearestBridge(a.x);
          const lim = BRIDGE_HALF - a.r * 0.4;
          if (Math.abs(a.x - bx) > lim) {
            if (Math.abs(a.x - bx) < BRIDGE_HALF + 0.6) a.x = bx + Math.sign(a.x - bx) * lim;
            else a.y = a.y < RIVER_Y ? RIVER_Y - 1.0 : RIVER_Y + 1.0;
          }
        }
      }
      a.x = clamp(a.x, 0.3, W - 0.3);
      a.y = clamp(a.y, 0.3, H - 0.3);
    }
  }

  finish(winner, reason) {
    if (this.ended) return;
    this.ended = true;
    this.result = {
      winner,
      reason,
      crowns: [this.teams[0].crowns, this.teams[1].crowns],
      kingHpFrac: (() => {
        const k = this.towerOf(0, 'king');
        return k.alive ? k.hp / k.maxHp : 0;
      })(),
    };
    this.hooks.end?.(this.result);
  }

  get double() {
    return (this.phase === 'normal' && this.clock <= BATTLE.DOUBLE_AT) || this.phase === 'overtime';
  }

  update(dt) {
    if (this.ended) {
      this.updateFx(dt);
      return;
    }
    this.time += dt;
    this.clock -= dt;
    if (this.phase === 'normal' && this.clock <= 0) {
      const [a, b] = [this.teams[0].crowns, this.teams[1].crowns];
      if (a !== b) this.finish(a > b ? 0 : 1, 'time');
      else {
        this.phase = 'overtime';
        this.clock = BATTLE.OVERTIME;
        this.hooks.announce?.('연장전! 먼저 타워를 부수면 승리', '#ffcf6b');
        this.hooks.sfx?.('horn');
      }
    } else if (this.phase === 'overtime') {
      const [a, b] = [this.teams[0].crowns, this.teams[1].crowns];
      if (a !== b) this.finish(a > b ? 0 : 1, 'overtime');
      else if (this.clock <= 0) this.finish(-1, 'draw');
    }
    if (this.ended) return;
    if (this.phase === 'normal' && this.clock <= BATTLE.DOUBLE_AT && this.clock + dt > BATTLE.DOUBLE_AT) {
      this.hooks.announce?.('엘릭서 2배!', '#e59aff');
      this.hooks.sfx?.('horn');
    }

    const mult = this.double ? 2 : 1;
    for (let i = 0; i < 2; i++) {
      let rate = BATTLE.ELIXIR_PER_SEC * mult;
      if (i === 0 && this.relics.has('elixirRate')) rate *= 1.12;
      const T = this.teams[i];
      T.elixir = Math.min(BATTLE.ELIXIR_MAX, T.elixir + rate * dt);
      if (i === 0 && this.o.infElixir) T.elixir = BATTLE.ELIXIR_MAX;
    }

    // 보스 소환
    if (this.params.boss) {
      this.bossT -= dt;
      if (this.bossT <= 0) {
        this.bossT = BOSS.summonEvery;
        const id = BOSS.summons[Math.floor(this.rng() * BOSS.summons.length)];
        const lane = this.rng() < 0.5 ? 0 : 1;
        const x = lane ? 12 : 6;
        this.spawnCard(1, id, x, 6.5, this.time > 90 ? 2 : 1);
        this.hooks.announce?.('보스의 소환!', '#ff8a7a');
        this.hooks.sfx?.('horn');
      }
    }

    // 가시 성벽
    if (this.relics.has('thorns')) {
      this.thornT -= dt;
      if (this.thornT <= 0) {
        this.thornT = 0.5;
        for (const t of this.towers) {
          if (t.team !== 0 || !t.alive) continue;
          for (const e of this.ents) {
            if (e.alive && e.team === 1 && e.kind === 'troop' && !e.air && edgeDist(t, e) < 1.6) this.damage(e, 12, null);
          }
        }
      }
    }

    for (let i = 0; i < this.ents.length; i++) {
      const e = this.ents[i];
      if (e.alive) this.updateEnt(e, dt);
    }
    if (this.ended) return;

    // 투사체
    for (const p of this.projs) {
      if (p.target && p.target.alive) {
        p.tx = p.target.x;
        p.ty = p.target.y;
      }
      const dx = p.tx - p.x;
      const dy = p.ty - p.y;
      const d = Math.hypot(dx, dy);
      const step = p.speed * dt;
      p.ang = Math.atan2(dy, dx);
      if (d <= step) {
        p.x = p.tx;
        p.y = p.ty;
        p.done = true;
        this.hitProj(p);
      } else {
        p.x += (dx / d) * step;
        p.y += (dy / d) * step;
        const prog = 1 - Math.min(1, d / p.d0);
        const arc = p.type === 'bomb' || p.type === 'cannon' ? Math.sin(prog * Math.PI) * Math.min(2.2, p.d0 * 0.3) : 0;
        p.z = p.z0 * (1 - prog) + 0.4 * prog + arc;
      }
    }
    this.projs = this.projs.filter((p) => !p.done);

    // 주문
    for (const s of this.spells) {
      s.t += dt;
      if (s.t >= s.delay && !s.done) {
        s.done = true;
        this.landSpell(s);
      }
    }
    this.spells = this.spells.filter((s) => !s.done);

    this.separate();
    this.ents = this.ents.filter((e) => e.alive || e.kind === 'tower');
    this.updateFx(dt);
  }

  // ---------- 이펙트 ----------
  part(x, y, z, color, sp, life) {
    if (this.fx.parts.length > 260) return;
    const a = this.rng() * Math.PI * 2;
    const s = sp * (0.3 + this.rng());
    this.fx.parts.push({ x, y, z, vx: Math.cos(a) * s, vy: Math.sin(a) * s * 0.8, vz: 1 + this.rng() * sp, color, life, max: life, size: 0.08 + this.rng() * 0.1 });
  }

  ring(x, y, r0, r1, life, color, width) {
    this.fx.rings.push({ x, y, r0, r1, life, max: life, color, width });
  }

  text(x, y, z, text, color, life, size) {
    this.fx.texts.push({ x, y, z, text: String(text), color, life, max: life, size });
  }

  explosion(x, y, r, color, dark) {
    this.ring(x, y, 0.2, r, 0.35, color, 5);
    for (let i = 0; i < 16; i++) this.part(x, y, 0.3, i % 3 === 0 ? '#ffffff' : color, 2.5 + r, 0.5);
    if (dark) for (let i = 0; i < 6; i++) this.part(x, y, 0.3, '#6a6058', 1.5, 0.7);
    this.fx.marks.push({ x, y, r: r * 0.7, life: 2.5, max: 2.5, color: 'rgba(60,40,20,0.25)', scorch: true });
  }

  updateFx(dt) {
    const f = this.fx;
    for (const p of f.parts) {
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.z += p.vz * dt;
      p.vz -= 9 * dt;
      if (p.z < 0) {
        p.z = 0;
        p.vz *= -0.3;
        p.vx *= 0.6;
        p.vy *= 0.6;
      }
    }
    f.parts = f.parts.filter((p) => p.life > 0);
    for (const d of f.debris) {
      d.life -= dt;
      d.x += d.vx * dt;
      d.y += d.vy * dt;
      d.z += d.vz * dt;
      d.vz -= 18 * dt;
      d.rot += d.vr * dt;
      if (d.z < 0) {
        d.z = 0;
        d.vz *= -0.35;
        d.vx *= 0.5;
        d.vy *= 0.5;
        d.vr *= 0.5;
      }
    }
    f.debris = f.debris.filter((d) => d.life > 0);
    for (const t of f.texts) {
      t.life -= dt;
      t.z += dt * 1.6;
    }
    f.texts = f.texts.filter((t) => t.life > 0);
    for (const r of f.rings) r.life -= dt;
    f.rings = f.rings.filter((r) => r.life > 0);
    for (const b of f.bolts) b.life -= dt;
    f.bolts = f.bolts.filter((b) => b.life > 0);
    for (const m of f.marks) m.life -= dt;
    f.marks = f.marks.filter((m) => m.life > 0);
  }
}
