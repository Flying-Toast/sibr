```ts
const inputs = new InputManager(window);

function gameUpdate() {
    const keyEvents = inputs.pollKeys();
    const mouseEvents = inputs.pollMouse();
    if (keyEvents.get("w").down) {
        // w key has just been pressed
    }
    if (keyEvents.get("w").held) {
        // w key has is pressed
    }
    if (keyEvents.get("w").up) {
        // w key has just been released
    }

    if (mouseEvents.get("mouseLeft").click) {
        // the left mouse button has been clicked
    }
}
```

## Notes:

`InputManager.poll()` should only be called once per event cycle / frame
