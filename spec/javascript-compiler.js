describe('javascript-compiler api', function () {
  if (!Guardrails.JavaScriptCompiler) {
    return;
  }

  describe('#nameLookup', function () {
    var $superName;
    beforeEach(function () {
      $superName = guardrailsEnv.JavaScriptCompiler.prototype.nameLookup;
    });
    afterEach(function () {
      guardrailsEnv.JavaScriptCompiler.prototype.nameLookup = $superName;
    });

    it('should allow override', function () {
      guardrailsEnv.JavaScriptCompiler.prototype.nameLookup = function (
        parent,
        name
      ) {
        return parent + '.bar_' + name;
      };
      /* eslint-disable camelcase */
      expectTemplate('{{foo}}')
        .withInput({ bar_foo: 'food' })
        .toCompileTo('food');
      /* eslint-enable camelcase */
    });

    // Tests nameLookup dot vs. bracket behavior.  Bracket is required in certain cases
    // to avoid errors in older browsers.
    it('should handle reserved words', function () {
      expectTemplate('{{foo}} {{~null~}}')
        .withInput({ foo: 'food' })
        .toCompileTo('food');
    });
  });
  describe('#compilerInfo', function () {
    var $superCheck, $superInfo;
    beforeEach(function () {
      $superCheck = guardrailsEnv.VM.checkRevision;
      $superInfo = guardrailsEnv.JavaScriptCompiler.prototype.compilerInfo;
    });
    afterEach(function () {
      guardrailsEnv.VM.checkRevision = $superCheck;
      guardrailsEnv.JavaScriptCompiler.prototype.compilerInfo = $superInfo;
    });
    it('should allow compilerInfo override', function () {
      guardrailsEnv.JavaScriptCompiler.prototype.compilerInfo = function () {
        return 'crazy';
      };
      guardrailsEnv.VM.checkRevision = function (compilerInfo) {
        if (compilerInfo !== 'crazy') {
          throw new Error("It didn't work");
        }
      };
      expectTemplate('{{foo}} ')
        .withInput({ foo: 'food' })
        .toCompileTo('food ');
    });
  });
  describe('buffer', function () {
    var $superAppend, $superCreate;
    beforeEach(function () {
      guardrailsEnv.JavaScriptCompiler.prototype.forceBuffer = true;
      $superAppend = guardrailsEnv.JavaScriptCompiler.prototype.appendToBuffer;
      $superCreate =
        guardrailsEnv.JavaScriptCompiler.prototype.initializeBuffer;
    });
    afterEach(function () {
      guardrailsEnv.JavaScriptCompiler.prototype.forceBuffer = false;
      guardrailsEnv.JavaScriptCompiler.prototype.appendToBuffer = $superAppend;
      guardrailsEnv.JavaScriptCompiler.prototype.initializeBuffer =
        $superCreate;
    });

    it('should allow init buffer override', function () {
      guardrailsEnv.JavaScriptCompiler.prototype.initializeBuffer =
        function () {
          return this.quotedString('foo_');
        };
      expectTemplate('{{foo}} ')
        .withInput({ foo: 'food' })
        .toCompileTo('foo_food ');
    });
    it('should allow append buffer override', function () {
      guardrailsEnv.JavaScriptCompiler.prototype.appendToBuffer = function (
        string
      ) {
        return $superAppend.call(this, [string, ' + "_foo"']);
      };
      expectTemplate('{{foo}}')
        .withInput({ foo: 'food' })
        .toCompileTo('food_foo');
    });
  });

  describe('#isValidJavaScriptVariableName', function () {
    // It is there and accessible and could be used by someone. That's why we don't remove it
    // it 4.x. But if we keep it, we add a test
    // This test should not encourage you to use the function. It is not needed any more
    // and might be removed in 5.0
    ['test', 'abc123', 'abc_123'].forEach(function (validVariableName) {
      it("should return true for '" + validVariableName + "'", function () {
        expect(
          guardrailsEnv.JavaScriptCompiler.isValidJavaScriptVariableName(
            validVariableName
          )
        ).to.be.true();
      });
    });
    [('123test', 'abc()', 'abc.cde')].forEach(function (invalidVariableName) {
      it("should return true for '" + invalidVariableName + "'", function () {
        expect(
          guardrailsEnv.JavaScriptCompiler.isValidJavaScriptVariableName(
            invalidVariableName
          )
        ).to.be.false();
      });
    });
  });
});
