// 적 AI: 엘릭서 관리, 카운터, 푸시, 합성 활용
import { CARDS, ARENA } from './config.js';

const { W, RIVER_Y, BRIDGES } = ARENA;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

const SPLASH = new Set(['wizard', 'bomber', 'minidragon', 'valkyrie', 'fireball', 'arrows']);
const TANKS = new Set(['giant', 'golem', 'knight', 'valkyrie', 'lancer']);
const HEAVY = new Set(['giant', 'golem']);
const DPS = new Set(['knight', 'goblins', 'skeletons', 'assassin', 'musketeer', 'lancer', 'cannon', 'minidragon', 'valkyrie']);

function hitsAir(id) {
  const c = CARDS[id];
  return c.kind === 'spell' || c.targets === 'all';
}

export class AI {
  constructor(battle, params, rng = Math.random) {
    this.b = battle;
    this.p = params;
    this.rng = rng;
    this.team = 1;
    this.t = 1.5 + params.react;
    this.saveFor = 7 + Math.floor(rng() * 4);
  }

  update(dt) {
    if (this.b.ended) return;
    this.t -= dt;
    if (this.t > 0) return;
    this.t = this.p.react * (0.6 + this.rng() * 0.8);
    this.think();
  }

  hand() {
    const T = this.b.teams[1];
    return T.hand.map((id, i) => ({ id, i, c: CARDS[id], cost: this.b.costOf(1, id, false) }));
  }

  play(i, x, y) {
    const r = this.b.playCard(1, i, x, y);
    if (r) this.saveFor = 6 + Math.floor(this.rng() * 5);
    return r;
  }

  think() {
    const b = this.b;
    const T = b.teams[1];
    const elixir = T.elixir;
    const foes = b.ents.filter((e) => e.alive && e.team === 0 && e.kind === 'troop');
    const threats = foes.filter((e) => e.y < 22.5);
    const mistake = this.rng() < this.p.mistake;

    // 1) 마무리 주문: 체력 낮은 플레이어 타워
    if (this.trySpellFinish()) return;

    // 2) 위협 대응
    if (threats.length) {
      if (mistake && this.rng() < 0.5) return; // 반응 실수: 한 박자 늦음
      if (this.tryMerge(true)) return;
      if (this.defend(threats, mistake)) return;
    }

    // 3) 필드의 내 유닛 합성/지원
    if (this.tryMerge(false)) return;
    if (this.support()) return;

    // 4) 푸시 시작
    if (elixir >= this.saveFor || elixir >= 9.8) this.push(mistake);
  }

  // ---------- 합성 ----------
  tryMerge(defending) {
    const b = this.b;
    const chance = defending ? 0.55 : 0.4 + (1 - this.p.mistake) * 0.3;
    if (this.rng() > chance) return false;
    for (const h of this.hand()) {
      if (h.c.kind === 'spell') continue;
      const units = b.ents.filter((e) => e.alive && e.team === 1 && e.card === h.id && e.level < 3 && e.deployT <= 0 && e.hp > e.maxHp * 0.45);
      if (!units.length) continue;
      const u = units.sort((a, c) => c.y - a.y)[0];
      const cost = b.costOf(1, h.id, true);
      if (b.teams[1].elixir < cost) continue;
      // 공격 중이거나 전진 중인 유닛만
      const engaged = u.inRange || u.y > RIVER_Y - 3 || defending;
      if (!engaged) continue;
      b.playCard(1, h.i, u.x, u.y);
      return true;
    }
    return false;
  }

  // ---------- 방어 ----------
  defend(threats, mistake) {
    const b = this.b;
    const elixir = b.teams[1].elixir;
    // 위협 요약
    const air = threats.filter((e) => e.air);
    const small = threats.filter((e) => e.maxHp < 320);
    const tank = threats.filter((e) => e.maxHp >= 1500 || HEAVY.has(e.card));
    const lead = threats.slice().sort((a, c) => a.y - c.y)[0];
    const hpSum = threats.reduce((s, e) => s + e.hp, 0);

    // 이미 충분한 아군이 막고 있으면 패스
    const mine = b.ents.filter((e) => e.alive && e.team === 1 && e.kind !== 'tower' && e.card !== 'totem' && Math.hypot(e.x - lead.x, e.y - lead.y) < 6);
    const myPower = mine.reduce((s, e) => s + e.hp * 0.3 + (e.dmg / (e.hitSpeed || 1)) * 4, 0);
    if (myPower > hpSum * 0.9 && !mistake) return false;

    // 스플래시 주문 우선 판단
    const spell = this.bestSpell(threats, false);
    if (spell && spell.value > 420) {
      this.play(spell.i, spell.x, spell.y);
      return true;
    }

    let best = null;
    for (const h of this.hand()) {
      if (h.c.kind === 'spell' || h.cost > elixir) continue;
      let s = 1;
      if (air.length && !hitsAir(h.id)) s -= air.length >= threats.length ? 5 : 1.5;
      if (air.length && hitsAir(h.id)) s += 2;
      if (small.length >= 3 && SPLASH.has(h.id)) s += 3;
      if (small.length >= 3 && (h.id === 'skeletons' || h.id === 'goblins')) s -= 1;
      if (tank.length && DPS.has(h.id)) s += 2.2;
      if (tank.length && h.id === 'cannon') s += 1.5;
      if (HEAVY.has(h.id)) s -= 2.5; // 탱커로 방어는 비효율
      if (h.c.targets === 'buildings') s -= 3;
      if (h.id === 'totem') s -= 2;
      s -= h.cost * 0.25;
      s += this.rng() * (mistake ? 4 : 0.8);
      if (!best || s > best.s) best = { ...h, s };
    }
    if (!best || best.s < -1) return false;

    // 배치 위치
    let x = lead.x;
    let y;
    const c = best.c;
    const onTheirSide = lead.y > RIVER_Y + 1;
    if (c.kind === 'building') {
      x = clamp(lead.x < W / 2 ? 7.2 : 10.8, 1, W - 1);
      y = 9.5;
    } else if (onTheirSide) {
      if (elixir < 7 && !mistake) return false; // 강 건너오면 받아침
      const bx = lead.x < W / 2 ? BRIDGES[0] : BRIDGES[1];
      x = bx + (bx < W / 2 ? 1 : -1);
      y = (c.range || 1) > 3 ? 9 : 12;
    } else {
      const ranged = (c.range || 0) > 3;
      y = ranged ? lead.y - 4.5 : lead.y - 2.2;
      x = lead.x + (this.rng() - 0.5) * 1.5;
    }
    if (mistake) x = clamp(x + (this.rng() - 0.5) * 6, 1, W - 1);
    this.play(best.i, clamp(x, 1, W - 1), clamp(y, 1.5, 14.4));
    return true;
  }

  // 주문 최적 지점
  bestSpell(targets, towersToo) {
    const b = this.b;
    const elixir = b.teams[1].elixir;
    let best = null;
    for (const h of this.hand()) {
      if (h.c.kind !== 'spell' || h.cost > elixir) continue;
      const c = h.c;
      const pool = b.ents.filter((e) => e.alive && e.team === 0 && (towersToo || e.kind !== 'tower'));
      for (const cen of targets) {
        let value = 0;
        const hit = pool.filter((e) => Math.hypot(e.x - cen.x, e.y - cen.y) < c.radius * 0.85);
        if (h.id === 'lightning') {
          hit.sort((a, d) => d.hp - a.hp);
          for (const e of hit.slice(0, 3)) value += Math.min(e.hp, c.dmg * (e.kind === 'tower' ? c.towerPct : 1));
        } else {
          for (const e of hit) value += Math.min(e.hp, c.dmg * (e.kind === 'tower' ? c.towerPct : 1)) * (e.kind === 'tower' ? 1.3 : 1);
        }
        if (h.id === 'freeze') value *= 0.9 + hit.length * 0.25;
        value = value / Math.max(1, h.cost) * 3;
        if (!best || value > best.value) {
          // 리드: 이동 방향 약간 앞으로
          best = { i: h.i, id: h.id, x: cen.x, y: cen.y - (cen.moving ? 0.6 : 0), value };
        }
      }
    }
    return best;
  }

  trySpellFinish() {
    const b = this.b;
    const towers = b.towers.filter((t) => t.team === 0 && t.alive);
    for (const h of this.hand()) {
      if (h.c.kind !== 'spell' || h.cost > b.teams[1].elixir) continue;
      for (const t of towers) {
        if (t.hp <= h.c.dmg * h.c.towerPct * this.p.statMult && this.rng() > this.p.mistake) {
          this.play(h.i, t.x, t.y);
          return true;
        }
      }
    }
    return false;
  }

  // ---------- 지원 ----------
  support() {
    const b = this.b;
    const elixir = b.teams[1].elixir;
    if (elixir < 5) return false;
    const push = b.ents.filter((e) => e.alive && e.team === 1 && e.kind === 'troop' && (TANKS.has(e.card) || e.card === 'golemite') && e.deployT <= 0);
    if (!push.length) return false;
    const lead = push.sort((a, c) => c.y - a.y)[0];
    if (lead.y > 22) return false;
    // 탱커 뒤 지원 카드
    let best = null;
    for (const h of this.hand()) {
      if (h.cost > elixir - 1 || h.c.kind === 'building' || HEAVY.has(h.id)) continue;
      if (h.c.kind === 'spell') continue;
      let s = (h.c.range || 0) > 3 ? 2 : 1;
      if (SPLASH.has(h.id)) s += 1;
      s += this.rng();
      if (!best || s > best.s) best = { ...h, s };
    }
    if (!best) return false;
    const x = lead.x + (this.rng() - 0.5);
    const y = Math.min(lead.y - 2.5, 14.4);
    this.play(best.i, clamp(x, 1, W - 1), clamp(y, 1.5, 14.4));
    return true;
  }

  // ---------- 공격 ----------
  push(mistake) {
    const b = this.b;
    const elixir = b.teams[1].elixir;
    // 약한 레인 선택
    const pl = [0, 1].map((l) => b.towerOf(0, 'princess', l));
    let lane;
    if (!pl[0].alive && pl[1].alive) lane = 0;
    else if (!pl[1].alive && pl[0].alive) lane = 1;
    else lane = pl[0].hp < pl[1].hp ? 0 : pl[1].hp < pl[0].hp ? 1 : this.rng() < 0.5 ? 0 : 1;
    if (mistake) lane = this.rng() < 0.5 ? 0 : 1;
    const bx = BRIDGES[lane];

    // 적 타워 공격용 주문 (값어치 있으면)
    const towers = b.towers.filter((t) => t.team === 0 && t.alive);
    const sp = this.bestSpell(b.ents.filter((e) => e.alive && e.team === 0), true);
    if (sp && sp.value > 520 && this.rng() < 0.6) {
      this.play(sp.i, sp.x, sp.y);
      return true;
    }

    const hand = this.hand().filter((h) => h.cost <= elixir && h.c.kind !== 'spell');
    if (!hand.length) return false;
    // 탱커 우선, 뒤쪽에 배치
    const tanks = hand.filter((h) => TANKS.has(h.id));
    let pick;
    if (tanks.length && this.rng() < 0.8) pick = tanks.sort((a, c) => c.cost - a.cost)[0];
    else {
      const troops = hand.filter((h) => h.c.kind === 'troop');
      if (!troops.length) return false;
      pick = troops[Math.floor(this.rng() * troops.length)];
    }
    let x;
    let y;
    if (HEAVY.has(pick.id)) {
      x = lane ? 11.5 : 6.5;
      y = 2.5;
    } else if (pick.c.speed >= 1.5) {
      x = bx + (lane ? -0.3 : 0.3);
      y = 13.5;
    } else {
      x = bx + (lane ? -1 : 1);
      y = 11;
    }
    // 포켓 열렸으면 더 깊숙이
    if (b.pocketOpen(1, x) && pick.c.kind === 'troop' && !HEAVY.has(pick.id)) y = 20;
    this.play(pick.i, x, y);
    void towers;
    return true;
  }
}
