//@see https://github.com/nestjs/nest/blob/master/packages/common/utils/extend-metadata.util.ts

import { isString } from "./shared.utils";

export function extendArrayMetadata<T extends Array<unknown>>(
    key: string,
    metadata: T,
    target: Function | Object,
) {
    const previousValue = Reflect.getMetadata(key, target) || [];
    const value = (Array.isArray(metadata)) ? [...previousValue, ...metadata] : [...previousValue, metadata];
    Reflect.defineMetadata(key, value, target);
}

export function extendMapMedatada<T>(
    key: string,
    data: { name: string | Array<string>, value: T },
    target: Function | Object,
){
    if (!Reflect.hasMetadata(key, target)) 
        Reflect.defineMetadata(key, new Map<string, T>(), target);

    const metadata = Reflect.getMetadata(key, target) as Map<string, T>;

    if(Array.isArray(data.name)){
        for (let key of data.name){
            metadata.set(data.name[key], data.value);
        }
    }
    else if(isString(data.name))
        metadata.set(data.name, data.value);

    Reflect.defineMetadata(key, metadata, target);
}