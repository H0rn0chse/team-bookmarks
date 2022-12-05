import { defineStore } from "pinia";

export const useMainStore = defineStore("main", {
  state: () => {
    return {
      items: new Array(80)
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
            title: `Item No. ${index.toString().padStart(2, "0")}`,
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
  },
  actions: {
    getItem (itemId) {
      return this.items.find(item => item.id === itemId);
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
      // todo persist
    },
    importData (data) {
      alert("validate, migrate, import");
    },
  },
});
