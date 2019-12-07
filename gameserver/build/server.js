"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("./client");
const config_1 = require("./config");
class GameServer {
    constructor(io) {
        this.worlds = [];
        this.clients = new Map();
        this.io = io;
    }
    get clientList() {
        return Array.from(this.clients.values());
    }
    initCallbacks() {
        this.io.on("connection", function (socket) {
            console.log(`a user connected with sid ${socket.id}`);
            this.addClient(socket);
        });
    }
    addClient(socket) {
        this.clients.set(socket.id, new client_1.default(socket, this));
    }
    addWorld(world) {
        world.onCreate();
    }
    async run() {
        while (true) {
            for (const world of this.worlds) {
                await this.runUpdateForWorld(world);
            }
        }
    }
    async runUpdateForWorld(world) {
        // server tick a world
        const cycleData = await world.onUpdate();
        for (const client of this.getClientsForWorld(world)) {
            this.syncClient(cycleData, world, client);
        }
    }
    shouldRenderEntity(entity, forClient) {
        // Return true if state updates should be sent for a given entity to a client
        // For instance, entities that are obscured or too far away should not be updated client-side
        return (forClient.camera.distance(entity.pos) < config_1.gameConfig.renderDistance);
    }
    syncClient(cycleData, world, to) {
        // send data to the client syncing state information and other stuff
        const entityUpdates = cycleData.entityUpdates;
        const packet = {
            // entity state updates
            entityStates: new Map(),
            // new entities and how they should be handled
            createdEntities: new Array(),
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
                    type: entity.type.name,
                    position: entity.pos,
                    state: cycleData.publishedState,
                    mechanics: cycleData.mechanics,
                    events: cycleData.events
                });
            }
        }
        packet.createdEntities = cycleData.createdEntities;
        packet.gameEvents = cycleData.gameEvents;
        to.sendMessage('update', packet);
    }
    sendMessage(to, msg, data) {
        // send a socket.io message to the socket associated with a gameclient object
        this.clients.get(to.sid).socket.emit(msg, data);
    }
    getClientsForWorld(world) {
        return this.clientList.filter(client => {
            client.world === world;
        });
    }
}
exports.default = GameServer;
//# sourceMappingURL=server.js.map