module.exports = {
  context: {
    names: [
      { name: 'Moe' },
      { name: 'Larry' },
      { name: 'Curly' },
      { name: 'Shemp' },
    ],
  },
  guardrails: '{{#each names}}{{name}}{{/each}}',
  dust: '{#names}{name}{/names}',
  mustache: '{{#names}}{{name}}{{/names}}',
};
