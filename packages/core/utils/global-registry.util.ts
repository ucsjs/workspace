import * as fs from 'fs-extra';
import * as path from 'path';
import { glob } from 'glob';

import { Singleton, Logger } from "@ucsjs/common";
import { IBlueprint, IBlueprintSettings } from "../interfaces";
import { Blueprint, Flow } from "../core";

export class GlobalRegistry extends Singleton { 
    private directory: string | Array<string>;

    public registry: Map<string, any> = new Map();

    static async registerDirectory(directories: string | Array<string>, clearRegistry: boolean = true) {
        const globalRegistry = GlobalRegistry.getInstance();
        
        globalRegistry.directory = directories;

        if(clearRegistry)
            globalRegistry.registry.clear();

        if(typeof directories == "string")
            directories = [directories]; 

        try{
            const files = await glob(directories);
        
            for (const file of files) {
                const fullPath = file;            
                const stat = await fs.stat(fullPath);

                if (stat.isDirectory()) {
                    await this.registerDirectory(fullPath, false);
                } else if (file.endsWith((process.env.NODE_ENV == "prod") ? "blueprint.js" : "blueprint.ts")) {
                    const module = require(fullPath).default;

                    if (module){
                        let tmpInstance = new module();

                        Logger.log(`Loading Blueprint ${tmpInstance.header.namespace}`, "Global Registry");

                        if(tmpInstance.header.namespace != undefined && !globalRegistry.registry.has(tmpInstance.header.namespace))
                            globalRegistry.registry.set(tmpInstance.header.namespace, module);      
                            
                        if(tmpInstance.header.alias != undefined && !globalRegistry.registry.has(tmpInstance.header.alias))
                            globalRegistry.registry.set(tmpInstance.header.alias, module); 
                    }   
                }
            }
        }
        catch(e){
            Logger.error(e.message, "Global Registry");
        }            
    }

    static async load() {
        let directoryPackages = path.resolve((process.env.NODE_ENV == "prod") ? "./node_modules/@ucsjs/**/*.blueprint.js" : "./packages/**/*.blueprint.ts");
        let directory = path.resolve((process.env.NODE_ENV == "prod") ? "./dist/**/*.blueprint.js" : "./src/**/*.blueprint.ts");
        await GlobalRegistry.registerDirectory([directoryPackages, directory]);
        return this;
    }

    static refresh(){
        const globalRegistry = GlobalRegistry.getInstance();

        if(globalRegistry.directory)
            this.registerDirectory(globalRegistry.directory);
    }

    static implementsIBlueprint(module: any): module is IBlueprint {
        return (
            module &&
            typeof module === 'object' &&
            'Namespace' in module &&
            typeof module.Namespace === 'string'
        );
    }

    static register(key: string, instance: any, alias?: string): boolean {
        const globalRegistry = GlobalRegistry.getInstance();

        if (!globalRegistry.registry.has(key)) {
            globalRegistry.registry.set(key, instance);

            if (alias && !globalRegistry.registry.has(alias))
                globalRegistry.registry.set(alias, instance);

            return true;
        }
        else{
            return false;
        }
    }

    static registerBlueprint<T extends Blueprint & IBlueprint>(blueprintClass: { new (): T }): void {
        const globalRegistry = GlobalRegistry.getInstance();

        if(blueprintClass.prototype.Namespace && !globalRegistry.registry.has(blueprintClass.prototype.Namespace))
            globalRegistry.registry.set(blueprintClass.prototype.Namespace, blueprintClass);
    }

    static async retrieve(key: string, args?: IBlueprintSettings): Promise<Blueprint> {
        const globalRegistry = GlobalRegistry.getInstance();

        if(globalRegistry.registry.has(key)) {
            let classBase = globalRegistry.registry.get(key);
            let component = new classBase(args);
            await component.setup();
            
            return component;
        }
        else{
            return null;
        };
    }

    static retrieveAll(): any[] {
        const globalRegistry = GlobalRegistry.getInstance();
        return Array.from(globalRegistry.registry);
    }

    static async createFlow(blueprints: { [key: string]: any }): Promise<Flow>{
        return await Flow.create(blueprints);
    }
}