/* global expect:true, sinon:true */
/* exported Promise, sinon */
expect = require('unexpected').clone();
expect.use(require('./lib/unexpected-sinon'));
expect.output.preferredWidth = 80;

require('./test/monkeyPatchSinonStackFrames');
if (typeof Promise === 'undefined') {
  // eslint-disable-next-line no-global-assign
  Promise = require('rsvp').Promise;
}
sinon = require('sinon');
