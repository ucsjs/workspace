export enum Types {
    Any,
    Float,
    Int,
    String,
    Array,
    Object,
    Function,
    Options,
    Boolean
}

export const TypeToString = (type: Types) => {
    switch(type){
        case Types.Any: return "Any";
        case Types.Float: return "Float";
        case Types.Int: return "Int";
        case Types.String: return "String";
        case Types.Array: return "Array";
        case Types.Object: return "Object";
        case Types.Function: return "Function";
        case Types.Options: return "Options";
        case Types.Boolean: return "Boolean";
    }
}