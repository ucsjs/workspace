export abstract class Singleton {
    private static instances: Map<string, any> = new Map();

    public static getInstance<T extends Singleton>(this: new () => T): T {
        let instance = Singleton.instances.get(this.name);

        if(!instance) {
            instance = new this();
            
            Singleton.instances.set(this.name, instance);
        }

        return instance;
    }
}