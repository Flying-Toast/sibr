module sibr.gameserver.entity;

import sibr.gameserver.component;

alias entityID_t = uint;

///Data class that holds Components.
class Entity {
	immutable entityID_t id;
	private {
		Component[TypeInfo] componentMap;
	}

	///Whether or not this Entity has a component of type `T`.
	bool hasComponent(T)()
		if (is(T : Component) && !is(T == Component))
	{
		return (typeid(T) in componentMap) !is null;
	}

	///Gets the component of type `T` from this entity
	T getComponent(T)()
		if (is(T : Component) && !is(T == Component))
	{
		return cast(T) componentMap[typeid(T)];
	}

	///Removes component of type `T` from this entity
	void removeComponent(T)()
		if (is(T : Component) && !is(T == Component))
	{
		componentMap.remove(typeid(T));
	}

	void addComponent(Component c) {
		componentMap[typeid(c)] = c;
	}

	this(T...)(entityID_t id, T components) {
		this.id = id;
		foreach(c; components) {
			addComponent(c);
		}
	}
}

unittest {
	class FooComponent : Component {
		string foo = "bar";
	}

	class BarComponent : Component {
		int a;

		this(int a) {
			this.a = a;
		}
	}

	Entity e = new Entity(7, new FooComponent);
	assert(e.id == 7);

	assert(e.hasComponent!FooComponent);
	assert(!e.hasComponent!BarComponent);
	assert(e.getComponent!FooComponent.foo == "bar");

	e.removeComponent!FooComponent;
	assert(!e.hasComponent!FooComponent);

	e.addComponent(new BarComponent(83));
	assert(e.hasComponent!BarComponent);
	assert(e.getComponent!BarComponent.a == 83);
}
