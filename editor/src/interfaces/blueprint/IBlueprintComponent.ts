import { IBlueprintInput } from "./IBlueprintInputs";

export enum BlueprintComponentType {
    Input,
    Blueprint
}

export interface IBlueprintComponent {
    id: string,
    type: BlueprintComponentType,
    x: number,
    y: number,
    component: IBlueprintInput,
    name?:string;
    default?: any;
}