import { caching, MemoryCache } from 'cache-manager';
import { Injectable } from "@ucsjs/common";

@Injectable()
export class CachingService {
    public memoryCache: MemoryCache;

    async createCaching(){
        this.memoryCache = await caching("memory", { max: 100, ttl: 60 * 1000});
    }

    async get <T>(key: string): Promise<T | undefined>;

    async get(key: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            if(!this.memoryCache)
                await this.createCaching();

            let data = await this.memoryCache.get(key);
            (data) ? resolve(data) : reject();
        });
    }

    async set(key: string, data: any, ttl: number = 60000): Promise<void> {
        if(!this.memoryCache)
            await this.createCaching();

        await this.memoryCache.set(key, data, ttl);
    }

    async del(key: string): Promise<void> {
        if(!this.memoryCache)
            await this.createCaching();
            
        await this.memoryCache.del(key);
    }
}