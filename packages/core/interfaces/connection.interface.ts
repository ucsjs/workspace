import { ConnectionStates } from "../enums";
export interface IConnection {
    name: string;
    state: ConnectionStates,
    updateState(),
    connect();
    get();
}