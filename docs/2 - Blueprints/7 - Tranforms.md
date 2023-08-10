# Transforms

Transformers are resources for automatically calling blueprints to change the data of an object using data injection and response interception, with this it is possible, for example, to encrypt a password using the Crypto blueprint, without it being pre-configured in the flow.

## Sample

In the metadata, the transforms property is used in the `MongoDBInsert` and `MongoDBUpdate` blueprints. Here's an example of how it's defined:

```json
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
}

```

## Explanation

**Transforms Object:** The transforms object defines transformations that should be applied to specific parts of the data being processed. In this case, it's applied to the query property in MongoDBInsert and the set property in MongoDBUpdate.

**Blueprint:** Inside the transforms object, you can define one or more transformations. Each transformation specifies a blueprint to be used. In this example, the Crypto blueprint is used, which likely performs some cryptographic operation.

**Input and Output:** The input and output properties define how the transformation should be applied. The value _default likely means that the transformation is applied to the entire object or field specified.

**Key:** The key property specifies a specific key within the object to be transformed. In this case, it's the "pass" key, which likely represents a password.

## Usage in the Context
In the context of user management, the transforms property is used to encrypt the password before inserting or updating it in the database. This ensures that sensitive information like passwords is stored securely.

When a new user is created (createUser method) or an existing user's information is updated (updateUser method), the password is automatically encrypted using the specified `Crypto` blueprint. This transformation is applied to the query field in the case of insertion and the set field in the case of an update.

## Conclusion
The transforms property in the metadata provides a flexible and powerful way to apply transformations to data as part of the blueprint execution. In the provided code, it's used to encrypt passwords before storing them in the database, enhancing the security of the application. By defining transformations in the metadata, the code remains clean and maintainable, and transformations can be easily reused across different parts of the application.