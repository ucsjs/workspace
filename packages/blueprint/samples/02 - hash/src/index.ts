import { Flow } from "../../../src/services/flow.service";
import { CounterBlueprint } from "../../../src/blueprints/counter.blueprint";
import { HashBlueprint } from "../../../src/blueprints/hash.blueprint";
import { ConsoleBlueprint } from "../../../src/blueprints/console.blueprint";

new Flow({
    counter: new CounterBlueprint(),
    hash: new HashBlueprint({ algorithm: "sha256", encoding: "hex" }),
    console: new ConsoleBlueprint()
})
.subscribe("counter", "counter", "hash", "state")
.subscribe("hash", "result", "console", "message")
.start();