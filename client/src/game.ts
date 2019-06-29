import { Network } from "./networking";
import { Entity, buildEntity } from "./entity";


export class Game {
    network: Network;
    entities: Record<string, Entity>;
    knownEntities: Set<string>;

    constructor (network: Network) {
        this.network = network;
        this.network.onUpdate = this.pullGameState.bind(this);
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
                this.addEntity(buildEntity(id, data[id]));
            }
        }
    }
}

