module reviv.webserver.connectionqueue;

///A queue of sockets that have just connected and are waiting for a game
shared class ConnectionQueue {
	private {
		ushort[] connects;///IDs of sockets that have just connected
	}

	///Tells the master server that a new socket connected so the master can add the socket to a game
	void addConnection(ushort id) {
		connects ~= id;
	}

	///Gets the list of connects and clears the list
	auto getConnections() {
		auto ret = connects;
		connects = [];
		return ret;
	}
}
