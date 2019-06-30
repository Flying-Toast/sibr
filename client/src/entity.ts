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
        return this.getComponent("location") as Components.Location;
    }

    constructor (id: string) {
        this.id = id;
    }

    addComponent(comp: Component) {
        this.components[comp.name] = comp;
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
        comp.setState(data[componentName]); // Sync proper fields with the server
        comp.entity = this;
        entity.addComponent(comp);
        
    }
    return entity;
}