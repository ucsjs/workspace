import { Logger } from "@ucsjs/common";

import { 
    Blueprint, 
    ConnectionsManager, 
    Connection, 
    ConnectionStates, 
    IBlueprintHeader,
    GlobalRegistry
} from "@ucsjs/core";

import { TypeORMConnection } from "../../connections";

const header = require("./TypeORM.header.json");

export default class TypeORM extends Blueprint {

    header: IBlueprintHeader = GlobalRegistry.fixHeader(header);

    public async build() {
        let connectionName = this.getParameter<string>("name", "TypeORMConn");

        await ConnectionsManager.getOrCreateConnection(
            connectionName, 
            await this.createConnection.bind(this)
        );
    }

    public async execute() {
        let connectionName = this.getParameter<string>("name", "TypeORMConn");

        if (ConnectionsManager.has(connectionName)) {
            let conn = ConnectionsManager.get(connectionName);

            let persistentConn = setInterval(() => {
                if (conn.state == ConnectionStates.Connected) {
                    this.next(this.generateData(this, connectionName));
                    clearInterval(persistentConn);
                }
                else if (
                    conn.state === ConnectionStates.Diconnected || 
                    conn.state === ConnectionStates.Disconnecting
                ) {
                    this.next(this.generateError(this, 
                        `Unable to connect to TypeORM database`, 
                        "TypeORMConn")
                    );

                    clearInterval(persistentConn);
                }
            }, 100);
        }
    }

    public async createConnection(): Promise<Connection> {
        Logger.log("Create connection", "TypeORM");

        let conn = new TypeORMConnection(this);
        await conn.connect();
        return conn;
    }
}
