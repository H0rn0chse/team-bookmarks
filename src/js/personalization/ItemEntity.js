import { TArray, TBoolean, TString } from "../Validation";
import { clone } from "../utils";
import { Base } from "./Base";

export class ItemEntity extends Base {
  static #actions = {
    New: "N",
    Modified: "M"
  };

  static #allowedProps = [
    "id",
    "hidden",
    "favorite",
    "group",
    "title",
    "src",
    "description",
    "keywords",
  ];

  static #props = {
    "id": {
      default: "",
      validate: TString()
    },
    "hidden": {
      default: false,
      validate: TBoolean()
    },
    "favorite": {
      default: false,
      validate: TBoolean()
    },
    "group": {
      default: null,
      validate: TString({ nullable: true })
    },
    "title": {
      default: "",
      validate: TString()
    },
    "src": {
      default: "",
      validate: TString()
    },
    "description": {
      default: "",
      validate: TString()
    },
    "keywords": {
      default: [],
      validate: TArray({ itemType: TString() })
    },
  };

  static extractPers (originalItems = {}, personalizedItems = {}) {
    const pers = [];
    Object.values(personalizedItems).forEach((persItem) => {
      const origItem = originalItems[persItem.id];

      if (!origItem) {
        pers.push({
          type: this.#actions.New,
          pers: clone(persItem)
        });
        return;
      }

      const persData = this.#allowedProps.reduce((data, key) => {
        const propDefinition = this.#props[key];
        const origValue = origItem[key];
        const persValue = persItem[key];

        if (!propDefinition.validate(persValue)) {
          console.error(`Validation: Failed for ${origItem.id} on ${key} with value:`, persValue);
          return data;
        }

        if (persValue !== origValue) { // only save modified values
          if (typeof persValue === "object") { // only clone actual objects
            pers[key] = clone(persValue);
          } else {
            pers[key] = persValue;
          }
        }

        return data;
      }, {});
      persData.id = origItem.id; // always add id for reference

      if (Object.keys(persData).length > 1) {
        pers.push({
          type: this.#actions.Modified,
          pers: persData
        });
      }
    });
    return {
      data: pers,
      version: "0.0.1"
    };
  }

  static applyPers (originalItems = {}, personalization = []) {
    const originalItemsClone = clone(originalItems);

    const personalizedItems = personalization.reduce((items, { type, pers }) => {
      let baseItem;
      switch (type) {
        case this.#actions.New:
          baseItem = {};
          break;
        case this.#actions.Modified:
          baseItem = items[pers.id];
          break;
        default:
          console.error(`Unknown pers type ${type}. Skipping entry`);
          return items;
      }
      if (!baseItem) {
        console.error(`Could not find baseItem for ${pers.id}. Item was probably deleted. Skipping entry.`);
        return items;
      }

      // build item
      const item = this.#allowedProps.reduce((data, key) => {
        if (data === null) { // Validation failed for previous property
          return data;
        }
        const propDefinition = this.#props[key];

        if (Object.hasOwn(pers, key)) {
          const persPropValue = pers[key];
          if (!propDefinition.validate(persPropValue)) {
            console.error(`Validation: Personalization failed for ${data.id} on ${key} with value:`, persPropValue);
            return data; // skip prop
          }
          data[key] = pers[key];
        } else if (!Object.hasOwn(data, key)) {
          // origItem does not define required props
          data[key] = propDefinition.default;
        }

        // validate final value
        if (!propDefinition.validate(data[key])) {
          console.error(`Validation: Final Value failed for ${data.id} on ${key} with value:`, data[key]);
          return null; // skip item, cannot recover from this state
        }

        return data;
      }, baseItem);

      // Add Item
      if (item) {
        items[item.id] = item;
      }

      return items;
    }, originalItemsClone);

    return personalizedItems;
  }

  static mixPers (personalization1 = [], personalization2 = [], mixLevel = this.mixLevel.Item) {
    return [];
  }

  static getEmptyPers () {
    return [];
  }

  #isValidProp = {};
}
