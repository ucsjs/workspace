import { Logger } from "@ucsjs/common";
import { IBlueprint } from "../interfaces";
import { GlobalRegistry } from "../utils";
import { Blueprint } from "./blueprint";

export class Flow {
    public blueprints: Map<string, Blueprint & IBlueprint> = new Map();

    public outputIndex: Map<string, any> = new Map();

    public static async create(blueprints: { [key: string]: any }): Promise<Flow> {
        let flow = new Flow();
        await flow.setup(blueprints);
        return flow;
    }

    public async setup(blueprints: { [key: string]: any }){
        for(let namespaceBlueprint in blueprints) {
            const { blueprint, args } = blueprints[namespaceBlueprint];
            let tmpBlueprint = await GlobalRegistry.retrieve(blueprint, args);

            if(tmpBlueprint)
                this.blueprints.set(namespaceBlueprint, tmpBlueprint);   
            else
                throw new Error(`Unable to load Blueprint '${blueprint}'(${namespaceBlueprint}) `);
        }
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

    public async subscribe(from: string, to: string): Promise<this> {
        const [ fromNamespace, fromOutput ] = from.split("->");
        const [ toNamespace, toOutput ] = to.split("->");

        let fromBlueprint = this.getBlueprint(fromNamespace);
        let toBlueprint = this.getBlueprint(toNamespace);

        if(fromBlueprint && toBlueprint)
            fromBlueprint.subscribe(toBlueprint, fromOutput, toOutput);
        else {
            if(fromBlueprint)
                throw new Error(`${fromNamespace} not exists`);
            else
                throw new Error(`${toNamespace} not exists`);
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

    public async buildListenAndExecute(listenFlow: Function){
        await this.build();
        await listenFlow(this);
        await this.execute();
        Logger.log(`Execute`, "Flow");
        this.await();
    }

    public async await(){
        setInterval(() => {}, 1000);
    }
};

export default Flow;