"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../../core/component");
const inventory_1 = require("../inventory");
class Player extends component_1.default {
    constructor(entity) {
        super(entity);
        this.typeName = "Player";
        this.hp = 100;
        this.inventory = new inventory_1.Inventory();
    }
    onUpdate() {
        super.onUpdate();
    }
    publishState() {
        return {
            hp: this.hp
        };
    }
    publishMechanics() {
        return [
            "player"
        ];
    }
}
exports.default = Player;
//# sourceMappingURL=player.js.map