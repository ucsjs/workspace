import { IBlueprintHeader, Types } from "@ucsjs/core";
import { Logger } from "@ucsjs/common";
import { MongoDBBlueprint } from "../../abstracts"
import { MongoDbTypes } from "../../enums";

export default class MongoDBDelete extends MongoDBBlueprint {

    public header: IBlueprintHeader = {
        useInEditor: true,
        version: 1,
        namespace: "MongoDBDelete",
        group: "MongoDB",
        helpLink: "https://mongoosejs.com/docs/models.html#deleting",
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
                type: Types.Boolean 
            }
        ],
        properties: [
            { 
                name: "multi", 
                displayName: "Multi", 
                type: Types.Boolean,
                default: false 
            },
        ]
    }

    public async run(){
        const multi = this.getParameter<boolean>("multi", false);

        try{
        
            if(this.model && this.query){
                let result = null;

                if(multi)
                    result = await this.model.deleteMany(this.query);
                else
                    result = await this.model.deleteOne(this.query); 

                this.next(this.generateData(this, (result)), "result");              
            }
            else if(this.model && this.queryById){
                let result = await this.model.deleteOne({ _id: this.queryById });
                this.next(this.generateData(this, (result)), "result");
            }
        }   
        catch(e){
            Logger.error(e.message, `MongoDBDelete::${this.id}`);
            this.next(this.generateData(this, { error: e.message }), "result");
        }
    }
}