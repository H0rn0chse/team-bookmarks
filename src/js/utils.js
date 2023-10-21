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
