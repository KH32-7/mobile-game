// 메타 진행: 통계, 일일 미션, 출석, 업적, 도감
import { ACHIEVEMENTS, MISSION_POOL, ATTEND, STAGES, MENUS } from './config.js';
import { today } from './save.js';

export class Meta {
  constructor(profile, hooks) {
    this.p = profile;
    this.hooks = hooks;
    this.checkDay();
  }

  // 자정 갱신
  checkDay() {
    const d = today();
    const m = this.p.missions;
    if (m.day !== d || !Array.isArray(m.list) || m.list.length !== 3) {
      m.day = d;
      m.list = this.rollMissions();
      return true;
    }
    return false;
  }

  rollMissions() {
    const pool = MISSION_POOL.slice();
    const out = [];
    const stage = this.p.stage;
    const scale = [1, 2.2, 4, 7, 11][stage] || 1;
    const priceMul = STAGES[stage].priceMul;
    while (out.length < 3 && pool.length) {
      const i = Math.floor(Math.random() * pool.length);
      const t = pool.splice(i, 1)[0];
      let n = t.base;
      if (t.money) n = Math.round((t.base * priceMul * scale) / 10) * 10;
      else if (!t.max && t.type !== 'unlocks' && t.type !== 'vip') n = Math.round(t.base * Math.sqrt(scale));
      else if (t.type === 'combo') n = t.base + stage * 2;
      out.push({ type: t.type, n, text: t.text.replace('{n}', n.toLocaleString('ko-KR')), prog: 0, reward: t.reward + stage * 2, done: false, claimed: false });
    }
    return out;
  }

  stat(key, n) {
    const s = this.p.stats;
    if (key === 'maxCombo') {
      s.maxCombo = Math.max(s.maxCombo, n);
      this.mission('combo', n, true);
    } else if (key === 'bestStars') {
      s.bestStars = Math.max(s.bestStars, n);
    } else {
      s[key] = (s[key] || 0) + n;
      this.mission(key, n, false);
    }
    this.checkAch();
  }

  mission(type, n, isMax) {
    if (this.checkDay()) this.hooks.missionsChanged && this.hooks.missionsChanged();
    for (const m of this.p.missions.list) {
      if (m.type !== type || m.done) continue;
      m.prog = isMax ? Math.max(m.prog, n) : m.prog + n;
      if (m.prog >= m.n) {
        m.prog = m.n;
        m.done = true;
        this.hooks.missionDone && this.hooks.missionDone(m);
      }
    }
    this.hooks.missionsChanged && this.hooks.missionsChanged();
  }

  claimMission(i) {
    const m = this.p.missions.list[i];
    if (!m || !m.done || m.claimed) return 0;
    m.claimed = true;
    this.p.pearls += m.reward;
    return m.reward;
  }

  unclaimed() {
    return this.p.missions.list.filter((m) => m.done && !m.claimed).length;
  }

  achValue(a) {
    const s = this.p.stats;
    if (a.stat === 'stage') return this.p.stage + 1;
    return s[a.stat] || 0;
  }

  checkAch() {
    for (const a of ACHIEVEMENTS) {
      if (this.p.ach[a.id]) continue;
      if (this.achValue(a) >= a.goal) {
        this.p.ach[a.id] = 1; // 달성, 미수령
        this.hooks.achDone && this.hooks.achDone(a);
      }
    }
  }

  claimAch(id) {
    const a = ACHIEVEMENTS.find((x) => x.id === id);
    if (!a || this.p.ach[id] !== 1) return 0;
    this.p.ach[id] = 2;
    this.p.pearls += a.reward;
    return a.reward;
  }

  achUnclaimed() {
    return ACHIEVEMENTS.filter((a) => this.p.ach[a.id] === 1).length;
  }

  // 출석: 하루 1번, 7일 주기
  attendAvailable() {
    return this.p.attend.last !== today();
  }
  attendClaim(moneyUnit) {
    if (!this.attendAvailable()) return null;
    const at = this.p.attend;
    const idx = at.day % 7;
    const r = ATTEND[idx];
    at.last = today();
    at.day = at.day + 1;
    const res = { day: idx + 1 };
    if (r.pearls) {
      this.p.pearls += r.pearls;
      res.pearls = r.pearls;
    }
    if (r.money) {
      res.money = Math.round(moneyUnit * r.money);
    }
    if (r.hat && !this.p.cos.hats.includes(r.hat)) {
      this.p.cos.hats.push(r.hat);
      res.hat = r.hat;
    }
    return res;
  }

  discover(menu) {
    if (!MENUS[menu]) return false;
    const first = !this.p.dex[menu];
    this.p.dex[menu] = this.p.dex[menu] || { found: Date.now(), served: 0 };
    return first;
  }
  served(menu) {
    if (!this.p.dex[menu]) this.discover(menu);
    this.p.dex[menu].served++;
  }
}
