module sibr.gameserver.game;

import sibr.gameserver.configmessage;
import sibr.gameserver.entitymanager;

class Game {
	private {
		EntityManager entityManager;
	}

	void tick() {

	}

	///Whether or not this Game can accept new players
	bool joinable() {
		return true;//TODO: implement
	}

	///Add a new client to the game
	void clientJoin(ConfigMessage config) {
		//TODO: add the client to the game
		sendWelcomeMessage(config.socketID);
	}

	///Sends a 'welcome message' (see architecture/networking.md) to the socket `socketID`.
	//TODO: this function should probably be in 'network' system, and socketID should probably be in a 'networkable' component
	private void sendWelcomeMessage(ushort socketID) {
		import sibr.webserver.queues;
		import std.json;

		JSONValue messageJSON = JSONValue(["type": "welcome"]);
		JSONValue dataJSON = JSONValue();
		dataJSON["state"] = JSONValue(["api_to_be_determined": "api_to_be_determined"]);//TODO: API (and this whole function should be in a 'network' system)
		messageJSON["data"] = dataJSON;

		string message = messageJSON.toString();

		outQueue.queueMessage(socketID, message);
	}

	this() {
		entityManager = new EntityManager;
	}
}
