```json
{
    "type": "update",
    "data": [
        "events": <events>
    ]
}
```

# `struct events`
Represented in the JSON object as a string where each character is a value from `\x00` to `\xff`
## `float32[2] movement`

- `movement[0]`
  - Movement on the x axis. Should be -1 to 1, may be analogue if client is using a controller.
- `movement[1]`
  - Movement on the y axis. Different from jumping. Applicable in cases such as dropping down through platforms or climbing laders

## `uint8[2] triggers`
- `triggers[0]`
  - Whether the user has pressed down the jump button this frame. Either 0 or 1
- `triggers[1]`
  - Whether the the fire button is being pressed. Either 0 or 1


## `float32[2] looking`

A 2D vector representing the direction in which the player is aiming.
Equivalent to `[cos(theta), sin(theta)]` where theta is the angle.

## `float32 deltaTime`

