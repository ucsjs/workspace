import * as path from "path";

import { Logger } from "@ucsjs/common";
import { GlobalRegistry } from "@ucsjs/core";
import { MainModule } from "@modules";
import { Express } from "./servers";

(async () => {
    await GlobalRegistry.load();
    const port: number = parseInt(process.env.PORT) || 3000;
    let server = new Express(MainModule).create();    
    server.listen(port).then(() => Logger.log(`Start on port ${port}`, "Server"));
})();