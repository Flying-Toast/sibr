import EntityType from "../core/entityType";
import Player from "./components/player";
import Entity from "../core/entity";

export class PlayerType implements EntityType {
    typeName = "player";
    components = [Player];

}