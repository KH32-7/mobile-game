// 컬렉션 화면용 3D 젤리 미리보기 (별도 작은 렌더러, 패널이 열려 있을 때만 동작)
import * as THREE from 'three';
import { CharRenderer, Hat } from './chars.js';

export class SkinPreview {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.className = 'preview3d';
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.scene = new THREE.Scene();
    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x6a7fb0, 1.8));
    const sun = new THREE.DirectionalLight(0xffffff, 1.6);
    sun.position.set(2, 4, 3);
    this.scene.add(sun);
    this.camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
    this.chars = new CharRenderer(this.scene);
    this.chars.shadow.material.opacity = 0.18;
    this.hat = new Hat(this.scene);
    this.skin = null;
    this.t = 0;
    this.raf = 0;
    this.thumbs = {};
  }

  draw(skin, yaw, t, w, h) {
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.position.set(0, 1.0, 3.4);
    this.camera.lookAt(0, 0.55, 0);
    this.camera.updateProjectionMatrix();
    this.hat.set(skin.hat, skin.leader);
    this.chars.begin();
    const b = Math.abs(Math.sin(t * 5)) * 0.08;
    this.chars.push(-0.62, b * 0.7, -0.35, yaw + Math.PI + 0.3, 0.9, 0.9, 0.9, skin.crew[0], 0, 0, true, t * 7, 0.6);
    this.chars.push(0.62, b * 0.7, -0.35, yaw + Math.PI - 0.3, 0.9, 0.9, 0.9, skin.crew[1], 0, 0, true, t * 7 + 2, 0.6);
    this.chars.push(0, b, 0, yaw + Math.PI, 1.25, 1.25, 1.25, skin.leader, 0, 0, true, t * 7 + 1, 0.8);
    this.chars.end();
    this.hat.place(0, b, 0, 1.25, 1.25, 1.25, 0, 0, true, yaw + Math.PI);
    this.renderer.render(this.scene, this.camera);
  }

  // 카드용 정지 썸네일 (한 번 만들고 캐시)
  thumb(skin) {
    if (this.thumbs[skin.id]) return this.thumbs[skin.id];
    this.draw(skin, 0.35, 0.3, 160, 120);
    this.thumbs[skin.id] = this.canvas.toDataURL('image/png');
    return this.thumbs[skin.id];
  }

  start(host, skin) {
    this.skin = skin;
    if (this.canvas.parentNode !== host) host.appendChild(this.canvas);
    cancelAnimationFrame(this.raf);
    let last = performance.now();
    const loop = (now) => {
      this.raf = requestAnimationFrame(loop);
      this.t += Math.min(0.05, (now - last) / 1000);
      last = now;
      const r = host.getBoundingClientRect();
      if (r.width < 10) return;
      this.draw(this.skin, Math.sin(this.t * 0.9) * 0.9, this.t, Math.round(r.width), Math.round(r.height));
    };
    this.raf = requestAnimationFrame(loop);
  }

  setSkin(skin) { this.skin = skin; }
  stop() { cancelAnimationFrame(this.raf); this.raf = 0; }
}
