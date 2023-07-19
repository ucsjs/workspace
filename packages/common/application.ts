import { AbstractHttpAdapter } from "./abstracts";
import { ExpressAdapter } from "./adapters";
import { WebSocketAdapter } from "./interfaces";
import * as chokidar from "chokidar";
import { Logger } from "./services";
import { MODULE_METADATA } from "./constants";

export class UCSApplication {
    private httpAdapter: AbstractHttpAdapter;

    private webSocketServer: any;

    private port: number;

    public async create<T extends ExpressAdapter>(module: any): Promise<this>;
    public async create<T extends ExpressAdapter>(
        module: any,
        httpAdapter: AbstractHttpAdapter
    ): Promise<this>; 

    public async create<T extends ExpressAdapter>(
        moduleCls: any,
        serverOrOptions?: AbstractHttpAdapter,
    ): Promise<this> {
        const [httpServer] = this.isHttpServer(serverOrOptions) 
        ? [serverOrOptions] 
        : [this.createHttpAdapter()];

        if(typeof moduleCls === "function")
            await httpServer.initialize(await moduleCls());
        else
            await httpServer.initialize(moduleCls);

        if(process.env.NODE_ENV === "dev") {
            chokidar.watch(['./src/**', './packages/**'], {
                ignored: "**/node_modules/**",
                ignoreInitial: true,
                awaitWriteFinish: true,
                ignorePermissionErrors: true
            }).on("all", async (event, name) => await this.reload.call(this, this.createHttpAdapter(), moduleCls, event));
        }
                    
        this.httpAdapter = httpServer as T;
        return this;
    }

    private async reload<T extends ExpressAdapter>(httpServer: AbstractHttpAdapter, moduleCls: any, event: string) {
        if (event === 'add' || event === 'change' || event === 'unlink') {
            Logger.debug("Reload application...", "Application");

            Reflect.deleteMetadata(MODULE_METADATA, moduleCls);

            try { 
                const closeHandle = this.httpAdapter.close();
                
                if(closeHandle instanceof Promise)
                    await closeHandle;
            } catch(e) { console.log(e); }

            if(typeof moduleCls === "function")
                await httpServer.initialize(await moduleCls(), null, true);
            else
                await httpServer.initialize(moduleCls, null, true);

            this.httpAdapter = httpServer as T;
            await httpServer.listen(this.port);
            
            Logger.debug("Reload finish", "Application");
        }
    }

    private isHttpServer(serverOrOptions: AbstractHttpAdapter | any){
        return !!(serverOrOptions && (serverOrOptions as AbstractHttpAdapter).patch);
    }

    private createHttpAdapter<T = any>(httpServer?: T): AbstractHttpAdapter {
        return new ExpressAdapter(httpServer);
    }

    public useWebSocketAdapter(adapter: WebSocketAdapter){
        this.webSocketServer = adapter.create(this.httpAdapter);
        
        adapter.bindClientConnect(this.webSocketServer, (ws: WebSocket) => {

        });
    }

    public getHttpAdapter(): AbstractHttpAdapter {
        return this.httpAdapter as AbstractHttpAdapter;
    }

    public getUnderlyingHttpServer(){
        return this.httpAdapter.getHttpServer();
    }

    public listen(port: string | number){
        this.port = (typeof port === "string") ? parseInt(port) : port;
        this.httpAdapter.listen(this.port);
    }
}

export const Application = new UCSApplication();