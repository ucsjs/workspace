import { IShortcut } from "./shortcut.interface"

export interface INavbar {
    items: Array<INavbarItem>;
}

export interface INavbarItem {
    namespace: string;
    display: string;
    path: string;
    items?: Array<INavbarItem>;
    shortcuts?: Array<IShortcut | string>;
    handler?: Function;
    invokeWindow?: string
}