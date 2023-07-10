//@see https://github.com/nestjs/nest/blob/master/packages/common/interfaces/http/http-exception-body.interface.ts

export type HttpExceptionBodyMessage = string | string[];

export interface HttpExceptionBody {
    message: HttpExceptionBodyMessage;
    error?: string;
    statusCode: number;
}