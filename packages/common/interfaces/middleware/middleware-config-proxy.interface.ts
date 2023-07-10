//@see https://github.com/nestjs/nest/blob/master/packages/common/interfaces/middleware/middleware-config-proxy.interface.ts

import { Type } from '../type.interface';
import { RouteInfo } from './middleware-configuration.interface';
import { MiddlewareConsumer } from './middleware-consumer.interface';

export interface MiddlewareConfigProxy {
    exclude(...routes: (string | RouteInfo)[]): MiddlewareConfigProxy;
    forRoutes(...routes: (string | Type<any> | RouteInfo)[]): MiddlewareConsumer;
}