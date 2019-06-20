///Global in/out queues
module sibr.webserver.queues;

import sibr.webserver.incomingqueue;
import sibr.webserver.outgoingqueue;
import sibr.webserver.connectionqueue;

shared {
	IncomingQueue inQueue;
	OutgoingQueue outQueue;
	ConnectionQueue connectionQueue;
}

shared static this() {
	inQueue = new IncomingQueue;
	outQueue = new shared(OutgoingQueue);
	connectionQueue = new ConnectionQueue;
}
