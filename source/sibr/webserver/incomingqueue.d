module sibr.webserver.incomingqueue;

private alias messageType_t = ubyte[];
alias socketID_t = ushort;

///A queue of incoming messages from clients.
shared class IncomingQueue {
	private messageType_t[][socketID_t] messages;///The queued messages

	///Checks if there is a message available from the socket `id`.
	bool messageAvailable(socketID_t id) {
		return (id in messages) && messages[id].length > 0;
	}

	///Adds a message to the queue. `id` is the id of the socket that sent the message.
	void queueMessage(socketID_t id, messageType_t message) {
		messages[id] ~= cast(shared) message;
	}

	///Pops the next message off of {socket}'s queue. {socket} is the socket with the id `id`.
	messageType_t nextMessage(socketID_t id) {
		auto message = messages[id][0];
		messages[id] = messages[id][1 .. $];
		return cast(messageType_t) message;
	}

	///Removes a socket's queue.
	void removeQueue(socketID_t id) {
		messages.remove(id);
	}
}
