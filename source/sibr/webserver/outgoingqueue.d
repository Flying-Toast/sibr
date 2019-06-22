module sibr.webserver.outgoingqueue;

import vibe.vibe;
import sibr.webserver.incomingqueue;

///A queue of outgoing messages to clients.
shared class OutgoingQueue : IncomingQueue {
	private {
		ManualEvent sendEvent;
		long m_lastSend;///timestamp the queue was last sent
	}

	long lastSend() {
		return m_lastSend;
	}

	///sends all the queued messages
	void sendMessages() {
		import sibr.gameserver.utils;

		sendEvent.emit();
		m_lastSend = millis();
	}

	void waitForSend() {
		sendEvent.wait(sendEvent.emitCount);
	}

	this() {
		sendEvent = createSharedManualEvent();
	}
}
