/*global describe, it, beforeEach, sinon, unexpected*/

// Bogus class to be used with sinon.createStubInstance:
function MyClass() {
    throw new Error('oh no');
}
MyClass.prototype.foo = function () {
    throw new Error('oh no');
};
MyClass.prototype.bar = function () {
    throw new Error('oh no');
};

describe('unexpected-sinon', function () {
    var expect, spy;

    beforeEach(function () {
        expect = unexpected.clone();
        expect.output.preferredWidth = 120;
        spy = sinon.spy().named('spy1');
    });

    describe('was called', function () {
        it('passes if spy was called at least once', function () {
            spy();
            expect(spy, "was called");
        });

        it('fails if spy was never called', function () {
            expect(function () {
                expect(spy, "was called");
            }, "to throw exception", "expected spy1 was called");
        });
    });

    describe('was not called', function () {
        it('passes if spy was never called', function () {
            expect(spy, "was not called");
        });

        it('fails if spy was called', function () {
            expect(function () {
                spy(42, { foo: 'bar' });
                spy('baz');
                expect(spy, "was not called");
            }, "to throw exception",
                "expected spy1 was not called\n" +
                "\n" +
                "spy1( 42, { foo: 'bar' } ); at theFunction (theFileName:xx:yy) // should be removed\n" +
                "spy1( 'baz' ); at theFunction (theFileName:xx:yy) // should be removed"
            );
        });
    });

    describe('was called once', function () {
        it('passes if spy was called once and only once', function () {
            spy();
            expect(spy, "was called once");
        });

        it('fails if spy was not called exactly once', function () {
            expect(function () {
                expect(spy, "was called once");
            }, "to throw exception", 'expected spy1 was called once');

            expect(function () {
                spy(42, { foo: 'bar' });
                spy('baz');
                expect(spy, "was called once");
            }, "to throw exception",
                "expected spy1 was called once\n" +
                "  expected\n" +
                "  spy1( 42, { foo: 'bar' } ); at theFunction (theFileName:xx:yy)\n" +
                "  spy1( 'baz' ); at theFunction (theFileName:xx:yy)\n" +
                "  to have length 1\n" +
                "    expected 2 to be 1"
            );
        });
    });

    describe('was called twice', function () {
        it('passes if spy was called exactly twice', function () {
            spy();
            spy();
            expect(spy, "was called twice");
        });

        it('fails if spy was not called exactly twice', function () {
            expect(function () {
                expect(spy, "was called twice");
            }, "to throw exception", "expected spy1 was called twice");

            expect(function () {
                var spy = sinon.spy().named('spy1');
                spy();
                expect(spy, "was called twice");
            }, "to throw exception", "expected spy1 was called twice\n" +
                "  expected spy1(); at theFunction (theFileName:xx:yy) to have length 2\n" +
                "    expected 1 to be 2"
            );

            expect(function () {
                var spy = sinon.spy().named('spy1');
                spy(); spy(42); spy();
                expect(spy, "was called twice");
            }, "to throw exception",
                "expected spy1 was called twice\n" +
                "  expected\n" +
                "  spy1(); at theFunction (theFileName:xx:yy)\n" +
                "  spy1( 42 ); at theFunction (theFileName:xx:yy)\n" +
                "  spy1(); at theFunction (theFileName:xx:yy)\n" +
                "  to have length 2\n" +
                "    expected 3 to be 2"
            );
        });
    });

    describe('was called thrice', function () {
        it('passes if spy was called exactly three times', function () {
            spy();
            spy();
            spy();
            expect(spy, "was called thrice");
        });

        it('fails if spy was not called exactly three times', function () {
            expect(function () {
                var spy = sinon.spy().named('spy1');
                spy();
                spy();
                expect(spy, "was called thrice");
            }, "to throw exception",
                "expected spy1 was called thrice\n" +
                "  expected\n" +
                "  spy1(); at theFunction (theFileName:xx:yy)\n" +
                "  spy1(); at theFunction (theFileName:xx:yy)\n" +
                "  to have length 3\n" +
                "    expected 2 to be 3"
            );

            expect(function () {
                var spy = sinon.spy().named('spy1');
                spy(); spy(); spy(); spy();
                expect(spy, "was called thrice");
            }, "to throw exception",
                "expected spy1 was called thrice\n" +
                "  expected\n" +
                "  spy1(); at theFunction (theFileName:xx:yy)\n" +
                "  spy1(); at theFunction (theFileName:xx:yy)\n" +
                "  spy1(); at theFunction (theFileName:xx:yy)\n" +
                "  spy1(); at theFunction (theFileName:xx:yy)\n" +
                "  to have length 3\n" +
                "    expected 4 to be 3"
            );
        });
    });

    describe('was called times', function () {
        it('passes if the spy was called exactly number of times', function () {
            var spy = sinon.spy();
            spy(); spy(); spy(); spy(); spy();
            expect(spy, "was called times", 5);
        });

        it('fails if the spy was not called exactly number of times', function () {
            expect(function () {
                var spy = sinon.spy().named('spy1');
                spy();
                spy();
                expect(spy, "was called times", 3);
            }, "to throw exception",
                "expected spy1 was called times 3\n" +
                "  expected\n" +
                "  spy1(); at theFunction (theFileName:xx:yy)\n" +
                "  spy1(); at theFunction (theFileName:xx:yy)\n" +
                "  to have length 3\n" +
                "    expected 2 to be 3"
            );

            expect(function () {
                var spy = sinon.spy().named('spy1');
                spy();
                spy();
                spy();
                spy();
                expect(spy, "was called times", 3);
            }, "to throw exception",
                "expected spy1 was called times 3\n" +
                "  expected\n" +
                "  spy1(); at theFunction (theFileName:xx:yy)\n" +
                "  spy1(); at theFunction (theFileName:xx:yy)\n" +
                "  spy1(); at theFunction (theFileName:xx:yy)\n" +
                "  spy1(); at theFunction (theFileName:xx:yy)\n" +
                "  to have length 3\n" +
                "    expected 4 to be 3"
            );
        });
    });

    describe('was called the new operator', function () {
        it('passes if spy was called the new operator', function () {
            new spy(); // eslint-disable-line new-cap
            expect(spy, "was called with new");
        });
        it('fails if spy was never called with new operator', function () {
            expect(function () {
                var spy = sinon.spy().named('spy1');
                spy();
                expect(spy, "was called with new");
            }, "to throw exception", 'expected spy1 was called with new');
        });
    });

    describe('given call order', function () {
        it('passes if the provided spies where called in the given order', function () {
            var agent005 = sinon.spy().named('agent005');
            var agent006 = sinon.spy().named('agent006');
            var agent007 = sinon.spy().named('agent007');
            agent005();
            agent006();
            agent007();
            expect([agent005, agent006, agent007], 'given call order');
        });

        it('passes if the provided spies were called multiple times in the given order', function () {
            var agent005 = sinon.spy().named('agent005');
            var agent006 = sinon.spy().named('agent006');
            var agent007 = sinon.spy().named('agent007');
            agent005();
            agent006();
            agent007();
            agent005();
            agent006();
            agent007();
            expect([agent005, agent006, agent007, agent005, agent006, agent007], 'given call order');
        });

        it('passes if the provided spies were called multiple times in the wrong order', function () {
            var agent005 = sinon.spy().named('agent005');
            var agent006 = sinon.spy().named('agent006');
            var agent007 = sinon.spy().named('agent007');
            agent005();
            agent006();
            agent007();
            agent005();
            agent006();
            agent007();
            expect(function () {
                expect([agent005, agent006, agent007, agent005, agent006, agent005], 'given call order');
            }, 'to throw',
                "expected [ agent005, agent006, agent007, agent005, agent006, agent005 ] given call order\n" +
                "\n" +
                "agent005(); at theFunction (theFileName:xx:yy)\n" +
                "agent006(); at theFunction (theFileName:xx:yy)\n" +
                "agent007(); at theFunction (theFileName:xx:yy)\n" +
                "agent005(); at theFunction (theFileName:xx:yy)\n" +
                "agent006(); at theFunction (theFileName:xx:yy)\n" +
                "agent007(); at theFunction (theFileName:xx:yy) // should be agent005"
            );
        });

        it('fails if the provided spies were all called, but not in the given order', function () {
            expect(function () {
                var agent005 = sinon.spy().named('agent005');
                var agent006 = sinon.spy().named('agent006');
                var agent007 = sinon.spy().named('agent007');
                agent005();
                agent007();
                agent006();
                expect([agent005, agent006, agent007], 'given call order');
            }, 'to throw exception',
                "expected [ agent005, agent006, agent007 ] given call order\n" +
                "\n" +
                "    agent005(); at theFunction (theFileName:xx:yy)\n" +
                "┌─▷\n" +
                "│   agent007(); at theFunction (theFileName:xx:yy)\n" +
                "└── agent006(); at theFunction (theFileName:xx:yy) // should be moved"
            );
        });

        it('fails if one of the spies was never called', function () {
            expect(function () {
                var agent005 = sinon.spy().named('agent005');
                var agent006 = sinon.spy().named('agent006');
                var agent007 = sinon.spy().named('agent007');
                agent005();
                agent006();
                expect([agent005, agent006, agent007], 'given call order');
            }, 'to throw exception',
                "expected [ agent005, agent006, agent007 ] given call order\n" +
                "\n" +
                "agent005(); at theFunction (theFileName:xx:yy)\n" +
                "agent006(); at theFunction (theFileName:xx:yy)\n" +
                "// missing { spy: agent007 }"
            );
        });

        it('fails with an intelligible error message when none of the spies were called', function () {
            expect(function () {
                var agent005 = sinon.spy().named('agent005');
                var agent006 = sinon.spy().named('agent006');
                var agent007 = sinon.spy().named('agent007');
                expect([agent005, agent006, agent007], 'given call order');
            }, 'to throw exception',
                "expected [ agent005, agent006, agent007 ] given call order\n" +
                "\n" +
                "// missing { spy: agent005 }\n" +
                "// missing { spy: agent006 }\n" +
                "// missing { spy: agent007 }"
            );
        });
    });

    describe('was called on', function () {
        it('passes if the spy was ever called with obj as its this value', function () {
            var obj = {
                spy: sinon.spy()
            };
            obj.spy();
            obj.spy.call(null);
            expect(obj.spy, 'was called on', obj);
        });

        it('fails if the spy was never called with obj as its this value', function () {
            expect(function () {
                expect(spy, 'was called on', { other: true });
            }, 'to throw exception',
                "expected spy1 was called on { other: true }\n" +
                "  spy was never called"
            );
        });
    });

    describe('was always called on', function () {
        it('passes if the spy was always called with obj as its this value', function () {
            var obj = {
                spy: sinon.spy()
            };
            obj.spy();
            obj.spy();
            expect(obj.spy, 'was always called on', obj);
        });

        it('fails if the spy was called with another obj as its this value', function () {
            expect(function () {
                var obj = {
                    spy: sinon.spy().named('spy1')
                };
                obj.spy();
                obj.spy.call(null);
                expect(obj.spy, 'was always called on', obj);
            }, 'to throw exception',
                "expected spy1 was always called on { spy: spy1 }\n" +
                "\n" +
                "spy1(); at theFunction (theFileName:xx:yy)\n" +
                "spy1(); at theFunction (theFileName:xx:yy)\n" +
                "// expected: was called on { spy: spy1 }\n" +
                "//   expected spy1 to be called with { spy: spy1 } as this but was called with null"
            );
        });
    });

    describe('was called with', function () {
        it('passes if the spy was called with the provided arguments', function () {
            spy('something else');
            spy({ foo: 'bar' }, 'baz', true, false);
            expect(spy, 'was called with', { foo: 'bar' }, 'baz', expect.it('to be truthy'));
        });

        it('considers arguments to be satisfied if they satisfy Object.is', function () {
            var circular = {};
            circular.loop = circular;
            spy(circular);
            expect(spy, 'was called with', circular);
        });

        it('fails if the spy was not called with the provided arguments', function () {
            expect(function () {
                spy({ foo: 'baa' }, 'baz', true, false);
                expect(spy, 'was called with', { foo: 'bar' }, 'baz', expect.it('to be truthy'));
            }, 'to throw exception',
                "expected spy1 was called with { foo: \'bar\' }, \'baz\', expect.it('to be truthy')\n" +
                "\n" +
                "spy1(\n" +
                "  {\n" +
                "    foo: 'baa' // should equal 'bar'\n" +
                "               //\n" +
                "               // -baa\n" +
                "               // +bar\n" +
                "  },\n" +
                "  'baz',\n" +
                "  true,\n" +
                "  false\n" +
                "); at theFunction (theFileName:xx:yy)"
            );
        });
    });

    describe('was always called with', function () {
        it('passes if the spy was always called with the provided arguments', function () {
            spy({ foo: 'bar' }, 'baz', true, false);
            spy({ foo: 'bar' }, 'baz', true, false);
            expect(spy, 'was always called with', { foo: 'bar' }, 'baz', expect.it('to be truthy'));
        });

        it('fails if the spy was called once with other arguments then the provided', function () {
            expect(function () {
                spy('something else');
                spy({ foo: 'bar' }, 'baz', true, false);
                expect(spy, 'was always called with', { foo: 'bar' }, 'baz', expect.it('to be truthy'));
            }, 'to throw exception',
                "expected spy1 was always called with { foo: 'bar' }, 'baz', expect.it('to be truthy')\n" +
                "\n" +
                "spy1(\n" +
                "  'something else' // should equal { foo: 'bar' }\n" +
                "  // missing 'baz'\n" +
                "  // missing: should be truthy\n" +
                "); at theFunction (theFileName:xx:yy)\n" +
                "spy1( { foo: 'bar' }, 'baz', true, false ); at theFunction (theFileName:xx:yy)"
            );
        });

        it('renders a nice diff for extraneous arguments', function () {
            expect(function () {
                spy('a', 'b', 'c');
                expect(spy, 'was always called with exactly', 'a', 'c');
            }, 'to throw exception',
                "expected spy1 was always called with exactly 'a', 'c'\n" +
                "\n" +
                "spy1(\n" +
                "  'a',\n" +
                "  'b', // should be removed\n" +
                "  'c'\n" +
                "); at theFunction (theFileName:xx:yy)"
            );
        });

        it('renders a nice diff for missing arguments', function () {
            expect(function () {
                spy('a', 'c');
                expect(spy, 'was always called with exactly', 'a', 'b', 'c');
            }, 'to throw exception',
                "expected spy1 was always called with exactly 'a', 'b', 'c'\n" +
                "\n" +
                "spy1(\n" +
                "  'a',\n" +
                "  // missing 'b'\n" +
                "  'c'\n" +
                "); at theFunction (theFileName:xx:yy)"
            );
        });
    });

    describe('was never called with', function () {
        it('passes if the spy was never called with the provided arguments', function () {
            spy('foo', 'true');
            expect(spy, 'was never called with', 'bar', expect.it('to be truthy'));
        });

        it('fails if the spy was called with the provided arguments', function () {
            expect(function () {
                spy('bar', 'true');
                expect(spy, 'was never called with', 'bar', expect.it('to be truthy'));
            }, 'to throw exception',
                "expected spy1 was never called with 'bar', expect.it('to be truthy')\n" +
                "\n" +
                "spy1( 'bar', 'true' ); at theFunction (theFileName:xx:yy)\n" +
                "// should not satisfy { args: { 0: 'bar', 1: expect.it('to be truthy') } }"
            );
        });

        it('fails if the spy has a call that satisfies the criteria and another call that does not', function () {
            expect(function () {
                spy('foo');
                spy('bar', {});
                expect(spy, 'was never called with', 'bar');
            }, 'to throw exception',
                "expected spy1 was never called with 'bar'\n" +
                "\n" +
                "spy1( 'foo' ); at theFunction (theFileName:xx:yy)\n" +
                "spy1( 'bar', {} ); at theFunction (theFileName:xx:yy) // should not satisfy { args: { 0: 'bar' } }"
            );
        });
    });

    ['to have no calls satisfying', 'not to have calls satisfying'].forEach(function (assertion) {
        describe(assertion, function () {
            // Regression test
            it('should order the calls in the timeline correctly', function () {
                var spy2 = sinon.spy().named('spy2');
                spy(123);
                spy2(456);
                spy(123);
                return expect(function () {
                    return expect([spy, spy2], assertion, function () {
                        spy2(456);
                    });
                }, 'to error with',
                    "expected [ spy1, spy2 ] " + assertion + " spy2( 456 );\n" +
                    "\n" +
                    "spy1( 123 ); at theFunction (theFileName:xx:yy)\n" +
                    "spy2( 456 ); at theFunction (theFileName:xx:yy) // should be removed\n" +
                    "spy1( 123 ); at theFunction (theFileName:xx:yy)"
                );
            });

            it('passes if the spy was never called with the provided arguments', function () {
                spy('foo', 'true');
                expect(spy, assertion, ['bar', expect.it('to be truthy')]);
            });

            it('fails if the spy was called with the provided arguments', function () {
                expect(function () {
                    spy('bar', 'true');
                    expect(spy, assertion, ['bar', expect.it('to be truthy')]);
                }, 'to throw exception',
                    "expected spy1 " + assertion + " [ 'bar', expect.it('to be truthy') ]\n" +
                    "\n" +
                    "spy1( 'bar', 'true' ); at theFunction (theFileName:xx:yy) // should be removed"
                );
            });

            it('fails if the spy has a call that satisfies the criteria and another call that does not', function () {
                expect(function () {
                    spy('foo');
                    spy('bar', {});
                    expect(spy, assertion, { 0: 'bar' });
                }, 'to throw exception',
                    "expected spy1 " + assertion + " { 0: 'bar' }\n" +
                    "\n" +
                    "spy1( 'foo' ); at theFunction (theFileName:xx:yy)\n" +
                    "spy1( 'bar', {} ); at theFunction (theFileName:xx:yy) // should be removed"
                );
            });

            describe('when passed a sinon stub instance as the subject', function () {
                it('should succeed', function () {
                    var stubInstance = sinon.createStubInstance(MyClass);
                    stubInstance.foo(123);
                    return expect(stubInstance, assertion, function () {
                        stubInstance.foo(456);
                    });
                });

                it('should fail with a diff', function () {
                    var stubInstance = sinon.createStubInstance(MyClass);
                    stubInstance.foo(123);
                    stubInstance.bar(456);
                    stubInstance.foo(123);
                    return expect(function () {
                        return expect(stubInstance, assertion, function () {
                            stubInstance.bar(456);
                        });
                    }, 'to error with',
                        "expected MyClass({ foo, bar }) " + assertion + " bar( 456 );\n" +
                        "\n" +
                        "foo( 123 ); at theFunction (theFileName:xx:yy)\n" +
                        "bar( 456 ); at theFunction (theFileName:xx:yy) // should be removed\n" +
                        "foo( 123 ); at theFunction (theFileName:xx:yy)"
                    );
                });

                it('should dot out the list of contained spies when they exceed expect.output.preferredWidth', function () {
                    expect.output.preferredWidth = 45;
                    var stubInstance = sinon.createStubInstance(MyClass);
                    stubInstance.foo(123);
                    stubInstance.bar(456);
                    stubInstance.foo(123);
                    return expect(function () {
                        return expect(stubInstance, assertion, function () {
                            stubInstance.bar(456);
                        });
                    }, 'to error with',
                        "expected MyClass({ foo /* 1 more */ })\n" +
                        assertion + " bar( 456 );\n" +
                        "\n" +
                        "foo( 123 ); at theFunction (theFileName:xx:yy)\n" +
                        "bar( 456 ); at theFunction (theFileName:xx:yy) // should be removed\n" +
                        "foo( 123 ); at theFunction (theFileName:xx:yy)"
                    );
                });
            });

            describe('when passed an array of sinon stub instances as the subject', function () {
                it('should succeed', function () {
                    var stubInstance1 = sinon.createStubInstance(MyClass);
                    stubInstance1.foo(123);
                    var stubInstance2 = sinon.createStubInstance(MyClass);
                    stubInstance2.foo(123);
                    return expect([stubInstance1, stubInstance2], assertion, function () {
                        stubInstance1.foo(456);
                    });
                });

                it('should fail with a diff', function () {
                    var stubInstance1 = sinon.createStubInstance(MyClass);
                    stubInstance1.foo(123);
                    var stubInstance2 = sinon.createStubInstance(MyClass);
                    stubInstance2.foo(123);
                    return expect(function () {
                        return expect([stubInstance1, stubInstance2], assertion, function () {
                            stubInstance1.foo(123);
                        });
                    }, 'to error with',
                        "expected [ MyClass({ foo, bar }), MyClass({ foo, bar }) ] " + assertion + " foo( 123 );\n" +
                        "\n" +
                        "foo( 123 ); at theFunction (theFileName:xx:yy)\n" +
                        "foo( 123 ); at theFunction (theFileName:xx:yy) // should be removed"
                    );
                });
            });

            describe('when passed a spec object', function () {
                it('should succeed when no spy call satisfies the spec', function () {
                    spy(123, 456);
                    expect(spy, assertion, {
                        args: [ 789 ]
                    });
                });

                it('should fail when the spy was called with the provided parameters', function () {
                    spy(456);
                    spy(567);
                    expect(function () {
                        expect(spy, assertion, {
                            args: [ 456 ]
                        });
                    }, 'to throw',
                        "expected spy1 " + assertion + " { args: [ 456 ] }\n" +
                        "\n" +
                        "spy1( 456 ); at theFunction (theFileName:xx:yy) // should be removed\n" +
                        "spy1( 567 ); at theFunction (theFileName:xx:yy)"
                    );
                });
            });

            describe('when passed an array (shorthand for {args: ...})', function () {
                it('should succeed', function () {
                    spy(123, { foo: 'baz' });
                    expect(spy, assertion, [ 123, { foo: 'bar' } ]);
                });

                it('should fail with a diff', function () {
                    expect(function () {
                        spy(123, { foo: 'bar' });
                        expect(spy, assertion, [ 123, { foo: 'bar' } ]);
                    }, 'to throw',
                        "expected spy1 " + assertion + " [ 123, { foo: 'bar' } ]\n" +
                        "\n" +
                        "spy1( 123, { foo: 'bar' } ); at theFunction (theFileName:xx:yy) // should be removed"
                    );
                });
            });

            describe('when passed an array with only numerical properties (shorthand for {args: ...})', function () {
                it('should succeed', function () {
                    spy(123, { foo: 'bar' });
                    expect(spy, assertion, {0: 123, 1: {foo: 'baz'}});
                });

                it('should fail with a diff', function () {
                    expect(function () {
                        spy(123, { foo: 'baz' });
                        expect(spy, assertion, {0: 123, 1: {foo: 'baz'}});
                    }, 'to throw',
                        "expected spy1 " + assertion + " { 0: 123, 1: { foo: 'baz' } }\n" +
                        "\n" +
                        "spy1( 123, { foo: 'baz' } ); at theFunction (theFileName:xx:yy) // should be removed"
                    );
                });
            });

            describe('when passed a function that performs the expected call', function () {
                it('should succeed when a spy call satisfies the spec', function () {
                    spy(123, 789);
                    expect(spy, assertion, function () {
                        spy(123, 456);
                    });
                });

                it('should fail if the function does not call the spy', function () {
                    expect(function () {
                        expect(spy, assertion, function () {});
                    }, 'to throw',
                        "expected spy1 " + assertion + " function () {}\n" +
                        "  expected the provided function to call the spy exactly once, but it called it 0 times"
                    );
                });

                it('should fail if the function calls the spy more than once', function () {
                    expect(function () {
                        expect(spy, assertion, function () {
                            spy(123);
                            spy(456);
                        });
                    }, 'to throw',
                        "expected spy1 " + assertion + "\n" +
                        "spy1( 123 );\n" +
                        "spy1( 456 );\n" +
                        "  expected the provided function to call the spy exactly once, but it called it 2 times"
                    );
                });

                it('should fail when the spy was called with the given arguments', function () {
                    spy(123);
                    spy(456);
                    expect(function () {
                        expect(spy, assertion, function () {
                            spy(456);
                        });
                    }, 'to throw',
                        "expected spy1 " + assertion + " spy1( 456 );\n" +
                        "\n" +
                        "spy1( 123 ); at theFunction (theFileName:xx:yy)\n" +
                        "spy1( 456 ); at theFunction (theFileName:xx:yy) // should be removed"
                    );
                });
            });

            describe('when passed a sinon sandbox as the subject', function () {
                it('should succeed', function () {
                    var sandbox = sinon.sandbox.create();
                    var spy1 = sandbox.spy().named('spy1');
                    var spy2 = sandbox.spy().named('spy2');
                    spy1(123);
                    spy2(456);
                    return expect(sandbox, assertion, { spy: spy1, args: [ 789 ] });
                });

                it('should fail with a diff', function () {
                    var sandbox = sinon.sandbox.create();
                    var spy1 = sandbox.spy().named('spy1');
                    spy1(456);
                    return expect(function () {
                        return expect(sandbox, assertion, { spy: spy1, args: [ 456 ] });
                    }, 'to error with',
                        "expected sinon sandbox " + assertion + " { spy: spy1, args: [ 456 ] }\n" +
                        "\n" +
                        "spy1( 456 ); at theFunction (theFileName:xx:yy) // should be removed"
                    );
                });
            });

            describe('when passed an array of spies as the subject', function () {
                it('should succeed', function () {
                    var spy1 = sinon.spy().named('spy1');
                    var spy2 = sinon.spy().named('spy2');
                    spy1(123);
                    spy2(456);
                    return expect([spy1, spy2], assertion, { spy: spy1, args: [ 789 ] });
                });

                it('should fail with a diff', function () {
                    var sandbox = sinon.sandbox.create();
                    var spy1 = sandbox.spy().named('spy1');
                    var spy2 = sandbox.spy().named('spy2');
                    spy1(123);
                    spy2(456);
                    return expect(function () {
                        return expect([spy1, spy2], assertion, { spy: spy1, args: [ 123 ] });
                    }, 'to error with',
                        "expected [ spy1, spy2 ] " + assertion + " { spy: spy1, args: [ 123 ] }\n" +
                        "\n" +
                        "spy1( 123 ); at theFunction (theFileName:xx:yy) // should be removed\n" +
                        "spy2( 456 ); at theFunction (theFileName:xx:yy)"
                    );
                });
            });
        });
    });

    describe('was called with exactly', function () {
        it('passes if the spy was called with the provided arguments and no others', function () {
            spy('foo', 'bar', 'baz');
            spy('foo', 'bar', 'baz');
            expect(spy, 'was called with exactly', 'foo', 'bar', expect.it('to be truthy'));
        });

        it('fails if the spy was never called with the provided arguments and no others', function () {
            expect(function () {
                spy('foo', 'bar', 'baz', 'qux');
                expect(spy, 'was called with exactly', 'foo', 'bar', expect.it('to be truthy'));
            }, 'to throw exception',
                "expected spy1 was called with exactly 'foo', 'bar', expect.it('to be truthy')\n" +
                "\n" +
                "spy1(\n" +
                "  'foo',\n" +
                "  'bar',\n" +
                "  'baz',\n" +
                "  'qux' // should be removed\n" +
                "); at theFunction (theFileName:xx:yy)"
            );
        });
    });

    describe('was always called with exactly', function () {
        it('passes if the spy was always called with the provided arguments and no others', function () {
            spy('foo', 'bar', 'baz');
            spy('foo', 'bar', 'baz');
            expect(spy, 'was always called with exactly', 'foo', 'bar', expect.it('to be truthy'));
        });

        it('fails if the spy was ever called with anything else than the provided arguments', function () {
            expect(function () {
                spy('foo', 'bar', 'baz');
                spy('foo', 'bar', 'baz', 'qux');
                expect(spy, 'was always called with exactly', 'foo', 'bar', expect.it('to be truthy'));
            }, 'to throw exception',
                "expected spy1 was always called with exactly 'foo', 'bar', expect.it('to be truthy')\n" +
                "\n" +
                "spy1( 'foo', 'bar', 'baz' ); at theFunction (theFileName:xx:yy)\n" +
                "spy1(\n" +
                "  'foo',\n" +
                "  'bar',\n" +
                "  'baz',\n" +
                "  'qux' // should be removed\n" +
                "); at theFunction (theFileName:xx:yy)"
            );
        });
    });

    describe('threw', function () {
        describe('without arguments', function () {
            it('passes if the spy threw an exception', function () {
                var stub = sinon.stub();
                stub.throws();
                try { stub(); } catch (e) {}
                expect(stub, 'threw');
            });

            it('fails if the spy never threw an exception', function () {
                expect(function () {
                    expect(spy, 'threw');
                }, 'to throw exception', /spy did not throw exception/);
            });
        });

        describe('given a string as argument', function () {
            it('passes if the spy threw an exception of the given type', function () {
                var stub = sinon.stub();
                stub.throws('TypeError');
                try { stub(); } catch (e) {}
                expect(stub, 'threw', { name: 'TypeError' });
            });

            it('fails if the spy never threw an exception of the given type', function () {
                expect(function () {
                    var stub = sinon.stub();
                    stub.throws('Error');
                    try { stub(); } catch (e) {}
                    expect(stub, 'threw', { name: 'TypeError' });
                }, 'to throw exception',
                    "expected stub threw { name: 'TypeError' }\n" +
                    "\n" +
                    "stub(); at theFunction (theFileName:xx:yy) // expected: threw { name: 'TypeError' }\n" +
                    "                                           //   expected Error() to satisfy { name: 'TypeError' }\n" +
                    "                                           //\n" +
                    "                                           //   {\n" +
                    "                                           //     message: '',\n" +
                    "                                           //     name: 'Error' // should equal 'TypeError'\n" +
                    "                                           //                   //\n" +
                    "                                           //                   // -Error\n" +
                    "                                           //                   // +TypeError\n" +
                    "                                           //   }"
                );
            });
        });

        describe('given a object as argument', function () {
            it('passes if the spy threw the given exception', function () {
                var stub = sinon.stub();
                var error = new Error();
                stub.throws(error);
                try { stub(); } catch (e) {}
                expect(stub, 'threw', error);
            });

            it('fails if the spy never threw the given exception', function () {
                expect(function () {
                    var stub = sinon.stub();
                    stub.throws(new TypeError());
                    try { stub(); } catch (e) {}
                    expect(stub, 'threw', new Error());
                }, 'to throw exception',
                    "expected stub threw Error()\n" +
                    "\n" +
                    "stub(); at theFunction (theFileName:xx:yy) // expected: threw Error()\n" +
                    "                                           //   expected TypeError() to satisfy Error()"
                );
            });
        });
    });

    describe('always threw', function () {
        describe('without arguments', function () {
            it('passes if the spy always threw an exception', function () {
                var stub = sinon.stub();
                stub.throws();
                try { stub(); } catch (e) {}
                try { stub(); } catch (e) {}
                expect(stub, 'always threw');
            });

            it('fails if the spy did not always threw an exception', function () {
                expect(function () {
                    var hasThrown = false;
                    var spy = sinon.spy(function () {
                        if (!hasThrown) {
                            hasThrown = true;
                            throw Error();
                        }
                    }).named('spy1');
                    try { spy(); } catch (e) {}
                    spy();
                    expect(spy, 'always threw');
                }, 'to throw exception',
                    "expected spy1 always threw\n" +
                    "\n" +
                    "spy1(); at theFunction (theFileName:xx:yy)\n" +
                    "spy1(); at theFunction (theFileName:xx:yy) // expected: threw"
                );
            });
        });

        describe('given a string as argument', function () {
            it('passes if the spy always threw an exception of the given type', function () {
                var stub = sinon.stub();
                stub.throws('Error');
                try { stub(); } catch (e) {}
                try { stub(); } catch (e) {}
                expect(stub, 'always threw', { name: 'Error' });
            });

            it('fails if the spy did not always threw an exception of the given type', function () {
                expect(function () {
                    var stub = sinon.stub();
                    stub.throws('Error');
                    try { stub(); } catch (e) {}
                    stub.throws('TypeError');
                    try { stub(); } catch (e) {}
                    expect(stub, 'always threw', { name: 'Error' });
                }, 'to throw exception',
                    "expected stub always threw { name: 'Error' }\n" +
                    "\n" +
                    "stub(); at theFunction (theFileName:xx:yy)\n" +
                    "stub(); at theFunction (theFileName:xx:yy) // expected: threw { name: 'Error' }\n" +
                    "                                           //   expected TypeError() to satisfy { name: 'Error' }\n" +
                    "                                           //\n" +
                    "                                           //   {\n" +
                    "                                           //     message: '',\n" +
                    "                                           //     name: 'TypeError' // should equal 'Error'\n" +
                    "                                           //                       //\n" +
                    "                                           //                       // -TypeError\n" +
                    "                                           //                       // +Error\n" +
                    "                                           //   }"
                );
            });
        });

        describe('given a object as argument', function () {
            it('passes if the spy always threw the given exception', function () {
                var stub = sinon.stub();
                var error = new Error();
                stub.throws(error);
                try { stub(); } catch (e) {}
                try { stub(); } catch (e) {}
                expect(stub, 'always threw', error);
            });

            it('fails if the spy did not always threw the given exception', function () {
                expect(function () {
                    var stub = sinon.stub();
                    var error = new Error();
                    stub.throws(error);
                    try { stub(); } catch (e) {}
                    stub.throws(new TypeError());
                    try { stub(); } catch (e) {}
                    expect(stub, 'always threw', error);
                }, 'to throw exception',
                    "expected stub always threw Error()\n" +
                    "\n" +
                    "stub(); at theFunction (theFileName:xx:yy)\n" +
                    "stub(); at theFunction (theFileName:xx:yy) // expected: threw Error()\n" +
                    "                                           //   expected TypeError() to satisfy Error()"
                );
            });
        });
    });

    describe('spyCall to satisfy', function () {
        it('should throw if an unsupported key is used', function () {
            expect(function () {
                spy(123);
                expect(spy, 'to have calls satisfying', [
                    { foobar: 123 }
                ]);
            }, 'to throw', 'spyCall to satisfy: Unsupported keys: foobar');
        });
    });

    describe('to have a call satisfying', function () {
        describe('when passed a sinon stub instance as the subject', function () {
            it('should succeed', function () {
                var stubInstance = sinon.createStubInstance(MyClass);
                stubInstance.foo(123);
                stubInstance.foo(456);
                return expect(stubInstance, 'to have a call satisfying', function () {
                    stubInstance.foo(123);
                });
            });

            it('should fail with a diff', function () {
                var stubInstance = sinon.createStubInstance(MyClass);
                stubInstance.foo(123);
                stubInstance.bar(456);
                stubInstance.foo(123);
                return expect(function () {
                    return expect(stubInstance, 'to have a call satisfying', function () {
                        stubInstance.bar(789);
                    });
                }, 'to error with',
                    "expected MyClass({ foo, bar }) to have a call satisfying bar( 789 );\n" +
                    "\n" +
                    "foo( 123 ); at theFunction (theFileName:xx:yy) // should be bar( 789 );\n" +
                    "bar(\n" +
                    "  456 // should equal 789\n" +
                    "); at theFunction (theFileName:xx:yy)\n" +
                    "foo( 123 ); at theFunction (theFileName:xx:yy) // should be bar( 789 );"
                );
            });
        });
        describe('when passed a spec object', function () {
            it('should succeed when a spy call satisfies the spec', function () {
                spy(123, 456);
                expect(spy, 'to have a call satisfying', {
                    args: [ 123, 456 ]
                });
            });

            it('should fail when the spy was not called at all', function () {
                expect(function () {
                    expect(spy, 'to have a call satisfying', {
                        args: [ 123, 456 ]
                    });
                }, 'to throw',
                    "expected spy1 to have a call satisfying { args: [ 123, 456 ] }\n" +
                    "  expected [] to have items satisfying { args: [ 123, 456 ] }\n" +
                    "    expected [] to be non-empty"
                );
            });

            it('should fail when the spy was called but never with the right arguments', function () {
                spy(456);
                spy(567);
                expect(function () {
                    expect(spy, 'to have a call satisfying', {
                        args: [ 123, 456 ]
                    });
                }, 'to throw',
                    "expected spy1 to have a call satisfying { args: [ 123, 456 ] }\n" +
                    "\n" +
                    "spy1(\n" +
                    "  // missing 123\n" +
                    "  456\n" +
                    "); at theFunction (theFileName:xx:yy)\n" +
                    "spy1(\n" +
                    "  567 // should equal 123\n" +
                    "  // missing 456\n" +
                    "); at theFunction (theFileName:xx:yy)"
                );
            });

            describe('with the exhaustively flag', function () {
                it('should succeed when a spy call satisfies the spec', function () {
                    spy(123, { foo: 'bar' });
                    expect(spy, 'to have a call satisfying', {
                        args: [ 123, { foo: 'bar' } ]
                    });
                });

                it('should fail when a spy call does not satisfy the spec only because of the "exhaustively" semantics', function () {
                    spy(123, { foo: 'bar', quux: 'baz' });
                    expect(function () {
                        expect(spy, 'to have a call exhaustively satisfying', {
                            args: [ 123, { foo: 'bar' } ]
                        });
                    }, 'to throw',
                        "expected spy1 to have a call exhaustively satisfying { args: [ 123, { foo: 'bar' } ] }\n" +
                        "\n" +
                        "spy1(\n" +
                        "  123,\n" +
                        "  {\n" +
                        "    foo: 'bar',\n" +
                        "    quux: 'baz' // should be removed\n" +
                        "  }\n" +
                        "); at theFunction (theFileName:xx:yy)"
                    );
                });
            });
        });

        describe('when passed an array (shorthand for {args: ...})', function () {
            it('should succeed', function () {
                spy(123, { foo: 'bar' });
                expect(spy, 'to have a call satisfying', [ 123, { foo: 'bar' } ]);
            });

            it('should fail with a diff', function () {
                expect(function () {
                    spy(123, { foo: 'bar' });
                    expect(spy, 'to have a call satisfying', [ 123, { foo: 'baz' } ]);
                }, 'to throw',
                    "expected spy1 to have a call satisfying [ 123, { foo: 'baz' } ]\n" +
                    "\n" +
                    "spy1(\n" +
                    "  123,\n" +
                    "  {\n" +
                    "    foo: 'bar' // should equal 'baz'\n" +
                    "               //\n" +
                    "               // -bar\n" +
                    "               // +baz\n" +
                    "  }\n" +
                    "); at theFunction (theFileName:xx:yy)"
                );
            });
        });

        describe('when passed an array with only numerical properties (shorthand for {args: ...})', function () {
            it('should succeed', function () {
                spy(123, { foo: 'bar' });
                expect(spy, 'to have a call satisfying', {0: 123, 1: {foo: 'bar'}});
            });

            it('should fail with a diff', function () {
                expect(function () {
                    spy(123, { foo: 'bar' });
                    expect(spy, 'to have a call satisfying', {0: 123, 1: {foo: 'baz'}});
                }, 'to throw',
                    "expected spy1 to have a call satisfying { 0: 123, 1: { foo: 'baz' } }\n" +
                    "\n" +
                    "spy1(\n" +
                    "  123,\n" +
                    "  {\n" +
                    "    foo: 'bar' // should equal 'baz'\n" +
                    "               //\n" +
                    "               // -bar\n" +
                    "               // +baz\n" +
                    "  }\n" +
                    "); at theFunction (theFileName:xx:yy)"
                );
            });
        });

        describe('when passed a function that performs the expected call', function () {
            it('should succeed when a spy call satisfies the spec', function () {
                spy(123, 456);
                expect(spy, 'to have a call satisfying', function () {
                    spy(123, 456);
                });
            });

            it('should fail if the function does not call the spy', function () {
                expect(function () {
                    expect(spy, 'to have a call satisfying', function () {});
                }, 'to throw',
                    "expected spy1 to have a call satisfying function () {}\n" +
                    "  expected the provided function to call the spy exactly once, but it called it 0 times"
                );
            });

            it('should fail if the function calls the spy more than once', function () {
                expect(function () {
                    expect(spy, 'to have a call satisfying', function () {
                        spy(123);
                        spy(456);
                    });
                }, 'to throw',
                    "expected spy1 to have a call satisfying\n" +
                    "spy1( 123 );\n" +
                    "spy1( 456 );\n" +
                    "  expected the provided function to call the spy exactly once, but it called it 2 times"
                );
            });

            it('should fail when the spy was called but never with the right arguments', function () {
                spy(123);
                spy(456);
                expect(function () {
                    expect(spy, 'to have a call satisfying', function () {
                        spy(789);
                    });
                }, 'to throw',
                    "expected spy1 to have a call satisfying spy1( 789 );\n" +
                    "\n" +
                    "spy1(\n" +
                    "  123 // should equal 789\n" +
                    "); at theFunction (theFileName:xx:yy)\n" +
                    "spy1(\n" +
                    "  456 // should equal 789\n" +
                    "); at theFunction (theFileName:xx:yy)"
                );
            });
        });

        describe('when passed a sinon sandbox as the subject', function () {
            it('should succeed', function () {
                var sandbox = sinon.sandbox.create();
                var spy1 = sandbox.spy().named('spy1');
                var spy2 = sandbox.spy().named('spy2');
                spy1(123);
                spy2(456);
                return expect(sandbox, 'to have a call satisfying', { spy: spy1, args: [ 123 ] });
            });

            it('should fail with a diff', function () {
                var sandbox = sinon.sandbox.create();
                var spy1 = sandbox.spy().named('spy1');
                spy1(456);
                return expect(function () {
                    return expect(sandbox, 'to have a call satisfying', { spy: spy1, args: [ 123 ] });
                }, 'to error with',
                    "expected sinon sandbox to have a call satisfying { spy: spy1, args: [ 123 ] }\n" +
                    "\n" +
                    "spy1(\n" +
                    "  456 // should equal 123\n" +
                    "); at theFunction (theFileName:xx:yy)"
                );
            });
        });

        describe('when passed an array of spies as the subject', function () {
            it('should succeed', function () {
                var spy1 = sinon.spy().named('spy1');
                var spy2 = sinon.spy().named('spy2');
                spy1(123);
                spy2(456);
                return expect([spy1, spy2], 'to have a call satisfying', { spy: spy1, args: [ 123 ] });
            });

            it('should fail with a diff', function () {
                var sandbox = sinon.sandbox.create();
                var spy1 = sandbox.spy().named('spy1');
                var spy2 = sandbox.spy().named('spy2');
                spy1(123);
                spy2(456);
                return expect(function () {
                    return expect([spy1, spy2], 'to have a call satisfying', { spy: spy1, args: [ 789 ] });
                }, 'to error with',
                    "expected [ spy1, spy2 ] to have a call satisfying { spy: spy1, args: [ 789 ] }\n" +
                    "\n" +
                    "spy1(\n" +
                    "  123 // should equal 789\n" +
                    "); at theFunction (theFileName:xx:yy)\n" +
                    "spy2( 456 ); at theFunction (theFileName:xx:yy) // should be spy1( 789 );"
                );
            });
        });
    });

    describe('to have all calls satisfying', function () {
        describe('when passed a sinon stub instance as the subject', function () {
            it('should succeed', function () {
                var stubInstance = sinon.createStubInstance(MyClass);
                stubInstance.foo(123);
                stubInstance.foo(123);
                return expect(stubInstance, 'to have all calls satisfying', function () {
                    stubInstance.foo(123);
                });
            });

            it('should fail with a diff', function () {
                var stubInstance = sinon.createStubInstance(MyClass);
                stubInstance.foo(123);
                stubInstance.bar(456);
                stubInstance.foo(123);
                return expect(function () {
                    return expect(stubInstance, 'to have all calls satisfying', function () {
                        stubInstance.bar(456);
                    });
                }, 'to error with',
                    "expected MyClass({ foo, bar }) to have all calls satisfying bar( 456 );\n" +
                    "\n" +
                    "foo( 123 ); at theFunction (theFileName:xx:yy) // should be bar( 456 );\n" +
                    "bar( 456 ); at theFunction (theFileName:xx:yy)\n" +
                    "foo( 123 ); at theFunction (theFileName:xx:yy) // should be bar( 456 );"
                );
            });
        });

        describe('when passed a spec object', function () {
            it('should succeed when a spy call satisfies the spec', function () {
                spy(123, 456);
                expect(spy, 'to have all calls satisfying', {
                    args: [ 123, 456 ]
                });
            });

            it('should fail when the spy was not called at all', function () {
                expect(function () {
                    expect(spy, 'to have all calls satisfying', {
                        args: [ 123, 456 ]
                    });
                }, 'to throw',
                    "expected spy1 to have all calls satisfying { args: [ 123, 456 ] }\n" +
                    "  expected [] to have items satisfying { args: [ 123, 456 ] }\n" +
                    "    expected [] to be non-empty"
                );
            });

            it('should fail when one of the calls had the wrong arguments', function () {
                spy(456);
                spy(567);
                expect(function () {
                    expect(spy, 'to have all calls satisfying', {
                        args: [ 456 ]
                    });
                }, 'to throw',
                    "expected spy1 to have all calls satisfying { args: [ 456 ] }\n" +
                    "\n" +
                    "spy1( 456 ); at theFunction (theFileName:xx:yy)\n" +
                    "spy1(\n" +
                    "  567 // should equal 456\n" +
                    "); at theFunction (theFileName:xx:yy)"
                );
            });

            describe('with the exhaustively flag', function () {
                it('should succeed when a spy call satisfies the spec', function () {
                    spy(123, { foo: 'bar' });
                    expect(spy, 'to have all calls satisfying', {
                        args: [ 123, { foo: 'bar' } ]
                    });
                });

                it('should fail when a spy call does not satisfy the spec only because of the "exhaustively" semantics', function () {
                    spy(123, { foo: 'bar', quux: 'baz' });
                    expect(function () {
                        expect(spy, 'to have all calls exhaustively satisfying', {
                            args: [ 123, { foo: 'bar' } ]
                        });
                    }, 'to throw',
                        "expected spy1 to have all calls exhaustively satisfying { args: [ 123, { foo: 'bar' } ] }\n" +
                        "\n" +
                        "spy1(\n" +
                        "  123,\n" +
                        "  {\n" +
                        "    foo: 'bar',\n" +
                        "    quux: 'baz' // should be removed\n" +
                        "  }\n" +
                        "); at theFunction (theFileName:xx:yy)"
                    );
                });
            });
        });

        describe('when passed an array (shorthand for {args: ...})', function () {
            it('should succeed', function () {
                spy(123, { foo: 'bar' });
                expect(spy, 'to have all calls satisfying', [ 123, { foo: 'bar' } ]);
            });

            it('should fail with a diff', function () {
                expect(function () {
                    spy(123, { foo: 'bar' });
                    expect(spy, 'to have all calls satisfying', [ 123, { foo: 'baz' } ]);
                }, 'to throw',
                    "expected spy1 to have all calls satisfying [ 123, { foo: 'baz' } ]\n" +
                    "\n" +
                    "spy1(\n" +
                    "  123,\n" +
                    "  {\n" +
                    "    foo: 'bar' // should equal 'baz'\n" +
                    "               //\n" +
                    "               // -bar\n" +
                    "               // +baz\n" +
                    "  }\n" +
                    "); at theFunction (theFileName:xx:yy)"
                );
            });
        });

        describe('when passed an array with only numerical properties (shorthand for {args: ...})', function () {
            it('should succeed', function () {
                spy(123, { foo: 'bar' });
                expect(spy, 'to have all calls satisfying', {0: 123, 1: {foo: 'bar'}});
            });

            it('should fail with a diff', function () {
                expect(function () {
                    spy(123, { foo: 'bar' });
                    expect(spy, 'to have all calls satisfying', {0: 123, 1: {foo: 'baz'}});
                }, 'to throw',
                    "expected spy1 to have all calls satisfying { 0: 123, 1: { foo: 'baz' } }\n" +
                    "\n" +
                    "spy1(\n" +
                    "  123,\n" +
                    "  {\n" +
                    "    foo: 'bar' // should equal 'baz'\n" +
                    "               //\n" +
                    "               // -bar\n" +
                    "               // +baz\n" +
                    "  }\n" +
                    "); at theFunction (theFileName:xx:yy)"
                );
            });
        });

        describe('when passed a function that performs the expected call', function () {
            it('should succeed when a spy call satisfies the spec', function () {
                spy(123, 456);
                expect(spy, 'to have all calls satisfying', function () {
                    spy(123, 456);
                });
            });

            it('should fail if the function does not call the spy', function () {
                expect(function () {
                    expect(spy, 'to have all calls satisfying', function () {});
                }, 'to throw',
                    "expected spy1 to have all calls satisfying function () {}\n" +
                    "  expected the provided function to call the spy exactly once, but it called it 0 times"
                );
            });

            it('should fail if the function calls the spy more than once', function () {
                expect(function () {
                    expect(spy, 'to have all calls satisfying', function () {
                        spy(123);
                        spy(456);
                    });
                }, 'to throw',
                    "expected spy1 to have all calls satisfying\n" +
                    "spy1( 123 );\n" +
                    "spy1( 456 );\n" +
                    "  expected the provided function to call the spy exactly once, but it called it 2 times"
                );
            });

            it('should fail when the spy was called, but one of the calls had the wrong arguments', function () {
                spy(123);
                spy(456);
                expect(function () {
                    expect(spy, 'to have all calls satisfying', function () {
                        spy(123);
                    });
                }, 'to throw',
                    "expected spy1 to have all calls satisfying spy1( 123 );\n" +
                    "\n" +
                    "spy1( 123 ); at theFunction (theFileName:xx:yy)\n" +
                    "spy1(\n" +
                    "  456 // should equal 123\n" +
                    "); at theFunction (theFileName:xx:yy)"
                );
            });
        });

        describe('when passed a sinon sandbox as the subject', function () {
            it('should succeed', function () {
                var sandbox = sinon.sandbox.create();
                var spy1 = sandbox.spy().named('spy1');
                sandbox.spy().named('spy2');
                spy1(123);
                spy1(123);
                return expect(sandbox, 'to have all calls satisfying', { spy: spy1, args: [ 123 ] });
            });

            it('should fail with a diff', function () {
                var sandbox = sinon.sandbox.create();
                var spy1 = sandbox.spy().named('spy1');
                spy1(456);
                return expect(function () {
                    return expect(sandbox, 'to have all calls satisfying', { spy: spy1, args: [ 123 ] });
                }, 'to error with',
                    "expected sinon sandbox to have all calls satisfying { spy: spy1, args: [ 123 ] }\n" +
                    "\n" +
                    "spy1(\n" +
                    "  456 // should equal 123\n" +
                    "); at theFunction (theFileName:xx:yy)"
                );
            });
        });

        describe('when passed an array of spies as the subject', function () {
            it('should succeed', function () {
                var spy1 = sinon.spy().named('spy1');
                var spy2 = sinon.spy().named('spy2');
                spy1(123);
                return expect([spy1, spy2], 'to have all calls satisfying', { spy: spy1, args: [ 123 ] });
            });

            it('should fail with a diff', function () {
                var sandbox = sinon.sandbox.create();
                var spy1 = sandbox.spy().named('spy1');
                var spy2 = sandbox.spy().named('spy2');
                spy1(123);
                spy2(456);
                return expect(function () {
                    return expect([spy1, spy2], 'to have all calls satisfying', { spy: spy1, args: [ 123 ] });
                }, 'to error with',
                    "expected [ spy1, spy2 ] to have all calls satisfying { spy: spy1, args: [ 123 ] }\n" +
                    "\n" +
                    "spy1( 123 ); at theFunction (theFileName:xx:yy)\n" +
                    "spy2( 456 ); at theFunction (theFileName:xx:yy) // should be spy1( 123 );"
                );
            });
        });
    });

    describe('to have calls satisfying', function () {
        it('should complain if the args value is passed as an object with non-numerical properties', function () {
            spy(123);
            expect(function () {
                expect(spy, 'to have calls satisfying', [ { args: { foo: 123 } } ]);
            }, 'to throw',
                'expected spy1 to have calls satisfying [ { args: { foo: 123 } } ]\n' +
                '\n' +
                'spy1( 123 ); at theFunction (theFileName:xx:yy) // unsupported value in spy call spec: { foo: 123 }'
            );
        });

        it('should render a swapped expected call sensibly', function () {
            var spy1 = sinon.spy().named('spy1');
            var spy2 = sinon.spy().named('spy2');
            var spy3 = sinon.spy().named('spy3');
            spy1(123);
            spy2(456);
            spy3(789);
            expect(function () {
                expect([spy1, spy2, spy3], 'to have calls satisfying', function () {
                    spy1(123);
                    spy3(789);
                    spy2(456);
                });
            }, 'to throw',
                "expected [ spy1, spy2, spy3 ] to have calls satisfying\n" +
                "spy1( 123 );\n" +
                "spy3( 789 );\n" +
                "spy2( 456 );\n" +
                "\n" +
                "    spy1( 123 ); at theFunction (theFileName:xx:yy)\n" +
                "┌─▷\n" +
                "│   spy2( 456 ); at theFunction (theFileName:xx:yy)\n" +
                "└── spy3( 789 ); at theFunction (theFileName:xx:yy) // should be moved"
            );
        });

        it('should render a swapped actual function call sensibly', function () {
            var spy1 = sinon.spy().named('spy1');
            var spy2 = sinon.spy().named('spy2');
            var spy3 = sinon.spy().named('spy3');
            spy1(123);
            spy3(789);
            spy2(456);
            expect(function () {
                expect([spy1, spy2, spy3], 'to have calls satisfying', function () {
                    spy1(123);
                    spy2(456);
                    spy3(789);
                });
            }, 'to throw',
                "expected [ spy1, spy2, spy3 ] to have calls satisfying\n" +
                "spy1( 123 );\n" +
                "spy2( 456 );\n" +
                "spy3( 789 );\n" +
                "\n" +
                "    spy1( 123 ); at theFunction (theFileName:xx:yy)\n" +
                "┌─▷\n" +
                "│   spy3( 789 ); at theFunction (theFileName:xx:yy)\n" +
                "└── spy2( 456 ); at theFunction (theFileName:xx:yy) // should be moved"
            );
        });

        it('should render the wrong spy being called with no expectation for the arguments', function () {
            var spy1 = sinon.spy().named('spy1');
            var spy2 = sinon.spy().named('spy2');
            spy1(123);
            expect(function () {
                expect([spy1, spy2], 'to have calls satisfying', [ { spy: spy2 } ]);
            }, 'to throw',
                "expected [ spy1, spy2 ] to have calls satisfying [ { spy: spy2 } ]\n" +
                "\n" +
                "spy1( 123 ); at theFunction (theFileName:xx:yy) // should be spy2"
            );
        });

        it('should satisfy against a list of all calls to the specified spies', function () {
            var spy2 = sinon.spy(function spy2() {
                return 'blah';
            });

            var obj = {
                die: function () {
                    throw new Error('say what');
                }
            };
            sinon.spy(obj, 'die');

            spy('foo', 'bar');
            spy2('quux');
            try {
                obj.die();
            } catch (err) {}
            spy('baz');
            spy2('yadda');
            spy('baz');
            expect(function () {
                expect([spy, spy2, obj.die], 'to have calls satisfying', [
                    spy,
                    { spy: spy2, args: [ 'quux' ], returned: 'yadda' },
                    { spy: obj.die, threw: /cqwecqw/ },
                    { spy: spy, args: [ 'yadda' ] },
                    spy,
                    spy
                ]);
            }, 'to throw',
                "expected [ spy1, spy2, die ] to have calls satisfying\n" +
                "[\n" +
                "  spy1,\n" +
                "  { spy: spy2, args: [ 'quux' ], returned: 'yadda' },\n" +
                "  { spy: die, threw: /cqwecqw/ },\n" +
                "  { spy: spy1, args: [ 'yadda' ] },\n" +
                "  spy1,\n" +
                "  spy1\n" +
                "]\n" +
                "\n" +
                "    spy1( 'foo', 'bar' ); at theFunction (theFileName:xx:yy)\n" +
                "    spy2( 'quux' ); at theFunction (theFileName:xx:yy) // returned: expected 'blah' to equal 'yadda'\n" +
                "                                                       //\n" +
                "                                                       //           -blah\n" +
                "                                                       //           +yadda\n" +
                "    // missing { spy: die, threw: /cqwecqw/ }\n" +
                "┌─▷\n" +
                "│   die(); at theFunction (theFileName:xx:yy) // should be removed\n" +
                "│   spy1( 'baz' ); at theFunction (theFileName:xx:yy)\n" +
                "└── spy2( 'yadda' ); at theFunction (theFileName:xx:yy) // should be moved\n" +
                "    spy1( 'baz' ); at theFunction (theFileName:xx:yy)"
            );
        });

        describe('when passed a sinon stub instance as the subject', function () {
            it('should succeed', function () {
                var stubInstance = sinon.createStubInstance(MyClass);
                stubInstance.foo(123);
                stubInstance.bar(456);
                stubInstance.foo(789);
                return expect(stubInstance, 'to have calls satisfying', function () {
                    stubInstance.foo(123);
                    stubInstance.bar(456);
                    stubInstance.foo(789);
                });
            });

            it('should fail with a diff', function () {
                var stubInstance = sinon.createStubInstance(MyClass);
                stubInstance.foo(123);
                stubInstance.bar(456);
                stubInstance.foo(123);
                return expect(function () {
                    return expect(stubInstance, 'to have calls satisfying', function () {
                        stubInstance.foo(123);
                        stubInstance.bar(123);
                        stubInstance.foo(123);
                    });
                }, 'to error with',
                    "expected MyClass({ foo, bar }) to have calls satisfying\n" +
                    "foo( 123 );\n" +
                    "bar( 123 );\n" +
                    "foo( 123 );\n" +
                    "\n" +
                    "foo( 123 ); at theFunction (theFileName:xx:yy)\n" +
                    "bar(\n" +
                    "  456 // should equal 123\n" +
                    "); at theFunction (theFileName:xx:yy)\n" +
                    "foo( 123 ); at theFunction (theFileName:xx:yy)"
                );
            });
        });

        describe('when passed an array entry (shorthand for {args: ...})', function () {
            it('should succeed', function () {
                spy(123, { foo: 'bar' });
                expect(spy, 'to have calls satisfying', [ [ 123, { foo: 'bar' } ] ]);
            });

            it('should fail with a diff', function () {
                expect(function () {
                    spy(123, { foo: 'bar' });
                    expect(spy, 'to have calls satisfying', [ [ 123, { foo: 'baz' } ] ]);
                }, 'to throw',
                    "expected spy1 to have calls satisfying [ [ 123, { foo: 'baz' } ] ]\n" +
                    "\n" +
                    "spy1(\n" +
                    "  123,\n" +
                    "  {\n" +
                    "    foo: 'bar' // should equal 'baz'\n" +
                    "               //\n" +
                    "               // -bar\n" +
                    "               // +baz\n" +
                    "  }\n" +
                    "); at theFunction (theFileName:xx:yy)"
                );
            });

            describe('when passed a sinon sandbox as the subject', function () {
                it('should succeed', function () {
                    var sandbox = sinon.sandbox.create();
                    var spy1 = sandbox.spy().named('spy1');
                    var spy2 = sandbox.spy().named('spy2');
                    spy1(123);
                    spy2(456);
                    return expect(sandbox, 'to have calls satisfying', [
                        { spy: spy1, args: [ 123 ] },
                        { spy: spy2, args: [ 456 ] }
                    ]);
                });

                it('should fail with a diff', function () {
                    var sandbox = sinon.sandbox.create();
                    var spy1 = sandbox.spy().named('spy1');
                    var spy2 = sandbox.spy().named('spy2');
                    spy1(123);
                    spy2(456);
                    return expect(function () {
                        return expect(sandbox, 'to have calls satisfying', [
                            { spy: spy1, args: [ 123 ] },
                            { spy: spy2, args: [ 789 ] }
                        ]);
                    }, 'to error with',
                        "expected sinon sandbox to have calls satisfying [ { spy: spy1, args: [ 123 ] }, { spy: spy2, args: [ 789 ] } ]\n" +
                        "\n" +
                        "spy1( 123 ); at theFunction (theFileName:xx:yy)\n" +
                        "spy2(\n" +
                        "  456 // should equal 789\n" +
                        "); at theFunction (theFileName:xx:yy)"
                    );
                });
            });
        });

        describe('when passed an array with only numerical properties (shorthand for {args: ...})', function () {
            it('should succeed', function () {
                spy(123, { foo: 'bar' });
                expect(spy, 'to have calls satisfying', [{0: 123, 1: {foo: 'bar'}}]);
            });

            it('should fail with a diff', function () {
                expect(function () {
                    spy(123, { foo: 'bar' });
                    expect(spy, 'to have calls satisfying', [{0: 123, 1: {foo: 'baz'}}]);
                }, 'to throw',
                    "expected spy1 to have calls satisfying [ { 0: 123, 1: { foo: 'baz' } } ]\n" +
                    "\n" +
                    "spy1(\n" +
                    "  123,\n" +
                    "  {\n" +
                    "    foo: 'bar' // should equal 'baz'\n" +
                    "               //\n" +
                    "               // -bar\n" +
                    "               // +baz\n" +
                    "  }\n" +
                    "); at theFunction (theFileName:xx:yy)"
                );
            });
        });

        it('should complain if the spy list does not contain a spy that is contained by the spec', function () {
            var spy2 = sinon.spy(function spy2() {
                return 'blah';
            });
            spy2.displayName = 'spy2';
            expect(function () {
                expect([spy], 'to have calls satisfying', [ spy, spy2 ]);
            }, 'to throw',
                "expected [ spy1 ] to have calls satisfying [ spy1, spy2 ]\n" +
                "  expected [ spy1 ] to contain spy2"
            );
        });

        it('should complain if a spy call spec contains an unsupported type', function () {
            expect(function () {
                expect(spy, 'to have calls satisfying', [123]);
            }, 'to throw',
                "expected spy1 to have calls satisfying [ 123 ]\n" +
                "  unsupported value in spy call spec: 123"
            );
        });

        describe('with the exhaustively flag', function () {
            it('should fail if an object parameter contains additional properties', function () {
                spy({foo: 123}, [{bar: 'quux'}]);
                return expect(function () {
                    expect(spy, 'to have calls exhaustively satisfying', [
                        { args: [{}, [{}]] }
                    ]);
                }, 'to throw',
                    "expected spy1 to have calls exhaustively satisfying [ { args: [ ..., ... ] } ]\n" +
                    "\n" +
                    "spy1(\n" +
                    "  {\n" +
                    "    foo: 123 // should be removed\n" +
                    "  },\n" +
                    "  [\n" +
                    "    {\n" +
                    "      bar: 'quux' // should be removed\n" +
                    "    }\n" +
                    "  ]\n" +
                    "); at theFunction (theFileName:xx:yy)"
                );
            });
        });

        describe('when providing the expected calls as a function', function () {
            it('should succeed', function () {
                var spy2 = sinon.spy().named('spy2');
                spy2(123, 456);
                new spy('abc', false); // eslint-disable-line new-cap
                spy(-99, Infinity);

                expect([spy, spy2], 'to have calls satisfying', function () {
                    spy2(123, 456);
                    new spy('abc', false); // eslint-disable-line new-cap
                    spy(-99, Infinity);
                });
                expect(spy.args, 'to have length', 2);
                expect(spy.callCount, 'to equal', 2);
            });

            it('should fail with a diff', function () {
                var spy2 = sinon.spy().named('spy2');
                spy2(123, 456, 99);
                spy('abc', true);
                new spy(-99, Infinity); // eslint-disable-line new-cap

                expect(function () {
                    expect([spy, spy2], 'to have calls satisfying', function () {
                        spy2(123, 456);
                        new spy('abc', false); // eslint-disable-line new-cap
                        spy(-99, Infinity);
                    });
                }, 'to throw',
                    "expected [ spy1, spy2 ] to have calls satisfying\n" +
                    "spy2( 123, 456 );\n" +
                    "new spy1( 'abc', false );\n" +
                    "spy1( -99, Infinity );\n" +
                    "\n" +
                    "spy2(\n" +
                    "  123,\n" +
                    "  456,\n" +
                    "  99 // should be removed\n" +
                    "); at theFunction (theFileName:xx:yy)\n" +
                    "spy1(\n" +
                    "  'abc',\n" +
                    "  true // should equal false\n" +
                    "); at theFunction (theFileName:xx:yy) // calledWithNew: expected false to equal true\n" +
                    "new spy1( -99, Infinity ); at theFunction (theFileName:xx:yy) // calledWithNew: expected true to equal false"
                );
            });

            describe('when passed a sinon sandbox as the subject', function () {
                it('should succeed', function () {
                    var sandbox = sinon.sandbox.create();
                    var spy1 = sandbox.spy().named('spy1');
                    var spy2 = sandbox.spy().named('spy2');
                    spy1(123);
                    spy2(456);
                    return expect(sandbox, 'to have calls satisfying', function () {
                        spy1(123);
                        spy2(456);
                    });
                });

                it('should fail with a diff', function () {
                    var sandbox = sinon.sandbox.create();
                    var spy1 = sandbox.spy().named('spy1');
                    var spy2 = sandbox.spy().named('spy2');
                    spy1(123);
                    spy2(456);
                    return expect(function () {
                        return expect(sandbox, 'to have calls satisfying', function () {
                            spy1(123);
                            spy2(789);
                        });
                    }, 'to error with',
                        "expected sinon sandbox to have calls satisfying\n" +
                        "spy1( 123 );\n" +
                        "spy2( 789 );\n" +
                        "\n" +
                        "spy1( 123 ); at theFunction (theFileName:xx:yy)\n" +
                        "spy2(\n" +
                        "  456 // should equal 789\n" +
                        "); at theFunction (theFileName:xx:yy)"
                    );
                });
            });

            it('should render a spy call missing at the end', function () {
                spy('abc', true);

                expect(function () {
                    expect(spy, 'to have calls satisfying', function () {
                        spy('abc', true);
                        spy('def', false);
                    });
                }, 'to throw',
                    "expected spy1 to have calls satisfying\n" +
                    "spy1( 'abc', true );\n" +
                    "spy1( 'def', false );\n" +
                    "\n" +
                    "spy1( 'abc', true ); at theFunction (theFileName:xx:yy)\n" +
                    "// missing spy1( 'def', false );"
                );
            });

            it('should render a spy call missing at the end', function () {
                spy('abc', true);

                expect(function () {
                    expect(spy, 'to have calls satisfying', function () {
                        spy('def', false);
                        spy('abc', true);
                    });
                }, 'to throw',
                    "expected spy1 to have calls satisfying\n" +
                    "spy1( 'def', false );\n" +
                    "spy1( 'abc', true );\n" +
                    "\n" +
                    "// missing spy1( 'def', false );\n" +
                    "spy1( 'abc', true ); at theFunction (theFileName:xx:yy)"
                );
            });

            it('should render a spy call missing in the middle', function () {
                spy(123, 456);
                spy(234);
                spy(987);

                expect(function () {
                    expect(spy, 'to have calls satisfying', function () {
                        spy(123, 456);
                        spy(false);
                        spy(234);
                        spy(987);
                    });
                }, 'to throw',
                    "expected spy1 to have calls satisfying\n" +
                    "spy1( 123, 456 );\n" +
                    "spy1( false );\n" +
                    "spy1( 234 );\n" +
                    "spy1( 987 );\n" +
                    "\n" +
                    "spy1( 123, 456 ); at theFunction (theFileName:xx:yy)\n" +
                    "// missing spy1( false );\n" +
                    "spy1( 234 ); at theFunction (theFileName:xx:yy)\n" +
                    "spy1( 987 ); at theFunction (theFileName:xx:yy)"
                );
            });

            it('should render the minimal diff when a structurally similar spy call is followed by an extraneous one', function () {
                spy(123, 456);
                spy({ foo: 123 });
                spy(456);
                spy(987);

                expect(function () {
                    expect(spy, 'to have calls satisfying', function () {
                        spy(123, 456);
                        spy({ foo: 456 });
                        spy(987);
                    });
                }, 'to throw',
                    "expected spy1 to have calls satisfying\n" +
                    "spy1( 123, 456 );\n" +
                    "spy1( { foo: 456 } );\n" +
                    "spy1( 987 );\n" +
                    "\n" +
                    "spy1( 123, 456 ); at theFunction (theFileName:xx:yy)\n" +
                    "spy1(\n" +
                    "  {\n" +
                    "    foo: 123 // should equal 456\n" +
                    "  }\n" +
                    "); at theFunction (theFileName:xx:yy)\n" +
                    "spy1( 456 ); at theFunction (theFileName:xx:yy) // should be removed\n" +
                    "spy1( 987 ); at theFunction (theFileName:xx:yy)"
                );
            });

            it('should work with expect.it', function () {
                spy('abc', true);
                spy('abc', false, 123);

                expect(function () {
                    expect(spy, 'to have calls satisfying', function () {
                        spy('abc', expect.it('to be true'));
                        spy('abc', false, expect.it('to be a number').and('to be less than', 100));
                    });
                }, 'to throw',
                    "expected spy1 to have calls satisfying\n" +
                    "spy1( 'abc', expect.it('to be true') );\n" +
                    "spy1(\n" +
                    "  'abc',\n" +
                    "  false,\n" +
                    "  expect.it('to be a number')\n" +
                    "          .and('to be less than', 100)\n" +
                    ");\n" +
                    "\n" +
                    "spy1( 'abc', true ); at theFunction (theFileName:xx:yy)\n" +
                    "spy1(\n" +
                    "  'abc',\n" +
                    "  false,\n" +
                    "  123 // ✓ should be a number and\n" +
                    "      // ⨯ should be less than 100\n" +
                    "); at theFunction (theFileName:xx:yy)"
                );
            });

            it('should not break while recording when the spied-upon function has side effects', function () {
                var throwingSpy = sinon.spy(function () {
                    throw new Error('Urgh');
                });
                expect(throwingSpy, 'to throw');
                expect(throwingSpy, 'to throw');

                return expect(throwingSpy, 'to have calls satisfying', function () {
                    throwingSpy();
                    throwingSpy();
                }).then(function () {
                    expect(throwingSpy, 'was called twice');
                });
            });

            it('should render the correct diff when the expected spy calls consist of a single entry', function () {
                return expect(function () {
                    return expect(spy, 'to have calls satisfying', function () {
                        spy(123);
                    });
                }, 'to throw',
                    "expected spy1 to have calls satisfying spy1( 123 );\n" +
                    "\n" +
                    "// missing spy1( 123 );"
                );
            });
        });

        describe('when asserting whether a call was invoked with the new operator', function () {
            it('should succeed', function () {
                new spy(); // eslint-disable-line new-cap
                spy();
                expect(spy, 'to have calls satisfying', [
                    { calledWithNew: true },
                    { calledWithNew: false }
                ]);
            });

            it('should fail with a diff', function () {
                new spy(); // eslint-disable-line new-cap
                spy();
                expect(function () {
                    expect(spy, 'to have calls satisfying', [
                        { calledWithNew: false },
                        { calledWithNew: true }
                    ]);
                }, 'to throw',
                    "expected spy1 to have calls satisfying [ { calledWithNew: false }, { calledWithNew: true } ]\n" +
                    "\n" +
                    "┌─▷\n" +
                    "│   new spy1(); at theFunction (theFileName:xx:yy)\n" +
                    "└── spy1(); at theFunction (theFileName:xx:yy) // should be moved"
                );
            });
        });
    });

    describe('spyCall type', function () {
        describe('to satisfy', function () {
            describe('with an object with only numerical properties', function () {
                it('should succeed', function () {
                    spy(123);
                    spy(456);
                    expect(spy.lastCall, 'to satisfy', {0: 456});
                });

                it('should fail with a diff', function () {
                    spy(123);
                    spy(456);
                    expect(function () {
                        expect(spy.lastCall, 'to satisfy', {0: 789});
                    }, 'to throw',
                        "expected spy1( 456 ); at theFunction (theFileName:xx:yy) to satisfy { 0: 789 }\n" +
                        "\n" +
                        "spy1(\n" +
                        "  456 // should equal 789\n" +
                        "); at theFunction (theFileName:xx:yy)"
                    );
                });
            });

            describe('with an array', function () {
                it('should succeed', function () {
                    spy(123);
                    spy(456);
                    expect(spy.lastCall, 'to satisfy', [456]);
                });

                it('should fail with a diff', function () {
                    spy(123);
                    spy(456);
                    expect(function () {
                        expect(spy.lastCall, 'to satisfy', [789]);
                    }, 'to throw',
                        "expected spy1( 456 ); at theFunction (theFileName:xx:yy) to satisfy [ 789 ]\n" +
                        "\n" +
                        "spy1(\n" +
                        "  456 // should equal 789\n" +
                        "); at theFunction (theFileName:xx:yy)"
                    );
                });
            });

            describe('with an object', function () {
                it('should succeed', function () {
                    spy(123);
                    spy(456);
                    expect(spy.lastCall, 'to satisfy', {args: [456]});
                });

                it('should fail with a diff', function () {
                    spy(123);
                    spy(456);
                    expect(function () {
                        expect(spy.lastCall, 'to satisfy', {args: [789]});
                    }, 'to throw',
                        "expected spy1( 456 ); at theFunction (theFileName:xx:yy) to satisfy { args: [ 789 ] }\n" +
                        "\n" +
                        "spy1(\n" +
                        "  456 // should equal 789\n" +
                        "); at theFunction (theFileName:xx:yy)"
                    );
                });
            });
        });
    });

    // Regression test for an issue reported by Gert Sønderby in the Unexpected gitter channel:
    if (typeof navigator === 'undefined' || !/phantom/i.test(navigator.userAgent)) {
        it('should avoid retrieving a property of undefined in the similar function', function () {
            spy(123);
            spy(function () {
                return {then: function (fn) { setImmediate(fn); }};
            });

            return expect(function () {
                return expect(spy, 'to have calls satisfying', [
                    { args: [ expect.it('when called with', [], 'to be fulfilled') ] }
                ]);
            }, 'to error',
                "expected spy1 to have calls satisfying [ { args: [ expect.it('when called with', ..., 'to be fulfilled') ] } ]\n" +
                "\n" +
                "spy1( 123 ); at theFunction (theFileName:xx:yy) // should be removed\n" +
                "spy1(\n" +
                "  function () {\n" +
                "    return {then: function (fn) { setImmediate(fn); }};\n" +
                "  }\n" +
                "); at theFunction (theFileName:xx:yy)"
            );
        });
    }

    // Regression test for #38
    it('should work with bounded functions', function () {
        var obj = { method: function () {} };
        obj.method = obj.method.bind(obj);
        sinon.spy(obj, 'method');
        obj.method();
        expect(function () {
            expect(obj.method, 'was called times', 2);
        }, 'to throw',
           'expected method was called times 2\n' +
           '  expected method(); at theFunction (theFileName:xx:yy) to have length 2\n' +
           '    expected 1 to be 2'
        );
    });

    // Regression test for:
    // Function has non-object prototype 'undefined' in instanceof check
    describe('when spying on console methods', function () {
        beforeEach(function () {
            sinon.spy(console, 'error');
        });

        afterEach(function () {
            console.error.restore();
        });

        it('should not fail when spying on console methods', function () {
            expect(console.error, 'to have no calls satisfying', function () {
                console.error('hey');
            });
        });
    });

    // Regression test for:
    // Function has non-object prototype 'undefined' in instanceof check
    describe('when spying on a bound function', function () {
        it('should not fail when spying on console methods', function () {
            var foo = { bar: function () {}.bind({}) };
            sinon.spy(foo, 'bar');
            expect(foo.bar, 'to have no calls satisfying', function () {
                foo.bar('hey');
            });
        });
    });
});
