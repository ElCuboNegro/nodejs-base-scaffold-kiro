module.exports = {
  default: {
    require: [
      'tests/steps/**/*.js',
      'tests/support/world.js',
      'tests/support/hooks.js',
    ],
    parallel: 2,
    retry: 1,
    timeout: 30000,
    tags: 'not @skip',
    worldParameters: {
      testEnvironment: 'test',
      apiBaseUrl: 'http://localhost:5253',
      timeout: 30000,
    },
    publish: false,
  },
};
