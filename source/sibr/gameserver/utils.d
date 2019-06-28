module sibr.gameserver.utils;

import std.random;
import core.time;

///Millisecond timestamp
auto millis() {
	return convClockFreq(MonoTime.currTime.ticks, MonoTime.ticksPerSecond, 1000);
}

private Random generator;
shared static this() {
	generator = Random(unpredictableSeed);
}

int randInt(int min, int max) {
	return uniform!"()"(min, max, generator);
}
