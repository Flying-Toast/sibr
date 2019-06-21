module sibr.gameserver.player;

import cfg = sibr.config;

/**
When a client connects, the first message that they send to the server is a config message with options about their player.
The config message needs these properties:
```JSON
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
