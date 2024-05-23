module.exports = {
  helpers: {
    foo: function () {
      return '';
    },
  },
  context: {
    bar: true,
  },

  guardrails:
    '{{foo person "person" 1 true foo=bar foo="person" foo=1 foo=true}}',
};
