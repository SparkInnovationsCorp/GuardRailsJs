// USAGE:
// var guardrails = require('guardrails');
/* eslint-env node */
/* eslint-disable no-var */

// var local = guardrails.create();

var guardrails = require('../dist/cjs/guardrails')['default'];

var parser = require('@handlebars/parser');
guardrails.PrintVisitor = parser.PrintVisitor;
guardrails.print = parser.print;

module.exports = guardrails;

// Publish a Node.js require() handler for .guardrails and .hbs files
function extension(module, filename) {
  var fs = require('fs');
  var templateString = fs.readFileSync(filename, 'utf8');
  module.exports = guardrails.compile(templateString);
}
/* istanbul ignore else */
if (typeof require !== 'undefined' && require.extensions) {
  require.extensions['.guardrails'] = extension;
  require.extensions['.hbs'] = extension;
}
