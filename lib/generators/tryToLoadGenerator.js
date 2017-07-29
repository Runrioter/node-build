const _ = require('lodash');

function tryToLoadGenerator(nameOrObject, lookupTable, thingKind) {
  const parsed = parseNameOrObject(nameOrObject);
  if (!parsed) {
    return nameOrObject;
  }

  const thing = lookupTable[parsed.name];
  if (!thing) {
    throw new Error(`Failed to resolve ${nameOrObject} ${thingKind}`);
  }
  if (typeof thing === 'function') {
    return thing(parsed.options);
  }

  return thing;
}

function parseNameOrObject(nameOrObject) {
  if (typeof nameOrObject === 'string') {
    return { name: nameOrObject, options: {} };
  }

  if (typeof nameOrObject === 'object') {
    const name = nameOrObject.generator;
    if (typeof name === 'string') {
      return { name, options: _.omit(nameOrObject, 'generator') };
    }
  }
}

module.exports = {
  tryToLoadGenerator,
};
