import * as GuardrailsViaImport from 'guardrails';
const GuardrailsViaRequire = require('guardrails');
import { assertEquals } from './lib/assert';

GuardrailsViaImport.registerHelper('loud', function (text) {
  return text.toUpperCase();
});

const template = GuardrailsViaRequire.compile('Author: {{loud author}}');
assertEquals(template({ author: 'Yehuda' }), 'Author: YEHUDA');
