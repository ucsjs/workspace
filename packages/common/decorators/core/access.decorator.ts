import { GUARDS_METADATA } from "../../constants";
import { IGuard } from "../../interfaces";
import { extendMapMedatada } from "../../utils";
import { SetMedatada } from "./metadata.decorator";

export const IS_PUBLIC_KEY = "isPublic";
export const Public = () => SetMedatada(IS_PUBLIC_KEY, true);

export function UseGuards(name: string, value: IGuard): MethodDecorator & ClassDecorator {
	return (target: any, key?: string | symbol) => {
        extendMapMedatada<IGuard>(GUARDS_METADATA, { name, value }, target);
	};
}