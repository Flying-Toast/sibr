import * as Components from "./components";
import { Component } from "./components";
import { logError } from "./logging";
import { Game } from "./game";

export class Entity {
    id: string;
    data: any;
    components: {[key:string]:Component} = {};
    game: Game;

    get location(): Components.Location {
        return this.getComponent("Location") as Components.Location;
    }

    constructor (id: string) {
        this.id = id;
    }

    addComponent(comp: Component) {
        const componentName = comp.constructor.name;
        this.components[componentName] = comp;
    }

    getComponent(name: string): Component {
        return this.components[name];
    }

    // Sync components' states using values sent by the server
    setState(data: any) {
        for (const componentName in this.components) {
            this.components[componentName].setState(data[componentName]);
        }
    }

    onPreUpdate() {
        for (const componentName in this.components) {
            this.components[componentName].onPreUpdate();
        }
    }

    onUpdate() {
        for (const componentName in this.components) {
            this.components[componentName].onUpdate();
        }
    }
}

export function buildEntity(game: Game, id: string, data: any): Entity {
    const entity = new Entity(id);
    entity.game = game;

    for (const componentName in data) {
        const compType = Components.componentTypeFromName(componentName);
        if (compType == null) {
            logError(`Unknown component name ${componentName}`);
        }
        const comp = new compType(); // Instantiate new component
        
        comp.entity = entity;

        comp.onStart(data[componentName]); // Call onStart function of the component
        comp.setState(data[componentName]); // Sync proper fields with the server
        
        entity.addComponent(comp);
        
    }
    return entity;
}