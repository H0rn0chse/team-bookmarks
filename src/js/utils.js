const trashKey = "team-bookmarks-trash";

export function getColor (sKey) {
  return window.getComputedStyle(document.documentElement).getPropertyValue(sKey).trim();
}

export function clone (value) {
  if (typeof value !== "object") {
    if (typeof value === "function") {
      throw new Error("functions and classes cannot be cloned");
    }
    return value;
  }

  try {
    let clonedValue = JSON.parse(JSON.stringify(value, undefinedReplacer));
    return clonedValue;
  } catch (err) {
    console.warn(`Clone failed for ${value}. Returning the original value`, err);
    return value;
  }
}

export function undefinedReplacer (key, value) {
  return typeof value === "undefined" ? null : value;
}

export function addToTrash (bucket, entityKey, item) {
  item.deletedOn = new Date().toUTCString();

  const trash = JSON.parse(localStorage.getItem(trashKey)) || {};
  const trashBucket = trash[bucket] || {};

  if (!trashBucket[entityKey]) {
    trashBucket[entityKey] = [];
  }

  trashBucket[entityKey].push(item);
  localStorage.setItem(trashKey, JSON.stringify(trash, undefinedReplacer));
}
