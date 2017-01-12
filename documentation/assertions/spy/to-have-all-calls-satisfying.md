Passes if all calls to a spy [satisfy](http://unexpected.js.org/assertions/any/to-satisfy/) a given spec.
Also, the spy must have been called at least once for the assertion to pass.
Compare with the [to have a call satisfying](../to-have-a-call-satisfying/),
which only requires one call to satisfying the expectation.

```js
var increment = sinon.spy(function increment(n) {
    return n + 1;
});
increment(42);
increment(42);
expect(increment, 'to have all calls satisfying', { args: [ 42 ], returnValue: 43 });
```

In case of a failing expectation you get the following output:

```js
var quux = sinon.spy().named('quux');
quux('foo', 456);
quux(123, 456);

expect(quux, 'to have all calls satisfying', { args: [ 'foo', 456 ] });
```

```output
expected quux to have all calls satisfying { args: [ 'foo', 456 ] }

quux( 'foo', 456 ); at theFunction (theFileName:xx:yy)
quux(
  123, // should equal 'foo'
  456
); at theFunction (theFileName:xx:yy)
```

An array value will be interpreted as a shorthand for `{ args: ... }`:

```js
var baz = sinon.spy().named('baz');
baz(123, 456);

expect(baz, 'to have all calls satisfying', [ 123, 456 ]);
```

Likewise for an object with only numerical properties:

```js
expect(baz, 'to have a call satisfying', { 1: 456 });
```

Note that the individual arguments are matched with
[`to satisfy`](http://unexpected.js.org/assertions/any/to-satisfy/)
semantics, which means that objects are allowed to have more properties than you
specify, so the following passes:

```js
var mySpy = sinon.spy().named('mySpy');
mySpy({foo: 123, bar: 456});
mySpy({foo: 123, baz: 789});
expect(mySpy, 'to have all calls satisfying', { args: [ { foo: 123 } ] });
```

If that's not what you want, consider using the `exhaustively` flag:

```js
expect(mySpy, 'to have all calls exhaustively satisfying', { args: [ { foo: 123 } ] });
```

```output
expected mySpy to have all calls exhaustively satisfying { args: [ { foo: 123 } ] }

mySpy(
  {
    foo: 123,
    bar: 456 // should be removed
  }
); at theFunction (theFileName:xx:yy)
mySpy(
  {
    foo: 123,
    baz: 789 // should be removed
  }
); at theFunction (theFileName:xx:yy)
```

You can also specify the expected call as a function that performs it:

```js
var foo = sinon.spy().named('foo');
foo(1);
foo(2);

expect(foo, 'to have all calls satisfying', function () {
    foo(1);
});
```

```output
expected foo to have all calls satisfying foo( 1 );

foo( 1 ); at theFunction (theFileName:xx:yy)
foo(
  2 // should equal 1
); at theFunction (theFileName:xx:yy)
```
