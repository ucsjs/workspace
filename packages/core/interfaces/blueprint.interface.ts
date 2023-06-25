import { Types } from "../enums/types.enum";
import { Blueprint } from "../core";

export interface IBlueprint {
    id: string,
    header: IBlueprintHeader,
    setup(args: IBlueprintSettings): void;
    build?(): Promise<void> | null;
    execute?(): boolean;
    receive?(data: IBlueprintData, inputName?: string): void;
    dispatch?(data: IBlueprintTrigger, eventName: string): void;
}

export interface IBlueprintSettings {
    [key: string]: any;
}

export interface IBlueprintData {
    parent: Blueprint | undefined;
    settings: IBlueprintSettings | undefined;
    data: { [key: string]: any };
    value: any;
    getDefault(): any;
    extend(newData: Blueprint, defaultValue?: any): IBlueprintData;
}

export interface IBlueprintInput {
    id?: string,
    name: string,
    alias?: string,
    type: Types,
    default?: any,
    callback: Function
}

export interface IBlueprintOutput {
    id?: string,
    name: string,
    alias?: string,
    type: Types
}

export interface IBlueprintProperties {
    id?: string,
    name: string,
    displayName: string,
    type: Types,
    description?: string;
	hint?: string;
    placeholder?: string;
    required?: boolean;
    fixed?:boolean;
    default?: any;
    value?: any;
    options?: IBlueprintOptions[]
}

export interface IBlueprintOptions {
    name: string,
    value: any
}

export interface IBlueprintIcon {
    src?: string,
    color?: string;
    class?: string;
}

export interface IBlueprintTrigger {
    name: string,
    blueprint?: Blueprint,
    timeout?: number;
}

export interface IBlueprintEvent {
    name: string,
    callback: Function
}

export interface IBlueprintHeader {
    namespace: string,
    version?: number | number[],
    group: string | string[],
    icon?: string | IBlueprintIcon,
    helpLink?: string,
    inputs?: IBlueprintInput[],
    outputs?: IBlueprintOutput[],
    properties?: IBlueprintProperties[],
    triggers?: IBlueprintTrigger[]
    events?: IBlueprintEvent[]
    useInEditor: boolean
}

export interface IBlueprintIncorporate {
    blueprint: string,
    args?: object,
}