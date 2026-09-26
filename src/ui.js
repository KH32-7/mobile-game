// DOM UI: 타이틀(메타 진행), HUD, 일시정지, 부활, 결과, 업그레이드, 컬렉션, 미션, 업적/통계, 테마, 튜토리얼
import { CFG, SKINS, THEMES } from './config.js';
import { save, persist, upgradeCost, ensureDaily, missionText, ACHS, achCount, achGem, badges, streakAvailable, STREAK_REWARDS, weeklyState, features, newFeatures, skinLv, skinUpCost, perkScale, SKIN_MAX_LV, SKIN_UNLOCK_FRAGS } from './data.js';
import { SkinPreview } from './preview.js';
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
  close: '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>',
  music: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M9 17V5l11-2v12"/><circle cx="6.5" cy="17.5" r="3"/><circle cx="17.5" cy="15.5" r="3"/></svg>',
  map: '<svg viewBox="0 0 24 24"><path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z" fill="#fff"/><path d="M9 3v15M15 6v15" stroke="#2a5ad0" stroke-width="1.5"/></svg>',
};
const PU_CSS = { magnet: '#ff4a6a', shield: '#3ae0ff', boots: '#5aff6a', recruit: '#ffc83a' };
const hex = (n) => '#' + n.toString(16).padStart(6, '0');

const $ = (sel, root = document) => root.querySelector(sel);
const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const fmt = (n) => Math.floor(n).toLocaleString('ko-KR');
const GEM = '<span class="gem-ico"></span>';
const COIN = '<span class="coin-ico"></span>';

const FEAT_NAMES = { records: '기록', missions: '미션', shop: '업그레이드', skins: '컬렉션', ach: '업적', weekly: '주간 챌린지', themes: '테마' };

export class UI {
  constructor(root, handlers) {
    this.root = root;
    this.hd = handlers;
    this.toastQ = [];
    this.toastBusy = false;
    this.hold = false;
    this.preview = null;
    this.skinFocus = null;
    this.confirmBuy = null;
    this.build();
  }

  build() {
    const r = this.root;
    r.innerHTML = '';
    this.hud = h(`<div id="hud" class="hidden">
      <div class="hudtop">
        <div class="hudbox dist"><div><span id="hDist">0</span><small>m</small></div><div class="sc" id="hScore">0</div></div>
        <div class="hudbox" id="hCoinBox">${COIN}<span id="hCoins">0</span></div>
        <button class="icon-btn" id="pauseBtn" aria-label="일시정지">${SVG.pause}</button>
      </div>
      <div class="progress"><i id="hProg" style="width:0%"></i><div class="castle">${SVG.castle}</div><div class="lbl" id="hSect">구간 1</div></div>
      <div class="pus" id="hPus"></div>
      <div class="combo hidden" id="combo"></div>
      <div id="countLbl">0</div>
      <div id="enemyLbls"></div>
      <div class="battleHint hidden" id="bHint"><b>탭 연타!</b> 돌격 속도 UP<div class="rushbar"><i id="rushBar"></i></div></div>
      <div class="cdown hidden" id="cdown">3</div>
    </div>`);
    r.appendChild(this.hud);
    this.fx = h('<div id="fxLayer" style="position:absolute;inset:0"></div>');
    r.appendChild(this.fx);
    this.flashEl = h('<div class="flash"></div>');
    r.appendChild(this.flashEl);

    this.title = h(`<div class="screen" id="title">
      <div class="top">
        <div style="display:flex;gap:8px"><div class="coinpill">${COIN}<span id="tCoins">0</span></div><div class="coinpill" id="tGemPill">${GEM}<span id="tGems">0</span></div></div>
        <div style="display:flex;gap:6px"><button class="icon-btn" id="tMusic" aria-label="배경음"></button><button class="icon-btn" id="tMute" aria-label="효과음"></button></div>
      </div>
      <div class="logo"><h1>스웜 <span>서퍼</span></h1><div class="sub">SWARM SURFERS</div>
        <div class="records" id="tRecords"><div>최고 점수<b id="tBestS">0</b></div><div>최고 거리<b id="tBestD">0m</b></div><div>최고 인원<b id="tBestC">0</b></div></div>
        <button class="streak-btn hidden" id="tStreak"></button>
      </div>
      <div class="spacer"></div>
      <div class="menu">
        <div class="mcard" id="tMcard"></div>
        <button class="btn big gold" id="tStart">달리기 시작</button>
        <button class="btn purple" id="tWeekly"></button>
        <div class="nav" id="tNav">
          <button id="tShop" data-f="shop">${SVG.up}<span>업그레이드</span><i class="dot"></i><em>NEW</em></button>
          <button id="tSkins" data-f="skins">${SVG.skin}<span>컬렉션</span><i class="dot"></i><em>NEW</em></button>
          <button id="tMis" data-f="missions">${SVG.mission}<span>미션</span><i class="dot"></i><em>NEW</em></button>
          <button id="tAch" data-f="ach">${SVG.trophy}<span>업적</span><i class="dot"></i><em>NEW</em></button>
          <button id="tTheme" data-f="themes">${SVG.map}<span>테마</span><i class="dot"></i><em>NEW</em></button>
        </div>
      </div>
    </div>`);
    r.appendChild(this.title);

    const panel = (id, title, body) => h(`<div class="screen panel-wrap sub hidden" id="${id}"><div class="panel"><button class="xbtn" data-close aria-label="닫기">${SVG.close}</button><h2>${title}</h2>${body}</div></div>`);
    this.shop = panel('shopP', '업그레이드', `<div class="curr"><div class="coinpill">${COIN}<span class="cC">0</span></div></div><div id="upgList"></div>`);
    this.skins = panel('skinP', '컬렉션', `<div class="curr"><div class="coinpill">${GEM}<span class="cG">0</span></div></div><div class="pvwrap" id="pvHost"></div><div class="pvinfo" id="pvInfo"></div><div class="hint">보석이나 조각 ${SKIN_UNLOCK_FRAGS}개로 해금, 조각을 모아 레벨업하면 보너스가 커져요</div><div id="skinList" class="skingrid"></div>`);
    this.mis = panel('misP', '미션', '<div id="misBody"></div>');
    this.ach = panel('achP', '업적과 통계', '<div class="tabs"><button data-tab="a" class="on">업적</button><button data-tab="s">통계</button></div><div id="achBody"></div>');
    this.theme = panel('themeP', '시작 테마', '<div class="hint">각 테마에서 요새를 3개 부수면 시작 테마로 고를 수 있어요</div><div id="themeList"></div>');
    for (const p of [this.shop, this.skins, this.mis, this.ach, this.theme]) {
      r.appendChild(p);
      $('[data-close]', p).addEventListener('click', (e) => { e.stopPropagation(); this.hd.click(); this.closePanel(p); });
    }
    this.ach.querySelectorAll('[data-tab]').forEach((b) => b.addEventListener('click', (e) => { e.stopPropagation(); this.hd.click(); this.openAch(b.dataset.tab); }));

    this.pause = h(`<div class="screen panel-wrap hidden" id="pauseP"><div class="panel"><h2>일시정지</h2>
      <div class="actions">
        <button class="btn big gold" id="pResume">계속하기</button>
        <button class="btn" id="pRestart">다시 시작</button>
        <button class="btn gray" id="pTitle">타이틀로</button>
        <div class="toggles"><button class="btn gray" id="pMusic">배경음</button><button class="btn gray" id="pMute">효과음</button></div>
      </div></div></div>`);
    r.appendChild(this.pause);

    this.reviveP = h(`<div class="screen panel-wrap hidden" id="reviveP"><div class="panel result">
      <h2>무리가 전멸했어요</h2>
      <div class="lbl" id="rvSub">보석으로 부활할 수 있어요</div>
      <div class="rvbig">10명으로 부활</div>
      <div class="rvbar"><i id="rvBar"></i></div>
      <div class="actions"><button class="btn big purple rvbtn" id="rvYes"></button><div class="rvcap" id="rvCap"></div><button class="btn gray" id="rvNo">포기하기</button></div>
    </div></div>`);
    r.appendChild(this.reviveP);

    this.over = h(`<div class="screen panel-wrap hidden" id="overP"><div class="panel result">
      <h2 id="oHead">게임 오버</h2>
      <div class="lbl">총점</div><div class="big" id="oScore">0</div>
      <div class="split"><div><span>거리 점수</span><b id="oDS">0</b><small id="oMult"></small></div><div><span>무리 점수</span><b id="oCS">0</b><small>요새 격파 시 인원 x 구간 x 10</small></div></div>
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
    on('tMute', () => this.hd.toggleSfx());
    on('tMusic', () => this.hd.toggleMusic());
    on('tStreak', () => { const rw = this.hd.claimStreak(); if (rw) this.toast(`출석 ${save.streak.count}일째 보상: ${this.rwText(rw)}`); this.refreshTitle(); });
    on('pauseBtn', () => this.hd.pause());
    on('pResume', () => this.hd.resume());
    on('pRestart', () => this.hd.restart());
    on('pTitle', () => this.hd.toTitle());
    on('pMute', () => this.hd.toggleSfx());
    on('pMusic', () => this.hd.toggleMusic());
    on('rvYes', () => this.hd.revive());
    on('rvNo', () => this.hd.giveUp());
    on('oRetry', () => this.hd.restart());
    on('oShop', () => this.openShop());
    on('oTitle', () => this.hd.toTitle());
    for (const el of r.querySelectorAll('.screen')) el.addEventListener('pointerdown', (e) => e.stopPropagation());

    this.countLbl = $('#countLbl', r);
    this.enemyLbls = $('#enemyLbls', r);
    this.lastCount = -1;
    this.refreshMute();
    this.refreshTitle();
  }

  rwText(rw) { return rw.c ? `코인 +${rw.c}` : rw.g ? `보석 +${rw.g}` : rw.frag ? `${rw.frag.name} 조각 +${rw.frag.n}` : '조각'; }

  closePanel(p) {
    p.classList.add('hidden');
    if (p === this.skins && this.preview) this.preview.stop();
    if (!this.title.classList.contains('hidden')) this.refreshTitle();
  }

  refreshMute() {
    $('#tMute', this.root).innerHTML = save.muteSfx ? SVG.soundOff : SVG.soundOn;
    $('#tMusic', this.root).innerHTML = SVG.music;
    $('#tMusic', this.root).classList.toggle('off', save.muteMusic);
    $('#pMute', this.root).textContent = save.muteSfx ? '효과음 켜기' : '효과음 끄기';
    $('#pMusic', this.root).textContent = save.muteMusic ? '배경음 켜기' : '배경음 끄기';
  }

  refreshTitle() {
    const r = this.root;
    const F = features();
    $('#tCoins', r).textContent = fmt(save.coins);
    $('#tGems', r).textContent = fmt(save.gems);
    $('#tGemPill', r).classList.toggle('hidden', !F.skins);
    $('#tBestS', r).textContent = fmt(save.bestScore);
    $('#tBestD', r).textContent = fmt(save.bestDist) + 'm';
    $('#tBestC', r).textContent = fmt(save.bestCount);
    $('#tRecords', r).classList.toggle('hidden', !F.records);
    const sb = $('#tStreak', r);
    if (F.missions && streakAvailable()) {
      const y = new Date(); y.setDate(y.getDate() - 1);
      const k = `${y.getFullYear()}-${y.getMonth() + 1}-${y.getDate()}`;
      const day = save.streak.last === k ? save.streak.count + 1 : 1;
      const rw = STREAK_REWARDS[(day - 1) % 7];
      sb.innerHTML = `출석 ${day}일째 보상 받기 ${rw.c ? COIN + '+' + rw.c : rw.g ? GEM + '+' + rw.g : '스킨 조각 +' + rw.f}`;
      sb.classList.remove('hidden');
    } else sb.classList.add('hidden');
    const ms = save.mset;
    const pips = [0, 1, 2].map((i) => `<i class="${i < ms.inSet ? 'on' : ''}"></i>`).join('');
    const mc = $('#tMcard', r);
    mc.classList.toggle('hidden', !F.missions);
    mc.innerHTML = `<div class="mhead"><span class="mult">x${ms.level}</span><span>미션 배수</span><span class="pips3">${pips}</span></div>` +
      ms.list.map((m) => `<div class="mrow"><span>${missionText(m)}</span><span class="mbar"><i style="width:${Math.min(100, (m.progress / m.target) * 100)}%"></i></span></div>`).join('');
    const w = weeklyState();
    const wb = $('#tWeekly', r);
    wb.classList.toggle('hidden', !F.weekly);
    wb.innerHTML = w.claimed ? `주간 챌린지 완료! 최고 ${fmt(w.best)}m` : `주간 챌린지 ${fmt(w.target)}m 도전 ${GEM}+2`;
    const nav = $('#tNav', r);
    let anyNav = false;
    nav.querySelectorAll('button').forEach((b) => { const on = !!F[b.dataset.f]; b.classList.toggle('hidden', !on); anyNav ||= on; });
    nav.classList.toggle('hidden', !anyNav);
    nav.style.gridTemplateColumns = `repeat(${Math.max(1, nav.querySelectorAll('button:not(.hidden)').length)}, 1fr)`;
    const b = badges();
    const set = (id, v) => $('#' + id + ' .dot', r).classList.toggle('on', !!v);
    set('tShop', b.shop); set('tSkins', b.skins); set('tMis', b.missions); set('tAch', b.ach); set('tTheme', b.themes);
    // 새로 열린 기능 연출
    const fresh = newFeatures().slice(0, 2); // NEW 표시는 최대 2개
    for (const k of fresh) {
      const btn = nav.querySelector(`[data-f="${k}"]`);
      if (btn) btn.classList.add('fresh');
      if (k === 'records') $('#tRecords', r).classList.add('reveal');
      if (k === 'weekly') wb.classList.add('reveal');
    }
    const named = fresh.filter((k) => FEAT_NAMES[k] && k !== 'records');
    if (named.length) this.toast(`새 기능 열림: ${named.map((k) => FEAT_NAMES[k]).join(', ')}`);
  }

  show(name) {
    for (const el of this.root.querySelectorAll('.screen')) el.classList.add('hidden');
    if (this.preview) this.preview.stop();
    this.hud.classList.toggle('hidden', !(name === 'play' || name === 'pause'));
    if (name === 'title') { this.title.classList.remove('hidden'); this.refreshTitle(); }
    if (name === 'pause') this.pause.classList.remove('hidden');
    if (name === 'over') this.over.classList.remove('hidden');
    this.root.classList.toggle('playing', name === 'play');
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

  // ---------- 컬렉션 ----------
  openSkins() {
    if (!this.preview) { try { this.preview = new SkinPreview(); } catch (e) { this.preview = null; } }
    if (!this.skinFocus) this.skinFocus = save.skins.sel;
    this.renderSkins();
    this.skins.classList.remove('hidden');
    const sk = SKINS.find((s) => s.id === this.skinFocus) || SKINS[0];
    if (this.preview) this.preview.start($('#pvHost', this.skins), sk);
  }

  renderSkins() {
    const list = $('#skinList', this.skins);
    list.innerHTML = '';
    $('.cG', this.skins).textContent = fmt(save.gems);
    const focus = SKINS.find((s) => s.id === this.skinFocus) || SKINS[0];
    const flv = skinLv(focus.id);
    const owned0 = save.skins.owned.includes(focus.id);
    $('#pvInfo', this.skins).innerHTML = `<b>${focus.name}</b> ${owned0 ? `<span class="lv">Lv.${flv}</span>` : '<span class="lv lock">잠김</span>'}<div>${focus.bonus}${owned0 && flv > 1 ? ` <small>(보너스 x${perkScale(focus.id).toFixed(2)})</small>` : ''}</div>`;
    if (this.preview) this.preview.setSkin(focus);
    for (const s of SKINS) {
      const owned = save.skins.owned.includes(s.id);
      const sel = save.skins.sel === s.id;
      const lv = skinLv(s.id);
      const frags = save.skins.frags[s.id] || 0;
      const need = owned ? skinUpCost(s.id) : SKIN_UNLOCK_FRAGS;
      const thumb = this.preview ? this.preview.thumb(s) : '';
      let btn = '';
      if (owned) {
        btn = `<button class="btn ${sel ? 'gray' : ''}" data-a="sel">${sel ? '사용 중' : '선택'}</button>`;
        if (s.id === 'basic') btn += '<div class="maxlv">보너스 없음</div>';
        else if (need != null) btn += `<button class="btn gold small" data-a="up" ${frags >= need ? '' : 'disabled'}>레벨업 ${frags}/${need}</button>`;
        else btn += '<div class="maxlv">최대 레벨</div>';
      } else {
        const confirm = this.confirmBuy === s.id;
        btn = `<button class="btn ${confirm ? 'red' : 'purple'}" data-a="buy" ${save.gems < s.cost ? 'disabled' : ''}>${confirm ? `정말 구매? ${GEM}${s.cost}` : GEM + s.cost}</button>`;
        btn += `<button class="btn gold small" data-a="frag" ${frags >= SKIN_UNLOCK_FRAGS ? '' : 'disabled'}>조각 ${frags}/${SKIN_UNLOCK_FRAGS}</button>`;
      }
      const card = h(`<div class="skin ${sel ? 'sel' : ''} ${owned ? '' : 'locked'} ${this.skinFocus === s.id ? 'focus' : ''}" data-skin="${s.id}">
        ${thumb ? `<img class="thumb" src="${thumb}" alt="">` : `<div class="jel"><i style="background:${hex(s.crew[0])}"></i><i class="ld" style="background:${hex(s.leader)}"></i><i style="background:${hex(s.crew[1])}"></i></div>`}
        <div class="sn">${s.name}${owned ? ` <small>Lv.${lv}</small>` : ''}</div><div class="sb">${s.bonus}</div>${btn}</div>`);
      card.addEventListener('click', (e) => {
        e.stopPropagation();
        const a = e.target.closest('button')?.dataset.a;
        this.hd.click();
        if (a !== 'buy') this.confirmBuy = null;
        if (a === 'sel') this.hd.selectSkin(s.id);
        else if (a === 'up') { if (this.hd.levelUpSkin(s.id)) this.toast(`${s.name} Lv.${skinLv(s.id)}!`); }
        else if (a === 'frag') { if (this.hd.unlockFrags(s.id)) this.toast(`${s.name} 해금!`); }
        else if (a === 'buy') {
          if (this.confirmBuy === s.id) { this.confirmBuy = null; if (this.hd.buySkin(s.id)) this.toast(`${s.name} 해금!`); }
          else this.confirmBuy = s.id; // 같은 버튼을 한 번 더 누르면 구매, 다른 카드를 누르면 취소
        }
        this.skinFocus = s.id;
        this.renderSkins();
      });
      list.appendChild(card);
    }
  }

  missionRow(m) {
    const pct = Math.min(100, (m.progress / m.target) * 100);
    return `<div class="mission ${m.done ? 'done' : ''}"><div class="mt"><span>${missionText(m)}</span><span class="rw">+${Math.round(m.reward)}</span></div>
      <div class="bar"><i style="width:${pct}%"></i></div><div class="st">${m.done ? '완료! 보상 지급됨' : `${fmt(m.progress)} / ${fmt(m.target)}`}</div></div>`;
  }

  openMissions() {
    const ms = save.mset;
    const pips = [0, 1, 2].map((i) => `<i class="${i < ms.inSet ? 'on' : ''}"></i>`).join('');
    const days = STREAK_REWARDS.map((rw, i) => {
      const got = save.streak.count > 0 && i < ((save.streak.count - 1) % 7) + 1;
      return `<div class="day ${got ? 'got' : ''}"><small>${i + 1}일</small>${rw.c ? COIN + rw.c : rw.g ? GEM + rw.g : '조각' + rw.f}</div>`;
    }).join('');
    $('#misBody', this.mis).innerHTML = `
      <h3>출석 보상 <small>연속 ${save.streak.count}일</small></h3><div class="days">${days}</div>
      ${streakAvailable() ? '<button class="btn gold" id="mStreak" style="width:100%;margin-bottom:8px">오늘 보상 받기</button>' : ''}
      <h3>미션 배수 x${ms.level} <span class="pips3">${pips}</span></h3>
      <div class="hint">3개를 끝낼 때마다 배수가 올라 거리 점수가 늘어요</div>
      ${ms.list.map((m) => this.missionRow(m)).join('')}
      <h3>일일 미션</h3>${ensureDaily().map((m) => this.missionRow(m)).join('')}
      <div class="hint">매일 자정에 새 일일 미션이 열려요</div>`;
    const sb = $('#mStreak', this.mis);
    if (sb) sb.addEventListener('click', (e) => { e.stopPropagation(); this.hd.click(); const rw = this.hd.claimStreak(); if (rw) this.toast(`출석 보상: ${this.rwText(rw)}`); this.openMissions(); });
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
          <div class="bar"><i style="width:${(v / a.goal) * 100}%"></i></div></div><div class="rw">${GEM}${achGem(a)}</div></div>`;
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
        <div class="info"><div class="name">${t.name}</div><div class="desc">${un ? (sel ? '시작 테마로 사용 중' : '해금됨') : `이 테마에서 요새 ${(save.themes.forts || {})[i] || 0}/3 격파하면 해금`}</div></div>
        <button class="btn ${sel ? 'gray' : ''}" ${un ? '' : 'disabled'}>${sel ? '사용 중' : un ? '선택' : '잠김'}</button></div>`);
      row.querySelector('button').addEventListener('click', (e) => { e.stopPropagation(); this.hd.click(); if (un) { this.hd.selectTheme(i); this.openThemes(); } });
      list.appendChild(row);
    });
    this.theme.classList.remove('hidden');
  }

  showRevive(cost, gems, nth) {
    for (const el of this.root.querySelectorAll('.screen')) el.classList.add('hidden');
    $('#rvYes', this.reviveP).innerHTML = `부활하기 ${GEM}${cost}`;
    $('#rvCap', this.reviveP).textContent = `보유 보석 ${fmt(gems)}개`;
    $('#rvSub', this.reviveP).textContent = nth > 1 ? `${nth}번째 부활, 비용이 올라가요` : '보석으로 부활할 수 있어요';
    this.reviveBar(1);
    this.reviveP.classList.remove('hidden');
  }
  reviveBar(f) { $('#rvBar', this.reviveP).style.width = (f * 100).toFixed(1) + '%'; }

  showOver(r) {
    this.reviveP.classList.add('hidden');
    $('#oHead', this.over).textContent = r.head;
    $('#oScore', this.over).textContent = fmt(r.score);
    $('#oDS', this.over).textContent = fmt(r.distScore);
    $('#oCS', this.over).textContent = fmt(r.crowdScore);
    $('#oMult', this.over).textContent = `${fmt(r.dist)}m x 배수 x${r.mult}`;
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
    if (d !== this._d) { this._d = d; $('#hDist', this.hud).textContent = fmt(d); }
    if (coins !== this._c) { this._c = coins; $('#hCoins', this.hud).textContent = fmt(coins); }
    if (score !== this._sc) { this._sc = score; $('#hScore', this.hud).textContent = `${fmt(score)}점 · x${mult}`; }
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
      const html = it.danger ? `<span class="warn">피하세요!</span>${t}` : t;
      if (el._h !== html) { el._h = html; el.innerHTML = html; }
      el.classList.toggle('danger', !!it.danger);
      if (it.hit) { el.classList.remove('hit'); void el.offsetWidth; el.classList.add('hit'); }
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

  battleHint(on) {
    const up = !!$('.tut', this.fx);
    if (on === this._bh && up === this._bhUp) return;
    this._bh = on; this._bhUp = up;
    const b = $('#bHint', this.hud);
    b.classList.toggle('hidden', !on);
    b.classList.toggle('up', up);
  }
  rushPulse() {
    const b = $('#bHint', this.hud);
    b.classList.remove('pulse'); void b.offsetWidth; b.classList.add('pulse');
    const bar = $('#rushBar', this.hud);
    this._rush = Math.min(1, (this._rush || 0) + 0.2);
    bar.style.width = this._rush * 100 + '%';
    clearTimeout(this._rushT);
    this._rushT = setTimeout(() => { this._rush = 0; bar.style.width = '0%'; }, 1200);
  }

  countdown(n) {
    const el = $('#cdown', this.hud);
    el.classList.toggle('hidden', !n);
    if (n) { el.textContent = n; el.classList.remove('go'); void el.offsetWidth; el.classList.add('go'); }
  }

  stamp(text, good) {
    const el = h(`<div class="stamp ${good ? '' : 'bad'}">${text}!</div>`);
    this.fx.appendChild(el);
    setTimeout(() => el.remove(), 900);
  }

  crowdBonus(n) {
    const el = h(`<div class="crowdBonus">무리 보너스 <b>+0</b></div>`);
    this.fx.appendChild(el);
    const b = el.querySelector('b');
    const t0 = performance.now();
    const tick = (now) => {
      const k = Math.min(1, (now - t0) / 900);
      b.textContent = '+' + fmt(n * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    setTimeout(() => el.remove(), 2600);
  }

  rewardCard(r) {
    const el = h(`<div class="reward"><div class="rt">요새 격파!</div><div class="rm">x${r.mult}</div>
      <div class="rr">${COIN}<b>+${fmt(r.coins)}</b></div>${r.gems ? `<div class="rr">${GEM}<b>+${r.gems}</b></div>` : ''}${r.frag ? `<div class="rf">${r.frag.name} 조각 +${r.frag.n}</div>` : ''}</div>`);
    el.insertAdjacentHTML('beforeend', '<div class="rtap">탭해서 계속</div>');
    this.fx.appendChild(el);
    this.rewardEl = el;
  }
  closeReward() {
    const el = this.rewardEl;
    if (!el) return;
    this.rewardEl = null;
    el.classList.add('out');
    setTimeout(() => el.remove(), 400);
  }

  combo(n, mult) {
    const el = $('#combo', this.hud);
    if (!n) { el.classList.add('hidden'); return; }
    el.classList.remove('hidden');
    el.innerHTML = `콤보 <b>${n}</b> <small>점수 x${mult.toFixed(2)}</small>`;
    el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump');
  }

  // 화면 중앙에서 HUD 코인 칸으로 코인이 날아감
  coinFly(n) {
    const box = $('#hCoinBox', this.hud).getBoundingClientRect();
    const root = this.root.getBoundingClientRect();
    const tx = box.left - root.left + 16, ty = box.top - root.top + 16;
    for (let i = 0; i < n; i++) {
      const c = h('<span class="flycoin coin-ico"></span>');
      const sx = root.width / 2 + (Math.random() - 0.5) * 160, sy = root.height * 0.66 + (Math.random() - 0.5) * 50;
      c.style.left = sx + 'px'; c.style.top = sy + 'px';
      this.fx.appendChild(c);
      c.style.opacity = '0';
      setTimeout(() => { c.style.opacity = '1'; }, 500 + i * 60);
      setTimeout(() => { c.style.transform = `translate(${tx - sx}px, ${ty - sy}px) scale(.6)`; c.style.opacity = '0.3'; }, 650 + i * 60);
      setTimeout(() => c.remove(), 1500 + i * 60);
    }
  }

  banner(text, sub = '') {
    const el = h(`<div class="banner">${text}${sub ? `<small>${sub}</small>` : ''}</div>`);
    this.fx.appendChild(el);
    setTimeout(() => el.remove(), 1900);
  }

  // 토스트는 겹치지 않게 순서대로, 튜토리얼과 시작 직후에는 보류
  holdToasts(on) {
    this.hold = on;
    if (!on && !this.toastBusy) this.nextToast();
  }
  toast(text) {
    this.toastQ.push(text);
    if (!this.toastBusy && !this.hold) this.nextToast();
  }
  nextToast() {
    if (this.hold) { this.toastBusy = false; return; }
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
      lr: ['left', '기차가 와요! 옆으로 밀어서 레인 이동'],
      up: ['up', '위로 밀어서 무리 전체가 파도 점프'],
      down: ['down', '아래로 밀어서 슬라이드, 무리가 좁게 뭉쳐요'],
      gate: ['right', '파란 게이트로! x2 는 인원이 두 배'],
      enemy: ['tap', '적보다 많으면 이겨요! 탭 연타로 더 빨리'],
    };
    const [dir, text] = map[step];
    const slow = step === 'lr' || step === 'up' || step === 'down';
    this.fx.appendChild(h(`<div class="tut ${slow ? 'slow' : ''}"><div class="hand ${dir}">${SVG.hand}</div><div class="txt">${text}</div></div>`));
  }
}
