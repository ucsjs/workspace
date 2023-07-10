//@see https://github.com/nestjs/nest/blob/master/packages/core/router/interfaces/exclude-route-metadata.interface.ts

import { RequestMethod } from '../../enums';

export interface ExcludeRouteMetadata {
    path: string;
    pathRegex: RegExp;
    requestMethod: RequestMethod;
}