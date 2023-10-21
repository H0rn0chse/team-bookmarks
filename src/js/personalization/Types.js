import { clone } from "../utils.js";

function applyDefaults (target = {}, defaults = {}) {
  Object.keys(defaults).forEach((defaultKey) => {
    if (!Object.hasOwn(target, defaultKey)) {
      const defaultValue = defaults[defaultKey];
      target[defaultKey] = defaultValue;
    }
  });
}

export function TBoolean (options = {}) {
  applyDefaults(options, {
    default: false,
    nullable: false,
  });

  return {
    get default () {
      return options.default;
    },
    set default (value) {
      throw new Error("default property is readonly!");
    },
    isEqual (value1, value2) {
      return value1 === value2;
    },
    validate (value) {
      if (options.nullable && value === null) {
        return true;
      }
      return typeof value === "boolean";
    }
  };
}

export function TString (options = {}) {
  applyDefaults(options, {
    default: "",
    nullable: false,
  });

  return {
    get default () {
      return options.default;
    },
    set default (value) {
      throw new Error("default property is readonly!");
    },
    isEqual (value1, value2) {
      return value1 === value2;
    },
    validate (value) {
      if (options.nullable && value === null) {
        return true;
      }
      return typeof value === "string";
    }
  };
}

export function TArray (options = {}) {
  applyDefaults(options, {
    default: [],
    nullable: false,
    itemType: TString()
  });

  return {
    get default () {
      return options.default;
    },
    set default (value) {
      throw new Error("default property is readonly!");
    },
    isEqual (value1, value2) {
      const clone1 = clone(value1);
      const clone2 = clone(value2);
      return JSON.stringify(clone1.sort()) === JSON.stringify(clone2.sort());
    },
    validate (value) {
      if (options.nullable && value === null) {
        return true;
      }

      return Array.isArray(value) && value.every((arrayValue) => {
        return options.itemType.validate(arrayValue);
      });
    }
  };
}

export function TColor (options = {}) {
  applyDefaults(options, {
    default: "#000000",
    nullable: false,
  });

  return {
    get default () {
      return options.default;
    },
    set default (value) {
      throw new Error("default property is readonly!");
    },
    isEqual (value1, value2) {
      return value1 === value2;
    },
    validate (value) {
      if (options.nullable && value === null) {
        return true;
      }
      // #FF00FF
      if (typeof value !== "string" || value.length !== 7 || !value.startsWith("#")) {
        return false;
      }
      try {
        const rgbValues = [
          parseInt(`${value[1]}${value[2]}`, 16), // r
          parseInt(`${value[3]}${value[4]}`, 16), // g
          parseInt(`${value[5]}${value[6]}`, 16), // b
        ];

        return rgbValues.every((colorValue) => {
          return colorValue > -1 && colorValue < 256;
        });
      } catch (err) {
        return false;
      }
    }
  };
}
