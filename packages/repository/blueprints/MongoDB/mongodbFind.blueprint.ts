import { IBlueprintHeader, Types } from "@ucsjs/core";
import { Logger } from "@ucsjs/common";
import { MongoDbTypes } from "../../enums";
import { MongoDBBlueprint } from "../../abstracts";

export default class MongoDBFind extends MongoDBBlueprint {

    public header: IBlueprintHeader = {
        useInEditor: true,
        version: 1,
        namespace: "MongoDBFind",
        group: "MongoDB",
        helpLink: "https://mongoosejs.com/docs/models.html#querying",
        inputs: [
            { 
                name: "model", 
                type: MongoDbTypes.MongoDBModel, 
                callback: (data) => this.receiveModel.apply(this, [data, "result"]) 
            },
            {
                name: "id",
                type: Types.String,
                callback: (data) => this.receiveId.apply(this, [data, "result"])
            },
            { 
                name: "query", 
                type: Types.Object, 
                callback: (data) => this.receiveQuery.apply(this, [data, "result"])
            }
        ],
        outputs: [
            { 
                name: "result", 
                type: Types.Object 
            }
        ],
        properties: [
            { 
                name: "limit", 
                displayName: "Limit", 
                type: Types.Int 
            },
            { 
                name: "offset", 
                displayName: "Offset", 
                type: Types.Int 
            }
        ]
    };

    public async run(){
        if(this.model && this.query){
            try{
                let docs = await this.model.find(this.query).exec();
                this.next(this.generateData(this, docs), "result");             
            }
            catch(e){
                Logger.error(e.message, `MongoDBFind::${this.id}`);
                this.next(this.generateData(this, { error: e.message }), "result");
            }            
        }
    }
}