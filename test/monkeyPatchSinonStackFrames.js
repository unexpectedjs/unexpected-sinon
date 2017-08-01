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

    var bogusStack =
        'Error\n' +
        'at theFunction (theFileName:xx:yy)\n' +
        'at theFunction (theFileName:xx:yy)\n' +
        'at theFunction (theFileName:xx:yy)';


    function patchCall(call) {
        if (call) {
            call.stack = bogusStack;
            if (call.errorWithCallStack) {
                call.errorWithCallStack = { stack: bogusStack };
            }
        }
        return call;
    }

    function patchSpy(spy) {
        var getCall = spy.getCall;
        spy.getCall = function () {
            var call = getCall.apply(spy, arguments);
            return patchCall(call);
        };
        var getCalls = spy.getCalls;
        spy.getCalls = function () {
            var calls = getCalls.apply(spy, arguments);
            return calls.map(patchCall, this);
        };
    }

    function replace(name, obj) {
        var orig = obj[name];
        obj[name] = function () { // ...
            var result = orig.apply(this, arguments);
            if (isSpy(result)) {
                patchSpy(result);
            }
            return result;
        };
        obj[name].create = orig.create;
    }

    ['spy', 'stub'].forEach(function (name) {
        replace(name, sinon);
        replace(name, sinon.sandbox);
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
