/*global unexpected:true, sinon, Promise:true*/
/* exported Promise, sinon */
unexpected = require('unexpected');
unexpected.output.preferredWidth = 80;
unexpected.installPlugin(require('./lib/unexpected-sinon'));
require('./test/monkeyPatchSinonStackFrames');
Promise = require('rsvp');
sinon = require('sinon');
