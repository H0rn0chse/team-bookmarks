import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useMainStore } from "@/stores/main";

export const useSearchStore = defineStore("search", () => {
  const mainStore = useMainStore();

  const searchTerms = ref([]);

  const searchGroup = ref("visible");

  const searchGroups = ref([{
    value: "visible",
    title: "Visible",
  }, {
    value: "favorites",
    title: "Only Favorites",
  }, {
    value: "hidden",
    title: "Hidden",
  }]);

  const searchKeywords = computed(() => {
    return mainStore.availableKeywords
      .filter(keyword => !searchTerms.value.includes(keyword));
  });

  const filteredItems = computed(() => {
    return mainStore.searchStrings
      .filter(item => {
        // groups
        const itemData = mainStore.getItem(item.itemId);
        switch (searchGroup.value) {
          case "hidden":
            if (!itemData.hidden) {
              return false;
            }
            break;
          case "favorites":
            if (!itemData.favorite || itemData.hidden) {
              return false;
            }
            break;
          default:
            // visible
            if (itemData.hidden) {
              return false;
            }
        }

        // keywords
        return searchTerms.value.every(term => {
          return item.keywords.some(keyword => keyword.includes(term));
        });
      })
      .map(item => item.itemId);
  });

  return {
    searchTerms,
    searchGroup,
    searchGroups,
    searchKeywords,
    filteredItems,
  };
});
