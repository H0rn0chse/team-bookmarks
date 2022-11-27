import { defineStore } from "pinia";

export const useMainStore = defineStore("main", {
    state: () => {
        return {
            searchTerms: [
                "abc"
            ]
        };
    },
    actions: {
        increment() {
            this.count++;
        },
    },
});
