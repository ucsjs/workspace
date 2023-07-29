import { ObjectUtil } from "../../utils";
import { Key } from "../foundation/key";

export abstract class UIComponent {
    constructor(public key?: Key) {}

    toStringShort(): string {
        const type = this.constructor.name;
        return this.key == null ? type : `${type}-${this.key}`;
    }

    get hashCode(): number {
        return ObjectUtil.hash(this.constructor, this.key);
    }

    getParam(propertyName: string): any | null{
        return (this.hasOwnProperty(propertyName)) ? this[propertyName] : null; 
    }
}