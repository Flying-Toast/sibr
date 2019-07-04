import { Network } from "./networking";
import { Entity, buildEntity } from "./entity";
import { InputManager } from "./events";
import { Application } from "pixi.js";
import { Vector } from "./util";
import { SpriteTable } from "./spritetable";

export class Configuration {

}

export class Game {
    network: Network;
    inputManager: InputManager;
    pixiApp: Application;
    spriteTable: SpriteTable;

    entities: {[key:string]:Entity} = {};
    knownEntities = new Set<string>();

    constructor (
            network: Network,
            inputManager: InputManager,
            pixiApp: Application,
            spriteTable : SpriteTable
        ) {
        this.network = network;
        this.inputManager = inputManager;
        this.pixiApp = pixiApp;
        this.spriteTable = spriteTable;

        this.network.onUpdate = this.pullGameState.bind(this);
        this.pixiApp.ticker.add(this.gameLoop.bind(this));
    }

    gameLoop (deltaTime: number) {
        const keyEvents = this.inputManager.pollKeys();
        const mouseEvents = this.inputManager.pollMouse();

        for (const id in this.entities) {
            const entity = this.entities[id];
            entity.onUpdate();
        }

        // test

        const movement = new Vector(0, 0);
        var jumping = false;

        if (keyEvents.get("a").held) {
            movement.x -= 1;
        }
        if (keyEvents.get("d").held) {
            movement.x += 1;
        }
        if (keyEvents.get(" ").down) {
            jumping = true;
        }

		const currentTime = performance.now();
		const inputTimeDiff = currentTime - this.inputManager.lastInputSent;
		if (inputTimeDiff >= this.inputManager.inputSendInterval) {
			this.network.send([
				movement.x,
				movement.y,
				jumping,
				false, // firing
				0, // looking x
				0, // looking y
				Math.round(inputTimeDiff)
			]);
			this.inputManager.lastInputSent = currentTime;
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

