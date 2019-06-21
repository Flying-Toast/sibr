module sibr.gameserver.player;

import cfg = sibr.config;

/**
The client's options for the player

When a client connects, the first message that they send to the server is a config message.
The config message contains the things like:
	the client's nickname
	party id (if playing in team/party mode) (not implemented yet)
	etc.

The config message needs these properties:
```
{
	"nickname": "<player name>"
}
```
*/
class PlayerConfig {
	immutable string nickname;
	immutable ushort socketID;///The id of the websocket connected to this player

	this(string configJSON, ushort id) {
		import std.json;
		import std.string : strip;

		socketID = id;

		auto settings = parseJSON(configJSON);

		string name = settings["nickname"].str.strip();
		if (name == "") {
			name = cfg.defaultNickname;
		} else if (name.length > cfg.maxNicknameLength) {
			name = name[0 .. cfg.maxNicknameLength];
		}
		nickname = name;
	}
}
