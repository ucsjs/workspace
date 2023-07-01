import * as crypto from "crypto";
import { Types, IBlueprintData, IBlueprintHeader, Blueprint, Input } from "@ucsjs/core";

export default class Crypto extends Blueprint {

    public header: IBlueprintHeader = {
        useInEditor: true,
        version: 1,
        namespace: "Crypto",
        group: "Crypto & Hash",
        icon: "fa-solid fa-lock",
        helpLink: "https://nodejs.org/api/crypto.html",
        inputs: [
            { 
                name: "_default", 
                alias: "value", 
                type: Types.Any
            }
        ],
        outputs: [
            { 
                name: "_default", 
                type: Types.String 
            }
        ],
        properties: [
            { 
                name: "algorithm", 
                displayName: "Algorithm", 
                type: Types.Options, 
                default: "SHA256",
                required: true, 
                options: [
                    { name: "SHA256", value: "SHA256" },
                    { name: "SHA3-256", value: "SHA3-256" },
                    { name: "SHA3-384", value: "SHA3-384" },
                    { name: "SHA3-512", value: "SHA3-512" },
                    { name: "SHA384", value: "SHA384" },
                    { name: "SHA512", value: "SHA512" }
                ] 
            },
            { 
                name: "encoding", 
                displayName: "Encoding",
                default: "hex", 
                required: true, 
                type: Types.Options,  
                options: [
                    { name: "BASE64", value: "base64" },
                    { name: "HEX", value: "hex" }
                ]
            }
        ]
    }

    @Input("_default")
    private async createHash(data: IBlueprintData) {
        try{
            let value = data.value;
            let algorithm = this.getParameter("algorithm", "SHA256");
            let encoding = this.getParameter("encoding", "hex") as crypto.BinaryToTextEncoding;

            switch(typeof value){
                case "number": value = value.toString(); break;
                case "object": value = JSON.stringify(value); break;
            }

            const hash = (value) ? await crypto.createHash(algorithm).update(Buffer.from(value)).digest(encoding) : null;
            this.next(data.extend(this, { raw: value, value: hash }));
        }
        catch(e){
            this.next(this.generateError(this, e.message, `${this.header.namespace}::${this.id}`));
        }
    }
}