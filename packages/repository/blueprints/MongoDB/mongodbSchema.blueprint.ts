import mongoose from "mongoose";
import { Logger } from "@ucsjs/common";
import { Blueprint, BlueprintDataError, Connection, IBlueprintData, IBlueprintHeader, Types, ConnectionsManager } from "@ucsjs/core";
import { MongoDbTypes } from "../../enums";

export default class MongoDBSchema extends Blueprint {
    private conn: Connection;

    public header: IBlueprintHeader = {
        useInEditor: true,
        version: 1,
        namespace: "MongoDBSchema",
        group: "MongoDB",
        helpLink: "",
        inputs: [{ 
            name: "connection", 
            type: MongoDbTypes.MongoDBConnection, 
            callback: this.createSchema.bind(this)  
        }],
        outputs: [
            { name: "model", type: MongoDbTypes.MogoDBModel }
        ],
        properties: [
            { name: "name", displayName: "Name", type: Types.String },
            { name: "collection", displayName: "Collection", type: Types.String },
            { name: "timestamps", displayName: "Timestamps", type: Types.Boolean, default: true },
            { name: "fields", displayName: "Fields", type: Types.Array, objectArray: [
                { name: "name", type: Types.String, },
                { name: "type", type: Types.Options, options: [
                    { name: "String", value: "String" },
                    { name: "Number", value: "Number" },
                    { name: "Date", value: "Date" },
                    { name: "Buffer", value: "Buffer" },
                    { name: "Boolean", value: "Boolean" },
                    { name: "Mixed", value: "Mixed" },
                    { name: "ObjectId", value: "ObjectId" },
                    { name: "Array", value: "Array" },
                    { name: "Decimal128", value: "Decimal128" },
                    { name: "Map", value: "Map" },
                    { name: "Schema", value: "Schema" }
                ] },
                { name: "index", type: Types.Boolean, default: false },
                { name: "unique", type: Types.Boolean, default: false },
                { name: "required", type: Types.Boolean, default: false },
            ] }
        ]
    }

    public async createSchema(data: IBlueprintData){
        const schemaName = this.getParameter<string>("name", "");
        const collection = this.getParameter<string>("collection", "");
        const timestamps = this.getParameter<boolean>("timestamps", true);
        const fields = this.getParameterObject("fields", "name");

        let conn = (await ConnectionsManager.getOrCreateConnection(data.value)).get() as mongoose.Connection;

        if(data instanceof BlueprintDataError){
            Logger.error(`Recive error ${data.message}...`, "MongoDBSchema");
            this.next(data, "model");
        }
        else if(fields && !conn.modelNames().includes(schemaName)){
            
            Logger.log(`Create schema ${schemaName}...`, "MongoDBSchema");

            const schema = new mongoose.Schema(fields, {
                timestamps, collection, 
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