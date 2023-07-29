import { defineStore } from "pinia";

export const authStorage = defineStore("authStorage", {
    state: () => ({
        token: "",
    }),

    actions: {
        setToken(token: string): void{
            localStorage.setItem("token", token);
            this.token = token;
        },

        getToken(): string {
            return this.token;
        }
    }
});