import { Types } from "@ucsjs/core";

enum _MongoDBTypes {
    MongoDBConnection,
    MongoDBSchema,
    MongoDBResult,
    MongoDBModel
}

export const MongoDbTypes = { ...Types, ..._MongoDBTypes };