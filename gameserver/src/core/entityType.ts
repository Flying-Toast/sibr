import Entity from "./entity";
import Player from "../game/components/player";
import Component from "./component";

export default interface EntityType {
    typeName: string;
    components: (typeof Component)[]; // List of component typesx
}