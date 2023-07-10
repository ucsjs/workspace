import { Injectable, Logger } from "@ucsjs/common";
import { GlobalProto } from "../utils";

@Injectable()
export class ProtobufService {
    public async generateBuffer(
        protoFile: string,
        namespace: string,
        data: any
    ): Promise<Uint8Array> {
        try{
            const root = GlobalProto.retrieve(protoFile);

            if(root) {
                const Schema = root.lookupType(namespace);
                const message = Schema.fromObject(data);
                const buffer = Schema.encode(message).finish();
                return buffer;
            }
            else {
                return null;
            }
        }
        catch (e) { 
            Logger.error(e.message, "ProtobufService");
            return null;
        }
    }
}