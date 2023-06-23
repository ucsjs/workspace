import { IModuleSettings } from "../../interfaces";
import { MODULE_METADATA } from "../../constants";

export function Module(settings?: IModuleSettings): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata(MODULE_METADATA, settings || {}, target);
    }
}