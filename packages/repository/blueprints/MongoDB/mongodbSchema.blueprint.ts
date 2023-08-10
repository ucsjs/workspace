import mongoose from "mongoose";
import { Logger } from "@ucsjs/common";

import { 
    Blueprint, 
    IBlueprintData, 
    ConnectionsManager,
    Input, 
    IBlueprintHeader,
    GlobalRegistry
} from "@ucsjs/core";

const header = require("./MongoDBSchema.header.json");

export default class MongoDBSchema extends Blueprint {

    header: IBlueprintHeader = GlobalRegistry.fixHeader(header);

    @Input("connectionName")
    public async createSchema(data: IBlueprintData){
        const schemaName = this.getParameter<string>("name", "");
        const collection = this.getParameter<string>("collection", "");
        const timestamps = this.getParameter<boolean>("timestamps", true);
        const fields = this.getParameterObject("fields", "name");

        let conn = (await ConnectionsManager.getOrCreateConnection(data.value)).get() as mongoose.Connection;

        if(fields && !conn.modelNames().includes(schemaName)){
            Logger.log(`Create schema ${schemaName}...`, "MongoDBSchema");

            const schema = new mongoose.Schema(fields, {
                timestamps, 
                collection, 
            });
    
            const model = conn.model(schemaName, schema);
            this.next(this.generateData(this, model), "model");
        }
        else {
            Logger.log(`Recovering schema ${schemaName}...`, "MongoDBSchema");

            const model = conn.model(schemaName);
            this.next(this.generateData(this, model), "model");
        }
    }
}