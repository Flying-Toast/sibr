import * as express from 'express';
import * as socketio from 'socket.io';
import * as http from 'http';
import {netConfig} from './config';
import GameServer from './server';

const app = express();
const httpServer = new http.Server(app);
const io = socketio(httpServer);

httpServer.listen(netConfig.port, function(){
    console.log(`listening on *:${netConfig.port}`);
});

const gameServer = new GameServer(io);
gameServer.initCallbacks();
gameServer.run();