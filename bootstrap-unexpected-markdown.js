/*global unexpected:true, Promise:true*/
/* exported Promise */
unexpected = require('unexpected');
unexpected.output.preferredWidth = 80;
unexpected.installPlugin(require('./lib/unexpected-sinon'));
require('./test/monkeyPatchSinonStackFrames');
Promise = require('rsvp');
