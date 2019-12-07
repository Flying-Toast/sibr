module sibr.gameserver.geometry;

import sibr.gameserver.component;

interface Collidable {}

//NOTE: Collidable things don't directly have coordinates. The LocationComponent is used for the coords.

private bool rectangleCollidesWithCircle(Rectangle r, LocationC locR, Circle c, LocationC locC) {
	import std.algorithm : clamp;
	import std.math : hypot;

	float closestX = clamp(locC.x, locR.x - (r.width / 2.0), locR.x + (r.width / 2.0));
	float closestY = clamp(locC.y, locR.y - (r.height / 2.0), locR.y + (r.height / 2.0));

	return hypot(locC.x - closestX, locC.y - closestY) <= c.radius;
}

bool collides(Collidable a, LocationC locA, Collidable b, LocationC locB) {
	if (auto rect = cast(Rectangle) a) {//rectangle-*
		if (auto rect2 = cast(Rectangle) b) {//rectangle-rectangle
			immutable rEdge = locA.x + (rect.width / 2.0);//x coord of right edge of rect
			immutable lEdge = locA.x - (rect.width / 2.0);
			immutable tEdge = locA.y - (rect.height / 2.0);
			immutable bEdge = locA.y + (rect.height / 2.0);
			immutable rEdge2 = locB.x + (rect2.width / 2.0);//x coord of right edge of rect2
			immutable lEdge2 = locB.x - (rect2.width / 2.0);
			immutable tEdge2 = locB.y - (rect2.height / 2.0);
			immutable bEdge2 = locB.y + (rect2.height / 2.0);
			if (
				rEdge > lEdge2 &&
				lEdge < rEdge2 &&
				tEdge < bEdge2 &&
				bEdge > tEdge2
			) {
				return true;
			} else {
				return false;
			}
		} else if (auto circle = cast(Circle) b) {//rectangle-circle
			return rectangleCollidesWithCircle(rect, locA, circle, locB);
		}
	} else if (auto circle = cast(Circle) a) {//circle-*
		if (auto circle2 = cast(Circle) b) {//circle-circle
			import std.math : hypot;
			return hypot(locA.x - locB.x, locA.y - locB.y) <= circle.radius + circle2.radius;
		} else if (auto rect = cast(Rectangle) b) {//circle-rectangle
			return rectangleCollidesWithCircle(rect, locB, circle, locA);
		}
	}

	assert(0, "Collision not implemented for these shapes.");
}

class Rectangle : Collidable {
	float width;
	float height;

	this(float width, float height) {
		this.width = width;
		this.height = height;
	}
}

class Circle : Collidable {
	float radius;

	this(float radius) {
		this.radius = radius;
	}
}

unittest {
	Collidable a = new Circle(3);
	LocationC locA = new LocationC(-3.76, 2.19);
	Collidable b = new Circle(2);
	LocationC locB = new LocationC(-1.72, -3.07);
	assert(!collides(a, locA, b, locB));
	assert(!collides(b, locB, a, locA));

	a = new Circle(3);
	locA = new LocationC(-5.4, -0.47);
	assert(collides(a, locA, b, locB));
	assert(collides(b, locB, a, locA));

	////////////

	a = new Rectangle(8.7, 5.2);
	locA = new LocationC(18.3, 7.5);
	b = new Rectangle(10, 5);
	locB = new LocationC(19.6, 6.0);
	assert(collides(a, locA, b, locB));
	assert(collides(b, locB, a, locA));

	a = new Rectangle(20.0, 18.22);
	locA = new LocationC(220.7, 186.4);
	assert(!collides(a, locA, b, locB));
	assert(!collides(b, locB, a, locA));

	////////////

	a = new Circle(8.7);
	locA = new LocationC(10.3, 10.3);
	b = new Rectangle(5, 5);
	locB = new LocationC(10.5, 10.9);
	assert(collides(a, locA, b, locB));
	assert(collides(b, locB, a, locA));

	b = new Rectangle(5.21, 5.16);
	locB = new LocationC(105.2, 109.9);
	assert(!collides(a, locA, b, locB));
	assert(!collides(b, locB, a, locA));
}
