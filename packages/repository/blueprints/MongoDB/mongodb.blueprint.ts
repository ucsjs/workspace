import { Logger } from "@ucsjs/common";

import { 
    IBlueprintHeader, 
    Blueprint, 
    ConnectionsManager, 
    Types, 
    Connection, 
    ConnectionStates 
} from "@ucsjs/core";

import { MongoDBConnection } from "../../connections";

import { MongoDbTypes } from "../../enums";

export default class MongoDB extends Blueprint {

    public header: IBlueprintHeader = {
        useInEditor: true,
        version: 1,
        namespace: "MongoDB",
        group: "MongoDB",
        helpLink: "https://mongoosejs.com/docs/connections.html",
        outputs: [{ 
            name: "_default", 
            type: MongoDbTypes.MongoDBConnection 
        }],
        properties: [
            { name: "name", type: Types.String, displayName: "Name", default: "MongoDBConn", required: true },
            { name: "connectionString", type: Types.String, displayName: "Connection String"},
            { 
                name: "protocol", 
                type: Types.Options, 
                displayName: "Protocol", 
                default: "mongodb",
                required: true,
                options: [
                    { name: "mongodb", value: "mongodb" },
                    { name: "mongodb+srv", value: "mongodb+srv" },
                ]                
            },
            { name: "host", type: Types.String, displayName: "Hostname", default: "localhost" },
            { name: "port", type: Types.Int, displayName: "Port", default: 27017 },
            { name: "user", type: Types.String, displayName: "Username" },
            { name: "pass", type: Types.String, displayName: "Password" },
            { name: "db", type: Types.String, displayName: "Database" },
            { name: "replicaSet", type: Types.String, displayName: "Replica" },
            { name: "tls", type: Types.Boolean, displayName: "TLS", default: false },
            { name: "authSource", type: Types.String, displayName: "Auth Source", default: "admin" },
        ]
    }

    public async build(){
        let connectionName = this.getParameter<string>("name", "MongoDBConn");
        await ConnectionsManager.getOrCreateConnection(connectionName, await this.createConnection.bind(this));
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