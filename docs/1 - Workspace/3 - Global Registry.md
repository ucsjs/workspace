# Global Registry

The Global Registry is the global controller for loading and managing blueprints in the system, to avoid the need to manually import each class and even instantiate or create flows, as well as perform blueprint configuration.

Inside the index.ts file, the previous loading of the blueprints will be carried out by calling the load function, the load function by default will look for existing blueprints in the project within the `packages` and `src` directory, in case of application in production, the paths will be `node_modules/@ucsjs` and `dist`, all blueprints must have the extension `.blueprint.ts` and in case of production files, `.blueprint.js`, all classes will be imported through the function `require` of the Node, and stored without being instantiated, when using the `retrieve` function, the class will be instantiated and the blueprint will be configured.

## Class Definition

The `GlobalRegistry` class extends the `Singleton` class and provides methods for managing blueprints and metadata.

### Properties

- `directory`: The directory or array of directories where blueprints are located.
- `registry`: A map containing registered blueprints.
- `metadatas`: A map containing metadata information.

### Methods

#### `registerDirectory(directories: string | Array<string>, clearRegistry: boolean = true)`

Registers blueprints from the specified directories.

**Example Usage:**

```typescript
await GlobalRegistry.registerDirectory('./blueprints');
```

#### `loadMetadata(directories: string | Array<string>, clearRegistry: boolean = true)`

Loads metadata from the specified directories.

#### `load()`

Loads blueprints and metadata from predefined directories.

**Example Usage:**

```typescript
await GlobalRegistry.load();
```

#### `refresh()`

Refreshes the registry by re-registering blueprints from the stored directory.

#### `implementsIBlueprint(module: any): module is IBlueprint`

Checks if a module implements the `IBlueprint` interface.

#### `register(key: string, instance: any, alias?: string): boolean`

Registers an instance with a key and optional alias.

**Example Usage:**

```typescript
GlobalRegistry.register('myBlueprint', MyBlueprintClass);
```

#### `registerBlueprint<T extends Blueprint & IBlueprint>(blueprintClass: { new (): T }): void`

Registers a blueprint class.

#### `retrieve(key: string, args?: IBlueprintSettings, transforms?: { [key: string]: IBlueprintTransform[] }): Promise<Blueprint>`

Retrieves a blueprint by key, with optional settings and transforms.

**Example Usage:**

```typescript
const blueprint = await GlobalRegistry.retrieve('myBlueprint');
```

#### `retrieveMetadata(key: string, args?: { [key: string]: any }): any`

Retrieves metadata by key, with optional arguments.

#### `retrieveAll(): any[]`

Retrieves all registered blueprints.

**Example Usage:**

```typescript
const allBlueprints = GlobalRegistry.retrieveAll();
```

#### `createFlow(blueprints: { [key: string]: any }): Promise<Flow>`

Creates a flow from the specified blueprints.

**Example Usage:**

```typescript
const flow = await GlobalRegistry.createFlow({ blueprint1: Blueprint1, blueprint2: Blueprint2 });
```

## Conclusion

The `GlobalRegistry` class provides a centralized way to manage blueprints and metadata within the system. It offers methods to register, retrieve, and manipulate these elements, supporting the dynamic creation and management of flows.
