//@see https://github.com/nestjs/nest/blob/master/packages/common/interfaces/global-prefix-options.interface.ts

import { RouteInfo } from './middleware';

export interface GlobalPrefixOptions<T = string | RouteInfo> {
    exclude?: T[];
}