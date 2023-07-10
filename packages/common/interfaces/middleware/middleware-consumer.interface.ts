//@see https://github.com/nestjs/nest/blob/master/packages/common/interfaces/middleware/middleware-consumer.interface.ts

import { Type } from '../type.interface';
import { MiddlewareConfigProxy } from './middleware-config-proxy.interface';

export interface MiddlewareConsumer {
    apply(...middleware: (Type<any> | Function)[]): MiddlewareConfigProxy;
}