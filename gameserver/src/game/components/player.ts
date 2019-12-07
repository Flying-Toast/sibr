import Component from "../../core/component";
import { Inventory } from "../inventory";
import Entity from "../../core/entity";

export interface PlayerPublishedState {
    hp: number;
}

export default class Player extends Component {
    typeName = "Player";

    hp = 100;
    inventory = new Inventory();

    constructor(entity: Entity) {
        super(entity);
    }

    onUpdate () {
        super.onUpdate();
    }

    publishState () {
        return {
            hp: this.hp
        };
    }

    publishMechanics () {
        return [
            "player"
        ];
    }
}