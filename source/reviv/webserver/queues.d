///Global in/out queues
module reviv.webserver.queues;

import reviv.webserver.incomingqueue;
import reviv.webserver.outgoingqueue;

shared {
	IncomingQueue inQueue;
	OutgoingQueue outQueue;
}

shared static this() {
	inQueue = new IncomingQueue;
	outQueue = new shared(OutgoingQueue);
}
