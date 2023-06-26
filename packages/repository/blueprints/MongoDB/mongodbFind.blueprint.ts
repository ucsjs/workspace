import { Blueprint, BlueprintDataError, IBlueprintData, IBlueprintHeader, Types } from "@ucsjs/core";
import { MongoDbTypes } from "../../enums";
import { Logger } from "@ucsjs/common";

export default class MongoDBFind extends Blueprint {
    protected model: any;

    protected query: object;

    public header: IBlueprintHeader = {
        useInEditor: true,
        version: 1,
        namespace: "MongoDBFind",
        group: "MongoDB",
        helpLink: "",
        inputs: [
            { name: "model", type: MongoDbTypes.MogoDBModel, callback: this.receiveModel.bind(this) },
            { name: "query", type: Types.Object, callback: this.reciveQuery.bind(this) }
        ],
        outputs: [
            { name: "result", type: Types.Object }
        ],
        properties: [
            { name: "limit", displayName: "Limit", type: Types.Int },
            { name: "offset", displayName: "Offset", type: Types.Int }
        ]
    };

    public receiveModel(data: IBlueprintData){
        if(data instanceof BlueprintDataError){
            Logger.error(`Recive error ${data.message}...`, "MongoDBFind");
            this.next(data, "result");
        }
        else {
            this.model = data.value;
            this.executeAndSend();
        }        
    }

    public reciveQuery(data: IBlueprintData){
        this.query = data.value;
        this.executeAndSend();
    }

    public async executeAndSend(){
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