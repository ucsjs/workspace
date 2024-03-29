import * as fs from 'fs-extra';
import * as path from 'path';
import { glob } from 'glob';

import { Singleton, Logger, isObject, isString, Type } from "@ucsjs/common";
import { Blueprint, Flow } from "../core";

import { 
    IBlueprint, 
    IBlueprintHeader, 
    IBlueprintSettings, 
    IBlueprintTransform 
} from "../interfaces";
import { Types } from '../enums';

export class GlobalRegistry extends Singleton { 
    private directory: string | Array<string>;

    public registry: Map<string, any> = new Map();

    public metadatas: Map<string, any> = new Map();

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

    static async loadMetadata(directories: string | Array<string>, clearRegistry: boolean = true){
        const globalRegistry = GlobalRegistry.getInstance();
        const files = await glob(directories, {  });

        for (const file of files) {
            const metadata = require(file);
            const namespace = path.basename(file).replace(".metadata.json", "");

            if(!globalRegistry.metadatas.has(namespace))
                globalRegistry.metadatas.set(namespace, metadata);
        }
    }

    static async load() {
        //Load Blueprints
        let directoryPackages = path.resolve((process.env.NODE_ENV == "prod") ? "./node_modules/@ucsjs/**/*.blueprint.js" : "./packages/**/*.blueprint.ts");
        let directory = path.resolve((process.env.NODE_ENV == "prod") ? "./dist/**/*.blueprint.js" : "./src/**/*.blueprint.ts");
        await GlobalRegistry.registerDirectory([directoryPackages, directory]);

        //Load Metadatas
        let directoryMetadata = path.resolve((process.env.NODE_ENV == "prod") ? "./dist/.metadata/*.metadata.json" : "./src/.metadata/*.metadata.json");
        let directorySubMetadata = path.resolve((process.env.NODE_ENV == "prod") ? "./dist/.metadata/**/*.metadata.json" : "./src/.metadata/**/*.metadata.json");
        await GlobalRegistry.loadMetadata([directoryMetadata, directorySubMetadata])

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

    static async retrieve(
        key: string, 
        args?: IBlueprintSettings, 
        transforms?: { [key: string]: IBlueprintTransform[] }
    ): Promise<Blueprint> {
        const globalRegistry = GlobalRegistry.getInstance();

        if(globalRegistry.registry.has(key)) {
            let classBase = globalRegistry.registry.get(key);
            let component = new classBase(args, transforms);
            await component.setup();
            
            return component;
        }
        else{
            return null;
        };
    }

    static retrieveMetadata(key: string, args?: { [key: string]: any }): any{
        const globalRegistry = GlobalRegistry.getInstance();
        let metadata = (globalRegistry.metadatas.has(key)) ? globalRegistry.metadatas.get(key) : null;

        if(metadata){
            try{
                for (let blueprintKey in metadata.blueprints) {
                    if(isObject(metadata.blueprints[blueprintKey].args)) {
                        for(let argKey in metadata.blueprints[blueprintKey].args){
                            if(
                                isString(metadata.blueprints[blueprintKey].args[argKey]) &&
                                metadata.blueprints[blueprintKey].args[argKey].includes("$args:")
                            ){
                                const key = metadata.blueprints[blueprintKey].args[argKey].replace("$args:", "").trim();
    
                                if(args[key])
                                    metadata.blueprints[blueprintKey].args[argKey]= args[key];
                            }
                        }
                    }
                }
            } catch { }
            
            return metadata;
        }
        else{
            return null;
        }
    }

    static retrieveAll(): any[] {
        const globalRegistry = GlobalRegistry.getInstance();
        return Array.from(globalRegistry.registry);
    }

    static async createFlow(blueprints: { [key: string]: any }): Promise<Flow>{
        return await Flow.create(blueprints);
    }

    static fixHeader(headerMetadata: any): IBlueprintHeader {
        if(isObject(headerMetadata)){
            for(let key in headerMetadata){
                switch(key){
                    case "inputs":
                    case "outputs": 
                    case "properties":
                        if(Array.isArray(headerMetadata[key])){
                            for(let keyInput in headerMetadata[key]){
                                if(
                                    headerMetadata[key][keyInput] &&
                                    headerMetadata[key][keyInput]["type"]
                                ){
                                    headerMetadata[key][keyInput]["type"] =
                                    GlobalRegistry.TypeByString(headerMetadata[key][keyInput]["type"]);
                                }    
                                
                                if(
                                    headerMetadata[key][keyInput] &&
                                    headerMetadata[key][keyInput]["objectArray"]
                                ){
                                    headerMetadata[key][keyInput]["objectArray"] =
                                    headerMetadata[key][keyInput]["objectArray"].map(_data => {
                                        if(_data["type"])
                                            _data["type"] = GlobalRegistry.TypeByString(_data["type"]);

                                        return _data;
                                    });
                                }
                            }
                        }
                    break;
                }
            }

            return headerMetadata as IBlueprintHeader;
        }
        else {
            return null;
        }
    }

    static TypeByString(value: string): Types {
        switch(value){            
            case "Any": return Types.Any;
            case "Array": return Types.Array;
            case "Boolean": return Types.Boolean;
            case "Float": return Types.Float;
            case "Function": return Types.Function;
            case "Int": return Types.Int;
            case "Object": return Types.Object;
            case "Options": return Types.Options;
            case "String": return Types.String;
        }
    }
}