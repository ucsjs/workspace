import { glob } from "glob";

import { 
    IModule, 
    isString, 
    MODULE_METADATA, 
    PATH_METADATA, 
    Singleton 
} from "@ucsjs/common";

export class GlobalModules extends Singleton {
    public modules: Array<IModule> = new Array<IModule>();

    static register(module: any, settings?: {}): void{
        const globalModules = GlobalModules.getInstance();
        const moduleInstance = new module();
        moduleInstance.create(settings);
        globalModules.modules.push(moduleInstance);
    }

    static retrieve<T extends IModule>(moduleType: new () => T): T | null{
        const globalModules = GlobalModules.getInstance();

        for(let module of globalModules.modules){
            if(module instanceof moduleType)
                return module as T;
        }

        return null;
    }

    static async dynamicModule(dirSettings: { constrollers: Array<string> | string }): Promise<Object>{
        let module = new Object();
        let controllers = [];

        if(isString(dirSettings.constrollers) || Array.isArray(dirSettings.constrollers)){
            const files = await glob(dirSettings.constrollers);

            for(let file of files){
                const controller = require(file);
                
                for(let controllerImports in controller){
                    const controllerPath = Reflect.getMetadata(PATH_METADATA, controller[controllerImports]);

                    if(controllerPath)
                        controllers.push(controller[controllerImports]);
                }
            }
        }

        Reflect.defineMetadata(MODULE_METADATA, { controllers }, module);
        return module;
    }
}