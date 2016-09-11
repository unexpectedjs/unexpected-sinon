Passes if the provided spies where called in the specified order.

```js
var obj = {
    foo: function () { return 'foo'; },
    bar: function () { return 'bar'; },
    baz: function () { return 'baz'; }
};
sinon.spy(obj, 'foo');
sinon.spy(obj, 'bar');
sinon.spy(obj, 'baz');
obj.foo();
obj.bar();
obj.baz();
expect([obj.foo, obj.bar, obj.baz], 'given call order');
```

In case of a failing expectation you get the following output:

```js
expect([obj.bar, obj.foo, obj.baz], 'given call order');
```

```output
expected [ bar, foo, baz ] given call order

┌─▷
│   foo(); at theFunction (theFileName:xx:yy)
└── bar(); at theFunction (theFileName:xx:yy) // should be moved
    baz(); at theFunction (theFileName:xx:yy)
```

NOTE: This assertion has slightly different semantics from Sinon.js' own
built-in [callOrder](http://sinonjs.org/docs/#assertions) assertion, which
is a bit loose a when a spy/stub has been called multiple times, especially
if the calls are interleaved with calls to the other spies.

This assertion supports listing the same spy multiple times, which then
asserts that the spy was called multiple times:

```js
var spy1 = sinon.spy().named('spy1');
var spy2 = sinon.spy().named('spy2');
spy1();
spy2();
spy1();

expect([spy1, spy2, spy2], 'given call order');
```

```output
expected [ spy1, spy2, spy2 ] given call order

spy1(); at theFunction (theFileName:xx:yy)
spy2(); at theFunction (theFileName:xx:yy)
spy1(); at theFunction (theFileName:xx:yy) // should be spy2
```
