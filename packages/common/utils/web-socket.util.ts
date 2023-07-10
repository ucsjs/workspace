//@see https://github.com/nestjs/nest/blob/master/packages/websockets/utils/param.utils.ts

import { PipeTransform, Type } from '../interfaces';
import { assignMetadata } from '../decorators';
import { isNil, isString } from './shared.utils';
import 'reflect-metadata';
import { PARAM_ARGS_METADATA } from '../constants';
import { WsParamtype } from '../enums';

export function createWsParamDecorator(
	paramtype: WsParamtype,
  ): (...pipes: (Type<PipeTransform> | PipeTransform)[]) => ParameterDecorator {
	return (...pipes: (Type<PipeTransform> | PipeTransform)[]) =>
	  (target, key, index) => {
		const args =
		  Reflect.getMetadata(PARAM_ARGS_METADATA, target.constructor, key) || {};
		Reflect.defineMetadata(
		  PARAM_ARGS_METADATA,
		  assignMetadata(args, paramtype, index, undefined, ...pipes),
		  target.constructor,
		  key,
		);
	  };
  }
  
  export const createPipesWsParamDecorator =
	(paramtype: WsParamtype) =>
	(
	  data?: any,
	  ...pipes: (Type<PipeTransform> | PipeTransform)[]
	): ParameterDecorator =>
	(target, key, index) => {
	  const args =
		Reflect.getMetadata(PARAM_ARGS_METADATA, target.constructor, key) || {};
	  const hasParamData = isNil(data) || isString(data);
	  const paramData = hasParamData ? data : undefined;
	  const paramPipes = hasParamData ? pipes : [data, ...pipes];
  
	  Reflect.defineMetadata(
		PARAM_ARGS_METADATA,
		assignMetadata(args, paramtype, index, paramData, ...paramPipes),
		target.constructor,
		key,
	  );
	};