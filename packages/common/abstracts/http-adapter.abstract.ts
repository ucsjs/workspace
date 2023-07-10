//@see https://github.com/nestjs/nest/blob/master/packages/core/adapters/http-adapter.ts

import { HttpServer, RequestHandler } from "../interfaces";

export abstract class AbstractHttpAdapter<
    TServer = any,
    TRequest = any,
    TResponse = any,
> implements HttpServer<TRequest, TResponse>
{
    protected httpServer: TServer;

    constructor(protected instance?: any) {}

    public use(...args: any[]) {
        return this.instance.use(...args);
    }

    public get(handler: RequestHandler);
    public get(path: any, handler: RequestHandler);
    public get(...args: any[]) {
        return this.instance.get(...args);
    }

    public post(handler: RequestHandler);
    public post(path: any, handler: RequestHandler);
    public post(...args: any[]) {
        return this.instance.post(...args);
    }

    public head(handler: RequestHandler);
    public head(path: any, handler: RequestHandler);
    public head(...args: any[]) {
        return this.instance.head(...args);
    }

    public delete(handler: RequestHandler);
    public delete(path: any, handler: RequestHandler);
    public delete(...args: any[]) {
        return this.instance.delete(...args);
    }

    public put(handler: RequestHandler);
    public put(path: any, handler: RequestHandler);
    public put(...args: any[]) {
        return this.instance.put(...args);
    }

    public patch(handler: RequestHandler);
    public patch(path: any, handler: RequestHandler);
    public patch(...args: any[]) {
        return this.instance.patch(...args);
    }

    public all(handler: RequestHandler);
    public all(path: any, handler: RequestHandler);
    public all(...args: any[]) {
        return this.instance.all(...args);
    }

    public search(port: string | number, callback?: () => void);
    public search(port: string | number, hostname: string, callback?: () => void);
    public search(port: any, hostname?: any, callback?: any) {
        return this.instance.search(port, hostname, callback);
    }

    public options(handler: RequestHandler);
    public options(path: any, handler: RequestHandler);
    public options(...args: any[]) {
        return this.instance.options(...args);
    }

    public listen(port: string | number, callback?: () => void);
    public listen(port: string | number, hostname: string, callback?: () => void);
    public listen(port: any, hostname?: any, callback?: any) {
        return this.instance.listen(port, hostname, callback);
    }

    public getHttpServer(): TServer {
        return this.httpServer as TServer;
    }

    public setHttpServer(httpServer: TServer) {
        this.httpServer = httpServer;
    }

    public setInstance<T = any>(instance: T) {
        this.instance = instance;
    }

    public getInstance<T = any>(): T {
        return this.instance as T;
    }

    abstract initialize(moduleCls: any, options?: any);
    abstract status(response: any, statusCode: number);
    abstract end(response: any, message?: string);
    abstract render(response: any, view: string, options: any);
    abstract redirect(response: any, statusCode: number, url: string);
    abstract setHeader(response: any, name: string, value: string);
    abstract useStaticAssets(...args: any[]);
    abstract setViewEngine(engine: string);
}