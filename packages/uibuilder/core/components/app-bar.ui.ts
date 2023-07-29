import { isObject } from "@ucsjs/common";
import { IAppbarStyle } from "@ucsjs/uibuilder/interfaces";
import { Key } from "../../abstracts/foundation/key";
import { MultiChildRenderObjectComponent } from "../../abstracts/framework/render-object";
import { IUIComponentWithStyle } from "../../interfaces/component.interface";
import { GlobalUIComponents } from "../../utils/global-uicomponents.util";
import { AppBarStyle } from "../style/appbar-style.ui";

export class AppBar extends MultiChildRenderObjectComponent {
    public style?: AppBarStyle = AppBarStyle.default();

    public static fromMetadata(metadata: IUIComponentWithStyle): AppBar{
        let appBar = new AppBar(Key.empty(), GlobalUIComponents.loadChildren(metadata.children));

        if(metadata.style && isObject(metadata.style))
            appBar.style = AppBarStyle.fromMetadata(metadata.style as IAppbarStyle);

        appBar.key = Key.getHash(appBar);

        return appBar;
    }
}