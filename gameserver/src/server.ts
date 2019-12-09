import World from "./core/world";
import GameClient from "./client";
import { Socket } from "socket.io";
import { WorldCycleData, EntityCycleData } from "./core/cycleDataInterfaces";
import Entity from "./core/entity";
import { gameConfig } from "./config";
import { EntityEvent, GameEvent, Mechanics } from "./core/enums";
import Vector from "./core/vector";

export default class GameServer {
    io: SocketIO.Server;
    worlds: World[] = [];
    private clients = new Map<string, GameClient>();

    constructor(io: SocketIO.Server) {
        this.io = io;
    }

    initCallbacks() {
        this.io.on("connection", this.onConnection);
    }

    // client list operations

    get clientList() {
        return Array.from(this.clients.values());
    }
    getClient(sid: string) {
        const c = this.clients.get(sid);
        if (!c) {
            throw new Error(`No client exists with session id ${sid}`);
        }
        return c;
    }
    private addClient(socket: Socket) {
        const client = new GameClient(socket, this);
        this.clients.set(socket.id, client);
        return client;
    }
    getClientsForWorld(world: World) {
        return this.clientList.filter(client => {
            client.world === world;
        });
    }

    private onConnection(socket: SocketIO.Socket) {
        console.log(`a user connected with sid ${socket.id}`);
        const client = this.addClient(socket);
        this.catchUpClient(client);
    }

    private onDisconnect(socket: SocketIO.Socket) {

    }

    addWorld(world: World) {
        world.onCreate();
    }

    async run() {
        while (true) {
            for (const world of this.worlds) {
                await this.runUpdateForWorld(world);
            }
        }
    }

    async runUpdateForWorld(world: World) {
        // server tick a world
        const cycleData = await world.onUpdate();

        for (const client of this.getClientsForWorld(world)) {
            this.syncClient(cycleData, world, client);
        }
    }

    shouldRenderEntity(entity: Entity, forClient: GameClient): boolean {
        // Return true if state updates should be sent for a given entity to a client
        // For instance, entities that are obscured or too far away should not be updated client-side
        return (
            forClient.camera.distance(entity.pos) < gameConfig.renderDistance
        );
    }

    catchUpClient(client: GameClient) {
        // send preliminary data listing existing entities
        const packet = {
            currentEntites: new Array<string>()
        };

        for (const entity of client.world!.entityList) {
            packet.currentEntites.push(entity.id);
        }

        client.sendMessage("welcome", packet);
    }

    syncClient(cycleData: WorldCycleData, world: World, to: GameClient) {
        // send data to the client syncing state information and other stuff
        const entityUpdates = cycleData.entityUpdates;

        const packet = {
            // an update message sent to the client each frame
            // entity state updates
            entityStates: new Map<
                string,
                {
                    id: string; // entity id
                    type: string; // entity type name
                    position: Vector; // entity position
                    state: any; // entity state object for use by entity mechanics
                    mechanics: Mechanics[]; // functions that determine how the entity should behave client-side
                    events: EntityEvent[]; // client side entity events (e.g. "explode" in regards to a grenade entity)
                }
            >(),
            // list of entities that should be created (ids)
            createdEntities: new Array<string>(),
            // list of entities that should be deleted (ids)
            deletedEntities: new Array<string>(),
            // events not belonging to any entity in particular (e.g. "you died")
            gameEvents: cycleData.gameEvents,
            // where the camera should be placed
            camera: to.camera
        };

        // add entity state updates to packet.entityStates

        for (const [entityId, cycleData] of entityUpdates) {
            const entity = world.getEntity(entityId);
            if (this.shouldRenderEntity(entity, to)) {
                packet.entityStates.set(entityId, {
                    id: entityId,
                    type: entity.type.typeName,
                    position: entity.pos,
                    state: cycleData.publishedState,
                    mechanics: cycleData.mechanics,
                    events: cycleData.events
                });
            }
        }

        packet.createdEntities = cycleData.createdEntities;
        packet.deletedEntities = cycleData.deletedEntities;

        packet.gameEvents = cycleData.gameEvents;

        to.sendMessage("update", packet);
    }

    sendMessage(to: GameClient, msg: string, data: any) {
        // send a socket.io message to the socket associated with a gameclient object
        this.clients.get(to.sid)!.socket.emit(msg, data);
    }
}
