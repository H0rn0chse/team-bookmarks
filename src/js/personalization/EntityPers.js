import { clone } from "../utils.js";
import { MIX_LEVEL, PersBase } from "./PersBase.js";

export const PERS_TYPES = {
  New: "N",
  Modified: "M",
  Unknown: "U", // might be set temporarily during merge of personalization
};

const persVersion = "1.0.0";

export class EntityPers extends PersBase {
  static extractPers (schema, originalEntities = {}, personalizedEntities = {}) {
    const persItems = [];
    Object.values(personalizedEntities).forEach((persEntity) => {
      const origEntity = originalEntities[persEntity.id];

      if (!origEntity) {
        persItems.push({
          persType: PERS_TYPES.New,
          entityDiff: clone(persEntity)
        });
        return;
      }

      const persData = schema.extractDiff(origEntity, persEntity);
      persData.id = origEntity.id; // always add id for reference

      if (Object.keys(persData).length > 1) {
        persItems.push({
          persType: PERS_TYPES.Modified,
          entityDiff: persData
        });
      }
    });

    return {
      version: persVersion,
      items: persItems,
    };
  }

  static applyPers (schema, originalEntities = {}, personalization = {}) {
    if (personalization.version !== persVersion) {
      console.error("Could not apply personalization");
      return originalEntities;
    }

    const personalizedEntities = personalization.items.reduce((personalizedEntities, { type, entityDiff }) => {
      let baseEntity;
      switch (type) {
        case PERS_TYPES.New:
          baseEntity = {};
          break;
        case PERS_TYPES.Modified:
          baseEntity = personalizedEntities[entityDiff.id];
          break;
        default: // PERS_TYPES.Unknown
          baseEntity = personalizedEntities[entityDiff.id];

          // baseEntity does not exist => check whether "New" is a valid scenario
          if (!baseEntity && schema.isValidEntity(entityDiff)) {
            baseEntity = {};
          }
      }
      if (!baseEntity) {
        console.error(`Could not find baseItem for '${entityDiff.id}'. Item was probably deleted or personalization could not applied. Skipping entry.`);
        return personalizedEntities;
      }

      // build Entity
      const newEntity = schema.applyDiff(baseEntity, entityDiff);

      // Add Entity
      if (newEntity) {
        personalizedEntities[newEntity.id] = newEntity;
      }

      return personalizedEntities;
    }, clone(originalEntities));

    return personalizedEntities || clone(originalEntities);
  }

  static mixPers (schema, personalization1 = {}, personalization2 = {}, mixLevel = MIX_LEVEL.Item) {
    // personalization1 has prio

    if (personalization1.version !== persVersion || personalization2.version !== persVersion) {
      console.error("Could not mix personalization");
      return this.getEmptyPers();
    }

    // clone first to avoid side effects
    const personalizationClone1 = clone(personalization1);
    const persItems1 = personalizationClone1.items;
    const personalizationClone2 = clone(personalization2);
    const persItems2 = personalizationClone2.items;

    if (mixLevel === MIX_LEVEL.Item) {
      const persMap1 = persItems1.reduce((persMap, persItem) => {
        const entityId = persItem.entityDiff.id;

        persMap[entityId] = true;

        return persMap;
      }, {});

      return {
        version: persVersion,
        items: [
          ...persItems1,
          ...persItems2.filter((persItem) => {
            const entityId = persItem.entityDiff.id;
            return !Object.hasOwn(persMap1, entityId);
          })
        ],
      };
    }

    if (mixLevel === MIX_LEVEL.Property) {
      let persMap = persItems2.reduce((persMap, persItem) => {
        const entityId = persItem.entityDiff.id;

        if (!persMap[entityId]) {
          persMap[entityId] = persItem;
        } else {
          persMap[entityId] = this.#mixPersItems(schema, persMap[entityId], persItem);
        }

        return persMap;
      }, {});

      persMap = persItems1.reduce((persMap, persItem) => {
        const entityId = persItem.entityDiff.id;

        if (!persMap[entityId]) {
          persMap[entityId] = persItem;
        } else {
          persMap[entityId] = this.#mixPersItems(schema, persMap[entityId], persItem);
        }

        return persMap;
      }, persMap);

      return Object.values(persMap);
    }

    throw new Error("Unsupported mixLevel!");
  }

  static #mixPersItems (schema, persItem1, persItem2) {
    const pers1 = persItem1.entityDiff;
    const pers2 = persItem2.entityDiff;
    const mixedPers = {};
    schema.forEachProp((propKey, propDefinition) => {
      const propValue1 = pers1[propKey];
      const propValue2 = pers2[propKey];
      if (!propDefinition.validate(propValue1) && !propDefinition.validate(propValue2)) {
        mixedPers[propKey] = propValue2;
      }
    });

    const type1 = persItem1.persType;
    const type2 = persItem2.persType;

    const newType = type1 === type2 ? type1 : PERS_TYPES.Unknown;

    return {
      persType: newType,
      entityDiff: mixedPers
    };
  }

  static getEmptyPers () {
    return {
      version: persVersion,
      items: [],
    };
  }
}
