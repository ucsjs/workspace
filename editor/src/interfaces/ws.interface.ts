interface Type {
    [keys: string]: number;
}

export interface IWsCall {
    contract: string;
    index: number;
    types: Type
}

export class WsCall {
    contract: number = 0;
    message: number = 0;
    data: Uint8Array = new Uint8Array();
}