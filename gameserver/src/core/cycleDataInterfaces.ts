import Entity from "./entity";
import { EntitySync, GameEvent, EntityEvent } from "./enums";

export class EntityCycleData {
    events: EntityEvent[] = [];
    publishedState: any;
    mechanics: any;
}

export class WorldCycleData {
    entityUpdates = new Map<string, EntityCycleData>();
    createdEntities: [string, EntitySync][] = [];
    deletedEntities: string[] = [];
    gameEvents: GameEvent[] = [];
}