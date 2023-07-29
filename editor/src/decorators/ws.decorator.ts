import { WS } from '@mixins/ws';
import { createDecorator } from 'vue-facing-decorator';

export function Subscriber(event: string) {
    return createDecorator(function (options, key) {
        const handler = options.methods?.[key];
        WS.subscriber(event, handler);
    });
}

