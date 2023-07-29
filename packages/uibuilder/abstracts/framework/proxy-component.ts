import { Key } from "../foundation";
import { UIComponent } from "./ui-component";

export abstract class ProxyUIComponent extends UIComponent {
    constructor(key: Key, public child: UIComponent) {
        super(key);
    }
}