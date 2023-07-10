import { ILayout } from "./layout.interface";
import { INavbar } from "./navbar.interface";

export interface IEditor {
    navbar: INavbar;
    layout: ILayout;
}