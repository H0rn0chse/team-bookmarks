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

export function isValidPersItem (entityKey, item) {
  switch (entityKey) {
    case "items":
      return Object.keys(item).every((key) => {
        return isValidItemProp(key, item[key]);
      });
    case "groups":
      return Object.keys(item).every((key) => {
        return isValidGroupProp(key, item[key]);
      });
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

  const hasId = isValidItemProp("id", item.id);
  const hasTitle = isValidItemProp("title", item.title);
  const hasLink = isValidItemProp("src", item.src);
  const hasKeywords = isValidItemProp("keywords", item.keywords);
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

function isValidItemProp (prop, value) {
  switch (prop) {
    case "id":
    case "title":
    case "src":
      return !!value && !!value.trim();
    case "keywords":
      return Array.isArray(value);
    default:
      true;
  }
}

function isValidGroupProp (prop, value) {
  switch (prop) {
    case "id":
    case "title":
    case "color":
    case "background":
      return !!value && !!value.trim();
    default:
      true;
  }
}
