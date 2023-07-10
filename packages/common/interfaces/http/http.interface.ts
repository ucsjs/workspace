import { RequestMethod } from "../../enums";

export interface RequestMappingMetadata {
    path?: string | string[];
    method?: RequestMethod;
    options?: IRouteSettings
}

export interface IRouteSettings {
    raw?: boolean;
}

export let RouteSettingsDefault = {
    raw: false,
    cache: false,
}

export interface ServeStaticOptions {
    dotfiles?: string;
    etag?: boolean;
    extensions?: string[];
    fallthrough?: boolean;
    immutable?: boolean;
    index?: boolean | string | string[];
    lastModified?: boolean;
    maxAge?: number | string;
    redirect?: boolean;
    setHeaders?: (res: any, path: string, stat: any) => any;
    prefix?: string;
}