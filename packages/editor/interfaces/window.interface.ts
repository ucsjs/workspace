import { IFormBuilder } from "./formbuilder.interface";

export interface IWindow {
    namespace: string;
    title: string;
    modal?: boolean;
    maximize?: boolean;
    width?: number;
    height?: number;
    minWidth?: number;
    minHeight?: number;
    maxWidth?: number;
    maxHeight?: number;
    contentComponent?: string;
    formBuilder?: IFormBuilder; 
    actions?: Array<IWindowAction>;
}

export interface IWindowAction {
    index: number;
    label: string;
    handler: Function
}