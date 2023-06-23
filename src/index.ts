import * as path from "path";

import { Logger } from "@ucsjs/common";
import { GlobalRegistry } from "@ucsjs/blueprint";
import { MainModule } from "@modules";
import { Express } from "./servers";

(async () => {
    await GlobalRegistry.registerDirectory(path.resolve((process.env.NODE_ENV == "prod") ? "./dist" : "./src"));
    const port: number = parseInt(process.env.PORT) || 3000;
    let server = new Express(MainModule).create();    
    server.listen(port).then(() => Logger.log(`Start on port ${port}`, "Server"));
})();