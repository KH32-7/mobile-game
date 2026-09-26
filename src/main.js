import './style.css';
import { Game } from './game.js';

const app = document.getElementById('app');
const canvas = document.getElementById('gl');
const ui = document.getElementById('ui');

// 롱프레스 메뉴, 더블탭 확대, 제스처 차단
['contextmenu', 'gesturestart', 'dblclick'].forEach((ev) => document.addEventListener(ev, (e) => e.preventDefault(), { passive: false }));
document.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });

new Game(app, canvas, ui);
