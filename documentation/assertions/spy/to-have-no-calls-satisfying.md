Passes if none of the calls to a spy [satisfy](http://unexpected.js.org/assertions/any/to-satisfy/) a given spec:

```js
var increment = sinon.spy(function increment(n) {
    return n + 1;
});
increment(42);
increment(46);
expect(increment, 'to have no calls satisfying', { args: [ 43 ], returnValue: 44 });
```

In case of a failing expectation you get the following output:

```js
var quux = sinon.spy().named('quux');
quux(789);
quux(123, 456);

expect(quux, 'to have no calls satisfying', { args: [ 123, 456 ] });
```

```output
expected quux to have no calls satisfying { args: [ 123, 456 ] }

quux( 789 ); at theFunction (theFileName:xx:yy)
quux( 123, 456 ); at theFunction (theFileName:xx:yy) // should be removed
```

An array value will be interpreted as a shorthand for `{ args: ... }`:

```js
expect(quux, 'to have no calls satisfying', [ 123 ]);
```

Likewise for an object with only numerical properties:

```js
expect(quux, 'to have no calls satisfying', { 1: 789 });
```

Note that the individual parameters are matched with
[`to satisfy`](http://unexpected.js.org/assertions/any/to-satisfy/)
semantics, so the following fails despite the actual call
also had a `bar` property in the object passed as the first
parameter:

```js
var mySpy = sinon.spy().named('mySpy');
mySpy({foo: 123, bar: 456});
expect(mySpy, 'to have no calls satisfying', { args: [ { foo: 123 } ] });
```

```output
expected mySpy to have no calls satisfying { args: [ { foo: 123 } ] }

mySpy( { foo: 123, bar: 456 } ); at theFunction (theFileName:xx:yy) // should be removed
```

If that's not what you want, consider using the `exhaustively` flag. Then
the assertion passes because none of the calls matched exhaustively:

```js
expect(mySpy, 'to have no calls exhaustively satisfying', { args: [ { foo: 123 } ] });
```

You can also specify the expected call as a function that performs it:

```js
var foo = sinon.spy().named('foo');
foo(1);
foo(2);

expect(foo, 'to have no calls satisfying', function () {
    foo(1);
});
```

```output
expected foo to have no calls satisfying foo( 1 );

foo( 1 ); at theFunction (theFileName:xx:yy) // should be removed
foo( 2 ); at theFunction (theFileName:xx:yy)
```
