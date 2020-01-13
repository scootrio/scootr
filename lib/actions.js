'use strict';

module.exports = {
  create: Symbol('action-create'),
  read: Symbol('action-read'),
  update: Symbol('action-update'),
  delete: Symbol('action-delete'),
  all: Symbol('action-*')
};
