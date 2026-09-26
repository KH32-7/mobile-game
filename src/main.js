import './style.css';
import {
  CARDS, RELICS, BATTLE, CAMPAIGN, DECK_MAX, DECK_MIN, PLAYABLE, ARENAS, RUN_TIERS, TROPHY, ACHIEVEMENTS,
  LEVEL_COST, CARD_MAX_LEVEL, CARD_LEVEL_BONUS, ENEMY_DECKS, stageParams,
} from './config.js';
import { Battle, shuffle } from './battle.js';
import { AI } from './ai.js';
import { Renderer, buildCardFace } from './render.js';
import { UI, setFaceMaker, cardImg, relicImg, iconImg, crownSvg } from './ui.js';
import { initAudio, sfx, playBgm, setMuted, suspendAudio } from './audio.js';
import { loadRun, writeRun } from './storage.js';
import { newRun, availableNodes, runRng, rollCards, rollRelics, enemySetup, NODE_INFO, copies } from './campaign.js';
import * as M from './meta.js';
import { makeRng } from './rng.js';

const qs = new URLSearchParams(location.search);
const DEBUG = qs.has('debug');
const SEED = qs.get('seed') ? Number(qs.get('seed')) : null;
const TIME_SCALE = Number(qs.get('speed')) || (DEBUG ? 3 : 1);
const INF_ELIXIR = qs.has('elixir');
const START_ROW = qs.get('stage') ? Math.max(0, Math.min(9, Number(qs.get('stage')) - 1)) : 0;

const app = document.getElementById('app');
const canvas = document.getElementById('cv');
const uiRoot = document.getElementById('ui');
const safeProbe = document.getElementById('safe');

const vib = (p) => {
  try {
    if (navigator.vibrate) navigator.vibrate(p);
  } catch {
    /* 미지원 */
  }
};

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const SPEAKER_ON = '<svg viewBox="0 0 24 24" width="22" height="22"><path d="M4 9h4l5-4v14l-5-4H4z" fill="#fff"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round"/></svg>';
const SPEAKER_OFF = '<svg viewBox="0 0 24 24" width="22" height="22"><path d="M4 9h4l5-4v14l-5-4H4z" fill="#fff"/><path d="M16 9l6 6M22 9l-6 6" stroke="#ff8a8a" stroke-width="2.2" stroke-linecap="round"/></svg>';
const COIN = '<i class="coin"></i>';
const CHEST_SVG = (open) => `<svg viewBox="0 0 64 52" class="chest-svg${open ? ' ready' : ''}"><rect x="6" y="22" width="52" height="26" rx="4" fill="#b8733a" stroke="#4a2a14" stroke-width="3"/><path d="M6 24 Q6 6 32 6 Q58 6 58 24 Z" fill="#d88a44" stroke="#4a2a14" stroke-width="3"/><rect x="28" y="18" width="8" height="12" rx="2" fill="#ffd040" stroke="#4a2a14" stroke-width="2"/><path d="M6 34 H58" stroke="#8a4a1a" stroke-width="3"/></svg>`;

class Game {
  constructor() {
    this.p = M.loadProfile();
    M.checkStreak(this.p);
    M.ensureDaily(this.p);
    this.save();
    setMuted(this.p.muted);
    this.renderer = new Renderer(canvas);
    setFaceMaker((id, w, h, dpr) => buildCardFace(id, w, h, dpr));
    this.ui = new UI(uiRoot, (a, arg, el) => this.action(a, arg, el));
    this.run = loadRun();
    this.scene = 'title';
    this.battle = null;
    this.ai = null;
    this.drag = null;
    this.selected = -1;
    this.tut = null;
    this.tutView = null;
    this.paused = false;
    this.timeScale = TIME_SCALE;
    this.debug = DEBUG;
    this.acc = 0;
    this.hitstop = 0;
    this.endT = 0;
    this.fps = 60;
    this.last = performance.now();
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.bindInput();
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        if (this.scene === 'battle' && this.battle && !this.battle.ended && !this.paused) this.pause();
        suspendAudio(true);
      } else suspendAudio(false);
    });
    const unlock = () => initAudio();
    window.addEventListener('pointerdown', unlock, { capture: true });
    setInterval(() => this.tickLobby(), 1000);
    this.showTitle();
    requestAnimationFrame((t) => this.frame(t));
  }

  save() {
    M.saveProfile(this.p);
  }

  saveRun() {
    writeRun(this.run);
  }

  // ---------- 레이아웃 ----------
  resize() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = Math.max(300, Math.min(vw, Math.round(vh * 0.62)));
    app.style.width = w + 'px';
    app.style.height = vh + 'px';
    const cs = getComputedStyle(safeProbe);
    const safe = {
      top: parseFloat(cs.paddingTop) || 0,
      bottom: parseFloat(cs.paddingBottom) || 0,
    };
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    this.renderer.resize(w, vh, dpr, safe);
  }

  local(e) {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  // ---------- 입력 ----------
  bindInput() {
    const R = this.renderer;
    const cardAt = (x, y) => {
      const L = R.L;
      for (let i = 0; i < 4; i++) {
        const c = L.cards[i];
        if (x >= c.x - 3 && x <= c.x + c.w + 3 && y >= c.y - 12 && y <= c.y + c.h + 6) return i;
      }
      return -1;
    };
    canvas.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      if (this.scene !== 'battle' || this.paused || !this.battle || this.battle.ended) return;
      const { x, y } = this.local(e);
      const pb = R.L.pause;
      if (x >= pb.x && x <= pb.x + pb.w && y >= pb.y && y <= pb.y + pb.h) {
        this.pause();
        return;
      }
      const i = cardAt(x, y);
      if (i >= 0) {
        this.drag = { idx: i, x, y, sx: x, sy: y, id: e.pointerId };
        try {
          canvas.setPointerCapture(e.pointerId);
        } catch {
          /* 무시 */
        }
        sfx('pick');
        return;
      }
      if (this.selected >= 0 && R.overArena(y)) {
        this.deploy(this.selected, x, y);
        this.selected = -1;
      }
    });
    canvas.addEventListener('pointermove', (e) => {
      if (!this.drag || e.pointerId !== this.drag.id) return;
      const { x, y } = this.local(e);
      this.drag.x = x;
      this.drag.y = y;
    });
    const up = (e) => {
      if (!this.drag || e.pointerId !== this.drag.id) return;
      const d = this.drag;
      this.drag = null;
      if (this.scene !== 'battle' || !this.battle || this.battle.ended || this.paused) return;
      const { x, y } = this.local(e);
      const moved = Math.hypot(x - d.sx, y - d.sy) > 12;
      if (!moved && cardAt(x, y) === d.idx) {
        this.selected = this.selected === d.idx ? -1 : d.idx;
        return;
      }
      if (R.overArena(y)) this.deploy(d.idx, x, y);
    };
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', (e) => {
      if (this.drag && e.pointerId === this.drag.id) this.drag = null;
    });
    canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.scene === 'battle' && this.battle && !this.battle.ended) {
        if (this.paused) this.resume();
        else this.pause();
      }
    });
  }

  deploy(idx, x, y) {
    const b = this.battle;
    const w = this.renderer.s2w(x, y);
    const id = b.teams[0].hand[idx];
    const merge = b.findMerge(0, id, w.x, w.y);
    const cost = b.costOf(0, id, !!merge);
    if (b.teams[0].elixir < cost) {
      this.renderer.deny('엘릭서가 부족해요', idx);
      sfx('deny');
      vib(30);
      return;
    }
    const res = b.playCard(0, idx, w.x, w.y);
    if (res) {
      vib(12);
      if (this.tut && this.tut.step === 0) {
        this.tut.step = 1;
        this.tut.t = 0;
      }
    }
  }

  // ---------- 루프 ----------
  frame(ts) {
    const dt = Math.min(0.05, Math.max(0, (ts - this.last) / 1000));
    this.last = ts;
    if (dt > 0) this.fps = this.fps * 0.95 + (1 / dt) * 0.05;
    if (this.scene === 'battle' && this.battle) {
      if (!this.paused) {
        let sim = dt * this.timeScale;
        if (this.hitstop > 0) {
          this.hitstop -= dt;
          sim *= 0.1;
        }
        this.acc += sim;
        const step = 1 / 60;
        let n = 0;
        while (this.acc >= step && n < 16) {
          this.battle.update(step);
          if (!this.battle.ended) this.ai.update(step);
          this.acc -= step;
          n++;
        }
        if (n >= 16) this.acc = 0;
        this.updateTut(dt);
        if (!this.battle.ended) {
          const fast = this.battle.double;
          playBgm(fast ? 'fast' : 'battle');
        }
        if (this.endT > 0) {
          this.endT -= dt;
          if (this.endT <= 0) this.showResult();
        }
      }
      this.renderer.draw(this, this.paused ? 0 : dt);
    } else {
      this.renderer.drawIdle(dt);
    }
    requestAnimationFrame((t) => this.frame(t));
  }

  // ---------- 튜토리얼 ----------
  updateTut(dt) {
    const t = this.tut;
    this.tutView = null;
    if (!t || !this.battle || this.battle.ended) return;
    const R = this.renderer;
    const b = this.battle;
    t.t += dt;
    if (t.step === 0) {
      const c = R.L.cards[0];
      const to = R.w2s(9, 23.5);
      this.tutView = { from: { x: c.x + c.w / 2, y: c.y + c.h / 2 }, to, text: '카드를 끌어서 내 진영에 놓아요' };
    } else {
      if (b.stats.merges[0] > 0 || t.t > 45) {
        this.tut = null;
        this.p.tutDone = true;
        this.save();
        return;
      }
      const hand = b.teams[0].hand;
      for (let i = 0; i < 4; i++) {
        const u = b.ents.find((e) => e.alive && e.team === 0 && e.card === hand[i] && e.level < 3 && e.kind !== 'tower');
        if (u) {
          const c = R.L.cards[i];
          const p = R.w2s(u.x, u.y);
          this.tutView = {
            from: { x: c.x + c.w / 2, y: c.y + c.h / 2 },
            to: { x: p.x, y: p.y - 12 },
            text: '같은 카드를 내 유닛 위에 놓으면 합성!\n별이 오르며 체력/공격력 대폭 상승',
          };
          return;
        }
      }
      if (t.t < 6) this.tutView = { text: '같은 카드가 손에 오면 합성을 노려봐요' };
    }
  }

  get tutDraw() {
    return this.tutView;
  }

  // ---------- 타이틀(로비) ----------
  showTitle() {
    this.scene = 'title';
    this.battle = null;
    this.renderer.setTheme(M.arenaIndex(this.p.trophies));
    playBgm('menu');
    const p = this.p;
    M.checkStreak(p);
    M.ensureDaily(p);
    const ai = M.arenaIndex(p.trophies);
    const A = ARENAS[ai];
    const next = ARENAS[ai + 1];
    const prog = next ? ((p.trophies - A.min) / (next.min - A.min)) * 100 : 100;
    const arenaBadge = M.claimableArenas(p).length;
    const upg = M.upgradableCount(p);
    const mis = M.claimableMissions(p) + (M.streakClaimable(p) ? 1 : 0);
    const ach = M.claimableAch(p);
    const tier = RUN_TIERS[(this.run?.tier || p.tierSelected) - 1];
    const ready = M.chestReady(p);
    const badge = (n) => (n ? `<span class="badge">${n}</span>` : '');
    const html = `
      <div class="lobby">
        <div class="topbar">
          <div class="coins" data-testid="coins">${COIN}<b>${p.coins}</b></div>
          <div class="streak-chip" data-act="missions">출석 ${p.streak.count}일</div>
          <button class="icon-btn" data-act="mute" aria-label="음소거">${p.muted ? SPEAKER_OFF : SPEAKER_ON}</button>
        </div>
        <div class="logo">
          <div class="logo-icons"><img src="${iconImg('knight', '#3d86ea')}"><img src="${iconImg('giant', '#e5484d')}"></div>
          <h1>포켓 시즈</h1>
          <div class="sub">카드 · 합성 · 원정</div>
        </div>
        <div class="arena-card" data-act="road" style="--ac:${A.color}">
          <div class="arena-row">
            <div><div class="arena-lbl">아레나 ${ai + 1}</div><div class="arena-name">${A.name}</div></div>
            <div class="tro">${crownSvg('#ffd040')}<b data-testid="trophies">${p.trophies}</b></div>
          </div>
          <div class="bar"><i style="width:${Math.max(3, Math.min(100, prog))}%"></i></div>
          <div class="arena-next">${next ? `다음: ${next.name} (${next.min})` : '최고 아레나 도달!'}</div>
          ${badge(arenaBadge)}
        </div>
        <button class="btn big gold" data-act="quick">빠른 대전<small>트로피를 걸고 AI와 한판</small></button>
        <div class="run-box">
          ${this.run ? `
            <button class="btn big blue" data-act="continue">원정 이어하기<small>스테이지 ${this.run.row + 2 > 10 ? 10 : this.run.row + 2}/10 · 난이도 ${tier.name}</small></button>
            <button class="btn small ghost" data-act="abandon">원정 포기</button>` : `
            <div class="tier-sel">
              <button class="tbtn" data-act="tier" data-arg="-1" aria-label="이전 난이도">&lt;</button>
              <span>난이도 <b>${tier.name}</b> <em>보상 x${RUN_TIERS[p.tierSelected - 1].reward}</em></span>
              <button class="tbtn" data-act="tier" data-arg="1" aria-label="다음 난이도">&gt;</button>
            </div>
            <button class="btn big blue" data-act="newrun">원정 시작<small>10 스테이지 로그라이크</small></button>`}
        </div>
        <div class="chest-row">
          <div class="chest ${ready ? 'ready' : ''}" data-act="chest" data-testid="chest">
            ${CHEST_SVG(ready)}
            <div><div class="chest-lbl">무료 상자</div><div class="chest-t">${ready ? '열기!' : M.fmtTime(M.chestRemain(p))}</div></div>
          </div>
        </div>
        <div class="nav">
          <button data-act="collection">컬렉션${badge(upg)}${upg ? '<i class="up">강화</i>' : ''}</button>
          <button data-act="missions">미션${badge(mis)}</button>
          <button data-act="achievements">업적${badge(ach)}</button>
          <button data-act="stats">통계</button>
        </div>
        <div class="records">최고 스테이지 <b>${p.stats.bestStage}</b> · 원정 클리어 <b>${p.stats.runWins}</b> · 총 승리 <b>${p.stats.wins}</b></div>
      </div>`;
    this.ui.show(html, 'title-screen');
  }

  tickLobby() {
    if (this.scene !== 'title') return;
    const el = uiRoot.querySelector('.chest-t');
    if (!el) return;
    const ready = M.chestReady(this.p);
    if (ready && !uiRoot.querySelector('.chest.ready')) this.showTitle();
    else if (!ready) el.textContent = M.fmtTime(M.chestRemain(this.p));
  }

  // ---------- 액션 ----------
  action(a, arg, el) {
    initAudio();
    if (a !== 'noop') sfx('click');
    const h = this.actions[a];
    if (h) h.call(this, arg, el);
  }

  get actions() {
    return {
      mute() {
        this.p.muted = !this.p.muted;
        setMuted(this.p.muted);
        this.save();
        const b = uiRoot.querySelector('[data-act="mute"]');
        if (b) b.innerHTML = this.p.muted ? SPEAKER_OFF : SPEAKER_ON;
      },
      title() {
        this.ui.closeModals();
        this.showTitle();
      },
      tier(arg) {
        const p = this.p;
        p.tierSelected = Math.max(1, Math.min(p.tierUnlocked, p.tierSelected + Number(arg)));
        if (Number(arg) > 0 && p.tierSelected === p.tierUnlocked && p.tierUnlocked < RUN_TIERS.length) {
          // 잠긴 단계 안내
        }
        this.save();
        this.showTitle();
        if (Number(arg) > 0 && p.tierSelected < RUN_TIERS.length && p.tierSelected === p.tierUnlocked) {
          this.toast(`원정을 ${RUN_TIERS[p.tierSelected - 1].name} 난이도로 클리어하면 다음 단계 해금`);
        }
      },
      quick() {
        this.startQuick();
      },
      newrun() {
        this.startRun();
      },
      continue() {
        this.resumeRun();
      },
      abandon() {
        const m = this.ui.modal(`<h3>원정을 포기할까요?</h3><p>진행 중인 원정이 사라지고 도달 보상만 받아요.</p>
          <div class="btns"><button class="btn red" data-act="abandonYes">포기</button><button class="btn ghost" data-act="closeModal">취소</button></div>`);
        void m;
      },
      abandonYes() {
        this.ui.closeModals();
        this.endRun(false, true);
      },
      closeModal() {
        this.ui.closeModals();
      },
      chest() {
        const r = M.openChest(this.p);
        if (!r) {
          this.toast(`다음 상자까지 ${M.fmtTime(M.chestRemain(this.p))}`);
          return;
        }
        this.save();
        sfx('coin');
        vib(30);
        this.showTitle();
        this.rewardModal('상자 오픈!', r, true);
      },
      collection() {
        this.showCollection();
      },
      carddetail(id) {
        this.cardDetail(id);
      },
      upgrade(id) {
        if (M.upgradeCard(this.p, id)) {
          this.save();
          sfx('merge');
          vib(30);
          this.ui.closeModals();
          this.showCollection();
          this.cardDetail(id, true);
        } else sfx('deny');
      },
      missions() {
        this.showMissions();
      },
      claimMission(i) {
        const r = M.claimMission(this.p, Number(i));
        if (r) {
          this.save();
          sfx('coin');
          this.showMissions();
          this.rewardModal('미션 완료!', { coins: r.coins, cards: [{ id: r.card, n: r.shards }] });
        }
      },
      claimStreak() {
        const r = M.claimStreak(this.p);
        if (r) {
          this.save();
          sfx('coin');
          this.showMissions();
          this.rewardModal(`출석 ${this.p.streak.count}일째 보상`, r);
        }
      },
      achievements() {
        this.showAchievements();
      },
      claimAch(id) {
        const r = M.claimAch(this.p, id);
        if (r) {
          this.save();
          sfx('coin');
          this.showAchievements();
          this.toast(`업적 보상 코인 +${r.coins}`);
        }
      },
      stats() {
        this.showStats();
      },
      road() {
        this.showRoad();
      },
      claimArena(i) {
        const r = M.claimArena(this.p, Number(i));
        if (r) {
          this.save();
          sfx('crown');
          this.showRoad();
          this.rewardModal(`${ARENAS[Number(i)].name} 도달 보상`, r);
        }
      },
      // 전투
      resume() {
        this.resume();
      },
      restart() {
        this.ui.closeModals();
        this.ui.hide();
        this.startBattle(this.lastCfg);
      },
      quitBattle() {
        this.ui.closeModals();
        this.paused = false;
        if (this.lastCfg?.mode === 'campaign') this.showMap();
        else this.showTitle();
      },
      afterResult() {
        this.afterResult();
      },
      again() {
        this.startQuick();
      },
      // 원정
      node(col) {
        this.enterNode(Number(col));
      },
      deck() {
        this.showDeckModal();
      },
      relic(id) {
        const r = RELICS[id];
        this.ui.modal(`<img class="relic-big" src="${relicImg(id)}"><h3>${r.name}</h3><p>${r.desc}</p><div class="btns"><button class="btn" data-act="closeModal">확인</button></div>`);
      },
      pickcard(i) {
        const id = this.run.reward.cards[Number(i)];
        this.deckAddFlow(id, () => {
          this.grantRunCardShards(id);
          this.finishReward();
        });
      },
      pickrelic() {
        const id = this.run.reward.relic;
        this.run.relics.push(id);
        this.finishReward();
      },
      skipreward() {
        this.finishReward();
      },
      deckadd() {
        const pc = this.pendingCard;
        this.ui.closeModals();
        if (!pc) return;
        this.run.deck.push(pc.id);
        this.pendingCard = null;
        pc.done();
      },
      replace(i) {
        const pc = this.pendingCard;
        if (!pc) return;
        this.ui.closeModals();
        this.run.deck[Number(i)] = pc.id;
        this.pendingCard = null;
        pc.done();
      },
      cancelAdd() {
        this.pendingCard = null;
        this.ui.closeModals();
      },
      buy(arg) {
        this.shopBuy(arg);
      },
      removecard(i) {
        const pc = this.pendingRemove;
        if (!pc) return;
        this.ui.closeModals();
        this.run.deck.splice(Number(i), 1);
        this.pendingRemove = null;
        pc();
      },
      leaveShop() {
        this.run.shop = null;
        this.completeNode();
      },
      restHeal() {
        this.run.kingHpFrac = Math.min(1, this.run.kingHpFrac + CAMPAIGN.REST_HEAL);
        sfx('heal');
        this.completeNode();
      },
      restRemove() {
        this.removeFlow(() => this.completeNode());
      },
      runEndOk() {
        this.showTitle();
      },
      mapTitle() {
        this.showTitle();
      },
    };
  }

  toast(text) {
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = text;
    app.appendChild(t);
    setTimeout(() => t.remove(), 2200);
  }

  rewardModal(title, r, chest) {
    const items = [];
    if (r.coins) items.push(`<div class="rw coin-rw">${COIN}<b>+${r.coins}</b></div>`);
    for (const c of r.cards || []) {
      items.push(`<div class="rw card-rw${c.isNew ? ' new' : ''}"><img src="${cardImg(c.id)}">${c.isNew ? '<em>새 카드!</em>' : ''}<b>${CARDS[c.id].name}</b><span>조각 +${c.n}</span></div>`);
    }
    this.ui.modal(`${chest ? `<div class="chest-open">${CHEST_SVG(true)}</div>` : ''}<h3>${title}</h3><div class="rw-list">${items.join('')}</div>
      <div class="btns"><button class="btn gold" data-act="closeModal">좋아요</button></div>`, 'reward-modal');
  }

  // ---------- 컬렉션 ----------
  showCollection() {
    this.scene = 'collection';
    const p = this.p;
    const own = M.owned(p);
    const list = PLAYABLE.slice().sort((a, b) => {
      const oa = p.cards[a] ? 0 : 1;
      const ob = p.cards[b] ? 0 : 1;
      return oa - ob || CARDS[a].cost - CARDS[b].cost;
    });
    const unlockArena = (id) => ARENAS.findIndex((A) => A.unlock.includes(id));
    const cells = list.map((id) => {
      const c = p.cards[id];
      if (!c) {
        const ai = unlockArena(id);
        return `<div class="ccard locked"><img class="sil" src="${cardImg(id)}"><b>???</b><span>${ai >= 0 ? `${ARENAS[ai].name}` : '원정 보상'}</span></div>`;
      }
      const cost = M.upgradeCost(p, id);
      const can = M.canUpgrade(p, id);
      const need = cost ? cost.shards : 0;
      const pct = cost ? Math.min(100, (c.shards / need) * 100) : 100;
      return `<div class="ccard${can ? ' can' : ''}" data-act="carddetail" data-arg="${id}" data-testid="card-${id}">
        <img src="${cardImg(id)}"><span class="lv">Lv.${c.level}</span>
        <div class="sbar ${can ? 'full' : ''}"><i style="width:${pct}%"></i><em>${cost ? `${c.shards}/${need}` : 'MAX'}</em></div>
        ${can ? '<i class="up">강화!</i>' : ''}</div>`;
    });
    this.ui.show(`
      <div class="page">
        <div class="page-top"><button class="btn small ghost" data-act="title">뒤로</button><h2>컬렉션 <small>${own.length}/${PLAYABLE.length}</small></h2><div class="coins">${COIN}<b>${p.coins}</b></div></div>
        <p class="hint">카드 조각과 코인으로 영구 레벨업 (레벨당 +${Math.round(CARD_LEVEL_BONUS * 100)}%). 미발견 카드는 아레나 도달, 상자, 원정 보상으로 해금</p>
        <div class="cgrid scroll">${cells.join('')}</div>
      </div>`, 'page-screen');
  }

  cardDetail(id, justUp) {
    const p = this.p;
    const c = CARDS[id];
    const own = p.cards[id];
    const lvl = own.level;
    const mult = 1 + CARD_LEVEL_BONUS * (lvl - 1);
    const nmult = 1 + CARD_LEVEL_BONUS * lvl;
    const cost = M.upgradeCost(p, id);
    const can = M.canUpgrade(p, id);
    const rows = [];
    const row = (k, v, nv) => rows.push(`<tr><th>${k}</th><td>${v}${nv !== undefined && cost ? ` <em>&gt; ${nv}</em>` : ''}</td></tr>`);
    row('비용', `${c.cost} 엘릭서`);
    if (c.hp) row('체력', Math.round(c.hp * mult * (c.count ? 1 : 1)), Math.round(c.hp * nmult));
    if (c.dmg) row(c.kind === 'spell' ? '피해' : '공격력', Math.round(c.dmg * mult), Math.round(c.dmg * nmult));
    if (c.heal) row('초당 치유', Math.round(c.heal * mult), Math.round(c.heal * nmult));
    if (c.count) row('수량', `${c.count}`);
    if (c.kind !== 'spell' && c.range !== undefined) row('사거리', c.range > 2 ? `${c.range}` : '근접');
    if (c.radius) row('범위', `${c.radius}`);
    if (c.targets) row('목표', { ground: '지상', all: '지상/공중', buildings: '건물', none: '-' }[c.targets]);
    this.ui.modal(`
      <div class="detail${justUp ? ' flash' : ''}">
        <img class="dcard" src="${cardImg(id)}">
        <div><h3>${c.name} <span class="lvtag">Lv.${lvl}</span></h3><p>${c.desc || ''}</p></div>
      </div>
      <table class="stat">${rows.join('')}</table>
      ${cost ? `<div class="upcost">조각 <b class="${own.shards >= cost.shards ? 'ok' : 'no'}">${own.shards}/${cost.shards}</b> · 코인 <b class="${p.coins >= cost.coins ? 'ok' : 'no'}">${cost.coins}</b></div>` : '<div class="upcost">최대 레벨</div>'}
      <div class="btns">
        ${cost ? `<button class="btn gold ${can ? '' : 'disabled'}" data-act="upgrade" data-arg="${id}" data-testid="upgrade">강화 Lv.${lvl + 1}</button>` : ''}
        <button class="btn ghost" data-act="closeModal">닫기</button>
      </div>`, 'card-modal');
  }

  // ---------- 미션/출석 ----------
  showMissions() {
    this.scene = 'missions';
    const p = this.p;
    const d = M.ensureDaily(p);
    const mid = new Date();
    mid.setHours(24, 0, 0, 0);
    const list = d.missions.map((m, i) => `
      <div class="mission ${m.claimed ? 'done' : ''}">
        <div class="mtxt"><b>${M.missionText(m)}</b><div class="bar"><i style="width:${(m.progress / m.n) * 100}%"></i></div><span>${m.progress}/${m.n}</span></div>
        ${m.claimed ? '<span class="ok">완료</span>' : `<button class="btn small gold ${m.progress >= m.n ? '' : 'disabled'}" data-act="claimMission" data-arg="${i}">${COIN}${m.coins}</button>`}
      </div>`).join('');
    const sr = M.streakReward(p.streak.count || 1);
    const days = Array.from({ length: 7 }, (_, i) => {
      const cur = ((Math.max(1, p.streak.count) - 1) % 7) + 1;
      return `<div class="day ${i + 1 < cur || (i + 1 === cur && !M.streakClaimable(p)) ? 'got' : ''} ${i + 1 === cur ? 'today' : ''}">${i + 1}일</div>`;
    }).join('');
    this.ui.show(`
      <div class="page">
        <div class="page-top"><button class="btn small ghost" data-act="title">뒤로</button><h2>오늘의 미션</h2><div class="coins">${COIN}<b>${p.coins}</b></div></div>
        <p class="hint">자정에 새 미션으로 갱신 (남은 시간 ${M.fmtTime(mid - Date.now())})</p>
        <div class="missions">${list}</div>
        <h3 class="sec">연속 출석 ${p.streak.count}일 <small>최고 ${p.streak.best}일</small></h3>
        <div class="days">${days}</div>
        <div class="streak-claim">
          <span>오늘 보상: 코인 ${sr.coins} + 카드 조각 ${sr.shards}</span>
          <button class="btn gold small ${M.streakClaimable(p) ? '' : 'disabled'}" data-act="claimStreak">${M.streakClaimable(p) ? '받기' : '받음'}</button>
        </div>
      </div>`, 'page-screen');
  }

  showAchievements() {
    this.scene = 'ach';
    const p = this.p;
    const list = ACHIEVEMENTS.map((a) => {
      const s = M.achState(p, a);
      return `<div class="ach ${s.claimed ? 'claimed' : s.done ? 'done' : ''}">
        <div class="mtxt"><b>${a.name}</b><span class="d">${a.desc}</span><div class="bar"><i style="width:${(s.v / a.n) * 100}%"></i></div></div>
        ${s.claimed ? '<span class="ok">달성</span>' : `<button class="btn small gold ${s.done ? '' : 'disabled'}" data-act="claimAch" data-arg="${a.id}">${COIN}${a.coins}</button>`}
      </div>`;
    }).join('');
    const done = ACHIEVEMENTS.filter((a) => p.ach[a.id]).length;
    this.ui.show(`
      <div class="page">
        <div class="page-top"><button class="btn small ghost" data-act="title">뒤로</button><h2>업적 <small>${done}/${ACHIEVEMENTS.length}</small></h2><div class="coins">${COIN}<b>${p.coins}</b></div></div>
        <div class="scroll">${list}</div>
      </div>`, 'page-screen');
  }

  showStats() {
    this.scene = 'stats';
    const s = this.p.stats;
    const rate = s.battles ? Math.round((s.wins / s.battles) * 100) : 0;
    const rows = [
      ['총 대전', s.battles], ['총 승리', s.wins], ['승률', rate + '%'], ['빠른 대전 승/패', `${s.quickWins} / ${s.quickLosses}`],
      ['최고 트로피', this.p.bestTrophies], ['원정 도전', s.runs], ['원정 클리어', s.runWins], ['최고 도달 스테이지', s.bestStage],
      ['최고 클리어 난이도', s.maxTierCleared ? RUN_TIERS[s.maxTierCleared - 1].name : '-'], ['보스 처치', s.bossKills],
      ['총 합성', s.merges], ['한 판 최다 합성', s.maxMergesBattle], ['3성 유닛', s.star3], ['타워 파괴', s.towers],
      ['킹 타워 파괴', s.kingKills], ['3크라운 승리', s.threeCrowns], ['사용한 카드', s.played], ['사용한 주문', s.spells],
      ['카드 강화', s.upgrades], ['연 상자', s.chests], ['모은 코인', s.coinsEarned], ['보유 카드', `${M.owned(this.p).length}/${PLAYABLE.length}`],
    ];
    this.ui.show(`
      <div class="page">
        <div class="page-top"><button class="btn small ghost" data-act="title">뒤로</button><h2>통계</h2><div></div></div>
        <div class="scroll"><table class="stats">${rows.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join('')}</table></div>
      </div>`, 'page-screen');
  }

  showRoad() {
    this.scene = 'road';
    const p = this.p;
    const top = M.arenaIndex(p.bestTrophies);
    const list = ARENAS.map((A, i) => {
      const reached = i <= top;
      const claimed = p.arenaClaimed.includes(i);
      const cards = A.unlock.map((id) => `<img class="mini ${p.cards[id] ? '' : 'sil'}" src="${cardImg(id)}">`).join('');
      return `<div class="road-item ${reached ? 'reached' : 'locked'}" style="--ac:${A.color}">
        <div class="road-head"><b>${i + 1}. ${A.name}</b><span>${crownSvg('#ffd040')} ${A.min}</span></div>
        <div class="road-body">${i === 0 ? '<span class="d">시작 아레나</span>' : `<div class="minis">${cards}</div><span class="d">${COIN}${A.coins} + 신규 카드</span>`}
        ${i === 0 ? '' : claimed ? '<span class="ok">받음</span>' : reached ? `<button class="btn small gold" data-act="claimArena" data-arg="${i}">받기</button>` : '<span class="lock">잠김</span>'}</div>
      </div>`;
    }).reverse().join('');
    this.ui.show(`
      <div class="page">
        <div class="page-top"><button class="btn small ghost" data-act="title">뒤로</button><h2>트로피 로드</h2><div class="coins">${crownSvg('#ffd040')}<b>${p.trophies}</b></div></div>
        <p class="hint">빠른 대전 승리 +${TROPHY.win}, 패배 -${TROPHY.loss}. 아레나마다 배경과 보상이 달라요</p>
        <div class="scroll">${list}</div>
      </div>`, 'page-screen');
  }

  // ---------- 빠른 대전 ----------
  startQuick() {
    const rng = SEED !== null ? makeRng(SEED + (this.p.stats.battles | 0)) : Math.random;
    const row = Math.min(9, Math.floor(this.p.trophies / 200));
    const params = stageParams(row, 'battle');
    const tier = Math.min(3, Math.floor(row / 3));
    const decks = ENEMY_DECKS[tier];
    const enemyDeck = decks[Math.floor(rng() * decks.length)];
    const playerDeck = M.quickDeck(this.p, rng);
    this.startBattle({
      mode: 'quick', playerDeck, enemyDeck, params, relics: [], kingHpFrac: 1, rngSeed: SEED,
      theme: M.arenaIndex(this.p.trophies), label: '빠른 대전', sub: `트로피 ${this.p.trophies}`,
    });
  }

  // ---------- 원정 ----------
  startRun() {
    const seed = SEED !== null ? SEED : Math.floor(Math.random() * 1e9);
    this.run = newRun(seed);
    this.run.tier = this.p.tierSelected;
    this.run.screen = 'map';
    this.run.path = [];
    if (START_ROW > 0) {
      // 디버그: 특정 스테이지부터
      this.run.row = START_ROW - 1;
      this.run.col = 0;
      this.run.map[START_ROW - 1][0].next = this.run.map[START_ROW].map((_, i) => i);
    }
    this.p.stats.runs++;
    this.save();
    this.saveRun();
    this.showMap();
  }

  resumeRun() {
    if (!this.run) return this.showTitle();
    const s = this.run.screen;
    if (s === 'reward' && this.run.reward) this.showReward();
    else if (s === 'shop' && this.run.shop) this.showShop();
    else if (s === 'rest') this.showRest();
    else this.showMap();
  }

  tierDef() {
    return RUN_TIERS[(this.run?.tier || 1) - 1];
  }

  showMap() {
    this.scene = 'map';
    this.battle = null;
    playBgm('menu');
    const run = this.run;
    run.screen = 'map';
    this.saveRun();
    const avail = availableNodes(run);
    const rows = run.map;
    const rowH = 76;
    const H = rows.length * rowH + 30;
    const pos = (r, c) => {
      const n = rows[r].length;
      const jitter = (((r * 37 + c * 17 + run.seed) % 11) - 5) * 0.9;
      return { x: ((c + 1) / (n + 1)) * 100 + jitter, y: H - 40 - r * rowH };
    };
    const onPath = (r, c) => run.path.some(([pr, pc]) => pr === r && pc === c);
    let lines = '';
    rows.forEach((row, r) => row.forEach((node, c) => {
      const a = pos(r, c);
      for (const j of node.next) {
        const b = pos(r + 1, j);
        const act = onPath(r, c) && (onPath(r + 1, j) || (r === run.row && c === run.col));
        lines += `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" class="${act ? 'act' : ''}" vector-effect="non-scaling-stroke"/>`;
      }
    }));
    let nodes = '';
    rows.forEach((row, r) => row.forEach((node, c) => {
      const p = pos(r, c);
      const info = NODE_INFO[node.type];
      const isAvail = r === run.row + 1 && avail.includes(c);
      const done = onPath(r, c);
      const cls = isAvail ? 'avail' : done ? 'done' : r <= run.row ? 'past' : 'locked';
      nodes += `<div class="mnode ${cls} t-${node.type}" style="left:${p.x}%;top:${p.y}px;--nc:${info.color}" ${isAvail ? `data-act="node" data-arg="${c}"` : ''} data-testid="node-${r}-${c}">
        <img src="${iconImg(info.icon, '#fff8ea')}"><span>${info.name}</span></div>`;
    }));
    const labels = rows.map((_, r) => `<div class="rlabel" style="top:${H - 40 - r * rowH}px">${r + 1}</div>`).join('');
    const hp = Math.round(run.kingHpFrac * 100);
    const relics = run.relics.map((id) => `<img src="${relicImg(id)}" data-act="relic" data-arg="${id}" title="${RELICS[id].name}">`).join('');
    const scr = this.ui.show(`
      <div class="map-screen">
        <div class="map-top">
          <button class="btn small ghost" data-act="mapTitle">로비</button>
          <div class="mstat"><b>스테이지 ${Math.min(10, run.row + 2)}/10</b><span>난이도 ${this.tierDef().name}</span></div>
          <div class="mstat gold-t"><b>${run.gold}</b><span>골드</span></div>
          <button class="btn small" data-act="deck">덱 ${run.deck.length}</button>
        </div>
        <div class="khp"><span>킹 타워</span><div class="bar"><i style="width:${hp}%"></i></div><b>${hp}%</b></div>
        ${relics ? `<div class="relic-row">${relics}</div>` : '<div class="relic-row empty">유물 없음 · 전투 승리나 상점에서 획득</div>'}
        <div class="map-scroll scroll"><div class="map" style="height:${H}px">
          <svg viewBox="0 0 100 ${H}" preserveAspectRatio="none" width="100%" height="${H}">${lines}</svg>
          ${labels}${nodes}
        </div></div>
        <p class="map-hint">빛나는 노드를 눌러 진행</p>
      </div>`, 'map-wrap');
    const sc = scr.querySelector('.map-scroll');
    const target = H - 40 - (run.row + 1) * rowH;
    requestAnimationFrame(() => {
      sc.scrollTop = Math.max(0, target - sc.clientHeight * 0.6);
    });
  }

  enterNode(col) {
    const run = this.run;
    const r = run.row + 1;
    const node = run.map[r][col];
    run.cur = { row: r, col, type: node.type };
    this.p.stats.bestStage = Math.max(this.p.stats.bestStage, r + 1);
    this.save();
    if (node.type === 'shop') {
      this.makeShop();
      this.showShop();
    } else if (node.type === 'rest') {
      run.screen = 'rest';
      this.saveRun();
      this.showRest();
    } else {
      this.startCampaignBattle();
    }
  }

  startCampaignBattle() {
    const run = this.run;
    const { row, type } = run.cur;
    const rng = runRng(run);
    const { params, deck } = enemySetup(row, type, rng);
    const T = this.tierDef();
    params.statMult += T.stat;
    params.towerMult += T.stat * 0.8;
    params.react *= 1 - 0.06 * (run.tier - 1);
    params.mistake *= 1 - 0.12 * (run.tier - 1);
    const lbl = { battle: '일반전', elite: '엘리트전', boss: '보스전' }[type];
    this.startBattle({
      mode: 'campaign', playerDeck: run.deck.slice(), enemyDeck: deck, params, relics: run.relics.slice(),
      kingHpFrac: run.kingHpFrac, theme: type === 'boss' ? 4 : Math.min(4, Math.floor(row / 2)),
      label: `스테이지 ${row + 1}/10`, sub: `${lbl} · ${T.name}`, type,
    });
  }

  completeNode() {
    const run = this.run;
    if (run.cur) {
      run.row = run.cur.row;
      run.col = run.cur.col;
      run.path.push([run.row, run.col]);
      run.cur = null;
      M.progressMission(this.p, 'stage', 1);
      this.save();
    }
    run.screen = 'map';
    run.reward = null;
    this.saveRun();
    this.showMap();
  }

  // ---------- 전투 ----------
  startBattle(cfg) {
    this.lastCfg = cfg;
    const rng = cfg.rngSeed != null ? makeRng(cfg.rngSeed + 99) : Math.random;
    const R = this.renderer;
    this.ui.hide();
    this.paused = false;
    this.drag = null;
    this.selected = -1;
    this.endT = 0;
    this.acc = 0;
    R.endBanner = null;
    R.banner = null;
    R.setTheme(cfg.theme || 0);
    const hooks = {
      sfx: (n) => sfx(n),
      shake: (a) => R.shake(a),
      vib: (p) => vib(p),
      crown: (team, x, y) => R.addCrown(team, x, y, () => sfx('crown')),
      announce: (t, c) => R.announce(t, c),
      hitstop: (t) => (this.hitstop = t),
      end: (res) => this.onBattleEnd(res),
    };
    this.battle = new Battle({
      playerDeck: cfg.playerDeck, enemyDeck: cfg.enemyDeck, relics: cfg.relics, params: cfg.params,
      kingHpFrac: cfg.kingHpFrac, debug: DEBUG, rng, hooks, infElixir: INF_ELIXIR, cardLevels: M.cardLevels(this.p),
    });
    this.ai = new AI(this.battle, cfg.params, rng);
    R.syncCrowns(this.battle);
    this.info = { label: cfg.label, sub: cfg.sub };
    this.scene = 'battle';
    this.tut = !this.p.tutDone && !qs.has('notut') ? { step: 0, t: 0 } : null;
    R.announce(cfg.type === 'boss' ? '보스전! 거대한 킹 타워를 부숴라' : '전투 시작!', cfg.type === 'boss' ? '#ff9a8a' : '#ffffff');
    sfx('horn');
    playBgm('battle');
  }

  pause() {
    if (this.scene !== 'battle' || !this.battle || this.battle.ended) return;
    this.paused = true;
    this.drag = null;
    this.ui.modal(`<h3>일시정지</h3>
      <div class="btns col">
        <button class="btn gold" data-act="resume">계속하기</button>
        <button class="btn" data-act="restart">다시 시작</button>
        <button class="btn ghost" data-act="quitBattle">${this.lastCfg?.mode === 'campaign' ? '지도로 나가기' : '로비로 나가기'}</button>
        <button class="btn ghost" data-act="mute">${this.p.muted ? '소리 켜기' : '소리 끄기'}</button>
      </div>`, 'pause-modal');
  }

  resume() {
    this.ui.closeModals();
    this.ui.hide();
    this.paused = false;
    this.last = performance.now();
  }

  onBattleEnd(res) {
    const R = this.renderer;
    this.drag = null;
    this.selected = -1;
    this.tutView = null;
    if (res.winner === 0) {
      R.showEnd('승리!', '#ffe36b');
      sfx('win');
      vib([30, 40, 60]);
    } else if (res.winner === 1) {
      R.showEnd('패배', '#ff8a8a');
      sfx('lose');
      vib(120);
    } else {
      R.showEnd('무승부', '#c8d4f0');
      sfx('draw');
    }
    this.endT = 2.3;
    this.lastResult = res;
    // 기록/보상 처리 (즉시 저장)
    const p = this.p;
    const cfg = this.lastCfg;
    M.recordBattle(p, this.battle, res, cfg.mode);
    const gain = { coins: 0, trophies: 0, cards: [], gold: 0 };
    if (cfg.mode === 'quick') {
      if (res.winner === 0) {
        p.stats.quickWins++;
        gain.trophies = M.applyTrophies(p, TROPHY.win + res.crowns[0] * TROPHY.crownBonus);
        gain.coins = M.addCoins(p, 20 + res.crowns[0] * 5);
        const rng = Math.random;
        const id = M.randomCardFor(p, rng, false);
        gain.cards.push(M.addShards(p, id, 2));
      } else if (res.winner === 1) {
        p.stats.quickLosses++;
        gain.trophies = M.applyTrophies(p, -TROPHY.loss);
        gain.coins = M.addCoins(p, 5);
      } else gain.coins = M.addCoins(p, 10);
    } else {
      const run = this.run;
      const T = this.tierDef();
      const type = run.cur?.type;
      if (res.winner === 0) {
        run.kingHpFrac = Math.max(0.01, res.kingHpFrac);
        let g = type === 'elite' ? CAMPAIGN.GOLD_ELITE : CAMPAIGN.GOLD_BATTLE;
        if (run.relics.includes('goldCrown')) g = Math.round(g * 1.5);
        run.gold += g;
        gain.gold = g;
        gain.coins = M.addCoins(p, (type === 'elite' ? 20 : type === 'boss' ? 60 : 12) * T.reward);
        run.wins++;
        if (type === 'boss') p.stats.bossKills++;
      } else if (res.winner === -1 && type !== 'boss') {
        run.kingHpFrac = Math.max(0.01, res.kingHpFrac);
      }
      this.saveRun();
    }
    this.lastGain = gain;
    this.save();
  }

  showResult() {
    const res = this.lastResult;
    const cfg = this.lastCfg;
    const g = this.lastGain;
    this.scene = 'result';
    playBgm('menu');
    const title = res.winner === 0 ? '승리!' : res.winner === 1 ? '패배' : '무승부';
    const cls = res.winner === 0 ? 'win' : res.winner === 1 ? 'lose' : 'draw';
    const crowns = (n, col) => [0, 1, 2].map((i) => `<span class="cr ${i < n ? 'on' : ''}">${crownSvg(i < n ? col : '#555a70')}</span>`).join('');
    let lines = '';
    let btns = '';
    if (cfg.mode === 'quick') {
      lines += `<div class="rline tro-line">${crownSvg('#ffd040')} 트로피 <b class="${g.trophies >= 0 ? 'plus' : 'minus'}" data-testid="trophy-delta">${g.trophies >= 0 ? '+' : ''}${g.trophies}</b> <span>(${this.p.trophies})</span></div>`;
      lines += `<div class="rline">${COIN} 코인 <b class="plus">+${g.coins}</b></div>`;
      for (const c of g.cards) lines += `<div class="rline"><img class="mini" src="${cardImg(c.id)}"> ${CARDS[c.id].name} 조각 <b class="plus">+${c.n}</b></div>`;
      const na = M.claimableArenas(this.p).length;
      if (na) lines += `<div class="rline hl">새 아레나 도달! 로비에서 보상을 받아요</div>`;
      btns = `<button class="btn gold" data-act="again">다시 하기</button><button class="btn ghost" data-act="title">로비</button>`;
    } else {
      const run = this.run;
      const hp = Math.round((res.winner === 1 ? 0 : run.kingHpFrac) * 100);
      lines += `<div class="rline">킹 타워 HP <b>${hp}%</b></div>`;
      if (g.gold) lines += `<div class="rline">골드 <b class="plus">+${g.gold}</b></div>`;
      if (g.coins) lines += `<div class="rline">${COIN} 코인 <b class="plus">+${g.coins}</b></div>`;
      if (res.winner === 1 || (res.winner === -1 && run.cur?.type === 'boss')) {
        btns = `<button class="btn gold" data-act="afterResult">원정 결과 보기</button>`;
      } else if (res.winner === 0) {
        btns = `<button class="btn gold" data-act="afterResult" data-testid="to-reward">${run.cur?.type === 'boss' ? '원정 완료!' : '보상 받기'}</button>`;
      } else {
        lines += `<div class="rline">무승부: 보상 없이 진행</div>`;
        btns = `<button class="btn gold" data-act="afterResult">계속</button>`;
      }
    }
    this.ui.show(`
      <div class="result ${cls}">
        <h2>${title}</h2>
        <div class="crowns"><div class="side">${crowns(res.crowns[0], '#5aa0ff')}<small>나</small></div><span class="vs">VS</span><div class="side">${crowns(res.crowns[1], '#ff6a6a')}<small>적</small></div></div>
        <div class="rlines">${lines}</div>
        <div class="btns col">${btns}</div>
      </div>`, 'result-screen');
  }

  afterResult() {
    const res = this.lastResult;
    const run = this.run;
    if (!run) return this.showTitle();
    const type = run.cur?.type;
    if (res.winner === 1 || (res.winner === -1 && type === 'boss')) {
      this.endRun(false);
    } else if (res.winner === 0) {
      if (type === 'boss') {
        run.row = run.cur.row;
        this.endRun(true);
      } else this.prepareReward();
    } else {
      this.completeNode();
    }
  }

  // ---------- 보상 ----------
  prepareReward() {
    const run = this.run;
    const rng = runRng(run);
    const elite = run.cur?.type === 'elite';
    const cards = rollCards(run, 3, rng);
    const relics = rollRelics(run, 1, rng);
    run.reward = { cards, relic: relics[0] || null, elite, granted: null };
    if (elite && run.reward.relic) {
      run.relics.push(run.reward.relic);
      run.reward.granted = run.reward.relic;
      run.reward.relic = null;
    }
    run.screen = 'reward';
    this.saveRun();
    this.showReward();
  }

  showReward() {
    this.scene = 'reward';
    const run = this.run;
    const rw = run.reward;
    const choice = rw.cards.map((id, i) => {
      const c = CARDS[id];
      const isNew = !this.p.cards[id];
      return `<div class="choice" data-act="pickcard" data-arg="${i}" data-testid="reward-card-${i}">
        <img src="${cardImg(id)}"><div><b>${c.name}</b><span>${c.desc}</span><em class="${isNew ? 'new' : ''}">${isNew ? '새 카드 해금!' : '카드 조각 +2'}</em></div></div>`;
    }).join('');
    const relic = rw.relic ? `<div class="choice relic" data-act="pickrelic" data-testid="reward-relic"><img src="${relicImg(rw.relic)}"><div><b>유물: ${RELICS[rw.relic].name}</b><span>${RELICS[rw.relic].desc}</span><em>카드 대신 유물</em></div></div>` : '';
    const granted = rw.granted ? `<div class="granted"><img src="${relicImg(rw.granted)}"><div><b>엘리트 보상 유물: ${RELICS[rw.granted].name}</b><span>${RELICS[rw.granted].desc}</span></div></div>` : '';
    this.ui.show(`
      <div class="page reward">
        <h2>보상 선택</h2>
        ${granted}
        <p class="hint">카드 3장 중 1장${rw.relic ? ' 또는 유물' : ''}. 고른 카드는 영구 컬렉션 조각도 줘요</p>
        <div class="choices scroll">${choice}${relic}</div>
        <div class="btns"><button class="btn ghost" data-act="skipreward">건너뛰기</button></div>
      </div>`, 'page-screen');
  }

  grantRunCardShards(id) {
    const T = this.tierDef();
    M.addShards(this.p, id, Math.round(2 * T.reward));
    this.save();
  }

  finishReward() {
    this.run.reward = null;
    this.completeNode();
  }

  deckAddFlow(id, done) {
    const run = this.run;
    this.pendingCard = { id, done };
    const full = run.deck.length >= DECK_MAX;
    const cells = run.deck.map((d, i) => `<div class="dcell" data-act="replace" data-arg="${i}"><img src="${cardImg(d)}"></div>`).join('');
    this.ui.modal(`
      <div class="addhead"><img class="dcard sm" src="${cardImg(id)}"><div><h3>${CARDS[id].name}</h3><p>${full ? '덱이 가득 찼어요. 교체할 카드를 고르세요' : '덱에 추가하거나 아래 카드와 교체'}</p></div></div>
      <div class="btns">${full ? '' : `<button class="btn gold" data-act="deckadd" data-testid="deck-add">덱에 추가 (${run.deck.length + 1}장)</button>`}<button class="btn ghost" data-act="cancelAdd">취소</button></div>
      <div class="dgrid">${cells}</div>`, 'deck-modal');
  }

  removeFlow(done) {
    const run = this.run;
    if (run.deck.length <= DECK_MIN) {
      this.toast(`덱은 최소 ${DECK_MIN}장이 필요해요`);
      return;
    }
    this.pendingRemove = done;
    const cells = run.deck.map((d, i) => `<div class="dcell" data-act="removecard" data-arg="${i}"><img src="${cardImg(d)}"></div>`).join('');
    this.ui.modal(`<h3>제거할 카드 선택</h3><div class="dgrid">${cells}</div><div class="btns"><button class="btn ghost" data-act="closeModal">취소</button></div>`, 'deck-modal');
  }

  showDeckModal() {
    const run = this.run;
    const cells = run.deck.map((d) => `<div class="dcell"><img src="${cardImg(d)}"><span class="lv">Lv.${M.cardLevel(this.p, d)}</span></div>`).join('');
    const relics = run.relics.map((id) => `<div class="rl"><img src="${relicImg(id)}"><div><b>${RELICS[id].name}</b><span>${RELICS[id].desc}</span></div></div>`).join('') || '<p class="hint">아직 유물이 없어요</p>';
    this.ui.modal(`<h3>내 덱 (${run.deck.length}/${DECK_MAX})</h3><div class="dgrid">${cells}</div><h3>유물</h3><div class="rlist">${relics}</div><div class="btns"><button class="btn" data-act="closeModal">닫기</button></div>`, 'deck-modal');
  }

  // ---------- 상점/휴식 ----------
  makeShop() {
    const run = this.run;
    const rng = runRng(run);
    const cards = rollCards(run, 3, rng).map((id) => ({ id, price: CAMPAIGN.SHOP.card[{ common: 0, rare: 1, epic: 2 }[CARDS[id].rarity]], sold: false }));
    const rel = rollRelics(run, 1, rng)[0];
    run.shop = { cards, relic: rel ? { id: rel, price: CAMPAIGN.SHOP.relic, sold: false } : null, heal: false, remove: false };
    run.screen = 'shop';
    this.saveRun();
  }

  showShop() {
    this.scene = 'shop';
    const run = this.run;
    const S = run.shop;
    const item = (act, img, name, desc, price, sold) => `<div class="sitem ${sold ? 'sold' : run.gold < price ? 'poor' : ''}" ${sold ? '' : `data-act="buy" data-arg="${act}"`}>
      <img src="${img}"><div><b>${name}</b><span>${desc}</span></div><em>${sold ? '판매됨' : `${price}G`}</em></div>`;
    const list = [
      ...S.cards.map((c, i) => item(`card:${i}`, cardImg(c.id), CARDS[c.id].name, CARDS[c.id].desc, c.price, c.sold)),
      S.relic ? item('relic', relicImg(S.relic.id), RELICS[S.relic.id].name, RELICS[S.relic.id].desc, S.relic.price, S.relic.sold) : '',
      item('heal', iconImg('heart', '#fff3d6'), '성벽 보수', `킹 타워 HP ${Math.round(CAMPAIGN.SHOP.healAmt * 100)}% 회복 (현재 ${Math.round(run.kingHpFrac * 100)}%)`, CAMPAIGN.SHOP.heal, S.heal),
      item('remove', iconImg('hammer', '#fff3d6'), '카드 제거', '덱에서 카드 1장 제거', CAMPAIGN.SHOP.remove, S.remove),
    ].join('');
    this.ui.show(`
      <div class="page shop">
        <div class="page-top"><div></div><h2>떠돌이 상점</h2><div class="gold-chip">${run.gold}G</div></div>
        <div class="scroll slist">${list}</div>
        <div class="btns"><button class="btn gold" data-act="leaveShop">떠나기</button></div>
      </div>`, 'page-screen');
  }

  shopBuy(arg) {
    const run = this.run;
    const S = run.shop;
    const pay = (price) => {
      if (run.gold < price) {
        sfx('deny');
        this.toast('골드가 부족해요');
        return false;
      }
      run.gold -= price;
      sfx('coin');
      return true;
    };
    if (arg.startsWith('card:')) {
      const c = S.cards[Number(arg.split(':')[1])];
      if (c.sold || run.gold < c.price) return pay(c.price);
      this.deckAddFlow(c.id, () => {
        pay(c.price);
        c.sold = true;
        this.grantRunCardShards(c.id);
        this.saveRun();
        this.showShop();
      });
    } else if (arg === 'relic') {
      if (S.relic.sold || !pay(S.relic.price)) return;
      S.relic.sold = true;
      run.relics.push(S.relic.id);
    } else if (arg === 'heal') {
      if (S.heal || !pay(CAMPAIGN.SHOP.heal)) return;
      S.heal = true;
      run.kingHpFrac = Math.min(1, run.kingHpFrac + CAMPAIGN.SHOP.healAmt);
    } else if (arg === 'remove') {
      if (S.remove || run.gold < CAMPAIGN.SHOP.remove) return pay(CAMPAIGN.SHOP.remove);
      this.removeFlow(() => {
        pay(CAMPAIGN.SHOP.remove);
        S.remove = true;
        this.saveRun();
        this.showShop();
      });
      return;
    }
    this.saveRun();
    this.showShop();
  }

  showRest() {
    this.scene = 'rest';
    const run = this.run;
    const hp = Math.round(run.kingHpFrac * 100);
    this.ui.show(`
      <div class="page rest">
        <h2>모닥불 휴식</h2>
        <div class="fire"><img src="${iconImg('fireball', null)}"></div>
        <p class="hint">킹 타워 HP ${hp}%</p>
        <div class="choices">
          <div class="choice" data-act="restHeal"><img src="${iconImg('heart', '#fff3d6')}"><div><b>휴식</b><span>킹 타워 HP ${Math.round(CAMPAIGN.REST_HEAL * 100)}% 회복</span></div></div>
          <div class="choice ${run.deck.length <= DECK_MIN ? 'disabled' : ''}" data-act="restRemove"><img src="${iconImg('hammer', '#fff3d6')}"><div><b>정비</b><span>덱에서 카드 1장 제거 (최소 ${DECK_MIN}장)</span></div></div>
        </div>
      </div>`, 'page-screen');
  }

  // ---------- 원정 종료 ----------
  endRun(victory, abandoned) {
    const run = this.run;
    const p = this.p;
    const T = this.tierDef();
    const reached = Math.max(0, (run.cur ? run.cur.row : run.row) + (victory ? 1 : 0));
    const stagesDone = victory ? 10 : Math.max(0, run.row + 1);
    const res = { coins: 0, cards: [] };
    res.coins = M.addCoins(p, (stagesDone * 12 + (victory ? 150 : 0)) * T.reward);
    const rng = makeRng((run.seed ^ 0x9e3779b9) >>> 0);
    const shardTotal = Math.round((stagesDone * 1.5 + (victory ? 10 : 0)) * T.reward);
    const picks = Math.min(3, Math.max(1, Math.ceil(shardTotal / 5)));
    if (shardTotal > 0) {
      const deck = [...new Set(run.deck)];
      for (let i = 0; i < picks; i++) {
        const id = deck[Math.floor(rng() * deck.length)];
        res.cards.push(M.addShards(p, id, Math.max(1, Math.round(shardTotal / picks))));
      }
    }
    let unlocked = null;
    if (victory) {
      p.stats.runWins++;
      p.stats.maxTierCleared = Math.max(p.stats.maxTierCleared, run.tier);
      if (run.tier >= p.tierUnlocked && p.tierUnlocked < RUN_TIERS.length) {
        p.tierUnlocked = run.tier + 1;
        p.tierSelected = p.tierUnlocked;
        unlocked = RUN_TIERS[p.tierUnlocked - 1].name;
      }
    }
    p.stats.bestStage = Math.max(p.stats.bestStage, reached);
    this.save();
    this.run = null;
    writeRun(null);
    this.scene = 'runEnd';
    playBgm('menu');
    if (victory) sfx('win');
    const cards = res.cards.map((c) => `<div class="rw card-rw${c.isNew ? ' new' : ''}"><img src="${cardImg(c.id)}">${c.isNew ? '<em>새 카드!</em>' : ''}<b>${CARDS[c.id].name}</b><span>조각 +${c.n}</span></div>`).join('');
    this.ui.show(`
      <div class="result ${victory ? 'win' : 'lose'} runend">
        <h2>${victory ? '원정 성공!' : abandoned ? '원정 포기' : '원정 실패'}</h2>
        <p class="hint">난이도 ${T.name} · 도달 스테이지 ${Math.min(10, Math.max(1, reached))}/10 · 최고 ${p.stats.bestStage}</p>
        ${unlocked ? `<div class="rline hl">새 난이도 해금: ${unlocked}</div>` : ''}
        <div class="rw-list"><div class="rw coin-rw">${COIN}<b>+${res.coins}</b></div>${cards}</div>
        <div class="btns col"><button class="btn gold" data-act="runEndOk">로비로</button></div>
      </div>`, 'result-screen');
  }
}

const game = new Game();
// 테스트/디버그용 훅
window.__ps = {
  game,
  get scene() {
    return game.scene;
  },
  get battle() {
    return game.battle;
  },
  get profile() {
    return game.p;
  },
  cardCenter(i) {
    const c = game.renderer.L.cards[i];
    const r = canvas.getBoundingClientRect();
    return { x: r.left + c.x + c.w / 2, y: r.top + c.y + c.h / 2 };
  },
  worldToClient(x, y) {
    const p = game.renderer.w2s(x, y);
    const r = canvas.getBoundingClientRect();
    return { x: r.left + p.x, y: r.top + p.y };
  },
  layout() {
    return game.renderer.L;
  },
};
void shuffle;
void BATTLE;
void LEVEL_COST;
void CARD_MAX_LEVEL;
void copies;
