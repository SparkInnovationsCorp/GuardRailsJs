module.exports = {
  context: {
    names: [
      { name: 'Moe' },
      { name: 'Larry' },
      { name: 'Curly' },
      { name: 'Shemp' },
    ],
  },
  guardrails: '{{#names}}{{name}}{{/names}}',
};
