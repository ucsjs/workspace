import { VersioningOptions, VersionValue } from '../version.interface';

export interface RoutePathMetadata {
    ctrlPath?: string;
    methodPath?: string;
    globalPrefix?: string;
    modulePath?: string;
    controllerVersion?: VersionValue;
    methodVersion?: VersionValue;
    versioningOptions?: VersioningOptions;
}