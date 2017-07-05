/*global unexpected:true, sinon, Promise:true*/
/* exported Promise, sinon */
unexpected = require('unexpected');
unexpected.output.preferredWidth = 80;
unexpected.installPlugin(require('./lib/unexpected-sinon'));
require('./test/monkeyPatchSinonStackFrames');
if (typeof Promise === 'undefined') {
    Promise = require('rsvp').Promise;
}
sinon = require('sinon');
