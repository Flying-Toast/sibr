import {Network} from "./networking";
import { interaction } from "pixi.js";

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

export class Player {
    x: number;
    y: number;
}

// The player being controlled by the client.
// Has additional information that is irrelevant/private in other onscreen players
// such as inventory, health, etc.

export class MainPlayer extends Player {
    
}

export class Game {
    network: Network;
    players: Player[];

    constructor (network: Network) {
        this.network = network;
    }
}

