"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../../component");
const inventory_1 = require("../inventory");
class Player extends component_1.default {
    constructor(entity) {
        super("player", entity);
        this.typeName = "Player";
        this.hp = 100;
        this.inventory = new inventory_1.Inventory();
    }
    onUpdate() {
        super.onUpdate();
    }
    publishState() {
        super.publishState();
        return {
            hp: this.hp
        };
    }
    publishMechanics() {
        super.publishMechanics();
        return [
            "player"
        ];
    }
}
exports.default = Player;
//# sourceMappingURL=player.js.map