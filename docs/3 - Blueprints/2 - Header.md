# Header

Every blueprint needs an identification header of the type `IBlueprintHeader` or similar extensions, below is the complete description of the interface, below we will individually list each possible type of data present in the header and its function within the editor.

The data described in the header is sent via API to the editor so that it is possible to manage and configure blueprints, therefore it is fundamental to precisely configure the data of inputs, output, triggers, events and properties, it is also possible to define a category, version, icon and help link on the context of the blueprint, below is the complete interface for analysis:

```typescript
export interface IBlueprintHeader {
    namespace: string,
    version?: number | number[],
    group: string | string[],
    icon?: string | IBlueprintIcon,
    helpLink?: string,
    inputs?: IBlueprintInput[],
    outputs?: IBlueprintOutput[],
    properties?: IBlueprintProperties[],
    triggers?: IBlueprintTrigger[]
    events?: IBlueprintEvent[]
    useInEditor: boolean
}
```

## Namespace

The Blueprint namespace is used as a reference to retrieve the class by `GlobalRegistry`, Flow creates the blueprint instance automatically and stores it internally, which can be retrieved by Id or by the instance namespace defined when creating the flow, as it is possible to create multiple instances of it blueprint references are different when instantiated. Therefore, the instance ID and the blueprint namespace are different and can be retrieved as follows:

```typescript
this.header.namespace //Returns the Blueprint namespace
this.id //Returns the ID of the instance
```

## Version (Optional)

Blueprint version, which will be considered for update in the marketplace, and maintain project compatibility that use specific versions of a blueprint.

## Group

The group parameter will be used by the editor to segment and categorize all blueprints in the project.

## Help Link (Optional)

When informed the help link creates an icon in the blueprint by the editor when clicked opens the link.

## Icon (Optional)

Defines the icon that will appear in the blueprint in the editor, it can be used only the name of the Fontawesome icon or a link to a public image, it is still possible to pass the image through SVG or Base64 using local conversion functions.

## Use In Editor (Optional)

This parameter whether or not a blueprint will be used in the editor.

## Inputs / Outputs

Now let's start talking about the fundamental parameters for the Blueprint to work, below is the interface of an input:

```typescript
export interface IBlueprintInput {
    id?: string;
    name: string;
    alias?: string;
    type: Types | any;
    default?: any;
    callback?: Function;
}
```

It is then possible to configure a default value for the input, define the type (important for internal checks), the alias field defines a nickname for this entry to be retrieved in addition to the name, and it is even possible to define a callback for when the input is to receive a value new. However, it is recommended to use `@Input` decorator to link a data receiving function as in the example below:

```typescript
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
        
        this.next(data.extend(this, { raw: value, value: hash }));
    }
    catch(e){
        this.next(this.generateError(this, e.message, `${this.header.namespace}::${this.id}`));
    }
}
```

In the Crypto example above, the decorator will be linked to the blueprint's standard input, and upon receiving a new value, it will perform a series of functions to create a hash following the algorithm and encoding settings defined when creating the flow or configured manually by the editor, after create the hash the value is sent to all blueprints that are encrypting the blueprint standard output that was defined in the header.

To ensure a standard data flow through the blueprints and for debugging purposes, the data needs to be packaged in the IBlueprintData format. Below is the interface for analysis:

```typescript
export interface IBlueprintData {
    parent: Blueprint | undefined;
    settings?: IBlueprintSettings | undefined;
    data?: { [key: string]: any };
    value?: any;
    error?: IBlueprintDataError;
    getDefault(): any;
    extend(newData: Blueprint, defaultValue?: any): IBlueprintData;
}
```

When the values are packaged either through the `this.generateData` function or through `data.extend`, the system automatically defines the blueprint it generated, being stored in the `parent`, the settings of this blueprint at the time of data generation is stored in `settings`, all data that was processed throughout the process is stored in `data`, the current state of the data is stored in `value`, in case of any processing error the blueprint must generate an error and send to the blueprints with subscribe in the outputs using the function `this.generateError`, this error will be stored in `error`.

Following the understanding of the inputs, the outputs receive post-processed values, in the example above the command `this.next` was used to pass data to the standard output, however it is possible to create several outputs and inputs, so that it is possible to define which output the data must be forwarded, just inform it in the second parameter of the function, as in the example below:

```typescript
this.next(data.extend(this, { raw: value, value: hash }), "output namespace");
```

if you do not want to define a customized name for the input and output, by default the name `_default` will always be assigned, however in case of multiple inputs and outputs without definition of name, it will be superimposed by the last one, so it is recommended to always define a namespace for blueprint inputs and outputs. As a matter of curiosity, I'll leave here the interface of the outputs

```typescript
export interface IBlueprintOutput {
    id?: string,
    name: string,
    alias?: string,
    type: Types | any
}
```

## Events / Triggers

In case of data transfer between blueprints, there are Inputs/Outputs, for triggering events and functionality that do not need data, it is recommended to use Triggers/Events, as it is more efficient and simple, the operation has the same behavior, see:

```typescript
public header: IBlueprintHeader = {
    ...
    events: [
        { 
            name: "_default"
        }
    ]
}
```

Below is the event interface, note that a callback can be defined directly in the header or defined later by the `@Trigger` decorator

```typescript
export interface IBlueprintEvent {
    name: string,
    callback?: Function
}
```

When defining the event, it will be necessary to define a trigger that will be executed as soon as the event is invoked.

```typescript
@Trigger("_default")
private eventTrigger(trigger: IBlueprintTrigger){
    this.display(this.triggerIdentify(trigger))
}
```

In the example below, the `@Trigger` decorator was used to define the function that will be triggered as soon as the event is called, thus receiving the parameter of type `IBlueprintTrigger` that contains basic information for future debugging.

```typescript
export interface IBlueprintTrigger {
    name: string,
    blueprint?: Blueprint,
    timeout?: number;
}
```

Note that every trigger receives as a parameter of the blueprint that requested the trigger and the trigger timeout.

## Properties

The property parameter is a little more complex since there are several possibilities of configurable parameters, there is still a series of important settings to complement the editor.

```typescript
export interface IBlueprintProperties {
    id?: string,
    name: string,
    displayName: string,
    type: Types,
    description?: string;
	hint?: string;
    placeholder?: string;
    required?: boolean;
    fixed?:boolean;
    default?: any;
    value?: any;
    options?: IBlueprintOptions[],
    objectArray?: IBlueprintObjectArrayItem[]
}
```

See that the interface allows you to define a value that will be displayed in the `displayName` editor, different from the name of the property itself, but for manipulation via code use the Id or Name, the `description` field will be displayed in a help icon on the side of the property name, `placeholder` will be the value displayed in the input in case of Text, Number properties.

Continuing the `required` parameter defines that the information needs to be filled in for the blueprint to work, the `default` field defines a value that will be filled in in the editor when creating a new blueprint, the `value` field will be defined automatically in case of alteration of properties in the editor or via code, if the value is not changed, the default will be used.

Last but not least, there is the `options` property, which must be used if the property is of the Options type, which will be displayed in the editor by a simple select, in the case of complex data such as lists of objects such as routes, or any other type of data in a list as data in JSON, use the parameter in the `Object` type, and define the format in `objectArray`, so that the data is parsed automatically. Below is the interface of `objectArray`:

```typescript
export interface IBlueprintObjectArrayItem {
    name: string,
    type: Types,
    required?: boolean,
    default?: boolean,
    options?: IBlueprintOptions[],
}
```

If the data returned by the editor does not follow the pattern defined in the blueprint, it will not be possible to execute the blueprint loading flow, and an error will be returned when parsing the data.


