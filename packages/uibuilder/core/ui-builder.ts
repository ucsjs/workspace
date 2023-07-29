import { isObject } from "@ucsjs/common";
import { IApp, UIBuilderApp } from "../interfaces";
import { GlobalUIComponents } from "../utils";
import { AppBar } from "./components/app-bar.ui";

export class UIBuilder {
    public static fromMetadata(key: string, args?: { [key: string]: any }){
        const metadata = GlobalUIComponents.retrieveMetadata(key, args);
        return UIBuilder.parseMetadata(metadata);
    }

    public static parseMetadata(metadata: IApp): UIBuilderApp{
        let app = new UIBuilderApp();

        if(metadata.appBar && isObject(metadata.appBar))
            app.appBar = AppBar.fromMetadata(metadata.appBar);

        if(metadata.body && isObject(metadata.body))
            app.body = GlobalUIComponents.loadComponent(metadata.body);

        return app;
    }

    public static dump(obj: any, indent = ''): void{
        for (let prop in obj) {
            if (typeof obj[prop] === 'object' && obj[prop] !== null) {
                console.log(`${indent}${prop}:`);
                UIBuilder.dump(obj[prop], indent + '  ');
            } else {
                console.log(`${indent}${prop}: ${obj[prop]}`);
            }
        }
    }
}