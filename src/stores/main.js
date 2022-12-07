import { defineStore } from "pinia";
import { v4 as uuidV4 } from "uuid";
import { clone } from "@/js/utils";
import { savePers } from "@/js/Personalization";

export const useMainStore = defineStore("main", {
  state: () => {
    return {
      items: {},
      groups: {}
    };
  },
  getters: {
    allItems (state) {
      return Object.values(state.items)
        // sort by favorite > title
        .sort((itemA, itemB) => {
          if (itemA.favorite && !itemB.favorite) {
            return -1;
          }
          if (!itemA.favorite && itemB.favorite) {
            return 1;
          }
          return itemA.title.localeCompare(itemB.title);
        })
        .map((item) => {
          const group = this.groups[item.group];
          return {
            ...item,
            groupTitle: group?.title ?? "",
            groupColor: group?.color ?? "",
            groupBackground: group?.background ?? "",
          };
        });
    },
    /**
     * Calculates a list of searchable strings based on ALL items
     * @param {object} state
     * @returns {object[]} A list of objects containing all
     */
    searchStrings (state) {
      return Object.values(state.items)
        .map(item => {
          const keywords = new Set(item.keywords);
          const group = state.groups[item.group];

          item.title && keywords.add(item.title.toLowerCase());
          item.description && keywords.add(item.description.toLowerCase());
          group?.title && keywords.add((group?.title || "").toLowerCase());

          return {
            id: item.id,
            hidden: item.hidden,
            favorite: item.favorite,
            searchStrings: Array.from(keywords),
          };
        });
    },
    /**
     * Calculates a list of keywords based on visible items
     * @param {object} state
     * @returns {string[]} A list of keywords
     */
    availableKeywords (state) {
      const keywords = Object.values(state.items)
        // remove all hidden items
        .filter(item => !item.hidden)
        .map(item => item.keywords)
        .flat();
      return Array.from(new Set(keywords))
        .sort((keywordA, keywordB) => {
          return keywordA.localeCompare(keywordB);
        });
    }
  },
  actions: {
    getExportData () {
      return {
        items: this.items,
        groups: this.groups,
      };
    },
    importData (data) {
      // todo validate
      this.items = clone(data.items);
      this.groups = clone(data.groups);

      // persist changes
      this.saveData();
    },
    async saveData () {
      await savePers();
    },
    getItem (itemId) {
      return this.items[itemId];
    },
    expandItem (itemId) {
      const item = this.getItem(itemId);
      const group = this.groups[item.group];
      return {
        ...item,
        groupTitle: group?.title ?? "",
        groupColor: group?.color ?? "",
        groupBackground: group?.background ?? "",
      };
    },
    addItem (newItem) {
      let newId;
      do {
        newId = uuidV4();
      } while (this.items[newId]);

      newItem.id = newId;

      // todo validate new items
      this.items[newItem.id] = newItem;

      // persist changes
      this.saveData();
    },
    deleteItem (itemId) {
      const item = this.items[itemId];
      if (item) {
        delete this.items[itemId];
      } else {
        console.error(`Could not find item: ${itemId}`);
      }

      // persist changes
      this.saveData();
    },
    updateItem (itemId, props) {
      const item = this.items[itemId];
      if (item) {
        Object.keys(props).forEach((key) => {
          const value = props[key];
          item[key] = value;
        });
      } else {
        console.error(`Could not find item: ${itemId}`);
      }

      // persist changes
      this.saveData();
    },
  },
});
