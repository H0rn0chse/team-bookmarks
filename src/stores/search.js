import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useMainStore } from "@/stores/main";

export const useSearchStore = defineStore("search", () => {
  const mainStore = useMainStore();

  const searchTerms = ref([]);

  const searchKeywords = computed(() => {
    return mainStore.availableKeywords
      .filter(keyword => !searchTerms.value.includes(keyword));
  });

  const filteredItems = computed(() => {
    return mainStore.searchStrings
      .filter(item => {
        return searchTerms.value.every(term => {
          return item.keywords.some(keyword => keyword.includes(term));
        });
      })
      .map(item => item.itemId);
  });

  return {
    searchTerms,
    searchKeywords,
    filteredItems
  };
});
