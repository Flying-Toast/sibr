import std.stdio;
import std.file;
import std.conv;
import std.array;

void main(string[] args) {
	auto width = args[1].to!uint;
	auto height = args[2].to!uint;

	auto data = parseData(cast(ubyte[]) read("image.data"), width, height);
}

ubyte[][][] parseData(ubyte[] rawData, uint width, uint height) {
	auto data = uninitializedArray!(ubyte[][][])(height, width, 3);

	for (auto y = 0; y < height; y++) {
		for (auto x = 0; x < width; x++) {
			auto rowSize = width * 4 * y;
			auto firstItem = rowSize + x*4;
			data[y][x] = [rawData[firstItem], rawData[firstItem+1], rawData[firstItem+2]];
		}
	}

	return data;
}
