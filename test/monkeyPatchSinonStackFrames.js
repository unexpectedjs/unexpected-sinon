/* global define */
// Monkey-patch sinon.create to patch all created spyCall instances
// so that the top stack frame is a predictable string.
// Prevents every test from failing when the test suite is updated.

// Use an UMD wrapper so it can be used in both node.js and Phantom.JS
((root, factory) => {
  if (typeof exports === 'object') {
    factory(require('sinon'));
  } else if (typeof define === 'function' && define.amd) {
    define(['sinon'], factory);
  } else {
    factory(root.sinon);
  }
})(this, sinon => {
  function isSpy(value) {
    return (
      value &&
      typeof value.id === 'string' &&
      /^(?:spy|stub|fake)#/.test(value.id)
    );
  }

  const bogusStack =
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
    const getCall = spy.getCall;
    spy.getCall = function() {
      const call = getCall.apply(spy, arguments);
      return patchCall(call);
    };
    const getCalls = spy.getCalls;
    spy.getCalls = function() {
      const calls = getCalls.apply(spy, arguments);
      return calls.map(patchCall, this);
    };
  }

  function replace(name, obj) {
    const orig = obj[name];
    obj[name] = function() {
      // ...
      const result = orig.apply(this, arguments);
      if (isSpy(result)) {
        patchSpy(result);
      }
      return result;
    };
    obj[name].create = orig.create;
  }
  ['spy', 'stub'].forEach(name => {
    replace(name, sinon);
  });

  if (sinon.sandbox.create) {
    const originalSandboxCreate = sinon.sandbox.create;
    sinon.sandbox.create = function() {
      const sandbox = originalSandboxCreate.apply(this, arguments);
      replace('spy', sandbox);
      replace('stub', sandbox);
      return sandbox;
    };
  }

  if (sinon.createSandbox) {
    const originalCreateSandbox = sinon.createSandbox;
    sinon.createSandbox = function() {
      const sandbox = originalCreateSandbox.apply(this, arguments);
      replace('spy', sandbox);
      replace('stub', sandbox);
      return sandbox;
    };
  }

  const origCreateStubInstance = sinon.createStubInstance;
  sinon.createStubInstance = function() {
    // ...
    const instance = origCreateStubInstance.apply(this, arguments);
    for (const propertyName in instance) {
      if (isSpy(instance[propertyName])) {
        patchSpy(instance[propertyName]);
      }
    }
    return instance;
  };
});
