import { compressToUTF16, decompressFromUTF16 } from "async-lz-string";
import { undefinedReplacer } from "./utils.js";

const trashKey = "team-bookmarks-trash";

function isDebugMode () {
  return !!localStorage.getItem("debugMode");
}

export class LocalStorage {
  static getJsonObject (key) {
    const string = localStorage.getItem(key);
    try {
      const data = JSON.parse(string);
      return data;
    } catch (err) {
      console.error(`Could not read data from localStorage: ${err}`);
      localStorage.setItem(`${key}-${Date.now()}`, string);
    }
  }

  static setJsonObject (key, data) {
    try {
      const string = JSON.stringify(data, null, undefinedReplacer);
      localStorage.setItem(key, string);
    } catch (err) {
      console.error(`Could not save data to localStorage: ${err}`);
    }
  }

  static dump (key, data) {
    if (typeof data === "string") {
      localStorage.setItem(key, data);
      return;
    }

    try {
      const string = JSON.stringify(data, null, undefinedReplacer);
      localStorage.setItem(key, string);
    } catch { /* */ }
  }

  static async getCompressedJsonObject (key) {
    const compressedString = localStorage.getItem(key);
    try {
      const string = await decompressFromUTF16(compressedString);
      const data = JSON.parse(string);
      return data;
    } catch (err) {
      console.error(`Could not read data from localStorage: ${err}`);
      localStorage.setItem(`${key}-${Date.now()}`, compressedString);
    }
  }

  static async setCompressedJsonObject (key, data) {
    try {
      const string = JSON.stringify(data, null, undefinedReplacer);
      const compressedString = await compressToUTF16(string);
      localStorage.setItem(key, compressedString);
      if (isDebugMode()) {
        localStorage.setItem(`${key}-debug`, string);
      }
    } catch (err) {
      console.error(`Could not save data to localStorage: ${err}`);
    }
  }

  static addToTrash (bucket, entityKey, item = {}) {
    item.deletedOn = new Date().toUTCString();

    const trash = this.getJsonObject(trashKey) || {};
    const trashBucket = trash[bucket] || {};

    if (!trashBucket[entityKey]) {
      trashBucket[entityKey] = [];
    }

    trashBucket[entityKey].push(item);
    this.setJsonObject(trash, trash);
  }
}
