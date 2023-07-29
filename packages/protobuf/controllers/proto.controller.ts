import { Controller, Get, Param } from "@ucsjs/common";
import { Cache } from "@ucsjs/core";

import { GlobalProto } from "../utils";

@Controller("proto")
export class ProtobufController {
    @Get()
    @Cache("Proto::all")
    getAllProto(){
        const contracts = GlobalProto.retrieveAll();
        let index = {};
        let pointer = 0;

        for(let key in contracts){
            const contract = GlobalProto.retrieve(key);
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
        
        return {
            index,
            contracts
        }
    }

    @Get("/:key")
    getProto(@Param("key") key: string){
        return GlobalProto.retrieveContract(key);
    }
}