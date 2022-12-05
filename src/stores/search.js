import { defineStore } from "pinia";
import { useMainStore } from "@/stores/main";

export const useSearchStore = defineStore("search", {

  state: () => {
    return {
      searchTerms: [
        "foo"
      ],
    };
  },
  getters: {
    allKeywords () {
      const main = useMainStore();
      const keywords = main.items
      // remove all hidden items
        .filter(item => !item.hidden)
        .map(item => item.keywords)
        .flat();
      return Array.from(new Set(keywords))
        .sort((keywordA, keywordB) => {
          return keywordA.localeCompare(keywordB);
        });
    },
    searchKeywords (state) {
      const main = useMainStore();
      const keywords = main.items
      // remove all hidden items
        .filter(item => !item.hidden)
        .map(item => item.keywords)
        .flat()
        .filter(keyword => !state.searchTerms.includes(keyword));
      return Array.from(new Set(keywords))
        .sort((keywordA, keywordB) => {
          return keywordA.localeCompare(keywordB);
        });
    },
    filteredItems (state) {
      const main = useMainStore();
      return main.items
        .map(item => {
          const group = main.groups[item.group];
          return {
            ...item,
            groupTitle: group?.title ?? "",
            groupColor: group?.color ?? "",
            groupBackground: group?.background ?? "",
          };
        })
      // remove all hidden items
        .filter(item => !item.hidden)
      // ensure that items match all terms with at least one property
        .filter(item => {
          return state.searchTerms.reduce((matched, term) => {
            if (!matched) {
              return false;
            }

            if (item.title.toLowerCase().includes(term.toLowerCase())) {
              return true;
            }

            if (item.description.toLowerCase().includes(term.toLowerCase())) {
              return true;
            }

            if (item.groupTitle.toLowerCase().includes(term.toLowerCase())) {
              return true;
            }

            return item.keywords.reduce((matched, keyword) => {
              if (matched) {
                return true;
              }

              if (keyword.toLowerCase().includes(term.toLowerCase())) {
                return true;
              }
            }, false);
          }, true);
        })
      // sort by favorite > title
        .sort((itemA, itemB) => {
          if (itemA.favorite && !itemB.favorite) {
            return -1;
          }
          if (!itemA.favorite && itemB.favorite) {
            return 1;
          }
          return itemA.title.localeCompare(itemB.title);
        });
    }
  },
});
