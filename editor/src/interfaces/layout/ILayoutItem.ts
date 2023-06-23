import { IPanelComponent } from "../components/IPanelComponent";

export interface ILayoutItem {
    id: string,
    namespace: string,
    icon?: string;
    items?: ILayoutItem[];
    content?: IPanelComponent 
}