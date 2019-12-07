import { EntityCycleData } from "./cycleDataInterfaces";

export default interface WorldNetInterface {
    pushEntityCycleData(cycleData: EntityCycleData): void;
    
}