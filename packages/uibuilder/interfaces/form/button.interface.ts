import { Color } from "../../core/style/color.style.ui";

export interface IButton {
    style?: object;
    child: object;
    action?: Array<any>,
    text?: object;
    icon?: object;
}

export interface IButtonStyle {
    with?: number;
    height?: number;
    fillColor?: string | Color;
    elevation?: number;
    borderColor?: string | Color;
    borderWidth?: number;
}