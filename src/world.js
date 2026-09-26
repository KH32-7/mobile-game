// 렌더러, 씬, 카메라, 트랙, 배경 오브젝트, 테마
import * as THREE from 'three';
import { CFG, THEMES } from './config.js';

export class World {
  constructor(canvas) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: dpr < 1.5, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(dpr);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(68, 0.5, 0.1, 260);
    this.baseFov = 68;

    this.themeIdx = 0;
    const t = THEMES[0];
    this.cur = {
      sky: new THREE.Color(t.sky), fog: new THREE.Color(t.fog), ground: new THREE.Color(t.ground),
      hemiSky: new THREE.Color(t.hemiSky), hemiGround: new THREE.Color(t.hemiGround), sun: new THREE.Color(t.sun),
    };
    this.target = null;
    this.skyCanvas = document.createElement('canvas');
    this.skyCanvas.width = 4; this.skyCanvas.height = 128;
    this.skyTex = new THREE.CanvasTexture(this.skyCanvas);
    this.skyTex.colorSpace = THREE.SRGBColorSpace;
    this.scene.background = this.skyTex;
    this._skyKey = '';
    this.scene.fog = new THREE.Fog(this.cur.fog.clone(), 45, 170);

    this.hemi = new THREE.HemisphereLight(t.hemiSky, t.hemiGround, 1.6);
    this.scene.add(this.hemi);
    this.sun = new THREE.DirectionalLight(t.sun, 1.8);
    this.sun.position.set(-4, 10, 6);
    this.scene.add(this.sun);
    this.scene.add(this.sun.target);

    this.buildTrack();
    this.buildScenery();
    this.buildSpeedLines();
    this.shake = 0;
    this.camPos = new THREE.Vector3(0, 8, 10);
    this.camLook = new THREE.Vector3(0, 0, -10);
  }

  makeTrackTexture(theme) {
    const c = document.createElement('canvas');
    c.width = 256; c.height = 256;
    const g = c.getContext('2d');
    g.fillStyle = theme.track; g.fillRect(0, 0, 256, 256);
    // 레인 바닥 살짝 다른 톤
    g.fillStyle = 'rgba(255,255,255,0.05)';
    g.fillRect(256 * (1.1 + 0.1) / 7.2 + 0, 0, 256 * 1.9 / 7.2, 256);
    // 침목 느낌 가로줄
    g.fillStyle = 'rgba(0,0,0,0.10)';
    for (let y = 0; y < 256; y += 64) g.fillRect(0, y, 256, 10);
    // 레인 구분 점선
    g.fillStyle = theme.stripe;
    const lx = [(3.6 - 1.1) / 7.2, (3.6 + 1.1) / 7.2];
    for (const u of lx) for (let y = 0; y < 256; y += 128) g.fillRect(u * 256 - 3, y + 20, 6, 80);
    // 가장자리
    g.fillStyle = theme.edge;
    g.fillRect(0, 0, 10, 256); g.fillRect(246, 0, 10, 256);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.anisotropy = 4;
    return tex;
  }

  buildTrack() {
    this.trackLen = 280;
    this.tileLen = 8;
    this.trackTex = this.makeTrackTexture(THEMES[0]);
    this.trackTex.repeat.set(1, this.trackLen / this.tileLen);
    const geo = new THREE.PlaneGeometry(CFG.trackHalfW * 2, this.trackLen);
    geo.rotateX(-Math.PI / 2);
    this.track = new THREE.Mesh(geo, new THREE.MeshLambertMaterial({ map: this.trackTex }));
    this.scene.add(this.track);

    const gg = new THREE.PlaneGeometry(400, this.trackLen);
    gg.rotateX(-Math.PI / 2);
    this.groundMat = new THREE.MeshLambertMaterial({ color: this.cur.ground });
    this.ground = new THREE.Mesh(gg, this.groundMat);
    this.ground.position.y = -0.05;
    this.scene.add(this.ground);

    // 트랙 양옆 난간
    const rg = new THREE.BoxGeometry(0.25, 0.35, this.trackLen);
    this.railMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(THEMES[0].edge) });
    this.rails = [-1, 1].map((s) => {
      const m = new THREE.Mesh(rg, this.railMat);
      m.position.set(s * (CFG.trackHalfW + 0.12), 0.17, 0);
      this.scene.add(m);
      return m;
    });
  }

  buildScenery() {
    this.bCount = 44;
    const bg = new THREE.BoxGeometry(1, 1, 1);
    bg.translate(0, 0.5, 0);
    this.buildings = new THREE.InstancedMesh(bg, new THREE.MeshLambertMaterial({ color: 0xffffff, map: this.makeBuildingTex() }), this.bCount);
    this.bData = [];
    this.span = 240;
    for (let i = 0; i < this.bCount; i++) {
      const side = i % 2 ? 1 : -1;
      const d = -30 + Math.floor(i / 2) * (this.span / (this.bCount / 2));
      this.bData.push(this.newBuilding(side, d));
    }
    this.buildings.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.buildings.frustumCulled = false; // 재활용되며 멀리 이동하므로 캐시된 바운딩 구로 컬링되지 않게
    this.scene.add(this.buildings);

    this.pCount = 80;
    const tg = new THREE.ConeGeometry(0.9, 2.6, 6);
    tg.translate(0, 1.9, 0);
    const trunk = new THREE.CylinderGeometry(0.16, 0.2, 0.7, 5);
    trunk.translate(0, 0.35, 0);
    // 줄기와 잎을 한 지오메트리로 합치고 버텍스 컬러로 구분
    const merged = mergeSimple([tg, trunk], [new THREE.Color(1, 1, 1), new THREE.Color(0.55, 0.38, 0.25)]);
    this.props = new THREE.InstancedMesh(merged, new THREE.MeshLambertMaterial({ vertexColors: true }), this.pCount);
    this.pData = [];
    for (let i = 0; i < this.pCount; i++) {
      const side = i % 2 ? 1 : -1;
      const d = -30 + Math.floor(i / 2) * (this.span / (this.pCount / 2)) + 3;
      this.pData.push(this.newProp(side, d, i));
    }
    this.props.frustumCulled = false;
    this.scene.add(this.props);
    const cap = new THREE.ConeGeometry(0.62, 1.1, 6);
    cap.translate(0, 2.75, 0);
    this.caps = new THREE.InstancedMesh(cap, new THREE.MeshLambertMaterial({ color: 0xffffff }), this.pCount);
    this.caps.frustumCulled = false;
    this.scene.add(this.caps);
    // 가로등 소품
    const pole = new THREE.CylinderGeometry(0.06, 0.08, 3.2, 5); pole.translate(0, 1.6, 0);
    const arm = new THREE.BoxGeometry(0.7, 0.08, 0.08); arm.translate(-0.32, 3.15, 0);
    const lampH = new THREE.BoxGeometry(0.3, 0.12, 0.22); lampH.translate(-0.62, 3.08, 0);
    const lampG = mergeSimple([pole, arm, lampH], [new THREE.Color(0.35, 0.38, 0.45), new THREE.Color(0.35, 0.38, 0.45), new THREE.Color(1, 0.92, 0.55)]);
    this.lampCount = 24;
    this.lamps = new THREE.InstancedMesh(lampG, new THREE.MeshLambertMaterial({ vertexColors: true, emissive: 0x222211 }), this.lampCount);
    this.lamps.frustumCulled = false;
    this.lampD = [];
    for (let i = 0; i < this.lampCount; i++) this.lampD.push({ side: i % 2 ? 1 : -1, d: -30 + Math.floor(i / 2) * (this.span / (this.lampCount / 2)) + 6 });
    this.scene.add(this.lamps);
    this.writeLamps();
    this.m4 = new THREE.Matrix4();
    this.zero = new THREE.Matrix4().makeScale(0, 0, 0);
    this.refreshSceneryAll();
  }

  // 건물 텍스처: 창문 격자 + 간판 띠 + 낙서 (인스턴스 색으로 물듦)
  makeBuildingTex() {
    const c = document.createElement('canvas');
    c.width = 256; c.height = 512;
    const g = c.getContext('2d');
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, 256, 512);
    g.fillStyle = 'rgba(0,0,0,0.08)';
    for (let y = 0; y < 512; y += 42) g.fillRect(0, y + 36, 256, 4);
    for (let row = 0; row < 11; row++) {
      for (let col = 0; col < 4; col++) {
        const x = 18 + col * 60, y = 70 + row * 40;
        const lit = (row * 7 + col * 3) % 5 === 0;
        g.fillStyle = lit ? '#fff3b0' : '#3a4a6a';
        g.fillRect(x, y, 38, 26);
        g.fillStyle = 'rgba(255,255,255,0.35)';
        g.fillRect(x + 3, y + 3, 10, 20);
      }
    }
    g.fillStyle = '#ff4a6a'; g.fillRect(10, 14, 236, 40);
    g.fillStyle = '#ffffff'; g.font = '900 28px system-ui, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText('SWARM', 128, 35);
    g.strokeStyle = '#2ad0ff'; g.lineWidth = 7; g.lineCap = 'round';
    g.beginPath(); g.moveTo(20, 480); g.bezierCurveTo(60, 440, 90, 510, 130, 470); g.bezierCurveTo(160, 440, 200, 500, 236, 462); g.stroke();
    g.strokeStyle = '#ffd23a'; g.lineWidth = 5;
    g.beginPath(); g.arc(200, 488, 12, 0, Math.PI * 2); g.stroke();
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 2;
    return t;
  }

  newBuilding(side, d) {
    const th = THEMES[this.themeIdx];
    const tall = th.name === '사막' ? 0.45 : th.name === '설원' ? 0.7 : 1;
    return {
      side, d,
      x: side * (7 + Math.random() * 7),
      w: 2.5 + Math.random() * 3.5,
      h: (2 + Math.random() * 11) * tall,
      l: 3 + Math.random() * 5,
      color: new THREE.Color(th.buildings[Math.floor(Math.random() * th.buildings.length)]),
    };
  }

  newProp(side, d, i = 0) {
    const th = THEMES[this.themeIdx];
    const s = 0.7 + Math.random() * 0.7;
    // 설원은 2배 밀도 + 눈 덮인 나무, 나머지 테마는 절반만 표시
    const show = th.snow || (i % 4 < 2);
    return { side, d, x: side * (4.6 + Math.random() * (th.snow ? 3.5 : 1.6)), s, show, snow: !!th.snow, color: new THREE.Color(th.prop).offsetHSL(0, 0, (Math.random() - 0.5) * 0.12) };
  }

  refreshSceneryAll() {
    const m = new THREE.Matrix4();
    this.bData.forEach((b, i) => this.writeBuilding(i, b, m));
    this.pData.forEach((p, i) => this.writeProp(i, p, m));
    this.buildings.instanceMatrix.needsUpdate = true;
    this.buildings.instanceColor.needsUpdate = true;
    this.props.instanceMatrix.needsUpdate = true;
    this.props.instanceColor.needsUpdate = true;
    this.caps.instanceMatrix.needsUpdate = true;
  }

  writeLamps() {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion(), p = new THREE.Vector3(), sc = new THREE.Vector3(1, 1, 1), up = new THREE.Vector3(0, 1, 0);
    this.lampD.forEach((l, i) => {
      q.setFromAxisAngle(up, l.side > 0 ? 0 : Math.PI);
      p.set(l.side * (CFG.trackHalfW + 0.55), 0, -l.d);
      m.compose(p, q, sc);
      this.lamps.setMatrixAt(i, m);
    });
    this.lamps.instanceMatrix.needsUpdate = true;
  }

  writeBuilding(i, b, m) {
    m.makeScale(b.w, b.h, b.l);
    m.setPosition(b.x, 0, -b.d);
    this.buildings.setMatrixAt(i, m);
    this.buildings.setColorAt(i, b.color);
  }

  writeProp(i, p, m) {
    if (!p.show) { this.props.setMatrixAt(i, this.zero); this.caps.setMatrixAt(i, this.zero); this.props.setColorAt(i, p.color); return; }
    m.makeScale(p.s, p.s, p.s);
    m.setPosition(p.x, 0, -p.d);
    this.props.setMatrixAt(i, m);
    this.caps.setMatrixAt(i, p.snow ? m : this.zero);
    this.props.setColorAt(i, p.color);
  }

  buildSpeedLines() {
    this.lineCount = 36;
    const g = new THREE.BoxGeometry(0.035, 0.035, 3.5);
    this.lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, fog: false, depthWrite: false });
    this.lines = new THREE.InstancedMesh(g, this.lineMat, this.lineCount);
    this.lines.frustumCulled = false;
    this.lData = [];
    for (let i = 0; i < this.lineCount; i++) this.lData.push(this.newLine(Math.random() * 40));
    this.scene.add(this.lines);
  }

  newLine(z) {
    const a = Math.random() * Math.PI * 2;
    const r = 2.2 + Math.random() * 4.5;
    return { x: Math.cos(a) * r, y: Math.sin(a) * r * 0.8 + 1.5, z };
  }

  setTheme(idx) {
    this.themeIdx = idx % THEMES.length;
    const t = THEMES[this.themeIdx];
    this.target = {
      sky: new THREE.Color(t.sky), fog: new THREE.Color(t.fog), ground: new THREE.Color(t.ground),
      hemiSky: new THREE.Color(t.hemiSky), hemiGround: new THREE.Color(t.hemiGround), sun: new THREE.Color(t.sun),
    };
    const old = this.trackTex;
    this.trackTex = this.makeTrackTexture(t);
    this.trackTex.repeat.set(1, this.trackLen / this.tileLen);
    this.track.material.map = this.trackTex;
    this.track.material.needsUpdate = true;
    old.dispose();
    this.railMat.color.set(t.edge);
  }

  resetTheme(idx, dist = null) {
    this.setTheme(idx);
    for (const k in this.target) this.cur[k].copy(this.target[k]);
    this.applyColors();
    // dist 가 주어지면 배경 오브젝트를 현재 위치 기준으로 다시 깔기
    const bs = this.span / (this.bCount / 2), ps = this.span / (this.pCount / 2);
    if (dist != null && this.lampD) { this.lampD.forEach((l, i) => { l.d = dist - 24 + Math.floor(i / 2) * (this.span / (this.lampCount / 2)); }); this.writeLamps(); }
    this.bData.forEach((b, i) => { this.bData[i] = this.newBuilding(b.side, dist == null ? b.d : dist - 30 + Math.floor(i / 2) * bs); });
    this.pData.forEach((p, i) => { this.pData[i] = this.newProp(p.side, dist == null ? p.d : dist - 27 + Math.floor(i / 2) * ps, i); });
    this.refreshSceneryAll();
  }

  drawSky() {
    const key = this.cur.sky.getHexString() + this.cur.fog.getHexString();
    if (key === this._skyKey) return;
    this._skyKey = key;
    const g = this.skyCanvas.getContext('2d');
    const gr = g.createLinearGradient(0, 0, 0, 128);
    const top = this.cur.sky.clone().multiplyScalar(0.78);
    gr.addColorStop(0, '#' + top.getHexString());
    gr.addColorStop(0.55, '#' + this.cur.sky.getHexString());
    gr.addColorStop(1, '#' + this.cur.fog.getHexString());
    g.fillStyle = gr; g.fillRect(0, 0, 4, 128);
    this.skyTex.needsUpdate = true;
  }

  applyColors() {
    this.drawSky();
    this.scene.fog.color.copy(this.cur.fog);
    this.groundMat.color.copy(this.cur.ground);
    this.hemi.color.copy(this.cur.hemiSky);
    this.hemi.groundColor.copy(this.cur.hemiGround);
    this.sun.color.copy(this.cur.sun);
  }

  // dist: 리더 진행 거리, focus: 카메라 기준점 {x, d, spread}
  update(dt, dist, speed, focus, speedRatio, mode) {
    if (this.target) {
      const k = 1 - Math.exp(-dt * 1.5);
      for (const key in this.target) this.cur[key].lerp(this.target[key], k);
      this.applyColors();
    }
    const z = -dist;
    this.track.position.z = z - this.trackLen / 2 + 40;
    this.ground.position.z = this.track.position.z;
    this.rails.forEach((r) => { r.position.z = this.track.position.z; });
    this.trackTex.offset.y = ((dist - 40 + this.trackLen / 2) / this.tileLen) % 1;

    // 배경 재활용
    const m = this.m4;
    let dirtyB = false, dirtyP = false;
    for (let i = 0; i < this.bCount; i++) {
      const b = this.bData[i];
      if (b.d < dist - 30) { this.bData[i] = this.newBuilding(b.side, b.d + this.span); this.writeBuilding(i, this.bData[i], m); dirtyB = true; }
    }
    for (let i = 0; i < this.pCount; i++) {
      const p = this.pData[i];
      if (p.d < dist - 30) { this.pData[i] = this.newProp(p.side, p.d + this.span, i); this.writeProp(i, this.pData[i], m); dirtyP = true; }
    }
    let dirtyL = false;
    for (const l of this.lampD) if (l.d < dist - 30) { l.d += this.span; dirtyL = true; }
    if (dirtyL) this.writeLamps();
    if (dirtyB) { this.buildings.instanceMatrix.needsUpdate = true; this.buildings.instanceColor.needsUpdate = true; }
    if (dirtyP) { this.props.instanceMatrix.needsUpdate = true; this.props.instanceColor.needsUpdate = true; this.caps.instanceMatrix.needsUpdate = true; }

    // 카메라
    const sp = focus.spread;
    let tx, ty, tz, lx, ly, lz;
    if (mode === 'title') {
      // 타이틀: 무리 앞쪽에서 얼굴이 보이게
      tx = focus.x + 2.4; ty = 3.6; tz = -(focus.d + 9.5);
      lx = focus.x; ly = -0.9; lz = -(focus.d - 2.5);
    } else {
      tx = focus.x * 0.55; ty = 7.8 + sp * 0.95 + (focus.lift || 0); tz = -(focus.d - 8.0 - sp * 1.5);
      lx = focus.x * 0.75; ly = (focus.lift || 0) * 0.8; lz = -(focus.d + 6.5);
    }
    let kc = 1 - Math.exp(-dt * (mode === 'title' ? 2 : 6));
    if (this.snapNext) { kc = 1; this.snapNext = false; } // 화면 전환 직후 카메라 즉시 이동
    this.camPos.x += (tx - this.camPos.x) * kc;
    this.camPos.y += (ty - this.camPos.y) * kc;
    this.camPos.z = mode === 'title' ? this.camPos.z + (tz - this.camPos.z) * kc : tz;
    this.camLook.x += (lx - this.camLook.x) * kc;
    this.camLook.y += (ly - this.camLook.y) * kc;
    this.camLook.z = mode === 'title' ? this.camLook.z + (lz - this.camLook.z) * kc : lz;
    this.camera.position.copy(this.camPos);
    if (this.shake > 0) {
      const s = this.shake * 0.35;
      this.camera.position.x += (Math.random() - 0.5) * s;
      this.camera.position.y += (Math.random() - 0.5) * s;
      this.shake = Math.max(0, this.shake - dt * 2.5);
    }
    this.camera.lookAt(this.camLook);
    const fov = this.baseFov + speedRatio * 9;
    if (Math.abs(this.camera.fov - fov) > 0.05) { this.camera.fov += (fov - this.camera.fov) * kc; this.camera.updateProjectionMatrix(); }

    this.sun.position.set(this.camPos.x - 4, 12, this.camPos.z + 4);
    this.sun.target.position.set(this.camPos.x, 0, this.camPos.z - 10);

    // 속도선
    const op = Math.max(0, speedRatio - 0.25) * 0.55;
    this.lineMat.opacity += (op - this.lineMat.opacity) * kc;
    this.lines.visible = this.lineMat.opacity > 0.02;
    if (this.lines.visible) {
      for (let i = 0; i < this.lineCount; i++) {
        const l = this.lData[i];
        l.z -= speed * 2.2 * dt;
        if (l.z < -4) this.lData[i] = this.newLine(36 + Math.random() * 8);
        const L = this.lData[i];
        m.makeTranslation(this.camPos.x + L.x, this.camPos.y - 3 + L.y, this.camPos.z - L.z);
        this.lines.setMatrixAt(i, m);
      }
      this.lines.instanceMatrix.needsUpdate = true;
    }
  }

  resize(w, h) {
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    // 세로 화면에서 트랙이 잘리지 않게 수직 FOV 보정
    this.baseFov = w / h < 0.6 ? 70 : 60;
    this.camera.fov = this.baseFov;
    this.camera.updateProjectionMatrix();
  }

  render() { this.renderer.render(this.scene, this.camera); }
}

// 간단한 지오메트리 병합 (position/normal + 버텍스 컬러)
export function mergeSimple(geos, colors) {
  const pos = [], nor = [], col = [], idx = [];
  let off = 0;
  geos.forEach((g, gi) => {
    const gg = g.index ? g : g;
    const p = gg.attributes.position, n = gg.attributes.normal;
    const c = colors[gi];
    for (let i = 0; i < p.count; i++) {
      pos.push(p.getX(i), p.getY(i), p.getZ(i));
      nor.push(n.getX(i), n.getY(i), n.getZ(i));
      col.push(c.r, c.g, c.b);
    }
    if (gg.index) for (let i = 0; i < gg.index.count; i++) idx.push(gg.index.getX(i) + off);
    else for (let i = 0; i < p.count; i++) idx.push(i + off);
    off += p.count;
  });
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  out.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  out.setIndex(idx);
  return out;
}
