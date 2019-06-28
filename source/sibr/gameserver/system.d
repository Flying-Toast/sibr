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

	private {
		long lastUpdate;///Timestamp that the last update message was sent
	}

	///full - the state of *all* clientVisible components. diff - The state of *changed* cleintVisible components
	private enum stateType {
		full,
		diff
	}

	/**
		Gets the stringified-JSON state of clientVisible components.

		Params:
			type = whether to get the full state (for welcome message), or the changed states (for normal update message).
	*/
	private string getState(stateType type)() {
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

		return JSONValue(state).toString();
	}

	///Sends a 'welcome message' (see architecture/networking.md) to the socket `socketID`.
	private void sendWelcomeMessage(ushort socketID) {
		import sibr.webserver.queues;

		string message = `{"type":"welcome","data":`~getState!(stateType.full)~`}`;

		outQueue.queueMessage(socketID, message);
	}

	///Gets a JSON string for sending to clients in update messages
	private string getUpdateMessage() {
		immutable state = getState!(stateType.diff);
		if (state == "{}") {
			return null;
		}
		return `{"type":"update","data":`~state~`}`;
	}

	override void tick(long dt) {
		immutable currentTime = millis();
		//whether an update message gets sent this tick:
		bool shouldSendUpdate = (currentTime - lastUpdate) >= cfg.messageSendInterval;
		string updateMessage;
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
