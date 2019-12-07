export default class Vector {
    x: number;
    y: number;
    
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
    get magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    set magnitude(to: number) {
        const v = this.unit.times(to);
        this.x = v.x;
        this.y = v.y;
    }

    get unit(): Vector {
        const m = this.magnitude;
        return new Vector(this.x / m, this.y / m);
    }

    times(factor: number): Vector {
        return new Vector(this.x * factor, this.y * factor);
    }

    distance(to: Vector) {
        return Math.sqrt(
            Math.pow(to.x - this.x, 2) + Math.pow(to.y - this.y, 2)
        );
    }
}
