// DOM UI: 타이틀, HUD, 일시정지, 결과, 업그레이드, 미션, 튜토리얼
import { CFG } from './config.js';
import { save, upgradeCost, ensureMissions, missionText } from './data.js';
import { PU_NAMES } from './entities.js';

const SVG = {
  soundOn: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M3 9h4l5-4v14l-5-4H3z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
  soundOff: '<svg viewBox="0 0 24 24" fill="#fff"><path d="M3 9h4l5-4v14l-5-4H3z"/><path d="M16 9l6 6M22 9l-6 6" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/></svg>',
  pause: '<svg viewBox="0 0 24 24" fill="#fff"><rect x="5" y="4" width="5" height="16" rx="1.5"/><rect x="14" y="4" width="5" height="16" rx="1.5"/></svg>',
  hand: '<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="28" fill="rgba(255,255,255,.25)"/><path d="M26 50V24a4 4 0 0 1 8 0v12l10 2c3 .6 5 3 4.5 6L46 54H30z" fill="#fff" stroke="#1a2a5a" stroke-width="2.5" stroke-linejoin="round"/></svg>',
  castle: '<svg viewBox="0 0 24 24"><path d="M3 22V8h3v3h3V8h2v3h2V8h2v3h3V8h3v14h-7v-5a2 2 0 0 0-4 0v5z" fill="#8a8fa8" stroke="#fff" stroke-width="1.2"/><path d="M11 2v5l5-2.5z" fill="#ff4a5a"/></svg>',
};
const PU_CSS = { magnet: '#ff4a6a', shield: '#3ae0ff', boots: '#5aff6a', recruit: '#ffc83a' };

const $ = (sel, root = document) => root.querySelector(sel);
const h = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; };
const fmt = (n) => Math.floor(n).toLocaleString('ko-KR');

export class UI {
  constructor(root, handlers) {
    this.root = root;
    this.hd = handlers;
    this.build();
  }

  build() {
    const r = this.root;
    r.innerHTML = '';
    this.hud = h(`<div id="hud" class="hidden">
      <div class="hudtop">
        <div style="display:flex;flex-direction:column;gap:6px">
          <div class="hudbox" id="hDist">0<small>m</small></div>
        </div>
        <div class="hudbox"><span class="coin-ico"></span><span id="hCoins">0</span></div>
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
        <div class="coinpill"><span class="coin-ico"></span><span id="tCoins">0</span></div>
        <button class="icon-btn" id="tMute" aria-label="음소거"></button>
      </div>
      <div class="logo"><h1>스웜<br><span>서퍼</span></h1><div class="sub">SWARM SURFERS</div>
        <div class="records"><div>최고 거리<b id="tBestD">0m</b></div><div>최고 인원<b id="tBestC">0</b></div></div>
      </div>
      <div class="menu">
        <button class="btn big gold" id="tStart">달리기 시작</button>
        <div class="row"><button class="btn" id="tShop">업그레이드</button><button class="btn" id="tMis">일일 미션</button></div>
      </div>
    </div>`);
    r.appendChild(this.title);

    this.shop = h(`<div class="screen panel-wrap hidden"><div class="panel"><h2>업그레이드</h2>
      <div style="display:flex;justify-content:center;margin-bottom:12px"><div class="coinpill"><span class="coin-ico"></span><span id="sCoins">0</span></div></div>
      <div id="upgList"></div><div class="actions"><button class="btn gray" id="sClose">닫기</button></div></div></div>`);
    r.appendChild(this.shop);

    this.mis = h(`<div class="screen panel-wrap hidden"><div class="panel"><h2>일일 미션</h2><div id="misList"></div>
      <div style="text-align:center;font-size:12px;opacity:.7">매일 자정에 새 미션이 열림</div>
      <div class="actions"><button class="btn gray" id="mClose">닫기</button></div></div></div>`);
    r.appendChild(this.mis);

    this.pause = h(`<div class="screen panel-wrap hidden"><div class="panel"><h2>일시정지</h2>
      <div class="actions">
        <button class="btn big gold" id="pResume">계속하기</button>
        <button class="btn" id="pRestart">다시 시작</button>
        <button class="btn gray" id="pTitle">타이틀로</button>
        <button class="btn gray" id="pMute">소리</button>
      </div></div></div>`);
    r.appendChild(this.pause);

    this.over = h(`<div class="screen panel-wrap hidden"><div class="panel result">
      <h2 id="oHead">게임 오버</h2>
      <div class="lbl">달린 거리</div><div class="big" id="oDist">0m</div>
      <div id="oNew"></div><div class="cause" id="oCause"></div>
      <div class="grid">
        <div><span class="lbl">최고 인원</span><b id="oCount">0</b></div>
        <div><span class="lbl">획득 코인</span><b id="oCoins">0</b></div>
        <div><span class="lbl">부순 요새</span><b id="oFort">0</b></div>
        <div><span class="lbl">최고 거리</span><b id="oBest">0m</b></div>
      </div>
      <div class="actions"><button class="btn big gold" id="oRetry">다시 하기</button>
      <div style="display:flex;gap:10px"><button class="btn" id="oShop" style="flex:1">업그레이드</button><button class="btn gray" id="oTitle" style="flex:1">타이틀</button></div></div>
    </div></div>`);
    r.appendChild(this.over);

    const on = (id, fn) => $('#' + id, r).addEventListener('click', (e) => { e.stopPropagation(); this.hd.click(); fn(); });
    on('tStart', () => this.hd.start());
    on('tShop', () => this.openShop());
    on('tMis', () => this.openMissions());
    on('tMute', () => this.hd.toggleMute());
    on('sClose', () => { this.shop.classList.add('hidden'); this.refreshTitle(); });
    on('mClose', () => this.mis.classList.add('hidden'));
    on('pauseBtn', () => this.hd.pause());
    on('pResume', () => this.hd.resume());
    on('pRestart', () => this.hd.restart());
    on('pTitle', () => this.hd.toTitle());
    on('pMute', () => this.hd.toggleMute());
    on('oRetry', () => this.hd.restart());
    on('oShop', () => this.openShop());
    on('oTitle', () => this.hd.toTitle());
    // UI 위에서 시작된 포인터가 게임 입력으로 새지 않게
    for (const el of [this.title, this.shop, this.mis, this.pause, this.over]) el.addEventListener('pointerdown', (e) => e.stopPropagation());

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
    $('#tCoins', this.root).textContent = fmt(save.coins);
    $('#tBestD', this.root).textContent = fmt(save.bestDist) + 'm';
    $('#tBestC', this.root).textContent = fmt(save.bestCount);
  }

  show(name) {
    for (const k of ['title', 'shop', 'mis', 'pause', 'over']) this[k].classList.add('hidden');
    this.hud.classList.toggle('hidden', !(name === 'play' || name === 'pause'));
    if (name === 'title') { this.refreshTitle(); this.title.classList.remove('hidden'); }
    if (name === 'pause') this.pause.classList.remove('hidden');
    if (name === 'over') this.over.classList.remove('hidden');
  }

  openShop() {
    const list = $('#upgList', this.shop);
    list.innerHTML = '';
    $('#sCoins', this.shop).textContent = fmt(save.coins);
    for (const id of Object.keys(CFG.upgrades)) {
      const u = CFG.upgrades[id];
      const lvl = save.upgrades[id] || 0;
      const cost = upgradeCost(id);
      const pips = Array.from({ length: u.max }, (_, i) => `<i class="${i < lvl ? 'on' : ''}"></i>`).join('');
      const row = h(`<div class="upg"><div class="info"><div class="name">${u.name}</div><div class="desc">${u.desc(lvl)}${cost != null ? ' → ' + u.desc(lvl + 1) : ''}</div><div class="pips">${pips}</div></div>
        ${cost == null ? '<button class="btn gray" disabled>최대</button>' : `<button class="btn gold" ${save.coins < cost ? 'disabled' : ''}><span class="coin-ico"></span>${fmt(cost)}</button>`}</div>`);
      const b = row.querySelector('button');
      b.addEventListener('click', (e) => { e.stopPropagation(); if (this.hd.buy(id)) this.openShop(); });
      list.appendChild(row);
    }
    this.shop.classList.remove('hidden');
  }

  openMissions() {
    const list = $('#misList', this.mis);
    list.innerHTML = '';
    for (const m of ensureMissions()) {
      const pct = Math.min(100, (m.progress / m.target) * 100);
      list.appendChild(h(`<div class="mission ${m.done ? 'done' : ''}"><div class="mt"><span>${missionText(m)}</span><span class="rw">+${m.reward}</span></div>
        <div class="bar"><i style="width:${pct}%"></i></div><div class="st">${m.done ? '완료! 보상 지급됨' : `${fmt(m.progress)} / ${fmt(m.target)}`}</div></div>`));
    }
    this.mis.classList.remove('hidden');
  }

  showOver(r) {
    $('#oHead', this.over).textContent = r.head;
    $('#oDist', this.over).textContent = fmt(r.dist) + 'm';
    $('#oNew', this.over).innerHTML = r.newBest ? '<span class="newbest">최고 기록!</span>' : '';
    $('#oCause', this.over).textContent = r.cause || '';
    $('#oCount', this.over).textContent = fmt(r.maxCount);
    $('#oCoins', this.over).textContent = '+' + fmt(r.coins);
    $('#oFort', this.over).textContent = fmt(r.forts);
    $('#oBest', this.over).textContent = fmt(save.bestDist) + 'm';
    this.show('over');
  }

  // ---------- HUD ----------
  setHud(dist, coins, sectFrac, sect, themeName) {
    const d = Math.floor(dist);
    if (d !== this._d) { this._d = d; $('#hDist', this.hud).firstChild.nodeValue = fmt(d); }
    if (coins !== this._c) { this._c = coins; $('#hCoins', this.hud).textContent = fmt(coins); }
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

  // 적/요새 숫자 라벨 목록 [{n, x, y, cls}]
  setEnemyLabels(list) {
    const c = this.enemyLbls;
    while (c.children.length < list.length) c.appendChild(h('<div class="enemyLbl"></div>'));
    for (let i = 0; i < c.children.length; i++) {
      const el = c.children[i];
      const it = list[i];
      if (!it) { el.style.display = 'none'; continue; }
      el.style.display = '';
      el.id = it.fort ? 'fortLbl' : '';
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

  toast(text) {
    const el = h(`<div class="toast">${text}</div>`);
    this.fx.appendChild(el);
    setTimeout(() => el.remove(), 2700);
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
      gate: ['right', '파란 게이트로 무리를 불려요!'],
    };
    const [dir, text] = map[step];
    this.fx.appendChild(h(`<div class="tut"><div class="hand ${dir}">${SVG.hand}</div><div class="txt">${text}</div></div>`));
  }
}
