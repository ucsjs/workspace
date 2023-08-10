import { Injectable } from "@ucsjs/common";
import { GlobalProto } from "../utils/global-proto.util";

@Injectable()
export class WsService {
    public async pack(contractName: string, messageName: string, data?: any): Promise<Uint8Array | null> {
        return new Promise((resolve, reject) => {
            try{
                const index = GlobalProto.retrieveIndex(contractName);
                const contract = GlobalProto.retrieve(contractName)?.lookupType(messageName);
                const typeName = GlobalProto.retrieveTypes(contractName, messageName.replace(contractName + ".", ""));
                const dataBuffer = (contract) ? contract.encode(data).finish() : null;
                const buffer = GlobalProto.retrieve("ws").lookupType("ws.Call").encode({
                    contract: index,
                    message: typeName,
                    data: (dataBuffer) ? dataBuffer: new Uint8Array()
                }).finish();

                resolve(buffer);
            }
            catch(err){
                console.error(err);
                reject(err);
            }
        });
    }
}