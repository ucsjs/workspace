import { Application } from "@ucsjs/common";
import { CacheModule, GlobalModules, GlobalRegistry } from "@ucsjs/core";

(async () => {
    await GlobalRegistry.load();

    GlobalModules.register(CacheModule, {
        //store: ioRedisStore,
        settings: {
            ttl: 60
        }
    });

    const app = await Application.create(await GlobalModules.dynamicModule({
        constrollers: ["./**/*.controller.ts"]
    }));

    const port: number = parseInt(process.env.PORT) || 3050;  
    app.listen(port);
})();