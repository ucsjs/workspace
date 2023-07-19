import { Application, WsAdapter } from "@ucsjs/common";
import { CacheModule, GlobalModules, GlobalRegistry } from "@ucsjs/core";
import { GlobalProto } from "@ucsjs/protobuf";
import { EditorModule } from "@ucsjs/editor";

(async () => {
    await Promise.all([
        GlobalRegistry.load(),
        GlobalProto.load()
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

    app.useWebSocketAdapter(new WsAdapter(app));
    app.listen(process.env.PORT || 3050);
})();