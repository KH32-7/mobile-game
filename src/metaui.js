// 타이틀 화면 + 메타 진행 시트 (강화/스킬/스킨/미션/업적/통계)
import { MAPS, MAP_ORDER, MAX_DIFF, UPGRADES, TIER_REQ, SKILLS, EVOLUTIONS, SKILL_COST, SKINS, ACHIEVEMENTS, STREAK_REWARDS, MISSION_BONUS, DAILY_REWARD, DAILY_GOAL } from './config.js';
import { Meta } from './meta.js';
import { Save } from './save.js';
import { ICONS } from './ui.js';

const S = (inner) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
const NAV_ICONS = {
  upg: S('<path d="M12 20 V5 M6 11 L12 5 L18 11"/><path d="M5 20 H19"/>'),
  skills: S('<path d="M13 2 L5 13 H11 L9 22 L19 10 H13 Z" fill="currentColor"/>'),
  skins: S('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5" fill="currentColor"/>'),
  missions: S('<rect x="4" y="3" width="16" height="18" rx="3"/><path d="M8 9 L10 11 L14 7 M8 16 H16"/>'),
  ach: S('<path d="M7 4 H17 V9 A5 5 0 0 1 7 9 Z" fill="currentColor"/><path d="M7 6 H4 A3 3 0 0 0 7 11 M17 6 H20 A3 3 0 0 1 17 11 M12 14 V18 M8 20 H16"/>'),
  stats: S('<path d="M5 20 V12 M10 20 V6 M15 20 V10 M20 20 V4"/>'),
  lock: S('<rect x="5" y="11" width="14" height="10" rx="2" fill="currentColor"/><path d="M8 11 V8 A4 4 0 0 1 16 8 V11"/>'),
  cal: S('<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M3 10 H21 M8 3 V7 M16 3 V7"/>'),
  close: S('<path d="M6 6 L18 18 M18 6 L6 18"/>'),
};
const coin = (n) => `<span class="cn">${ICONS.coin}${n}</span>`;
const fmtTime = (t) => {
  t = Math.max(0, Math.floor(t));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
};

export class MetaUI {
  constructor(game, root) {
    this.game = game;
    this.root = root;
    const title = root.querySelector('#title');
    title.innerHTML = `
      <div class="title-top">
        <div class="coins" id="coinBox"></div>
        <button class="streak-pill btn" id="streakPill"></button>
        <button class="btn icon" id="btnMute" aria-label="음소거"></button>
      </div>
      <div class="title-wrap">
        <div class="logo">
          <div class="logo-hole"></div>
          <h1>보이드 모</h1>
          <div class="sub">VOID MAW</div>
        </div>
        <div class="map-card" id="mapCard">
          <button class="btn icon arrow" id="mapPrev" aria-label="이전 맵">${S('<path d="M15 5 L8 12 L15 19"/>')}</button>
          <div class="map-info"></div>
          <button class="btn icon arrow" id="mapNext" aria-label="다음 맵">${S('<path d="M9 5 L16 12 L9 19"/>')}</button>
        </div>
        <button class="btn primary big" id="btnStart">플레이</button>
        <button class="btn daily" id="btnDaily"></button>
        <div class="nav">
          <button class="btn nav-b" data-sheet="upg">${NAV_ICONS.upg}<span>강화</span><i class="badge"></i></button>
          <button class="btn nav-b" data-sheet="skills">${NAV_ICONS.skills}<span>스킬</span><i class="badge"></i></button>
          <button class="btn nav-b" data-sheet="skins">${NAV_ICONS.skins}<span>스킨</span><i class="badge"></i></button>
          <button class="btn nav-b" data-sheet="missions">${NAV_ICONS.missions}<span>미션</span><i class="badge"></i></button>
          <button class="btn nav-b" data-sheet="ach">${NAV_ICONS.ach}<span>업적</span><i class="badge"></i></button>
          <button class="btn nav-b" data-sheet="stats">${NAV_ICONS.stats}<span>통계</span><i class="badge"></i></button>
        </div>
      </div>`;
    const sheet = document.createElement('div');
    sheet.id = 'sheet';
    sheet.className = 'screen hidden';
    sheet.innerHTML = `<div class="sheet-panel"><div class="sheet-head"><h2></h2><button class="btn icon" id="sheetClose" aria-label="닫기">${NAV_ICONS.close}</button></div><div class="sheet-body"></div></div>`;
    root.appendChild(sheet);
    const modal = document.createElement('div');
    modal.id = 'modal';
    modal.className = 'screen hidden';
    modal.innerHTML = `<div class="panel modal-panel"></div>`;
    root.appendChild(modal);
    this.sheet = sheet;
    this.modal = modal;
    this.cur = null;

    const $ = (s) => root.querySelector(s);
    const click = (el, fn) =>
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        game.audio.init();
        game.audio.resume();
        game.audio.select();
        fn(e);
      });
    click($('#mapPrev'), () => this.cycleMap(-1));
    click($('#mapNext'), () => this.cycleMap(1));
    click($('#btnDaily'), () => this.open('missions'));
    click($('#streakPill'), () => this.open('missions'));
    click($('#sheetClose'), () => this.close());
    title.querySelectorAll('.nav-b').forEach((b) => click(b, () => this.open(b.dataset.sheet)));
    click($('.map-info'), (e) => {
      const d = e.target.closest('[data-diff]');
      if (!d) return;
      const map = Save.data.maps[Save.data.sel.map];
      const v = +d.dataset.diff;
      if (v <= map.diff) {
        Save.data.sel.diff = v;
        Save.save();
        this.renderTitle();
      } else game.ui.toast(`난이도 ${v - 1} 클리어 시 해금`);
    });
    sheet.addEventListener('click', (e) => {
      const b = e.target.closest('[data-act]');
      if (!b) {
        if (e.target === sheet) this.close();
        return;
      }
      e.stopPropagation();
      game.audio.init();
      this.act(b.dataset.act, b.dataset.id);
    });
    modal.addEventListener('click', (e) => {
      const b = e.target.closest('[data-act]');
      if (!b) return;
      e.stopPropagation();
      game.audio.init();
      this.act(b.dataset.act, b.dataset.id);
    });
  }

  cycleMap(dir) {
    const d = Save.data;
    let i = MAP_ORDER.indexOf(d.sel.map);
    i = (i + dir + MAP_ORDER.length) % MAP_ORDER.length;
    const id = MAP_ORDER[i];
    d.sel.map = id;
    if (d.maps[id].unlocked) d.sel.diff = d.maps[id].diff;
    Save.save();
    if (d.maps[id].unlocked) this.game.setWorld(id);
    this.renderTitle();
  }

  // ---------- 타이틀 ----------
  renderTitle() {
    const d = Save.data;
    const $ = (s) => this.root.querySelector(s);
    $('#coinBox').innerHTML = `${ICONS.coin}<b>${d.coins}</b>`;
    $('#streakPill').innerHTML = `${NAV_ICONS.cal}<b>출석 ${d.streak.count}일째</b>${Meta.streakPending() ? '<i class="dot"></i>' : ''}`;
    const id = d.sel.map;
    const map = MAPS[id];
    const m = d.maps[id];
    const isNew = d.seen.unlocks.includes('map:' + id);
    let html = `<div class="map-art" style="background:${map.art}">${m.unlocked ? '' : `<div class="lock">${NAV_ICONS.lock}</div>`}${isNew ? '<span class="new-tag">NEW</span>' : ''}</div>
      <div class="map-name">${map.name}</div>`;
    if (m.unlocked) {
      html += `<div class="diffs">${Array.from({ length: MAX_DIFF }, (_, k) => {
        const v = k + 1;
        const cls = v === d.sel.diff ? 'sel' : v <= m.diff ? 'open' : 'locked';
        return `<button class="diff ${cls}" data-diff="${v}">${v <= m.clear ? '★' : v}</button>`;
      }).join('')}</div>
      <div class="map-best">${m.best.time ? `최고 ${fmtTime(m.best.time)} · ${m.best.size.toFixed(1)}m` : map.sub}</div>`;
    } else {
      html += `<div class="map-lock">${Meta.mapUnlockText(id)}</div>`;
    }
    $('.map-info').innerHTML = html;
    const start = $('#btnStart');
    start.disabled = !m.unlocked;
    start.classList.toggle('disabled', !m.unlocked);
    start.innerHTML = m.unlocked ? `플레이 <small>난이도 ${d.sel.diff}</small>` : '잠김';

    const ch = Meta.dailyChallenge();
    const c = d.daily.challenge;
    $('#btnDaily').innerHTML = `<span class="dl">데일리 챌린지</span><span class="dm">${MAPS[ch.map].name} · ${ch.mod.name}</span>${c.done ? '<span class="done">완료</span>' : '<i class="badge on">!</i>'}`;

    const badges = {
      upg: UPGRADES.some((u) => (d.upg[u.id] || 0) < u.max && Meta.tierUnlocked(u.tier) && d.coins >= u.cost[d.upg[u.id] || 0]) ? '●' : '',
      skills: Object.entries(SKILL_COST).some(([k, v]) => !d.skills.includes(k) && d.coins >= v) ? '●' : '',
      skins: d.seen.unlocks.some((u) => u.startsWith('skin:')) ? 'NEW' : '',
      missions: Meta.claimableMissions() + (Meta.streakPending() ? 1 : 0) || '',
      ach: d.seen.ach.length || '',
      stats: '',
    };
    this.root.querySelectorAll('#title .nav-b').forEach((b) => {
      const v = badges[b.dataset.sheet];
      const i = b.querySelector('.badge');
      i.textContent = v;
      i.classList.toggle('on', !!v);
    });
    this.game.ui.setMuteIcon(d.muted);
  }

  // 새 알림 모달 (출석 보상 우선)
  maybePopup() {
    const d = Save.data;
    if (Meta.streakPending()) {
      const n = d.streak.count;
      const days = STREAK_REWARDS.map((r, i) => {
        const day = i + 1;
        const cur = ((n - 1) % 7) + 1;
        return `<div class="sday ${day < cur ? 'got' : day === cur ? 'now' : ''}"><small>${day}일</small>${coin(r)}</div>`;
      }).join('');
      this.showModal(`<h2>출석 체크!</h2><div class="modal-sub">${n}일 연속 접속 중</div><div class="sdays">${days}</div>
        <button class="btn primary" data-act="claimStreak">${coin(Meta.streakReward())} 받기</button>`);
      return true;
    }
    return false;
  }

  showModal(html) {
    this.modal.querySelector('.modal-panel').innerHTML = html;
    this.modal.classList.remove('hidden');
  }
  closeModal() {
    this.modal.classList.add('hidden');
  }

  // ---------- 시트 ----------
  open(which) {
    this.cur = which;
    this.sheet.classList.remove('hidden');
    this.renderSheet();
    const d = Save.data;
    if (which === 'ach') d.seen.ach = [];
    if (which === 'skins') d.seen.unlocks = d.seen.unlocks.filter((u) => !u.startsWith('skin:'));
    Save.save();
  }
  close() {
    this.sheet.classList.add('hidden');
    this.cur = null;
    this.renderTitle();
  }

  renderSheet() {
    const d = Save.data;
    const head = this.sheet.querySelector('h2');
    const body = this.sheet.querySelector('.sheet-body');
    const w = this.cur;
    let html = '';
    if (w === 'upg') {
      head.textContent = '영구 강화';
      html += `<div class="sheet-coins">${coin(d.coins)} 보유</div>`;
      for (const tier of [1, 2, 3]) {
        const open = Meta.tierUnlocked(tier);
        const prev = UPGRADES.filter((u) => u.tier === tier - 1).reduce((a, u) => a + (d.upg[u.id] || 0), 0);
        html += `<div class="tier ${open ? '' : 'locked'}"><div class="tier-h">${tier}단계 ${open ? '' : `<small>${NAV_ICONS.lock} ${tier - 1}단계 합계 Lv ${TIER_REQ[tier]} 필요 (${prev}/${TIER_REQ[tier]})</small>`}</div>`;
        for (const u of UPGRADES.filter((x) => x.tier === tier)) {
          const l = d.upg[u.id] || 0;
          const maxed = l >= u.max;
          const cost = maxed ? 0 : u.cost[l];
          const can = open && !maxed && d.coins >= cost;
          const pips = Array.from({ length: u.max }, (_, i) => `<i class="${i < l ? 'on' : ''}"></i>`).join('');
          html += `<div class="row">
            <div class="row-main"><b>${u.name} <small>Lv ${l}/${u.max}</small></b><div class="pips">${pips}</div><small>${maxed ? u.desc(l) : '다음: ' + u.desc(l + 1)}</small></div>
            <button class="btn buy ${can ? 'can' : ''}" data-act="upg" data-id="${u.id}" ${open && !maxed ? '' : 'disabled'}>${maxed ? '최대' : coin(cost)}</button>
          </div>`;
        }
        html += `</div>`;
      }
    } else if (w === 'skills') {
      head.textContent = '스킬 연구소';
      html += `<div class="sheet-coins">${coin(d.coins)} 보유 · 해금한 스킬만 레벨업 카드에 등장</div>`;
      for (const [id, sk] of Object.entries(SKILLS)) {
        const own = d.skills.includes(id);
        const cost = SKILL_COST[id];
        html += `<div class="row ${own ? '' : 'dim'}">
          <div class="ic" style="color:${sk.color}">${ICONS[id]}</div>
          <div class="row-main"><b>${sk.name}</b><small>${sk.desc(1)}</small></div>
          ${own ? '<span class="own">해금됨</span>' : `<button class="btn buy ${d.coins >= cost ? 'can' : ''}" data-act="skill" data-id="${id}">${coin(cost)}</button>`}
        </div>`;
      }
      html += `<div class="tier-h">진화 조합</div>`;
      for (const [id, ev] of Object.entries(EVOLUTIONS)) {
        html += `<div class="row"><div class="ic" style="color:${ev.color}">${ICONS[id]}</div><div class="row-main"><b>${ev.name}</b><small>${ev.from.map((f) => `${SKILLS[f].name} Lv${ev.need[f]}`).join(' + ')}</small></div></div>`;
      }
    } else if (w === 'skins') {
      head.textContent = '홀 스킨';
      html += `<div class="skins">`;
      for (const [id, sk] of Object.entries(SKINS)) {
        const own = d.skins.owned.includes(id);
        const sel = d.skins.sel === id;
        const bg = sk.rainbow
          ? 'radial-gradient(circle,#000 45%,#1a1060 62%,transparent 64%),conic-gradient(#ff6b6b,#ffd24a,#8dff4a,#3ff0ff,#a861ff,#ff8fc8,#ff6b6b)'
          : `radial-gradient(circle,#000 42%,${sk.well} 60%,${sk.rim} 70%,transparent 74%)`;
        let btn;
        if (sel) btn = '<span class="own">장착 중</span>';
        else if (own) btn = `<button class="btn buy can" data-act="skin" data-id="${id}">장착</button>`;
        else if (sk.cost) btn = `<button class="btn buy ${d.coins >= sk.cost ? 'can' : ''}" data-act="skin" data-id="${id}">${coin(sk.cost)}</button>`;
        else btn = `<span class="how">${NAV_ICONS.lock}${sk.how}</span>`;
        html += `<div class="skin ${sel ? 'sel' : ''} ${own ? '' : 'dim'}"><div class="swatch" style="background:${bg}"></div><b>${sk.name}</b>${btn}</div>`;
      }
      html += `</div>`;
    } else if (w === 'missions') {
      head.textContent = '미션 · 출석';
      const n = d.streak.count;
      const cur = ((n - 1) % 7) + 1;
      html += `<div class="tier-h">연속 출석 ${n}일째</div><div class="sdays">${STREAK_REWARDS.map((r, i) => `<div class="sday ${i + 1 < cur || (i + 1 === cur && !Meta.streakPending()) ? 'got' : i + 1 === cur ? 'now' : ''}"><small>${i + 1}일</small>${coin(r)}</div>`).join('')}</div>`;
      if (Meta.streakPending()) html += `<button class="btn primary wide" data-act="claimStreak">출석 보상 받기</button>`;
      html += `<div class="tier-h">오늘의 미션 <small>자정에 갱신</small></div>`;
      d.daily.missions.forEach((m, i) => {
        const done = m.prog >= m.target;
        const pct = Math.min(100, (m.prog / m.target) * 100);
        html += `<div class="row">
          <div class="row-main"><b>${Meta.missionText(m)}</b><div class="prog"><div style="width:${pct}%"></div></div><small>${Math.min(m.prog, m.target) | 0} / ${m.target}</small></div>
          ${m.claimed ? '<span class="own">완료</span>' : `<button class="btn buy ${done ? 'can' : ''}" data-act="mission" data-id="${i}" ${done ? '' : 'disabled'}>${coin(m.reward)}</button>`}
        </div>`;
      });
      const allDone = d.daily.missions.every((m) => m.claimed);
      html += `<div class="row"><div class="row-main"><b>미션 3개 모두 완료 보너스</b></div>${d.daily.bonusClaimed ? '<span class="own">완료</span>' : `<button class="btn buy ${allDone ? 'can' : ''}" data-act="bonus" ${allDone ? '' : 'disabled'}>${coin(MISSION_BONUS)}</button>`}</div>`;
      const ch = Meta.dailyChallenge();
      const c = d.daily.challenge;
      html += `<div class="tier-h">데일리 챌린지 <small>날짜 시드 맵</small></div>
        <div class="challenge"><div class="map-art sm" style="background:${MAPS[ch.map].art}"></div>
        <div class="row-main"><b>${MAPS[ch.map].name} · ${ch.mod.name}</b><small>${ch.mod.desc}<br>목표: ${DAILY_GOAL / 60}분 생존 또는 메카 격파 · 보상 ${DAILY_REWARD} 코인</small><small>오늘 최고 ${fmtTime(c.best)} ${c.done ? '· 완료!' : ''}</small></div></div>
        <button class="btn primary wide" data-act="daily">도전하기</button>`;
    } else if (w === 'ach') {
      const got = ACHIEVEMENTS.filter((a) => d.ach[a.id]).length;
      head.textContent = `업적 ${got}/${ACHIEVEMENTS.length}`;
      for (const a of ACHIEVEMENTS) {
        const ok = !!d.ach[a.id];
        const skin = Object.entries(SKINS).find(([, s]) => s.ach === a.id);
        html += `<div class="row ${ok ? '' : 'dim'}"><div class="ic ${ok ? 'gold' : ''}">${NAV_ICONS.ach}</div>
          <div class="row-main"><b>${a.name}</b><small>${a.desc}${skin ? ` · 스킨 "${skin[1].name}"` : ''}</small></div>
          <span class="${ok ? 'own' : 'how'}">${ok ? '달성' : coin(a.reward)}</span></div>`;
      }
    } else if (w === 'stats') {
      head.textContent = '통계';
      const s = d.stats;
      const rows = [
        ['총 플레이', `${s.runs}판`],
        ['총 플레이 시간', fmtTime(s.playTime)],
        ['총 삼킨 수', s.swallowed.toLocaleString()],
        ['총 처치', s.kills.toLocaleString()],
        ['최장 생존', fmtTime(s.bestTime)],
        ['최대 크기', `${s.maxSize.toFixed(1)}m`],
        ['최고 콤보', `x${s.maxCombo}`],
        ['최고 레벨', `Lv ${s.maxLevel}`],
        ['메카 격파', `${s.bossKills}회`],
        ['미니보스 처치', `${s.miniKills}회`],
        ['스킬 진화', `${s.evolutions}회`],
        ['데일리 챌린지 완료', `${s.dailyClears}회`],
        ['최장 연속 출석', `${s.bestStreak}일`],
        ['누적 획득 코인', s.coinsEarned.toLocaleString()],
      ];
      html += `<div class="stat-grid">${rows.map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join('')}</div>`;
      html += `<div class="tier-h">맵별 기록</div>`;
      for (const id of MAP_ORDER) {
        const m = d.maps[id];
        html += `<div class="row ${m.unlocked ? '' : 'dim'}"><div class="map-art sm" style="background:${MAPS[id].art}"></div><div class="row-main"><b>${MAPS[id].name}</b><small>${m.unlocked ? `최고 ${fmtTime(m.best.time)} · ${m.best.size.toFixed(1)}m · 처치 ${m.best.kills} · 클리어 난이도 ${m.clear || '-'}` : '잠김'}</small></div></div>`;
      }
    }
    body.innerHTML = html;
  }

  act(a, id) {
    const g = this.game;
    const d = Save.data;
    let err = null;
    let got = 0;
    if (a === 'upg') err = Meta.buyUpgrade(id);
    else if (a === 'skill') err = Meta.buySkill(id);
    else if (a === 'skin') {
      err = Meta.buySkin(id);
      if (!err) g.applySkin();
    } else if (a === 'mission') got = Meta.claimMission(+id);
    else if (a === 'bonus') got = Meta.claimMissionBonus();
    else if (a === 'claimStreak') {
      got = Meta.claimStreak();
      this.closeModal();
    } else if (a === 'daily') {
      this.close();
      g.startRun({ daily: true });
      return;
    } else if (a === 'closeModal') {
      this.closeModal();
    }
    if (err) {
      g.audio.hurt();
      g.ui.toast(err);
    } else if (a !== 'closeModal') {
      g.audio.levelUp();
      if (got) g.ui.toast(`+${got} 코인!`);
    }
    const newAch = Meta.checkAchievements();
    if (newAch.length) {
      Save.save();
      g.ui.toast(`업적 달성: ${newAch.map((x) => x.name).join(', ')}`);
    }
    if (this.cur) this.renderSheet();
    this.renderTitle();
    void d;
  }
}
