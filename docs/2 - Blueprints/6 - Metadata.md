# Metadata

UCS.js provides a powerful way to manage data flows within your application. By defining blueprints and connections, you can create complex data processing pipelines that are both flexible and maintainable.

## Interface

The `IBlueprintMetadata` interface is a key part of defining a flow. It allows you to specify the blueprints and connections that make up the flow.

```typescript
export interface IBlueprintMetadata {
    blueprints: { [key: string]: any },
    connections?: { [key: string]: string | Array<string> }
}
```

### Properties

- **blueprints**: An object that defines the blueprints for the flow. Each key is the name of a blueprint, and the value is an object that specifies the blueprint's configuration.

- **connections**: An optional object that defines the connections between blueprints. Each key is a connection string, and the value is either a single string or an array of strings that specify the connected blueprints.

## Manually

You can define blueprints and connections manually when creating a flow. Here's an example that demonstrates how to do this:

```typescript
const metadata: IBlueprintMetadata = {
    blueprints: {
        "MongoDBFind": { 
            blueprint: "MongoDBFind", 
            args: { limit: 10 } 
        },
        // Other blueprints...
    },
    connections: {
        "MongoDBFind->model": "MongoDBSchema->model",
        // Other connections...
    }
};

const flow = new Flow(metadata);
```

#### Explanation

- The `metadata` object is defined with the blueprints and connections for the flow.
- The `blueprints` property specifies the blueprints, such as "MongoDBFind", along with their configuration.
- The `connections` property specifies the connections between blueprints, such as connecting "MongoDBFind" to "MongoDBSchema".
- The `Flow` constructor is called with the name of the flow ("users") and the `metadata` object, creating a new flow with the specified blueprints and connections.

## GlobalRegistry

You can create a JSON file with metadata in the `.metadata` directory (located at `/src/.metadata`). This file will be loaded automatically by the `GlobalRegistry`, and the `fromMetadata` function of the `Flow` class can retrieve these data for flow creation.

## Metadata File

You can create a JSON file in the `.metadata` directory with the following structure:

```json
{
    "blueprints": {
        "MongoDBFind": { 
            "blueprint": "MongoDBFind", 
            "args": { "limit": 10 } 
        },
        // Other blueprints...
    },
    "connections": {
        "MongoDBFind->model": "MongoDBSchema->model",
        // Other connections...
    }
}
```

Save this file with a name that corresponds to the metadata name you want to use, such as `users.json`.

### Loading Metadata with GlobalRegistry

The `GlobalRegistry` will automatically load the metadata from the JSON file in the `.metadata` directory. You don't need to manually load the file; UCSJS takes care of this for you.

### Creating a Flow from Metadata

You can create a flow from the metadata using the `fromMetadata` function of the `Flow` class. Here's an example:

```ts
const flow = await Flow.fromMetadata("users");
```

### Function: fromMetadata

The `fromMetadata` function retrieves the metadata from the `GlobalRegistry` and creates a flow using the specified blueprints and connections.

```ts
public static async fromMetadata(
    metadataName: string, 
    args?: { [key: string]: any }
): Promise<Flow>{

    const metadata = GlobalRegistry.
        retrieveMetadata(metadataName, args) as IBlueprintMetadata;
    
    if(metadata) 
        return await Flow.create(
            metadata.blueprints, 
            metadata.connections
        );
    else
        return null;
}
```

#### Parameters

- **metadataName**: The name of the metadata to retrieve. This should correspond to the name of the JSON file in the `.metadata` directory (without the `.json` extension).
- **args**: Optional arguments that can be passed to the metadata.

#### Returns

- A `Promise` that resolves to a `Flow` instance if the metadata is found, or `null` if the metadata is not found.

## Conclusion

The UCS.js framework provides a robust and flexible way to define data flows. By using the `IBlueprintMetadata` interface and the `Flow` constructor, you can create complex flows that are tailored to your application's needs. Whether you're working with databases, APIs, or other data sources, UCSJS makes it easy to manage and process your data.

Provides a convenient way to define and manage metadata for flows. By creating a JSON file in the `.metadata` directory, you can easily define blueprints and connections for your flows. The `GlobalRegistry` and `fromMetadata` function make it simple to load and use this metadata, allowing you to create complex data flows with ease.
