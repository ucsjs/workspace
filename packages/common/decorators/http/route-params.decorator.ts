//@see https://github.com/nestjs/nest/blob/eef670896a92ca144a8299a1d0c78c9842abe8d7/packages/common/decorators/http/route-params.decorator.ts

import { ROUTE_ARGS_METADATA } from "../../constants";
import { RouteParamtypes } from "../../enums";
import { Type } from "../../interfaces";
import { PipeTransform } from "../../interfaces/pipe-transform.interface";
import { isNil, isString } from "../../utils";

export type ParamData = object | string | number;

export interface RouteParamMetadata {
  index: number;
  data?: ParamData;
}

export function assignMetadata<TParamtype = any, TArgs = any>(
    args: TArgs,
    paramtype: TParamtype,
    index: number,
    data?: ParamData,
    ...pipes: (Type<PipeTransform> | PipeTransform)[]
) {
    return {
      ...args,
      [`${paramtype}:${index}`]: {
        index,
        data,
        pipes,
      },
    };
}

function createRouteParamDecorator(paramtype: RouteParamtypes) {
    return (data?: ParamData): ParameterDecorator =>
      (target, key, index) => {
        const args =
          Reflect.getMetadata(ROUTE_ARGS_METADATA, target.constructor, key) || {};
        Reflect.defineMetadata(
          ROUTE_ARGS_METADATA,
          assignMetadata<RouteParamtypes, Record<number, RouteParamMetadata>>(
            args,
            paramtype,
            index,
            data,
          ),
          target.constructor,
          key,
        );
    };
}

const createPipesRouteParamDecorator = (paramtype: RouteParamtypes) => (
    data?: any,
    ...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator =>
  (target, key, index) => {
    const args =
      Reflect.getMetadata(ROUTE_ARGS_METADATA, target.constructor, key) || {};
    const hasParamData = isNil(data) || isString(data);
    const paramData = hasParamData ? data : undefined;
    const paramPipes = hasParamData ? pipes : [data, ...pipes];

    Reflect.defineMetadata(
      ROUTE_ARGS_METADATA,
      assignMetadata(args, paramtype, index, paramData, ...paramPipes),
      target.constructor,
      key,
    );
};

export const Ip: () => ParameterDecorator = createRouteParamDecorator(
    RouteParamtypes.IP,
);

export const Session: () => ParameterDecorator = createRouteParamDecorator(
    RouteParamtypes.SESSION,
);

export function UploadedFile(): ParameterDecorator;

export function UploadedFile(
...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator;

export function UploadedFile(
fileKey?: string,
...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator;

export function UploadedFile(
    fileKey?: string | (Type<PipeTransform> | PipeTransform),
    ...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator {
    return createPipesRouteParamDecorator(RouteParamtypes.FILE)(
      fileKey,
      ...pipes,
    );
}

export function UploadedFiles(): ParameterDecorator;

export function UploadedFiles(
    ...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator;

export function UploadedFiles(
...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator {
    return createPipesRouteParamDecorator(RouteParamtypes.FILES)(
        undefined,
        ...pipes,
    );
}