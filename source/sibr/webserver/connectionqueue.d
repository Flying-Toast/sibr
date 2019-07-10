module sibr.webserver.connectionqueue;

import sibr.webserver.incomingqueue;

///A queue of sockets that have just connected and are waiting for a game
shared class ConnectionQueue {
	private {
		socketID_t[] connects;///IDs of sockets that have just connected
	}

	///Tells the master server that a new socket connected so the master can add the socket to a game
	void addConnection(socketID_t id) {
		connects ~= id;
	}

	///Gets the list of connects and clears the list
	auto getConnections() {
		auto ret = connects;
		connects = [];
		return ret;
	}
}
