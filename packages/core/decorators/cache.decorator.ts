import { extendArrayMetadata, isString } from "@ucsjs/common";
import { CACHE_PATH } from "../constants";
import { CacheModule } from "../modules";
import { GlobalModules } from "../utils";

export const Cache = (name: string): MethodDecorator => {
    return (target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
        Reflect.defineMetadata(CACHE_PATH, true, descriptor.value);

        extendArrayMetadata<any>("middlewares", async (req, res) => {
            const cacheModule = GlobalModules.retrieve(CacheModule);

            if(cacheModule && isString(name) && process.env.NODE_ENV !== "dev"){
                try{
                    const cacheValue = await cacheModule.get(name);
                    return cacheValue;
                }
                catch { }                
            }  

            return null;
        }, descriptor.value);

        return descriptor;
    };
};