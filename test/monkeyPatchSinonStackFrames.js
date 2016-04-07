// Monkey-patch sinon.create to patch all created spyCall instances
// so that the top stack frame is a predictable string.
// Prevents every test from failing when the test suite is updated.
module.exports = function (sinon) {
    // Copied from test/monkeyPatchSinonStackFrames.js
    function patchCall(call) {
        var getStackFrames = call && call.getStackFrames;
        if (getStackFrames) {
            call.getStackFrames = function () {
                var stackFrames = getStackFrames.call(this);
                stackFrames[0] = 'at theFunction (theFileName:xx:yy)';
                return stackFrames;
            };
        }
        return call;
    }

    ['spy', 'stub'].forEach(function (name) {
        var orig = sinon[name];
        sinon[name] = function () {
            var result = orig.apply(this, arguments);
            var getCall = result.getCall;
            result.getCall = function () {
                return patchCall(getCall.apply(result, arguments));
            };
            var getCalls = result.getCalls;
            result.getCalls = function () {
                return getCalls.call(result).map(patchCall);
            };
            return result;
        };
    });
};
