import { assertEquals } from './lib/assert';

import testTemplate from './test-template.guardrails';
assertEquals(testTemplate({ author: 'Yehuda' }).trim(), 'Author: Yehuda');

const testTemplateRequire = require('./test-template.guardrails');
assertEquals(
  testTemplateRequire({ author: 'Yehuda' }).trim(),
  'Author: Yehuda'
);
