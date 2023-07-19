import { IBlueprintInput } from "./IBlueprintInputs";
import { IBlueprintComponent } from "./IBlueprintComponent";
import { IMousePointer } from "../mouse/IMousePointer";

export interface IBlueprintEditor {
    dragItem?: IBlueprintInput | undefined,
    inputSelected?: string | undefined,
    selectedItem: string | undefined,
    rootItem?: IBlueprintComponent | undefined,
    items: Map<string, IBlueprintComponent>,
    lastMousePosition: IMousePointer
}