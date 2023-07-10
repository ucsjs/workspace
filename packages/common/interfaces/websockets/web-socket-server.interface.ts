//@see https://github.com/nestjs/nest/blob/eef670896a92ca144a8299a1d0c78c9842abe8d7/packages/websockets/interfaces/web-socket-server.interface.ts

export interface WebSocketServerOptions {
    port: number;
    namespace: string;
}