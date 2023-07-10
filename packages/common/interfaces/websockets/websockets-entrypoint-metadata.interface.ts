//@see https://github.com/nestjs/nest/blob/eef670896a92ca144a8299a1d0c78c9842abe8d7/packages/websockets/interfaces/websockets-entrypoint-metadata.interface.ts

export type WebsocketEntrypointMetadata = {
    port: number;
    message: unknown;
};