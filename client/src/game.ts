import {Network} from "./networking.ts";

export class Game {
    network: Network;
    constructor (network: Network) {
        this.network = network;
    }
}