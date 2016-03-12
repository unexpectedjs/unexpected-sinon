/*global location*/
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

(function (root, factory) {
    if (typeof exports === 'object') {
        module.exports = factory(require('sinon'));
    } else if (typeof define === 'function' && define.amd) {
        define(['sinon'], factory);
    } else {
        root.weknowhow = root.weknowhow || {};
        root.weknowhow.unexpectedSinon = factory(root.sinon);
    }
}(this, function (sinon) {
    function isRegExp(re) {
        return (Object.prototype.toString.call(re) === '[object RegExp]');
    }

    function isSpy(value) {
        return value && typeof value.id === 'string' &&
            /^spy#/.test(value.id);
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

    var cwdOrLocationRegExp;
    if (typeof location === 'object' && typeof location.href === 'string') {
        cwdOrLocationRegExp = new RegExp(escapeRegExpMetaChars(location.href.replace(/[^/]+(?:\?[^#]*)?(?:#.*)?$/, '') + '/'));
    } else if (typeof require === 'function' && typeof module === 'object' && typeof module.exports === 'object' && typeof process === 'object') {
        cwdOrLocationRegExp = new RegExp(escapeRegExpMetaChars(process.cwd() + '/'));
    }

    function makePathsRelativeToCwdOrLocation(str) {
        if (cwdOrLocationRegExp) {
            return str.replace(cwdOrLocationRegExp, '');
        } else {
            return str;
        }
    }

    function recordSpyCalls(spies, fn) {
        var originalValues = spies.map(function (spy) {
            var originalValue = {
                func: spy.func
            };
            // Temporarily override the body of the spied-on function, if any.
            // This prevents spies with side effects from breaking while
            // the expected calls are being recorded:
            spy.func = function () {};
            for (var propertyName in spy) {
                if (spy.hasOwnProperty(propertyName) && typeof spy[propertyName] !== 'function') {
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
        var expectedSpyCallSpecs = [];
        spies.forEach(function (spy, i) {
            var originalValue = originalValues[i];
            for (var j = originalValue.args.length ; j < spy.args.length ; j += 1) {
                var thisValue = spy.thisValues[j];
                var calledWithNew = thisValue instanceof spy;
                var expectedSpyCallSpec = {
                    proxy: spy,
                    call: spy.getCall(j),
                    args: spy.args[j],
                    callId: spy.callIds[j],
                    calledWithNew: calledWithNew
                };
                expectedSpyCallSpec.call.getStackFrames = false;
                expectedSpyCallSpecs.push(expectedSpyCallSpec);
            }
            for (var propertyName in originalValue) {
                spy[propertyName] = originalValue[propertyName];
            }
        });
        expectedSpyCallSpecs.sort(function (a, b) {
            return a.callId - b.callId;
        });

        return expectedSpyCallSpecs;
    }

    return {
        name: 'unexpected-sinon',
        installInto: function (expect) {
            expect.addType({
                name: 'spyCallArguments',
                base: 'array-like',
                identify: function (value) {
                    return value && value._isSpyArguments;
                },
                prefix: function (output, value) {
                    return output.text('(');
                },
                suffix: function (output) {
                    return output.text(');');
                }
            });

            expect.addType({
                name: 'spyCall',
                base: 'object',
                identify: isSpyCall,
                prefix: function (output, value) {
                    if (value.thisValue instanceof value.proxy) {
                        output.jsKeyword('new').sp();
                    }
                    return output.appendInspected(value.proxy);
                },
                suffix: function (output, value) {
                    var stackFrames = value.getStackFrames && value.getStackFrames();
                    if (Array.isArray(stackFrames) && stackFrames.length > 0) {
                        output.sp().jsComment('at ' + makePathsRelativeToCwdOrLocation(stackFrames[0].replace(/^\s*(?:at\s+|@)?/, '')));
                    }
                    return output;
                },
                inspect: function (value, depth, output, inspect) {
                    this.prefix(output, value);
                    output.append(inspect(toSpyArguments(value.args), depth + 1));
                    this.suffix(output, value);
                },
                equal: function (actual, expected, equal) {
                    return equal(actual.args, expected.args);
                },
                diff: function (actual, expected, output, diff, inspect) {
                    var comparison = diff(toSpyArguments(actual.args), toSpyArguments(expected.args));
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
                prefix: function (output) {
                    return output;
                },
                suffix: function (output) {
                    return output;
                },
                delimiter: function (output) {
                    return output;
                },
                identify: isSpyCalls,
                similar: function (a, b) {
                    var baseType = this.baseType.baseType;
                    return a.args && b.args && a.args.length === b.args.length && a.args.every(function (aItem, index) {
                        return baseType.similar(aItem, b.args[index]);
                    });
                },
                indent: false,
                forceMultipleLines: true,
                inspect: function (spyCalls, depth, output, inspect) {
                    output
                        .block(function (output) {
                            output.appendItems(spyCalls, '\n');
                        });
                }
            });

            expect.addType({
                name: 'spy',
                identify: isSpy,
                inspect: function (value, depth, output) {
                    var idNum = parseInt(value.id.substr(4), 10);
                    var label = value.displayName + (value.displayName === 'spy' ? idNum : '');
                    if (output.colorByIndex) {
                        output.colorByIndex(label, idNum);
                    } else {
                        output.text(label);
                    }
                }
            });

            expect.addAssertion('<spy> was called', function (expect, subject) {
                expect(getCalls(subject), 'not to satisfy', []);
            });

            expect.addAssertion('<spy> was not called', function (expect, subject) {
                expect.errorMode = 'defaultOrNested';
                expect(getCalls(subject), 'to satisfy', []);
            });

            expect.addAssertion('<spyCall> to [exhaustively] satisfy <any>', function (expect, subject, value) {
                var subjectType = expect.findTypeOf(subject);
                var spyArguments = toSpyArguments(subject.args);

                if (value && isSpy(value)) {
                    value = { spy: value };
                }
                var unsupportedKeys = Object.keys(value).filter(function (key) {
                    return [ 'spy', 'proxy', 'args', 'returnValue', 'returned', 'exception', 'threw', 'this', 'thisValue', 'stack', 'calledWithNew' ].indexOf(key) === -1;
                });
                if (unsupportedKeys.length > 0) {
                    throw new Error('spyCall to satisfy: Unsupported keys: ' + unsupportedKeys.join(', '));
                }

                var expectedSpy = value.proxy || value.spy;
                var promiseByKey = {
                    spy: expect.promise(function () {
                        if (expectedSpy) {
                            return expect(subject.proxy, 'to be', expectedSpy);
                        }
                    }),
                    calledWithNew: expect.promise(function () {
                        if (typeof value.calledWithNew !== 'undefined') {
                            return expect(subject.thisValue instanceof subject.proxy, 'to satisfy', value.calledWithNew);
                        }
                    }),
                    args: expect.promise(function () {
                        if (typeof value.args !== 'undefined') {
                            return expect(spyArguments, 'to [exhaustively] satisfy', value.args);
                        }
                    }),
                    threw: expect.promise(function () {
                        if (value.hasOwnProperty('threw')) {
                            return expect(subject.exception, 'to satisfy', value.threw);
                        } else if (value.hasOwnProperty('exception')) {
                            return expect(subject.exception, 'to satisfy', value.exception);
                        }
                    }),
                    returned: expect.promise(function () {
                        if (value.hasOwnProperty('returned')) {
                            return expect(subject.returnValue, 'to satisfy', value.returned);
                        } else if (value.hasOwnProperty('returnValue')) {
                            return expect(subject.returnValue, 'to satisfy', value.returnValue);
                        }
                    }),
                    'this': expect.promise(function () {
                        if (value.hasOwnProperty('this')) {
                            return expect(subject.thisValue, 'to satisfy', value['this']);
                        } else if (value.hasOwnProperty('thisValue')) {
                            return expect(subject.thisValue, 'to satisfy', value.thisValue);
                        }

                    }),
                    stack: expect.promise(function () {
                        if (value.stack) {
                            expect(subject.stack, 'to satisfy', value.stack);
                        }
                    })
                };

                return expect.promise.all(promiseByKey).caught(function (err) {
                    return expect.promise.settle(promiseByKey).then(function () {
                        err = err.getAllErrors().pop();
                        expect.fail({
                            diff: function (output) {
                                subjectType.prefix(output, subject);
                                var comparison = {};
                                var argsDiff = promiseByKey.args && promiseByKey.args.isRejected() && promiseByKey.args.reason().getDiff(output);
                                var isMatchingSpy = !promiseByKey.spy || promiseByKey.spy.isFulfilled();
                                if (argsDiff && isMatchingSpy) {
                                    output.append(argsDiff.diff);
                                } else {
                                    output.appendInspected(toSpyArguments(subject.args));
                                }
                                subjectType.suffix(output, subject);

                                var keysWithError = {};
                                Object.keys(promiseByKey).forEach(function (key) {
                                    if ((key !== 'args' || !isMatchingSpy) && promiseByKey[key].isRejected()) {
                                        keysWithError[key] = promiseByKey[key].reason();
                                    }
                                });

                                var numKeysWithError = Object.keys(keysWithError).length;
                                if (((numKeysWithError === 1 && keysWithError.spy) || (numKeysWithError === 2 && keysWithError.spy && keysWithError.args))) {
                                    output.sp().annotationBlock(function () {
                                        this.error('should be').sp().appendInspected(expectedSpy);
                                        if (value.args) {
                                            this.appendInspected(toSpyArguments(value.args));
                                        }
                                    });
                                } else if (numKeysWithError > 0) {
                                    var annotation = output.clone().annotationBlock(function (output) {
                                        Object.keys(keysWithError).forEach(function (key, i) {
                                            var error = keysWithError[key];
                                            error.errorMode = 'bubble';
                                            output.nl(i > 0 ? 2 : 0).error(key + ': ').block(function (output) {
                                                output.appendErrorMessage(error);
                                            });
                                        });
                                    });
                                    if (output.preferredWidth < output.size().width + annotation.size().width) {
                                        output.nl()
                                              .indentLines()
                                              .i().append(annotation);
                                    } else {
                                        output.sp().append(annotation);
                                    }
                                }

                                comparison.inline = true;
                                comparison.diff = output;
                                return comparison;
                            }
                        });
                    });
                });
            });

            expect.addAssertion('<spyCall> threw <any?>', function (expect, subject, value) {
                var error = subject.exception;
                if (arguments.length === 2) {
                    expect(error, 'to be truthy');
                } else {
                    expect.errorMode = 'nested';
                    if (error && error._isUnexpected && (typeof value === 'string' || isRegExp(value))) {
                        return expect(error.output.toString(), 'to satisfy', value);
                    } else {
                        return expect.withError(function () {
                            return expect(error, 'to satisfy', value);
                        }, function (e) {
                            expect.errorMode = 'bubble';
                            var hasDiff = e.getDiffMethod();
                            if (hasDiff) {
                                expect.fail(function (output) {
                                    output.append(e.getErrorMessage(output));
                                });
                            } else {
                                expect.fail(e);
                            }
                        });
                    }
                }
            });

            expect.addAssertion('<spyCall> was called on <any>', function (expect, subject, target) {
                expect.errorMode = 'defaultOrNested';
                if (subject.thisValue !== target) {
                    expect.fail("expected {0} to be called with {1} as this but was called with {2}",
                                subject.proxy, target, subject.thisValue);
                }
            });

            expect.addAssertion('<spy|array> to have calls [exhaustively] satisfying <function>', function (expect, subject, value) {
                var spies = subject;
                if (!Array.isArray(spies)) {
                    spies = [ spies ];
                }
                var expectedSpyCallSpecs = recordSpyCalls(spies, value);
                var expectedSpyCalls = [];
                expectedSpyCallSpecs.forEach(function (expectedSpyCallSpec) {
                    expectedSpyCalls.push(expectedSpyCallSpec.call);
                    delete expectedSpyCallSpec.call;
                    delete expectedSpyCallSpec.callId;
                });
                expect.argsOutput[0] = function (output) {
                    output.appendInspected(expectedSpyCalls);
                };
                return expect(spies, 'to have calls [exhaustively] satisfying', expectedSpyCallSpecs);
            });

            expect.addAssertion('<spy|array> to have calls [exhaustively] satisfying <array|object>', function (expect, subject, value) {
                var spies = subject;
                if (!Array.isArray(spies)) {
                    spies = [ spies ];
                }
                var spyCalls = [];
                var isSeenBySpyId = {};
                spies.forEach(function (spy) {
                    if (!isSeenBySpyId[spy.id]) {
                        Array.prototype.push.apply(spyCalls, spy.getCalls());
                        isSeenBySpyId[spy.id] = true;
                    }
                });
                spyCalls.sort(function (a, b) {
                    return a.callId - b.callId;
                });

                var seenSpies = [];
                function wrapSpyInObject(obj) {
                    if (isSpy(obj)) {
                        seenSpies.push(obj);
                        return { spy: obj };
                    } else if (Array.isArray(obj)) {
                        return { args: obj };
                    } else if (obj && typeof obj === 'object') {
                        var keys = Object.keys(obj);
                        if (
                            keys.length > 0 &&
                            keys.every(function (key) {
                                return /^[1-9]*[0-9]+$/.test(key);
                            })
                        ) {
                            return { args: obj };
                        }

                        if (isSpy(obj.spy)) {
                            seenSpies.push(obj.spy);
                        }
                        return obj;
                    } else {
                        expect.errorMode = 'nested';
                        expect.fail(function () {
                            this.error('unsupported value in spy call spec: ').appendInspected(obj);
                        });
                    }
                }

                // Make sure that the array-like to satisfy implementation supports the <spy> => { spy: <spy> } shorthand:
                if (Array.isArray(value)) {
                    value = value.map(wrapSpyInObject);
                } else if (value && typeof value === 'object') {
                    value = Object.keys(value).reduce(function (result, key) {
                        result[key] = wrapSpyInObject(value[key]);
                        return result;
                    }, {});
                }

                expect.errorMode = 'nested';
                seenSpies.forEach(function (seenSpy) {
                    expect(spies, 'to contain', seenSpy);
                });
                expect.errorMode = 'default';

                return expect(toSpyCalls(spyCalls), 'to [exhaustively] satisfy', value);
            });

            expect.addAssertion('<spy> was called once', function (expect, subject) {
                var calls = getCalls(subject);
                expect.errorMode = calls.length > 0 ? 'nested' : 'default';
                expect(calls, 'to have length', 1);
            });

            expect.addAssertion('<spy> was called twice', function (expect, subject) {
                var calls = getCalls(subject);
                expect.errorMode = calls.length > 0 ? 'nested' : 'default';
                expect(calls, 'to have length', 2);
            });

            expect.addAssertion('<spy> was called thrice', function (expect, subject) {
                var calls = getCalls(subject);
                expect.errorMode = calls.length > 0 ? 'nested' : 'default';
                expect(calls, 'to have length', 3);
            });

            expect.addAssertion('<spy> was called times <number>', function (expect, subject, times) {
                var calls = getCalls(subject);
                expect.errorMode = calls.length > 0 ? 'nested' : 'default';
                expect(calls, 'to have length', times);
            });

            expect.addAssertion('<spy> was called with new', function (expect, subject) {
                expect(subject.calledWithNew(), 'to be truthy');
            });

            expect.addAssertion('<array> given call order', function (expect, subject) {
                return expect(subject, 'to have calls satisfying', subject);
            });

            expect.addAssertion('<spy> was [always] called on <any>', function (expect, subject, target) {
                expect.errorMode = 'defaultOrNested';

                var calls = getCalls(subject);
                if (calls.length === 0) {
                    expect.fail('spy was never called');
                }

                if (expect.flags.always) {
                    return expect(calls, 'to have items satisfying was called on', target);
                } else {
                    var promises = calls.map(function (call) {
                       return expect.promise(function () {
                            return expect(call, 'was called on', target);
                       });
                    });
                    return expect.promise.settle(promises).then(function () {
                        var failed = promises.every(function (promise) {
                            return promise.isRejected();
                        });

                        if (failed) {
                            return expect(calls, 'to have items satisfying was called on', target);
                        }
                    });
                }
            });

            expect.addAssertion('<spy> to have a call [exhaustively] satisfying <object>', function (expect, subject, value) {
                var keys = Object.keys(value);
                if (
                    keys.length > 0 &&
                    keys.every(function (key) {
                        return /^[1-9]*[0-9]+$/.test(key);
                    })
                ) {
                    return expect(subject, 'to have a call [exhaustively] satisfying', { args: value });
                }

                expect.errorMode = 'defaultOrNested';
                var calls = getCalls(subject);
                var promises = calls.map(function (call) {
                    return expect.promise(function () {
                        return expect(call, 'to [exhaustively] satisfy', value);
                    });
                });
                return expect.promise.settle(promises).then(function () {
                    var failed = promises.every(function (promise) {
                        return promise.isRejected();
                    });

                    if (failed) {
                        return expect(calls, 'to have items [exhaustively] satisfying', value);
                    }
                });
            });

            expect.addAssertion('<spy> to have a call [exhaustively] satisfying <array>', function (expect, subject, value) {
                return expect(subject, 'to have a call [exhaustively] satisfying', { args: value });
            });

            expect.addAssertion('<spy> to have a call satisfying <function>', function (expect, subject, value) {
                var expectedSpyCallSpecs = recordSpyCalls([subject], value);
                var expectedSpyCalls = [];
                expectedSpyCallSpecs.forEach(function (expectedSpyCallSpec) {
                    expectedSpyCalls.push(expectedSpyCallSpec.call);
                    delete expectedSpyCallSpec.call;
                    delete expectedSpyCallSpec.callId;
                });
                if (expectedSpyCalls.length > 0) {
                    expect.argsOutput[0] = function (output) {
                        output.appendInspected(expectedSpyCalls);
                    };
                }
                if (expectedSpyCallSpecs.length !== 1) {
                    expect.errorMode = 'nested';
                    expect.fail('expected the provided function to call the spy exactly once, but it called it ' + expectedSpyCallSpecs.length + ' times');
                }
                return expect(subject, 'to have a call satisfying', expectedSpyCallSpecs[0]);
            });

            expect.addAssertion('<spy> was [always] called with [exactly] <any*>', function (expect, subject) {
                expect.errorMode = 'defaultOrNested';
                var args;
                if (expect.flags.exactly) {
                    args = Array.prototype.slice.call(arguments, 2);
                } else {
                    args = {};
                    for (var i = 2; i < arguments.length; i += 1) {
                        args[i - 2] = arguments[i];
                    }
                }

                var calls = getCalls(subject);
                if (expect.flags.always) {
                    return expect(calls, 'to have items satisfying', { args: args });
                } else {
                    var promises = calls.map(function (call) {
                       return expect.promise(function () {
                           return expect(call, 'to satisfy', { args: args });
                       });
                    });
                    return expect.promise.settle(promises).then(function () {
                        var failed = promises.every(function (promise) {
                            return promise.isRejected();
                        });

                        if (failed) {
                            return expect(calls, 'to have items satisfying', { args: args });
                        }
                    });
                }
            });

            expect.addAssertion('<spy> was never called with <any*>', function (expect, subject) {
                expect.errorMode = 'defaultOrNested';
                var args = {};
                for (var i = 2; i < arguments.length; i += 1) {
                    args[i - 2] = arguments[i];
                }

                var calls = getCalls(subject);

                var promises = calls.map(function (call) {
                    return expect.promise(function () {
                        return expect(call, 'not to satisfy', { args: args });
                    });
                });
                return expect.promise.settle(promises).then(function () {
                    var failed = promises.some(function (promise) {
                        return promise.isRejected();
                    });
                    if (failed) {
                        return expect(calls, 'to have items satisfying not to satisfy', { args: args });
                    }
                });
            });

            expect.addAssertion('<spy> [always] threw <any?>', function (expect, subject, value) {
                expect.errorMode = 'defaultOrNested';

                var calls = getCalls(subject);
                if (calls.length === 0) {
                    expect.fail('spy did not throw exception');
                }

                var args = [calls, 'to have items satisfying threw'];
                if (value) {
                    args.push(value);
                }

                if (expect.flags.always) {
                    return expect.apply(expect, args);
                } else {
                    var promises = calls.map(function (call) {
                        return expect.promise(function () {
                            return expect(call, 'threw', value);
                        });
                    });

                    return expect.promise.settle(promises).then(function () {
                        var failed = promises.every(function (promise) {
                            return promise.isRejected();
                        });

                        if (failed) {
                            return expect.apply(expect, args);
                        }
                    });
                }
            });
        }
    };
}));
