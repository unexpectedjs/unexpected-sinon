module.exports = function (config) {
  config.set({
    frameworks: ['mocha'],

    files: [
      './node_modules/unexpected/unexpected.js',
      './node_modules/sinon/pkg/sinon.js',
      './lib/unexpected-sinon.js',
      './test/common/browser.js',
      './test/monkeyPatchSinonStackFrames.js',
      './test/unexpected-sinon.spec.js',
    ],

    client: {
      mocha: {
        reporter: 'html',
        timeout: 60000,
      },
    },

    browserStack: {
      // Attempt to fix timeouts on CI:
      // https://github.com/karma-runner/karma-browserstack-launcher/pull/168#issuecomment-582373514
      timeout: 1800,
    },

    browsers: ['ChromeHeadless', 'ie11'],

    customLaunchers: {
      ie11: {
        base: 'BrowserStack',
        browser: 'IE',
        browser_version: '11',
        os: 'Windows',
        os_version: '7',
      },
    },

    reporters: ['dots', 'BrowserStack'],
  });
};
