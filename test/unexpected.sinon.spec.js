describe('unexpected.sinon', function () {
    var spy;
    beforeEach(function () {
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
            }, "to throw exception", "expected spy to have been called at least once but was never called");
        });
    });

    describe('was not called', function () {
        it('passes if spy was never called', function () {
            expect(spy, "was not called");
        });

        it('fails if spy was called', function () {
            expect(function () {
                spy();
                expect(spy, "was not called");
            }, "to throw exception", /expected spy to not have been called but was called once/);
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
            }, "to throw exception", 'expected spy to be called once but was called 0 times');

            expect(function () {
                spy(); spy();
                expect(spy, "was called once");
            }, "to throw exception", /expected spy to be called once but was called twice/);
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
            }, "to throw exception", /expected spy to be called twice but was called 0 times/);

            expect(function () {
                var spy = sinon.spy();
                spy();
                expect(spy, "was called twice");
            }, "to throw exception", /expected spy to be called twice but was called once/);

            expect(function () {
                var spy = sinon.spy();
                spy(); spy(); spy();
                expect(spy, "was called twice");
            }, "to throw exception", /expected spy to be called twice but was called thrice/);
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
            }, "to throw exception", /expected spy to be called thrice but was called twice/);

            expect(function () {
                var spy = sinon.spy();
                spy(); spy(); spy(); spy();
                expect(spy, "was called thrice");
            }, "to throw exception", /expected spy to be called thrice but was called 4 times/);
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
            }, "to throw exception", /expected spy to be called thrice but was called twice/);

            expect(function () {
                var spy = sinon.spy();
                spy(); spy(); spy(); spy();
                expect(spy, "was called times", 3);
            }, "to throw exception", /expected spy to be called thrice but was called 4 times/);
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
        it('passes if the spy was ever called with obj as its this value');
        it('fails if the spy was never called with obj as its this value');
    });

    describe('was always called on', function () {
        it('passes if the spy was always called with obj as its this value');
        it('fails if the spy was called with another obj as its this value');
    });

    describe('was called with', function () {
        // TODO test with matchers
        it('passes if the spy was called with the provided arguments');
        it('fails if the spy was not called with the provided arguments');
    });

    describe('was always called with', function () {
        // TODO test with matchers
        it('passes if the spy was always called with the provided arguments');
        it('fails if the spy was called once with other arguments then the provided');
    });

    describe('was never called with', function () {
        // TODO test with matchers
        it('passes if the spy was never called with the provided arguments');
        it('fails if the spy was called with the provided arguments');
    });

    describe('was called with exactly', function () {
        it('passes if the spy was called with the provided arguments and no others');
        it('fails if the spy was never called with the provided arguments and no others');
    });

    describe('was always called with exactly', function () {
        it('passes if the spy was always called with the provided arguments and no others');
        it('fails if the spy was ever called with anything else than the provided arguments');
    });

    describe('threw', function () {
        // TODO test with type string and object
        it('passes if the spy threw the given exception');
        it('fails if the spy never threw the given exception');
    });

    describe('always threw', function () {
        // TODO test with type string and object
        it('passes if the spy always threw the given exception');
        it('fails if the spy did not always threw the given exception');
    });
});
