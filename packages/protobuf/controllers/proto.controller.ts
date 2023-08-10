import { Controller, Get, Param } from "@ucsjs/common";
import { Cache, CacheModule, GlobalModules } from "@ucsjs/core";

import { GlobalProto } from "../utils";

@Controller("proto")
export class ProtobufController {
    @Get()
    @Cache("Proto::all")
    async getAllProto(){
        const contracts = GlobalProto.retrieveAll();
        let contractsJSON = {};
        let index = {};
        let pointer = 0;

        for(let key in contracts){
            const contract = GlobalProto.retrieve(key);
            contractsJSON[key] = contract.toJSON();
            let types = {};
            let pointerTypes = 0;

            for(let namespace of contract.nestedArray){
                for(let type in namespace.toJSON().nested){
                    types[type] = pointerTypes;   
                    pointerTypes++;
                }                                 
            }
            
            index[key] = { index: pointer, types };
            pointer++;
        }

        const data = {
            index,
            contracts: contractsJSON
        };

        await GlobalModules.retrieve(CacheModule)?.set("Proto::all", data);
        
        return data;
    }

    @Get("/:key")
    getProto(@Param("key") key: string){
        return GlobalProto.retrieve(key).toJSON();
    }
}