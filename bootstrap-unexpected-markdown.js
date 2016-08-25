/*global unexpected:true, sinon:true, Promise:true*/
/* exported Promise */
unexpected = require('unexpected');
unexpected.output.preferredWidth = 80;
sinon = require('sinon');
unexpected.installPlugin(require('./lib/unexpected-sinon'));
require('./test/monkeyPatchSinonStackFrames')(sinon);
Promise = require('rsvp');
