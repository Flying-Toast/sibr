"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EntityCycleData {
    constructor() {
        this.events = [];
    }
}
exports.EntityCycleData = EntityCycleData;
class WorldCycleData {
    constructor() {
        this.entityUpdates = new Map();
        this.createdEntities = [];
        this.gameEvents = [];
    }
}
exports.WorldCycleData = WorldCycleData;
//# sourceMappingURL=cycleDataInterfaces.js.map