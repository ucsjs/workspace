import { INJECTABLE_METADATA } from "../../constants";

export function Injectable(): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata(INJECTABLE_METADATA, true, target);
    };
}

export const Injector = new class {
    services = new Map();

    async inject(target: any) {
        const properties = this.getParameterNames(target) || [];
        const types = Reflect.getMetadata('design:paramtypes', target) || [];
        const injections = types.map(async (type: any) => await this.getService(type));
        let instance = new target(...injections);

        for(let typeKey in types){
            let callback = await this.getService(types[typeKey]);
            instance[properties[typeKey]] = callback;
        }

        if(typeof instance.created == "function")
            await instance.created.call(instance);
        
        return instance;
    }

    getParameterNames(target: any) {
        const functionAsString = target.prototype.constructor.toString();
        const result = functionAsString.slice(functionAsString.indexOf('(') + 1, functionAsString.indexOf(')')).match(/([^\s,]+)/g);
        return result === null ? [] : result;
    }

    async getService(type: any) {
        const isInjectable = Reflect.getMetadata(INJECTABLE_METADATA, type);

        if (!isInjectable) 
            throw new Error(`Cannot inject ${type.name}, it is not marked as @Injectable()`);
        
        if (this.services.has(type)) {
            return this.services.get(type);
        } 
        else {
            const service = await this.inject(type);
            this.services.set(type, service);
            return service;
        }
    }
};