import { isNumber } from "@ucsjs/common";
import { IButtonStyle } from "../../interfaces/form/button.interface";
import { BaseStyle } from "./base-style.ui";
import { Color } from "./color.style.ui";

export class ButtonStyle extends BaseStyle {
    public width?: number = 0;

    public height?: number = 0;

    public fillColor?: Color = Color.Unset();

    public elevation?: number = 0;

    public borderColor?: Color = Color.Unset();

    public borderWidth?: number = 0;

    public static default(): ButtonStyle{
        return new ButtonStyle();
    }

    public static fromMetadata(metadata: IButtonStyle): ButtonStyle{
        let buttonStyle = new ButtonStyle();

        if(metadata.with && isNumber(metadata.with))
            buttonStyle.width = metadata.with;

        if(metadata.height && isNumber(metadata.height))
            buttonStyle.height = metadata.height;

        if(metadata.elevation && isNumber(metadata.elevation))
            buttonStyle.elevation = metadata.elevation;

        if(metadata.fillColor && Color.isColor(metadata.fillColor))
            buttonStyle.fillColor = Color.from(metadata.fillColor);

        if(metadata.borderColor && Color.isColor(metadata.borderColor))
            buttonStyle.borderColor = Color.from(metadata.borderColor);
        
        if(metadata.borderWidth && isNumber(metadata.borderWidth))
            buttonStyle.borderWidth = metadata.borderWidth;

        return buttonStyle;
    }
}