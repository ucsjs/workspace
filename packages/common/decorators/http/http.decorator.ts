import * as express from 'express';

import { IRouteSettings, RequestMappingMetadata, RouteSettingsDefault } from "../../interfaces";
import { PATH_METADATA, METHOD_METADATA, OPTIONS_METADATA } from "../../constants";
import { RequestMethod } from "../../enums";

export const RequestMapping = (metadata: RequestMappingMetadata = { [PATH_METADATA]: '/', [METHOD_METADATA]: RequestMethod.GET, [OPTIONS_METADATA]: {} }): MethodDecorator => {
	const pathMetadata = metadata[PATH_METADATA];
	const path = pathMetadata && pathMetadata.length ? pathMetadata : '/';
	const requestMethod = metadata[METHOD_METADATA] || RequestMethod.GET;
	const options = metadata[OPTIONS_METADATA] || {};
  
	return (
	  target: object,
	  key: string | symbol,
	  descriptor: TypedPropertyDescriptor<any>,
	) => {
		Reflect.defineMetadata(PATH_METADATA, path, descriptor.value);
		Reflect.defineMetadata(METHOD_METADATA, requestMethod, descriptor.value);
		Reflect.defineMetadata(OPTIONS_METADATA, options, descriptor.value);
		return descriptor;
	};
};

const createMappingDecorator = (method: RequestMethod) =>
  (path?: string | string[], options?: IRouteSettings): MethodDecorator => {
    return RequestMapping({
      [PATH_METADATA]: path,
      [METHOD_METADATA]: method,
	  [OPTIONS_METADATA]: options,
    });
};

export const Get = createMappingDecorator(RequestMethod.GET);
export const Post = createMappingDecorator(RequestMethod.POST);
export const Put = createMappingDecorator(RequestMethod.PUT);
export const Delete = createMappingDecorator(RequestMethod.DELETE);
export const Patch = createMappingDecorator(RequestMethod.PATCH);
export const Options = createMappingDecorator(RequestMethod.OPTIONS);
export const Head = createMappingDecorator(RequestMethod.HEAD);
export const All = createMappingDecorator(RequestMethod.ALL);

export const Param = (param: string): ParameterDecorator => {
	return (target: any, key: string | symbol, index: number) => {
	  const middleware = (req: express.Request) => req.params[param];
	  addRouteMiddleware(target, key, index, middleware);
	};
};

export const Params = (param: string): ParameterDecorator => {
	return (target: any, key: string | symbol, index: number) => {
	  const middleware = (req: express.Request) => req.params;
	  addRouteMiddleware(target, key, index, middleware);
	};
};

export const Querys = (param: string): ParameterDecorator => {
	return (target: any, key: string | symbol, index: number) => {
	  const middleware = (req: express.Request) => req.query;
	  addRouteMiddleware(target, key, index, middleware);
	};
};

export const Query = (param: string): ParameterDecorator => {
	return (target: any, key: string | symbol, index: number) => {
	  const middleware = (req: express.Request) => req.query[param];
	  addRouteMiddleware(target, key, index, middleware);
	};
};

export const Headers = (param: string): ParameterDecorator => {
	return (target: any, key: string | symbol, index: number) => {
	  const middleware = (req: express.Request) => req.headers[param];
	  addRouteMiddleware(target, key, index, middleware);
	};
};

export const Body = (): ParameterDecorator => {
	return (target: any, key: string | symbol, index: number) => {
		const middleware = (req: express.Request) => req.body;
		addRouteMiddleware(target, key, index, middleware);
	};
};

export function Header(name: string, value: string): MethodDecorator {
	return (target: any, key: string | symbol) => {
		const middleware = (req: express.Request, res: express.Response) => res.setHeader(name, value);
		addRouteMiddleware(target, key, 0, middleware);
	};
}

export const Request = (): ParameterDecorator => {
	return (target: any, key: string | symbol, index: number) => {
	  const middleware = (req: express.Request) => req;
	  addRouteMiddleware(target, key, index, middleware);
	};
};

export const Response = (): ParameterDecorator => {
	return (target: any, key: string | symbol, index: number) => {
	  const middleware = (req: express.Request, res: express.Response) => res;
	  addRouteMiddleware(target, key, index, middleware);
	};
};

function addRouteMiddleware(target: any, key: string | symbol, index: number, middleware: (req: express.Request, res: express.Response) => any) {
	if (!Reflect.hasMetadata('middlewares', target.constructor)) 
	  Reflect.defineMetadata('middlewares', [], target.constructor);
	  
	const middlewares = Reflect.getMetadata('middlewares', target.constructor) as any[];
	middlewares.push({ key, index, middleware });
	Reflect.defineMetadata('middlewares', middlewares, target.constructor);
}