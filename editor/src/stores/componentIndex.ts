import { defineStore } from "pinia";

export const componentIndexStorage = defineStore("componentIndexStorage", {
    state: () => ({
        layout: null,
        components: new Map<string, any>(),
        templates: {}
    }),

    actions: {
        setLayout(layout){
            this.layout = layout;
        },

        register(id: string, props, context){
            if(!this.components.has(id))
                this.components.set(id, { props, context });
        },

        has(id: string){
            return this.components.has(id);
        },

        get(id: string){
            return (this.components.has(id)) ? this.components.get(id) : null;
        },

        all(){
            return this.components;
        }
    }
});