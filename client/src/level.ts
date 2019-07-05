import { logError } from "./logging";
import { RenderTexture, Application, Sprite, CanvasRenderer, WebGLRenderer } from "pixi.js";
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
}

export class Level {
    game: Game;

    width: number;
    height: number;

    size: number;
    
    tiles: Uint8Array;
    variants: Uint8Array;

    renderTex: RenderTexture;

    static tileCodes: {[key:string]: number} = {
        "dirt": 1
    }
    
    constructor(game: Game, w: number, h: number) {
        this.game = game;

        this.width = w;
        this.height = h;
        this.size = w*h;
        
        this.tiles = new Uint8Array(this.size);
        this.variants = new Uint8Array(this.size);
    }

    static fromJSON(game: Game, data: any): Level {
        const map = data.map;
        const w = data.width;
        const h = data.height;
        const lvl = new Level(game, w, h);

        for (const tileData of data.map) {
            const tile = lvl.getTile(tileData.x, tileData.y);
            tile.tileID = this.tileCodes[tileData.texture];
        }
        return lvl;
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

    preallocate() {
        this.renderTex = RenderTexture.create(32*this.width, 32*this.height);
    }

    bakeDetails() {
        // Put grass on the dirt, possibly compute lighting
    }

    render(): RenderTexture {
        const renderer = this.game.pixiApp.renderer;
        const spriteTable = this.game.spriteTable;

        for (var x=0; x<this.width; x++) {
            for (var y=0; y<this.height; y++) {
                const tile = this.getTile(x, y);
                if (tile.tileID == 1) {
                    const sprite = new Sprite(spriteTable.getTexture("dirt"));
                    sprite.x = x*32;
                    sprite.y = y*32;
                    renderer.render(sprite, this.renderTex);
                }
            }
        }
        return this.renderTex;
    }

}