var _ = require('underscore'),
  templates = require('./templates');

module.exports = function (grunt, callback) {
  // Deferring to here in case we have a build for parser, etc as part of this grunt exec
  var Guardrails = require('../../lib');

  var templateSizes = {};
  _.each(templates, function (info, template) {
    var src = info.guardrails,
      compiled = Guardrails.precompile(src, {}),
      knownHelpers = Guardrails.precompile(src, {
        knownHelpersOnly: true,
        knownHelpers: info.helpers,
      });

    templateSizes[template] = compiled.length;
    templateSizes['knownOnly_' + template] = knownHelpers.length;
  });
  grunt.log.writeln(
    'Precompiled sizes: ' + JSON.stringify(templateSizes, undefined, 2)
  );
  callback([templateSizes]);
};
