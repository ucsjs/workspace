//@see https://github.com/nestjs/nest/blob/eef670896a92ca144a8299a1d0c78c9842abe8d7/packages/websockets/decorators/subscribe-message.decorator.ts

import { MESSAGE_MAPPING_METADATA, MESSAGE_METADATA } from '../../constants';

export const SubscribeMessage = <T = string>(message: T): MethodDecorator => {
    return (
        target: object,
        key: string | symbol,
        descriptor: PropertyDescriptor,
    ) => {
        Reflect.defineMetadata(MESSAGE_MAPPING_METADATA, true, descriptor.value);
        Reflect.defineMetadata(MESSAGE_METADATA, message, descriptor.value);
        return descriptor;
    };
};