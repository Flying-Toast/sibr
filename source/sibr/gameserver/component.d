module sibr.gameserver.component;

import vibe.vibe : ignore;
import std.meta;

alias ComponentTypes = AliasSeq!(NicknameC, NetworkC);///All component types

alias ClientComponentTypes = Filter!(isClientComponent, ComponentTypes);///Components that clients see
private template isClientComponent(T) {
	import std.traits;
	enum isClientComponent = hasUDA!(T, clientVisible);
	static if (isClientComponent) {
		import vibe.vibe : IgnoreAttribute;
		static assert(is(typeof(T.lastJSONHash) == size_t), "clientComponent does not have a `size_t lastJSONHash` property");
		static assert(!hasStaticMember!(T, "lastJSONHash"), "clientComponent's `lastJSONHash` property shouldn't be static");
		static assert(hasUDA!(T.lastJSONHash, IgnoreAttribute), "clientComponent's `lastJSONHash` property doesn't have @ignore attribute");
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
	@ignore size_t lastJSONHash;

	//component-specific properties:
	immutable string nickname;

	this(string nickname) {
		this.nickname = nickname;
	}
}
