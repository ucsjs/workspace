import { Color } from "../../core/style/color.style.ui";

export interface IText {
    style?: object;
    value: string;
}

export interface ITextStyle {
    fontSize?: number;
    textColor?: Color;
}