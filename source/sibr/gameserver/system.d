module sibr.gameserver.system;

import std.meta;
import sibr.gameserver.entitymanager;
import sibr.gameserver.component;
import sibr.gameserver.networksystem;
import sibr.gameserver.inputsystem;
import sibr.gameserver.utils;

private alias Systems = AliasSeq!(NetworkSystem, InputSystem);///All systems. Update this when a new system is implemented

System[] createSystems(EntityManager entityManager) {
	System[] systems;
	static foreach (alias T; Systems) {
		systems ~= new T(entityManager);
	}
	return systems;
}

abstract class System {
	protected {
		EntityManager entityManager;
	}

	abstract void tick(long dt);
}
