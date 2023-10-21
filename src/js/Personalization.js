import { useMainStore } from "@/stores/main";
import { PersonalizationProcessor } from "./personalization/PersonalizationProcessor.js";
import { LocalStorage } from "./LocalStorage.js";

const localStorageKey = "team-bookmarks-personalization";
const bookmarkRepoPath = "./team-bookmarks.json";

// ========================== Load Data ========================
let cachedPromise = null;
function getDataFromRepo () {
  if (!cachedPromise) {
    cachedPromise = _getDataFromRepo();
  }
  return cachedPromise;
}

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
// =============================================================

export const getOriginalData = getDataFromRepo;

/**
 * Fetches and validates the data and applies the personalization
 * @returns {object}
 */
export async function getData () {
  const originalData = await getDataFromRepo();
  const pers = await getPersFromLocalStorage();

  // We could add a migration step here based on pers.version
  return mixinPers(originalData, pers);
}

export async function saveData () {
  const pers = await extractPers();
  await LocalStorage.setCompressedJsonObject(localStorageKey, pers);
}

export async function extractPers (originalData, personalizedData) { // used for export and saveData
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

async function getPersFromLocalStorage () {
  const pers = await LocalStorage.getCompressedJsonObject(localStorageKey);
  if (!pers) {
    return PersonalizationProcessor.getEmptyPers();
  }
  return pers;
}

/**
 * Mixes personalization into the "original" data
 * Handles inconsistencies in the personalization
 * @param {object} originalData
 * @param {object} pers
 * @returns {object} The personalized data
 */
function mixinPers (originalData, pers) {
  return PersonalizationProcessor.applyPers(originalData, pers);
}

//===================== Helper ============================

export async function hasCollisionsWithCurrentPersonalization (pers) {
  const currentPers = await extractPers();
  return PersonalizationProcessor.hasCollisions(currentPers, pers);
}

export function validatePersonalization (pers) {
  return PersonalizationProcessor.validate(pers);
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
