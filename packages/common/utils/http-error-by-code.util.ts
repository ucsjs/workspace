//@see https://github.com/nestjs/nest/blob/5d5298219ee56a0b57d831d5e0009f7920d98ed0/packages/common/utils/http-error-by-code.util.ts

import { HttpStatus } from '../enums';

import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GatewayTimeoutException,
  GoneException,
  InternalServerErrorException,
  MethodNotAllowedException,
  NotAcceptableException,
  NotFoundException,
  NotImplementedException,
  PayloadTooLargeException,
  PreconditionFailedException,
  RequestTimeoutException,
  ServiceUnavailableException,
  UnauthorizedException,
  UnsupportedMediaTypeException,
} from '../exceptions';
import { Type } from '../interfaces';

export type ErrorHttpStatusCode =
  | HttpStatus.BAD_GATEWAY
  | HttpStatus.BAD_REQUEST
  | HttpStatus.CONFLICT
  | HttpStatus.FORBIDDEN
  | HttpStatus.GATEWAY_TIMEOUT
  | HttpStatus.GONE
  | HttpStatus.INTERNAL_SERVER_ERROR
  | HttpStatus.METHOD_NOT_ALLOWED
  | HttpStatus.NOT_ACCEPTABLE
  | HttpStatus.NOT_FOUND
  | HttpStatus.NOT_IMPLEMENTED
  | HttpStatus.PAYLOAD_TOO_LARGE
  | HttpStatus.PRECONDITION_FAILED
  | HttpStatus.REQUEST_TIMEOUT
  | HttpStatus.SERVICE_UNAVAILABLE
  | HttpStatus.UNAUTHORIZED
  | HttpStatus.UNSUPPORTED_MEDIA_TYPE;

export const HttpErrorByCode: Record<ErrorHttpStatusCode, Type<unknown>> = {
  [HttpStatus.BAD_GATEWAY]: BadGatewayException,
  [HttpStatus.BAD_REQUEST]: BadRequestException,
  [HttpStatus.CONFLICT]: ConflictException,
  [HttpStatus.FORBIDDEN]: ForbiddenException,
  [HttpStatus.GATEWAY_TIMEOUT]: GatewayTimeoutException,
  [HttpStatus.GONE]: GoneException,
  [HttpStatus.INTERNAL_SERVER_ERROR]: InternalServerErrorException,
  [HttpStatus.METHOD_NOT_ALLOWED]: MethodNotAllowedException,
  [HttpStatus.NOT_ACCEPTABLE]: NotAcceptableException,
  [HttpStatus.NOT_FOUND]: NotFoundException,
  [HttpStatus.NOT_IMPLEMENTED]: NotImplementedException,
  [HttpStatus.PAYLOAD_TOO_LARGE]: PayloadTooLargeException,
  [HttpStatus.PRECONDITION_FAILED]: PreconditionFailedException,
  [HttpStatus.REQUEST_TIMEOUT]: RequestTimeoutException,
  [HttpStatus.SERVICE_UNAVAILABLE]: ServiceUnavailableException,
  [HttpStatus.UNAUTHORIZED]: UnauthorizedException,
  [HttpStatus.UNSUPPORTED_MEDIA_TYPE]: UnsupportedMediaTypeException,
};