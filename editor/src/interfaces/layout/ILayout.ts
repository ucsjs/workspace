import { ILayoutPanel } from "./ILayoutPanel";
import { ILayoutItem } from "./ILayoutItem"; 

export interface ILayout {
    index: Map<string, ILayoutItem>;
    contents: ILayoutPanel[] | null;
    dropAreaSelected: string | null;
    previewDragPainel: string | null,
}