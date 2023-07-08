import { REDIRECT_METADATA } from "../../constants";

export function Redirect(url: string = "", statusCode?: number) : MethodDecorator {
    return (target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>,) => {
        Reflect.defineMetadata(REDIRECT_METADATA, { url, statusCode }, descriptor.value);
        return descriptor;
    }
}