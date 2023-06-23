import { Component } from "vue";
import { ILayoutItem } from "./ILayoutItem";

export interface ILayoutPanelRow {
    currentItemSelected: number;
    items: ILayoutItem[];
}

export interface ILayoutPanel {
    id: string,
    width?: number;
    height?: number;
    rows: ILayoutPanelRow[];
    content?: Component
}