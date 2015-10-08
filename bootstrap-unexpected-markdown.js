/*global unexpected:true, sinon:true*/
unexpected = require('unexpected');
unexpected.output.preferredWidth = 80;
sinon = require('sinon');
unexpected.installPlugin(require('./lib/unexpected-sinon'));
require('./test/monkeyPatchSinonStackFrames')(sinon);
