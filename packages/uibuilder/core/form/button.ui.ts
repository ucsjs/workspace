import { isObject } from "@ucsjs/common";
import { IText, IIcon } from "../../interfaces/components";
import { Key } from "../../abstracts/foundation/key";
import { UIComponent } from "../../abstracts/framework";
import { IButton } from "../../interfaces/form/button.interface";
import { Icon } from "../components/icon.ui";
import { Text } from "../components/text.ui";
import { ButtonStyle } from "../style/button-style.ui";

export class Button extends UIComponent {
    public style?: ButtonStyle = ButtonStyle.default();

    public text: Text = null;

    public icon?: Icon = null;

    public static fromMetadata(metadata: IButton): Button{
        let button = new Button(Key.empty());

        if(metadata.style && isObject(metadata.style))
            button.style = ButtonStyle.fromMetadata(metadata.style);

        if(metadata.text && isObject(metadata.text))
            button.text = Text.fromMetadata(metadata.text as IText);

        if(metadata.icon && isObject(metadata.icon))
            button.icon = Icon.fromMetadata(metadata.icon as IIcon);

        button.key = Key.getHash(button);
        
        return button;
    }
}