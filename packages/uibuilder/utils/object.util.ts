export class ObjectUtil {
    public static hash(...values: any[]): number {
        let result = 0;

        for (const value of values) {
            
            const hash = typeof value.hashCode === 'function' ? value.hashCode() : ObjectUtil.stringHash(String(value));
            result ^= hash;
        }

        return result;
    }

    public static stringHash(str: string): number {
        let result = 0;

        for (let i = 0; i < str.length; i++) {
            result = ((result << 5) - result) + str.charCodeAt(i);
            result |= 0; 
        }

        return result;
    }
}