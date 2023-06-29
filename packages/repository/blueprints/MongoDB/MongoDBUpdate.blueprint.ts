import { IBlueprintHeader, Types } from "@ucsjs/core";
import { Logger } from "@ucsjs/common";
import { MongoDBBlueprint } from "../../abstracts"

export default class MongoDBUpdate extends MongoDBBlueprint {

    public header: IBlueprintHeader = {
        useInEditor: true,
        version: 1,
        namespace: "MongoDBUpdate",
        group: "MongoDB",
        helpLink: "https://mongoosejs.com/docs/models.html#deleting",
        outputs: [{ 
            name: "result", 
            type: Types.Boolean 
        }],
        properties: [{ 
            name: "multi", 
            displayName: "Multi", 
            type: Types.Boolean,
            default: false 
        }]
    }

    public async run(){
        const multi = this.getParameter<boolean>("multi", false);

        try{
            if(this.model && this.query && this.updateSet){
                let result = null;

                if(multi)
                    result = await this.model.updateMany(this.query, { $set: this.updateSet });
                else
                    result = await this.model.updateOne(this.query, { $set: this.updateSet }); 

                this.next(this.generateData(this, (result.modifiedCount > 0)), "result");              
            }
            else if(this.model && this.queryById && this.updateSet){
                let result = await this.model.updateOne({ _id: this.queryById }, { $set: this.updateSet });
                this.next(this.generateData(this, (result.modifiedCount > 0)), "result");
            }
        }   
        catch(e){
            Logger.error(e.message, `MongoDBUpdate::${this.id}`);
            this.next(this.generateData(this, { error: e.message }), "result");
        }
    }
}