"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    get magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    set magnitude(to) {
        const v = this.unit.times(to);
        this.x = v.x;
        this.y = v.y;
    }
    get unit() {
        const m = this.magnitude;
        return new Vector(this.x / m, this.y / m);
    }
    times(factor) {
        return new Vector(this.x * factor, this.y * factor);
    }
    distance(to) {
        return Math.sqrt(Math.pow(to.x - this.x, 2) + Math.pow(to.y - this.y, 2));
    }
}
exports.default = Vector;
//# sourceMappingURL=vector.js.map