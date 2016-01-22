Passes if a certain `spyCall` satisfies a given spec:

```js
var decrement = sinon.spy(function decrement(n) {
    return n - 1;
});

decrement(42);
decrement(46);

expect(decrement.firstCall, 'to satisfy', { args: [ 42 ], returned: 41 });
```

In case of a failing expectation you get the following output:

```js
var decrement = sinon.spy(function decrement(n) {
    return n - 1;
}).named('decrement');

decrement(20);
decrement(200);
decrement(2000);

expect(decrement.secondCall, 'to satisfy', { args: [ 20 ] });
```

```output
expected decrement( 200 ); at theFunction (theFileName:xx:yy)
to satisfy { args: [ 20 ] }

decrement(
  200 // should equal 20
); at theFunction (theFileName:xx:yy)
```

All the semantics of [to satisfy](http://unexpected.js.org/assertions/any/to-satisfy/)
are supported. For example:

```js
var getRandomPrefixedInteger = sinon.spy(function getRandomPrefixedInteger() {
    return 'prefix-' + parseInt(Math.random() * 10, 10);
});

getRandomPrefixedInteger();
getRandomPrefixedInteger();
getRandomPrefixedInteger();

expect(getRandomPrefixedInteger.getCall(0), 'to satisfy', {
    returned: expect.it('to be a string').and('to match', /^prefix-[0-9]$/)
});
```

This assertion is used internally by [to have calls satisfying](../../spy/to-have-calls-satisfying/).
Even though in some cases one would need to test specific function calls, for
better code coverage it's recommended to use that assertion instead.
