import { isNumber, isObject, isString } from "@ucsjs/common";
import { BaseStyle } from "./base-style.ui";
import { IAppbarStyle } from "../../interfaces/components";
import { Color } from "./color.style.ui";

export class AppBarStyle extends BaseStyle {
    elevation: number = 0;

    backgroundColor: Color = Color.Unset();

    public static default(): AppBarStyle {
        return new AppBarStyle();
    }

    public static fromMetadata(metadata: IAppbarStyle): AppBarStyle{
        const appBarStyle = new AppBarStyle();

        if(metadata.backgroundColor && Color.isColor(metadata.backgroundColor))
            appBarStyle.backgroundColor = Color.from(metadata.backgroundColor);

        if(metadata.elevation && isNumber(metadata.elevation))
            appBarStyle.elevation = metadata.elevation;

        return appBarStyle;
    }
}