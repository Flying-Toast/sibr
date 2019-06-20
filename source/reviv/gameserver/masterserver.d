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
