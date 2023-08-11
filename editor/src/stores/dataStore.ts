import { defineStore } from "pinia";

export const dataStorage = defineStore("dataStorage", {
    state: () => ({
        data: new Map<string, any>(),
    }),

    getters: {
        blueprints() {
            return this.data instanceof Map && this.data?.has("blueprints") ? 
            this.data?.get("blueprints") : 
            null;
        },

        blueprintGroups() {
            return this.data instanceof Map && this.data?.has("blueprintGroups") ? 
            this.data?.get("blueprintGroups") : 
            null;
        },

        blueprintIndex() {
            return this.data instanceof Map && this.data?.has("blueprintIndex") ? 
            this.data?.get("blueprintIndex") : 
            null;
        }
    },

    actions: {
        save(namespace: string, data: any): void {
            if(this.data instanceof Map && !this.data.has(namespace))
                this.data.set(namespace, data);
        },

        get(namespace: string) : any | null {
            return (this.data instanceof Map && this.data.has(namespace)) ? 
            this.data.get(namespace) : 
            null;
        },

        getBlueprint(namespace: string) : any | null {
            return (this.data?.has("blueprintIndex")) ? 
            this.data?.get("blueprintIndex")[namespace] : 
            null;
        }
    }
});