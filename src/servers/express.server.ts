import * as path from "path";
import * as express from "express";
import * as compression from "compression";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as session from "express-session";
import * as cookieParse from "cookie-parse";
import * as livereload from "livereload";
import * as connectLivereload from "connect-livereload";
import { v4 as uuidv4 } from 'uuid';
import helmet from "helmet";

import { MODULE_METADATA, createRouterFromController } from "@ucsjs/common";

require('dotenv').config();

export class Express {
    private module;
    
    public app;

    constructor(module){
        this.module = module;
    }

    public create(){
        this.app = express();
        this.app.disable('x-powered-by');
        this.app.use(express.json());
        this.app.use(bodyParser.json({limit: "50mb"}));
        this.app.use(bodyParser.urlencoded({limit: "50mb", extended: true}));
        this.app.use(compression());
        this.app.use(cors());
        this.app.use(helmet({
            contentSecurityPolicy: false,
        }));        
        this.app.use(express.static('editor'));
        this.app.use(session({
            secret: process.env.SESSION_KEY || "secret",
            resave: false,
            saveUninitialized: true,
            cookie: { secure: true, maxAge: 60000 }
        }));

        //Livereload
        var liveReloadServer = livereload.createServer();
        
        liveReloadServer.watch(path.join(__dirname, 'editor'));

        liveReloadServer.server.once("connection", () => {
            setTimeout(() => {
              liveReloadServer.refresh("/");
            }, 100);
        });
          
        this.app.use(connectLivereload());

        //User UUID
        this.app.use((req, res, next) => {
            let cookies = cookieParse.parse(req.headers.cookie || '');
            let uuid = uuidv4();

            if(!cookies["uuid"])
                res.setHeader("Set-Cookie", cookieParse.serialize("uuid", uuid, { httpOnly: true, maxAge: 60 * 60 * 24 * 365 }));
            else
                uuid = cookies["uuid"];

            req.userId = uuid;

            next();
        });
        
        let metadata = Reflect.getMetadata(MODULE_METADATA, this.module);
        let controllers = metadata?.controllers;

        if(controllers){
            for(let controller of controllers) {
                const router = createRouterFromController(controller);
                this.app.use(router);
            }
        }
        
        return this;
    }

    public use(pathOrMiddleware: any, callback?: any){
        this.app.use(pathOrMiddleware, callback);
    }

    public listen(port: number){
        return new Promise((resolve, reject) => {
            try{
                this.app.listen(port, resolve);
            }
            catch(e){
                reject(e.message);
            }
        });        
    }
}