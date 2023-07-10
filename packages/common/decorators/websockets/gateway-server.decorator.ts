//@see https://github.com/nestjs/nest/blob/eef670896a92ca144a8299a1d0c78c9842abe8d7/packages/websockets/decorators/gateway-server.decorator.ts

import { GATEWAY_SERVER_METADATA } from '../../constants';

export const WebSocketServer = (): PropertyDecorator => {
    return (target: object, propertyKey: string | symbol) => {
        Reflect.set(target, propertyKey, null);
        Reflect.defineMetadata(GATEWAY_SERVER_METADATA, true, target, propertyKey);
    };
};