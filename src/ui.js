import { SKILLS, EVOLUTIONS, SKILL_MAX, EVO_OF } from './config.js';

const S = (inner) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
export const ICONS = {
  orbit: S('<circle cx="12" cy="12" r="3.5" fill="currentColor"/><ellipse cx="12" cy="12" rx="9" ry="5" transform="rotate(-25 12 12)"/><circle cx="20" cy="8.5" r="1.8" fill="currentColor"/><circle cx="4" cy="15.5" r="1.8" fill="currentColor"/>'),
  cannon: S('<circle cx="7" cy="17" r="4" fill="currentColor"/><path d="M10 14 L19 5"/><path d="M13 5 H19 V11"/>'),
  pulse: S('<circle cx="12" cy="12" r="2.5" fill="currentColor"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="9.5" opacity=".6"/>'),
  horizon: S('<path d="M12 3 A9 9 0 0 1 21 12"/><path d="M12 21 A9 9 0 0 1 3 12"/><path d="M12 7 A5 5 0 0 1 17 12"/><path d="M12 17 A5 5 0 0 1 7 12"/><circle cx="12" cy="12" r="1.8" fill="currentColor"/>'),
  glutton: S('<path d="M20 7 A9 9 0 1 0 20 17 L12 12 Z" fill="currentColor"/><circle cx="11" cy="7.5" r="1.2" fill="#1a1030" stroke="none"/>'),
  haste: S('<path d="M5 6 L11 12 L5 18"/><path d="M12 6 L18 12 L12 18"/>'),
  regen: S('<path d="M12 5 V19 M5 12 H19" stroke-width="3.2"/>'),
  bolt: S('<path d="M13 2 L5 13 H11 L9 22 L19 10 H13 Z" fill="currentColor"/>'),
  dash: S('<ellipse cx="6" cy="12" rx="2.5" ry="6"/><path d="M9 12 H20 M16 8 L20 12 L16 16"/>'),
  nova: S('<path d="M12 2 L14 9 L21 7 L16 12 L21 17 L14 15 L12 22 L10 15 L3 17 L8 12 L3 7 L10 9 Z" fill="currentColor"/>'),
  saw: S('<circle cx="12" cy="12" r="4"/><path d="M12 2 L14 6 L18 4 L18 8.5 L22 10 L19 13 L21 17 L16.5 17 L15 21 L12 18 L9 21 L7.5 17 L3 17 L5 13 L2 10 L6 8.5 L6 4 L10 6 Z"/>'),
  greed: S('<path d="M6 4 H18 L22 9 L12 21 L2 9 Z" fill="currentColor"/><path d="M2 9 H22 M9 4 L7.5 9 L12 21 L16.5 9 L15 4" stroke="#1a1030" stroke-width="1.3"/>'),
  accretion: S('<ellipse cx="12" cy="12" rx="10" ry="4" /><ellipse cx="12" cy="12" rx="6.5" ry="2.4"/><circle cx="12" cy="12" r="2.5" fill="currentColor"/>'),
  singularity: S('<circle cx="12" cy="12" r="4" fill="currentColor"/><path d="M2 12 H6 M22 12 H18 M12 2 V6 M12 22 V18 M4.5 4.5 L7.5 7.5 M19.5 19.5 L16.5 16.5"/>'),
  storm: S('<path d="M9 2 L4 11 H8 L6 20 L13 9 H9 Z" fill="currentColor"/><path d="M17 4 L13 12 H16 L14 21 L21 10 H17 Z" fill="currentColor" opacity=".7"/>'),
  vampsaw: S('<circle cx="12" cy="12" r="5" fill="currentColor"/><path d="M12 1 L14 5 L18 3 L18 7.5 L23 9 L20 12.5 L23 16 L18 16.5 L17 21 L12.5 19 L9 22.5 L7 18 L2 17 L4.5 12.5 L1.5 8 L6.5 7 L7 2.5 L11 4.5 Z"/>'),
  collapse: S('<circle cx="12" cy="12" r="3" fill="currentColor"/><path d="M3 12 H8 M21 12 H16 M12 3 V8 M12 21 V16"/><circle cx="12" cy="12" r="9.5" stroke-dasharray="3 2.5"/>'),
  goldnova: S('<path d="M12 1 L14.5 8.5 L22 7 L16.5 12 L22 17 L14.5 15.5 L12 23 L9.5 15.5 L2 17 L7.5 12 L2 7 L9.5 8.5 Z" fill="currentColor"/><circle cx="12" cy="12" r="3" fill="#1a1030"/>'),
  rift: S('<path d="M4 20 L9 13 L7 11 L13 5 L11 9 L14 11 L20 4"/><ellipse cx="5" cy="19" rx="2.5" ry="1.5"/><ellipse cx="19" cy="5" rx="2.5" ry="1.5"/>'),
  heal: S('<path d="M12 20 C4 14 3 9 6 6.5 C8.5 4.5 11 6 12 8 C13 6 15.5 4.5 18 6.5 C21 9 20 14 12 20 Z" fill="currentColor"/>'),
  coin: S('<circle cx="12" cy="12" r="8.5" fill="currentColor"/><circle cx="12" cy="12" r="5" stroke="#1a1030"/>'),
};

const fmtTime = (t) => {
  t = Math.max(0, Math.floor(t));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
};

export class UI {
  constructor(root) {
    this.root = root;
    root.innerHTML = `
      <div id="vignette"></div>
      <div id="flash"></div>
      <div id="dmg-layer"></div>
      <div id="joy"><div class="base"><div class="knob"></div></div></div>
      <div id="hud" class="hidden">
        <div class="hud-top">
          <div class="hud-row1">
            <div class="xpbar"><div class="fill"></div><span class="lv">Lv 1</span></div>
            <div class="hud-stats"><span id="stSwallow">삼킴 0</span><span id="stKill">처치 0</span><span id="stSize">1.0m</span></div>
          </div>
          <div class="hud-row">
            <div class="hpbar"><div class="fill"></div><span class="txt">100</span></div>
            <div id="bossbar" class="hidden"><div class="bar"><div class="fill"></div><span class="name"></span></div></div>
            <div class="hpchip hidden">♥ <b>0</b></div>
            <div class="timer">0:00</div>
            <button class="btn icon" id="btnPause" aria-label="일시정지"><svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/></svg></button>
          </div>
          <div id="comboSmall"></div>
        </div>
        <div id="combo"></div>
        <div id="banner"></div>
        <div id="skillbar"></div>
        <div id="arrow"><div class="ar"><svg viewBox="0 0 24 24"><path d="M4 5 L21 12 L4 19 L8 12 Z" fill="currentColor"/></svg></div><span></span></div>
      </div>
      <div id="tutorial" class="hidden">
        <div class="finger"><div class="trail"></div><div class="dot"></div></div>
        <div class="tip"><span class="tip-t">화면 아무 곳이나 누르고 드래그해서 이동</span><br><b class="goal"></b></div>
      </div>
      <div id="title" class="screen"></div>
      <div id="levelup" class="screen hidden">
        <div class="lu-title">레벨 업!</div>
        <div class="lu-sub">스킬을 하나 골라줘</div>
        <div class="cards"></div>
        <button class="btn reroll hidden" id="btnReroll">다시 뽑기</button>
      </div>
      <div id="pause" class="screen hidden">
        <div class="panel">
          <h2>일시정지</h2>
          <div class="pause-skills"></div>
          <button class="btn primary" id="btnResume">계속하기</button>
          <button class="btn" id="btnRestart">다시 시작</button>
          <button class="btn" id="btnToTitle">타이틀로</button>
          <div class="vol-row"><button class="btn icon" id="btnMute2" aria-label="음소거"></button><div class="vols">
            <label>배경음<input type="range" min="0" max="100" class="vol" data-vol="music"></label>
            <label>효과음<input type="range" min="0" max="100" class="vol" data-vol="sfx"></label>
          </div></div>
        </div>
      </div>
      <div id="result" class="screen hidden">
        <div class="panel res-panel">
          <div class="res-head"><h2 class="res-title"></h2><div class="res-wallet coins"></div></div>
          <div class="res-scroll">
            <div class="res-grid"></div>
            <div class="res-coins"></div>
            <div class="res-next"></div>
            <div class="res-best"></div>
            <div class="res-meta"></div>
          </div>
          <div class="res-btns">
            <button class="btn primary" id="btnAgain">다시 하기</button>
            <button class="btn" id="btnResTitle">타이틀로</button>
          </div>
        </div>
      </div>
      <div id="toast"></div>
    `;
    this.$ = (s) => root.querySelector(s);
    this.hud = this.$('#hud');
    this.xpFill = this.$('.xpbar .fill');
    this.lvTxt = this.$('.xpbar .lv');
    this.hpFill = this.$('.hpbar .fill');
    this.hpTxt = this.$('.hpbar .txt');
    this.timerEl = this.$('.timer');
    this.comboEl = this.$('#combo');
    this.bannerEl = this.$('#banner');
    this.toastEl = this.$('#toast');
    this.vig = this.$('#vignette');
    this.flashEl = this.$('#flash');
    this.bossbar = this.$('#bossbar');
    this.arrow = this.$('#arrow');
    this.cache = {};
  }

  set(key, el, prop, val) {
    if (this.cache[key] === val) return;
    this.cache[key] = val;
    if (prop === 'text') el.textContent = val;
    else if (prop === 'width') el.style.width = val;
    else if (prop === 'html') el.innerHTML = val;
  }

  show(id) {
    this.$(id).classList.remove('hidden');
  }
  hide(id) {
    this.$(id).classList.add('hidden');
  }

  setMuteIcon(m) {
    const svg = m
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 9 H8 L13 5 V19 L8 15 H4 Z" fill="currentColor"/><path d="M17 9 L22 14 M22 9 L17 14"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 9 H8 L13 5 V19 L8 15 H4 Z" fill="currentColor"/><path d="M16.5 8.5 A5 5 0 0 1 16.5 15.5 M19 6 A8.5 8.5 0 0 1 19 18"/></svg>';
    this.$('#btnMute2').innerHTML = svg;
  }

  updateHUD(g) {
    const h = g.hole;
    this.set('xp', this.xpFill, 'width', `${Math.min(100, (g.xp / g.xpNeed) * 100).toFixed(1)}%`);
    this.set('lv', this.lvTxt, 'text', `Lv ${g.level}`);
    this.set('hp', this.hpFill, 'width', `${Math.max(0, (h.hp / h.maxHp) * 100).toFixed(1)}%`);
    this.set('hpt', this.hpTxt, 'text', `${Math.ceil(Math.max(0, h.hp))} / ${Math.round(h.maxHp)}`);
    const remain = g.time < 300 ? 300 - g.time : g.time;
    this.set('time', this.timerEl, 'text', g.time < 300 ? fmtTime(remain) : `+${fmtTime(g.time - 300)}`);
    this.set('sw', this.$('#stSwallow'), 'text', `삼킴 ${g.stats.swallowed}`);
    this.set('kl', this.$('#stKill'), 'text', `처치 ${g.stats.kills}`);
    const cs = g.combo >= 3 ? `x${g.combo}` : '';
    this.set('cs', this.$('#comboSmall'), 'text', cs);
    this.set('sz', this.$('#stSize'), 'text', `${(h.r * 2).toFixed(1)}m`);
    this.hpFill.classList.toggle('low', h.hp / h.maxHp < 0.3);
    const boss = g.enemies.boss || g.enemies.mini;
    // 보스전: HP 바 자리를 보스 바로 바꾸고 HP 는 작은 칩으로
    this.hpbar ||= this.$('.hpbar');
    this.hpchip ||= this.$('.hpchip');
    this.hpbar.classList.toggle('hidden', !!boss);
    this.hpchip.classList.toggle('hidden', !boss);
    this.hpchip.classList.toggle('low', h.hp / h.maxHp < 0.3);
    if (boss) this.set('hc', this.hpchip.querySelector('b'), 'text', Math.ceil(Math.max(0, h.hp)));
    if (boss) {
      this.bossbar.classList.remove('hidden');
      const eat = boss.size < h.r * 0.94;
      this.bossbar.classList.toggle('gold', eat);
      this.set('bn', this.bossbar.querySelector('.name'), 'text', (boss.name || boss.def.name) + (eat ? '  ▶ 지금 삼켜!' : ''));
      this.set('bf', this.bossbar.querySelector('.fill'), 'width', `${((boss.hp / boss.maxHp) * 100).toFixed(1)}%`);
    } else this.bossbar.classList.add('hidden');
  }

  renderSkillbar(skills) {
    const items = [];
    for (const id of skills.order) {
      let icon = id;
      let color = SKILLS[id].color;
      for (const ev of EVO_OF[id] || []) {
        if (skills.evo[ev] && EVOLUTIONS[ev].from[0] === id) (icon = ev), (color = EVOLUTIONS[ev].color);
      }
      items.push(`<div class="sk" style="color:${color}">${ICONS[icon]}<span>${skills.lv[id]}</span></div>`);
    }
    this.$('#skillbar').innerHTML = items.join('');
    this.$('.pause-skills').innerHTML = skills.order
      .map((id) => `<div class="ps"><div class="ic" style="color:${SKILLS[id].color}">${ICONS[id]}</div><div><b>${SKILLS[id].name} Lv${skills.lv[id]}</b><small>${SKILLS[id].desc(skills.lv[id])}</small></div></div>`)
      .join('') || '<div class="ps-empty">아직 스킬이 없음</div>';
  }

  showLevelUp(choices, skills, onPick, rerolls = 0, onReroll = null) {
    const el = this.$('#levelup');
    const rb = this.$('#btnReroll');
    rb.classList.toggle('hidden', !(rerolls > 0 && onReroll));
    rb.textContent = `다시 뽑기 (${rerolls})`;
    rb.onclick = (e) => {
      e.stopPropagation();
      if (onReroll) onReroll();
    };
    const cards = el.querySelector('.cards');
    cards.innerHTML = choices
      .map((c, i) => {
        let name, desc, color, icon, tag;
        let recipe = '';
        if (c.kind === 'skill') {
          const d = SKILLS[c.id];
          name = d.name;
          desc = d.desc(c.lvl);
          color = d.color;
          icon = ICONS[c.id];
          tag = c.lvl === 1 ? '<span class="tag new">NEW</span>' : `<span class="tag">Lv ${c.lvl}${c.lvl === SKILL_MAX ? ' MAX' : ''}</span>`;
          // 진화 재료 표시: 짝 스킬 아이콘 -> 진화 아이콘
          recipe = (EVO_OF[c.id] || [])
            .map((ev) => {
              const E = EVOLUTIONS[ev];
              const [a, b] = E.from;
              const have = (k) => (skills.lv[k] || 0) >= E.need[k] || (k === c.id && c.lvl >= E.need[k]);
              return `<span class="rc" title="${E.name}"><i class="${have(a) ? 'ok' : ''}" style="color:${SKILLS[a].color}">${ICONS[a]}</i>+<i class="${have(b) ? 'ok' : ''}" style="color:${SKILLS[b].color}">${ICONS[b]}</i>→<i style="color:${E.color}">${ICONS[ev]}</i></span>`;
            })
            .join('');
        } else if (c.kind === 'evo') {
          const d = EVOLUTIONS[c.id];
          name = d.name;
          desc = d.desc();
          color = d.color;
          icon = ICONS[c.id];
          tag = '<span class="tag evo">진화</span>';
          recipe = `<span class="rc"><i class="ok" style="color:${SKILLS[d.from[0]].color}">${ICONS[d.from[0]]}</i>+<i class="ok" style="color:${SKILLS[d.from[1]].color}">${ICONS[d.from[1]]}</i></span>`;
        } else if (c.kind === 'heal') {
          name = 'HP 회복';
          desc = '최대 HP의 35% 회복';
          color = '#ff8fa3';
          icon = ICONS.heal;
          tag = '';
        } else {
          name = '코인 주머니';
          desc = '코인 +25';
          color = '#ffd24a';
          icon = ICONS.coin;
          tag = '';
        }
        const pips = c.kind === 'skill' ? `<div class="pips">${Array.from({ length: SKILL_MAX }, (_, k) => `<i class="${k < c.lvl ? 'on' : ''}${k === c.lvl - 1 ? ' next' : ''}"></i>`).join('')}</div>` : '';
        return `<button class="card ${c.kind}" data-i="${i}" style="--c:${color}; animation-delay:${i * 0.07}s">
          <div class="card-icon" style="color:${color}">${icon}</div>
          <div class="card-body"><div class="card-name">${name} ${tag}</div><div class="card-desc">${desc}</div>${pips}${recipe ? `<div class="recipe">${recipe}</div>` : ''}</div>
        </button>`;
      })
      .join('');
    el.classList.remove('hidden');
    let armed = false;
    setTimeout(() => (armed = true), 350);
    cards.querySelectorAll('.card').forEach((b) => {
      b.onclick = () => {
        if (!armed) return;
        el.classList.add('hidden');
        onPick(choices[+b.dataset.i]);
      };
    });
  }

  setTutorial(step, v) {
    const el = this.$('#tutorial .goal');
    const tip = this.$('#tutorial .tip-t');
    const tut = this.$('#tutorial');
    tut.dataset.step = step;
    if (step === 1) {
      tip.textContent = '화면 아무 곳이나 누르고 드래그해서 이동';
      el.textContent = `1단계: 홀보다 작은 걸 3개 먹어봐 (${v}/3)`;
    } else if (step === 2) {
      tip.textContent = '보라색 링 = 삼킬 수 있는 로봇. 화살표를 따라가!';
      el.textContent = '2단계: 보라 링 청소봇 1대 삼키기';
    } else {
      tip.textContent = '빨간 링 = 홀보다 큰 로봇. 닿으면 아파!';
      el.textContent = `3단계: 빨간 링 로봇 피하기 ${v.toFixed(1)} / 5초`;
    }
    el.classList.toggle('done', false);
  }

  showResult(r) {
    const el = this.$('#result');
    el.querySelector('.res-title').textContent = r.cleared ? '메카 격파! 정화 완료' : '홀이 닫혔다...';
    el.querySelector('.res-title').classList.toggle('win', r.cleared);
    const cells = [
      ['생존 시간', r.time, (v) => fmtTime(v)],
      ['삼킨 개수', r.swallowed, (v) => Math.round(v)],
      ['최대 크기', r.size, (v) => v.toFixed(1) + 'm'],
      ['처치 수', r.kills, (v) => Math.round(v)],
      ['도달 레벨', r.level, (v) => Math.round(v)],
      ['최고 콤보', r.maxCombo, (v) => 'x' + Math.round(v)],
    ];
    el.querySelector('.res-grid').innerHTML = cells.map(([k]) => `<div><span>${k}</span><b>0</b></div>`).join('');
    const bs = el.querySelectorAll('.res-grid b');
    const coinsEl = el.querySelector('.res-coins');
    coinsEl.innerHTML = `${ICONS.coin}<b>+0</b> 코인 획득`;
    const wallet = el.querySelector('.res-wallet');
    const startCoins = r.walletAfter - r.coins - (r.meta.daily || 0) - r.meta.newAch.reduce((a, x) => a + x.reward, 0);
    wallet.innerHTML = `${ICONS.coin}<b>${Math.max(0, startCoins)}</b>`;
    el.querySelector('.res-best').innerHTML = (r.daily ? '<span class="daily-tag">데일리 챌린지</span> ' : `<span class="map-tag">${r.mapName} 난이도 ${r.diff}</span> `) + (r.newBest ? '<span class="nb">신기록!</span>' : `최고 ${fmtTime(r.bestTime)}`);
    const next = el.querySelector('.res-next');
    if (r.nextUpg) {
      const { name, cost } = r.nextUpg;
      const have = r.walletAfter;
      const pct = Math.min(100, (have / cost) * 100);
      next.innerHTML = `<div class="nx-t">${have >= cost ? `<b>${name}</b> 강화 가능!` : `다음 강화 <b>${name}</b>까지 ${cost - have}코인`}</div><div class="prog"><div style="width:0%"></div></div>`;
      setTimeout(() => (next.querySelector('.prog div').style.width = pct + '%'), 900);
    } else next.innerHTML = '';
    const meta = [];
    for (const u of r.meta.unlocks) meta.push(`<div class="mi unlock">${u}</div>`);
    if (r.meta.daily) meta.push(`<div class="mi unlock">데일리 챌린지 완료! +${r.meta.daily} 코인</div>`);
    for (const a of r.meta.newAch) meta.push(`<div class="mi ach">업적 달성: ${a.name} +${a.reward}</div>`);
    for (const m of r.meta.missions) meta.push(`<div class="mi mis">미션 완료: ${m}</div>`);
    el.querySelector('.res-meta').innerHTML = meta.join('');
    el.classList.remove('hidden');
    el.querySelector('.res-scroll').scrollTop = 0;
    // 숫자 카운트업 + 코인이 지갑으로 날아감
    const t0 = performance.now();
    const D = 900;
    const tick = () => {
      const k = Math.min(1, (performance.now() - t0) / D);
      const e = 1 - Math.pow(1 - k, 3);
      cells.forEach(([, v, f], i) => (bs[i].textContent = f(v * e)));
      coinsEl.querySelector('b').textContent = '+' + Math.round(r.coins * e);
      if (k < 1) requestAnimationFrame(tick);
      else this.flyCoins(coinsEl, wallet, Math.max(0, startCoins), r.walletAfter);
    };
    requestAnimationFrame(tick);
  }

  flyCoins(from, to, a, b) {
    const layer = this.root;
    const rr = layer.getBoundingClientRect();
    const f = from.getBoundingClientRect();
    const t = to.getBoundingClientRect();
    const n = 10;
    for (let i = 0; i < n; i++) {
      const c = document.createElement('div');
      c.className = 'fly-coin';
      c.innerHTML = ICONS.coin;
      const sx = f.left - rr.left + f.width * (0.3 + Math.random() * 0.4);
      const sy = f.top - rr.top + f.height / 2;
      const tx = t.left - rr.left + 14;
      const ty = t.top - rr.top + t.height / 2;
      c.style.transform = `translate(${sx}px, ${sy}px)`;
      layer.appendChild(c);
      const delay = i * 45;
      setTimeout(() => {
        c.style.transition = 'transform 0.55s cubic-bezier(.5,-0.4,.7,1), opacity 0.2s 0.5s';
        c.style.transform = `translate(${tx}px, ${ty}px) scale(0.7)`;
        c.style.opacity = '0';
      }, delay + 20);
      setTimeout(() => this.audio && this.audio.coin(), delay + 560);
      setTimeout(() => c.remove(), delay + 800);
    }
    const t0 = performance.now() + 350;
    const w = to.querySelector('b');
    const tick = () => {
      const k = Math.max(0, Math.min(1, (performance.now() - t0) / 700));
      w.textContent = Math.round(a + (b - a) * k);
      if (k < 1) requestAnimationFrame(tick);
      else {
        to.classList.remove('bump');
        void to.offsetWidth;
        to.classList.add('bump');
      }
    };
    requestAnimationFrame(tick);
  }

  // 콤보: 평소엔 우상단 작은 카운터, 10 단위에서만 크게
  combo(n) {
    if (n < 10 || n % 10 !== 0) return;
    const el = this.comboEl;
    const word = n >= 50 ? '대식가!!' : n >= 30 ? '꿀꺽!!' : n >= 20 ? '냠냠!' : '냠!';
    el.innerHTML = `<b>x${n}</b> ${word}`;
    el.classList.remove('pop');
    void el.offsetWidth;
    el.classList.add('pop');
    el.style.fontSize = `${Math.min(34, 20 + n * 0.3)}px`;
  }

  banner(text, kind = '') {
    const el = this.bannerEl;
    el.className = kind;
    el.innerHTML = text;
    void el.offsetWidth;
    el.classList.add('show');
    clearTimeout(this._bt);
    this._bt = setTimeout(() => el.classList.remove('show'), kind === 'boss' ? 2600 : 1400);
  }

  toast(text) {
    const el = this.toastEl;
    el.textContent = text;
    el.classList.remove('show');
    void el.offsetWidth;
    el.classList.add('show');
  }

  hurt() {
    this.vig.classList.remove('hit');
    void this.vig.offsetWidth;
    this.vig.classList.add('hit');
  }

  setLowHp(low) {
    this.vig.classList.toggle('low', low);
  }

  flash(color) {
    this.flashEl.style.background = color;
    this.flashEl.classList.remove('go');
    void this.flashEl.offsetWidth;
    this.flashEl.classList.add('go');
  }
}
