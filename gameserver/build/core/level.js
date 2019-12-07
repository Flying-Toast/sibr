"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Tile {
    constructor(parent, x, y) {
        this.parent = parent;
        this.x = x;
        this.y = y;
    }
    get _index() {
        return this.parent._tileArrayIndex(this.x, this.y);
    }
    get tileID() {
        return this.parent.tiles[this._index];
    }
    set tileID(to) {
        this.parent.tiles[this._index] = to;
    }
    get tileData() {
        return this.parent.tileData.get([this.x, this.y]);
    }
    set tileData(to) {
        if (to) {
            this.parent.tileData.set([this.x, this.y], to);
        }
        else {
            this.parent.tileData.delete([this.x, this.y]);
        }
    }
    get inBounds() {
        if (this.x < 0 ||
            this.x >= this.parent.width ||
            this.y < 0 ||
            this.y >= this.parent.height) {
            return false;
        }
        return true;
    }
    offset(dx, dy) {
        return new Tile(this.parent, this.x + dx, this.y + dy);
    }
}
exports.Tile = Tile;
class Level {
    constructor(width, height) {
        this.tileData = new Map();
        this.width = width;
        this.height = height;
        this.tiles = new Uint8Array(width * height);
    }
    _tileArrayIndex(x, y) {
        return y * this.width + x;
    }
}
exports.default = Level;
//# sourceMappingURL=level.js.map