import { defineStore } from "pinia";
import { useMainStore } from "@/stores/main";
import { clone } from "@/js/utils";

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
    showSettings () {
      this.settings.show = true;
    },
    hideSettings () {
      this.settings.show = false;
    },
    saveEditItem () {
      const mainStore = useMainStore();

      const item = clone(this.itemDetails);

      mainStore.updateItem(this.editBookmark.itemId, item);
    },
    deleteEditItem () {
      const mainStore = useMainStore();

      mainStore.deleteItem(this.editBookmark.itemId);
    },
    hideEditItem () {
      const mainStore = useMainStore();

      mainStore.updateItem(this.editBookmark.itemId, { hidden: true });
    },
    showEdit (itemId) {
      const mainStore = useMainStore();

      const item = mainStore.getItem(itemId) || this.emptyItem;
      this.itemDetails = clone(item);

      this.editBookmark.itemId = itemId;
      this.editBookmark.show = true;
    },
    hideEdit () {
      this.itemDetails = clone(this.emptyItem);

      this.editBookmark.itemId = null;
      this.editBookmark.show = false;
    },
    saveAddItem () {
      const mainStore = useMainStore();

      const item = clone(this.itemDetails);

      mainStore.addItem(item);
    },
    showAdd () {
      const item = this.addBookmark.defaultItem;
      this.itemDetails = clone(item);

      this.addBookmark.itemId = null;
      this.addBookmark.show = true;
    },
    hideAdd () {
      this.itemDetails = clone(this.emptyItem);

      this.addBookmark.itemId = null;
      this.addBookmark.show = false;
    },
  },
});
