import { isObject } from "@ucsjs/common";
import { IText } from "../../interfaces/components/text.interface";
import { Key, UIComponent } from "../../abstracts";
import { TextStyle } from "../style/text-style.ui";

export class Text extends UIComponent {
    public style?: TextStyle = TextStyle.default();

    constructor(key: Key, public value: string) {
        super(key);
    }

    public static empty(): Text {
        return new Text(Key.empty(), "");
    }

    public static fromMetadata(metadata: IText): Text{
        let text = new Text(Key.empty(), metadata.value);

        if(metadata.style && isObject(metadata.style))
            text.style = TextStyle.fromMetadata(metadata.style);

        text.key = Key.getHash(text);

        return text;
    }
}