import { undefinedReplacer } from "../utils";

const trashKey = "team-bookmarks-trash";

export class Base {
  static mixLevel = {
    Item: "Item",
    Property: "Property"
  };

  static extractPers () { }

  static applyPers () { }

  static mixPers () { }

  static getEmptyPers () { }

  static _addToTrash (bucket, entityKey, item) {
    item.deletedOn = new Date().toUTCString();

    const trash = JSON.parse(localStorage.getItem(trashKey)) || {};
    const trashBucket = trash[bucket] || {};

    if (!trashBucket[entityKey]) {
      trashBucket[entityKey] = [];
    }

    trashBucket[entityKey].push(item);
    localStorage.setItem(trashKey, JSON.stringify(trash, undefinedReplacer));
  }
}
