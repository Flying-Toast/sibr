///Global in/out queues
module reviv.webserver.queues;

import reviv.webserver.incomingqueue;
import reviv.webserver.outgoingqueue;
import reviv.webserver.connectionqueue;

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
