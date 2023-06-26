import { ConnectionStates } from "../enums";
import { IConnection } from "../interfaces";
import { Blueprint } from "./blueprint";

export class Connection implements IConnection{
    public name: string = "Connection";
    
    public state: ConnectionStates = ConnectionStates.Uninitialized;

    protected blueprint: Blueprint;

    constructor(blueprint: Blueprint){
        this.blueprint = blueprint;

        let watchState = setInterval(() => {
            this.updateState();

            if(this.state === ConnectionStates.Connected || this.state === ConnectionStates.Diconnected)
                clearInterval(watchState);
        });
    }

    public get(){}
    public updateState() { this.state = ConnectionStates.Uninitialized; }
    public connected(): boolean { return false; }
    public async connect(){}
}