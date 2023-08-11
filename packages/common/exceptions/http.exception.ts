//@see https://github.com/nestjs/nest/blob/master/packages/common/exceptions/http.exception.ts

import { HttpStatus } from "../enums";
import { HttpExceptionBody, HttpExceptionBodyMessage } from "../interfaces";
import { isObject, isString } from "../utils";

export interface HttpExceptionOptions {
    cause?: unknown;
    description?: string;
}

export interface DescriptionAndOptions {
    description?: string;
    httpExceptionOptions?: HttpExceptionOptions;
}

export class HttpException extends Error {
    constructor(
        private readonly response: string | Record<string, any>,
        private readonly status: HttpStatus,
        private readonly options?: HttpExceptionOptions,
    ){
        super();
        this.initMessage();
        this.initName();
        this.initCause();
    }

    public cause: unknown;

    public initCause(): void {
        if (this.options?.cause) {
          this.cause = this.options.cause;
          return;
        }
    }

    public initMessage() {
        if (isString(this.response)) {
          this.message = this.response;
        } 
        else if (
          isObject(this.response) &&
          isString((this.response as Record<string, any>).message)
        ) {
          this.message = (this.response as Record<string, any>).message;
        } 
        else if (this.constructor) {
          this.message =
            this.constructor.name.match(/[A-Z][a-z]+|[0-9]+/g)?.join(' ') ??
            'Error';
        }
    }

    public initName(): void {
        this.name = this.constructor.name;
    }

    public getResponse(): string | object {
        return this.response;
    }

    public getStatus(): number {
        return this.status;
    }
    
    public static createBody(
        nil: null | '',
        message: HttpExceptionBodyMessage,
        statusCode: number,
    ): HttpExceptionBody;

    public static createBody(
        message: HttpExceptionBodyMessage,
        error: string,
        statusCode: number,
    ): HttpExceptionBody;

    public static createBody<Body extends Record<string, unknown>>(
        custom: Body,
    ): Body;

    public static createBody<Body extends Record<string, unknown>>(
        arg0: null | HttpExceptionBodyMessage | Body,
        arg1?: HttpExceptionBodyMessage | string,
        statusCode?: number,
    ): HttpExceptionBody | Body {
        if (!arg0) {
          return {
            message: arg1,
            statusCode: statusCode,
          };
        }
    
        if (isString(arg0) || Array.isArray(arg0)) {
          return {
            message: arg0,
            error: arg1 as string,
            statusCode: statusCode,
          };
        }
    
        return arg0;
    }

    public static getDescriptionFrom(
        descriptionOrOptions: string | HttpExceptionOptions,
    ): string {
    return isString(descriptionOrOptions)
        ? descriptionOrOptions
        : descriptionOrOptions?.description;
    }

    public static getHttpExceptionOptionsFrom(
        descriptionOrOptions: string | HttpExceptionOptions,
    ): HttpExceptionOptions {
        return isString(descriptionOrOptions) ? {} : descriptionOrOptions;
    }

    public static extractDescriptionAndOptionsFrom(
        descriptionOrOptions: string | HttpExceptionOptions,
    ): DescriptionAndOptions {
        const description = isString(descriptionOrOptions)
          ? descriptionOrOptions
          : descriptionOrOptions?.description;
    
        const httpExceptionOptions = isString(descriptionOrOptions)
          ? {}
          : descriptionOrOptions;
    
        return {
          description,
          httpExceptionOptions,
        };
    }
}

export class BadGatewayException extends HttpException {
    constructor(
        objectOrError?: string | object | any,
        descriptionOrOptions: string | HttpExceptionOptions = 'Bad Gateway',
    ) {
        const { description, httpExceptionOptions } =
          HttpException.extractDescriptionAndOptionsFrom(descriptionOrOptions);
    
        super(
            HttpException.createBody(
                objectOrError,
                description,
                HttpStatus.BAD_GATEWAY,
            ),
            HttpStatus.BAD_GATEWAY,
            httpExceptionOptions,
        );
    }
}

export class BadRequestException extends HttpException {
    constructor(
        objectOrError?: string | object | any,
        descriptionOrOptions: string | HttpExceptionOptions = 'Bad Request'
    ){
        const { description, httpExceptionOptions } =
            HttpException.extractDescriptionAndOptionsFrom(descriptionOrOptions);

        super(
            HttpException.createBody(
                objectOrError,
                description,
                HttpStatus.BAD_REQUEST,
            ),
            HttpStatus.BAD_REQUEST,
            httpExceptionOptions,
        );
    }
}

export class ConflictException extends HttpException {
    constructor(
        objectOrError?: string | object | any,
        descriptionOrOptions: string | HttpExceptionOptions = 'Conflict',
    ) {
        const { description, httpExceptionOptions } =
          HttpException.extractDescriptionAndOptionsFrom(descriptionOrOptions);
    
        super(
            HttpException.createBody(objectOrError, description, HttpStatus.CONFLICT),
            HttpStatus.CONFLICT,
            httpExceptionOptions,
        );
    }
}

export class ForbiddenException extends HttpException {
    constructor(
        objectOrError?: string | object | any,
        descriptionOrOptions: string | HttpExceptionOptions = 'Forbidden',
    ) {
        const { description, httpExceptionOptions } =
          HttpException.extractDescriptionAndOptionsFrom(descriptionOrOptions);
    
        super(
            HttpException.createBody(
                objectOrError,
                description,
                HttpStatus.FORBIDDEN,
            ),
            HttpStatus.FORBIDDEN,
            httpExceptionOptions,
        );
    }
}

export class GatewayTimeoutException extends HttpException {
    constructor(
        objectOrError?: string | object | any,
        descriptionOrOptions: string | HttpExceptionOptions = 'Gateway Timeout',
    ) {
        const { description, httpExceptionOptions } =
          HttpException.extractDescriptionAndOptionsFrom(descriptionOrOptions);
    
        super(
            HttpException.createBody(
                objectOrError,
                description,
                HttpStatus.GATEWAY_TIMEOUT,
            ),
            HttpStatus.GATEWAY_TIMEOUT,
            httpExceptionOptions,
        );
    }
}

export class GoneException extends HttpException {
    constructor(
        objectOrError?: string | object | any,
        descriptionOrOptions: string | HttpExceptionOptions = 'Gone',
    ) {
        const { description, httpExceptionOptions } =
          HttpException.extractDescriptionAndOptionsFrom(descriptionOrOptions);
    
        super(
            HttpException.createBody(objectOrError, description, HttpStatus.GONE),
            HttpStatus.GONE,
            httpExceptionOptions,
        );
    }
}

export class HttpVersionNotSupportedException extends HttpException {
    constructor(
        objectOrError?: string | object | any,
        descriptionOrOptions:
          | string
          | HttpExceptionOptions = 'HTTP Version Not Supported',
    ) {
        const { description, httpExceptionOptions } =
          HttpException.extractDescriptionAndOptionsFrom(descriptionOrOptions);
    
        super(
            HttpException.createBody(
                objectOrError,
                description,
                HttpStatus.HTTP_VERSION_NOT_SUPPORTED,
            ),
            HttpStatus.HTTP_VERSION_NOT_SUPPORTED,
            httpExceptionOptions,
        );
    }
}

export class InternalServerErrorException extends HttpException {
    constructor(
        objectOrError?: string | object | any,
        descriptionOrOptions:
          | string
          | HttpExceptionOptions = 'Internal Server Error',
    ) {
        const { description, httpExceptionOptions } =
          HttpException.extractDescriptionAndOptionsFrom(descriptionOrOptions);
    
        super(
            HttpException.createBody(
                objectOrError,
                description,
                HttpStatus.INTERNAL_SERVER_ERROR,
            ),
            HttpStatus.INTERNAL_SERVER_ERROR,
            httpExceptionOptions,
        );
    }
}

export class MethodNotAllowedException extends HttpException {
    constructor(
        objectOrError?: string | object | any,
        descriptionOrOptions: string | HttpExceptionOptions = 'Method Not Allowed',
    ) {
        const { description, httpExceptionOptions } =
          HttpException.extractDescriptionAndOptionsFrom(descriptionOrOptions);
    
        super(
            HttpException.createBody(
                objectOrError,
                description,
                HttpStatus.METHOD_NOT_ALLOWED,
            ),
            HttpStatus.METHOD_NOT_ALLOWED,
            httpExceptionOptions,
        );
    }
}

export class NotAcceptableException extends HttpException {
    constructor(
        objectOrError?: string | object | any,
        descriptionOrOptions: string | HttpExceptionOptions = 'Not Acceptable',
    ) {
        const { description, httpExceptionOptions } =
          HttpException.extractDescriptionAndOptionsFrom(descriptionOrOptions);
    
        super(
            HttpException.createBody(
                objectOrError,
                description,
                HttpStatus.NOT_ACCEPTABLE,
            ),
            HttpStatus.NOT_ACCEPTABLE,
            httpExceptionOptions,
        );
    }
}

export class NotFoundException extends HttpException {
    constructor(
        objectOrError?: string | object | any,
        descriptionOrOptions: string | HttpExceptionOptions = 'Not Found',
    ) {
        const { description, httpExceptionOptions } =
          HttpException.extractDescriptionAndOptionsFrom(descriptionOrOptions);
    
        super(
            HttpException.createBody(
                objectOrError,
                description,
                HttpStatus.NOT_FOUND,
            ),
            HttpStatus.NOT_FOUND,
            httpExceptionOptions,
        );
    }
}

export class NotImplementedException extends HttpException {
    constructor(
        objectOrError?: string | object | any,
        descriptionOrOptions: string | HttpExceptionOptions = 'Not Implemented',
    ) {
        const { description, httpExceptionOptions } =
          HttpException.extractDescriptionAndOptionsFrom(descriptionOrOptions);
    
        super(
            HttpException.createBody(
                objectOrError,
                description,
                HttpStatus.NOT_IMPLEMENTED,
            ),
            HttpStatus.NOT_IMPLEMENTED,
            httpExceptionOptions,
        );
    }
}

export class PayloadTooLargeException extends HttpException {
    constructor(
        objectOrError?: string | object | any,
        descriptionOrOptions: string | HttpExceptionOptions = 'Payload Too Large',
    ) {
        const { description, httpExceptionOptions } =
          HttpException.extractDescriptionAndOptionsFrom(descriptionOrOptions);
    
        super(
            HttpException.createBody(
                objectOrError,
                description,
                HttpStatus.PAYLOAD_TOO_LARGE,
            ),
            HttpStatus.PAYLOAD_TOO_LARGE,
            httpExceptionOptions,
        );
    }
}

export class PreconditionFailedException extends HttpException {
    constructor(
        objectOrError?: string | object | any,
        descriptionOrOptions: string | HttpExceptionOptions = 'Precondition Failed',
    ) {
        const { description, httpExceptionOptions } =
          HttpException.extractDescriptionAndOptionsFrom(descriptionOrOptions);
    
        super(
            HttpException.createBody(
                objectOrError,
                description,
                HttpStatus.PRECONDITION_FAILED,
            ),
            HttpStatus.PRECONDITION_FAILED,
            httpExceptionOptions,
        );
    }
}

export class RequestTimeoutException extends HttpException {
    constructor(
        objectOrError?: string | object | any,
        descriptionOrOptions: string | HttpExceptionOptions = 'Request Timeout',
    ) {
        const { description, httpExceptionOptions } =
          HttpException.extractDescriptionAndOptionsFrom(descriptionOrOptions);
    
        super(
            HttpException.createBody(
                objectOrError,
                description,
                HttpStatus.REQUEST_TIMEOUT,
            ),
            HttpStatus.REQUEST_TIMEOUT,
            httpExceptionOptions,
        );
    }
}

export class ServiceUnavailableException extends HttpException {
    constructor(
        objectOrError?: string | object | any,
        descriptionOrOptions: string | HttpExceptionOptions = 'Service Unavailable',
    ) {
        const { description, httpExceptionOptions } =
          HttpException.extractDescriptionAndOptionsFrom(descriptionOrOptions);
    
        super(
          HttpException.createBody(
            objectOrError,
            description,
            HttpStatus.SERVICE_UNAVAILABLE,
          ),
          HttpStatus.SERVICE_UNAVAILABLE,
          httpExceptionOptions,
        );
    }
}

export class UnauthorizedException extends HttpException {
    constructor(
        objectOrError?: string | object | any,
        descriptionOrOptions: string | HttpExceptionOptions = 'Unauthorized',
    ) {
        const { description, httpExceptionOptions } =
            HttpException.extractDescriptionAndOptionsFrom(descriptionOrOptions);
    
        super(
            HttpException.createBody(
                objectOrError,
                description,
                HttpStatus.UNAUTHORIZED,
            ),
            HttpStatus.UNAUTHORIZED,
            httpExceptionOptions,
        );
    }
}

export class UnsupportedMediaTypeException extends HttpException {
    constructor(
        objectOrError?: string | object | any,
        descriptionOrOptions:
          | string
          | HttpExceptionOptions = 'Unsupported Media Type',
    ) {
        const { description, httpExceptionOptions } =
          HttpException.extractDescriptionAndOptionsFrom(descriptionOrOptions);
    
        super(
          HttpException.createBody(
            objectOrError,
            description,
            HttpStatus.UNSUPPORTED_MEDIA_TYPE,
          ),
          HttpStatus.UNSUPPORTED_MEDIA_TYPE,
          httpExceptionOptions,
        );
    }
}