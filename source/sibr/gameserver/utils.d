module sibr.gameserver.utils;

///Millisecond timestamp
auto millis() { import core.time; return convClockFreq(MonoTime.currTime.ticks, MonoTime.ticksPerSecond, 1000); }
