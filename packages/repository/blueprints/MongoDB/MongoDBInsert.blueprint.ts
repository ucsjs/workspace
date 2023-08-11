import { IBlueprintHeader, Types } from "@ucsjs/core";
import { Logger } from "@ucsjs/common";
import { MongoDBBlueprint } from "../../abstracts";

export default class MongoDBInsert extends MongoDBBlueprint {

    public header: IBlueprintHeader = {
        useInEditor: true,
        version: 1,
        namespace: "MongoDBInsert",
        group: "Repository",
        icon: "/assets/img/mongodb.png",
        helpLink: "https://mongoosejs.com/docs/models.html#constructing-documents",
        docsMarkdown: "packages-repository-mongodb-mongodbinsert.html",
        displayName: "MongoDB Insert",
        editorHeaderColor: "#419343",
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
                this.next(this.generateData(this, result), "result");
            }   
            catch(e){
                Logger.error(e.message, `MongoDBInsert::${this.id}`);
                this.next(this.generateData(this, { error: e.message }), "result");
            }
        }
    }
}