import { Logger } from '@nestjs/common';
import { Blueprint, Type } from "@ucsjs/blueprint";
import { TypeMongoDB } from "./mongoTypes.enum";
import { createConnection, Connection } from "mongoose";

export class MongoConnectionBlueprint extends Blueprint{
    //Metadata
    private __namespace = "Conn";
    private __group = "MongoDB";
    private __headerColor = "#419343";
    private __headerIcon = "./public/icons/mongodb.png";
    private __TypeMongoDB_Connection: object = { color: "#419343" };
    private __protocol = ["mongodb", "mongodb+srv"];
 
    public _protocol: string = "mongodb";
    public _host: string = "localhost";
    public _port: number = 27017;
    public _ignorePort: boolean = false;
    public _user: string = "";
    public _pass: string = "";
    public _db: string = "";
    public _replicaSet: string = "";
    public _tls: boolean = false;
    public _authSource: string = "admin";

    constructor(metadata?: any){
        super();
        this.setup(metadata);
        this.output("connection", TypeMongoDB.Connection, null);
    }

    exec($args?: any){
        Logger.log("Start MongoConnectionBlueprint", "MongoConnectionBlueprint");

        if(this[`mongodb_${this._itemKey}`]) {
            Logger.log("MongoConnectionBlueprint already connected", "MongoConnectionBlueprint");
            this.next("connection", this[`mongodb_${this._itemKey}`]);
        }  
        if($args[`mongodb_${this._itemKey}`]) {
            Logger.log("MongoConnectionBlueprint already connected", "MongoConnectionBlueprint");
            this.next("connection", $args[`mongodb_${this._itemKey}`]);
        }           
        else {
            this.next("connection", `mongodb_${this._itemKey}`);
        }                        
    }
}