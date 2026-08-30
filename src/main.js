import { GameEngine } from './engine.js?v=4';
import { UI } from './ui.js?v=4';
import { AudioFeedback } from './audio.js?v=4';

const engine = new GameEngine();
const audio = new AudioFeedback(engine.getState().settings.sound);
const ui = new UI(engine, document.querySelector('#app'), document.querySelector('#toast-region'), audio);
ui.mount();

window.addEventListener('blur', () => { if (!engine.getState().paused) engine.update((state) => { state.paused = true; }); });
document.addEventListener('contextmenu', (event) => { if (event.target.closest('#app')) event.preventDefault(); });
