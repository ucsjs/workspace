import { UIComponent } from "../abstracts";
import { IStyle } from "./styles/style.interface";

export interface IUIComponent {
    component: string;
    children?: Array<UIComponent>;
    [key: string]: any;
}

export interface IUIComponentWithStyle extends IUIComponent {
    style?: IStyle
}