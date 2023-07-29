import * as html from "html";
import * as fs from "fs";
import * as path from "path";
import * as ejs from "ejs";

import { UIComponent } from "../../abstracts/framework/ui-component";
import { UIBuilderApp, ITheme } from "../../interfaces";
import { ITransform } from "../transform.interface";

import { 
    MultiChildRenderObjectComponent 
} from "../../abstracts/framework/render-object";

import {
    ITransformHTMLComponent, 
    ITransformHTMLComponentAttr, 
    ITransformHTMLSemantics 
} from "./transformHTML.interface";

const semantics = require("./transformHTML.semantics.json");
const template = fs.readFileSync(path.resolve(__dirname, "./transformHTML.template.ejs"), "utf-8");

export class TransformHTML implements ITransform {
    public static semantics: ITransformHTMLSemantics = semantics;

    public data: string = "";

    public theme: ITheme;

    public static parser(app: UIBuilderApp, theme: string = "bootstrap"){
        const tranform = new TransformHTML();

        tranform.loadTheme((app.theme) ? app.theme : theme);

        if(app.appBar && app.appBar.constructor.name){
            tranform.transformComponent(
                app.appBar.constructor.name, 
                app.appBar, 
                false
            );
        }
        
        if(app.body && app.body.constructor.name){
            tranform.transformComponent(
                app.body.constructor.name, 
                app.body, 
                false
            );
        }  
        
        return html.prettyPrint(
            ejs.render(template, 
                {
                    head: "",
                    body: tranform.data
                }
            ), 
            { 
                indent_size: 1, 
                indent_char: "\t" 
            }
        );
    }

    public loadTheme(themeName: string) : void {
        try{
            const theme = require(
                path.resolve(`./${themeName.toLowerCase()}.theme.json`)
            );

            if(theme)
                this.theme = theme as ITheme;
        }
        catch { }
    }

    public transformComponent(
        semanticsName: string, 
        component: UIComponent,
        returnValue: boolean
    ) : string | void {
        const semantic = TransformHTML.getSemanticsComponent(semanticsName);

        if(semantic){
            let value = null;

            if(semantic.value){
                if(semantic.value.includes("||")){                    
                    let valuesProps = semantic.value
                    .split("||")
                    .map((value) => {
                        return value.trim();
                    });

                    for(let ppros of valuesProps){
                        const tmpValue = component.getParam(ppros);

                        if(tmpValue){
                            value = (tmpValue instanceof UIComponent) ? 
                                this.transformComponent(
                                    tmpValue.constructor.name, 
                                    tmpValue, true
                                ) : tmpValue;

                            break;
                        }
                    }
                }
                else{
                    value = component.getParam(semantic.value);
                }
            }
                            
            if(
                component instanceof MultiChildRenderObjectComponent &&
                component.children.length > 0
            ){
                value = this.getChildren(component.children);
            }
              
            if(returnValue)
                return this.formatTag(semantic, component, value);
            else
                this.data += this.formatTag(semantic, component, value);
        }
    }

    public getChildren(children: UIComponent[]): string{
        let data: string = "";

        for(let child of children){
            data += this.transformComponent(
                child.constructor.name, 
                child, 
                true
            );
        }
                    
        return data;
    }

    public formatTag(
        semantic: ITransformHTMLComponent, 
        component: UIComponent, 
        value: string
    ): string {
        let attrs: Map<string, string> = new Map<string, string>();

        if(semantic.attrs && semantic.attrs.length > 0){
            for(let attr of semantic.attrs){
                let preData = attrs.has(attr.name) ? attrs.get(attr.name) : "";
                const propValue = this.getValue(attr.prop, attr, component);
                let attrStruct = "";

                if(propValue && propValue !== "") {
                    if(attr.attrName)
                        attrStruct += `${attr.attrName}:`;

                    if(attr.prefix)
                        attrStruct += `${attr.prefix}`;

                    if(propValue){
                        attrStruct += (attr.template) ? 
                            attr.template.replace("{$value}", propValue) : 
                            propValue;
                    }
                       
                    if(attr.posfix)
                        attrStruct += `${attr.posfix}`;

                    attrs.set(attr.name, preData + attrStruct + "; ");
                }
            }
        }

        let attrsParsed = Array.from(attrs, ([key, value]) => 
            `${key}="${value.substring(0, value.length-2)}"`
        );
                
        const tag = (value) ? 
        `<${semantic.tag} ${attrsParsed.join(" ")} ref="${component.key.value}">${value}</${semantic.tag}>` : 
        `<${semantic.tag} ${attrsParsed.join(" ")} ref="${component.key.value}" />`;

        return tag;
    }   

    public getValue(
        prop: string, 
        attr: ITransformHTMLComponentAttr, 
        component: UIComponent
    ): string{
        const pathProp = prop.split(".");
        let pointerProp;

        for(let propPosition of pathProp){
            try{
                pointerProp = (pointerProp) ? 
                    pointerProp?.getParam(propPosition) : 
                    component?.getParam(propPosition);
            }
            catch (err){ 
                console.log(err.message, pointerProp.constructor.name);
            }
        }
                    
        if(attr.method){
            if(
                pointerProp && 
                pointerProp[attr.method] && 
                typeof pointerProp[attr.method] === "function"
            ){
                return pointerProp[attr.method]();
            }
            else {
                return (pointerProp) ? pointerProp?.toString() : "";
            }
        }
        else {
            return (pointerProp) ? pointerProp?.toString() : "";
        }
    }

    public static getSemanticsComponent(name: string){
        return (TransformHTML.semantics.components[name]) ? TransformHTML.semantics.components[name] : null;
    }
}