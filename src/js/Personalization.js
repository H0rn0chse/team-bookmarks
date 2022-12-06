import { diff } from "deep-object-diff";
import { useMainStore } from "@/stores/main";
import { clone, undefinedReplacer } from "@/js/utils";

const localStorageKey = "personalization_team-bookmarks";

async function getDataFromRepo () {
  // todo implement caching
  // todo implement
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
          id: index.toString(),
          hidden: false,
          favorite: isFavorite,
          group: groupId,
          title: `Item No. ${index.toString().padStart(3, "0")}`,
          src: "https://sap.com",
          description: "description",
          keywords: []
        };
      })
      .reduce((items, item) => {
        items[item.id] = item;
        return items;
      }, {}),
    groups: {
      "123-456": {
        "id": "123-456",
        "title": "my Special pink Group",
        "color": "red",
        "background": "rgb(239, 207, 227)"
      }
    },
  };
}

async function getPersFromLocalStorage () {
  const pers = JSON.parse(localStorage.getItem(localStorageKey));
  if (!pers) {
    return {
      version: "0.0.1",
      diff: {}
    };
  }
  return pers;
}

export async function getData () {
  const originalData = await getDataFromRepo();
  const pers = await getPersFromLocalStorage();

  // We could add a migration step here based on pers.version
  const personalizedData = mixinPers(originalData, pers.diff);
  return personalizedData;
}

export async function extractPers () {
  const mainStore = useMainStore();
  const storeData = mainStore.getExportData();
  const originalData = await getDataFromRepo();

  const pers = diff(originalData, storeData);
  return {
    version: "0.0.1",
    diff: pers
  };
}

export async function applyPers (pers) {
  const originalData = await getDataFromRepo();

  // We could add a migration step here based on pers.version
  const personalizedData = mixinPers(originalData, pers.diff);
  return personalizedData;
}

export async function savePers () {
  const pers = await extractPers();
  localStorage.setItem(localStorageKey, JSON.stringify(pers, undefinedReplacer));
}

function mixinPers (originalData, pers) {
  const data = clone(originalData);

  // items, groups, ...
  Object.keys(data).forEach(entityKey => {
    const entityData = data[entityKey];
    const persEntity = pers[entityKey];

    // personalization does not adhere to the content structure
    if (!persEntity) {
      return;
    }

    // item and group props
    Object.keys(persEntity).forEach(itemId => {
      // Add non-existing items
      if (!entityData[itemId]) {
        entityData[itemId] = persEntity[itemId];
        return;
      }

      // Update existing items
      entityData[itemId] = mergeProps(entityData[itemId], persEntity[itemId]);
    });
  });
  return data;
}

/**
 * Merges two objects and handles array diffs created by deep-object-diff
 * @param {object} originalObj
 * @param {object} newObj
 * @returns {object} Merged Object
 */
function mergeProps (originalObj, newObj) {
  const data = clone(originalObj);

  Object.keys(newObj).forEach((key) => {
    const newValue = newObj[key];
    const oldValue = data[key];

    // arrays are diffed as objects by deep-object-diff
    if (Array.isArray(oldValue) && typeof newValue === "object") {
      Object.keys(newValue).forEach((index) => {
        data[key][index] = newValue[index];
      });
      // remove items with undefined or null
      data[key] = data[key].filter((value => value !== undefined || value !== null));
      return;
    }

    data[key] = newValue;
  });
  return data;
}
