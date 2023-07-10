import { AbstractHttpAdapter, AbstractWsAdapter } from "./abstracts";
import { ExpressAdapter } from "./adapters";
import { WebSocketAdapter } from "./interfaces";

export class UCSApplication {
    private httpAdapter: AbstractHttpAdapter;

    private webSocketServer: any;

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

        await httpServer.initialize(moduleCls);
        this.httpAdapter = httpServer as T;
        return this;
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
        port = (typeof port === "string") ? parseInt(port) : port;
        this.httpAdapter.listen(port);
    }
}

export const Application = new UCSApplication();