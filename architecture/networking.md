# Network architecture

## Details
- All communication is done via websockets.
- All messages are in JSON format.
- A single websocket connection only lasts for a single game. The frontend opens the websocket when the user clicks 'play', and  the connection is closed when the game ends (or when the player dies).
- It is the server's job to close websocket connections. The only case where a connection could be closed by the frontend is if the player closes the browser tab mid-game.
- When the server closes the websocket, it means that the player has died. The frontend should then act accordingly (e.g displaying "you died", hiding the game & showing the main menu, etc).
- If at any point the client sends an invalid message (e.g. the message is not valid JSON, or is missing some required JSON properties), the server will ignore it (if a message is ignored, the server will log an error stating that a message was ignored). If the 'configuration message' is invalid, the server will close the websocket connection.

## API
Websockets connect to the url `ws://<hostname>/ws`.

---

All messages sent by the server follow this format:
<!-- The code here is actually JSON, but javascript highlighting is used to allow comments -->
```JavaScript
{
	"type": <string>,
	"data": {
		/*...the message's data...*/
	}
}
```
`type` represents what type of message this is. Depending on the type, `data` can contain different properties.

---

When the client opens a websocket, the first message that it sends to the server is a 'configuration message'. The configuration message contains information that the server uses to create a player (for example: the user's nickname, or a 'game code' if playing in party mode)

The configuration message is in this format:
```JSON
{
	"nickname": <string>
}
```
properties:<br>
`nickname`: the nickname that the user has chosen.

---

Once the server receives the configuration message, it replies with a 'welcome message'. The purpose of the welcome message is to inform the client of the current game state and prepare the client for the incoming "update" messages.
<!-- The code here is actually JSON, but javascript highlighting is used to allow comments -->
```JavaScript
{
	"type": "welcome",
	"data": {
		//<entity state data> (see architecture/gamestate.md)
	}
}
```

---

After this, the server then begins the normal update loop. During this loop, the server sends game updates every few milliseconds. The game updates are in this format:
<!-- The code here is actually JSON, but javascript highlighting is used to allow comments -->
```JavaScript
{
	"type": "update",
	"data": {
		//<entity state data> (see architecture/gamestate.md)
	}
}
```