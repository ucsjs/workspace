//@see https://github.com/nestjs/nest/blob/master/packages/common/utils/extend-metadata.util.ts

export function extendArrayMetadata<T extends Array<unknown>>(
    key: string,
    metadata: T,
    target: Function,
) {
    const previousValue = Reflect.getMetadata(key, target) || [];
    const value = [...previousValue, ...metadata];
    Reflect.defineMetadata(key, value, target);
}

export function extendMapMedatada<T>(
    key: string,
    data: { name: string, value: T },
    target: Function,
){
    if (!Reflect.hasMetadata(key, target)) 
        Reflect.defineMetadata(key, new Map<string, T>(), target);

    const metadata = Reflect.getMetadata(key, target) as Map<string, T>;
    metadata.set(data.name, data.value);
    Reflect.defineMetadata(key, metadata, target);
}