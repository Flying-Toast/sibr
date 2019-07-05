module sibr.gameserver.entitymanager;

import sibr.gameserver.component;

alias entityID_t = ushort;

///The name of the array that components of type `T` are stored in
private template arrayName(T) {
	enum arrayName = "component_"~__traits(identifier, T)~"_list";
}

///A class that semantically links an entity and its components
class EntityManager {
	private {
		entityID_t[] freeIDs;///IDs that are allocated but unused

		//Creates an array of each component type, e.g. `FooC[] component_FooC_list`
		static foreach (alias T; ComponentTypes) {
			mixin(__traits(identifier, T)~"[] "~arrayName!T~";");
		}
	}

	///Allocates a new entity and returns its ID.
	entityID_t createEntity() {
		static entityID_t currentID;

		if (freeIDs.length > 0) {
			immutable id = freeIDs[0];
			//pop the front id
			freeIDs = freeIDs[1 .. $];

			return id;
		} else {
			//resize the component arrays to allocate space for a new entity
			static foreach (alias T; ComponentTypes) {
				mixin(arrayName!T).length++;
			}
			return currentID++;
		}
	}

	///Deletes the entity `id`.
	void removeEntity(entityID_t id) {
		//remove all of the entity's components
		static foreach (alias T; ComponentTypes) {
			removeComponent!T(id);
		}

		freeIDs ~= id;
	}

	///Gets an array of all the components of type `T`, indexed by entity id.
	T[] getComponents(T)() {
		return mixin(arrayName!T);
	}

	///Adds `component` to the entity `id`.
	void addComponent(T)(entityID_t id, T component) {
		mixin(arrayName!T)[id] = component;
	}

	///Removes the component of type `T` from the entity `id`.
	void removeComponent(T)(entityID_t id) {
		mixin(arrayName!T)[id] = null;
	}

	///Whether or not the entity `id` has a component of type `T`.
	bool hasComponent(T)(entityID_t id) {
		return mixin(arrayName!T)[id] !is null;
	}
}

entityID_t createPlayer(EntityManager em, string nickname, ushort socketID, LocationC location) {
	immutable id = em.createEntity();

	em.addComponent(id, new NicknameC(nickname));
	em.addComponent(id, new NetworkC(socketID));
	em.addComponent(id, location);
	em.addComponent(id, new InputC);
	em.addComponent(id, new RenderC("player"));
	em.addComponent(id, new VelocityC(0, 0));

	return id;
}

entityID_t createDroppedItem(EntityManager em, Item item, LocationC location) {
	immutable id = em.createEntity();

	em.addComponent(id, location);
	em.addComponent(id, new ItemDropC(item));

	return id;
}
