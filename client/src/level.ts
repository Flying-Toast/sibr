import { logError } from "./logging";

export class Tile {
    parent: Level;
    x: number;
    y: number;

    constructor(parent: Level, x: number, y: number) {
        this.parent = parent;
        this.x = x;
        this.y = y;
    }

    get _index() {
        return this.parent._getIndex(this.x, this.y);
    }
    get tileID() {
        return this.parent.tiles[this._index];
    }
    set tileID(to: number) {
        this.parent.tiles[this._index] = to;
    }

    get variant() {
        return this.parent.variants[this._index];
    }
    set variant(to: number) {
        this.parent.variants[this._index] = to;
    }
}

export class Level {
    width: number;
    height: number;

    size: number;
    
    tiles: Uint8Array;
    variants: Uint8Array;

    constructor(w: number, h: number) {
        this.width = w;
        this.height = h;
        this.size = w*h;
        
        this.tiles = new Uint8Array(this.size);
        this.variants = new Uint8Array(this.size);
    }

    static fromJSON(data: any) {
        
    }

    _getIndex(x: number, y: number) {
        if (x<0 || x>=this.width || y<0 || y>=this.height) {
            logError(`Level tile coordinate (${x}, ${y}) is out of range`);
            return 0;
        }
        return y*this.width + x;
    }

    getTile(x: number, y: number): Tile {
        return new Tile(this, x, y);
    }
}