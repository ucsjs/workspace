# Concept

Blueprints are components that have configurations through a header, and may contain inputs, outputs, events and triggers that, when externalized, can be connected to other blueprints when the input and output have the same type of data, and it is also possible to contain adjustable configuration properties in visual mode, and transformers whose function is to manipulate the data before it is delivered to the blueprints that listen to the outputs of the component, to make this process efficient, the RxJS library (https://rxjs.dev/) was used, providing reactivity in the triggers and outputs, so whenever a change occurs, all hanging blueprints receive this update to continue their processing flow.

![Blueprint core](/blueprint-core.png "Blueprint core")

Below is an example of two real simple blueprints, I follow with a comment on how it works:

```typescript
import * as crypto from "crypto";

import { 
    Types, 
    IBlueprintData, 
    IBlueprintHeader, 
    Blueprint, 
    Input 
} from "@ucsjs/core";

export default class Crypto extends Blueprint {

    public header: IBlueprintHeader = {
        useInEditor: true,
        version: 1,
        namespace: "Crypto",
        group: "Crypto & Hash",
        icon: "fa-solid fa-lock",
        helpLink: "https://nodejs.org/api/crypto.html",
        inputs: [
            { 
                name: "_default", 
                alias: "value", 
                type: Types.Any
            }
        ],
        outputs: [
            { 
                name: "_default", 
                type: Types.String 
            }
        ],
        properties: [
            { 
                name: "algorithm", 
                displayName: "Algorithm", 
                type: Types.Options, 
                default: "SHA256",
                required: true, 
                options: [
                    { name: "SHA256", value: "SHA256" },
                    { name: "SHA3-256", value: "SHA3-256" },
                    { name: "SHA3-384", value: "SHA3-384" },
                    { name: "SHA3-512", value: "SHA3-512" },
                    { name: "SHA384", value: "SHA384" },
                    { name: "SHA512", value: "SHA512" }
                ] 
            },
            { 
                name: "encoding", 
                displayName: "Encoding",
                default: "hex", 
                required: true, 
                type: Types.Options,  
                options: [
                    { name: "BASE64", value: "base64" },
                    { name: "HEX", value: "hex" }
                ]
            }
        ]
    }

    @Input("_default")
    private async createHash(data: IBlueprintData) {
        try{
            let value = data.value;
            let algorithm = this.getParameter("algorithm", "SHA256");
            let encoding = this.getParameter("encoding", "hex") as crypto.BinaryToTextEncoding;

            switch(typeof value){
                case "number": value = value.toString(); break;
                case "object": value = JSON.stringify(value); break;
            }

            const hash = (value) ? await crypto
            .createHash(algorithm)
            .update(Buffer.from(value))
            .digest(encoding) : null;

            this.next(data.extend(this, { 
                raw: value, 
                value: hash 
            }));
        }
        catch(e){
            this.next(this.generateError(
                this, e.message, 
                `${this.header.namespace}::${this.id}`
            ));
        }
    }
}
```

The first blueprint for creating encrypted and hashed data through the native Node.js library **Crypto**, notice that initially an extended class of the Blueprint class imported from `@ucsjs/core` was created, the default header was defined using the interface `IBlueprintHeader`, namespace, group, icon, help link on how the blueprint works, data input of type Any, output of string type, and configuration properties for algorithm and output encoding.

Then, using the `@Input` decorator, it will be intercepted every time the blueprint receives a new data entry through another blueprint or even by direct injection via code, the received value always comes as a parameter of the intercept function in the `IBlueprintData` format inside the function to create a hash I use the function "this.getParameter" to get the necessary data predefined in the header, and why not get it directly from this.header? because these properties can be changed via code or by the editor and will have values different from their defaults defined in the header, so it is recommended to use the getParameter function to return the value correctly, the return type can be passed directly in the request, example:

```typescript
let encoding = this.getParameter<crypto.BinaryToTextEncoding>("encoding", "hex");
```

Next, the script checks the typeof of the input since the input was defined as Any, and in case the input is an object, it uses JSON.stringify to make it a text, executes the hash creation process by the Crypto library, returning the generated hash using the `this.next` function, in turn, as the type of data that travels between blueprints, it always needs to be of type `IBlueprintData`, it is possible to pack using `this.generateData` or `data.extend`, and in the first case it will be an output containing only kinship data of the blueprint that generated the information is generated, when using data.extend, a history of all the blueprints that this information passed will be created, and how it was changed throughout the process, an excellent option for flow debug.

A pertinent observation that the `this.next` function only has an effect between input and output, in the case of events and triggers the correct function would be `this.dispatch` the triggers do not send data from one blueprint to another, it only triggers events from other blueprints, being a more used mechanism for event-driven blueprints such as HTML elements, for example: I want a fetch request to be performed when a button is clicked, so the control blueprint needs to contain the onclick trigger coupled to an event that triggers a certain action.

The second example is the implementation of a simple blueprint that prints to the console:

```typescript
import { isFunction } from "@ucsjs/common";

import { 
    Types, 
    Input,
    IBlueprintData, 
    IBlueprintHeader, 
    IBlueprintSettings, 
    IBlueprintTrigger, 
    Blueprint, 
    Trigger
} from "@ucsjs/core";

export default class Console extends Blueprint {

    public header: IBlueprintHeader = {
        useInEditor: true,
        version: 1,
        namespace: "Console",
        group: "Debug",
        helpLink: "https://www.w3schools.com/jsref/met_console_log.asp",
        inputs: [
            { 
                name: "_default", 
                alias: "value", 
                type: Types.Any
            }
        ],
        events: [
            { 
                name: "_default"
            }
        ]
    }

    private customOutput = (data: IBlueprintData) => { 
        console.log(data.value); 
    };

    constructor(settings?: IBlueprintSettings) {
        super(settings);

        if(settings && settings.customOutput && isFunction(settings.customOutput))
            this.customOutput = settings.customOutput;
    }

    @Trigger("_default")
    private eventTrigger(trigger: IBlueprintTrigger){
        this.display(this.triggerIdentify(trigger))
    }

    @Input("_default")
    private display(data: IBlueprintData){
        if(this.customOutput && isFunction(this.customOutput))
            this.customOutput(data)
    }
}
```

In this example, the header was defined as in the previous example, in the class constructor the default blueprint constructor was overridden, obviously executing the base functions through the `super(settings);` function. and check if in the specific case of this blueprint there is an additional parameter called `customOutput` which must be of type Function, if it exists it will replace the standard output "console.log" so the blueprint can be extensible to use some more complex log integration like NewRelic, Bugsnag and others.

Note that in this blueprint the `_default` event was implemented and a function that uses the `@Trigger` decorator that triggers the console.log passing the `triggerIdentify` function as data that will transform the `IBlueprintTrigger` into `IBlueprintData`. Obviously there will not be a value being transacted between the blueprints, but in debug terms it serves as a method of identifying when the previous blueprint fired a certain trigger.

## Flow

I'm going to give a general overview on the concept of flows, but we have a more in-depth topic on the topic in the side menu, since it is part of the core of the application and is vital for the functioning of the system. The blueprints themselves have a series of behavioral information, but the great magic occurs when several blueprints are coupled, exchanging information between them in order to generate a final output that can be an HTTP response, triggering an event, sending a email, among others, or simply externalize this output so that other flows consume in format, thus creating infinite possibilities of interconnections between blueprints and complex cascading flows, so that this is possible the flow controls the connections between the blueprints and is responsible for configuring, build and execute all the blueprints, in the example below we will use 3 blueprints, the first general a continuous flow of integer intervals internally using the "setInterval" function of Javascript and for each looping it sends the incremented value to the output, configurable.

The second blueprint will be the Crypto commented above configured to export hash in SHA1 hexadecimal, finally the blueprint console that will show the final result in the console.

```typescript
import { Logger } from "@ucsjs/common";

import { 
    Blueprint, 
    Flow, 
    IBlueprintData, 
    IBlueprintIncorporate 
} from "@ucsjs/core";

export default class CryptoSample extends Blueprint {
    public incorporate(): { [key: string]: IBlueprintIncorporate } {
        return {
            "bp:1": { blueprint: "Interval" },
            "hs:1": { 
                blueprint: "Crypto", 
                args: { 
                    algorithm: "sha1", 
                    encoding: "hex" 
                } 
            },
            "out:1": { blueprint: "Console", args: {
                customOutput: (data: IBlueprintData) => 
                Logger.debug(`${data.data.raw}: ${data.value}`, "CryptoSample") 
            } }
        };
    } 

    public async bind(flow: Flow){
        flow.subscribeMulti({
            "bp:1->_default": "hs:1->_default",
            "hs:1->_default": "out:1->_default"
        });
    }
}
```

In this implementation I used functions from the blueprint class itself, the `incorporate` function must return a list of blueprints and their configurations, this return object assigns an identification to the key, therefore the connections must be made using this reference because the blueprints will be instantiated using the namespace of the key, then the `bind` function was configured, which receives as a parameter the flow previously created by the class, inside the flow I configure the subscribe passing an object where the key would be the input and the value the ouput that must be connected, where the value can be a list or string.

In a previous version of the application, this function would have 4 parameters, source blueprint, output, destination blueprint, input, but I simplified this format using `->` as a flow indicator inside the string, honestly I found the way the final code remains, and is still extensible to multiple connections.

Another way to create a flow would be to directly instantiate the Flow class, some application controllers used this method, let's analyze one of these implementations below:

```typescript
let connectionString = await this.tokenizer.getToken("MONGODB_CONN");
        
if(connectionString) {
    this.flow = await Flow.create({
        "MongoDB": { blueprint: "MongoDB", args: { connectionString } },
        "MongoDBSchema": { blueprint: "MongoDBSchema", args: { 
            name: "users",
            collection: "users",
            timestamps: true,
            fields: [
                { 
                    name: "user", 
                    type: "String", 
                    index: true, 
                    required: true 
                },
                { 
                    name: "pass", 
                    type: "String", 
                    index: true, 
                    required: true 
                },
            ]
        } },
        "MongoDBFind": { 
            blueprint: "MongoDBFind", 
            args: { limit: 10 } 
        },
        "MongoDBInsert": { 
            blueprint: "MongoDBInsert", 
            transforms: {
                query: [
                    { 
                        blueprint: "Crypto", 
                        input: "_default", 
                        output: "_default", 
                        key: "pass" 
                    }
                ]
            } 
        },
        "MongoDBUpdate": { blueprint: "MongoDBUpdate", transforms: {
            set: [
                { 
                    blueprint: "Crypto", 
                    input: "_default",
                    output: "_default", 
                    key: "pass" 
                }
            ]
        } },
        "MongoDBDelete": { blueprint: "MongoDBDelete" }
    }, {
        "MongoDB->_default": "MongoDBSchema->connectionName",
        "MongoDBSchema->model": [
            "MongoDBFind->model", 
            "MongoDBInsert->model", 
            "MongoDBUpdate->model", 
            "MongoDBDelete->model"
        ]
    });
}
else {
    this.catch(
        `Error when trying to retrieve the necessary token for the controller to work`, 
        "UsersController"
    );
}
```

Note that in the example above, the tokenization service was used to retrieve previously defined data for the connection with the MongoDB database, the documentation has a specific topic on tokenization, if you want to understand it better, just search in the menu on the side, continuing the manual instantiation of the Flow class using the `create` function as a parameter, first the list of blueprints and their settings will be passed, then an object with the connections, it is clear that this example performs a simple CRUD using MongoDB blueprints available in the application.

At this point I will not delve into how MongoDB blueprints work since we have specific documentation on this topic, but note that transformers were used to encrypt the password and multiple connections in MongoDBSchema so that all blueprints simultaneously receive the model as soon as it is generated . however, this flow is not started at any time, so it will not have any expected output, this code uses a more advanced concept of interceptors to process the data by the blueprint in the HTTP request of a controller, injecting the query data, set, id on demand, obviously blueprints were created for this type of implementation, however, I created devices to be used via code on demand for cases where the triggering of the flow occurs by human intervention, whether by http request, webhooks, or even a play by the editor.

In the topic about controllers I show the complete example test code injecting the data and retrieving the outputs through Promises and returning as a response to the request.

![Flow core](/flow-core.png "Flow core")

Above contains Flow's operating scheme, note that it is possible to inject data into the flow, configure data interceptors before executing the flow, and after executing the flow it stays in standby mode, in case there are other movements within the blueprints, so the same flow can be defined for several functionalities as was the case with the CRUD example above and after being configured and running the flow does not need to be instantiated again, if the application no longer needs the flow it is possible to destroy it by overriding the variable or calling the "destroy" function that will end the flow by pausing the blueprints, so any subsequent calls will not be processed.