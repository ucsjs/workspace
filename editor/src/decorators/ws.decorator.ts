import { createDecorator } from 'vue-facing-decorator';
import { WS } from '@mixins/ws';

export function Subscribe(event: string) {
    return createDecorator((options, key) => {
        const handler = options.methods?.[key];
        WS.subscribe(event, handler, options);
    });
}

