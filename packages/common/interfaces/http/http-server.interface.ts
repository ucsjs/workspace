//@see https://github.com/nestjs/nest/blob/master/packages/common/interfaces/http/http-server.interface.ts

import { RequestMethod } from '../../enums';

import {
  CorsOptions,
  CorsOptionsDelegate,
} from '../../interfaces/external/cors-options.interface';

import { VersioningOptions, VersionValue } from '../version.interface';

export type ErrorHandler<TRequest = any, TResponse = any> = (
  error: any,
  req: TRequest,
  res: TResponse,
  next?: Function,
) => any;
export type RequestHandler<TRequest = any, TResponse = any> = (
  req: TRequest,
  res: TResponse,
  next?: Function,
) => any;

export interface HttpServer<
  TRequest = any,
  TResponse = any,
  ServerInstance = any,
> {
    use(
        handler:
        | RequestHandler<TRequest, TResponse>
        | ErrorHandler<TRequest, TResponse>,
    ): any;
    use(
        path: string,
        handler:
        | RequestHandler<TRequest, TResponse>
        | ErrorHandler<TRequest, TResponse>,
    ): any;
    
    get(handler: RequestHandler<TRequest, TResponse>): any;
    get(path: string, handler: RequestHandler<TRequest, TResponse>): any;
    post(handler: RequestHandler<TRequest, TResponse>): any;
    post(path: string, handler: RequestHandler<TRequest, TResponse>): any;
    head(handler: RequestHandler<TRequest, TResponse>): any;
    head(path: string, handler: RequestHandler<TRequest, TResponse>): any;
    delete(handler: RequestHandler<TRequest, TResponse>): any;
    delete(path: string, handler: RequestHandler<TRequest, TResponse>): any;
    put(handler: RequestHandler<TRequest, TResponse>): any;
    put(path: string, handler: RequestHandler<TRequest, TResponse>): any;
    patch(handler: RequestHandler<TRequest, TResponse>): any;
    patch(path: string, handler: RequestHandler<TRequest, TResponse>): any;
    all(path: string, handler: RequestHandler<TRequest, TResponse>): any;
    all(handler: RequestHandler<TRequest, TResponse>): any;
    options(handler: RequestHandler<TRequest, TResponse>): any;
    options(path: string, handler: RequestHandler<TRequest, TResponse>): any;
    listen(port: number | string, callback?: () => void): any;
    listen(port: number | string, hostname: string, callback?: () => void): any;
    status(response: any, statusCode: number): any;
    end(response: any, message?: string): any;
    render(response: any, view: string, options: any): any;
    redirect(response: any, statusCode: number, url: string): any;
    setHeader(response: any, name: string, value: string): any;
    useStaticAssets?(...args: any[]): this;
    setBaseViewsDir?(path: string | string[]): this;
    setViewEngine?(engineOrOptions: any): this;
}