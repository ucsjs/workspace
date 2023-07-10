//@see https://github.com/nestjs/nest/blob/eef670896a92ca144a8299a1d0c78c9842abe8d7/packages/websockets/interfaces/gateway-metadata.interface.ts

import { Observable } from 'rxjs';

import { CorsOptions } from '../external/cors-options.interface';

export interface MessageMappingProperties {
    message: any;
    methodName: string;
    callback: (...args: any[]) => Observable<any> | Promise<any> | any;
}

export interface GatewayMetadata {
    namespace?: string | RegExp;
    path?: string;
    serveClient?: boolean;
    adapter?: any;
    parser?: any;
    connectTimeout?: number;
    pingTimeout?: number;
    pingInterval?: number;
    upgradeTimeout?: number;
    maxHttpBufferSize?: number;
    allowRequest?: (
        req: any,
        fn: (err: string | null | undefined, success: boolean) => void,
    ) => void;
    transports?: Array<'polling' | 'websocket'>;
    allowUpgrades?: boolean;
    perMessageDeflate?: boolean | object;
    httpCompression?: boolean | object;
    wsEngine?: string;
    initialPacket?: any;
    cookie?: any | boolean;
    cors?: CorsOptions;
    allowEIO3?: boolean;
    destroyUpgrade?: boolean;
    destroyUpgradeTimeout?: number;
}