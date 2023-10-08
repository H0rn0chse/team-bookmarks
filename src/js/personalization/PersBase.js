
export const MIX_LEVEL = {
  Item: "Item",
  Property: "Property"
};

export class PersBase {
  static extractPers () {
    throw new Error("Required interface 'extractPers' is not implemented!");
  }

  static applyPers () {
    throw new Error("Required interface 'applyPers' is not implemented!");
  }

  static mixPers () {
    throw new Error("Required interface 'mixPers' is not implemented!");
  }

  static getEmptyPers () {
    throw new Error("Required interface 'getEmptyPers' is not implemented!");
  }
}
