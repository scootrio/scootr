'use strict';

function freeze(obj, prop) {
  Object.defineProperty(obj, prop, { configurable: false, writable: false });
}

function freezeAll(pairs) {
  pairs.forEach(([obj, prop]) => freeze(obj, prop));
}

function validateName(name) {
  const nameSyntax = /^[0-9a-z]+$/gim;
  if (!nameSyntax.test(name)) {
    throw new Error(`Invalid name: "${name}" must only include alphanumeric characters`);
  }
}

function validateId(id) {
  const idSyntax = /^[0-9a-z]+$/gim;
  if (!idSyntax.test(id)) {
    throw new Error(`Invalid id: "${id}" must only include alphanumeric characters`);
  }
}

module.exports = {
  freeze,
  freezeAll,
  validateName,
  validateId
};
