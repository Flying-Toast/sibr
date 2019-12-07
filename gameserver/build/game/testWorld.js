"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const world_1 = require("../core/world");
const level_1 = require("../core/level");
const entityTypes_1 = require("./entityTypes");
class TestWorld extends world_1.default {
    constructor() {
        super();
        this.level = new level_1.default(100, 100);
        this.createEntity(entityTypes_1.PlayerType);
    }
}
exports.default = TestWorld;
//# sourceMappingURL=testWorld.js.map