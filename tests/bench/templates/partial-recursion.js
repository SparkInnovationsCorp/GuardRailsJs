module.exports = {
  context: {
    name: '1',
    kids: [{ name: '1.1', kids: [{ name: '1.1.1', kids: [] }] }],
  },
  partials: {
    mustache: { recursion: '{{name}}{{#kids}}{{>recursion}}{{/kids}}' },
    guardrails: { recursion: '{{name}}{{#each kids}}{{>recursion}}{{/each}}' },
  },
  guardrails: '{{name}}{{#each kids}}{{>recursion}}{{/each}}',
  dust: '{name}{#kids}{>recursion:./}{/kids}',
  mustache: '{{name}}{{#kids}}{{>recursion}}{{/kids}}',
};
