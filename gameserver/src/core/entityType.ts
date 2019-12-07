import Entity from "./entity";
import Player from "../game/components/player";
import Component from "./component";
import { EntitySync } from "./enums";

export default interface EntityType {
    typeName: string;
    components: (typeof Component)[]; // List of component types
    syncType: EntitySync; // How the client should update information about this entity
}