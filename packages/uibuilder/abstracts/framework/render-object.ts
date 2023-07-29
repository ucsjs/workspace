import { Key } from "../foundation";
import { UIComponent } from "./ui-component";

export abstract class RenderObjectComponent extends UIComponent { }

export abstract class SingleChildRenderObjectComponent extends RenderObjectComponent {
    constructor(key: Key, public child: UIComponent){
        super(key);
    }
}

export abstract class MultiChildRenderObjectComponent extends RenderObjectComponent {
    constructor(key: Key, public children: UIComponent[]){
        super(key);        
    }
}