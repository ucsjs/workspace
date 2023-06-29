import * as express from 'express';

import { IRouteSettings, RequestMappingMetadata, RouteSettingsDefault } from "../../interfaces";
import { PATH_METADATA, METHOD_METADATA, OPTIONS_METADATA } from "../../constants";
import { RequestMethod } from "../../enums";
import { Logger } from '../../services';
import { Injector } from '../core';

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

function getHandlerArgs(target:any, methodName: string, middlewares:[], req: express.Request, res: express.Response): any[] {
	if(middlewares && middlewares.length > 0){
		let sortedMiddlewares = sortByKey(middlewares, "index");

		const params = sortedMiddlewares.map((data: { key: string, index: number, middleware: Function }) => {
			return (methodName == data.key) ? data.middleware(req, res) : null;
		}).filter(item => item);

		return params;
	}
	else {
		return [];
	}
}

function processRequest(handler: Function, methodName: string, middlewares: [], options: IRouteSettings = RouteSettingsDefault) {
	return async (req: express.Request, res: express.Response) => {	
		try{
			const startTimeout = new Date().getTime();
			const args = getHandlerArgs(handler, methodName, middlewares, req, res);
			const buffer = await handler(...args);
			const endTimeout = new Date().getTime();
			
			if((typeof buffer === "string" && buffer.length > 0) || typeof buffer === "object") {
				if(options.raw){
					Logger.debug(`Request HTTP 200: ${req.path}`, "Server");
					res.status(200).send(buffer);
				}
				else {
					Logger.debug(`Request HTTP 200: ${req.path}`, "Server");

					res.status(200).send({ 
						status: 200, 
						processTimeout: (endTimeout - startTimeout) / 1000,
						data: buffer 
					});
				}
			}
			else
				res.status(204).end();
		}
		catch(e){
			Logger.error(`Request HTTP 500: ${req.path}`, "Server");
			res.status(500).send({ status: 500, message: e && e.message ? e.message : e }).end();
		}
	};
}

function sortByKey(list: any[], key: string): any[] {
	return list.sort((a, b) => {
	  const valueA = a[key];
	  const valueB = b[key];
	  
	  if (valueA < valueB) 
		return -1;
	  else if (valueA > valueB) 
		return 1;
	  else 
		return 0;
	});
}

export function createRouterFromController(controller): express.Router {
	const router = express.Router();
	const properties = Object.getOwnPropertyNames(controller.prototype);
	const prefixController = Reflect.getMetadata(PATH_METADATA, controller);

	if(properties){
		for (const property of properties) {
			if (typeof controller.prototype[property] === 'function' && property !== "constructor") {
				const routeMetadata = Reflect.getMetadata(PATH_METADATA, controller.prototype[property]);
				const methodMetadata = Reflect.getMetadata(METHOD_METADATA, controller.prototype[property]);
				const optionsMetadata = Reflect.getMetadata(OPTIONS_METADATA, controller.prototype[property]);
				const middlewares = Reflect.getMetadata('middlewares', controller);
							
				if (routeMetadata) {
					const methodName = property || "";
					const scope = Injector.inject(controller);
					
					if(scope[property]){
						const handler = scope[property]?.bind(scope);
						const path = "/" + prefixController + routeMetadata;
					
						Logger.log(`Listing route ${controller.name}::${RequestMethod[methodMetadata]} (${path})`, "Server");
		
						switch (methodMetadata) {
							case RequestMethod.GET: router.get(path, processRequest(handler, methodName, middlewares, optionsMetadata)); break;
							case RequestMethod.POST: router.post(path, processRequest(handler, methodName, middlewares, optionsMetadata)); break;
							case RequestMethod.PUT: router.put(path, processRequest(handler, methodName, middlewares, optionsMetadata)); break;
							case RequestMethod.PATCH: router.patch(path, processRequest(handler, methodName, middlewares, optionsMetadata)); break;
							case RequestMethod.DELETE: router.delete(path, processRequest(handler, methodName, middlewares, optionsMetadata)); break;
							case RequestMethod.HEAD: router.head(path, processRequest(handler, methodName, middlewares, optionsMetadata)); break;
						}
					}
					else{
						Logger.error(`Method ${property} does not exist in the context of controller ${controller.name}`, "HTTP Decorator");
					}					
				}
			}
		}
	}
	
	return router;
}