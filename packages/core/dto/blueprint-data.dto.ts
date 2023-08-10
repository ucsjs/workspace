import { IBlueprintData, IBlueprintSettings } from "../interfaces";
import { Blueprint } from "../core";

export class BlueprintData implements IBlueprintData {
    public parent: Blueprint | undefined;
    public settings: IBlueprintSettings | undefined;
    public data: { [key: string]: any; };
    public value: any;
    
    constructor(parent: Blueprint | undefined, settings: IBlueprintSettings | undefined, data: { [key: string]: any; }){
        this.parent = parent;
        this.settings = settings;
        this.data = data;

        if(data.value)
            this.value = data.value;
    }
    
    getDefault() {
        return (this.data && this.data["_default"]) ? this.data["_default"] : null;
    }

    extend(blueprint: Blueprint, defaultValue?: any): IBlueprintData {
        return new BlueprintData(blueprint, { ...this.settings, ...blueprint.settings }, { ...this.data, ...defaultValue });
    }
}

export class BlueprintDataError implements IBlueprintData {
    public parent: Blueprint | undefined;
    public message: string;
    public scope: string;

    constructor(parent: Blueprint | undefined, message: string, scope: string) {
        this.parent = parent;
        this.message = message;
        this.scope = scope;
    }

    getDefault() { return null; }
    extend(newData: Blueprint, defaultValue?: any): IBlueprintData { return null };
}