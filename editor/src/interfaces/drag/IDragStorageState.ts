import { ILayoutItem } from "../layout/ILayoutItem";
import { ILayoutPanel } from "../layout/ILayoutPanel";

export interface IDragStorageState {
    inDrag: boolean,
    item: ILayoutItem | null,
    target: EventTarget | null,
    currentPanel: ILayoutPanel | null;
    layoutDrop: string | null,
    position: { row: number, index: number } | null
}