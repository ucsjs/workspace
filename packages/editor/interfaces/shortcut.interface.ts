import { OS } from "../enums/os.enum";

export interface IShortcut {
    os: OS,
    ctrl: boolean,
    shift: boolean,
    comand: boolean,
    alt: boolean,
    key: string;
}