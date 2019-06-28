import './style.css';

import * as PIXI from 'pixi.js';
import $ from "jquery";

import {Network} from "./networking";
import {Game} from "./game";

const app = new PIXI.Application({
    width: 512, height: 256,
    autoResize: true
});
document.body.appendChild(app.view);
window.addEventListener('resize', resize); // Dynamically resize canvas

const wsURL = `ws${(location.protocol==="https:")?"s":""}://${location.host}/ws`;
var network = new Network(wsURL);

network.onReady = ()=>{
    $("#networkstatus").text(""); // Remove "Connecting..." message on the homescreen
};

var game: Game;

// Resize canvas to fit the window
function resize() {
	app.renderer.resize(window.innerWidth, window.innerHeight);
}
resize();

// module functions made externally accessable via the window instance 
(<any> window).startgame = ()=>{
    network.startGame(<string> $("#nickname").val());
    game = new Game(network);
    $(".mainmenu").hide();
}

