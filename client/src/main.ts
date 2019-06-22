import './style.css';

import * as PIXI from 'pixi.js';

const app = new PIXI.Application({
    width: 512, height: 256,
    autoResize: true
});
document.body.appendChild(app.view);

window.addEventListener('resize', resize);

// Resize function window
function resize() {
	// Resize the renderer
	app.renderer.resize(window.innerWidth, window.innerHeight);
}

resize();