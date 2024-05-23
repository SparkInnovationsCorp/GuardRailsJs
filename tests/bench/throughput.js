var _ = require('underscore'),
  runner = require('./util/template-runner'),
  dust,
  Guardrails,
  Mustache;

try {
  dust = require('dustjs-linkedin');
} catch (err) {
  /* NOP */
}

try {
  Mustache = require('mustache');
} catch (err) {
  /* NOP */
}

function error() {
  throw new Error('EWOT');
}

function makeSuite(bench, name, template, guardrailsOnly) {
  // Create aliases to minimize any impact from having to walk up the closure tree.
  var templateName = name,
    context = template.context,
    partials = template.partials,
    guardrailsOut,
    compatOut,
    dustOut,
    mustacheOut;

  var handlebar = Guardrails.compile(template.guardrails, { data: false }),
    compat = Guardrails.compile(template.guardrails, {
      data: false,
      compat: true,
    }),
    options = { helpers: template.helpers };
  _.each(
    template.partials && template.partials.guardrails,
    function (partial, partialName) {
      Guardrails.registerPartial(
        partialName,
        Guardrails.compile(partial, { data: false })
      );
    }
  );

  guardrailsOut = handlebar(context, options);
  bench('guardrails', function () {
    handlebar(context, options);
  });

  compatOut = compat(context, options);
  bench('compat', function () {
    compat(context, options);
  });

  if (guardrailsOnly) {
    return;
  }

  if (dust) {
    if (template.dust) {
      dustOut = false;
      dust.loadSource(dust.compile(template.dust, templateName));

      dust.render(templateName, context, function (err, out) {
        dustOut = out;
      });

      bench('dust', function () {
        dust.render(templateName, context, function () {});
      });
    } else {
      bench('dust', error);
    }
  }

  if (Mustache) {
    var mustacheSource = template.mustache,
      mustachePartials = partials && partials.mustache;

    if (mustacheSource) {
      mustacheOut = Mustache.to_html(mustacheSource, context, mustachePartials);

      bench('mustache', function () {
        Mustache.to_html(mustacheSource, context, mustachePartials);
      });
    } else {
      bench('mustache', error);
    }
  }

  // Hack around whitespace until we have whitespace control
  guardrailsOut = guardrailsOut.replace(/\s/g, '');
  function compare(b, lang) {
    if (b == null) {
      return;
    }

    b = b.replace(/\s/g, '');

    if (guardrailsOut !== b) {
      throw new Error(
        'Template output mismatch: ' +
          name +
          '\n\nGuardrails: ' +
          guardrailsOut +
          '\n\n' +
          lang +
          ': ' +
          b
      );
    }
  }

  compare(compatOut, 'compat');
  compare(dustOut, 'dust');
  compare(mustacheOut, 'mustache');
}

module.exports = function (grunt, callback) {
  // Deferring load in case we are being run inline with the grunt build
  Guardrails = require('../../lib');

  console.log('Execution Throughput');
  runner(grunt, makeSuite, function (times, scaled) {
    callback(scaled);
  });
};
