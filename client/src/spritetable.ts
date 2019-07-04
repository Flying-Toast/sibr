import { logInfo } from "./logging";

export class SpriteTable {
    table: {[key: string]: string}
    
    onLoad = new Function();
    loaded = false;

    cache = PIXI.utils.TextureCache;

    constructor (spriteMap: any, prependPath: string = "") {
        for (const spriteName in spriteMap) {
            const spritePath = spriteMap[spriteName];
            this.table[spriteName] = prependPath+"/"+spritePath;
            PIXI.loader.add(spritePath);
        }
        PIXI.loader.load(this._onLoad.bind(this));
    }

    _onLoad() {
        this.loaded = true;
        this.onLoad();
        logInfo("Sprites loaded");
    }

    getTexture(spriteName: string) {
        return this.cache[this.table[spriteName]];
    }
}
