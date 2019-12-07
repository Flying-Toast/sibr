import { logError } from "./logging";
import {
    RenderTexture,
    Application,
    Sprite,
    CanvasRenderer,
    WebGLRenderer
} from "pixi.js";
import { Render } from "./components";
import { Game } from "./game";

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

export class Level {
    game: Game;

    width: number;
    height: number;

    size: number;

    tiles: Uint8Array;
    variants: Uint8Array;

    renderTex: RenderTexture;

    static tileCodes: { [key: string]: number } = {
        dirt: 1
    };

    constructor(game: Game, w: number, h: number) {
        this.game = game;

        this.width = w;
        this.height = h;
        this.size = w * h;

        this.tiles = new Uint8Array(this.size);
        this.variants = new Uint8Array(this.size);
    }

    static fromJSON(game: Game, data: any): Level {
        const map = data.map;
        const w = data.width;
        const h = data.height;
        const lvl = new Level(game, w, h);

        for (const tileData of data.map) {
            const tile = lvl.tile(tileData.x, tileData.y);
            tile.tileID = this.tileCodes[tileData.texture];
        }

        return lvl;
    }

    _getIndex(x: number, y: number) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            logError(`Level tile coordinate (${x}, ${y}) is out of range`);
            return 0;
        }
        return y * this.width + x;
    }

    tile(x: number, y: number): Tile {
        return new Tile(this, x, y);
    }

    preallocate() {
        this.renderTex = RenderTexture.create(
            32 * this.width,
            32 * this.height
        );
    }

    bakeDetails() {
        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                this.tile(x, y).variant = this.groundTileVariant(
                    this.tile(x, y)
                );
            }
        }
    }

    isValid(t: Tile): boolean {
        if (t.x < 0 || t.x >= this.width || t.y < 0 || t.y >= this.height) {
            return false;
        }
        return true;
    }

    groundTileVariant(t: Tile): number {
        // Code written at 4AM is the best code
        var xBias = 0;
        var yBias = 0;

        const left = t.offset(-1, 0);
        const right = t.offset(1, 0);
        const up = t.offset(0, -1);
        const down = t.offset(0, 1);

        if (!left.inBounds) {
            xBias += 1;
        } else if (left.tileID == t.tileID) {
            xBias += 1;
        }

        if (!right.inBounds) {
            xBias -= 1;
        } else if (right.tileID == t.tileID) {
            xBias -= 1;
        }

        if (!up.inBounds) {
            yBias += 1;
        } else if (up.tileID == t.tileID) {
            yBias += 1;
        }

        if (!down.inBounds) {
            yBias -= 1;
        } else if (down.tileID == t.tileID) {
            yBias -= 1;
        }

        if (xBias == -1 && yBias == -1) {
            return 0;
        }
        if (xBias == 0 && yBias == -1) {
            return 1;
        }
        if (xBias == 1 && yBias == -1) {
            return 2;
        }
        if (xBias == -1 && yBias == 0) {
            return 3;
        }
        if (xBias == 0 && yBias == 0) {
            return 4;
        }
        if (xBias == 1 && yBias == 0) {
            return 5;
        }
        if (xBias == -1 && yBias == 1) {
            return 6;
        }
        if (xBias == 0 && yBias == 1) {
            return 7;
        }
        if (xBias == 1 && yBias == 1) {
            return 8;
        }
        return 4;
    }

    render(): RenderTexture {
        const renderer = this.game.pixiApp.renderer;

        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                const tile = this.tile(x, y);
                if (tile.tileID == 1) {
                    var sprite = new Sprite(
                        this.game.getTexture("dirt_" + tile.variant)
                    );
                    sprite.x = x * 32;
                    sprite.y = y * 32;
                    renderer.render(sprite, this.renderTex, false);
                }
            }
        }

        return this.renderTex;
    }
}
