module sibr.gameserver.entitymanager;

import sibr.gameserver.component;

alias entityID_t = ushort;

private template arrayName(T) {
	enum arrayName = "component_"~__traits(identifier, T)~"_list";
}

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
			static foreach (alias T; ComponentTypes) {
				mixin(arrayName!T).length++;
			}
			return currentID++;
		}
	}

	///Deletes the entity `id`.
	void removeEntity(entityID_t id) {
		static foreach (alias T; ComponentTypes) {
			removeComponent!T(id);
		}

		freeIDs ~= id;
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
