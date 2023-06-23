//@see https://github.com/nestjs/nest/blob/master/packages/common/interfaces/version-options.interface.ts

import { VersioningType } from "../enums";

export const VERSION_NEUTRAL = Symbol('VERSION_NEUTRAL');

export interface VersionOptions {
    version?: VersionValue;
}

export interface VersioningCommonOptions {
    defaultVersion?: VersionOptions['version'];
}

export interface HeaderVersioningOptions {
    type: VersioningType.HEADER;
    header: string;
}

export interface UriVersioningOptions {
    type: VersioningType.URI;
    prefix?: string | false;
}

export interface MediaTypeVersioningOptions {
    type: VersioningType.MEDIA_TYPE;
    key: string;
}

export interface CustomVersioningOptions {
    type: VersioningType.CUSTOM;
    extractor: (request: unknown) => string | string[];
}

export type VersionValue =
  | string
  | typeof VERSION_NEUTRAL
  | Array<string | typeof VERSION_NEUTRAL>;

export type VersioningOptions = VersioningCommonOptions &
  (
    | HeaderVersioningOptions
    | UriVersioningOptions
    | MediaTypeVersioningOptions
    | CustomVersioningOptions
  );