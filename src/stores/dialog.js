import { ref } from "vue";
import { defineStore } from "pinia";
import { useMainStore } from "@/stores/main";
import { clone } from "@/js/utils";

export const useDialogStore = defineStore("dialog", () => {
  const mainStore = useMainStore();

  const emptyItem = {
    hidden: false,
    favorite: false,
    group: null,
    title: "",
    src: "",
    description: "",
    keywords: []
  };

  const defaultItem = {
    ...emptyItem,
    ...{
      title: "New Item",
      src: "https://sap.com",
    }
  };

  // ================= Settings =================
  const settings = ref({
    show: false,
  });

  function showSettings () {
    settings.value.show = true;
  }
  function hideSettings () {
    settings.value.show = false;
  }

  // ================= Details =================
  const itemDetails = ref(clone(emptyItem));

  // ================= Edit =================
  const editBookmark = ref({
    show: false,
    itemId: null
  });

  function saveEditItem () {
    const item = clone(itemDetails.value);

    mainStore.updateItem(editBookmark.value.itemId, item);
  }
  function deleteEditItem () {
    mainStore.deleteItem(editBookmark.value.itemId);
  }
  function hideEditItem () {
    mainStore.updateItem(editBookmark.value.itemId, { hidden: true });
  }
  function showEdit (itemId) {
    const item = mainStore.getItem(itemId) || emptyItem;
    itemDetails.value = clone(item);

    editBookmark.value.itemId = itemId;
    editBookmark.value.show = true;
  }
  function hideEdit () {
    itemDetails.value = clone(emptyItem);

    editBookmark.value.itemId = null;
    editBookmark.value.show = false;
  }

  // ================= Add =================
  const addBookmark = ref({
    show: false,
    itemId: null,
  });

  function saveAddItem () {
    const item = clone(itemDetails.value);

    mainStore.addItem(item);
  }
  function showAdd () {
    itemDetails.value = clone(defaultItem);

    addBookmark.value.itemId = null;
    addBookmark.value.show = true;
  }
  function hideAdd () {
    itemDetails.value = clone(emptyItem);

    addBookmark.value.itemId = null;
    addBookmark.value.show = false;
  }

  return {
    settings,
    showSettings,
    hideSettings,
    itemDetails,
    editBookmark,
    saveEditItem,
    deleteEditItem,
    hideEditItem,
    showEdit,
    hideEdit,
    addBookmark,
    saveAddItem,
    showAdd,
    hideAdd,
  };
});
