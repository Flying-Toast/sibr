"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const entity_1 = require("./entity");
const uuidv1 = require("uuid/v1");
const cycleDataInterfaces_1 = require("./cycleDataInterfaces");
class World {
    constructor() {
        this.entities = new Map();
        this.worldCycleData = new cycleDataInterfaces_1.WorldCycleData();
        this.entityAddQueue = [];
    }
    get entityList() {
        return this.entities.values();
    }
    async onCreate() {
        for (const entity of this.entityList) {
            entity.onCreate();
        }
    }
    addPendingEntities() {
        for (const entity of this.entityAddQueue) {
            this._addEntity(entity);
            this.worldCycleData.createdEntities.push([entity.id, entity.type.syncType]);
        }
        this.entityAddQueue = [];
    }
    async onUpdate() {
        this.worldCycleData = new cycleDataInterfaces_1.WorldCycleData();
        this.addPendingEntities(); // officially add entities created last cycle
        for (const entity of this.entityList) {
            const entityCycleData = entity.onUpdate();
            this.worldCycleData.entityUpdates.set(entity.id, entityCycleData);
        }
        return this.worldCycleData;
    }
    static requestNewEntityId() {
        return uuidv1();
    }
    getEntity(id) {
        return this.entities.get(id);
    }
    broadcastGameEvent(event) {
        this.worldCycleData.gameEvents.push(event);
    }
    createEntity(Type) {
        const type = new Type();
        const entity = new entity_1.default(this, type);
        this.entityAddQueue.push(entity);
    }
    _addEntity(entity) {
        // Should never be used during an update cycle
        this.entities.set(entity.id, entity);
    }
}
exports.default = World;
//# sourceMappingURL=world.js.map