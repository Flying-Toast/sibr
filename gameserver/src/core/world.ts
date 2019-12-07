import Level from "./level";
import Entity from "./entity";
import WorldNetInterface from "./worldNetInterface";
import * as uuidv1 from "uuid/v1";
import { WorldCycleData, EntityCycleData } from "./cycleDataInterfaces";
import { GameEvent } from "./enums";
import EntityType from "./entityType";

export default abstract class World {
    abstract level: Level;
    private entities = new Map<string, Entity>();
    private worldCycleData = new WorldCycleData();

    get entityList() {
        return this.entities.values();
    }

    async onCreate() {
        for (const entity of this.entityList) {
            entity.onCreate();
        }
    }

    // Entity add/delete queue so that the entity table isn't being
    // modified until after all the other entities are done updating
    private entityAddQueue: Entity[] = [];
    private entityDeleteQueue: Entity[] = [];

    private addPendingEntities() {
        for (const entity of this.entityAddQueue) {
            this._addEntity(entity);
            this.worldCycleData.createdEntities.push([
                entity.id,
                entity.type.syncType
            ]);
        }
        this.entityAddQueue = [];
    }
    private _addEntity(entity: Entity) {
        // Should never be used during an update cycle
        this.entities.set(entity.id, entity);
    }

    private deletePendingEntites() {
        for (const entity of this.entityAddQueue) {
            this.worldCycleData.deletedEntities.push(entity.id);
        }
    }
    private _delEntity(entity: Entity) {
        // Immediately remove the entity from the entity table
        // Should never be used during an update cycle
        this.entities.delete(entity.id);
    }

    async onUpdate(): Promise<WorldCycleData> {
        this.worldCycleData = new WorldCycleData();
        this.deletePendingEntites(); // delete entities killed last cycle
        this.addPendingEntities(); // add entities created last cycle

        for (const entity of this.entityList) {
            const entityCycleData = entity.onUpdate();

            this.worldCycleData.entityUpdates.set(entity.id, entityCycleData);
        }
        return this.worldCycleData;
    }

    static requestNewEntityId(): string {
        return uuidv1();
    }

    getEntity(id: string) {
        return this.entities.get(id)!;
    }

    broadcastGameEvent(event: GameEvent) {
        this.worldCycleData.gameEvents.push(event);
    }

    createEntity<T extends EntityType>(Type: new () => T) {
        const type = new Type();
        const entity = new Entity(this, type);
        this.entityAddQueue.push(entity);
    }

    deleteEntity(entity: Entity) {
        this.entityDeleteQueue.push(entity);
    }
}
