# Map Definition file

## Details
- The "mapdef" file is a JSON/msgpack file located at the URL `<hostname>/map`.

## Format
```JavaScript
{
	"map": <mapdata array>,
	"width": <integer>,
	"height": <integer>
}
```

### `mapdata` format
The `map` property is a one-dimensional array of `tile` objects. A tile object is in this format:
```JavaScript
{
	"x": <integer>, //the top left tile is (0, 0)
	"y": <integer>,
	"texture": <string> //the name of the texture of this tile
}
```

`texture` is one of these possible values:

- dirt
- more to be added...

Empty tiles are not included in the mapdef.

### Example
This mapdef:
```JSON
{
	"width": 3,
	"height": 3,
	"map": [
	  {"texture":"dirt","x":2,"y":0},
	  {"texture":"dirt","x":1,"y":1},
	  {"texture":"dirt","x":2,"y":1},
	  {"texture":"dirt","x":0,"y":2},
	  {"texture":"dirt","x":1,"y":2},
	  {"texture":"dirt","x":2,"y":2}
	]
}
```

Represents this map (brown=dirt, white=empty):

![example map image](exampleMap.png)
