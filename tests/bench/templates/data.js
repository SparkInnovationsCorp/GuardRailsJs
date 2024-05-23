module.exports = {
  context: {
    names: [
      { name: 'Moe' },
      { name: 'Larry' },
      { name: 'Curly' },
      { name: 'Shemp' },
    ],
  },
  guardrails: '{{#each names}}{{@index}}{{name}}{{/each}}',
};
