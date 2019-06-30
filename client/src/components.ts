import { Vector } from "./util";
import { Entity } from "./entity";

export class Component {
    // Name of the component
    name: string;

    // A reference to the parent entity
    entity: Entity;
    /*
        Update state using the values sent by the server
        If the structure of the component state differs
        from that of the data being sent, this method
        must be overriden. See Location.setState for an example
    */
    setState(data: any) {
        // naive method of setting fields using a key/value object
        for (const field in data) {
            (<any> this)[field] = data[field]; // very unidomatic but shhhh
        }
    }
    
    // Should be overwritten to run each frame
    onUpdate() {

    }
}
export class Location extends Component {
    pos: Vector;
    name = "Location";

    setState(data: any) {
        this.pos = new Vector(data.x, data.y);
    }
}
export class Velocity extends Component {
    vx: number;
    vy: number;
    name = "Velocity";
}

const componentTypes = [Location, Velocity];

export function componentTypeFromName(name: string) {
    // will optimize later
    for (const type of componentTypes) {
        if (type.prototype.name == name) { // i have no idea if this is correct, i'm on the highway and can't look it up
            return type;
        }
    }
    return null;
}