module sibr.webserver.outgoingqueue;

import vibe.vibe;
import sibr.webserver.incomingqueue;

///A queue of outgoing messages to clients.
shared class OutgoingQueue : IncomingQueue {
	private ManualEvent sendEvent;

	///sends all the queued messages
	void sendMessages() {
		sendEvent.emit();
	}

	void waitForSend() {
		sendEvent.wait(sendEvent.emitCount);
	}

	this() {
		sendEvent = createSharedManualEvent();
	}
}
