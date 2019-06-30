module sibr.gameserver.system;

import std.meta;
import sibr.gameserver.entitymanager;
import sibr.gameserver.component;
import sibr.gameserver.utils;
import cfg = sibr.config;

private alias Systems = AliasSeq!(NetworkSystem);///All systems. Update this when a new system is implemented

System[] createSystems(EntityManager entityManager) {
	System[] systems;
	static foreach (alias T; Systems) {
		systems ~= new T(entityManager);
	}
	return systems;
}

abstract class System {
	protected {
		EntityManager entityManager;
	}

	abstract void tick(long dt);
}


class NetworkSystem : System {
	import std.json;
	import painlessjson;
	import msgpack;

	private {
		long lastUpdate;///Timestamp that the last update message was sent
	}

	///full - the state of *all* clientVisible components. diff - The state of *changed* cleintVisible components
	private enum stateType {
		full,
		diff
	}

	/**
		Gets the JSON state of clientVisible components.

		Params:
			type = whether to get the full state (for welcome message), or the changed states (for normal update message).
	*/
	private JSONValue getState(stateType type)() {
		import std.conv : to;
		import std.traits : fullyQualifiedName;
		import std.string : split;

		JSONValue[string][string] state;

		static foreach (T; ClientComponentTypes) {
			foreach (id, c; entityManager.getComponents!T) if (c !is null) {
				enum componentName = fullyQualifiedName!(T).split(".")[$-1][0 .. $-1];
				JSONValue componentJSON = c.toJSON();

				static if (type == stateType.full) {
					state[id.to!string][componentName] = componentJSON;
				} else {
					immutable JSONHash = componentJSON.toString().hashOf();
					if (JSONHash != c.lastJSONHash) {
						state[id.to!string][componentName] = componentJSON;
						c.lastJSONHash = JSONHash;
					}
				}
			}
		}

		return JSONValue(state);
	}

	///Sends a 'welcome message' (see architecture/networking.md) to the socket `socketID`.
	private void sendWelcomeMessage(ushort socketID) {
		import sibr.webserver.queues;

		JSONValue messageJSON = JSONValue();
		messageJSON["type"] = "welcome";
		messageJSON["data"] = getState!(stateType.full);

		ubyte[] message = fromJSONValue(messageJSON).pack();

		outQueue.queueMessage(socketID, message);
	}

	///Gets a msgpacked update for sending to clients in update messages
	private ubyte[] getUpdateMessage() {
		immutable state = getState!(stateType.diff);
		if (state.toString() == "{}") {
			return null;
		}

		JSONValue messageJSON = JSONValue();
		messageJSON["type"] = "update";
		messageJSON["data"] = state;

		return fromJSONValue(messageJSON).pack();
	}

	override void tick(long dt) {
		immutable currentTime = millis();
		//whether an update message gets sent this tick:
		bool shouldSendUpdate = (currentTime - lastUpdate) >= cfg.clientUpdateInterval;
		ubyte[] updateMessage;
		if (shouldSendUpdate) {
			updateMessage = getUpdateMessage();
			shouldSendUpdate = shouldSendUpdate && (updateMessage !is null);
		}

		foreach (c; entityManager.getComponents!NetworkC) if (c !is null) {
			if (c.state == c.ConnectionState.justConnected) {
				sendWelcomeMessage(c.socketID);
				c.state = c.ConnectionState.welcomed;
			} else if (c.state == c.ConnectionState.welcomed && shouldSendUpdate) {
				import sibr.webserver.queues;
				outQueue.queueMessage(c.socketID, updateMessage);
			}
		}

		if (shouldSendUpdate) {
			lastUpdate = currentTime;
		}
	}

	this(EntityManager entityManager) {
		this.entityManager = entityManager;
	}
}
