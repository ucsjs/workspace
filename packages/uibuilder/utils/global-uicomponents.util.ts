import * as path from 'path';
import { glob } from 'glob';
import { isFunction, isObject, Singleton } from "@ucsjs/common";
import { UIComponent } from '../abstracts';

export class GlobalUIComponents extends Singleton {
    public components: Map<string, any> = new Map<string, any>();

    public metadatas: Map<string, any> = new Map();

    static async load(){
        let directoryPackages = path.resolve((process.env.NODE_ENV == "prod") ? 
        "./node_modules/@ucsjs/uibuilder/**/*.ui.ts" : 
        "./packages/uibuilder/**/*.ui.ts");

        let directory = path.resolve((process.env.NODE_ENV == "prod") ? 
        "./dist/**/*.ui.ts" : 
        "./src/**/*.ui.ts");
        
        const files = await glob([directoryPackages, directory], { ignore: "node_modules/**" });
                
        for await(let filename of files){
            if(!filename.includes("node_modules")){
                const component = require(filename);

                for(let element of Object.values(component)){                    
                    if((isObject(element) || isFunction(element)) && element["name"])
                        GlobalUIComponents.register(element["name"], element);                                       
                }
            }            
        }

        //Load Metadatas
        let directoryMetadata = path.resolve((process.env.NODE_ENV == "prod") ? "./dist/.metadata/*.metadata.json" : "./src/.metadata/*.metadata.json");
        let directorySubMetadata = path.resolve((process.env.NODE_ENV == "prod") ? "./dist/.metadata/**/*.metadata.json" : "./src/.metadata/**/*.metadata.json");
        await GlobalUIComponents.loadMetadata([directoryMetadata, directorySubMetadata])

        return this;
    }

    static register(key: string, component: any): void {
        const globalUIComponents = GlobalUIComponents.getInstance();
        globalUIComponents.components.set(key, component);
    }

    static retrieve(key: string): any | null {
        const globalUIComponents = GlobalUIComponents.getInstance();
        return (globalUIComponents.components.has(key))? globalUIComponents.components.get(key) : null;
    }

    static async loadMetadata(directories: string | Array<string>) {
        const globalUIComponents = GlobalUIComponents.getInstance();
        const files = await glob(directories);

        for (const file of files) {
            const metadata = require(file);
            const namespace = path.basename(file).replace(".metadata.json", "");

            if(!globalUIComponents.metadatas.has(namespace))
                globalUIComponents.metadatas.set(namespace, metadata);
        }
    }

    static retrieveMetadata(key: string, args?: { [key: string]: any }): any{
        const globalUIComponents = GlobalUIComponents.getInstance();
        let metadata = (globalUIComponents.metadatas.has(key)) ? globalUIComponents.metadatas.get(key) : null;
        return (metadata) ? metadata : null;
    }

    static loadComponent(metadata: any): UIComponent | null{
        if(metadata.component){
            let component = GlobalUIComponents.retrieve(metadata.component);

            return (
                component && 
                component["fromMetadata"] && 
                typeof component.fromMetadata === "function"
            ) ? component.fromMetadata(metadata) : null;
        }
        else{
            return null;
        }        
    }

    static loadChildren(children: Array<any>): UIComponent[]{
        let components = [];

        for(let child of children)
            components.push(GlobalUIComponents.loadComponent(child));
        
        return components;
    }
}