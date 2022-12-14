import { Logger } from "@nestjs/common";
import { Model } from "mongoose";
import { Blueprint, Type } from "@ucsjs/blueprint";
import { TypeMongoDB } from "./mongoTypes.enum";

export class MongoFindBlueprint extends Blueprint{
    //Metadata
    private __namespace = "Find";
    private __group = "MongoDB";
    private __headerColor = "#419343";
    private __headerIcon = "./public/icons/mongodb.png";
    private __TypeMongoDB_Schema: object = { color: "#6d0000" };
    private __trigger = true;

    public _awaitTrigger: boolean = false;
    public _limit: number = 10;
    public _offset: number = 0;

    private state = { model: null, query: null };

    constructor(metadata?: any){
        super();
        this.setup(metadata);

        if(metadata && metadata.query)
            this.state["query"] = metadata.query;
        
        this.input("schema", TypeMongoDB.Schema, null, async (model: Model<any>) => {
            if(model){
                Logger.log(`Recive model`, "MongoFindBlueprint");
                this.state["model"] = model;
                await this.run(this);
            }
        });

        this.input("query", Type.JSON, null, (query) => {
            if(query){
                Logger.log(`Recive query: ${JSON.stringify(query)}`, "MongoFindBlueprint");
                this.state["query"] = query;
                this.run(this);
            }
        });

        this.output("result", Type.JSON, null);
        this.output("error", Type.String, null);
    }

    public async trigger(){
        this._awaitTrigger = false;
        await this.run(this);
    }

    public async run(scope){
        if(scope.state.model && scope.state.query && !scope._awaitTrigger){
            Logger.log(`Find in MongoDB: ${JSON.stringify(scope.state.query)}`, "MongoFindBlueprint");

            try{
                if(scope._limit > 1){
                    const docs = await scope.state.model.find(scope.state.query, null, {
                        limit: scope._limit,
                        skip: scope._offset
                    }).lean();
    
                    if(docs){
                        Logger.log(`Send docs: ${JSON.stringify(docs)}`, "MongoFindBlueprint");    
                        scope.next("result", docs);
                    }
                    else{
                        Logger.log("There are no valid records for the query sent", "MongoFindBlueprint");    
                        scope.next("error", { error: "There are no valid records for the query sent" });
                    }
                }
                else{
                    const doc = await scope.state.model.findOne(scope.state.query, null, {
                        skip: scope._offset
                    }).lean();

                    if(doc){
                        Logger.log(`Send doc: ${JSON.stringify(doc)}`, "MongoFindBlueprint");    
                        scope.next("result", doc);
                    }
                    else{
                        Logger.log("There are no valid records for the query sent", "MongoFindBlueprint");    
                        scope.next("error", { error: "There are no valid records for the query sent" });
                    }
                }
            }
            catch(e){
                Logger.error(e, "MongoFindBlueprint");
                scope.next("error", { error: e.message });
            }
        }
    }
}