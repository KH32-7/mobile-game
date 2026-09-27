// 행동 발판: 아틀라스 텍스처 + InstancedMesh 한 번의 드로우콜, 서 있는 동안 원형 게이지
import { THREE } from './gfx.js';
import { drawIng, drawMenu, rr } from './icons.js';

const N = 8; // 8x8 셀
const CS = 128;

export const PAD_COLORS = {
  crate: '#f2a51c', // 노랑: 부두 상자
  in: '#2f7fe0', // 파랑: 재료 넣기
  out: '#8a5cf0', // 보라: 완성 접시
  feed: '#2fb35a', // 초록: 벨트 투입구
  trash: '#e8483b', // 빨강: 수거함
  sink: '#1fb3c9', // 청록: 설거지
  upgrade: '#ffb400',
};

function glyph(ctx, type, s) {
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#ffffff';
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  if (type === 'feed') {
    // 벨트 위로 올리는 화살표
    ctx.beginPath();
    ctx.moveTo(s * 0.5, s * 0.08);
    ctx.lineTo(s * 0.9, s * 0.48);
    ctx.lineTo(s * 0.64, s * 0.48);
    ctx.lineTo(s * 0.64, s * 0.9);
    ctx.lineTo(s * 0.36, s * 0.9);
    ctx.lineTo(s * 0.36, s * 0.48);
    ctx.lineTo(s * 0.1, s * 0.48);
    ctx.closePath();
    ctx.fill();
  } else if (type === 'trash') {
    ctx.fillRect(s * 0.26, s * 0.32, s * 0.48, s * 0.58);
    ctx.fillRect(s * 0.16, s * 0.18, s * 0.68, s * 0.1);
    ctx.fillRect(s * 0.4, s * 0.08, s * 0.2, s * 0.1);
    ctx.fillStyle = PAD_COLORS.trash;
    for (const x of [0.37, 0.5, 0.63]) ctx.fillRect(s * x - s * 0.025, s * 0.42, s * 0.05, s * 0.38);
  } else if (type === 'sink') {
    ctx.beginPath();
    ctx.ellipse(s * 0.5, s * 0.58, s * 0.42, s * 0.24, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = PAD_COLORS.sink;
    ctx.beginPath();
    ctx.ellipse(s * 0.5, s * 0.55, s * 0.22, s * 0.11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    for (const [x, y, r] of [[0.22, 0.2, 0.08], [0.38, 0.1, 0.06], [0.76, 0.2, 0.1]]) {
      ctx.beginPath();
      ctx.arc(s * x, s * y, s * r, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (type === 'upgrade') {
    ctx.beginPath();
    ctx.moveTo(s * 0.5, s * 0.04);
    ctx.lineTo(s * 0.94, s * 0.5);
    ctx.lineTo(s * 0.68, s * 0.5);
    ctx.lineTo(s * 0.68, s * 0.94);
    ctx.lineTo(s * 0.32, s * 0.94);
    ctx.lineTo(s * 0.32, s * 0.5);
    ctx.lineTo(s * 0.06, s * 0.5);
    ctx.closePath();
    ctx.fill();
  }
}

export class PadSystem {
  constructor(scene) {
    const c = document.createElement('canvas');
    c.width = N * CS;
    c.height = N * CS;
    this.ctx = c.getContext('2d');
    this.tex = new THREE.CanvasTexture(c);
    this.tex.colorSpace = THREE.SRGBColorSpace;
    this.tex.anisotropy = 4;
    this.cells = new Map();
    const geo = new THREE.PlaneGeometry(1, 1);
    geo.rotateX(-Math.PI / 2);
    this.max = 72;
    this.aCell = new THREE.InstancedBufferAttribute(new Float32Array(this.max * 2), 2);
    this.aCell.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('aCell', this.aCell);
    const mat = new THREE.MeshBasicMaterial({ map: this.tex, transparent: true, depthWrite: false });
    mat.onBeforeCompile = (sh) => {
      sh.vertexShader = 'attribute vec2 aCell;\n' + sh.vertexShader.replace('#include <uv_vertex>', '#include <uv_vertex>\n#ifdef USE_MAP\n  vMapUv = uv * 0.125 + aCell;\n#endif');
    };
    this.mesh = new THREE.InstancedMesh(geo, mat, this.max);
    this.mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(this.max * 3).fill(1), 3);
    this.mesh.frustumCulled = false;
    this.mesh.renderOrder = 1;
    this.mesh.count = 0;
    scene.add(this.mesh);
    this.n = 0;
    this._m = new THREE.Matrix4();
    this._c = new THREE.Color();

    // 원형 게이지 (셰프 발밑)
    const rg = new THREE.RingGeometry(0.52, 0.66, 48, 1);
    rg.rotateX(-Math.PI / 2);
    this.ringCount = rg.index.count;
    this.ring = new THREE.Mesh(rg, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95, depthWrite: false }));
    this.ring.renderOrder = 3;
    this.ring.visible = false;
    scene.add(this.ring);
    const bg = new THREE.RingGeometry(0.52, 0.66, 48, 1);
    bg.rotateX(-Math.PI / 2);
    this.ringBg = new THREE.Mesh(bg, new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25, depthWrite: false }));
    this.ringBg.renderOrder = 2;
    this.ringBg.visible = false;
    scene.add(this.ringBg);
  }

  cell(type, id) {
    const key = type + ':' + id;
    let i = this.cells.get(key);
    if (i !== undefined) return i;
    i = this.cells.size % (N * N);
    this.cells.set(key, i);
    const col = i % N;
    const row = Math.floor(i / N);
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(col * CS, row * CS);
    ctx.clearRect(0, 0, CS, CS);
    const color = PAD_COLORS[type] || '#888';
    // 그림자 + 채워진 원색 판 + 흰 테두리
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    rr(ctx, 8, 12, CS - 16, CS - 16, 24);
    ctx.fill();
    ctx.fillStyle = color;
    rr(ctx, 8, 6, CS - 16, CS - 16, 24);
    ctx.fill();
    ctx.lineWidth = 7;
    ctx.strokeStyle = '#ffffff';
    rr(ctx, 11, 9, CS - 22, CS - 22, 21);
    ctx.stroke();
    // 아이콘
    const s = CS * 0.66;
    ctx.translate((CS - s) / 2, (CS - s) / 2 - 2);
    if (type === 'crate' || type === 'in' || type === 'out') {
      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      ctx.beginPath();
      ctx.arc(s / 2, s / 2, s * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineJoin = 'round';
      if (type === 'out') drawMenu(ctx, id, s);
      else drawIng(ctx, id, s);
      if (type === 'in') {
        // 아래로 넣는 작은 화살표
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(s * 0.78, s * 0.72);
        ctx.lineTo(s * 1.0, s * 0.72);
        ctx.lineTo(s * 0.89, s * 0.92);
        ctx.fill();
      }
    } else glyph(ctx, type, s);
    ctx.restore();
    this.tex.needsUpdate = true;
    return i;
  }

  begin() {
    this.n = 0;
  }
  put(x, z, size, type, id, bright = 1) {
    if (this.n >= this.max) return;
    const i = this.cell(type, id);
    const col = i % N;
    const row = Math.floor(i / N);
    this._m.makeScale(size, 1, size);
    this._m.setPosition(x, 0.028, z);
    this.mesh.setMatrixAt(this.n, this._m);
    this.aCell.setXY(this.n, col / N, 1 - (row + 1) / N);
    this._c.setRGB(bright, bright, bright);
    this.mesh.setColorAt(this.n, this._c);
    this.n++;
  }
  end() {
    this.mesh.count = this.n;
    this.mesh.instanceMatrix.needsUpdate = true;
    this.mesh.instanceColor.needsUpdate = true;
    this.aCell.needsUpdate = true;
  }
  gauge(x, z, prog) {
    const on = prog !== null && prog !== undefined;
    this.ring.visible = on;
    this.ringBg.visible = on;
    if (!on) return;
    this.ring.position.set(x, 0.05, z);
    this.ringBg.position.set(x, 0.045, z);
    const k = Math.max(0, Math.min(1, prog));
    this.ring.geometry.setDrawRange(0, Math.max(0, Math.floor((this.ringCount / 6) * k)) * 6);
  }
  dispose() {
    this.mesh.geometry.dispose();
    this.tex.dispose();
  }
}
