
export enum AmmoType {
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