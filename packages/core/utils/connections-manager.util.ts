import { Singleton } from "@ucsjs/common";
import { IConnection } from "../interfaces";

export class ConnectionsManager extends Singleton {
    private connections: Map<string, IConnection> = new Map();

    public static getOrCreateConnection(name: string, createFunction?: Function): Promise<IConnection>{
        return new Promise(async (resolve, reject) => {
            try{
                const connectionsManager = ConnectionsManager.getInstance();

                if(ConnectionsManager.has(name)){
                    resolve(ConnectionsManager.get(name));
                }
                else if(createFunction && typeof createFunction === "function"){
                    let connection = await createFunction() as IConnection;
                    connectionsManager.connections.set(name, connection);
                    resolve(connection);                    
                }
                else{
                    reject("Error when trying to create connection because there is no defined creation function");
                }
            }
            catch(e){
                reject(e.message);
            }            
        });
    }   

    public static has(name: string): boolean{
        const connectionsManager = ConnectionsManager.getInstance();
        return connectionsManager.connections.has(name);
    }

    public static get(name: string): IConnection | null{
        const connectionsManager = ConnectionsManager.getInstance();
        return (connectionsManager.connections.has(name)) ? connectionsManager.connections.get(name) : null;
    }
}