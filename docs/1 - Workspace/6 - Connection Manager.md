# Connections Manager

The `ConnectionsManager` class is responsible for managing connections within the system. It provides methods to create, retrieve, and check the existence of connections.

## Dependencies

The following modules are imported:

```typescript
import { Singleton } from "@ucsjs/common";
import { IConnection } from "../interfaces";
```

## Class Definition

The `ConnectionsManager` class extends the `Singleton` class and provides methods for managing connections.

### Properties

- `connections`: A map containing connections, identified by a string name.

### Methods

### getOrCreateConnection

```typescript
getOrCreateConnection(name: string, createFunction?: Function): Promise<IConnection>
```

Gets or creates a connection by name. If the connection does not exist, it can be created using the provided `createFunction`.

```typescript
const connection = await ConnectionsManager.getOrCreateConnection('myConnection', createFunction);
```

### has

```typescript
has(name: string): boolean
```

Checks if a connection with the given name exists.

```typescript
const exists = ConnectionsManager.has('myConnection');
```

### get

```typescript
get(name: string): IConnection | null
```

Retrieves a connection by name. Returns `null` if the connection does not exist.

```typescript
const connection = ConnectionsManager.get('myConnection');
```

## Interface Definition

### `IConnection`

Defines the structure of a connection, including the following properties and methods:

- `name`: The name of the connection.
- `state`: The state of the connection, represented by the `ConnectionStates` enum.
- `updateState()`: A method to update the state of the connection.
- `connect()`: A method to initiate the connection.
- `get()`: A method to retrieve the connection.

## Enum Definition

### `ConnectionStates`

Defines the possible states of a connection:

- `Diconnected`
- `Connected`
- `Connecting`
- `Disconnecting`
- `Uninitialized`

## Conclusion

The `ConnectionsManager` class provides a centralized way to manage connections within the system. It offers methods to create, retrieve, and check the existence of connections, supporting the dynamic creation and management of connections.
