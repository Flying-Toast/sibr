module sibr.gameserver.geometry;

interface Collidable {
	bool collidesWith(Collidable);
}

class Rectangle : Collidable {
	float width;
	float height;
	//coordinates are of center
	float x;
	float y;

	bool collidesWith(Collidable thing_) {
		if (auto thing = cast(Rectangle) thing_) {//rectangle-rectangle collision
			immutable thisREdge = x + (width / 2.0);//x coord of right edge of this
			immutable thisLEdge = x - (width / 2.0);
			immutable thisTEdge = y - (height / 2.0);
			immutable thisBEdge = y + (height / 2.0);
			immutable thatREdge = thing.x + (thing.width / 2.0);//x coord of right edge of other rectangle
			immutable thatLEdge = thing.x - (thing.width / 2.0);
			immutable thatTEdge = thing.y - (thing.height / 2.0);
			immutable thatBEdge = thing.y + (thing.height / 2.0);
			if (
				thisREdge > thatLEdge &&
				thisLEdge < thatREdge &&
				thisTEdge < thatBEdge &&
				thisBEdge > thatTEdge
			) {
				return true;
			} else {
				return false;
			}
		} else {
			assert(0, typeof(this).stringof~"-"~typeof(thing_).classinfo.name~" collision not implemented.");
		}
	}

	this(float x, float y, float width, float height) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}
}

class Circle : Collidable {
	float radius;
	float x;
	float y;

	bool collidesWith(Collidable thing_) {
		if (auto thing = cast(Circle) thing_) {//circle-circle collision
			import std.math : hypot;
			return hypot(x - thing.x, y - thing.y) <= radius + thing.radius;
		} else {
			assert(0, typeof(this).stringof~"-"~typeof(thing_).classinfo.name~" collision not implemented.");
		}
	}

	this(float x, float y, float radius) {
		this.x = x;
		this.y = y;
		this.radius = radius;
	}
}

unittest {
	Collidable a = new Circle(-3.76, 2.19, 3);
	Collidable b = new Circle(-1.72, -3.07, 2);
	assert(!a.collidesWith(b));
	assert(!b.collidesWith(a));

	a = new Circle(-5.4, -0.47, 3);
	assert(a.collidesWith(b));
	assert(b.collidesWith(a));

	////////////

	a = new Rectangle(18.3, 7.5, 8.7, 5.2);
	b = new Rectangle(19.6, 6.0, 10, 5);
	assert(a.collidesWith(b));
	assert(b.collidesWith(a));

	a = new Rectangle(220.7, 186.4, 20.0, 18.22);
	assert(!a.collidesWith(b));
	assert(!b.collidesWith(a));
}
