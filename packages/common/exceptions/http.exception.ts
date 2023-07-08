//@see https://github.com/nestjs/nest/blob/master/packages/common/exceptions/http.exception.ts

import { HttpStatus } from "../enums";

export class HttpException extends Error {
    constructor(
        private readonly response: string,
        private readonly status: HttpStatus
    ){
        super();
        this.name = this.constructor.name;
        this.status = status; 
        this.message = response;
    }
}

export class BadGatewayException extends HttpException {
    constructor(error?: string){
        super(error, HttpStatus.BAD_GATEWAY);
    }
}

export class BadRequestException extends HttpException {
    constructor(error?: string){
        super(error, HttpStatus.BAD_REQUEST);
    }
}

export class ConflictException extends HttpException {
    constructor(error?: string){
        super(error, HttpStatus.CONFLICT);
    }
}

export class ForbiddenException extends HttpException {
    constructor(error?: string){
        super(error, HttpStatus.FORBIDDEN);
    }
}

export class GatewayTimeoutException extends HttpException {
    constructor(error?: string){
        super(error, HttpStatus.GATEWAY_TIMEOUT);
    }
}

export class GoneException extends HttpException {
    constructor(error?: string){
        super(error, HttpStatus.GONE);
    }
}

export class HttpVersionNotSupportedException extends HttpException {
    constructor(error?: string){
        super(error, HttpStatus.HTTP_VERSION_NOT_SUPPORTED);
    }
}

export class InternalServerErrorException extends HttpException {
    constructor(error?: string){
        super(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}

export class MethodNotAllowedException extends HttpException {
    constructor(error?: string){
        super(error, HttpStatus.METHOD_NOT_ALLOWED);
    }
}

export class NotAcceptableException extends HttpException {
    constructor(error?: string){
        super(error, HttpStatus.NOT_ACCEPTABLE);
    }
}

export class NotFoundException extends HttpException {
    constructor(error?: string){
        super(error, HttpStatus.NOT_FOUND);
    }
}

export class NotImplementedException extends HttpException {
    constructor(error?: string){
        super(error, HttpStatus.NOT_IMPLEMENTED);
    }
}

export class PayloadTooLargeException extends HttpException {
    constructor(error?: string){
        super(error, HttpStatus.PAYLOAD_TOO_LARGE);
    }
}

export class PreconditionFailedException extends HttpException {
    constructor(error?: string){
        super(error, HttpStatus.PRECODITION_FAILED);
    }
}

export class RequestTimeoutException extends HttpException {
    constructor(error?: string){
        super(error, HttpStatus.REQUEST_TIMEOUT);
    }
}

export class ServiceUnavailableException extends HttpException {
    constructor(error?: string){
        super(error, HttpStatus.SERVICE_UNAVAILABLE);
    }
}

export class UnauthorizedException extends HttpException {
    constructor(error?: string){
        super(error, HttpStatus.UNAUTHORIZED);
    }
}

export class UnsupportedMediaTypeException extends HttpException {
    constructor(error?: string){
        super(error, HttpStatus.UNSUPORTED_MEDIA_TYPE);
    }
}