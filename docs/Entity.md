## Server update packet
```json
{
    "entityStates": {
        "110": {
            "id": 100,
            ...
        }
    },
    "createdEntities": {
        "110": 0,
        "190": 1
    },
    "gameEvents": [
        "shake_camera"
    ],
    "camera": {
        "x": 0,
        "y": 0
    }
}
```

## Detailed example of an Entity state update packet
```json
{
    "id": "424",
    "type": "thrown_grenade",
    "position": [
        50.2,
        -1.3
    ],
    "state": {
        "velocity": [ 
            3,
            -10
        ],
        "animationType": "grenade_fuse"

    },
    "mechanics": [
        "client-side-velocity",
        "animated"
    ],
    "events": [
        "explode"
    ]
}
```