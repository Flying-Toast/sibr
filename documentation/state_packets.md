# Game State architecture

## Details
- The server sends game state updates at a fixed interval (set in source/sibr/config.d).
- Game state updates do not necessarily contain the entire state of the game. Rather, they just contain the information that has *changed* since the last update. Therefore, it is up to the frontend to store the current game state and apply the update's changes to it.
- Because updates don't contain the entire game state, new clients first need some way of getting the whole state. This is done using the 'welcome message' (see networking architecture). The welcome mesage describes the current game state, to which changes described in the following updates will be applied.

## Entity state data
The backend sends the state of all game entities to the client. Every entity contains 'components' that each describe a certain aspect of that entity.

An example of a 'welcome message' (see networking architecture), which contains entity state data:
<!-- The code here is actually JSON, but javascript highlighting is used to allow comments -->
```JavaScript
{
	"type": "welcome",
	"data": {
		"3": { /*3 is the entity id*/
			"Nickname": {//a Nickname component
				"nickname": "Shooty McShootyface"
			},
			"Location": {//a Location component
				"x": 12,
				"y": 7
			}
		},
		"17": {//another entity (this one has the id 17)
			"Location": {//a Location component
				"x": 75,
				"y": 12
			},
			"Velocity": {//a Velocity component
				"vx": 1.7,
				"vy": -3
			}
		}
	},
	"you": 3//the entity id of the client's player
}
```

This welcome message contains the state of 2 different entities (in reality, a welcome message would probably have more than 2 entites, because welcome messages contain the state of *every* entity in the game).

The 2 entities in this message have the IDs 3 and 17 (every property of `data` is an entity id). The value of each of these properties is a JSON object containing all of the components which that entity has.

The `you` property informs the client of which player is theirs (i.e. the entity id of the client's player).

---

The `welcome` message contains every single entity and component, but `update` messages only contain components that have changed. since the last update.<br>
Example:<br>
Assuming the client has just received the welcome message above, let's say the next `update` message looks like this:
```JSON
{
	"type": "update",
	"data": {
		"3": {
			"Location": {
				"x": 15,
				"y": 7
			}
		}
	}
}
```

This would mean that entity 17 hasn't changed since the last message, but entity 3 got a new `Location` component. The `Nickname` component on entity 3 also hasn't changed since the last message.

---

## All currently implemented components:

---

### `Nickname`

A component that gives a nickname to it's parent entity (e.g. for players).

<!-- The code here is actually JSON, but javascript highlighting displays better -->
```JavaScript
"Nickname": {
	"nickname": <string>
}
```

---

### `Location`

```JavaScript
"Location": {
	"x": <float>,
	"y": <float>
}
```

---

### `ItemDrop`

A dropped item, for example, a gun on the ground that can be picked up.

```JavaScript
"ItemDrop": {
	"item": <Item (data class, see gameserver/component.d)>
}
```

---

### `Render`
Contains information that the client uses for rendering.

```JavaScript
"Render": {
	"spriteName": <string>,
	"tint": <uint8[3]>
}
```

---
### `Collision`
Contains information that the client uses for rendering.

```JavaScript
"Render": {
	"c": <Collidable (non-component class, see gameserver/geometry.d)>
}
```

---
### `Velocity`

```JavaScript
"Velocity": {
	"x": <float>,
	"y": <float>
}
```

---