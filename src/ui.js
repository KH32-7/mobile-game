// DOM UI: HUD, 월드 말풍선, 패널(업그레이드/미션/출석/도감/코스튬/업적/통계/설정), 타이틀, 결과
import { SVG, menuImg, iconURL } from './icons.js';
import { STAGES, MENUS, MENU_ORDER, UPGRADES, HATS, APRONS, SKINS, ACHIEVEMENTS, ATTEND, CFG } from './config.js';
import { fmt } from './world.js';
import { project } from './gfx.js';
import { audio } from './audio.js';

const $ = (s, r = document) => r.querySelector(s);
const tmp = { x: 0, y: 0, vis: false };

export class UI {
  constructor(app) {
    this.app = app;
    this.hud = document.getElementById('hud');
    this.layer = document.getElementById('layer');
    this.wui = document.getElementById('world-ui');
    this.bubbles = new Map();
    this.stBadges = new Map();
    this.shownMoney = 0;
    this.panel = null;
    this.buildHud();
  }

  // ---------------- HUD ----------------
  buildHud() {
    this.hud.innerHTML = `
      <div class="hud-top">
        <div class="hud-left">
          <div class="pill money" id="h-money-pill"><span class="ic">${SVG.coin}</span><b id="h-money">0</b></div>
          <div class="pill pearls"><span class="ic">${SVG.pearl}</span><b id="h-pearls">0</b></div>
        </div>
        <div class="hud-center">
          <div class="stage-name" id="h-stage"></div>
          <div class="prog"><div class="prog-fill" id="h-prog"></div><span id="h-prog-t"></span></div>
          <div class="rating"><span class="ic">${SVG.star}</span><b id="h-stars">3.0</b><div class="heart-bar"><span class="ic sm">${SVG.heart}</span><div class="hb"><div id="h-heart"></div></div></div></div>
        </div>
        <div class="hud-right">
          <button class="rbtn" id="b-pause" aria-label="일시정지">${SVG.pause}</button>
          <button class="rbtn" id="b-mute" aria-label="소리">${SVG.sound}</button>
        </div>
      </div>
      <div class="side-btns">
        <button class="sbtn" id="b-mission">${SVG.mission}<span>미션</span><i class="badge" id="bd-mission"></i></button>
        <button class="sbtn" id="b-attend">${SVG.calendar}<span>출석</span><i class="badge" id="bd-attend"></i></button>
        <button class="sbtn" id="b-dex">${SVG.book}<span>도감</span><i class="badge" id="bd-dex"></i></button>
        <button class="sbtn" id="b-cos">${SVG.shirt}<span>코스튬</span></button>
        <button class="sbtn" id="b-ach">${SVG.trophy}<span>업적</span><i class="badge" id="bd-ach"></i></button>
      </div>
      <div class="demand" id="h-demand"></div>
      <div class="combo" id="h-combo"></div>
      <div class="banner" id="h-banner"></div>
      <div class="toast" id="h-toast"></div>
      <div class="tut" id="h-tut"></div>
      <div class="hand" id="h-hand">${SVG.hand}</div>
      <div class="edge" id="h-edge">${SVG.arrow}</div>
      <div class="cap" id="h-cap"></div>
      <div class="rushbar" id="h-rush"><div></div></div>
    `;
    const on = (id, f) =>
      $(id).addEventListener('click', (e) => {
        e.stopPropagation();
        audio.play('click');
        f();
      });
    on('#b-pause', () => this.openPause());
    on('#b-mute', () => this.app.toggleMute());
    on('#b-mission', () => this.openMissions());
    on('#b-attend', () => this.openAttend());
    on('#b-dex', () => this.openDex());
    on('#b-cos', () => this.openCostume());
    on('#b-ach', () => this.openAch());
    this.hud.querySelectorAll('button').forEach((b) => b.addEventListener('pointerdown', (e) => e.stopPropagation()));
  }

  setMuteIcon(on) {
    $('#b-mute').innerHTML = on ? SVG.sound : SVG.mute;
  }

  updateHud(dt) {
    const app = this.app;
    const g = app.game;
    const p = app.p;
    // 돈 카운트업
    const target = Math.floor(g.run.money);
    const diff = target - this.shownMoney;
    if (Math.abs(diff) < 1) this.shownMoney = target;
    else this.shownMoney += diff * Math.min(1, dt * 12) + Math.sign(diff) * 0.5;
    const mt = fmt(Math.max(0, Math.round(this.shownMoney)));
    if (this._mt !== mt) {
      $('#h-money').textContent = mt;
      this._mt = mt;
    }
    const pt = fmt(p.pearls);
    if (this._pt !== pt) {
      $('#h-pearls').textContent = pt;
      this._pt = pt;
    }
    const st = g.stage;
    const total = st.unlocks.length;
    const done = g.done.size;
    const key = st.name + done;
    if (this._sk !== key) {
      this._sk = key;
      $('#h-stage').textContent = `${p.stage + 1}호점 · ${st.name}`;
      $('#h-prog').style.width = `${(done / total) * 100}%`;
      $('#h-prog-t').textContent = `${done}/${total}`;
    }
    const stars = g.stars().toFixed(1);
    if (this._st !== stars) {
      $('#h-stars').textContent = stars;
      this._st = stars;
    }
    $('#h-heart').style.width = `${g.satisfaction() * 100}%`;
    // 수요 막대: 대기 중 주문 수
    this.demandT = (this.demandT || 0) - dt;
    if (this.demandT <= 0) {
      this.demandT = 0.3;
      const want = {};
      for (const c of g.customers) if (c.state === 'wait' || c.state === 'eat' || c.state === 'fetch') {
        const m = c.orders[c.oi];
        if (c.state === 'wait' && m) want[m] = (want[m] || 0) + 1;
      }
      const onBelt = {};
      for (const b of g.belts) for (const sl of b.slots) if (sl.item && !sl.item.dried) onBelt[sl.item.m] = (onBelt[sl.item.m] || 0) + 1;
      const menus = g.builtMenus();
      let html = '<span class="dl">주문</span>';
      for (const m of menus) {
        const w = want[m] || 0;
        const b = onBelt[m] || 0;
        const cls = w > b ? 'need' : w > 0 ? 'ok' : 'none';
        html += `<span class="dm ${cls}">${menuImg(m)}<b>${w}</b></span>`;
      }
      const dried = g.belts.reduce((a, b) => a + (b.built ? g.driedCount(b) : 0), 0);
      if (dried) html += `<span class="dm dry">마른 접시 <b>${dried}</b></span>`;
      if (g.rack.n <= 2) html += `<span class="dm plate ${g.rack.n === 0 ? 'need' : ''}">${SVG.plate}<b>${g.rack.n}</b></span>`;
      if (html !== this._dh) {
        $('#h-demand').innerHTML = html;
        this._dh = html;
      }
      // 배지
      const mb = app.meta.unclaimed();
      $('#bd-mission').textContent = mb ? String(mb) : '';
      $('#bd-mission').classList.toggle('on', mb > 0);
      const ab = app.meta.achUnclaimed();
      $('#bd-ach').textContent = ab ? String(ab) : '';
      $('#bd-ach').classList.toggle('on', ab > 0);
      $('#bd-attend').classList.toggle('on', app.meta.attendAvailable());
      $('#bd-attend').textContent = app.meta.attendAvailable() ? '!' : '';
      $('#bd-dex').classList.toggle('on', !!app.newDex);
      $('#bd-dex').textContent = app.newDex ? 'N' : '';
      // 적재량
      const cap = g.chefCap();
      const n = g.chef.stack.length;
      const ce = $('#h-cap');
      ce.textContent = n ? `${n}/${cap}` : '';
      ce.classList.toggle('on', n > 0);
      ce.classList.toggle('max', n >= cap);
    }
    // 러시 게이지
    const rb = $('#h-rush');
    if (g.rush) {
      rb.classList.add('on');
      rb.firstChild.style.width = `${(g.rush.t / (g.rush.type === 'vip' ? 20 : 25)) * 100}%`;
    } else rb.classList.remove('on');
  }

  flashMoney() {
    const el = $('#h-money-pill');
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
  }

  toast(text, cls = '') {
    const el = $('#h-toast');
    el.className = 'toast show ' + cls;
    el.textContent = text;
    clearTimeout(this._tt);
    this._tt = setTimeout(() => (el.className = 'toast'), 2200);
  }

  banner(title, sub, menu) {
    const el = $('#h-banner');
    el.innerHTML = `<b>${title}</b><span>${menu ? menuImg(menu, 'mi sm') : ''}${sub}</span>`;
    el.classList.remove('show');
    void el.offsetWidth;
    el.classList.add('show');
    clearTimeout(this._bt);
    this._bt = setTimeout(() => el.classList.remove('show'), 3200);
  }

  combo(n, mul) {
    const el = $('#h-combo');
    el.innerHTML = `<b>콤보 ${n}</b><span>팁 x${mul.toFixed(1)}</span>`;
    el.classList.remove('show');
    void el.offsetWidth;
    el.classList.add('show');
    clearTimeout(this._ct);
    this._ct = setTimeout(() => el.classList.remove('show'), 2400);
  }
  comboBreak() {
    const el = $('#h-combo');
    if (!el.classList.contains('show')) return;
    el.innerHTML = '<b>콤보 끊김</b>';
    el.classList.add('broken');
    setTimeout(() => el.classList.remove('show', 'broken'), 900);
  }

  tut(text, hand) {
    const el = $('#h-tut');
    if (!text) {
      el.classList.remove('show');
    } else {
      if (el.textContent !== text) el.textContent = text;
      el.classList.add('show');
    }
    $('#h-hand').classList.toggle('show', !!hand);
  }

  // 화면 밖 목표 화살표
  updateEdge(target) {
    const el = $('#h-edge');
    if (!target) {
      el.classList.remove('show');
      return;
    }
    project(target.x, 0.5, target.z, tmp);
    const W = this.app.W();
    const H = this.app.H();
    const m = 40;
    const inside = tmp.x > m && tmp.x < W - m && tmp.y > 120 && tmp.y < H - 60;
    if (inside) {
      el.classList.remove('show');
      return;
    }
    const cx = W / 2;
    const cy = H / 2;
    const dx = tmp.x - cx;
    const dy = tmp.y - cy;
    const a = Math.atan2(dy, dx);
    const k = Math.min(Math.abs((W / 2 - m) / (dx || 1e-6)), Math.abs((H / 2 - 110) / (dy || 1e-6)));
    const x = cx + dx * k;
    const y = cy + dy * k;
    el.style.transform = `translate(${x}px, ${y}px) translate(-50%,-50%) rotate(${a + Math.PI / 2}rad)`;
    el.classList.add('show');
  }

  // ---------------- 월드 말풍선 ----------------
  clearWorld() {
    this.bubbles.forEach((b) => b.el.remove());
    this.bubbles.clear();
    this.stBadges.forEach((b) => b.remove());
    this.stBadges.clear();
    if (this.maxEl) this.maxEl.classList.remove('on');
  }

  updateWorld() {
    const g = this.app.game;
    const seen = new Set();
    for (const c of g.customers) {
      if (!(c.state === 'wait' || c.state === 'eat' || c.state === 'fetch')) continue;
      seen.add(c.id);
      let b = this.bubbles.get(c.id);
      if (!b) {
        const el = document.createElement('div');
        el.className = 'bubble' + (c.vip ? ' vip' : '') + (c.group ? ' group' : '');
        this.wui.appendChild(el);
        b = { el, key: '' };
        this.bubbles.set(c.id, b);
      }
      const key = c.oi + ':' + c.state + ':' + (c.sweat ? 1 : 0);
      if (b.key !== key) {
        b.key = key;
        let html = '';
        if (c.vip) {
          html += `<span class="crown">${SVG.crown}</span><div class="set">`;
          c.orders.forEach((m, i) => (html += `<span class="si ${i < c.oi ? 'done' : i === c.oi ? 'cur' : ''}">${menuImg(m)}</span>`));
          html += '</div>';
        } else if (c.state === 'wait') {
          html += menuImg(c.orders[c.oi]);
          const left = c.orders.length - c.oi;
          if (left > 1) html += `<small>x${left}</small>`;
        } else {
          html += '<span class="eating">냠냠</span>';
        }
        if (c.sweat && c.state === 'wait') html += `<span class="sw">${SVG.sweat}</span>`;
        html += '<i class="pat"></i>';
        b.el.innerHTML = html;
        b.pat = b.el.querySelector('.pat');
      }
      project(c.x, 2.05, c.z, tmp);
      b.el.style.transform = `translate(${tmp.x}px, ${tmp.y}px) translate(-50%, -100%)`;
      const pr = c.state === 'wait' ? Math.max(0, c.pat / c.patMax) : 1;
      if (b.pat) {
        b.pat.style.setProperty('--p', pr.toFixed(3));
        b.el.classList.toggle('late', pr < 0.3 && c.state === 'wait');
        b.el.classList.toggle('eat', c.state !== 'wait');
      }
    }
    for (const [id, b] of this.bubbles) {
      if (!seen.has(id)) {
        b.el.remove();
        this.bubbles.delete(id);
      }
    }
    // 셰프 머리 위 MAX 표시
    if (!this.maxEl) {
      this.maxEl = document.createElement('div');
      this.maxEl.className = 'maxtag';
      this.maxEl.textContent = 'MAX';
      this.wui.appendChild(this.maxEl);
    }
    const ch = g.chef;
    const full = ch.stack.length >= g.chefCap();
    this.maxEl.classList.toggle('on', full);
    if (full) {
      const tp = g.stackTopPos(ch);
      project(tp.x, tp.y + 0.35, tp.z, tmp);
      this.maxEl.style.transform = `translate(${tmp.x}px, ${tmp.y}px) translate(-50%, -100%)`;
    }
    // 조리대 상태 배지
    for (const s of Object.values(g.stations)) {
      if (!s.built) continue;
      let el = this.stBadges.get(s.menu);
      if (!el) {
        el = document.createElement('div');
        el.className = 'stb';
        el.innerHTML = '<div class="cook"><i></i></div><span></span>';
        this.wui.appendChild(el);
        this.stBadges.set(s.menu, el);
      }
      project(s.x, 1.95, s.z, tmp);
      el.style.transform = `translate(${tmp.x}px, ${tmp.y}px) translate(-50%, -100%)`;
      const cooking = s.inp > 0 && s.out < CFG.station.outCap && g.rack.n > 0;
      el.firstChild.style.display = cooking ? '' : 'none';
      el.firstChild.firstChild.style.width = `${(s.t / g.cookTime) * 100}%`;
      let msg = '';
      let cls = '';
      if (s.inp > 0 && g.rack.n <= 0) {
        msg = '접시 없음!';
        cls = 'bad';
      } else if (s.out >= CFG.station.outCap) {
        msg = '가득';
        cls = 'full';
      } else if (s.inp === 0 && s.out === 0 && s.incoming === 0 && g.customers.some((c) => c.state === 'wait' && c.orders[c.oi] === s.menu)) {
        msg = '재료 필요';
        cls = 'idle';
      }
      const sp = el.lastChild;
      if (sp.textContent !== msg) sp.textContent = msg;
      if (sp.className !== cls) sp.className = cls;
    }
  }

  emote(c, type) {
    const el = document.createElement('div');
    el.className = 'emote ' + type;
    el.innerHTML = type === 'angry' ? SVG.angry : type === 'heart' ? SVG.heart : SVG.happy;
    this.wui.appendChild(el);
    const start = performance.now();
    const x = c.x;
    const z = c.z;
    const tick = () => {
      const t = (performance.now() - start) / 1000;
      if (t > 1.2) {
        el.remove();
        return;
      }
      project(x, 2.2 + t * 0.9, z, tmp);
      el.style.transform = `translate(${tmp.x}px, ${tmp.y}px) translate(-50%,-50%) scale(${t < 0.15 ? t / 0.15 : 1})`;
      el.style.opacity = t > 0.9 ? String((1.2 - t) / 0.3) : '1';
      requestAnimationFrame(tick);
    };
    tick();
  }

  // ---------------- 패널 공통 ----------------
  open(html, cls = '', onClose = null, opts = {}) {
    this.close(true);
    const wrap = document.createElement('div');
    wrap.className = 'modal ' + cls;
    wrap.innerHTML = `<div class="sheet">${opts.noClose ? '' : '<button class="x" aria-label="닫기">✕</button>'}${html}</div>`;
    this.layer.appendChild(wrap);
    requestAnimationFrame(() => wrap.classList.add('show'));
    wrap.addEventListener('pointerdown', (e) => e.stopPropagation());
    const x = wrap.querySelector('.x');
    if (x)
      x.addEventListener('click', () => {
        audio.play('click');
        this.close();
      });
    if (!opts.noBackdrop)
      wrap.addEventListener('click', (e) => {
        if (e.target === wrap && !opts.noClose) this.close();
      });
    this.panel = { el: wrap, onClose, cls };
    this.app.setPaused(true, 'panel');
    audio.play('open');
    return wrap;
  }

  close(silent = false) {
    if (!this.panel) return;
    const { el, onClose } = this.panel;
    this.panel = null;
    el.classList.remove('show');
    setTimeout(() => el.remove(), 180);
    this.app.setPaused(false, 'panel');
    if (onClose && !silent) onClose();
  }

  // ---------------- 타이틀 ----------------
  showTitle(onStart) {
    const p = this.app.p;
    const best = p.records.length ? p.records.reduce((a, r) => a + (r.earned || 0), 0) + p.run.earned : p.run.earned;
    const el = document.createElement('div');
    el.className = 'title';
    el.innerHTML = `
      <div class="t-sky"></div>
      <div class="t-logo">
        <div class="t-plate"><img src="${iconURL('menu', 'salmon', 160)}" alt=""></div>
        <h1><span>스시</span><span>루프</span></h1>
        <p>회전초밥집 키우기</p>
      </div>
      <div class="t-best">
        <div>최고 식당 <b>${p.stage + 1}호점 · ${STAGES[p.stage].name}</b></div>
        <div>누적 수익 <b>${fmt(best)}</b></div>
      </div>
      <button class="big-btn" id="t-start">${p.stats.plates > 0 ? '이어하기' : '영업 시작'}</button>
      <button class="rbtn t-mute" id="t-mute">${this.app.p.settings.sfx || this.app.p.settings.bgm ? SVG.sound : SVG.mute}</button>
      <div class="t-load"><i></i></div>
    `;
    this.layer.appendChild(el);
    el.addEventListener('pointerdown', (e) => e.stopPropagation());
    $('#t-mute', el).addEventListener('click', (e) => {
      e.stopPropagation();
      this.app.toggleMute();
      $('#t-mute', el).innerHTML = this.app.p.settings.sfx || this.app.p.settings.bgm ? SVG.sound : SVG.mute;
    });
    $('#t-start', el).addEventListener('click', () => {
      el.classList.add('hide');
      setTimeout(() => el.remove(), 400);
      onStart();
    });
    this.titleEl = el;
  }

  // ---------------- 일시정지/설정 ----------------
  openPause() {
    const s = this.app.p.settings;
    const tg = (id, label, on) => `<label class="tg"><span>${label}</span><input type="checkbox" id="${id}" ${on ? 'checked' : ''}><i></i></label>`;
    const w = this.open(
      `<h2>일시정지</h2>
      <button class="big-btn" id="p-resume">계속하기</button>
      <div class="settings">
        ${tg('s-sfx', '효과음', s.sfx)}${tg('s-bgm', '배경음악', s.bgm)}${tg('s-hap', '진동', s.haptic)}${tg('s-sh', '그림자 (끄면 더 빠름)', s.shadows)}
      </div>
      <div class="row2">
        <button class="btn" id="p-stats">${SVG.chart} 통계</button>
        <button class="btn" id="p-title">타이틀로</button>
      </div>
      <div class="row2">
        <button class="btn warn" id="p-restart">식당 다시 시작</button>
        <button class="btn warn" id="p-wipe">데이터 초기화</button>
      </div>
      <p class="hint">자동 저장 중 · 스시 루프 v1.0</p>`,
      'pause'
    );
    $('#p-resume', w).onclick = () => this.close();
    $('#s-sfx', w).onchange = (e) => this.app.setSetting('sfx', e.target.checked);
    $('#s-bgm', w).onchange = (e) => this.app.setSetting('bgm', e.target.checked);
    $('#s-hap', w).onchange = (e) => this.app.setSetting('haptic', e.target.checked);
    $('#s-sh', w).onchange = (e) => {
      this.app.p.settings.qLocked = true;
      this.app.setSetting('shadows', e.target.checked);
    };
    $('#p-stats', w).onclick = () => this.openStats();
    $('#p-title', w).onclick = () => {
      this.close(true);
      this.app.toTitle();
    };
    $('#p-restart', w).onclick = () =>
      this.confirm('이 식당을 처음부터 다시 시작할까요? 현재 식당의 돈과 해금이 초기화돼요.', () => this.app.restartStage());
    $('#p-wipe', w).onclick = () => this.confirm('모든 저장 데이터를 지울까요? 되돌릴 수 없어요.', () => this.app.wipeAll());
  }

  confirm(text, yes) {
    const w = this.open(`<h2>확인</h2><p class="cf">${text}</p><div class="row2"><button class="btn" id="c-no">취소</button><button class="btn warn" id="c-yes">확인</button></div>`, 'confirm');
    $('#c-no', w).onclick = () => this.close();
    $('#c-yes', w).onclick = () => {
      this.close(true);
      yes();
    };
  }

  // ---------------- 업그레이드 ----------------
  openUpgrade(tab = 'chef') {
    const g = this.app.game;
    const run = g.run;
    const hasStaff = g.staff.length > 0;
    const tabs = [
      ['chef', '셰프'],
      ['shop', '식당'],
      ['staff', '직원'],
    ];
    let rows = '';
    for (const u of UPGRADES.filter((x) => x.tab === tab)) {
      const lvl = run.upg[u.id] || 0;
      const maxed = lvl >= u.max;
      const cost = this.app.upgCost(u);
      const locked = u.needStaff && !hasStaff;
      const pips = Array.from({ length: u.max }, (_, i) => `<i class="${i < lvl ? 'on' : ''}"></i>`).join('');
      rows += `<div class="up-row ${locked ? 'locked' : ''}">
        <div class="up-ic ic-${u.icon}">${SVG[u.icon] || SVG.up}</div>
        <div class="up-info"><b>${u.name}</b><small>${locked ? '직원을 먼저 고용하세요' : u.desc}</small><div class="pips">${pips}</div></div>
        <button class="btn buy" data-id="${u.id}" ${maxed || locked || run.money < cost ? 'disabled' : ''}>${maxed ? 'MAX' : `<span class="ic">${SVG.coin}</span>${fmt(cost)}`}</button>
      </div>`;
    }
    const w = this.open(
      `<h2>업그레이드</h2>
      <div class="tabs">${tabs.map(([id, n]) => `<button class="tab ${id === tab ? 'on' : ''}" data-tab="${id}">${n}</button>`).join('')}</div>
      <div class="money-line"><span class="ic">${SVG.coin}</span><b>${fmt(run.money)}</b></div>
      <div class="up-list">${rows}</div>`,
      'upgrade'
    );
    w.querySelectorAll('.tab').forEach((b) =>
      b.addEventListener('click', () => {
        audio.play('click');
        this.openUpgrade(b.dataset.tab);
      })
    );
    w.querySelectorAll('.buy').forEach((b) =>
      b.addEventListener('click', () => {
        if (this.app.buyUpgrade(b.dataset.id)) this.openUpgrade(tab);
      })
    );
  }

  // ---------------- 미션 ----------------
  openMissions() {
    const p = this.app.p;
    this.app.meta.checkDay();
    const now = new Date();
    const mid = new Date(now);
    mid.setHours(24, 0, 0, 0);
    const left = Math.max(0, mid - now);
    const hh = Math.floor(left / 3600000);
    const mm = Math.floor((left % 3600000) / 60000);
    let html = `<h2>일일 미션</h2><p class="sub">새 미션까지 ${hh}시간 ${mm}분</p><div class="ms">`;
    p.missions.list.forEach((m, i) => {
      html += `<div class="mcard ${m.claimed ? 'claimed' : m.done ? 'done' : ''}">
        <div class="mt"><b>${m.text}</b><div class="bar"><i style="width:${Math.min(100, (m.prog / m.n) * 100)}%"></i></div><small>${fmt(m.prog)} / ${fmt(m.n)}</small></div>
        <button class="btn claim" data-i="${i}" ${m.done && !m.claimed ? '' : 'disabled'}>${m.claimed ? '완료' : `<span class="ic">${SVG.pearl}</span>${m.reward}`}</button>
      </div>`;
    });
    html += '</div><p class="hint">진주로 코스튬과 인테리어를 살 수 있어요</p>';
    const w = this.open(html, 'missions');
    w.querySelectorAll('.claim').forEach((b) =>
      b.addEventListener('click', () => {
        const r = this.app.meta.claimMission(+b.dataset.i);
        if (r) {
          audio.play('coin');
          this.app.save();
          this.openMissions();
          this.toast(`진주 +${r}`);
        }
      })
    );
  }

  // ---------------- 출석 ----------------
  openAttend() {
    const p = this.app.p;
    const avail = this.app.meta.attendAvailable();
    const day = p.attend.day % 7;
    const unit = this.app.moneyUnit();
    let cells = '';
    ATTEND.forEach((r, i) => {
      const got = i < day || (!avail && i === (day + 6) % 7 && p.attend.day > 0 && day === 0 && i === 6);
      const today = avail && i === day;
      let rw = '';
      if (r.pearls) rw += `<span class="ic">${SVG.pearl}</span>${r.pearls}`;
      if (r.money) rw += `<span class="ic">${SVG.coin}</span>${fmt(unit * r.money)}`;
      if (r.hat) rw += '<br><em>+ 하치마키</em>';
      cells += `<div class="day ${i < day ? 'got' : ''} ${today ? 'today' : ''} ${i === 6 ? 'big' : ''}"><small>${i + 1}일차</small><div>${rw}</div>${i < day ? '<b class="chk">받음</b>' : ''}</div>`;
      void got;
    });
    const w = this.open(
      `<h2>7일 출석 보상</h2><p class="sub">매일 들러서 보상을 받아요 (${p.attend.day}일째 출석)</p><div class="cal">${cells}</div>
      <button class="big-btn" id="a-claim" ${avail ? '' : 'disabled'}>${avail ? '오늘 보상 받기' : '내일 또 만나요'}</button>`,
      'attend'
    );
    $('#a-claim', w).onclick = () => {
      const r = this.app.claimAttend();
      if (r) this.openAttend();
    };
  }

  // ---------------- 도감 ----------------
  openDex() {
    const p = this.app.p;
    this.app.newDex = false;
    let cells = '';
    let found = 0;
    for (const m of MENU_ORDER) {
      const d = p.dex[m];
      if (d) found++;
      const where = STAGES.filter((s) => s.layout.menus.includes(m)).map((s) => s.name)[0] || '';
      cells += `<div class="dx ${d ? '' : 'unk'}">
        <div class="dimg" style="--pc:${MENUS[m].plate}">${menuImg(m)}</div>
        <b>${d ? MENUS[m].name : '???'}</b>
        <small>${d ? MENUS[m].desc : where + '에서 발견'}</small>
        ${d ? `<em>${d.served}접시 판매 · ${MENUS[m].price}원~</em>` : ''}
      </div>`;
    }
    this.open(`<h2>레시피 도감</h2><p class="sub">발견한 메뉴 ${found} / ${MENU_ORDER.length}</p><div class="dex">${cells}</div>`, 'dexp');
  }

  // ---------------- 코스튬 ----------------
  openCostume(tab = 'hat') {
    const p = this.app.p;
    const cos = p.cos;
    const tabs = [
      ['hat', '모자'],
      ['apron', '앞치마'],
      ['skin', '인테리어'],
    ];
    const list = tab === 'hat' ? HATS : tab === 'apron' ? APRONS : SKINS;
    const owned = tab === 'hat' ? cos.hats : tab === 'apron' ? cos.aprons : cos.skins;
    const cur = tab === 'hat' ? cos.hat : tab === 'apron' ? cos.apron : cos.skin;
    let cells = '';
    for (const it of list) {
      const has = owned.includes(it.id);
      const on = cur === it.id;
      cells += `<div class="cs ${on ? 'on' : ''} ${has ? '' : 'lock'}">
        <div class="cprev">${costumePreview(tab, it)}</div>
        <b>${it.name}</b>
        <button class="btn cbuy" data-id="${it.id}" ${!has && p.pearls < it.price ? 'disabled' : ''}>${on ? '착용 중' : has ? '착용' : `<span class="ic">${SVG.pearl}</span>${it.price}`}</button>
      </div>`;
    }
    const w = this.open(
      `<h2>코스튬</h2><div class="tabs">${tabs.map(([id, n]) => `<button class="tab ${id === tab ? 'on' : ''}" data-tab="${id}">${n}</button>`).join('')}</div>
      <div class="money-line"><span class="ic">${SVG.pearl}</span><b>${p.pearls}</b></div>
      <div class="cgrid">${cells}</div>`,
      'costume'
    );
    w.querySelectorAll('.tab').forEach((b) =>
      b.addEventListener('click', () => {
        audio.play('click');
        this.openCostume(b.dataset.tab);
      })
    );
    w.querySelectorAll('.cbuy').forEach((b) =>
      b.addEventListener('click', () => {
        this.app.buyCostume(tab, b.dataset.id);
        this.openCostume(tab);
      })
    );
  }

  // ---------------- 업적 ----------------
  openAch() {
    const p = this.app.p;
    const meta = this.app.meta;
    let rows = '';
    const sorted = ACHIEVEMENTS.slice().sort((a, b) => {
      const sa = p.ach[a.id] === 1 ? 0 : p.ach[a.id] === 2 ? 2 : 1;
      const sb = p.ach[b.id] === 1 ? 0 : p.ach[b.id] === 2 ? 2 : 1;
      return sa - sb;
    });
    for (const a of sorted) {
      const st = p.ach[a.id] || 0;
      const v = Math.min(a.goal, meta.achValue(a));
      rows += `<div class="ach ${st === 2 ? 'claimed' : st === 1 ? 'done' : ''}">
        <div class="ai">${SVG.trophy}</div>
        <div class="at"><b>${a.name}</b><small>${a.desc}</small><div class="bar"><i style="width:${(v / a.goal) * 100}%"></i></div></div>
        <button class="btn claim" data-id="${a.id}" ${st === 1 ? '' : 'disabled'}>${st === 2 ? '완료' : `<span class="ic">${SVG.pearl}</span>${a.reward}`}</button>
      </div>`;
    }
    const done = ACHIEVEMENTS.filter((a) => p.ach[a.id]).length;
    const w = this.open(`<h2>업적</h2><p class="sub">${done} / ${ACHIEVEMENTS.length} 달성 <button class="link" id="ach-stats">통계 보기</button></p><div class="achs">${rows}</div>`, 'achp');
    w.querySelectorAll('.claim').forEach((b) =>
      b.addEventListener('click', () => {
        const r = meta.claimAch(b.dataset.id);
        if (r) {
          audio.play('coin');
          this.app.save();
          this.toast(`진주 +${r}`);
          this.openAch();
        }
      })
    );
    $('#ach-stats', w).onclick = () => this.openStats();
  }

  openStats() {
    const p = this.app.p;
    const s = p.stats;
    const g = this.app.game;
    const t = Math.floor(s.playSec);
    const rows = [
      ['판매한 초밥', `${fmt(s.plates)}접시`],
      ['접대한 손님', `${fmt(s.customers)}명`],
      ['누적 수익', fmt(s.earned)],
      ['최고 콤보', s.maxCombo],
      ['VIP 세트 완료', s.vip],
      ['설거지한 접시', fmt(s.washed)],
      ['수거한 마른 접시', s.dried],
      ['화나서 떠난 손님', s.angry],
      ['러시 타임 버틴 횟수', s.rushes],
      ['최고 별점', (s.bestStars || 0).toFixed(1)],
      ['오프라인 수익', fmt(s.offline)],
      ['플레이 시간', `${Math.floor(t / 3600)}시간 ${Math.floor((t % 3600) / 60)}분`],
    ];
    let recs = '';
    p.records.forEach((r, i) => {
      recs += `<div class="rec"><b>${i + 1}호점 · ${STAGES[i]?.name || ''}</b><span>수익 ${fmt(r.earned)} · 손님 ${fmt(r.cust)} · 별 ${(r.stars || 0).toFixed(1)} · ${Math.round((r.time || 0) / 60)}분</span></div>`;
    });
    recs += `<div class="rec cur"><b>${p.stage + 1}호점 · ${g.stage.name} (영업 중)</b><span>수익 ${fmt(g.run.earned)} · 손님 ${fmt(g.run.cust)} · 별 ${g.stars().toFixed(1)}</span></div>`;
    this.open(`<h2>통계</h2><div class="stats">${rows.map(([a, b]) => `<div><span>${a}</span><b>${b}</b></div>`).join('')}</div><h3>식당 기록</h3><div class="recs">${recs}</div>`, 'statsp');
  }

  // ---------------- 오프라인 수익 ----------------
  openOffline(amount, sec, canDouble, onClaim) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const w = this.open(
      `<div class="off-ic">${SVG.coin}</div><h2>자리를 비운 동안 벌었어요</h2>
      <p class="sub">${h ? h + '시간 ' : ''}${m}분 동안 직원들이 영업했어요</p>
      <div class="off-amt"><span class="ic">${SVG.coin}</span>${fmt(amount)}</div>
      <div class="col">
        <button class="big-btn" id="o-2x" ${canDouble ? '' : 'disabled'}>2배 받기 <small>${canDouble ? '오늘 1회 무료' : '내일 다시 가능'}</small></button>
        <button class="btn" id="o-1x">그냥 받기</button>
      </div>`,
      'offline',
      null,
      { noClose: true, noBackdrop: true }
    );
    $('#o-2x', w).onclick = () => {
      this.close(true);
      onClaim(2);
    };
    $('#o-1x', w).onclick = () => {
      this.close(true);
      onClaim(1);
    };
  }

  // ---------------- 식당 이전 결과 ----------------
  openResult(sum, final, onNext) {
    const next = STAGES[sum.stage + 1];
    const w = this.open(
      `<div class="res-top"><div class="stamp">${final ? '전설의 셰프' : '영업 성공'}</div></div>
      <h2>${sum.name} 졸업!</h2>
      <div class="stats res">
        <div><span>총 수익</span><b>${fmt(sum.earned)}</b></div>
        <div><span>접대한 손님</span><b>${fmt(sum.cust)}명</b></div>
        <div><span>최종 별점</span><b>${sum.stars.toFixed(1)}</b></div>
        <div><span>최고 콤보</span><b>${sum.bestCombo}</b></div>
        <div><span>영업 시간</span><b>${Math.max(1, Math.round(sum.time / 60))}분</b></div>
        <div><span>보상</span><b><span class="ic">${SVG.pearl}</span>${sum.pearls}</b></div>
      </div>
      ${final ? '<p class="sub">우주 최고의 회전초밥집을 완성했어요! 계속 영업하며 기록을 늘려보세요.</p>' : `<p class="sub">다음 식당: <b>${next.name}</b><br>${next.sub}</p>`}
      <button class="big-btn" id="r-next">${final ? '계속 영업하기' : '새 식당으로 이전!'}</button>`,
      'result',
      null,
      { noClose: true, noBackdrop: true }
    );
    $('#r-next', w).onclick = () => {
      this.close(true);
      onNext();
    };
  }
}

function costumePreview(tab, it) {
  if (tab === 'apron') return `<svg viewBox="0 0 48 48"><path d="M14 8h20v8l6 4v22H8V20l6-4z" fill="${it.color}" stroke="#333" stroke-width="2"/><path d="M14 8q10 8 20 0" fill="none" stroke="#333" stroke-width="2"/><rect x="18" y="26" width="12" height="8" rx="2" fill="none" stroke="#333" stroke-width="2"/></svg>`;
  if (tab === 'skin') {
    const o = it.over;
    return `<svg viewBox="0 0 48 48"><rect x="4" y="18" width="40" height="26" rx="3" fill="${o.floorTint || '#e2c08c'}" stroke="#333" stroke-width="2"/><rect x="8" y="4" width="32" height="16" fill="${o.noren || '#23407a'}" stroke="#333" stroke-width="2"/><circle cx="24" cy="12" r="4" fill="#fff"/><circle cx="10" cy="30" r="5" fill="${o.lantern || '#ff5a3c'}" stroke="#333" stroke-width="2"/><rect x="18" y="28" width="22" height="8" rx="4" fill="${o.counter || '#d8a86a'}" stroke="#333" stroke-width="2"/></svg>`;
  }
  const hats = {
    chef: '<ellipse cx="24" cy="16" rx="14" ry="10" fill="#fff" stroke="#333" stroke-width="2"/><rect x="13" y="20" width="22" height="10" fill="#fff" stroke="#333" stroke-width="2"/>',
    band: '<rect x="8" y="22" width="32" height="7" rx="3" fill="#fff" stroke="#333" stroke-width="2"/><circle cx="24" cy="25" r="3.5" fill="#e2394f"/>',
    cat: '<path d="M10 30l4-18 8 12zM38 30l-4-18-8 12z" fill="#ff9a3c" stroke="#333" stroke-width="2" stroke-linejoin="round"/>',
    pirate: '<path d="M4 28q20-22 40 0z" fill="#2a2a2e" stroke="#333" stroke-width="2"/><rect x="20" y="16" width="8" height="6" fill="#fff"/>',
    crown: '<path d="M8 32l3-18 7 8 6-12 6 12 7-8 3 18z" fill="#ffc83d" stroke="#8a5a00" stroke-width="2" stroke-linejoin="round"/>',
    helmet: '<circle cx="24" cy="24" r="16" fill="#bfe8ff" stroke="#333" stroke-width="2" opacity=".85"/><circle cx="18" cy="18" r="4" fill="#fff"/>',
  };
  return `<svg viewBox="0 0 48 48"><circle cx="24" cy="34" r="11" fill="#ffd9b8" stroke="#333" stroke-width="2"/>${hats[it.id] || ''}</svg>`;
}
