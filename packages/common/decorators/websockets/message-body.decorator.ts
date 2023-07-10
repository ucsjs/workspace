import { PipeTransform, Type } from '../../interfaces';
import { WsParamtype } from '../../enums';
import { createPipesWsParamDecorator } from '../../utils';

export function MessageBody(): ParameterDecorator;

export function MessageBody(
    ...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator;

export function MessageBody(
    propertyKey: string,
    ...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator;

export function MessageBody(
    propertyOrPipe?: string | (Type<PipeTransform> | PipeTransform),
    ...pipes: (Type<PipeTransform> | PipeTransform)[]
): ParameterDecorator {
    return createPipesWsParamDecorator(WsParamtype.PAYLOAD)(
        propertyOrPipe,
        ...pipes,
    );
}