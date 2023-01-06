module.exports = {
  files: ['src/**/*.test.{t,j}s', 'src/*.test.{t,j}s'],
  concurrency: 1,
  failFast: true,
  failWithoutAssertions: false,
  verbose: true,
  extensions: {
    ts: 'module',
    js: true,
  },
  nodeArguments: [
    '--loader=ts-node/esm',
    '--experimental-specifier-resolution=node',
  ],
  timeout: '1m',
};
