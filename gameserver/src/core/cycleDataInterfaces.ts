import Entity from "./entity";
import { GameEvent, EntityEvent } from "./enums";

export class EntityCycleData {
    events: EntityEvent[] = [];
    publishedState: any;
    mechanics: any;
}

export class WorldCycleData {
    entityUpdates = new Map<string, EntityCycleData>();
    createdEntities: string[] = [];
    deletedEntities: string[] = [];
    gameEvents: GameEvent[] = [];
}