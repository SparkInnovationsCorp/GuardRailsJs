import {
  parser as Parser,
  parse,
  parseWithoutProcessing,
  Visitor,
} from '@handlebars/parser';

import runtime from './guardrails.runtime';

// Compiler imports
import AST from './guardrails/compiler/ast';
import { Compiler, compile, precompile } from './guardrails/compiler/compiler';
import JavaScriptCompiler from './guardrails/compiler/javascript-compiler';

import noConflict from './guardrails/no-conflict';

let _create = runtime.create;
function create() {
  let hb = _create();

  hb.compile = function (input, options) {
    return compile(input, options, hb);
  };
  hb.precompile = function (input, options) {
    return precompile(input, options, hb);
  };

  hb.AST = AST;
  hb.Compiler = Compiler;
  hb.JavaScriptCompiler = JavaScriptCompiler;
  hb.Parser = Parser;
  hb.parse = parse;
  hb.parseWithoutProcessing = parseWithoutProcessing;

  return hb;
}

let inst = create();
inst.create = create;

noConflict(inst);

inst.Visitor = Visitor;

inst['default'] = inst;

export default inst;
