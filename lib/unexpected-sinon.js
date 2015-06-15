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

    var objectIs =  Object.is || function (a, b) {
        // Polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
        if (a === 0 && b === 0) {
            return 1 / a === 1 / b;
        }
        if (a !== a) {
            return b !== b;
        }
        return a === b;
    };

    function isSpy(value) {
        return value && typeof value.id === 'string' &&
            /^spy#/.test(value.id);
    }

    function isSpyCall(value) {
        return value && isSpy(value.proxy);
    }

    function isSpyCalls(value) {
        return Array.isArray(value) &&
            isSpyCall(value[0]);
    }

    function isSinonMatcher(value) {
        return value && typeof value.test === 'function' &&
            typeof value.message === 'string';
    }

    function toSpyArguments(args) {
        if (!args._isSpyArguments) {
            args = Object.create(args);
            args._isSpyArguments =  true;
        }
        return args;
    }

    function getCalls(spy) {
        return spy.getCalls();
    }

    function toArray(value) {
        var result = [];
        Object.keys(value).forEach(function (key) {
            result.push(value[key]);
        });
        return result;
    }

    function convertSinonMatchers(expect, arg) {
        if (isSinonMatcher(arg)) {
            var matcher = function (value) {
                if (!arg.test(value)) {
                    expect.fail('expected {0} to satisfy {1}',
                                expect.inspect(value),
                                expect.inspect(arg));
                }
            };
            matcher.test = arg.test;
            matcher.message = arg.message;
            return matcher;
        } else {
            return arg;
        }
    }

    return {
        name: 'unexpected-sinon',
        installInto: function (expect) {
            expect.addType({
                name: 'sinonMatcher',
                base: 'function',
                identify: isSinonMatcher,
                inspect: function (value, depth, output) {
                    output.text('match(').text(value.message).text(')');
                }
            });

            expect.addType({
                name: 'spyCallArguments',
                base: 'array-like',
                identify: function (value) {
                    return value && value._isSpyArguments;
                },
                prefix: function (output, value) {
                    return output;
                },
                suffix: function (output) {
                    return output;
                },
            });

            expect.addType({
                name: 'spyCall',
                base: 'array-like',
                identify: isSpyCall,
                prefix: function (output, value) {
                    return output.jsFunctionName(value.proxy.displayName).text('(');
                },
                suffix: function (output) {
                    return output.text(')');
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
                prefix: function (output, value) {
                    return output.jsFunctionName('invocations').text('(');
                },
                suffix: function (output) {
                    return output.text(')');
                },
                identify: isSpyCalls
            });

            expect.addType({
                name: 'spy',
                identify: isSpy,
                inspect: function (value, depth, output) {
                    output.jsFunctionName(value.displayName);
                }
            });

            expect.addAssertion('spy', 'was [not] called', function (expect, subject) {
                this.errorMode = this.flags.not ? 'nested' : 'default';
                expect(getCalls(subject), '[!not] to be empty');
            });

            expect.addAssertion('spyCall', 'to satisfy', function (expect, subject, value) {
                var subjectType = expect.findTypeOf(subject);
                var spyArguments = toSpyArguments(subject.args);

                var valueType = expect.findTypeOf(value);
                var args;
                function convertArgumentWithKey(key) {
                    return objectIs(spyArguments[key], value[key]) ?
                        expect.it('to be', value[key]) :
                        convertSinonMatchers(expect, value[key]);
                }

                if (valueType.is('array')) {
                    args = valueType.getKeys(value).map(convertArgumentWithKey);
                } else if (valueType.is('object')) {
                    args = {};
                    valueType.getKeys(value).forEach(function (key) {
                        args[key] = convertArgumentWithKey(key);
                    });
                }

                return expect.withError(function () {
                    return expect(spyArguments, 'to satisfy', args);
                }, function (err) {
                    expect.fail({
                        diff: function (output) {
                            var comparison = err.getDiff();
                            subjectType.prefix(output, subject);
                            output.append(comparison.diff);
                            subjectType.suffix(output, subject);
                            comparison.diff = output;
                            return comparison;
                        }
                    });
                });
            });

            expect.addAssertion('spyCall', 'threw', function (expect, subject, value) {
                var that = this;
                var error = subject.exception;
                if (arguments.length === 2) {
                    expect(error, 'to be truthy');
                } else {
                    that.errorMode = 'nested';
                    if (error && error._isUnexpected && (typeof value === 'string' || isRegExp(value))) {
                        return expect(error.output.toString(), 'to satisfy', value);
                    } else {
                        return expect.withError(function () {
                            return expect(error, 'to satisfy', value);
                        }, function (e) {
                            that.errorMode = 'bubble';
                            var diff = e.getDiff();
                            if (diff) {
                                expect.fail({
                                    message: e.getErrorMessage()
                                });
                            } else {
                                throw e;
                            }
                        });
                    }
                }
            });

            expect.addAssertion('spyCall', 'was called on', function (expect, subject, target) {
                this.errorMode = 'nested';
                if (subject.thisValue !== target) {
                    expect.fail("expected {0} to be called with {1} as this but was called with {2}",
                                expect.inspect(subject.proxy), expect.inspect(target),
                                expect.inspect(subject.thisValue));
                }
            });

            expect.addAssertion('spy', 'was called once', function (expect, subject) {
                var calls = getCalls(subject);
                this.errorMode = calls.length > 0 ? 'nested' : 'default';
                expect(calls, 'to have length', 1);
            });

            expect.addAssertion('spy', 'was called twice', function (expect, subject) {
                var calls = getCalls(subject);
                this.errorMode = calls.length > 0 ? 'nested' : 'default';
                expect(calls, 'to have length', 2);
            });

            expect.addAssertion('spy', 'was called thrice', function (expect, subject) {
                var calls = getCalls(subject);
                this.errorMode = calls.length > 0 ? 'nested' : 'default';
                expect(calls, 'to have length', 3);
            });

            expect.addAssertion('spy', 'was called times', function (expect, subject, times) {
                var calls = getCalls(subject);
                this.errorMode = calls.length > 0 ? 'nested' : 'default';
                expect(calls, 'to have length', times);
            });

            expect.addAssertion('spy', 'was called with new', function (expect, subject) {
                expect(subject.calledWithNew(), 'to be truthy');
            });

            expect.addAssertion('array-like', 'given call order', function (expect, subject) {
                sinon.assert.callOrder.apply(null, subject);
            });

            expect.addAssertion('spy', 'was [always] called on', function (expect, subject, target) {
                this.errorMode = 'nested';

                var calls = getCalls(subject);
                if (calls.length === 0) {
                    expect.fail('spy was never called');
                }

                if (this.flags.always) {
                    return expect(calls, 'to have items satisfying', 'was called on', target);
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
                            return expect(calls, 'to have items satisfying', 'was called on', target);
                        }
                    });
                }
            });

            expect.addAssertion('spy', 'was [always] called with [exactly]', function (expect, subject) {
                this.errorMode = 'nested';
                var args;
                if (this.flags.exactly) {
                    args = Array.prototype.slice.call(arguments, 2);
                } else {
                    args = {};
                    for (var i = 2; i < arguments.length; i += 1) {
                        args[i - 2] = arguments[i];
                    }
                }

                var calls = getCalls(subject);
                if (this.flags.always) {
                    return expect(calls, 'to have items satisfying', args);
                } else {
                    var promises = calls.map(function (call) {
                       return expect.promise(function () {
                           return expect(call, 'to satisfy', args);
                       });
                    });
                    return expect.promise.settle(promises).then(function () {
                        var failed = promises.every(function (promise) {
                            return promise.isRejected();
                        });

                        if (failed) {
                            return expect(calls, 'to have items satisfying', args);
                        }
                    });
                }
            });

            expect.addAssertion('spy', 'was never called with', function (expect, subject) {
                this.errorMode = 'nested';
                var args = {};
                for (var i = 2; i < arguments.length; i += 1) {
                    args[i - 2] = arguments[i];
                }

                var calls = getCalls(subject);

                var promises = calls.map(function (call) {
                    return expect.promise(function () {
                        return expect(call, 'not to satisfy', args);
                    });
                });
                return expect.promise.settle(promises).then(function () {
                    var failed = promises.every(function (promise) {
                        return promise.isRejected();
                    });

                    if (failed) {
                        return expect(calls, 'to have items satisfying', 'not to satisfy', args);
                    }
                });
            });

            expect.addAssertion('spy', '[always] threw', function (expect, subject, value) {
                this.errorMode = 'nested';

                var calls = getCalls(subject);
                if (calls.length === 0) {
                    expect.fail('spy did not throw exception');
                }

                var args = [calls, 'to have items satisfying', 'threw'];
                if (value) {
                    args.push(value);
                }

                if (this.flags.always) {
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
