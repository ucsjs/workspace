import { INavbarItem } from "../interfaces";

export const Navbar = (item: INavbarItem): MethodDecorator => {
    return (target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
        if (!Reflect.hasMetadata("__NAVBAR__", target)) 
	        Reflect.defineMetadata("__NAVBAR__", new Array<INavbarItem>, target);

        item.handler = descriptor.value;
        const items = Reflect.getMetadata("__NAVBAR__", target) as Array<INavbarItem>;
        items.push(item);
        Reflect.defineMetadata("__NAVBAR__", items, target);

        return descriptor;
    };
};