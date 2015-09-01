// Monkey-patch sinon.create to patch all created spyCall instances
// so that the top stack frame is a predictable string.
// Prevents every test from failing when the test suite is updated.
module.exports = function (sinon) {
    var sinonCreate = sinon.create;
    sinon.create = function (arg) {
        var getStackFrames = arg.getStackFrames;
        if (getStackFrames) {
            arg.getStackFrames = function () {
                var stackFrames = getStackFrames.call(this);
                stackFrames[0] = 'at theFunction (theFileName:xx:yy)';
                return stackFrames;
            };
        }
        return sinonCreate.call(this, arg);
    };
};
