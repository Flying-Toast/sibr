module reviv.webserver.server;

import vibe.vibe;

final class WebServer {
	void getWS(scope WebSocket socket) {
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
