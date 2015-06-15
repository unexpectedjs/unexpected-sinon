/*global describe, it, beforeEach, sinon, unexpected*/
describe('unexpected-sinon', function () {
    var expect, spy;
    beforeEach(function () {
        expect = unexpected.clone();
        spy = sinon.spy();
    });

    describe('was called', function () {
        it('passes if spy was called at least once', function () {
            spy();
            expect(spy, "was called");
        });

        it('fails if spy was never called', function () {
            expect(function () {
                expect(spy, "was called");
            }, "to throw exception", "expected spy was called");
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
                   "expected spy was not called\n" +
                   "  expected invocations( spy( 42, { foo: \'bar\' } ), spy( \'baz\' ) ) to be empty");
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
            }, "to throw exception", 'expected spy was called once');

            expect(function () {
                spy(42, { foo: 'bar' });
                spy('baz');
                expect(spy, "was called once");
            }, "to throw exception",
                   "expected spy was called once\n" +
                   "  expected invocations( spy( 42, { foo: \'bar\' } ), spy( \'baz\' ) ) to have length 1\n" +
                   "    expected 2 to be 1");
        });
    });

    describe('was called twice', function () {
        it('passes if spy was called exactly twice', function () {
            spy(); spy();
            expect(spy, "was called twice");
        });

        it('fails if spy was not called exactly twice', function () {
            expect(function () {
                expect(spy, "was called twice");
            }, "to throw exception", "expected spy was called twice");

            expect(function () {
                var spy = sinon.spy();
                spy();
                expect(spy, "was called twice");
            }, "to throw exception", "expected spy was called twice\n" +
                   "  expected invocations( spy() ) to have length 2\n" +
                   "    expected 1 to be 2");

            expect(function () {
                var spy = sinon.spy();
                spy(); spy(42); spy();
                expect(spy, "was called twice");
            }, "to throw exception",
                   "expected spy was called twice\n" +
                   "  expected invocations( spy(), spy( 42 ), spy() ) to have length 2\n" +
                   "    expected 3 to be 2");
        });
    });

    describe('was called thrice', function () {
        it('passes if spy was called exactly three times', function () {
            spy(); spy(); spy();
            expect(spy, "was called thrice");
        });

        it('fails if spy was not called exactly three times', function () {
            expect(function () {
                var spy = sinon.spy();
                spy(); spy();
                expect(spy, "was called thrice");
            }, "to throw exception",
                   "expected spy was called thrice\n" +
                   "  expected invocations( spy(), spy() ) to have length 3\n" +
                   "    expected 2 to be 3");

            expect(function () {
                var spy = sinon.spy();
                spy(); spy(); spy(); spy();
                expect(spy, "was called thrice");
            }, "to throw exception",
                   "expected spy was called thrice\n" +
                   "  expected invocations( spy(), spy(), spy(), spy() ) to have length 3\n" +
                   "    expected 4 to be 3");
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
                var spy = sinon.spy();
                spy(); spy();
                expect(spy, "was called times", 3);
            }, "to throw exception",
                   "expected spy was called times 3\n" +
                   "  expected invocations( spy(), spy() ) to have length 3\n" +
                   "    expected 2 to be 3");

            expect(function () {
                var spy = sinon.spy();
                spy(); spy(); spy(); spy();
                expect(spy, "was called times", 3);
            }, "to throw exception",
                   "expected spy was called times 3\n" +
                   "  expected invocations( spy(), spy(), spy(), spy() ) to have length 3\n" +
                   "    expected 4 to be 3");
        });
    });

    describe('was called the new operator', function () {
        it('passes if spy was called the new operator', function () {
            new spy();
            expect(spy,"was called with new");
        });
        it('fails if spy was never called with new operator', function () {
            expect(function () {
                var spy = sinon.spy();
                spy();
                expect(spy, "was called with new");
            }, "to throw exception", 'expected spy was called with new');
        });
    });

    describe('given call order', function () {
        it('passes if the provided spies where called in the given order', function () {
            var agent005 = sinon.spy();
            var agent006 = sinon.spy();
            var agent007 = sinon.spy();
            agent005();
            agent006();
            agent007();
            expect([agent005, agent006, agent007], 'given call order');
        });

        it('fails if the provided spies where not called in the given order', function () {
            expect(function () {
                var agent005 = sinon.spy();
                var agent006 = sinon.spy();
                var agent007 = sinon.spy();
                agent005();
                agent007();
                agent006();
                expect([agent005, agent006, agent007], 'given call order');
            }, 'to throw exception', /to be called in order/);

            expect(function () {
                var agent005 = sinon.spy();
                var agent006 = sinon.spy();
                var agent007 = sinon.spy();
                agent005();
                agent006();
                expect([agent005, agent006, agent007], 'given call order');
            }, 'to throw exception', /to be called in order/);
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
                   "expected spy was called on { other: true }\n" +
                   "  spy was never called");
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
                    spy: sinon.spy()
                };
                obj.spy();
                obj.spy.call(null);
                expect(obj.spy, 'was always called on', obj);
            }, 'to throw exception',
                   "expected spy was always called on { spy: spy }\n" +
                   "  expected invocations( spy(), spy() ) to have values satisfying 'was called on', { spy: spy }\n" +
                   "\n" +
                   "  invocations(\n" +
                   "    spy(),\n" +
                   "    spy() // expected spy() was called on { spy: spy }\n" +
                   "          //   expected spy to be called with { spy: spy } as this but was called with null\n" +
                   "  )");
        });
    });

    describe('was called with', function () {
        it('passes if the spy was called with the provided arguments', function () {
            spy('something else');
            spy({ foo: 'bar' }, 'baz', true, false);
            expect(spy, 'was called with', { foo: 'bar' }, 'baz', sinon.match.truthy);
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
                expect(spy, 'was called with', { foo: 'bar' }, 'baz', sinon.match.truthy);
            }, 'to throw exception',
                   "expected spy was called with { foo: \'bar\' }, \'baz\', match(truthy)\n" +
                   "  expected invocations( spy( { foo: 'baa' }, 'baz', true, false ) )\n" +
                   "  to have values satisfying { 0: { foo: 'bar' }, 1: 'baz', 2: match(truthy) }\n" +
                   "\n" +
                   "  invocations(\n" +
                   "    spy([\n" +
                   "      {\n" +
                   "        foo: 'baa' // should equal 'bar'\n" +
                   "                   // -baa\n" +
                   "                   // +bar\n" +
                   "      },\n" +
                   "      'baz',\n" +
                   "      true,\n" +
                   "      false\n" +
                   "    ])\n" +
                   "  )");
        });
    });

    describe('was always called with', function () {
        it('passes if the spy was always called with the provided arguments', function () {
            spy({ foo: 'bar' }, 'baz', true, false);
            spy({ foo: 'bar' }, 'baz', true, false);
            expect(spy, 'was always called with', { foo: 'bar' }, 'baz', sinon.match.truthy);
        });

        it('fails if the spy was called once with other arguments then the provided', function () {
            expect(function () {
                spy('something else');
                spy({ foo: 'bar' }, 'baz', true, false);
                expect(spy, 'was always called with', { foo: 'bar' }, 'baz', sinon.match.truthy);
            }, 'to throw exception',
                   "expected spy was always called with { foo: 'bar' }, 'baz', match(truthy)\n" +
                   "  expected invocations( spy( 'something else' ), spy( { foo: 'bar' }, 'baz', true, false ) )\n" +
                   "  to have values satisfying { 0: { foo: 'bar' }, 1: 'baz', 2: match(truthy) }\n" +
                   "\n" +
                   "  invocations(\n" +
                   "    spy([\n" +
                   "      'something else', // should equal { foo: 'bar' }\n" +
                   "      undefined, // should equal 'baz'\n" +
                   "      undefined // expected spy( 'something else' ) to satisfy { 0: { foo: 'bar' }, 1: 'baz', 2: match(truthy) }\n" +
                   "    ]),\n" +
                   "    spy( { foo: 'bar' }, 'baz', true, false )\n" +
                   "  )");
        });
    });

    describe('was never called with', function () {
        it('passes if the spy was never called with the provided arguments', function () {
            spy('foo', 'true');
            expect(spy, 'was never called with', 'bar', sinon.match.truthy);
        });

        it('fails if the spy was called with the provided arguments', function () {
            expect(function () {
                spy('bar', 'true');
                expect(spy, 'was never called with', 'bar', sinon.match.truthy);
            }, 'to throw exception',
                   "expected spy was never called with 'bar', match(truthy)\n" +
                   "  expected invocations( spy( 'bar', 'true' ) ) to have values satisfying 'not to satisfy', { 0: 'bar', 1: match(truthy) }\n" +
                   "\n" +
                   "  invocations(\n" +
                   "    spy( 'bar', 'true' ) // expected spy( 'bar', 'true' ) not to satisfy { 0: 'bar', 1: match(truthy) }\n" +
                   "  )");
        });
    });

    describe('was called with exactly', function () {
        it('passes if the spy was called with the provided arguments and no others', function () {
            spy('foo', 'baz', 'baz');
            spy('foo', 'bar', 'baz');
            expect(spy, 'was called with exactly', 'foo', 'bar', sinon.match.truthy);
        });

        it('fails if the spy was never called with the provided arguments and no others', function () {
            expect(function () {
                spy('foo', 'bar', 'baz', 'qux');
                expect(spy, 'was called with exactly', 'foo', 'bar', sinon.match.truthy);
            }, 'to throw exception',
                   "expected spy was called with exactly 'foo', 'bar', match(truthy)\n" +
                   "  expected invocations( spy( 'foo', 'bar', 'baz', 'qux' ) ) to have values satisfying [ 'foo', 'bar', match(truthy) ]\n" +
                   "\n" +
                   "  invocations(\n" +
                   "    spy([\n" +
                   "      'foo',\n" +
                   "      'bar',\n" +
                   "      'baz',\n" +
                   "      'qux' // should be removed\n" +
                   "    ])\n" +
                   "  )");
        });
    });

    describe('was always called with exactly', function () {
        it('passes if the spy was always called with the provided arguments and no others', function () {
            spy('foo', 'bar', 'baz');
            spy('foo', 'bar', 'baz');
            expect(spy, 'was always called with exactly', 'foo', 'bar', sinon.match.truthy);
        });

        it('fails if the spy was ever called with anything else than the provided arguments', function () {
            expect(function () {
                spy('foo', 'bar', 'baz');
                spy('foo', 'bar', 'baz', 'qux');
                expect(spy, 'was always called with exactly', 'foo', 'bar', sinon.match.truthy);
            }, 'to throw exception',
                   "expected spy was always called with exactly 'foo', 'bar', match(truthy)\n" +
                   "  expected invocations( spy( 'foo', 'bar', 'baz' ), spy( 'foo', 'bar', 'baz', 'qux' ) )\n" +
                   "  to have values satisfying [ 'foo', 'bar', match(truthy) ]\n" +
                   "\n" +
                   "  invocations(\n" +
                   "    spy( 'foo', 'bar', 'baz' ),\n" +
                   "    spy([\n" +
                   "      'foo',\n" +
                   "      'bar',\n" +
                   "      'baz',\n" +
                   "      'qux' // should be removed\n" +
                   "    ])\n" +
                   "  )");
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
                       "  expected invocations( stub() ) to have values satisfying 'threw', { name: 'TypeError' }\n" +
                       "\n" +
                       "  invocations(\n" +
                       "    stub() // expected stub() threw { name: 'TypeError' }\n" +
                       "           //   expected Error() to satisfy { name: 'TypeError' }\n" +
                       "           //\n" +
                       "           //   {\n" +
                       "           //     message: '',\n" +
                       "           //     name: 'Error' // should equal 'TypeError'\n" +
                       "           //                   // -Error\n" +
                       "           //                   // +TypeError\n" +
                       "           //   }\n" +
                       "  )");
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
                       "  expected invocations( stub() ) to have values satisfying 'threw', Error()\n" +
                       "\n" +
                       "  invocations(\n" +
                       "    stub() // expected stub() threw Error()\n" +
                       "           //   expected TypeError() to satisfy Error()\n" +
                       "  )");
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
                    });
                    try { spy(); } catch (e) {}
                    spy();
                    expect(spy, 'always threw');
                }, 'to throw exception',
                       "expected spy always threw\n" +
                       "  expected invocations( spy(), spy() ) to have values satisfying 'threw'\n" +
                       "\n" +
                       "  invocations(\n" +
                       "    spy(),\n" +
                       "    spy() // expected spy() threw\n" +
                       "  )");
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
                       "  expected invocations( stub(), stub() ) to have values satisfying 'threw', { name: 'Error' }\n" +
                       "\n" +
                       "  invocations(\n" +
                       "    stub(),\n" +
                       "    stub() // expected stub() threw { name: 'Error' }\n" +
                       "           //   expected TypeError() to satisfy { name: 'Error' }\n" +
                       "           //\n" +
                       "           //   {\n" +
                       "           //     message: '',\n" +
                       "           //     name: 'TypeError' // should equal 'Error'\n" +
                       "           //                       // -TypeError\n" +
                       "           //                       // +Error\n" +
                       "           //   }\n" +
                       "  )");
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
                       "  expected invocations( stub(), stub() ) to have values satisfying 'threw', Error()\n" +
                       "\n" +
                       "  invocations(\n" +
                       "    stub(),\n" +
                       "    stub() // expected stub() threw Error()\n" +
                       "           //   expected TypeError() to satisfy Error()\n" +
                       "  )");
            });
        });
    });
});
