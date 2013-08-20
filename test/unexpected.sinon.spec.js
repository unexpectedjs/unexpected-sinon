describe('unexpected.sinon', function () {
    describe('was called assertion', function () {
        it('asserts that a spy was called', function () {
            var spy = sinon.spy();
            spy();
            expect(spy, "was called");
        });

        it('fails if spy was not called', function () {
            expect(function () {
                expect(sinon.spy(), "was called");
            }, "to throw exception", "expected spy to have been called at least once but was never called");
        });
    });

    describe('was not called assertion', function () {
        it('asserts that a spy was not called', function () {
            expect(sinon.spy(), "was not called");
        });

        it('fails if spy was called', function () {
            expect(function () {
                var spy = sinon.spy();
                spy();
                expect(spy, "was not called");
            }, "to throw exception", /expected spy to not have been called but was called once/);
        });
    });
});
