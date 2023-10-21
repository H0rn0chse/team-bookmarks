import { clone } from "../utils.js";

/**
 * flat schema, does not support deep structures
 * all props are required and get defaulted if omitted
 */
export class Schema {
  #props = {};
  #referenceKey = "id";

  constructor (props = {}, referenceKey) {
    this.#props = props;
    if (referenceKey) {
      this.#referenceKey = referenceKey;
    }
  }

  extractDiff (object1, object2) {
    const diff = Object.keys(this.#props).reduce((diff, key) => {
      const propDefinition = this.#props[key];
      const value1 = object1[key];
      const value2 = object2[key];

      if (!propDefinition.validate(value2)) {
        console.error(`Validation: Failed for '${object1[this.#referenceKey]}' on '${key}' with value:`, value2);
        return diff;
      }

      if (!propDefinition.isEqual(value2, value1)) { // only save modified values
        diff[key] = clone(value2);
      }

      return diff;
    }, {});

    return diff;
  }

  applyDiff (object, diff) {
    const baseObject = clone(object);

    const newObject = Object.keys(this.#props).reduce((newObject, key) => {
      if (newObject === null) { // Validation failed for previous property
        return newObject;
      }
      const propDefinition = this.#props[key];

      // diff does not contain all props
      if (Object.hasOwn(diff, key)) {
        const diffValue = diff[key];
        if (!propDefinition.validate(diffValue)) {
          console.error(`Validation failed for '${baseObject[this.#referenceKey]}' on '${key}' with value:`, diffValue);
          return newObject; // skip prop
        }
        newObject[key] = diff[key];

      // baseObject does not define _required_ props
      } else if (!Object.hasOwn(newObject, key)) {
        newObject[key] = propDefinition.default;
      }

      // validate final value
      if (!propDefinition.validate(newObject[key])) {
        console.error(`Validation: Final Value failed for '${baseObject[this.#referenceKey]}' on '${key}' with value:`, newObject[key]);
        return null; // abort, cannot recover from this state
      }

      return newObject;
    }, baseObject);

    return newObject;
  }

  forEachProp (callback) {
    const callbackPromises = Object.keys(this.#props).map(async (key) => {
      const propDefinition = this.#props[key];
      return callback(key, propDefinition);
    });
    return Promise.all(callbackPromises);
  }

  isValidEntity (object) {
    const allPropsAreValid = Object.keys(this.#props).every((key) => {
      const propDefinition = this.#props[key];
      const value = object[key];
      return propDefinition.validate(value);
    });
    const hasOnlySupportedProps = Object.keys(object).every((key) => {
      return Object.hasOwn(this.#props, key);
    });
    return allPropsAreValid && hasOnlySupportedProps;
  }
}
