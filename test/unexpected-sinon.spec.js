/*global describe, it, beforeEach, sinon, unexpected*/

// Bogus class to be used with sinon.createStubInstance:
function MyClass() {
  throw new Error('oh no');
}
MyClass.prototype.foo = () => {
  throw new Error('oh no');
};
MyClass.prototype.bar = () => {
  throw new Error('oh no');
};

unexpected.addAssertion('<any> to inspect as <any>', (expect, subject, value) => {
  expect.errorMode = 'nested';
  expect(expect.inspect(subject).toString(), 'to satisfy', value);
});

describe('unexpected-sinon', () => {
  let expect, spy;

  beforeEach(() => {
    expect = unexpected.clone();
    expect.output.preferredWidth = 120;
    spy = sinon.spy().named('spy1');
  });

  it('should inspect a spy correctly', () => {
    expect(spy, 'to inspect as', /^spy\d+$/);
  });

  it('should inspect a stub correctly', () => {
    expect(sinon.stub(), 'to inspect as', /^stub\d+$/);
  });

  it('should inspect a fake correctly', () => {
    expect(sinon.fake(), 'to inspect as', /^fake\d+$/);
  });

  describe('was called', () => {
    it('passes if spy was called at least once', () => {
      spy();
      expect(spy, 'was called');
    });

    it('fails if spy was never called', () => {
      expect(
        () => {
          expect(spy, 'was called');
        },
        'to throw exception',
        'expected spy1 was called'
      );
    });
  });

  describe('was not called', () => {
    it('passes if spy was never called', () => {
      expect(spy, 'was not called');
    });

    it('fails if spy was called', () => {
      expect(
        () => {
          spy(42, { foo: 'bar' });
          spy('baz');
          expect(spy, 'was not called');
        },
        'to throw exception',
        'expected spy1 was not called\n' +
          '\n' +
          "spy1( 42, { foo: 'bar' } ); at theFunction (theFileName:xx:yy) // should be removed\n" +
          "spy1( 'baz' ); at theFunction (theFileName:xx:yy) // should be removed"
      );
    });
  });

  describe('was called once', () => {
    it('passes if spy was called once and only once', () => {
      spy();
      expect(spy, 'was called once');
    });

    it('fails if spy was not called exactly once', () => {
      expect(
        () => {
          expect(spy, 'was called once');
        },
        'to throw exception',
        'expected spy1 was called once'
      );

      expect(
        () => {
          spy(42, { foo: 'bar' });
          spy('baz');
          expect(spy, 'was called once');
        },
        'to throw exception',
        'expected spy1 was called once\n' +
          '  expected\n' +
          "  spy1( 42, { foo: 'bar' } ); at theFunction (theFileName:xx:yy)\n" +
          "  spy1( 'baz' ); at theFunction (theFileName:xx:yy)\n" +
          '  to have length 1\n' +
          '    expected 2 to be 1'
      );
    });
  });

  describe('was called twice', () => {
    it('passes if spy was called exactly twice', () => {
      spy();
      spy();
      expect(spy, 'was called twice');
    });

    it('fails if spy was not called exactly twice', () => {
      expect(
        () => {
          expect(spy, 'was called twice');
        },
        'to throw exception',
        'expected spy1 was called twice'
      );

      expect(
        () => {
          const spy = sinon.spy().named('spy1');
          spy();
          expect(spy, 'was called twice');
        },
        'to throw exception',
        'expected spy1 was called twice\n' +
          '  expected spy1(); at theFunction (theFileName:xx:yy) to have length 2\n' +
          '    expected 1 to be 2'
      );

      expect(
        () => {
          const spy = sinon.spy().named('spy1');
          spy();
          spy(42);
          spy();
          expect(spy, 'was called twice');
        },
        'to throw exception',
        'expected spy1 was called twice\n' +
          '  expected\n' +
          '  spy1(); at theFunction (theFileName:xx:yy)\n' +
          '  spy1( 42 ); at theFunction (theFileName:xx:yy)\n' +
          '  spy1(); at theFunction (theFileName:xx:yy)\n' +
          '  to have length 2\n' +
          '    expected 3 to be 2'
      );
    });
  });

  describe('was called thrice', () => {
    it('passes if spy was called exactly three times', () => {
      spy();
      spy();
      spy();
      expect(spy, 'was called thrice');
    });

    it('fails if spy was not called exactly three times', () => {
      expect(
        () => {
          const spy = sinon.spy().named('spy1');
          spy();
          spy();
          expect(spy, 'was called thrice');
        },
        'to throw exception',
        'expected spy1 was called thrice\n' +
          '  expected\n' +
          '  spy1(); at theFunction (theFileName:xx:yy)\n' +
          '  spy1(); at theFunction (theFileName:xx:yy)\n' +
          '  to have length 3\n' +
          '    expected 2 to be 3'
      );

      expect(
        () => {
          const spy = sinon.spy().named('spy1');
          spy();
          spy();
          spy();
          spy();
          expect(spy, 'was called thrice');
        },
        'to throw exception',
        'expected spy1 was called thrice\n' +
          '  expected\n' +
          '  spy1(); at theFunction (theFileName:xx:yy)\n' +
          '  spy1(); at theFunction (theFileName:xx:yy)\n' +
          '  spy1(); at theFunction (theFileName:xx:yy)\n' +
          '  spy1(); at theFunction (theFileName:xx:yy)\n' +
          '  to have length 3\n' +
          '    expected 4 to be 3'
      );
    });
  });

  describe('was called times', () => {
    it('passes if the spy was called exactly number of times', () => {
      const spy = sinon.spy();
      spy();
      spy();
      spy();
      spy();
      spy();
      expect(spy, 'was called times', 5);
    });

    it('fails if the spy was not called exactly number of times', () => {
      expect(
        () => {
          const spy = sinon.spy().named('spy1');
          spy();
          spy();
          expect(spy, 'was called times', 3);
        },
        'to throw exception',
        'expected spy1 was called times 3\n' +
          '  expected\n' +
          '  spy1(); at theFunction (theFileName:xx:yy)\n' +
          '  spy1(); at theFunction (theFileName:xx:yy)\n' +
          '  to have length 3\n' +
          '    expected 2 to be 3'
      );

      expect(
        () => {
          const spy = sinon.spy().named('spy1');
          spy();
          spy();
          spy();
          spy();
          expect(spy, 'was called times', 3);
        },
        'to throw exception',
        'expected spy1 was called times 3\n' +
          '  expected\n' +
          '  spy1(); at theFunction (theFileName:xx:yy)\n' +
          '  spy1(); at theFunction (theFileName:xx:yy)\n' +
          '  spy1(); at theFunction (theFileName:xx:yy)\n' +
          '  spy1(); at theFunction (theFileName:xx:yy)\n' +
          '  to have length 3\n' +
          '    expected 4 to be 3'
      );
    });
  });

  describe('was called the new operator', () => {
    it('passes if spy was called the new operator', () => {
      new spy(); // eslint-disable-line no-new, new-cap
      expect(spy, 'was called with new');
    });
    it('fails if spy was never called with new operator', () => {
      expect(
        () => {
          const spy = sinon.spy().named('spy1');
          spy();
          expect(spy, 'was called with new');
        },
        'to throw exception',
        'expected spy1 was called with new'
      );
    });
  });

  describe('given call order', () => {
    it('passes if the provided spies where called in the given order', () => {
      const agent005 = sinon.spy().named('agent005');
      const agent006 = sinon.spy().named('agent006');
      const agent007 = sinon.spy().named('agent007');
      agent005();
      agent006();
      agent007();
      expect([agent005, agent006, agent007], 'given call order');
    });

    it('passes if the provided spies were called multiple times in the given order', () => {
      const agent005 = sinon.spy().named('agent005');
      const agent006 = sinon.spy().named('agent006');
      const agent007 = sinon.spy().named('agent007');
      agent005();
      agent006();
      agent007();
      agent005();
      agent006();
      agent007();
      expect(
        [agent005, agent006, agent007, agent005, agent006, agent007],
        'given call order'
      );
    });

    it('passes if the provided spies were called multiple times in the wrong order', () => {
      const agent005 = sinon.spy().named('agent005');
      const agent006 = sinon.spy().named('agent006');
      const agent007 = sinon.spy().named('agent007');
      agent005();
      agent006();
      agent007();
      agent005();
      agent006();
      agent007();
      expect(
        () => {
          expect(
            [agent005, agent006, agent007, agent005, agent006, agent005],
            'given call order'
          );
        },
        'to throw',
        'expected [ agent005, agent006, agent007, agent005, agent006, agent005 ] given call order\n' +
          '\n' +
          'agent005(); at theFunction (theFileName:xx:yy)\n' +
          'agent006(); at theFunction (theFileName:xx:yy)\n' +
          'agent007(); at theFunction (theFileName:xx:yy)\n' +
          'agent005(); at theFunction (theFileName:xx:yy)\n' +
          'agent006(); at theFunction (theFileName:xx:yy)\n' +
          'agent007(); at theFunction (theFileName:xx:yy) // should be agent005'
      );
    });

    it('fails if the provided spies were all called, but not in the given order', () => {
      expect(
        () => {
          const agent005 = sinon.spy().named('agent005');
          const agent006 = sinon.spy().named('agent006');
          const agent007 = sinon.spy().named('agent007');
          agent005();
          agent007();
          agent006();
          expect([agent005, agent006, agent007], 'given call order');
        },
        'to throw exception',
        'expected [ agent005, agent006, agent007 ] given call order\n' +
          '\n' +
          '    agent005(); at theFunction (theFileName:xx:yy)\n' +
          '┌─▷\n' +
          '│   agent007(); at theFunction (theFileName:xx:yy)\n' +
          '└── agent006(); at theFunction (theFileName:xx:yy) // should be moved'
      );
    });

    it('fails if one of the spies was never called', () => {
      expect(
        () => {
          const agent005 = sinon.spy().named('agent005');
          const agent006 = sinon.spy().named('agent006');
          const agent007 = sinon.spy().named('agent007');
          agent005();
          agent006();
          expect([agent005, agent006, agent007], 'given call order');
        },
        'to throw exception',
        'expected [ agent005, agent006, agent007 ] given call order\n' +
          '\n' +
          'agent005(); at theFunction (theFileName:xx:yy)\n' +
          'agent006(); at theFunction (theFileName:xx:yy)\n' +
          '// missing { spy: agent007 }'
      );
    });

    it('fails with an intelligible error message when none of the spies were called', () => {
      expect(
        () => {
          const agent005 = sinon.spy().named('agent005');
          const agent006 = sinon.spy().named('agent006');
          const agent007 = sinon.spy().named('agent007');
          expect([agent005, agent006, agent007], 'given call order');
        },
        'to throw exception',
        'expected [ agent005, agent006, agent007 ] given call order\n' +
          '\n' +
          '// missing { spy: agent005 }\n' +
          '// missing { spy: agent006 }\n' +
          '// missing { spy: agent007 }'
      );
    });
  });

  describe('was called on', () => {
    it('passes if the spy was ever called with obj as its this value', () => {
      const obj = {
        spy: sinon.spy()
      };
      obj.spy();
      obj.spy.call(null);
      expect(obj.spy, 'was called on', obj);
    });

    it('fails if the spy was never called with obj as its this value', () => {
      expect(
        () => {
          expect(spy, 'was called on', { other: true });
        },
        'to throw exception',
        'expected spy1 was called on { other: true }\n' +
          '  spy was never called'
      );
    });
  });

  describe('was always called on', () => {
    it('passes if the spy was always called with obj as its this value', () => {
      const obj = {
        spy: sinon.spy()
      };
      obj.spy();
      obj.spy();
      expect(obj.spy, 'was always called on', obj);
    });

    it('fails if the spy was called with another obj as its this value', () => {
      expect(
        () => {
          const obj = {
            spy: sinon.spy().named('spy1')
          };
          obj.spy();
          obj.spy.call(null);
          expect(obj.spy, 'was always called on', obj);
        },
        'to throw exception',
        'expected spy1 was always called on { spy: spy1 }\n' +
          '\n' +
          'spy1(); at theFunction (theFileName:xx:yy)\n' +
          'spy1(); at theFunction (theFileName:xx:yy)\n' +
          '// expected: was called on { spy: spy1 }\n' +
          '//   expected spy1 to be called with { spy: spy1 } as this but was called with null'
      );
    });
  });

  describe('was called with', () => {
    it('passes if the spy was called with the provided arguments', () => {
      spy('something else');
      spy({ foo: 'bar' }, 'baz', true, false);
      expect(
        spy,
        'was called with',
        { foo: 'bar' },
        'baz',
        expect.it('to be truthy')
      );
    });

    it('considers arguments to be satisfied if they satisfy Object.is', () => {
      const circular = {};
      circular.loop = circular;
      spy(circular);
      expect(spy, 'was called with', circular);
    });

    it('fails if the spy was not called with the provided arguments', () => {
      expect(
        () => {
          spy({ foo: 'baa' }, 'baz', true, false);
          expect(
            spy,
            'was called with',
            { foo: 'bar' },
            'baz',
            expect.it('to be truthy')
          );
        },
        'to throw exception',
        "expected spy1 was called with { foo: 'bar' }, 'baz', expect.it('to be truthy')\n" +
          '\n' +
          'spy1(\n' +
          '  {\n' +
          "    foo: 'baa' // should equal 'bar'\n" +
          '               //\n' +
          '               // -baa\n' +
          '               // +bar\n' +
          '  },\n' +
          "  'baz',\n" +
          '  true,\n' +
          '  false\n' +
          '); at theFunction (theFileName:xx:yy)'
      );
    });
  });

  describe('was always called with', () => {
    it('passes if the spy was always called with the provided arguments', () => {
      spy({ foo: 'bar' }, 'baz', true, false);
      spy({ foo: 'bar' }, 'baz', true, false);
      expect(
        spy,
        'was always called with',
        { foo: 'bar' },
        'baz',
        expect.it('to be truthy')
      );
    });

    it('fails if the spy was called once with other arguments then the provided', () => {
      expect(
        () => {
          spy('something else');
          spy({ foo: 'bar' }, 'baz', true, false);
          expect(
            spy,
            'was always called with',
            { foo: 'bar' },
            'baz',
            expect.it('to be truthy')
          );
        },
        'to throw exception',
        "expected spy1 was always called with { foo: 'bar' }, 'baz', expect.it('to be truthy')\n" +
          '\n' +
          'spy1(\n' +
          "  'something else' // should equal { foo: 'bar' }\n" +
          "  // missing 'baz'\n" +
          '  // missing: should be truthy\n' +
          '); at theFunction (theFileName:xx:yy)\n' +
          "spy1( { foo: 'bar' }, 'baz', true, false ); at theFunction (theFileName:xx:yy)"
      );
    });

    it('renders a nice diff for extraneous arguments', () => {
      expect(
        () => {
          spy('a', 'b', 'c');
          expect(spy, 'was always called with exactly', 'a', 'c');
        },
        'to throw exception',
        "expected spy1 was always called with exactly 'a', 'c'\n" +
          '\n' +
          'spy1(\n' +
          "  'a',\n" +
          "  'b', // should be removed\n" +
          "  'c'\n" +
          '); at theFunction (theFileName:xx:yy)'
      );
    });

    it('renders a nice diff for missing arguments', () => {
      expect(
        () => {
          spy('a', 'c');
          expect(spy, 'was always called with exactly', 'a', 'b', 'c');
        },
        'to throw exception',
        "expected spy1 was always called with exactly 'a', 'b', 'c'\n" +
          '\n' +
          'spy1(\n' +
          "  'a',\n" +
          "  // missing 'b'\n" +
          "  'c'\n" +
          '); at theFunction (theFileName:xx:yy)'
      );
    });
  });

  describe('was never called with', () => {
    it('passes if the spy was never called with the provided arguments', () => {
      spy('foo', 'true');
      expect(spy, 'was never called with', 'bar', expect.it('to be truthy'));
    });

    it('fails if the spy was called with the provided arguments', () => {
      expect(
        () => {
          spy('bar', 'true');
          expect(
            spy,
            'was never called with',
            'bar',
            expect.it('to be truthy')
          );
        },
        'to throw exception',
        "expected spy1 was never called with 'bar', expect.it('to be truthy')\n" +
          '\n' +
          "spy1( 'bar', 'true' ); at theFunction (theFileName:xx:yy)\n" +
          "// should not satisfy { args: { 0: 'bar', 1: expect.it('to be truthy') } }"
      );
    });

    it('fails if the spy has a call that satisfies the criteria and another call that does not', () => {
      expect(
        () => {
          spy('foo');
          spy('bar', {});
          expect(spy, 'was never called with', 'bar');
        },
        'to throw exception',
        "expected spy1 was never called with 'bar'\n" +
          '\n' +
          "spy1( 'foo' ); at theFunction (theFileName:xx:yy)\n" +
          "spy1( 'bar', {} ); at theFunction (theFileName:xx:yy) // should not satisfy { args: { 0: 'bar' } }"
      );
    });
  });

  ['to have no calls satisfying', 'not to have calls satisfying'].forEach(
    assertion => {
      describe(assertion, () => {
        // Regression test
        it('should order the calls in the timeline correctly', () => {
          const spy2 = sinon.spy().named('spy2');
          spy(123);
          spy2(456);
          spy(123);
          return expect(
            () => expect([spy, spy2], assertion, () => {
              spy2(456);
            }),
            'to error with',
            'expected [ spy1, spy2 ] ' +
              assertion +
              ' spy2( 456 );\n' +
              '\n' +
              'spy1( 123 ); at theFunction (theFileName:xx:yy)\n' +
              'spy2( 456 ); at theFunction (theFileName:xx:yy) // should be removed\n' +
              'spy1( 123 ); at theFunction (theFileName:xx:yy)'
          );
        });

        it('passes if the spy was never called with the provided arguments', () => {
          spy('foo', 'true');
          expect(spy, assertion, ['bar', expect.it('to be truthy')]);
        });

        it('fails if the spy was called with the provided arguments', () => {
          expect(
            () => {
              spy('bar', 'true');
              expect(spy, assertion, ['bar', expect.it('to be truthy')]);
            },
            'to throw exception',
            'expected spy1 ' +
              assertion +
              " [ 'bar', expect.it('to be truthy') ]\n" +
              '\n' +
              "spy1( 'bar', 'true' ); at theFunction (theFileName:xx:yy) // should be removed"
          );
        });

        it('fails if the spy has a call that satisfies the criteria and another call that does not', () => {
          expect(
            () => {
              spy('foo');
              spy('bar', {});
              expect(spy, assertion, { 0: 'bar' });
            },
            'to throw exception',
            'expected spy1 ' +
              assertion +
              " { 0: 'bar' }\n" +
              '\n' +
              "spy1( 'foo' ); at theFunction (theFileName:xx:yy)\n" +
              "spy1( 'bar', {} ); at theFunction (theFileName:xx:yy) // should be removed"
          );
        });

        describe('when passed a sinon stub instance as the subject', () => {
          it('should succeed', () => {
            const stubInstance = sinon.createStubInstance(MyClass);
            stubInstance.foo(123);
            return expect(stubInstance, assertion, () => {
              stubInstance.foo(456);
            });
          });

          it('should fail with a diff', () => {
            const stubInstance = sinon.createStubInstance(MyClass);
            stubInstance.foo(123);
            stubInstance.bar(456);
            stubInstance.foo(123);
            return expect(
              () => expect(stubInstance, assertion, () => {
                stubInstance.bar(456);
              }),
              'to error with',
              'expected MyClass({ foo, bar }) ' +
                assertion +
                ' bar( 456 );\n' +
                '\n' +
                'foo( 123 ); at theFunction (theFileName:xx:yy)\n' +
                'bar( 456 ); at theFunction (theFileName:xx:yy) // should be removed\n' +
                'foo( 123 ); at theFunction (theFileName:xx:yy)'
            );
          });

          it('should dot out the list of contained spies when they exceed expect.output.preferredWidth', () => {
            expect.output.preferredWidth = 45;
            const stubInstance = sinon.createStubInstance(MyClass);
            stubInstance.foo(123);
            stubInstance.bar(456);
            stubInstance.foo(123);
            return expect(
              () => expect(stubInstance, assertion, () => {
                stubInstance.bar(456);
              }),
              'to error with',
              'expected MyClass({ foo /* 1 more */ })\n' +
                assertion +
                ' bar( 456 );\n' +
                '\n' +
                'foo( 123 ); at theFunction (theFileName:xx:yy)\n' +
                'bar( 456 ); at theFunction (theFileName:xx:yy) // should be removed\n' +
                'foo( 123 ); at theFunction (theFileName:xx:yy)'
            );
          });
        });

        describe('when passed an array of sinon stub instances as the subject', () => {
          it('should succeed', () => {
            const stubInstance1 = sinon.createStubInstance(MyClass);
            stubInstance1.foo(123);
            const stubInstance2 = sinon.createStubInstance(MyClass);
            stubInstance2.foo(123);
            return expect(
              [stubInstance1, stubInstance2],
              assertion,
              () => {
                stubInstance1.foo(456);
              }
            );
          });

          it('should fail with a diff', () => {
            const stubInstance1 = sinon.createStubInstance(MyClass);
            stubInstance1.foo(123);
            const stubInstance2 = sinon.createStubInstance(MyClass);
            stubInstance2.foo(123);
            return expect(
              () => expect(
                [stubInstance1, stubInstance2],
                assertion,
                () => {
                  stubInstance1.foo(123);
                }
              ),
              'to error with',
              'expected [ MyClass({ foo, bar }), MyClass({ foo, bar }) ] ' +
                assertion +
                ' foo( 123 );\n' +
                '\n' +
                'foo( 123 ); at theFunction (theFileName:xx:yy)\n' +
                'foo( 123 ); at theFunction (theFileName:xx:yy) // should be removed'
            );
          });
        });

        describe('when passed a spec object', () => {
          it('should succeed when no spy call satisfies the spec', () => {
            spy(123, 456);
            expect(spy, assertion, {
              args: [789]
            });
          });

          it('should fail when the spy was called with the provided parameters', () => {
            spy(456);
            spy(567);
            expect(
              () => {
                expect(spy, assertion, {
                  args: [456]
                });
              },
              'to throw',
              'expected spy1 ' +
                assertion +
                ' { args: [ 456 ] }\n' +
                '\n' +
                'spy1( 456 ); at theFunction (theFileName:xx:yy) // should be removed\n' +
                'spy1( 567 ); at theFunction (theFileName:xx:yy)'
            );
          });
        });

        describe('when passed an array (shorthand for {args: ...})', () => {
          it('should succeed', () => {
            spy(123, { foo: 'baz' });
            expect(spy, assertion, [123, { foo: 'bar' }]);
          });

          it('should fail with a diff', () => {
            expect(
              () => {
                spy(123, { foo: 'bar' });
                expect(spy, assertion, [123, { foo: 'bar' }]);
              },
              'to throw',
              'expected spy1 ' +
                assertion +
                " [ 123, { foo: 'bar' } ]\n" +
                '\n' +
                "spy1( 123, { foo: 'bar' } ); at theFunction (theFileName:xx:yy) // should be removed"
            );
          });
        });

        describe('when passed an array with only numerical properties (shorthand for {args: ...})', () => {
          it('should succeed', () => {
            spy(123, { foo: 'bar' });
            expect(spy, assertion, { 0: 123, 1: { foo: 'baz' } });
          });

          it('should fail with a diff', () => {
            expect(
              () => {
                spy(123, { foo: 'baz' });
                expect(spy, assertion, { 0: 123, 1: { foo: 'baz' } });
              },
              'to throw',
              'expected spy1 ' +
                assertion +
                " { 0: 123, 1: { foo: 'baz' } }\n" +
                '\n' +
                "spy1( 123, { foo: 'baz' } ); at theFunction (theFileName:xx:yy) // should be removed"
            );
          });
        });

        describe('when passed a function that performs the expected call', () => {
          it('should succeed when a spy call satisfies the spec', () => {
            spy(123, 789);
            expect(spy, assertion, () => {
              spy(123, 456);
            });
          });

          it('should fail if the function does not call the spy', () => {
            expect(
              () => {
                expect(spy, assertion, () => {});
              },
              'to throw',
              'expected spy1 ' +
                assertion +
                ' function () {}\n' +
                '  expected the provided function to call the spy exactly once, but it called it 0 times'
            );
          });

          it('should fail if the function calls the spy more than once', () => {
            expect(
              () => {
                expect(spy, assertion, () => {
                  spy(123);
                  spy(456);
                });
              },
              'to throw',
              'expected spy1 ' +
                assertion +
                '\n' +
                'spy1( 123 );\n' +
                'spy1( 456 );\n' +
                '  expected the provided function to call the spy exactly once, but it called it 2 times'
            );
          });

          it('should fail when the spy was called with the given arguments', () => {
            spy(123);
            spy(456);
            expect(
              () => {
                expect(spy, assertion, () => {
                  spy(456);
                });
              },
              'to throw',
              'expected spy1 ' +
                assertion +
                ' spy1( 456 );\n' +
                '\n' +
                'spy1( 123 ); at theFunction (theFileName:xx:yy)\n' +
                'spy1( 456 ); at theFunction (theFileName:xx:yy) // should be removed'
            );
          });
        });

        describe('when passed a sinon sandbox as the subject', () => {
          it('should succeed', () => {
            const sandbox = sinon.createSandbox();
            const spy1 = sandbox.spy().named('spy1');
            const spy2 = sandbox.spy().named('spy2');
            spy1(123);
            spy2(456);
            return expect(sandbox, assertion, { spy: spy1, args: [789] });
          });

          it('should fail with a diff', () => {
            const sandbox = sinon.createSandbox();
            const spy1 = sandbox.spy().named('spy1');
            spy1(456);
            return expect(
              () => expect(sandbox, assertion, { spy: spy1, args: [456] }),
              'to error with',
              'expected sinon sandbox ' +
                assertion +
                ' { spy: spy1, args: [ 456 ] }\n' +
                '\n' +
                'spy1( 456 ); at theFunction (theFileName:xx:yy) // should be removed'
            );
          });
        });

        describe('when passed an array of spies as the subject', () => {
          it('should succeed', () => {
            const spy1 = sinon.spy().named('spy1');
            const spy2 = sinon.spy().named('spy2');
            spy1(123);
            spy2(456);
            return expect([spy1, spy2], assertion, { spy: spy1, args: [789] });
          });

          it('should fail with a diff', () => {
            const sandbox = sinon.createSandbox();
            const spy1 = sandbox.spy().named('spy1');
            const spy2 = sandbox.spy().named('spy2');
            spy1(123);
            spy2(456);
            return expect(
              () => expect([spy1, spy2], assertion, {
                spy: spy1,
                args: [123]
              }),
              'to error with',
              'expected [ spy1, spy2 ] ' +
                assertion +
                ' { spy: spy1, args: [ 123 ] }\n' +
                '\n' +
                'spy1( 123 ); at theFunction (theFileName:xx:yy) // should be removed\n' +
                'spy2( 456 ); at theFunction (theFileName:xx:yy)'
            );
          });
        });
      });
    }
  );

  describe('was called with exactly', () => {
    it('passes if the spy was called with the provided arguments and no others', () => {
      spy('foo', 'bar', 'baz');
      spy('foo', 'bar', 'baz');
      expect(
        spy,
        'was called with exactly',
        'foo',
        'bar',
        expect.it('to be truthy')
      );
    });

    it('fails if the spy was never called with the provided arguments and no others', () => {
      expect(
        () => {
          spy('foo', 'bar', 'baz', 'qux');
          expect(
            spy,
            'was called with exactly',
            'foo',
            'bar',
            expect.it('to be truthy')
          );
        },
        'to throw exception',
        "expected spy1 was called with exactly 'foo', 'bar', expect.it('to be truthy')\n" +
          '\n' +
          'spy1(\n' +
          "  'foo',\n" +
          "  'bar',\n" +
          "  'baz',\n" +
          "  'qux' // should be removed\n" +
          '); at theFunction (theFileName:xx:yy)'
      );
    });
  });

  describe('was always called with exactly', () => {
    it('passes if the spy was always called with the provided arguments and no others', () => {
      spy('foo', 'bar', 'baz');
      spy('foo', 'bar', 'baz');
      expect(
        spy,
        'was always called with exactly',
        'foo',
        'bar',
        expect.it('to be truthy')
      );
    });

    it('fails if the spy was ever called with anything else than the provided arguments', () => {
      expect(
        () => {
          spy('foo', 'bar', 'baz');
          spy('foo', 'bar', 'baz', 'qux');
          expect(
            spy,
            'was always called with exactly',
            'foo',
            'bar',
            expect.it('to be truthy')
          );
        },
        'to throw exception',
        "expected spy1 was always called with exactly 'foo', 'bar', expect.it('to be truthy')\n" +
          '\n' +
          "spy1( 'foo', 'bar', 'baz' ); at theFunction (theFileName:xx:yy)\n" +
          'spy1(\n' +
          "  'foo',\n" +
          "  'bar',\n" +
          "  'baz',\n" +
          "  'qux' // should be removed\n" +
          '); at theFunction (theFileName:xx:yy)'
      );
    });
  });

  describe('threw', () => {
    describe('without arguments', () => {
      it('passes if the spy threw an exception', () => {
        const stub = sinon.stub();
        stub.throws();
        try {
          stub();
        } catch (e) {}
        expect(stub, 'threw');
      });

      it('fails if the spy never threw an exception', () => {
        expect(
          () => {
            expect(spy, 'threw');
          },
          'to throw exception',
          /spy did not throw exception/
        );
      });
    });

    describe('given a string as argument', () => {
      it('passes if the spy threw an exception of the given type', () => {
        const stub = sinon.stub();
        stub.throws('TypeError');
        try {
          stub();
        } catch (e) {}
        expect(stub, 'threw', { name: 'TypeError' });
      });

      it('fails if the spy never threw an exception of the given type', () => {
        expect(
          () => {
            const stub = sinon.stub().named('myStub');
            stub.throws('Error');
            try {
              stub();
            } catch (e) {}
            expect(stub, 'threw', { name: 'TypeError' });
          },
          'to throw exception',
          "expected myStub threw { name: 'TypeError' }\n" +
            '\n' +
            "myStub(); at theFunction (theFileName:xx:yy) // expected: threw { name: 'TypeError' }\n" +
            "                                             //   expected Error() to satisfy { name: 'TypeError' }\n" +
            '                                             //\n' +
            '                                             //   {\n' +
            "                                             //     message: '',\n" +
            "                                             //     name: 'Error' // should equal 'TypeError'\n" +
            '                                             //                   //\n' +
            '                                             //                   // -Error\n' +
            '                                             //                   // +TypeError\n' +
            '                                             //   }'
        );
      });
    });

    describe('given a object as argument', () => {
      it('passes if the spy threw the given exception', () => {
        const stub = sinon.stub();
        const error = new Error();
        stub.throws(error);
        try {
          stub();
        } catch (e) {}
        expect(stub, 'threw', error);
      });

      it('fails if the spy never threw the given exception', () => {
        expect(
          () => {
            const stub = sinon.stub().named('myStub');
            stub.throws(new TypeError());
            try {
              stub();
            } catch (e) {}
            expect(stub, 'threw', new Error());
          },
          'to throw exception',
          'expected myStub threw Error()\n' +
            '\n' +
            'myStub(); at theFunction (theFileName:xx:yy) // expected: threw Error()\n' +
            '                                             //   expected TypeError() to satisfy Error()'
        );
      });
    });
  });

  describe('always threw', () => {
    describe('without arguments', () => {
      it('passes if the spy always threw an exception', () => {
        const stub = sinon.stub();
        stub.throws();
        try {
          stub();
        } catch (e) {}
        try {
          stub();
        } catch (e) {}
        expect(stub, 'always threw');
      });

      it('fails if the spy did not always threw an exception', () => {
        expect(
          () => {
            let hasThrown = false;
            const spy = sinon
              .spy(() => {
                if (!hasThrown) {
                  hasThrown = true;
                  throw Error();
                }
              })
              .named('spy1');
            try {
              spy();
            } catch (e) {}
            spy();
            expect(spy, 'always threw');
          },
          'to throw exception',
          'expected spy1 always threw\n' +
            '\n' +
            'spy1(); at theFunction (theFileName:xx:yy)\n' +
            'spy1(); at theFunction (theFileName:xx:yy) // expected: threw'
        );
      });
    });

    describe('given a string as argument', () => {
      it('passes if the spy always threw an exception of the given type', () => {
        const stub = sinon.stub();
        stub.throws('Error');
        try {
          stub();
        } catch (e) {}
        try {
          stub();
        } catch (e) {}
        expect(stub, 'always threw', { name: 'Error' });
      });

      it('fails if the spy did not always threw an exception of the given type', () => {
        expect(
          () => {
            const stub = sinon.stub().named('myStub');
            let callNumber = 0;
            stub.callsFake(() => {
              callNumber += 1;
              if (callNumber === 1) {
                throw new Error();
              } else {
                throw new TypeError();
              }
            });
            try {
              stub();
            } catch (e) {}
            try {
              stub();
            } catch (e) {}
            expect(stub, 'always threw', { name: 'Error' });
          },
          'to throw exception',
          "expected myStub always threw { name: 'Error' }\n" +
            '\n' +
            'myStub(); at theFunction (theFileName:xx:yy)\n' +
            "myStub(); at theFunction (theFileName:xx:yy) // expected: threw { name: 'Error' }\n" +
            "                                             //   expected TypeError() to satisfy { name: 'Error' }\n" +
            '                                             //\n' +
            '                                             //   {\n' +
            "                                             //     message: '',\n" +
            "                                             //     name: 'TypeError' // should equal 'Error'\n" +
            '                                             //                       //\n' +
            '                                             //                       // -TypeError\n' +
            '                                             //                       // +Error\n' +
            '                                             //   }'
        );
      });
    });

    describe('given a object as argument', () => {
      it('passes if the spy always threw the given exception', () => {
        const stub = sinon.stub();
        const error = new Error();
        stub.throws(error);
        try {
          stub();
        } catch (e) {}
        try {
          stub();
        } catch (e) {}
        expect(stub, 'always threw', error);
      });

      it('fails if the spy did not always threw the given exception', () => {
        expect(
          () => {
            const stub = sinon.stub().named('myStub');
            const error = new Error();
            stub.throws(error);
            try {
              stub();
            } catch (e) {}
            stub.throws(new TypeError());
            try {
              stub();
            } catch (e) {}
            expect(stub, 'always threw', error);
          },
          'to throw exception',
          'expected myStub always threw Error()\n' +
            '\n' +
            'myStub(); at theFunction (theFileName:xx:yy)\n' +
            'myStub(); at theFunction (theFileName:xx:yy) // expected: threw Error()\n' +
            '                                             //   expected TypeError() to satisfy Error()'
        );
      });
    });
  });

  describe('spyCall to satisfy', () => {
    it('should throw if an unsupported key is used', () => {
      expect(
        () => {
          spy(123);
          expect(spy, 'to have calls satisfying', [{ foobar: 123 }]);
        },
        'to throw',
        'spyCall to satisfy: Unsupported keys: foobar'
      );
    });
  });

  describe('to have a call satisfying', () => {
    describe('when passed a sinon stub instance as the subject', () => {
      it('should succeed', () => {
        const stubInstance = sinon.createStubInstance(MyClass);
        stubInstance.foo(123);
        stubInstance.foo(456);
        return expect(stubInstance, 'to have a call satisfying', () => {
          stubInstance.foo(123);
        });
      });

      it('should fail with a diff', () => {
        const stubInstance = sinon.createStubInstance(MyClass);
        stubInstance.foo(123);
        stubInstance.bar(456);
        stubInstance.foo(123);
        return expect(
          () => expect(
            stubInstance,
            'to have a call satisfying',
            () => {
              stubInstance.bar(789);
            }
          ),
          'to error with',
          'expected MyClass({ foo, bar }) to have a call satisfying bar( 789 );\n' +
            '\n' +
            'foo( 123 ); at theFunction (theFileName:xx:yy) // should be bar( 789 );\n' +
            'bar(\n' +
            '  456 // should equal 789\n' +
            '); at theFunction (theFileName:xx:yy)\n' +
            'foo( 123 ); at theFunction (theFileName:xx:yy) // should be bar( 789 );'
        );
      });
    });
    describe('when passed a spec object', () => {
      it('should succeed when a spy call satisfies the spec', () => {
        spy(123, 456);
        expect(spy, 'to have a call satisfying', {
          args: [123, 456]
        });
      });

      it('should fail when the spy was not called at all', () => {
        expect(
          () => {
            expect(spy, 'to have a call satisfying', {
              args: [123, 456]
            });
          },
          'to throw',
          'expected spy1 to have a call satisfying { args: [ 123, 456 ] }\n' +
            '  expected [] to have items satisfying { args: [ 123, 456 ] }\n' +
            '    expected [] not to be empty'
        );
      });

      it('should fail when the spy was called but never with the right arguments', () => {
        spy(456);
        spy(567);
        expect(
          () => {
            expect(spy, 'to have a call satisfying', {
              args: [123, 456]
            });
          },
          'to throw',
          'expected spy1 to have a call satisfying { args: [ 123, 456 ] }\n' +
            '\n' +
            'spy1(\n' +
            '  // missing 123\n' +
            '  456\n' +
            '); at theFunction (theFileName:xx:yy)\n' +
            'spy1(\n' +
            '  567 // should equal 123\n' +
            '  // missing 456\n' +
            '); at theFunction (theFileName:xx:yy)'
        );
      });

      describe('with the exhaustively flag', () => {
        it('should succeed when a spy call satisfies the spec', () => {
          spy(123, { foo: 'bar' });
          expect(spy, 'to have a call satisfying', {
            args: [123, { foo: 'bar' }]
          });
        });

        it('should fail when a spy call does not satisfy the spec only because of the "exhaustively" semantics', () => {
          spy(123, { foo: 'bar', quux: 'baz' });
          expect(
            () => {
              expect(spy, 'to have a call exhaustively satisfying', {
                args: [123, { foo: 'bar' }]
              });
            },
            'to throw',
            "expected spy1 to have a call exhaustively satisfying { args: [ 123, { foo: 'bar' } ] }\n" +
              '\n' +
              'spy1(\n' +
              '  123,\n' +
              '  {\n' +
              "    foo: 'bar',\n" +
              "    quux: 'baz' // should be removed\n" +
              '  }\n' +
              '); at theFunction (theFileName:xx:yy)'
          );
        });
      });
    });

    describe('when passed an array (shorthand for {args: ...})', () => {
      it('should succeed', () => {
        spy(123, { foo: 'bar' });
        expect(spy, 'to have a call satisfying', [123, { foo: 'bar' }]);
      });

      it('should fail with a diff', () => {
        expect(
          () => {
            spy(123, { foo: 'bar' });
            expect(spy, 'to have a call satisfying', [123, { foo: 'baz' }]);
          },
          'to throw',
          "expected spy1 to have a call satisfying [ 123, { foo: 'baz' } ]\n" +
            '\n' +
            'spy1(\n' +
            '  123,\n' +
            '  {\n' +
            "    foo: 'bar' // should equal 'baz'\n" +
            '               //\n' +
            '               // -bar\n' +
            '               // +baz\n' +
            '  }\n' +
            '); at theFunction (theFileName:xx:yy)'
        );
      });
    });

    describe('when passed an array with only numerical properties (shorthand for {args: ...})', () => {
      it('should succeed', () => {
        spy(123, { foo: 'bar' });
        expect(spy, 'to have a call satisfying', { 0: 123, 1: { foo: 'bar' } });
      });

      it('should fail with a diff', () => {
        expect(
          () => {
            spy(123, { foo: 'bar' });
            expect(spy, 'to have a call satisfying', {
              0: 123,
              1: { foo: 'baz' }
            });
          },
          'to throw',
          "expected spy1 to have a call satisfying { 0: 123, 1: { foo: 'baz' } }\n" +
            '\n' +
            'spy1(\n' +
            '  123,\n' +
            '  {\n' +
            "    foo: 'bar' // should equal 'baz'\n" +
            '               //\n' +
            '               // -bar\n' +
            '               // +baz\n' +
            '  }\n' +
            '); at theFunction (theFileName:xx:yy)'
        );
      });
    });

    describe('when passed a function that performs the expected call', () => {
      it('should succeed when a spy call satisfies the spec', () => {
        spy(123, 456);
        expect(spy, 'to have a call satisfying', () => {
          spy(123, 456);
        });
      });

      it('should fail if the function does not call the spy', () => {
        expect(
          () => {
            expect(spy, 'to have a call satisfying', () => {});
          },
          'to throw',
          'expected spy1 to have a call satisfying function () {}\n' +
            '  expected the provided function to call the spy exactly once, but it called it 0 times'
        );
      });

      it('should fail if the function calls the spy more than once', () => {
        expect(
          () => {
            expect(spy, 'to have a call satisfying', () => {
              spy(123);
              spy(456);
            });
          },
          'to throw',
          'expected spy1 to have a call satisfying\n' +
            'spy1( 123 );\n' +
            'spy1( 456 );\n' +
            '  expected the provided function to call the spy exactly once, but it called it 2 times'
        );
      });

      it('should fail when the spy was called but never with the right arguments', () => {
        spy(123);
        spy(456);
        expect(
          () => {
            expect(spy, 'to have a call satisfying', () => {
              spy(789);
            });
          },
          'to throw',
          'expected spy1 to have a call satisfying spy1( 789 );\n' +
            '\n' +
            'spy1(\n' +
            '  123 // should equal 789\n' +
            '); at theFunction (theFileName:xx:yy)\n' +
            'spy1(\n' +
            '  456 // should equal 789\n' +
            '); at theFunction (theFileName:xx:yy)'
        );
      });
    });

    describe('when passed a sinon sandbox as the subject', () => {
      it('should succeed', () => {
        const sandbox = sinon.createSandbox();
        const spy1 = sandbox.spy().named('spy1');
        const spy2 = sandbox.spy().named('spy2');
        spy1(123);
        spy2(456);
        return expect(sandbox, 'to have a call satisfying', {
          spy: spy1,
          args: [123]
        });
      });

      it('should fail with a diff', () => {
        const sandbox = sinon.createSandbox();
        const spy1 = sandbox.spy().named('spy1');
        spy1(456);
        return expect(
          () => expect(sandbox, 'to have a call satisfying', {
            spy: spy1,
            args: [123]
          }),
          'to error with',
          'expected sinon sandbox to have a call satisfying { spy: spy1, args: [ 123 ] }\n' +
            '\n' +
            'spy1(\n' +
            '  456 // should equal 123\n' +
            '); at theFunction (theFileName:xx:yy)'
        );
      });
    });

    describe('when passed an array of spies as the subject', () => {
      it('should succeed', () => {
        const spy1 = sinon.spy().named('spy1');
        const spy2 = sinon.spy().named('spy2');
        spy1(123);
        spy2(456);
        return expect([spy1, spy2], 'to have a call satisfying', {
          spy: spy1,
          args: [123]
        });
      });

      it('should fail with a diff', () => {
        const sandbox = sinon.createSandbox();
        const spy1 = sandbox.spy().named('spy1');
        const spy2 = sandbox.spy().named('spy2');
        spy1(123);
        spy2(456);
        return expect(
          () => expect([spy1, spy2], 'to have a call satisfying', {
            spy: spy1,
            args: [789]
          }),
          'to error with',
          'expected [ spy1, spy2 ] to have a call satisfying { spy: spy1, args: [ 789 ] }\n' +
            '\n' +
            'spy1(\n' +
            '  123 // should equal 789\n' +
            '); at theFunction (theFileName:xx:yy)\n' +
            'spy2( 456 ); at theFunction (theFileName:xx:yy) // should be spy1( 789 );'
        );
      });
    });
  });

  describe('to have all calls satisfying', () => {
    describe('when passed a sinon stub instance as the subject', () => {
      it('should succeed', () => {
        const stubInstance = sinon.createStubInstance(MyClass);
        stubInstance.foo(123);
        stubInstance.foo(123);
        return expect(stubInstance, 'to have all calls satisfying', () => {
          stubInstance.foo(123);
        });
      });

      it('should fail with a diff', () => {
        const stubInstance = sinon.createStubInstance(MyClass);
        stubInstance.foo(123);
        stubInstance.bar(456);
        stubInstance.foo(123);
        return expect(
          () => expect(
            stubInstance,
            'to have all calls satisfying',
            () => {
              stubInstance.bar(456);
            }
          ),
          'to error with',
          'expected MyClass({ foo, bar }) to have all calls satisfying bar( 456 );\n' +
            '\n' +
            'foo( 123 ); at theFunction (theFileName:xx:yy) // should be bar( 456 );\n' +
            'bar( 456 ); at theFunction (theFileName:xx:yy)\n' +
            'foo( 123 ); at theFunction (theFileName:xx:yy) // should be bar( 456 );'
        );
      });
    });

    describe('when passed a spec object', () => {
      it('should succeed when a spy call satisfies the spec', () => {
        spy(123, 456);
        expect(spy, 'to have all calls satisfying', {
          args: [123, 456]
        });
      });

      it('should fail when the spy was not called at all', () => {
        expect(
          () => {
            expect(spy, 'to have all calls satisfying', {
              args: [123, 456]
            });
          },
          'to throw',
          'expected spy1 to have all calls satisfying { args: [ 123, 456 ] }\n' +
            '  expected [] to have items satisfying { args: [ 123, 456 ] }\n' +
            '    expected [] not to be empty'
        );
      });

      it('should fail when one of the calls had the wrong arguments', () => {
        spy(456);
        spy(567);
        expect(
          () => {
            expect(spy, 'to have all calls satisfying', {
              args: [456]
            });
          },
          'to throw',
          'expected spy1 to have all calls satisfying { args: [ 456 ] }\n' +
            '\n' +
            'spy1( 456 ); at theFunction (theFileName:xx:yy)\n' +
            'spy1(\n' +
            '  567 // should equal 456\n' +
            '); at theFunction (theFileName:xx:yy)'
        );
      });

      describe('with the exhaustively flag', () => {
        it('should succeed when a spy call satisfies the spec', () => {
          spy(123, { foo: 'bar' });
          expect(spy, 'to have all calls satisfying', {
            args: [123, { foo: 'bar' }]
          });
        });

        it('should fail when a spy call does not satisfy the spec only because of the "exhaustively" semantics', () => {
          spy(123, { foo: 'bar', quux: 'baz' });
          expect(
            () => {
              expect(spy, 'to have all calls exhaustively satisfying', {
                args: [123, { foo: 'bar' }]
              });
            },
            'to throw',
            "expected spy1 to have all calls exhaustively satisfying { args: [ 123, { foo: 'bar' } ] }\n" +
              '\n' +
              'spy1(\n' +
              '  123,\n' +
              '  {\n' +
              "    foo: 'bar',\n" +
              "    quux: 'baz' // should be removed\n" +
              '  }\n' +
              '); at theFunction (theFileName:xx:yy)'
          );
        });
      });
    });

    describe('when passed an array (shorthand for {args: ...})', () => {
      it('should succeed', () => {
        spy(123, { foo: 'bar' });
        expect(spy, 'to have all calls satisfying', [123, { foo: 'bar' }]);
      });

      it('should fail with a diff', () => {
        expect(
          () => {
            spy(123, { foo: 'bar' });
            expect(spy, 'to have all calls satisfying', [123, { foo: 'baz' }]);
          },
          'to throw',
          "expected spy1 to have all calls satisfying [ 123, { foo: 'baz' } ]\n" +
            '\n' +
            'spy1(\n' +
            '  123,\n' +
            '  {\n' +
            "    foo: 'bar' // should equal 'baz'\n" +
            '               //\n' +
            '               // -bar\n' +
            '               // +baz\n' +
            '  }\n' +
            '); at theFunction (theFileName:xx:yy)'
        );
      });
    });

    describe('when passed an array with only numerical properties (shorthand for {args: ...})', () => {
      it('should succeed', () => {
        spy(123, { foo: 'bar' });
        expect(spy, 'to have all calls satisfying', {
          0: 123,
          1: { foo: 'bar' }
        });
      });

      it('should fail with a diff', () => {
        expect(
          () => {
            spy(123, { foo: 'bar' });
            expect(spy, 'to have all calls satisfying', {
              0: 123,
              1: { foo: 'baz' }
            });
          },
          'to throw',
          "expected spy1 to have all calls satisfying { 0: 123, 1: { foo: 'baz' } }\n" +
            '\n' +
            'spy1(\n' +
            '  123,\n' +
            '  {\n' +
            "    foo: 'bar' // should equal 'baz'\n" +
            '               //\n' +
            '               // -bar\n' +
            '               // +baz\n' +
            '  }\n' +
            '); at theFunction (theFileName:xx:yy)'
        );
      });
    });

    describe('when passed a function that performs the expected call', () => {
      it('should succeed when a spy call satisfies the spec', () => {
        spy(123, 456);
        expect(spy, 'to have all calls satisfying', () => {
          spy(123, 456);
        });
      });

      it('should fail if the function does not call the spy', () => {
        expect(
          () => {
            expect(spy, 'to have all calls satisfying', () => {});
          },
          'to throw',
          'expected spy1 to have all calls satisfying function () {}\n' +
            '  expected the provided function to call the spy exactly once, but it called it 0 times'
        );
      });

      it('should fail if the function calls the spy more than once', () => {
        expect(
          () => {
            expect(spy, 'to have all calls satisfying', () => {
              spy(123);
              spy(456);
            });
          },
          'to throw',
          'expected spy1 to have all calls satisfying\n' +
            'spy1( 123 );\n' +
            'spy1( 456 );\n' +
            '  expected the provided function to call the spy exactly once, but it called it 2 times'
        );
      });

      it('should fail when the spy was called, but one of the calls had the wrong arguments', () => {
        spy(123);
        spy(456);
        expect(
          () => {
            expect(spy, 'to have all calls satisfying', () => {
              spy(123);
            });
          },
          'to throw',
          'expected spy1 to have all calls satisfying spy1( 123 );\n' +
            '\n' +
            'spy1( 123 ); at theFunction (theFileName:xx:yy)\n' +
            'spy1(\n' +
            '  456 // should equal 123\n' +
            '); at theFunction (theFileName:xx:yy)'
        );
      });
    });

    describe('when passed a sinon sandbox as the subject', () => {
      it('should succeed', () => {
        const sandbox = sinon.createSandbox();
        const spy1 = sandbox.spy().named('spy1');
        sandbox.spy().named('spy2');
        spy1(123);
        spy1(123);
        return expect(sandbox, 'to have all calls satisfying', {
          spy: spy1,
          args: [123]
        });
      });

      it('should fail with a diff', () => {
        const sandbox = sinon.createSandbox();
        const spy1 = sandbox.spy().named('spy1');
        spy1(456);
        return expect(
          () => expect(sandbox, 'to have all calls satisfying', {
            spy: spy1,
            args: [123]
          }),
          'to error with',
          'expected sinon sandbox to have all calls satisfying { spy: spy1, args: [ 123 ] }\n' +
            '\n' +
            'spy1(\n' +
            '  456 // should equal 123\n' +
            '); at theFunction (theFileName:xx:yy)'
        );
      });
    });

    describe('when passed an array of spies as the subject', () => {
      it('should succeed', () => {
        const spy1 = sinon.spy().named('spy1');
        const spy2 = sinon.spy().named('spy2');
        spy1(123);
        return expect([spy1, spy2], 'to have all calls satisfying', {
          spy: spy1,
          args: [123]
        });
      });

      it('should fail with a diff', () => {
        const sandbox = sinon.createSandbox();
        const spy1 = sandbox.spy().named('spy1');
        const spy2 = sandbox.spy().named('spy2');
        spy1(123);
        spy2(456);
        return expect(
          () => expect([spy1, spy2], 'to have all calls satisfying', {
            spy: spy1,
            args: [123]
          }),
          'to error with',
          'expected [ spy1, spy2 ] to have all calls satisfying { spy: spy1, args: [ 123 ] }\n' +
            '\n' +
            'spy1( 123 ); at theFunction (theFileName:xx:yy)\n' +
            'spy2( 456 ); at theFunction (theFileName:xx:yy) // should be spy1( 123 );'
        );
      });
    });
  });

  describe('to have calls satisfying', () => {
    it('should complain if the args value is passed as an object with non-numerical properties', () => {
      spy(123);
      expect(
        () => {
          expect(spy, 'to have calls satisfying', [{ args: { foo: 123 } }]);
        },
        'to throw',
        'expected spy1 to have calls satisfying [ { args: { foo: 123 } } ]\n' +
          '\n' +
          'spy1( 123 ); at theFunction (theFileName:xx:yy) // unsupported value in spy call spec: { foo: 123 }'
      );
    });

    it('should render a swapped expected call sensibly', () => {
      const spy1 = sinon.spy().named('spy1');
      const spy2 = sinon.spy().named('spy2');
      const spy3 = sinon.spy().named('spy3');
      spy1(123);
      spy2(456);
      spy3(789);
      expect(
        () => {
          expect([spy1, spy2, spy3], 'to have calls satisfying', () => {
            spy1(123);
            spy3(789);
            spy2(456);
          });
        },
        'to throw',
        'expected [ spy1, spy2, spy3 ] to have calls satisfying\n' +
          'spy1( 123 );\n' +
          'spy3( 789 );\n' +
          'spy2( 456 );\n' +
          '\n' +
          '    spy1( 123 ); at theFunction (theFileName:xx:yy)\n' +
          '┌─▷\n' +
          '│   spy2( 456 ); at theFunction (theFileName:xx:yy)\n' +
          '└── spy3( 789 ); at theFunction (theFileName:xx:yy) // should be moved'
      );
    });

    it('should render a swapped actual function call sensibly', () => {
      const spy1 = sinon.spy().named('spy1');
      const spy2 = sinon.spy().named('spy2');
      const spy3 = sinon.spy().named('spy3');
      spy1(123);
      spy3(789);
      spy2(456);
      expect(
        () => {
          expect([spy1, spy2, spy3], 'to have calls satisfying', () => {
            spy1(123);
            spy2(456);
            spy3(789);
          });
        },
        'to throw',
        'expected [ spy1, spy2, spy3 ] to have calls satisfying\n' +
          'spy1( 123 );\n' +
          'spy2( 456 );\n' +
          'spy3( 789 );\n' +
          '\n' +
          '    spy1( 123 ); at theFunction (theFileName:xx:yy)\n' +
          '┌─▷\n' +
          '│   spy3( 789 ); at theFunction (theFileName:xx:yy)\n' +
          '└── spy2( 456 ); at theFunction (theFileName:xx:yy) // should be moved'
      );
    });

    it('should render the wrong spy being called with no expectation for the arguments', () => {
      const spy1 = sinon.spy().named('spy1');
      const spy2 = sinon.spy().named('spy2');
      spy1(123);
      expect(
        () => {
          expect([spy1, spy2], 'to have calls satisfying', [{ spy: spy2 }]);
        },
        'to throw',
        'expected [ spy1, spy2 ] to have calls satisfying [ { spy: spy2 } ]\n' +
          '\n' +
          'spy1( 123 ); at theFunction (theFileName:xx:yy) // should be spy2'
      );
    });

    it('should satisfy against a list of all calls to the specified spies', () => {
      const spy2 = sinon.spy(function spy2() {
        return 'blah';
      });

      const obj = {
        die() {
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
      expect(
        () => {
          expect([spy, spy2, obj.die], 'to have calls satisfying', [
            spy,
            { spy: spy2, args: ['quux'], returned: 'yadda' },
            { spy: obj.die, threw: /cqwecqw/ },
            { spy, args: ['yadda'] },
            spy,
            spy
          ]);
        },
        'to throw',
        'expected [ spy1, spy2, die ] to have calls satisfying\n' +
          '[\n' +
          '  spy1,\n' +
          "  { spy: spy2, args: [ 'quux' ], returned: 'yadda' },\n" +
          '  { spy: die, threw: /cqwecqw/ },\n' +
          "  { spy: spy1, args: [ 'yadda' ] },\n" +
          '  spy1,\n' +
          '  spy1\n' +
          ']\n' +
          '\n' +
          "    spy1( 'foo', 'bar' ); at theFunction (theFileName:xx:yy)\n" +
          "    spy2( 'quux' ); at theFunction (theFileName:xx:yy) // returned: expected 'blah' to equal 'yadda'\n" +
          '                                                       //\n' +
          '                                                       //           -blah\n' +
          '                                                       //           +yadda\n' +
          '    // missing { spy: die, threw: /cqwecqw/ }\n' +
          '┌─▷\n' +
          '│   die(); at theFunction (theFileName:xx:yy) // should be removed\n' +
          "│   spy1( 'baz' ); at theFunction (theFileName:xx:yy)\n" +
          "└── spy2( 'yadda' ); at theFunction (theFileName:xx:yy) // should be moved\n" +
          "    spy1( 'baz' ); at theFunction (theFileName:xx:yy)"
      );
    });

    describe('when passed a sinon stub instance as the subject', () => {
      it('should succeed', () => {
        const stubInstance = sinon.createStubInstance(MyClass);
        stubInstance.foo(123);
        stubInstance.bar(456);
        stubInstance.foo(789);
        return expect(stubInstance, 'to have calls satisfying', () => {
          stubInstance.foo(123);
          stubInstance.bar(456);
          stubInstance.foo(789);
        });
      });

      it('should fail with a diff', () => {
        const stubInstance = sinon.createStubInstance(MyClass);
        stubInstance.foo(123);
        stubInstance.bar(456);
        stubInstance.foo(123);
        return expect(
          () => expect(stubInstance, 'to have calls satisfying', () => {
            stubInstance.foo(123);
            stubInstance.bar(123);
            stubInstance.foo(123);
          }),
          'to error with',
          'expected MyClass({ foo, bar }) to have calls satisfying\n' +
            'foo( 123 );\n' +
            'bar( 123 );\n' +
            'foo( 123 );\n' +
            '\n' +
            'foo( 123 ); at theFunction (theFileName:xx:yy)\n' +
            'bar(\n' +
            '  456 // should equal 123\n' +
            '); at theFunction (theFileName:xx:yy)\n' +
            'foo( 123 ); at theFunction (theFileName:xx:yy)'
        );
      });
    });

    describe('when passed an array entry (shorthand for {args: ...})', () => {
      it('should succeed', () => {
        spy(123, { foo: 'bar' });
        expect(spy, 'to have calls satisfying', [[123, { foo: 'bar' }]]);
      });

      it('should fail with a diff', () => {
        expect(
          () => {
            spy(123, { foo: 'bar' });
            expect(spy, 'to have calls satisfying', [[123, { foo: 'baz' }]]);
          },
          'to throw',
          "expected spy1 to have calls satisfying [ [ 123, { foo: 'baz' } ] ]\n" +
            '\n' +
            'spy1(\n' +
            '  123,\n' +
            '  {\n' +
            "    foo: 'bar' // should equal 'baz'\n" +
            '               //\n' +
            '               // -bar\n' +
            '               // +baz\n' +
            '  }\n' +
            '); at theFunction (theFileName:xx:yy)'
        );
      });

      describe('when passed a sinon sandbox as the subject', () => {
        it('should succeed', () => {
          const sandbox = sinon.createSandbox();
          const spy1 = sandbox.spy().named('spy1');
          const spy2 = sandbox.spy().named('spy2');
          spy1(123);
          spy2(456);
          return expect(sandbox, 'to have calls satisfying', [
            { spy: spy1, args: [123] },
            { spy: spy2, args: [456] }
          ]);
        });

        it('should fail with a diff', () => {
          const sandbox = sinon.createSandbox();
          const spy1 = sandbox.spy().named('spy1');
          const spy2 = sandbox.spy().named('spy2');
          spy1(123);
          spy2(456);
          return expect(
            () => expect(sandbox, 'to have calls satisfying', [
              { spy: spy1, args: [123] },
              { spy: spy2, args: [789] }
            ]),
            'to error with',
            'expected sinon sandbox to have calls satisfying [ { spy: spy1, args: [ 123 ] }, { spy: spy2, args: [ 789 ] } ]\n' +
              '\n' +
              'spy1( 123 ); at theFunction (theFileName:xx:yy)\n' +
              'spy2(\n' +
              '  456 // should equal 789\n' +
              '); at theFunction (theFileName:xx:yy)'
          );
        });
      });
    });

    describe('when passed an array with only numerical properties (shorthand for {args: ...})', () => {
      it('should succeed', () => {
        spy(123, { foo: 'bar' });
        expect(spy, 'to have calls satisfying', [
          { 0: 123, 1: { foo: 'bar' } }
        ]);
      });

      it('should fail with a diff', () => {
        expect(
          () => {
            spy(123, { foo: 'bar' });
            expect(spy, 'to have calls satisfying', [
              { 0: 123, 1: { foo: 'baz' } }
            ]);
          },
          'to throw',
          "expected spy1 to have calls satisfying [ { 0: 123, 1: { foo: 'baz' } } ]\n" +
            '\n' +
            'spy1(\n' +
            '  123,\n' +
            '  {\n' +
            "    foo: 'bar' // should equal 'baz'\n" +
            '               //\n' +
            '               // -bar\n' +
            '               // +baz\n' +
            '  }\n' +
            '); at theFunction (theFileName:xx:yy)'
        );
      });
    });

    it('should complain if the spy list does not contain a spy that is contained by the spec', () => {
      const spy2 = sinon.spy(function spy2() {
        return 'blah';
      });
      spy2.displayName = 'spy2';
      expect(
        () => {
          expect([spy], 'to have calls satisfying', [spy, spy2]);
        },
        'to throw',
        'expected [ spy1 ] to have calls satisfying [ spy1, spy2 ]\n' +
          '  expected [ spy1 ] to contain spy2'
      );
    });

    it('should complain if a spy call spec contains an unsupported type', () => {
      expect(
        () => {
          expect(spy, 'to have calls satisfying', [123]);
        },
        'to throw',
        'expected spy1 to have calls satisfying [ 123 ]\n' +
          '  unsupported value in spy call spec: 123'
      );
    });

    describe('with the exhaustively flag', () => {
      it('should fail if an object parameter contains additional properties', () => {
        spy({ foo: 123 }, [{ bar: 'quux' }]);
        return expect(
          () => {
            expect(spy, 'to have calls exhaustively satisfying', [
              { args: [{}, [{}]] }
            ]);
          },
          'to throw',
          'expected spy1 to have calls exhaustively satisfying [ { args: [ ..., ... ] } ]\n' +
            '\n' +
            'spy1(\n' +
            '  {\n' +
            '    foo: 123 // should be removed\n' +
            '  },\n' +
            '  [\n' +
            '    {\n' +
            "      bar: 'quux' // should be removed\n" +
            '    }\n' +
            '  ]\n' +
            '); at theFunction (theFileName:xx:yy)'
        );
      });
    });

    describe('when providing the expected calls as a function', () => {
      it('should succeed', () => {
        const spy2 = sinon.spy().named('spy2');
        spy2(123, 456);
        new spy('abc', false); // eslint-disable-line no-new, new-cap
        spy(-99, Infinity);

        expect([spy, spy2], 'to have calls satisfying', () => {
          spy2(123, 456);
          new spy('abc', false); // eslint-disable-line no-new, new-cap
          spy(-99, Infinity);
        });
        expect(spy.args, 'to have length', 2);
        expect(spy.callCount, 'to equal', 2);
      });

      it('should fail with a diff', () => {
        const spy2 = sinon.spy().named('spy2');
        spy2(123, 456, 99);
        spy('abc', true);
        new spy(-99, Infinity); // eslint-disable-line no-new, new-cap

        expect(
          () => {
            expect([spy, spy2], 'to have calls satisfying', () => {
              spy2(123, 456);
              new spy('abc', false); // eslint-disable-line no-new, new-cap
              spy(-99, Infinity);
            });
          },
          'to throw',
          'expected [ spy1, spy2 ] to have calls satisfying\n' +
            'spy2( 123, 456 );\n' +
            "new spy1( 'abc', false );\n" +
            'spy1( -99, Infinity );\n' +
            '\n' +
            'spy2(\n' +
            '  123,\n' +
            '  456,\n' +
            '  99 // should be removed\n' +
            '); at theFunction (theFileName:xx:yy)\n' +
            'spy1(\n' +
            "  'abc',\n" +
            '  true // should equal false\n' +
            '); at theFunction (theFileName:xx:yy) // calledWithNew: expected false to equal true\n' +
            'new spy1( -99, Infinity ); at theFunction (theFileName:xx:yy) // calledWithNew: expected true to equal false'
        );
      });

      describe('when passed a sinon sandbox as the subject', () => {
        it('should succeed', () => {
          const sandbox = sinon.createSandbox();
          const spy1 = sandbox.spy().named('spy1');
          const spy2 = sandbox.spy().named('spy2');
          spy1(123);
          spy2(456);
          return expect(sandbox, 'to have calls satisfying', () => {
            spy1(123);
            spy2(456);
          });
        });

        it('should fail with a diff', () => {
          const sandbox = sinon.createSandbox();
          const spy1 = sandbox.spy().named('spy1');
          const spy2 = sandbox.spy().named('spy2');
          spy1(123);
          spy2(456);
          return expect(
            () => expect(sandbox, 'to have calls satisfying', () => {
              spy1(123);
              spy2(789);
            }),
            'to error with',
            'expected sinon sandbox to have calls satisfying\n' +
              'spy1( 123 );\n' +
              'spy2( 789 );\n' +
              '\n' +
              'spy1( 123 ); at theFunction (theFileName:xx:yy)\n' +
              'spy2(\n' +
              '  456 // should equal 789\n' +
              '); at theFunction (theFileName:xx:yy)'
          );
        });
      });

      it('should render a spy call missing at the end', () => {
        spy('abc', true);

        expect(
          () => {
            expect(spy, 'to have calls satisfying', () => {
              spy('abc', true);
              spy('def', false);
            });
          },
          'to throw',
          'expected spy1 to have calls satisfying\n' +
            "spy1( 'abc', true );\n" +
            "spy1( 'def', false );\n" +
            '\n' +
            "spy1( 'abc', true ); at theFunction (theFileName:xx:yy)\n" +
            "// missing spy1( 'def', false );"
        );
      });

      it('should render a spy call missing at the beginning', () => {
        spy('abc', true);

        expect(
          () => {
            expect(spy, 'to have calls satisfying', () => {
              spy('def', false);
              spy('abc', true);
            });
          },
          'to throw',
          'expected spy1 to have calls satisfying\n' +
            "spy1( 'def', false );\n" +
            "spy1( 'abc', true );\n" +
            '\n' +
            "// missing spy1( 'def', false );\n" +
            "spy1( 'abc', true ); at theFunction (theFileName:xx:yy)"
        );
      });

      it('should render a spy call missing in the middle', () => {
        spy(123, 456);
        spy(234);
        spy(987);

        expect(
          () => {
            expect(spy, 'to have calls satisfying', () => {
              spy(123, 456);
              spy(false);
              spy(234);
              spy(987);
            });
          },
          'to throw',
          'expected spy1 to have calls satisfying\n' +
            'spy1( 123, 456 );\n' +
            'spy1( false );\n' +
            'spy1( 234 );\n' +
            'spy1( 987 );\n' +
            '\n' +
            'spy1( 123, 456 ); at theFunction (theFileName:xx:yy)\n' +
            '// missing spy1( false );\n' +
            'spy1( 234 ); at theFunction (theFileName:xx:yy)\n' +
            'spy1( 987 ); at theFunction (theFileName:xx:yy)'
        );
      });

      it('should render the minimal diff when a structurally similar spy call is followed by an extraneous one', () => {
        spy(123, 456);
        spy({ foo: 123 });
        spy(456);
        spy(987);

        expect(
          () => {
            expect(spy, 'to have calls satisfying', () => {
              spy(123, 456);
              spy({ foo: 456 });
              spy(987);
            });
          },
          'to throw',
          'expected spy1 to have calls satisfying\n' +
            'spy1( 123, 456 );\n' +
            'spy1( { foo: 456 } );\n' +
            'spy1( 987 );\n' +
            '\n' +
            'spy1( 123, 456 ); at theFunction (theFileName:xx:yy)\n' +
            'spy1(\n' +
            '  {\n' +
            '    foo: 123 // should equal 456\n' +
            '  }\n' +
            '); at theFunction (theFileName:xx:yy)\n' +
            'spy1( 456 ); at theFunction (theFileName:xx:yy) // should be removed\n' +
            'spy1( 987 ); at theFunction (theFileName:xx:yy)'
        );
      });

      it('should work with expect.it', () => {
        spy('abc', true);
        spy('abc', false, 123);

        expect(
          () => {
            expect(spy, 'to have calls satisfying', () => {
              spy('abc', expect.it('to be true'));
              spy(
                'abc',
                false,
                expect.it('to be a number').and('to be less than', 100)
              );
            });
          },
          'to throw',
          'expected spy1 to have calls satisfying\n' +
            "spy1( 'abc', expect.it('to be true') );\n" +
            'spy1(\n' +
            "  'abc',\n" +
            '  false,\n' +
            "  expect.it('to be a number')\n" +
            "          .and('to be less than', 100)\n" +
            ');\n' +
            '\n' +
            "spy1( 'abc', true ); at theFunction (theFileName:xx:yy)\n" +
            'spy1(\n' +
            "  'abc',\n" +
            '  false,\n' +
            '  123 // ✓ should be a number and\n' +
            '      // ⨯ should be less than 100\n' +
            '); at theFunction (theFileName:xx:yy)'
        );
      });

      it('should not break while recording when the spied-upon function has side effects', () => {
        const throwingSpy = sinon.spy(() => {
          throw new Error('Urgh');
        });
        expect(throwingSpy, 'to throw');
        expect(throwingSpy, 'to throw');

        return expect(throwingSpy, 'to have calls satisfying', () => {
          throwingSpy();
          throwingSpy();
        }).then(() => {
          expect(throwingSpy, 'was called twice');
        });
      });

      it('should render the correct diff when the expected spy calls consist of a single entry', () => expect(
        () => expect(spy, 'to have calls satisfying', () => {
          spy(123);
        }),
        'to throw',
        'expected spy1 to have calls satisfying spy1( 123 );\n' +
          '\n' +
          '// missing spy1( 123 );'
      ));
    });

    describe('when asserting whether a call was invoked with the new operator', () => {
      it('should succeed', () => {
        new spy(); // eslint-disable-line no-new, new-cap
        spy();
        expect(spy, 'to have calls satisfying', [
          { calledWithNew: true },
          { calledWithNew: false }
        ]);
      });

      it('should fail with a diff', () => {
        new spy(); // eslint-disable-line no-new, new-cap
        spy();
        expect(
          () => {
            expect(spy, 'to have calls satisfying', [
              { calledWithNew: false },
              { calledWithNew: true }
            ]);
          },
          'to throw',
          'expected spy1 to have calls satisfying [ { calledWithNew: false }, { calledWithNew: true } ]\n' +
            '\n' +
            '┌─▷\n' +
            '│   new spy1(); at theFunction (theFileName:xx:yy)\n' +
            '└── spy1(); at theFunction (theFileName:xx:yy) // should be moved'
        );
      });
    });
  });

  describe('spyCall type', () => {
    describe('to satisfy', () => {
      describe('with an object with only numerical properties', () => {
        it('should succeed', () => {
          spy(123);
          spy(456);
          expect(spy.lastCall, 'to satisfy', { 0: 456 });
        });

        it('should fail with a diff', () => {
          spy(123);
          spy(456);
          expect(
            () => {
              expect(spy.lastCall, 'to satisfy', { 0: 789 });
            },
            'to throw',
            'expected spy1( 456 ); at theFunction (theFileName:xx:yy) to satisfy { 0: 789 }\n' +
              '\n' +
              'spy1(\n' +
              '  456 // should equal 789\n' +
              '); at theFunction (theFileName:xx:yy)'
          );
        });
      });

      describe('with an array', () => {
        it('should succeed', () => {
          spy(123);
          spy(456);
          expect(spy.lastCall, 'to satisfy', [456]);
        });

        it('should fail with a diff', () => {
          spy(123);
          spy(456);
          expect(
            () => {
              expect(spy.lastCall, 'to satisfy', [789]);
            },
            'to throw',
            'expected spy1( 456 ); at theFunction (theFileName:xx:yy) to satisfy [ 789 ]\n' +
              '\n' +
              'spy1(\n' +
              '  456 // should equal 789\n' +
              '); at theFunction (theFileName:xx:yy)'
          );
        });
      });

      describe('with an object', () => {
        it('should succeed', () => {
          spy(123);
          spy(456);
          expect(spy.lastCall, 'to satisfy', { args: [456] });
        });

        it('should fail with a diff', () => {
          spy(123);
          spy(456);
          expect(
            () => {
              expect(spy.lastCall, 'to satisfy', { args: [789] });
            },
            'to throw',
            'expected spy1( 456 ); at theFunction (theFileName:xx:yy) to satisfy { args: [ 789 ] }\n' +
              '\n' +
              'spy1(\n' +
              '  456 // should equal 789\n' +
              '); at theFunction (theFileName:xx:yy)'
          );
        });
      });
    });
  });

  // Regression test for an issue reported by Gert Sønderby in the Unexpected gitter channel:
  if (
    typeof navigator === 'undefined' ||
    !/phantom/i.test(navigator.userAgent)
  ) {
    it('should avoid retrieving a property of undefined in the similar function', () => {
      spy(123);
      spy(() => ({
        then(fn) {
          setImmediate(fn);
        }
      }));

      return expect(
        () => expect(spy, 'to have calls satisfying', [
          { args: [expect.it('when called with', [], 'to be fulfilled')] }
        ]),
        'to error',
        "expected spy1 to have calls satisfying [ { args: [ expect.it('when called with', ..., 'to be fulfilled') ] } ]\n" +
          '\n' +
          'spy1( 123 ); at theFunction (theFileName:xx:yy) // should be removed\n' +
          'spy1(\n' +
          '  function () {\n' +
          '    return {\n' +
          '      then: function(fn) {\n' +
          '        setImmediate(fn);\n' +
          '      }\n' +
          '    };\n' +
          '  }\n' +
          '); at theFunction (theFileName:xx:yy)'
      );
    });
  }

  // Regression test for #38
  it('should work with bounded functions', () => {
    const obj = { method() {} };
    obj.method = obj.method.bind(obj);
    sinon.spy(obj, 'method');
    obj.method();
    expect(
      () => {
        expect(obj.method, 'was called times', 2);
      },
      'to throw',
      'expected method was called times 2\n' +
        '  expected method(); at theFunction (theFileName:xx:yy) to have length 2\n' +
        '    expected 1 to be 2'
    );
  });

  // Regression test for:
  // Function has non-object prototype 'undefined' in instanceof check
  describe('when spying on console methods', () => {
    beforeEach(() => {
      sinon.spy(console, 'error');
    });

    afterEach(() => {
      console.error.restore();
    });

    it('should not fail when spying on console methods', () => {
      expect(console.error, 'to have no calls satisfying', () => {
        console.error('hey');
      });
    });
  });

  // Regression test for:
  // Function has non-object prototype 'undefined' in instanceof check
  describe('when spying on a bound function', () => {
    it('should not fail when spying on console methods', () => {
      const foo = { bar: (() => {}).bind({}) }; // eslint-disable-line no-extra-bind
      sinon.spy(foo, 'bar');
      expect(foo.bar, 'to have no calls satisfying', () => {
        foo.bar('hey');
      });
    });
  });
});
