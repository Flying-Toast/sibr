module sibr.gameserver.physicssystem;

import sibr.gameserver.system;
import sibr.gameserver.entitymanager;
import sibr.gameserver.component;

class PhysicsSystem : System {
	override void tick(long dt) {
		auto locationComponents = entityManager.getComponents!LocationC;
		foreach (id, c; entityManager.getComponents!VelocityC) if (c !is null) {
			assert(entityManager.hasComponent!LocationC(cast(entityID_t) id), "All entities with a velocity component must also have a location component.");
			auto loc = locationComponents[id];
			loc.x += c.x * dt;
		}
	}

	this(EntityManager entityManager) {
		this.entityManager = entityManager;
	}
}
