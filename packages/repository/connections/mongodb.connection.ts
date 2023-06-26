import * as mongoose from "mongoose";
import { Connection, ConnectionStates, IConnection } from "@ucsjs/core";

export class MongoDBConnection extends Connection implements IConnection {
    public name: string = "MongoDBConnection";
    
    public conn: mongoose.Connection;
    
    public get(){
        return this.conn;
    }

    public connected(): boolean {
        return this.conn.readyState == mongoose.ConnectionStates.connected;
    }

    public updateState(){
        switch(this.conn.readyState){
            case mongoose.ConnectionStates.connected: this.state = ConnectionStates.Connected; break;
            case mongoose.ConnectionStates.connecting: this.state = ConnectionStates.Connecting; break;
            case mongoose.ConnectionStates.disconnected: this.state = ConnectionStates.Diconnected; break;
            case mongoose.ConnectionStates.disconnecting: this.state = ConnectionStates.Disconnecting; break;
        }
    }

    public async connect(){
        this.state = ConnectionStates.Connecting;
        const connectionString = this.blueprint.getParameter<string>("connectionString", "");

        if(connectionString !== "" && connectionString !== undefined && connectionString !== null){
            this.conn = await mongoose.createConnection(connectionString);
        }
        else{
            const protocol = this.blueprint.getParameter<string>("protocol", "mongodb");
            const host = this.blueprint.getParameter<string>("host", "localhost");
            const port = this.blueprint.getParameter<number>("port", 27017);
            const db = this.blueprint.getParameter<string>("db", "");
            const user = this.blueprint.getParameter<string>("user", "");
            const pass = this.blueprint.getParameter<string>("pass", "");

            const replicaSet = this.blueprint.getParameter<string>("replicaSet", "");
            const tls = this.blueprint.getParameter<string>("tls", "");
            const authSource = this.blueprint.getParameter<string>("authSource", "");

            let uri = `${host}:${port}/${db}`;

            if(user && pass)
                uri = `${user}:${pass}@${uri}`;

            let $settingsExtra = { replicaSet, tls, authSource };
            const query = [];

            for(let key in $settingsExtra){
                if($settingsExtra[key] && $settingsExtra[key] != "")
                    query.push(`${key}=${$settingsExtra[key]}`);
            }

            if(query.length > 0)
                uri += `?${query.join("&")}`;

            this.conn = await mongoose.createConnection(`${protocol}://${uri}`);
        }
    }
}