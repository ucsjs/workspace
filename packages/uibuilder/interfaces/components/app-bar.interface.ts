import { UIComponent } from "../../abstracts/framework/ui-component";
import { IStyle } from "../styles/style.interface";
import { Color } from "../../core/style/color.style.ui";

export interface IAppBar {
    style?: object;
    children?: Array<UIComponent>
}

export interface IAppbarStyle extends IStyle {
    backgroundColor: string | Color;
    elevation: number;
}