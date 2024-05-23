module.exports = {
  context: { person: { name: 'Larry', age: 45 } },
  guardrails: '{{#person}}{{name}}{{age}}{{/person}}',
};
