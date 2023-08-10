# Core

In this topic, we will go deeper into the main Blueprint class and its functionality, as most of the application subsystems are derived from this class, it is important to understand its operation and limitations, the Blueprint class extends from Singleton, and implements functions of the IBlueprint interface, all the files are available in the `@ucsjs/core` package and can be loaded directly via the Typescript alias in case of downloading the complete project and or by importing a dependency through NPM in independent projects.

## Settings

The class constructor can receive a series of settings that will be coupled to the Blueprint header as well as the definition of transforms occurs in this step, the transforms in turn are other blueprints that will make changes to the blueprint input data, such as encrypting a password before being sent to the database, or validating data from a JSON, etc, the function of transforms can be of the most diverse and easily configurable both in code and by the editor, later on I will comment in more detail about them, a priori let's focus on the settings.

The configuration interface does not limit any type of data input as the header definitions can vary, so the configuration interface will be a simple object that can receive any parameters.

```ts
export interface IBlueprintSettings {
    [key: string]: any;
}
```

However, the configuration will only be stored from the constructor and will be effectively validated from the "setup" function call, the function still has the scope to read metadata recorded through decorators using reflection and thus binding the input functions and trigger in addition to changing property values previously defined in the header, in this step the system checks all the possibilities of inputs and outputs and configures callbacks or subscribe values according to the need, in case outputs and triggers will be used reactivity using the RxJS (https://rxjs.dev/) library.

## Lifecycle

![Blueprint lifecycle](/blueprint-lifecycle.png "Blueprint lifecycle")

As soon as a blueprint is created, the outputs are active waiting for changes and the pre-configured inputs in case they receive new data entries, as mentioned in the concept topic, it is recommended to use GlobalRegistry to call blueprints and use flows to control data, as the blueprint setup call occurs automatically, if the blueprint is imported manually and instantiated, it will be necessary to call the setup function manually before starting the build flow and any other configurations such as interceptors and injectors.

Using the Flow class, it is still possible to automatically start the blueprint lifecycle using the buildListenAndExecute function, internally the Flow class requests all blueprints through `GlobalRegistry`, calling the retrieve function, in the side menu it is possible to find a specific flow topic with all the internal functions of the class.

## Functions


### next

<br/>

```ts
next(data: IBlueprintData, name: string = "_default"): Blueprint
```

The next function will be responsible for changing the output value which in turn automatically transmits the change to all subscribers by reactivity, by default all data transferred between blueprints are of type IBlueprintData, the second parameter defines the name of the output, which must be previously defined in the blueprint header, if this is not done, the system will return an error whenever the next function is called, warning that the output has not been defined, so it will not be possible to continue the application flow.

### nextAll

```ts
nextAll(data: IBlueprintData): Blueprint
```

The `nextAll` function has the premise of changing all outputs present, normally used to propagate errors between blueprints so that the final output stream is the error message.

### output

```ts
output<T extends IBlueprintData>(name: string = "_default"): boolean
```

The output function can be used within the blueprint creation flow to dynamically configure outputs that were not previously defined in the blueprint header, and must contain the type of data it can receive, which by default is always recommended to be `IBlueprintData`, as a parameter it is enough define the name of the output and its return returns boolean, because if an output with the same name already exists, it will not be possible to register another one in overlapping, the system will always respect the first output defined with the same name.

### input

```ts
input(callback: Function, name: string = "_default", header: IBlueprintInput): boolean
```

The input function aims to dynamically create input in the blueprint, and can be used in any internal function of the blueprint. Respecting any input previously defined in the blueprint header. As the function's first parameter, it receives callback. Which will be executed every time a new data entry is received by. The second parameter defines the input name. And the third parameter? The input header. The header needs to be defined to complement the data entry information such as type. Among other information already defined and explained and commented in this documentation. The return of the function will be of boolean type, If the input has already been defined in the header or previously by another function, an input with the same name. The return will be negative.

### event

```ts
event(callback: Function, name: string = "_default"): boolean
```

The purpose of the function event is to dynamically define events that can be triggered by other blueprints first parameter of the function receives a callback will be executed every time a Trigger referenced to this event was issued second parameter defines the name of the event just like the previous examples the return of the function is boolean since If there are events with the same name, the function will return false.

### trigger

```ts
trigger(name: string = "_default"): boolean
```

The trigger function must be used to dynamically create a trigger, as all functions for dynamic creation return false when there is already a previously defined trigger in the header.

### subscribe

```ts
subscribe(blueprint: IBlueprint, outputName: string = "_default", inputName: string = "_default"): void
```

the subscribe function creates a link between the output of a Blueprint and the input of another bluprint by means of reactivity whenever the output undergoes a change in value, the input receives the information and executes the internal process if there is a need to make some kind of conversion, data treatment or even perform a search function as in the case of a database. For each output it is possible to have a series of inputs that will receive changes on demand, so in practice the subscribe function performs the subscription of data previously configured with the RxJS library.

### subscribePromise

```ts
subscribePromise(outputName: string = "_default"): Promise<IBlueprintData>
```

In specific cases of need to intercept changed values of an output, it is possible to use the subscribePromise function, passing only as a parameter the name of the output that you want to monitor. Through this function it is possible to create interceptors through the Flow class, it is still possible to create Rest and GraphQL controllers using blueprints for data processing.

### intercept

```ts
intercept(outputName: string = "_default"): Promise<any>
```

The intercept function creates a subscribe to an output and returns a promise that will be executed as soon as the output value is changed, as it is a promise return if there are several value changes, only the first one will be returned.

### interceptOnPromise

```ts
interceptOnPromise(outputName: string = "_default")
```

The interceptOnPromise function has almost the same function as intercept, but reconfigures the blueprint and runs the flow again from scratch as if it had just been created, this function is used for intermittent processing flows such as HTTP requests through controllers.

### listen

```ts
listen(blueprint: IBlueprint, triggerName: string = "_default", eventName: string = "_default")
```

The purpose of the listen function is to link an event of a bluprint with a trigger of another, so when the trigger is fired, it calls the event coupled to the output, it follows the same principle of Input/Output, however there is no data transfer between the blueprints, only an event call.

### dispatch

```ts
dispatch(triggerData: IBlueprintTrigger, eventName: string = "_default")
```

The dispatch function is responsible for receiving triggers and executing the linked events.

### emit

```ts
emit(issuer: Blueprint, name: string = "_default")
```

The dispatch function fires a previously defined trigger in the blueprint header, if there are events hanging from the trigger output, they will all be fired simultaneously in parallel.


### generateData

```ts
generateData(blueprint: Blueprint, data: any): IBlueprintData
```

The generateData function receives a blueprint and a set of data of any type and packs it in an IBlueprintData format, necessary for communication between blueprints, in case of data chaining for debugging the recommendation and use data.extent provided in the interface is implemented in the `BlueprintData` class and `BlueprintDataError`.

### generateError

```ts
generateError(blueprint: Blueprint, message: string, scope: string): IBlueprintData
```

The generateError function generates a package of type `IBlueprintData` but containing an internal error that may have occurred in some blueprint during the process, being transmitted throughout the flow to the final output of the application, which in the case of HTTP will be returned as 500 and the error message generated is the blueprint reference that originated the error, in case of other outputs the error will be displayed according to the implementation.

### receive

```ts
async receive(data: IBlueprintData, inputName: string = "_default"): Promise<void>
```

The receive function is used internally to receive all data streams sent by other blueprints, and directs to the input informed in the second parameter, the function can also be used to inject data to an input previously configured in the header, this stream is most used in case of using blueprints in controllers, it is recommended to use them whenever it is necessary to manipulate blueprint data via code.

### getParameter

```ts
getParameter<T>(name: string, defaultValue: T): T
getParameter(name: string, defaultValue: any): any | null
```

The getParameter function returns a previously defined property in the header that may have been changed during the setup or build of the blueprint or through metadata via the editor, in the example below we will analyze the implementation and use of the function in the Crypto blueprint:

```ts
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

...

let value = data.value;
let algorithm = this.getParameter("algorithm", "SHA256");
let encoding = this.getParameter<crypto.BinaryToTextEncoding>("encoding", "hex");

switch(typeof value){
    case "number": value = value.toString(); break;
    case "object": value = JSON.stringify(value); break;
}

const hash = (value) ? await crypto.
createHash(algorithm).
update(Buffer.from(value)).
digest(encoding) : null;

this.next(data.extend(this, { raw: value, value: hash }));
```

In the example above, the algorithm and encoding properties were defined, by default they would return "SHA256" and "HEX" respectively, but these properties can be changed both when instantiating the blueprint and when creating the Flow, as follows:

```ts
export default class CryptoSample extends Blueprint {
    public incorporate(): { [key: string]: IBlueprintIncorporate } {
        return {
            "bp:1": { blueprint: "Interval" },
            "hs:1": { blueprint: "Crypto", args: { algorithm: "sha1", encoding: "hex" } },
            "out:1": { blueprint: "Console", args: {
                customOutput: (data: IBlueprintData) => Logger.debug(`${data.data.raw}: ${data.value}`, "CryptoSample") 
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

Notice that using the dynamic creation of the blueprint's standard flow through the incorporate function, an object is returned whose key will be the internal namespace of the blueprints, and through the "args" parameter, different values are defined for the properties defined in the header, so when calling getParameter the return will be "SHA1" and "HEX" respectively.

```ts
const flow = Flow.create({
    "bp:1": { blueprint: "Interval" },
    "hs:1": { blueprint: "Crypto", args: { algorithm: "sha1", encoding: "hex" } },
    "out:1": { blueprint: "Console", args: {
        customOutput: (data: IBlueprintData) => Logger.debug(`${data.data.raw}: ${data.value}`, "CryptoSample") 
    } }
}, {
    "bp:1->_default": "hs:1->_default",
    "hs:1->_default": "out:1->_default"
});

await flow.build();
await flow.execute();
```

Another possible way would be to create the flow manually, for more details about the flow you can see the complete topic in the side menu, however in this option it will be necessary to run the build and run it manually, unlike implementation through the blueprint class. In practice internally, when the blueprint has the incorporate function and a flow is automatically created and saved in a variable that will be passed to the bind function, I always recommend creating a flow by understanding the Blueprint class.

### getParameterObject

```ts
getParameterObject(name: string, fieldKey: string): object | null
```

If the property is a list and you want it to return in object format assigning the values, this function is used in some specific cases such as the list of fields in a database, below I will demonstrate the implementation and use of the function:

```json
{ name: "fields", displayName: "Fields", type: Types.Array, objectArray: [
    { name: "name", type: Types.String },
    { name: "type", type: Types.Options, options: [
        { name: "String", value: "String" },
        { name: "Number", value: "Number" },
        { name: "Date", value: "Date" },
        { name: "Buffer", value: "Buffer" },
        { name: "Boolean", value: "Boolean" },
        { name: "Mixed", value: "Mixed" },
        { name: "ObjectId", value: "ObjectId" },
        { name: "Array", value: "Array" },
        { name: "Decimal128", value: "Decimal128" },
        { name: "Map", value: "Map" },
        { name: "Schema", value: "Schema" }
    ] },
    { name: "index", type: Types.Boolean, default: false },
    { name: "unique", type: Types.Boolean, default: false },
    { name: "required", type: Types.Boolean, default: false },
] }
```

In the MongoDBSchema blueprint, the property fields of type Array was defined, and defined how each item of the array should be in an object format using the parameter `objectArray`, in sequence defined the base of the object with the parameters "name", "type ", "index", "unique", "required", each with its respective type and default value.

```json
"MongoDB": { blueprint: "MongoDB", args: { connectionString } },
"MongoDBSchema": { blueprint: "MongoDBSchema", args: { 
    name: "users",
    collection: "users",
    timestamps: true,
    fields: [
        { name: "user", type: "String", index: true, required: true },
        { name: "pass", type: "String", index: true, required: true },
    ]
} },
```

Internally, to create the MongoDB model, the fields parameter is called by the getParameterObject function, defining name as the object's key.

```ts
const fields = this.getParameterObject("fields", "name");
```

The final return that will be stored in the fields constant will be:

```json
{
    "user": {
        "type": "String",
        "index": true,
        "required": true
    },
    "pass": {
        "type": "String",
        "index": true,
        "required": true
    }
}
```

### triggerIdentify

```ts
triggerIdentify(trigger: IBlueprintTrigger): IBlueprintData
```

The Identify trigger function wraps the Blueprint Trigger type in `IBlueprintData`

### incorporate

```ts
incorporate(): { [name: string]: IBlueprintIncorporate } { return {}; }
```

### bind

```ts
async bind(flow: Flow) {};
```

### injectArgs

```ts
injectArgs(args?: IBlueprintInjectData[]): Promise<void>
```

### validateInputData

```ts
validateInputData(header: IBlueprintInput, data: IBlueprintData): boolean
```

### execute

```ts
static execute()
```