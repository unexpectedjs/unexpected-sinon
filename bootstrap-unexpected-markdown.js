/* global unexpected:true, sinon:true */
/* exported Promise, sinon */
unexpected = require('unexpected')
  .clone()
  .use(require('./lib/unexpected-sinon'));
unexpected.output.preferredWidth = 80;

require('./test/monkeyPatchSinonStackFrames');
if (typeof Promise === 'undefined') {
  // eslint-disable-next-line no-global-assign
  Promise = require('rsvp').Promise;
}
sinon = require('sinon');
