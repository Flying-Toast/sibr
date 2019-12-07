import Component from "../../core/component";
import Entity from "../../core/entity";
import Vector from "../../core/vector";
import EntityType from "../../core/entityType";
import { EntitySync } from "../../core/enums";

export class TestComponent extends Component {
    typeName = "test";

    stateVariable = 12345;

    constructor(entity: Entity) {
        super(entity);
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

export class TestEntity implements EntityType {
    typeName = "test";
    components = [TestComponent];
    syncType = EntitySync.synced;
}
