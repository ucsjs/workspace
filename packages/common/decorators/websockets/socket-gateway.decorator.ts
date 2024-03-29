//@see https://github.com/nestjs/nest/blob/eef670896a92ca144a8299a1d0c78c9842abe8d7/packages/websockets/decorators/socket-gateway.decorator.ts

import { GATEWAY_METADATA, GATEWAY_OPTIONS, PORT_METADATA } from '../../constants';
import { GatewayMetadata } from '../../interfaces';

export function WebSocketGateway(port?: number): ClassDecorator;

export function WebSocketGateway<
  T extends Record<string, any> = GatewayMetadata,
>(options?: T): ClassDecorator;

export function WebSocketGateway<
  T extends Record<string, any> = GatewayMetadata,
>(port?: number, options?: T): ClassDecorator;

export function WebSocketGateway<
  T extends Record<string, any> = GatewayMetadata,
>(portOrOptions?: number | T, options?: T): ClassDecorator {
    const isPortInt = Number.isInteger(portOrOptions as number);

    // eslint-disable-next-line prefer-const
    let [port, opt] = isPortInt ? [portOrOptions, options] : [0, portOrOptions];

    opt = opt || ({} as T);

    return (target: object) => {
        Reflect.defineMetadata(GATEWAY_METADATA, true, target);
        Reflect.defineMetadata(PORT_METADATA, port, target);
        Reflect.defineMetadata(GATEWAY_OPTIONS, opt, target);
    };
}