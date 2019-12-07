"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vector_1 = require("./core/vector");
class GameClient {
    constructor(socket, gameServer) {
        this.camera = new vector_1.default(0, 0);
        this.socket = socket;
        this.sid = socket.id;
        this.gameServer = gameServer;
    }
    bindToWorld(world) {
        this.world = world;
    }
    sendMessage(msg, data) {
        this.gameServer.sendMessage(this, msg, data);
    }
}
exports.default = GameClient;
//# sourceMappingURL=client.js.map