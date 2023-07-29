import { isNumber, isObject, isString } from "@ucsjs/common";
import { BaseStyle } from "./base-style.ui";
import { ITextStyle } from "../../interfaces/components";
import { Color } from "./color.style.ui";

export class TextStyle extends BaseStyle {
    fontSize: number = 12;

    textColor: Color = Color.Unset();

    public static default(): TextStyle {
        return new TextStyle();
    }

    public static fromMetadata(metadata: ITextStyle): TextStyle{

        const textStyle = new TextStyle();

        textStyle.fontSize = (
            metadata.fontSize && 
            isNumber(metadata.fontSize)
        ) ? metadata.fontSize : 12;

        textStyle.textColor = (
            metadata.textColor && 
            isString(metadata.textColor) || 
            isObject(metadata.textColor)
        ) ? Color.from(metadata.textColor) : Color.Unset();

        return textStyle;
    }
}