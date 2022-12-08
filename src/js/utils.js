export function getColor (sKey) {
  return window.getComputedStyle(document.documentElement).getPropertyValue(sKey).trim();
}

export function clone (obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function undefinedReplacer (key, value) {
  return typeof value === "undefined" ? null : value;
}

export function isValidEntityItem (entityKey, item) {
  switch (entityKey) {
    case "items":
      return isValidItem(item);
    case "groups":
      return isValidGroup(item);
    default:
      throw new Error("Unsupported entityKey");
  }
}

function isValidItem (item) {
  const requiredPropNames = [
    "id",
    "hidden",
    "favorite",
    "group",
    "title",
    "src",
    "description",
    "keywords",
  ];

  const definesAllProps = requiredPropNames.every((key) => {
    return Object.hasOwn(item, key);
  });

  if (!definesAllProps) {
    return false;
  }

  const hasId = !!item.id && !!item.id.trim();
  const hasTitle = !!item.title && !!item.title.trim();
  const hasLink = !!item.src && !!item.src.trim();
  const hasKeywords = Array.isArray(item.keywords);
  return hasId && hasTitle && hasLink && hasKeywords;
}

function isValidGroup (group) {
  const requiredPropNames = [
    "id",
    "title",
    "color",
    "background",
  ];

  const definesAllProps = requiredPropNames.every((key) => {
    return Object.hasOwn(group, key);
  });

  if (!definesAllProps) {
    return false;
  }

  const hasId = !!group.id && !!group.id.trim();
  const hasTitle = !!group.title && !!group.title.trim();
  const hasColor = !!group.color && !!group.color.trim();
  const hasBackground = !!group.background && !!group.background.trim();
  return hasId && hasTitle && hasColor && hasBackground;
}
