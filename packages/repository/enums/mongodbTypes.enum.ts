import { Types } from "@ucsjs/core";

enum _MongoDBTypes {
    MongoDBConnection,
    MongoDBSchema,
    MongoDBResult,
    MogoDBModel
}

export const MongoDbTypes = { ...Types, ..._MongoDBTypes };