import Entity from "./entity";

export default class Component {
    typeName: string = "Component";
    entity: Entity;

    constructor(entity: Entity) {
        this.entity = entity;
    }

    publishState (): any {
        return {};
    }

    publishMechanics (): string[] {
        return [];
    }

    onStaticLoad (): void {

    }

    onCreate(): void {

    }

    onUpdate (): void {

    }
}