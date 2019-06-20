import sibr.webserver.server;

import std.concurrency;
import sibr.gameserver.masterserver : runGame;

void main() {
	spawn(&runGame);
	runWebServer();
}
