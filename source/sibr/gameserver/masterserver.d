module sibr.gameserver.masterserver;

import sibr.webserver.queues;
import sibr.gameserver.game;
import sibr.gameserver.configmessage;
import sibr.gameserver.utils;
import cfg = sibr.config;

///Holds all the currently running games
class MasterServer {
	private {
		Game[] games;
		long lastTick;///timestamp of the last tick
	}

	void tick() {
		immutable currentTime = millis();

		//send queued outgoing messages:
		if (currentTime - outQueue.lastSend >= cfg.messageSendInterval) {
			outQueue.sendMessages();
		}

		foreach (game; games) {
			game.tick();
		}

		lastTick = currentTime;
	}

	///Adds the player described by `config` to an available server.
	void addPlayerToGame(ConfigMessage config) {
		getAvailableGame().clientJoin(config);
	}

	/**
		Finds an available Game (one that has room for more players).
		If there are no Games available, a new one is created.
	*/
	private Game getAvailableGame() {
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

	this() {
		//initialize lastTick to the current time so that the first tick won't have a giant deltatime.
		lastTick = millis();
	}
}


///Starts the master game.
void runGame() {
	import std.concurrency : receiveTimeout;
	import core.time : Duration;
	import core.thread;

	//runGame() (the master game loop) shouln't exit. If it does exit, it means there was a crash. In that case, kill the other threads too, so the application can be restarted.
	scope (exit) {
		import core.stdc.stdlib;
		_Exit(EXIT_FAILURE);
	}

	auto master = new MasterServer;

	//master loop
	while (true) {
		receiveTimeout(Duration.min);//This doesn't receive anything, but it is here so that when the owner thread terminates, OwnerTerminated will be thrown thus terminating this thread.

		foreach (id; connectionQueue.getConnections()) {
			ConfigMessage playerConfig;
			//catch any invalid messages
			try {
				playerConfig = new ConfigMessage(inQueue.nextMessage(id), id);
			} catch (Throwable t) {
				import std.stdio;
				stderr.writeln("An invalid config message was ignored.");
				//TODO: close the connection
				continue;
			}
			master.addPlayerToGame(playerConfig);
		}

		master.tick();

		Thread.sleep(dur!"msecs"(cfg.masterLoopInterval));
	}
}
