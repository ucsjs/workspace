//@see https://github.com/nestjs/nest/blob/5d5298219ee56a0b57d831d5e0009f7920d98ed0/packages/common/decorators/core/optional.decorator.ts

import {
    OPTIONAL_DEPS_METADATA,
    OPTIONAL_PROPERTY_DEPS_METADATA,
} from '../../constants';

import { isUndefined } from '../../utils/shared.utils';
  
export function Optional(): PropertyDecorator & ParameterDecorator {
    return (target: object, key: string | symbol | undefined, index?: number) => {
      if (!isUndefined(index)) {
        const args = Reflect.getMetadata(OPTIONAL_DEPS_METADATA, target) || [];
        Reflect.defineMetadata(OPTIONAL_DEPS_METADATA, [...args, index], target);
        return;
      }
      const properties =
        Reflect.getMetadata(
          OPTIONAL_PROPERTY_DEPS_METADATA,
          target.constructor,
        ) || [];
      Reflect.defineMetadata(
        OPTIONAL_PROPERTY_DEPS_METADATA,
        [...properties, key],
        target.constructor,
      );
    };
}