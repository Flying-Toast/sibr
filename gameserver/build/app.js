"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const socketio = require("socket.io");
const http = require("http");
const config_1 = require("./config");
const server_1 = require("./server");
const app = express();
const httpServer = new http.Server(app);
const io = socketio(httpServer);
httpServer.listen(config_1.netConfig.port, function () {
    console.log(`listening on *:${config_1.netConfig.port}`);
});
const gameServer = new server_1.default(io);
gameServer.initCallbacks();
gameServer.run();
//# sourceMappingURL=app.js.map