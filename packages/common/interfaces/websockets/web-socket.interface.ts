//@see https://github.com/nestjs/nest/blob/master/packages/common/interfaces/websockets/web-socket-adapter.interface.ts

import { Observable } from 'rxjs';
import { AbstractHttpAdapter } from '../../abstracts';

export interface WsMessageHandler<T = string> {
    message: T;
    callback: (...args: any[]) => Observable<any> | Promise<any>;
}

export interface WebSocketAdapter<
  TServer = any,
  TClient = any,
  TOptions = any,
> {
    create(httpServer: AbstractHttpAdapter, options?: TOptions): TServer;
    bindClientConnect(server: TServer, callback: Function): any;
    bindClientDisconnect?(client: TClient, callback: Function): any;
    bindMessageHandlers(
        client: TClient,
        handlers: WsMessageHandler[],
        transform: (data: any) => Observable<any>,
    ): any;
    close(server: TServer): any;
}