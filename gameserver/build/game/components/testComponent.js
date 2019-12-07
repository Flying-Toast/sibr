"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../../core/component");
const enums_1 = require("../../core/enums");
class TestComponent extends component_1.default {
    constructor(entity) {
        super(entity);
        this.typeName = "test";
        this.stateVariable = 12345;
    }
    onUpdate() {
        super.onUpdate();
        this.entity.pos.x += 1;
    }
    publishState() {
        return {
            testStateVariable: this.stateVariable
        };
    }
}
exports.TestComponent = TestComponent;
class TestEntity {
    constructor() {
        this.typeName = "test";
        this.components = [TestComponent];
        this.syncType = enums_1.EntitySync.synced;
    }
}
exports.TestEntity = TestEntity;
//# sourceMappingURL=testComponent.js.map