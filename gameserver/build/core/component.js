"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Component {
    constructor(entity) {
        this.typeName = "Component";
        this.entity = entity;
    }
    publishState() {
        return {};
    }
    publishMechanics() {
        return [];
    }
    onStaticLoad() {
    }
    onCreate() {
    }
    onUpdate() {
    }
}
exports.default = Component;
//# sourceMappingURL=component.js.map