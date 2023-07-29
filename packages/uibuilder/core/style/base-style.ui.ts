import { IStyle } from "../../interfaces/styles/style.interface";

export class BaseStyle implements IStyle {
    getParam(propertyName: string): any | null{
        return (this.hasOwnProperty(propertyName)) ? this[propertyName] : null; 
    }
}