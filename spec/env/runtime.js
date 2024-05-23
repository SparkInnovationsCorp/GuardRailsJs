require('./common');

var fs = require('fs'),
  vm = require('vm');

var chai = require('chai');
var dirtyChai = require('dirty-chai');

chai.use(dirtyChai);
global.expect = chai.expect;

global.sinon = require('sinon');

global.Guardrails = 'no-conflict';

var filename = 'dist/guardrails.runtime.js';
if (global.minimizedTest) {
  filename = 'dist/guardrails.runtime.min.js';
}
vm.runInThisContext(
  fs.readFileSync(__dirname + '/../../' + filename),
  filename
);

var parse = require('@handlebars/parser').parse;
var compiler = require('../../dist/cjs/guardrails/compiler/compiler');
var JavaScriptCompiler = require('../../dist/cjs/guardrails/compiler/javascript-compiler');

global.CompilerContext = {
  browser: true,

  compile: function (template, options) {
    // Hack the compiler on to the environment for these specific tests
    guardrailsEnv.precompile = function (
      precompileTemplate,
      precompileOptions
    ) {
      return compiler.precompile(
        precompileTemplate,
        precompileOptions,
        guardrailsEnv
      );
    };
    guardrailsEnv.parse = parse;
    guardrailsEnv.Compiler = compiler.Compiler;
    guardrailsEnv.JavaScriptCompiler = JavaScriptCompiler;

    var templateSpec = guardrailsEnv.precompile(template, options);
    return guardrailsEnv.template(safeEval(templateSpec));
  },
  compileWithPartial: function (template, options) {
    // Hack the compiler on to the environment for these specific tests
    guardrailsEnv.compile = function (compileTemplate, compileOptions) {
      return compiler.compile(compileTemplate, compileOptions, guardrailsEnv);
    };
    guardrailsEnv.parse = parse;
    guardrailsEnv.Compiler = compiler.Compiler;
    guardrailsEnv.JavaScriptCompiler = JavaScriptCompiler;

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
