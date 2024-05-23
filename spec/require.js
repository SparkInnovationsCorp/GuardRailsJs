if (typeof require !== 'undefined' && require.extensions['.guardrails']) {
  describe('Require', function () {
    it('Load .guardrails files with require()', function () {
      var template = require('./artifacts/example_1');
      equal(template, require('./artifacts/example_1.guardrails'));

      var expected = 'foo\n';
      var result = template({ foo: 'foo' });

      equal(result, expected);
    });

    it('Load .hbs files with require()', function () {
      var template = require('./artifacts/example_2');
      equal(template, require('./artifacts/example_2.hbs'));

      var expected = 'Hello, World!\n';
      var result = template({ name: 'World' });

      equal(result, expected);
    });
  });
}
