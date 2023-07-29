import { IBody, IHead } from "./html.interface";

export interface ITheme {
    head: IHead;
    body: IBody;
    components: IThemeComponentList
}

export interface IThemeComponentList {
    [key: string]: IThemeComponent;
}

export interface IThemeComponent {
    class: string;
    tag: string;
}