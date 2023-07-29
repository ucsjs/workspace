import { ObjectUtil } from "../../utils/object.util";
import { hasher } from "node-object-hash";
const hashCoerce = hasher({ coerce: true });

export abstract class Key {
    constructor(public value?: string) { }

    static empty(): Key {
        return new ValueKey<string>();
    }

    static getHash(obj: any) : Key {
        const hash = hashCoerce.hash(obj);
        return new ValueKey<string>(`${obj.constructor.name}::${hash.substring(0,5) }`);
    }
}

class ValueKey<T> extends Key {
    constructor(value?: T){
        super(value as unknown as string);
    }

    public equals(other: any): boolean {
        if(other.constructor !== this.constructor)
            return false;

        return other instanceof ValueKey && other.value === this.value;
    }

    get hashCode(): number {
        return ObjectUtil.hash(this.constructor, this.value);
    }

    public toString(): string {
        const valueString = typeof this.value === 'string' ? `<${this.value}>` : `<${this.value}>`;

        if (this.constructor === ValueKey) 
            return `[${valueString}]`;
        
        return `[${typeof this.value} ${valueString}]`;
    }
}