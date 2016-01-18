/*global describe, it, beforeEach, sinon, unexpected*/
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
                "[\n" +
                "  spy1( 42, { foo: 'bar' } ) at theFunction (theFileName:xx:yy) // should be removed\n" +
                "  spy1( 'baz' ) at theFunction (theFileName:xx:yy) // should be removed\n" +
                "]"
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
                "  [\n" +
                "    spy1( 42, { foo: 'bar' } ) at theFunction (theFileName:xx:yy)\n" +
                "    spy1( 'baz' ) at theFunction (theFileName:xx:yy)\n" +
                "  ]\n" +
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
                "  expected\n" +
                "  [\n" +
                "    spy1() at theFunction (theFileName:xx:yy)\n" +
                "  ]\n" +
                "  to have length 2\n" +
                "    expected 1 to be 2"
            );

            expect(function () {
                var spy = sinon.spy().named('spy1');
                spy(); spy(42); spy();
                expect(spy, "was called twice");
            }, "to throw exception",
                "expected spy1 was called twice\n" +
                "  expected\n" +
                "  [\n" +
                "    spy1() at theFunction (theFileName:xx:yy)\n" +
                "    spy1( 42 ) at theFunction (theFileName:xx:yy)\n" +
                "    spy1() at theFunction (theFileName:xx:yy)\n" +
                "  ]\n" +
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
                "  [\n" +
                "    spy1() at theFunction (theFileName:xx:yy)\n" +
                "    spy1() at theFunction (theFileName:xx:yy)\n" +
                "  ]\n" +
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
                "  [\n" +
                "    spy1() at theFunction (theFileName:xx:yy)\n" +
                "    spy1() at theFunction (theFileName:xx:yy)\n" +
                "    spy1() at theFunction (theFileName:xx:yy)\n" +
                "    spy1() at theFunction (theFileName:xx:yy)\n" +
                "  ]\n" +
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
                "  [\n" +
                "    spy1() at theFunction (theFileName:xx:yy)\n" +
                "    spy1() at theFunction (theFileName:xx:yy)\n" +
                "  ]\n" +
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
                "  [\n" +
                "    spy1() at theFunction (theFileName:xx:yy)\n" +
                "    spy1() at theFunction (theFileName:xx:yy)\n" +
                "    spy1() at theFunction (theFileName:xx:yy)\n" +
                "    spy1() at theFunction (theFileName:xx:yy)\n" +
                "  ]\n" +
                "  to have length 3\n" +
                "    expected 4 to be 3"
            );
        });
    });

    describe('was called the new operator', function () {
        it('passes if spy was called the new operator', function () {
            /*jshint -W055 */
            new spy();
            /*jshint +W055 */
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
                "[\n" +
                "  agent005() at theFunction (theFileName:xx:yy)\n" +
                "  agent006() at theFunction (theFileName:xx:yy)\n" +
                "  agent007() at theFunction (theFileName:xx:yy)\n" +
                "  agent005() at theFunction (theFileName:xx:yy)\n" +
                "  agent006() at theFunction (theFileName:xx:yy)\n" +
                "  agent007() at theFunction (theFileName:xx:yy) // spy: expected agent007 to be agent005\n" +
                "]"
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
                "[\n" +
                "  agent005() at theFunction (theFileName:xx:yy)\n" +
                "  agent007() at theFunction (theFileName:xx:yy) // spy: expected agent007 to be agent006\n" +
                "  agent006() at theFunction (theFileName:xx:yy) // spy: expected agent006 to be agent007\n" +
                "]"
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
                "[\n" +
                "  agent005() at theFunction (theFileName:xx:yy)\n" +
                "  agent006() at theFunction (theFileName:xx:yy)\n" +
                "  // missing { spy: agent007 }\n" +
                "]"
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
                "[\n" +
                "  // missing { spy: agent005 }\n" +
                "  // missing { spy: agent006 }\n" +
                "  // missing { spy: agent007 }\n" +
                "]"
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
                "[\n" +
                "  spy1() at theFunction (theFileName:xx:yy)\n" +
                "  spy1() at theFunction (theFileName:xx:yy)\n" +
                "  // expected: was called on { spy: spy1 }\n" +
                "  //   expected spy1 to be called with { spy: spy1 } as this but was called with null\n" +
                "]"
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
                "[\n" +
                "  spy1(\n" +
                "    {\n" +
                "      foo: 'baa' // should equal 'bar'\n" +
                "                 // -baa\n" +
                "                 // +bar\n" +
                "    },\n" +
                "    'baz',\n" +
                "    true,\n" +
                "    false\n" +
                "  ) at theFunction (theFileName:xx:yy)\n" +
                "]"
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
                "[\n" +
                "  spy1(\n" +
                "    'something else' // should equal { foo: 'bar' }\n" +
                "    // missing 'baz'\n" +
                "    // missing: should be truthy\n" +
                "  ) at theFunction (theFileName:xx:yy)\n" +
                "  spy1( { foo: 'bar' }, 'baz', true, false ) at theFunction (theFileName:xx:yy)\n" +
                "]"
            );
        });

        it('renders a nice diff for extraneous arguments', function () {
            expect(function () {
                spy('a', 'b', 'c');
                expect(spy, 'was always called with exactly', 'a', 'c');
            }, 'to throw exception',
                "expected spy1 was always called with exactly 'a', 'c'\n" +
                "\n" +
                "[\n" +
                "  spy1(\n" +
                "    'a',\n" +
                "    'b', // should be removed\n" +
                "    'c'\n" +
                "  ) at theFunction (theFileName:xx:yy)\n" +
                "]"
            );
        });

        it('renders a nice diff for missing arguments', function () {
            expect(function () {
                spy('a', 'c');
                expect(spy, 'was always called with exactly', 'a', 'b', 'c');
            }, 'to throw exception',
                "expected spy1 was always called with exactly 'a', 'b', 'c'\n" +
                "\n" +
                "[\n" +
                "  spy1(\n" +
                "    'a',\n" +
                "    // missing 'b'\n" +
                "    'c'\n" +
                "  ) at theFunction (theFileName:xx:yy)\n" +
                "]"
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
                "[\n" +
                "  spy1( 'bar', 'true' ) at theFunction (theFileName:xx:yy)\n" +
                "  // should not satisfy { args: { 0: 'bar', 1: expect.it('to be truthy') } }\n" +
                "]"
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
                "[\n" +
                "  spy1( 'foo' ) at theFunction (theFileName:xx:yy)\n" +
                "  spy1( 'bar', {} ) at theFunction (theFileName:xx:yy) // should not satisfy { args: { 0: 'bar' } }\n" +
                "]"
            );
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
                "[\n" +
                "  spy1(\n" +
                "    'foo',\n" +
                "    'bar',\n" +
                "    'baz',\n" +
                "    'qux' // should be removed\n" +
                "  ) at theFunction (theFileName:xx:yy)\n" +
                "]"
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
                "[\n" +
                "  spy1( 'foo', 'bar', 'baz' ) at theFunction (theFileName:xx:yy)\n" +
                "  spy1(\n" +
                "    'foo',\n" +
                "    'bar',\n" +
                "    'baz',\n" +
                "    'qux' // should be removed\n" +
                "  ) at theFunction (theFileName:xx:yy)\n" +
                "]"
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
                    "[\n" +
                    "  stub() at theFunction (theFileName:xx:yy) // expected: threw { name: 'TypeError' }\n" +
                    "                                            //   expected Error() to satisfy { name: 'TypeError' }\n" +
                    "                                            //\n" +
                    "                                            //   {\n" +
                    "                                            //     message: '',\n" +
                    "                                            //     name: 'Error' // should equal 'TypeError'\n" +
                    "                                            //                   // -Error\n" +
                    "                                            //                   // +TypeError\n" +
                    "                                            //   }\n" +
                    "]"
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
                    "[\n" +
                    "  stub() at theFunction (theFileName:xx:yy) // expected: threw Error()\n" +
                    "                                            //   expected TypeError() to satisfy Error()\n" +
                    "]"
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
                    "[\n" +
                    "  spy1() at theFunction (theFileName:xx:yy)\n" +
                    "  spy1() at theFunction (theFileName:xx:yy) // expected: threw\n" +
                    "]"
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
                    "[\n" +
                    "  stub() at theFunction (theFileName:xx:yy)\n" +
                    "  stub() at theFunction (theFileName:xx:yy) // expected: threw { name: 'Error' }\n" +
                    "                                            //   expected TypeError() to satisfy { name: 'Error' }\n" +
                    "                                            //\n" +
                    "                                            //   {\n" +
                    "                                            //     message: '',\n" +
                    "                                            //     name: 'TypeError' // should equal 'Error'\n" +
                    "                                            //                       // -TypeError\n" +
                    "                                            //                       // +Error\n" +
                    "                                            //   }\n" +
                    "]"
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
                    "[\n" +
                    "  stub() at theFunction (theFileName:xx:yy)\n" +
                    "  stub() at theFunction (theFileName:xx:yy) // expected: threw Error()\n" +
                    "                                            //   expected TypeError() to satisfy Error()\n" +
                    "]"
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

    describe('to have calls satisfying', function () {
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
                "[\n" +
                "  spy1( 'foo', 'bar' ) at theFunction (theFileName:xx:yy)\n" +
                "  spy2( 'quux' ) at theFunction (theFileName:xx:yy) // returned: expected 'blah' to equal 'yadda'\n" +
                "                                                    //\n" +
                "                                                    //           -blah\n" +
                "                                                    //           +yadda\n" +
                "  die() at theFunction (theFileName:xx:yy) // threw: expected Error('say what') to satisfy /cqwecqw/\n" +
                "  spy1(\n" +
                "    'baz' // should equal 'yadda'\n" +
                "          //\n" +
                "          // -baz\n" +
                "          // +yadda\n" +
                "  ) at theFunction (theFileName:xx:yy)\n" +
                "  spy2( 'yadda' ) at theFunction (theFileName:xx:yy) // spy: expected spy2 to be spy1\n" +
                "  spy1( 'baz' ) at theFunction (theFileName:xx:yy)\n" +
                "]"
            );
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
                    "[\n" +
                    "  spy1(\n" +
                    "    {\n" +
                    "      foo: 123 // should be removed\n" +
                    "    },\n" +
                    "    [\n" +
                    "      {\n" +
                    "        bar: 'quux' // should be removed\n" +
                    "      }\n" +
                    "    ]\n" +
                    "  ) at theFunction (theFileName:xx:yy)\n" +
                    "]"
                );
            });
        });

        describe('when providing the expected calls as a function', function () {
            it('should succeed', function () {
                var spy2 = sinon.spy().named('spy2');
                spy2(123, 456);
                /*jshint newcap: false */
                new spy('abc', false);
                /*jshint newcap: true */
                spy(-99, Infinity);

                expect([spy, spy2], 'to have calls satisfying', function () {
                    spy2(123, 456);
                    /*jshint newcap: false */
                    new spy('abc', false);
                    /*jshint newcap: true */
                    spy(-99, Infinity);
                });
                expect(spy.args, 'to have length', 2);
                expect(spy.callCount, 'to equal', 2);
            });

            it('should fail with a diff', function () {
                var spy2 = sinon.spy().named('spy2');
                spy2(123, 456, 99);
                spy('abc', true);
                /*jshint newcap: false */
                new spy(-99, Infinity);
                /*jshint newcap: true */

                expect(function () {
                    expect([spy, spy2], 'to have calls satisfying', function () {
                        spy2(123, 456);
                        /*jshint newcap: false */
                        new spy('abc', false);
                        /*jshint newcap: true */
                        spy(-99, Infinity);
                    });
                }, 'to throw',
                    "expected [ spy1, spy2 ] to have calls satisfying\n" +
                    "[\n" +
                    "  spy2( 123, 456 )\n" +
                    "  new spy1( 'abc', false )\n" +
                    "  spy1( -99, Infinity )\n" +
                    "]\n" +
                    "\n" +
                    "[\n" +
                    "  spy2(\n" +
                    "    123,\n" +
                    "    456,\n" +
                    "    99 // should be removed\n" +
                    "  ) at theFunction (theFileName:xx:yy)\n" +
                    "  spy1(\n" +
                    "    'abc',\n" +
                    "    true // should equal false\n" +
                    "  ) at theFunction (theFileName:xx:yy) // calledWithNew: expected false to equal true\n" +
                    "  new spy1( -99, Infinity ) at theFunction (theFileName:xx:yy) // calledWithNew: expected true to equal false\n" +
                    "]"
                );
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
                    "[\n" +
                    "  spy1( 'abc', true )\n" +
                    "  spy1( 'def', false )\n" +
                    "]\n" +
                    "\n" +
                    "[\n" +
                    "  spy1( 'abc', true ) at theFunction (theFileName:xx:yy)\n" +
                    "  // missing spy1( 'def', false )\n" +
                    "]"
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
                    "[\n" +
                    "  spy1( 'def', false )\n" +
                    "  spy1( 'abc', true )\n" +
                    "]\n" +
                    "\n" +
                    "[\n" +
                    "  // missing spy1( 'def', false )\n" +
                    "  spy1( 'abc', true ) at theFunction (theFileName:xx:yy)\n" +
                    "]"
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
                    "[\n" +
                    "  spy1( 123, 456 )\n" +
                    "  spy1( false )\n" +
                    "  spy1( 234 )\n" +
                    "  spy1( 987 )\n" +
                    "]\n" +
                    "\n" +
                    "[\n" +
                    "  spy1( 123, 456 ) at theFunction (theFileName:xx:yy)\n" +
                    "  // missing spy1( false )\n" +
                    "  spy1( 234 ) at theFunction (theFileName:xx:yy)\n" +
                    "  spy1( 987 ) at theFunction (theFileName:xx:yy)\n" +
                    "]"
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
                    "[\n" +
                    "  spy1( 123, 456 )\n" +
                    "  spy1( { foo: 456 } )\n" +
                    "  spy1( 987 )\n" +
                    "]\n" +
                    "\n" +
                    "[\n" +
                    "  spy1( 123, 456 ) at theFunction (theFileName:xx:yy)\n" +
                    "  spy1(\n" +
                    "    {\n" +
                    "      foo: 123 // should equal 456\n" +
                    "    }\n" +
                    "  ) at theFunction (theFileName:xx:yy)\n" +
                    "  spy1( 456 ) at theFunction (theFileName:xx:yy) // should be removed\n" +
                    "  spy1( 987 ) at theFunction (theFileName:xx:yy)\n" +
                    "]"
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
                    "[\n" +
                    "  spy1( 'abc', expect.it('to be true') )\n" +
                    "  spy1(\n" +
                    "    'abc',\n" +
                    "    false,\n" +
                    "    expect.it('to be a number')\n" +
                    "            .and('to be less than', 100)\n" +
                    "  )\n" +
                    "]\n" +
                    "\n" +
                    "[\n" +
                    "  spy1( 'abc', true ) at theFunction (theFileName:xx:yy)\n" +
                    "  spy1(\n" +
                    "    'abc',\n" +
                    "    false,\n" +
                    "    123 // ✓ should be a number and\n" +
                    "        // ⨯ should be less than 100\n" +
                    "  ) at theFunction (theFileName:xx:yy)\n" +
                    "]"
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
        });

        describe('when asserting whether a call was invoked with the new operator', function () {
            it('should succeed', function () {
                /*jshint newcap: false */
                new spy();
                /*jshint newcap: true */
                spy();
                expect(spy, 'to have calls satisfying', [
                    { calledWithNew: true },
                    { calledWithNew: false }
                ]);
            });

            it('should fail with a diff', function () {
                /*jshint newcap: false */
                new spy();
                /*jshint newcap: true */
                spy();
                expect(function () {
                    expect(spy, 'to have calls satisfying', [
                        { calledWithNew: false },
                        { calledWithNew: true }
                    ]);
                }, 'to throw',
                    "expected spy1 to have calls satisfying [ { calledWithNew: false }, { calledWithNew: true } ]\n" +
                    "\n" +
                    "[\n" +
                    "  new spy1() at theFunction (theFileName:xx:yy) // calledWithNew: expected true to equal false\n" +
                    "  spy1() at theFunction (theFileName:xx:yy) // calledWithNew: expected false to equal true\n" +
                    "]"
                );
            });
        });
    });
});
