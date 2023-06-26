import { IBlueprintInput } from "./IBlueprintInputs";
import { IBlueprintComponent } from "./IBlueprintComponent";

export interface IBlueprintEditor {
    dragItem?: IBlueprintInput | null,
    inputSelected?: string | null,
    selectedItem: string | null,
    rootItem?: IBlueprintComponent,
    items: Map<string, IBlueprintComponent>
}