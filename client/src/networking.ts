/*
    A module handling socket communications between client and server
*/
var msgpack = require("msgpack-lite");

interface Callback {        // Defines a type for Typescript that signifies roughly Map<string, Function>
    [K: string]: Function;
}

export class Network {
    socket: WebSocket;      // The native websocket instance
    url: string;            // The url of the websocket server
    socketReady = false;    // Whether the socket has connected or not

    onReady: Function;      // Callback for when the socket connects
    onUpdate: Function;     // Callback for a game update

    // Callbacks on a WebSocket message for a given JSON .type value
    tempCallbacks: Callback = {};     // callbacks that are meant to be called only once
    messageCallbacks: Callback = {};  // regular callbacks

    constructor (url: string) {
        this.url = url;
    }

    connect() {
        this.socket = new WebSocket(this.url);
        this.socket.addEventListener('open', function (event: any) {
            this.socketReady = true;
            this.onReady();
        }.bind(this));
        this.socket.onmessage = this.handleSocketMessage.bind(this);
    }
    
    async handleSocketMessage(event: MessageEvent) {
        const msg = event.data;
        const array = await new Response(msg).arrayBuffer();
        console.log(array);
        const data = msgpack.decode(array);
        const type = data.type;

        if (this.tempCallbacks[type]) {
            this.tempCallbacks[type](data);
            delete this.tempCallbacks[type];
        }

        if (this.messageCallbacks[type]) {
            this.messageCallbacks[type](data);
        }
    }

    send(data: any) {
        this.socket.send(msgpack.encode(data));
    }

    setCallback(type: string, cb: Function) {
        this.messageCallbacks[type] = cb;
    }

    setTempCallback(type: string, cb: Function) {
        this.tempCallbacks[type] = cb;
    }

    async waitFor(responseType: string) {
        const promise = new Promise(function(resolve: Function, reject: Function) {
            this.setTempCallback(responseType, function(data: any) {
                resolve(data)
            });
        }.bind(this));

        return promise;
    }
    async startGame(nickname: string) {
        this.send({nickname: nickname});
        console.log("waiting...")
        const response = await this.waitFor("welcome");
        console.log("hmmm");
        console.log(response);
    }
}
