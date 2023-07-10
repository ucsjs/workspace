import * as protobuf from "protobufjs";
import * as path from 'path';
import { glob } from "glob";

import { Singleton } from "@ucsjs/common";

export class GlobalProto extends Singleton {
    public protos: Map<string, protobuf.Root> = new Map<string, protobuf.Root>();

    static async load(){
        let directoryPackages = path.resolve((process.env.NODE_ENV == "prod") ? "./node_modules/@ucsjs/**/*.proto" : "./packages/**/*.proto");
        let directory = path.resolve((process.env.NODE_ENV == "prod") ? "./dist/**/*.proto" : "./src/**/*.proto");
        
        const files = await glob([directoryPackages, directory]);
        
        for await(let filename of files){
            const protoName = path.basename(filename);
            const root = await protobuf.load(path.resolve(filename));
            this.register(protoName, root);
        }
    }

    static register(key: string, root: protobuf.Root): void{
        const globalProto = GlobalProto.getInstance();
        globalProto.protos.set(key, root);
    }

    static retrieve(key: string): protobuf.Root | null{
        const globalProto = GlobalProto.getInstance();
        return (globalProto.protos.has(key))? globalProto.protos.get(key) : null;
    }
}