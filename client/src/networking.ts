export class Network {
    socket: WebSocket;
    url: string;
    socketReady = false;

    onReady: Function;

    constructor (url: string) {
        this.url = url;
        this.socket = new WebSocket(url);
        this.socket.addEventListener('open', function (event: any) {
            this.socketReady = true;
            this.onReady();
        }.bind(this));
    }
    
    send(data: any) {
        this.socket.send(JSON.stringify(data));
    }
    async waitFor(responseType: string) {
        const promise = new Promise(function(resolve: Function, reject: Function) {
            this.socket.addEventListener("message", function(event: any) {
                const data = JSON.parse(event.data);
                if (data.type == responseType) {
                    resolve(data);
                }
            });
        }.bind(this));
        
        return promise;
    }
    async startGame(nickname: string) {
        this.send({nickname: nickname});
        const response = await this.waitFor("welcome");
        console.log(response);
    }
}