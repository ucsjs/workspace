import { Application, Logger } from "@ucsjs/common";
import { GlobalRegistry } from "@ucsjs/core";
import { MainModule } from "@modules";

(async () => {
    await GlobalRegistry.load();
    const app = await Application.create(MainModule);
    const port: number = parseInt(process.env.PORT) || 3050;  
    app.listen(port);
})();