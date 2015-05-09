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
    return {
        name: 'unexpected-sinon',
        installInto: function (expect) {
            expect.addType({
                name: 'spy',
                identify: function (value) {
                    return value && typeof value.id === 'string' &&
                        /^spy#/.test(value.id);
                }
            });
            expect.addAssertion('spy', 'was [not] called', function (expect, subject) {
                if (this.flags.not) {
                    sinon.assert.notCalled(subject);
                } else {
                    sinon.assert.called(subject);
                }
            });

            expect.addAssertion('spy', 'was called once', function (expect, subject) {
                sinon.assert.calledOnce(subject);
            });

            expect.addAssertion('spy', 'was called twice', function (expect, subject) {
                sinon.assert.calledTwice(subject);
            });

            expect.addAssertion('spy', 'was called thrice', function (expect, subject) {
                sinon.assert.calledThrice(subject);
            });

            expect.addAssertion('spy', 'was called times', function (expect, subject, times) {
                sinon.assert.callCount(subject, times);
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
                var args = Array.prototype.slice.call(arguments, 1);
                if (this.flags.always && this.flags.exactly) {
                    sinon.assert.alwaysCalledWithExactly.apply(null, args);
                } else if (this.flags.always) {
                    sinon.assert.alwaysCalledWith.apply(null, args);
                } else if (this.flags.exactly) {
                    sinon.assert.calledWithExactly.apply(null, args);
                } else {
                    sinon.assert.calledWith.apply(null, args);
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
