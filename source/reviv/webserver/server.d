module reviv.webserver.server;

import vibe.vibe;
import reviv.webserver.queues;

final class WebServer {
	private ushort lastSocketID;///The id of the last socket. Incremented each time a new socket connects.

	void getWS(scope WebSocket socket) {
		auto socketID = lastSocketID++;

		//Send queued outgoing messages
		auto sender = runTask({
			while (socket.connected) {
				outQueue.waitForSend();
				while (outQueue.messageAvailable(socketID)) {
					socket.send(outQueue.nextMessage(socketID));
				}
			}
		});

		bool connected = false;
		//Add received messages to the incoming queue
		while (socket.waitForData()) {
			inQueue.queueMessage(socketID, socket.receiveText());
			if (!connected) {
				connectionQueue.addConnection(socketID);
				connected = true;
			}
		}

		sender.join();
	}

	static void errorPage(HTTPServerRequest req, HTTPServerResponse res, HTTPServerErrorInfo err) {
		import std.conv : to;
		res.contentType = "text/html";
		res.writeBody(err.code.to!string);
	}
}

void runWebServer() {
	auto settings = new HTTPServerSettings;
	settings.port = 8080;
	settings.errorPageHandler = toDelegate(&WebServer.errorPage);

	auto router = new URLRouter;
	router.registerWebInterface(new WebServer);
	router.get("*", serveStaticFiles("public/"));

	listenHTTP(settings, router);
	runApplication();
}
