module reviv.gameserver.masterserver;

import reviv.gameserver.game;

///Holds all the currently running games
class MasterServer {
	private {
		Game[] games;
	}

	/**
		Finds an available Game (one that has room for more players).
		If there are no Games available, a new one is created.
	*/
	Game getAvailableGame() {
		foreach (game; games) {
			if (game.joinable) {
				return game;
			}
		}

		return addGame();
	}

	/**
		Creates a new Game and adds it to the master.

		Returns: the newly created Game.
	*/
	private Game addGame() {
		auto game = new Game;
		games ~= game;
		return game;
	}
}


///Starts the master game.
void runGame() {
	import std.concurrency : receiveTimeout;
	import core.time : Duration;

	//runGame() (the master game loop) shouln't exit. If it does exit, it means there was a crash. In that case, kill the other threads too, so the application can be restarted.
	scope (exit) {
		import core.stdc.stdlib;
		_Exit(EXIT_FAILURE);
	}

	auto master = new MasterServer;
	while (true) {
		receiveTimeout(Duration.min);//This doesn't receive anything, but it is here so that when the owner thread terminates, OwnerTerminated will be thrown thus terminating this thread.
	}
}
