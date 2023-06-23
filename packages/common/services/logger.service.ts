//@see https://github.com/ucsjs/ucsjs/blob/main/packages/common/services/logger.service.ts

import { isObject } from "../utils";
import { Singleton } from "../abstracts";
import { ILoggerService, LogBufferRecord } from "../interfaces";
import { ConsoleLogger } from "./console-logger.service";

export type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose';
const DEFAULT_LOGGER = new ConsoleLogger();

export class Logger extends Singleton implements ILoggerService {
    protected static staticInstanceRef?: ILoggerService = DEFAULT_LOGGER;
    protected static logLevels?: LogLevel[];
    protected context?: string;
    protected options: { timestamp?: boolean } = {};
    protected localInstanceRef: ILoggerService;
    private static isBufferAttached: boolean;
    protected static logBuffer = new Array<LogBufferRecord>();

    get localInstance(): ILoggerService {
        if (Logger.staticInstanceRef === DEFAULT_LOGGER) {
			return this.registerLocalInstanceRef();
        } 
		else if (Logger.staticInstanceRef instanceof Logger) {
			const prototype = Object.getPrototypeOf(Logger.staticInstanceRef);

			if (prototype.constructor === Logger) 
				return this.registerLocalInstanceRef();          
        }

        return Logger.staticInstanceRef;
    }
    
    error(message: any, stack?: string, context?: string): void;
    error(message: any, ...optionalParams: [...any, string?, string?]): void;
    error(message: any, ...optionalParams: any[]) {
        optionalParams = this.context
          ? optionalParams.concat(this.context)
          : optionalParams;
    
        this.localInstance?.error(message, ...optionalParams);
    }

    log(message: any, context?: string): void;
    log(message: any, ...optionalParams: [...any, string?]): void;
    log(message: any, ...optionalParams: any[]) {
        optionalParams = this.context
        ? optionalParams.concat(this.context)
        : optionalParams;
        this.localInstance?.log(message, ...optionalParams);
    }

    warn(message: any, context?: string): void;
    warn(message: any, ...optionalParams: [...any, string?]): void;
    warn(message: any, ...optionalParams: any[]) {
        optionalParams = this.context
        ? optionalParams.concat(this.context)
        : optionalParams;
        this.localInstance?.warn(message, ...optionalParams);
    }

    debug(message: any, context?: string): void;
    debug(message: any, ...optionalParams: [...any, string?]): void;
    debug(message: any, ...optionalParams: any[]) {
        optionalParams = this.context
        ? optionalParams.concat(this.context)
        : optionalParams;
        this.localInstance?.debug?.(message, ...optionalParams);
    }

    verbose(message: any, context?: string): void;
    verbose(message: any, ...optionalParams: [...any, string?]): void;
    verbose(message: any, ...optionalParams: any[]) {
        optionalParams = this.context
        ? optionalParams.concat(this.context)
        : optionalParams;
        this.localInstance?.verbose?.(message, ...optionalParams);
    }

    static log(message: any, context?: string): void;
    static log(message: any, ...optionalParams: [...any, string?]): void;
    static log(message: any, ...optionalParams: any[]) {
        this.staticInstanceRef?.log(message, ...optionalParams);
    }

    static warn(message: any, context?: string): void;
    static warn(message: any, ...optionalParams: [...any, string?]): void;
    static warn(message: any, ...optionalParams: any[]) {
      this.staticInstanceRef?.warn(message, ...optionalParams);
    }

    static debug(message: any, context?: string): void;
    static debug(message: any, ...optionalParams: [...any, string?]): void;
    static debug(message: any, ...optionalParams: any[]) {
        this.staticInstanceRef?.debug?.(message, ...optionalParams);
    }

    static verbose(message: any, context?: string): void;
    static verbose(message: any, ...optionalParams: [...any, string?]): void;
    static verbose(message: any, ...optionalParams: any[]) {
        this.staticInstanceRef?.verbose?.(message, ...optionalParams);
    }

    static error(message: any, context?: string): void;
    static error(message: any, ...optionalParams: [...any, string?]): void;
    static error(message: any, ...optionalParams: any[]) {
        this.staticInstanceRef?.error?.(message, ...optionalParams);
    }

    static flush() {
        this.isBufferAttached = false;

        this.logBuffer.forEach(item =>
          item.methodRef(...(item.arguments as [string])),
        );

        this.logBuffer = [];
    }

    static attachBuffer() {
        this.isBufferAttached = true;
    }

    static detachBuffer() {
        this.isBufferAttached = false;
    }

    static getTimestamp() {
        const localeStringOptions = {
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            day: '2-digit',
            month: '2-digit',
        };
		
        return new Date(Date.now()).toLocaleString(
            undefined,
            localeStringOptions as Intl.DateTimeFormatOptions,
        );
    }

    private registerLocalInstanceRef() {
        if (this.localInstanceRef) 
          return this.localInstanceRef;
        
        this.localInstanceRef = new ConsoleLogger(this.context, {
          timestamp: this.options?.timestamp,
          logLevels: Logger.logLevels,
        });

        return this.localInstanceRef;
    }

    static overrideLogger(logger: ILoggerService | LogLevel[] | boolean) {
        if (Array.isArray(logger)) {
          Logger.logLevels = logger;
          return this.staticInstanceRef?.setLogLevels(logger);
        }

        if (isObject(logger)) {

          if (logger instanceof Logger && logger.constructor !== Logger) {
            const errorMessage = `Using the "extends Logger" instruction is not allowed in Nest v8. Please, use "extends ConsoleLogger" instead.`;
            this.staticInstanceRef.error(errorMessage);
            throw new Error(errorMessage);
          }

          this.staticInstanceRef = logger as ILoggerService;
        } 
        else {
          this.staticInstanceRef = undefined;
        }
    }
}