//@see https://github.com/nestjs/nest/blob/master/packages/common/interfaces/middleware/middleware-configuration.interface.ts

import { RequestMethod } from '../../enums';
import { Type } from '../type.interface';
import { VersionValue } from '../version.interface';

export interface RouteInfo {
    path: string;
    method: RequestMethod;
    version?: VersionValue;
}

export interface MiddlewareConfiguration<T = any> {
    middleware: T;
    forRoutes: (Type<any> | string | RouteInfo)[];
}