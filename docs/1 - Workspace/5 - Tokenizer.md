# Tokenizer

This document describes the Tokenizer Service and Controller classes, which are used to manage tokens in a secure manner.

## Tokenizer Service

### Class Definition

The `TokenizerService` class implements the `ITokenizer` interface and provides methods for managing tokens.

### Methods

#### `getAllTokens()`

Returns all tokens from the `.secure/tokens.json` file.

```typescript
const tokens = await tokenizerService.getAllTokens();
```

#### `createToken(body: TokenizerDTO)`

Creates a new token using the provided `TokenizerDTO` and returns a success message, UUID, and signature.

```typescript
const result = await tokenizerService.createToken({ key: 'exampleKey', value: 'exampleValue' });
```

#### `getToken(key: string, certName?: string): Promise<string>`

Retrieves a token by key and optionally by certificate name.

```typescript
const token = await tokenizerService.getToken('exampleKey');
```

#### `removeToken(position: number)`

Removes a token by its position.

```typescript
const result = await tokenizerService.removeToken(5);
```

#### `getLine(filename: string, lineNumber: number)`

Gets a specific line from a file.

#### `getCert(certHash: string, uuid?: string): Promise<NodeRSA>`

Gets a certificate by its hash and optionally by UUID.

#### `textToBinary(data: string): Buffer`

Converts text to binary.

#### `binaryToText(bufferData: Buffer): string`

Converts binary to text.

## Tokenizer Controller

### Class Definition

The `TokenizerController` class provides HTTP endpoints for managing tokens.

### Endpoints

#### `GET /tokenizer/`

Returns all tokens.

**Example Usage:**

```typescript
GET /tokenizer/
```

#### `POST /tokenizer/`

Creates a new token.

**Example Usage:**

```typescript
POST /tokenizer/
{
    "key": "exampleKey",
    "value": "exampleValue"
}
```

#### `DELETE /tokenizer/:index`

Removes a token by its index.

**Example Usage:**

```typescript
DELETE /tokenizer/5
```
