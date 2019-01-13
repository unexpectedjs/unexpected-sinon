var puppeteer = require('puppeteer');
process.env.CHROME_BIN = puppeteer.executablePath();

module.exports = function(config) {
  config.set({
    frameworks: ['mocha'],

    files: [
      './node_modules/unexpected/unexpected.js',
      './node_modules/sinon/pkg/sinon.js',
      './lib/unexpected-sinon.js',
      './test/common/browser.js',
      './test/monkeyPatchSinonStackFrames.js',
      './test/unexpected-sinon.spec.js'
    ],

    client: {
      mocha: {
        reporter: 'html',
        timeout: 60000
      }
    },

    browsers: ['ChromeHeadless']
  });
};
