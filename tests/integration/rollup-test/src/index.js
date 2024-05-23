import Guardrails from 'guardrails/lib/guardrails';

const template = Guardrails.compile('Author: {{author}}');
const result = template({ author: 'Yehuda' });

if (result !== 'Author: Yehuda') {
  throw Error('Assertion failed');
}
