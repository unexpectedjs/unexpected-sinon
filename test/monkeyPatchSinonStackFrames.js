// Monkey-patch sinon.create to patch all created spyCall instances
// so that the top stack frame is a predictable string.
// Prevents every test from failing when the test suite is updated.

// Use an UMD wrapper so it can be used in both node.js and Phantom.JS
(function (root, factory) {
    if (typeof exports === 'object') {
        factory(require('sinon'));
    } else if (typeof define === 'function' && define.amd) {
        define(['sinon'], factory);
    } else {
        factory(root.sinon);
    }
}(this, function (sinon) {
    function isSpy(value) {
        return value && typeof value.id === 'string' &&
            /^spy#/.test(value.id);
    }

    function patchCall(call) {
        var getStackFrames = call && call.getStackFrames;
        if (getStackFrames) {
            call.getStackFrames = function () {
                return ['at theFunction (theFileName:xx:yy)'];
            };
        }
        return call;
    }

    function patchSpy(spy) {
        var getCall = spy.getCall;
        spy.getCall = function () {
            return patchCall(getCall.apply(spy, arguments));
        };
        var getCalls = spy.getCalls;
        spy.getCalls = function () {
            return getCalls.call(spy).map(patchCall);
        };
    }

    ['spy', 'stub'].forEach(function (name) {
        var orig = sinon[name];
        sinon[name] = function () { // ...
            var result = orig.apply(this, arguments);
            if (isSpy(result)) {
                patchSpy(result);
            }
            return result;
        };
        sinon[name].create = orig.create;
    });

    var origCreateStubInstance = sinon.createStubInstance;
    sinon.createStubInstance = function () { // ...
        var instance = origCreateStubInstance.apply(this, arguments);
        for (var propertyName in instance) {
            if (isSpy(instance[propertyName])) {
                patchSpy(instance[propertyName]);
            }
        }
        return instance;
    };
}));
