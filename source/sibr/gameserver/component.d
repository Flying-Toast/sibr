module sibr.gameserver.component;

import std.meta;
import painlessjson;

alias ComponentTypes = AliasSeq!(NicknameC, NetworkC);///All component types

alias ClientComponentTypes = Filter!(isClientComponent, ComponentTypes);///Components that clients see
private template isClientComponent(T) {
	import std.traits;
	enum isClientComponent = hasUDA!(T, clientVisible);
	static if (isClientComponent) {
		static assert(is(typeof(T.lastJSONHash) == size_t), "clientComponent does not have a `size_t lastJSONHash` property");
		static assert(!hasStaticMember!(T, "lastJSONHash"), "clientComponent's `lastJSONHash` property shouldn't be static");
		static assert(hasUDA!(T.lastJSONHash, SerializeIgnore), "clientComponent's `lastJSONHash` property doesn't have @SerializeIgnore attribute");
	}
}
private enum clientVisible;///Used as an attribute to mark a component as being visible to clients.


class NetworkC {
	enum ConnectionState {
		justConnected,
		welcomed
	}
	ConnectionState state;
	immutable ushort socketID;

	this(ushort socketID) {
		this.socketID = socketID;
		state = ConnectionState.justConnected;
	}
}

@clientVisible
class NicknameC {
	@SerializeIgnore size_t lastJSONHash;

	//component-specific properties:
	immutable string nickname;

	this(string nickname) {
		this.nickname = nickname;
	}
}
