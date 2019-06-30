class InputState {
    down = false;
    held = false;
    up = false;
}

class InputMap {
    inputStates: {[key:string]:InputState} = {}
    get(inputName: string): InputState {
        if (this.inputStates[inputName] != undefined) {
            return this.inputStates[inputName];
        }
        return new InputState();
    }
    clone(): InputMap {
        const clone = new InputMap();
        for (const key in this.inputStates) {
            const state = this.inputStates[key];
            const cloneState = new InputState();
            cloneState.down = state.down;
            cloneState.held = state.held;
            cloneState.up = state.up;
            clone.inputStates[key] = cloneState;
        }
        return clone;
    }
}

export class InputManager {
    targetElement: HTMLElement;
    keysPressed = new InputMap();
    mouseButtons = new InputMap();

    mouseButtonNames: {[key:number]:string} = {
        0: "mouseLeft",
        1: "mouseMiddle",
        2: "mouseRight"
    }


    constructor (attachTo: HTMLElement) {
        this.targetElement = attachTo;
        this.targetElement.addEventListener("keydown", this.onKeyDown.bind(this));
        this.targetElement.addEventListener("keyup", this.onKeyUp.bind(this));
        this.targetElement.addEventListener("mousedown", this.onMouseDown.bind(this));
        this.targetElement.addEventListener("mouseup", this.onMouseUp.bind(this));
    }

    onKeyDown(event: KeyboardEvent) {
        const state = this.keysPressed.get(event.key);
        state.down = true;
        state.held = true;
    }

    onKeyUp(event: KeyboardEvent) {
        const state = this.keysPressed.get(event.key);
        state.down = false;
        state.held = false;
        state.up = true;
    }

    onMouseDown(event: MouseEvent) {
        const state = this.keysPressed.get(this.mouseButtonNames[event.button]);
        state.down = true;
        state.held = true;
    }

    onMouseUp(event: MouseEvent) {
        const state = this.keysPressed.get(this.mouseButtonNames[event.button]);
        state.down = false;
        state.held = false;
        state.up = true;
    }
    
    _poll (inputMap: InputMap): InputMap { // Read and update input states
        const clone = inputMap.clone();
    
        for (const key in inputMap.inputStates) {
            const state = inputMap.get(key);
            // Make sure the "down" state is only active for one poll call

            if (state.down) {
                state.down = false;
            }
            if (state.up) {
                state.up = false;
            }
        }
        return clone;
    }

    pollKeys(): InputMap {
        return this._poll(this.keysPressed);
    }

    pollMice(): InputMap {
        return this._poll(this.mouseButtons);
    }
}