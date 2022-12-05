import { defineStore } from "pinia";

export const useMainStore = defineStore("main", {
  state: () => {
    return {
      items: new Array(800)
        .fill({})
        .map((item, index) => {
          var isFavorite = false;
          var groupId = null;
          if (index.toString().includes("2")) {
            isFavorite = true;
          }
          if (index.toString().includes("4")) {
            groupId = "123-456";
          }
          return {
            id: index,
            hidden: false,
            favorite: isFavorite,
            group: groupId,
            title: `Item No. ${index.toString().padStart(3, "0")}`,
            src: "https://sap.com",
            description: "descr",
            keywords: [
              "test",
              "foo",
              "bar"
            ]
          };
        }),
      groups: {
        "123-456" : {
          id: "123-456",
          title: "my Special pink Group",
          color: "red",
          background: "rgb(239, 207, 227)",
        }
      }
    };
  },
  getters: {
    allItems (state) {
      return state.items
        // remove all hidden items
        .filter(item => !item.hidden)
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
    searchStrings (state) {
      return state.items
        // remove all hidden items
        .filter(item => !item.hidden)
        .map(item => {
          const keywords = new Set(item.keywords);
          const group = state.groups[item.group];

          item.title && keywords.add(item.title.toLowerCase());
          item.description && keywords.add(item.description.toLowerCase());
          group?.title && keywords.add((group?.title || "").toLowerCase());

          return {
            itemId: item.id,
            keywords: Array.from(keywords),
          };
        });
    },
    availableKeywords (state) {
      const keywords = state.items
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
    getItem (itemId) {
      return this.items.find(item => item.id === itemId);
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
      if (!newItem.id) {
        // todo fix id generation
        newItem.id = Date.now();
      }
      // todo ensure that all properties are set
      this.items.push(newItem);
      // todo persistence
    },
    deleteItem (itemId) {
      const itemIndex = this.items.findIndex(item => item.id === itemId);
      if (itemIndex > -1) {
        this.items.splice(itemIndex, 1);
      } else {
        console.error(`Could not find item: ${itemId}`);
      }
      // todo persistence
    },
    updateItem (itemId, props) {
      const item = this.items.find(item => item.id === itemId);
      if (item) {
        Object.keys(props).forEach((key) => {
          const value = props[key];
          item[key] = value;
        });
      } else {
        console.error(`Could not find item: ${itemId}`);
      }
      // todo persistence
    },
    importData (data) {
      console.log(data);
      alert("validate, migrate, import");
    },
  },
});
