import { Base } from "./Base";
import { ItemEntity } from "./ItemEntity";

export class PersonalizationProcessor extends Base {
  static extractPers (originalData, personalizedData) {
    return {
      data: {
        items: ItemEntity.extractPers(originalData.items, personalizedData.items),
        groups: [], // TODO: GroupEntity.extractPers
      },
      version: "0.0.1"
    };
  }

  static applyPers (originalData, personalization) {
    const personalizedData = {
      items: ItemEntity.applyPers(originalData.items, personalization.data?.items),
      groups: [] // TODO: GroupEntity.applyPers
    };
    this.#sanitizeGroupAssignments(personalizedData);
  }

  static mixPers (personalization1, personalization2, mixLevel = this.mixLevel.Item) {
    return {
      data: {
        items: ItemEntity.mix(personalization1.data?.items, personalization2.data?.items, mixLevel),
        groups: [], // TODO: GroupEntity.mix
      },
      version: "0.0.1"
    };
  }

  static getEmptyPers () {
    return {
      version: "0.0.1",
      data: {
        items: ItemEntity.getEmptyPers(),
        groups: [], // TODO: GroupEntity.getEmptyPers
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
