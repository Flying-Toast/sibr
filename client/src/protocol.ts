/*
    A module with functions for unpacking/building the json
    structures defining client/server communications
    as they are described in the architecture specs.

    i.e.

    A module handling the data structures in the network specs
*/

import { Vector } from "./util";

export function bufferToString (buffer: ArrayBuffer): string {
    return new TextDecoder("utf-8").decode(new Uint8Array(buffer));
}

// Build the data.events field for a client update packet
export function buildEventString(movement: Vector, looking: Vector, jumping: boolean, firing: boolean): string {
    const event = struct("ffBBffi");
    const buffer = event.pack(movement.x, movement.y, jumping, firing, looking.x, looking.y);
    return bufferToString(buffer);
}
