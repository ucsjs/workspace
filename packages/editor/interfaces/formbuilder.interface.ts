import { FormBuilderValidationType, FormBuildTypes } from "../enums/formbuilder.enum";

export interface IFormBuilder {
    schema: IFormBuilderSchema;
}

export interface IFormBuilderSchema {
    type: FormBuildTypes;
    name: string;
    label: string;
    text?: string;
    inputType?: string;
    schema?: IFormBuilderSchema;
    placeholder?: string;
    tooltip?: string;
    rules?: string | Array<string>;
    messages?: string;
    tabs?: { [key: string]: IFormBuilderTab };
    buttonLabel?: string;
    time?: boolean;
    date?: boolean;
    default?: any;
    min?: number;
    max?: number;
    step?: number;
    required?: boolean;
    nullable?: boolean;
    submits?: boolean;
    validations?: Array<IFormBuilderValidation>;
}

export interface IFormBuilderTab {
    label: string,
    elements: Array<string>
}

export interface IFormBuilderValidation {
    type: FormBuilderValidationType;
    otherField?: string,
    value?: string | number;
    values?: Array<string | number>;
    min?: number;
    max?: number;
}   