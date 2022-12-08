import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useMainStore } from "@/stores/main";
import { clone } from "@/js/utils";
import { isOriginalItem } from "@/js/Personalization";

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
  const settingsExpose = {
    settings,
    showSettings,
    hideSettings,
  };

  // ================= Details =================
  const itemDetails = ref(clone(emptyItem));

  // ================= Edit =================
  const editBookmark = ref({
    show: false,
    itemId: null
  });
  const editIsOriginal = computed({
    get () {
      return isOriginalItem(editBookmark.value.itemId);
    }
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
  function unhideEditItem () {
    mainStore.updateItem(editBookmark.value.itemId, { hidden: false });
  }
  function showEdit (itemId) {
    const item = mainStore.getItem(itemId) || emptyItem;
    itemDetails.value = clone(item);

    editBookmark.value.itemId = itemId;
    editBookmark.value.show = true;
  }
  function hideEdit () {
    editBookmark.value.show = false;
  }

  const editBookmarkExpose = {
    editBookmark,
    editIsOriginal,
    saveEditItem,
    deleteEditItem,
    hideEditItem,
    unhideEditItem,
    showEdit,
    hideEdit,
  };

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
    addBookmark.value.show = false;
  }

  const addBookmarkExpose = {
    addBookmark,
    saveAddItem,
    showAdd,
    hideAdd,
  };

  return {
    itemDetails,
    ...settingsExpose,
    ...editBookmarkExpose,
    ...addBookmarkExpose
  };
});
