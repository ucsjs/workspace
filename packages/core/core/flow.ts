import { Logger } from "@ucsjs/common";

import { 
    IBlueprint, 
    IBlueprintData, 
    IBlueprintInjectData, 
    IBlueprintMetadata, 
    IFlowBlueprintListItem 
} from "../interfaces";

import { GlobalRegistry } from "../utils";
import { Blueprint } from "./blueprint";

export class Flow {
    public cachedBlueprintSettings: { [key: string]: any };

    public cachedConnections: { [key: string]: string | Array<string> };

    public blueprints: Map<string, Blueprint & IBlueprint> = new Map();

    public outputIndex: Map<string, any> = new Map();

    public static async create(blueprints: { [key: string]: any }, connections?: { [key: string]: string | Array<string> }): Promise<Flow> {
        let flow = new Flow();
        flow.cachedBlueprintSettings = blueprints;
        flow.cachedConnections = connections;
        
        await flow.setup(blueprints);

        if(connections)
            flow.subscribeMulti(connections);

        return flow;
    }

    public static async fromMetadata(metadataName: string, args?: { [key: string]: any }): Promise<Flow>{
        const metadata = GlobalRegistry.retrieveMetadata(metadataName, args) as IBlueprintMetadata;
        
        if(metadata) 
            return await Flow.create(metadata.blueprints, metadata.connections);
        else
            return null;
    }

    public async setup(blueprints: { [key: string]: IFlowBlueprintListItem }): Promise<void>{
        for(let namespaceBlueprint in blueprints) {
            const { blueprint, args, transforms } = blueprints[namespaceBlueprint];
            let tmpBlueprint = await GlobalRegistry.retrieve(blueprint, args, transforms);

            if(tmpBlueprint)
                this.blueprints.set(namespaceBlueprint, tmpBlueprint);   
            else
                throw new Error(`Unable to load Blueprint '${blueprint}'(${namespaceBlueprint}) `);
        }
    }

    public async reset(): Promise<this>{
        this.blueprints.clear();
        await this.setup(this.cachedBlueprintSettings);

        if(this.cachedConnections)
            this.subscribeMulti(this.cachedConnections);

        return this;
    }

    public async build(): Promise<this> {
        await Promise.all(Array.from(this.blueprints.values()).map(async bp => {
            if(bp.build && typeof(bp.build) == "function")
                await bp.build();
        }));

        return this;
    }

    public getBlueprint(namespace: string) {
        return this.blueprints.has(namespace) ? this.blueprints.get(namespace) : null;
    }

    public async subscribeMulti(relations: { [key: string]: any }): Promise<this>{
        for(let relation in relations){
            let from = relation;
            let to = relations[from];
            this.subscribe(from, to);
        }
        
        return this;
    }

    public async subscribe(from: string, to: string | Array<string>): Promise<this> {
        const [ fromNamespace, fromOutput ] = from.split("->");
        let fromBlueprint = this.getBlueprint(fromNamespace);

        if(!fromBlueprint)
            throw new Error(`${fromNamespace} not exists`);

        if(typeof to == "string"){
            const [ toNamespace, toInput ] = to.split("->");
            let toBlueprint = this.getBlueprint(toNamespace);

            if(fromBlueprint && toBlueprint){
                //Logger.log(`Subscribe ${fromNamespace}::${fromOutput} => ${toNamespace}::${toInput}`, "Flow");
                fromBlueprint.subscribe(toBlueprint, fromOutput, toInput);
            }                
            else 
                throw new Error(`${toNamespace} not exists`);
        }
        else if(Array.isArray(to)){
            for(let toItem of to){
                const [ toNamespace, toInput ] = toItem.split("->");
                let toBlueprint = this.getBlueprint(toNamespace);

                if(fromBlueprint && toBlueprint){
                    //Logger.log(`Subscribe ${fromNamespace}::${fromOutput} => ${toNamespace}::${toInput}`, "Flow");
                    fromBlueprint.subscribe(toBlueprint, fromOutput, toInput);
                }                    
                else 
                    throw new Error(`${toNamespace} not exists`);
            }
        }
        
        return this;
    }
    
    public async listen(from: string, to: string) {
        const [ fromNamespace, fromOutput ] = from.split("->");
        const [ toNamespace, toOutput ] = to.split("->");

        let fromBlueprint = this.getBlueprint(fromNamespace);
        let toBlueprint = this.getBlueprint(toNamespace);

        if(fromBlueprint && toBlueprint)
            fromBlueprint.listen(toBlueprint, fromOutput, toOutput);
        else 
            throw new Error(`${fromBlueprint} or ${toNamespace} not exists`);

        return this;
    }

    public async execute() {
        await Promise.all(Array.from(this.blueprints.values()).map(bp => {
            if(bp.execute && typeof(bp.execute) == "function")
                bp.execute();
        }));
        
        return this;
    }

    public async buildListenAndExecute(listenFlow?: Function){
        await this.build();

        if(listenFlow && typeof listenFlow == "function")
            await listenFlow(this);

        await this.execute();
        
        this.await();
    }

    public interceptOnPromise(blueprintName: string, outputName: string, args?: IBlueprintInjectData[]): Promise<IBlueprintData>{
        return new Promise(async (resolve, reject) => {
            try{
                await this.reset();
                let blueprint = this.getBlueprint(blueprintName);
                await blueprint.injectArgs(args);
                blueprint.subscribePromise(outputName).then(resolve).catch(reject);
                this.buildListenAndExecute();
            }
            catch(e){
                reject(e);
            }            
        });
    }

    public async await(){
        setInterval(() => {}, 1000);
    }
};

export default Flow;