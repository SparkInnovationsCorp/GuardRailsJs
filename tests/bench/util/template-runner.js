var _ = require('underscore'),
  BenchWarmer = require('./benchwarmer'),
  templates = require('../templates');

module.exports = function (grunt, makeSuite, callback) {
  var warmer = new BenchWarmer();

  var guardrailsOnly = grunt.option('guardrails-only'),
    grep = grunt.option('grep');
  if (grep) {
    grep = new RegExp(grep);
  }

  _.each(templates, function (template, name) {
    if (!template.guardrails || (grep && !grep.test(name))) {
      return;
    }

    warmer.suite(name, function (bench) {
      makeSuite(bench, name, template, guardrailsOnly);
    });
  });

  warmer.bench(function () {
    if (callback) {
      callback(warmer.times, warmer.scaled);
    }
  });
};
