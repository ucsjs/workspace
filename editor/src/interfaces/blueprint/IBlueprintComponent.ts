import { Types } from "@/enums/types.enum";

export enum BlueprintComponentType {
    Input,
    Blueprint,
    Output
}

export interface IBlueprintComponent {
    id: string,
    type: BlueprintComponentType,
    x: number,
    y: number,
    component?: IBlueprintInput,
    name?:string;
    default?: any;
    blueprint?: IBlueprint;
}

export interface IBlueprint {
    id: string;
    namespace: string;
    displayName: string;
    group: string;
    useInEditor: boolean;
    icon: string;
    outputs: IBlueprintOutput[];
    inputs: IBlueprintInput[];
    properties?: IBlueprintProperties[];
    triggers?: IBlueprintTrigger[];
    events?: IBlueprintEvent[];
}

export interface IBlueprintInput {
    id: string;
    name: string;
    type: Types | string;
}

export interface IBlueprintOutput {
    name: string;
    type: number;
}

export interface IBlueprintProperties {
    id?: string,
    name: string,
    displayName: string,
    type: number,
    description?: string;
	hint?: string;
    placeholder?: string;
    required?: boolean;
    fixed?:boolean;
    default?: any;
    value?: any;
    options?: IBlueprintOptions[] | { key: any; value: any; }[],
    objectArray?: IBlueprintObjectArrayItem[]
}

export interface IBlueprintOptions {
    name: string,
    value: any
}

export interface IBlueprintObjectArrayItem {
    name: string,
    type: number,
    required?: boolean,
    default?: boolean,
    options?: IBlueprintOptions[],
}

export interface IBlueprintTrigger {
    name: string,
    blueprint?: object,
    timeout?: number;
}

export interface IBlueprintEvent {
    name: string,
    callback?: Function
}