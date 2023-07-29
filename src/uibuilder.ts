import * as fs from "fs";
import { GlobalRegistry } from "@ucsjs/core";
import { GlobalUIComponents, UIBuilder, TransformHTML } from "@ucsjs/uibuilder";

(async () => {
    await Promise.all([
        GlobalRegistry.load(),
        GlobalUIComponents.load()
    ]);

    const app = UIBuilder.fromMetadata("sample");
    const HTML = TransformHTML.parser(app);
    console.log(HTML);
    fs.writeFileSync("sample.html", HTML);
})();