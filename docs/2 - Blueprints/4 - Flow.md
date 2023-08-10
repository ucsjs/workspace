# Flow

The `Flow` class is responsible for managing and executing a flow of blueprints within the system.

## Dependencies

The following modules are imported:

```typescript
import { Logger } from "@ucsjs/common";
import { GlobalRegistry } from "../utils";
import { Blueprint } from "./blueprint";
import { 
    IBlueprint, 
    IBlueprintData, 
    IBlueprintInjectData, 
    IBlueprintMetadata, 
    IFlowBlueprintListItem 
} from "../interfaces";
```

## Class Definition

### Properties

- `cachedBlueprintSettings`: Cached blueprint settings.
- `cachedConnections`: Cached connections.
- `blueprints`: A map containing blueprints.
- `outputIndex`: A map containing output indexes.

### Methods

#### `create(blueprints: { [key: string]: any }, connections?: { [key: string]: string | Array<string> }): Promise<Flow>`

Creates a new flow with the specified blueprints and connections.

```typescript
const flow = await Flow.create(blueprints, connections);
```

#### `fromMetadata(metadataName: string, args?: { [key: string]: any }): Promise<Flow>`

Creates a flow from metadata.

#### `setup(blueprints: { [key: string]: IFlowBlueprintListItem }): Promise<void>`

Sets up the flow with the specified blueprints.

#### `reset(): Promise<this>`

Resets the flow.

#### `build(): Promise<this>`

Builds the flow.

#### `getBlueprint(namespace: string)`

Gets a blueprint by namespace.

#### `subscribeMulti(relations: { [key: string]: any }): Promise<this>`

Subscribes multiple relations.

#### `subscribe(from: string, to: string | Array<string>): Promise<this>`

Subscribes a connection from one blueprint to another.

#### `listen(from: string, to: string)`

Listens to a connection from one blueprint to another.

#### `execute()`

Executes the flow.

#### `buildListenAndExecute(listenFlow?: Function)`

Builds, listens, and executes the flow.

#### `interceptOnPromise(blueprintName: string, outputName: string, args?: IBlueprintInjectData[]): Promise<IBlueprintData>`

Intercepts a promise on a blueprint.

#### `await()`

Awaits the flow.

## Conclusion

The `Flow` class provides a comprehensive way to manage and execute a flow of blueprints. It offers methods to create, build, listen, execute, and manage connections between blueprints, supporting the dynamic creation and execution of complex flows.
