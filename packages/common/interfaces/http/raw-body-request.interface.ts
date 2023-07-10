//@see https://github.com/nestjs/nest/blob/master/packages/common/interfaces/http/raw-body-request.interface.ts

export type RawBodyRequest<T> = T & { rawBody?: Buffer };