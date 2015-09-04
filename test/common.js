/*global sinon:true, unexpected:true, unexpectedSinon:true*/
sinon = require('sinon');
unexpected = require('unexpected').clone();
unexpectedSinon = require('../lib/unexpected-sinon');
unexpected.installPlugin(unexpectedSinon);

require('./monkeyPatchSinonStackFrames')(sinon);
