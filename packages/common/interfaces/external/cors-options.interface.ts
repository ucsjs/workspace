//@see https://github.com/nestjs/nest/blob/master/packages/common/interfaces/external/cors-options.interface.ts

type StaticOrigin = boolean | string | RegExp | (string | RegExp)[];

export type CustomOrigin = (
  requestOrigin: string,
  callback: (err: Error | null, origin?: StaticOrigin) => void,
) => void;

export interface CorsOptions {
    origin?: StaticOrigin | CustomOrigin;
    methods?: string | string[];
    allowedHeaders?: string | string[];
    exposedHeaders?: string | string[];
    credentials?: boolean;
    maxAge?: number;
    preflightContinue?: boolean;
    optionsSuccessStatus?: number;
}

export interface CorsOptionsCallback {
    (error: Error, options: CorsOptions): void;
}

export interface CorsOptionsDelegate<T> {
    (req: T, cb: CorsOptionsCallback): void;
}