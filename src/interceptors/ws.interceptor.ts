import { plainToClass } from 'class-transformer';
import { AbstractHttpAdapter, ExpressAdapter, Logger } from '@ucsjs/common';
import { GlobalProto } from "@ucsjs/protobuf";
import { WSCall } from "@interfaces";

export class WSInterceptor{
    public static intercept(server: AbstractHttpAdapter, socket, event){
        try{
            const message = plainToClass(WSCall, GlobalProto.
                retrieve("ws")?.
                lookupType("ws.Call").
                decode(event)
            );
            
            const contract = GlobalProto.retrieveByIndex(message.contract);
            const contractName = GlobalProto.retrieveContractName(message.contract);
    
            if(contract){
                const typeName = GlobalProto.retrieveTypes(message.contract, message.message);
                const realMessage = contract.lookupType(typeName).decode(message.data);
                    
                if(server instanceof ExpressAdapter)
                    (server as ExpressAdapter).emit(`${contractName}.${typeName}`, realMessage, socket);
            }
        }
        catch(err){
            Logger.error(err.message);
        }
    }
}