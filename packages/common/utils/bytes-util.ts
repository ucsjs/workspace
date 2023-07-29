

export function stringToArrayBuffer(str: string){
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(str);
    return encodedData.buffer;
}