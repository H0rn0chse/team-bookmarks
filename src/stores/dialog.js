import { defineStore } from "pinia";

export const useDialogStore = defineStore("dialog", {
    state: () => {
        return {
            settings: false,
            editBookmark: false,
            addBookmark: false,
        };
    },
    actions: {
        showSettings() {
            this.settings = true;
        },
        hideSettings() {
            this.settings = false;
        },
        showEdit() {
            this.editBookmark = true;
        },
        hideEdit() {
            this.editBookmark = false;
        },
        showAdd() {
            this.addBookmark = true;
        },
        hideAdd() {
            this.addBookmark = false;
        },
    },
});
