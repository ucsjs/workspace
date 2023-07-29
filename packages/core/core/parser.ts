import * as crypto from "crypto";
import { plainToInstance } from 'class-transformer';
import { Blueprint } from './blueprint';
import { BlueprintList, IBlueprintProperties } from "../interfaces/blueprint.interface";

export class BlueprintParser {
    private blueprint: Blueprint;

    constructor(blueprint: Blueprint){
        this.blueprint = blueprint;
    }

    public signString(value: string): string{
        return crypto.createHash("sha1").update(Buffer.from(value)).digest("hex");
    }

    public export(){
        let data = {
            id: this.signString(this.blueprint.header.namespace),
            ...this.blueprint.header
        };

        if(this.blueprint.header.inputs)
            data.inputs = this.blueprint.header.inputs?.map(item => item);

        if(this.blueprint.header.outputs)
            data.outputs = this.blueprint.header.outputs?.map(item => item);

        if(this.blueprint.header.properties){
            data.properties = this.blueprint.header.properties?.map(item => {
                if(item.options && Array.isArray(item.options))  
                    item.options = item.options.map((value) => { return (typeof value === "object") ? value : { key: value, value }; }); 
                
                return item;
            });
        }
            

        return data;
    }
}

export default BlueprintParser;