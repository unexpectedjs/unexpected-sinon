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
        var calls = spy.getCalls();
        calls.forEach(function (call) {
            call.args = toSpyArguments(call.args);
        });
        return calls;
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
            }).addType({
                name: 'spyCallArguments',
                base: 'array-like',
                identify: function (value) {
                    return value && value._isSpyArguments;
                },
                prefix: function (output, value) {
                    return output.text('(');
                },
                suffix: function (output) {
                    return output.text(')');
                },
                toArray: function (value) {
                    var result = [];
                    this.getKeys(value).forEach(function (key) {
                        result.push(value[key]);
                    });
                    return result;
                }
            }).addType({
                name: 'spyCall',
                base: 'wrapperObject',
                identify: isSpyCall,
                prefix: function (output, value) {
                    return output.jsFunctionName(value.proxy.displayName);
                },
                suffix: function (output) {
                    return output;
                },
                unwrap: function (value) {
                    return toSpyArguments(value.args);
                }
            }).addType({
                name: 'spyCalls',
                base: 'array-like',
                prefix: function (output, value) {
                    return output.jsFunctionName('invocations').text('(');
                },
                suffix: function (output) {
                    return output.text(')');
                },
                identify: isSpyCalls
            }).addType({
                name: 'spy',
                identify: isSpy,
                inspect: function (value, depth, output) {
                    output.jsFunctionName(value.displayName);
                }
            }).addAssertion('spy', 'was [not] called', function (expect, subject) {
                this.errorMode = this.flags.not ? 'nested' : 'default';
                expect(getCalls(subject), '[!not] to be empty');
            }).addAssertion('spyCallArguments', 'to satisfy', function (expect, subject, value) {
                var subjectType = expect.findTypeOf(subject);
                subject = subjectType.toArray(subject);

                var valueType = expect.findTypeOf(value);
                var args;
                if (valueType.is('array')) {
                    args = valueType.getKeys(value).map(function (key) {
                        return convertSinonMatchers(expect, value[key]);
                    });
                } else if (valueType.is('object')) {
                    args = {};
                    valueType.getKeys(value).forEach(function (key) {
                        args[key] = convertSinonMatchers(expect, value[key]);
                    });
                }

                expect(subject, 'to satisfy', args);
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
                sinon.assert.calledWithNew(subject);
            });

            expect.addAssertion('array-like', 'given call order', function (expect, subject) {
                sinon.assert.callOrder.apply(null, subject);
            });

            expect.addAssertion('spy', 'was [always] called on', function (expect, subject, target) {
                if (this.flags.always) {
                    sinon.assert.alwaysCalledOn(subject, target);
                } else {
                    sinon.assert.calledOn(subject, target);
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
                    expect(calls, 'to have items satisfying', args);
                } else {
                    var failed = calls.every(function (call) {
                        try {
                            expect(call.args, 'to satisfy', args);
                        } catch (e) {
                            return true;
                        }
                        return false;
                    });

                    if (failed) {
                        expect(calls, 'to have items satisfying', args);
                    }
                }
            });

            expect.addAssertion('spy', 'was never called with', function (expect, subject) {
                var args = Array.prototype.slice.call(arguments, 1);
                sinon.assert.neverCalledWith.apply(null, args);
            });

            expect.addAssertion('spy', '[always] threw', function (expect, subject, value) {
                if (this.flags.always) {
                    sinon.assert.alwaysThrew(subject, value);
                } else {
                    sinon.assert.threw(subject, value);
                }
            });

            expect.addAssertion('spy', 'was [always] called with match', function (expect, subject) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (this.flags.always) {
                    sinon.assert.alwaysCalledWithMatch.apply(null, args);
                } else {
                    sinon.assert.calledWithMatch.apply(null, args);
                }
            });
        }
    };
}));
