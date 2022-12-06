import { useMainStore } from "@/stores/main";
import { applyPers, extractPers } from "@/js/Personalization";
import { undefinedReplacer } from "@/js/utils";

let _fileHandler;

export function importData () {
  if (!_fileHandler) {
    _fileHandler = _createLoadFile();
  }
  _fileHandler.value = "";
  _fileHandler.click();
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
        const personalizedData = await applyPers(importedData);

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

export async function exportData () {
  const data = await extractPers();
  const text = JSON.stringify(data, undefinedReplacer);
  download(text, "TeamBookmarks.json", "text/plain");
}

function download (content, fileName, contentType) {
  const a = document.createElement("a");
  const file = new Blob([content], {type: contentType});
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
}
