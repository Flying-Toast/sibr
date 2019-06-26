module sibr.gameserver.component;

import std.meta;

alias ComponentTypes = AliasSeq!(NicknameC, NetworkC);///All component types

alias ClientComponentTypes = Filter!(isClientComponent, ComponentTypes);///Components that clients see
private template isClientComponent(T) {
	import std.traits;
	enum isClientComponent = hasUDA!(T, clientVisible);
}
private enum clientVisible;///Used as an attribute to mark a component as being visible to clients.


class NetworkC {
	immutable ushort socketID;

	this(ushort socketID) {
		this.socketID = socketID;
	}
}

@clientVisible
class NicknameC {
	immutable string nickname;

	this(string nickname) {
		this.nickname = nickname;
	}
}
