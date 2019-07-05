import std.stdio;
import std.file;
import std.json;
string toHexString(const(ubyte)[] data) {
	import std.digest : toHexString_ = toHexString;
	return "#" ~ cast(string) toHexString_(data);
}

string[ubyte[]] textures;
static this() {
	textures = [
		[255, 255, 255]: "empty",
		[120, 81, 33]: "dirt",
	];
}

void main(string[] args) {
	import std.conv;

	uint width, height;
	string imagePath = "image.data";

	if (args.length == 3 || args.length == 4) {
		width = args[1].to!uint;
		height = args[2].to!uint;
		if (args.length == 4) {
			imagePath = args[3];
		}
	} else {
		writeln(`Usage: mapmaker <imageWidth> <imageHeight> [<imagePath> = "image.data"]`);
		writeln(`Input format is "Raw image data" exported from GIMP.`);
		writeln("Output is printed to stdout.");
		writeln();
		writeln("---");
		writeln("Color Key:");
		foreach (color, texture; textures) {
			writeln(texture, " = ", color.toHexString);
		}
		writeln("---");
		return;
	}

	auto data = parseRawImage(cast(ubyte[]) read(imagePath), width, height);

	JSONValue[] mapJSON;
	foreach (j; data) foreach (index, i; j) {
		JSONValue tileJSON = getTileJSON(cast(uint) index, 0, i);
		if (tileJSON["texture"].str != "empty") {
			mapJSON ~= tileJSON;
		}
	}

	JSONValue mapdefJSON = JSONValue();
	mapdefJSON["map"] = JSONValue(mapJSON);
	mapdefJSON["width"] = width;
	mapdefJSON["height"] = height;

	writeln(mapdefJSON.toString());
}

ubyte[][][] parseRawImage(ubyte[] rawData, uint width, uint height) {
	import std.array;

	auto data = uninitializedArray!(ubyte[][][])(height, width, 3);

	for (auto y = 0; y < height; y++) {
		for (auto x = 0; x < width; x++) {
			auto rowSize = width * 3 * y;
			auto firstItem = rowSize + x*3;
			data[y][x] = [rawData[firstItem], rawData[firstItem+1], rawData[firstItem+2]];
		}
	}

	return data;
}

string getTileTexture(ubyte[] color) {
	if (color in textures) {
		return textures[color];
	} else {
		throw new Exception("Unrecognized color '"~toHexString(color)~"'.");
	}
}

JSONValue getTileJSON(uint x, uint y, ubyte[] color) {
	JSONValue tile = JSONValue();

	tile["x"] = x;
	tile["y"] = y;
	tile["texture"] = getTileTexture(color);

	return tile;
}
