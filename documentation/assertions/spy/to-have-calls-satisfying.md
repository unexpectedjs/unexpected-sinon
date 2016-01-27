Passes if all the calls of a spy [satisfy](http://unexpected.js.org/assertions/any/to-satisfy/) a given spec:

```js
var increment = sinon.spy(function increment(n) {
    return n + 1;
});
increment(42);
increment(46);
expect(increment, 'to have calls satisfying', [
    { args: [ 42 ] },
    { args: [ 46 ], returned: 47 }
]);
```

In case of a failing expectation you get the following output:

```js
var increment = sinon.spy().named('increment');
increment(42);
increment(46, 'yadda');

expect(increment, 'to have calls satisfying', [
    { args: [ 42 ] },
    { args: [ 20 ] }
]);
```

```output
expected increment to have calls satisfying [ { args: [ 42 ] }, { args: [ 20 ] } ]

increment( 42 ); at theFunction (theFileName:xx:yy)
increment(
  46, // should equal 20
  'yadda' // should be removed
); at theFunction (theFileName:xx:yy)
```

An array value will be interpreted as a shorthand for `{ args: ... }`:

```js
expect(increment, 'to have calls satisfying', [
    [ 42 ],
    [ 46, 'yadda' ]
]);
```

Likewise for an object with only numerical properties:

```js
expect(increment, 'to have calls satisfying', [
    { 0: 42 },
    { 1: 'yadda' }
]);
```

Note that the individual arguments are matched with
[`to satisfy`](http://unexpected.js.org/assertions/any/to-satisfy/)
semantics, which means that objects are allowed to have more properties than you
specify, so the following passes:

```js
var mySpy = sinon.spy().named('mySpy');
mySpy({foo: 123, bar: 456});
expect(mySpy, 'to have calls satisfying', [
    { args: [ { foo: 123 } ] }
]);
```

If that's not what you want, consider using the `exhaustively` flag:

```js
expect(mySpy, 'to have calls exhaustively satisfying', [
    { args: [ { foo: 123 } ] }
]);
```

```output
expected mySpy to have calls exhaustively satisfying [ { args: [ ... ] } ]

mySpy(
  {
    foo: 123,
    bar: 456 // should be removed
  }
); at theFunction (theFileName:xx:yy)
```

You can also specify expected calls as a function that performs them:

```js
var increment = sinon.spy().named('increment');
increment(1);
increment(2);
increment(3);

expect(increment, 'to have calls satisfying', function () {
    increment(1);
    increment(expect.it('to be a number'));
});
```

```output
expected increment to have calls satisfying
increment( 1 );
increment( expect.it('to be a number') );

increment( 1 ); at theFunction (theFileName:xx:yy)
increment( 2 ); at theFunction (theFileName:xx:yy)
increment( 3 ); at theFunction (theFileName:xx:yy) // should be removed
```
