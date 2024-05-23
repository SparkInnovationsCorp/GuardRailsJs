module.exports = {
  context: { person: { name: { bar: { baz: 'Larry' } }, age: 45 } },
  guardrails:
    '{{person.name.bar.baz}}{{person.age}}{{person.foo}}{{animal.age}}',
  dust: '{person.name.bar.baz}{person.age}{person.foo}{animal.age}',
  mustache: '{{person.name.bar.baz}}{{person.age}}{{person.foo}}{{animal.age}}',
};
