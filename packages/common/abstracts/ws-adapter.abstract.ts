//@see https://github.com/nestjs/nest/blob/master/packages/websockets/adapters/ws-adapter.ts#L13

import { Observable } from "rxjs";
import { CONNECTION_EVENT, DISCONNECT_EVENT } from "../constants";
import { WebSocketAdapter, WsMessageHandler } from "../interfaces";
import { UCSApplication } from "../application";
import { isFunction } from "../utils";
import { AbstractHttpAdapter } from "./http-adapter.abstract";

export interface BaseWsInstance {
    on: (event: string, callback: Function) => void;
    close: Function;
}
  
export abstract class AbstractWsAdapter<
    TServer extends BaseWsInstance = any,
    TClient extends BaseWsInstance = any,
    TOptions = any,
> implements WebSocketAdapter<TServer, TClient, TOptions>
{
    protected readonly httpServer: any;

    constructor(appOrHttpServer?: any) {
        if (appOrHttpServer && appOrHttpServer instanceof UCSApplication)
            this.httpServer = appOrHttpServer.getUnderlyingHttpServer();
        else 
            this.httpServer = appOrHttpServer;
    }

    public bindCustomMessageHandler(server: any, callback: Function) {
        throw new Error("Method not implemented.");
    }

    public bindClientConnect(server: TServer, callback: Function) {
        server.on(CONNECTION_EVENT, callback);
    }

    public bindClientDisconnect(client: TClient, callback: Function) {
        client.on(DISCONNECT_EVENT, callback);
    }

    public async close(server: TServer) {
        const isCallable = server && isFunction(server.close);
        isCallable && (await new Promise(resolve => server.close(resolve)));
    }

    public async dispose() {}

    public abstract create(server: AbstractHttpAdapter, options?: TOptions): TServer;

    public abstract bindMessageHandlers(
        client: TClient,
        handlers: WsMessageHandler[],
        transform: (data: any) => Observable<any>,
    );
}