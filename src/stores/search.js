import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useMainStore } from "@/stores/main";

export const useSearchStore = defineStore("search", () => {
  const mainStore = useMainStore();

  const searchTerms = ref([]);

  const searchGroup = ref("visible");

  const searchGroups = ref([{
    value: "visible",
    title: "Visible Items",
  }, {
    value: "favorites",
    title: "Only Favorites",
  }, {
    value: "hidden",
    title: "Hidden Items",
  }]);

  const searchKeywords = computed(() => {
    return mainStore.availableKeywords;
  });

  const filteredItems = computed(() => {
    return mainStore.searchStrings
      .filter(item => {
        // groups
        switch (searchGroup.value) {
          case "hidden":
            if (!item.hidden) {
              return false;
            }
            break;
          case "favorites":
            if (!item.favorite || item.hidden) {
              return false;
            }
            break;
          default:
            // visible
            if (item.hidden) {
              return false;
            }
        }

        // keywords
        return searchTerms.value.every(term => {
          return item.searchStrings.some(string => string.toLowerCase().includes(term.toLowerCase()));
        });
      })
      .map(item => item.id);
  });

  return {
    searchTerms,
    searchGroup,
    searchGroups,
    searchKeywords,
    filteredItems,
  };
});
