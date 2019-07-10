module sibr.gameserver.configmessage;

import cfg = sibr.config;
import sibr.webserver.incomingqueue;

///Data class for the clients 'config message' (see architecture/networking.md)
class ConfigMessage {
	immutable string nickname;
	immutable socketID_t socketID;///The id of the websocket whose configmessage this is.

	this(string name, socketID_t id) {
		import std.string : strip;

		socketID = id;

		name = name.strip();
		if (name == "") {
			name = cfg.defaultNickname;
		} else if (name.length > cfg.maxNicknameLength) {
			name = name[0 .. cfg.maxNicknameLength];
		}

		nickname = name;
	}
}
