//@see https://docs.nestjs.com/websockets/adapter

import * as WebSocket from 'ws';
import { Observable, fromEvent, EMPTY } from 'rxjs';
import { mergeMap, filter } from 'rxjs/operators';

import { MessageMappingProperties, WebSocketAdapter } from "../interfaces";
import { UCSApplication } from '../application';
import { AbstractHttpAdapter } from '../abstracts';

export class WsAdapter implements WebSocketAdapter {
    constructor(private app: UCSApplication) {}

    create(server: AbstractHttpAdapter, options?: any): any {
        return new WebSocket.Server({ 
            server: server.getHttpServer(), 
            perMessageDeflate: {
                zlibDeflateOptions: {
                    chunkSize: 1024,
                    memLevel: 7,
                    level: 3
                },
                serverMaxWindowBits: 10, 
                concurrencyLimit: 10
            },
            ...options 
        });
    }

    bindClientConnect(server, callback: Function) {
        server.on('connection', callback);
    }

    bindCustomMessageHandler(server, callback: Function){
        server.on('message', callback);
    }

    bindMessageHandlers(
        client: WebSocket,
        handlers: MessageMappingProperties[],
        process: (data: any) => Observable<any>,
      ) {
        fromEvent(client, 'message')
          .pipe(
            mergeMap(data => this.bindMessageHandler(data, handlers, process)),
            filter(result => result),
          )
          .subscribe(response => client.send(JSON.stringify(response)));
    }

    bindMessageHandler(
        buffer,
        handlers: MessageMappingProperties[],
        process: (data: any) => Observable<any>,
    ): Observable<any> {
        const message = JSON.parse(buffer.data);
        
        const messageHandler = handlers.find(
          handler => handler.message === message.event,
        );

        if (!messageHandler) 
            return EMPTY;
        
        return process(messageHandler.callback(message.data));
    }

    close(server) {
        server.close();
    }
}