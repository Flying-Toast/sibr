import World from "../core/world";
import Level from "../core/level";
import { PlayerType } from "./entityTypes";

export default class TestWorld extends World {
    level: Level
    constructor() {
        super();
        this.level = new Level(100, 100);
        this.createEntity(PlayerType);
    }
}