import { defineStore } from "pinia";
import { useMainStore } from "@/stores/main";

export const useDialogStore = defineStore("dialog", {
  state: () => {
    return {
      settings: {
        show: false,
      },
      emptyItem: {
        hidden: false,
        favorite: false,
        group: null,
        title: "",
        src: "",
        description: "",
        keywords: []
      },
      itemDetails: {
        hidden: false,
        favorite: false,
        group: null,
        title: "",
        src: "",
        description: "",
        keywords: []
      },
      editBookmark: {
        show: false,
        itemId: null
      },
      addBookmark: {
        show: false,
        itemId: null,
        defaultItem: {
          hidden: false,
          favorite: false,
          group: null,
          title: "New Item",
          src: "https://sap.com",
          description: "",
          keywords: []
        },
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
      const mainStore = useMainStore();

      const item = mainStore.getItem(itemId) || this.emptyItem;
      this.itemDetails = JSON.parse(JSON.stringify(item));

      this.editBookmark.itemId = itemId;
      this.editBookmark.show = true;
    },
    hideEdit() {
      this.itemDetails = JSON.parse(JSON.stringify(this.emptyItem));

      this.editBookmark.itemId = null;
      this.editBookmark.show = false;
    },
    showAdd() {
      const item = this.addBookmark.defaultItem;
      this.itemDetails = JSON.parse(JSON.stringify(item));

      // todo handle id generation
      this.addBookmark.itemId = null;
      this.addBookmark.show = true;
    },
    hideAdd() {
      this.itemDetails = JSON.parse(JSON.stringify(this.emptyItem));

      this.addBookmark.itemId = null;
      this.addBookmark.show = false;
    },
  },
});
