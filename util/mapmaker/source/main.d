import std.stdio;
import std.file;

void main(string[] args) {
	import std.conv;

	auto width = args[1].to!uint;
	auto height = args[2].to!uint;

	auto data = parseRawImage(cast(ubyte[]) read("image.data"), width, height);
}

ubyte[][][] parseRawImage(ubyte[] rawData, uint width, uint height) {
	import std.array;

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

string tileType(ubyte[] color) {
	string[ubyte[]] map = [
		[255, 255, 255]: "empty",
		[120, 81, 33]: "dirt",
	];

	if (color in map) {
		return map[color];
	} else {
		import std.digest : toHexString;
		throw new Exception("Unrecognized color '#"~cast(string) toHexString(color)~"'.");
	}
}
