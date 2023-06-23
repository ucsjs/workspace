import { RequestMethod } from "../enums";

export interface RequestMappingMetadata {
    path?: string | string[];
    method?: RequestMethod;
    options?: IRouteSettings
}

export interface IRouteSettings {
    raw?: boolean;
}

export let RouteSettingsDefault = {
    raw: false
}