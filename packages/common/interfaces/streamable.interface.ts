//@see https://github.com/nestjs/nest/blob/master/packages/common/file-stream/interfaces/streamable-handler-response.interface.ts
//@see https://github.com/nestjs/nest/blob/master/packages/common/file-stream/interfaces/streamable-options.interface.ts

export interface StreamableHandlerResponse {
    destroyed: boolean;
    headersSent: boolean;
    statusCode: number;
    send: (body: string) => void;
    end: () => void;
}

export interface StreamableFileOptions {
    type?: string;
    disposition?: string;
    length?: number;
}