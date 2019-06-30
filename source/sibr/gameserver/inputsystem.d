module sibr.gameserver.inputsystem;

import sibr.gameserver.system;
import sibr.gameserver.entitymanager;
import cfg = sibr.config;

class Input {
	byte movementX;//can be 1 or -1
	byte movementY;//can be 1 or -1
	bool jumping;
	bool firing;
	ushort lookingX;
	ushort lookingY;
	ushort dt;

	void verify() {
		import std.algorithm : min, max;
		movementX = min(cast(byte) 1, movementX);
		movementX = max(cast(byte) -1, movementX);
		movementY = min(cast(byte) 1, movementY);
		movementY = max(cast(byte) -1, movementY);
		dt = min(cfg.maxInputDT, dt);
	}
}

class InputSystem : System {
	override void tick(long dt) {

	}

	this(EntityManager entityManager) {
		this.entityManager = entityManager;
	}
}
