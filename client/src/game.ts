import {Network} from "./networking";
import { interaction } from "pixi.js";
import * as Components from "./components";

enum AmmoType {
    light,
    medium,
    heavy,
    shotgun
}

export class Item {
    type: string;
    name: string;
}

export class ConsumableItem extends Item {
    amount: number;
}

export interface Damaging {
    damage: number;
}

export class Weapon implements Damaging {
    damage: number;
    ammoType: AmmoType;
}

export class Entity {
    data: any;
    components: Components.Component[];
}

export class Game {
    network: Network;
    entities: Entity[];
    knownEntities: Set<string>;

    constructor (network: Network) {
        this.network = network;
        this.network.onUpdate = this.pullGameState.bind(this);
    }

    pullGameState (data: any) {
        for (var id in data) {
            if (this.knownEntities.has(id)) {

            } else {

            }
        }
    }
}

