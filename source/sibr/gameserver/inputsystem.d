module sibr.gameserver.inputsystem;

import sibr.gameserver.system;
import sibr.gameserver.entitymanager;
import sibr.gameserver.component;
import cfg = sibr.config;

class Input {
	int movementX;//can be 1, -1, or 0
	int movementY;//can be 1, -1, or 0
	bool jumping;
	bool firing;
	int lookingX;
	int lookingY;
	int dt;
}

void verify(Input input) {
	import std.algorithm : clamp;
	input.movementX = clamp(input.movementX, -1, 1);
	input.movementY = clamp(input.movementY, -1, 1);
	input.dt = clamp(input.dt, 0, cfg.maxInputDT);
}

class InputSystem : System {
	override void tick(long dt) {
		auto veloictyComponents = entityManager.getComponents!VelocityC;

		foreach (id, c; entityManager.getComponents!InputC) if (c !is null) {
			assert(entityManager.hasComponent!VelocityC(cast(entityID_t) id), "All entities with an input component must also have a velocity component.");
			auto velocity = veloictyComponents[id];
			foreach (input; c.inputs) {
				velocity.x = cfg.inputVelocityMultiplier * input.movementX;
			}

			c.inputs = [];//remove all the inputs after they have been processed
		}
	}

	this(EntityManager entityManager) {
		this.entityManager = entityManager;
	}
}
