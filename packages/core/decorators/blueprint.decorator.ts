import { extendArrayMetadata } from "@ucsjs/common";
import { BlueprintController } from "../abstracts";
import { BLUEPRINT_INPUTS, BLUEPRINT_TRIGGERS } from "../constants";
import { IBlueprintInjectData } from "../interfaces";

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

export const Intercept = (blueprintName: string, outputName: string, args?: IBlueprintInjectData[]): ParameterDecorator => {
    return (target: any, key: string | symbol, index: number) => {
		extendArrayMetadata<any>("middlewares", { 
            key, 
            index,
            controller: target.constructor.name,
            middleware: async (req, res, scope) => {
            if(target instanceof BlueprintController){
                if(scope.flow){
                    let parseString = (input: string): { type: string, name: string } | null  => {
                        const regex = /\$(?<type>.*?)\.(?<name>.*?)$/;
                        const regexWithoutProperty = /\$(?<type>.*?)$/;
                        const match = input.match(regex);
                        const matchWithoutProperty = input.match(regexWithoutProperty);
                      
                        if (match && match.groups) {
                            const { type, name } = match.groups;
                            return { type, name };
                        }
                        else if(matchWithoutProperty && matchWithoutProperty.groups) {
                            const { type } = matchWithoutProperty.groups;
                            return { type, name: null };
                        }
                      
                        return null;
                    };

                    for(let key in args){
                        try{
                            const { type, name } = parseString(args[key].value);
                            console.log(type, name);

                            switch(type){
                                case "param": 
                                    args[key].value = (name) ? req.params[name] : req.params; 
                                break;
                                case "query": 
                                    args[key].value = (name) ? req.query[name] : req.query; 
                                break;
                                case "header": 
                                    args[key].value = (name) ? req.header[name] : req.header; 
                                break;
                                case "body": 
                                    args[key].value = (name) ? req.body[name] : req.body; 
                                break;
                            }
                        }
                        catch (e){ console.log(e) }                        
                    }
                    
                    const data = await scope.flow.interceptOnPromise(blueprintName, outputName, args);
                    return (data.value) ? data.value : data.data;
                }
                else{
                    throw new Error("It was not possible to recover flow from the controller");
                }
            }
            else {
                throw new Error("Only controller of type BlueprintController can receive Intercept decorator.");
            }           
        } }, target.constructor);
	};
}