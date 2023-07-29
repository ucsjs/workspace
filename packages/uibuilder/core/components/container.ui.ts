import { Key } from "../../abstracts/foundation/key";
import { IUIComponent } from "../../interfaces";
import { MultiChildRenderObjectComponent } from "../../abstracts/framework/render-object";
import { GlobalUIComponents } from "../../utils/global-uicomponents.util";

export class Container extends MultiChildRenderObjectComponent {
    public static fromMetadata(metadata: IUIComponent): Container{
        const container = new Container(Key.empty(), GlobalUIComponents.loadChildren(metadata.children));
        container.key = Key.getHash(container);
        return container;
    }
}