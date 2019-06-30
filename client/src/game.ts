import { Network } from "./networking";
import { Entity, buildEntity } from "./entity";
import { InputManager } from "./events";
import { Application } from "pixi.js";

export class Configuration {
        
}

export class Game {
    network: Network;
    inputManager: InputManager;
    pixiApp: Application;

    entities: {[key:string]:Entity} = {};
    knownEntities = new Set<string>();

    deltaTime: number;

    constructor (network: Network, inputManager: InputManager, pixiApp: Application) {
        this.network = network;
        this.inputManager = inputManager;
        this.pixiApp = pixiApp;
        this.network.onUpdate = this.pullGameState.bind(this);
        this.pixiApp.ticker.add(this.gameLoop);
    }

    gameLoop (deltaTime: number) {
        this.deltaTime = deltaTime;

        for (const id in this.entities) {
            const entity = this.entities[id];
            entity.onUpdate();
        }
    }

    addEntity(entity: Entity) {
        this.entities[entity.id] = entity;
        this.knownEntities.add(entity.id);
    }

    getEntity(id: string): Entity {
        return this.entities[id];
    }

    pullGameState (data: any) {
        for (var id in data) {
            /*
                Updating entities does not rebuild their components from
                scratch. This allows internal members of components that
                are *not* synced with the server to persist between updates
            */
            if (this.knownEntities.has(id)) {
                this.getEntity(id).setState(data[id]);
            } else {
                this.addEntity(buildEntity(this, id, data[id]));
            }
        }
    }
}

