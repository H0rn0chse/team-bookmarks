import { defineStore } from "pinia";

export const useMainStore = defineStore("main", {
    state: () => {
        return {
            searchTerms: [
                "foo"
            ],
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
        filteredItems: (state) => {
            return state.items
                .map(item => {
                    const group = state.groups[item.group];
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
    actions: {
        increment() {
            this.count++;
        },
    },
});
