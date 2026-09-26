// DOM UI: 타이틀(메타 진행), HUD, 일시정지, 부활, 결과, 업그레이드, 컬렉션, 미션, 업적/통계, 테마, 튜토리얼
import { CFG, SKINS, THEMES } from './config.js';
import { save, persist, upgradeCost, ensureDaily, missionText, ACHS, achCount, badges, streakAvailable, STREAK_REWARDS, weeklyState } from './data.js';
import { PU_NAMES } from './entities.js';

const SVG = {
  soundOn: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M3 9h4l5-4v14l-5-4H3z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
  soundOff: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M3 9h4l5-4v14l-5-4H3z"/><path d="M16 9l6 6M22 9l-6 6" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>',
  pause: '<svg viewBox="0 0 24 24" fill="#fff"><rect x="5" y="4" width="5" height="16" rx="1.5"/><rect x="14" y="4" width="5" height="16" rx="1.5"/></svg>',
  hand: '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="28" fill="rgba(255,255,255,.25)"/><path d="M26 50V24a4 4 0 0 1 8 0v12l10 2c3 .6 5 3 4.5 6L46 54H30z" fill="#fff" stroke="#1a2a5a" stroke-width="2.5" stroke-linejoin="round"/></svg>',
  castle: '<svg viewBox="0 0 24 24"><path d="M3 22V8h3v3h3V8h2v3h2V8h2v3h3V8h3v14h-7v-5a2 2 0 0 0-4 0v5z" fill="#8a8fa8" stroke="#fff" stroke-width="1.2"/><path d="M11 2v5l5-2.5z" fill="#ff4a5a"/></svg>',
  up: '<svg viewBox="0 0 24 24"><path d="M12 3l8 9h-5v9H9v-9H4z" fill="#fff"/></svg>',
  skin: '<svg viewBox="0 0 24 24"><rect x="6" y="5" width="12" height="17" rx="6" fill="#fff"/><circle cx="10" cy="11" r="1.6" fill="#223"/><circle cx="14" cy="11" r="1.6" fill="#223"/><path d="M6 6l2-4 3 3 1-3 1 3 3-3 2 4z" fill="#ffd23a"/></svg>',
  mission: '<svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="19" rx="3" fill="#fff"/><path d="M8 9l2 2 4-4M8 15h8" stroke="#2a5ad0" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
  trophy: '<svg viewBox="0 0 24 24"><path d="M7 3h10v5a5 5 0 0 1-10 0z" fill="#fff"/><path d="M7 5H3a4 4 0 0 0 4 5M17 5h4a4 4 0 0 1-4 5" stroke="#fff" stroke-width="2" fill="none"/><path d="M10 13h4v4h3v4H7v-4h3z" fill="#fff"/></svg>',
  map: '<svg viewBox="0 0 24 24"><path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z" fill="#fff"/><path d="M9 3v15M15 6v15" stroke="#2a5ad0" stroke-width="1.5"/></svg>',
};
const PU_CSS = { magnet: '#ff4a6a', shield: '#3ae0ff', boots: '#5aff6a', recruit: '#ffc83a' };
const hex = (n) => '#' + n.toString(16).padStart(6, '0');

const $ = (sel, root = document) => root.querySelector(sel);
const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const fmt = (n) => Math.floor(n).toLocaleString('ko-KR');
const GEM = '<span class="gem-ico"></span>';
const COIN = '<span class="coin-ico"></span>';

export class UI {
  constructor(root, handlers) {
    this.root = root;
    this.hd = handlers;
    this.toastQ = [];
    this.toastBusy = false;
    this.build();
  }

  build() {
    const r = this.root;
    r.innerHTML = '';
    this.hud = h(`<div id="hud" class="hidden">
      <div class="hudtop">
        <div style="display:flex;flex-direction:column;gap:6px">
          <div class="hudbox" id="hDist">0<small>m</small></div>
          <div class="hudbox small" id="hScore">0</div>
        </div>
        <div class="hudbox">${COIN}<span id="hCoins">0</span></div>
        <button class="icon-btn" id="pauseBtn" aria-label="일시정지">${SVG.pause}</button>
      </div>
      <div class="progress"><i id="hProg" style="width:0%"></i><div class="castle">${SVG.castle}</div><div class="lbl" id="hSect">구간 1</div></div>
      <div class="pus" id="hPus"></div>
      <div id="countLbl">0</div>
      <div id="enemyLbls"></div>
    </div>`);
    r.appendChild(this.hud);
    this.fx = h('<div id="fxLayer" style="position:absolute;inset:0"></div>');
    r.appendChild(this.fx);
    this.flashEl = h('<div class="flash"></div>');
    r.appendChild(this.flashEl);

    this.title = h(`<div class="screen" id="title">
      <div class="top">
        <div style="display:flex;gap:8px"><div class="coinpill">${COIN}<span id="tCoins">0</span></div><div class="coinpill">${GEM}<span id="tGems">0</span></div></div>
        <button class="icon-btn" id="tMute" aria-label="음소거"></button>
      </div>
      <div class="logo"><h1>스웜 <span>서퍼</span></h1><div class="sub">SWARM SURFERS</div>
        <div class="records"><div>최고 점수<b id="tBestS">0</b></div><div>최고 거리<b id="tBestD">0m</b></div><div>최고 인원<b id="tBestC">0</b></div></div>
        <button class="streak-btn hidden" id="tStreak"></button>
      </div>
      <div class="spacer"></div>
      <div class="menu">
        <div class="mcard" id="tMcard"></div>
        <button class="btn big gold" id="tStart">달리기 시작</button>
        <button class="btn purple" id="tWeekly"></button>
        <div class="nav">
          <button id="tShop">${SVG.up}<span>업그레이드</span><i class="dot"></i></button>
          <button id="tSkins">${SVG.skin}<span>컬렉션</span><i class="dot"></i></button>
          <button id="tMis">${SVG.mission}<span>미션</span><i class="dot"></i></button>
          <button id="tAch">${SVG.trophy}<span>업적</span><i class="dot"></i></button>
          <button id="tTheme">${SVG.map}<span>테마</span><i class="dot"></i></button>
        </div>
      </div>
    </div>`);
    r.appendChild(this.title);

    const panel = (id, title, body, foot = '') => h(`<div class="screen panel-wrap hidden" id="${id}"><div class="panel"><h2>${title}</h2>${body}<div class="actions">${foot}<button class="btn gray" data-close>닫기</button></div></div></div>`);
    this.shop = panel('shopP', '업그레이드', `<div class="curr"><div class="coinpill">${COIN}<span class="cC">0</span></div></div><div id="upgList"></div>`);
    this.skins = panel('skinP', '컬렉션', `<div class="curr"><div class="coinpill">${GEM}<span class="cG">0</span></div></div><div class="hint">보석은 요새 격파, 미션 배수, 업적, 출석으로 얻어요</div><div id="skinList" class="skingrid"></div>`);
    this.mis = panel('misP', '미션', '<div id="misBody"></div>');
    this.ach = panel('achP', '업적과 통계', '<div class="tabs"><button data-tab="a" class="on">업적</button><button data-tab="s">통계</button></div><div id="achBody"></div>');
    this.theme = panel('themeP', '시작 테마', '<div class="hint">구간을 넘어 새 테마에 도착하면 해금돼요</div><div id="themeList"></div>');
    for (const p of [this.shop, this.skins, this.mis, this.ach, this.theme]) {
      r.appendChild(p);
      $('[data-close]', p).addEventListener('click', (e) => { e.stopPropagation(); this.hd.click(); p.classList.add('hidden'); this.refreshTitle(); });
    }
    this.ach.querySelectorAll('[data-tab]').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); this.hd.click(); this.openAch(b.dataset.tab); }));

    this.pause = h(`<div class="screen panel-wrap hidden"><div class="panel"><h2>일시정지</h2>
      <div class="actions">
        <button class="btn big gold" id="pResume">계속하기</button>
        <button class="btn" id="pRestart">다시 시작</button>
        <button class="btn gray" id="pTitle">타이틀로</button>
        <button class="btn gray" id="pMute">소리</button>
      </div></div></div>`);
    r.appendChild(this.pause);

    this.reviveP = h(`<div class="screen panel-wrap hidden"><div class="panel result">
      <h2>무리가 전멸했어요</h2>
      <div class="lbl">보석으로 한 번 부활할 수 있어요</div>
      <div class="big" style="font-size:40px;margin:10px 0" id="rvCount">10명으로 부활</div>
      <div class="rvbar"><i id="rvBar"></i></div>
      <div class="actions"><button class="btn big purple" id="rvYes"></button><button class="btn gray" id="rvNo">포기하기</button></div>
    </div></div>`);
    r.appendChild(this.reviveP);

    this.over = h(`<div class="screen panel-wrap hidden"><div class="panel result">
      <h2 id="oHead">게임 오버</h2>
      <div class="lbl">점수</div><div class="big" id="oScore">0</div>
      <div class="lbl" id="oMult"></div>
      <div id="oNew"></div><div class="cause" id="oCause"></div>
      <div class="grid">
        <div><span class="lbl">달린 거리</span><b id="oDist">0m</b></div>
        <div><span class="lbl">최고 인원</span><b id="oCount">0</b></div>
        <div><span class="lbl">획득 코인</span><b id="oCoins">0</b></div>
        <div><span class="lbl">부순 요새</span><b id="oFort">0</b></div>
      </div>
      <div class="omis" id="oMis"></div>
      <div class="actions"><button class="btn big gold" id="oRetry">다시 하기</button>
      <div style="display:flex;gap:10px"><button class="btn" id="oShop" style="flex:1">업그레이드</button><button class="btn gray" id="oTitle" style="flex:1">타이틀</button></div></div>
    </div></div>`);
    r.appendChild(this.over);

    const on = (id, fn) => $('#' + id, r).addEventListener('click', (e) => { e.stopPropagation(); this.hd.click(); fn(); });
    on('tStart', () => this.hd.start());
    on('tWeekly', () => this.hd.weekly());
    on('tShop', () => this.openShop());
    on('tSkins', () => this.openSkins());
    on('tMis', () => this.openMissions());
    on('tAch', () => this.openAch('a'));
    on('tTheme', () => this.openThemes());
    on('tMute', () => this.hd.toggleMute());
    on('tStreak', () => { const rw = this.hd.claimStreak(); if (rw) this.toast(`출석 ${save.streak.count}일째 보상: ${rw.c ? '코인 +' + rw.c : '보석 +' + rw.g}`); this.refreshTitle(); });
    on('pauseBtn', () => this.hd.pause());
    on('pResume', () => this.hd.resume());
    on('pRestart', () => this.hd.restart());
    on('pTitle', () => this.hd.toTitle());
    on('pMute', () => this.hd.toggleMute());
    on('rvYes', () => { clearInterval(this.rvTimer); this.hd.revive(); });
    on('rvNo', () => { clearInterval(this.rvTimer); this.hd.giveUp(); });
    on('oRetry', () => this.hd.restart());
    on('oShop', () => this.openShop());
    on('oTitle', () => this.hd.toTitle());
    // UI 위에서 시작된 포인터가 게임 입력으로 새지 않게
    for (const el of r.querySelectorAll('.screen')) el.addEventListener('pointerdown', (e) => e.stopPropagation());

    this.countLbl = $('#countLbl', r);
    this.enemyLbls = $('#enemyLbls', r);
    this.lastCount = -1;
    this.refreshMute();
    this.refreshTitle();
  }

  refreshMute() {
    const m = save.muted;
    $('#tMute', this.root).innerHTML = m ? SVG.soundOff : SVG.soundOn;
    $('#pMute', this.root).textContent = m ? '소리 켜기' : '소리 끄기';
  }

  refreshTitle() {
    const r = this.root;
    $('#tCoins', r).textContent = fmt(save.coins);
    $('#tGems', r).textContent = fmt(save.gems);
    $('#tBestS', r).textContent = fmt(save.bestScore);
    $('#tBestD', r).textContent = fmt(save.bestDist) + 'm';
    $('#tBestC', r).textContent = fmt(save.bestCount);
    const sb = $('#tStreak', r);
    if (streakAvailable()) {
      const y = new Date(); y.setDate(y.getDate() - 1);
      const k = `${y.getFullYear()}-${y.getMonth() + 1}-${y.getDate()}`;
      const day = save.streak.last === k ? save.streak.count + 1 : 1;
      const rw = STREAK_REWARDS[(day - 1) % 7];
      sb.innerHTML = `출석 ${day}일째 보상 받기 ${rw.c ? COIN + '+' + rw.c : GEM + '+' + rw.g}`;
      sb.classList.remove('hidden');
    } else sb.classList.add('hidden');
    // 미션 카드
    const ms = save.mset;
    const pips = [0, 1, 2].map((i) => `<i class="${i < ms.inSet ? 'on' : ''}"></i>`).join('');
    $('#tMcard', r).innerHTML = `<div class="mhead"><span class="mult">x${ms.level}</span><span>미션 배수</span><span class="pips3">${pips}</span></div>` +
      ms.list.map((m) => `<div class="mrow"><span>${missionText(m)}</span><span class="mbar"><i style="width:${Math.min(100, (m.progress / m.target) * 100)}%"></i></span></div>`).join('');
    const w = weeklyState();
    $('#tWeekly', r).innerHTML = w.claimed ? `주간 챌린지 완료! 최고 ${fmt(w.best)}m` : `주간 챌린지 ${fmt(w.target)}m 도전 ${GEM}+5`;
    const b = badges();
    const set = (id, v) => $('#' + id + ' .dot', r).classList.toggle('on', !!v);
    set('tShop', b.shop); set('tSkins', b.skins); set('tMis', b.missions); set('tAch', b.ach); set('tTheme', b.themes);
  }

  show(name) {
    for (const el of this.root.querySelectorAll('.screen')) el.classList.add('hidden');
    this.hud.classList.toggle('hidden', !(name === 'play' || name === 'pause'));
    if (name === 'title') { this.refreshTitle(); this.title.classList.remove('hidden'); }
    if (name === 'pause') this.pause.classList.remove('hidden');
    if (name === 'over') this.over.classList.remove('hidden');
  }

  openShop() {
    const list = $('#upgList', this.shop);
    list.innerHTML = '';
    $('.cC', this.shop).textContent = fmt(save.coins);
    for (const id of Object.keys(CFG.upgrades)) {
      const u = CFG.upgrades[id];
      const lvl = save.upgrades[id] || 0;
      const cost = upgradeCost(id);
      const pips = Array.from({ length: u.max }, (_, i) => `<i class="${i < lvl ? 'on' : ''}"></i>`).join('');
      const row = h(`<div class="upg"><div class="info"><div class="name">${u.name} <small>Lv.${lvl}</small></div><div class="desc">${u.desc(lvl)}${cost != null ? ' → ' + u.desc(lvl + 1) : ''}</div><div class="pips">${pips}</div></div>
        ${cost == null ? '<button class="btn gray" disabled>최대</button>' : `<button class="btn gold" data-upg="${id}" ${save.coins < cost ? 'disabled' : ''}>${COIN}${fmt(cost)}</button>`}</div>`);
      const b = row.querySelector('button');
      b.addEventListener('click', (e) => { e.stopPropagation(); if (this.hd.buy(id)) this.openShop(); });
      list.appendChild(row);
    }
    this.shop.classList.remove('hidden');
  }

  openSkins() {
    const list = $('#skinList', this.skins);
    list.innerHTML = '';
    $('.cG', this.skins).textContent = fmt(save.gems);
    for (const s of SKINS) {
      const owned = save.skins.owned.includes(s.id);
      const sel = save.skins.sel === s.id;
      const card = h(`<div class="skin ${sel ? 'sel' : ''} ${owned ? '' : 'locked'}" data-skin="${s.id}">
        <div class="jel"><i style="background:${hex(s.crew[0])}"></i><i class="ld" style="background:${hex(s.leader)}"></i><i style="background:${hex(s.crew[1])}"></i></div>
        <div class="sn">${s.name}</div><div class="sb">${s.bonus}</div>
        <button class="btn ${sel ? 'gray' : owned ? '' : 'purple'}" ${!owned && save.gems < s.cost ? 'disabled' : ''}>${sel ? '사용 중' : owned ? '선택' : GEM + s.cost}</button></div>`);
      card.querySelector('button').addEventListener('click', (e) => {
        e.stopPropagation(); this.hd.click();
        if (owned) this.hd.selectSkin(s.id);
        else if (this.hd.buySkin(s.id)) this.toast(`${s.name} 해금!`);
        this.openSkins();
      });
      list.appendChild(card);
    }
    this.skins.classList.remove('hidden');
  }

  missionRow(m) {
    const pct = Math.min(100, (m.progress / m.target) * 100);
    return `<div class="mission ${m.done ? 'done' : ''}"><div class="mt"><span>${missionText(m)}</span><span class="rw">+${m.reward}</span></div>
      <div class="bar"><i style="width:${pct}%"></i></div><div class="st">${m.done ? '완료! 보상 지급됨' : `${fmt(m.progress)} / ${fmt(m.target)}`}</div></div>`;
  }

  openMissions() {
    const ms = save.mset;
    const pips = [0, 1, 2].map((i) => `<i class="${i < ms.inSet ? 'on' : ''}"></i>`).join('');
    const days = STREAK_REWARDS.map((rw, i) => {
      const got = save.streak.count > 0 && i < ((save.streak.count - 1) % 7) + 1;
      return `<div class="day ${got ? 'got' : ''}"><small>${i + 1}일</small>${rw.c ? COIN + rw.c : GEM + rw.g}</div>`;
    }).join('');
    $('#misBody', this.mis).innerHTML = `
      <h3>출석 보상 <small>연속 ${save.streak.count}일</small></h3><div class="days">${days}</div>
      ${streakAvailable() ? '<button class="btn gold" id="mStreak" style="width:100%;margin-bottom:8px">오늘 보상 받기</button>' : ''}
      <h3>미션 배수 x${ms.level} <span class="pips3">${pips}</span></h3>
      <div class="hint">3개를 끝낼 때마다 배수가 올라 점수가 늘고 보석을 받아요</div>
      ${ms.list.map((m) => this.missionRow(m)).join('')}
      <h3>일일 미션</h3>${ensureDaily().map((m) => this.missionRow(m)).join('')}
      <div class="hint">매일 자정에 새 일일 미션이 열려요</div>`;
    const sb = $('#mStreak', this.mis);
    if (sb) sb.addEventListener('click', (e) => { e.stopPropagation(); this.hd.click(); const rw = this.hd.claimStreak(); if (rw) this.toast(`출석 보상: ${rw.c ? '코인 +' + rw.c : '보석 +' + rw.g}`); this.openMissions(); });
    this.mis.classList.remove('hidden');
  }

  openAch(tab) {
    this.ach.querySelectorAll('[data-tab]').forEach((b) => b.classList.toggle('on', b.dataset.tab === tab));
    const body = $('#achBody', this.ach);
    if (tab === 'a') {
      save.achSeen = achCount();
      persist();
      body.innerHTML = `<div class="hint">${achCount()} / ${ACHS.length} 달성</div>` + ACHS.map((a) => {
        const done = !!save.ach[a.id];
        const v = Math.min(a.goal, a.v(save));
        return `<div class="achv ${done ? 'done' : ''}"><div class="medal">${done ? '★' : '☆'}</div><div class="info"><div class="name">${a.name}</div><div class="desc">${a.desc}</div>
          <div class="bar"><i style="width:${(v / a.goal) * 100}%"></i></div></div><div class="rw">${GEM}${a.gem}</div></div>`;
      }).join('');
    } else {
      const s = save.stats;
      const rows = [
        ['플레이 횟수', fmt(s.runs) + '판'], ['총 거리', fmt(s.totalDist) + 'm'], ['최고 점수', fmt(save.bestScore)], ['최고 거리', fmt(save.bestDist) + 'm'],
        ['최대 인원', fmt(save.bestCount) + '명'], ['격파한 요새', fmt(s.forts) + '개'], ['한 판 최다 요새', fmt(s.maxFortsRun) + '개'], ['물리친 적', fmt(s.enemies) + '명'],
        ['모은 코인', fmt(s.totalCoins)], ['얻은 보석', fmt(s.gemsEarned)], ['파란 게이트', fmt(s.goodGates) + '번'], ['파워업', fmt(s.powerups) + '개'],
        ['점프', fmt(s.jumps) + '번'], ['슬라이드', fmt(s.slides) + '번'], ['부활', fmt(s.revives) + '번'], ['플레이 시간', Math.floor(s.playTime / 60) + '분'],
        ['미션 배수', 'x' + save.mset.level], ['완료한 미션', fmt(save.mset.done) + '개'], ['보유 스킨', save.skins.owned.length + ' / ' + SKINS.length], ['해금 테마', save.themes.unlocked.length + ' / ' + THEMES.length],
      ];
      body.innerHTML = `<div class="stats">${rows.map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join('')}</div>`;
    }
    this.ach.classList.remove('hidden');
  }

  openThemes() {
    save.themes.seen = save.themes.unlocked.length;
    persist();
    const list = $('#themeList', this.theme);
    list.innerHTML = '';
    THEMES.forEach((t, i) => {
      const un = save.themes.unlocked.includes(i);
      const sel = save.themes.sel === i;
      const row = h(`<div class="themeRow ${un ? '' : 'locked'} ${sel ? 'sel' : ''}"><div class="sw" style="background:linear-gradient(${hex(t.sky)} 50%, ${t.track} 50%)"></div>
        <div class="info"><div class="name">${t.name}</div><div class="desc">${un ? (sel ? '시작 테마로 사용 중' : '해금됨') : '아직 도착하지 못한 곳'}</div></div>
        <button class="btn ${sel ? 'gray' : ''}" ${un ? '' : 'disabled'}>${sel ? '사용 중' : un ? '선택' : '잠김'}</button></div>`);
      row.querySelector('button').addEventListener('click', (e) => { e.stopPropagation(); this.hd.click(); if (un) { this.hd.selectTheme(i); this.openThemes(); } });
      list.appendChild(row);
    });
    this.theme.classList.remove('hidden');
  }

  showRevive(cost, gems) {
    for (const el of this.root.querySelectorAll('.screen')) el.classList.add('hidden');
    $('#rvYes', this.reviveP).innerHTML = `부활하기 ${GEM}${cost} <small style="opacity:.8;font-size:14px">(보유 ${gems})</small>`;
    this.reviveP.classList.remove('hidden');
    let t = 6;
    const bar = $('#rvBar', this.reviveP);
    bar.style.width = '100%';
    clearInterval(this.rvTimer);
    this.rvTimer = setInterval(() => {
      t -= 0.1;
      bar.style.width = Math.max(0, (t / 6) * 100) + '%';
      if (t <= 0) { clearInterval(this.rvTimer); this.hd.giveUp(); }
    }, 100);
  }

  showOver(r) {
    this.reviveP.classList.add('hidden');
    $('#oHead', this.over).textContent = r.head;
    $('#oScore', this.over).textContent = fmt(r.score);
    $('#oMult', this.over).textContent = `거리 ${fmt(r.dist)}m × 미션 배수 x${r.mult}`;
    $('#oDist', this.over).textContent = fmt(r.dist) + 'm';
    $('#oNew', this.over).innerHTML = r.newBest ? '<span class="newbest">최고 점수!</span>' : '';
    $('#oCause', this.over).textContent = r.cause || '';
    $('#oCount', this.over).textContent = fmt(r.maxCount);
    $('#oCoins', this.over).textContent = '+' + fmt(r.coins);
    $('#oFort', this.over).textContent = fmt(r.forts);
    const ms = save.mset;
    $('#oMis', this.over).innerHTML = `<div class="mhead"><span class="mult">x${ms.level}</span><span>다음 미션</span></div>` +
      ms.list.map((m) => `<div class="mrow"><span>${missionText(m)}</span><span class="mbar"><i style="width:${Math.min(100, (m.progress / m.target) * 100)}%"></i></span></div>`).join('');
    this.show('over');
  }

  // ---------- HUD ----------
  setHud(dist, coins, sectFrac, sect, themeName, score, mult) {
    const d = Math.floor(dist);
    if (d !== this._d) { this._d = d; $('#hDist', this.hud).firstChild.nodeValue = fmt(d); }
    if (coins !== this._c) { this._c = coins; $('#hCoins', this.hud).textContent = fmt(coins); }
    if (score !== this._sc) { this._sc = score; $('#hScore', this.hud).textContent = `${fmt(score)} 점 · x${mult}`; }
    $('#hProg', this.hud).style.width = (Math.min(1, sectFrac) * 100).toFixed(1) + '%';
    const s = `구간 ${sect + 1} · ${themeName}`;
    if (s !== this._s) { this._s = s; $('#hSect', this.hud).textContent = s; }
  }

  setCount(n, x, y, visible, hurt) {
    const el = this.countLbl;
    el.style.display = visible ? '' : 'none';
    if (!visible) return;
    el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -100%)`;
    if (n !== this.lastCount) {
      el.textContent = fmt(n);
      if (n > this.lastCount) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
      this.lastCount = n;
    }
    el.classList.toggle('hurt', !!hurt);
  }

  setEnemyLabels(list) {
    const c = this.enemyLbls;
    while (c.children.length < list.length) c.appendChild(h('<div class="enemyLbl"></div>'));
    for (let i = 0; i < c.children.length; i++) {
      const el = c.children[i];
      const it = list[i];
      if (!it) { el.style.display = 'none'; continue; }
      el.style.display = '';
      el.style.transform = `translate(${it.x.toFixed(1)}px, ${it.y.toFixed(1)}px) translate(-50%, -100%)`;
      const t = fmt(it.n);
      if (el.textContent !== t) el.textContent = t;
    }
  }

  setPowerups(list) {
    const c = $('#hPus', this.hud);
    const key = list.map((p) => p.kind).join(',');
    if (key !== this._pk) {
      this._pk = key;
      c.innerHTML = list.map((p) => `<div class="pu"><span class="dot" style="background:${PU_CSS[p.kind]}"></span>${PU_NAMES[p.kind]}<span class="t"><i></i></span></div>`).join('');
    }
    list.forEach((p, i) => { const bar = c.children[i]?.querySelector('i'); if (bar) bar.style.width = (p.frac * 100).toFixed(0) + '%'; });
  }

  banner(text, sub = '') {
    const el = h(`<div class="banner">${text}${sub ? `<small>${sub}</small>` : ''}</div>`);
    this.fx.appendChild(el);
    setTimeout(() => el.remove(), 1900);
  }

  // 토스트는 겹치지 않게 순서대로
  toast(text) {
    this.toastQ.push(text);
    if (!this.toastBusy) this.nextToast();
  }
  nextToast() {
    const text = this.toastQ.shift();
    if (!text) { this.toastBusy = false; return; }
    this.toastBusy = true;
    const el = h(`<div class="toast">${text}</div>`);
    this.root.appendChild(el);
    setTimeout(() => el.remove(), 1950);
    setTimeout(() => this.nextToast(), 2000);
  }

  flash(red = false) {
    const f = this.flashEl;
    f.classList.toggle('red', red);
    f.classList.remove('on'); void f.offsetWidth; f.classList.add('on');
  }

  tutorial(step) {
    const old = $('.tut', this.fx);
    if (old) old.remove();
    if (!step) return;
    const map = {
      lr: ['left', '좌우로 밀어서 레인 이동'],
      up: ['up', '위로 밀면 무리가 파도처럼 점프'],
      down: ['down', '아래로 밀면 슬라이드, 무리가 좁게 뭉침'],
    };
    const [dir, text] = map[step];
    this.fx.appendChild(h(`<div class="tut"><div class="hand ${dir}">${SVG.hand}</div><div class="txt">${text}</div></div>`));
  }
}

