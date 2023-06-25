import * as crypto from "crypto";
import { Types, IBlueprintData, IBlueprintHeader, Blueprint } from "@ucsjs/core";

export default class Crypto extends Blueprint {
    public header: IBlueprintHeader = {
        useInEditor: true,
        version: 1,
        namespace: "Crypto",
        group: "Crypto & Hash",
        icon: "fa-solid fa-lock",
        helpLink: "https://www.w3schools.com/jsref/met_console_log.asp",
        inputs: [
            { 
                name: "_default", 
                alias: "value", 
                type: Types.Any, 
                callback: (data: IBlueprintData) => this.transform(data, this) 
            }
        ],
        outputs: [
            { name: "_default", type: Types.String }
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

    private transform(data: IBlueprintData, scope: Crypto) {
        let value = data.value;
        let algorithm = scope.getParameter("algorithm", "SHA256");
        let encoding = scope.getParameter("encoding", "hex") as crypto.BinaryToTextEncoding;

        switch(typeof value){
            case "number": value = value.toString(); break;
            case "object": value = JSON.stringify(value); break;
        }

        const hash = (value) ? crypto.createHash(algorithm).update(Buffer.from(value)).digest(encoding) : null;
        this.next(data.extend(this, { raw: value, value: hash }));
    }
}