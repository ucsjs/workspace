import { Logger } from "@ucsjs/common";

import { 
    IBlueprintHeader, 
    Blueprint, 
    ConnectionsManager,  
    Connection, 
    ConnectionStates, 
    GlobalRegistry
} from "@ucsjs/core";

import { MongoDBConnection } from "../../connections";

const header = require("./MongoDB.header.json");

export default class MongoDB extends Blueprint {

    header: IBlueprintHeader = GlobalRegistry.fixHeader(header); 

    public async build(){
        let connectionName = this.getParameter<string>("name", "MongoDBConn");
        
        await ConnectionsManager.getOrCreateConnection(
            connectionName, 
            await this.createConnection.bind(this)
        );
    }

    public async execute() {
        let connectionName = this.getParameter<string>("name", "MongoDBConn");

        if(ConnectionsManager.has(connectionName)){
            let conn = ConnectionsManager.get(connectionName);

            let persistentConn = setInterval(() => {
                if(conn.state == ConnectionStates.Connected){
                    this.next(this.generateData(this, connectionName));
                    clearInterval(persistentConn);
                }                                     
                else if(conn.state === ConnectionStates.Diconnected || conn.state === ConnectionStates.Disconnecting){                    
                    this.next(this.generateError(this, `Unable to connect to MongoDB database`, "MongoDBConn"));
                    clearInterval(persistentConn);
                }  
            }, 100);            
        }
    }

    public async createConnection(): Promise<Connection>{
        Logger.log("Create connection", "MongoDB");

        let conn = new MongoDBConnection(this);
        await conn.connect();
        return conn;
    }
}