export function getColor (sKey) {
  return window.getComputedStyle(document.documentElement).getPropertyValue(sKey).trim();
}

export function clone (value) {
  try {
    let clonedValue = JSON.parse(JSON.stringify(value));
    return clonedValue;
  } catch (err) {
    console.warn(`Clone failed for ${value}. Returning the original value`, err);
    return value;
  }
}

export function undefinedReplacer (key, value) {
  return typeof value === "undefined" ? null : value;
}
