import mongoose from "mongoose";
import { IBlueprintHeader, Types } from "@ucsjs/core";
import { isObject, Logger } from "@ucsjs/common";
import { MongoDBBlueprint } from "../../abstracts";

export default class MongoDBFind extends MongoDBBlueprint {

    public header: IBlueprintHeader = {
        useInEditor: true,
        version: 1,
        namespace: "MongoDBFind",
        group: "MongoDB",
        helpLink: "https://mongoosejs.com/docs/models.html#querying",
        outputs: [{ 
            name: "result", 
            type: Types.Object 
        }],
        properties: [{ 
            name: "limit", 
            displayName: "Limit", 
            type: Types.Int 
        },
        { 
            name: "offset", 
            displayName: "Offset", 
            type: Types.Int 
        }]
    };

    public async run(){
        try{
            if(this.model && this.queryById && this.queryById instanceof mongoose.Types.ObjectId){                
                let docs = await this.model.findById(this.queryById).exec();
                this.next(this.generateData(this, docs.toJSON()), "result");            
            }
            else if(this.model && isObject(this.query)){
                let docs = await this.model.find(this.query).exec();
                this.next(this.generateData(this, docs), "result");             
            }
        }
        catch(e){
            Logger.error(e.message, `MongoDBFind::${this.id}`);
            this.next(this.generateData(this, { error: e.message }), "result");
        } 
    }
}