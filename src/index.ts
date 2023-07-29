import { Application, WsAdapter } from "@ucsjs/common";
import { CacheModule, GlobalModules, GlobalRegistry } from "@ucsjs/core";
import { GlobalProto } from "@ucsjs/protobuf";
import { GlobalUIComponents } from "@ucsjs/uibuilder";
import { EditorModule } from "@ucsjs/editor";
import { WSInterceptor } from "./interceptors/ws.interceptor";

(async () => {
    await Promise.all([
        GlobalRegistry.load(),
        GlobalProto.load(),
        GlobalUIComponents.load()
    ]);

    GlobalModules.register(CacheModule, {
        //store: ioRedisStore,
        settings: {
            ttl: 60
        }
    });

    const app = await Application.create(async () => {
        return await GlobalModules.dynamicModule({
            controllers: ["./**/*.controller.ts"],
            imports: [EditorModule]
        });
    });

    app.useWebSocketAdapter(new WsAdapter(app), WSInterceptor.intercept);
    app.listen(process.env.PORT || 3050);
})();