const { types } = require('conventional-commit-types');
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: { 'type-enum': [2, 'always', Object.keys(types)] },
};
