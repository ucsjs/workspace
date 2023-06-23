import * as crypto from "crypto";
import { Blueprint } from './blueprint';

export class BlueprintParser {
    private blueprint: Blueprint;

    constructor(blueprint: Blueprint){
        this.blueprint = blueprint;
    }

    public signString(value: string): string{
        return crypto.createHash("sha1").update(Buffer.from(value)).digest("hex");
    }

    public export(){
        return (this.blueprint) ? {
            id: this.signString(this.blueprint.header.namespace),
            ...this.blueprint.header,
            inputs: this.blueprint.header.inputs?.map(item => item),
            outputs: this.blueprint.header.outputs?.map(item => item),
            properties: this.blueprint.header.properties?.map(item => item)
        } : null;
    }
}

export default BlueprintParser;