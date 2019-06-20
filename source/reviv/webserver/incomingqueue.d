module reviv.webserver.incomingqueue;

///A queue of incoming messages from clients.
shared class IncomingQueue {
	private string[][ushort] messages;///The queued messages

	///Checks if there is a message available from the socket `id`.
	bool messageAvailable(ushort id) {
		return (id in messages) && messages[id].length > 0;
	}

	///Adds a message to the queue. `id` is the id of the socket that sent the message.
	void queueMessage(ushort id, string message) {
		messages[id] ~= message;
	}

	///Pops the next message off of {socket}'s queue. {socket} is the socket with the id `id`.
	string nextMessage(ushort id) {
		immutable message = messages[id][0];
		messages[id] = messages[id][1 .. $];
		return message;
	}

	///Removes a socket's queue.
	void removeQueue(ushort id) {
		messages.remove(id);
	}
}
