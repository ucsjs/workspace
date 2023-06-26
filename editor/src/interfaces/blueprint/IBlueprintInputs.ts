export interface IBlueprintInput {
    id: string,
    name: string,
    type: string
}

export interface IBlueprintType {
    label: string,
    value: string,
    default?: any
}

export interface IBlueprintInputs {
    itemOver: string | null, 
    selectedItem: string | null,
    renameInput: string | null,
    inputTypes: IBlueprintType[],
    inputs: IBlueprintInput[]
}