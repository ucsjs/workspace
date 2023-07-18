import { IBlueprintInput } from "./IBlueprintInputs";
import { IBlueprintComponent } from "./IBlueprintComponent";

export interface IBlueprintEditor {
    dragItem?: IBlueprintInput | undefined,
    inputSelected?: string | undefined,
    selectedItem: string | undefined,
    rootItem?: IBlueprintComponent | undefined,
    items: Map<string, IBlueprintComponent>
}