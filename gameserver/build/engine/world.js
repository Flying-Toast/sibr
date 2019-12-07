"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class World {
    constructor() {
        this.tileData = new Map();
    }
    _tileArrayIndex(x, y) {
        return y * this.width + x;
    }
}
exports.default = World;
//# sourceMappingURL=world.js.map