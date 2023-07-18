import { defineStore } from "pinia";

export const authStorage = defineStore("authStorage", {
    state: () => ({
        token: null,
    }),

    actions: {
        setToken(token: string): void{
            this.token;
        },

        getToken(): string | null {
            return this.token;
        }
    }
});