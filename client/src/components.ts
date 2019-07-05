import { Vector, Color } from "./util";
import { Entity } from "./entity";
import { Sprite } from "pixi.js";
import { logError } from "./logging";
import * as PIXI from 'pixi.js';

export class Component {
    // Name of the component
    name: string;

    // A reference to the parent entity
    entity: Entity;

    constructor () {
        
    }

    /*
        Update state using the values sent by the server
        If the structure of the component state differs
        from that of the data being sent, this method
        must be overriden. See Location.setState for an example
    */
    setState(data: any) {
        // naive method of setting fields using a key/value object
        for (const field in data) {
            (<any> this)[field] = data[field]; // very unidomatic but shhhh
        }
    }

    // Should be overwritten to run at initialization with the first state data
    // setState will be called subsequently so this may be left blank
    onStart(data: any) {

    }

    // Should be overwritten to run before any onUpdate calls on every frame
    // Code such as physics should go here.
    onPreUpdate() {

    }

    // Should be overwritten to run each frame
    onUpdate() {

    }
}
export class Location extends Component {
    pos: Vector;

    setState(data: any) {
        this.pos = new Vector(data.x, data.y);
    }
}
export class Velocity extends Component {
    vx: number;
    vy: number;
}

function defaultField(val: any, defaultValue: any) {
    if (val == undefined || val == null) {
        return defaultValue;
    }
    return val;
}
export class Render extends Component {
    spriteName: string;
    sprite: Sprite;

    setState(data: any) {
        this.sprite.tint = Color.fromArray(
            defaultField(data.tint, [1,1,1]), 255
        ).toHex();
        const anchor = defaultField(data.anchor, [0.5, 0.5])
        this.sprite.anchor.set(anchor[0], anchor[1]);
        this.spriteName = data.spriteName;
    }

    onStart (data: any) {
        const tex = this.entity.game.spriteTable.getTexture(data.spriteName);
        this.sprite = new PIXI.Sprite(tex);
        this.entity.game.pixiApp.stage.addChild(this.sprite);
    }
    onUpdate() {
        this.sprite.x = this.entity.location.pos.x;
        this.sprite.y = this.entity.location.pos.y;
    }
}

export class Nickname extends Component {
	nickname: string;
}

const componentTypes = [Location, Velocity, Render, Nickname];

export function componentTypeFromName(name: string) {
    // will optimize later
    for (const type of componentTypes) {
        if (type.name === name) {
            return type;
        }
    }
    return null;
}
