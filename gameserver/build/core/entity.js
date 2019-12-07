"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vector_1 = require("./vector");
const cycleDataInterfaces_1 = require("./cycleDataInterfaces");
const world_1 = require("./world");
class Entity {
    constructor(world, type) {
        this.pos = new vector_1.default(0, 0); // world position
        this.rotation = 0; // sprite rotation
        this.components = new Map();
        // contains information for the client each update cycle
        this.cycleData = new cycleDataInterfaces_1.EntityCycleData();
        this.world = world;
        this.type = type;
        this.id = world_1.default.requestNewEntityId();
        for (const componentType of type.components) {
            const component = new componentType(this);
        }
    }
    onCreate() {
        for (const [componentType, component] of this.components) {
            component.onCreate();
        }
    }
    onUpdate() {
        this.cycleData = new cycleDataInterfaces_1.EntityCycleData();
        for (const [componentType, component] of this.components) {
            component.onUpdate();
        }
        this.cycleData.publishedState = this.buildState();
        this.cycleData.mechanics = this.buildMechanics();
        return this.cycleData;
    }
    buildState() {
        const state = {};
        // Combine the published states of all the components into one object
        for (const [componentType, component] of this.components) {
            for (const [stateKey, stateValue] of component.publishState()) {
                state[stateKey] = stateValue;
            }
        }
        return state;
    }
    buildMechanics() {
        const mechanics = [];
        // Combine the client-side mechanics of all the components into one array
        for (const [componentType, component] of this.components) {
            for (const mechanic of component.publishMechanics()) {
                mechanics.push(mechanic);
            }
        }
        return mechanics;
    }
    broadcastEvent(eventName) {
        this.cycleData.events.push(eventName);
    }
    getComponent(byName) {
        return this.components.get(byName);
    }
    addComponent(component) {
        this.components.set(component.typeName, component);
    }
}
exports.default = Entity;
//# sourceMappingURL=entity.js.map