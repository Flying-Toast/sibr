import reviv.webserver.server;

import std.concurrency;
import reviv.gameserver.masterserver : runGame;

void main() {
	spawn(&runGame);
	runWebServer();
}
