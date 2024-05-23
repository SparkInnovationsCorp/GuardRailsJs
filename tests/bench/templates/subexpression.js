module.exports = {
  helpers: {
    echo: function (value) {
      return 'foo ' + value;
    },
    header: function () {
      return 'Colors';
    },
  },
  guardrails: '{{echo (header)}}',
};

module.exports.context = module.exports.helpers;
