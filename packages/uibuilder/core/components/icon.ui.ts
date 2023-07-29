import { isNumber } from "@ucsjs/common";
import { IIcon } from "../../interfaces/components/icon.interface";
import { Key, UIComponent } from "../../abstracts";
import { Color } from "../style/color.style.ui";

export class Icon extends UIComponent {
    public size?: number = 0;

    public color?: Color = Color.Unset();

    constructor(key: Key, public type: string, public icon: string){
        super(key);
    }

    public static fromMetadata(metadata: IIcon): Icon{
        let icon = new Icon(Key.empty(), metadata.type, metadata.icon);

        if(metadata.size && isNumber(metadata.size))
            icon.size = metadata.size;

        if(metadata.color && Color.isColor(metadata.color))
            icon.color = Color.from(metadata.color);

        icon.key = Key.getHash(icon);

        return icon;
    }
}