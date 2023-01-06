import { diff } from "deep-object-diff";
import { useMainStore } from "@/stores/main";
import { clone, undefinedReplacer } from "@/js/utils";
import { isValidEntityItem, isValidPersItem } from "@/js/Validation";

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
    return {
      version: "0.0.1",
      diff: {}
    };
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
  const personalizedData = mixinPers(originalData, pers.diff);
  return personalizedData;
}

export async function extractPers (originalData, personalizedData) {
  if (!originalData || !personalizedData) {
    const mainStore = useMainStore();
    personalizedData = mainStore.getExportData();
    originalData = await getDataFromRepo();
  }

  const pers = diff(originalData, personalizedData);
  return {
    version: "0.0.1",
    diff: pers
  };
}

/**
 * Applies the personalization to the originalData and validates
 * @param {object} originalData original data
 * @param {...object} pers A personalization object containing a diff
 * @returns {object}
 */
export async function applyPers (originalData, ...pers) {
  let personalizedData = originalData;
  pers.forEach(({ diff }) => {
    personalizedData = mixinPers(personalizedData, diff);
  });
  return personalizedData;
}

export async function savePers () {
  const pers = await extractPers();
  localStorage.setItem(localStorageKey, JSON.stringify(pers, undefinedReplacer));
}

/**
 * Mixes personalization into the original data
 * Handles inconsistencies in the personalization
 * @param {object} originalData
 * @param {object} pers
 * @returns {object} The personalized data
 */
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
        if (isValidEntityItem(entityKey, persEntity[itemId])) {
          entityData[itemId] = persEntity[itemId];
        } else {
          addToTrash(entityKey, persEntity[itemId]);
          console.error(`Validation: ${entityKey} item ${itemId} is invalid and got removed from personalization`);
        }
        return;
      }


      if (isValidPersItem(entityKey, persEntity[itemId])) {
        // Update existing items
        entityData[itemId] = mergeProps(entityData[itemId], persEntity[itemId]);
      } else {
        addToTrash(entityKey, persEntity[itemId]);
        console.error(`Validation: Removed invalid personalization for ${entityKey} item ${itemId}`);
      }
    });
  });
  // remove assignments to non-existing groups
  sanitizeGroupAssignments(data);
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
