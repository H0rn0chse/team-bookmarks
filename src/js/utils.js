
export function getColor (sKey) {
  return window.getComputedStyle(document.documentElement).getPropertyValue(sKey).trim();
}

export function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function undefinedReplacer (key, value) {
  return typeof value === "undefined" ? null : value;
}
