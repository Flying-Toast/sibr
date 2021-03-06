import { logError } from "./logging";

export class Vector {
    x: number;
    y: number;
    constructor (x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    get magnitude(): number {
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }
    set magnitude(to: number) {
        const v = this.unit.times(to);
        this.x = v.x;
        this.y = v.y;

    }

    get unit(): Vector {
        const m = this.magnitude;
        return new Vector(this.x/m, this.y/m);
    }

    times(factor: number): Vector {
        return new Vector(this.x*factor, this.y*factor);
    }
}

export class Color {
    r: number;
    g: number;
    b: number;
    a: number;
    constructor(r:number, g:number, b:number, a:number=1) {
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }
    toHex(): number {
        const r = 255*this.r;
        const g = 255*this.g;
        const b = 255*this.b;
        return parseInt(r.toString(16)+g.toString(16)+b.toString(16), 16)
    }

    static fromArray(arr:number[], upper=1): Color {
        const r = arr[0]/upper;
        const g = arr[1]/upper;
        const b = arr[2]/upper;
        var a = arr[3];
        if (a == undefined) {
            a = 1;
        }
        return new Color(r,g,b,a);
    }
    
}

export function loadFile(filePath: string) {
    var result = null;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", filePath, false);
    xmlhttp.send();
    if (xmlhttp.status==200) {
      result = xmlhttp.responseText;
    }
    return result;
}

export function loadJSON(filePath: string) {
    return JSON.parse(loadFile(filePath));
}
