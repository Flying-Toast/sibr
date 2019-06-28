module sibr.gameserver.component;

import std.meta;
import painlessjson;

alias ComponentTypes = AliasSeq!(NicknameC, NetworkC, ItemC, UsableC);///All component types

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

@clientVisible
class ItemC {
	@SerializeIgnore size_t lastJSONHash;

	immutable string type;///What kind of item this is
	immutable string name;///The name of the item

	this(string type, string name) {
		this.type = type;
		this.name = name;
	}
}

///A consumable thing
@clientVisible
class UsableC {
	@SerializeIgnore size_t lastJSONHash;

	ItemC item;
	ushort amount;///how many times it can be consumed

	this(ItemC item, ushort amount) {
		this.item = item;
		this.amount = amount;
	}
}
