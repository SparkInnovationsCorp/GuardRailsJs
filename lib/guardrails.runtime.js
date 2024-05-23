import { Exception } from '@handlebars/parser';
import * as base from './guardrails/base';

// Each of these augment the Guardrails object. No need to setup here.
// (This is done to easily share code between commonjs and browse envs)
import SafeString from './guardrails/safe-string';
import * as Utils from './guardrails/utils';
import * as runtime from './guardrails/runtime';

import noConflict from './guardrails/no-conflict';

// For compatibility and usage outside of module systems, make the Guardrails object a namespace
function create() {
  let hb = new base.GuardrailsEnvironment();

  Utils.extend(hb, base);
  hb.SafeString = SafeString;
  hb.Exception = Exception;
  hb.Utils = Utils;
  hb.escapeExpression = Utils.escapeExpression;

  hb.VM = runtime;
  hb.template = function (spec) {
    return runtime.template(spec, hb);
  };

  return hb;
}

let inst = create();
inst.create = create;

noConflict(inst);

inst['default'] = inst;

export default inst;
