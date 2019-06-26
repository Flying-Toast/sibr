module sibr.gameserver.game;

import sibr.gameserver.configmessage;
import sibr.gameserver.entitymanager;
import sibr.gameserver.system;
import sibr.gameserver.utils;

class Game {
	private {
		EntityManager entityManager;
		System[] systems;
		long lastTick;
	}

	void tick() {
		immutable currentTime = millis();
		immutable dt = currentTime - lastTick;
		foreach (s; systems) {
			s.tick(dt);
		}
		lastTick = currentTime;
	}

	///Whether or not this Game can accept new players
	bool joinable() {
		return true;//TODO: implement
	}

	///Add a new client to the game
	void clientJoin(ConfigMessage config) {
		entityManager.createPlayer(config.nickname, config.socketID);
	}

	this() {
		entityManager = new EntityManager;
		systems = createSystems(entityManager);
		//initialize lastTick to the current time so that the first tick won't have a giant deltatime.
		lastTick = millis();
	}
}
