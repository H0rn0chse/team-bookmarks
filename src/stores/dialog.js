import { defineStore } from "pinia";

export const useDialogStore = defineStore("dialog", {
  state: () => {
    return {
      settings: {
        show: false,
      },
      bookmarkDetails: {
        itemId: null
      },
      editBookmark: {
        show: false,
      },
      addBookmark: {
        show: false
      },
    };
  },
  actions: {
    showSettings() {
      this.settings.show = true;
    },
    hideSettings() {
      this.settings.show = false;
    },
    showEdit(itemId) {
      this.bookmarkDetails.itemId = itemId;
      this.editBookmark.show = true;
    },
    hideEdit() {
      this.bookmarkDetails.itemId = null;
      this.editBookmark.show = false;
    },
    showAdd() {
      this.bookmarkDetails.itemId = null;
      this.addBookmark.show = true;
    },
    hideAdd() {
      this.bookmarkDetails.itemId = null;
      this.addBookmark.show = false;
    },
  },
});
