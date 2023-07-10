//@see https://github.com/nestjs/nest/blob/eef670896a92ca144a8299a1d0c78c9842abe8d7/packages/websockets/interfaces/server-and-event-streams-host.interface.ts

import { ReplaySubject, Subject } from 'rxjs';

export interface ServerAndEventStreamsHost<T = any> {
    server: T;
    init: ReplaySubject<T>;
    connection: Subject<any>;
    disconnect: Subject<any>;
}