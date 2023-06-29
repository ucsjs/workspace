import { IBlueprintSettings, IBlueprintTransform } from "./blueprint.interface";

export interface IFlowBlueprintListItem {
    blueprint: string,
    args?: IBlueprintSettings,
    transforms?: { [key: string]: IBlueprintTransform[] }
}