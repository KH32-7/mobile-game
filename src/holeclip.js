import * as THREE from 'three';

// 홀 관련 공유 유니폼 (모든 바닥 계열 머티리얼이 같은 객체를 참조)
export const holeU = {
  uHolePos: { value: new THREE.Vector2() },
  uHoleR: { value: 1 },
  uTime: { value: 0 },
  uHoleHurt: { value: 0 },
  uRimCol: { value: new THREE.Color().setStyle('#a861ff', THREE.LinearSRGBColorSpace) },
  uWellCol: { value: new THREE.Color().setStyle('#5c2994', THREE.LinearSRGBColorSpace) },
  uSwirlCol: { value: new THREE.Color().setStyle('#5a26a0', THREE.LinearSRGBColorSpace) },
  uRainbow: { value: 0 },
};

export function applySkin(skin) {
  // 셰이더 출력 공간(sRGB)에 그대로 쓰기 위해 변환 없이 저장
  holeU.uRimCol.value.setStyle(skin.rim, THREE.LinearSRGBColorSpace);
  holeU.uWellCol.value.setStyle(skin.well, THREE.LinearSRGBColorSpace);
  holeU.uSwirlCol.value.setStyle(skin.swirl, THREE.LinearSRGBColorSpace);
  holeU.uRainbow.value = skin.rainbow ? 1 : 0;
}

const HEAD = `
varying vec2 vHW;
uniform vec2 uHolePos;
uniform float uHoleR;
uniform float uTime;
uniform float uHoleHurt;
uniform vec3 uRimCol;
uniform float uRainbow;
`;

// 머티리얼에 "홀 원 안쪽 discard" 를 주입. rim=true 면 테두리 음영 + 보라 글로우도 그림
export function patchHoleClip(mat, rim = false) {
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, holeU);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec2 vHW;')
      .replace(
        '#include <project_vertex>',
        `#include <project_vertex>
        {
          vec4 hw = vec4(transformed, 1.0);
          #ifdef USE_INSTANCING
          hw = instanceMatrix * hw;
          #endif
          hw = modelMatrix * hw;
          vHW = hw.xz;
        }`
      );
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\n' + HEAD)
      .replace('void main() {', 'void main() {\n  float hd = distance(vHW, uHolePos) - uHoleR;\n  if (hd < 0.0) discard;\n');
    if (rim) {
      sh.fragmentShader = sh.fragmentShader.replace(
        '#include <dithering_fragment>',
        `
        {
          float rw = 0.22 + uHoleR * 0.07;
          float lip = 1.0 - smoothstep(0.0, rw * 3.0, hd);
          gl_FragColor.rgb *= 1.0 - 0.5 * lip * lip;
          vec3 base = uRimCol;
          if (uRainbow > 0.5) base = 0.55 + 0.45 * cos(vec3(0.0, 2.1, 4.2) + atan(vHW.y - uHolePos.y, vHW.x - uHolePos.x) * 1.0 + uTime * 2.0);
          vec3 gc = mix(base, vec3(1.0, 0.25, 0.3), uHoleHurt);
          float pulse = 0.85 + 0.15 * sin(uTime * 3.0 + atan(vHW.y - uHolePos.y, vHW.x - uHolePos.x) * 3.0);
          float line = exp(-hd / (rw * 0.28));
          float glow = exp(-hd / (rw * 1.6));
          gl_FragColor.rgb += gc * (line * 0.9 + glow * 0.35) * pulse;
        }
        #include <dithering_fragment>`
      );
    }
  };
  mat.customProgramCacheKey = () => (rim ? 'holeclip-rim' : 'holeclip');
  return mat;
}

// 인스턴스별 흰색 플래시 (aFlash 0..1) + 홀 가독성: 떨어지는 중(aFlash < 0)이 아닌 적은
// 홀 원 안쪽의 지면 위 부분을 잘라 홀을 가리지 않게 함
export function patchFlash(mat) {
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, holeU);
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute float aFlash;\nvarying float vFlash;\nvarying vec3 vW;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvFlash = aFlash;')
      .replace(
        '#include <project_vertex>',
        `#include <project_vertex>
        {
          vec4 hw = vec4(transformed, 1.0);
          #ifdef USE_INSTANCING
          hw = instanceMatrix * hw;
          #endif
          vW = (modelMatrix * hw).xyz;
        }`
      );
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nvarying float vFlash;\nvarying vec3 vW;\nuniform vec2 uHolePos;\nuniform float uHoleR;')
      .replace('void main() {', 'void main() {\n  if (vFlash > -0.5 && vW.y > 0.02 && distance(vW.xz, uHolePos) < uHoleR * 0.985) discard;\n')
      .replace(
        '#include <dithering_fragment>',
        'gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1.0), clamp(vFlash, 0.0, 1.0));\n#include <dithering_fragment>'
      );
  };
  mat.customProgramCacheKey = () => 'flash-clip';
  return mat;
}
