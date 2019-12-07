import EntityType from "../core/entityType";
import Player from "./components/player";
import Entity from "../core/entity";
import { EntitySync } from "../core/enums";

export class PlayerType implements EntityType {
    typeName = "player";
    components = [Player];
    syncType = EntitySync.synced;

}