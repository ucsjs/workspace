import { Types } from "../enums/types.enum";
import { Blueprint } from "../core";

export interface IBlueprint {
    id: string;
    header: IBlueprintHeader;
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
    settings?: IBlueprintSettings | undefined;
    data?: { [key: string]: any };
    value?: any;
    error?: IBlueprintDataError;
    getDefault(): any;
    extend(newData: Blueprint, defaultValue?: any): IBlueprintData;
}

export interface IBlueprintDataError {
    message: string;
    scope: string;
}

export interface IBlueprintInput {
    id?: string;
    name: string;
    alias?: string;
    type: Types | any;
    default?: any;
    callback?: Function;
}

export interface IBlueprintOutput {
    id?: string,
    name: string,
    alias?: string,
    type: Types | any
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
    options?: IBlueprintOptions[],
    objectArray?: IBlueprintObjectArrayItem[]
}

export interface IBlueprintOptions {
    name: string,
    value: any
}

export interface IBlueprintObjectArrayItem {
    name: string,
    type: Types,
    required?: boolean,
    default?: boolean,
    options?: IBlueprintOptions[],
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
    callback?: Function
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

export interface IBlueprintController {
    created();
}

export interface IBlueprintInjectData {
    input: string,
    value: any
}

export interface IBlueprintControllerCatch {
    message: string,
    scope: string
}

export interface IBlueprintTransform {
    blueprint: string,
    input: string,
    output: string,
    key: string
}