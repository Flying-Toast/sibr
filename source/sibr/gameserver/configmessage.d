module sibr.gameserver.configmessage;

import cfg = sibr.config;

///Data class for the clients 'config message' (see architecture/networking.md)
class ConfigMessage {
	immutable string nickname;
	immutable ushort socketID;///The id of the websocket whose configmessage this is.

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
