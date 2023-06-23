import { ScopeOptions } from "./scope.interface";
import { VersionOptions } from "./version.interface";

export interface ControllerOptions extends ScopeOptions, VersionOptions {
    path?: string | string[];
    host?: string | RegExp | Array<string | RegExp>;
}