module sibr.gameserver.system;

import std.meta;
import sibr.gameserver.entitymanager;
import sibr.gameserver.component;

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
	///Sends a 'welcome message' (see architecture/networking.md) to the socket `socketID`.
	private void sendWelcomeMessage(ushort socketID) {
		import sibr.webserver.queues;

		string message = `{"type":"welcome","data":{"API_TBD":"API_TBD"}}`;//TODO: serialize components

		outQueue.queueMessage(socketID, message);
	}

	override void tick(long dt) {
		foreach (c; entityManager.getComponents!NetworkC) if (c !is null) {
			if (c.state == c.ConnectionState.justConnected) {
				sendWelcomeMessage(c.socketID);
				c.state = c.ConnectionState.welcomed;
			}
		}
	}

	this(EntityManager entityManager) {
		this.entityManager = entityManager;
	}
}
