import { caching, FactoryConfig, FactoryStore, MemoryCache, Cache, Store, MemoryConfig } from 'cache-manager';
import { IModule } from "@ucsjs/common";

export interface CacheModuleSettings {
    store: FactoryStore<Store, object>,
    settings?: FactoryConfig<object> | MemoryConfig;
}

export class CacheModule implements IModule {
    public memoryCache: MemoryCache | Cache<Store>;

    async create(instaceSettings?: CacheModuleSettings){
        if(instaceSettings && instaceSettings.store)
            this.memoryCache = await caching(instaceSettings.store, instaceSettings.settings);
        else 
            this.memoryCache = await caching("memory", instaceSettings.settings as MemoryConfig);
    }

    async get <T>(key: string): Promise<T | undefined>;

    async get(key: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            let data = await this.memoryCache.get(key);
            (data) ? resolve(data) : reject();
        });
    }

    async set(key: string, data: any, ttl: number = 60000): Promise<void> {
        if(data instanceof Promise)
            data = await data;

        await this.memoryCache.set(key, data, ttl);
    }

    async del(key: string): Promise<void> {            
        await this.memoryCache.del(key);
    }
}