import { MIX_LEVEL, PersBase } from "./PersBase";
import { Schema } from "./Schema.js";
import { TArray, TBoolean, TColor, TString } from "./Types.js";
import { EntityPers } from "./EntityPers.js";

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

const persVersion = "1.0.0";

export class PersonalizationProcessor extends PersBase {
  static extractPers (originalData, personalizedData) {
    return {
      version: persVersion,
      entities: {
        items: EntityPers.extractPers(itemSchema, originalData.items, personalizedData.items),
        groups: EntityPers.extractPers(groupSchema, originalData.groups, personalizedData.groups),
      },
    };
  }

  static applyPers (originalData, personalization) {
    if (personalization.version !== persVersion) {
      console.error("Could not apply personalization");
      return originalData;
    }

    const { items, groups } = personalization.entities || {};

    const personalizedData = {
      items: EntityPers.applyPers(itemSchema, originalData.items, items),
      groups: EntityPers.applyPers(groupSchema, originalData.groups, groups),
    };
    this.#sanitizeGroupAssignments(personalizedData);
    return personalizedData;
  }

  static mixPers (personalization1, personalization2, mixLevel = MIX_LEVEL.Item) {
    // personalization1 has prio

    if (personalization1.version !== persVersion || personalization2.version !== persVersion) {
      console.error("Could not mix personalization");
      return this.getEmptyPers();
    }

    const { items: items1, groups: groups1 } = personalization1.entities || {};
    const { items: items2, groups: groups2 } = personalization2.entities || {};

    return {
      entities: {
        items: EntityPers.mix(itemSchema, items1, items2, mixLevel),
        groups: EntityPers.mix(groupSchema, groups1, groups2, mixLevel),
      },
      version: persVersion
    };
  }

  static getEmptyPers () {
    return {
      version: persVersion,
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
      this._addToTrash("PersonalizationProcessor", "items", { id: item.id, group: item.group });
      item.group = null;
    });
  }
}

/*
originalData + personalizedData => extract pers
  => diff?
originalData + personalization => apply pers
+ validation? => addToTash
pers1 + pers2 => combine on entity item level
pers1 + pers2 => combine on entity item prop level

*/
