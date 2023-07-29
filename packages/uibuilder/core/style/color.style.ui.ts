import { isObject, isString } from "@ucsjs/common";
import { BaseStyle } from "./base-style.ui";

export class Color extends BaseStyle {

    constructor(public base: string | RGB | RGBA | undefined) { 
        super(); 
    }
    
    public static Unset(): Color {
        return new Color(undefined);
    }

    public static from(value: string | object): Color {
        if(isString(value) && Color.isHexColor(value)) return new Color(value);
        else if(isObject(value) && Color.isColorObject(value)) return Color.objectToColor(value);
        else Color.Unset();
    }

    public static isColor(value: string | object): boolean{
        if(typeof value === "string") return Color.isHexColor(value);
        else if(isObject(value)) return Color.isColorObject(value);
        else return false;
    }

    public static isHexColor(hex: string): boolean {
        const hexColorRegex = /^#([A-Fa-f0-9]{3,4}){1,2}$/;
        const hexColorWithAlphaRegex = /^#([A-Fa-f0-9]{3,4}){1,2}([A-Fa-f0-9]{2})$/;
        return hexColorRegex.test(hex) || hexColorWithAlphaRegex.test(hex);
    }

    public static isHexRGB(hex: string): boolean {
        const hexColorRegex = /^#([A-Fa-f0-9]{3,4}){1,2}$/;
        return hexColorRegex.test(hex);
    }

    public static isHexRGBA(hex: string): boolean {
        const hexColorWithAlphaRegex = /^#([A-Fa-f0-9]{3,4}){1,2}([A-Fa-f0-9]{2})$/;
        return hexColorWithAlphaRegex.test(hex);
    }

    public static isColorObject(obj: any): boolean {
        return (isObject(obj) && obj && 'r' in obj && 'g' in obj && 'b' in obj);
    }

    public static objectToColor(obj: any): Color {
        const colorObj = ('a' in obj) ? obj as RGBA : obj as RGB;
        return new Color(colorObj);
    }

    public toHex(): string | undefined {
        if(typeof this.base === "string") return this.base;
        else if(this.base instanceof RGB) return this.rgbToHex(this.base);
        else if(this.base instanceof RGBA) return this.rgbaToHex(this.base);
        else undefined
    }

    public rgbToHex(color: RGB): string {
        const red = color.r.toString(16).padStart(2, '0');
        const green = color.g.toString(16).padStart(2, '0');
        const blue = color.b.toString(16).padStart(2, '0');
        return `#${red}${green}${blue}`;
    }

    public rgbaToHex(color: RGBA): string {
        const red = color.r.toString(16).padStart(2, '0');
        const green = color.g.toString(16).padStart(2, '0');
        const blue = color.b.toString(16).padStart(2, '0');
        const alpha = Math.round(color.a * 255).toString(16).padStart(2, '0');
        return `#${red}${green}${blue}${alpha}`;
    }

    public hexToRgb(hex: string): RGB | null {
        const validHexInput = /^#([A-Fa-f0-9]{3}){1,2}$/.test(hex);

        if (!validHexInput) 
            return null;
              
        let expandedHex = hex.slice(1).length === 3 ? hex.slice(1).replace(/(.)/g, '$1$1') : hex.slice(1);
      
        let r = parseInt(expandedHex.substring(0, 2), 16);
        let g = parseInt(expandedHex.substring(2, 4), 16);
        let b = parseInt(expandedHex.substring(4, 6), 16);
      
        return new RGB(r, g, b);
    }
}

export class RGB {
    constructor(
        public r: number, 
        public g: number, 
        public b: number
    ){}
}

export class RGBA {
    constructor(
        public r: number, 
        public g: number, 
        public b: number, 
        public a: number
    ){}
}