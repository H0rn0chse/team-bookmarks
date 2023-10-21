import { compressToUTF16, decompressFromUTF16 } from "async-lz-string";

import { useMainStore } from "@/stores/main";
import { undefinedReplacer } from "@/js/utils";
import { PersonalizationProcessor } from "./personalization/PersonalizationProcessor.js";

const localStorageKey = "team-bookmarks-personalization";
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

function isDebugMode () {
  return !!localStorage.getItem("debugMode");
}

async function getCompressedItemFromLocalStorage (key) {
  const compressedString = localStorage.getItem(key);
  const decompressedString = await decompressFromUTF16(compressedString);
  return decompressedString;
}

async function setCompressedItemToLocalStorage (key, string) {
  const compressedString = await compressToUTF16(string);
  localStorage.setItem(key, compressedString);
  if (isDebugMode()) {
    localStorage.setItem(`${key}-debug`, string);
  }
}

async function getPersFromLocalStorage () {
  const pers = await getCompressedItemFromLocalStorage(localStorageKey);
  let parsedPers;
  try {
    parsedPers = JSON.parse(pers);
  } catch (err) { /* */ }
  if (!parsedPers) {
    return PersonalizationProcessor.getEmptyPers();
    // return {
    //   version: "0.0.1",
    //   diff: []
    // };
  }
  return parsedPers;
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
  await setCompressedItemToLocalStorage(localStorageKey, JSON.stringify(pers, undefinedReplacer));
}

export async function extractPers (originalData, personalizedData) { // used for export and savePers
  if (!originalData || !personalizedData) {
    const mainStore = useMainStore();
    personalizedData = mainStore.getExportData();
    originalData = await getDataFromRepo();
  }

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
}
