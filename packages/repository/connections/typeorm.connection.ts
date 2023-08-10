import { DataSource } from "typeorm";

import { 
    Connection, 
    ConnectionStates, 
    IConnection 
} from "@ucsjs/core";

export class TypeORMConnection extends Connection implements IConnection {
    public name: string = "TypeORMConnection";
    
    public conn: DataSource;
    
    public get() {
        return this.conn;
    }

    public connected(): boolean {
        return this.conn.isInitialized;
    }

    public updateState() {
        this.state = (this.conn.isInitialized) ? 
            ConnectionStates.Connected : 
            ConnectionStates.Diconnected;
    }

    public async connect() {
        this.state = ConnectionStates.Connecting;

        const type = this.blueprint.getParameter<string>("type", "mysql");
        const host = this.blueprint.getParameter<string>("host", "localhost");
        const port = this.blueprint.getParameter<number>("port", 3306);
        const username = this.blueprint.getParameter<string>("username", "root");
        const password = this.blueprint.getParameter<string>("password", "");
        const database = this.blueprint.getParameter<string>("database", "test");
        const synchronize = this.blueprint.getParameter<boolean>("synchronize", true);

        this.conn = new DataSource({
            type: type as any,
            host: host,
            port: port,
            username: username,
            password: password,
            database: database,
            synchronize: synchronize
        });

        await this.conn.initialize();
    }
}
