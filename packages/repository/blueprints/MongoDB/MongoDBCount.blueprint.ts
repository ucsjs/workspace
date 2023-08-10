import { IBlueprintHeader, Types } from "@ucsjs/core";
import { isObject, Logger } from "@ucsjs/common";
import { MongoDBBlueprint } from "../../abstracts";

export default class MongoDBCount extends MongoDBBlueprint {

    public header: IBlueprintHeader = {
        useInEditor: true,
        version: 1,
        namespace: "MongoDBCount",
        group: "Repository",
        icon: "/assets/img/mongodb.png",
        helpLink: "https://mongoosejs.com/docs/api/query.html#Query.prototype.count()",
        displayName: "MongoDB Count",
        editorHeaderColor: "#419343",
        outputs: [{ 
            name: "result", 
            type: Types.Object 
        }]
    };

    public async run(){
        try{
            if(this.model && isObject(this.query)){
                let docs = await this.model.count(this.query).exec();
                this.next(this.generateData(this, docs), "result");             
            }
        }
        catch(e){
            Logger.error(e.message, `MongoDBCount::${this.id}`);
            this.next(this.generateData(this, { error: e.message }), "result");
        } 
    }
}