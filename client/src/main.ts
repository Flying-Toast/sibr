import './style.css';

import * as PIXI from 'pixi.js';
import $ from "jquery";

import {Network} from "./networking";
import {Game} from "./game";
import { InputManager } from './events';

const app = new PIXI.Application({
    width: 512, height: 256,
    autoResize: true
});
document.body.appendChild(app.view);
window.addEventListener('resize', resize); // Dynamically resize canvas

const wsURL = `ws${(location.protocol==="https:")?"s":""}://${location.host}/ws`;
var network = new Network(wsURL);

var inputs = new InputManager(app.view);

network.onReady = ()=>{
    $("#networkstatus").text(""); // Remove "Connecting..." message on the homescreen
    network.startGame(<string> $("#nickname").val());
    game = new Game(network, inputs, app);
    $(".mainmenu").hide();
};

var game: Game;

// Resize canvas to fit the window
function resize() {
	app.renderer.resize(window.innerWidth, window.innerHeight);
}
resize();

// module functions made externally accessable via the window instance 
(<any> window).startgame = ()=>{
    $("#networkstatus").text("Connecting...");
    network.connect();
}

