"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const player_1 = require("./components/player");
const enums_1 = require("../core/enums");
class PlayerType {
    constructor() {
        this.typeName = "player";
        this.components = [player_1.default];
        this.syncType = enums_1.EntitySync.synced;
    }
}
exports.PlayerType = PlayerType;
//# sourceMappingURL=entityTypes.js.map