import { MIX_LEVEL, PersBase } from "./PersBase";
import { Schema } from "./Schema.js";
import { TArray, TBoolean, TColor, TString } from "./Types.js";
import { EntityPers } from "./EntityPers.js";
import { LocalStorage } from "../LocalStorage.js";

export const ENTITY_KEY = {
  Item: "Item",
  Group: "Group",
};

const itemSchema = new Schema({
  "id": TString({ default: "" }),
  "hidden": TBoolean({ default: false }),
  "favorite": TBoolean({ default: false }),
  "group": TString({ default: null, nullable: true }),
  "title": TString({ default: "" }),
  "src": TString({ default: "" }),
  "description": TString({ default: "" }),
  "keywords": TArray({ default: [], itemType: TString({ default: "" }) }),
}, "id");

const groupSchema = new Schema({
  "id": TString({ default: "" }),
  "title": TString({ default: "" }),
  "color": TColor({ default: "#000000" }),
  "background": TColor({ default: "#FFFFFF" }),
}, "id");

const latestVersion = "1.0.0";

export class PersonalizationProcessor extends PersBase {
  static extractPers (originalData, personalizedData) {
    return {
      version: latestVersion,
      entities: {
        items: EntityPers.extractPers(itemSchema, originalData.items, personalizedData.items),
        groups: EntityPers.extractPers(groupSchema, originalData.groups, personalizedData.groups),
      },
    };
  }

  static applyPers (originalData, personalization) {
    if (!this.validate(personalization)) {
      console.error("Could not apply personalization");
      return originalData;
    }

    const { items, groups } = personalization.entities;

    const personalizedData = {
      items: EntityPers.applyPers(itemSchema, originalData.items, items),
      groups: EntityPers.applyPers(groupSchema, originalData.groups, groups),
    };
    this.#sanitizeGroupAssignments(personalizedData);
    return personalizedData;
  }

  static mixPers (personalization1, personalization2, mixLevel = MIX_LEVEL.Item) {
    // personalization1 has prio
    if (!this.validate(personalization1) || !this.validate(personalization2)) {
      console.error("Could not mix personalization");
      return this.getEmptyPers();
    }

    const { items: items1, groups: groups1 } = personalization1.entities;
    const { items: items2, groups: groups2 } = personalization2.entities;

    return {
      entities: {
        items: EntityPers.mix(itemSchema, items1, items2, mixLevel),
        groups: EntityPers.mix(groupSchema, groups1, groups2, mixLevel),
      },
      version: latestVersion
    };
  }

  static getEmptyPers () {
    return {
      version: latestVersion,
      entities: {
        items: EntityPers.getEmptyPers(),
        groups: EntityPers.getEmptyPers(),
      },
    };
  }

  // remove assignments to non-existing groups
  static #sanitizeGroupAssignments (data) {
    const groupIds = Object.keys(data.groups);
    Object.keys(data.items).forEach(key => {
      const item = data.items[key];
      if (!item.group || groupIds.includes(item.group)) {
        return;
      }
      console.warn(`Validation: Found and removed assignment to non-existing group ${item.group} in item ${key}.`);
      LocalStorage.addToTrash("PersonalizationProcessor", "items", { id: item.id, group: item.group });
      item.group = null;
    });
  }

  static validate (pers) {
    if (typeof pers !== "object") {
      console.error("Validation: Invalid type");
      return false;
    }

    const { version, entities } = pers;
    if (!version || !entities) {
      console.error("Validation: Invalid schema");
      return false;
    }

    if (version !== latestVersion) {
      console.error("Validation: Invalid personalization version");
      return false;
    }

    const { items, groups } = entities;
    if (!items || !groups) {
      console.error("Validation: Invalid schema");
      return false;
    }

    return EntityPers.validate(itemSchema, items) && EntityPers.validate(groupSchema, groups);
  }

  static hasCollisions (personalization1, personalization2) {
    if (!this.validate(personalization1) || !this.validate(personalization2)) {
      console.error("Could not check for collisions");
      return false;
    }

    const { items: items1, groups: groups1 } = personalization1.entities;
    const { items: items2, groups: groups2 } = personalization2.entities;
    const collisionInItems = EntityPers.hasCollisions(itemSchema, items1, items2);
    const collisionInGroups = EntityPers.hasCollisions(groupSchema, groups1, groups2);
    return collisionInItems || collisionInGroups;
  }
}

export function isValidEntity (entityKey, entity) {
  switch (entityKey) {
    case ENTITY_KEY.Item:
      return itemSchema.isValidEntity(entity);
    case ENTITY_KEY.Group:
      return groupSchema.isValidEntity(entity);
    default:
      throw new Error("Unsupported entityKey");
  }
}
