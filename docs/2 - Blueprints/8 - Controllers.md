# Controller

## Sample

The `UsersController` class is a blueprint controller that manages user-related operations. It provides endpoints for CRUD operations on users, including getting all users, getting a user by ID, creating a user, updating a user, and deleting a user.

```typescript
import { UsersDTO, UsersUpdateDTO } from "@dtos";
import { TokenizerService } from "@ucsjs/core";

import { 
    Body, 
    Controller, 
    Delete, 
    Get, 
    Param, 
    Post, 
    Put, 
    Response 
} from "@ucsjs/common";

import { 
    Flow, 
    IBlueprintController, 
    Cache, 
    GlobalModules, 
    CacheModule, 
    Intercept, 
    BlueprintController 
} from "@ucsjs/core";

@Controller("users")
export class UsersController extends BlueprintController implements IBlueprintController {

    constructor(
        private readonly tokenizer: TokenizerService
    ) { 
        super();
    }

    async created(){
        let connectionString = await this.tokenizer.getToken("MONGODB_CONN");
        
        if(connectionString) 
            this.flow = await Flow.fromMetadata("users", { 
                connectionString 
            });        
        else 
            this.catch(`Error when trying to retrieve the token for the controller`, "UsersController");        
    }

    @Get("/") 
    @Cache("Users::all")
    async getAll(
        @Intercept("MongoDBFind", "result", [ { 
            input: "query", value: {} 
        } ]) data
    ) {
        await GlobalModules.
            retrieve(CacheModule)?.
            set("Users::all", data);

        return data;         
    }

    @Get("/:id")
    async getById(
        @Param("id") id: string, 
        @Intercept("MongoDBFind", "result", [ { 
            input: "id", value: "$param.id" 
        } ]) data
    ) {
        await GlobalModules.
            retrieve(CacheModule)?.
            set(`Users::${id}`, data);

        return data;
    }

    @Post("/")
    async createUser(
        @Body() body: UsersDTO,
        @Intercept("MongoDBInsert", "result", [ { 
            input: "query", value: "$body" 
        } ]) data
    ) {
        await GlobalModules.
            retrieve(CacheModule)?.
            del("Users::all");

        return data;
    }

    @Put("/:id")
    async updateUser(
        @Param("id") id: string,
        @Body() body: UsersUpdateDTO,
        @Intercept("MongoDBUpdate", "result", [
            { input: "id", value: "$param.id" },
            { input: "set", value: "$body" }
        ]) result
    ) {
        if (await result === true) {
            await GlobalModules.
                retrieve(CacheModule)?.
                del("Users::all");
                
            await GlobalModules.
                retrieve(CacheModule)?.
                del(`Users::${id}`);

            return `Record ${id} has been updated successfully`;
        } else {
            throw new Error("No records were updated");
        }
    }

    @Delete("/:id")
    async deleteUser(
        @Param("id") id: string,
        @Intercept("MongoDBDelete", "result", [ { 
            input: "id", value: "$param.id" 
        } ]) result
    ) {
        if (await result === true) {
            await GlobalModules.
                retrieve(CacheModule)?.
                del("Users::all");

            await GlobalModules.
                retrieve(CacheModule)?.
                del(`Users::${id}`);

            return `Record ${id} has been removed successfully`;
        } else {
            throw new Error("No records were removed");
        }
    }
}
```

I would like to highlight some points from the example code presented above, first the use of the tokenizer to store encrypted sensitive data, therefore the database configuration is configured by the user and stored in the project encrypted with a 1024-bit RSA key, then the loading of the flow through a preloaded metadata that defines MongoDB database management blueprints, therefore in the `created` function creates a data access flow through injectors containing all the blueprints necessary for a CRUD, this instance will be created automatically when loading the controller so the performance of the call is extremely fast since all the requirements for it to work were configured only once.

Also, the example controller already incorporates cache calls by the `@Cache` decorator that will manage in memory (it can be configured using systems such as Redis and Memcached) so if the same request is made in a short period of time, the return will be the data in memory instead of requesting the data from the database, and notice that any change through the API completely clears the cache, always keeping the return data the most current

## Metadata

Just to complement the example below, here is the metadata file that configures the blueprints for CRUD operation

```json
{
    "blueprints": {
        "MongoDB": { 
            "blueprint": "MongoDB", 
            "args": { 
                "connectionString": "$args:connectionString" 
            } 
        },
        "MongoDBSchema": { 
            "blueprint": "MongoDBSchema", 
            "args": { 
                "name": "users",
                "collection": "users",
                "timestamps": true,
                "fields": [
                    { 
                        "name": "user", 
                        "type": "String", 
                        "index": true, 
                        "required": true 
                    },
                    { 
                        "name": "pass", 
                        "type": "String", 
                        "index": true, 
                        "required": true 
                    }
                ]
            } 
        },
        "MongoDBFind": { 
            "blueprint": "MongoDBFind", 
            "args": { "limit": 10 } 
        },
        "MongoDBInsert": { 
            "blueprint": "MongoDBInsert", 
            "transforms": {
                "query": [
                    { 
                        "blueprint": "Crypto", 
                        "input": "_default", 
                        "output": "_default", 
                        "key": "pass" 
                    }
                ]
            } 
        },
        "MongoDBUpdate": { 
            "blueprint": "MongoDBUpdate", 
            "transforms": {
                "set": [
                    { 
                        "blueprint": "Crypto", 
                        "input": "_default", 
                        "output": "_default", 
                        "key": "pass" 
                    }
                ]
            } 
        },
        "MongoDBDelete": { 
            "blueprint": "MongoDBDelete" 
        }
    },
    "connections": {
        "MongoDB->_default": "MongoDBSchema->connectionName",
        "MongoDBSchema->model": [
            "MongoDBFind->model", 
            "MongoDBInsert->model", 
            "MongoDBUpdate->model", 
            "MongoDBDelete->model"
        ]
    }
}
```

## Constructor

The constructor takes a `TokenizerService` instance, which is used to retrieve the connection string for the MongoDB database.

## Methods

### `created()`

This asynchronous method is called when the controller is created. It retrieves the MongoDB connection string and initializes the flow from the "users" metadata.

### `getAll()`

- **Endpoint:** `GET /users/`
- **Cache Key:** `Users::all`
- **Description:** Retrieves all users from the database.
- **Intercepts:** `MongoDBFind` blueprint with an empty query.
- **Returns:** An array of user data.

### `getById(id: string, data)`

- **Endpoint:** `GET /users/:id`
- **Parameters:** `id` - The ID of the user to retrieve.
- **Description:** Retrieves a user by ID from the database.
- **Intercepts:** `MongoDBFind` blueprint with the provided ID.
- **Returns:** The user data for the specified ID.

### `createUser(body: UsersDTO, data)`

- **Endpoint:** `POST /users/`
- **Parameters:** `body` - The user data to create.
- **Description:** Creates a new user in the database.
- **Intercepts:** `MongoDBInsert` blueprint with the provided user data.
- **Returns:** The created user data.

### `updateUser(id: string, body: UsersUpdateDTO, result)`

- **Endpoint:** `PUT /users/:id`
- **Parameters:** 
  - `id` - The ID of the user to update.
  - `body` - The updated user data.
- **Description:** Updates an existing user in the database.
- **Intercepts:** `MongoDBUpdate` blueprint with the provided ID and user data.
- **Returns:** A success message if the update was successful, otherwise throws an error.

### `deleteUser(id: string, result)`

- **Endpoint:** `DELETE /users/:id`
- **Parameters:** `id` - The ID of the user to delete.
- **Description:** Deletes a user by ID from the database.
- **Intercepts:** `MongoDBDelete` blueprint with the provided ID.
- **Returns:** A success message if the deletion was successful, otherwise throws an error.

## Decorators

The class uses various decorators such as `@Controller`, `@Get`, `@Post`, `@Put`, `@Delete`, `@Cache`, and `@Intercept` to define the routing, caching, and interception behavior.

## Error Handling

The class includes error handling for scenarios such as failure to retrieve the necessary token for the controller to work, no records updated, and no records removed.

## Integration

The `UsersController` class is part of the UCSJS framework and integrates with other core modules and services such as `TokenizerService`, `Flow`, `CacheModule`, and blueprint-related functionalities.
