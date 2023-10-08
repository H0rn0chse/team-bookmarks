//import { diff } from "deep-object-diff";
import { diff } from "just-diff";
import { useMainStore } from "@/stores/main";
import { clone, undefinedReplacer } from "@/js/utils";
import { isValidEntityItem, isValidPersItem } from "@/js/Validation";
import { diffApply } from "just-diff-apply";
import { PersonalizationProcessor } from "./personalization/PersonalizationProcessor.js";
//import { diffJson } from "diff";
//import { parsePatch } from "diff";

const localStorageKey = "team-bookmarks-personalization";
const trashKey = "team-bookmarks-trash";
const bookmarkRepoPath = "./team-bookmarks.json";

let cachedPromise = null;
function getDataFromRepo () {
  if (!cachedPromise) {
    cachedPromise = _getDataFromRepo();
  }
  return cachedPromise;
}

export const getOriginalData = getDataFromRepo;

let cachedResult = null;
async function _getDataFromRepo () {
  try {
    const res = await fetch(bookmarkRepoPath);
    const data = await res.json();
    cachedResult = data;
    return data;
  } catch (err) {
    console.error(err);
    return {
      items: {},
      groups: {}
    };
  }
}

export function isOriginalItem (itemId) {
  if (!cachedResult || !itemId) {
    return false;
  }
  return !!cachedResult?.items?.[itemId];
}

export function isOriginalGroup (groupId) {
  if (!cachedResult || !groupId) {
    return false;
  }
  return !!cachedResult?.groups?.[groupId];
}

async function getPersFromLocalStorage () {
  const pers = JSON.parse(localStorage.getItem(localStorageKey));
  if (!pers) {
    return PersonalizationProcessor.getEmptyPers();
    // return {
    //   version: "0.0.1",
    //   diff: []
    // };
  }
  return pers;
}

/**
 * Fetches and validates the data and applies the personalization
 * @returns {object}
 */
export async function getData () {
  const originalData = await getDataFromRepo();
  const pers = await getPersFromLocalStorage();

  // We could add a migration step here based on pers.version
  const personalizedData = mixinPers(originalData, pers);
  return personalizedData;
}

export async function savePers () {
  const pers = await extractPers();
  localStorage.setItem(localStorageKey, JSON.stringify(pers, undefinedReplacer));
}

export async function extractPers (originalData, personalizedData) { // used for export and savePers
  if (!originalData || !personalizedData) {
    const mainStore = useMainStore();
    personalizedData = mainStore.getExportData();
    originalData = await getDataFromRepo();
  }

  //const pers = diff(originalData, personalizedData);
  //const pers = diffJson(originalData, personalizedData, { undefinedReplacement: null });
  //pers2 = parsePatch(pers);
  // const pers = diff(originalData, personalizedData);
  // debugger;
  // return {
  //   version: "0.0.1",
  //   diff: pers
  // };
  return PersonalizationProcessor.extractPers(originalData, personalizedData);
}

/**
 * Applies the personalization to the originalData and validates
 * @param {object} originalData original data
 * @param {...object} pers A personalization object containing a diff
 * @returns {object}
 */
export async function applyPers (originalData, ...pers) { // used for import only
  let personalizedData = originalData;
  pers.forEach(({ diff }) => {
    personalizedData = mixinPers(personalizedData, diff);
  });
  return personalizedData;
  return PersonalizationProcessor.applyPers(originalData, personalizedData);
}

/**
 * Mixes personalization into the original data
 * Handles inconsistencies in the personalization
 * @param {object} originalData
 * @param {object} pers
 * @returns {object} The personalized data
 */
function mixinPers (originalData, pers) {
  return PersonalizationProcessor.applyPers(originalData, pers);
  // const data = clone(originalData);
  // debugger;
  // diffApply(data, pers);
  // debugger;
  // return data;

  // // items, groups, ...
  // Object.keys(data).forEach(entityKey => {
  //   const entityData = data[entityKey];
  //   const persEntity = pers[entityKey];

  //   // personalization does not adhere to the content structure
  //   if (!persEntity) {
  //     return;
  //   }

  //   // item and group props
  //   Object.keys(persEntity).forEach(itemId => {
  //     // Add non-existing items
  //     if (!entityData[itemId]) {
  //       if (isValidEntityItem(entityKey, persEntity[itemId])) {
  //         entityData[itemId] = persEntity[itemId];
  //       } else {
  //         addToTrash(entityKey, persEntity[itemId]);
  //         console.error(`Validation: ${entityKey} item ${itemId} is invalid and got removed from personalization`);
  //       }
  //       return;
  //     }


  //     if (isValidPersItem(entityKey, persEntity[itemId])) {
  //       // Update existing items
  //       entityData[itemId] = mergeProps(entityData[itemId], persEntity[itemId]);
  //     } else {
  //       addToTrash(entityKey, persEntity[itemId]);
  //       console.error(`Validation: Removed invalid personalization for ${entityKey} item ${itemId}`);
  //     }
  //   });
  // });
  // // remove assignments to non-existing groups
  // sanitizeGroupAssignments(data);
  // return data;
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

function sanitizeGroupAssignments (data) {
  const groupIds = Object.keys(data.groups);
  Object.keys(data.items).forEach(key => {
    const item = data.items[key];
    if (!item.group || groupIds.includes(item.group)) {
      return;
    }
    console.error(`Validation: Found and removed assignment to non-existing group ${item.group} in item ${key}.`);
    addToTrash("items", { id: item.id, group: item.group });
    item.group = null;
  });
}

function addToTrash (entityKey, item) {
  item.deletedOn = new Date().toUTCString();
  const trash = JSON.parse(localStorage.getItem(trashKey)) || {};
  if (!trash[entityKey]) {
    trash[entityKey] = [];
  }
  trash[entityKey].push(item);
  localStorage.setItem(trashKey, JSON.stringify(trash, undefinedReplacer));
}

export function mergePersonalizationOnEntityItemLevel (basePersData, newPersData) {
  const basePers = new PersInterface(basePersData);
  const newPers = new PersInterface(newPersData);
  newPers.forEachEntityItem((entityItem) => {
    basePers.setEntityItem(entityItem);
  });
}

export function mergePersonalizationOnEntityItemPropertyLevel (basePersData, newPersData) {
  const basePers = new PersInterface(basePersData);
  const newPers = new PersInterface(newPersData);
  newPers.forEachEntityItemProperty((entityItem) => {
    basePers.setEntityItemProperty(entityItem);
  });
}

class PersInterface {
  #pers = null;
  constructor (pers) {
    this.#pers = clone(pers);
  }

  #getEntities () {
    return Object.keys(this.#pers.diff).map((entityId) => {
      return {
        meta: {
          entityId
        },
        value: this.#pers.diff[entityId]
      };
    });
  }

  #getEntityItems (entity) {
    return Object.keys(entity.value).map((entityItemId) => {
      return {
        meta: {
          entityItemId,
          ...entity.meta
        },
        value: entity.value[entityItemId]
      };
    });
  }

  #getEntityItemProperties (entityItem) {
    return Object.keys(entityItem.value).map((itemPropertyId) => {
      return {
        meta: {
          itemPropertyId,
          ...entityItem.meta
        },
        value: entityItem.value[itemPropertyId]
      };
    });
  }

  setEntityItem (entityItem) {
    const entityId = entityItem.meta.entityId;
    const itemId = entityItem.meta.entityItemId;
    const root = this.#pers.diff;

    if (!root[entityId]) {
      root[entityId] = {};
    }
    const entity = root[entityId];
    entity[itemId] = entityItem.value;
  }

  forEachEntityItem (callback) {
    this.#getEntities().forEach((entity) => {
      this.#getEntityItems(entity).forEach((entityItem) => {
        callback(entityItem);
      });
    });
  }

  setEntityItemProperty () {}

  forEachEntityItemProperty (callback) {
    this.forEachEntityItem((entityItem) => {
      this.#getEntityItemProperties(entityItem).forEach((entityItemProperty) => {
        callback(entityItemProperty);
      });
    });
  }

  hasEntityItem (searchItem) {
    let found = false;
    this.forEachEntityItem((entityItem) => {
      if (found) {
        return;
      }
      const entityMatch = searchItem.entityId === entityItem.entityId;
      const itemMatch = searchItem.entityItemId === entityItem.entityItemId;
      found = entityMatch && itemMatch;
    });
    return found;
  }
}
