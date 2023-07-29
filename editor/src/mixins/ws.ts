import { plainToClass } from 'class-transformer';
import { IWsCall, WsCall } from "@/interfaces/ws.interface";
import * as protobuf from "protobufjs";
import { Subject } from "rxjs";

import { API } from "./api";

export class WS extends API {
    static socket: any = null;
    static connectionId: string = "";
    static events = new Map<string, Subject<any>>;
    static contracts = new Map<string, protobuf.Root>;
    static index = new Map<string, IWsCall>;
    static indexReverse = new Array<IWsCall>;
    
    async created(){
        if(!this.authStorage.getToken())
            this.auth();

        const { contracts, index } = await this.getFromApi("/proto"); 

        for(let contractName in contracts){
            WS.contracts.set(
                contractName, 
                protobuf.parse(contracts[contractName], { keepCase: true }).root
            );
        }

        for(let contractName in index){
            WS.index.set(contractName, index[contractName]);
            WS.indexReverse.push({
                contract: contractName,
                ...index[contractName]
            });
        }
               
        WS.socket = new WebSocket(
            window.location.href.            
            replace("https", "wss").
            replace("http", "ws")
        );

        WS.socket.addEventListener("message", this.parseMessage);
        WS.socket.binaryType = 'arraybuffer';
    }

    static subscriber(key: string, callback: Function){
        if(!WS.events.has(key))
            WS.events.set(key, new Subject<any>());
        
        let event = WS.events.get(key);
        event?.subscribe({ next: (v) => callback(v) });
    }

    parseMessage(event){
        //try{
            if(this.isUUID(event.data)){
                WS.connectionId = new TextDecoder("utf-8").decode(event.data);

                const buffer = WS.pack("auth", "auth.Login", {
                    uuid: WS.connectionId,
                    token: this.authStorage.getToken()
                });                

                if(buffer)
                    WS.send(new Uint8Array(buffer));
            }
            else {
                
                const messageRaw = plainToClass(WsCall, this.parseBuffer(event.data));
                const contractIndex = WS.indexReverse[messageRaw.contract];
                const contract = WS.contracts.get(contractIndex.contract);
                let messageName = "";
                let data: protobuf.Message<{}> | null = null;

                for(let key in contractIndex.types) {
                    if(contractIndex.types[key] === messageRaw.message) {
                        messageName = key;
                        break;
                    }
                }
                console.log(messageRaw);

                if(messageRaw.data && messageRaw.data && messageRaw.data.length > 0){
                    const message = contract?.lookupType(`${contractIndex.contract}.${messageName}`);
                    data = (message) ? message.decode(messageRaw.data) : null;
                }

                console.log(WS.events);
                
                if(WS.events.has(`${contractIndex.contract}.${messageName}`))
                    WS.events.get(`${contractIndex.contract}.${messageName}`)?.next(data);
            }
        /*}
        catch(err){
            console.error(err);
        } */           
    }

    parseBuffer(buffer): protobuf.Message<{}> | undefined {
        try{
            return WS.contracts.get("ws")?.
            lookupType("ws.Call").
            decode(new Uint8Array(buffer));
        }
        catch(err){
            return undefined;
            console.error(err);
        }
    }

    static pack(contractName: string, messageName: string, data?: any): Uint8Array | null {
        if(this.contracts.has(contractName) && this.index.has(contractName)) {
            const contractIndex = this.index.get(contractName);
            const typeIndex = contractIndex?.types[messageName.replace(contractName + ".", "")];
            const contract = this.contracts.get(contractName);
            const message = contract?.lookupType(messageName);
            const dataBuffer = (message && data) ? message.encode(data).finish() : null;
            const wsCall = this.contracts.get("ws");
            const wsMessage = wsCall?.lookupType("ws.Call");

            const buffer = wsMessage?.encode({
                contract: contractIndex?.index,
                message: typeIndex,
                data: (dataBuffer && dataBuffer instanceof Uint8Array) ? dataBuffer : new Uint8Array()
            }).finish();

            return (buffer) ? new Uint8Array(buffer) : null;
        }
        else{
            console.error(`Not found in contract list ${contractName}.${messageName}`);
            return null;
        }
    }

    static send(buffer: Uint8Array | null) :boolean{
        if(WS.socket && WS.socket.readyState == WebSocket.OPEN && buffer) {
            WS.socket.send(buffer);
            return true;
        }
        else {
            return false;
        }
    }

    isUUID(eventData: ArrayBuffer){
        const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        const enc = new TextDecoder("utf-8");
        return uuidV4Regex.test(enc.decode(eventData));
    }

    numberToByte(number: number){
        const len = Math.ceil(Math.log2(number) / 8);
        const byteArray = new Uint8Array(len);

        for (let index = 0; index < byteArray.length; index++) {
            const byte = number & 0xff;
            byteArray[index] = byte;
            number = (number - byte) / 256;
        }

        return byteArray;
    }

    byteToNumber(byteArray){
        let result = 0;

        for (let i = byteArray.length - 1; i >= 0; i--) 
            result = (result * 256) + byteArray[i];
                
        return result;
    }
}