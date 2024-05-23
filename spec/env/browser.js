require('./common');

var fs = require('fs'),
  vm = require('vm');

var chai = require('chai');
var dirtyChai = require('dirty-chai');

chai.use(dirtyChai);
global.expect = chai.expect;

global.sinon = require('sinon');

global.Guardrails = 'no-conflict';

var filename = 'dist/guardrails.js';
if (global.minimizedTest) {
  filename = 'dist/guardrails.min.js';
}
var distGuardrails = fs.readFileSync(
  require.resolve('../../' + filename),
  'utf-8'
);
vm.runInThisContext(distGuardrails, filename);

global.CompilerContext = {
  browser: true,

  compile: function (template, options) {
    var templateSpec = guardrailsEnv.precompile(template, options);
    return guardrailsEnv.template(safeEval(templateSpec));
  },
  compileWithPartial: function (template, options) {
    return guardrailsEnv.compile(template, options);
  },
};

function safeEval(templateSpec) {
  /* eslint-disable no-eval, no-console */
  try {
    return eval('(' + templateSpec + ')');
  } catch (err) {
    console.error(templateSpec);
    throw err;
  }
  /* eslint-enable no-eval, no-console */
}
