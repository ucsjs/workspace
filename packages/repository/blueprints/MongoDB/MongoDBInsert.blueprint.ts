import { IBlueprintHeader, Types } from "@ucsjs/core";
import { Logger } from "@ucsjs/common";
import { MongoDbTypes } from "../../enums";
import { MongoDBBlueprint } from "../../abstracts";

export default class MongoDBInsert extends MongoDBBlueprint {

    public header: IBlueprintHeader = {
        useInEditor: true,
        version: 1,
        namespace: "MongoDBInsert",
        group: "MongoDB",
        helpLink: "https://mongoosejs.com/docs/models.html#constructing-documents",
        inputs: [
            { 
                name: "model", 
                type: MongoDbTypes.MongoDBModel, 
                callback: (data) => this.receiveModel.apply(this, [data, "result"]) 
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
                type: Types.Boolean 
            }
        ]
    }

    public async run(){
        if(this.model && this.query){
            try{
                let result = await this.model.insertMany(this.query);
                this.next(this.generateData(this, (result)), "result");
            }   
            catch(e){
                Logger.error(e.message, `MongoDBInsert::${this.id}`);
                this.next(this.generateData(this, { error: e.message }), "result");
            }
        }
    }
}