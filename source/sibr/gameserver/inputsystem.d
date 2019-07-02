module sibr.gameserver.inputsystem;

import sibr.gameserver.system;
import sibr.gameserver.entitymanager;
import sibr.gameserver.component;
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
		import std.algorithm : clamp, min;
		movementX = clamp(movementX, cast(byte) -1, cast(byte) 1);
		movementY = clamp(movementY, cast(byte) -1, cast(byte) 1);
		dt = min(cfg.maxInputDT, dt);
	}
}

class InputSystem : System {
	override void tick(long dt) {
		foreach (id, c; entityManager.getComponents!InputC) if (c !is null) {
			foreach (input; c.inputs) {
				//process the input here
			}

			c.inputs = [];//remove all the inputs after they have been processed
		}
	}

	this(EntityManager entityManager) {
		this.entityManager = entityManager;
	}
}
