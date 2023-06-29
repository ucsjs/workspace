import { BLUEPRINT_INPUTS, BLUEPRINT_TRIGGERS } from "../constants";

export const Input = (name: string): MethodDecorator => {
    return (target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
        if (!Reflect.hasMetadata(BLUEPRINT_INPUTS, target)) 
	        Reflect.defineMetadata(BLUEPRINT_INPUTS, new Map<string, Function>(), target);

        const inputs = Reflect.getMetadata(BLUEPRINT_INPUTS, target) as Map<string, Function>;
        inputs.set(name, descriptor.value);
        Reflect.defineMetadata(BLUEPRINT_INPUTS, inputs, target);
        return descriptor;
    };
};

export const Trigger = (name: string): MethodDecorator => {
    return (target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
        if (!Reflect.hasMetadata(BLUEPRINT_TRIGGERS, target)) 
	        Reflect.defineMetadata(BLUEPRINT_TRIGGERS, new Map<string, Function>(), target);

        const events = Reflect.getMetadata(BLUEPRINT_TRIGGERS, target) as Map<string, Function>;
        events.set(name, descriptor.value);
        Reflect.defineMetadata(BLUEPRINT_TRIGGERS, events, target);
        return descriptor;
    };
}