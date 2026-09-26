// 장기 진행: 맵/난이도 해금, 업그레이드 트리, 스킬/스킨 해금, 일일 미션, 출석, 데일리 챌린지, 업적
import {
  MAPS,
  MAP_ORDER,
  UPGRADES,
  TIER_REQ,
  SKINS,
  SKILL_COST,
  ACHIEVEMENTS,
  MISSIONS,
  MISSION_BONUS,
  STREAK_REWARDS,
  DAILY_MODS,
  DAILY_REWARD,
  DAILY_GOAL,
  MAX_DIFF,
} from './config.js';
import { Save } from './save.js';
import { makeRng } from './rng.js';

const pad = (n) => String(n).padStart(2, '0');
export const todayKey = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const dayNum = (key) => {
  const m = /^(\d+)-(\d+)-(\d+)$/.exec(key || '');
  return m ? Math.round(Date.UTC(+m[1], +m[2] - 1, +m[3]) / 86400000) : -999;
};
const hash = (s) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
};

function genMissions(key) {
  const rng = makeRng(hash('missions' + key));
  const pool = MISSIONS.slice();
  const out = [];
  while (out.length < 3 && pool.length) {
    const m = pool.splice(Math.floor(rng() * pool.length), 1)[0];
    const ti = Math.floor(rng() * m.targets.length);
    out.push({ id: m.id, target: m.targets[ti], prog: 0, claimed: false, reward: m.reward + ti * 15 });
  }
  return out;
}

export const Meta = {
  get d() {
    return Save.data;
  },

  // 날짜가 바뀌었으면 미션/챌린지 갱신 + 출석 처리
  refreshDay(now = new Date()) {
    const d = Save.data;
    const key = todayKey(now);
    let changed = false;
    if (d.daily.date !== key) {
      d.daily = { date: key, missions: genMissions(key), bonusClaimed: false, challenge: { best: 0, done: false, claimed: false } };
      changed = true;
    }
    if (d.streak.last !== key) {
      const gap = dayNum(key) - dayNum(d.streak.last);
      d.streak.count = gap === 1 ? d.streak.count + 1 : 1;
      d.streak.last = key;
      d.stats.bestStreak = Math.max(d.stats.bestStreak, d.streak.count);
      changed = true;
    }
    if (changed) {
      this.checkAchievements();
      Save.save();
    }
    return changed;
  },

  // ---------- 출석 ----------
  streakPending() {
    return Save.data.streak.claimed !== Save.data.streak.last;
  },
  streakReward(count = Save.data.streak.count) {
    return STREAK_REWARDS[(Math.max(1, count) - 1) % STREAK_REWARDS.length];
  },
  claimStreak() {
    const d = Save.data;
    if (!this.streakPending()) return 0;
    const r = this.streakReward();
    d.coins += r;
    d.stats.coinsEarned += r;
    d.streak.claimed = d.streak.last;
    this.checkAchievements();
    Save.save();
    return r;
  },

  // ---------- 미션 ----------
  missionDef(m) {
    return MISSIONS.find((x) => x.id === m.id);
  },
  missionText(m) {
    const def = this.missionDef(m);
    return def ? def.text(m.target) : '';
  },
  claimableMissions() {
    const d = Save.data;
    let n = d.daily.missions.filter((m) => !m.claimed && m.prog >= m.target).length;
    if (!d.daily.bonusClaimed && d.daily.missions.length && d.daily.missions.every((m) => m.claimed)) n++;
    return n;
  },
  claimMission(i) {
    const d = Save.data;
    const m = d.daily.missions[i];
    if (!m || m.claimed || m.prog < m.target) return 0;
    m.claimed = true;
    d.coins += m.reward;
    d.stats.coinsEarned += m.reward;
    Save.save();
    return m.reward;
  },
  claimMissionBonus() {
    const d = Save.data;
    if (d.daily.bonusClaimed || !d.daily.missions.every((m) => m.claimed)) return 0;
    d.daily.bonusClaimed = true;
    d.coins += MISSION_BONUS;
    d.stats.coinsEarned += MISSION_BONUS;
    Save.save();
    return MISSION_BONUS;
  },

  // ---------- 데일리 챌린지 ----------
  dailyChallenge(key = Save.data.daily.date || todayKey()) {
    const rng = makeRng(hash('challenge' + key));
    const map = MAP_ORDER[Math.floor(rng() * MAP_ORDER.length)];
    const mod = DAILY_MODS[Math.floor(rng() * DAILY_MODS.length)];
    return { map, mod, seed: hash('seed' + key) % 1000000, diff: 2, key };
  },

  // ---------- 해금 ----------
  tierUnlocked(tier) {
    if (tier <= 1) return true;
    const lv = UPGRADES.filter((u) => u.tier === tier - 1).reduce((a, u) => a + (Save.data.upg[u.id] || 0), 0);
    return lv >= TIER_REQ[tier];
  },
  upgLevels() {
    return UPGRADES.reduce((a, u) => a + (Save.data.upg[u.id] || 0), 0);
  },
  buyUpgrade(id) {
    const d = Save.data;
    const u = UPGRADES.find((x) => x.id === id);
    if (!u) return '없는 강화';
    const l = d.upg[id] || 0;
    if (l >= u.max) return '이미 최대 레벨';
    if (!this.tierUnlocked(u.tier)) return `이전 단계 강화 합계 Lv ${TIER_REQ[u.tier]} 필요`;
    const cost = u.cost[l];
    if (d.coins < cost) return '코인이 부족해!';
    d.coins -= cost;
    d.upg[id] = l + 1;
    d.stats.upgLevels = this.upgLevels();
    this.checkAchievements();
    Save.save();
    return null;
  },
  buySkill(id) {
    const d = Save.data;
    if (d.skills.includes(id)) return '이미 해금됨';
    const cost = SKILL_COST[id];
    if (cost === undefined) return '해금 불가';
    if (d.coins < cost) return '코인이 부족해!';
    d.coins -= cost;
    d.skills.push(id);
    Save.save();
    return null;
  },
  buySkin(id) {
    const d = Save.data;
    const s = SKINS[id];
    if (!s) return '없는 스킨';
    if (d.skins.owned.includes(id)) {
      d.skins.sel = id;
      Save.save();
      return null;
    }
    if (!s.cost) return s.how + ' 필요';
    if (d.coins < s.cost) return '코인이 부족해!';
    d.coins -= s.cost;
    d.skins.owned.push(id);
    d.skins.sel = id;
    Save.save();
    return null;
  },
  mapUnlockText(id) {
    const u = MAPS[id].unlock;
    return u ? `${MAPS[u.map].name} 난이도 ${u.diff} 클리어 시 해금` : '';
  },

  // ---------- 업적 ----------
  checkAchievements() {
    const d = Save.data;
    const got = [];
    for (const a of ACHIEVEMENTS) {
      if (d.ach[a.id]) continue;
      let ok = false;
      try {
        ok = a.test(d.stats, d.maps);
      } catch (e) {
        ok = false;
      }
      if (ok) {
        d.ach[a.id] = Date.now();
        d.coins += a.reward;
        d.stats.coinsEarned += a.reward;
        d.seen.ach.push(a.id);
        got.push(a);
        for (const [sid, sk] of Object.entries(SKINS)) {
          if (sk.ach === a.id && !d.skins.owned.includes(sid)) {
            d.skins.owned.push(sid);
            d.seen.unlocks.push('skin:' + sid);
          }
        }
      }
    }
    return got;
  },

  // ---------- 판 결과 기록 ----------
  recordRun(r) {
    const d = Save.data;
    const st = d.stats;
    const out = { newAch: [], unlocks: [], missions: [], daily: null };
    st.swallowed += r.swallowed;
    st.kills += r.kills;
    st.runs += 1;
    st.playTime += r.time;
    st.bestTime = Math.max(st.bestTime, r.time);
    st.maxSize = Math.max(st.maxSize, r.size);
    st.maxCombo = Math.max(st.maxCombo, r.maxCombo);
    st.maxLevel = Math.max(st.maxLevel, r.level);
    st.miniKills += r.miniKills;
    st.evolutions += r.evolutions;
    st.coinsEarned += r.coins;
    d.coins += r.coins;
    if (r.cleared) st.bossKills++;

    if (!r.daily) {
      const m = d.maps[r.map];
      m.best.time = Math.max(m.best.time, r.time);
      m.best.size = Math.max(m.best.size, r.size);
      m.best.kills = Math.max(m.best.kills, r.kills);
      if (r.cleared) {
        if (r.diff > m.clear) m.clear = r.diff;
        if (r.diff >= m.diff && m.diff < MAX_DIFF) {
          m.diff = r.diff + 1;
          out.unlocks.push(`${MAPS[r.map].name} 난이도 ${m.diff} 해금!`);
          d.seen.unlocks.push('diff:' + r.map);
        }
        for (const id of MAP_ORDER) {
          const u = MAPS[id].unlock;
          if (u && !d.maps[id].unlocked && u.map === r.map && r.diff >= u.diff) {
            d.maps[id].unlocked = true;
            out.unlocks.push(`새 맵 ${MAPS[id].name} 해금!`);
            d.seen.unlocks.push('map:' + id);
          }
        }
      }
    } else {
      const c = d.daily.challenge;
      c.best = Math.max(c.best, r.time);
      if ((r.time >= DAILY_GOAL || r.cleared) && !c.done) {
        c.done = true;
        c.claimed = true;
        st.dailyClears++;
        d.coins += DAILY_REWARD;
        st.coinsEarned += DAILY_REWARD;
        out.daily = DAILY_REWARD;
      }
    }

    // 미션 진행
    const vals = { swallowed: r.swallowed, kills: r.kills, runs: 1, time: r.time, size: r.size, maxCombo: r.maxCombo, level: r.level, miniKills: r.miniKills };
    for (const m of d.daily.missions) {
      const def = this.missionDef(m);
      if (!def || m.claimed) continue;
      const before = m.prog >= m.target;
      const v = vals[def.key] || 0;
      m.prog = def.kind === 'sum' ? m.prog + v : Math.max(m.prog, v);
      if (!before && m.prog >= m.target) out.missions.push(this.missionText(m));
    }

    out.newAch = this.checkAchievements();
    Save.save();
    return out;
  },

  markSeen() {
    Save.data.seen.ach = [];
    Save.data.seen.unlocks = [];
    Save.save();
  },
};
