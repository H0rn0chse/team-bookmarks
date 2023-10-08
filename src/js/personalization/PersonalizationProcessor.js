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
      v: persVersion,
      d: {
        items: EntityPers.extractPers(itemSchema, originalData.items, personalizedData.items),
        groups: EntityPers.extractPers(groupSchema, originalData.groups, personalizedData.groups),
      },
    };
  }

  static applyPers (originalData, personalization) {
    if (personalization.v !== persVersion) {
      console.error("Could not apply personalization");
      return originalData;
    }

    const personalizedData = {
      items: EntityPers.applyPers(itemSchema, originalData.items, personalization.d?.items),
      groups: EntityPers.applyPers(groupSchema, originalData.groups, personalization.d?.groups),
    };
    this.#sanitizeGroupAssignments(personalizedData);
    return personalizedData;
  }

  static mixPers (personalization1, personalization2, mixLevel = MIX_LEVEL.Item) {
    // personalization1 has prio

    if (personalization1.v !== persVersion || personalization2.v !== persVersion) {
      console.error("Could not mix personalization");
      return this.getEmptyPers();
    }

    return {
      d: {
        items: EntityPers.mix(itemSchema, personalization1.d?.items, personalization2.d?.items, mixLevel),
        groups: EntityPers.mix(groupSchema, personalization1.d?.groups, personalization2.d?.groups, mixLevel),
      },
      v: persVersion
    };
  }

  static getEmptyPers () {
    return {
      v: persVersion,
      d: {
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
