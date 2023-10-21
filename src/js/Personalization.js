import { useMainStore } from "@/stores/main";
import { PersonalizationProcessor } from "./personalization/PersonalizationProcessor.js";
import { LocalStorage } from "./LocalStorage.js";
import { MIX_LEVEL } from "./personalization/PersBase.js";

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
  const personalization = await getPersFromLocalStorage();

  // We could add a migration step here based on pers.version
  return mixinPers(originalData, personalization);
}

export async function saveData () {
  const personalization = await extractPers();
  await LocalStorage.setCompressedJsonObject(localStorageKey, personalization);
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
export async function applyPers (originalData, ...personalizationList) { // used for import only
  let personalizedData = originalData;
  personalizationList.forEach((personalization) => {
    personalizedData = mixinPers(personalizedData, personalization);
  });
  return personalizedData;
}

async function getPersFromLocalStorage () {
  const personalization = await LocalStorage.getCompressedJsonObject(localStorageKey);
  if (!personalization) {
    return PersonalizationProcessor.getEmptyPers();
  }
  return personalization;
}

/**
 * Mixes personalization into the "original" data
 * Handles inconsistencies in the personalization
 * @param {object} originalData
 * @param {object} personalization
 * @returns {object} The personalized data
 */
function mixinPers (originalData, personalization) {
  return PersonalizationProcessor.applyPers(originalData, personalization);
}

export function mixPersOnItemLevel (personalization1, personalization2) {
  return PersonalizationProcessor.mixPers(personalization1, personalization2, MIX_LEVEL.Item);
}

export function mixPersOnPropertyLevel (personalization1, personalization2) {
  return PersonalizationProcessor.mixPers(personalization1, personalization2, MIX_LEVEL.Property);
}

//===================== Helper ============================

export async function hasCollisionsWithCurrentPersonalization (personalization) {
  const currentPers = await extractPers();
  return PersonalizationProcessor.hasCollisions(currentPers, personalization);
}

export function validatePersonalization (personalization) {
  return PersonalizationProcessor.validate(personalization);
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
