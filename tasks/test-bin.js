const childProcess = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const chai = require('chai');
chai.use(require('chai-diff'));
const expect = chai.expect;

const testCases = [
  {
    binInputParameters: ['-a', 'spec/artifacts/empty.guardrails'],
    outputLocation: 'stdout',
    expectedOutputSpec: './spec/expected/empty.amd.js',
  },
  {
    binInputParameters: [
      '-a',
      '-f',
      'TEST_OUTPUT',
      'spec/artifacts/empty.guardrails',
    ],
    outputLocation: 'TEST_OUTPUT',
    expectedOutputSpec: './spec/expected/empty.amd.js',
  },
  {
    binInputParameters: [
      '-a',
      '-n',
      'CustomNamespace.templates',
      'spec/artifacts/empty.guardrails',
    ],
    outputLocation: 'stdout',
    expectedOutputSpec: './spec/expected/empty.amd.namespace.js',
  },
  {
    binInputParameters: [
      '-a',
      '--namespace',
      'CustomNamespace.templates',
      'spec/artifacts/empty.guardrails',
    ],
    outputLocation: 'stdout',
    expectedOutputSpec: './spec/expected/empty.amd.namespace.js',
  },
  {
    binInputParameters: ['-a', '-s', 'spec/artifacts/empty.guardrails'],
    outputLocation: 'stdout',
    expectedOutputSpec: './spec/expected/empty.amd.simple.js',
  },
  {
    binInputParameters: ['-a', '-m', 'spec/artifacts/empty.guardrails'],
    outputLocation: 'stdout',
    expectedOutputSpec: './spec/expected/empty.amd.min.js',
  },
  {
    binInputParameters: [
      'spec/artifacts/known.helpers.guardrails',
      '-a',
      '-k',
      'someHelper',
      '-k',
      'anotherHelper',
      '-o',
    ],
    outputLocation: 'stdout',
    expectedOutputSpec: './spec/expected/non.empty.amd.known.helper.js',
  },
  {
    binInputParameters: ['--help'],
    outputLocation: 'stdout',
    expectedOutputSpec: './spec/expected/help.menu.txt',
  },
  {
    binInputParameters: ['-v'],
    outputLocation: 'stdout',
    expectedOutput: require('../package.json').version,
  },
  {
    binInputParameters: [
      '-a',
      '-e',
      'hbs',
      './spec/artifacts/non.default.extension.hbs',
    ],
    outputLocation: 'stdout',
    expectedOutputSpec: './spec/expected/non.default.extension.amd.js',
  },
  {
    binInputParameters: [
      '-a',
      '-p',
      './spec/artifacts/partial.template.guardrails',
    ],
    outputLocation: 'stdout',
    expectedOutputSpec: './spec/expected/partial.template.js',
  },
  {
    binInputParameters: ['spec/artifacts/empty.guardrails', '-c'],
    outputLocation: 'stdout',
    expectedOutputSpec: './spec/expected/empty.common.js',
  },
  {
    binInputParameters: [
      'spec/artifacts/empty.guardrails',
      'spec/artifacts/empty.guardrails',
      '-a',
      '-n',
      'someNameSpace',
    ],
    outputLocation: 'stdout',
    expectedOutputSpec: './spec/expected/namespace.amd.js',
  },
  {
    binInputParameters: [
      'spec/artifacts/empty.guardrails',
      '-h',
      'some-path/',
      '-a',
    ],
    outputLocation: 'stdout',
    expectedOutputSpec: './spec/expected/handlebar.path.amd.js',
  },
  {
    binInputParameters: [
      'spec/artifacts/partial.template.guardrails',
      '-r',
      'spec',
      '-a',
    ],
    outputLocation: 'stdout',
    expectedOutputSpec: './spec/expected/empty.root.amd.js',
  },
  {
    binInputParameters: [
      '-i',
      '<div>1</div>',
      '-i',
      '<div>2</div>',
      '-N',
      'firstTemplate',
      '-N',
      'secondTemplate',
      '-a',
    ],
    outputLocation: 'stdout',
    expectedOutputSpec: './spec/expected/empty.name.amd.js',
  },
  {
    binInputParameters: [
      '-i',
      '<div>1</div>',
      '-a',
      '-m',
      '-N',
      'test',
      '--map',
      './spec/tmp/source.map.amd.txt',
    ],
    outputLocation: 'stdout',
    expectedOutputSpec: './spec/expected/source.map.amd.js',
  },
  {
    binInputParameters: ['./spec/artifacts/bom.guardrails', '-b', '-a'],
    outputLocation: 'stdout',
    expectedOutputSpec: './spec/expected/bom.amd.js',
  },
  // Issue #1673
  {
    binInputParameters: [
      '--amd',
      '--no-amd',
      'spec/artifacts/empty.guardrails',
    ],
    outputLocation: 'stdout',
    expectedOutputSpec: './spec/expected/empty.common.js',
  },
];

module.exports = function (grunt) {
  grunt.registerTask('test:bin', function () {
    testCases.forEach(
      ({
        binInputParameters,
        outputLocation,
        expectedOutputSpec,
        expectedOutput,
      }) => {
        const stdout = executeBinGuardrails(...binInputParameters);

        if (!expectedOutput && expectedOutputSpec) {
          expectedOutput = fs.readFileSync(expectedOutputSpec, 'utf-8');
        }

        const useStdout = outputLocation === 'stdout';
        const normalizedOutput = normalizeCrlf(
          useStdout ? stdout : fs.readFileSync(outputLocation, 'utf-8')
        );
        const normalizedExpectedOutput = normalizeCrlf(expectedOutput);

        if (!useStdout) {
          fs.unlinkSync(outputLocation);
        }

        expect(normalizedOutput).not.to.be.differentFrom(
          normalizedExpectedOutput,
          {
            relaxedSpace: true,
          }
        );
      }
    );
  });
};

// helper functions

function executeBinGuardrails(...args) {
  if (os.platform() === 'win32') {
    // On Windows, the executable guardrails.js file cannot be run directly
    const nodeJs = process.argv[0];
    return execFilesSyncUtf8(nodeJs, ['./bin/guardrails.js'].concat(args));
  }
  return execFilesSyncUtf8('./bin/guardrails.js', args);
}

function execFilesSyncUtf8(command, args) {
  const env = process.env;
  env.PATH = addPathToNodeJs(env.PATH);
  return childProcess.execFileSync(command, args, { encoding: 'utf-8', env });
}

function addPathToNodeJs(pathEnvironment) {
  return path.dirname(process.argv0) + path.delimiter + pathEnvironment;
}

function normalizeCrlf(string) {
  if (typeof string === 'string') {
    return string.replace(/\r\n/g, '\n');
  }
  return string.trim();
}
