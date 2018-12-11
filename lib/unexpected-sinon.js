/*global location, define*/
// Copyright (c) 2013 Sune Simonsen <sune@we-knowhow.dk>
//
// Permission is hereby granted, free of charge, to any person
// obtaining a copy of this software and associated documentation
// files (the 'Software'), to deal in the Software without
// restriction, including without limitation the rights to use, copy,
// modify, merge, publish, distribute, sublicense, and/or sell copies
// of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
// BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
// ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

((root, factory) => {
  if (typeof exports === 'object') {
    module.exports = factory(require('sinon'));
  } else if (typeof define === 'function' && define.amd) {
    define(['sinon'], factory);
  } else {
    root.weknowhow = root.weknowhow || {};
    root.weknowhow.unexpectedSinon = factory(root.sinon);
  }
})(this, sinon => {
  function isRegExp(re) {
    return Object.prototype.toString.call(re) === '[object RegExp]';
  }

  // Returns true for spies, mocks and stubs
  function isSpy(value) {
    return (
      value &&
      typeof value.id === 'string' &&
      /^(?:spy|stub|fake)#/.test(value.id)
    );
  }

  function isStub(value) {
    return isSpy(value) && typeof value.onCall === 'function';
  }

  function isSandbox(obj) {
    return (
      obj &&
      typeof obj === 'object' &&
      typeof obj.useFakeTimers === 'function' &&
      typeof obj.restore === 'function'
    );
  }

  function isSpyCall(value) {
    return value && isSpy(value.proxy);
  }

  function isSpyCalls(value) {
    return Array.isArray(value) && (isSpyCall(value[0]) || value._isSpyCalls);
  }

  function toSpyCalls(value) {
    value = [].concat(value);
    value._isSpyCalls = true;
    return value;
  }

  function toSpyArguments(args) {
    args = [].concat(args);
    args._isSpyArguments = true;
    return args;
  }

  function getCalls(spy) {
    return spy.getCalls();
  }

  function escapeRegExpMetaChars(str) {
    return str.replace(/[$.^()[\]{}]/g, '\\$&');
  }

  function isNonEmptyAndHasOnlyNumericalProperties(obj) {
    const keys = Object.keys(obj);
    return keys.length > 0 &&
    keys.every(key => /^[1-9]*[0-9]+$/.test(key));
  }

  let cwdOrLocationRegExp;
  if (typeof location === 'object' && typeof location.href === 'string') {
    cwdOrLocationRegExp = new RegExp(
      escapeRegExpMetaChars(
        location.href.replace(/[^/]+(?:\?[^#]*)?(?:#.*)?$/, '') + '/'
      )
    );
  } else if (
    typeof require === 'function' &&
    typeof module === 'object' &&
    typeof module.exports === 'object' &&
    typeof process === 'object'
  ) {
    cwdOrLocationRegExp = new RegExp(
      escapeRegExpMetaChars(process.cwd() + '/')
    );
  }

  function makePathsRelativeToCwdOrLocation(str) {
    if (cwdOrLocationRegExp) {
      return str.replace(cwdOrLocationRegExp, '');
    } else {
      return str;
    }
  }

  function recordSpyCalls(spies, fn) {
    const originalValues = spies.map(spy => {
      const originalValue = {
        func: spy.func
      };
      // Temporarily override the body of the spied-on function, if any.
      // This prevents spies with side effects from breaking while
      // the expected calls are being recorded:
      spy.func = () => {
        const onCall = spy.onCall && spy.onCall(spy.behaviors.length);
        return onCall;
      };
      for (const propertyName in spy) {
        if (
          spy.hasOwnProperty(propertyName) &&
          propertyName !== 'behaviors' &&
          typeof spy[propertyName] !== 'function'
        ) {
          if (Array.isArray(spy[propertyName])) {
            originalValue[propertyName] = [].concat(spy[propertyName]);
          } else {
            originalValue[propertyName] = spy[propertyName];
          }
        }
      }
      return originalValue;
    });
    fn();
    const expectedSpyCallSpecs = [];
    spies.forEach((spy, i) => {
      const originalValue = originalValues[i];
      for (let j = originalValue.args.length; j < spy.args.length; j += 1) {
        const thisValue = spy.thisValues[j];
        let calledWithNew = false;
        try {
          // Can throw "Function has non-object prototype 'undefined' in instanceof check"
          // when spying on eg. console.log
          calledWithNew = thisValue instanceof spy;
        } catch (e) {}
        const call = spy.getCall(j);
        if (call.stack) {
          call.stack = null;
        }
        if (call.errorWithCallStack) {
          call.errorWithCallStack.stack = null;
        }
        const expectedSpyCallSpec = {
          proxy: spy,
          call,
          args: spy.args[j],
          callId: spy.callIds[j],
          calledWithNew
        };
        expectedSpyCallSpec.call.getStackFrames = false;
        expectedSpyCallSpecs.push(expectedSpyCallSpec);
      }
      for (const propertyName in originalValue) {
        spy[propertyName] = originalValue[propertyName];
      }
    });
    expectedSpyCallSpecs.sort((a, b) => a.callId - b.callId);

    return expectedSpyCallSpecs;
  }

  function getCallTimeLineFromSpies(spies) {
    // Get a flattened array of all calls to all the specified spies:
    return Array.prototype.concat
      .apply([], spies.map(getCalls))
      .sort((a, b) => a.callId - b.callId);
  }

  function extractSpies(obj) {
    let spies;
    if (isSandbox(obj)) {
      if (obj.getFakes) {
        spies = obj.getFakes();
      } else {
        spies = obj.fakes || [];
      }
    } else if (Array.isArray(obj)) {
      spies = [];
      obj.forEach(item => {
        Array.prototype.push.apply(spies, extractSpies(item));
      });
    } else if (obj && typeof obj === 'object') {
      spies = [];
      for (const propertyName in obj) {
        if (isSpy(obj[propertyName])) {
          spies.push(obj[propertyName]);
        }
      }
    } else {
      // Assume spy
      spies = [obj];
    }
    return spies;
  }

  return {
    name: 'unexpected-sinon',
    installInto(expect) {
      expect.addType({
        name: 'spyCallArguments',
        base: 'array-like',
        identify(value) {
          return value && value._isSpyArguments;
        },
        prefix(output, value) {
          return output.text('(');
        },
        suffix(output) {
          return output.text(');');
        }
      });

      expect.addType({
        name: 'sinonSandbox',
        base: 'object',
        identify: isSandbox,
        inspect(value, depth, output, inspect) {
          output.jsFunctionName('sinon sandbox');
        }
      });

      expect.addType({
        name: 'sinonStubInstance',
        base: 'object',
        identify(value) {
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            const keys = Object.keys(value);
            return keys.length > 0 &&
            keys.every(key => isStub(value[key]));
          }
        },
        inspect(value, depth, output, inspect) {
          const spies = extractSpies(value);
          const constructor = value.constructor;
          const constructorDisplayName =
            constructor && constructor !== Object && constructor.name;
          if (constructorDisplayName) {
            output.jsFunctionName(constructor.name).text('(');
          }
          output.text('{ ');
          let width = 0;
          for (let i = 0; i < spies.length; i += 1) {
            const spy = spies[i];
            const itemWidth =
              (i > 0 ? 2 : 0) + (spy.displayName ? spy.displayName.length : 4);
            if (width + itemWidth < output.preferredWidth - 40) {
              if (i > 0) {
                output.text(',').sp();
              }
              output.appendInspected(spy);
              width += itemWidth;
            } else {
              output.sp().jsComment('/* ' + (spies.length - i) + ' more */');
              break;
            }
          }
          output.text(' }');
          if (constructorDisplayName) {
            output.text(')');
          }
        }
      });

      expect.addType({
        name: 'spyCall',
        base: 'object',
        identify: isSpyCall,
        prefix(output, value) {
          if (value.proxy.prototype && value.thisValue instanceof value.proxy) {
            output.jsKeyword('new').sp();
          }
          return output.appendInspected(value.proxy);
        },
        suffix(output, value) {
          const stackFrames = value.stack && value.stack.split('\n').slice(3);
          if (Array.isArray(stackFrames) && stackFrames.length > 0) {
            output
              .sp()
              .jsComment(
                'at ' +
                  makePathsRelativeToCwdOrLocation(
                    stackFrames[0].replace(/^\s*(?:at\s+|@)?/, '')
                  )
              );
          }
          return output;
        },
        inspect(value, depth, output, inspect) {
          this.prefix(output, value);
          output.append(inspect(toSpyArguments(value.args), depth + 1));
          this.suffix(output, value);
        },
        equal(actual, expected, equal) {
          return equal(actual.args, expected.args);
        },
        diff(actual, expected, output, diff, inspect) {
          const comparison = diff(
            toSpyArguments(actual.args),
            toSpyArguments(expected.args)
          );
          this.prefix(output, actual);
          output.append(comparison.diff);
          this.suffix(output, actual);
          comparison.diff = output;
          return comparison;
        }
      });

      expect.addType({
        name: 'spyCalls',
        base: 'array-like',
        prefix(output) {
          return output;
        },
        suffix(output) {
          return output;
        },
        delimiter(output) {
          return output;
        },
        identify: isSpyCalls,
        similar(a, b) {
          const baseType = this.baseType.baseType;
          return a &&
          b &&
          a.args &&
          b.args &&
          a.args.length === b.args.length &&
          a.args.every((aItem, index) => baseType.similar(aItem, b.args[index]));
        },
        indent: false,
        forceMultipleLines: true,
        inspect(spyCalls, depth, output, inspect) {
          output.block(output => {
            output.appendItems(spyCalls, '\n');
          });
        }
      });

      expect.addType({
        name: 'spy',
        base: 'function',
        identify: isSpy,
        inspect(value, depth, output) {
          const idNum = parseInt(value.id.replace(/^[^#]+#/, ''), 10);
          const label =
            value.displayName +
            (/^(?:spy|stub|fake)$/.test(value.displayName) ? idNum : '');
          if (output.colorByIndex) {
            output.colorByIndex(label, idNum);
          } else {
            output.text(label);
          }
        }
      });

      expect.addAssertion('<spy> was called', (expect, subject) => {
        expect(getCalls(subject), 'not to satisfy', []);
      });

      expect.addAssertion('<spy> was not called', (expect, subject) => {
        expect.errorMode = 'defaultOrNested';
        expect(getCalls(subject), 'to satisfy', []);
      });

      expect.addAssertion('<spyCall> to [exhaustively] satisfy <any>', (expect, subject, value) => {
        const subjectType = expect.findTypeOf(subject);
        const spyArguments = toSpyArguments(subject.args);

        if (value && isSpy(value)) {
          value = { spy: value };
        } else if (
          Array.isArray(value) ||
          isNonEmptyAndHasOnlyNumericalProperties(value)
        ) {
          value = { args: value };
        }
        const unsupportedKeys = Object.keys(value).filter(key => [
          'spy',
          'proxy',
          'args',
          'returnValue',
          'returned',
          'exception',
          'threw',
          'this',
          'thisValue',
          'stack',
          'calledWithNew'
        ].indexOf(key) === -1);
        if (unsupportedKeys.length > 0) {
          throw new Error(
            'spyCall to satisfy: Unsupported keys: ' +
              unsupportedKeys.join(', ')
          );
        }

        const expectedSpy = value.proxy || value.spy;
        const promiseByKey = {
          spy: expect.promise(() => {
            if (expectedSpy) {
              return expect(subject.proxy, 'to be', expectedSpy);
            }
          }),
          calledWithNew: expect.promise(() => {
            if (typeof value.calledWithNew !== 'undefined') {
              let calledWithNew = false;
              try {
                // Can throw "Function has non-object prototype 'undefined' in instanceof check"
                // when spying on eg. console.log
                calledWithNew = subject.thisValue instanceof subject.proxy;
              } catch (e) {}
              return expect(calledWithNew, 'to satisfy', value.calledWithNew);
            }
          }),
          args: expect.promise(() => {
            if (typeof value.args !== 'undefined') {
              if (
                !Array.isArray(value.args) &&
                !isNonEmptyAndHasOnlyNumericalProperties(value.args)
              ) {
                expect.errorMode = 'bubbleThrough';
                expect.fail({
                  output() {
                    this.error(
                      'unsupported value in spy call spec: '
                    ).appendInspected(value.args);
                  },
                  errorMode: 'bubbleThrough'
                });
              }
              return expect(
                spyArguments,
                'to [exhaustively] satisfy',
                value.args
              );
            }
          }),
          threw: expect.promise(() => {
            if (value.hasOwnProperty('threw')) {
              return expect(subject.exception, 'to satisfy', value.threw);
            } else if (value.hasOwnProperty('exception')) {
              return expect(subject.exception, 'to satisfy', value.exception);
            }
          }),
          returned: expect.promise(() => {
            if (value.hasOwnProperty('returned')) {
              return expect(subject.returnValue, 'to satisfy', value.returned);
            } else if (value.hasOwnProperty('returnValue')) {
              return expect(
                subject.returnValue,
                'to satisfy',
                value.returnValue
              );
            }
          }),
          this: expect.promise(() => {
            if (value.hasOwnProperty('this')) {
              return expect(subject.thisValue, 'to satisfy', value.this);
            } else if (value.hasOwnProperty('thisValue')) {
              return expect(subject.thisValue, 'to satisfy', value.thisValue);
            }
          }),
          stack: expect.promise(() => {
            if (value.stack) {
              expect(subject.stack, 'to satisfy', value.stack);
            }
          })
        };

        return expect.promise.all(promiseByKey).caught(err => expect.promise.settle(promiseByKey).then(() => {
          err = err.getAllErrors().pop();
          if (err && err.errorMode === 'bubbleThrough') {
            expect.fail(err);
          }
          expect.fail({
            diff(output) {
              subjectType.prefix(output, subject);
              const comparison = {};
              const argsDiff =
                promiseByKey.args &&
                promiseByKey.args.isRejected() &&
                promiseByKey.args.reason().getDiff(output);
              const isMatchingSpy =
                !promiseByKey.spy || promiseByKey.spy.isFulfilled();
              if (argsDiff && isMatchingSpy) {
                output.append(argsDiff.diff);
              } else {
                output.appendInspected(toSpyArguments(subject.args));
              }
              subjectType.suffix(output, subject);

              const keysWithError = {};
              Object.keys(promiseByKey).forEach(key => {
                if (
                  (key !== 'args' || !isMatchingSpy) &&
                  promiseByKey[key].isRejected()
                ) {
                  keysWithError[key] = promiseByKey[key].reason();
                }
              });

              const numKeysWithError = Object.keys(keysWithError).length;
              if (
                (numKeysWithError === 1 && keysWithError.spy) ||
                (numKeysWithError === 2 &&
                  keysWithError.spy &&
                  keysWithError.args)
              ) {
                output.sp().annotationBlock(function() {
                  this.error('should be')
                    .sp()
                    .appendInspected(expectedSpy);
                  if (value.args) {
                    this.appendInspected(toSpyArguments(value.args));
                  }
                });
              } else if (numKeysWithError > 0) {
                const annotation = output
                  .clone()
                  .annotationBlock(output => {
                    Object.keys(keysWithError).forEach((key, i) => {
                      const error = keysWithError[key];
                      error.errorMode = 'bubble';
                      output
                        .nl(i > 0 ? 2 : 0)
                        .error(key + ': ')
                        .block(output => {
                          output.appendErrorMessage(error);
                        });
                    });
                  });
                if (
                  output.preferredWidth <
                  output.size().width + annotation.size().width
                ) {
                  output
                    .nl()
                    .indentLines()
                    .i()
                    .append(annotation);
                } else {
                  output.sp().append(annotation);
                }
              }

              comparison.inline = true;
              comparison.diff = output;
              return comparison;
            }
          });
        }));
      });

      expect.addAssertion('<spyCall> threw <any?>', function(
        expect,
        subject,
        value
      ) {
        const error = subject.exception;
        if (arguments.length === 2) {
          expect(error, 'to be truthy');
        } else {
          expect.errorMode = 'nested';
          if (
            error &&
            error._isUnexpected &&
            (typeof value === 'string' || isRegExp(value))
          ) {
            return expect(error.output.toString(), 'to satisfy', value);
          } else {
            return expect.withError(
              () => expect(error, 'to satisfy', value),
              e => {
                expect.errorMode = 'bubble';
                const hasDiff = e.getDiffMethod();
                if (hasDiff) {
                  expect.fail(output => {
                    output.append(e.getErrorMessage(output));
                  });
                } else {
                  expect.fail(e);
                }
              }
            );
          }
        }
      });

      expect.addAssertion('<spyCall> was called on <any>', (expect, subject, target) => {
        expect.errorMode = 'defaultOrNested';
        if (subject.thisValue !== target) {
          expect.fail(
            'expected {0} to be called with {1} as this but was called with {2}',
            subject.proxy,
            target,
            subject.thisValue
          );
        }
      });

      expect.addAssertion(
        '<spy|array|sinonSandbox|sinonStubInstance> to have calls [exhaustively] satisfying <function>',
        (expect, subject, value) => {
          const spies = extractSpies(subject);
          const expectedSpyCallSpecs = recordSpyCalls(spies, value);
          const expectedSpyCalls = [];
          expectedSpyCallSpecs.forEach(expectedSpyCallSpec => {
            expectedSpyCalls.push(expectedSpyCallSpec.call);
            delete expectedSpyCallSpec.call;
            delete expectedSpyCallSpec.callId;
          });
          expect.argsOutput[0] = output => {
            output.appendInspected(expectedSpyCalls);
          };
          return expect(
            subject,
            'to have calls [exhaustively] satisfying',
            expectedSpyCallSpecs
          );
        }
      );

      expect.addAssertion(
        '<spy|array|sinonSandbox|sinonStubInstance> to have calls [exhaustively] satisfying <array|object>',
        (expect, subject, value) => {
          const spies = extractSpies(subject);
          const spyCalls = [];
          const isSeenBySpyId = {};
          spies.forEach(spy => {
            if (!isSeenBySpyId[spy.id]) {
              Array.prototype.push.apply(spyCalls, spy.getCalls());
              isSeenBySpyId[spy.id] = true;
            }
          });
          spyCalls.sort((a, b) => a.callId - b.callId);

          const seenSpies = [];
          function wrapSpyInObject(obj) {
            if (isSpy(obj)) {
              seenSpies.push(obj);
              return { spy: obj };
            } else if (
              Array.isArray(obj) ||
              (obj &&
                typeof obj === 'object' &&
                isNonEmptyAndHasOnlyNumericalProperties(obj))
            ) {
              return { args: obj };
            } else if (obj && typeof obj === 'object') {
              if (isSpy(obj.spy)) {
                seenSpies.push(obj.spy);
              }
              return obj;
            } else {
              expect.errorMode = 'nested';
              expect.fail(function() {
                this.error(
                  'unsupported value in spy call spec: '
                ).appendInspected(obj);
              });
            }
          }

          // Make sure that the array-like to satisfy implementation supports the <spy> => { spy: <spy> } shorthand:
          if (Array.isArray(value)) {
            value = value.map(wrapSpyInObject);
          } else if (value && typeof value === 'object') {
            value = Object.keys(value).reduce((result, key) => {
              result[key] = wrapSpyInObject(value[key]);
              return result;
            }, {});
          }

          expect.errorMode = 'nested';
          seenSpies.forEach(seenSpy => {
            expect(spies, 'to contain', seenSpy);
          });
          expect.errorMode = 'default';

          return expect(
            toSpyCalls(spyCalls),
            'to [exhaustively] satisfy',
            value
          );
        }
      );

      expect.addAssertion('<spy> was called once', (expect, subject) => {
        const calls = getCalls(subject);
        expect.errorMode = calls.length > 0 ? 'nested' : 'default';
        expect(calls, 'to have length', 1);
      });

      expect.addAssertion('<spy> was called twice', (expect, subject) => {
        const calls = getCalls(subject);
        expect.errorMode = calls.length > 0 ? 'nested' : 'default';
        expect(calls, 'to have length', 2);
      });

      expect.addAssertion('<spy> was called thrice', (expect, subject) => {
        const calls = getCalls(subject);
        expect.errorMode = calls.length > 0 ? 'nested' : 'default';
        expect(calls, 'to have length', 3);
      });

      expect.addAssertion('<spy> was called times <number>', (expect, subject, times) => {
        const calls = getCalls(subject);
        expect.errorMode = calls.length > 0 ? 'nested' : 'default';
        expect(calls, 'to have length', times);
      });

      expect.addAssertion('<spy> was called with new', (expect, subject) => {
        expect(subject.calledWithNew(), 'to be truthy');
      });

      expect.addAssertion('<array> given call order', (expect, subject) => expect(subject, 'to have calls satisfying', subject));

      expect.addAssertion('<spy> was [always] called on <any>', (expect, subject, target) => {
        expect.errorMode = 'defaultOrNested';

        const calls = getCalls(subject);
        if (calls.length === 0) {
          expect.fail('spy was never called');
        }

        if (expect.flags.always) {
          return expect(
            calls,
            'to have items satisfying was called on',
            target
          );
        } else {
          const promises = calls.map(call => expect.promise(() => expect(call, 'was called on', target)));
          return expect.promise.settle(promises).then(() => {
            const failed = promises.every(promise => promise.isRejected());

            if (failed) {
              return expect(
                calls,
                'to have items satisfying was called on',
                target
              );
            }
          });
        }
      });

      expect.addAssertion(
        [
          '<spy|array|sinonSandbox|sinonStubInstance> to have no calls [exhaustively] satisfying <object>',
          '<spy|array|sinonSandbox|sinonStubInstance> not to have calls [exhaustively] satisfying <object>'
        ],
        (expect, subject, value) => {
          const spies = extractSpies(subject);
          const keys = Object.keys(value);
          if (
            keys.length > 0 &&
            keys.every(key => /^[1-9]*[0-9]+$/.test(key))
          ) {
            return expect(
              subject,
              'to have no calls [exhaustively] satisfying',
              { args: value }
            );
          }

          expect.errorMode = 'defaultOrNested';

          const calls = getCallTimeLineFromSpies(spies);

          const promises = calls.map(call => expect.promise(() => expect(call, 'to [exhaustively] satisfy', value)));
          return expect.promise.settle(promises).then(() => {
            const failed = promises.some(promise => promise.isFulfilled());

            if (failed) {
              return expect(
                calls,
                'to equal',
                toSpyCalls(
                  calls.filter((call, i) => promises[i].isRejected())
                )
              );
            }
          });
        }
      );

      expect.addAssertion(
        [
          '<spy|array|sinonSandbox|sinonStubInstance> to have no calls [exhaustively] satisfying <array>',
          '<spy|array|sinonSandbox|sinonStubInstance> not to have calls [exhaustively] satisfying <array>'
        ],
        (expect, subject, value) => expect(subject, 'to have no calls [exhaustively] satisfying', {
          args: value
        })
      );

      expect.addAssertion(
        [
          '<spy|array|sinonSandbox|sinonStubInstance> to have no calls satisfying <function>',
          '<spy|array|sinonSandbox|sinonStubInstance> not to have calls satisfying <function>'
        ],
        (expect, subject, value) => {
          const spies = extractSpies(subject);
          const expectedSpyCallSpecs = recordSpyCalls(spies, value);
          const expectedSpyCalls = [];
          expectedSpyCallSpecs.forEach(expectedSpyCallSpec => {
            expectedSpyCalls.push(expectedSpyCallSpec.call);
            delete expectedSpyCallSpec.call;
            delete expectedSpyCallSpec.callId;
          });
          if (expectedSpyCalls.length > 0) {
            expect.argsOutput[0] = output => {
              output.appendInspected(expectedSpyCalls);
            };
          }
          if (expectedSpyCallSpecs.length !== 1) {
            expect.errorMode = 'nested';
            expect.fail(
              'expected the provided function to call the spy exactly once, but it called it ' +
                expectedSpyCallSpecs.length +
                ' times'
            );
          }
          return expect(
            subject,
            'to have no calls satisfying',
            expectedSpyCallSpecs[0]
          );
        }
      );

      expect.addAssertion(
        '<spy|array|sinonSandbox|sinonStubInstance> to have a call [exhaustively] satisfying <object>',
        (expect, subject, value) => {
          const spies = extractSpies(subject);
          const keys = Object.keys(value);
          if (
            keys.length > 0 &&
            keys.every(key => /^[1-9]*[0-9]+$/.test(key))
          ) {
            return expect(subject, 'to have a call [exhaustively] satisfying', {
              args: value
            });
          }

          expect.errorMode = 'defaultOrNested';

          const calls = getCallTimeLineFromSpies(spies);

          const promises = calls.map(call => expect.promise(() => expect(call, 'to [exhaustively] satisfy', value)));
          return expect.promise.settle(promises).then(() => {
            const failed = promises.every(promise => promise.isRejected());

            if (failed) {
              return expect(
                calls,
                'to have items [exhaustively] satisfying',
                value
              );
            }
          });
        }
      );

      expect.addAssertion(
        '<spy|array|sinonSandbox|sinonStubInstance> to have a call [exhaustively] satisfying <array>',
        (expect, subject, value) => expect(subject, 'to have a call [exhaustively] satisfying', {
          args: value
        })
      );

      expect.addAssertion(
        '<spy|array|sinonSandbox|sinonStubInstance> to have a call satisfying <function>',
        (expect, subject, value) => {
          const spies = extractSpies(subject);
          const expectedSpyCallSpecs = recordSpyCalls(spies, value);
          const expectedSpyCalls = [];
          expectedSpyCallSpecs.forEach(expectedSpyCallSpec => {
            expectedSpyCalls.push(expectedSpyCallSpec.call);
            delete expectedSpyCallSpec.call;
            delete expectedSpyCallSpec.callId;
          });
          if (expectedSpyCalls.length > 0) {
            expect.argsOutput[0] = output => {
              output.appendInspected(expectedSpyCalls);
            };
          }
          if (expectedSpyCallSpecs.length !== 1) {
            expect.errorMode = 'nested';
            expect.fail(
              'expected the provided function to call the spy exactly once, but it called it ' +
                expectedSpyCallSpecs.length +
                ' times'
            );
          }
          return expect(
            subject,
            'to have a call satisfying',
            expectedSpyCallSpecs[0]
          );
        }
      );

      expect.addAssertion(
        '<spy|array|sinonSandbox|sinonStubInstance> to have all calls [exhaustively] satisfying <object>',
        (expect, subject, value) => {
          const spies = extractSpies(subject);
          const keys = Object.keys(value);
          if (
            keys.length > 0 &&
            keys.every(key => /^[1-9]*[0-9]+$/.test(key))
          ) {
            return expect(
              subject,
              'to have all calls [exhaustively] satisfying',
              { args: value }
            );
          }

          expect.errorMode = 'defaultOrNested';

          return expect(
            getCallTimeLineFromSpies(spies),
            'to have items [exhaustively] satisfying',
            value
          );
        }
      );

      expect.addAssertion(
        '<spy|array|sinonSandbox|sinonStubInstance> to have all calls [exhaustively] satisfying <array>',
        (expect, subject, value) => expect(
          subject,
          'to have all calls [exhaustively] satisfying',
          { args: value }
        )
      );

      expect.addAssertion(
        '<spy|array|sinonSandbox|sinonStubInstance> to have all calls satisfying <function>',
        (expect, subject, value) => {
          const spies = extractSpies(subject);
          const expectedSpyCallSpecs = recordSpyCalls(spies, value);
          const expectedSpyCalls = [];
          expectedSpyCallSpecs.forEach(expectedSpyCallSpec => {
            expectedSpyCalls.push(expectedSpyCallSpec.call);
            delete expectedSpyCallSpec.call;
            delete expectedSpyCallSpec.callId;
          });
          if (expectedSpyCalls.length > 0) {
            expect.argsOutput[0] = output => {
              output.appendInspected(expectedSpyCalls);
            };
          }
          if (expectedSpyCallSpecs.length !== 1) {
            expect.errorMode = 'nested';
            expect.fail(
              'expected the provided function to call the spy exactly once, but it called it ' +
                expectedSpyCallSpecs.length +
                ' times'
            );
          }
          return expect(
            subject,
            'to have all calls satisfying',
            expectedSpyCallSpecs[0]
          );
        }
      );

      expect.addAssertion(
        '<spy> was [always] called with [exactly] <any*>',
        function(expect, subject) {
          expect.errorMode = 'defaultOrNested';
          let args;
          if (expect.flags.exactly) {
            args = Array.prototype.slice.call(arguments, 2);
          } else {
            args = {};
            for (let i = 2; i < arguments.length; i += 1) {
              args[i - 2] = arguments[i];
            }
          }

          const calls = getCalls(subject);
          if (expect.flags.always) {
            return expect(calls, 'to have items satisfying', { args });
          } else {
            const promises = calls.map(call => expect.promise(() => expect(call, 'to satisfy', { args })));
            return expect.promise.settle(promises).then(() => {
              const failed = promises.every(promise => promise.isRejected());

              if (failed) {
                return expect(calls, 'to have items satisfying', {
                  args
                });
              }
            });
          }
        }
      );

      expect.addAssertion('<spy> was never called with <any*>', function(
        expect,
        subject
      ) {
        expect.errorMode = 'defaultOrNested';
        const args = {};
        for (let i = 2; i < arguments.length; i += 1) {
          args[i - 2] = arguments[i];
        }

        const calls = getCalls(subject);

        const promises = calls.map(call => expect.promise(() => expect(call, 'not to satisfy', { args })));
        return expect.promise.settle(promises).then(() => {
          const failed = promises.some(promise => promise.isRejected());
          if (failed) {
            return expect(calls, 'to have items satisfying not to satisfy', {
              args
            });
          }
        });
      });

      expect.addAssertion('<spy> [always] threw <any?>', (expect, subject, value) => {
        expect.errorMode = 'defaultOrNested';

        const calls = getCalls(subject);
        if (calls.length === 0) {
          expect.fail('spy did not throw exception');
        }
        const args = [calls, 'to have items satisfying', 'threw'];
        if (value) {
          args.push(value);
        }

        if (expect.flags.always) {
          return expect.apply(expect, args);
        } else {
          const promises = calls.map(call => expect.promise(() => expect(call, 'threw', value)));

          return expect.promise.settle(promises).then(() => {
            const failed = promises.every(promise => promise.isRejected());

            if (failed) {
              return expect.apply(expect, args);
            }
          });
        }
      });
    }
  };
});
