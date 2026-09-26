// 아군 무리: 리더 + 스프링/꼬리 추종 멤버
import { CFG, SKINS } from './config.js';

const HIST_N = 512;
const HIST_STEP = 0.2;
const GOLD = 2.39996323;

export class Swarm {
  constructor() {
    this.members = [];
    this.flyers = [];
    this.count = 0;
    this.hist = new Float32Array(HIST_N);
    this.histIdx = -1;
    this.sliding = 0;
    this.form = { R: 0, hw: 0, rz: 0 };
    this.bounds = { minX: 0, maxX: 0, minRel: 0, cx: 0 };
    this.ground = null;
    this.skin = SKINS[0];
    this.hat = null;
  }

  reset(n, dist, x = 0) {
    this.members.length = 0;
    this.flyers.length = 0;
    this.count = n;
    this.histIdx = Math.floor(dist / HIST_STEP);
    this.hist.fill(x);
    this.sliding = 0;
    const r = Math.min(n, CFG.maxRender);
    for (let i = 0; i < r; i++) this.members.push(this.newMember(x + (Math.random() - 0.5), -Math.random() * 2, 1));
    this.updateForm();
  }

  newMember(x, rel, born = 0) {
    return { x, rel, y: 0, vx: 0, vrel: 0, vy: 0, g: CFG.gravity, jumpIn: -1, jumpV: 0, slideIn: -1, slideT: 0, ph: Math.random() * 6.28, born, alt: Math.random() < 0.5, stag: 0 };
  }

  get leader() { return this.members[0]; }

  histX(d, dist) {
    if (d >= dist) return this.hist[((this.histIdx % HIST_N) + HIST_N) % HIST_N];
    const idx = Math.floor(d / HIST_STEP);
    if (this.histIdx - idx >= HIST_N - 1) return this.hist[((this.histIdx + 1) % HIST_N + HIST_N) % HIST_N];
    return this.hist[((idx % HIST_N) + HIST_N) % HIST_N];
  }

  updateForm() {
    const n = this.members.length;
    const R = CFG.spacing * Math.sqrt(Math.max(1, n));
    const maxHW = this.sliding > 0 ? CFG.slideHalfW : CFG.maxHalfW;
    const hw = Math.min(R, maxHW);
    const rz = Math.min((R * R) / Math.max(hw, 0.1), R * (this.sliding > 0 ? 2.6 : 1.6));
    this.form.R = R; this.form.hw = hw; this.form.rz = rz;
  }

  // 인원 수를 목표치로 맞춤. 추가된 멤버는 (sx, srel) 근처에서 튀어나옴. 제거된 멤버 목록 반환
  setCount(n, srel = 0, sx = null, spread = 1.6) {
    n = Math.max(0, Math.min(CFG.maxCount, Math.round(n)));
    this.count = n;
    return this.syncRender(srel, sx, spread);
  }

  syncRender(srel = 0, sx = null, spread = 1.6) {
    const want = Math.min(this.count, CFG.maxRender);
    const removed = [];
    const L = this.leader;
    let k = 0;
    while (this.members.length < want) {
      const x = sx ?? (L ? L.x : 0);
      // 게이트 뒤에서 톡톡 튀어나와 합류하는 궤적
      const m = this.newMember(x + (Math.random() - 0.5) * spread, srel - Math.random() * 0.6, 0);
      m.born = -Math.min(0.5, k * 0.012);
      m.vy = 4.5 + Math.random() * 2.5;
      m.y = 0.3 + Math.random() * 0.8;
      m.vx = (Math.random() - 0.5) * 3;
      m.vrel = 2 + Math.random() * 2;
      this.members.push(m);
      k++;
    }
    while (this.members.length > want) {
      // 뒤쪽 멤버부터 제거
      const idx = this.members.length > 1 ? 1 + Math.floor(Math.random() * (this.members.length - 1)) : 0;
      removed.push(this.members.splice(idx, 1)[0]);
    }
    return removed;
  }

  // 충돌로 한 멤버를 날려 보냄
  kill(i, dist, dirX = 0) {
    const m = this.members[i];
    if (!m) return null;
    const rep = Math.max(1, Math.round(this.count / this.members.length));
    this.members.splice(i, 1);
    this.count = Math.max(0, this.count - rep);
    this.flyers.push({
      x: m.x, y: m.y + 0.2, z: -(dist + m.rel),
      vx: (dirX || (Math.random() - 0.5)) * (4 + Math.random() * 4), vy: 6 + Math.random() * 4, vz: 4 + Math.random() * 4,
      rx: 0, rz: 0, vrx: (Math.random() - 0.5) * 18, vrz: (Math.random() - 0.5) * 18, life: 1.2, color: i === 0 ? this.skin.leader : this.skin.crew[0],
    });
    if (i === 0 && this.members.length) this.promoteLeader();
    this.syncRender(-this.form.rz * 2);
    return m;
  }

  // 조용히 제거 (적 상쇄, 요새 돌진 등)
  remove(i, amount = 1) {
    const m = this.members[i];
    this.count = Math.max(0, this.count - amount);
    if (this.count < this.members.length || this.members.length > CFG.maxRender) {
      this.members.splice(i, 1);
      if (i === 0 && this.members.length) this.promoteLeader();
    }
    return m;
  }

  promoteLeader() {
    // 가장 앞에 있는 멤버가 새 리더
    let best = 0, bestRel = -1e9;
    for (let j = 0; j < this.members.length; j++) if (this.members[j].rel > bestRel) { bestRel = this.members[j].rel; best = j; }
    if (best !== 0) { const t = this.members[best]; this.members.splice(best, 1); this.members.unshift(t); }
  }

  jump(speed, boots) {
    const v = boots ? CFG.bootsJumpV : CFG.jumpV;
    const g = boots ? CFG.bootsGravity : CFG.gravity;
    this.sliding = 0;
    for (let i = 0; i < this.members.length; i++) {
      const m = this.members[i];
      m.slideIn = -1; m.slideT = 0;
      m.jumpV = v; m.g = g;
      m.jumpIn = i === 0 ? 0 : Math.min(CFG.maxWaveDelay, Math.max(0, -m.rel) / Math.max(1, speed)) + Math.random() * 0.03;
    }
  }

  slide(speed) {
    this.sliding = CFG.slideTime + Math.min(CFG.maxWaveDelay, this.form.rz * 2 / Math.max(1, speed));
    for (let i = 0; i < this.members.length; i++) {
      const m = this.members[i];
      m.jumpIn = -1;
      if (m.y > 0.05) m.vy = Math.min(m.vy, -14);
      m.slideIn = i === 0 ? 0 : Math.min(CFG.maxWaveDelay, Math.max(0, -m.rel) / Math.max(1, speed)) + Math.random() * 0.02;
    }
  }

  isSliding(m) { return m.slideT > 0; }
  height(m) { return m.slideT > 0 ? CFG.slideH : CFG.standH; }

  // mode: 'run' 일반, 'hold' 대형 유지만
  update(dt, dist, speed, laneX, attract = null) {
    // 리더 x 기록
    const L = this.leader;
    if (L) {
      L.vx += (CFG.leaderK * (laneX - L.x) - CFG.leaderDamp * L.vx) * dt;
      L.x += L.vx * dt;
      const ni = Math.floor(dist / HIST_STEP);
      if (ni - this.histIdx > HIST_N) this.histIdx = ni - HIST_N;
      while (this.histIdx < ni) { this.histIdx++; this.hist[((this.histIdx % HIST_N) + HIST_N) % HIST_N] = L.x; }
    }
    if (this.sliding > 0) this.sliding = Math.max(0, this.sliding - dt);
    this.updateForm();
    const n = this.members.length;
    const { hw, rz } = this.form;
    const center = rz + 0.5;
    const K = CFG.memberK, C = CFG.memberDamp;
    let minX = 1e9, maxX = -1e9, minRel = 0, sumX = 0;
    for (let i = 0; i < n; i++) {
      const m = this.members[i];
      let tx, trel;
      if (i === 0) { trel = 0; tx = null; }
      else {
        const rr = n <= 2 ? 0.6 : Math.sqrt((i - 0.5) / (n - 1));
        const th = i * GOLD;
        const ox = Math.cos(th) * rr * hw;
        const oz = Math.sin(th) * rr * rz;
        trel = -center + oz;
        tx = this.histX(dist + trel, dist) + ox;
        if (attract) tx += (attract.x + ox * 0.35 - tx) * attract.k;
      }
      if (tx !== null) {
        m.vx += (K * (tx - m.x) - C * m.vx) * dt;
        m.x += m.vx * dt;
      }
      m.vrel += (K * 0.8 * (trel - m.rel) - C * m.vrel) * dt;
      m.rel += m.vrel * dt;
      if (m.x < -CFG.trackHalfW + 0.2) { m.x = -CFG.trackHalfW + 0.2; m.vx = Math.abs(m.vx) * 0.3; }
      if (m.x > CFG.trackHalfW - 0.2) { m.x = CFG.trackHalfW - 0.2; m.vx = -Math.abs(m.vx) * 0.3; }

      // 점프 파도
      if (m.jumpIn >= 0) {
        m.jumpIn -= dt;
        if (m.jumpIn < 0) { m.vy = m.jumpV; m.slideT = 0; m.jumpIn = -1; }
      }
      if (m.slideIn >= 0) {
        m.slideIn -= dt;
        if (m.slideIn < 0) { m.slideT = CFG.slideTime; m.slideIn = -1; }
      }
      if (m.slideT > 0) m.slideT = Math.max(0, m.slideT - dt);
      if (m.y > 0 || m.vy > 0) {
        m.vy -= m.g * dt;
        m.y += m.vy * dt;
        if (m.y <= 0) { m.y = 0; m.vy = 0; m.g = CFG.gravity; }
      }
      if (m.born < 1) m.born = Math.min(1, m.born + dt * 3);
      if (m.stag > 0) m.stag -= dt;
      m.ph += dt * (6 + speed * 0.45);
      if (m.x < minX) minX = m.x;
      if (m.x > maxX) maxX = m.x;
      if (m.rel < minRel) minRel = m.rel;
      sumX += m.x;
    }
    this.bounds.minX = minX; this.bounds.maxX = maxX; this.bounds.minRel = minRel;
    this.bounds.cx = n ? sumX / n : 0;

    // 날아가는 멤버
    for (let i = this.flyers.length - 1; i >= 0; i--) {
      const f = this.flyers[i];
      f.life -= dt;
      if (f.life <= 0) { this.flyers.splice(i, 1); continue; }
      f.vy -= 20 * dt;
      f.x += f.vx * dt; f.y += f.vy * dt; f.z += f.vz * dt;
      f.rx += f.vrx * dt; f.rz += f.vrz * dt;
    }
  }

  render(chars, dist, time, boots) {
    const n = this.members.length;
    for (let i = 0; i < n; i++) {
      const m = this.members[i];
      const leader = i === 0;
      const sc = (leader ? 1.25 : 1) * (m.born < 1 ? easeBack(Math.max(0, m.born)) : 1);
      if (sc <= 0.01) continue;
      const gy = this.ground ? this.ground(dist + m.rel) : 0;
      let y = m.y + gy, sx = sc, sy = sc, sz = sc, pitch = 0;
      let limb = m.ph, amp = 0.9;
      if (m.slideT > 0) { sy *= 0.42; sx *= 1.25; sz *= 1.3; pitch = 0; amp = 0.15; }
      else if (m.y <= 0.001) {
        const b = Math.abs(Math.sin(m.ph));
        y += b * 0.14;
        const sq = 1 + (b - 0.5) * 0.12;
        sy *= sq; sx /= Math.sqrt(sq); sz /= Math.sqrt(sq);
      } else {
        sy *= 1.1; sx *= 0.93; pitch = -0.2; limb = 1.2; amp = 1;
      }
      let roll = Math.max(-0.5, Math.min(0.5, -m.vx * 0.05));
      if (m.stag > 0) { roll += Math.sin(m.stag * 30) * 0.45 * m.stag; pitch += 0.3 * m.stag; }
      const col = leader ? this.skin.leader : (boots ? (m.alt ? 0x6aff8a : 0x4ae07a) : this.skin.crew[m.alt ? 1 : 0]);
      chars.push(m.x, y, -(dist + m.rel), 0, sx, sy, sz, col, roll, pitch, true, limb, amp);
      if (leader && this.hat) this.hat.place(m.x, y, -(dist + m.rel), sx, sy, sz, roll, pitch, true);
    }
    if (!n && this.hat) this.hat.place(0, 0, 0, 1, 1, 1, 0, 0, false);
    for (const f of this.flyers) {
      const s = Math.min(1, f.life * 2);
      chars.push(f.x, f.y, f.z, time * 3, s, s, s, f.color, f.rz, f.rx, false);
    }
  }
}

function easeBack(t) {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}
