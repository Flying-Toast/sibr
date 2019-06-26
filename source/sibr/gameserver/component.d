module sibr.gameserver.component;

import std.meta : AliasSeq;

alias ComponentTypes = AliasSeq!(NicknameC, NetworkC);

class NetworkC {
	immutable ushort socketID;

	this(ushort socketID) {
		this.socketID = socketID;
	}
}

class NicknameC {
	immutable string nickname;

	this(string nickname) {
		this.nickname = nickname;
	}
}
