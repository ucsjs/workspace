import type { Server } from 'http';
import * as bodyparser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as http from 'http';
import * as https from 'https';
import * as session from "express-session";
import * as compression from "compression";
import helmet from "helmet";
import { Duplex } from 'stream';

import { AbstractHttpAdapter } from "../abstracts";
import { IRouteSettings, RouteSettingsDefault, ServeStaticOptions } from "../interfaces";
import { METHOD_METADATA, MODULE_METADATA, OPTIONS_METADATA, PATH_METADATA } from '../constants';
import { Logger } from '../services';
import { Injector } from '../decorators';
import { RequestMethod } from '../enums';
import { isFunction } from '../utils';

export class ExpressAdapter extends AbstractHttpAdapter<
    http.Server | https.Server
>{
    private readonly openConnections = new Set<Duplex>();

    constructor(instance?: any) {
        super(instance || express());
    }

    public async initialize(moduleCls: any, options: any = {}){
        this.initHttpServer(options);

        this.set('view engine', 'ejs');
        this.disable('x-powered-by');
        this.use(express.json());
        this.use(bodyparser.json({limit: "50mb"}));
        this.use(bodyparser.urlencoded({
            limit: "50mb", 
            extended: true
        }));
        this.use(compression());
        this.use(cors());
        this.use(helmet({
            contentSecurityPolicy: false
        }));        
        this.use(express.static('editor'));
        this.use(express.static('public'));
        this.use(session({
            secret: process.env.SESSION_KEY || "secret",
            resave: false,
            saveUninitialized: true,
            cookie: { secure: true, maxAge: 60000 }
        }));

        let metadata = Reflect.getMetadata(MODULE_METADATA, moduleCls);
        let controllers = metadata?.controllers;

        if(controllers){
            for(let controller of controllers) {
                const router = await this.createRouters(controller);
                this.use(router);
            }
        }
    }

    public initHttpServer(options: any) {
        const isHttpsEnabled = options && options.httpsOptions;

        if (isHttpsEnabled) {
            this.httpServer = https.createServer(
                options.httpsOptions,
                this.getInstance(),
            );
        } 
        else {
            this.httpServer = http.createServer(this.getInstance());
        }
    }

    public status(response: any, statusCode: number) {
        return response.status(statusCode);
    }

    public end(response: any, message?: string) {
        return response.end(message);
    }

    public render(response: any, view: string, options: any) {
        return response.render(view, options);
    }

    public redirect(response: any, statusCode: number, url: string) {
        return response.redirect(statusCode, url);
    }
    
    public setHeader(response: any, name: string, value: string) {
        return response.set(name, value);
    }

    public listen(port: string | number, callback?: () => void): Server;
    public listen(
        port: string | number,
        hostname: string,
        callback?: () => void,
    ): Server;
    public listen(port: any, ...args: any[]): Server {
        return this.httpServer.listen(port, ...args);
    }

    public close() {
        this.closeOpenConnections();
    
        if (!this.httpServer) 
          return undefined;
        
        return new Promise(resolve => this.httpServer.close(resolve));
    }
    
    public set(...args: any[]) {
        return this.instance.set(...args);
    }
    
    public enable(...args: any[]) {
        return this.instance.enable(...args);
    }
    
    public disable(...args: any[]) {
        return this.instance.disable(...args);
    }
    
    public engine(...args: any[]) {
        return this.instance.engine(...args);
    }

    public useStaticAssets(path: string, options: ServeStaticOptions) {
        if (options && options.prefix) 
          return this.use(options.prefix, express.static(path, options));
        
        return this.use(express.static(path, options));
    }
    
    public setBaseViewsDir(path: string | string[]) {
        return this.set('views', path);
    }
    
    public setViewEngine(engine: string) {
        return this.set('view engine', engine);
    }

    private closeOpenConnections() {
        for (const socket of this.openConnections) {
            socket.destroy();
            this.openConnections.delete(socket);
        }
    }

    private async createRouters(controller): Promise<express.Router>{
        const router = express.Router();
        const properties = Object.getOwnPropertyNames(controller.prototype);
        const prefixController = Reflect.getMetadata(PATH_METADATA, controller);

        if(properties){
            for (const property of properties) {
                if (typeof controller.prototype[property] === 'function' && property !== "constructor") {
                    const routeMetadata = Reflect.getMetadata(PATH_METADATA, controller.prototype[property]) as string;
                    const methodMetadata = Reflect.getMetadata(METHOD_METADATA, controller.prototype[property]);
                    const optionsMetadata = Reflect.getMetadata(OPTIONS_METADATA, controller.prototype[property]);
                    const routeMiddlewares = Reflect.getMetadata('middlewares', controller.prototype[property]);
                    const middlewares = Reflect.getMetadata('middlewares', controller);

                    if (routeMetadata) {
                        const methodName = property || "";
                        const scope = await Injector.inject(controller);
                        
                        if(scope[property]){
                            const handler = scope[property]?.bind(scope);
                            const path = ((prefixController.startsWith("/")) ? prefixController: "/" + prefixController) + 
                            ((routeMetadata.startsWith("/")) ? routeMetadata : "/" + routeMetadata);
                        
                            Logger.log(`Listing route ${controller.name}::${RequestMethod[methodMetadata]} (${path})`, "Server");
            
                            switch (methodMetadata) {
                                case RequestMethod.GET: router.get(path, 
                                    this.processRequest(scope, handler, methodName, middlewares, routeMiddlewares, optionsMetadata)); break;
                                case RequestMethod.POST: router.post(path, 
                                    this.processRequest(scope, handler, methodName, middlewares, routeMiddlewares, optionsMetadata)); break;
                                case RequestMethod.PUT: router.put(path, 
                                    this.processRequest(scope, handler, methodName, middlewares, routeMiddlewares, optionsMetadata)); break;
                                case RequestMethod.PATCH: router.patch(path, 
                                    this.processRequest(scope, handler, methodName, middlewares, routeMiddlewares, optionsMetadata)); break;
                                case RequestMethod.DELETE: router.delete(path, 
                                    this.processRequest(scope, handler, methodName, middlewares, routeMiddlewares, optionsMetadata)); break;
                                case RequestMethod.HEAD: router.head(path, 
                                    this.processRequest(scope, handler, methodName, middlewares, routeMiddlewares, optionsMetadata)); break;
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

    private getHandlerArgs(scope, target:any, methodName: string, middlewares:[], req: express.Request, res: express.Response): any[] {
        if(middlewares && middlewares.length > 0){
            let sortedMiddlewares = this.sortByKey(middlewares, "index");

            const params = sortedMiddlewares.map((data: { key: string, index: number, middleware: Function }) => {
                return (methodName == data.key) ? data.middleware(req, res, scope) : null;
            }).filter(item => item);
    
            return params;
        }
        else {
            return [];
        }
    }

    private processRequest(
        scope,
        handler: Function, 
        methodName: string, 
        middlewares: [], 
        routeMiddlewares: [] = [], 
        options: IRouteSettings = RouteSettingsDefault
    ) {
        return async (req: express.Request, res: express.Response) => {	
            try{
                const startTimeout = new Date().getTime();                
                let buffer = null;

                if(routeMiddlewares.length > 0){
                    for await(let middleware of routeMiddlewares){
                        if(isFunction(middleware))
                            buffer = await (middleware as Function).call(handler, req, res);
                    }
                }
                
                if(!buffer){
                    const args = this.getHandlerArgs(scope, handler, methodName, middlewares, req, res);
                    buffer = await handler(...args);
                }
                    
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

    private sortByKey(list: any[], key: string): any[] {
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
}

function CACHE_PATH(CACHE_PATH: any, arg1: any) {
    throw new Error('Function not implemented.');
}
