Passes if a spy has at least one call [satisfying](http://unexpected.js.org/assertions/any/to-satisfy/) a given spec:

```js
var increment = sinon.spy(function increment(n) {
    return n + 1;
});
increment(42);
increment(46);
expect(increment, 'to have a call satisfying', { args: [ 42 ], returnValue: 43 });
```

In case of a failing expectation you get the following output:

```js
var quux = sinon.spy().named('quux');
quux(123, 456);

expect(quux, 'to have a call satisfying', { args: [ 'foo', 456 ] });
```

```output
expected quux to have a call satisfying { args: [ 'foo', 456 ] }

quux(
  123, // should equal 'foo'
  456
); at theFunction (theFileName:xx:yy)
```

An array value will be interpreted as a shorthand for `{ args: ... }`:

```js
expect(quux, 'to have a call satisfying', [ 123, 456 ]);
```

Likewise for an object with only numerical properties:

```js
expect(quux, 'to have a call satisfying', { 1: 456 });
```

Note that the individual arguments are matched with
[`to satisfy`](http://unexpected.js.org/assertions/any/to-satisfy/)
semantics, which means that objects are allowed to have more properties than you
specify, so the following passes:

```js
var mySpy = sinon.spy().named('mySpy');
mySpy({foo: 123, bar: 456});
expect(mySpy, 'to have a call satisfying', { args: [ { foo: 123 } ] });
```

If that's not what you want, consider using the `exhaustively` flag:

```js
expect(mySpy, 'to have a call exhaustively satisfying', { args: [ { foo: 123 } ] });
```

```output
expected mySpy to have a call exhaustively satisfying { args: [ { foo: 123 } ] }

mySpy(
  {
    foo: 123,
    bar: 456 // should be removed
  }
); at theFunction (theFileName:xx:yy)
```

You can also specify the expected call as a function that performs it:

```js
var foo = sinon.spy().named('foo');
foo(1);
foo(2);

expect(foo, 'to have a call satisfying', function () {
    foo(3);
});
```

The diff will show what it would take to get every spy call to meet the spec,
even though fixing just one of them would be sufficient to make the assertion pass:

```output
expected foo to have a call satisfying foo( 3 );

foo(
  1 // should equal 3
); at theFunction (theFileName:xx:yy)
foo(
  2 // should equal 3
); at theFunction (theFileName:xx:yy)
```
