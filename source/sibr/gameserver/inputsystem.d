module sibr.gameserver.inputsystem;

import sibr.gameserver.system;
import sibr.gameserver.entitymanager;
import sibr.gameserver.component;
import cfg = sibr.config;

class Input {
	byte movementX;//can be 1, -1, or 0
	byte movementY;//can be 1, -1, or 0
	bool jumping;
	bool firing;
	ushort lookingX;
	ushort lookingY;
	ushort dt;
}

void verify(Input input) {
	import std.algorithm : clamp, min;
	input.movementX = clamp(input.movementX, cast(byte) -1, cast(byte) 1);
	input.movementY = clamp(input.movementY, cast(byte) -1, cast(byte) 1);
	input.dt = min(cfg.maxInputDT, input.dt);
}

class InputSystem : System {
	override void tick(long dt) {
		auto veloictyComponents = entityManager.getComponents!VelocityC;

		foreach (id, c; entityManager.getComponents!InputC) if (c !is null) {
			assert(entityManager.hasComponent!VelocityC(cast(ushort) id), "All entities with an input component must also have a velocity component.");
			auto velocity = veloictyComponents[id];
			foreach (input; c.inputs) {
				velocity.x = input.movementX;
			}

			c.inputs = [];//remove all the inputs after they have been processed
		}
	}

	this(EntityManager entityManager) {
		this.entityManager = entityManager;
	}
}
