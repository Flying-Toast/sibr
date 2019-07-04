import { logInfo } from "./logging";
import * as PIXI from 'pixi.js';

export class SpriteTable {
    table: {[key: string]: string} = {};
    
    onLoad = new Function();
    loaded = false;

    cache = PIXI.utils.TextureCache;

    constructor (app: PIXI.Application, spriteMap: any, prependPath: string = "") {
        for (const spriteName in spriteMap) {
            const spritePath = prependPath+"/"+spriteMap[spriteName];
            this.table[spriteName] = spritePath;
            logInfo(`Loading ${spriteName} as ${spritePath}`);
            app.loader.add(spritePath);
        }
        app.loader.load(this._onLoad.bind(this));
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
