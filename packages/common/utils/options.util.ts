export function enumToList<T>(enumObj: T): any[] {
    return Object.keys(enumObj).map((key) => { return { key, value: enumObj[key] }; });
}

export function objectToList(obj): any[] {
    return Object.keys(obj).map((key) => { return { key, value: obj[key] }; });
}

export function objectKeysToList(obj): any[] {
    return Object.keys(obj).map((key) => { return key; });
}