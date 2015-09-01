/*global sinon:true*/
var argv = require('minimist')(process.argv.slice(2));

sinon = require('sinon');
var unexpected = require('unexpected');
unexpected.installPlugin(require('./lib/unexpected-sinon'));
var generator = require('unexpected-documentation-site-generator');

require('./test/monkeyPatchSinonStackFrames')(sinon);

argv.unexpected = unexpected;
generator(argv);
