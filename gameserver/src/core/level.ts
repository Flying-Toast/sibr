interface TileData {}

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
        return this.parent._tileArrayIndex(this.x, this.y);
    }
    get tileID() {
        return this.parent.tiles[this._index];
    }
    set tileID(to: number) {
        this.parent.tiles[this._index] = to;
    }

    get tileData(): TileData|undefined {
        return this.parent.tileData.get([this.x, this.y]);
    }
    set tileData(to: TileData|undefined) {
        if (to) {
            this.parent.tileData.set([this.x, this.y], to);
        } else {
            this.parent.tileData.delete([this.x, this.y]);
        }
        
    }

    get inBounds(): boolean {
        if (
            this.x < 0 ||
            this.x >= this.parent.width ||
            this.y < 0 ||
            this.y >= this.parent.height
        ) {
            return false;
        }
        return true;
    }

    offset(dx: number, dy: number) {
        return new Tile(this.parent, this.x + dx, this.y + dy);
    }
}

export default class Level {
    tiles: Uint8Array;
    tileData = new Map<[number, number], TileData>();

    width: number;
    height: number;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.tiles = new Uint8Array(width*height);
    }

    _tileArrayIndex(x: number, y: number) {
        return y * this.width + x;
    }
}
