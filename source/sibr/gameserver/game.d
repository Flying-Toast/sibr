module sibr.gameserver.game;

class Game {
	///Whether or not this Game can accept new players
	bool joinable() {
		return true;
	}

	///Sends a 'welcome message' (see architecture/networking.md) to the socket `socketID`.
	void sendWelcomeMessage(ushort socketID) {
		import sibr.webserver.queues;
		import std.json;

		JSONValue messageJSON = JSONValue();
		messageJSON["type"] = "welcome";
		JSONValue messageDataJSON = JSONValue();
		messageDataJSON["yourID"] = socketID;
		messageDataJSON["state"] = JSONValue(["api_to_be_determined": "api_to_be_determined"]);//TODO: this should be: `messageDataJSON["state"] = this.generateInitialState()`
		messageJSON["data"] = messageDataJSON;

		string message = messageJSON.toString();

		outQueue.queueMessage(socketID, message);
	}
}
