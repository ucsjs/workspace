# Intercept

The `@Intercept` decorator is used to intercept a specific blueprint and output within a controller method. It allows you to define a blueprint name, an output name, and optional arguments to be injected into the blueprint.

## Usage

The `@Intercept` decorator is applied to a parameter within a controller method. It takes three arguments:

- `blueprintName`: The name of the blueprint to be intercepted.
- `outputName`: The name of the output to be intercepted.
- `args`: An optional array of objects that define the inputs to be injected into the blueprint.

### Example

```typescript
@Get("/:id")
async getById(
    @Param("id") id: string, 
    @Intercept("MongoDBFind", "result", [ { input: "id", value: "$param.id" } ]) data
) {
    await GlobalModules.retrieve(CacheModule)?.set(`Users::\${id}`, data);
    return data;
}
```

In this example, the `@Intercept` decorator is used to intercept the `MongoDBFind` blueprint and the `result` output. It also injects the `id` parameter from the request into the blueprint.

## Arguments Injection

The `args` parameter allows you to define inputs to be injected into the blueprint. Each object in the array should have the following properties:

- `input`: The name of the input to be injected.
- `value`: The value to be injected. You can use special syntax like `$param.id` to refer to request parameters, `$query` for query parameters, `$header` for headers, and `$body` for the request body.

### Example

```typescript
@Intercept("MongoDBUpdate", "result", [
    { input: "id", value: "$param.id" },
    { input: "set", value: "$body" }
])
```

In this example, the `id` parameter from the request and the entire request body are injected into the blueprint.

## Error Handling

If the target is not an instance of `BlueprintController`, or if the flow cannot be retrieved from the controller, an error will be thrown.