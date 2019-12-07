"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
function loadConfig(fileName) {
    return JSON.parse(fs.readFileSync(fileName).toString());
}
exports.loadConfig = loadConfig;
exports.netConfig = loadConfig('resources/net_config.json');
exports.gameConfig = loadConfig('resources/game_config.json');
//# sourceMappingURL=config.js.map