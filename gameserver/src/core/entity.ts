import Vector from "./vector";
import Component from "./component";
import { EntityCycleData } from "./cycleDataInterfaces";
import WorldNetInterface from "./worldNetInterface";
import World from "./world";
import { EntityEvent } from "./enums";
import EntityType from "./entityType";

export default class Entity {
    type: EntityType;
    readonly id: string;
    pos = new Vector(0, 0); // world position
    rotation = 0; // sprite rotation

    world: World;

    components = new Map<string, Component>();

    // contains information for the client each update cycle
    private cycleData = new EntityCycleData();

    constructor(world: World, type: EntityType) {
        this.world = world;
        this.type = type;
        this.id = World.requestNewEntityId();
        for (const componentType of type.components) {
            const component = new componentType(this);
        }
    }

    onCreate(): void {
        for (const [componentType, component] of this.components) {
            component.onCreate();
        }
    }

    onUpdate(): EntityCycleData {
        this.cycleData = new EntityCycleData();
        for (const [componentType, component] of this.components) {
            component.onUpdate();
        }
        this.cycleData.publishedState = this.buildState();
        this.cycleData.mechanics = this.buildMechanics();
        return this.cycleData;
    }

    buildState(): any {
        const state: any = {};

        // Combine the published states of all the components into one object
        for (const [componentType, component] of this.components) {
            for (const [stateKey, stateValue] of component.publishState()) {
                state[stateKey] = stateValue;
            }
        }

        return state;
    }

    buildMechanics(): string[] {
        const mechanics: string[] = [];

        // Combine the client-side mechanics of all the components into one array
        for (const [componentType, component] of this.components) {
            for (const mechanic of component.publishMechanics()) {
                mechanics.push(mechanic);
            }
        }
        return mechanics;
    }

    broadcastEvent(eventName: EntityEvent) {
        this.cycleData.events.push(eventName);
    }

    getComponent(byName: string) {
        return this.components.get(byName);
    }

    addComponent(component: Component) {
        this.components.set(component.typeName, component);
    }

    delete() {
        // this.toasterBath()
        this.world.deleteEntity(this);
    }
}
