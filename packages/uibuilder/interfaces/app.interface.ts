import { UIComponent } from "../abstracts";
import { AppBar } from "../core/components/app-bar.ui";

import { 
    IUIComponent, 
    IUIComponentWithStyle 
} from "./component.interface";

export abstract class IApp {
    public appBar?: IUIComponentWithStyle;
    public body?: IUIComponent;
}

export class UIBuilderApp {
    public theme?: string;
    public appBar?: AppBar;
    public body?: UIComponent;
}