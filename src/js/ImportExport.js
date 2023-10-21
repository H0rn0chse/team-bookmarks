import { useMainStore } from "@/stores/main";
import { useSearchStore } from "@/stores/search";
import { applyPers, extractPers, getOriginalData, hasCollisionsWithCurrentPersonalization, mixPersOnItemLevel, mixPersOnPropertyLevel, validatePersonalization } from "@/js/Personalization";
import { undefinedReplacer } from "@/js/utils";

let _fileHandler;
let currentImportScope = null;

export const IMPORT_SCOPE = {
  CleanImport: "CleanImport",
  MergeOnItemLevel: "MergeOnItemLevel",
  MergeOnPropLevel: "MergeOnPropLevel"
};

export const MERGE_STRATEGY = {
  PreferPers: "PreferPers",
  PreferImport: "PreferImport"
};

export const EXPORT_SCOPE = {
  allItemsPersonalization: "allItemsPersonalization",
  allItemsCopy: "allItemsCopy",
  searchItemsPersonalization: "searchItemsPersonalization",
  searchItemsCopy: "searchItemsCopy",
};

export function importData (scope) {
  currentImportScope = scope;
  if (!_fileHandler) {
    _fileHandler = _createLoadFile();
  }
  _fileHandler.value = "";
  _fileHandler.click();
}

async function readFileAsText (file) {
  const reader = new FileReader();
  reader.readAsText(file);

  return new Promise((resolve, reject) => {
    reader.onload = () => {
      const text = reader.result;
      resolve(text);
    };

    reader.onerror = () => {
      reject(reader.error);
    };
  });
}

function _createLoadFile () {
  const fileHandler = document.createElement("input");
  fileHandler.setAttribute("id", "FileHandler");
  fileHandler.setAttribute("type", "file");
  fileHandler.setAttribute("accept", ".json,.txt");
  fileHandler.setAttribute("multiple", "false");
  document.getElementById("hidden").appendChild(fileHandler);

  fileHandler.onchange = _handleFileSelect.bind(this);

  return fileHandler;
}

function _handleFileSelect (event) {
  const file = event.target.files[0];
  if (file) {
    const fileName = file.name;
    console.log(`Reading ${fileName}`);
    const reader = new FileReader();
    reader.onload = async function () {
      try {
        const importedData = JSON.parse(reader.result);
        const personalizedData = await getImportData(importedData, currentImportScope);

        const mainStore = useMainStore();
        mainStore.importData(personalizedData);
      }
      catch (error){
        console.log(error);
        // err handling
      }
    };
    reader.readAsText(file);
  }
}

export async function importFile (file, importScope, mergeStrategy) {
  const persText = await readFileAsText(file);
  try {
    const importedData = JSON.parse(persText);
    // validation already happened in pre import
    // todo migrate
    const personalizedData = await getImportData(importedData, importScope, mergeStrategy);

    const mainStore = useMainStore();
    mainStore.importData(personalizedData);
    return;
  } catch (err) {
    return Promise.reject(err);
  }
}

async function getImportData (importedData, scope, strategy) {
  let personalizedData;
  const originalData = await getOriginalData();
  const currentPers = await extractPers();
  let importedPers;

  if (scope === IMPORT_SCOPE.CleanImport) {
    personalizedData = await applyPers(originalData, importedData);
    return personalizedData;

  } else if (scope === IMPORT_SCOPE.MergeOnItemLevel) {
    if (strategy === MERGE_STRATEGY.PreferImport) {
      importedPers = mixPersOnItemLevel(importedData, currentPers);

    } else if (strategy === MERGE_STRATEGY.PreferPers) {
      importedPers = mixPersOnItemLevel(currentPers, importedData);

    } else {
      throw new Error("Unexpected Error");
    }
  } else if (scope === IMPORT_SCOPE.MergeOnPropLevel) {
    if (strategy === MERGE_STRATEGY.PreferImport) {
      importedPers = mixPersOnPropertyLevel(importedData, currentPers);

    } else if (strategy === MERGE_STRATEGY.PreferPers) {
      importedPers = mixPersOnPropertyLevel(currentPers, importedData);

    } else {
      throw new Error("Unexpected Error");
    }
  } else {
    throw new Error("Unsupported Import Scope");
  }

  personalizedData = await applyPers(originalData, importedPers);

  return personalizedData;
}

async function getExportData (scope) {
  console.log(`Calculating export for scope ${scope}`);
  let originalData = {
    items: {},
    groups: {}
  };
  let personalizedData = {
    items: {},
    groups: {}
  };
  const mainStore = useMainStore();
  const searchStore = useSearchStore();

  if ([EXPORT_SCOPE.searchItemsPersonalization, EXPORT_SCOPE.searchItemsCopy].includes(scope)) {
    const usedGroups = new Set();
    personalizedData = mainStore.getExportData();
    Object.keys(personalizedData.items).forEach((itemId) => {
      if (!searchStore.filteredItems.includes(itemId)) {
        delete personalizedData.items[itemId];
      } else {
        const item = personalizedData.items[itemId];
        if (item.group) {
          usedGroups.add(item.group);
        }
      }
    });
    Object.keys(personalizedData.groups).forEach((groupId) => {
      if (!usedGroups.has(groupId)) {
        delete personalizedData.groups[groupId];
      }
    });

    if (scope === EXPORT_SCOPE.searchItemsPersonalization) {
      originalData = await getOriginalData();
      Object.keys(originalData.items).forEach((itemId) => {
        if (!personalizedData.items[itemId]) {
          delete originalData.items[itemId];
        }
      });
      Object.keys(originalData.groups).forEach((groupId) => {
        if (!personalizedData.groups[groupId]) {
          delete originalData.groups[groupId];
        }
      });
    }
  } else if ([EXPORT_SCOPE.allItemsPersonalization, EXPORT_SCOPE.allItemsCopy].includes(scope)) {
    personalizedData = mainStore.getExportData();
    if (scope === EXPORT_SCOPE.allItemsPersonalization) {
      originalData = await getOriginalData();
    }
  } else {
    throw new Error("Unsupported Export Scope");
  }

  console.log(`Found ${Object.keys(personalizedData.groups).length} personalized groups and ${Object.keys(personalizedData.items).length} items based on ${Object.keys(originalData.groups).length} original groups and ${Object.keys(originalData.items).length} items`);

  const data = await extractPers(originalData, personalizedData);
  return data;
}

export async function exportData (scope) {
  const data = await getExportData(scope);
  const text = JSON.stringify(data, undefinedReplacer);
  download(text, "TeamBookmarks.json", "text/plain");
}

function download (content, fileName, contentType) {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}

export async function analyzeImportFile (file) {
  const persText = await readFileAsText(file);
  try {
    const persData = JSON.parse(persText);
    // todo migrate
    if (!validatePersonalization(persData)) {
      throw new Error("Invalid personalization!");
    }

    const hasCollisions = await hasCollisionsWithCurrentPersonalization(persData);

    return {
      hasCollisions
    };
  } catch (err) {
    return Promise.reject(err);
  }
}
