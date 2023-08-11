//@see https://github.com/nestjs/nest/blob/5d5298219ee56a0b57d831d5e0009f7920d98ed0/packages/common/interfaces/features/custom-route-param-factory.interface.ts

/**
 * @publicApi
 */
export type CustomParamFactory<TData = any, TInput = any, TOutput = any> = (
    data: TData,
    input: TInput,
) => TOutput;