//@see https://github.com/nestjs/nest/blob/master/packages/common/interfaces/http/message-event.interface.ts

export interface MessageEvent {
    data: string | object;
    id?: string;
    type?: string;
    retry?: number;
}