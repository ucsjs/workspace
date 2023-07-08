import { AbstractHttpAdapter } from "./abstracts/http-adapter";
import { ExpressAdapter } from "./adapters";

export class UCSApplication {
    public async create<T extends ExpressAdapter>(module: any): Promise<T>;
    public async create<T extends ExpressAdapter>(
        module: any,
        httpAdapter: AbstractHttpAdapter
    ): Promise<T>; 

    public async create<T extends ExpressAdapter>(
        moduleCls: any,
        serverOrOptions?: AbstractHttpAdapter,
    ): Promise<T> {
        const [httpServer] = this.isHttpServer(serverOrOptions) 
        ? [serverOrOptions] 
        : [this.createHttpAdapter()];

        await httpServer.initialize(moduleCls);
        return httpServer as T;
    }

    private isHttpServer(serverOrOptions: AbstractHttpAdapter | any){
        return !!(serverOrOptions && (serverOrOptions as AbstractHttpAdapter).patch);
    }

    private createHttpAdapter<T = any>(httpServer?: T): AbstractHttpAdapter {
        return new ExpressAdapter(httpServer);
    }
}

export const Application = new UCSApplication();