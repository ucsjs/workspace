//@see https://github.com/nestjs/nest/blob/eef670896a92ca144a8299a1d0c78c9842abe8d7/packages/websockets/decorators/connected-socket.decorator.ts

import { WsParamtype } from '../../enums/ws-paramtype.enum';
import { createWsParamDecorator } from '../../utils/web-socket.util';

/*export const ConnectedSocket: () => ParameterDecorator = createWsParamDecorator(
  WsParamtype.SOCKET,
);*/