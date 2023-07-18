import { IBlueprintHeader, Types } from "@ucsjs/core";
import { Logger } from "@ucsjs/common";
import { MongoDBBlueprint } from "../../abstracts"

export default class MongoDBDelete extends MongoDBBlueprint {

    public header: IBlueprintHeader = {
        useInEditor: true,
        version: 1,
        displayName: "MongoDB Delete",
        namespace: "MongoDBDelete",
        group: "Repository",
        icon: "/assets/img/mongodb.png",
        helpLink: "https://mongoosejs.com/docs/models.html#deleting",
        editorHeaderColor: "#419343",
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
            if(this.model && this.query){
                let result = null;

                if(multi)
                    result = await this.model.deleteMany(this.query);
                else
                    result = await this.model.deleteOne(this.query); 

                this.next(this.generateData(this, (result.deletedCount > 0)), "result");              
            }
            else if(this.model && this.queryById){
                let result = await this.model.deleteOne({ _id: this.queryById });
                this.next(this.generateData(this, (result.deletedCount > 0)), "result");
            }
        }   
        catch(e){
            Logger.error(e.message, `MongoDBDelete::${this.id}`);
            this.next(this.generateData(this, { error: e.message }), "result");
        }
    }
}