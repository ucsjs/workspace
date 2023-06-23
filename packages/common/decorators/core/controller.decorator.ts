import { PATH_METADATA, HOST_METADATA, SCOPE_OPTIONS_METADATA } from "../../constants";
import { ControllerOptions } from "../../interfaces";
import { isUndefined, isString } from "../../utils";

export function Controller(): ClassDecorator;

export function Controller(prefix: string | string[]): ClassDecorator;

export function Controller(options: ControllerOptions): ClassDecorator;

export function Controller(prefixOrOptions?: string | string[] | ControllerOptions): ClassDecorator {
	const defaultPath = '/';
  
	const [path, host, scopeOptions] = isUndefined(prefixOrOptions)
	  ? [defaultPath, undefined, undefined, undefined]
	  : isString(prefixOrOptions) || Array.isArray(prefixOrOptions)
	  ? [prefixOrOptions, undefined, undefined, undefined]
	  : [
		  prefixOrOptions.path || defaultPath,
		  prefixOrOptions.host,
		  { scope: prefixOrOptions.scope, durable: prefixOrOptions.durable },
		  Array.isArray(prefixOrOptions.version)
			? Array.from(new Set(prefixOrOptions.version))
			: prefixOrOptions.version,
		];
  
	return (target: object) => {
		Reflect.defineMetadata(PATH_METADATA, path, target);
		Reflect.defineMetadata(HOST_METADATA, host, target);
		Reflect.defineMetadata(SCOPE_OPTIONS_METADATA, scopeOptions, target);
	};
}