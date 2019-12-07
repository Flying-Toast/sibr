import Player from "./game/components/player";
import World from "./core/world";
import GameServer from "./server";
import Vector from "./core/vector";

export default class GameClient {
    socket: SocketIO.Socket;
    gameServer: GameServer;
    sid: string;
    player?: Player;
    world?: World;
    camera = new Vector(0,0);

    constructor (socket: SocketIO.Socket, gameServer: GameServer) {
        this.socket = socket;
        this.sid = socket.id;
        this.gameServer = gameServer;
    }

    bindToWorld(world: World) {
        this.world = world;
    }

    sendMessage(msg: string, data: any) {
        this.gameServer.sendMessage(this, msg, data);
    }
}