import { LogLevel } from "../services";

export interface ILoggerService {
    log(message: any, ...optionalParams: any[]): any;
    error(message: any, ...optionalParams: any[]): any;
    warn(message: any, ...optionalParams: any[]): any;
    debug?(message: any, ...optionalParams: any[]): any;
    verbose?(message: any, ...optionalParams: any[]): any;
    setLogLevels?(levels: LogLevel[]): any;
}

export interface LogBufferRecord {
    methodRef: Function;
    arguments: unknown[];
}