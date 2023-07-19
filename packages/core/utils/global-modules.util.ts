import { glob } from "glob";
import * as requireWithoutCache from "require-without-cache";

import { 
    IModule, 
    IModuleSettings, 
    IntegrityControl, 
    isObject, 
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

    clear(){
        this.modules = new Array<IModule>();
    }

    static async dynamicModule(settings: IModuleSettings): Promise<Object>{
        let module = new Object();
        let controllers = [];

        if(settings.controllers && Array.isArray(settings.controllers)){
            const files = await glob(settings.controllers.filter((item) => isString(item)));

            for(let file of files){
                const controller = requireWithoutCache(file, require);
                                
                for(let controllerImports in controller){
                    const controllerPath = Reflect.getMetadata(PATH_METADATA, controller[controllerImports]);

                    if(controllerPath)
                        controllers.push(controller[controllerImports]);                                      
                }
            }
        }

        controllers = [...controllers, ...settings.controllers.filter((item) => isObject(item))];
        Reflect.defineMetadata(MODULE_METADATA, { controllers, imports: settings.imports }, module);
        return module;
    }
}