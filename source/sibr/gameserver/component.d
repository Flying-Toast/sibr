module sibr.gameserver.component;

import std.meta;
import painlessjson;

alias ComponentTypes = AliasSeq!(NicknameC, NetworkC, LocationC, ItemDropC, InputC, SpriteRendererC);///All component types

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

class InputC {
	import sibr.gameserver.inputsystem;
	Input[] inputs;
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
class LocationC {
	@SerializeIgnore size_t lastJSONHash;

	float x;
	float y;

	this(float x, float y) {
		this.x = x;
		this.y = y;
	}
}

//Data class - NOT a component
class Item {
	string name;

	this(string name) {
		this.name = name;
	}
}

@clientVisible
class ItemDropC {
	@SerializeIgnore size_t lastJSONHash;

	Item item;

	this(Item item) {
		this.item = item;
	}
}

@clientVisible
class SpriteRendererC {
	@SerializeIgnore size_t lastJSONHash;

	string spriteName;
	float[3] tint;
	float[2] anchor;

	this(string spriteName, float[3] tint = [1, 1, 1], float[2] anchor = [0.5, 0.5]) {
		this.spriteName = spriteName;
		this.tint = tint;
		this.anchor = anchor;
	}
}
