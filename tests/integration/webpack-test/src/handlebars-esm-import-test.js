import Guardrails from 'guardrails/lib/guardrails';
import { assertEquals } from './lib/assert';

const template = Guardrails.compile('Author: {{author}}');
assertEquals(template({ author: 'Yehuda' }), 'Author: Yehuda');
